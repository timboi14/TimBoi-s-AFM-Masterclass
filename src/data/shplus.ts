/**
 * AFM revision course integration data. Dates derive from the current sitting.
 * Mirrors the official course schedule the user is following so progress
 * in one platform reinforces the other. User-facing copy is generic
 * (no name-drops); internal field names retained for compatibility.
 */
import { EXAM_DATE, SITTING, weekDates } from '@/config/sitting';

export interface ShWeek {
  num: number;
  title: string;
  topic: string;
  weekStart: string;       // Monday w/c
  homeworkDue: string;     // Sunday midnight
  answerUnlocks: string;
  marks: number;
  tutorScenarios: string[];   // Andrew's walkthrough companies
  selfReview?: string;        // self-review scenario
  tbaTopics: string[];        // matching TBA topic ids
  tbaTheory: string[];        // matching TBA theory categories
  examinerCases: string[];    // matching examiner case ids
  mowerEmphasis: string;      // 1-line technique focus
  exitCriteria: string[];     // what "done" looks like
}

export const SH_WEEKS: ShWeek[] = [
  {
    num: 1,
    title: 'Investment Appraisal',
    topic: 'NPV, WACC, real options, foreign NPV, sensitivity',
    ...weekDates(1),
    marks: 25,
    tutorScenarios: ['Colvin Co', 'Robson Co'],
    selfReview: 'Blackbosca Co — Üskistan expansion (25 marks + 5 PS)',
    tbaTopics: ['npv', 'apv', 'real', 'coc'],
    tbaTheory: ['apv', 'val'],
    examinerCases: ['mj25-sunkcost', 'sd25-drimpton'],
    mowerEmphasis: 'Time management — 1.8 minutes per mark, including reading.',
    exitCriteria: [
      'Watched both Colvin & Robson walkthroughs',
      'Attempted Blackbosca Co under timed conditions',
      'Submitted Week 1 homework on Practice Platform',
      'Reviewed marked feedback once available',
    ],
  },
  {
    num: 2,
    title: 'Risk Management & Hedging',
    topic: 'FX hedging, IR hedging, swaps, collars, futures, options',
    ...weekDates(2),
    marks: 25,
    tutorScenarios: ['Lurgshall Co', 'Boullain Co'],
    tbaTopics: ['fx', 'ir', 'risk'],
    tbaTheory: ['fx', 'ir', 'risk'],
    examinerCases: ['sd25-passmore', 'sd24-northney'],
    mowerEmphasis: 'Professional Skills marks — embed scepticism on every rate assumption.',
    exitCriteria: [
      'Watched Lurgshall & Boullain walkthroughs',
      'Drilled the four-step collar (buy floor put + sell cap call + net premium + outcome)',
      'Tabulated forward / MMH / futures / options for any FX scenario',
      'Submitted Week 2 homework',
    ],
  },
  {
    num: 3,
    title: 'Business Valuations',
    topic: 'FCFF, FCFE, multiples, dividend models, M&A premium',
    ...weekDates(3),
    marks: 50,
    tutorScenarios: ['(unlocks 11 May)'],
    tbaTopics: ['val', 'mna'],
    tbaTheory: ['val', 'mna'],
    examinerCases: ['sd24-zulla', 'sd25-halstock', 'mj25-kampai'],
    mowerEmphasis: '50-mark question technique — board paper format, recommendation upfront.',
    exitCriteria: [
      'Memorised FCFF→WACC, FCFE→Ke, EV − Debt = Equity bridge',
      'Practised two-stage DVM with explicit g_stable check',
      'Applied 3-column M&A table (stand-alone / with-synergy / max-bid)',
      'Submitted Week 3 homework (50 marks)',
    ],
  },
  {
    num: 4,
    title: 'Mock Preparation',
    topic: 'Full 100-mark mock under exam conditions',
    ...weekDates(4),
    marks: 100,
    tutorScenarios: ['(unlocks 18 May)'],
    tbaTopics: ['adviser', 'npv', 'apv', 'fx', 'ir', 'val', 'mna', 'real'],
    tbaTheory: ['behav', 'misc'],
    examinerCases: ['sd25-drimpton', 'mj25-kampai', 'sd25-halstock', 'sd25-passmore'],
    mowerEmphasis: 'Simulate exam conditions — start to finish in 3h 15m, no pause.',
    exitCriteria: [
      'Sat the full mock in 195 uninterrupted minutes',
      'Self-marked against the unlocked answer',
      'Identified 3 weakest topics to drill in Week 5',
      'Reviewed the four professional-skills bullets in own answers',
    ],
  },
  {
    num: 5,
    title: 'Exam Preparation',
    topic: 'Final tips, mindset, pre-exam mock, last-minute drills',
    ...weekDates(5),
    marks: 0,
    tutorScenarios: ['(unlocks 25 May)'],
    tbaTopics: ['adviser'],
    tbaTheory: ['misc'],
    examinerCases: ['sd25-drimpton', 'sd25-halstock', 'mj25-kampai'],
    mowerEmphasis: 'Just keep swimming. Trust the technique you have practiced.',
    exitCriteria: [
      'Completed both Self-Review Question 1 and 2',
      'Sat the Pre-Exam Mock',
      'Walked the War Room T-1 night and T-0 morning checklists',
      `Confirmed CBE access, ID and location for ${SITTING.examDayLabel}`,
    ],
  },
];

