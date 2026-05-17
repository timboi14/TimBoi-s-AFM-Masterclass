/**
 * Unified spaced-repetition engine — switchable between FSRS v5 and the
 * legacy Leitner 5-box. Persists per-card state in localStorage under a
 * versioned key so a future server-side sync can read the same shape.
 *
 * Spec §7: FSRS v5 is the new default; Leitner stays available as "Classic".
 * Cards are upgraded lazily — a legacy Leitner card is treated as a fresh
 * FSRS "new" card on its next review (one cheap re-grade per card to seed
 * stability/difficulty), so existing users don't lose their queue.
 */

import { safeReadJson, safeWriteJson } from './safe-storage';
import { schedule, newCard, RATING, type FsrsCardState, type Rating } from './fsrs';

export type SRMode = 'fsrs' | 'leitner';
export type Box = 1 | 2 | 3 | 4 | 5;

export interface SRCardCore {
  id: string;
  front: string;
  back: string;
  topic: string;
  deck?: string;
}

/** Persisted card shape — holds enough state for either scheduler. */
export interface SRCard extends SRCardCore {
  /** ms epoch — when this card is next due. */
  due: number;
  /** Legacy Leitner box (kept for Classic mode). */
  box: Box;
  /** FSRS state (only populated once the card has been scheduled by FSRS). */
  fsrs?: FsrsCardState;
}

const LEITNER_INTERVALS_DAYS: Record<Box, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

const MODE_KEY = 'tba_sr_mode_v1';

/** Get / set the active SR mode (persists across sessions). */
export function getMode(): SRMode {
  if (typeof window === 'undefined') return 'fsrs';
  const raw = localStorage.getItem(MODE_KEY);
  return raw === 'leitner' ? 'leitner' : 'fsrs';
}
export function setMode(mode: SRMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MODE_KEY, mode);
}

/**
 * Grade a card with a rating. Returns the updated card + the days until
 * next review (display-only — the source of truth is `card.due`).
 *
 * For Leitner mode we ignore Hard/Easy nuances and collapse to a binary
 * pass/fail (Again → box 1, Good/Easy/Hard → next box). This matches the
 * existing Leitner UX without changing user expectations.
 */
export function grade(card: SRCard, rating: Rating, now: number = Date.now()): { card: SRCard; intervalDays: number } {
  const mode = getMode();

  if (mode === 'fsrs') {
    const start = card.fsrs ?? newCard(now);
    const result = schedule(start, rating, now);
    return {
      card: { ...card, due: result.state.due, fsrs: result.state },
      intervalDays: result.intervalDays,
    };
  }

  // Leitner branch — preserve the original semantics.
  const correct = rating !== RATING.Again;
  const nextBox = (correct ? Math.min(5, card.box + 1) : 1) as Box;
  const interval = LEITNER_INTERVALS_DAYS[nextBox];
  return {
    card: { ...card, box: nextBox, due: now + interval * 86_400_000 },
    intervalDays: interval,
  };
}

/** Get an empty card with the right shape for a freshly-seeded deck. */
export function emptyCard(core: SRCardCore, now: number = Date.now()): SRCard {
  return {
    ...core,
    box: 1,
    due: now,
  };
}

/** Persist a queue to localStorage under a versioned key. */
export function saveQueue(key: string, items: SRCard[]) {
  safeWriteJson(key, items);
}

/** Read a persisted queue, returning null if absent (so the caller can seed). */
export function loadQueue(key: string): SRCard[] | null {
  return safeReadJson<SRCard[] | null>(key, null);
}

/** Re-export the rating enum and labels for UI ergonomics. */
export { RATING, ratingLabel } from './fsrs';
export type { Rating } from './fsrs';
