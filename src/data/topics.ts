/**
 * 12 fixtures covering AFM syllabus A to E. Examiner-style content:
 * Name. Explain. Apply. Examiner-rewarded technique only. No filler.
 * No em dashes anywhere.
 */

export interface Drill {
  id: string;
  prompt: string;
  approach: string[];
  workings: string[];
  answer: string;
  marks: number;
  trap: string;
}
export interface Worked {
  title: string;
  steps: { label: string; detail?: string; calc?: string }[];
  result: string;
}
export interface CoachTip {
  title: string;
  body: string;
}
export interface Note {
  heading: string;
  intro: string;
  bullets: string[];
  apply: string;
  coach?: CoachTip;
}
export interface Formula {
  name: string;
  formula: string;
  variables: string[];
  context: string;
  category: 'CoC' | 'Valuation' | 'Options' | 'FX' | 'IRR' | 'Portfolio' | 'M&A';
}
export interface Pitfall {
  title: string;
  body: string;
}

export interface Topic {
  id: string;
  title: string;
  syllabus: 'A' | 'B' | 'C' | 'D' | 'E';
  matchday: string;
  badge: string;
  papers: string[];
  hook: string;
  notes: Note[];
  formulas: Formula[];
  worked: Worked;
  drills: Drill[];
  pitfalls: Pitfall[];
}

