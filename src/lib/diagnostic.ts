/**
 * 10-question IRT 2-PL adaptive diagnostic.
 *
 * Spec §6: "10 questions across the 23 capabilities, IRT 2-PL item bank,
 * adaptive. Output: per-capability mastery 0–1 + recommended 4-week plan."
 *
 * Math:
 *   P(correct | θ, a, b) = 1 / (1 + exp(-a * (θ - b)))
 *   where θ is ability, a is item discrimination, b is item difficulty.
 *
 * Engine:
 *   - Start with θ = 0 (median ability).
 *   - At each step, pick the item with the maximum Fisher information at
 *     current θ that hasn't been administered AND covers a capability we
 *     haven't probed yet (subject to availability — duplicates allowed once
 *     all capabilities have been touched).
 *   - After each response, update θ by one Newton-Raphson step (MLE), with
 *     a small ridge to keep the estimator stable on streaks.
 *   - After 10 items, output θ → per-capability mastery via the logistic
 *     curve evaluated against each capability's mean difficulty.
 */

import type { DiagItem } from '@/data/diagnostic-items';

export interface DiagResponse {
  itemId: string;
  capability: string;
  correct: boolean;
  /** Item discrimination at the time of administration (snapshotted for the MLE replay). */
  a: number;
  /** Item difficulty at the time of administration. */
  b: number;
}

export interface DiagState {
  theta: number;
  /** Standard error of θ from observed Fisher info. Shrinks as items accumulate. */
  se: number;
  responses: DiagResponse[];
  administered: string[];
}

/** Probability of correct given ability θ and item (a,b). */
export function p(theta: number, a: number, b: number): number {
  return 1 / (1 + Math.exp(-a * (theta - b)));
}

/** Fisher information for a 2PL item at θ. */
export function info(theta: number, a: number, b: number): number {
  const pi = p(theta, a, b);
  return a * a * pi * (1 - pi);
}

export function initialState(): DiagState {
  return { theta: 0, se: 1.5, responses: [], administered: [] };
}

/**
 * Pick the next item from the bank. Strategy:
 *  1. Prefer items whose capability is uncovered so far (breadth first).
 *  2. Among the candidates, pick the one with the largest Fisher info at θ.
 *  3. Never re-administer an item.
 *  4. Once all 23 capabilities are touched, fall back to pure-info maximisation.
 */
export function pickNext(state: DiagState, bank: DiagItem[]): DiagItem | null {
  const seen = new Set(state.administered);
  const covered = new Set(state.responses.map((r) => r.capability));
  const candidates = bank.filter((it) => !seen.has(it.id));
  if (candidates.length === 0) return null;

  const breadthFirst = candidates.filter((it) => !covered.has(it.capability));
  const pool = breadthFirst.length > 0 ? breadthFirst : candidates;

  let best = pool[0];
  let bestInfo = info(state.theta, best.a, best.b);
  for (let i = 1; i < pool.length; i++) {
    const it = pool[i];
    const inf = info(state.theta, it.a, it.b);
    if (inf > bestInfo) {
      best = it;
      bestInfo = inf;
    }
  }
  return best;
}

/**
 * Apply a response and update θ via one Newton-Raphson MLE step.
 * Ridge term keeps the step from running off when info is near zero.
 */
export function applyResponse(state: DiagState, item: DiagItem, correct: boolean): DiagState {
  const responses: DiagResponse[] = [
    ...state.responses,
    { itemId: item.id, capability: item.capability, correct, a: item.a, b: item.b },
  ];
  const administered = [...state.administered, item.id];

  // Newton-Raphson on log-likelihood with a mild ridge regulariser.
  let theta = state.theta;
  for (let iter = 0; iter < 8; iter++) {
    let grad = 0;
    let hess = 0;
    for (const r of responses) {
      const pi = p(theta, r.a, r.b);
      grad += r.a * ((r.correct ? 1 : 0) - pi);
      hess += -r.a * r.a * pi * (1 - pi);
    }
    // Ridge: pulls toward 0 with weight 0.25 — N(0,2) Bayes-like regulariser,
    // keeps the estimator from running away on all-correct or all-wrong streaks.
    grad += -0.25 * theta;
    hess += -0.25;
    const step = grad / hess;
    theta -= step;
    if (!Number.isFinite(theta)) {
      theta = state.theta;
      break;
    }
    if (Math.abs(step) < 1e-4) break;
  }

  // Clamp θ to a study-relevant range.
  theta = Math.max(-3, Math.min(3, theta));

  // SE from observed Fisher information.
  let fisher = 0;
  for (const r of responses) fisher += info(theta, r.a, r.b);
  const se = fisher > 0 ? 1 / Math.sqrt(fisher) : state.se;

  return { theta, se, responses, administered };
}

/**
 * Per-capability mastery in [0,1] given the final θ and the item bank.
 * Mastery = P(correct on a "median" item at that capability's mean difficulty).
 */
export function mastery(theta: number, bank: DiagItem[]): Record<string, number> {
  const byCap = new Map<string, DiagItem[]>();
  for (const it of bank) {
    if (!byCap.has(it.capability)) byCap.set(it.capability, []);
    byCap.get(it.capability)!.push(it);
  }
  const out: Record<string, number> = {};
  for (const [cap, items] of byCap) {
    const a = items.reduce((s, i) => s + i.a, 0) / items.length;
    const b = items.reduce((s, i) => s + i.b, 0) / items.length;
    out[cap] = p(theta, a, b);
  }
  return out;
}

/** Convert mastery into ranked weak-areas list for the study plan. */
export function rankWeakAreas(mastery: Record<string, number>): Array<{ capability: string; mastery: number }> {
  return Object.entries(mastery)
    .map(([capability, m]) => ({ capability, mastery: m }))
    .sort((a, b) => a.mastery - b.mastery);
}
