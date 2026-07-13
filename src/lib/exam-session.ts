/**
 * Per-guest, per-sitting state for the full-ceremony exam player.
 *
 * Answers themselves live in the existing per-question workspace store
 * (cbe-storage, keyed by paperId), so a question answered inside a sitting is
 * the same answer you would see in friendly practice. This module only tracks
 * the exam-shell state the ceremony needs: where to resume, the single sitting
 * countdown, which questions have been fully viewed (for the Unseen-content
 * guard and the Item Review states), and whether the exam was ended.
 */
const PREFIX = 'tba_exam_';

export type ExamStage =
  | 'intro'
  | 'instructions'
  | 'summary'
  | 'exam'
  | 'review'
  | 'marking';

export interface ExamSession {
  sittingId: string;
  stage: ExamStage;
  currentQ: number; // 0-based question index
  viewed: number[]; // question indices scrolled to the bottom at least once
  startedAt: number | null;
  secondsRemaining: number;
  running: boolean;
  lastTickMs: number | null;
  ended: boolean;
  updatedAt: number;
}

const key = (guestId: string, sittingId: string) =>
  `${PREFIX}${encodeURIComponent(guestId)}_${sittingId}`;

export function freshSession(sittingId: string, durationSeconds: number): ExamSession {
  return {
    sittingId,
    stage: 'intro',
    currentQ: 0,
    viewed: [],
    startedAt: null,
    secondsRemaining: durationSeconds,
    running: false,
    lastTickMs: null,
    ended: false,
    updatedAt: Date.now(),
  };
}

export function loadSession(guestId: string, sittingId: string): ExamSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(guestId, sittingId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamSession;
    if (parsed && parsed.sittingId === sittingId) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function saveSession(guestId: string, session: ExamSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      key(guestId, session.sittingId),
      JSON.stringify({ ...session, updatedAt: Date.now() }),
    );
  } catch {
    /* quota / disabled — silent */
  }
}

export function clearSession(guestId: string, sittingId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key(guestId, sittingId));
  } catch {
    /* silent */
  }
}

/** Catch the countdown up for time elapsed while the player was unmounted. */
export function reconcile(session: ExamSession): ExamSession {
  if (!session.running || session.lastTickMs == null) return session;
  const elapsed = Math.floor((Date.now() - session.lastTickMs) / 1000);
  if (elapsed <= 0) return session;
  const secondsRemaining = Math.max(0, session.secondsRemaining - elapsed);
  return {
    ...session,
    secondsRemaining,
    running: secondsRemaining > 0,
    lastTickMs: secondsRemaining > 0 ? Date.now() : null,
  };
}

