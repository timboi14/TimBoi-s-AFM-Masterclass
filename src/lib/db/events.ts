/**
 * Study event log: the append-only history every habit metric derives from.
 *
 * Totals such as points and streak used to be stored as bare numbers, so the
 * app could not answer "what did I do last Tuesday?". Every meaningful study
 * action now appends one event here. Streaks, the weekly goal, the heat map
 * and the weekly recap are all computed from this log (see src/lib/habits.ts).
 *
 * Storage: IndexedDB (`events` store). An in-memory copy keeps reads
 * synchronous for React; writes are fire-and-forget. If IndexedDB is not
 * available the log degrades to a capped localStorage key so nothing breaks.
 */
import { useSyncExternalStore } from 'react';
import { idb } from './idb';

export type StudyEventType =
  | 'visit'            // app opened on a new day (does not count as study)
  | 'legacy_day'       // an active day carried over from the pre-event-log streak
  | 'card_review'      // spaced-repetition card graded
  | 'drill_correct'    // drill or flashcard answered correctly
  | 'answer_shown'     // drill answer revealed
  | 'note_read'        // topic notes marked read
  | 'theory_read'      // theory card opened
  | 'question_attempt' // past-paper question attempted
  | 'answer_marked'    // AI or self marking produced a score
  | 'debrief_done'     // debrief session saved
  | 'diagnostic_done'; // diagnostic sitting completed

/** Event types that count as study when deciding whether a day was active. */
export const STUDY_TYPES: ReadonlySet<StudyEventType> = new Set<StudyEventType>([
  'legacy_day', 'card_review', 'drill_correct', 'answer_shown', 'note_read',
  'theory_read', 'question_attempt', 'answer_marked', 'debrief_done', 'diagnostic_done',
]);

export interface StudyEvent {
  id?: number;
  /** ms epoch */
  ts: number;
  /** Local calendar day, YYYY-MM-DD. Stored so day queries need no timezone maths. */
  day: string;
  type: StudyEventType;
  /** What the event was about: card id, question id, topic id. */
  ref?: string;
  /** Type-specific number: FSRS rating, percentage score, minutes. */
  value?: number;
  /** Minutes of study this event represents, when known. */
  minutes?: number;
}

const FALLBACK_KEY = 'tba_events_fallback_v1';
const FALLBACK_CAP = 2000;

export function dayOf(ts: number): string {
  const d = new Date(ts);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

let events: StudyEvent[] = [];
let ready = false;
let usingFallback = false;
const listeners = new Set<() => void>();

function emit(): void {
  // New array identity so useSyncExternalStore sees the change.
  events = events.slice();
  listeners.forEach((fn) => fn());
}

function readFallback(): StudyEvent[] {
  try {
    const raw = localStorage.getItem(FALLBACK_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed.filter(isEvent) as StudyEvent[]) : [];
  } catch {
    return [];
  }
}

function writeFallback(): void {
  try {
    localStorage.setItem(FALLBACK_KEY, JSON.stringify(events.slice(-FALLBACK_CAP)));
  } catch { /* quota: the in-memory log still serves this session */ }
}

export function isEvent(v: unknown): v is StudyEvent {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return typeof e.ts === 'number' && Number.isFinite(e.ts) && typeof e.day === 'string' && typeof e.type === 'string';
}

let initPromise: Promise<void> | null = null;

/** Load the log once. Safe to call repeatedly; later calls reuse the first. */
export function initEvents(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    // Events recorded before the load finished must survive the merge.
    const early = events;
    if (await idb.available()) {
      const stored = (await idb.getAll<StudyEvent>('events')).filter(isEvent);
      // Replay events a previous page journalled but could not confirm.
      const orphans = readJournal().filter((j) => !stored.some((e) => sameEvent(e, j)) && !early.some((e) => sameEvent(e, j)));
      if (orphans.length) {
        const moved = orphans.map(({ id: _id, ...rest }) => rest);
        if (await idb.putMany('events', moved)) stored.push(...moved);
      }
      writeJournal(early);
      const fallback = readFallback();
      if (fallback.length) {
        // A previous session ran without IndexedDB: move its log across.
        const moved = fallback.map(({ id: _id, ...rest }) => rest);
        await idb.putMany('events', moved);
        try { localStorage.removeItem(FALLBACK_KEY); } catch { /* ignore */ }
        events = [...stored, ...moved, ...early];
      } else {
        events = [...stored, ...early];
      }
    } else {
      usingFallback = true;
      events = [...readFallback(), ...readJournal(), ...early];
      writeJournal([]);
      writeFallback();
    }
    events.sort((a, b) => a.ts - b.ts);
    ready = true;
    emit();
  })();
  return initPromise;
}

