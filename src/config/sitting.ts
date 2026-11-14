/**
 * SINGLE SOURCE OF TRUTH for the exam sitting.
 *
 * `SITTINGS` lists every sitting the app supports. The learner picks one in
 * Settings; the choice is read synchronously at module load, so every
 * countdown, deadline, unlock and course week derives from `SITTING` exactly
 * as before. Changing the choice reloads the app (see `chooseSitting`).
 *
 * With no stored choice the default is the first sitting that can still be
 * entered, then the first upcoming exam, then the last sitting listed.
 *
 * A build-time guard (scripts/check-sitting.mjs) fails the build when NO
 * listed sitting is upcoming, so an expired list can never silently ship.
 * Add the next sitting here as soon as ACCA publishes it.
 *
 * Sources checked 14 Nov 2026 (ACCA exam timetable + important dates):
 *  - December 2026: AFM on Friday 11 December. Entry closed 2 Nov, late
 *    entry closed 9 Nov. Results 18 January 2027.
 *  - March 2027: exam week 1-5 March. ACCA has NOT yet published the day;
 *    Friday 5 March follows the December pattern and is provisional.
 *    Entry closes 1 Feb, late entry 8 Feb. Results 12 April 2027.
 *  - June 2027 (the final sitting of this exam format) is not yet published.
 * The 09:00 start is provisional for every sitting: confirm the local start
 * time on the Exam Planner / attendance docket.
 */
export interface Sitting {
  id: string;
  label: string;
  examAt: string;
  examDayLabel: string;
  /** False while ACCA has only published the exam week, not the day. */
  examDayConfirmed: boolean;
  resultsAt: string;
  resultsLabel: string;
  entryDeadlineAt: string;
  lateEntryDeadlineAt: string;
  /** Monday of course Week 1. Weeks run Mon-Sun for `weeks` weeks. */
  courseStartMonday: string;
  weeks: number;
}

export const SITTINGS: readonly Sitting[] = [
  {
    id: '2026-12',
    label: 'December 2026',
    examAt: '2026-12-11T09:00:00',
    examDayLabel: '11 December 2026',
    examDayConfirmed: true,
    resultsAt: '2027-01-18T05:00:00',
    resultsLabel: '18 January 2027',
    entryDeadlineAt: '2026-11-02T23:59:00',
    lateEntryDeadlineAt: '2026-11-09T23:59:00',
    courseStartMonday: '2026-11-02',
    weeks: 5,
  },
  {
    id: '2027-03',
    label: 'March 2027',
    examAt: '2027-03-05T09:00:00',
    examDayLabel: 'week of 1 March 2027 (day to be confirmed)',
    examDayConfirmed: false,
    resultsAt: '2027-04-12T05:00:00',
    resultsLabel: '12 April 2027',
    entryDeadlineAt: '2027-02-01T23:59:00',
    lateEntryDeadlineAt: '2027-02-08T23:59:00',
    courseStartMonday: '2027-01-25',
    weeks: 5,
  },
];

export const SITTING_CHOICE_KEY = 'tba_sitting_choice';

function readChoice(): string {
  try {
    return typeof localStorage === 'undefined' ? '' : localStorage.getItem(SITTING_CHOICE_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Pure resolver, exported for tests and the build guard's mental model. */
export function resolveSitting(choice: string, now: number = Date.now()): Sitting {
  const chosen = SITTINGS.find((s) => s.id === choice);
  // A stored choice is honoured until its results day, so the app does not
  // jump to a new sitting in the middle of exam week.
  if (chosen && +new Date(chosen.resultsAt) > now) return chosen;
  return (
    SITTINGS.find((s) => +new Date(s.lateEntryDeadlineAt) > now) ??
    SITTINGS.find((s) => +new Date(s.examAt) > now) ??
    SITTINGS[SITTINGS.length - 1]
  );
}

export const SITTING: Sitting = resolveSitting(readChoice());

/** True when the learner explicitly picked this sitting (vs the default). */
export const SITTING_IS_CHOSEN = readChoice() === SITTING.id;

/** Persist a sitting choice and reload so every derived date updates. */
export function chooseSitting(id: string): void {
  if (!SITTINGS.some((s) => s.id === id)) return;
  try {
    localStorage.setItem(SITTING_CHOICE_KEY, id);
    // Entry confirmation belongs to a sitting; it must not carry over.
    if (id !== SITTING.id) localStorage.removeItem('tba_examEntryConfirmedAt');
  } catch { /* storage unavailable: the reload still applies nothing */ }
  window.location.reload();
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayMonth = (iso: string) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };

/** Ready-made phrases so pages never hardcode a date. */
export const SITTING_TEXT = {
  /** "the March 2027 sitting" or "9 December 2026" once the day is confirmed. */
  examPhrase: SITTING.examDayConfirmed ? SITTING.examDayLabel : `the ${SITTING.label} sitting`,
  /** "Standard entry closes 1 February." or the closed-state equivalent. */
  entryLine:
    +new Date(SITTING.lateEntryDeadlineAt) <= Date.now()
      ? `Entry for ${SITTING.label} has closed.`
      : +new Date(SITTING.entryDeadlineAt) <= Date.now()
        ? `Standard entry has closed. Late entry ends ${dayMonth(SITTING.lateEntryDeadlineAt)}.`
        : `Standard entry closes ${dayMonth(SITTING.entryDeadlineAt)}.`,
};

export const EXAM_DATE = new Date(SITTING.examAt);
export const RESULTS_DATE = new Date(SITTING.resultsAt);

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDateTime = (d: Date) => `${fmtDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

export function weekDates(weekNum: number): { weekStart: string; homeworkDue: string; answerUnlocks: string } {
  const monday = new Date(`${SITTING.courseStartMonday}T00:00:00`);
  monday.setDate(monday.getDate() + (weekNum - 1) * 7);
  const due = new Date(monday);
  due.setDate(due.getDate() + 6);
  due.setHours(23, 59, 0, 0);
  const unlock = new Date(monday);
  unlock.setDate(unlock.getDate() + 7);
  unlock.setHours(5, 0, 0, 0);
  return { weekStart: fmtDate(monday), homeworkDue: fmtDateTime(due), answerUnlocks: fmtDateTime(unlock) };
}

export const SYLLABUS = {
  label: 'September 2026–June 2027',
  structure: 'A–E' as const,
  verifiedOn: '14 November 2026',
  changesFromPriorYear: false,
} as const;
