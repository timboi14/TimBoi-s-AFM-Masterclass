/**
 * Scout report seed — capability × frequency × last-seen × mark-winning technique.
 *
 * Schema mirrors the future `examiner_findings` table in packages/db/schema.ts
 * so this can be promoted server-side when DATABASE_URL lands without changing
 * the UI contract.
 *
 * Frequency is a count of distinct ACCA sittings 2020–2025 where the
 * capability appeared as the dominant marks centre of a question or part.
 * "Technique" is the one sentence a top candidate writes to earn the marks.
 */

export interface ScoutFinding {
  capability: string;       // 'A1'..'E5'
  topicId: string;          // matches src/data/topics.ts
  area: string;             // human label
  frequency: number;        // count of sittings 2020–2025
  lastSeen: string;         // sitting label e.g. 'Sep/Dec 2025'
  technique: string;        // the mark-winning move
}

export const SCOUT_FINDINGS: ScoutFinding[] = [
  {
    capability: 'B3', topicId: 'apv', area: 'Adjusted Present Value', frequency: 7, lastSeen: 'Sep/Dec 2025',
    technique: 'Separate base-case NPV (Keu) from financing side-effects (Kd or Rf for tax shield). Quote the assumption.',
  },
  {
    capability: 'B1', topicId: 'npv', area: 'Investment appraisal — NPV', frequency: 9, lastSeen: 'Sep/Dec 2025',
    technique: 'Pick nominal OR real and STAY there. One-year tax lag means Year-1 tax = on Year-1 profit, paid Year-2.',
  },
  {
    capability: 'B2', topicId: 'real', area: 'Real options / BSOP', frequency: 5, lastSeen: 'Sep/Dec 2024',
    technique: 'Map Pa, Pe, t, σ, r before plugging in. Pa = what you GET on exercise, Pe = what you PAY. Never flip.',
  },
  {
    capability: 'B5', topicId: 'fx', area: 'FX hedging', frequency: 8, lastSeen: 'Sep/Dec 2025',
    technique: 'Future-value the option premium to the hedge date. Compare forward, MMH, futures, option all at the same time horizon.',
  },
  {
    capability: 'C2', topicId: 'mna', area: 'M&A valuation', frequency: 6, lastSeen: 'Mar/Jun 2025',
    technique: '3-column table: stand-alone | with-synergy | max-bid. Max-bid retains some synergy for the acquirer.',
  },
  {
    capability: 'D5', topicId: 'fx', area: 'Currency risk management', frequency: 6, lastSeen: 'Sep/Dec 2025',
    technique: 'Identify direction first (paying or receiving), then pick the hedge that locks the right side of the rate.',
  },
  {
    capability: 'D6', topicId: 'ir', area: 'Interest rate risk', frequency: 4, lastSeen: 'Sep/Dec 2024',
    technique: 'Collar = buy cap + sell floor. Premium income from the floor partially funds the cap. Sketch both legs.',
  },
  {
    capability: 'B4', topicId: 'val', area: 'FCFF / business valuation', frequency: 5, lastSeen: 'Sep/Dec 2025',
    technique: 'FCFF starts from EBIT × (1−T) + Depreciation − ΔWC − Capex. Discount at WACC for whole-firm value.',
  },
  {
    capability: 'A2', topicId: 'adviser', area: 'ESG / Ethics', frequency: 5, lastSeen: 'Sep/Dec 2025',
    technique: 'Each ESG paragraph: issue → action → outcome WITH a £-figure or operational lever. No abstract hand-waving.',
  },
  {
    capability: 'C4', topicId: 'mna', area: 'Financing acquisitions', frequency: 3, lastSeen: 'Mar/Jun 2024',
    technique: 'Cash-and-shares lets target holders share both synergy upside and integration risk. State that explicitly.',
  },
  {
    capability: 'E3', topicId: 'behav', area: 'Behavioural finance', frequency: 3, lastSeen: 'Sep/Dec 2024',
    technique: 'Name the bias, link it to the scenario fact, recommend the de-biasing process (pre-mortem / red-team).',
  },
  {
    capability: 'E4', topicId: 'islam', area: 'Islamic finance', frequency: 2, lastSeen: 'Mar/Jun 2024',
    technique: 'Sukuk = ownership of an asset that pays returns from the asset, not interest. Murabaha = cost-plus sale.',
  },
];

/**
 * 7-rule pitfall cheat sheet — the rules every Section A answer must obey.
 * Drawn from the highest-frequency mark-loss patterns across examiner reports.
 * The order is fixed so it can be memorised as "LEAD-JUSTIFY-QUOTE-COMMENT-..."
 * (the Section A mantra).
 */
export interface ScoutRule {
  n: number;
  rule: string;
  detail: string;
  examinerEcho: string;
}

export const SCOUT_RULES: ScoutRule[] = [
  {
    n: 1,
    rule: 'Lead with a recommendation in sentence one.',
    detail: 'Mark schemes reward a clear "we should proceed / do not proceed" inside the first line of Section A. Bury it and you forfeit communication marks.',
    examinerEcho: 'The better candidates clearly identified and raised an issue and then recommended a suitable action.',
  },
  {
    n: 2,
    rule: 'Justify with the scenario\'s own numbers.',
    detail: 'Quote the £-figure, the %, the year-of-recovery. Generic theory unmoored from the scenario loses every analysis mark.',
    examinerEcho: 'Apply theoretical knowledge to the organisation — say why it may or may not work for THIS company in THIS situation.',
  },
  {
    n: 3,
    rule: 'Quote at least one named risk before the recommendation.',
    detail: 'Sensitivity to discount rate, FX exposure, integration cost, regulator referral — name one and tie a number to it.',
    examinerEcho: 'The skill of scepticism is not demonstrated very well by the majority of candidates.',
  },
  {
    n: 4,
    rule: 'Comment on the data gap.',
    detail: 'AFM questions almost always have missing data the examiner wants surfaced. List two and say what you\'d ask for.',
    examinerEcho: 'Raising an issue that is relevant given the scenario but not mentioned in the question shows good business thinking and will be rewarded.',
  },
  {
    n: 5,
    rule: 'Match the method to the question — don\'t volunteer.',
    detail: 'If the question asks for APV, do APV. Don\'t bolt on a WACC NPV to "be thorough" — it dilutes your time and earns nothing.',
    examinerEcho: 'Past questions have clearly indicated which method should be used.',
  },
  {
    n: 6,
    rule: 'ESG paragraphs need a £-figure or an operational lever.',
    detail: 'Issue → action → outcome WITH a quantification. "Reduce emissions" alone is 0 marks; "Reduce Scope 1 emissions by switching the Llandudno fleet to electric, capex £4m, payback 6 years" is 3.',
    examinerEcho: 'Candidates would often discuss issues that would arise due to negative comments rather than describing actions.',
  },
  {
    n: 7,
    rule: 'Future-value FX option premiums to the hedge date.',
    detail: 'Comparing a £-paid premium today against a $-receipt in 3 months without time-value adjustment makes options look artificially cheap. Examiners check this in every FX question.',
    examinerEcho: 'In general terms the futures hedge was handled better than the options hedge.',
  },
];
