/**
 * Bayesian predicted-band model.
 *
 * Spec §5: "Bayesian model on attempt parts: marks per syllabus capability +
 * time pressure + recency. Output mean + sigma → display 'Comfortable / On
 * the edge / Below pass' with explicit ±marks at 80% CI."
 *
 * Approach: treat the user's true paper mark as an unknown Normal with prior
 * N(μ0, σ0²). Each AI-marker run gives a noisy observation N(y, σy²). Update
 * the posterior via the standard conjugate-Normal formulas, weighting newer
 * results harder (recency) and capping the impact of any one short attempt
 * (time pressure / outlier guard).
 *
 * Stays in pure TypeScript — the math is well-known and short enough to
 * audit at a glance.
 */

import type { MarkerResult } from './formGuide';

export type BayesianBand = 'Below pass' | 'On the edge' | 'Comfortable' | 'Strong';

export interface BayesianPrediction {
  /** Posterior mean of the predicted mark (0..100). */
  mean: number;
  /** Posterior standard deviation (marks). */
  sigma: number;
  /** Headline band derived from mean + sigma. */
  band: BayesianBand;
  /** 80% credible interval: [low, high]. Width is ~2.56σ. */
  ci80: [number, number];
  /** Number of marker observations that fed the posterior. */
  nObservations: number;
  /** Effective sample size after recency weighting (informational only). */
  effectiveN: number;
}

export interface BayesianPriorConfig {
  /** Prior mean — defaults to 50 (the pass mark; "no information" centre). */
  mu0: number;
  /** Prior standard deviation — wide so a single observation can move it. */
  sigma0: number;
  /** Baseline observation noise (marks). Inflated for short attempts. */
  obsSigma: number;
  /** Half-life of an observation in days — older results count for less. */
  recencyHalfLifeDays: number;
}

export const DEFAULT_PRIOR: BayesianPriorConfig = {
  mu0: 50,
  sigma0: 15,
  obsSigma: 8,
  recencyHalfLifeDays: 14,
};

/**
 * Compute the posterior predictive mark from a series of marker observations.
 * The math: given prior N(μ0, σ0²) and weighted observations y_i with weights
 * w_i and noise σ_y², the posterior is also Normal with precision (1/σ²) equal
 * to the sum of precisions, and mean equal to the precision-weighted mean.
 */
export function predictMark(marker: MarkerResult[], now: number = Date.now(), cfg: BayesianPriorConfig = DEFAULT_PRIOR): BayesianPrediction {
  // Sort newest first so recency weights are easy to reason about.
  const sorted = [...marker].sort((a, b) => b.ts - a.ts);

  let priorPrec = 1 / (cfg.sigma0 * cfg.sigma0);
  let postPrec = priorPrec;
  let postPrecMean = priorPrec * cfg.mu0;
  let effectiveN = 0;

  const halfLifeMs = cfg.recencyHalfLifeDays * 86_400_000;

  for (const obs of sorted) {
    const ageMs = Math.max(0, now - obs.ts);
    // Exponential recency weight in [0,1]. A result on the half-life day counts ½.
    const w = Math.pow(2, -ageMs / halfLifeMs);
    // Observation noise inflated when there are very few prior runs — a single
    // marker on a 12-mark sub-part shouldn't dominate the posterior.
    const obsVar = cfg.obsSigma * cfg.obsSigma;
    const wPrec = w / obsVar;
    postPrec += wPrec;
    postPrecMean += wPrec * obs.pct;
    effectiveN += w;
  }

  const mean = clamp(postPrecMean / postPrec, 0, 100);
  const sigma = Math.sqrt(1 / postPrec);

  // 80% credible interval — Normal z=1.2816.
  const halfWidth = 1.2816 * sigma;
  const ci80: [number, number] = [
    clamp(mean - halfWidth, 0, 100),
    clamp(mean + halfWidth, 0, 100),
  ];

  // Banding uses both mean and the lower edge of the CI so a high mean with
  // huge variance is still flagged "on the edge".
  const band = bandFor(mean, ci80[0]);

  return {
    mean: round1(mean),
    sigma: round1(sigma),
    band,
    ci80: [round1(ci80[0]), round1(ci80[1])],
    nObservations: marker.length,
    effectiveN: round1(effectiveN),
  };
}

function bandFor(mean: number, ciLow: number): BayesianBand {
  if (mean < 45 || ciLow < 38) return 'Below pass';
  if (mean < 52 || ciLow < 46) return 'On the edge';
  if (mean < 65) return 'Comfortable';
  return 'Strong';
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