/**
 * Write-ahead journal. IndexedDB writes are asynchronous, so an event recorded
 * just before the learner navigates away or closes the tab could be lost. Each
 * event is first appended synchronously to this small localStorage key, then
 * removed once IndexedDB confirms the write. initEvents() replays whatever a
 * previous page left behind.
 */
const JOURNAL_KEY = 'tba_events_journal_v1';

function readJournal(): StudyEvent[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(JOURNAL_KEY) ?? '[]');
    return Array.isArray(parsed) ? (parsed.filter(isEvent) as StudyEvent[]) : [];
  } catch {
    return [];
  }
}

function writeJournal(list: StudyEvent[]): void {
  try {
    if (list.length) localStorage.setItem(JOURNAL_KEY, JSON.stringify(list.slice(-500)));
    else localStorage.removeItem(JOURNAL_KEY);
  } catch { /* quota: the IndexedDB write is still attempted */ }
}

const sameEvent = (a: StudyEvent, b: StudyEvent) => a.ts === b.ts && a.type === b.type && a.ref === b.ref;

/** Append one event. Returns immediately; persistence happens in the background. */
export function recordEvent(
  type: StudyEventType,
  detail: { ref?: string; value?: number; minutes?: number; ts?: number } = {},
): void {
  const ts = detail.ts ?? Date.now();
  const event: StudyEvent = { ts, day: dayOf(ts), type };
  if (detail.ref !== undefined) event.ref = detail.ref.slice(0, 120);
  if (detail.value !== undefined && Number.isFinite(detail.value)) event.value = detail.value;
  if (detail.minutes !== undefined && Number.isFinite(detail.minutes)) event.minutes = Math.max(0, detail.minutes);
  events.push(event);
  emit();
  if (usingFallback) { writeFallback(); return; }
  writeJournal([...readJournal(), event]);
  void idb.put('events', event).then((key) => {
    if (key !== null) writeJournal(readJournal().filter((e) => !sameEvent(e, event)));
    else if (ready) { usingFallback = true; writeFallback(); writeJournal([]); }
  });
}

/** Bulk insert, used by the one-off seed and by backup restore. */
export async function importEvents(list: StudyEvent[], opts: { replace?: boolean } = {}): Promise<void> {
  await initEvents();
  const clean = list.filter(isEvent).map(({ id: _id, ...rest }) => rest);
  if (opts.replace) {
    events = [];
    if (!usingFallback) await idb.clear('events');
  }
  events = [...events, ...clean].sort((a, b) => a.ts - b.ts);
  if (usingFallback) writeFallback();
  else await idb.putMany('events', clean);
  emit();
}

export async function clearEvents(): Promise<void> {
  events = [];
  try { localStorage.removeItem(FALLBACK_KEY); localStorage.removeItem(JOURNAL_KEY); } catch { /* ignore */ }
  await idb.clear('events');
  emit();
}

export function getEvents(): StudyEvent[] {
  return events;
}

export function eventsReady(): boolean {
  return ready;
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
};

/** React hook: the full log, re-rendering whenever an event is recorded. */
export function useEvents(): StudyEvent[] {
  return useSyncExternalStore(subscribe, getEvents, getEvents);
}
