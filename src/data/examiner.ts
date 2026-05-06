/**
 * Examiner Reports digest — Sep/Dec 2024 to Sep/Dec 2025.
 * Concrete case-by-case traps with the fix.
 * Source: ACCA Global examiner reports for AFM (P4).
 */

export interface ExamCase {
  id: string;
  paper: string;
  company: string;
  topic: string;
  marks: number;
  traps: { what: string; why: string; fix: string }[];
  examinerQuote?: string;
  techniqueWin: string;
}

export interface ExaminerQuote {
  text: string;
  paper: string;
  category: 'scepticism' | 'esg' | 'analysis' | 'communication' | 'commercial';
}

export const EXAM_CASES: ExamCase[] = [
  {
    id: 'sd25-drimpton',
    paper: 'Sep/Dec 2025 · Q1',
    company: 'Drimpton Co',
    topic: 'International project appraisal + ESG (50 marks, 9 marks of which ESG)',
    marks: 50,
    traps: [
      {
        what: 'CTA single-market advantages discussion was shallow',
        why: 'Candidates listed generic "comparative advantage" prose without naming Drimpton-specific drivers (skilled labour, supplier ecosystem, FX hedging savings).',
        fix: 'For every advantage, name the SPECIFIC scenario fact that supports it. "Skilled labour pool of 12,000 engineers within 50km" beats "access to talent."',
      },
      {
        what: 'ESG done generically',
        why: 'Generic "be more sustainable" prose was transferable to any company. Examiner: candidates discussed problems without recommending costed actions.',
        fix: 'Issue (specific) → Action (costed) → Outcome (quantified) → Stakeholder. Three sentences, three marks.',
      },
      {
        what: 'FX assumptions unchallenged',
        why: 'Almost no candidates questioned the static USD/GBP rate over a 5-year horizon.',
        fix: 'In W3, write: "Assumed USD/GBP 1.27 constant. Sensitivity: 10% adverse FX wipes 18% of NPV." That sentence is one scepticism mark.',
      },
    ],
    examinerQuote: 'Candidates would often discuss issues that would arise rather than describing actions that could be taken to address the issue.',
    techniqueWin: 'Quote 3 scenario figures per ESG paragraph. Tie each E/S/G point to a specific stakeholder by name (community, regulator, debt covenant).',
  },
  {
    id: 'sd25-halstock',
    paper: 'Sep/Dec 2025 · Section B',
    company: 'Halstock Co',
    topic: 'Business valuation (FCFF + terminal value)',
    marks: 25,
    traps: [
      {
        what: 'Plugged a growth rate into the perpetuity when scenario said "all variables remain the same after Y4"',
        why: '"Variables remain the same" = ZERO growth. Many candidates assumed g = 2% by reflex.',
        fix: 'Read the scenario for the explicit growth signal. If silent or "remain the same", g = 0.',
      },
      {
        what: 'Forgot to discount the terminal value back to PV',
        why: 'Terminal value at Y4 must be discounted by (1 + WACC)^4 to today.',
        fix: 'TV always sits at the end of the explicit forecast. Multiply by the year-n discount factor BEFORE adding to other PVs.',
      },
      {
        what: 'Omitted the 15:85 debt:equity split when extracting equity value',
        why: 'FCFF gives Enterprise Value. Equity = EV − debt. Candidates returned EV as the answer.',
        fix: 'Always write a final line: "EV £X, less debt £Y, equity value £Z." This earns the structural mark even with arithmetic errors.',
      },
    ],
    techniqueWin: 'When using FCFF, always end with the EV → debt → equity bridge. One line earns the mark.',
  },
  {
    id: 'sd25-passmore',
    paper: 'Sep/Dec 2025 · Section B',
    company: 'Passmore Co',
    topic: 'FX hedging — forward, futures, option (12 marks)',
    marks: 25,
    traps: [
      {
        what: 'Option hedge mis-priced',
        why: 'Wrong strike selected for the requirement; net premium computed in wrong currency; rounded contract count down instead of up.',
        fix: 'Select strike based on requirement direction. Premium in same currency as the underlying. ALWAYS round contract count UP (over-hedge slightly to fully cover).',
      },
      {
        what: 'Premium not future-valued',
        why: 'Premium is paid today; the cash flow being hedged occurs at maturity. Comparing them on different dates is wrong.',
        fix: 'Future-value the premium at the deposit rate to the cash-flow date. Then add to the net hedged outcome.',
      },
    ],
    examinerQuote: 'In general terms the futures hedge was handled better than the options hedge.',
    techniqueWin: 'Always present hedges in a side-by-side table: Forward | MMH | Futures | Option. Then recommend the cheapest with one risk note.',
  },
  {
    id: 'mj25-kampai',
    paper: 'Mar/Jun 2025 · Q1',
    company: 'Kampai Co',
    topic: 'M&A with synergies and ESG (50 marks)',
    marks: 50,
    traps: [
      {
        what: 'Treated $42.3m one-off closure gain as a recurring annual synergy',
        why: 'Discounted the $42.3m as if it appeared every year. Inflated the valuation materially.',
        fix: 'Tag every synergy as ONE-OFF or ANNUITY at the start. One-off goes in year 1 only; annuity uses a perpetuity factor.',
      },
      {
        what: 'Ignored the $4.8m recurring annual synergy',
        why: 'Candidates fixated on the headline one-off and missed the recurring stream.',
        fix: 'List EVERY synergy in the workings table before discounting. Force yourself to account for each line in the scenario.',
      },
      {
        what: 'Used analyst $145.8m estimate of Marnhall instead of $160m offer price',
        why: 'In M&A, the OFFER price drives gain-to-target; the analyst estimate is the buyer ceiling, not the gain calculation.',
        fix: 'Gain to target = offer received − stand-alone value. Gain to acquirer = synergy − premium paid above stand-alone. Different inputs.',
      },
      {
        what: 'ESG (7 marks) skipped or run out of time',
        why: 'Last requirement of Section A. Candidates over-spent time on calculations.',
        fix: 'When ESG appears as the final part, START the ESG paragraph at the time-budget mark. Three sentences earns 3 marks even with calcs unfinished.',
      },
    ],
    examinerQuote: 'The better candidates clearly identified and raised an issue and then recommended a suitable action that the company could take to overcome the issue.',
    techniqueWin: 'In any M&A scenario: build a 3-column table (stand-alone | with-synergy | max-bid). Tag each synergy one-off or annuity. Quote the ACTUAL offer price.',
  },
  {
    id: 'sd24-northney',
    paper: 'Sep/Dec 2024 · Q1',
    company: 'Northney Co',
    topic: 'Treasury risk management — collar, multilateral netting (50 marks)',
    marks: 50,
    traps: [
      {
        what: 'Very few candidates completed the collar calculation',
        why: 'Collar = buy floor put + sell cap call. Net premium calc, three rate scenarios, effective $ outcome — full sequence missed by most.',
        fix: 'Drill collars 3 times before the exam. Practice the four-step: (1) buy put + sell call, (2) net premium, (3) outcome at low/mid/high rate, (4) effective.',
      },
      {
        what: 'Multilateral netting tables done badly',
        why: 'Candidates computed the net but did not show the SETTLEMENT SEQUENCE.',
        fix: 'Two tables: one for the gross matrix, one for the netted settlements (who pays whom how much). Examiner explicitly praised this layout.',
      },
      {
        what: 'Scepticism rarely shown on the rate assumptions',
        why: 'Candidates accepted the given rates as fact without challenge.',
        fix: 'In every treasury answer, write one line: "The forecast rate of X% should be sensitivity-tested at +/- 50 basis points; the recommendation could flip if rates move beyond Y."',
      },
    ],
    examinerQuote: 'Very few candidates were able to successfully complete a collar calculation even though similar calculations have been included in previous exam questions.',
    techniqueWin: 'For treasury questions: tabulate every hedge outcome at three rate scenarios. Net premium clearly. Recommend with a sensitivity caveat.',
  },
  {
    id: 'sd24-zulla',
    paper: 'Sep/Dec 2024 · Section B',
    company: 'Zulla Co',
    topic: 'FCFF business valuation',
    marks: 25,
    traps: [
      {
        what: 'Discounted FCFF at Ke instead of WACC',
        why: 'FCFF belongs to the WHOLE FIRM (debt + equity), so it must be discounted at the firm-level rate (WACC).',
        fix: 'Mnemonic: "F goes with W, E goes with E." FCFF→WACC, FCFE→Ke.',
      },
      {
        what: 'Deducted interest from FCFF',
        why: 'Interest belongs to debt holders. WACC already accounts for the cost of debt. Deducting interest from FCFF AND discounting at WACC double-counts.',
        fix: 'FCFF formula: EBIT(1-T) + Dep − Capex − ΔWC. NO interest deduction.',
      },
      {
        what: 'Forgot to subtract debt to get equity value',
        why: 'FCFF discounted at WACC gives ENTERPRISE VALUE, not equity value.',
        fix: 'Final step always: EV − debt = equity value. Write the bridge explicitly.',
      },
    ],
    examinerQuote: 'Free cash flows to the whole firm should be discounted at the discount rate relevant to the whole firm, which is the weighted average cost of capital.',
    techniqueWin: 'Memorise the bridge: EBIT(1-T) + Dep − Capex − ΔWC = FCFF → ÷ WACC = EV → minus Debt = Equity.',
  },
  {
    id: 'mj25-sunkcost',
    paper: 'Mar/Jun 2025 · Q1',
    company: 'NPV scenario',
    topic: 'NPV — sunk-cost trap',
    marks: 50,
    traps: [
      {
        what: '$200k pre-project R&D loaded into Year 0 as a cash outflow',
        why: 'The R&D had been spent BEFORE the decision; it is sunk and irrelevant to the appraisal.',
        fix: 'Always state: "$200k R&D — sunk cost, excluded from the appraisal." That sentence earns a relevance mark.',
      },
      {
        what: 'Forgot to add back amortisation of the sunk R&D',
        why: 'If the R&D is being amortised through P&L, the non-cash amortisation must be added back to convert profit to cash.',
        fix: 'Two-step rule: sunk cost is excluded from CASH FLOWS; amortisation is added back when bridging from PROFIT to CASH.',
      },
    ],
    techniqueWin: '"Sunk = ignored. Amortisation = added back. Working capital = released at end." Three rules, three marks.',
  },
];

