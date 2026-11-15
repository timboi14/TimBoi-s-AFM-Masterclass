/**
 * Habit metrics, derived from the study event log. Pure functions: pass the
 * events in, get numbers out. Nothing here is stored, so the figures can never
 * drift from what the learner actually did.
 *
 * Design choices (deliberate, see the Nov 2026 audit):
 *  - A day counts only when real study happened. Opening the app is not study.
 *  - Streak freezes protect the run from one missed day. Harsh resets are the
 *    main reason learners abandon a streak, so the bank refills with effort:
 *    one freeze per FREEZE_EARN_EVERY active days, capped at FREEZE_CAP.
 *  - The weekly goal is the primary target. Four good days beat seven token
 *    visits, and a weekly target survives a bad day without feeling like failure.
 */
import { STUDY_TYPES, dayOf, type StudyEvent, type StudyEventType } from './db/events';

export const FREEZE_CAP = 2;
export const FREEZE_EARN_EVERY = 5;
export const WEEKLY_GOAL_KEY = 'tba_weekly_goal_v1';
export const DEFAULT_WEEKLY_GOAL = 4;

const DAY_MS = 86_400_000;

/** Parse YYYY-MM-DD as a local-midnight timestamp. */
function dayStart(day: string): number {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

function addDays(day: string, n: number): string {
  const d = new Date(dayStart(day));
  d.setDate(d.getDate() + n);
  return dayOf(d.getTime());
}

/** Monday of the week containing `day`. */
export function weekStart(day: string): string {
  const dow = new Date(dayStart(day)).getDay(); // 0 = Sunday
  return addDays(day, dow === 0 ? -6 : 1 - dow);
}

export function readWeeklyGoal(): number {
  try {
    const n = Number(localStorage.getItem(WEEKLY_GOAL_KEY));
    return Number.isInteger(n) && n >= 1 && n <= 7 ? n : DEFAULT_WEEKLY_GOAL;
  } catch {
    return DEFAULT_WEEKLY_GOAL;
  }
}

export function writeWeeklyGoal(n: number): void {
  try { localStorage.setItem(WEEKLY_GOAL_KEY, String(Math.max(1, Math.min(7, Math.round(n))))); } catch { /* ignore */ }
}

/** Count of study events per day. Days with no study are absent. */
export function activityByDay(events: StudyEvent[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const e of events) {
    if (!STUDY_TYPES.has(e.type)) continue;
    map.set(e.day, (map.get(e.day) ?? 0) + 1);
  }
  return map;
}

export interface StreakState {
  /** Current run in days, counting frozen days as held but not as study. */
  current: number;
  /** Longest run ever reached. */
  best: number;
  /** Freezes available right now. */
  freezes: number;
  /** Days a freeze was spent on, most recent last. */
  frozenDays: string[];
  /** True when today already has study. */
  activeToday: boolean;
  /** True when today is still empty and a freeze (not study) is holding the run. */
  atRisk: boolean;
}

/**
 * Walk the calendar from the first active day to yesterday, then add today if
 * it is active. A missed day spends a freeze when one is banked; otherwise the
 * run resets. Today never breaks a run: the learner still has time.
 */
export function computeStreak(events: StudyEvent[], today: string = dayOf(Date.now())): StreakState {
  const active = activityByDay(events);
  const days = [...active.keys()].sort();
  const state: StreakState = { current: 0, best: 0, freezes: 1, frozenDays: [], activeToday: active.has(today), atRisk: false };
  if (days.length === 0) return state;

  let run = 0;
  let earned = 0;
  const yesterday = addDays(today, -1);
  for (let day = days[0]; day <= yesterday; day = addDays(day, 1)) {
    if (active.has(day)) {
      run += 1;
      earned += 1;
      if (earned % FREEZE_EARN_EVERY === 0) state.freezes = Math.min(FREEZE_CAP, state.freezes + 1);
    } else if (run > 0 && state.freezes > 0) {
      state.freezes -= 1;
      state.frozenDays.push(day);
    } else {
      run = 0;
    }
    state.best = Math.max(state.best, run);
  }
  if (state.activeToday) {
    run += 1;
    earned += 1;
    if (earned % FREEZE_EARN_EVERY === 0) state.freezes = Math.min(FREEZE_CAP, state.freezes + 1);
  }
  state.current = run;
  state.best = Math.max(state.best, run);
  state.atRisk = run > 0 && !state.activeToday;
  return state;
}

export interface WeekProgress {
  goal: number;
  /** Active days so far this week (Mon-Sun). */
  done: number;
  /** Seven flags, Monday first. */
  days: Array<{ day: string; active: boolean; isToday: boolean; isFuture: boolean }>;
  met: boolean;
  /** Days still needed, never negative. */
  remaining: number;
  /** True when the goal can no longer be reached this week. */
  outOfReach: boolean;
}

export function weekProgress(events: StudyEvent[], goal: number, today: string = dayOf(Date.now())): WeekProgress {
  const active = activityByDay(events);
  const start = weekStart(today);
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(start, i);
    return { day, active: active.has(day), isToday: day === today, isFuture: day > today };
  });
  const done = days.filter((d) => d.active).length;
  const left = days.filter((d) => d.isFuture || (d.isToday && !d.active)).length;
  const remaining = Math.max(0, goal - done);
  return { goal, done, days, met: done >= goal, remaining, outOfReach: remaining > left };
}

