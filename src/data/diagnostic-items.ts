/**
 * Seed item bank for the /start/diagnostic adaptive screener.
 *
 * Spec §6: 10-question adaptive diagnostic across the 23 AFM capabilities.
 * Items use 2-parameter logistic IRT calibration:
 *   a = discrimination (1.0 = average, >1.5 sharper, <0.7 fuzzier)
 *   b = difficulty on the θ scale (0 = median candidate, +2 = hard, -2 = easy)
 *
 * Calibration here is expert-judged rather than empirically fit — once enough
 * users have taken the diagnostic we can re-fit (a,b) from response data and
 * persist the updated bank to the DB (Sprint 3).
 *
 * Coverage rule: at least one item per syllabus capability (A1..E5 = 23
 * capabilities) plus a handful of harder items in core areas (NPV, APV,
 * BSOP, FX, M&A) so the adaptive engine has room to discriminate at high θ.
 */

export type Capability =
  | 'A1' | 'A2' | 'A3'
  | 'B1' | 'B2' | 'B3' | 'B4' | 'B5'
  | 'C1' | 'C2' | 'C3' | 'C4'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6'
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5';

export interface DiagItem {
  id: string;
  capability: Capability;
  /** Question stem — kept short enough to read on a phone in <30s. */
  stem: string;
  /** Four-option MCQ. correctIdx is the index of the right answer. */
  options: [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  /** Optional one-sentence rationale shown after the user answers. */
  rationale?: string;
  /** IRT 2-PL discrimination. */
  a: number;
  /** IRT 2-PL difficulty on the θ scale. */
  b: number;
}

export const DIAGNOSTIC_ITEMS: DiagItem[] = [
  // ─── A · Role of senior financial adviser ─────────────────────────────────
  {
    id: 'A1-stake', capability: 'A1', a: 1.0, b: -0.5,
    stem: 'When stakeholder interests conflict, an AFM-level recommendation should:',
    options: [
      'Prioritise shareholder wealth strictly above all other stakeholders',
      'Identify and weigh competing stakeholder claims and propose a balanced action',
      'Defer to government regulation only',
      'Always favour the largest creditor',
    ],
    correctIdx: 1,
    rationale: 'AFM expects stakeholder mapping plus a justified, balanced recommendation.',
  },
  {
    id: 'A2-esg', capability: 'A2', a: 1.1, b: 0,
    stem: 'An ESG-relevant pitfall most often penalised by ACCA examiners is:',
    options: [
      'Mentioning ESG once without a £-figure or operational lever',
      'Discussing scope 1 vs scope 2 emissions in detail',
      'Identifying the social discount rate',
      'Quantifying the carbon price per tonne',
    ],
    correctIdx: 0,
    rationale: 'ESG must move from abstract to action and number — "soft mention" is the trap.',
  },
  {
    id: 'A3-finstrat', capability: 'A3', a: 1.0, b: 0.3,
    stem: 'Financial strategy formulation at AFM level must align:',
    options: [
      'Funding mix, dividend policy, and investment decisions with corporate objectives',
      'Working capital cycles with HR planning',
      'Tax planning with audit fees',
      'CFO bonus with operational KPIs',
    ],
    correctIdx: 0,
  },

  // ─── B · Advanced investment appraisal ────────────────────────────────────
  {
    id: 'B1-npv', capability: 'B1', a: 1.4, b: -0.2,
    stem: 'In a UK NPV proforma with one-year tax lag, the year-1 tax cash flow relates to:',
    options: ['Year-0 profit', 'Year-1 profit', 'Year-2 profit', 'Average annual profit'],
    correctIdx: 1,
    rationale: 'Tax is paid one year in arrears — Year-1 cash flow = tax on Year-1 profit if lag is "one year".',
  },
  {
    id: 'B1-npv-hard', capability: 'B1', a: 1.5, b: 1.2,
    stem: 'A 4-year project with no tax lag, year-0 setup cost, and inflation-adjusted operating cash flows is appraised at money WACC. The discount factor in year 0 is:',
    options: ['1.0', '1/(1+WACC)', '(1+i)/(1+WACC)', 'Undefined — year 0 is a sunk cost'],
    correctIdx: 0,
    rationale: 'Year-0 cash flows are not discounted; PV factor is 1.0.',
  },
  {
    id: 'B2-bsop', capability: 'B2', a: 1.3, b: 0.5,
    stem: 'In a Black-Scholes valuation of a real option to expand, increasing volatility σ:',
    options: [
      'Decreases the option value',
      'Increases the option value',
      'Has no effect on option value',
      'Only matters for European put options',
    ],
    correctIdx: 1,
    rationale: 'Option value is non-decreasing in volatility — upside grows, downside is capped at zero.',
  },
  {
    id: 'B3-apv', capability: 'B3', a: 1.3, b: 0.4,
    stem: 'APV is preferred over standard NPV when:',
    options: [
      'The capital structure is constant throughout the project',
      'The project changes the firm\'s capital structure or has subsidised debt',
      'The risk-free rate is uncertain',
      'There is no tax shield available',
    ],
    correctIdx: 1,
  },
  {
    id: 'B4-fcff', capability: 'B4', a: 1.2, b: 0.2,
    stem: 'FCFF for valuation is computed as:',
    options: [
      'EBIT × (1 − T) + Depreciation − ΔWC − Capex',
      'PAT + Interest × (1 − T)',
      'PBT − Tax − Dividends',
      'Operating cash flow − Tax paid',
    ],
    correctIdx: 0,
    rationale: 'FCFF starts from after-tax operating profit and adjusts back to a cash basis.',
  },
  {
    id: 'B5-intl', capability: 'B5', a: 1.0, b: 0.6,
    stem: 'When discounting a foreign-currency project at the foreign WACC, the resulting NPV is then:',
    options: [
      'Converted at spot rate',
      'Converted at expected future spot from PPP/IRP',
      'Converted at the forward rate of year 1',
      'Left in foreign currency — no conversion needed',
    ],
    correctIdx: 0,
    rationale: 'When you discount in foreign currency at foreign WACC, convert the resulting NPV at today\'s spot.',
  },

  // ─── C · Acquisitions and mergers ─────────────────────────────────────────
  {
    id: 'C1-organic', capability: 'C1', a: 0.9, b: -0.1,
    stem: 'Compared to organic growth, M&A offers the strongest advantage in:',
    options: [
      'Speed of access to new markets or capabilities',
      'Lower management distraction',
      'Predictable integration cost',
      'Guaranteed cost synergies',
    ],
    correctIdx: 0,
  },
  {
    id: 'C2-syn', capability: 'C2', a: 1.4, b: 0.8,
    stem: 'In a 3-column M&A table (stand-alone | with-synergy | max-bid), the max-bid figure should:',
    options: [
      'Equal the target\'s stand-alone valuation',
      'Equal the with-synergy valuation',
      'Allow the acquirer to retain at least some of the synergy value',
      'Be set by competitor bid history',
    ],
    correctIdx: 2,
    rationale: 'Max-bid is with-synergy minus the synergy share the acquirer wants to retain.',
  },
  {
    id: 'C3-reg', capability: 'C3', a: 1.0, b: 0.5,
    stem: 'A bid that breaches a competition threshold triggers:',
    options: [
      'Automatic deal approval',
      'A regulatory referral and possible remedies (divestments)',
      'Dilution of voting rights',
      'A mandatory tender offer to minority holders only',
    ],
    correctIdx: 1,
  },
  {
    id: 'C4-fin', capability: 'C4', a: 1.1, b: 0.6,
    stem: 'A cash-and-shares offer compared to all-cash:',
    options: [
      'Always destroys value for the acquirer',
      'Shares the integration risk with the target shareholders',
      'Avoids any change in capital structure',
      'Removes the need to value the target',
    ],
    correctIdx: 1,
    rationale: 'Mixed consideration lets target shareholders share both synergy upside and integration risk.',
  },

  // ─── D · Corporate reconstruction & reorganisation / treasury ─────────────
  {
    id: 'D1-treas', capability: 'D1', a: 1.0, b: 0.2,
    stem: 'A centralised group treasury reduces FX exposure mainly via:',
    options: [
      'Multilateral netting and pooling',
      'Outsourcing all hedging to a bank',
      'Eliminating intercompany loans',
      'Mandatory forward contracts on every receipt',
    ],
    correctIdx: 0,
  },
  {
    id: 'D2-ethics', capability: 'D2', a: 0.9, b: -0.3,
    stem: 'A treasury policy that hides FX losses inside operating costs creates which conflict?',
    options: ['No conflict if disclosed in notes', 'Earnings-management conflict between transparency and managerial bonus', 'A regulatory conflict only', 'A tax conflict only'],
    correctIdx: 1,
  },
  {
    id: 'D3-wc', capability: 'D3', a: 0.9, b: 0,
    stem: 'A negative cash operating cycle indicates:',
    options: [
      'The firm pays suppliers before customers pay',
      'The firm collects from customers before paying suppliers',
      'Inventory turnover is zero',
      'The firm is technically insolvent',
    ],
    correctIdx: 1,
    rationale: 'Negative cycle = working capital is funded by suppliers — a strong cash position.',
  },
  {
    id: 'D4-div', capability: 'D4', a: 1.0, b: 0.4,
    stem: 'A dividend signalling argument predicts that a cut is interpreted as:',
    options: ['A positive growth signal', 'A negative signal about future earnings', 'Neutral — markets ignore it', 'A tax-driven decision'],
    correctIdx: 1,
  },
  {
    id: 'D5-fx', capability: 'D5', a: 1.4, b: 0.5,
    stem: 'A UK firm with a USD receivable in 3 months can hedge with all of the following EXCEPT:',
    options: ['Forward sale of USD', 'Money-market hedge: borrow USD now, deposit GBP', 'Option to sell USD at a strike', 'Option to BUY USD at a strike'],
    correctIdx: 3,
    rationale: 'Selling USD receivable → need to LOCK a sell rate. Buying USD options doesn\'t hedge it.',
  },
  {
    id: 'D5-fx-hard', capability: 'D5', a: 1.4, b: 1.4,
    stem: 'Premium on a 3-month £ put option is paid in £. In a comparative-currency table, this premium should be:',
    options: [
      'Future-valued to the hedge date at the £ deposit rate before comparison',
      'Added at face value with no time adjustment',
      'Converted to USD at spot',
      'Ignored entirely',
    ],
    correctIdx: 0,
    rationale: 'AFM requires premium future-valued to hedge date for a fair like-for-like FX hedge comparison.',
  },
  {
    id: 'D6-ir', capability: 'D6', a: 1.2, b: 0.4,
    stem: 'A borrower with floating-rate debt hedges rising rates by:',
    options: [
      'Buying a cap (call on rates / put on price)',
      'Buying a floor (put on rates / call on price)',
      'Selling a forward rate agreement (FRA) at the current rate',
      'Doing nothing — natural hedge from inflation',
    ],
    correctIdx: 0,
  },

  // ─── E · Strategic / behavioural / Islamic / emerging ─────────────────────
  {
    id: 'E1-multinat', capability: 'E1', a: 0.9, b: 0.5,
    stem: 'A multinational planning a strategic move into Country X should NOT use:',
    options: [
      'Country-risk premium added to discount rate',
      'PEST analysis of host conditions',
      'A single uniform discount rate identical to home country WACC',
      'Real options analysis for entry timing',
    ],
    correctIdx: 2,
  },
  {
    id: 'E2-conflict', capability: 'E2', a: 1.0, b: 0.6,
    stem: 'A subsidiary remits dividends to the parent in a country with a top-up tax. The headline conflict is between:',
    options: [
      'Local reinvestment to defer tax vs. parent\'s cash needs',
      'Lawyer fees vs. accountant fees',
      'IFRS vs. local GAAP',
      'Pre-tax vs. post-tax cash flow definitions',
    ],
    correctIdx: 0,
  },
  {
    id: 'E3-behav', capability: 'E3', a: 1.2, b: 0.7,
    stem: 'Anchoring bias in M&A typically shows up as:',
    options: [
      'Excess weight placed on the initial bid or a past valuation',
      'Refusing to value the target',
      'Always overpaying due to overconfidence',
      'Avoiding all reference points',
    ],
    correctIdx: 0,
    rationale: 'Anchor = the initial reference number sticks even after new evidence arrives.',
  },
  {
    id: 'E4-islam', capability: 'E4', a: 1.1, b: 0.8,
    stem: 'A Sukuk differs from a conventional bond in that it:',
    options: [
      'Pays fixed interest by contract',
      'Represents ownership of an underlying asset and shares its returns',
      'Carries no credit risk',
      'Is always equity, not debt',
    ],
    correctIdx: 1,
  },
  {
    id: 'E5-emerging', capability: 'E5', a: 0.9, b: 0.9,
    stem: 'An "emerging finance" topic ACCA increasingly tests is:',
    options: [
      'Cryptoasset risk and decentralised finance governance',
      'Pre-1980s capital structure theory',
      'Manual cheque processing',
      'Telex-based FX confirmations',
    ],
    correctIdx: 0,
  },
];
