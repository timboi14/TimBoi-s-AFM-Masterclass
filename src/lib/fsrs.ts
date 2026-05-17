/**
 * FSRS v5 (Free Spaced Repetition Scheduler) — pure TypeScript implementation.
 *
 * Spec §7: Replace the Leitner 5-stage scheduler with FSRS v5 by default;
 * Leitner stays available as "Classic" mode. This module is the algorithm
 * only — persistence, UI, and mode switching live in src/lib/sr-engine.ts.
 *
 * Algorithm reference: https://github.com/open-spaced-repetition/fsrs4anki/wiki
 * License: BSD-3-Clause for the algorithm; this implementation MIT.
 *
 * Why we vendor the algorithm instead of pulling `ts-fsrs`:
 *  - Tiny (~3 KB gzipped) — avoiding another npm dep keeps the cache lean.
 *  - We have to wrap it in our own engine anyway for the Leitner toggle.
 *  - Easy to audit: the math is all in one file.
 */

/** Rating from the user after reviewing a card. */
export const RATING = {
  Again: 1, // forgot the card
  Hard: 2,  // recalled with serious effort
  Good: 3,  // recalled with normal effort
  Easy: 4,  // trivial recall
} as const;

export type Rating = (typeof RATING)[keyof typeof RATING];

/** Persistent FSRS state per card. */
export interface FsrsCardState {
  /** Memory stability, in days. Higher = remembered longer. */
  stability: number;
  /** Difficulty, in [1, 10]. Lower = easier. */
  difficulty: number;
  /** ms epoch — when the card is next due. */
  due: number;
  /** ms epoch — when the card was last reviewed (or first scheduled). */
  lastReviewedAt: number | null;
  /** Number of successful reviews (Good or Easy in a row, excluding lapses). */
  reps: number;
  /** Number of times the card has lapsed (rated Again after at least one success). */
  lapses: number;
  /** Lifecycle stage; FSRS treats new and review states slightly differently. */
  state: 'new' | 'learning' | 'review' | 'relearning';
}

export interface FsrsScheduleResult {
  state: FsrsCardState;
  /** Days until the card is next due, after the rating just applied. */
  intervalDays: number;
}

/**
 * FSRS v5 default weights (from the open-spaced-repetition reference impl).
 * 19 floats; the algorithm reads them by index, so the array order matters.
 * Users can override by passing a custom config to `schedule()`.
 */
export const FSRS_V5_DEFAULT_WEIGHTS: readonly number[] = Object.freeze([
  0.4197, 1.1869, 3.0412, 15.2441, 7.1434, 0.6477, 1.0007, 0.0674,
  1.6597, 0.1712, 1.1178, 2.0225, 0.0904, 0.3025, 2.1214, 0.2498,
  2.9466, 0.4891, 0.6468,
]);

export interface FsrsConfig {
  /** Target retrievability (probability of recall at the next review). 0.9 = recall ~90% of cards. */
  requestRetention: number;
  /** Maximum interval (days) — caps how long FSRS will defer a mature card. */
  maximumInterval: number;
  /** Weight vector — 19 floats. Override only if you've optimised on your own review log. */
  w: readonly number[];
  /** Curve constants. FSRS v5 uses DECAY = -0.5; FACTOR derived from it. */
  decay: number;
  factor: number;
}

export const DEFAULT_FSRS_CONFIG: FsrsConfig = {
  requestRetention: 0.9,
  maximumInterval: 36500,
  w: FSRS_V5_DEFAULT_WEIGHTS,
  decay: -0.5,
  factor: Math.pow(0.9, 1 / -0.5) - 1, // ≈ 19/81 — keeps the curve self-consistent
};

const DAY_MS = 86_400_000;

/** Initial scheduling for a brand-new card (no prior reviews). */
export function newCard(now: number = Date.now()): FsrsCardState {
  return {
    stability: 0,
    difficulty: 0,
    due: now,
    lastReviewedAt: null,
    reps: 0,
    lapses: 0,
    state: 'new',
  };
}

/**
 * Apply a rating to a card; returns the updated state + days-until-next-review.
 *
 * For the first review (state === 'new'), FSRS uses an initial table; for
 * subsequent reviews, it updates stability and difficulty using the elapsed
 * time and the previous values.
 */
