/**
 * Past-paper revision seed.
 *
 * - ACCA papers are linked out only (sourceUrl / examinerReportUrl).
 *   No copyrighted material is reproduced.
 * - TBA-original sets are bound by simulatorSetId so the existing
 *   /practice/:setId simulator is the source of truth.
 */
import type { Paper } from './schema';
import { PRACTICE_SETS } from '@/data/practice';

const ACCA_PAPERS_INDEX = 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/past-exam-papers.html';
const ACCA_REPORTS_INDEX = 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/examiners-reports1.html';

const accaPapers: Paper[] = [
  {
    id: 'sd-2025', label: 'September / December 2025', year: 2025, month: 'Dec',
    type: 'real', source: 'ACCA',
    sourceUrl: ACCA_PAPERS_INDEX,
    examinerReportUrl: ACCA_REPORTS_INDEX,
    questions: [
      { id: 'sd-2025-q1', number: 1, section: 'A', marks: 50, topics: ['npv', 'behav', 'fx'], syllabusAreas: ['B', 'E'], difficulty: 4, estMinutes: 90,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Drimpton Co',
        hookLine: 'International project appraisal + ESG (9-mark sub-part)' },
      { id: 'sd-2025-q2', number: 2, section: 'B', marks: 25, topics: ['val', 'mna'], syllabusAreas: ['C'], difficulty: 4, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Halstock Co',
        hookLine: 'FCFF business valuation + terminal value pitfalls' },
      { id: 'sd-2025-q3', number: 3, section: 'B', marks: 25, topics: ['fx'], syllabusAreas: ['E'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Passmore Co',
        hookLine: 'FX hedging — forward, futures, option (12-mark options sub-part)' },
    ],
  },
  {
    id: 'mj-2025', label: 'March / June 2025', year: 2025, month: 'Jun',
    type: 'real', source: 'ACCA',
    sourceUrl: ACCA_PAPERS_INDEX,
    examinerReportUrl: ACCA_REPORTS_INDEX,
    questions: [
      { id: 'mj-2025-q1', number: 1, section: 'A', marks: 50, topics: ['mna', 'behav'], syllabusAreas: ['C'], difficulty: 4, estMinutes: 90,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Kampai Co',
        hookLine: 'M&A with synergies + ESG (7-mark factory closure ethics)' },
      { id: 'mj-2025-q2', number: 2, section: 'B', marks: 25, topics: ['npv', 'real'], syllabusAreas: ['B'], difficulty: 4, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'NPV with sunk-cost trap + real option mapping' },
      { id: 'mj-2025-q3', number: 3, section: 'B', marks: 25, topics: ['ir'], syllabusAreas: ['E'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'Interest rate hedging — FRA, futures, swap' },
    ],
  },
  {
    id: 'sd-2024', label: 'September / December 2024', year: 2024, month: 'Dec',
    type: 'real', source: 'ACCA',
    sourceUrl: ACCA_PAPERS_INDEX,
    examinerReportUrl: ACCA_REPORTS_INDEX,
    questions: [
      { id: 'sd-2024-q1', number: 1, section: 'A', marks: 50, topics: ['ir', 'fx', 'risk'], syllabusAreas: ['E'], difficulty: 5, estMinutes: 90,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Northney Co',
        hookLine: 'Treasury risk — collar, multilateral netting (very low completion rate)' },
      { id: 'sd-2024-q2', number: 2, section: 'B', marks: 25, topics: ['val'], syllabusAreas: ['C'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Zulla Co',
        hookLine: 'FCFF business valuation' },
      { id: 'sd-2024-q3', number: 3, section: 'B', marks: 25, topics: ['adviser', 'val'], syllabusAreas: ['A', 'C'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX, caseName: 'Mortexa Co',
        hookLine: 'Senior adviser briefing + dividend valuation' },
    ],
  },
  {
    id: 'mj-2024', label: 'March / June 2024', year: 2024, month: 'Jun',
    type: 'real', source: 'ACCA',
    sourceUrl: ACCA_PAPERS_INDEX,
    examinerReportUrl: ACCA_REPORTS_INDEX,
    questions: [
      { id: 'mj-2024-q1', number: 1, section: 'A', marks: 50, topics: ['apv', 'coc', 'behav'], syllabusAreas: ['B'], difficulty: 4, estMinutes: 90,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'APV with subsidised loan + cost of capital' },
      { id: 'mj-2024-q2', number: 2, section: 'B', marks: 25, topics: ['real'], syllabusAreas: ['B'], difficulty: 4, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'Real options to expand + Black-Scholes mapping' },
      { id: 'mj-2024-q3', number: 3, section: 'B', marks: 25, topics: ['islam', 'val'], syllabusAreas: ['B', 'C'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'Islamic finance instruments + valuation' },
    ],
  },
  {
    id: 'sd-2023', label: 'September / December 2023', year: 2023, month: 'Dec',
    type: 'real', source: 'ACCA',
    sourceUrl: ACCA_PAPERS_INDEX,
    examinerReportUrl: ACCA_REPORTS_INDEX,
    questions: [
      { id: 'sd-2023-q1', number: 1, section: 'A', marks: 50, topics: ['npv', 'fx'], syllabusAreas: ['B', 'E'], difficulty: 4, estMinutes: 90,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'International NPV with FX exposure' },
      { id: 'sd-2023-q2', number: 2, section: 'B', marks: 25, topics: ['mna'], syllabusAreas: ['C'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'M&A bid price + synergy classification' },
      { id: 'sd-2023-q3', number: 3, section: 'B', marks: 25, topics: ['ir'], syllabusAreas: ['E'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: ACCA_PAPERS_INDEX,
        hookLine: 'Swap mechanics + QSD' },
    ],
  },
  {
    id: 'specimen', label: 'CBE Specimen', year: 2024, month: 'Mar',
    type: 'specimen', source: 'ACCA',
    sourceUrl: 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/specimen-exams.html',
    questions: [
      { id: 'specimen-q1', number: 1, section: 'A', marks: 50, topics: ['adviser', 'npv'], syllabusAreas: ['A', 'B'], difficulty: 3, estMinutes: 90,
        questionAssetUrl: 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/specimen-exams.html',
        hookLine: 'CBE Section A specimen — board paper format' },
      { id: 'specimen-q2', number: 2, section: 'B', marks: 25, topics: ['val'], syllabusAreas: ['C'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/specimen-exams.html' },
      { id: 'specimen-q3', number: 3, section: 'B', marks: 25, topics: ['fx'], syllabusAreas: ['E'], difficulty: 3, estMinutes: 45,
        questionAssetUrl: 'https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/specimen-exams.html' },
    ],
  },
];

/* Internal TBA-original sets bound to the existing /practice simulator. */
const TOPIC_AREA: Record<string, ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[]> = {
  adviser: ['A'],
  coc: ['B'], npv: ['B'], apv: ['B'], real: ['B'], val: ['B', 'C'],
  mna: ['C'],
  islam: ['B'],
  fx: ['E'], ir: ['E'], risk: ['E'],
  behav: ['A'],
};

const tbaPapers: Paper[] = PRACTICE_SETS.map((s, i) => {
  const tutorTopic = s.topic.toLowerCase();
  const topicId =
    /apv|international/.test(tutorTopic) ? 'apv' :
    /npv/.test(tutorTopic) ? 'npv' :
    /real option|black/.test(tutorTopic) ? 'real' :
    /m\&a|synergy|valuation|fcff|fcfe/.test(tutorTopic) ? 'val' :
    /mna|takeover|bootstrap/.test(tutorTopic) ? 'mna' :
    /fx|forex|currency/.test(tutorTopic) ? 'fx' :
    /ir|interest|swap|fra|collar/.test(tutorTopic) ? 'ir' :
    /islam|sukuk/.test(tutorTopic) ? 'islam' :
    /var|risk|monte|sensitivity/.test(tutorTopic) ? 'risk' :
    /behav|esg|ethic/.test(tutorTopic) ? 'behav' :
    /adviser|board/.test(tutorTopic) ? 'adviser' : 'adviser';
  return {
    id: `tba-${s.id}`,
    label: `TBA Set ${s.number} · ${s.club}`,
    year: 2026,
    month: ((['Mar', 'Jun', 'Sep', 'Dec'] as const)[i % 4]),
    type: 'tba-original',
    source: 'internal',
    questions: [{
      id: `tba-${s.id}-q1`,
      number: 1,
      section: s.section,
      marks: s.marks,
      topics: [topicId],
      syllabusAreas: TOPIC_AREA[topicId] || ['B'],
      difficulty: (s.marks >= 50 ? 4 : 3) as 3 | 4,
      estMinutes: s.minutes,
      questionAssetUrl: `/practice/${s.id}`,
      simulatorSetId: s.id,
      caseName: s.club,
      hookLine: s.topic,
    }],
  };
});

export const PAPERS: Paper[] = [...accaPapers, ...tbaPapers];

export function getPaper(id: string): Paper | undefined {
  return PAPERS.find((p) => p.id === id);
}
export function getQuestion(paperId: string, qNo: number) {
  const p = getPaper(paperId);
  return p?.questions.find((q) => q.number === qNo);
}
