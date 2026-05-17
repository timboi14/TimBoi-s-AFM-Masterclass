/**
 * ACCA AFM Study Guide capability grid (2025/26 syllabus, A1 → E5).
 *
 * tbaTopicId maps to a topic slug in src/data/topics.ts where coverage exists;
 * drillId maps to the matching worked drill. null on either field means
 * "coverage pending" — those rows are the next content-sprint targets.
 *
 * Source of truth for Work Item 11 of the Platinum-tier upgrade.
 */
export interface SyllabusCapability {
  ref: string;
  capability: string;
  tbaTopicId: string | null;
  drillId: string | null;
}

export const AFM_SYLLABUS: SyllabusCapability[] = [
  { ref: 'A1', capability: 'Role and responsibility towards stakeholders', tbaTopicId: 'adviser', drillId: 'MD1' },
  { ref: 'A2', capability: 'Environmental issues and ethical implications', tbaTopicId: 'adviser', drillId: 'MD1' },
  { ref: 'A3', capability: 'Financial strategy formulation', tbaTopicId: 'adviser', drillId: 'MD1' },
  { ref: 'B1', capability: 'Discounted cash flow techniques', tbaTopicId: 'npv', drillId: 'MD3' },
  { ref: 'B2', capability: 'Application of option pricing theory', tbaTopicId: 'real', drillId: 'MD5' },
  { ref: 'B3', capability: 'Impact of financing on investment decisions and adjusted PVs', tbaTopicId: 'apv', drillId: 'MD4' },
  { ref: 'B4', capability: 'Valuation and the use of free cash flows', tbaTopicId: 'val', drillId: 'MD9' },
  { ref: 'B5', capability: 'International investment and financing decisions', tbaTopicId: 'fx', drillId: 'MD6' },
  { ref: 'C1', capability: 'Acquisitions and mergers vs other growth', tbaTopicId: 'mna', drillId: 'MD8' },
  { ref: 'C2', capability: 'Valuation for acquisitions and mergers', tbaTopicId: 'mna', drillId: 'MD8' },
  { ref: 'C3', capability: 'Regulatory framework and processes', tbaTopicId: 'mna', drillId: 'MD8' },
  { ref: 'C4', capability: 'Financing acquisitions and mergers', tbaTopicId: 'mna', drillId: 'MD8' },
  { ref: 'D1', capability: 'Role of treasury function in multinationals', tbaTopicId: null, drillId: null },
  { ref: 'D2', capability: 'Conflict of interest and ethics', tbaTopicId: 'adviser', drillId: 'MD1' },
  { ref: 'D3', capability: 'Working capital management', tbaTopicId: null, drillId: null },
  { ref: 'D4', capability: 'Dividend policy', tbaTopicId: null, drillId: null },
  { ref: 'D5', capability: 'Currency risk management', tbaTopicId: 'fx', drillId: 'MD6' },
  { ref: 'D6', capability: 'Interest rate risk management', tbaTopicId: 'ir', drillId: 'MD7' },
  { ref: 'E1', capability: 'Strategic business and financial planning for multinationals', tbaTopicId: null, drillId: null },
  { ref: 'E2', capability: 'Conflicts in international financial management', tbaTopicId: 'fx', drillId: 'MD6' },
  { ref: 'E3', capability: 'Behavioural finance', tbaTopicId: 'behav', drillId: 'MD12' },
  { ref: 'E4', capability: 'Islamic finance', tbaTopicId: 'islam', drillId: 'MD10' },
  { ref: 'E5', capability: 'Emerging issues in finance and financial management', tbaTopicId: 'behav', drillId: 'MD12' },
];