export function schedule(
  state: FsrsCardState,
  rating: Rating,
  now: number = Date.now(),
  cfg: FsrsConfig = DEFAULT_FSRS_CONFIG,
): FsrsScheduleResult {
  const w = cfg.w;

  // --- First review path -----------------------------------------------------
  if (state.state === 'new' || state.lastReviewedAt === null) {
    const s = clampStability(w[rating - 1]);
    const d = clampDifficulty(w[4] - Math.exp(w[5] * (rating - 1)) + 1);
    const intervalDays = nextInterval(s, cfg);
    return {
      state: {
        stability: s,
        difficulty: d,
        due: now + intervalDays * DAY_MS,
        lastReviewedAt: now,
        reps: rating === RATING.Again ? 0 : 1,
        lapses: 0,
        state: rating === RATING.Again ? 'relearning' : 'review',
      },
      intervalDays,
    };
  }

  // --- Subsequent reviews ----------------------------------------------------
  const elapsedDays = Math.max(0, (now - (state.lastReviewedAt ?? now)) / DAY_MS);
  const retrievability = retr(elapsedDays, state.stability, cfg);

  // Difficulty update — mean-reverts toward D_0(4) so a long streak of
  // "Good" doesn't push difficulty unboundedly low (and vice versa).
  const linearD = state.difficulty - w[6] * (rating - 3);
  const meanReversionTarget = w[4] - Math.exp(w[5] * (RATING.Easy - 1)) + 1;
  const nextD = clampDifficulty(w[7] * meanReversionTarget + (1 - w[7]) * linearD);

  // Stability update — separate formulas for lapse vs. recall.
  let nextS: number;
  let lapses = state.lapses;
  let reps = state.reps;
  let nextState: FsrsCardState['state'];

  if (rating === RATING.Again) {
    // Post-lapse stability: forgets a chunk but retains some memory based on D.
    nextS = clampStability(
      w[11] *
        Math.pow(state.difficulty, -w[12]) *
        (Math.pow(state.stability + 1, w[13]) - 1) *
        Math.exp(w[14] * (1 - retrievability)),
    );
    lapses += 1;
    reps = 0;
    nextState = 'relearning';
  } else {
    // Recall path — stability grows by a factor that depends on D, S, R, and rating.
    const hardPenalty = rating === RATING.Hard ? w[15] : 1;
    const easyBonus = rating === RATING.Easy ? w[16] : 1;
    const growth =
      Math.exp(w[8]) *
      (11 - nextD) *
      Math.pow(state.stability, -w[9]) *
      (Math.exp(w[10] * (1 - retrievability)) - 1) *
      hardPenalty *
      easyBonus;
    nextS = clampStability(state.stability * (1 + growth));
    reps += 1;
    nextState = 'review';
  }

  const intervalDays = nextInterval(nextS, cfg);

  return {
    state: {
      stability: nextS,
      difficulty: nextD,
      due: now + intervalDays * DAY_MS,
      lastReviewedAt: now,
      reps,
      lapses,
      state: nextState,
    },
    intervalDays,
  };
}

/**
 * Retrievability — the probability the card is recalled given elapsed time
 * since last review and current stability.
 */
export function retr(elapsedDays: number, stability: number, cfg: FsrsConfig = DEFAULT_FSRS_CONFIG): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (cfg.factor * elapsedDays) / stability, cfg.decay);
}

/** Solve for the days until R drops back to the requested retention. */
function nextInterval(stability: number, cfg: FsrsConfig): number {
  if (stability <= 0) return 0;
  const days = (stability / cfg.factor) * (Math.pow(cfg.requestRetention, 1 / cfg.decay) - 1);
  // Round to whole days for human-friendly schedules, clamp to [1, max].
  return Math.max(1, Math.min(cfg.maximumInterval, Math.round(days)));
}

function clampStability(s: number): number {
  // Stability must be positive — log/exp blow up at 0. FSRS reference clamps
  // to a small epsilon, which we do too.
  if (!Number.isFinite(s) || s <= 0) return 0.1;
  return s;
}

function clampDifficulty(d: number): number {
  if (!Number.isFinite(d)) return 5;
  return Math.min(10, Math.max(1, d));
}

/** Human-readable label for a rating; useful for analytics events. */
export function ratingLabel(r: Rating): string {
  switch (r) {
    case RATING.Again: return 'Again';
    case RATING.Hard: return 'Hard';
    case RATING.Good: return 'Good';
    case RATING.Easy: return 'Easy';
  }
}
