/**
 * 14 Original AFM practice sets, football-themed.
 * Mirrors ACCA Section A (50m) and Section B (25m) format.
 * No em dashes anywhere.
 */

interface Exhibit {
  number: number;
  title: string;
  body: string;
}

interface Requirement {
  label: string;
  marks: number;
  hint: string;
  solution: string[];
}

interface MarkSchemeRow {
  item: string;
  marks: number;
}

export interface PracticeSet {
  id: string;
  number: number;
  club: string;
  topic: string;
  module: 1 | 2 | 3 | 4;
  section: 'A' | 'B';
  marks: number;
  minutes: number;
  banner: string;
  background: string;
  exhibits: Exhibit[];
  requirements: Requirement[];
  markScheme: MarkSchemeRow[];
  examinerNote: string;
}

export const PRACTICE_SETS: PracticeSet[] = [
  // ───────── SET 1A: Lilywhite Co (APV / international) ─────────
  {
    id: 'set-1a',
    number: 1,
    club: 'Lilywhite Co',
    topic: 'APV and international investment appraisal',
    module: 1,
    section: 'A',
    marks: 50,
    minutes: 90,
    banner: 'Section A · 50 marks · 90 minutes · Report-style',
    background:
      'Lilywhite Co is a UK football and entertainment group reporting in pounds sterling. The board is considering a five-year US-based commercial and academy operation, "Lilywhite USA", to capitalise on rising US interest in European football and to develop a North American player development pipeline. As senior member of the corporate finance team, evaluate using the Adjusted Present Value approach.',
    exhibits: [
      {
        number: 1,
        title: 'Project cash flows and initial investment',
        body: 'Initial investment US$185m: land and training facility US$80m, equipment US$45m, working capital US$25m (recoverable Y5), pre-operating costs US$35m. Equipment qualifies for 20% straight-line tax depreciation over 5 years. Equipment disposal at Y5: US$8m. Land and facility disposal at Y5: US$95m. Working capital fully released at Y5.',
      },
      {
        number: 2,
        title: 'Forecast operating performance (US$m, nominal)',
        body: 'Year 1: revenue 42, costs 30, depreciation 9. Year 2: 68, 44, 9. Year 3: 95, 58, 9. Year 4: 110, 64, 9. Year 5: 118, 68, 9. US tax 25%, payable in year incurred. Results ring-fenced for US tax.',
      },
      {
        number: 3,
        title: 'Group cost of capital and comparator data',
        body: 'Lilywhite: equity £1,800m, debt £600m post-tax cost 4.2%, equity beta 1.20. UK Rf 4.5%, ERP 6.0%, tax 25%. US comparator group: equity beta 1.45, D/E 0.40, debt beta 0.15.',
      },
      {
        number: 4,
        title: 'Financing structure',
        body: 'US$70m subsidised loan at 4.0% from Georgia state economic development; market rate 6.5%. Issue costs US$1.4m upfront, tax-deductible immediately. Remaining US$115m via parent equity injection.',
      },
      {
        number: 5,
        title: 'Currency and macro',
        body: 'Spot: £1 = US$1.27. UK inflation 3.0%, US inflation 4.5%. Lilywhite remits all available cash flows to UK as dividends; no further UK tax (DTR covers).',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate the APV of the project. Show base-case NPV (in £, using PPP for FX) and financing side effects (issue costs, tax shield on subsidy debt, value of subsidy)',
        marks: 22,
        hint: 'Step 1: ungear US comparator beta. Step 2: CAPM with UK Rf and ERP for unlevered cost of equity. Step 3: PPP forecast £/$ for years 1 to 5. Step 4: build US$ cash flow proforma with tax. Step 5: convert to £, discount at unlevered Ke. Step 6: discount tax shield at risk-free, subsidy at unsubsidised debt rate post-tax.',
        solution: [
          'Asset beta: Beta_a = 1.45 * (1/1.30) + 0.15 * (0.30/1.30) = 1.115 + 0.035 = 1.150',
          'Ungeared Ke = 4.5% + 1.150 * 6.0% = 11.4% (use UK Rf since cash flows in £)',
          'PPP: S_n = 1.27 * (1.045/1.030)^n. Y1 1.2885, Y2 1.3073, Y3 1.3263, Y4 1.3456, Y5 1.3652',
          'Year 5 net US$ = operating 39.75 + WC release 25 + equipment 8 + land 95 = 167.75',
          'Convert and discount: PV = -145.67 + 7.84 + 12.49 + 16.36 + 17.73 + 71.64 = -19.61',
          'Issue costs after tax: 1.4 * 0.75 / 1.27 = £0.83m',
          'Tax shield on subsidy debt: 70 * 4% * 25% * AF(5y, 4.5%) = 0.70 * 4.39 = US$3.07m, £2.33m',
          'Subsidy benefit: 70 * 2.5% * 0.75 * AF(5y, 4.875%) = 1.31 * 4.36 = US$5.71m, £4.33m',
          'APV = -19.61 + (-0.83 + 2.33 + 4.33) = -19.61 + 5.83 = £-13.78m',
        ],
      },
      {
        label: '(b) Discuss key assumptions and limitations: ungeared Ke choice, financing-flow discount rate, PPP appropriateness over 5 years',
        marks: 10,
        hint: 'One mark per developed point. Cover beta proxy reliability, PPP failure in short run, discount rate matching to cash flow risk, terminal value uncertainty, tax simplifications, sensitivity to revenue forecast.',
        solution: [
          'Asset beta from US comparators is a central estimate, not precise; comparators differ in scale and revenue mix',
          'PPP holds long run but deviates substantially short-medium term; 5 years compounding inflation introduces estimation risk',
          'Tax shield discount at Rf is justified because shield is contractual; subsidy discounted at unsubsidised post-tax debt rate because it depends on continued debt service',
          'Terminal land/facility disposal at US$95m is single-point; real estate values 5y out are uncertain',
          'Revenue ramp 42 to 118 assumes successful market penetration; biggest forecast risk',
          'US-UK tax interaction (GILTI, withholding) more complex than modelled',
        ],
      },
      {
        label: '(c) Advise the board on strategic and financial case; identify three non-financial factors',
        marks: 8,
        hint: 'Recommendation tied to APV figure, plus real options on US expansion, brand and commercial uplift to parent, player pipeline value, FX sensitivity, competitive timing.',
        solution: [
          'APV negative (£-13.78m); on current numbers project does not create value',
          'Strategic real options: US base provides platform for further North American expansion, not in NPV',
          'Brand uplift to UK parent: increased US visibility may lift global merch, broadcast, tour revenue',
          'Player pipeline: future first-team players or saleable assets beyond Y5',
          'Sensitivity: 10% revenue uplift likely flips APV positive; commission scenario analysis',
          'Recommendation: do not approve in current form; commission sensitivity, real options valuation, revenue benchmarking before reconsidering',
        ],
      },
    ],
    markScheme: [
      { item: 'Asset beta calculation', marks: 2 },
      { item: 'Ungeared Ke via CAPM', marks: 1 },
      { item: 'PPP forecast rates', marks: 2 },
      { item: 'US$ cash flow schedule', marks: 4 },
      { item: 'Working capital, disposals, balancing items', marks: 2 },
      { item: 'Conversion to £ and discounting', marks: 5 },
      { item: 'Base-case NPV', marks: 1 },
      { item: 'Issue costs', marks: 1 },
      { item: 'Tax shield on subsidy debt', marks: 2 },
      { item: 'Subsidy benefit', marks: 2 },
      { item: 'Assumptions and limitations', marks: 10 },
      { item: 'Recommendation and non-financial factors', marks: 8 },
      { item: 'Professional Skills', marks: 10 },
    ],
    examinerNote:
      'Section A always rewards a clean report layout, lead with the recommendation. Quote scenario figures throughout. Issue, action, outcome on ESG. Compare alternatives in tables. Skip to the next part if stuck on numbers.',
  },

  // ───────── SET 1B: Coq Sportif Co (FCFF valuation) ─────────
  {
    id: 'set-1b',
    number: 2,
    club: 'Coq Sportif Co',
    topic: 'Business valuation via FCFF',
    module: 2,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Coq Sportif Co is a privately owned Ligue 1 French club. Northern Star Partners (NSP), a private equity consortium, has tabled an indicative offer of €185 million for 100% of equity. The owners want an independent valuation to inform negotiation.',
    exhibits: [
      {
        number: 1,
        title: 'Recent and forecast performance (€m)',
        body: 'Last year: revenue 110, costs 88, dep 8, op profit 14. Y1: 118, 94, 9, 15. Y2: 128, 102, 10, 16. Y3: 140, 110, 11, 19. Y4: 150, 117, 12, 21. Y5: 158, 122, 12, 24. Post Y5: revenue grows 2.5% in perpetuity, op margin held at Y5 level.',
      },
      {
        number: 2,
        title: 'Capital structure and other',
        body: 'Capex €14m p.a. Y1-Y5; equal to depreciation thereafter. Working capital 2% of incremental revenue. Debt €60m fair value, post-tax cost 4.5%. Comparator equity beta 1.30, D/(D+E) 35%. Rf 3.0%, ERP 5.5%, tax 25%. Coq Sportif D/(D+E) 30%.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate enterprise value and equity value using FCFF with perpetuity terminal value',
        marks: 14,
        hint: 'Ungear comparator beta (D/E 0.5385). Regear at Coq target gearing (D/E 0.4286). CAPM for Ke. WACC. FCFF schedule Y1 to Y5. Terminal value at WACC minus growth. Discount and sum. Subtract debt for equity.',
        solution: [
          'Ungear: Beta_a = 1.30 * (0.65/0.9125) = 0.926',
          'Regear: Beta_e = 0.926 * (1 + 0.4286 * 0.75) = 0.926 * 1.3214 = 1.224',
          'Ke = 3.0% + 1.224 * 5.5% = 9.73%',
          'WACC = 0.70 * 9.73% + 0.30 * 4.5% = 8.16%, round 8.2%',
          'FCFF Y1-Y5: 6.09, 7.80, 11.01, 13.55, 15.84',
          'Terminal: NOPAT_6 = 18.0 * 1.025 = 18.45, FCFF_6 = 18.37, TV = 18.37 / 0.057 = €322.3m',
          'PV: 5.63 + 6.66 + 8.69 + 9.89 + 10.68 + 217.23 = €258.78m EV',
          'Equity = 258.78 - 60 = €198.78m',
        ],
      },
      {
        label: '(b) Evaluate the €185m offer and identify three football-specific factors FCF may miss',
        marks: 6,
        hint: 'Offer is below valuation. Football-specific: player registrations as asset class, promotion/relegation/UCL optionality, stadium real estate value, regulatory environment.',
        solution: [
          'Offer €185m vs valuation €198.78m: ~7% below; basis to negotiate up',
          'Player registrations are a separate asset class with revaluable, tradeable value',
          'Promotion, relegation, UCL qualification can swing revenue 30%+ in one season; FCF point estimate cannot capture convexity',
          'Stadium and training ground may have standalone real estate value above contribution to operating cash flow; SOTP may be more appropriate',
          'UEFA FFP, Ligue 1 salary caps, broadcasting cycles add uncertainty not in DCF',
        ],
      },
    ],
    markScheme: [
      { item: 'Beta regearing', marks: 2 },
      { item: 'WACC', marks: 2 },
      { item: 'FCFF schedule', marks: 4 },
      { item: 'Working capital and capex', marks: 2 },
      { item: 'Terminal value', marks: 2 },
      { item: 'Discounting and EV', marks: 1 },
      { item: 'Equity bridge', marks: 1 },
      { item: 'Offer evaluation', marks: 2 },
      { item: 'Three football-specific limitations', marks: 4 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Examiner favourite: FCFF with two-stage growth. Always show beta ungear and regear. Comment on offer fit, do not just state numbers.',
  },

  // ───────── SET 1C: Lilywhite Co (FX hedging) ─────────
  {
    id: 'set-1c',
    number: 3,
    club: 'Lilywhite Co',
    topic: 'FX hedging: forward, MMH, options',
    module: 4,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'On 15 May, Lilywhite has agreed a €42m transfer fee for a Spanish La Liga player, payable in three equal €14m instalments on 15 August, 15 November, and 15 February. Reporting currency is sterling. The CFO is concerned about euro strengthening before payment dates and asks you to evaluate three hedging alternatives.',
    exhibits: [
      {
        number: 1,
        title: 'Market data on 15 May',
        body: 'Spot £1 = €1.1750/€1.1755. 3m fwd 1.1690/1.1696. 6m fwd 1.1635/1.1642. 9m fwd 1.1580/1.1588. £ borrow 5.40%, deposit 4.90%. € borrow 3.80%, deposit 3.30%.',
      },
      {
        number: 2,
        title: 'Currency options on €/£ (call on €)',
        body: 'Strike 1.17: Aug call 0.85p, Nov call 1.20p, Feb call 1.55p. Strike 1.16: Aug 0.50p, Nov 0.85p, Feb 1.20p. Premium in pence per €1.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate £ cost of €42m under (i) forward contracts (ii) money market hedge (iii) options at 1.17 strike, given spot at exercise = €1.1500',
        marks: 14,
        hint: 'Forward: split into 3 instalments at corresponding forward rate (use bank-offer side). MMH: PV € at € deposit rate, convert at spot, borrow £ to fund. Options: in the money at 1.15 spot, exercise all three at 1.17, pay premium upfront with financing cost.',
        solution: [
          'Forward Aug €14m / 1.1690 = £11,975,193',
          'Forward Nov €14m / 1.1635 = £12,031,800',
          'Forward Feb €14m / 1.1580 = £12,089,810',
          'Forward total = £36,096,803',
          'MMH Aug: € deposit 14m/1.00825 = €13,885,442, £ borrow 11,817,398, repay 11,976,933',
          'MMH total = £36,112,007',
          'Options exercise at 1.17: 14m/1.17 = £11,965,812 each x 3 = £35,897,436',
          'Premium with financing 5.4%: £518,932',
          'Options total = £36,416,368',
          'Cheapest: forward at £36.10m',
        ],
      },
      {
        label: '(b) Evaluate suitability given certainty of underlying, multi-instalment structure, board preference for predictability',
        marks: 6,
        hint: 'Forward: simple, fixed, certain when underlying is committed. MMH: similar economics but balance-sheet impact. Options: keep upside but premium cost; suit only if underlying deal still uncertain (medical, regulator).',
        solution: [
          'Forward best for certain payables of fixed amount and date; aligns with board preference',
          'MMH near-identical economics by IRP; small bid-ask difference; uses debt facility headroom',
          'Options preserve upside if euro weakens; premium expensive when underlying is committed',
          'Recommendation: forwards for all three instalments. Consider call option on August only if deal not yet certain (medical pending)',
        ],
      },
    ],
    markScheme: [
      { item: 'Forward calculations all 3 tenors', marks: 4 },
      { item: 'MMH structure logic', marks: 1 },
      { item: 'MMH calculations all 3 tenors', marks: 4 },
      { item: 'Option premium with financing', marks: 2 },
      { item: 'Option exercise and £ cost', marks: 2 },
      { item: 'Cheapest identified', marks: 1 },
      { item: 'Suitability evaluation', marks: 5 },
      { item: 'Recommendation', marks: 1 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always tabulate three hedges side by side. Use bank offer side when buying foreign currency. Future-value option premium to cash date.',
  },

  // ───────── SET 2: Cannon Park (real options) ─────────
  {
    id: 'set-2',
    number: 4,
    club: 'Cannon Park FC',
    topic: 'Real options: option to expand',
    module: 3,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Cannon Park FC, a London Premier League club, is evaluating a stadium-adjacent commercial development with a hotel, conference centre, and retail complex. Phase 1 (£180m) has negative NPV, but the project includes an option to expand into Phase 2 if Phase 1 succeeds, doubling the footprint.',
    exhibits: [
      {
        number: 1,
        title: 'Phase 1 (mandatory if proceeding)',
        body: 'Initial investment Y0: £180m. PV of operating cash flows Y1-Y10: £165m. Phase 1 NPV = £-15m at WACC 9%.',
      },
      {
        number: 2,
        title: 'Phase 2 option',
        body: 'End of Year 3, right (not obligation) to invest £140m. PV at Y3 of Phase 2 cash flows: £135m. Volatility 35% p.a. Risk free 4.5%. Time to expiry 3 years.',
      },
    ],
    requirements: [
      {
        label: '(a) Use BSOP to value the option to expand and calculate strategic NPV; conclude on the project',
        marks: 14,
        hint: 'Map BSOP inputs: Pa = 135 / 1.045^3 (discount Y3 PV to today at Rf). Pe = 140. t = 3. r = 4.5%. sigma = 0.35. Compute d1, d2, N(d1), N(d2). Call value. Strategic NPV = -15 + call value.',
        solution: [
          'Pa = 135 / 1.045^3 = £118.21m',
          'd1 = (ln(118.21/140) + (0.045 + 0.35^2/2) * 3) / (0.35 * sqrt(3)) = (-0.1691 + 0.31875) / 0.6062 = 0.247',
          'd2 = 0.247 - 0.6062 = -0.359',
          'N(d1) = N(0.247) = 0.5975, N(d2) = N(-0.359) = 0.3598',
          'Call = 118.21 * 0.5975 - 140 * 0.3598 * e^-0.135 = 70.63 - 44.01 = £26.62m',
          'Strategic NPV = -15 + 26.62 = +£11.62m',
          'Conclusion: proceed. Phase 1 alone destroys value but option to expand makes overall positive',
        ],
      },
      {
        label: '(b) Discuss BSOP assumptions and limitations; identify two scenarios where unreliable',
        marks: 6,
        hint: 'Volatility estimation, tradeable underlying assumption, single exercise date (European), fixed exercise price assumption, constant vol/Rf. Unreliable for compound options or illiquid underlyings with no comparator vol.',
        solution: [
          'Volatility from comparators or judgement; small sigma changes drive large value changes',
          'BSOP assumes tradeable underlying with perfect hedge; real assets cannot be hedged',
          'Single exercise date (European); real Phase 2 may be exercisable over a window (binomial better)',
          'Construction cost in 3 years not fixed; BSOP assumes fixed strike',
          'Constant volatility and risk-free rate over option life rarely true',
          'Unreliable when project has compound options (Phase 2 contains further options) or illiquid underlying with no comparator vol',
        ],
      },
    ],
    markScheme: [
      { item: 'Map inputs to BSOP framework', marks: 2 },
      { item: 'Discount Y3 PV to today (Pa)', marks: 1 },
      { item: 'd1 calculation', marks: 2 },
      { item: 'd2 calculation', marks: 1 },
      { item: 'N(d1), N(d2)', marks: 2 },
      { item: 'Call value', marks: 3 },
      { item: 'Strategic NPV and recommendation', marks: 3 },
      { item: 'BSOP limitations (4 max)', marks: 4 },
      { item: 'Two scenarios where unreliable', marks: 2 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always map real-option scenario to BSOP inputs first. Pa is what you get, Pe is what you pay. Comment on whether the option is in the money.',
  },

  // ───────── SET 3: Sky Blue (swap) ─────────
  {
    id: 'set-3',
    number: 5,
    club: 'Sky Blue Holdings',
    topic: 'Interest rate swap and comparative advantage',
    module: 4,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Sky Blue Holdings, parent of a Premier League club, has £200m floating-rate debt and wants to swap to fixed (expects rates to rise). Northern Steel plc has £200m fixed and wants to swap to floating (expects rates to fall). A bank intermediary charges 0.10% p.a., split equally. Remaining benefit shared equally.',
    exhibits: [
      {
        number: 1,
        title: 'Borrowing rates available',
        body: 'Sky Blue: fixed 6.40%, floating SONIA + 0.60%. Northern Steel: fixed 5.20%, floating SONIA + 0.20%.',
      },
      {
        number: 2,
        title: 'Swap terms',
        body: 'Bank fees 0.10% p.a. total, split equally (0.05% each). Remaining benefit shared 50/50.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate total potential gain, net gain to each party after fees, effective borrowing cost post-swap; show cash flow structure',
        marks: 12,
        hint: 'QSD = fixed differential minus floating differential = 1.20% - 0.40% = 0.80%. Less fees 0.10% leaves 0.70% to share, 0.35% each. Sky Blue borrows where it has comparative advantage (floating). Northern Steel borrows fixed. They swap.',
        solution: [
          'QSD = 1.20% - 0.40% = 0.80% total benefit on £200m = £1.6m',
          'After 0.10% bank fees, 0.70% to share, 0.35% each',
          'Sky Blue borrows floating SONIA + 0.60%; target post-swap fixed = 6.40% - 0.35% - 0.05% = 6.00%',
          'Northern Steel borrows fixed 5.20%; target post-swap floating = SONIA + 0.20% - 0.35% - 0.05% = SONIA - 0.20%',
          'Sky Blue pays: SONIA + 0.60% to lender, fixed X to NS, receives SONIA from NS. Net X + 0.60% = 6.00%, so X = 5.40%',
          'Each saves 0.40% = £800,000 p.a.',
          'Bank fees paid separately at 0.05% each',
        ],
      },
      {
        label: '(b) Identify three risks and discuss whether swap is preferable to futures or caps',
        marks: 8,
        hint: 'Counterparty risk, basis risk on different SONIA indices, opportunity cost if rates fall. Futures only suit short tenors. Caps preserve flexibility but cost premium.',
        solution: [
          'Counterparty risk: NS may default; mitigated by central clearing',
          'Basis risk: SONIA-compounded vs term SONIA',
          'Opportunity cost: locked into 6.00% even if rates fall',
          'Futures: short tenors only (~2 years), basis risk, contract size mismatch',
          'Caps: protect from rises while preserving falls; premium cost',
          'Swap right tool for long-dated, large notional, fixed-cost preference. Partial cap overlay can add flexibility',
        ],
      },
    ],
    markScheme: [
      { item: 'Comparative advantage', marks: 2 },
      { item: 'Total benefit', marks: 1 },
      { item: 'Distribution after fees', marks: 1 },
      { item: 'Effective rates', marks: 2 },
      { item: 'Cash flow structure / X solving', marks: 3 },
      { item: 'Cross-check both sides', marks: 1 },
      { item: 'Summary table', marks: 2 },
      { item: 'Three risks', marks: 3 },
      { item: 'Alternatives discussion', marks: 4 },
      { item: 'Reasoned conclusion', marks: 1 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always draw the swap diagram with arrows. Show working for X (the fixed rate Sky Blue pays NS). State who has comparative advantage in which market.',
  },

  // ───────── SET 4: Tyne United (acquisition) ─────────
  {
    id: 'set-4',
    number: 6,
    club: 'Tyne United',
    topic: 'Acquisition and synergy valuation',
    module: 2,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Tyne United, LSE-listed Premier League club, considering acquiring Riverside Rangers, a privately owned Championship club. Combined entity benefits from broadcasting, commercial synergies, and shared training infrastructure.',
    exhibits: [
      {
        number: 1,
        title: 'Standalone valuations',
        body: 'Tyne: 80m shares at £8.50, book equity £320m, EBITDA £75m, FCFF Y1 £50m growing 5% Y1-Y5 then 2% perpetuity, debt £180m, WACC 8.5%. Riverside: book equity £95m, EBITDA £18m, FCFF Y1 £12m growing 8% Y1-Y5 then 3% perpetuity, debt £50m, WACC 9.5%.',
      },
      {
        number: 2,
        title: 'Synergies (after-tax)',
        body: 'Commercial cross-sell £4m p.a. from Y2. Broadcasting bundling £3m p.a. Cost savings £5m p.a. Total £12m p.a. Growth 2% in perpetuity from Y2. Combined WACC 8.7%. One-off integration costs £18m at Y0.',
      },
      {
        number: 3,
        title: 'Offer structure',
        body: 'Tyne offering £155m for 100% of Riverside equity, payable in cash.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate (i) standalone equity value of Riverside via FCFF, (ii) value of synergies, (iii) maximum price Tyne could rationally pay',
        marks: 14,
        hint: 'Riverside FCFF Y1-Y5: 12, 12.96, 14, 15.12, 16.33. Discount at 9.5%. TV at Y5 = 16.33 * 1.03 / 0.065. Synergies: PV of growing perpetuity at combined WACC 8.7%, discount one period back. Less integration cost. Max price = standalone + synergy.',
        solution: [
          'Riverside EV via FCFF: PV Y1-5 + PV TV = 53.33 + 164.32 = £217.65m',
          'Riverside equity = 217.65 - 50 = £167.65m',
          'PV synergies at Y1 = 12 / (0.087 - 0.02) = £179.10m',
          'PV at Y0 = 179.10 / 1.087 = £164.77m',
          'Less integration costs = £146.77m net synergy',
          'Max price = 167.65 + 146.77 = £314.42m',
        ],
      },
      {
        label: '(b) Evaluate £155m offer; identify three non-financial risks',
        marks: 6,
        hint: 'Offer below standalone value; sellers will reject. Apply 25% private-company discount: 167.65 * 0.75 = 125.7. Acquirer captures all synergy at this price. Non-financial: cultural integration, regulatory (PL/EFL ownership), squad and contract risks.',
        solution: [
          '£155m below £167.65m standalone, so likely rejected by current owners',
          'Defensible on private-company discount basis (25% to £125.7m)',
          'Acquirer captures almost all synergy; sellers usually share',
          'Recommend revised offer £180-210m range; still leaves Tyne value, more likely accepted',
          'Cultural integration: supporters may resist; community identity',
          'Regulatory: PL/EFL ownership rules, FA approval, competition authority',
          'Squad and contract risk: change-of-control clauses, key player exits, manager continuity',
        ],
      },
    ],
    markScheme: [
      { item: 'FCFF schedule for Riverside', marks: 3 },
      { item: 'Terminal value', marks: 2 },
      { item: 'Discounting and EV', marks: 2 },
      { item: 'Equity bridge', marks: 1 },
      { item: 'PV growing perpetuity for synergies', marks: 3 },
      { item: 'Integration cost', marks: 1 },
      { item: 'Maximum price', marks: 2 },
      { item: 'Offer evaluation', marks: 3 },
      { item: 'Three non-financial risks', marks: 3 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always state stand-alone, with-synergy, max bid in three columns. Stand-alone is the floor, max bid is the ceiling. Do not confuse them.',
  },

  // ───────── SET 5: Goodison Bay (reconstruction) ─────────
  {
    id: 'set-5',
    number: 7,
    club: 'Goodison Bay FC',
    topic: 'Corporate reconstruction',
    module: 3,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Goodison Bay, Premier League club narrowly avoiding relegation three years running. Years of losses and aggressive transfer spending. New investor consortium Marina Capital offers equity injection in return for comprehensive financial restructuring. Liquidation alternative would yield £140m total.',
    exhibits: [
      {
        number: 1,
        title: 'Current capital structure (£m, book values)',
        body: 'Ordinary share capital £50m, retained losses £-140m, equity £-90m. 8% secured loan notes £120m. 6% unsecured bonds £80m. Bank overdraft £35m. Trade payables £28m. Player transfer payables £45m. Total liabilities £308m. Total assets £218m.',
      },
      {
        number: 2,
        title: 'Reconstruction proposal',
        body: 'Existing shares cancelled. Marina injects £100m for 80% of new equity. Existing get 20%. Secured: 25% haircut, residual £90m at 6% to 2030. Unsecured bonds: 50% haircut, £40m mandatory convertibles (auto-convert Y3 at 5% new equity). Overdraft: replaced with £40m RCF. Trade payables: paid 100%. Transfer payables: 70% at completion (£31.5m), 30% deferred 18m no interest.',
      },
      {
        number: 3,
        title: 'Forecast post-reconstruction',
        body: 'EBITDA Y1 £25m, Y2 £35m, Y3+ £45m. Capex £15m p.a. WACC 9%.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate gain/loss to each class under reconstruction; assess if each class would rationally support vs liquidation. Liquidation distributes £140m by legal priority',
        marks: 14,
        hint: 'Liquidation waterfall: secured 100%, overdraft next charge gets remainder, unsecured nothing. Reconstruction: each class compared. Identify the critical class that may resist (secured loan notes lose £30m).',
        solution: [
          'Liquidation: secured £120m, overdraft £20m (of £35), trade £0, player £0, unsecured £0, equity £0',
          'Reconstruction: secured £90m (loss £30m vs liq), overdraft £35m (gain £15m), trade £28m (gain £28m), player £45m (gain £45m), unsecured £40m+ (gain £40m+), equity 20% new equity',
          'Post-reconstruction EV: 22.5/0.09 = £250m, less new debt £170m = equity £80m, existing 20% = £16m',
          'Critical class: secured loan notes lose £30m; their support is the dealbreaker',
          'Other classes all far better off; will support',
          'Negotiating leverage: secured may demand reduced haircut (10-15%) or warrants',
        ],
      },
      {
        label: '(b) Identify three indicators of financial distress and discuss role of senior financial adviser',
        marks: 6,
        hint: 'Negative FCF, interest cover, working capital, wage-to-revenue. Adviser role: forward-looking monitoring, covenant management, strategic optionality.',
        solution: [
          'Persistent negative FCF despite revenue growth; wage-to-revenue above 70% prudential threshold',
          'Interest cover < 2 and falling',
          'Working capital deterioration: extended trade days, deferred transfer fees, overdraft reliance',
          'Adviser builds rolling 18-month forecasts, stress-tests against scenarios',
          'Covenant management: dialogue with lenders before breach',
          'Strategic optionality: Plan B (asset sales, equity candidates) before distress is acute',
        ],
      },
    ],
    markScheme: [
      { item: 'Liquidation waterfall', marks: 3 },
      { item: 'Reconstruction recoveries by class', marks: 4 },
      { item: 'Class-by-class assessment', marks: 3 },
      { item: 'Critical class identified', marks: 1 },
      { item: 'Equity sanity check', marks: 2 },
      { item: 'Deal completion analysis', marks: 1 },
      { item: 'Three distress indicators', marks: 3 },
      { item: 'Adviser role', marks: 3 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always show liquidation waterfall first. Identify which class would resist; that is the critical mark. Show post-reconstruction sanity check on equity value.',
  },

  // ───────── SET 6: Seagull Analytics (MIRR) ─────────
  {
    id: 'set-6',
    number: 8,
    club: 'Seagull Analytics FC',
    topic: 'MIRR and project ranking',
    module: 1,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Seagull Analytics, south-coast Premier League club known for data-driven decisions, has three mutually exclusive investment projects. Director of Football needs them ranked. Cost of capital 9%, reinvestment rate 6%.',
    exhibits: [
      {
        number: 1,
        title: 'Project cash flows (£m)',
        body: 'Project A Training Ground: Y0 -28, Y1 6, Y2 8, Y3 10, Y4 12, Y5 14. Project B Academy Expansion: Y0 -40, Y1 4, Y2 8, Y3 12, Y4 18, Y5 22. Project C Hospitality: Y0 -55, Y1 8, Y2 12, Y3 16, Y4 20, Y5 24.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate NPV, IRR, and MIRR for each project; rank',
        marks: 14,
        hint: 'NPV at 9%. IRR by trial. MIRR = (TV of inflows at reinvestment rate / |PV outflows|)^(1/n) - 1.',
        solution: [
          'NPV: A 9.56, B 6.71, C 4.55',
          'IRR: A 18.4%, B 13.9%, C 11.5%',
          'MIRR Project A: TV = 6*1.06^4 + 8*1.06^3 + 10*1.06^2 + 12*1.06 + 14 = 55.06; (55.06/28)^0.2 - 1 = 14.4%',
          'MIRR Project B: TV = 69.14; (69.14/40)^0.2 - 1 = 11.6%',
          'MIRR Project C: TV = 87.57; (87.57/55)^0.2 - 1 = 9.8%',
          'All metrics rank A > B > C',
        ],
      },
      {
        label: '(b) Discuss why rankings can differ and recommend best metric',
        marks: 6,
        hint: 'NPV vs IRR differ when scale, timing, sign patterns differ. IRR vs MIRR: IRR assumes reinvestment at IRR itself. NPV is right primary metric for ranking.',
        solution: [
          'NPV vs IRR can differ when projects have different scale, timing, sign patterns',
          'IRR vs MIRR: IRR assumes intermediate cash flows reinvested at IRR; MIRR uses explicit reinvestment rate',
          'Multiple IRRs possible with non-conventional cash flows; MIRR avoids this',
          'NPV is right primary metric (absolute value created); MIRR useful secondary check',
          'Recommend Project A: highest on all metrics; lowest absolute capex; training-ground less revenue volatility',
        ],
      },
    ],
    markScheme: [
      { item: 'NPV all 3', marks: 3 },
      { item: 'IRR all 3', marks: 3 },
      { item: 'MIRR TV', marks: 3 },
      { item: 'MIRR computation', marks: 3 },
      { item: 'Ranking table', marks: 2 },
      { item: 'Why rankings differ', marks: 4 },
      { item: 'Recommended metric and justification', marks: 2 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Examiner watches for: forgetting reinvestment rate is given (6%, not 9%); wrong sign on IRR; not commenting on which metric you would use.',
  },

  // ───────── SET 7: Atlas Football Group (SOTP) ─────────
  {
    id: 'set-7',
    number: 9,
    club: 'Atlas Football Group',
    topic: 'Sum-of-the-parts valuation',
    module: 2,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Atlas Football Group is a multi-club ownership vehicle holding majority stakes across Europe and South America. Preparing for partial 25% IPO. Standard consolidated DCF would obscure different risk and growth profiles. SOTP preferred.',
    exhibits: [
      {
        number: 1,
        title: 'Holdings',
        body: 'Real Olímpico (Spain, La Liga, 100%): EBITDA Y1 €80m, peer EV/EBITDA 6.0x-7.5x, debt €110m. FC Helsinki Star (Finland, 100%): €6m, 4.0x-5.0x, €8m. São Paulo Atlético (Brazil, 100%): €22m, 5.5x-6.5x, €18m. Wiener Sportklub (Austria, 60%): €12m, 4.5x-5.5x, €14m. Atlas Stadium Holdings: €18m, 12.0x-14.0x, €60m. Atlas Media Rights Co: €9m, 10.0x-12.0x, debt 0.',
      },
      {
        number: 2,
        title: 'Group corporate costs',
        body: '€11m p.a. unallocated, capitalised at 8x as deduction from SOTP.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate SOTP equity value at midpoint multiples; identify range using low and high multiples',
        marks: 14,
        hint: 'EV per holding at midpoint. Subtract net debt at stake-level. Adjust Wiener for 60% stake. Subtract group corporate cost capitalised. Repeat at low and high to get range.',
        solution: [
          'Real Olímpico EV 540, equity 430',
          'Helsinki EV 27, equity 19',
          'São Paulo EV 132, equity 114',
          'Wiener 100% equity 46, at 60% = 27.6',
          'Atlas Stadium EV 234, equity 174',
          'Atlas Media EV 99, equity 99',
          'Sum stakes equity = 863.6',
          'Less corporate cost (88) = SOTP midpoint €775.6m',
          'Low: €671m. High: €880m',
          '25% IPO at midpoint = €194m',
        ],
      },
      {
        label: '(b) Discuss three reasons SOTP superior to single DCF; two reasons SOTP can mislead',
        marks: 6,
        hint: 'Different risk, growth, comparable industries. Misleads via conglomerate discount, inter-segment synergies broken in separation.',
        solution: [
          'Different risk profiles: La Liga vs Finnish league cannot share one rate',
          'Different growth trajectories: Brazilian vs Finnish football differ',
          'Different industry comparables: real estate and media use peer multiples in those sectors',
          'Conglomerate discount: market may discount SOTP 10-25%',
          'Inter-segment synergies: separating breaks favourable internal pricing',
        ],
      },
    ],
    markScheme: [
      { item: 'EV per holding (midpoint)', marks: 3 },
      { item: 'Net debt deduction', marks: 2 },
      { item: 'Wiener minority stake', marks: 2 },
      { item: 'Corporate cost capitalisation', marks: 1 },
      { item: 'Midpoint equity', marks: 1 },
      { item: 'Sensitivity range', marks: 4 },
      { item: '25% stake', marks: 1 },
      { item: 'Three reasons SOTP superior', marks: 3 },
      { item: 'Two reasons SOTP misleads', marks: 3 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always show stake-level equity (not 100%). Capitalise unallocated corporate costs as a deduction. Sensitivity range shows the multiple-arbitrage uplift is the largest input.',
  },

  // ───────── SET 8: Whitepeak (dividend policy under PSR) ─────────
  {
    id: 'set-8',
    number: 10,
    club: 'Whitepeak United',
    topic: 'Dividend policy under PSR',
    module: 1,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Whitepeak United Premier League club, US owner historically takes no dividends. Stricter PSR and related-party scrutiny prompts review of dividend policy. Owner now wants modest £10-15m p.a. but no dividend that weakens PSR headroom.',
    exhibits: [
      {
        number: 1,
        title: 'Recent performance (£m)',
        body: 'Y0 revenue 340, op profit 42, EAT 26, FCF 32, dividends 0, retained earnings 143.',
      },
      {
        number: 2,
        title: 'Forecast Y1-Y3 (£m p.a.)',
        body: 'Y1: EAT 30, FCF 36, investment 28. Y2: 36, 40, 32. Y3: 42, 46, 30. Cash £85m, undrawn RCF £150m. PSR allows £105m cumulative losses; currently £40m clear.',
      },
      {
        number: 3,
        title: 'Owner position',
        body: 'Owner wants £10-15m p.a. dividend to demonstrate sustainability; rules out anything that weakens PSR headroom.',
      },
    ],
    requirements: [
      {
        label: '(a) Evaluate three dividend options: zero, fixed £12m, residual capped at £15m. PSR impact, signal, flexibility',
        marks: 14,
        hint: 'Zero: max flex but conflicts with owner. Fixed: signal discipline but locked in volatile industry. Residual: balances all. Also consider PSR neutrality (dividends not in PSR loss calc).',
        solution: [
          'Zero: PSR neutral, max flexibility, conflicts with owner preference',
          'Fixed £12m: PSR neutral but reduces buffer; strong signal of discipline; risky given relegation/broadcast volatility; meets owner preference',
          'Residual (FCF - investment, capped £15m): PSR neutral, highest flexibility, mixed signal (variable), variable owner payout',
          'Recommend residual with modest £5m floor: balances PSR safety, owner preference, reinvestment',
        ],
      },
      {
        label: '(b) Discuss whether MM dividend irrelevance applies; two practical reasons dividend matters anyway',
        marks: 6,
        hint: 'MM perfect markets break: tax differentials, transaction costs, info asymmetry. PSR signalling, owner relations.',
        solution: [
          'MM: in perfect markets dividend policy irrelevant; investors create homemade dividends',
          'Tax: UK dividend tax vs capital gains for US owner',
          'Transaction costs: private club has no liquid secondary market',
          'Info asymmetry: PSR and broadcaster confidence read dividend signals',
          'Practical 1: PSR signalling that distributable cash exists, distinct from owner injections',
          'Practical 2: Owner relations and capital availability; satisfied owner more likely to inject in emergency',
        ],
      },
    ],
    markScheme: [
      { item: 'Zero option analysis', marks: 3 },
      { item: 'Fixed option analysis', marks: 4 },
      { item: 'Residual option analysis', marks: 4 },
      { item: 'Reasoned recommendation', marks: 3 },
      { item: 'MM theorem and applicability', marks: 3 },
      { item: 'Two practical reasons', marks: 3 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'For dividend questions always test against MM first, then list real-world frictions. PSR is a unique twist for football; do not generalise it.',
  },

  // ───────── SET 9: Hammerside (IR hedging) ─────────
  {
    id: 'set-9',
    number: 11,
    club: 'Hammerside Co',
    topic: 'Interest rate hedging: FRA, futures, collar',
    module: 4,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Hammerside Co owns an east London Premier League club. Will draw down £60m three-month loan in 4 months (15 Sept) to fund hospitality refurb. Concerned about rising sterling interest rates. Evaluate FRA at 5.25%, short sterling futures at 94.65, and collar (cap 5.25% / floor 4.75%) under two scenarios: rate rises to 5.60% or falls to 4.40%.',
    exhibits: [
      {
        number: 1,
        title: 'Market data 15 May',
        body: 'Sterling 3m rate 4.85%. 4v7 FRA 5.20%-5.25%. Sept short sterling futures 94.65. Tick 0.01 = £12.50, contract £500,000. Cap 5.25% premium 0.32%; floor 4.75% premium received 0.18%.',
      },
      {
        number: 2,
        title: 'Scenarios at 15 Sept',
        body: 'A: rate rises to 5.60%. B: rate falls to 4.40%. Futures price = 100 - prevailing rate.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate effective interest cost under (i) FRA at 5.25% (ii) futures hedge (iii) collar, in each scenario',
        marks: 14,
        hint: 'FRA: settlement = £60m * (rate - 5.25%) * 3/12, with sign matching direction of borrower. Futures: number of contracts = 60m/500k * 3/3 = 120; sell to hedge rising rates. Collar: net premium 0.14% on 60m * 3/12 = £21k; cap pays out if above 5.25%.',
        solution: [
          'FRA Scenario A: loan int £840k, FRA receipt £52.5k, net £787.5k = 5.25% effective',
          'FRA Scenario B: loan £660k, FRA pay £127.5k, net £787.5k = 5.25% effective',
          'Futures: 120 contracts. Scenario A: futures gain 25 ticks * £12.50 * 120 = £37,500; net cost £802.5k = 5.35%',
          'Futures Scenario B: futures loss £142.5k; net £802.5k = 5.35%',
          'Collar Scenario A: cap pays £52.5k, net £808.5k = 5.39% (incl premium)',
          'Collar Scenario B: floor pays £52.5k, net £733.5k = 4.89%',
        ],
      },
      {
        label: '(b) Discuss trade-offs and recommend for risk-averse treasurer wanting some downside participation',
        marks: 6,
        hint: 'FRA simplest and lowest. Futures basis risk and margin. Collar bounded range with downside participation. Match to treasurer brief.',
        solution: [
          'FRA: highest certainty, fixed rate; no upside if rates fall',
          'Futures: similar to FRA but basis risk and margin needs',
          'Collar: bounded range, slight cost premium when rates rise, participation if rates fall',
          'For brief (risk-averse, fixed budget, some participation): collar best',
          'Pure risk aversion only: FRA is right',
        ],
      },
    ],
    markScheme: [
      { item: 'FRA Scenario A', marks: 1 },
      { item: 'FRA Scenario B', marks: 1 },
      { item: 'Futures contract sizing', marks: 1 },
      { item: 'Futures Scenario A', marks: 2 },
      { item: 'Futures Scenario B', marks: 2 },
      { item: 'Collar Scenario A', marks: 3 },
      { item: 'Collar Scenario B', marks: 3 },
      { item: 'Summary table', marks: 1 },
      { item: 'Trade-offs and recommendation', marks: 6 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always state direction first (sell to hedge rising rates). Show settlement formula explicitly. Tabulate three strategies side by side.',
  },

  // ───────── SET 10: Villaverde (international NPV) ─────────
  {
    id: 'set-10',
    number: 12,
    club: 'Villaverde Co',
    topic: 'International investment appraisal with PPP',
    module: 1,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Villaverde Co, UK Premier League club returning to European competition. Evaluating €55m investment in Madrid youth academy and training centre for Iberian scouting and player development.',
    exhibits: [
      {
        number: 1,
        title: 'Project cash flows (€m)',
        body: 'Y0 capex -55, WC -4. Y1-Y5 operating cash (post-Spanish tax): 7, 11, 14, 16, 18. Y5 WC release +4, terminal value (after Spanish CGT) +22.',
      },
      {
        number: 2,
        title: 'Tax and FX',
        body: 'Spanish corporate tax 25% (already in cash flows). UK 25%. UK gives credit for Spanish tax; no further UK tax. Spot £1 = €1.17. UK inflation 2.5%, Eurozone 2.0%.',
      },
      {
        number: 3,
        title: 'Discount rate',
        body: 'UK ungeared Ke 9.0%. Project similar business risk to UK. Funded entirely from existing facilities (no project debt).',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate NPV in £m using PPP for FX and 9% discount rate',
        marks: 12,
        hint: 'PPP: S_n = 1.17 * (1.020/1.025)^n. Note euro strengthens (rate falls) because eurozone inflation lower. Net €m, convert to £m, discount.',
        solution: [
          'PPP rates: 1.17, 1.1643, 1.1586, 1.1530, 1.1474, 1.1417',
          'Net €m: -59, 7, 11, 14, 16, 44',
          'Net £m: -50.43, 6.01, 9.49, 12.14, 13.94, 38.54',
          'PV at 9%: -50.43 + 5.51 + 7.99 + 9.37 + 9.87 + 25.05 = +£7.36m',
          'NPV positive; accept on financial grounds',
        ],
      },
      {
        label: '(b) Three additional considerations beyond NPV',
        marks: 8,
        hint: 'Political/regulatory (Brexit player rules, La Liga FFP), FX volatility around PPP, strategic real options (player pipeline future value).',
        solution: [
          'Political/regulatory: La Liga FFP, post-Brexit U18 EU player registration restrictions',
          'FX volatility around PPP central case; sensitivity at +/-10% FX',
          'Strategic value: future first-team players or sale assets (real option not in DCF)',
          'Tax authority transfer pricing scrutiny',
          'Cultural and operational integration; ESG/player welfare',
        ],
      },
    ],
    markScheme: [
      { item: 'PPP rate calculations', marks: 3 },
      { item: 'Net € cash flows', marks: 2 },
      { item: 'Conversion to £', marks: 3 },
      { item: 'Discounting and NPV', marks: 3 },
      { item: 'Recommendation', marks: 1 },
      { item: 'Three additional considerations', marks: 6 },
      { item: 'Linkage to NPV', marks: 2 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'PPP gives the central case. Always sensitivity-test FX. Comment on direction: euro strengthens because lower inflation.',
  },

  // ───────── SET 11: Eagle Park (MBO) ─────────
  {
    id: 'set-11',
    number: 13,
    club: 'Eagle Park Academy',
    topic: 'MBO financing and exit waterfall',
    module: 2,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Eagle Park Academy is the youth and womens operations of a Premier League club, being divested. Incumbent management has tabled £42m MBO offer with PE sponsor Forge Capital. Senior £18m at 6.5%, mezzanine £9m at 11% PIK toggle, Forge equity £12m (target IRR 22%), management £3m sweat. Exit Y5 at 8x EBITDA.',
    exhibits: [
      {
        number: 1,
        title: 'Standalone (£m)',
        body: 'Last year: revenue 24, EBITDA 6, capex -2, WC -0.4. Y1: 28, 8, -4, -0.5. Y2: 33, 11, -3, -0.5. Y3: 38, 14, -3, -0.5.',
      },
      {
        number: 2,
        title: 'Financing structure',
        body: 'Senior £18m 6.5% 7yr. Mezzanine £9m 11% 7yr PIK toggle. Forge equity £12m target IRR 22%. Management £3m. Total £42m. Tax 25%.',
      },
      {
        number: 3,
        title: 'Exit',
        body: 'Forge expects Y5 exit at 8x EBITDA.',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate (i) Y5 EV, (ii) debt outstanding Y5, (iii) returns to Forge and management; assess Forge meets 22% IRR',
        marks: 14,
        hint: 'Extrapolate EBITDA Y4 +20%, Y5 +15%. Senior amortises straight-line £2.57m p.a. Mezzanine bullet at face. Equity = EV - debt. Waterfall: Forge preferred to its 22% target then 80/20 split with management.',
        solution: [
          'EBITDA Y4 16.8, Y5 19.3',
          'EV Y5 = 19.3 * 8 = £154.4m',
          'Senior outstanding Y5 = 18 - 5*2.57 = £5.14m',
          'Mezzanine = £9m',
          'Total debt Y5 = £14.14m',
          'Equity Y5 = 154.4 - 14.14 = £140.26m',
          'Forge preferred target 12 * 1.22^5 = £32.4m',
          'Residual 140.26 - 32.4 = 107.86; Forge 80% = 86.29; Management 20% = 21.57',
          'Forge total 32.4 + 86.29 = £118.69m; IRR = (118.69/12)^0.2 - 1 = 58.2%, well above 22%',
        ],
      },
      {
        label: '(b) Identify three MBO risks specific to sports; discuss how PIK toggle mitigates',
        marks: 6,
        hint: 'Earnings volatility tied to first-team success, key-person risk, regulatory. PIK toggle defers cash interest, eases liquidity squeeze.',
        solution: [
          'Earnings volatility from sporting performance: academy revenue depends on parent first-team success',
          'Key-person and operational continuity: small group of coaches/scouts',
          'Regulatory and association risk: FA, PL, FIFA approval and solidarity contributions',
          'PIK toggle mitigates liquidity risk: defers cash interest, capitalises onto principal during ramp-up',
        ],
      },
    ],
    markScheme: [
      { item: 'EBITDA trajectory and Y5', marks: 2 },
      { item: 'Y5 EV', marks: 1 },
      { item: 'Senior amortisation', marks: 2 },
      { item: 'Mezzanine treatment', marks: 1 },
      { item: 'Equity value Y5', marks: 1 },
      { item: 'Waterfall distribution', marks: 3 },
      { item: 'IRR / MoM', marks: 2 },
      { item: 'Sensitivity check', marks: 2 },
      { item: 'Three MBO risks', marks: 3 },
      { item: 'PIK toggle explanation', marks: 3 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'Always state EBITDA growth assumptions explicitly. Show waterfall stages: preferred return then residual split.',
  },

  // ───────── SET 12: Wanderers (FX futures) ─────────
  {
    id: 'set-12',
    number: 14,
    club: 'Wanderers Holdings',
    topic: 'Currency futures hedging',
    module: 4,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Wanderers, Midlands Premier League club. US$8.4m agent fee payable in 6 months (15 Dec) on outbound transfer completion. Hedge using GBP/USD currency futures.',
    exhibits: [
      {
        number: 1,
        title: 'Market data 15 June',
        body: 'Spot £1 = $1.27. 6m forward £1 = $1.265. Dec GBP/USD futures: contract £62,500, current $1.2630 per £, tick 0.0001 = $6.25.',
      },
      {
        number: 2,
        title: 'Outcome 15 December',
        body: 'Closing spot £1 = $1.235. Dec futures converges at $1.236 (residual basis).',
      },
    ],
    requirements: [
      {
        label: '(a) Calculate number of futures contracts, outcome of futures hedge, effective £ cost; show basis risk explicitly',
        marks: 14,
        hint: 'Direction: sell GBP futures (going long USD effectively). Contracts = (USD/futures rate)/contract size. Tick movement = (entry - exit)/0.0001.',
        solution: [
          'Direction: sell £ futures to hedge against £ weakening',
          '£ exposure at futures rate = 8.4m / 1.2630 = £6,651,623',
          'Contracts = 6,651,623 / 62,500 = 106 (rounded)',
          'Tick movement = (1.2630 - 1.2360)/0.0001 = 270 ticks favourable',
          'Profit = 106 * 270 * 6.25 = $178,875',
          'Spot purchase £8.4m / 1.2350 = £6,801,619',
          'Less profit £144,838',
          'Net £6,656,781; effective rate $1.2619 per £',
          'Basis residual: futures 1.2360 vs spot 1.2350 = 1 tick',
        ],
      },
      {
        label: '(b) Compare to (i) unhedged, (ii) 6m forward; when futures preferred over forward',
        marks: 6,
        hint: 'Unhedged worst at £6.80m. Forward at 1.265 best at £6.64m. Futures middle £6.66m. Futures preferred for daily margining transparency, exchange liquidity, no bilateral credit, smaller standardised exposures.',
        solution: [
          'Unhedged £6,801,619; loses £144,838 in this scenario',
          'Forward at 1.265: £6,640,316 (best, no basis or rounding slippage)',
          'Futures £6,656,781',
          'Futures preferred: daily margining transparency, exchange liquidity, no bilateral credit, optionality to close out before maturity, no FX line at bank',
          'Forward cleaner here for committed £6.65m exposure',
        ],
      },
    ],
    markScheme: [
      { item: 'Direction (sell £ futures)', marks: 1 },
      { item: 'Contract sizing', marks: 3 },
      { item: 'Closing futures and tick', marks: 3 },
      { item: 'Futures P&L conversion', marks: 2 },
      { item: 'Spot purchase', marks: 1 },
      { item: 'Net effective cost', marks: 1 },
      { item: 'Basis and rounding slippage', marks: 3 },
      { item: 'Comparison: unhedged', marks: 1 },
      { item: 'Comparison: forward', marks: 1 },
      { item: 'When futures preferred', marks: 4 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'State direction first. Show basis risk: futures rarely converge perfectly. Explain when futures vs forward.',
  },

  // ───────── SET 13: Bee Hive (demerger) ─────────
  {
    id: 'set-13',
    number: 15,
    club: 'Bee Hive FC',
    topic: 'Demerger and reorganisation',
    module: 3,
    section: 'B',
    marks: 25,
    minutes: 45,
    banner: 'Section B · 25 marks · 45 minutes',
    background:
      'Bee Hive FC, west London Premier League club, has built data and analytics business "Hive Insights" (revenue from licensing to other clubs, broadcasters, betting). Considering demerger of Hive Insights into separately listed entity to crystallise value and remove conflicts of interest.',
    exhibits: [
      {
        number: 1,
        title: 'Group financials (£m)',
        body: 'Y1: football revenue 145, EBITDA 22; Hive revenue 28, EBITDA 12; group revenue 173, EBITDA 34. Y3 forecast: football 175, 30; Hive 55, 26; group 230, 56.',
      },
      {
        number: 2,
        title: 'Comparable multiples',
        body: 'Football: EV/EBITDA 4-6x. Hive Insights: EV/EBITDA 14-18x.',
      },
      {
        number: 3,
        title: 'Demerger costs',
        body: 'One-off advisory and legal £8m. Ongoing duplicate listing/admin £2m p.a. Loss of internal preferential pricing (Hive currently sells data to football at discount worth £1.5m p.a. to football).',
      },
    ],
    requirements: [
      {
        label: '(a) Estimate (i) current group EV as single football business, (ii) post-demerger combined EV, (iii) value created/destroyed after costs',
        marks: 12,
        hint: 'Pre-demerger: 56 * 5x = 280. Post: 30 * 5 + 26 * 16 = 150 + 416 = 566. Less PV ongoing costs at 9%: 22.2. Less lost pricing benefit 1.5/0.09 = 16.7. Less one-off 8.',
        solution: [
          'Pre-demerger group EV (football multiple) = 56 * 5 = £280m',
          'Post-demerger: 30 * 5 + 26 * 16 = 150 + 416 = £566m',
          'Less one-off £8m',
          'Less PV admin £2m / 0.09 = £22.2m',
          'Less PV lost pricing £1.5m / 0.09 = £16.7m',
          'Net value created = 566 - 280 - 8 - 22.2 - 16.7 = +£239.1m',
          'Sensitivity: if Hive trades at 10x not 16x, uplift only £83.1m',
        ],
      },
      {
        label: '(b) Three strategic value-creation reasons; two value-destruction reasons',
        marks: 8,
        hint: 'Customer access (broadcasters wont share with competitor club), capital structure differences, management focus. Destruction: synergistic data flow lost, stranded costs and execution risk.',
        solution: [
          'Customer access: broadcasters/betting will not share data with competitor club; demerger expands market',
          'Capital structure: football capex-intensive vs Hive growth-asset-light; need different policies',
          'Management focus and incentive alignment: Hive equity for tech talent retention',
          'Destruction 1: privileged data access from football operations becomes arms-length',
          'Destruction 2: stranded costs and execution risk; 12-24m management distraction; market may not pay 16x',
        ],
      },
    ],
    markScheme: [
      { item: 'Pre-demerger EV', marks: 2 },
      { item: 'Post-demerger SOTP EV', marks: 4 },
      { item: 'Demerger costs', marks: 2 },
      { item: 'PV perpetual cost', marks: 2 },
      { item: 'Net value', marks: 1 },
      { item: 'Sensitivity comment', marks: 1 },
      { item: 'Three value-creation reasons', marks: 4 },
      { item: 'Two value-destruction reasons', marks: 4 },
      { item: 'Professional Skills', marks: 5 },
    ],
    examinerNote: 'The arbitrage uplift dominates. Always sensitivity-test the multiple assumption. Demerger value is contingent on the market actually rerating the parts.',
  },

  // ───────── SET 14: Mersey Sports (Section A senior adviser) ─────────
  {
    id: 'set-14',
    number: 16,
    club: 'Mersey Sports Group',
    topic: 'Senior financial adviser, multi-currency treasury',
    module: 2,
    section: 'A',
    marks: 50,
    minutes: 90,
    banner: 'Section A · 50 marks · 90 minutes · Board paper',
    background:
      'Mersey Sports Group is US-based sports investment vehicle owning Premier League club, MLB franchise, womens football club, and sports content production. CFO requests board paper covering treasury, capital structure, and risk management for expansion plans.',
    exhibits: [
      {
        number: 1,
        title: 'Group capital structure (US$m, market values)',
        body: 'Equity (private, mark-to-model) 4,200. Senior bank debt floating USD 800. Eurobond fixed 4.5% EUR 600. Sterling term loan fixed 5.2% GBP 350. Total 5,950. Reports in USD. Eurobond funded PL club; sterling loan funds womens club.',
      },
      {
        number: 2,
        title: 'Strategic plans',
        body: '1. Acquire Bundesliga club (provisional value €380m). 2. US$200m new content studio in LA. 3. Refinance sterling term loan, matures in 18 months.',
      },
      {
        number: 3,
        title: 'Treasury concerns',
        body: 'Multi-currency mismatch: GBP and EUR debt, USD reporting; underlying cash flows in local currency. IR exposure: USD floating, EUR fixed, GBP fixed. RCF $1.5bn with $900m drawn (in senior bank debt).',
      },
    ],
    requirements: [
      {
        label: '(a) Evaluate multi-currency debt structure: natural hedging, translation exposure, case for rebalancing',
        marks: 14,
        hint: 'Map each debt to underlying business cash flow. Eurobond is structural anomaly (funded UK club, but EUR debt). USD MLB and GBP womens club are matched. Translation: 10% EUR move = $60m on Eurobond.',
        solution: [
          'GBP loan vs womens GBP revenue: matched',
          'EUR Eurobond vs PL GBP revenue: mismatched (depends on EUR/GBP)',
          'USD senior debt vs MLB/content USD revenue: matched',
          'Eurobond is structural anomaly',
          'Translation: 10% EUR strengthening adds US$60m to reported debt',
          'Recommendation: convert Eurobond to GBP via cross-currency swap, or refinance to GBP at maturity. Consider deferring until Bundesliga deal sets up new EUR cash flows',
        ],
      },
      {
        label: '(b) Recommend funding mix for €380m Bundesliga acquisition',
        marks: 12,
        hint: 'Local-EUR debt at acquired entity provides natural hedge and ring-fences risk. Group EUR bond extends EUR exposure. Bridge from RCF for short term. Equity for DFL capital adequacy.',
        solution: [
          'Local EUR senior at acquired entity €180m (47%) - natural hedge, non-recourse',
          'Group EUR bond €100m (26%) - extends EUR funding',
          'RCF drawdown swapped to EUR €60m (16%) - bridge, refinance within 12 months',
          'Owner equity €40m (11%) - DFL licensing capital adequacy',
          'Total €380m balanced for natural hedging, regulatory compliance',
        ],
      },
      {
        label: '(c) Senior financial adviser role: coordinating decisions across internationally diversified sports group; balancing stakeholders',
        marks: 14,
        hint: 'Capital allocation, FX coordination, multi-regulator liaison, lender relationships. Stakeholders: US owners, UK/German regulators, players, supporters, lenders. Tensions: distributions vs reinvestment, owner extraction vs local solvency, sporting success vs cost discipline.',
        solution: [
          'Capital allocation across competing internal demands using consistent return frameworks',
          'FX coordination: deliberate debt currency mix and selective derivatives',
          'Multi-regulator: PL PSR, UEFA, MLB CBA, DFL licensing all differ',
          'Lender relationships: reconciling entity-level with group consolidation',
          'Stakeholders: owners want returns, regulators want sustainability, players want investment, supporters want stability, lenders want covenants',
          'Adviser balances; not optimises one dimension',
          'Avoid aggressive structuring that triggers regulatory action',
          'Build buffers for football cash-flow convexity (relegation, UCL)',
          'Source-of-funds and fit-and-proper compliance',
          'Transparency vs confidentiality balance',
        ],
      },
    ],
    markScheme: [
      { item: 'Current multi-currency position summary', marks: 2 },
      { item: 'Natural hedge identification', marks: 3 },
      { item: 'Translation exposure analysis', marks: 3 },
      { item: 'Eurobond mismatch identified', marks: 2 },
      { item: 'Reasoned rebalancing recommendation', marks: 4 },
      { item: 'Bundesliga: source identification with costs', marks: 3 },
      { item: 'Recommended mix table', marks: 3 },
      { item: 'Local-currency rationale', marks: 2 },
      { item: 'Bridge financing structure', marks: 1 },
      { item: 'DFL regulatory consideration', marks: 2 },
      { item: 'Equity component justification', marks: 1 },
      { item: 'Capital allocation across group', marks: 2 },
      { item: 'FX and treasury coordination', marks: 2 },
      { item: 'Multi-regulator liaison', marks: 2 },
      { item: 'Stakeholder map and tensions', marks: 4 },
      { item: 'Defensibility framing', marks: 2 },
      { item: 'Ethical and reputational dimension', marks: 2 },
      { item: 'Professional Skills', marks: 10 },
    ],
    examinerNote: 'Section A board paper format: report headers, executive summary at top, recommendations summary at end. Three or more substantive non-financial factors. Multi-stakeholder balance, not optimisation.',
  },
];