export interface HeatCell { day: string; count: number; level: 0 | 1 | 2 | 3 | 4; isFuture: boolean }

/** `weeks` columns of seven cells (Mon first), ending with the current week. */
export function heatMap(events: StudyEvent[], weeks = 12, today: string = dayOf(Date.now())): HeatCell[][] {
  const active = activityByDay(events);
  const first = addDays(weekStart(today), -7 * (weeks - 1));
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const day = addDays(first, w * 7 + d);
      const count = active.get(day) ?? 0;
      const level = count === 0 ? 0 : count < 3 ? 1 : count < 8 ? 2 : count < 16 ? 3 : 4;
      return { day, count, level, isFuture: day > today } as HeatCell;
    }),
  );
}

export interface WeekRecap {
  /** Monday of the recapped week. */
  weekOf: string;
  activeDays: number;
  cards: number;
  questions: number;
  drills: number;
  reading: number;
  minutes: number;
  /** Mean marked score for the week, or null when nothing was marked. */
  avgScore: number | null;
  /** Total study events. */
  actions: number;
}

const COUNT: Partial<Record<StudyEventType, keyof Pick<WeekRecap, 'cards' | 'questions' | 'drills' | 'reading'>>> = {
  card_review: 'cards',
  question_attempt: 'questions',
  drill_correct: 'drills',
  answer_shown: 'drills',
  note_read: 'reading',
  theory_read: 'reading',
};

export function recapWeek(events: StudyEvent[], weekOf: string): WeekRecap {
  const from = dayStart(weekOf);
  const to = from + 7 * DAY_MS;
  const recap: WeekRecap = { weekOf, activeDays: 0, cards: 0, questions: 0, drills: 0, reading: 0, minutes: 0, avgScore: null, actions: 0 };
  const days = new Set<string>();
  const scores: number[] = [];
  for (const e of events) {
    const t = dayStart(e.day);
    if (t < from || t >= to || !STUDY_TYPES.has(e.type)) continue;
    days.add(e.day);
    recap.actions += 1;
    const bucket = COUNT[e.type];
    if (bucket) recap[bucket] += 1;
    if (e.minutes) recap.minutes += e.minutes;
    if (e.type === 'answer_marked' && typeof e.value === 'number') scores.push(e.value);
  }
  recap.activeDays = days.size;
  recap.minutes = Math.round(recap.minutes);
  recap.avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  return recap;
}

/** This week and last week, for the "compared with last week" line. */
export function recapPair(events: StudyEvent[], today: string = dayOf(Date.now())): { thisWeek: WeekRecap; lastWeek: WeekRecap } {
  const start = weekStart(today);
  return { thisWeek: recapWeek(events, start), lastWeek: recapWeek(events, addDays(start, -7)) };
}

/**
 * One honest sentence about the week. Evidence first, no guilt: the wording
 * never scolds a quiet week, it points at the next useful action.
 */
export function recapHeadline(pair: { thisWeek: WeekRecap; lastWeek: WeekRecap }, progress: WeekProgress): string {
  const { thisWeek: t, lastWeek: l } = pair;
  if (t.actions === 0 && l.actions === 0) return 'No study logged yet. One ten-minute session starts the record.';
  if (progress.met) return `Weekly goal met: ${t.activeDays} active day${t.activeDays === 1 ? '' : 's'}. Anything more this week is a bonus.`;
  if (t.actions === 0) return `Last week you logged ${l.activeDays} active day${l.activeDays === 1 ? '' : 's'}. This week is still open.`;
  if (progress.outOfReach) return `${t.activeDays} active day${t.activeDays === 1 ? '' : 's'} so far. The goal is out of reach this week, so bank what you can.`;
  return `${t.activeDays} of ${progress.goal} days done. ${progress.remaining} more to hit this week's goal.`;
}
