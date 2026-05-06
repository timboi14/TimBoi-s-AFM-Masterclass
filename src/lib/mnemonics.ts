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
];
