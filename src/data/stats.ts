/**
 * Canonical site-wide counters — the SINGLE source of truth.
 *
 * Every number that appears as "X past papers" / "Y theory Q&A" / etc. across
 * Home, Past Papers, Playbook, Training, Scout, Boot Room MUST be imported
 * from here. Hardcoding stats inline causes them to drift the moment a new
 * card is added — that's the bug Work Item 2 closes.
 *
 * Numbers come from the underlying data arrays where possible (so a new
 * paper or topic auto-increments). The handful that aren't derivable from a
 * single array (mark splits, manual rollups) reference live data via
 * filters so they stay in sync.
 */
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
const verifiedPapers = PAPERS.length;

const totalDrills = TOPIC_LIST.reduce((n, t) => n + (t.drills?.length || 0), 0);
const totalFormulas = TOPIC_LIST.reduce((n, t) => n + (t.formulas?.length || 0), 0);
const totalPitfallsInTopics = TOPIC_LIST.reduce(
  (n, t) => n + (t.pitfalls?.length || 0),
  0,
);
const totalPracticeMarks = PRACTICE_SETS.reduce((n, s) => n + s.marks, 0);
const totalPracticeMinutes = PRACTICE_SETS.reduce((n, s) => n + s.minutes, 0);
const totalExaminerTraps = EXAM_CASES.reduce((n, c) => n + c.traps.length, 0);

export const TBA_STATS = {
  // Spec-named canonical fields ─────────────────────────────────────
  verifiedPapers,
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
  spreadsheetShortcuts: 8, // matches CALC_SHORTCUTS in src/pages/WarRoom.tsx

  // Existing internal counters preserved for back-compat (siteStats) ─
  practiceMarks: totalPracticeMarks,
  practiceMinutes: totalPracticeMinutes,
  formulas: totalFormulas,
  pitfallsInTopics: totalPitfallsInTopics,
  examinerTraps: totalExaminerTraps,
  examinerQuotes: EXAMINER_QUOTES.length,
  warRoomTraps: COMMON_LOSERS.length,
  spotlights: SPOTLIGHTS.length,
  mnemonics: MNEMONICS.length,
} as const;

export type TbaStats = typeof TBA_STATS;
