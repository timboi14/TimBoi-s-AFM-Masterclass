/**
 * Back-compat alias for the canonical TBA_STATS module.
 *
 * New code should import from `@/data/stats`. This file exists so the
 * pre-existing `siteStats.*` consumers across the codebase keep working
 * without a mass rename.
 */
import { TBA_STATS } from '@/data/stats';

export const siteStats = {
  practiceSets: TBA_STATS.practiceExams,
  practiceMarks: TBA_STATS.practiceMarks,
  practiceMinutes: TBA_STATS.practiceMinutes,
  theoryCards: TBA_STATS.theoryQA,
  topics: TBA_STATS.topicGroups,
  drills: TBA_STATS.workedDrills,
  formulas: TBA_STATS.formulas,
  pitfallsLibrary: TBA_STATS.pitfalls,
  pitfallsInTopics: TBA_STATS.pitfallsInTopics,
  examinerCases: TBA_STATS.examinerReports,
  examinerTraps: TBA_STATS.examinerTraps,
  examinerQuotes: TBA_STATS.examinerQuotes,
  warRoomTraps: TBA_STATS.warRoomTraps,
  spotlights: TBA_STATS.spotlights,
  mnemonics: TBA_STATS.mnemonics,
} as const;
