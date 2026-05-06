/**
 * AFM Resit Course (June 2026 sitting) integration data.
 * Mirrors the official course schedule the user is following so progress
 * in one platform reinforces the other. User-facing copy is generic
 * (no name-drops); internal field names retained for compatibility.
 */

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
    weekStart: '2026-04-27',
    homeworkDue: '2026-05-03T23:59:00',
    answerUnlocks: '2026-05-04T05:00:00',
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
    weekStart: '2026-05-04',
    homeworkDue: '2026-05-10T23:59:00',
    answerUnlocks: '2026-05-11T05:00:00',
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
    weekStart: '2026-05-11',
    homeworkDue: '2026-05-17T23:59:00',
    answerUnlocks: '2026-05-18T05:00:00',
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
    weekStart: '2026-05-18',
    homeworkDue: '2026-05-24T23:59:00',
    answerUnlocks: '2026-05-25T05:00:00',
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
    weekStart: '2026-05-25',
    homeworkDue: '2026-06-04T23:59:00',
    answerUnlocks: '2026-06-05T05:00:00',
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
      'Confirmed CBE access, ID, location for 5 June 2026',
    ],
  },
];

export const SH_KEY_DATES: { date: string; label: string; tone: 'info' | 'warn' | 'critical' }[] = [
  { date: '2026-04-16T23:59:00', label: 'Exam entry deadline', tone: 'warn' },
  { date: '2026-04-20T05:00:00', label: 'Course Week 1 unlocks', tone: 'info' },
  { date: '2026-05-03T23:59:00', label: 'Week 1 homework due (Investment Appraisal)', tone: 'warn' },
  { date: '2026-05-10T23:59:00', label: 'Week 2 homework due (Hedging)', tone: 'warn' },
  { date: '2026-05-17T23:59:00', label: 'Week 3 homework due (Valuations 50m)', tone: 'warn' },
  { date: '2026-05-24T23:59:00', label: 'Week 4 mock due (100 marks)', tone: 'warn' },
  { date: '2026-06-05T09:00:00', label: 'EXAM DAY · 09:00', tone: 'critical' },
  { date: '2026-07-13T05:00:00', label: 'Results released', tone: 'info' },
];

export const SH_SUPPORT = {
  expert: { name: 'Lead Tutor', role: 'Course Expert', linkedin: 'https://www.linkedin.com/in/andrewmower/' },
  tutors: ['Support Tutor 1', 'Support Tutor 2'],
  email: 'studyhubplus@accaglobal.com',
  whatsapp: '+44 7418 311387',
  whatsappNote: 'Responses typically within 24 hours',
  assistant: {
    url: 'https://learning.accaglobal.com/',
    note: '24/7 AI support inside the course portal. First-time login uses your ACCA ID (omit any leading zero).',
  },
};

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
  const examT = +new Date('2026-06-05T09:00:00');
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
