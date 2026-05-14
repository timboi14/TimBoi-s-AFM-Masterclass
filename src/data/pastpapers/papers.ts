import type { Paper } from './schema';

export const PAPERS: Paper[] = [

  // ─────────────────────────────────────────────
  // 1. PARA FUELS CO — Sep/Dec 2022 — Section A
  // Source: Question Pack (OCR verified) + Solution Pack (text verified)
  // ─────────────────────────────────────────────
  {
    id: 'para_fuels',
    name: 'Para Fuels Co',
    session: 'Sep/Dec 2022',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['Real options', 'NPV', 'BSOP'],
    difficulty: 3,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Who is Para Fuels Co?',
        content: 'Para Fuels Co produces paraffin from crude oil, which gets refined into jet fuel. They were private for many years. Three years ago they listed on a stock exchange and now have diverse shareholders including institutional investors.\n\nOne of their production facilities is at the end of its productive life. The board must replace it. They have two options and need to decide which one to take.',
      },
      {
        id: 'inv_a',
        navLabel: '2. Investment A',
        title: 'Investment A: the safe option',
        content: 'Investment A replaces the dying facility with a new modern one that does the same thing: produces paraffin from crude oil. Same process, proven technology, no surprises.\n\nKey data (verified from Question Pack):\n- Initial investment: $14m\n- Sales revenue year 1: $12.75m, growing 5% per year in years 2-4\n- Production costs year 1: $5.25m\n- Pre-inflation cost amounts: year 2 $6.20m (6% inflation), year 3 $7.10m (7%), year 4 $8.00m (8%)\n- Tax allowable depreciation: 25% reducing balance years 1-3, balancing allowance year 4\n- Working capital: 10% of next year sales, invested at the start of each year\n- Tax rate: 20%, paid in the same year\n- No residual value (decommissioning costs absorb it)\n- PV of years 5-25 post-tax cash flows: $5.40m at the start of year 5\n- Cost of capital: 12%',
        warning: 'Working capital is NOT released at the end of year 25. The question says it is needed for decommissioning costs. Many candidates add a cash inflow at year 25 and inflate the NPV. Do not do this.',
        table: {
          headers: ['Year', 'TAD calculation', 'TAD ($000s)'],
          rows: [
            ['1', '$14,000 x 25%', '3,500'],
            ['2', '($14,000 - 3,500) x 25%', '2,625'],
            ['3', '($14,000 - 3,500 - 2,625) x 25%', '1,969'],
            ['4', 'Balancing allowance (remainder)', '5,906'],
          ],
          highlightLastRow: true,
        },
      },
      {
        id: 'inv_b',
        navLabel: '3. Investment B',
        title: 'Investment B: the risky option',
        content: 'Investment B converts household waste into paraffin using new technology. Potentially far better for the environment. Airlines are under ESG pressure so demand could grow significantly. But it is expensive to set up and the technology is unproven at scale.\n\nKey data (verified from Question Pack):\n- Initial setup cost: $34.6m\n- After-tax free cash flow year 1: $1.4m\n- Years 2 and 3: +40% per year\n- Year 4: doubles the year 3 amount\n- Years 5-25: same as year 4 (stable, given as a lump sum)\n- Annuity factor at 12% for 25 years: 7.843\n\nCrucial point: the question gives you after-tax FCF directly for Investment B. You do not build a tax table for it. Just use these numbers.',
        warning: 'Investment B gives after-tax FCF directly. Do not calculate TAD or tax for it. Candidates who build a full tax table for Investment B waste time and often get the wrong answer.',
      },
      {
        id: 'kero',
        navLabel: '4. The Kero offer',
        title: 'The Kero Innovations offer: where the real option comes in',
        content: 'Kero Innovations Co is a competitor. They have suggested they might buy the Investment B facility from Para Fuels at the start of year 4 for $27m. There is no binding contract. It is just a suggestion.\n\nThis is an abandonment option. If Para Fuels goes ahead with Investment B and things look bad after three years, they can sell the project to Kero for $27m instead of continuing. Normal NPV ignores this flexibility entirely. Black-Scholes Option Pricing (BSOP) assigns a value to it, treating it like a put option.\n\nBSOP inputs:\n- Pa (asset value) = PV of Investment B cash flows from year 4 onwards if continued\n- Pe (exercise price) = $27m Kero offer price\n- t = 3 years (option expires at start of year 4)\n- r = 5% (risk-free rate, given)\n- sigma = 40% (standard deviation of project cash flows, given)',
        warning: 'Pa is not the full 25-year value of Investment B. It is only the PV of cash flows from year 4 onwards, because the option is exercised at the START of year 4. Candidates who use the full project NPV as Pa get a completely wrong BSOP result.',
      },
      {
        id: 'bod',
        navLabel: '5. Board meeting',
        title: 'The board meeting comments',
        content: 'The board met to discuss the new technology. Four people spoke:\n\nCEO: enthusiastic about ESG responsibilities. Pro-Investment B on principle.\n\nCMO: airlines face growing ESG pressure, which creates demand for this fuel. But airlines need to be sure the fuel is safe before they commit. Safety certification could delay adoption significantly.\n\nCFO (cautious): no binding contract with Kero (the $27m offer could disappear). Shareholders support ESG but will not accept large destruction of corporate value. Other facilities also need replacing in two years. This is not a one-off decision.\n\nCFO (optimistic): if the new technology works, Para Fuels benefits from being an early adopter. Learning curve advantages, lower costs over time, stronger customer relationships with ESG-conscious airlines.\n\nPart (b)(iv) is worth 11 marks and covers all four of these. Do not just list the comments back. Agree or disagree with each one and add something the speaker missed.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 4, requirement: 'Explain why Para Fuels might include the value of the Kero Innovations offer when evaluating Investment B. What type of option is it and why can normal NPV not capture it?' },
      { label: '(b)(i)', marks: 9, requirement: 'Calculate the NPV of Investment A. Full cash flow table with TAD, working capital, and tax.' },
      { label: '(b)(ii)', marks: 9, requirement: 'Calculate NPV of Investment B without the Kero real option. Then recalculate NPV of Investment B after adding the BSOP-valued abandonment option.' },
      { label: '(b)(iii)', marks: 7, requirement: 'Recommend on financial grounds which investment to choose. Discuss the assumptions behind your numbers.' },
      { label: '(b)(iv)', marks: 11, requirement: 'Discuss the four board directors comments in detail. Advise how Para Fuels should proceed if Investment B is adopted.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$5,716,000', description: 'NPV of Investment A', source: 'S' },
      { value: '$29,000', description: 'NPV of Investment B (no real option)', source: 'S' },
      { value: '$4,359,000', description: 'NPV of Investment B (with BSOP option)', source: 'S' },
      { value: 'Investment A', description: 'Correct recommendation', source: 'S' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Spot the real option',
        explanation: 'The Kero offer gives Para Fuels the right (not obligation) to sell Investment B at year 3. That is an abandonment option modelled as a put option. Normal NPV assumes the decision is fixed. BSOP assigns a value to the flexibility to walk away.',
      },
      {
        stepNumber: 2,
        title: 'Build the Investment A cash flow table',
        explanation: 'Sales: $12.75m year 1, growing 5% per year. Production costs: given as pre-inflation amounts, then inflated by the specific rate for each year. TAD: 25% reducing balance. Tax at 20% paid same year. Working capital: 10% of next year sales, invested at year start. Add back TAD after applying tax. Discount at 12%. Years 5-25 are given as a $5.40m lump sum at the start of year 5 — discount this back 4 years.',
        formula: 'TAD year 1: 14,000 x 25% = 3,500\nTAD year 2: (14,000 - 3,500) x 25% = 2,625\nTAD year 3: (10,500 - 2,625) x 25% = 1,969\nTAD year 4: balancing allowance = 5,906\n\nNPV of Investment A = $5,716,000',
        verifiedNumbers: ['$5,716,000 — NPV of Investment A (Solution Pack verified)'],
      },
      {
        stepNumber: 3,
        title: 'Calculate Investment B NPV without real option',
        explanation: 'Use the after-tax FCF figures directly: year 1 $1.4m, year 2 $1.96m, year 3 $2.744m, year 4 $5.488m, years 5-25 $5.488m per year. Use the given annuity factor adjusted for timing. Deduct $34.6m initial cost. NPV is barely positive at $29,000.',
        verifiedNumbers: ['$29,000 — NPV of Investment B without real option (Solution Pack verified)'],
      },
      {
        stepNumber: 4,
        title: 'Value the abandonment option using BSOP',
        explanation: 'Pa = PV of Investment B cash flows from year 4 onwards (the asset value Para Fuels gives up if they sell to Kero). Pe = $27m. t = 3. r = 5%. sigma = 40%. Calculate d1 and d2, look up N(d1) and N(d2) in the normal distribution table. Apply the put option formula. Add put option value to the base NPV of $29,000 to get $4,359,000.',
        verifiedNumbers: ['$4,359,000 — NPV of Investment B with BSOP option (Solution Pack verified)'],
      },
      {
        stepNumber: 5,
        title: 'Make the recommendation',
        explanation: 'Investment A NPV $5,716,000 exceeds Investment B NPV $4,359,000 even after the real option. Recommend Investment A on financial grounds. Then discuss the key assumptions: reliability of 40% standard deviation, whether Kero will actually make the offer, whether the year 5-25 cash flow estimates are realistic.',
      },
      {
        stepNumber: 6,
        title: 'Respond to the board comments',
        explanation: 'For each director: state their concern, agree or disagree, add a point they missed. CEO on ESG: valid concern, but ESG must be balanced against shareholder value obligations. CMO on demand: airlines face genuine ESG pressure but safety certification timelines are uncertain. CFO on financial risk: no binding Kero contract is a serious concern — treat the $27m as contingent, not guaranteed. Early adopter argument: learning curve is real but the magnitude of cost reduction is unpredictable.',
      },
    ],

    examinerFeedback: {
      didWell: 'NPV calculations were generally done well. Most candidates correctly identified the Kero offer as an abandonment real option.',
      commonErrors: 'Part (b)(iv) was the weakest section across the sitting. Candidates described the board comments rather than analysing them. Real options discussion was generic with no reference to Para Fuels specific options available in the scenario.',
      tutorTip: 'For an 11-mark discursive part, aim for one well-developed point per mark. Name the director, reference their specific concern, then challenge or support it with a reason tied to the Para Fuels scenario. Generic ESG commentary gets almost nothing.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 2. LOUGH CO — Sep/Dec 2022 — Section B
  // Source: Question Pack (OCR verified)
  // ─────────────────────────────────────────────
  {
    id: 'lough',
    name: 'Lough Co',
    session: 'Sep/Dec 2022',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['Multilateral netting', 'Forex futures', 'Currency options'],
    difficulty: 3,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Who is Lough Co?',
        content: 'Lough Co is a US holding company. Its treasury function centrally manages financial risk on behalf of all its subsidiaries. They use multilateral netting to settle intra-group balances — only the net amounts move, not every individual transaction.',
      },
      {
        id: 'netting',
        navLabel: '2. Netting setup',
        title: 'The multilateral netting setup',
        content: 'Four entities involved. USD is the base currency.\n\nLough Co (USD), Fitz Co (GBP), Gahana Co (INR), Adalar Co (TRY)\n\nSpot rates (verified from Question Pack):\n- GBP/USD: 0.7070\n- INR/USD: 72.4000\n- TRY/USD: 7.2235\n\nVarious intra-group balances exist across all four currencies. The netting process converts everything to USD, builds a matrix of who owes what to whom, and calculates net positions.',
        table: {
          headers: ['Entity', 'Gross flows', 'After netting'],
          rows: [
            ['Lough Co', 'Multiple payables/receivables', 'Net position only'],
            ['Fitz Co', 'Multiple payables/receivables', 'Net position only'],
            ['Gahana Co', 'Multiple payables/receivables', 'Net position only'],
            ['Adalar Co', 'Multiple payables/receivables', 'Net position only'],
          ],
        },
        warning: 'Settlement order matters. The question states settlements are made in a specific order: the entity owing the largest net amount settles first with the entity owed the smallest net amount. Follow this order explicitly.',
      },
      {
        id: 'sek',
        navLabel: '3. SEK payment',
        title: 'The Swedish Krona payment',
        content: 'Separately from the netting, Lough Co has a SEK125m payment due to a Swedish supplier in five months.\n\nKey data (verified from Question Pack):\n- Amount: SEK125m payable in 5 months\n- USD invest rate: 1.5%, borrow rate: 2.2%\n- SEK invest rate: 2.1%, borrow rate: 3.1%\n\nThree hedging methods are available: forward contract (money market approach), currency futures, and currency options.',
        warning: 'Paying SEK means buying SEK. Buying SEK = call options on SEK. Many candidates pick put options here. Think: what currency am I buying? That currency is the one you need call options on.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 9, requirement: 'Calculate the impact on intra-group cash flows if multilateral netting is used. Briefly explain the main advantage.' },
      { label: '(b)', marks: 4, requirement: 'Calculate the USD cost of hedging the SEK payment using the forward (money market) method.' },
      { label: '(c)', marks: 7, requirement: 'Calculate the result using currency futures and currency options. Recommend a hedging strategy.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: 'SEK125m', description: 'Payment amount', source: 'Q' },
      { value: 'GBP/USD 0.7070', description: 'Spot rate', source: 'Q' },
      { value: 'INR/USD 72.4000', description: 'Spot rate', source: 'Q' },
      { value: 'TRY/USD 7.2235', description: 'Spot rate', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Build the netting matrix',
        explanation: 'Convert all intra-group balances to USD at mid-spot rates. Build a matrix where rows are payers and columns are receivers. Sum each entity\'s total payables and total receivables. The net position = total receivable minus total payable. Entities with a net positive receive; entities with net negative pay.',
      },
      {
        stepNumber: 2,
        title: 'Forward contract for SEK payment',
        explanation: 'Use interest rate parity to calculate the 5-month forward rate. Adjust annual rates for 5 months (multiply by 5/12). The money market approach gives a certain locked-in USD cost for the SEK payment.',
      },
      {
        stepNumber: 3,
        title: 'Currency futures for SEK payment',
        explanation: 'Paying SEK so buy SEK futures. Contracts = SEK125m divided by contract size. Calculate total basis and unexpired basis at the 5-month transaction date. Net USD cost = spot transaction plus or minus futures gain or loss.',
      },
      {
        stepNumber: 4,
        title: 'Currency options for SEK payment',
        explanation: 'Paying SEK (buying SEK) so buy call options on SEK. Pay the premium. On settlement date: if spot rate makes buying at spot cheaper than the strike, abandon the option. If spot rate is worse than the strike, exercise. Show both outcomes and recommend.',
      },
    ],

    examinerFeedback: {
      didWell: 'The netting schedule was generally handled well. Most candidates understood the concept of netting and correctly converted all balances to USD.',
      commonErrors: 'Many confused call and put options. Paying foreign currency means buying it, so you need call options. OTC and exchange-traded options were frequently conflated, leading to wrong contract size calculations.',
      tutorTip: 'One question before picking call or put: am I buying or selling the foreign currency? Buying = call. Selling = put. Paying SEK = buying SEK = call options. That single question removes most hedging direction errors.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 3. FONDIR CO — Dec 2022 — Section A
  // Source: ACCA Model Answer (file verified) + Examiner Report
  // ─────────────────────────────────────────────
  {
    id: 'fondir',
    name: 'Fondir Co',
    session: 'Dec 2022',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['Economic risk', 'OTC forward', 'OTC option', 'IR futures'],
    difficulty: 4,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Who is Fondir Co?',
        content: 'Fondir Co is a food production company based in the USA. The USD is their home currency. They have been growing rapidly and now earn revenue in multiple currencies from international customers.\n\nThe board broadly supports using derivatives to manage financial risk. However, the marketing director has challenged whether the costs of hedging outweigh the benefits. Part (b)(iv) is entirely about responding to his challenge.',
      },
      {
        id: 'italy',
        navLabel: '2. Italian market problem',
        title: 'The Italian market: what is actually going wrong',
        content: 'Fondir\'s revenue from Italy has been declining for a sustained period. The USD has strengthened significantly and permanently against the EUR. Because Fondir\'s production costs are in USD and Italian competitors\' costs are in EUR, Fondir must charge higher EUR prices to cover its USD cost base. This makes Fondir uncompetitive in the Italian market.\n\nThis is economic risk — not transaction risk. The key distinction is that it is a long-term permanent shift in the underlying exchange rate that affects Fondir\'s competitive position, not just a specific contract cash flow.\n\nShort-term derivatives cannot fix economic risk. The solution is strategic: set up a Eurozone production subsidiary, source materials in EUR, or withdraw from the Italian market.',
        warning: 'The most common error in part (a): candidates wrote about transaction risk. The examiner flagged this explicitly. If the question says revenue has been declining for a sustained period due to exchange rate shifts, that is economic risk every time. Transaction risk is about a specific contract.',
      },
      {
        id: 'lothil',
        navLabel: '3. The Lothil receipt',
        title: 'Hedging the Lothil Lira receipt',
        content: 'Fondir will receive LL357m from a customer in Lothil in 4 months. They need to convert LL to USD.\n\nKey data (verified from ACCA Model Answer Appendix 1):\n- Amount: LL357m receivable in 4 months\n- Spot rate: 84.00 LL per USD\n- USD rates: invest at 6.6% (base 6.0% + 0.6%), borrow at 5.4% (base 6.0% - 0.6%)\n- LL rates: invest at 3.0% (base 3.3% - 0.3%), borrow at 3.6% (base 3.3% + 0.3%)\n- OTC call option: strike 84.00 LL per USD, premium LL4 per USD1 of face value\n- Fondir borrows premium using its USD overdraft at 5.4%',
        warning: 'This is an OTC option — bespoke, not exchange-traded. There are NO standardised contracts. Do not calculate a number of contracts. Many candidates waste time calculating contracts for an OTC option. The amount hedged is the exact exposure.',
      },
      {
        id: 'ir',
        navLabel: '4. IR futures context',
        title: 'Interest rate futures: locking in the investment return',
        content: 'Fondir will receive $4,200,000 from the forward hedge and invest it for 5 months. They need to hedge against falling interest rates reducing their investment return.\n\nKey data (verified from ACCA Model Answer Appendix 2):\n- Investment amount: $4,200,000\n- Investment period: 5 months\n- Contract size: $500,000\n- Current futures price: 96.10\n- Current base rate: 3.30% (spot price 96.70; basis = 96.70 - 96.10 = 0.60)\n- Rate may rise or fall by 0.50%\n- Investment rate = base rate minus 0.30%\n- Unexpired basis at close-out: 2/6 x 0.60 = 0.20',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 6, requirement: 'Explain the forex exposure Fondir faces in the Italian market and suggest how it could be managed.' },
      { label: '(b)(i)', marks: 7, requirement: 'Calculate the USD receipt from the Lothil payment using both the OTC forward rate and the OTC call option.' },
      { label: '(b)(ii)', marks: 9, requirement: 'Calculate the interest earned on investing the USD proceeds using interest rate futures. Show outcomes under both rate scenarios.' },
      { label: '(b)(iii)', marks: 9, requirement: 'Comment on hedging results. Discuss alternative hedging methods for the Lothil receipt. Explain margin requirements.' },
      { label: '(b)(iv)', marks: 9, requirement: 'Discuss whether it would be beneficial for Fondir to manage its financial risks. Discuss whether it should communicate its risk management approach to stakeholders.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '85.00 LL/USD', description: 'OTC forward rate', source: 'A' },
      { value: '$4,200,000', description: 'OTC forward receipt', source: 'A' },
      { value: '$4,043,977', description: 'OTC call option receipt', source: 'A' },
      { value: '$59,500', description: 'IR futures locked-in return (both scenarios)', source: 'A' },
      { value: '14 contracts', description: 'Number of IR futures contracts', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Identify the Italian risk as economic, not transaction',
        explanation: 'Economic risk is the long-term impact on competitive position from a permanent exchange rate shift. Transaction risk is the short-term impact on a specific contract. The Italian revenue decline fits economic risk because it is sustained, structural, and cannot be fixed with a forward contract or option.',
      },
      {
        stepNumber: 2,
        title: 'OTC forward rate (verified)',
        explanation: 'Apply interest rate parity for 4 months (annual rates divided by 3). The period adjustment is where most marks are lost.',
        formula: 'Forward = 84.00 x (1 + 0.066/3) / (1 + 0.030/3)\n= 84.00 x 1.022 / 1.010\n= 85.00 LL per USD\n\nReceipt = LL357m / 85.00 = $4,200,000',
        verifiedNumbers: ['$4,200,000 — verified from ACCA Model Answer Appendix 1'],
      },
      {
        stepNumber: 3,
        title: 'OTC call option (verified)',
        explanation: 'Fondir receives LL and converts to USD. They want the right to sell LL at a fixed rate (buy USD at a fixed rate). That is a call option on USD.',
        formula: 'Gross receipt at strike 84.00: LL357m / 84.00 = $4,250,000\nPremium: $4,250,000 x LL4 = LL17,000,000 / 84.00 = $202,381\nInterest on borrowed premium: $202,381 x (1 + 0.054/3) = $206,023\nNet receipt: $4,250,000 - $206,023 = $4,043,977',
        verifiedNumbers: ['$4,043,977 — verified from ACCA Model Answer Appendix 1'],
      },
      {
        stepNumber: 4,
        title: 'IR futures (verified)',
        explanation: 'Fondir invests (deposits) money. Depositors buy futures. Number of contracts = investment amount divided by contract size, adjusted for the period ratio.',
        formula: 'Contracts = $4,200,000 / $500,000 x 5/3 = 14 contracts\nBasis = (100 - 3.30) - 96.10 = 0.60\nUnexpired basis at close-out = 2/6 x 0.60 = 0.20\n\nIf rates rise to 3.80%:\n  Interest: 3.50% x 5/12 x $4,200,000 = $61,250\n  Futures loss: (96.00 - 96.10)/100 x $500,000 x 3/12 x 14 = ($1,750)\n  Net = $59,500\n\nIf rates fall to 2.80%:\n  Interest: 2.50% x 5/12 x $4,200,000 = $43,750\n  Futures gain: (97.00 - 96.10)/100 x $500,000 x 3/12 x 14 = $15,750\n  Net = $59,500',
        verifiedNumbers: ['$59,500 locked-in return — verified from ACCA Model Answer Appendix 2', '14 contracts — verified from ACCA Model Answer Appendix 2'],
      },
    ],

    examinerFeedback: {
      didWell: 'Forward and futures calculations were mostly correct. Report format was generally followed. Most candidates earned communication marks.',
      commonErrors: 'Very few candidates identified economic risk in part (a). Almost everyone said transaction risk. Using annual interest rates without adjusting for the 4-month period was the most common calculation error. IR futures direction was often wrong.',
      tutorTip: 'Economic risk = the competitive position itself has shifted permanently. If the scenario says sales have been declining for years due to sustained exchange rate movements, write economic risk immediately and explain the strategic fix, not derivatives.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 4. MCKEEVER CO — Sep/Dec 2023 — Section A
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'mckeever',
    name: 'McKeever Co',
    session: 'Sep/Dec 2023',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['International NPV', 'Country risk', 'Exchange rates'],
    difficulty: 4,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The investment',
        title: 'What McKeever is doing',
        content: 'McKeever Co is a US company investing in Erat to manufacture and sell scientific instruments. 4-year project.\n\nKey data (verified from ACCA Model Answer Appendix):\n- Initial investment: £50,000,000\n- TAD: £4,500,000 per year (straight line, 4 years)\n- Sales contribution year 1: £9,625,000\n- Fixed costs: 5% of contribution\n- Working capital: 15% of revenue\n- Residual value year 4: £32,000,000 (land and buildings — government agrees to act as buyer of last resort)\n- Opening exchange rate: £/$ 3.31\n- US corporation tax rate: 25%\n- Eratian tax rate: 20%\n- Discount rate: 14%',
      },
      {
        id: 'exchange',
        navLabel: '2. Exchange rates',
        title: 'Exchange rate calculations',
        content: 'PPP-derived exchange rates for the project period (verified from ACCA Model Answer):\n- Year 0: £/$ 3.31\n- Year 1: 3.28\n- Year 2: 3.25\n- Year 3: 3.16\n- Year 4: 3.07\n\nThe marketing director proposes an alternative (weaker pound) scenario. This switches the NPV from positive to negative.',
        warning: 'The residual value of the land and buildings forms a large part of the total project NPV. If the government\'s agreement to act as buyer of last resort is withdrawn (country risk), the project value collapses. Always flag this when discussing country risk.',
      },
      {
        id: 'country',
        navLabel: '3. Country risk',
        title: 'Country risk in Erat',
        content: 'Erat has political instability. A recent opinion poll shows the governing party losing support shortly after the last election. Key risks to the project:\n\n- Government could withdraw the residual value guarantee on land and buildings\n- Tax regime could change or become unfavourable\n- Remittance restrictions could be reintroduced\n- Political instability could affect operations\n\nThe CEO wants to add a risk premium to the discount rate. The question asks whether this is correct.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 10, requirement: 'Calculate the NPV of the investment in Erat using the home currency approach.' },
      { label: '(b)', marks: 12, requirement: 'Assess country risk in Erat and whether the discount rate should be adjusted for it.' },
      { label: '(c)', marks: 8, requirement: 'Calculate NPV under the alternative exchange rate assumption. Discuss the marketing director\'s concerns.' },
      { label: '(d)', marks: 10, requirement: 'Evaluate non-financial factors relevant to the overseas investment decision.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$1,061,000', description: 'Base case NPV (verified)', source: 'A' },
      { value: '-$513,000', description: 'NPV under alternative exchange rate (verified)', source: 'A' },
      { value: '£/$ 3.31 to 3.07', description: 'Exchange rate range years 0-4 (verified)', source: 'A' },
      { value: '14%', description: 'Discount rate', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Home currency NPV method',
        explanation: 'Calculate cash flows in GBP first. Tax Eratian profits at 20%. Add the component contribution from the US parent company. Convert each year to USD using PPP exchange rates. Apply additional US tax at 5% (25% US rate minus 20% Eratian credit = 5% on Eratian taxable profits). Discount at 14%.',
        formula: 'Contribution year 1: £9,625,000\nFixed costs (5%): £(481,250)\nTAD: £(4,500,000)\nTaxable profit: £4,643,750\nTax (20%): £(928,750)\nAdd back TAD: £4,500,000\n...\nNPV = $1,061,000',
        verifiedNumbers: ['$1,061,000 — verified from ACCA Model Answer Dec 2023'],
      },
      {
        stepNumber: 2,
        title: 'Alternative exchange rate scenario',
        explanation: 'Under the weaker pound assumption (rates move from 3.31 to 3.50 by year 4, not 3.07), the NPV switches from positive $1.1m to negative -$513,000. This is a significant swing and shows how sensitive the project is to exchange rate assumptions.',
        verifiedNumbers: ['-$513,000 — verified from ACCA Model Answer Dec 2023'],
      },
      {
        stepNumber: 3,
        title: 'Country risk discussion',
        explanation: 'FX risk may be diversifiable (shareholders can hold global portfolios). Political risk has a positive correlation across countries and is less diversifiable. A risk premium adjustment for political risk is more defensible than for FX risk. The real risk here is the residual value guarantee — without it, the NPV becomes deeply negative.',
      },
    ],

    examinerFeedback: {
      didWell: 'Core NPV structure was solid. Home currency method was applied correctly by most candidates.',
      commonErrors: 'Country risk discussion was too generic. Most candidates listed types of country risk without applying them to the McKeever and Erat scenario specifically. Remittance restriction treatment was frequently wrong or missed.',
      tutorTip: 'Country risk earns marks when you name the specific risk for this country, say what it does to these cash flows, and suggest what management could do about it. "There is political risk" earns nothing. "The government could withdraw the residual value guarantee, which would remove the largest component of the year 4 cash flow and make NPV sharply negative" earns marks.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 5. MAHONEY CO — Mar/Jun 2024 — Section A
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'mahoney',
    name: 'Mahoney Co',
    session: 'Mar/Jun 2024',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['Multilateral netting', 'Forex swap', 'Currency option', 'NPV'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'netting',
        navLabel: '1. Group netting',
        title: 'Mahoney group multilateral netting',
        content: 'Mahoney Co group has four entities: Mahoney Co, Imran Co, Oliviera Co, Yves Co.\n\nExchange rates (verified from ACCA Model Answer):\n- CAD/EUR: 1.3100\n- PKR/EUR: 218.1692\n- BRL/EUR: 5.2131\n\nNet settlement results (verified):\n- Mahoney Co: net receivable +€14.6m\n- Yves Co: net payable -€147.0m\n- Imran Co: net payable -€82.4m\n- Oliviera Co: net receivable +€214.8m',
        table: {
          headers: ['Entity', 'Net position (EUR m)'],
          rows: [
            ['Mahoney Co', '+14.6 (receives)'],
            ['Yves Co', '-147.0 (pays)'],
            ['Imran Co', '-82.4 (pays)'],
            ['Oliviera Co', '+214.8 (receives)'],
          ],
          highlightLastRow: false,
        },
      },
      {
        id: 'amasia',
        navLabel: '2. Amasian project',
        title: 'The Amasian regeneration project',
        content: 'Mahoney is evaluating a 3-year port regeneration project in Amasia. The USD is depreciating significantly over the project period.\n\nKey data (verified from ACCA Model Answer):\n- Initial investment: $1,800m (EUR equivalent at swap rate)\n- Net operating fee: $90m year 1, $92m year 2, $94m year 3\n- Transfer proceeds at year 3: $2,900m\n- Discount rate: 16%\n\nHedging options:\n- Currency swap: NPV = -€1m (barely negative)\n- Currency option: NPV = -€15m (significantly worse due to premium)',
        warning: 'Both hedging methods produce a negative NPV. The option is much worse because of the premium cost. Despite the swap giving a better result, neither makes the project financially acceptable on its own. Candidates who spend time recommending the better method without noting the project is still NPV-negative lose commercial acumen marks.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 7, requirement: 'Discuss protectionist measures and the benefits of Amasia joining a customs union.' },
      { label: '(b)(i)', marks: 7, requirement: 'Use multilateral netting to calculate net intra-group settlements.' },
      { label: '(b)(ii)', marks: 6, requirement: 'Calculate EUR receipt from Oliviera disposal using forward contract and currency futures.' },
      { label: '(b)(iii)', marks: 5, requirement: 'Discuss results and advantages and disadvantages of multilateral netting.' },
      { label: '(b)(iv)', marks: 5, requirement: 'Calculate NPV of Amasian project using currency swap and currency option.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '+€14.6m', description: 'Mahoney net receivable', source: 'A' },
      { value: '-€147.0m', description: 'Yves net payable', source: 'A' },
      { value: '-€1m', description: 'Amasian project NPV with currency swap', source: 'A' },
      { value: '-€15m', description: 'Amasian project NPV with currency option', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Multilateral netting matrix',
        explanation: 'Convert all intra-group balances to EUR using mid-rates. Build the payable/receivable matrix. Sum rows and columns. Net = receivable minus payable. Apply the verified results: Mahoney +€14.6m, Yves -€147.0m, Imran -€82.4m, Oliviera +€214.8m.',
        verifiedNumbers: ['Net positions verified from ACCA Model Answer MJ 2024'],
      },
      {
        stepNumber: 2,
        title: 'Currency swap vs option for Amasian project',
        explanation: 'Currency swap: agreed exchange rate protects the year 3 transfer proceeds from USD depreciation. NPV = -€1m. Option: premium significantly reduces the year 3 cash flow. NPV = -€15m. Swap is better but the project remains barely negative under the swap. The operating fee could increase if Amasia joins a customs union and trade volumes rise — this is the key scepticism point.',
        verifiedNumbers: ['-€1m swap NPV and -€15m option NPV — verified from ACCA Model Answer'],
      },
    ],

    examinerFeedback: {
      didWell: 'Netting matrix structure was mostly correct. Most candidates followed the right approach.',
      commonErrors: 'Scepticism marks almost never awarded. Candidates accepted all scenario numbers without questioning feasibility. Commercial acumen marks missed because candidates did not engage with the Amasian economic context (customs union impact on port volumes).',
      tutorTip: 'To earn scepticism marks, challenge at least one specific input. The operating fee is based on port traffic volume. If the customs union increases trade through the port, the fee could increase significantly. That is one developed challenge that earns the mark.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 6. GARNOD CO — Mar/Jun 2024 — Section B
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'garnod',
    name: 'Garnod Co (Pilsur / Marhew)',
    session: 'Mar/Jun 2024',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['FCFE valuation', 'M&A', 'Takeover defence'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Garnod Co considering two acquisition targets',
        content: 'Garnod Co is an education business considering acquiring either Pilsur Co or Marhew Co. Garnod also fears a counter-bid from a third party.\n\nKey data (verified from ACCA Model Answer):\n- Garnod equity value: $480m (FCFE multiple of 8 applied to $60m annual FCFE)\n- Pilsur Co: cost of equity 15%, annual FCFE $70m growing at 1.5%',
        warning: 'Part (a) asks you to analyse the suitability of BOTH targets. It does NOT ask you to recommend which one to acquire. Many candidates recommended one over the other and wasted time. Read the requirement before writing anything.',
      },
      {
        id: 'valuation',
        navLabel: '2. Valuation results',
        title: 'Verified bid range calculations',
        content: 'All numbers verified from ACCA Model Answer MJ 2024:\n\n- Garnod equity value: $480m\n- Pilsur FCFE valuation: $526.3m\n- Combined company value: $1,167.6m\n- Additional value created: $161.3m\n- Minimum acceptable price to Pilsur shareholders: $615.6m ($6.156 per share)\n- Target price for Garnod (60% of gains to Garnod): $590.8m ($5.908 per share)\n- If minimum price offered: gains accruing to Garnod shareholders = $72m (44.6% of total gains)',
        table: {
          headers: ['Item', 'Value (verified)'],
          rows: [
            ['Garnod equity value', '$480m'],
            ['Pilsur FCFE valuation', '$526.3m'],
            ['Combined company value', '$1,167.6m'],
            ['Additional value created', '$161.3m'],
            ['Min price for Pilsur shareholders', '$615.6m'],
            ['Garnod gains at minimum price', '$72m (44.6%)'],
          ],
          highlightLastRow: false,
        },
      },
    ],

    questionParts: [
      { label: '(a)', marks: 6, requirement: 'Analyse the suitability of Pilsur Co and Marhew Co as possible takeover targets for Garnod Co.' },
      { label: '(b)', marks: 9, requirement: 'Calculate minimum and target bid prices using FCFE valuation.' },
      { label: '(c)', marks: 5, requirement: 'Advise Garnod on defensive strategies it could use against a counter-bid.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$480m', description: 'Garnod equity value', source: 'A' },
      { value: '$526.3m', description: 'Pilsur FCFE valuation', source: 'A' },
      { value: '$1,167.6m', description: 'Combined company value', source: 'A' },
      { value: '$161.3m', description: 'Additional value created', source: 'A' },
      { value: '$615.6m', description: 'Min price for Pilsur shareholders', source: 'A' },
      { value: '$72m (44.6%)', description: 'Garnod shareholders\' gain at min price', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'FCFE valuation of Pilsur (verified)',
        explanation: 'ke = 3.8% + (1.4 x 8%) = 15%. FCFE perpetuity with growth: $70m x 1.015 / (0.15 - 0.015) = $526.3m. Combined value = 8 x 1.05 x ($60m + $70m + $9m synergies) = $1,167.6m. Additional value = $1,167.6m - $480m - $526.3m = $161.3m.',
        formula: 'Pilsur ke = 3.8% + (1.4 x 8%) = 15%\nPilsur FCFE value = $70m x 1.015 / (0.15 - 0.015) = $526.3m\nCombined value = 8 x 1.05 x ($60 + $70 + $9m) = $1,167.6m\nAdditional value = $1,167.6m - $480m - $526.3m = $161.3m',
        verifiedNumbers: ['All numbers verified from ACCA Model Answer MJ 2024'],
      },
    ],

    examinerFeedback: {
      didWell: 'Suitability analysis in part (a) was well answered. Most candidates evaluated both companies without favouring one.',
      commonErrors: 'Many candidates recommended which company to acquire, which the question did not ask. Others listed generic acquisition criteria without applying them to the Pilsur or Marhew scenario data.',
      tutorTip: 'Suitability means evaluate both companies against specific criteria from the scenario. Not rank them or pick one. Apply every criterion you raise to both companies using their actual scenario data.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 7. NORTHNEY CO — Sep/Dec 2024 — Section A
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'northney',
    name: 'Northney Co',
    session: 'Sep/Dec 2024',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['Treasury function', 'Forex futures', 'IR collar'],
    difficulty: 4,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'treasury',
        navLabel: '1. Treasury function',
        title: 'Northney group treasury',
        content: 'Northney Co is a US-based group relocating its treasury function to Europe. The question covers both the strategic treasury issues (relocation, control, subsidiary autonomy) and the technical hedging calculations.',
      },
      {
        id: 'hedging',
        navLabel: '2. Hedging data',
        title: 'The hedging transactions (verified numbers)',
        content: 'All numbers verified from ACCA Model Answer SD 2024:\n\nCurrency futures (JPY receipt):\n- Exposure: JPY 925m\n- Contract size: JPY 12.5m\n- Opening basis: spot 0.007398 minus futures 0.007538 = -0.000140\n- Contracts: 74\n- Lock-in rate: 0.007510\n- Receipt: USD 6.95m\n\nIR collar (USD 54m loan):\n- Buy March call options at 97.00 (premium 0.492%)\n- Sell March put options at 96.25 (premium 0.356%)\n- Contracts: 108\n- Net premium: $36,720\n- Current base rate: 3.25%\n- Current futures price: 96.54',
        table: {
          headers: ['Hedge', 'Contracts', 'Key result'],
          rows: [
            ['JPY currency futures', '74', 'Receipt USD 6.95m'],
            ['IR collar (buy cap, sell floor)', '108', 'Net premium $36,720'],
          ],
        },
        warning: 'IR collar direction: the call option (cap) protects against rates rising above 97.00. When rates RISE, the futures price FALLS. If it falls below 97.00, exercise the call. If rates FALL, the futures price RISES above 96.25, and the counterparty exercises the put. You are caught between the two strikes.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 8, requirement: 'Discuss the role and structure of the group treasury function and implications of relocation to Europe.' },
      { label: '(b)', marks: 14, requirement: 'Calculate intra-group netting results, JPY currency futures hedge, and IR collar.' },
      { label: '(c)', marks: 8, requirement: 'Assess the political and operational risks of establishing a new subsidiary in the suggested country.' },
      { label: '(d)', marks: 10, requirement: 'Recommend on treasury risk policy for Northney going forward.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '74 contracts', description: 'JPY currency futures contracts', source: 'A' },
      { value: '0.007510', description: 'Lock-in rate for JPY futures', source: 'A' },
      { value: 'USD 6.95m', description: 'Receipt from JPY currency futures', source: 'A' },
      { value: '108 contracts', description: 'IR collar contracts', source: 'A' },
      { value: '$36,720', description: 'Net IR collar premium', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'JPY currency futures (verified)',
        explanation: 'Receiving JPY so sell JPY June futures. Contracts = JPY 925m / JPY 12.5m = 74. Opening basis = 0.007398 - 0.007538 = -0.000140. Unexpired basis = 2/10 x -0.000140 at settlement. Lock-in rate = futures price + unexpired basis = 0.007510.',
        formula: 'Contracts = JPY 925m / JPY 12.5m = 74\nOpening basis = 0.007398 - 0.007538 = -0.000140\nLock-in rate = 0.007538 + (2/10 x -0.000140) = 0.007510\nReceipt = JPY 12.5m x 74 x 0.007510 = USD 6.95m',
        verifiedNumbers: ['USD 6.95m — verified from ACCA Model Answer SD 2024'],
      },
      {
        stepNumber: 2,
        title: 'IR collar (verified)',
        explanation: 'Buy 108 March call options at 97.00 (0.492%). Sell 108 March put options at 96.25 (0.356%). Contracts = $54m / $1m x 6/3 = 108. Net premium = (0.00492 - 0.00356) x $1m x 3/12 x 108 = $36,720.',
        formula: 'Contracts = $54m / $1m x 6/3 = 108\nNet premium = (0.00492 - 0.00356) x $1,000,000 x 3/12 x 108 = $36,720',
        verifiedNumbers: ['108 contracts and $36,720 premium — verified from ACCA Model Answer SD 2024'],
      },
    ],

    examinerFeedback: {
      didWell: 'Forex calculations were generally strong. Treasury function narrative was reasonable.',
      commonErrors: 'IR collar direction errors were common. Many confused which option gets exercised when rates rise versus fall. Policy recommendations were generic with no connection to Northney\'s specific situation.',
      tutorTip: 'IR collar memory: the cap (call option you bought) kicks in when rates rise above the cap strike. The floor (put option you sold) kicks in when rates fall below the floor strike. Between the two strikes, no option is exercised and you pay market rate.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 8. MORTEXA / YEKKON CO — Sep/Dec 2024 — Section B
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'mortexa',
    name: 'Mortexa / Yekkon Co',
    session: 'Sep/Dec 2024',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['M&A', 'P/E valuation', 'Shareholder value', 'Competition law'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The deal',
        title: 'Mortexa acquiring Yekkon in a share-for-share deal',
        content: 'Mortexa Co is a large supermarket proposing to acquire Yekkon Co, a smaller supermarket, via a share-for-share exchange.\n\nKey data (verified from ACCA Model Answer):\n- Mortexa share price: $8.22, shares outstanding: 800m\n- Mortexa market value: $6,576m\n- Mortexa P/E ratio: 12 (derived)\n- Mortexa earnings: $548m\n- Yekkon earnings: $135m\n- Annual synergies: $27m\n- Post-acquisition P/E multiple: 13.2 (12 x 1.1)\n- Share-for-share exchange ratio: 2 Mortexa shares for 3 Yekkon shares',
        table: {
          headers: ['Item', 'Value (verified)'],
          rows: [
            ['Mortexa market value', '$6,576m'],
            ['Mortexa P/E ratio', '12'],
            ['Yekkon P/E valuation', '$1,620m'],
            ['Post-acquisition combined value', '$9,372m'],
            ['Additional value created', '$1,176m'],
            ['Mortexa shareholder gain', '3.6%'],
            ['Yekkon shareholder gain', '57.8%'],
          ],
        },
        warning: 'The 57.8% gain for Yekkon shareholders is much larger than the 3.6% gain for Mortexa shareholders. This is because the acquisition premium is generous. Mortexa\'s shareholders may view this as too generous. The examiner expects candidates to notice this imbalance and comment on it.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 10, requirement: 'Calculate the shareholder value gains for Mortexa and Yekkon shareholders from the acquisition.' },
      { label: '(b)', marks: 5, requirement: 'Discuss the likely reaction of both sets of shareholders to the proposed deal.' },
      { label: '(c)', marks: 5, requirement: 'Discuss practical competition regulation issues that could affect the acquisition.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$6,576m', description: 'Mortexa market value', source: 'A' },
      { value: 'P/E = 12', description: 'Mortexa P/E ratio', source: 'A' },
      { value: '$9,372m', description: 'Post-acquisition combined value', source: 'A' },
      { value: '$1,176m', description: 'Additional value created', source: 'A' },
      { value: '3.6%', description: 'Mortexa shareholder gain', source: 'A' },
      { value: '57.8%', description: 'Yekkon shareholder gain', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Valuation and shareholder gains (verified)',
        explanation: 'Mortexa market value = $8.22 x 800m = $6,576m. P/E = $6,576m / $548m = 12. Yekkon = 12 x $135m = $1,620m. Post-acquisition: earnings = $710m, P/E = 13.2, value = $9,372m. Additional value = $1,176m.',
        formula: 'Mortexa market value = $8.22 x 800m = $6,576m\nP/E = $6,576m / $548m = 12\nYekkon valuation = 12 x $135m = $1,620m\nPost-acq earnings = $548m + $135m + $27m = $710m\nPost-acq P/E = 12 x 1.1 = 13.2\nCombined value = 13.2 x $710m = $9,372m\nAdditional value = $9,372m - $6,576m - $1,620m = $1,176m',
        verifiedNumbers: ['All numbers verified from ACCA Model Answer SD 2024'],
      },
      {
        stepNumber: 2,
        title: 'Share-for-share exchange gains (verified)',
        explanation: 'New Mortexa shares to Yekkon = 450m x 2/3 = 300m. Total shares = 1,100m. Post-acq Mortexa shareholder wealth = $9,372m x 800/1,100 = $6,816m. Gain = 3.6%. Yekkon = $9,372m x 300/1,100 = $2,556m. Gain = 57.8%.',
        verifiedNumbers: ['3.6% and 57.8% gains — verified from ACCA Model Answer SD 2024'],
      },
    ],

    examinerFeedback: {
      didWell: 'Combined value calculations were mostly correct. Most candidates calculated shareholder gains reasonably.',
      commonErrors: 'Competition discussion was almost entirely generic with no use of scenario data. Candidates wrote about competition law in the abstract rather than applying it to supermarkets and the specific market share data given.',
      tutorTip: 'If the scenario gives you market share numbers, use them. "The combined group would control X% of the grocery market in this region" is the specific statement that earns marks. Generic competition law discussion does not.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 9. KAMPAI / SKAL CO — Mar/Jun 2025 — Section A
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'kampai',
    name: 'Kampai / Skal Co',
    session: 'Mar/Jun 2025',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['P/E valuation', 'Cash vs share offer', 'Sustainability', 'FCFE'],
    difficulty: 4,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'companies',
        navLabel: '1. The companies',
        title: 'Kampai Co acquiring Skal Co',
        content: 'Kampai Co is a listed company in the logistics machinery industry. It has been growing through acquisitions. It wants to acquire Skal Co, a large unlisted company.\n\nKampai Co data (verified from ACCA Model Answer):\n- Share price: $4\n- Shares outstanding: 225m\n- Earnings: $50m\n- P/E ratio: 18\n\nSkal Co data (verified from ACCA Model Answer):\n- Shares outstanding: 40m\n- Annual FCF (to firm): $23.14m growing at 4%\n- WACC: 11%\n- Debt: $80m\n- Standalone equity value: $263.8m ($6.60 per share)\n- Synergies (post-tax): $4.8m per year\n- Recently established factory value: $42.3m',
      },
      {
        id: 'offers',
        navLabel: '2. The two offers',
        title: 'Cash offer vs share-for-share offer',
        content: 'Two offers are on the table:\n\nCash offer: $8 per Skal share\nShare-for-share: to be structured so gains are split evenly\n\nVerified results from ACCA Model Answer:\n- Additional equity value from acquisition: $174.5m\n- Cash offer: Skal gains 21.2%, Kampai gains 13.2%\n- Share-for-share: Skal gains 33.0%, Kampai gains 9.8%\n- Shares allocated to Skal: 80m Kampai shares (2-for-1 ratio)',
        table: {
          headers: ['Offer type', 'Skal gain', 'Kampai gain'],
          rows: [
            ['Cash ($8/share)', '21.2%', '13.2%'],
            ['Share-for-share', '33.0%', '9.8%'],
          ],
        },
        warning: 'The cash offer gives Skal only 21.2%, which is below the required minimum premium of 25%. Kampai needs to either raise the cash offer (creating more financial pressure) or use the share-for-share offer which does meet the threshold. Missing this comparison loses easy marks.',
      },
      {
        id: 'factory',
        navLabel: '3. Factory closure',
        title: 'The factory closure and sustainability',
        content: 'Post-acquisition, Kampai plans to close a factory. This has generated negative press coverage. Two directors suggested either not closing the factory or not proceeding with the acquisition at all.\n\nPart (vi) asks you to discuss the ethical and sustainability concerns and respond to the directors\' suggestions directly. The examiner noted that very few candidates addressed those director suggestions, which cost marks.',
      },
    ],

    questionParts: [
      { label: '(i)', marks: 8, requirement: 'Calculate Kampai P/E ratio and the additional equity value generated from acquiring Skal Co.' },
      { label: '(ii)', marks: 4, requirement: 'Estimate percentage gain in shareholder wealth for both sets of shareholders under the cash offer.' },
      { label: '(iii)', marks: 7, requirement: 'Estimate shares allocated and gains under the share-for-share offer.' },
      { label: '(iv)', marks: 7, requirement: 'Discuss acceptability of both offers and assumptions in the valuation.' },
      { label: '(v)', marks: 7, requirement: 'Discuss financial issues Kampai faces if acquiring by cash and whether a mixed offer is better.' },
      { label: '(vi)', marks: 7, requirement: 'Discuss ethical and sustainability issues including the factory closure and respond to directors who suggested not proceeding.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: 'P/E = 18', description: 'Kampai P/E ratio', source: 'A' },
      { value: '$263.8m', description: 'Skal standalone equity value', source: 'A' },
      { value: '$174.5m', description: 'Additional equity value from acquisition', source: 'A' },
      { value: '21.2% / 13.2%', description: 'Cash offer: Skal / Kampai gains', source: 'A' },
      { value: '33.0% / 9.8%', description: 'Share-for-share: Skal / Kampai gains', source: 'A' },
      { value: '80m shares (2-for-1)', description: 'Shares allocated to Skal shareholders', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'P/E ratio and Skal valuation (verified)',
        explanation: 'Kampai P/E = $4 / ($50m / 225m shares) = 18. Skal FCF to firm = $26.3m + $16.2m - $14.1m - (20% x $26.3m) = $23.14m. Company value = $23.14m x 1.04 / (0.11 - 0.04) = $343.8m. Equity value = $343.8m - $80m = $263.8m ($6.60/share). Post-acq: earnings after synergies = $22m. Post-acq equity value = $22m x 18 + $42.3m = $438.3m. Additional value = $438.3m - $263.8m = $174.5m.',
        formula: 'Kampai P/E = $4 / ($50m / 225m) = 18\nSkal FCF = $26.3m + $16.2m - $14.1m - (0.2 x $26.3m) = $23.14m\nSkal company value = $23.14m x 1.04 / (0.11 - 0.04) = $343.8m\nSkal equity value = $343.8m - $80m = $263.8m\nPost-acq earnings = $17.2m + $4.8m = $22m\nPost-acq equity value = $22m x 18 + $42.3m = $438.3m\nAdditional value = $438.3m - $263.8m = $174.5m',
        verifiedNumbers: ['All numbers verified from ACCA Model Answer MJ 2025'],
      },
      {
        stepNumber: 2,
        title: 'Cash offer gains (verified)',
        explanation: 'Skal gain = ($8 - $6.60) / $6.60 = 21.2%. Kampai gain: value to Skal = ($8 - $6.60) x 40m = $56m. Remaining for Kampai = $174.5m - $56m = $118.5m. Kampai per share gain = $118.5m / 225m = $0.527. Kampai % gain = $0.527 / $4 = 13.2%.',
        verifiedNumbers: ['21.2% Skal and 13.2% Kampai — verified from ACCA Model Answer MJ 2025'],
      },
      {
        stepNumber: 3,
        title: 'Share-for-share offer (verified)',
        explanation: 'Equal split: each party gets 50% x $174.5m = $87.25m. Kampai post-acq value = $900m + $87.25m = $987.25m. Post-acq price = $987.25m / 225m = $4.39. Skal shares = ($263.8m + $87.25m) / $4.39 = 80m Kampai shares. Ratio = 2-for-1. Skal gain = (2 x $4.39 - $6.60) / $6.60 = 33.0%. Kampai gain = ($4.39 - $4) / $4 = 9.8%.',
        verifiedNumbers: ['80m shares, 33.0% and 9.8% gains — verified from ACCA Model Answer MJ 2025'],
      },
    ],

    examinerFeedback: {
      didWell: 'P/E ratio and free cash flow valuation were done well. Communication marks generally earned.',
      commonErrors: 'Share-for-share calculation in part (iii) was the weakest section. Many failed to split gains evenly or calculate shares issued correctly. Sustainability discussion barely mentioned the factory closure or the directors\' suggestions.',
      tutorTip: 'For any share offer question: set up a table with pre-merger values, combined value, shares issued, post-merger price, and percentage gains. Clear structure means partial credit even if one step has an arithmetic error.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 10. SOHBET CO — Mar/Jun 2025 — Section B
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'sohbet',
    name: 'Sohbet Co',
    session: 'Mar/Jun 2025',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['IR futures', 'IR options', 'OTC vs exchange-traded'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Sohbet Co investing $54m for 4 months',
        content: 'Sohbet Co is selling a building and investing the $54m proceeds for 4 months starting 1 August. The directors expect interest rates to fall, reducing their investment return. They want to hedge.\n\nKey data (verified from ACCA Model Answer):\n- Investment amount: $54m\n- Investment period: 4 months (starting 1 August)\n- Current central bank base rate: 4.5%\n- Expected fall: to 3.8%\n- September futures price: 96.04\n- Contract size: $500,000\n- Call options: strike 96.00, premium 0.193%\n- Required minimum return: 4% annualised\n\nVerified results:\n- Futures: net return $691,200, effective rate 3.84%\n- Options: net return $663,660, effective rate 3.69%\n- Recommendation: futures preferred',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 12, requirement: 'Calculate the result of hedging using interest rate futures and interest rate options if the base rate falls to 3.8%.' },
      { label: '(b)', marks: 8, requirement: 'Discuss results and advise whether Sohbet should consider other hedging choices including FRAs.' },
      { label: '(c)', marks: 5, requirement: 'Compare the advantages of OTC options with exchange-traded options for Sohbet.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '144 contracts', description: 'Number of futures / options contracts', source: 'A' },
      { value: '$691,200', description: 'Net return under IR futures', source: 'A' },
      { value: '3.84%', description: 'Effective annual rate (futures)', source: 'A' },
      { value: '$663,660', description: 'Net return under IR options', source: 'A' },
      { value: '3.69%', description: 'Effective annual rate (options)', source: 'A' },
      { value: 'Futures preferred', description: 'Verified recommendation', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'IR futures (verified)',
        explanation: 'Sohbet invests (deposits) so buy futures. Contracts = $54m / $500,000 x 4/3 = 144. Basis = (100 - 4.50) - 96.04 = -0.54. Unexpired basis at 1 August = 2/6 x -0.54 = -0.18.',
        formula: 'Contracts = $54m / $500,000 x 4/3 = 144\nBasis = (100 - 4.50) - 96.04 = -0.54\nUnexpired basis = 2/6 x -0.54 = -0.18\n\nIf rates fall to 3.80%:\n  Investment return: $54m x 3.5% x 4/12 = $630,000\n  Expected futures price: 100 - 3.80 - (-0.18) = 96.38\n  Futures profit: (96.38 - 96.04)/100 x $500,000 x 3/12 x 144 = $61,200\n  Net return: $630,000 + $61,200 = $691,200\n  Effective rate: $691,200 / $54m x 12/4 = 3.84%',
        verifiedNumbers: ['$691,200 and 3.84% — verified from ACCA Model Answer MJ 2025'],
      },
      {
        stepNumber: 2,
        title: 'IR options (verified)',
        explanation: 'Buy 144 September call options at strike 96.00. If rates fall to 3.80%, expected futures price 96.38 is above strike 96.00, so exercise. Gain = (96.38 - 96.00)/100 x $500,000 x 3/12 x 144 = $68,400. Premium = 0.00193 x $500,000 x 3/12 x 144 = $34,740. Net return = $630,000 + $68,400 - $34,740 = $663,660. Effective rate = 3.69%.',
        verifiedNumbers: ['$663,660 and 3.69% — verified from ACCA Model Answer MJ 2025'],
      },
      {
        stepNumber: 3,
        title: 'Recommendation and alternatives (verified)',
        explanation: 'Futures are preferred: the predicted outcome is much closer to the 4% target and the range of outcomes is more limited. Options are worse due to the premium. An FRA could provide certainty at potentially better terms and should be investigated before committing to futures.',
        verifiedNumbers: ['Recommendation verified from ACCA Model Answer MJ 2025'],
      },
    ],

    examinerFeedback: {
      didWell: 'Futures calculations were generally correct. Most candidates correctly identified that depositors buy futures.',
      commonErrors: 'OTC vs exchange-traded comparison in part (c) was too brief. Most gave one point per method without comparing them head-to-head on specific dimensions. Commercial acumen marks rarely awarded.',
      tutorTip: 'Compare OTC vs exchange-traded on four specific dimensions: flexibility (tailoring to exact amount and date), counterparty risk (OTC has it, exchange-traded does not), liquidity (exchange-traded is much higher), and cost (OTC is often more expensive). For each dimension, say which is better AND why it matters for Sohbet specifically.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 11. JOSHUA / FRASER CO — Mar/Jun 2023 — Section A
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'joshua',
    name: 'Joshua / Fraser Co',
    session: 'Mar/Jun 2023',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['M&A', 'Agency conflict', 'FCFE valuation', 'Takeover defence'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Joshua Co: acquisition as a takeover defence',
        content: 'Joshua Co fears being the target of a hostile takeover. Its board proposes acquiring Fraser Co as a defensive strategy. A previous offer for Fraser Co had been rejected as value-destroying. Joshua Co has liquidity issues.\n\nFraser Co has a founder-majority-shareholder. Required minimum premium: 35%.\n\nVerified results from ACCA Model Answer:\n- Joshua equity value post-acquisition: $179.2m\n- Additional value created: $21.2m\n- Fraser shareholders: equity gain 37.1%, dividend income falls 34.4%\n- Joshua shareholders: equity gain 0.3%, dividend income rises 3.7%',
        warning: 'Part (a) asks about agency conflict arising from the takeover defence strategy. Board members may be protecting their own jobs. Shareholders must assess whether the acquisition genuinely creates value or serves management interests. This is a classic agency problem.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 9, requirement: 'Discuss the agency conflict arising from Joshua board\'s takeover defence strategy and how it could be mitigated.' },
      { label: '(b)(i)', marks: 8, requirement: 'Estimate the additional value created from acquiring Fraser Co using FCFE.' },
      { label: '(b)(ii)', marks: 6, requirement: 'Evaluate impact on shareholder wealth for both sets of shareholders.' },
      { label: '(b)(iii)', marks: 7, requirement: 'Analyse assumptions and assess credibility of the calculations.' },
      { label: '(b)(iv)', marks: 10, requirement: 'Discuss concerns likely to be raised by both sets of shareholders.' },
      { label: 'Professional skills', marks: 10, requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$179.2m', description: 'Joshua equity value post-acquisition', source: 'A' },
      { value: '$21.2m', description: 'Additional value created', source: 'A' },
      { value: '37.1%', description: 'Fraser shareholders equity gain', source: 'A' },
      { value: '-34.4%', description: 'Fraser founder dividend income change', source: 'A' },
      { value: '0.3%', description: 'Joshua shareholders equity gain', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Agency conflict in the defence strategy',
        explanation: 'Board members fear for their own jobs if a hostile bid succeeds. Takeover threats are an important governance mechanism that aligns management with shareholder interests. By defending, the board may be acting in their own interest rather than shareholders. Mitigation: transparent communication of a clear strategic rationale that convinces shareholders this creates value.',
      },
      {
        stepNumber: 2,
        title: 'Shareholder gains analysis (verified)',
        explanation: 'Additional value created = $21.2m. Fraser shareholders get 37.1% equity gain (above the 35% minimum). Joshua shareholders gain only 0.3%. The bulk of additional value goes to Fraser shareholders. Fraser\'s founder, despite the equity gain, sees dividend income fall 34.4% — they may oppose the deal on these grounds.',
        verifiedNumbers: ['$179.2m, $21.2m, 37.1%, 0.3% — verified from ACCA Model Answer MJ 2023'],
      },
    ],

    examinerFeedback: {
      didWell: 'Strategic agency conflict discussion was generally good. Most candidates understood the defensive rationale.',
      commonErrors: 'Assumptions discussion was weak and too brief. Ethics discussion was not connected to the Joshua scenario specifically.',
      tutorTip: 'Bid range: state the minimum price (floor below which Fraser shareholders reject) and maximum price (above which Joshua destroys its own value). Then say where the offer should land and why, in one or two sentences.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 12. PRYSOR CO — Mar/Jun 2021 — Section A
  // Source: Question Pack (OCR verified)
  // ─────────────────────────────────────────────
  {
    id: 'prysor',
    name: 'Prysor Co',
    session: 'Mar/Jun 2021',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['International NPV', 'Sensitivity', 'Duration', 'WTO', 'ESG'],
    difficulty: 4,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The investment',
        title: 'Prysor Co investing in Elan',
        content: 'Prysor Co is a multinational based in Marteg (currency M$). Considering establishing a subsidiary in Elan (currency ED) to manufacture a new mobile phone. 4-year investment horizon.\n\nKey data (verified from Question Pack):\n- Sales: 50,000 / 65,000 / 83,000 / 90,000 units\n- Unit price: ED160 year 1, +5% per year\n- Component transfer price: M$7 per unit year 1 (increases with Marteg inflation)\n- Non-current assets: ED14,460,000\n- Tax: 20% in Elan (exempt years 1-2), 30% in Marteg, bilateral tax treaty\n- Inflation: Elan 6%/4%/3%/3%, Marteg 10%/9%/8%/7%\n- Opening exchange rate: ED2.6000 = M$1\n- Discount rate: 14%',
      },
      {
        id: 'ethics',
        navLabel: '2. CFFP concern',
        title: 'The Campaign for Fair Production',
        content: 'The CFFP is a global lobbying organisation demanding better treatment of workers in Elan. They have called for Prysor to adopt their charter, which includes requirements on wages, education, environment, and banning child labour.\n\nIf Prysor does not adopt the charter, the CFFP may organise boycotts. Part (c) asks you to discuss whether and to what extent Prysor should adopt the charter as part of its investment policy framework.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 4, requirement: 'Explain the WTO role and assess implications for Prysor of the free trade agreement between Elan and Marteg.' },
      { label: '(b)(i)', marks: 17, requirement: 'Calculate NPV of the investment in Elan.' },
      { label: '(b)(ii)', marks: 5, requirement: 'Discuss key assumptions in the NPV.' },
      { label: '(b)(iii)', marks: 8, requirement: 'Calculate the investment\'s duration and the sensitivity of NPV to the initial selling price.' },
      { label: '(b)(iv)', marks: 6, requirement: 'Discuss the significance of the sensitivity and duration results.' },
      { label: '(c)', marks: 6, requirement: 'Discuss factors determining whether Prysor adopts the CFFP charter in its investment policy framework.' },
      { label: 'Professional skills', marks: 4, requirement: 'Report format, structure, presentation.' },
    ],

    verifiedNumbers: [
      { value: 'ED14,460,000', description: 'Initial NCA investment', source: 'Q' },
      { value: 'ED2.6000 = M$1', description: 'Opening exchange rate', source: 'Q' },
      { value: '14%', description: 'Discount rate', source: 'Q' },
      { value: '20% / 30%', description: 'Elan / Marteg tax rates', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'International NPV with dual tax',
        explanation: 'Calculate cash flows in ED. Apply 20% Elan tax (zero in years 1-2 due to exemption). Convert to M$ using PPP-derived exchange rates each year. Apply additional Marteg tax at effective 10% (30% Marteg rate minus 20% Elan credit already paid) on Elatian taxable profits. Discount at 14%.',
      },
      {
        stepNumber: 2,
        title: 'Duration calculation',
        explanation: 'Duration = sum of (PV of each year\'s cash flows x year number) divided by total PV of all cash flows. Set up a column: year number times PV of that year\'s cash flows. Sum that column. Divide by total PV. Show as a table — you pick up the marks even with a small arithmetic error if the structure is clear.',
      },
      {
        stepNumber: 3,
        title: 'Sensitivity of NPV to selling price',
        explanation: 'Sensitivity = NPV / PV of selling price cash flows x 100%. This tells you the percentage fall in selling price before NPV reaches zero. A low sensitivity percentage means high risk — a small price change wipes out all the value.',
      },
    ],

    examinerFeedback: {
      didWell: 'International NPV generally well-structured. Most applied dual-tax approach correctly.',
      commonErrors: 'Duration was poorly attempted. ESG and CFFP discussion was generic with minimal use of the Elan-specific information.',
      tutorTip: 'Duration calculation: column 1 is year number, column 2 is PV of that year\'s cash flows, column 3 is column 1 x column 2. Sum column 3, divide by sum of column 2. Show the table explicitly.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 13. FRONGOCH CO — Mar/Jun 2021 — Section B
  // Source: Question Pack (OCR verified) + Solution Pack (text verified)
  // ─────────────────────────────────────────────
  {
    id: 'frongoch',
    name: 'Frongoch Co',
    session: 'Mar/Jun 2021',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['Forex forwards', 'Currency futures', 'Currency options', 'Basis risk'],
    difficulty: 3,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Frongoch hedging a EUR payment',
        content: 'Frongoch Co is a US company. Today: 1 March. Payment due: EUR18,250,000 to a German supplier on 1 August.\n\nKey data (verified from Question Pack):\n- Spot rate: 1.1483-1.1497 USD per EUR\n- Five-month forward: 1.1528-1.1544 USD per EUR\n- September futures price: 1.1560 (contract size EUR 125,000)\n- Call options at 1.1540: March 0.54, June 0.61, September 0.69 (US cents per EUR)\n- Put options at 1.1540: March 0.79, June 0.90, September 1.02\n\nVerified results from Solution Pack:\n- Forward contract: $21,067,800\n- Currency futures: $21,064,150\n- Currency options (if exercised): $21,186,425\n- Number of contracts: 146',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 15, requirement: 'Calculate and compare forward contract, currency futures, and currency options for the EUR payment. Recommend on financial grounds.' },
      { label: '(b)', marks: 6, requirement: 'Recalculate results for futures and options under two alternative spot rate scenarios.' },
      { label: '(c)', marks: 4, requirement: 'Explain what is meant by basis and basis risk and discuss their impact on the hedging decision.' },
      { label: '(d)', marks: 5, requirement: 'Explain why local treasury functions may be established in countries where Frongoch operates.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '$21,067,800', description: 'Forward contract outcome', source: 'S' },
      { value: '$21,064,150', description: 'Currency futures outcome', source: 'S' },
      { value: '$21,186,425', description: 'Options outcome if exercised', source: 'S' },
      { value: '146 contracts', description: 'Number of contracts', source: 'S' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Forward contract (verified)',
        explanation: 'Paying EUR so use sell side of forward: 1.1544. Paying EUR = buying EUR, so use the rate at which the bank buys EUR (higher rate for the bank). Cost = EUR18,250,000 x 1.1544 = $21,067,800.',
        formula: 'EUR18,250,000 x 1.1544 = $21,067,800',
        verifiedNumbers: ['$21,067,800 — verified from Solution Pack'],
      },
      {
        stepNumber: 2,
        title: 'Currency futures (verified)',
        explanation: 'Paying EUR so buy EUR futures (you are buying EUR). Contracts = EUR18,250,000 / EUR125,000 = 146. Basis reduces to zero at September maturity. Predicted futures price = 1.1497 + ([1.1560 - 1.1497] x 5/7) = 1.1542. Outcome = EUR125,000 x 146 x 1.1542 = $21,064,150.',
        formula: 'Contracts = EUR18,250,000 / EUR125,000 = 146\nBasis = 1.1560 - 1.1497 = 0.0063 (total)\nUnexpired basis after 5 months = 0.0063 x 2/7 = 0.0018\nLock-in rate = 1.1497 + 0.0063 x 5/7 = 1.1542\nOutcome = EUR125,000 x 146 x 1.1542 = $21,064,150',
        verifiedNumbers: ['$21,064,150 and 146 contracts — verified from Solution Pack'],
      },
      {
        stepNumber: 3,
        title: 'Currency options (verified)',
        explanation: 'Paying EUR (buying EUR) so buy September call options at 1.1540. 146 contracts. Premium = 146 x 0.0069 x 125,000 = $125,925. Outcome if exercised = EUR125,000 x 146 x 1.1540 = $21,060,500 plus premium $125,925 = total cost $21,186,425.',
        formula: 'Premium = 146 x $0.0069 x 125,000 = $125,925\nGross cost at strike = EUR125,000 x 146 x 1.1540 = $21,060,500\nTotal cost = $21,060,500 + $125,925 = $21,186,425',
        verifiedNumbers: ['$21,186,425 — verified from Solution Pack'],
      },
    ],

    examinerFeedback: {
      didWell: 'Forward and futures calculations mostly correct. Good structure overall.',
      commonErrors: 'Options direction errors were common. Frongoch is paying EUR (buying EUR) so needs call options. Several candidates calculated the number of contracts using OTC logic instead of exchange-traded logic.',
      tutorTip: 'Frongoch pays EUR. Paying = buying EUR. Buying EUR = call options on EUR. Direction: buy September call options, not put options. This one question removes the most common error in currency options.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 14. ZHICHI CO — Sep/Dec 2021 — Section A
  // Source: Question Pack (OCR verified) + Solution Pack (text verified)
  // ─────────────────────────────────────────────
  {
    id: 'zhichi',
    name: 'Zhichi Co',
    session: 'Sep/Dec 2021',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['APV', 'Subsidised loan', 'Asset securitisation', 'Beta ungearing'],
    difficulty: 5,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Zhichi Co: three policy failures',
        content: 'Zhichi Co is a listed engineering company that has been underperforming. Analysis identified three policy failures:\n\n1. No post-completion audits on investment projects\n2. A fixed 10% discount rate used for all projects regardless of risk (no one knows why this rate was chosen)\n3. Continuous equity financing that sent wrong signals to investors\n\nThe company is now entering a new business area (motor scooters) and wants to do this properly.',
      },
      {
        id: 'project',
        navLabel: '2. The project',
        title: 'New motor scooter project (verified data)',
        content: 'Zhichi is manufacturing environmentally friendly motor scooters. 4-year project.\n\nKey data (verified from Question Pack):\n- Initial plant: $70m\n- Sales: $10m year 1, $40m year 2, then +20% years 3-4\n- Costs: 120% / 80% / 40% / 40% of sales\n- Working capital: $10m initial, then 15% of annual sales\n- TAD: 15% reducing balance\n- Tax: 20%, one-year delay\n- Residual value: $42m at year 4\n- Subsidised loan rate: 3% (4.8% risk-free rate minus 180 basis points)\n- Zhichi normal borrowing rate: 6%\n\nProxy companies: Liyu Co (60% motor scooters, 40% wind farms) and Sanwenyue Co (100% wind farms). Data given to derive the motor scooter-specific asset beta.',
        warning: 'APV calculation checklist in order: (1) all-equity NPV at ungeared cost of equity, (2) add PV of tax shield on debt, (3) subtract PV of issue costs, (4) add PV of subsidised loan benefit. If you use WACC anywhere in an APV, stop and rethink. WACC is for NPV, not APV.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 8, requirement: 'Explain the three policy failures and why they would lead to underperformance.' },
      { label: '(b)(i)', marks: 10, requirement: 'Estimate project-specific cost of equity by ungearing proxy betas and regearing to Zhichi capital structure.' },
      { label: '(b)(ii)', marks: 10, requirement: 'Calculate the all-equity NPV of the project.' },
      { label: '(b)(iii)', marks: 3, requirement: 'Calculate APV adjusting for issue costs and subsidised loan benefit.' },
      { label: '(b)(iv)', marks: 10, requirement: 'Evaluate APV results, discuss assumptions, and compare APV vs WACC-based NPV for this project.' },
      { label: '(c)', marks: 6, requirement: 'Compare conventional debt financing with asset securitisation as funding options for Zhichi.' },
      { label: 'Professional skills', marks: 4, requirement: 'Report format, structure, presentation.' },
    ],

    verifiedNumbers: [
      { value: '$70m', description: 'Initial plant investment', source: 'Q' },
      { value: '3%', description: 'Subsidised loan rate (4.8% - 1.8%)', source: 'Q' },
      { value: '15%', description: 'TAD reducing balance rate', source: 'Q' },
      { value: '20%', description: 'Corporation tax rate', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Ungear Liyu beta and isolate motor scooter beta',
        explanation: 'Liyu Co is 60% motor scooters, 40% wind farms. Sanwenyue Co is 100% wind farms. Ungear Liyu equity beta to get Liyu asset beta. Ungear Sanwenyue to get wind farm asset beta. Isolate motor scooter asset beta: Liyu asset beta = (60% x motor scooter beta) + (40% x wind farm beta). Solve for motor scooter beta. Regear using Zhichi D/E ratio. Apply CAPM.',
      },
      {
        stepNumber: 2,
        title: 'All-equity NPV',
        explanation: 'Build cash flows assuming 100% equity finance. No interest. TAD at 15% reducing balance. Tax at 20% with one-year delay. Working capital: $10m at year 0, then 15% of next year sales. Residual value $42m at year 4. Discount at the ungeared cost of equity (not WACC).',
      },
      {
        stepNumber: 3,
        title: 'APV adjustments',
        explanation: 'Start with all-equity NPV. Add: PV of tax shield on debt (tax rate x interest x annuity factor at cost of debt). Add: PV of subsidised loan benefit (difference between 6% normal rate and 3% subsidised rate, on the loan outstanding, discounted at appropriate rate). Subtract: PV of issue costs.',
      },
      {
        stepNumber: 4,
        title: 'APV vs WACC discussion',
        explanation: 'APV is better when the project financing differs significantly from the company\'s target capital structure or when there are specific one-off financing effects like subsidised government loans. WACC blends everything into one rate and cannot capture the specific value of the subsidised loan separately. APV shows exactly how much the investment is worth and how much the financing adds.',
      },
    ],

    examinerFeedback: {
      didWell: 'Beta ungearing and regearing was mostly done correctly. APV structure was understood by stronger candidates.',
      commonErrors: 'Many candidates calculated a WACC-based NPV and called it APV. That is not APV. The subsidised loan benefit calculation was frequently wrong or omitted entirely.',
      tutorTip: 'APV checklist: (1) all-equity NPV using ungeared cost of equity — no WACC, (2) add PV of tax shield, (3) subtract issue costs, (4) add subsidised loan benefit. If you see WACC anywhere in your APV answer, that is wrong.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 15. FITZHARRIS CO — Sep/Dec 2020 — Section B
  // Source: Solution Pack (text verified)
  // ─────────────────────────────────────────────
  {
    id: 'fitzharris',
    name: 'Fitzharris Co',
    session: 'Sep/Dec 2020',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['IR swap', 'IR collar', 'Comparative advantage', 'Option pricing'],
    difficulty: 4,
    primarySource: 'S',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Fitzharris hedging a borrowing',
        content: 'Fitzharris Co plans to borrow $48m on 1 December for up to 3 years. Centralised treasury function regularly uses derivatives.\n\nKey data (verified from Solution Pack):\n- Fitzharris borrowing rate: base rate + 50 basis points\n- Counterparty: can borrow floating at base + 130bps or fixed at 4.8%\n- Bank has quoted Fitzharris: nominal fixed rate 4.6%\n- Bank fee: 5 basis points to each party\n\nSwap result (verified):\n- Fitzharris gains 0.25% from comparative advantage\n- Effective rate after swap: 4.35%\n\nCollar (December futures options, contract size $1m):\n- Buy puts at 95.75 (premium 0.211%): cap on borrowing rate\n- Sell calls at 96.25 (premium 0.198%): floor below which Fitzharris cannot benefit further',
        table: {
          headers: ['Rate comparison', 'Fitzharris', 'Counterparty', 'Differential'],
          rows: [
            ['Fixed rate', '4.6%', '4.8%', '0.2%'],
            ['Floating rate', 'Base + 0.5%', 'Base + 1.3%', '0.8%'],
          ],
        },
      },
    ],

    questionParts: [
      { label: '(a)', marks: 13, requirement: 'Calculate the effective interest rate under the swap and under the collar, for both rate rise and rate fall scenarios.' },
      { label: '(b)', marks: 8, requirement: 'Comment on results and compare swaps vs collars for Fitzharris.' },
      { label: '(c)', marks: 4, requirement: 'Explain the significance of time to expiry and the interest rate in option pricing.' },
    ],

    verifiedNumbers: [
      { value: '4.35%', description: 'Effective rate after swap', source: 'S' },
      { value: '0.25%', description: 'Gain to Fitzharris from swap', source: 'S' },
      { value: '$48m', description: 'Loan amount', source: 'S' },
      { value: '48 contracts', description: 'Collar contracts', source: 'S' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Swap: identify comparative advantage (verified)',
        explanation: 'Fitzharris has an advantage in both fixed and floating but the floating advantage is larger (0.8% vs 0.2%). Fitzharris should borrow floating; counterparty borrows fixed. Gain from the swap = 0.8% - 0.2% = 0.6%. After bank fee (0.1% total): net gain = 0.5%, split 50/50 = 0.25% each.',
        formula: 'Fitzharris fixed advantage: 4.8% - 4.6% = 0.2%\nFitzharris floating advantage: (base+1.3%) - (base+0.5%) = 0.8%\nNet gain from swap = 0.8% - 0.2% = 0.6%\nAfter bank fee of 0.1%: net = 0.5%\nFitzharris gain = 0.25%\nEffective rate = 4.6% - 0.25% = 4.35%',
        verifiedNumbers: ['0.25% gain and 4.35% effective rate — verified from Solution Pack'],
      },
      {
        stepNumber: 2,
        title: 'Collar setup and outcomes',
        explanation: 'Buy 48 December put options at 95.75 (premium 0.211%): gives right to sell futures at 95.75, capping the borrowing rate. Sell 48 December call options at 96.25 (premium 0.198%): generates income but caps the benefit if rates fall. Net premium = 0.211% - 0.198% = 0.013%. If rates rise above cap: put options exercised, effective rate capped at cap level. If rates fall below floor: call options exercised by counterparty, effective rate floored at floor level.',
      },
      {
        stepNumber: 3,
        title: 'Option pricing factors (part c)',
        explanation: 'Time to expiry (theta): more time = higher option value. The underlying has more time to move favourably. An option with longer time to December expiry would be worth more. Interest rate (rho): higher risk-free rates increase call option values because the cost of holding the underlying rises, making the option relatively more attractive.',
      },
    ],

    examinerFeedback: {
      didWell: 'Swap calculations were generally correct. Most candidates understood comparative advantage.',
      commonErrors: 'Collar calculations confused many candidates. The floor leg (selling call options) was frequently omitted. Option pricing theory in part (c) received one-line answers for 4 marks.',
      tutorTip: 'For option pricing theory: for each factor, give three things. What the factor is. Which direction it moves the option price. Why. Two marks per factor means two distinct points per factor, not one sentence.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 16. TONPANTAU CO — Dec 2022 — Section B
  // Source: ACCA Model Answer (file verified)
  // ─────────────────────────────────────────────
  {
    id: 'tonpantau',
    name: 'Tonpantau Co',
    session: 'Dec 2022',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['Real options', 'BSOP', 'NPV limitations'],
    difficulty: 4,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Tonpantau Co: real options in educational publishing',
        content: 'Tonpantau Co is investing in creating study material for university courses. The investment is phased over two years. There is significant uncertainty about future sales.\n\nReal options available to Tonpantau (verified from ACCA Model Answer):\n1. Option to expand: if the first product is successful, Tonpantau can produce material for other courses (a call option)\n2. Option to abandon: if initial sales disappoint, Tonpantau can withdraw from the project and sell any salvageable intellectual property (a put option)\n\nThe question also asks about the problems with using BSOP to value real options.',
        warning: 'Many candidates produced generic lists of real option types (delay, expand, abandon) without identifying which specific options were available to Tonpantau Co in the scenario. The examiner called this out explicitly. Always name the actual options visible in the scenario first.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 12, requirement: 'Discuss why NPV understates project value. Identify the real options available to Tonpantau and calculate one using BSOP.' },
      { label: '(b)', marks: 8, requirement: 'Discuss the practical difficulties of incorporating and valuing real options.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: 'Expand + Abandon', description: 'Two specific real options in scenario', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Why NPV falls short',
        explanation: 'NPV assumes the decision is made now and stays fixed forever. It gives no value to management flexibility — the ability to respond if things go better or worse than expected. Real option theory captures this value by treating the flexibility like a financial option.',
      },
      {
        stepNumber: 2,
        title: 'Name the actual options in Tonpantau\'s scenario',
        explanation: 'Option 1: Expand into other university courses if the first product works (call option — initial investment is like a premium, exercise price is the additional investment). Option 2: Abandon and sell IP if initial sales disappoint (put option — salvage value on abandonment is the exercise price). Name these specifically. Do not list generic option types.',
      },
      {
        stepNumber: 3,
        title: 'BSOP calculation and limitations',
        explanation: 'Apply BSOP inputs: Pa = current PV of project cash flows. Pe = exercise price (either additional investment or salvage value). t = time until decision must be made. r = risk-free rate. sigma = standard deviation of project returns. Difficulties: standard deviation is hard to estimate for a one-off project. Underlying asset (IP) cannot be freely traded. Options may interact. No clear expiry date in reality.',
      },
    ],

    examinerFeedback: {
      didWell: 'BSOP mechanics were mostly correct when attempted. Cost of equity calculations using ungeared betas were strong.',
      commonErrors: 'Almost no candidates identified the two specific real options available to Tonpantau. They listed generic option types instead. The BSOP narrative was thin and not connected to Tonpantau\'s scenario.',
      tutorTip: 'Every real options question: find the actual options in the scenario text first. They are always there. Name them explicitly. The examiner puts them there deliberately and wants to see that you noticed.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 17. LURGSHALL CO — Mar/Jun 2019 — Section B
  // Source: Solution Pack (text verified)
  // ─────────────────────────────────────────────
  {
    id: 'lurgshall',
    name: 'Lurgshall Co',
    session: 'Mar/Jun 2019',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['IR swap', 'IR options', 'Comparative advantage', 'FRA'],
    difficulty: 4,
    primarySource: 'S',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Lurgshall Co: borrowing and IR risk',
        content: 'Lurgshall Co needs to borrow $84m for 6 months. Current base rate: 4.50%. Rate may move significantly.\n\nKey data (verified from Solution Pack):\n- Lurgshall fixed rate: 5.60%, counterparty fixed rate: 6.10%\n- Lurgshall floating: LIBOR + 0.50%, counterparty: LIBOR + 1.50%\n- Bank fee: 0.10% each party\n\nSwap result (verified):\n- Lurgshall has floating advantage (1.00%) greater than fixed advantage (0.50%)\n- Gain from swap split 50/50 after bank fees\n- Lurgshall gain: 0.15%\n- Effective rate after swap: 5.45%\n\nFinal recommendation (verified): swap gives a worse outcome than FRA. Options give worst outcome. Neither should be chosen over the FRA.',
      },
    ],

    questionParts: [
      { label: '(a)', marks: 15, requirement: 'Calculate effective interest rate using IR options and IR swap for the $84m borrowing.' },
      { label: '(b)', marks: 5, requirement: 'Discuss the risks associated with using a swap vs options for Lurgshall.' },
      { label: 'Professional skills', marks: 5, requirement: 'Analysis, scepticism, commercial acumen.' },
    ],

    verifiedNumbers: [
      { value: '5.60% vs 6.10%', description: 'Fixed rate comparison (verified)', source: 'S' },
      { value: '0.15%', description: 'Lurgshall swap gain', source: 'S' },
      { value: '5.45%', description: 'Effective rate after swap', source: 'S' },
      { value: 'FRA preferred', description: 'Verified recommendation', source: 'S' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Swap: comparative advantage analysis (verified)',
        explanation: 'Lurgshall fixed advantage: 6.10% - 5.60% = 0.50%. Lurgshall floating advantage: (LIBOR+1.50%) - (LIBOR+0.50%) = 1.00%. Floating advantage is larger, so Lurgshall borrows floating and counterparty borrows fixed. Net gain = 1.00% - 0.50% = 0.50%. After bank fee 0.20%: net = 0.30%. Lurgshall share = 0.15%.',
        formula: 'Floating advantage: 1.00%\nFixed advantage: 0.50%\nNet gain = 0.50%\nLess bank fee: 0.20%\nNet distributable gain: 0.30%\nLurgshall gain: 0.15%\nEffective rate = 5.60% - 0.15% = 5.45%',
        verifiedNumbers: ['0.15% gain and 5.45% rate — verified from Solution Pack'],
      },
      {
        stepNumber: 2,
        title: 'Recommendation (verified)',
        explanation: 'The overall conclusion from the Solution Pack is that the swap result is worse than the FRA would have been, and the options give an even worse result. Lurgshall should use the FRA for this borrowing rather than either the swap or the options.',
        verifiedNumbers: ['FRA preferred over swap and options — verified from Solution Pack'],
      },
    ],

    examinerFeedback: {
      didWell: 'Comparative advantage identification was well done. Most candidates correctly identified the floating advantage as larger.',
      commonErrors: 'Candidates frequently confused the direction of the swap payments. The mechanics of which party pays fixed and which pays floating were often reversed. Also, the bank fee must be shared — many applied it only to one party.',
      tutorTip: 'In a swap where Lurgshall has the larger floating advantage: Lurgshall borrows floating (what they are better at relatively), counterparty borrows fixed (what they are better at relatively). They then swap payments to achieve the mutually beneficial outcome.',
      source: 'E',
    },
  },

]; // end of PAPERS array