export const TOPICS: Record<string, Topic> = {
  adviser: {
    id: 'adviser',
    title: 'The Senior Adviser',
    syllabus: 'A',
    matchday: 'MD 1',
    badge: 'fa-user-tie',
    papers: ['Sep/Dec 24 Q1', 'Mar/Jun 25 Q1'],
    hook: 'The 4 professional skills marks live and die here. 20 marks per paper for clean structure, scenario application and judgement.',
    notes: [
      {
        heading: 'Role of the senior adviser',
        intro: 'Section A always asks you to brief the board, the FD, or a non-exec. You are not a textbook. You are the senior in the room.',
        bullets: [
          'Address the audience by their role (Board, FD, Investment Committee). Use a heading and a one-line objective.',
          'Lead with the recommendation. The reader is busy. They should see your answer in the first 30 seconds.',
          'Quote scenario figures. Generic answers get only the knowledge mark. Specific answers get the full skill mark.',
          'Acknowledge limitations of your model. Examiners reward scepticism, not confidence.',
        ],
        apply: 'In Drimpton (Sep/Dec 25), candidates who wrote "I recommend Drimpton proceeds with the £45m project subject to..." scored materially higher than those who opened with "Net present value is..."',
        coach: {
          title: 'Coach technique',
          body: 'Lead. Justify. Scope. Then add the scenario figure. Four sentences, one mark each.',
        },
      },
      {
        heading: 'The 4 Professional Skills marks',
        intro: 'Communication, Analysis, Scepticism, Commercial Acumen. Worth 20 marks every paper. They are not optional.',
        bullets: [
          'Communication: structured headings, signposted bullets, audience-fit tone. Avoid telegram style.',
          'Analysis: split numerical and discussion. Compare alternatives with numbers. Sensitivities are gold.',
          'Scepticism: stress-test the input. Flag bias. "Synergy of £14m looks aggressive given..."',
          'Commercial: reference industry context. Implementation. Stakeholder pushback.',
        ],
        apply: 'After every long discussion, write four short bullets, one per skill, tied to the case. 4 bullets in 3 minutes can earn 4 marks.',
      },
    ],
    formulas: [],
    worked: {
      title: 'Briefing the Board on Drimpton (sketch)',
      steps: [
        { label: 'Heading', detail: 'Board paper, Drimpton expansion, prepared for FD review' },
        { label: 'Recommendation', detail: 'Proceed with phased rollout, conditional on ESG plan and FX hedge' },
        { label: 'Numbers', detail: 'NPV £6.4m positive, IRR 14.2%, sensitivity to volume 22% adverse' },
        { label: 'Risks flagged', detail: 'Carbon levy in year 3, supplier concentration, FX exposure on imports' },
        { label: 'Action', detail: 'Approve subject to revised hedging policy presented at next meeting' },
      ],
      result: 'Five sections, each one earning a separate mark. Total 5 plus skill marks for layout and tone.',
    },
    drills: [
      {
        id: 'adviser-d1',
        prompt: 'You are advising a board on a £40m project. Open the briefing in 2 sentences.',
        approach: [
          'Sentence 1: recommendation and conditions',
          'Sentence 2: critical risk to monitor',
        ],
        workings: [],
        answer:
          'I recommend the board approves the £40m investment, subject to securing the proposed €/£ forward hedge and confirming the ESG action plan with the supplier. The dominant risk is volume sensitivity: a 15% drop in expected sales removes the entire NPV, so a phased rollout is preferable to a single launch.',
        marks: 4,
        trap: 'Opening with theory ("Net present value is..."). The board needs your answer first.',
      },
    ],
    pitfalls: [
      { title: 'Generic openings', body: 'Never start with a definition. Start with your recommendation.' },
      { title: 'No scenario figures', body: 'A score in the application column requires you to quote the case data, not paraphrase it.' },
      { title: 'Telegram bullets', body: 'One-word bullets earn knowledge, not skill. Each bullet needs a complete idea.' },
    ],
  },

  coc: {
    id: 'coc',
    title: 'Cost of Capital and WACC',
    syllabus: 'B',
    matchday: 'MD 2',
    badge: 'fa-percent',
    papers: ['Sep/Dec 23 Q2', 'Mar/Jun 24 Q1'],
    hook: 'Get the discount rate wrong and the whole NPV is wrong. Drill the M&M2 ungear-regear pattern relentlessly.',
    notes: [
      {
        heading: 'Ungear and regear betas',
        intro: 'When the project gearing differs from the company gearing, you must isolate business risk, then add the new financial risk back.',
        bullets: [
          'Step 1: identify a proxy company with similar business risk',
          'Step 2: ungear its equity beta to obtain asset beta using M&M2 with tax',
          'Step 3: regear the asset beta at the project gearing',
          'Step 4: feed the new equity beta into CAPM to get project Ke',
          'Step 5: build project WACC and discount the project cash flows',
        ],
        apply: 'In Marnhall (Sep/Dec 25), the proxy was found in a different industry but with comparable operating leverage. Candidates who used the wrong proxy lost the entire 8 marks for cost of capital.',
        coach: {
          title: 'Coach technique',
          body: 'Always show the formula, sub in the numbers, quote the result, then a one-line comment. Four lines, four marks.',
        },
      },
      {
        heading: 'When to use WACC, when to use APV',
        intro: 'WACC assumes constant gearing. APV separates project value from financing side effects, so use APV when gearing shifts or financing is non-standard.',
        bullets: [
          'WACC: stable mature companies, gearing roughly constant, no special financing',
          'APV: project finance, leveraged buyouts, subsidised loans, tax holidays',
          'Never use the parent WACC for a project with a different risk class',
          'Never include risk in the cash flows AND the discount rate (double counting)',
        ],
        apply: 'A leveraged acquisition where debt repays from cash flow is APV territory. Quote that to the examiner.',
      },
    ],
    formulas: [
      { name: 'WACC', formula: 'WACC = (E/V) Ke + (D/V) Kd (1 - T)', variables: ['E equity market value', 'D debt market value', 'V = E + D', 'Ke cost of equity', 'Kd cost of debt', 'T tax rate'], context: 'Project discount rate when gearing is stable.', category: 'CoC' },
      { name: 'CAPM', formula: 'Ke = Rf + Beta_e (Rm - Rf)', variables: ['Rf risk free rate', 'Rm expected market return', 'Beta_e equity beta'], context: 'Cost of equity once you know the equity beta.', category: 'CoC' },
      { name: 'M&M2 ungear', formula: 'Beta_a = Beta_e * E / (E + D (1 - T))', variables: ['Beta_a asset beta', 'Beta_e equity beta', 'E equity', 'D debt', 'T tax rate'], context: 'Strip financial risk from a proxy company beta.', category: 'CoC' },
      { name: 'M&M2 regear', formula: 'Beta_e = Beta_a * (1 + D (1 - T) / E)', variables: ['as above'], context: 'Add target gearing back onto the asset beta.', category: 'CoC' },
    ],
    worked: {
      title: 'Project WACC for a 50% geared expansion',
      steps: [
        { label: 'Proxy data', detail: 'Beta_e 1.4, gearing D/E 30/70, tax 25%' },
        { label: 'Ungear', calc: 'Beta_a = 1.4 * 70 / (70 + 30 * 0.75) = 1.4 * 70 / 92.5 = 1.059', detail: 'Asset beta isolates business risk.' },
        { label: 'Regear at 50/50', calc: 'Beta_e new = 1.059 * (1 + 50 * 0.75 / 50) = 1.059 * 1.75 = 1.853', detail: 'Higher gearing, higher equity beta.' },
        { label: 'CAPM', calc: 'Ke = 4% + 1.853 * 5% = 13.27%', detail: 'Project cost of equity.' },
        { label: 'WACC', calc: '0.5 * 13.27% + 0.5 * 4.5% * 0.75 = 6.635% + 1.6875% = 8.32%', detail: 'Round to 8.3% in the answer.' },
      ],
      result: 'Project WACC 8.3%, used to discount the incremental project cash flows only.',
    },
    drills: [
      {
        id: 'coc-d1',
        prompt: 'Equity beta 1.2, gearing 25/75, tax 20%. Ungear to find the asset beta.',
        approach: ['Apply M&M2 ungear formula directly'],
        workings: ['Beta_a = 1.2 * 75 / (75 + 25 * 0.80)', 'Beta_a = 1.2 * 75 / (75 + 20)', 'Beta_a = 1.2 * 75 / 95', 'Beta_a = 0.947'],
        answer: 'Asset beta is 0.947',
        marks: 3,
        trap: 'Forgetting (1 - T) on the debt term. That is a marks-loser the examiner watches for.',
      },
    ],
    pitfalls: [
      { title: 'Using parent WACC for a project', body: 'Only valid if the project has the same business and financial risk as the parent. Almost never the case.' },
      { title: 'Mixing real and nominal', body: 'If your cash flows are real, your discount rate must be real (Fisher equation). Mixing both wipes the entire NPV mark.' },
      { title: 'Book values in WACC', body: 'Always use market values for equity and debt. Book value is acceptable only when explicitly stated.' },
    ],
  },

  npv: {
    id: 'npv',
    title: 'NPV with Inflation and Tax',
    syllabus: 'B',
    matchday: 'MD 3',
    badge: 'fa-chart-line',
    papers: ['Sep/Dec 24 Q1', 'Sep/Dec 25 Q1 Drimpton'],
    hook: 'The biggest mark earner on the paper. Pristine layout earns marks before the maths even starts.',
    notes: [
      {
        heading: 'The proforma layout',
        intro: 'Examiners mark down the columns. A clean layout is half the marks.',
        bullets: [
          'Years 0 to N as columns, items as rows',
          'Inflate per line at its own rate, do not pool',
          'Tax: lag one year unless told otherwise',
          'Working capital: invest in year 0, increment each year, release at year N',
          'Tax allowable depreciation: writing down allowance creates the tax saving, not the cash flow itself',
        ],
        apply: 'Drimpton (Sep/Dec 25) had three inflation rates. Candidates who used a single rate lost 6+ marks.',
        coach: {
          title: 'Coach technique',
          body: 'Show working notes (W1 to W4) below the proforma. Each W is a separate mark.',
        },
      },
      {
        heading: 'The Fisher trap',
        intro: 'Real or nominal: pick one and stay there.',
        bullets: [
          '(1 + nominal) = (1 + real) (1 + inflation)',
          'Nominal cash flows discount at nominal rate',
          'Real cash flows discount at real rate',
          'Mixing the two earns 0 for the appraisal mark',
        ],
        apply: 'If the question gives the cost of capital nominal but cash flows real, deflate the rate first or inflate the flows. Always show your working.',
      },
    ],
    formulas: [
      { name: 'NPV', formula: 'NPV = sum_{t=0}^{n} CF_t / (1 + r)^t', variables: ['CF_t cash flow in year t', 'r discount rate', 'n project life'], context: 'Accept if NPV > 0. Reject if NPV < 0.', category: 'Valuation' },
      { name: 'Fisher', formula: '(1 + i) = (1 + r) (1 + h)', variables: ['i nominal rate', 'r real rate', 'h inflation'], context: 'Convert between nominal and real discount rates.', category: 'Valuation' },
      { name: 'IRR', formula: 'NPV at IRR = 0', variables: ['solved iteratively or by linear interpolation'], context: 'Comment on the IRR result, do not just quote the number.', category: 'Valuation' },
    ],
    worked: {
      title: 'Year 1 inflated revenue (Drimpton style)',
      steps: [
        { label: 'Base revenue', detail: 'Year 1 nominal sales of 50000 units at £42 each' },
        { label: 'Inflation', detail: 'Selling price inflates at 3.5% per year, applied from year 2' },
        { label: 'Year 1', calc: '50000 * 42 = 2,100,000', detail: 'No inflation in year 1.' },
        { label: 'Year 2', calc: '50000 * 42 * 1.035 = 2,173,500', detail: 'Single year compound.' },
        { label: 'Year 3', calc: '50000 * 42 * 1.035^2 = 2,249,572', detail: 'Two years compound.' },
      ],
      result: 'Each year inflated at the line specific rate, not pooled.',
    },
    drills: [
      {
        id: 'npv-d1',
        prompt: 'Real cost of capital is 8%, inflation 3%. Find the nominal rate.',
        approach: ['Apply Fisher equation', 'Round to 1 decimal place'],
        workings: ['(1 + i) = 1.08 * 1.03 = 1.1124', 'i = 11.24%'],
        answer: 'Nominal cost of capital is 11.24%',
        marks: 2,
        trap: 'Adding the rates: 8% + 3% = 11%. Wrong by 0.24%, which is enough to lose the mark.',
      },
    ],
    pitfalls: [
      { title: 'Pooling inflation rates', body: 'Each cost line has its own inflation rate. Apply individually.' },
      { title: 'Tax timing', body: 'AFM convention: tax paid one year in arrears unless the question states "at the end of the year of profit".' },
      { title: 'Working capital release', body: 'WC released as a positive cash flow in the final year, sometimes phased.' },
    ],
  },

  apv: {
    id: 'apv',
    title: 'Adjusted Present Value',
    syllabus: 'B',
    matchday: 'MD 4',
    badge: 'fa-sitemap',
    papers: ['Mar/Jun 24 Q2', 'Sep/Dec 23 Q1'],
    hook: 'Project finance, LBOs, subsidised loans. APV beats WACC when gearing shifts.',
    notes: [
      {
        heading: 'The two stage process',
        intro: 'Compute base case NPV at the ungeared cost of equity. Add the present value of financing side effects separately.',
        bullets: [
          'Base case: discount project cash flows at Ke ungeared',
          'Tax shield: PV of (interest * T), discount at Kd or risk free',
          'Issue costs: deducted upfront from APV',
          'Subsidised loan benefit: PV of (commercial rate - subsidised rate) * loan principal * (1 - T)',
        ],
        apply: 'Subsidised loans almost always appear when APV is tested. Always net of tax.',
        coach: {
          title: 'Coach technique',
          body: 'Tabulate base NPV, then list each financing effect on its own line. Examiner can tick each one.',
        },
      },
    ],
    formulas: [
      { name: 'APV', formula: 'APV = Base NPV + PV financing side effects', variables: ['Base NPV at Ke ungeared', 'PV of tax shield, issue costs, subsidies'], context: 'Use when gearing changes or special financing exists.', category: 'Valuation' },
      { name: 'Ke ungeared', formula: 'Ke_u = Rf + Beta_a (Rm - Rf)', variables: ['Beta_a asset beta'], context: 'The discount rate for base case APV.', category: 'CoC' },
      { name: 'Tax shield PV', formula: 'PV TS = D * Kd * T * AF', variables: ['D debt', 'Kd cost of debt', 'T tax rate', 'AF annuity factor'], context: 'Discount at Kd because the tax shield is as risky as the debt.', category: 'Valuation' },
    ],
    worked: {
      title: 'APV with subsidised loan',
      steps: [
        { label: 'Base NPV', detail: 'Cash flows discounted at 11% Ke ungeared', calc: 'Base NPV = 4.20m' },
        { label: 'Tax shield', detail: '10m loan at 6% interest, tax 25%, 5 years AF at Kd 6% = 4.212', calc: 'PV TS = 10 * 0.06 * 0.25 * 4.212 = 0.632m' },
        { label: 'Subsidised loan benefit', detail: 'Commercial 8%, subsidised 6%, saving 2% on 10m for 5 years, AF 4.212', calc: 'PV sub = 10 * 0.02 * 0.75 * 4.212 = 0.632m' },
        { label: 'Issue costs', detail: '2% of 10m raised', calc: 'Issue costs = -0.20m' },
        { label: 'APV', calc: '4.20 + 0.632 + 0.632 - 0.20 = 5.264m', detail: 'Project adds 5.26m to firm value.' },
      ],
      result: 'APV £5.26m, accept the project.',
    },
    drills: [
      {
        id: 'apv-d1',
        prompt: '5m loan at 4%, tax 25%, 4 years. Annuity factor 3.546. Find PV of tax shield.',
        approach: ['Tax shield = D * Kd * T * AF'],
        workings: ['= 5 * 0.04 * 0.25 * 3.546', '= 0.1773'],
        answer: 'PV of tax shield is £0.177m',
        marks: 2,
        trap: 'Discounting at WACC. The tax shield is debt-risky, discount at Kd.',
      },
    ],
    pitfalls: [
      { title: 'WACC inside APV', body: 'APV uses ungeared cost of equity for the base case. WACC double counts the tax shield.' },
      { title: 'Discount rate for tax shield', body: 'Use Kd or Rf. Never WACC.' },
      { title: 'Forgetting (1 - T)', body: 'Subsidised loan benefit is post-tax. Multiply by (1 - T).' },
    ],
  },

  real: {
    id: 'real',
    title: 'Real Options',
    syllabus: 'B',
    matchday: 'MD 5',
    badge: 'fa-bolt',
    papers: ['Sep/Dec 24 Q2', 'Mar/Jun 23 Q1'],
    hook: 'When NPV says reject and the manager says proceed, it is usually because of a real option.',
    notes: [
      {
        heading: 'The four real option types',
        intro: 'Map the scenario to one of these four. Then map the real option onto Black-Scholes inputs.',
        bullets: [
          'Option to delay: defer the project to wait for new information. Time value of waiting.',
          'Option to expand: invest now to create a bigger investment opportunity later.',
          'Option to abandon: walk away part-way through if conditions deteriorate. Like a put.',
          'Option to switch: change inputs, outputs, or technology. Built-in flexibility.',
        ],
        apply: 'A pharma company spends £20m on R&D so it can spend £200m on commercial rollout. The R&D is buying a call option on the bigger spend.',
        coach: {
          title: 'Coach technique',
          body: 'Always say which type of option, then map Pa, Pe, t, sigma, r before doing any maths.',
        },
      },
      {
        heading: 'Black-Scholes mapping for real options',
        intro: 'Pa is the present value of the cash flows you are buying. Pe is the cost to get them. Never flip these.',
        bullets: [
          'Pa = PV of inflows from exercising (the asset you obtain)',
          'Pe = exercise price (cost of the bigger investment)',
          'sigma = volatility of project cash flows or asset returns',
          't = time to decision (years)',
          'r = risk free rate',
        ],
        apply: 'For the option to abandon, treat as a put: P = Pe e^-rt N(-d2) - Pa N(-d1).',
      },
    ],
    formulas: [
      { name: 'Black-Scholes call', formula: 'C = Pa N(d1) - Pe e^(-rt) N(d2)', variables: ['Pa underlying', 'Pe strike', 'r risk free', 't time', 'sigma volatility'], context: 'Value the option to expand or option to delay.', category: 'Options' },
      { name: 'd1', formula: 'd1 = (ln(Pa/Pe) + (r + 0.5 sigma^2) t) / (sigma sqrt(t))', variables: [], context: 'Always compute d1 first, then d2.', category: 'Options' },
      { name: 'd2', formula: 'd2 = d1 - sigma sqrt(t)', variables: [], context: 'Always derived from d1.', category: 'Options' },
      { name: 'Put-call parity', formula: 'P = C - Pa + Pe e^(-rt)', variables: [], context: 'Convert between call and put values.', category: 'Options' },
    ],
    worked: {
      title: 'Option to expand a pilot',
      steps: [
        { label: 'Map', detail: 'Pa 25m PV inflows, Pe 30m capex, t 2 years, sigma 30%, r 4%' },
        { label: 'd1', calc: 'd1 = (ln(25/30) + (0.04 + 0.5 * 0.09) * 2) / (0.3 * sqrt(2)) = (-0.182 + 0.17) / 0.424 = -0.029' },
        { label: 'd2', calc: 'd2 = -0.029 - 0.424 = -0.453' },
        { label: 'N(d1), N(d2)', detail: 'From normal table: N(-0.03) = 0.488, N(-0.45) = 0.326' },
        { label: 'Call', calc: 'C = 25 * 0.488 - 30 * e^(-0.08) * 0.326 = 12.20 - 30 * 0.923 * 0.326 = 12.20 - 9.03 = 3.17m' },
      ],
      result: 'Add 3.17m to the base project NPV. The flexibility itself is worth 3.17m.',
    },
    drills: [
      {
        id: 'real-d1',
        prompt: 'Pa 50, Pe 60, sigma 25%, t 1, r 5%. State d1 (no maths required, just the formula sub).',
        approach: ['Slot inputs into d1 formula and stop.'],
        workings: ['d1 = (ln(50/60) + (0.05 + 0.5 * 0.0625) * 1) / (0.25 * 1)'],
        answer: 'd1 = (-0.1823 + 0.0813) / 0.25 = -0.404',
        marks: 3,
        trap: 'Flipping Pa and Pe. ln(60/50) is the wrong sign.',
      },
    ],
    pitfalls: [
      { title: 'Pa and Pe flipped', body: 'Pa is what you get. Pe is what you pay. Never the other way round.' },
      { title: 'Annual sigma confusion', body: 'sigma must be annual. If given monthly volatility, multiply by sqrt(12).' },
      { title: 'No commentary', body: 'After computing the option value, comment on its size relative to base NPV. Marks for judgement.' },
    ],
  },

  fx: {
    id: 'fx',
    title: 'FX Hedging',
    syllabus: 'D',
    matchday: 'MD 6',
    badge: 'fa-money-bill-transfer',
    papers: ['Sep/Dec 25 Q3 Passmore', 'Mar/Jun 24 Q3'],
    hook: 'Pick the side correctly. Forward, futures, money market hedge, options. Compare in a table.',
    notes: [
      {
        heading: 'Money market hedge for a payable',
        intro: 'Borrow home now, convert to foreign at spot, deposit foreign to grow into the payable.',
        bullets: [
          'Step 1: PV the foreign payable at the foreign deposit rate',
          'Step 2: convert to home currency at todays spot',
          'Step 3: borrow that home currency amount',
          'Step 4: when payable is due, the deposit pays it off',
          'Effective home cost = home borrowing principal plus interest',
        ],
        apply: 'Passmore (Sep/Dec 25): MMH gave a slightly worse result than forward. Examiner expected the comparison and a recommendation.',
        coach: {
          title: 'Coach technique',
          body: 'Always tabulate forward, MMH, futures, options side by side. Recommend at the bottom.',
        },
      },
      {
        heading: 'Currency futures, the right side',
        intro: 'Sell the foreign currency you will receive. Buy the foreign currency you will pay.',
        bullets: [
          'GBP firm receiving USD: sell USD futures (which is buy GBP futures contractually)',
          'Hedge ratio: number of contracts = exposure / contract size, rounded',
          'Basis risk: futures may not perfectly match the spot at close, residual loss',
          'Always close out at the cash date and take the spot rate for the underlying',
        ],
        apply: 'Always state which side, the contract size used, and the closing-out date.',
      },
    ],
    formulas: [
      { name: 'Interest rate parity', formula: 'F = S * (1 + i_q) / (1 + i_b)', variables: ['F forward rate', 'S spot', 'i_q quote currency interest rate', 'i_b base currency interest rate'], context: 'Theoretical forward rate. Quoted forwards may differ for credit risk.', category: 'FX' },
      { name: 'Purchasing power parity', formula: 'F = S * (1 + h_q) / (1 + h_b)', variables: ['h inflation rates'], context: 'Long-run forward rate. Useful for forecasts beyond 1 year.', category: 'FX' },
    ],
    worked: {
      title: 'MMH for a $1m payable in 3 months',
      steps: [
        { label: 'Foreign deposit rate', detail: 'USD deposit 4% per year, 3 months' },
        { label: 'PV the payable', calc: 'PV = 1,000,000 / (1 + 0.04/4) = 990,099 USD' },
        { label: 'Convert at spot', detail: 'Spot USD/GBP 1.25, sell GBP buy USD at the bid', calc: 'GBP needed = 990,099 / 1.25 = £792,079' },
        { label: 'Borrow GBP', detail: 'GBP borrow rate 6% per year, 3 months', calc: 'Repaid = 792,079 * 1.015 = £803,960' },
        { label: 'Effective rate', calc: '£803,960 / 1,000,000 = 0.8040 GBP per USD' },
      ],
      result: 'Effective rate 0.8040, compare to the quoted forward rate.',
    },
    drills: [
      {
        id: 'fx-d1',
        prompt: 'Spot GBP/EUR 1.18. UK rate 5%, Euro rate 3%. 6-month theoretical forward?',
        approach: ['Use IRP formula', 'Pro-rata interest rates by 0.5'],
        workings: ['F = 1.18 * (1 + 0.03/2) / (1 + 0.05/2)', 'F = 1.18 * 1.015 / 1.025', 'F = 1.18 * 0.99024', 'F = 1.1685'],
        answer: 'Theoretical 6-month forward GBP/EUR = 1.1685',
        marks: 3,
        trap: 'Putting the higher rate on top. The high-interest currency depreciates forward.',
      },
    ],
    pitfalls: [
      { title: 'Wrong side of bid/ask', body: 'Banks make money on the spread. Buying foreign uses the higher (ask) side.' },
      { title: 'No comparison', body: 'A hedging answer must compare alternatives in a table. Choosing the cheapest is the recommendation mark.' },
      { title: 'Premium on options', body: 'Always future-value the option premium to the cash date.' },
    ],
  },

  ir: {
    id: 'ir',
    title: 'Interest Rate Risk',
    syllabus: 'E',
    matchday: 'MD 7',
    badge: 'fa-percent',
    papers: ['Mar/Jun 25 Q3', 'Sep/Dec 23 Q3'],
    hook: 'FRAs, futures, swaps, collars, swaptions. Every IR question is a hedging table plus a swap diagram.',
    notes: [
      {
        heading: 'FRA: lock the rate today for a future borrowing',
        intro: 'Pay fixed, receive floating, on a notional principal, for a future borrowing period.',
        bullets: [
          'Buy FRA if you will borrow (you fear rates rise)',
          'Sell FRA if you will deposit (you fear rates fall)',
          'Settlement = (reference - FRA rate) * principal * days/360, discounted at the reference rate',
          'Buyer benefits when rates rise above the FRA',
        ],
        apply: 'A 3v9 FRA covers borrowing starting in 3 months for 6 months.',
        coach: {
          title: 'Coach technique',
          body: 'Show the FRA settlement separately from the actual interest payment. Examiner wants to see both.',
        },
      },
      {
        heading: 'Interest rate swap with QSD',
        intro: 'Two firms with different credit ratings each have a comparative advantage in one market. Swap to share the saving.',
        bullets: [
          'Compute QSD = fixed differential minus floating differential',
          'Allocate the saving between the parties (usually 50/50 plus or minus the bank fee)',
          'Each party borrows in the market where it has the smaller premium',
          'Then swap to access the cheaper effective rate',
          'Always draw the swap diagram with arrows for principal directions',
        ],
        apply: 'A weak credit pays floating + 1.5% rather than fixed + 2.5%. That is the comparative advantage signal.',
      },
    ],
    formulas: [
      { name: 'FRA settlement', formula: 'S = N * (r_ref - r_fra) * days/360 / (1 + r_ref * days/360)', variables: ['N notional', 'r_ref reference rate', 'r_fra agreed FRA rate'], context: 'Settled at the start of the borrowing period, discounted.', category: 'IRR' },
      { name: 'IR future tick', formula: 'Tick value = 0.01% * 0.25 * 1,000,000 = £25', variables: [], context: 'For 3-month £1m sterling futures. Each tick equals £12.50 for $1m equivalent depending on contract.', category: 'IRR' },
      { name: 'QSD', formula: 'QSD = (fixed_premium A - fixed_premium B) - (floating_premium A - floating_premium B)', variables: [], context: 'Total saving available from a swap.', category: 'IRR' },
    ],
    worked: {
      title: '3v9 FRA on £10m at 5.5%',
      steps: [
        { label: 'Setup', detail: 'Borrowing £10m for 6 months in 3 months time. FRA rate 5.5%' },
        { label: 'Outcome A: rate rises to 6%', detail: '' },
        { label: 'Settlement', calc: '10m * (0.06 - 0.055) * 0.5 / (1 + 0.06 * 0.5) = 10m * 0.0025 / 1.03 = £24,272 receipt' },
        { label: 'Actual interest', calc: '10m * 6% * 0.5 = £300,000' },
        { label: 'Net cost', calc: '300,000 - 24,272 future-value to end of period = effective ~5.5%' },
      ],
      result: 'FRA locks in 5.5%. Receipt offsets the higher actual rate.',
    },
    drills: [
      {
        id: 'ir-d1',
        prompt: '£5m to deposit in 4 months for 3 months. You fear rates fall. Buy or sell FRA?',
        approach: ['Identify cash flow direction', 'Match action to fear'],
        workings: [],
        answer: 'Sell FRA. The depositor sells FRA to lock the deposit rate against falling rates.',
        marks: 2,
        trap: 'Inverting buyer and seller. Borrowers buy FRAs, depositors sell.',
      },
    ],
    pitfalls: [
      { title: 'No swap diagram', body: 'Every swap question wants the diagram. Three boxes, four arrows. One mark for the layout.' },
      { title: 'Periodise the rate', body: 'Annual rates must be pro-rated for sub-annual periods.' },
      { title: 'Settlement not discounted', body: 'FRAs settle at start of period, so discount the difference back.' },
    ],
  },

  mna: {
    id: 'mna',
    title: 'M&A Valuation and Synergy',
    syllabus: 'C',
    matchday: 'MD 8',
    badge: 'fa-handshake',
    papers: ['Sep/Dec 25 Q2 Marnhall', 'Mar/Jun 25 Q1'],
    hook: 'Stand-alone, with synergy, max bid. Never confuse stand-alone value with the maximum bid.',
    notes: [
      {
        heading: 'Three valuations, three columns',
        intro: 'Stand-alone of target, target plus synergy, the maximum bid the acquirer should pay.',
        bullets: [
          'Stand-alone target: PV of target cash flows at target WACC',
          'With synergy: target value plus PV of revenue, cost and financial synergies',
          'Max bid: stand-alone plus all synergy minus target premium captured by sellers',
          'A bid above max bid destroys acquirer wealth',
        ],
        apply: 'Marnhall (Sep/Dec 25): synergy of 14m, sellers demanded a 30% premium on stand-alone of 80m, so 104m max bid was tight.',
        coach: {
          title: 'Coach technique',
          body: 'Tabulate three columns: Stand-alone, With Synergy, Max Bid. Recommend a bid at the bottom.',
        },
      },
      {
        heading: 'Three sources of synergy',
        intro: 'Revenue, cost, financial. Be sceptical of revenue synergy claims.',
        bullets: [
          'Revenue: cross-sell, pricing power, longer competitive moat',
          'Cost: scale, scope, eliminating duplication',
          'Financial: lower WACC, debt capacity, tax loss utilisation',
          'Cost synergies are most defensible. Revenue is most often overstated.',
        ],
        apply: 'A 5% revenue uplift on a £400m turnover sounds modest, but in reality it requires combined sales force success. Stress-test it.',
      },
    ],
    formulas: [
      { name: 'Synergy gain', formula: 'G = V_combined - V_acquirer - V_target', variables: ['V combined post merger value', 'V_a, V_t pre-merger values'], context: 'The cake to be split between buyer and seller.', category: 'M&A' },
      { name: 'Max bid', formula: 'Max = V_target_standalone + G_synergy', variables: [], context: 'Above this, acquirer destroys wealth.', category: 'M&A' },
      { name: 'Bootstrapping EPS', formula: 'EPS_new = (E_acquirer + E_target) / (Shares_acquirer + new_shares)', variables: [], context: 'Apparent EPS rise from share-for-share with PE differential. Comment that this is cosmetic.', category: 'M&A' },
    ],
    worked: {
      title: 'Marnhall style 3-column valuation',
      steps: [
        { label: 'Stand-alone', detail: 'Target WACC 9%, FCFE £8m growing 2%', calc: 'V = 8 * 1.02 / (0.09 - 0.02) = £116.6m' },
        { label: 'With synergy', detail: 'Cost synergy £4m perpetuity at 9%', calc: 'V_syn = 116.6 + 4 / 0.09 = 116.6 + 44.4 = £161m' },
        { label: 'Max bid', detail: 'Acquirer captures 50% of synergy', calc: 'Max = 116.6 + 0.5 * 44.4 = £138.8m' },
        { label: 'Recommend', detail: 'Bid up to £138.8m, walk away above this' },
      ],
      result: 'Stand-alone 116.6m, with synergy 161m, max bid 138.8m.',
    },
    drills: [
      {
        id: 'mna-d1',
        prompt: 'Target stand-alone £200m, synergy £50m. Sellers want a 25% premium on stand-alone. Should the acquirer bid?',
        approach: ['Compute the premium amount', 'Compare to synergy', 'Recommend'],
        workings: ['25% of 200m = £50m premium', 'Synergy is £50m'],
        answer: 'The premium exactly absorbs the synergy. Acquirer is indifferent; in practice walk away because integration risk is unrewarded.',
        marks: 3,
        trap: 'Recommending bid because synergy exists. Synergy must exceed the premium for value to accrue to the acquirer.',
      },
    ],
    pitfalls: [
      { title: 'Confusing stand-alone with max bid', body: 'Stand-alone is the floor. Max bid is the ceiling. Always state both.' },
      { title: 'Missing the bootstrapping comment', body: 'Share-for-share deals can flatter EPS without creating value. Always flag this.' },
      { title: 'No 2-sided cash vs share comment', body: 'Section A always asks about consideration structure. Cash gives certainty, shares share risk.' },
    ],
  },

  val: {
    id: 'val',
    title: 'Equity Valuation',
    syllabus: 'C',
    matchday: 'MD 9',
    badge: 'fa-coins',
    papers: ['Mar/Jun 24 Q2', 'Sep/Dec 23 Q2'],
    hook: 'FCFE, FCFF, dividends, multiples. Match the model to the data, not the other way round.',
    notes: [
      {
        heading: 'FCFE vs FCFF',
        intro: 'FCFE is to equity holders, discounted at Ke. FCFF is to all providers, discounted at WACC.',
        bullets: [
          'FCFE = NI + D&A - Capex - delta WC + Net borrowing',
          'FCFF = EBIT (1 - T) + D&A - Capex - delta WC',
          'Discount FCFE at Ke; FCFF at WACC',
          'Never discount FCFE at WACC, the Ke embeds gearing already',
          'Terminal value at year N = FCF_N+1 / (r - g)',
        ],
        apply: 'A common 2-mark loser: FCFE discounted at WACC.',
        coach: {
          title: 'Coach technique',
          body: 'State the model, define the cash flow, then build the table. Header earns marks.',
        },
      },
    ],
    formulas: [
      { name: 'FCFE perpetuity', formula: 'V_E = FCFE_1 / (Ke - g)', variables: ['Ke cost of equity', 'g long-run growth'], context: 'When FCFE grows at constant g forever.', category: 'Valuation' },
      { name: 'FCFF perpetuity', formula: 'V_Firm = FCFF_1 / (WACC - g)', variables: [], context: 'Then subtract debt to obtain equity.', category: 'Valuation' },
      { name: 'Gordon dividend', formula: 'P_0 = D_1 / (Ke - g)', variables: [], context: 'Mature dividend payers only.', category: 'Valuation' },
      { name: 'PE relative', formula: 'V = EPS * PE_proxy', variables: [], context: 'Adjust for size, gearing, growth differences.', category: 'Valuation' },
    ],
    worked: {
      title: 'FCFF valuation with two-stage growth',
      steps: [
        { label: 'Stage 1', detail: 'Years 1 to 3 explicit FCFF: 8, 9, 10' },
        { label: 'Discount', detail: 'WACC 9%, factors 0.917, 0.842, 0.772', calc: 'PV stage 1 = 8 * 0.917 + 9 * 0.842 + 10 * 0.772 = 22.59' },
        { label: 'Terminal', calc: 'TV = 10 * 1.02 / (0.09 - 0.02) = 145.71' },
        { label: 'Discount TV', calc: 'PV TV = 145.71 * 0.772 = 112.49' },
        { label: 'Firm value', calc: '22.59 + 112.49 = £135.08m' },
        { label: 'Equity', detail: 'Less debt 30m', calc: 'V_E = 135.08 - 30 = £105.08m' },
      ],
      result: 'Equity value 105m, sense check against share price times shares outstanding.',
    },
    drills: [
      {
        id: 'val-d1',
        prompt: 'FCFE next year £5m, Ke 12%, g 3%. Compute equity value.',
        approach: ['Apply Gordon-style FCFE formula'],
        workings: ['V_E = 5 / (0.12 - 0.03) = 5 / 0.09'],
        answer: 'V_E = £55.6m',
        marks: 2,
        trap: 'Discounting at WACC. FCFE belongs to equity, use Ke.',
      },
    ],
    pitfalls: [
      { title: 'Wrong discount rate', body: 'FCFE meets Ke. FCFF meets WACC. Cross-pollinating fails.' },
      { title: 'Reinvestment ignored', body: 'A growing firm needs capex above depreciation. Show net reinvestment.' },
      { title: 'Book value WACC', body: 'WACC must use market values. Book values overstate gearing.' },
    ],
  },

  islam: {
    id: 'islam',
    title: 'Islamic Finance',
    syllabus: 'B',
    matchday: 'MD 10',
    badge: 'fa-mosque',
    papers: ['Sep/Dec 24 Q3', 'Mar/Jun 23 Q3'],
    hook: 'Sukuk, Murabaha, Mudaraba, Ijara, Musharaka. Three principles: no riba, no gharar, share risk.',
    notes: [
      {
        heading: 'The five Islamic instruments',
        intro: 'Each one maps to a conventional Western product but obeys Sharia constraints.',
        bullets: [
          'Murabaha: cost-plus trade credit. Bank buys the asset and resells with a fixed mark-up.',
          'Sukuk: asset-backed bond. Holders own a slice of the asset and earn rentals.',
          'Ijara: lease. Bank owns the asset, lessee pays rent. Title may transfer at end.',
          'Mudaraba: capital provider plus manager. Profit shared, losses borne by capital provider only.',
          'Musharaka: joint venture. Both parties contribute capital and share profit and loss.',
        ],
        apply: 'A construction project funded by sukuk gives investors a claim on rental income from the building, not interest on the loan principal.',
        coach: {
          title: 'Coach technique',
          body: 'When asked to recommend an Islamic instrument, always state which one, why it suits the scenario, and one alternative.',
        },
      },
    ],
    formulas: [],
    worked: {
      title: 'Mudaraba versus conventional debt for an expansion',
      steps: [
        { label: 'Conventional', detail: '£10m loan at 6%, fixed interest, lender bears no operating risk' },
        { label: 'Mudaraba', detail: '£10m capital from bank, bank as rabb-ul-mal, firm as mudarib' },
        { label: 'Profit share', detail: 'Agreed 60/40 in favour of bank for years 1 to 3, then 50/50' },
        { label: 'Loss', detail: 'If business loses money, the bank bears 100% of the financial loss' },
        { label: 'Recommendation', detail: 'Mudaraba shifts downside risk to the financier, useful for early-stage growth' },
      ],
      result: 'Mudaraba suits high-uncertainty expansions where debt service is risky.',
    },
    drills: [
      {
        id: 'islam-d1',
        prompt: 'Name the Islamic instrument equivalent to a conventional bond, and the equivalent to a leveraged buyout finance partnership.',
        approach: ['Match function to instrument'],
        workings: [],
        answer: 'Sukuk is the Islamic bond equivalent. Mudaraba is the closest equivalent to LBO partnership financing.',
        marks: 2,
        trap: 'Confusing Murabaha with Sukuk. Murabaha is trade credit, Sukuk is asset-backed bond.',
      },
    ],
    pitfalls: [
      { title: 'Calling sukuk a bond', body: 'Sukuk holders own the asset, not a debt claim. Examiner is precise on this.' },
      { title: 'No principle stated', body: 'Always reference riba, gharar or shared risk in the explanation.' },
    ],
  },

  risk: {
    id: 'risk',
    title: 'Risk and VaR',
    syllabus: 'B',
    matchday: 'MD 11',
    badge: 'fa-shield-halved',
    papers: ['Sep/Dec 24 Q3', 'Mar/Jun 24 Q3'],
    hook: 'z = 1.645 at 95%, z = 2.326 at 99%. T-day VaR = 1-day VaR times sqrt(T).',
    notes: [
      {
        heading: 'Value at Risk: the three numbers',
        intro: 'Always quote z, sigma and confidence. Always state one-tail vs two-tail.',
        bullets: [
          'VaR = z * sigma * value (one-tail)',
          'z(95%) = 1.645, z(99%) = 2.326',
          'T-day VaR = 1-day VaR * sqrt(T)',
          'Quote: "We are X% confident losses will not exceed £Y over T days"',
        ],
        apply: 'A bank with 1-day 99% VaR of £4m will breach roughly 2 to 3 times per year on average.',
        coach: {
          title: 'Coach technique',
          body: 'Quote z explicitly, state one-tail, give a confidence interpretation. Three marks for three sentences.',
        },
      },
      {
        heading: 'Limitations of VaR',
        intro: 'VaR is silent about the size of the tail. Black swan events are systematically underestimated.',
        bullets: [
          'Assumes normal distribution; real returns have fat tails',
          'No information about losses beyond the threshold (use ES / CVaR for that)',
          'Sensitive to historical window choice',
          'Pro-cyclical: low volatility periods understate true risk',
        ],
        apply: 'Mention the 2008 crisis. Banks running 1% VaR breached far more than expected because their normal-distribution assumption broke.',
      },
    ],
    formulas: [
      { name: 'Daily VaR', formula: 'VaR = z * sigma * V', variables: ['z critical value', 'sigma daily volatility', 'V portfolio value'], context: 'One-tail only.', category: 'Portfolio' },
      { name: 'T-day scaling', formula: 'VaR_T = VaR_1 * sqrt(T)', variables: [], context: 'Square-root-of-time rule. Assumes returns are iid.', category: 'Portfolio' },
    ],
    worked: {
      title: '99% one-day VaR on a £20m portfolio',
      steps: [
        { label: 'sigma daily', detail: 'Annual sigma 18%, divide by sqrt(252)', calc: 'sigma_d = 0.18 / sqrt(252) = 1.13%' },
        { label: 'z 99% one-tail', detail: '2.326' },
        { label: 'VaR_1', calc: '2.326 * 0.0113 * 20m = £526,000' },
        { label: 'VaR_10', calc: '526,000 * sqrt(10) = £1.66m' },
        { label: 'Interpretation', detail: 'We are 99% confident the 10-day loss will not exceed £1.66m.' },
      ],
      result: '1-day VaR £526k, 10-day VaR £1.66m.',
    },
    drills: [
      {
        id: 'risk-d1',
        prompt: 'Daily sigma 1.5%, portfolio £8m. Compute 1-day 95% one-tail VaR.',
        approach: ['VaR = z * sigma * V'],
        workings: ['= 1.645 * 0.015 * 8m'],
        answer: 'VaR = £197,400',
        marks: 2,
        trap: 'Using z(99%) = 2.326 by default. Always read the confidence level in the question.',
      },
    ],
    pitfalls: [
      { title: 'No interpretation', body: 'Quote what VaR actually means in plain English. Marks for clarity.' },
      { title: 'sqrt(T) without iid mention', body: 'The square-root rule needs returns to be independent and identically distributed. Caveat once.' },
    ],
  },

  behav: {
    id: 'behav',
    title: 'Behavioural Finance and ESG',
    syllabus: 'A',
    matchday: 'MD 12',
    badge: 'fa-brain',
    papers: ['Sep/Dec 25 Q1 ESG', 'Mar/Jun 25 Q3'],
    hook: 'ESG marks since Sep/Dec 2025 are now mandatory. Application to scenario beats textbook every time.',
    notes: [
      {
        heading: 'Behavioural finance: 7 biases for the exam',
        intro: 'Name. Explain. Apply. Generic lists fail.',
        bullets: [
          'Anchoring: irrelevant reference (asking price)',
          'Availability: over-react to recent news',
          'Overconfidence / hubris: synergy estimates',
          'Loss aversion: pain ~2x pleasure',
          'Herd behaviour: social conformity',
          'Gamblers fallacy: past changes future probability',
          'Entrapment: sunk-cost reluctance to exit',
        ],
        apply: 'A board that bid 30% above stand-alone value because they were "committed" is showing entrapment plus overconfidence.',
        coach: {
          title: 'Coach technique',
          body: 'Three biases is enough. For each: name, one-sentence explanation, one-sentence scenario application.',
        },
      },
      {
        heading: 'ESG marks: scenario, action, outcome',
        intro: 'ACCA marks ESG only for application. Generic textbook prose earns zero.',
        bullets: [
          'Scenario: pick a SPECIFIC ESG fact from the case',
          'Action: recommend a specific, costed action, not "be more sustainable"',
          'Outcome: financial or reputational quantified result',
        ],
        apply: 'Drimpton (Sep/Dec 25): the £8m emissions abatement reduces NPV by £1.2m but secures the social licence to operate. Without it the project faces protests, delaying first revenue by 18 months.',
        coach: {
          title: 'Coach technique',
          body: '3 marks for 3 sentences. Issue, action, outcome. Memorise that pattern.',
        },
      },
    ],
    formulas: [],
    worked: {
      title: 'ESG paragraph for Drimpton',
      steps: [
        { label: 'Issue', detail: 'Annual carbon emissions estimated at 12,000 tonnes from the new line' },
        { label: 'Action', detail: 'Install scrubbers at £8m capex, plus £0.5m per year operating cost' },
        { label: 'Outcome', detail: 'Reduces NPV by 1.2m but secures planning permission and avoids protest delay of 18 months' },
        { label: 'Stakeholder', detail: 'Local community, regulator, ESG-linked debt covenant' },
      ],
      result: 'Four lines, four marks. No padding.',
    },
    drills: [
      {
        id: 'behav-d1',
        prompt: 'Apply NAME-EXPLAIN-APPLY to herd behaviour, one sentence each, in the context of an M&A wave.',
        approach: ['Name', 'Explain', 'Apply'],
        workings: [],
        answer: 'NAME: Herd behaviour. EXPLAIN: Decision-makers mimic the actions of a larger group rather than independent analysis. APPLY: With four similar deals announced in the past quarter, the board may push to bid above the rational max bid because "everyone else is doing deals", increasing the risk of overpayment.',
        marks: 3,
        trap: 'Listing biases without applying them. Application is the marks.',
      },
    ],
    pitfalls: [
      { title: 'Generic ESG prose', body: 'Examiner reports keep flagging this. ALWAYS use Issue-Action-Outcome with case figures.' },
      { title: 'Three-letter ESG labels', body: 'Do not write "E" or "S" alone. Write the full point per sentence.' },
    ],
  },
};

export const TOPIC_LIST = Object.values(TOPICS);
