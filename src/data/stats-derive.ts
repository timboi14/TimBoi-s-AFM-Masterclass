/** Build-time-only canonical counter derivation. */
import { PAPERS } from '@/data/pastpapers/papers';
import { PRACTICE_SETS } from '@/data/practice';
import { THEORY } from '@/data/theory';
import { TOPIC_LIST } from '@/data/topics';
import { PITFALLS } from '@/data/pitfalls';
import { EXAM_CASES, EXAMINER_QUOTES } from '@/data/examiner';
import { SPOTLIGHTS } from '@/data/spotlights';
import { MNEMONICS } from '@/lib/mnemonics';
import { COMMON_LOSERS } from '@/data/war-room';
import { SH_WEEKS } from '@/data/shplus';

const sectionA50m = PAPERS.filter((p) => p.paperSection === 'A').length;
const sectionB25m = PAPERS.filter((p) => p.paperSection === 'B').length;
const totalDrills = TOPIC_LIST.reduce((n, t) => n + (t.drills?.length || 0), 0);
const totalFormulas = TOPIC_LIST.reduce((n, t) => n + (t.formulas?.length || 0), 0);
const totalPitfallsInTopics = TOPIC_LIST.reduce((n, t) => n + (t.pitfalls?.length || 0), 0);
const totalPracticeMarks = PRACTICE_SETS.reduce((n, s) => n + s.marks, 0);
const totalPracticeMinutes = PRACTICE_SETS.reduce((n, s) => n + s.minutes, 0);

export const TBA_STATS = {
  verifiedPapers: PAPERS.length,
  sectionA50m,
  sectionB25m,
  topicGroups: TOPIC_LIST.length,
  theoryQA: THEORY.length,
  workedDrills: totalDrills,
  practiceExams: PRACTICE_SETS.length,
  courseWeeks: SH_WEEKS.length,
  pitfalls: PITFALLS.length,
  examinerReports: EXAM_CASES.length,
  traps: COMMON_LOSERS.length,
  spreadsheetShortcuts: 8,
  cardDecks: 5,
  cheatSheets: 1,
  practiceMarks: totalPracticeMarks,
  practiceMinutes: totalPracticeMinutes,
  formulas: totalFormulas,
  pitfallsInTopics: totalPitfallsInTopics,
  examinerTraps: EXAM_CASES.reduce((n, c) => n + c.traps.length, 0),
  examinerQuotes: EXAMINER_QUOTES.length,
  warRoomTraps: COMMON_LOSERS.length,
  spotlights: SPOTLIGHTS.length,
  mnemonics: MNEMONICS.length,
} as const;
