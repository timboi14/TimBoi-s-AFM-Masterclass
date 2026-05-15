/**
 * Single source of truth for site-wide counters.
 *
 * Every number that appears as "X practice exams" / "Y theory cards" / etc.
 * MUST be derived from this object. Never hardcode counts in pages — they
 * drift the moment a card is added.
 */
import { PRACTICE_SETS } from '@/data/practice';
import { THEORY } from '@/data/theory';
import { TOPIC_LIST } from '@/data/topics';
import { PITFALLS } from '@/data/pitfalls';
import { EXAM_CASES } from '@/data/examiner';
import { SPOTLIGHTS } from '@/data/spotlights';
import { MNEMONICS } from '@/lib/mnemonics';
import { COMMON_LOSERS } from '@/pages/WarRoom';
import { EXAMINER_QUOTES } from '@/data/examiner';

const totalDrills = TOPIC_LIST.reduce((n, t) => n + (t.drills?.length || 0), 0);
const totalFormulas = TOPIC_LIST.reduce((n, t) => n + (t.formulas?.length || 0), 0);
const totalPitfallsInTopics = TOPIC_LIST.reduce((n, t) => n + (t.pitfalls?.length || 0), 0);
const totalPracticeMarks = PRACTICE_SETS.reduce((n, s) => n + s.marks, 0);
const totalPracticeMinutes = PRACTICE_SETS.reduce((n, s) => n + s.minutes, 0);
const totalExaminerTraps = EXAM_CASES.reduce((n, c) => n + c.traps.length, 0);

export const siteStats = {
  practiceSets: PRACTICE_SETS.length,
  practiceMarks: totalPracticeMarks,
  practiceMinutes: totalPracticeMinutes,
  theoryCards: THEORY.length,
  topics: TOPIC_LIST.length,
  drills: totalDrills,
  formulas: totalFormulas,
  pitfallsLibrary: PITFALLS.length,
  pitfallsInTopics: totalPitfallsInTopics,
  examinerCases: EXAM_CASES.length,
  examinerTraps: totalExaminerTraps,
  examinerQuotes: EXAMINER_QUOTES.length,
  warRoomTraps: COMMON_LOSERS.length,
  spotlights: SPOTLIGHTS.length,
  mnemonics: MNEMONICS.length,
} as const;

type SiteStats = typeof siteStats;
