/**
 * Data-layer bootstrap. Runs once from main.tsx, never blocks first paint.
 *
 *  1. Load the study event log from IndexedDB.
 *  2. First run only: seed the log from pre-existing localStorage progress
 *     (attempts and the old visit streak) so nothing earned is lost.
 *  3. Mirror the derived streak into the legacy store so the header chip and
 *     the points multiplier read one number.
 *  4. Take the daily automatic snapshot.
 *  5. Keep the app-icon badge in step with the cards due today.
 */
import { idb } from './idb';
import { getEvents, importEvents, initEvents, dayOf, type StudyEvent } from './events';
import { requestPersistence, snapshotIfDue } from './backup';
import { computeStreak } from '../habits';
import { store } from '../store';
import { STUDY_TYPES } from './events';

const SEED_KEY = 'seed_v1';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Build seed events from progress recorded before the event log existed. */
export function buildSeed(now: number = Date.now()): StudyEvent[] {
  const seed: StudyEvent[] = [];
  const attempts = readJson<Array<{ questionId?: string; startedAt?: number; finishedAt?: number; selfScore?: number }>>('tba_attempts_v1', []);
  if (Array.isArray(attempts)) {
    for (const a of attempts) {
      if (typeof a?.startedAt !== 'number' || a.startedAt > now) continue;
      const e: StudyEvent = { ts: a.startedAt, day: dayOf(a.startedAt), type: 'question_attempt' };
      if (typeof a.questionId === 'string') e.ref = a.questionId;
      if (typeof a.selfScore === 'number') e.value = a.selfScore;
      if (typeof a.finishedAt === 'number') e.minutes = Math.min(240, Math.max(0, (a.finishedAt - a.startedAt) / 60_000));
      seed.push(e);
    }
  }
  // The old streak counted consecutive visit days ending on lastVisit.
  const streak = Number(localStorage.getItem('tba_streak')) || 0;
  const lastVisit = localStorage.getItem('tba_lastVisit') || '';
  const last = /^\d{4}-\d{2}-\d{2}$/.test(lastVisit) ? new Date(`${lastVisit}T12:00:00`).getTime() : NaN;
  if (streak > 0 && Number.isFinite(last) && last <= now) {
    const have = new Set(seed.map((e) => e.day));
    for (let i = 0; i < Math.min(streak, 400); i++) {
      const ts = last - i * 86_400_000;
      if (!have.has(dayOf(ts))) seed.push({ ts, day: dayOf(ts), type: 'legacy_day' });
    }
  }
  return seed;
}

function syncStreak(): void {
  const { current } = computeStreak(getEvents());
  if (store.get().streak !== current) store.set({ streak: current });
}

/**
 * Reviews due now, across both spaced-repetition decks. Only cards the learner
 * has already reviewed count: a deck of never-seen cards is not a debt, and a
 * badge that is always lit teaches people to ignore it.
 */
export function dueCardCount(now: number = Date.now()): number {
  let due = 0;
  const cards = readJson<Array<{ due?: number; box?: number; fsrs?: unknown }>>('tba_sr_v1', []);
  if (Array.isArray(cards)) {
    due += cards.filter((c) => typeof c?.due === 'number' && c.due <= now && (c.fsrs !== undefined || (c.box ?? 1) > 1)).length;
  }
  const lab = readJson<{ entries?: Record<string, { stage?: number; nextDueIso?: string; fsrs?: unknown }> }>('tba.memorylab.leitner.v1', {});
  for (const e of Object.values(lab?.entries ?? {})) {
    if ((e?.fsrs !== undefined || (e?.stage ?? 0) > 0) && +new Date(e?.nextDueIso ?? '') <= now) due += 1;
  }
  return due;
}

function syncBadge(): void {
  const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
  if (!nav.setAppBadge) return;
  const due = dueCardCount();
  void (due > 0 ? nav.setAppBadge(due) : nav.clearAppBadge?.())?.catch(() => { /* not installed */ });
}

let started = false;

export async function bootstrapData(): Promise<void> {
  if (started || typeof window === 'undefined') return;
  started = true;
  await initEvents();

  const seeded = await idb.get<{ key: string }>('meta', SEED_KEY);
  if (!seeded && getEvents().filter((e) => STUDY_TYPES.has(e.type)).length === 0) {
    const seed = buildSeed();
    if (seed.length) await importEvents(seed);
  }
  if (!seeded) await idb.put('meta', { key: SEED_KEY, at: Date.now() });

  syncStreak();
  syncBadge();

  // Re-derive after every recorded event. The first real study event is also
  // the moment to ask the browser to protect this site's storage: the learner
  // now has something worth keeping, and the request is silent in most browsers.
  let lastCount = getEvents().length;
  let askedPersist = false;
  const tick = () => {
    const n = getEvents().length;
    if (n === lastCount) return;
    lastCount = n;
    syncStreak();
    syncBadge();
    if (!askedPersist) {
      askedPersist = true;
      void requestPersistence();
    }
  };
  window.setInterval(tick, 1500);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { syncStreak(); syncBadge(); }
  });

  // Snapshot after the page has settled so it never competes with first paint.
  window.setTimeout(() => { void snapshotIfDue(); }, 4000);
}
