/**
 * Personal trend computations — the Stadium-League replacement.
 *
 * Spec §10 + Sprint 17 follow-up: "Replace the HarryK_9 fake leaderboard
 * with a personal trend board (best/topic, longest streak, biggest WoW gain)."
 *
 * Pure functions over the existing localStorage shapes (markerResults,
 * debrief results, attempts, streak). Caller passes data in, never
 * touches storage directly — keeps this unit-testable.
 */

import type { MarkerResult } from './formGuide';

export interface TrendInputs {
  marker: MarkerResult[];
  attempts: Array<{ id: string; startedAt: number; finishedAt: number | null; marks?: number }>;
  streak: { current: number; longest: number };
}

export interface TopicHigh {
  topicId: string;
  bestPct: number;
  bestPaperId: string;
  achievedAt: number;
  recentPct: number;
}

export interface TrendBoard {
  /** Up to 5 topics ranked by personal best mark. */
  topicHighs: TopicHigh[];
  /** Current and longest-ever consecutive-day streak. */
  streak: { current: number; longest: number };
  /** Fastest 25-mark answer (min finish-start delta where marks ≈ 25). */
  fastestDebrief25: { attemptId: string; minutes: number; finishedAt: number } | null;
  /** Best week-on-week improvement in mean marker pct (last 7d vs prior 7d). */
  weekOnWeek: { deltaPct: number; lastWeekMean: number; priorWeekMean: number; window: 'last-7-days' } | null;
  /** Total marker runs (sanity check / "form-guide ready" indicator). */
  totalRuns: number;
}

const DAY_MS = 86_400_000;
const WEEK_MS = 7 * DAY_MS;

export function computePersonalTrend(inputs: TrendInputs, now: number = Date.now()): TrendBoard {
  return {
    topicHighs: topicHighlights(inputs.marker),
    streak: inputs.streak,
    fastestDebrief25: fastestDebrief(inputs.attempts),
    weekOnWeek: weekOnWeek(inputs.marker, now),
    totalRuns: inputs.marker.length,
  };
}

function topicHighlights(marker: MarkerResult[]): TopicHigh[] {
  const byTopic = new Map<string, MarkerResult[]>();
  for (const m of marker) {
    if (!m.topicId) continue;
    if (!byTopic.has(m.topicId)) byTopic.set(m.topicId, []);
    byTopic.get(m.topicId)!.push(m);
  }
  const rows: TopicHigh[] = [];
  for (const [topicId, ms] of byTopic) {
    const best = ms.reduce((a, b) => (b.pct > a.pct ? b : a));
    const recent = ms.slice().sort((a, b) => b.ts - a.ts)[0];
    rows.push({
      topicId,
      bestPct: Math.round(best.pct),
      bestPaperId: best.paperId,
      achievedAt: best.ts,
      recentPct: Math.round(recent.pct),
    });
  }
  return rows.sort((a, b) => b.bestPct - a.bestPct).slice(0, 5);
}

function fastestDebrief(
  attempts: Array<{ id: string; startedAt: number; finishedAt: number | null; marks?: number }>,
): TrendBoard['fastestDebrief25'] {
  let best: TrendBoard['fastestDebrief25'] = null;
  for (const a of attempts) {
    if (!a.finishedAt) continue;
    // Heuristic: 25-mark answer ≈ marks in [22, 28] to absorb part-only attempts.
    const marks = a.marks ?? 0;
    if (marks < 22 || marks > 28) continue;
    const minutes = Math.round((a.finishedAt - a.startedAt) / 60_000);
    // Cap absurdly fast attempts (<5 min on a 25-marker is impossible — tab-blur or skip).
    if (minutes < 5) continue;
    if (!best || minutes < best.minutes) {
      best = { attemptId: a.id, minutes, finishedAt: a.finishedAt };
    }
  }
  return best;
}

function weekOnWeek(marker: MarkerResult[], now: number): TrendBoard['weekOnWeek'] {
  if (marker.length < 4) return null;
  const lastWeek: number[] = [];
  const priorWeek: number[] = [];
  for (const m of marker) {
    const age = now - m.ts;
    if (age < 0) continue;
    if (age <= WEEK_MS) lastWeek.push(m.pct);
    else if (age <= 2 * WEEK_MS) priorWeek.push(m.pct);
  }
  if (lastWeek.length === 0 || priorWeek.length === 0) return null;
  const meanLast = lastWeek.reduce((s, x) => s + x, 0) / lastWeek.length;
  const meanPrior = priorWeek.reduce((s, x) => s + x, 0) / priorWeek.length;
  return {
    deltaPct: round1(meanLast - meanPrior),
    lastWeekMean: round1(meanLast),
    priorWeekMean: round1(meanPrior),
    window: 'last-7-days',
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// Longest-streak persistence — promotes the live streak.days into a historic best.
const LONGEST_KEY = 'tba.streak.longest.v1';
export function bumpLongestStreak(current: number): number {
  if (typeof window === 'undefined') return current;
  const raw = localStorage.getItem(LONGEST_KEY);
  const prev = raw ? Number(raw) || 0 : 0;
  const next = Math.max(prev, current);
  if (next !== prev) localStorage.setItem(LONGEST_KEY, String(next));
  return next;
}
export function loadLongestStreak(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(LONGEST_KEY);
  return raw ? Number(raw) || 0 : 0;
}