export const SH_KEY_DATES: { date: string; label: string; tone: 'info' | 'warn' | 'critical' }[] = [
  { date: SITTING.entryDeadlineAt, label: 'Standard exam entry deadline', tone: 'warn' },
  { date: SITTING.lateEntryDeadlineAt, label: 'Late exam entry deadline', tone: 'critical' },
  { date: `${SITTING.courseStartMonday}T05:00:00`, label: 'Course Week 1 unlocks', tone: 'info' },
  ...SH_WEEKS.slice(0, 4).map((week) => ({ date: week.homeworkDue, label: `Week ${week.num} homework due (${week.title})`, tone: 'warn' as const })),
  { date: SITTING.examAt, label: 'AFM EXAM DAY · confirm local time in myACCA', tone: 'critical' },
  { date: SITTING.resultsAt, label: 'Results released', tone: 'info' },
];

export const SH_TECHNICAL_ARTICLES = [
  { title: 'Patterns of behaviour', topic: 'behav' },
  { title: 'Green finance', topic: 'behav' },
  { title: 'Investment appraisal and real options', topic: 'real' },
  { title: 'Aspects of Islamic finance', topic: 'islam' },
  { title: 'Reverse takeovers', topic: 'mna' },
  { title: 'Risk Management', topic: 'risk' },
  { title: 'Answering a Question', topic: 'adviser' },
];

/** Auto-detect which course week the user is currently in. */
export function getCurrentShWeek(now = new Date()): { week: ShWeek | null; status: 'pre' | 'live' | 'post-course' | 'exam-week' } {
  const t = +now;
  const examT = +EXAM_DATE;
  if (t >= examT) return { week: null, status: 'post-course' };

  for (const w of SH_WEEKS) {
    const start = +new Date(`${w.weekStart}T00:00:00`);
    const end = +new Date(`${w.weekStart}T00:00:00`) + 7 * 86_400_000;
    if (t >= start && t < end) return { week: w, status: 'live' };
  }

  const lastWeek = SH_WEEKS[SH_WEEKS.length - 1];
  const lastEnd = +new Date(`${lastWeek.weekStart}T00:00:00`) + 7 * 86_400_000;
  if (t >= lastEnd && t < examT) return { week: lastWeek, status: 'exam-week' };

  // Pre-course: find the next upcoming week
  const nextWeek = SH_WEEKS.find((w) => +new Date(`${w.weekStart}T00:00:00`) > t) || SH_WEEKS[0];
  return { week: nextWeek, status: 'pre' };
}
