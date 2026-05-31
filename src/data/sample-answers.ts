/**
 * Full-mark exam-style sample answers, with examiner-grade structure and
 * inline mark allocations. Every element is callable from the simulator's
 * "Sample answer" panel.
 *
 * Each block can include:
 *  - intro: a one-paragraph examiner summary of what scoring requires
 *  - lines: array of { text, marks } — inline mark callout per line
 *  - notes: examiner commentary explaining why this answer earns full marks
 *  - profSkills: 5/10 mark Professional Skills note (categorised)
 */

export interface SampleLine {
  text: string;
  marks?: number;
  tag?: 'calc' | 'workings' | 'discuss' | 'recommend' | 'esg' | 'skill';
}

export interface SampleAnswer {
  intro: string;
  lines: SampleLine[];
  notes: string;
  profSkills: { skill: 'Communication' | 'Analysis' | 'Scepticism' | 'Commercial'; marks: number; example: string }[];
}

/** keyed by `${setId}:${requirementIndex}` */
const SAMPLE_ANSWERS: Record<string, SampleAnswer> = {
  // SET 1A — Lilywhite Co APV
  'set-1a:0': {
    intro:
      'A full-marks answer to the APV requirement is a three-stage proforma: ungear the proxy beta, build the unlevered base case, then add financing side effects. Show every formula. Quote scenario figures. Round to 1 decimal place.',
    lines: [
      { text: 'BOARD PAPER: To the Board of Lilywhite Co. From: Senior Finance Manager. Subject: Lilywhite USA, APV appraisal.', marks: 1, tag: 'discuss' },
      { text: 'Step 1: ungear the US comparator beta to isolate business risk.', marks: 1, tag: 'workings' },
      { text: 'Beta_a = 1.45 * (1/1.30) + 0.15 * (0.30/1.30) = 1.115 + 0.035 = 1.150.', marks: 1, tag: 'calc' },
      { text: 'Step 2: ungeared cost of equity using UK Rf and ERP (cash flows discounted in £).', marks: 1, tag: 'workings' },
      { text: 'Ke_u = 4.5% + 1.150 * 6.0% = 11.4%.', marks: 1, tag: 'calc' },
      { text: 'Step 3: PPP forecast £/$ rates. S_n = 1.27 * (1.045/1.030)^n.', marks: 2, tag: 'workings' },
      { text: 'Years 1 to 5: 1.2885, 1.3073, 1.3263, 1.3456, 1.3652.', marks: 1, tag: 'calc' },
      { text: 'Step 4: build US$ proforma. Operating cash flow Y1-5 (post-tax + add-back of depreciation): 11.25, 20.25, 30.0, 36.75, 39.75.', marks: 4, tag: 'workings' },
      { text: 'Year 0 outlay 185. Year 5 disposals: equipment 8, land/facility 95, working capital 25.', marks: 2, tag: 'calc' },
      { text: 'Step 5: convert to £m and discount at Ke_u 11.4%.', marks: 1, tag: 'workings' },
      { text: 'PV of cash flows: -145.67 + 7.84 + 12.49 + 16.36 + 17.73 + 71.64 = -19.61. Base-case NPV = £-19.6m.', marks: 4, tag: 'calc' },
      { text: 'Step 6: financing side effects.', marks: 1, tag: 'workings' },
      { text: 'Issue costs after tax: 1.4 * 0.75 / 1.27 = £0.83m (deduct at Y0).', marks: 1, tag: 'calc' },
      { text: 'PV tax shield on subsidised debt at risk-free 4.5%: 70 * 4% * 25% * AF(5y, 4.5%) = 0.70 * 4.39 = US$3.07m, £2.33m.', marks: 2, tag: 'calc' },
      { text: 'PV of subsidy benefit at unsubsidised post-tax debt rate (4.875%): 70 * 2.5% * 0.75 * AF(5y, 4.875%) = US$5.71m, £4.33m.', marks: 2, tag: 'calc' },
      { text: 'APV = -19.61 + (-0.83 + 2.33 + 4.33) = £-13.78m. Project does not create shareholder value on these inputs.', marks: 2, tag: 'recommend' },
    ],
    notes:
      'Full marks here come from showing the formulas, subbing the numbers, and quoting the result line by line. Candidates who jump straight to the APV figure lose 8+ marks for missing intermediate workings. The £-13.78m result must be quoted before the discussion of strategic factors begins.',
    profSkills: [
      { skill: 'Communication', marks: 2, example: 'Board paper format, executive summary up top, headings labelled by step.' },
      { skill: 'Analysis', marks: 3, example: 'Separation of base case from financing side effects with appropriate discount rate per cash flow.' },
      { skill: 'Scepticism', marks: 3, example: 'Quote the £19.6m base-case loss and challenge whether revenue forecasts justify the project before adjustments.' },
      { skill: 'Commercial', marks: 2, example: 'Reference North American sports growth and Iberian player pipeline in the strategic recommendation.' },
    ],
  },

  // SET 1A — Discussion of assumptions
  'set-1a:1': {
    intro:
      '10 marks, one per developed point. Avoid generic "models have limits" statements. Each point must (a) name the assumption, (b) explain why it matters, (c) apply to Lilywhite scenario.',
    lines: [
      { text: 'Asset beta from US comparators is a central estimate, not a precise input. Comparators differ in scale, revenue mix and operating leverage, so the 1.150 figure should be treated as a range. A sensitivity of +/- 0.2 on beta moves Ke_u by 1.2pp and APV by approximately £4m.', marks: 2, tag: 'discuss' },
      { text: 'PPP holds long-run but deviates substantially in the short to medium term. Five years of compounding inflation differentials introduces estimation risk. A 5% adverse FX move on Year 5 cash flows reduces APV by approximately £6m.', marks: 2, tag: 'discuss' },
      { text: 'Tax shield is discounted at the risk-free rate because the cash flow is contractual and near-certain. The subsidy benefit is discounted at the unsubsidised post-tax debt rate because it depends on the firm continuing to service the debt. Mixing these wipes the financing-side-effect mark.', marks: 2, tag: 'discuss' },
      { text: 'Terminal disposal of the land and facility at US$95m is a single-point estimate. Real estate values five years out are highly uncertain; a 20% adverse swing reduces APV by approximately £14m. Sensitivity is essential.', marks: 1, tag: 'discuss' },
      { text: 'Revenue ramp from US$42m to US$118m assumes successful market penetration. This is the largest single source of forecast risk. A 10% reduction in revenue makes the project NPV positive impossible at any reasonable subsidy.', marks: 2, tag: 'discuss' },
      { text: 'US-UK tax interaction (GILTI, withholding, treaty) is materially more complex than the model assumes. Specialist tax advice should be commissioned before a final decision.', marks: 1, tag: 'discuss' },
    ],
    notes:
      'Examiner reports consistently flag "limitations" answers that just restate textbook caveats. The 10 marks come from quantifying how each assumption could move the APV figure (e.g. "+/- £4m on beta", "+/- £6m on FX"). This is the analytical depth expected of a senior adviser.',
    profSkills: [],
  },

  // SET 1A — Strategic recommendation
  'set-1a:2': {
    intro:
      '8 marks: 2 for a clear recommendation tied to the APV figure, 6 for three substantive non-financial factors. Each factor must be argued, not just listed.',
    lines: [
      { text: 'Recommendation: do not approve in current form. APV of £-13.8m signals value destruction on stated assumptions. Commission (i) sensitivity analysis on revenue and FX, (ii) explicit valuation of strategic real options, (iii) revenue benchmark against European clubs already operating in the US, and reconsider in 90 days.', marks: 2, tag: 'recommend' },
      { text: 'Strategic real options not in the APV: a US base provides the platform for further North American expansion (option to expand). Ignoring this option understates project value. A back-of-envelope BSOP valuation of the expansion option could plausibly add £15-25m, potentially reversing the APV decision.', marks: 2, tag: 'discuss' },
      { text: 'Brand and commercial uplift to the parent: increased US visibility lifts global merchandising, broadcasting, and pre-season tour revenues that are not in the standalone P&L. Estimating this requires identifying the comparable lift achieved by other European clubs that have entered the US market.', marks: 2, tag: 'discuss' },
      { text: 'Player development pipeline: the academy operation could produce future first-team players or saleable assets, generating cash flows beyond Year 5. The horizon mismatch (5-year DCF vs 10-15 year talent payoffs) is a structural understatement.', marks: 2, tag: 'discuss' },
    ],
    notes:
      'The marks come from arguing each non-financial factor, not listing them. Quantify where possible. Coach technique: name the factor, explain its mechanism, apply to Lilywhite scenario, name the next action.',
    profSkills: [],
  },

  // SET 1B — Coq Sportif FCFF valuation
  'set-1b:0': {
    intro:
      'Full-marks FCFF valuation: ungear, regear, build WACC, FCFF schedule, terminal value, discount, equity bridge.',
    lines: [
      { text: 'Step 1: ungear the comparator beta. Beta_a = 1.30 * (0.65 / (0.65 + 0.35 * 0.75)) = 1.30 * (0.65/0.9125) = 0.926.', marks: 2, tag: 'calc' },
      { text: 'Step 2: regear at Coq Sportif gearing D/E = 30/70 = 0.4286. Beta_e = 0.926 * (1 + 0.4286 * 0.75) = 0.926 * 1.3214 = 1.224.', marks: 1, tag: 'calc' },
      { text: 'Step 3: cost of equity. Ke = 3.0% + 1.224 * 5.5% = 9.73%.', marks: 1, tag: 'calc' },
      { text: 'Step 4: WACC. WACC = 0.70 * 9.73% + 0.30 * 4.5% = 6.81% + 1.35% = 8.16%, round to 8.2%.', marks: 1, tag: 'calc' },
      { text: 'Step 5: FCFF schedule Y1-Y5 (NOPAT + depreciation - capex - delta WC).', marks: 2, tag: 'workings' },
      { text: 'Y1: NOPAT 11.25, +9 dep, -14 capex, -0.16 WC = €6.09m.', marks: 1, tag: 'calc' },
      { text: 'Y2-Y5 similarly: 7.80, 11.01, 13.55, 15.84.', marks: 1, tag: 'calc' },
      { text: 'Step 6: terminal value at Year 5. NOPAT_6 = 18.0 * 1.025 = 18.45. Net of WC and reinvestment: FCFF_6 = 18.37.', marks: 1, tag: 'workings' },
      { text: 'TV_5 = 18.37 / (0.082 - 0.025) = 18.37 / 0.057 = €322.3m.', marks: 1, tag: 'calc' },
      { text: 'Step 7: discount and sum.', marks: 1, tag: 'workings' },
      { text: 'PV: 5.63 + 6.66 + 8.69 + 9.89 + 10.68 + 217.23 = €258.78m. Enterprise value €258.8m.', marks: 1, tag: 'calc' },
      { text: 'Equity = EV - Debt = 258.78 - 60 = €198.78m. Sense check: implied EV/EBITDA = 258.8 / 24 = 10.8x, reasonable for a mid-table Ligue 1 club with growth.', marks: 1, tag: 'calc' },
    ],
    notes:
      'Full marks come from a clean workings table, beta ungear-regear shown explicitly, and a sense-check at the end. Candidates who skip the regear step lose 4 marks easily. The implied multiple sense-check is the differentiator that earns Communication and Analysis marks.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: 'Step-numbered workings, labelled formulas, single-line conclusion at each stage.' },
      { skill: 'Analysis', marks: 2, example: 'Implied EV/EBITDA multiple sense-check; comparison to peer trading multiples.' },
      { skill: 'Commercial', marks: 1, example: 'Footballing context: mid-table Ligue 1 vs CL participant would warrant different multiples.' },
    ],
  },

  'set-1b:1': {
    intro:
      'Offer evaluation requires a number, a comparison, and a recommendation. Three football-specific limitations need application, not theory.',
    lines: [
      { text: 'NSP offer of €185m is approximately 7% below the FCFF-derived equity valuation of €198.8m. The owners have a clear basis to negotiate upward; NSP is a financial buyer pricing in their own required return.', marks: 1, tag: 'discuss' },
      { text: 'However, private-company discounts (illiquidity, control concentration) typically run 20-30%. Applying a 25% discount to €198.8m gives €149m, well below the offer. So the offer may be defensible as a private-company bid, but the owners should test the floor with two more bidders before accepting.', marks: 1, tag: 'discuss' },
      { text: 'Recommendation: counter at €215-225m. This leaves NSP value above their required return while capturing 70% of the modelled gap. A 90-day exclusive period with NSP plus running a parallel sounding of two other PE buyers is the negotiating posture.', marks: 1, tag: 'recommend' },
      { text: 'Football-specific limit 1: player registrations as a separate asset class. Players are revaluable, tradeable assets. Significant value sits in the squad that the FCFF model treats as part of operating cash flow. A separate "squad NAV" exercise should accompany the headline FCF, especially if the scouting team has identified academy graduates likely to be sold within 24 months.', marks: 1, tag: 'discuss' },
      { text: 'Football-specific limit 2: sporting-result optionality. Promotion, relegation, or Champions League qualification can swing revenue 30%+ in a single season; the FCF point estimate cannot capture this convexity. Scenario analysis or a real-options overlay (option to qualify for European football) is more honest. The bid needs different prices for different sporting outcomes.', marks: 1, tag: 'discuss' },
      { text: 'Football-specific limit 3: stadium and infrastructure ownership. If Coq Sportif owns its stadium and training ground, those have standalone real-estate value that may exceed their contribution to operating cash flow. Sum-of-the-parts (FCFF for football operations + DCF for real estate) typically uplifts equity by 10-15% for stadium-owning clubs.', marks: 1, tag: 'discuss' },
    ],
    notes:
      'The marks come from applying each limitation to Coq Sportif specifically (squad value, Ligue 1 sporting outcomes, stadium ownership), not stating them generically. Examiner reports consistently penalise generic FCF caveats.',
    profSkills: [],
  },

  // SET 1C — FX hedging
  'set-1c:0': {
    intro:
      'A four-row comparison table is essential. Each calculation must show: rate selected, formula, computation, € outcome, £ outcome.',
    lines: [
      { text: 'Strategy 1: forward contracts (Lilywhite buys €, uses bank offer side).', marks: 1, tag: 'workings' },
      { text: 'Aug instalment: €14m / 1.1690 = £11,975,193.', marks: 1, tag: 'calc' },
      { text: 'Nov: €14m / 1.1635 = £12,031,800. Feb: €14m / 1.1580 = £12,089,810.', marks: 2, tag: 'calc' },
      { text: 'Forward total = £36,096,803.', marks: 1, tag: 'calc' },
      { text: 'Strategy 2: money market hedge. Borrow £, convert at spot offer 1.1750, deposit € to grow to €14m.', marks: 1, tag: 'workings' },
      { text: 'Aug: € deposit needed = 14m / (1 + 0.033 * 3/12) = €13,885,442. £ borrow at spot = 13,885,442 / 1.1750 = £11,817,398. Repay 3m later at 5.4%/4 = £11,976,933.', marks: 2, tag: 'calc' },
      { text: 'Nov 6m: £12,037,569. Feb 9m: £12,097,505. MMH total = £36,112,007.', marks: 2, tag: 'calc' },
      { text: 'Strategy 3: options at 1.17 strike. Spot at exercise = €1.1500 (€ has strengthened), all calls in the money.', marks: 1, tag: 'workings' },
      { text: 'Exercise: €14m / 1.17 = £11,965,812 per instalment * 3 = £35,897,436.', marks: 1, tag: 'calc' },
      { text: 'Premium future-valued at 5.4% sterling borrow: Aug 0.85p * 14m = £119,000 * 1.0135 = £120,607. Nov: £172,536. Feb: £225,789. Total £518,932.', marks: 1, tag: 'calc' },
      { text: 'Options total = 35,897,436 + 518,932 = £36,416,368.', marks: 1, tag: 'calc' },
      { text: 'Cheapest: forward at £36.10m, ahead of MMH by £15k and options by £319k.', marks: 1, tag: 'recommend' },
    ],
    notes:
      'The mark-grabber here is the table. Examiner expects all three strategies side-by-side with consistent rounding. Forgetting to future-value the option premium is a 2-mark loser. Using the wrong side of bid/ask on either spot or forward is a 1-mark loser per instalment, so up to 3 marks.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: 'Side-by-side table with consistent column headings.' },
      { skill: 'Analysis', marks: 2, example: 'All three strategies compared with the same rounding convention; cheapest identified explicitly.' },
      { skill: 'Commercial', marks: 2, example: 'Recommendation tied to the board\'s stated risk preference (predictability over upside).' },
    ],
  },

  'set-1c:1': {
    intro:
      'Suitability analysis must address: (i) certainty of the underlying transaction, (ii) multi-instalment structure, (iii) the board preference for predictability over upside.',
    lines: [
      { text: 'Forward contracts are simple, fix the rate exactly, require no upfront cash, and align with the certain commitment of an agreed transfer fee. This is the canonical case for a forward.', marks: 2, tag: 'discuss' },
      { text: 'Money market hedge gives an economically near-identical outcome (interest rate parity), differing only by bid-ask friction. The drawback is balance-sheet impact: drawing GBP debt today reduces facility headroom available for other club operations.', marks: 1, tag: 'discuss' },
      { text: 'Currency options carry premium cost (~£0.5m versus an essentially zero-cost forward). The premium is justified only when there is meaningful uncertainty in the underlying transaction (medical not yet passed, regulatory approval pending). Once the deal is binding, the premium is wasted.', marks: 2, tag: 'discuss' },
      { text: 'Recommendation: use forward contracts for all three instalments at the locked rates above. If, between now and the player medical, there is genuine deal risk, hedge the August instalment alone with a 1.17 strike call (additional cost £121k, retains right to walk away from £14m payable). Lock in November and February once the deal is fully certain.', marks: 1, tag: 'recommend' },
    ],
    notes:
      'The recommendation template: state each strategy, evaluate against board criteria, recommend. The hybrid recommendation (option for August, forwards for the other two) is the differentiator from a textbook answer.',
    profSkills: [],
  },

  // SET 2 — Cannon Park real options
  'set-2:0': {
    intro:
      'Map BSOP inputs first, then compute d1, d2, N(d1), N(d2), call value, and conclude on strategic NPV.',
    lines: [
      { text: 'Map inputs to BSOP. Pa = present value today of Year 3 inflows = 135 / 1.045^3 = £118.21m. Pe = 140 (capex). t = 3. r = 4.5%. sigma = 35%.', marks: 2, tag: 'workings' },
      { text: 'Pa is the PV TODAY because uncertainty is captured in sigma, not in the discount rate. Discount Year 3 PV at risk-free.', marks: 1, tag: 'discuss' },
      { text: 'd1 = (ln(118.21/140) + (0.045 + 0.35^2/2) * 3) / (0.35 * sqrt(3)).', marks: 1, tag: 'calc' },
      { text: 'd1 numerator = -0.1691 + 0.31875 = 0.14965. Denominator = 0.6062. d1 = 0.247.', marks: 1, tag: 'calc' },
      { text: 'd2 = d1 - sigma * sqrt(t) = 0.247 - 0.6062 = -0.359.', marks: 1, tag: 'calc' },
      { text: 'From normal table: N(0.247) = 0.5975 (interpolate between N(0.24) and N(0.25)). N(-0.359) = 1 - 0.6402 = 0.3598.', marks: 2, tag: 'calc' },
      { text: 'Call = Pa * N(d1) - Pe * e^(-rt) * N(d2).', marks: 1, tag: 'workings' },
      { text: 'Call = 118.21 * 0.5975 - 140 * 0.3598 * e^(-0.135) = 70.63 - 140 * 0.3598 * 0.8737 = 70.63 - 44.01 = £26.62m.', marks: 2, tag: 'calc' },
      { text: 'Strategic NPV = Phase 1 NPV + Option to expand = -15 + 26.62 = +£11.62m.', marks: 1, tag: 'recommend' },
      { text: 'Conclusion: proceed. Phase 1 alone destroys value (£-15m), but the option to invest in Phase 2 is worth £26.6m. The decision to actually exercise Phase 2 is taken in Year 3 based on conditions then. The strategic NPV is positive.', marks: 2, tag: 'recommend' },
    ],
    notes:
      'Examiner watches for two failures: (1) flipping Pa and Pe, which gives a negative call value; (2) using the cost of capital instead of Rf to discount. Both wipe the calculation marks. The conclusion must explicitly identify that the option holder benefits from preserved upside even with negative phase-1 NPV.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: 'Clear input mapping table before any maths.' },
      { skill: 'Analysis', marks: 2, example: 'Strategic NPV correctly broken into intrinsic and option components.' },
      { skill: 'Commercial', marks: 1, example: 'Conclusion explains the manager\'s flexibility, not just the algebra.' },
      { skill: 'Scepticism', marks: 1, example: 'Acknowledge sensitivity of option value to sigma input.' },
    ],
  },
  'set-2:1': {
    intro:
      'BSOP limitations need to be SPECIFIC, not generic. Cite each assumption and explain why it fails in a real-asset context.',
    lines: [
      { text: 'Volatility estimation is the single biggest source of error. sigma is derived from comparator project value volatility or judgement; small changes drive large value changes. Here, sigma +/- 5pp moves the option value by approximately £4-5m.', marks: 1, tag: 'discuss' },
      { text: 'Tradeable underlying assumption fails. BSOP assumes the underlying can be traded continuously and a perfect hedge constructed. A half-built commercial complex cannot be hedged in any market, so the no-arbitrage foundation is shaky.', marks: 1, tag: 'discuss' },
      { text: 'Single exercise date. BSOP is European-style, exercised only at expiry. The real Phase 2 decision may be exercisable over a window (any time after Phase 1 stabilises). A binomial or American-style approximation handles this better.', marks: 1, tag: 'discuss' },
      { text: 'Fixed exercise price. Construction cost in three years is uncertain (commodity prices, labour). BSOP assumes fixed strike. Sensitivity testing on Pe is needed.', marks: 1, tag: 'discuss' },
      { text: 'Constant volatility and risk-free rate. Both vary in practice. Option value is most sensitive to the volatility input.', marks: 1, tag: 'discuss' },
      { text: 'Scenario 1 where BSOP unreliable: project with compound options (Phase 2 itself contains further expansion options). Compound options need extensions to BSOP or a binomial lattice.', marks: 1, tag: 'discuss' },
      { text: 'Scenario 2: illiquid and idiosyncratic underlying with no comparator volatility data. sigma becomes pure judgement and the precision of BSOP is illusory. Better to disclose a range of outcomes than rely on a single point estimate.', marks: 1, tag: 'discuss' },
    ],
    notes: 'Each limitation needs application to the Cannon Park scenario, not a textbook caveat. The 7-mark layout: 5 limitations (1 mark each) plus 2 scenarios (1 mark each).',
    profSkills: [],
  },

  // SET 4 — Tyne synergy
  'set-4:0': {
    intro:
      'Three columns: stand-alone, with-synergy, max bid. Show every working. Sense-check the multiple at the end.',
    lines: [
      { text: 'Stand-alone enterprise value via FCFF.', marks: 1, tag: 'workings' },
      { text: 'FCFF Y1 = £12m, growing 8% Y1-Y5: 12, 12.96, 14.00, 15.12, 16.33.', marks: 2, tag: 'calc' },
      { text: 'PV at WACC 9.5% = 10.96 + 10.81 + 10.67 + 10.52 + 10.37 = £53.33m.', marks: 1, tag: 'calc' },
      { text: 'Terminal value Y5: 16.33 * 1.03 / (0.095 - 0.03) = 16.82 / 0.065 = £258.77m. PV = 258.77 * 0.635 = £164.32m.', marks: 2, tag: 'calc' },
      { text: 'Riverside Rangers EV = 53.33 + 164.32 = £217.65m. Equity = EV - Debt = 217.65 - 50 = £167.65m.', marks: 1, tag: 'calc' },
      { text: 'PV of synergies (12m perpetuity from Year 2, growing 2%, at combined WACC 8.7%).', marks: 1, tag: 'workings' },
      { text: 'PV at Y1 = 12 / (0.087 - 0.02) = £179.10m. PV at Y0 = 179.10 / 1.087 = £164.77m. Less integration costs £18m. Net synergy = £146.77m.', marks: 3, tag: 'calc' },
      { text: 'Maximum rational price = stand-alone + net synergy = 167.65 + 146.77 = £314.42m. (This is the ceiling at which acquirer captures zero. Realistic max bid sharing 50/50 = 167.65 + 73.39 = £241m.)', marks: 2, tag: 'recommend' },
      { text: 'Sense check: the offer of £155m implies acquirer captures £159m of synergy (out of £146.77m). The arithmetic is fine; the deal terms are extraordinarily favourable to Tyne.', marks: 1, tag: 'discuss' },
    ],
    notes:
      'The structural mark-loser here is confusing stand-alone (the floor) with max bid (the ceiling). Always present THREE columns, not one number. The sanity check at the end is what differentiates a credit answer from a distinction one.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: 'Three-column valuation table with consistent rounding.' },
      { skill: 'Analysis', marks: 2, example: 'Acquirer-captured synergy split shown explicitly.' },
      { skill: 'Scepticism', marks: 1, example: 'Synergy assumption stress-tested against revenue base.' },
      { skill: 'Commercial', marks: 1, example: 'Reference to deal-completion likelihood given the unusual capture rate.' },
    ],
  },
  'set-4:1': {
    intro:
      'Evaluation must compare the offer to multiple references and conclude. Three non-financial risks need football-specific application.',
    lines: [
      { text: 'The £155m offer is BELOW Riverside\'s standalone equity value of £167.65m. Sellers will reject this on the simplest possible grounds: they receive less than market value before any synergy benefit even enters the conversation.', marks: 1, tag: 'discuss' },
      { text: 'Apply a 25% private-company discount to standalone (£125.7m): the offer is now defensible on illiquidity grounds. So the offer can be argued either way.', marks: 1, tag: 'discuss' },
      { text: 'Critical observation: even the realistic max bid of £241m would let Tyne capture £73m of synergy. Pricing at £155m means Tyne captures £159m of synergy (more than the £147m available). The offer assumes that sellers will accept zero share of the value created post-deal, which is unrealistic.', marks: 2, tag: 'discuss' },
      { text: 'Recommendation: revise to £180-210m range. Still leaves substantial upside for Tyne while acknowledging seller bargaining. Approach with a 90-day exclusive period and a clear walk-away above £230m.', marks: 1, tag: 'recommend' },
      { text: 'Risk 1: cultural integration. Football clubs are unusually identity-driven; supporters of both clubs may resist a merger and damage commercial value beyond what synergy models capture. Plan: separate match-day operations for at least 3 years.', marks: 1, tag: 'discuss' },
      { text: 'Risk 2: regulatory complexity. Premier League and EFL rules around dual ownership and "associated party" transactions; FA approval; competition authority review. Mitigation: pre-discuss structure with PL board and FA before any binding offer.', marks: 1, tag: 'discuss' },
      { text: 'Risk 3: squad and contract risk. Player contracts may include clauses triggered by ownership changes; key players may seek to leave; manager and staff continuity is fragile. Plan: retention bonus pool of £8-12m budgeted within integration costs.', marks: 1, tag: 'discuss' },
    ],
    notes:
      'Sellers-cannot-accept logic plus three football-specific risks earns full marks. Generic "regulatory risk" without naming PL/FA loses the application mark.',
    profSkills: [],
  },

  // SET 6 — Seagull MIRR
  'set-6:0': {
    intro: 'NPV, IRR, and MIRR for three projects. Show working to discount factors and ranking table.',
    lines: [
      { text: 'Discount factors at 9%: 0.917, 0.842, 0.772, 0.708, 0.650.', marks: 1, tag: 'workings' },
      { text: 'NPV: A = -28 + 5.50 + 6.74 + 7.72 + 8.50 + 9.10 = £9.56m. B = -40 + 3.67 + 6.74 + 9.26 + 12.74 + 14.30 = £6.71m. C = -55 + 7.34 + 10.10 + 12.35 + 14.16 + 15.60 = £4.55m.', marks: 3, tag: 'calc' },
      { text: 'IRR by trial. A: 18% gives NPV ~ 0, so IRR(A) ≈ 18.4%. B: 14% gives NPV ~ 0, so IRR(B) ≈ 13.9%. C: 11% gives NPV ~ 0, so IRR(C) ≈ 11.5%.', marks: 3, tag: 'calc' },
      { text: 'MIRR: terminal value at reinvestment rate 6%. A: 6 * 1.06^4 + 8 * 1.06^3 + 10 * 1.06^2 + 12 * 1.06 + 14 = 7.575 + 9.528 + 11.236 + 12.720 + 14.000 = 55.06. MIRR(A) = (55.06/28)^0.2 - 1 = 14.4%.', marks: 2, tag: 'calc' },
      { text: 'B: TV = 5.05 + 9.53 + 13.48 + 19.08 + 22 = 69.14. MIRR(B) = (69.14/40)^0.2 - 1 = 11.6%.', marks: 1, tag: 'calc' },
      { text: 'C: TV = 10.10 + 14.29 + 17.98 + 21.20 + 24 = 87.57. MIRR(C) = (87.57/55)^0.2 - 1 = 9.8%.', marks: 1, tag: 'calc' },
      { text: 'Ranking table: NPV: A > B > C. IRR: A > B > C. MIRR: A > B > C. All three metrics agree.', marks: 2, tag: 'discuss' },
      { text: 'Recommendation: Project A. Highest NPV (£9.56m), highest IRR (18.4%), highest MIRR (14.4%), lowest absolute capital outlay, and a training-ground investment is operationally less volatile than stadium hospitality.', marks: 1, tag: 'recommend' },
    ],
    notes: 'The mark differentiator is showing all three TVs explicitly and presenting the ranking in table form. Forgetting that the reinvestment rate (6%) is different from the cost of capital (9%) is a 3-mark loser.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: 'Ranking table presented clearly.' },
      { skill: 'Analysis', marks: 2, example: 'All three metrics shown with intermediate calculations.' },
      { skill: 'Commercial', marks: 2, example: 'Recommendation tied to operational risk profile, not just numbers.' },
    ],
  },
  'set-6:1': {
    intro: 'Why rankings can differ; recommend the right metric for the situation.',
    lines: [
      { text: 'NPV vs IRR can differ when projects have different scale, timing, or sign patterns. IRR is a percentage and ignores absolute size; a small project can have a higher IRR but lower NPV. For mutually exclusive ranking, NPV wins.', marks: 1, tag: 'discuss' },
      { text: 'IRR vs MIRR: IRR assumes intermediate cash flows reinvest at the IRR itself, often unrealistic. MIRR uses an explicit, more realistic reinvestment rate. When IRR is well above the reinvestment rate, IRR overstates the true return.', marks: 1, tag: 'discuss' },
      { text: 'Multiple IRRs: projects with non-conventional cash flows (sign changes mid-life) can have multiple IRRs. MIRR avoids this by giving a single value.', marks: 1, tag: 'discuss' },
      { text: 'Recommendation: NPV is the right primary metric (it measures absolute value created, what shareholders care about). MIRR is a useful secondary check because it corrects for the unrealistic reinvestment assumption in IRR.', marks: 1, tag: 'recommend' },
      { text: 'For Seagull specifically, A is the clear choice on all three metrics, lowest capital outlay (lowest absolute risk), and the training-ground investment likely produces less revenue volatility than stadium hospitality.', marks: 2, tag: 'discuss' },
    ],
    notes: 'Match the metric to the decision. The "all three agree" case is the easy version; the harder version (different rankings) is where the marks really come.',
    profSkills: [],
  },

  // SET 9 — Hammerside IR hedge
  'set-9:0': {
    intro:
      'Three strategies, two scenarios = six numerical cells. Each cell needs the formula, computation, and effective rate.',
    lines: [
      { text: 'FRA at 5.25% scenario A (rate to 5.60%): loan interest 60m * 5.60% * 3/12 = £840k. FRA receipt 60m * (5.60-5.25)% * 3/12 = £52.5k. Net £787.5k = 5.25% effective.', marks: 1, tag: 'calc' },
      { text: 'FRA scenario B (rate to 4.40%): loan £660k. FRA pay 60m * (5.25-4.40)% * 3/12 = £127.5k. Net £787.5k = 5.25% effective.', marks: 1, tag: 'calc' },
      { text: 'Futures: contracts = 60m / 500k * 3/3 = 120 contracts. Sell to hedge against rising rates.', marks: 1, tag: 'workings' },
      { text: 'Scenario A: futures price 100 - 5.60 = 94.40. Tick movement 94.65 - 94.40 = 25 ticks favourable. Profit = 25 * £12.50 * 120 = £37,500. Net £840k - £37.5k = £802.5k = 5.35%.', marks: 2, tag: 'calc' },
      { text: 'Scenario B: futures price 95.60. Loss 95 ticks * £12.50 * 120 = £142,500. Net £660k + £142.5k = £802.5k = 5.35%.', marks: 2, tag: 'calc' },
      { text: 'Collar: net premium 0.32% - 0.18% = 0.14% on 60m * 3/12 = £21,000 upfront.', marks: 1, tag: 'workings' },
      { text: 'Scenario A: cap pays out 60m * (5.60-5.25)% * 3/12 = £52.5k. Net £840k - £52.5k + £21k = £808.5k = 5.39%.', marks: 2, tag: 'calc' },
      { text: 'Scenario B: floor pays out 60m * (4.75-4.40)% * 3/12 = £52.5k. Net £660k + £52.5k + £21k = £733.5k = 4.89%.', marks: 2, tag: 'calc' },
      { text: 'Summary table: FRA flat at 5.25% in both scenarios. Futures flat at 5.35% in both. Collar 5.39% in rising rates, 4.89% in falling rates.', marks: 2, tag: 'discuss' },
    ],
    notes:
      'Examiner watches for: wrong direction on futures (buying instead of selling), forgetting to periodise the rate (annual not quarterly), and not netting the FRA settlement against the loan interest. All three strategies must be tabulated.',
    profSkills: [
      { skill: 'Communication', marks: 1, example: '6-cell summary table at the end.' },
      { skill: 'Analysis', marks: 2, example: 'Effective rate column shown explicitly.' },
      { skill: 'Commercial', marks: 1, example: 'Match each strategy to the treasurer\'s risk profile.' },
      { skill: 'Scepticism', marks: 1, example: 'Acknowledge basis risk (futures) and counterparty risk (FRA, collar).' },
    ],
  },
  'set-9:1': {
    intro: 'Trade-offs and recommendation. Tie back to the treasurer\'s stated brief.',
    lines: [
      { text: 'FRA: highest certainty, fixed effective rate at 5.25%. Zero participation if rates fall. Best for pure fixed-cost preference.', marks: 1, tag: 'discuss' },
      { text: 'Futures: similar economics to FRA, slightly worse rate (5.35%) reflecting basis risk and convergence. Adds margin requirements and contract sizing slippage. Generally suits short tenors with active risk management.', marks: 1, tag: 'discuss' },
      { text: 'Collar: bounded range. Slight cost premium in rising rates (5.39% vs 5.25% fixed), but participation in falling rates (4.89% vs 5.25% fixed). Net premium upfront is small.', marks: 1, tag: 'discuss' },
      { text: 'Treasurer\'s brief (risk-averse, fixed budget, some participation): the collar matches best. Treasurer can present a 5.25% maximum cost to the board (true ceiling), with potential to benefit at 4.89% if rates fall. The £21k net premium is small relative to the £60m exposure.', marks: 2, tag: 'recommend' },
      { text: 'Alternative recommendation: if the treasurer is purely risk-averse with no participation requirement, the FRA is the right choice (5.25% flat, zero premium, no margin).', marks: 1, tag: 'recommend' },
    ],
    notes:
      'The mark differentiator is matching each strategy to a stated brief, not just listing pros and cons.',
    profSkills: [],
  },
};

export function getSampleAnswer(setId: string, reqIndex: number): SampleAnswer | undefined {
  return SAMPLE_ANSWERS[`${setId}:${reqIndex}`];
}
