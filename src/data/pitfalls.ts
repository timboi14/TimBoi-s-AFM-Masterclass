/**
 * Pitfalls library — Symptom → Why it loses marks → Fix.
 * Consolidates trap entries scattered across topics, examiner reports, and War Room.
 * Generic / fabricated wording only — never quotes from live ACCA homework.
 */

export interface PitfallEntry {
  id: string;
  symptom: string;
  why: string;
  fix: string;
  topics: string[];          // topic ids
  marksAtRisk: 'low' | 'mid' | 'high';
  source: 'examiner' | 'mower' | 'acowtancy' | 'tba';
}

export const PITFALLS: PitfallEntry[] = [
  // ── NPV / APV ──────────────────────────────────────────────────
  {
    id: 'p-fisher',
    symptom: 'I mixed real cash flows with a nominal discount rate.',
    why: 'Fisher trap. The two approaches give different NPVs. Mixing wipes the entire NPV mark.',
    fix: 'Pick one convention in W1 ("nominal throughout") and stay there. Apply (1+i) = (1+r)(1+h) consistently.',
    topics: ['npv'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-tax-shield-wacc',
    symptom: 'I added the tax shield discounted at WACC.',
    why: 'WACC already embeds the (1-T) on the debt cost; double-counting the shield inflates NPV.',
    fix: 'In APV, discount the tax shield at Kd (or Rf if certainty-equivalent). State the assumption in W2.',
    topics: ['apv'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-sunk-cost',
    symptom: 'I included the prior R&D / consultancy spend in Year 0.',
    why: 'Sunk costs are irrelevant to the appraisal decision. Including them biases the NPV down.',
    fix: 'State explicitly: "[£X] is sunk and excluded." Then only flow incremental amounts. Add back any non-cash amortisation when bridging from profit to cash.',
    topics: ['npv'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-depreciation-cf',
    symptom: 'I treated tax-allowable depreciation as a cash outflow.',
    why: 'Depreciation is non-cash. Only the tax SAVING on it (Dep × T) flows.',
    fix: 'In the cash-flow proforma, never list depreciation as cash. Treat the tax shield as a separate cash inflow line.',
    topics: ['npv'], marksAtRisk: 'mid', source: 'tba',
  },
  {
    id: 'p-wc-release',
    symptom: 'I forgot to release working capital at year N.',
    why: 'Working capital invested year 0 (and incremented annually) is recovered in the terminal year. Missing it understates NPV.',
    fix: 'Always add back cumulative working capital as a Year-N cash inflow. Show it on a separate line.',
    topics: ['npv'], marksAtRisk: 'mid', source: 'tba',
  },

  // ── WACC / cost of capital ─────────────────────────────────────
  {
    id: 'p-wacc-book',
    symptom: 'I used book values for the E and D weights in WACC.',
    why: 'Theory and the marker expect market values unless stated otherwise.',
    fix: 'Use market cap for equity, market value of debt for debt. Quote the source in W1.',
    topics: ['coc'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-existing-beta',
    symptom: 'I used the listed parent\'s equity beta for a project in a different industry.',
    why: 'The project beta needs the BUSINESS risk of comparators in the new industry.',
    fix: 'Find a proxy comparator in the target industry. Ungear its beta to remove financial risk, regear at project gearing, then CAPM → Ke → WACC.',
    topics: ['coc'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-coupon-as-kd',
    symptom: 'I used the bond coupon rate as the cost of debt.',
    why: 'Coupon ≠ market yield. Cost of debt is the yield to maturity, post-tax.',
    fix: 'Use IRR of the bond cash flows to find pre-tax YTM, then × (1-T). For redeemable debt, never use the perpetuity shortcut.',
    topics: ['coc'], marksAtRisk: 'mid', source: 'acowtancy',
  },

  // ── Real options / BSOP ────────────────────────────────────────
  {
    id: 'p-pa-pe',
    symptom: 'I flipped Pa and Pe in the Black-Scholes inputs.',
    why: 'Pa is what you get on exercise (asset PV). Pe is what you pay (capex). Flipping reverses sign of intrinsic value.',
    fix: 'Before any sums, list: Pa = … (PV inflows), Pe = … (capex). Lock the labels first.',
    topics: ['real'], marksAtRisk: 'high', source: 'tba',
  },
  {
    id: 'p-bsop-discount',
    symptom: 'I discounted Pe with simple compound discounting.',
    why: 'Black-Scholes uses CONTINUOUS compounding (e^-rt), not (1+r)^-t.',
    fix: 'Use EXP(-r*t) in the spreadsheet. Different formula, different result.',
    topics: ['real'], marksAtRisk: 'mid', source: 'tba',
  },
  {
    id: 'p-real-options-volatility',
    symptom: 'I used the share-price volatility as σ for a real option.',
    why: 'σ in real options is the volatility of the project asset value, not the parent share.',
    fix: 'Use proxy industry sigma or scenario-derived sigma. State the source.',
    topics: ['real'], marksAtRisk: 'mid', source: 'examiner',
  },

  // ── M&A / valuation ────────────────────────────────────────────
  {
    id: 'p-fcff-ke',
    symptom: 'I discounted FCFF at Ke instead of WACC.',
    why: 'FCFF belongs to the whole firm (debt + equity). It must be discounted at the firm-level rate.',
    fix: 'Mnemonic: "F goes with W, E goes with E." FCFF→WACC, FCFE→Ke. Then subtract debt to bridge EV→Equity.',
    topics: ['val'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-fcff-interest',
    symptom: 'I deducted interest from FCFF.',
    why: 'WACC already embeds the cost of debt. Interest belongs to debt holders. Deducting it AND discounting at WACC double-counts.',
    fix: 'FCFF formula: EBIT(1-T) + Dep − Capex − ΔWC. No interest deduction.',
    topics: ['val'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-no-debt-bridge',
    symptom: 'I quoted EV as the equity value.',
    why: 'FCFF discounted at WACC gives ENTERPRISE value. Equity = EV − debt + excess cash.',
    fix: 'Always end with the bridge: "EV £X, less debt £Y, equity value £Z." One line earns the structural mark.',
    topics: ['val'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-perp-growth-default',
    symptom: 'I plugged in a 2% growth rate when the scenario said variables remain the same.',
    why: '"Remain the same" = ZERO growth. Adding growth inflates terminal value materially.',
    fix: 'Read the scenario for the explicit growth signal. If silent, default g = 0 unless economy-wide GDP/inflation language is present.',
    topics: ['val'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-tv-not-discounted',
    symptom: 'I added TV at face value to the explicit-period PVs.',
    why: 'TV sits at the end of the forecast (year n). It must be discounted by (1+WACC)^n to be on a today-basis.',
    fix: 'Always show TV × discount factor as a separate line before summing.',
    topics: ['val'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-single-valuation',
    symptom: 'I gave one valuation number.',
    why: 'AFM rewards a RANGE: floor (asset), midpoint (multiples / DCF), upside (DCF + synergy).',
    fix: 'Present three methods, state the negotiation implication, then recommend a target bid range.',
    topics: ['val', 'mna'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-synergy-classification',
    symptom: 'I treated a one-off closure gain as a recurring annual synergy.',
    why: 'Discounting a one-off as a perpetuity inflates the deal value massively.',
    fix: 'Tag every synergy as ONE-OFF or ANNUITY at the start. One-off in year 1 only; annuity uses a perpetuity / annuity factor.',
    topics: ['mna'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-bootstrap',
    symptom: 'I praised the deal because EPS rose post-merger.',
    why: 'EPS rise from a high-PE buyer acquiring a low-PE target is a mechanical bootstrap, not value creation.',
    fix: 'Always flag bootstrapping when acquirer PE > target PE in a share-for-share. State that no real cash flows have been created.',
    topics: ['mna'], marksAtRisk: 'mid', source: 'tba',
  },

  // ── Hedging ────────────────────────────────────────────────────
  {
    id: 'p-bid-offer',
    symptom: 'I used the wrong side of bid/offer on the forward.',
    why: 'Banks always quote the rate that disadvantages you. Buying foreign uses the higher (offer) rate.',
    fix: 'Walk through the bank perspective: "Bank will sell USD to me at the offer." Then write the cash flow.',
    topics: ['fx'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-premium-not-fv',
    symptom: 'I compared the option premium today against the hedge outcome at maturity.',
    why: 'Different dates. Premium paid now; outcome paid in 90 days. Comparison is wrong.',
    fix: 'Future-value the premium at the home deposit rate to the cash-flow date. Then add to net hedged outcome.',
    topics: ['fx'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-contract-month',
    symptom: 'I picked the futures contract that expires before the cash-flow date.',
    why: 'You cannot hedge with a contract that has already settled. Basis risk also blows up at expiry.',
    fix: 'Always pick the next contract month AFTER the transaction date. State the basis.',
    topics: ['fx', 'ir'], marksAtRisk: 'mid', source: 'tba',
  },
  {
    id: 'p-rounding-down',
    symptom: 'I rounded contract count down to the nearest whole number.',
    why: 'Under-hedging leaves residual exposure. The over-hedge from rounding up is normally treated as preferable.',
    fix: 'Round UP. Mention the small residual position in the discussion.',
    topics: ['fx', 'ir'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-collar',
    symptom: 'I lost most of the marks on the collar.',
    why: 'A collar is buy-floor-put + sell-cap-call. Net premium computation, three rate scenarios, effective outcome — drilled together.',
    fix: 'Practice the four-step every week of revision: (1) buy put + sell call, (2) net premium, (3) outcome at low/mid/high rate, (4) effective $.',
    topics: ['ir'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-fra-side',
    symptom: 'I confused borrower vs depositor side of the FRA.',
    why: 'BORROWERS BUY FRAs (fearing rises). DEPOSITORS SELL FRAs (fearing falls).',
    fix: 'Ask: which way am I exposed if rates move adversely? Take the FRA side that pays you in that scenario.',
    topics: ['ir'], marksAtRisk: 'mid', source: 'tba',
  },

  // ── Risk ───────────────────────────────────────────────────────
  {
    id: 'p-var-z',
    symptom: 'I quoted a two-tailed z value for a one-tailed VaR.',
    why: 'One-tail at 99% = 2.326. Two-tail 99% = 2.576. AFM normally one-tailed.',
    fix: 'Memorise: 95% one-tail = 1.645, 99% one-tail = 2.326. State the tail explicitly.',
    topics: ['risk'], marksAtRisk: 'low', source: 'tba',
  },
  {
    id: 'p-risk-generic',
    symptom: 'I listed risks but didn\'t say why they matter HERE.',
    why: 'Generic risk lists score the knowledge mark only. Application + implication earns the rest.',
    fix: 'Use the 3-part structure per risk: NAME → WHY THIS SCENARIO → IMPLICATION FOR DECISION.',
    topics: ['risk', 'adviser'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-risk-unbalanced',
    symptom: 'I wrote 7 business risks and 0 financial risks.',
    why: 'When the requirement says "financial AND business", missing one half halves the mark.',
    fix: 'Plan the table first: 3 business + 3 financial, minimum. Cover both before depth.',
    topics: ['risk'], marksAtRisk: 'mid', source: 'tba',
  },

  // ── ESG ────────────────────────────────────────────────────────
  {
    id: 'p-esg-generic',
    symptom: 'I wrote generic ESG prose with no scenario figure.',
    why: 'Examiner rewards ONLY scenario-applied ESG. Generic transferable bullets earn zero.',
    fix: 'Pattern: Issue (specific) → Action (costed) → Outcome (quantified). Three sentences, three marks.',
    topics: ['behav'], marksAtRisk: 'high', source: 'examiner',
  },
  {
    id: 'p-esg-impractical',
    symptom: 'I recommended an action ignoring local cost-of-living / context.',
    why: 'Impractical recommendations (e.g. "pay all workers globally the same") are penalised explicitly.',
    fix: 'Anchor every action in scenario constraints. Show the trade-off: ESG action reduces NPV by £X but secures social licence.',
    topics: ['behav'], marksAtRisk: 'mid', source: 'examiner',
  },

  // ── Section A / structure ──────────────────────────────────────
  {
    id: 'p-no-recommendation',
    symptom: 'I buried the recommendation in paragraph 4.',
    why: 'Senior advisers lead with the answer. The marker scans the first 30 seconds for the recommendation.',
    fix: 'Sentence one: "I recommend [X], subject to [Y], because [Z]." Then justify with numbers.',
    topics: ['adviser'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-no-headings',
    symptom: 'I wrote my answer as one continuous block of text.',
    why: 'Communication marks reward visible structure. The marker scans for headings before reading.',
    fix: 'Use bold headings that mirror the requirement verbs: "Recommendation", "Methodology", "Numerical analysis", "Risks", "ESG", "Conclusion".',
    topics: ['adviser'], marksAtRisk: 'mid', source: 'tba',
  },
  {
    id: 'p-time-overrun',
    symptom: 'I ran out of time on Q3.',
    why: 'Partial structure on Q3 always beats a perfect Q1. Marks are capped per question.',
    fix: 'Hard-stop at 1.8 min/mark. Pivot when budget hits. Bullet whatever you have for Q3 even if calcs unfinished.',
    topics: ['adviser'], marksAtRisk: 'high', source: 'mower',
  },
  {
    id: 'p-no-scepticism',
    symptom: 'I accepted the consultant\'s revenue forecasts at face value.',
    why: 'Scepticism is a separate professional-skill mark that almost everyone can earn but most miss.',
    fix: 'Write at least one sentence per Section A challenging an assumption: "The consultant\'s 25% growth is optimistic relative to industry data; recommend stress-test at 10%."',
    topics: ['adviser', 'risk'], marksAtRisk: 'mid', source: 'examiner',
  },
  {
    id: 'p-ps-block',
    symptom: 'I added a "Professional Skills" paragraph at the end.',
    why: 'PS marks are awarded for skills WOVEN through the answer, not appended as a block.',
    fix: 'Embed each skill: lead with recommendation (Communication), interpret each number (Analysis), challenge an assumption (Scepticism), reference industry context (Commercial).',
    topics: ['adviser'], marksAtRisk: 'mid', source: 'examiner',
  },
];

export const PITFALL_TAGS = [
  { id: 'all', label: 'All' },
  { id: 'high', label: 'High mark risk' },
  { id: 'examiner', label: 'Examiner-flagged' },
  { id: 'mower', label: 'Mower technique' },
];
