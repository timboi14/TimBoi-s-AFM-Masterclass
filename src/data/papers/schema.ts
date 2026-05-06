/**
 * Past-paper revision schema. No copyrighted PDFs are hosted; ACCA papers
 * are linked out via sourceUrl, internal sets are bound by simulatorSetId.
 */

export type PaperType = 'real' | 'mock' | 'pre-mock' | 'specimen' | 'tba-original';
export type PaperSource = 'ACCA' | 'internal' | 'licensed';
export type Section = 'A' | 'B';
export type SyllabusArea = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type Month = 'Mar' | 'Jun' | 'Sep' | 'Dec';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface PaperQuestion {
  id: string;
  number: number;
  section: Section;
  marks: number;
  topics: string[];                  // ids that match TOPICS in src/data/topics.ts
  syllabusAreas: SyllabusArea[];
  difficulty: Difficulty;
  estMinutes: number;
  questionAssetUrl: string;          // ACCA URL or /practice/:setId
  answerAssetUrl?: string;
  simulatorSetId?: string;           // present when bound to internal /practice/:set
  caseName?: string;                 // e.g. "Drimpton Co"
  hookLine?: string;                 // optional one-liner in the index
}

export interface Paper {
  id: string;
  label: string;
  year: number;
  month: Month;
  type: PaperType;
  source: PaperSource;
  sourceUrl?: string;
  examinerReportUrl?: string;
  questions: PaperQuestion[];
}

export type AttemptRating = 'again' | 'hard' | 'good' | 'easy';

export interface AttemptLog {
  id: string;
  questionId: string;
  paperId: string;
  startedAt: number;
  finishedAt?: number;
  selfScore?: number;                // 0..marks
  selfRating: AttemptRating;
  notes?: string;
  revealed?: boolean;
}
