/**
 * Mnemonic generators for AFM formula recall.
 * Each generator produces an acronym + a phrase that maps to the formula.
 */

export interface Mnemonic {
  id: string;
  topic: string;
  formula: string;
  acronym: string;
  phrase: string;
  story: string;
}

export const MNEMONICS: Mnemonic[] = [
  {
    id: 'wacc',
    topic: 'WACC',
    formula: '(E/V) Ke + (D/V) Kd (1 - T)',
    acronym: 'EVE-DVD',
    phrase: 'Equity-Value share of Equity-cost, plus Debt-Value share of Debt-cost, minus the tax discount',
    story:
      'Picture WACC as renting two flats: equity is the penthouse (expensive, no tax break) and debt is the basement (cheap, with HMRC chipping in). Take the weighted rent of both.',
  },
  {
    id: 'capm',
    topic: 'CAPM (cost of equity)',
    formula: 'Ke = Rf + Beta_e × (Rm − Rf)',
    acronym: 'RF-BREAM',
    phrase: 'Risk-Free plus Beta × Risk premium of Equity Above the Market',
    story:
      'Start at the risk-free baseline (a Treasury bill). Then a beta-multiplied surge of market premium lifts equity returns. Beta = your sensitivity dial.',
  },
  {
    id: 'm-and-m2',
    topic: 'M&M2 ungear',
    formula: 'βa = βe × E / (E + D × (1 − T))',
    acronym: 'BEEDT',
    phrase: 'Beta-asset = Beta-equity × Equity over Equity plus Debt-after-Tax',
    story:
      'Strip the financial-risk gear away from the equity beta. Imagine peeling a banana: the asset beta is the soft inside; gearing was just the skin.',
  },
  {
    id: 'fisher',
    topic: 'Fisher equation',
    formula: '(1 + nominal) = (1 + real) × (1 + inflation)',
    acronym: 'NRI',
    phrase: 'Nominal one plus = Real one plus times Inflation one plus',
    story:
      'Fisher is a layered cake. The nominal slice is the real slice plus an icing of inflation. Mix the layers wrong and you ruin the dessert (and the NPV).',
  },
  {
    id: 'irp',
    topic: 'Interest rate parity (forward FX)',
    formula: 'F = S × (1 + i_q) / (1 + i_b)',
    acronym: 'SQB',
    phrase: 'Spot times Quote-currency interest over Base-currency interest',
    story:
      'High-interest currency depreciates forward. Spot is today; the forward is the spot tilted by the interest gap.',
  },
  {
    id: 'bsop',
    topic: 'Black-Scholes call',
    formula: 'C = Pa × N(d1) − Pe × e^(−rt) × N(d2)',
    acronym: 'PAND-PEND',
    phrase: 'Pa Asset times N-d-one minus Pe Exercise discounted times N-d-two',
    story:
      'Two probabilistic photos: one of the asset (Pa × N(d1)), one of the strike (Pe × discount × N(d2)). Subtract the strike snapshot from the asset snapshot — that gap is the call premium.',
  },
  {
    id: 'gordon',
    topic: 'Gordon growth model',
    formula: 'P0 = D1 / (Ke − g)',
    acronym: 'DKG',
    phrase: 'Dividend next year over (cost of equity minus growth)',
    story:
      'The price today is just next year\'s dividend, divided by the speed at which equity returns outrun growth.',
  },
  {
    id: 'var',
    topic: 'Value at Risk (1-day)',
    formula: 'VaR = z × σ × Value',
    acronym: 'ZVS',
    phrase: 'Z-score times Sigma times portfolio Value',
    story:
      'Three dials: confidence (z), volatility (σ), and how much money is on the table. Spin them and you get the worst-case number you quote to the board.',
  },
  {
    id: 'apv',
    topic: 'APV',
    formula: 'APV = Base NPV + PV(tax shield) + PV(financing perks) − issue costs',
    acronym: 'BTFI',
    phrase: 'Base then Tax-shield then Financing perks minus Issue costs',
    story:
      'Stack four bricks: the un-geared NPV at the bottom, the tax shield brick on top, then any subsidy brick, then knock the issue-cost chip off the top.',
  },
  {
    id: 'esg',
    topic: 'ESG mark structure',
    formula: 'Issue → Action (costed) → Outcome (quantified)',
    acronym: 'IAO',
    phrase: 'Issue, Action, Outcome — three lines, three marks',
    story:
      'Three sentences in a triangle: identify the issue specifically, propose the costed action, quantify the outcome. Generic prose scores zero.',
  },
  {
    id: 'mirr',
    topic: 'Modified IRR (MIRR)',
    formula: 'MIRR = (FV inflows / PV outflows)^(1/n) − 1',
    acronym: 'FOP-N',
    phrase: 'Future-value Of inflows over Present-value of outflows, rooted by N years',
    story:
      'IRR pretends you reinvest at the IRR itself — fantasy. MIRR is honest: roll every inflow forward at the real reinvestment rate, discount every outflow back, take the n-th root of the ratio, knock off one.',
  },
  {
    id: 'eac',
    topic: 'Equivalent Annual Cost / Annuity',
    formula: 'EAC = project NPV / annuity factor(r, n)',
    acronym: 'NAP',
    phrase: 'NPV divided by the Annuity factor = level yearly Payment',
    story:
      'You cannot compare a 3-year machine with a 5-year one on lumpy NPVs. Smear each NPV into a flat annual rent by dividing by its annuity factor — now it is apples to apples.',
  },
  {
    id: 'pi',
    topic: 'Profitability Index',
    formula: 'PI = PV of inflows / initial investment',
    acronym: 'PII',
    phrase: 'Present-value of Inflows over the Initial outlay',
    story:
      'When capital is rationed, rank by bang-per-buck. A PI above 1 means each pound invested returns more than a pound — pack a divisible budget with the highest PI projects first.',
  },
  {
    id: 'perpetuity-g',
    topic: 'Growing perpetuity',
    formula: 'PV = CF1 / (r − g)',
    acronym: 'CRG',
    phrase: 'Cash-flow next year over (Rate minus Growth)',
    story:
      'A river of cash that swells a little each year. Its value today is next year\'s flow divided by how far the discount rate outruns growth. If g ≥ r the maths explodes — and so does the marker\'s patience.',
  },
  {
    id: 'annuity-factor',
    topic: 'Annuity factor',
    formula: 'AF = (1 − (1 + r)^−n) / r',
    acronym: 'ONR',
    phrase: 'One minus (One+r) to the minus-N, all Over r',
    story:
      'The discount-table number you keep reaching for. One pound a year for n years is not worth n pounds — it is worth this shrunken factor. Memorise the shape; the tables hand you the value.',
  },
  {
    id: 'ppp',
    topic: 'Purchasing Power Parity (expected spot)',
    formula: 'S1 = S0 × (1 + h_c) / (1 + h_b)',
    acronym: 'SHC-HB',
    phrase: 'Spot times one-plus-inflation of the Counter currency over the Base',
    story:
      'High-inflation currencies lose value. Tilt today\'s spot by the inflation gap to forecast the future spot — the same shape as interest-rate parity, but with inflation in the driving seat.',
  },
  {
    id: 'forward-rate',
    topic: 'Forward rate (from yield curve)',
    formula: '(1 + y2)² = (1 + y1) × (1 + 1f2)',
    acronym: 'TWO-EQUALS-ONE-F',
    phrase: 'Two-year compounded equals One-year times the one-year Forward',
    story:
      'Lending two years must equal lending one year then rolling into a forward — otherwise free arbitrage. Solve for the forward rate hiding inside the curve.',
  },
  {
    id: 'put-call',
    topic: 'Put-call parity',
    formula: 'C + Pe·e^(−rt) = P + Pa',
    acronym: 'CASH-PA',
    phrase: 'Call plus discounted-strike (CASH) equals Put plus Asset',
    story:
      'A call plus a pot of cash equal to the strike lands you exactly where a put plus the share does. Two routes, one destination — rearrange to price the put once you have the call.',
  },
  {
    id: 'bsop-d1',
    topic: 'Black-Scholes d1',
    formula: 'd1 = [ln(Pa/Pe) + (r + 0.5σ²)t] / (σ√t)',
    acronym: 'LARS',
    phrase: 'Log moneyness, Add rate-and-half-variance over time, Root-time Scale',
    story:
      'd1 is how deep in-the-money you are, in standard deviations. Log the moneyness, push it up by drift (r + ½σ²)t, then divide by the volatility spread σ√t. d2 is just d1 minus that spread.',
  },
  {
    id: 'bsop-d2',
    topic: 'Black-Scholes d2',
    formula: 'd2 = d1 − σ√t',
    acronym: 'D1-LESS-SPREAD',
    phrase: 'd-two is d-one minus sigma-root-t',
    story:
      'd2 drives the risk-neutral probability the option finishes in-the-money. Always one volatility-spread below d1 — if you have d1, d2 is a single subtraction. Never recompute from scratch.',
  },
  {
    id: 'delta-hedge',
    topic: 'Delta hedge (option hedge ratio)',
    formula: 'Options needed = shares held / N(d1)',
    acronym: 'SHARES-OVER-DELTA',
    phrase: 'Shares to hedge, divided by the Delta N(d1)',
    story:
      'Each option only moves N(d1) of a share. To neutralise a block of shares you need more options than shares — divide by the fractional delta to get the count.',
  },
  {
    id: 'macaulay',
    topic: 'Macaulay duration',
    formula: 'D = Σ[t × PV(CFt)] / bond price',
    acronym: 'TIME-WEIGHT',
    phrase: 'Time-weighted present values, divided by total price',
    story:
      'The bond\'s centre of gravity in years. Weight each cash flow\'s timing by its present value, sum, divide by price. Divide that by (1+y) and you get modified duration.',
  },
  {
    id: 'mod-duration',
    topic: 'Modified duration (price sensitivity)',
    formula: 'ΔP/P ≈ −Modified Duration × Δy',
    acronym: 'MDY',
    phrase: 'Minus Modified-Duration times Delta-Yield = the price move',
    story:
      'Duration is the see-saw: yields up, price down, and the longer the duration the wilder the swing. Multiply duration by the yield change for the percentage hit — the minus sign is the whole point.',
  },
  {
    id: 'fcff',
    topic: 'Free cash flow to firm (FCFF)',
    formula: 'FCFF = EBIT(1 − T) + Dep − Capex − ΔWC',
    acronym: 'ENDC',
    phrase: 'EBIT after tax, add Non-cash dep, minus Capex, minus working-capital Delta',
    story:
      'Cash the whole firm throws off before paying anyone. Start with taxed operating profit, add back depreciation, then strip the cash spent on assets and tied up in working capital. Discount at WACC.',
  },
  {
    id: 'fcfe',
    topic: 'Free cash flow to equity (FCFE)',
    formula: 'FCFE = FCFF − Interest(1 − T) + Net borrowing',
    acronym: 'FIN',
    phrase: 'Firm cash-flow, minus after-tax Interest, plus Net new borrowing',
    story:
      'What is left for shareholders once lenders are served. Take firm cash flow, pay the after-tax interest, add whatever fresh debt was drawn. Discount at Ke, not WACC.',
  },
  {
    id: 'terminal-value',
    topic: 'Terminal value (Gordon)',
    formula: 'TV = FCFn × (1 + g) / (WACC − g)',
    acronym: 'GROW-GAP',
    phrase: 'Grow the final flow, divide by the WACC-minus-growth Gap',
    story:
      'The forecast ends but the business does not. Capitalise the last year\'s flow as a growing perpetuity — then remember to discount that lump back to today. Forgetting the discount-back is the classic two-mark leak.',
  },
  {
    id: 'eva',
    topic: 'Economic Value Added (EVA)',
    formula: 'EVA = NOPAT − (WACC × Capital employed)',
    acronym: 'NWC',
    phrase: 'NOPAT minus the Wacc-Charge on capital',
    story:
      'Accounting profit ignores the cost of equity. EVA charges rent on every pound of capital tied up. Positive = genuine value created above what investors demanded; negative = quietly destroying wealth.',
  },
  {
    id: 'terp',
    topic: 'Theoretical ex-rights price (TERP)',
    formula: 'TERP = (N × cum price + issue price) / (N + 1)',
    acronym: 'NCO',
    phrase: 'N old shares at Cum price plus the One new share, averaged',
    story:
      'A rights issue dilutes price to a blended average. Take N old shares at the cum-rights price, add the one cheap new share, divide by N+1. The drop from cum to TERP is the value of the right itself.',
  },
  {
    id: 'mm2-regear',
    topic: 'M&M2 regear (asset → equity beta)',
    formula: 'βe = βa × [1 + D(1 − T) / E]',
    acronym: 'ONE-PLUS-GEAR',
    phrase: 'Asset beta times One-plus the after-tax Debt/Equity gear',
    story:
      'The mirror of ungearing. Once you hold the pure asset beta, bolt the project\'s own gearing back on to get its equity beta, then feed it into CAPM for a project-specific Ke. Ungear theirs, regear yours.',
  },
  {
    id: 'kd-redeem',
    topic: 'Cost of redeemable debt (Kd)',
    formula: 'Kd = IRR of [−price, after-tax coupons…, redemption]',
    acronym: 'IRR-DEBT',
    phrase: 'The IRR of the after-tax debt cash-flow stream',
    story:
      'Redeemable debt is a mini-NPV in reverse. Lay out the market price (out), the after-tax coupons (in) and the redemption at the end, then solve for the rate that zeroes it. Two trial rates, interpolate.',
  },
  {
    id: 'growth-rb',
    topic: 'Dividend growth rate (Gordon)',
    formula: 'g = b × re   (retention × return)',
    acronym: 'BR',
    phrase: 'Retention rate B times the Return R earned on it',
    story:
      'Growth is not free — it is funded by held-back profit. Multiply the slice retained by the return earned on it. Pay everything out (b = 0) and growth is zero; that is the dividend-irrelevance edge case.',
  },
  {
    id: 'kp-pref',
    topic: 'Cost of preference shares',
    formula: 'Kp = preference dividend / market price',
    acronym: 'DOP',
    phrase: 'Dividend Over Price — a flat perpetuity yield',
    story:
      'Preference dividends are fixed, perpetual and get no tax relief, so their cost is the simplest of all: the fixed dividend divided by what the market pays. No growth, no tax twist.',
  },
];
