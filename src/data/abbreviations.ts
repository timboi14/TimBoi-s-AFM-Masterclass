/**
 * AFM cheat-sheet abbreviations — the acronym soup the exam assumes you can
 * decode on sight. Grouped by topic area; each entry pairs the short form with
 * its expansion and a one-line "what it actually means / when it bites" note.
 *
 * Surfaced on the Memory page as a searchable cheat sheet.
 */
export interface Abbreviation {
  abbr: string;
  full: string;
  /** One-line meaning or exam usage cue. */
  note: string;
}

export interface AbbrGroup {
  category: string;
  icon: string;
  items: Abbreviation[];
}

export const ABBREVIATIONS: AbbrGroup[] = [
  {
    category: 'Cost of capital & returns',
    icon: 'fa-percent',
    items: [
      { abbr: 'WACC', full: 'Weighted Average Cost of Capital', note: 'Blend Ke and after-tax Kd by market-value weights. The default project discount rate when gearing is stable.' },
      { abbr: 'CAPM', full: 'Capital Asset Pricing Model', note: 'Ke = Rf + βe(Rm − Rf). Prices only systematic risk.' },
      { abbr: 'Ke', full: 'Cost of equity', note: 'Return shareholders demand. From CAPM or the dividend valuation model.' },
      { abbr: 'Kd', full: 'Cost of debt', note: 'Use the after-tax, redemption-yield (IRR) cost — not the coupon.' },
      { abbr: 'Kp', full: 'Cost of preference shares', note: 'Fixed dividend ÷ market price. No tax relief.' },
      { abbr: 'Rf', full: 'Risk-free rate', note: 'Government T-bill / gilt yield. The CAPM starting line.' },
      { abbr: 'Rm', full: 'Market return', note: 'Expected return on the whole market portfolio.' },
      { abbr: 'ERP / MRP', full: 'Equity (market) risk premium', note: 'Rm − Rf. The reward per unit of beta.' },
      { abbr: 'M&M', full: 'Modigliani & Miller', note: 'Capital-structure propositions — value rises with the debt tax shield (with tax).' },
      { abbr: 'βe / βa', full: 'Equity / asset beta', note: 'βa is the ungeared (business-risk-only) beta; βe adds financial risk.' },
      { abbr: 'DVM', full: 'Dividend Valuation Model', note: 'P0 = D1 / (Ke − g). Values a share as a growing dividend stream.' },
      { abbr: 'SML', full: 'Security Market Line', note: 'CAPM plotted: required return against beta.' },
    ],
  },
  {
    category: 'Investment appraisal',
    icon: 'fa-square-root-variable',
    items: [
      { abbr: 'NPV', full: 'Net Present Value', note: 'PV of inflows − outflows. Positive = accept. The gold standard.' },
      { abbr: 'IRR', full: 'Internal Rate of Return', note: 'Discount rate giving NPV = 0. Assumes reinvestment at the IRR — its flaw.' },
      { abbr: 'MIRR', full: 'Modified Internal Rate of Return', note: 'IRR fixed to use a realistic reinvestment rate.' },
      { abbr: 'ARR', full: 'Accounting Rate of Return', note: 'Average profit ÷ average investment. Ignores time value — weak.' },
      { abbr: 'PI', full: 'Profitability Index', note: 'PV inflows ÷ outlay. Ranks projects under capital rationing.' },
      { abbr: 'DCF', full: 'Discounted Cash Flow', note: 'The umbrella technique behind NPV, IRR and valuation.' },
      { abbr: 'EAC / EAA', full: 'Equivalent Annual Cost / Annuity', note: 'NPV ÷ annuity factor. Compares assets with unequal lives.' },
      { abbr: 'PBP', full: 'Payback Period', note: 'Time to recover the outlay. Crude liquidity screen, not a value measure.' },
      { abbr: 'APV', full: 'Adjusted Present Value', note: 'Base-case NPV + financing side-effects. Use when gearing changes.' },
      { abbr: 'ΔWC', full: 'Change in working capital', note: 'A cash flow in the NPV — an increase is an outflow; recovered at the end.' },
      { abbr: 'TAD / WDA', full: 'Tax-allowable depreciation / Writing-down allowance', note: 'Capital allowances that shelter tax — model the tax saving, not the charge.' },
      { abbr: 'CRR', full: 'Capital rationing', note: 'Limited funds; rank divisible projects by PI, indivisible by trial.' },
    ],
  },
  {
    category: 'Valuation',
    icon: 'fa-scale-balanced',
    items: [
      { abbr: 'FCFF', full: 'Free Cash Flow to Firm', note: 'Cash to all investors. Discount at WACC → enterprise value.' },
      { abbr: 'FCFE', full: 'Free Cash Flow to Equity', note: 'Cash to shareholders. Discount at Ke → equity value.' },
      { abbr: 'TV', full: 'Terminal Value', note: 'Capitalised perpetuity beyond the forecast — then discount it back.' },
      { abbr: 'NOPAT', full: 'Net Operating Profit After Tax', note: 'EBIT × (1 − T). The starting point for EVA and FCFF.' },
      { abbr: 'EVA', full: 'Economic Value Added', note: 'NOPAT − (WACC × capital). Profit after charging for capital used.' },
      { abbr: 'SVA', full: 'Shareholder Value Analysis', note: 'Value built from Rappaport\'s seven value drivers.' },
      { abbr: 'EV', full: 'Enterprise Value', note: 'Equity + net debt. What it costs to buy the whole operation.' },
      { abbr: 'P/E', full: 'Price / Earnings ratio', note: 'Quick relative-valuation multiple; sensitive to the comparable chosen.' },
      { abbr: 'EPS', full: 'Earnings Per Share', note: 'Profit after tax ÷ shares. Watch bootstrapping in M&A.' },
      { abbr: 'ROCE / ROE', full: 'Return on Capital Employed / Equity', note: 'Profitability ratios; compare against the cost of capital.' },
      { abbr: 'EBITDA', full: 'Earnings Before Interest, Tax, Depreciation & Amortisation', note: 'Rough cash-profit proxy used in multiples.' },
      { abbr: 'TERP', full: 'Theoretical Ex-Rights Price', note: 'Blended price after a rights issue: (N·cum + issue) ÷ (N+1).' },
    ],
  },
  {
    category: 'Risk, options & hedging',
    icon: 'fa-shield-halved',
    items: [
      { abbr: 'VaR', full: 'Value at Risk', note: 'z × σ × value. Worst expected loss at a confidence level.' },
      { abbr: 'BSOP', full: 'Black-Scholes Option Pricing', note: 'Prices a call via N(d1), N(d2). Also values real options.' },
      { abbr: 'N(d)', full: 'Cumulative normal probability', note: 'Read from tables; N(d1) is the option delta.' },
      { abbr: 'σ', full: 'Volatility (standard deviation)', note: 'The key BSOP input — higher σ, higher option value.' },
      { abbr: 'ITM / ATM / OTM', full: 'In / At / Out of the money', note: 'Where the spot sits versus the strike.' },
      { abbr: 'FRA', full: 'Forward Rate Agreement', note: 'OTC contract locking a future interest rate. Cash-settled.' },
      { abbr: 'IRG', full: 'Interest Rate Guarantee', note: 'An option on an FRA — protection with upside kept.' },
      { abbr: 'MMH', full: 'Money Market Hedge', note: 'Borrow/deposit now to fix a future FX cash flow.' },
      { abbr: 'QSD', full: 'Quality Spread Differential', note: 'The total saving a swap can split between two counterparties.' },
      { abbr: 'OTC', full: 'Over The Counter', note: 'Tailored, non-exchange contract — flexible but carries counterparty risk.' },
      { abbr: 'bps', full: 'Basis points', note: '1 bp = 0.01%. Rates and spreads are quoted in these.' },
      { abbr: 'Cap / Floor / Collar', full: 'Interest-rate option structures', note: 'Cap limits a rate rise; collar = buy cap + sell floor to cut premium.' },
    ],
  },
  {
    category: 'Acquisitions & restructuring',
    icon: 'fa-handshake',
    items: [
      { abbr: 'M&A', full: 'Mergers & Acquisitions', note: 'Growth by combination — value the synergy, not just the target.' },
      { abbr: 'MBO', full: 'Management Buy-Out', note: 'Existing managers buy the business, usually debt-funded.' },
      { abbr: 'MBI', full: 'Management Buy-In', note: 'Outside managers buy in and take over.' },
      { abbr: 'LBO', full: 'Leveraged Buy-Out', note: 'Acquisition funded mostly by debt secured on the target.' },
      { abbr: 'SPV', full: 'Special Purpose Vehicle', note: 'Ring-fenced entity, e.g. for securitisation or project finance.' },
      { abbr: 'P4P / Earn-out', full: 'Contingent consideration', note: 'Deferred payment tied to the target hitting targets — bridges price gaps.' },
      { abbr: 'Synergy', full: 'Combined value uplift', note: 'Value(A+B) − Value(A) − Value(B). The reason to pay a premium.' },
      { abbr: 'Goodwill', full: 'Premium over net assets', note: 'Price paid above identifiable net asset value.' },
      { abbr: 'Demerger', full: 'Splitting a group', note: 'Spin-off / carve-out to unlock conglomerate-discount value.' },
      { abbr: 'White knight', full: 'Friendly rival bidder', note: 'A defence: invite a preferred acquirer against a hostile bid.' },
      { abbr: 'Poison pill', full: 'Takeover defence', note: 'Makes the target costly to swallow, e.g. discounted new shares.' },
    ],
  },
  {
    category: 'International & treasury',
    icon: 'fa-globe',
    items: [
      { abbr: 'FX', full: 'Foreign Exchange', note: 'Currency markets — source of transaction, translation & economic risk.' },
      { abbr: 'IRP', full: 'Interest Rate Parity', note: 'Forward = spot × interest-rate ratio. The forward-FX anchor.' },
      { abbr: 'PPP', full: 'Purchasing Power Parity', note: 'Expected spot moves with the inflation differential.' },
      { abbr: 'IFE', full: 'International Fisher Effect', note: 'Currencies with higher interest rates depreciate over time.' },
      { abbr: 'MNC', full: 'Multinational Company', note: 'The Section E exam subject — treasury, transfer pricing, country risk.' },
      { abbr: 'CRP', full: 'Country Risk Premium', note: 'Extra return added for political/economic risk of a foreign project.' },
      { abbr: 'WCM', full: 'Working Capital Management', note: 'Managing inventory, receivables, payables and cash.' },
      { abbr: 'DTR', full: 'Double Tax Relief', note: 'Credit for foreign tax already paid, capped at the home rate.' },
      { abbr: 'WHT', full: 'Withholding Tax', note: 'Tax deducted at source on cross-border dividends/interest/royalties.' },
      { abbr: 'Transfer pricing', full: 'Intra-group pricing', note: 'Prices on internal cross-border trade — tax and motivation tension.' },
    ],
  },
  {
    category: 'Exam & professional skills',
    icon: 'fa-trophy',
    items: [
      { abbr: 'AFM', full: 'Advanced Financial Management', note: 'ACCA Strategic Professional option paper (P4).' },
      { abbr: 'PS', full: 'Professional Skills marks', note: 'The skills marks woven through answers, not appended.' },
      { abbr: 'ASCE', full: 'Analysis, Scepticism, Commercial acumen, Evaluation', note: 'The professional-skills lenses examiners reward.' },
      { abbr: 'CBE', full: 'Computer-Based Exam', note: 'The delivery format — spreadsheet, word processor, blank workings.' },
      { abbr: 'ESG', full: 'Environmental, Social & Governance', note: 'Score via issue → costed action → quantified outcome.' },
      { abbr: 'CSR', full: 'Corporate Social Responsibility', note: 'Stakeholder duties beyond shareholders — Section A material.' },
      { abbr: 'Section A', full: 'Compulsory 50-mark case', note: 'One big scenario; always answered.' },
      { abbr: 'OFR', full: 'Own-figure rule', note: 'Marks for correct method on your earlier (even wrong) figures — never leave blanks.' },
    ],
  },
];

/** Flat count for headline stats. */
export const ABBREVIATION_COUNT = ABBREVIATIONS.reduce((n, g) => n + g.items.length, 0);
