/**
 * Single source of truth for the current AFM sitting.
 *
 * ACCA's published September 2026 timetable places AFM on Friday 11 September.
 * The precise local start time is deliberately provisional: confirm it in the
 * Exam Planner / attendance docket before relying on the hour.
 */
export const SITTING = {
  label: 'September 2026',
  examAt: '2026-09-11T09:00:00',
  examDayLabel: '11 September 2026',
  resultsAt: '2026-10-19T05:00:00',
  resultsLabel: '19 October 2026',
  entryDeadlineAt: '2026-07-27T23:59:00',
  lateEntryDeadlineAt: '2026-08-03T23:59:00',
  courseStartMonday: '2026-08-03',
  weeks: 5,
} as const;

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
  verifiedOn: '13 July 2026',
  changesFromPriorYear: false,
} as const;