export const EXAMINER_QUOTES: ExaminerQuote[] = [
  { text: 'The skill of scepticism is not demonstrated very well by the majority of candidates.', paper: 'Sep/Dec 2024', category: 'scepticism' },
  { text: 'Free cash flows to the whole firm should be discounted at the discount rate relevant to the whole firm, which is the weighted average cost of capital.', paper: 'Sep/Dec 2024', category: 'analysis' },
  { text: 'Past questions have clearly indicated which method should be used.', paper: 'Sep/Dec 2025', category: 'analysis' },
  { text: 'The better candidates clearly identified and raised an issue and then recommended a suitable action that the company could take to overcome the issue.', paper: 'Mar/Jun 2025', category: 'esg' },
  { text: 'Candidates would often discuss issues that would arise due to negative comments rather than describing actions.', paper: 'Sep/Dec 2025', category: 'esg' },
  { text: 'Raising an issue that is relevant given the scenario, but which is not mentioned in the question, shows good business thinking and will be rewarded.', paper: 'Sep/Dec 2025', category: 'commercial' },
  { text: 'Candidates should apply their theoretical knowledge to the organisation in the question — say why it may or may not work for THIS company in THIS situation.', paper: 'Recurring', category: 'commercial' },
  { text: 'Very few candidates were able to successfully complete a collar calculation even though similar calculations have been included in previous exam questions.', paper: 'Sep/Dec 2024', category: 'analysis' },
  { text: 'In general terms the futures hedge was handled better than the options hedge.', paper: 'Sep/Dec 2025', category: 'analysis' },
];

export const QUOTE_LABELS: Record<ExaminerQuote['category'], { label: string; color: string; icon: string }> = {
  scepticism: { label: 'Scepticism', color: '#dc2626', icon: 'fa-magnifying-glass' },
  esg: { label: 'ESG marks', color: '#10b981', icon: 'fa-leaf' },
  analysis: { label: 'Analysis', color: '#0ea5e9', icon: 'fa-chart-line' },
  communication: { label: 'Communication', color: '#a78bfa', icon: 'fa-comments' },
  commercial: { label: 'Commercial', color: '#f59e0b', icon: 'fa-briefcase' },
};
