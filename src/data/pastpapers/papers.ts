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
      {
        label: '(a)',
        marks: 4,
        requirement: 'Explain why Para Fuels might include the value of the Kero Innovations offer when evaluating Investment B. What type of option is it and why can normal NPV not capture it?',
        markingPoints: [
          { description: 'NPV assumes now-or-never decision / cannot be reversed once taken', marks: 1 },
          { description: 'Kero offer creates an abandonment real option / flexibility to sell project', marks: 1 },
          { description: 'Identified as a put option / right but not obligation to sell', marks: 1 },
          { description: 'Real option has value / BSOP can value this flexibility', marks: 1 },
        ],
        examinerCommentary: 'This part of the question was generally done well. Many candidates recognised that the possibility of selling the project gives Para Fuels an abandonment real option, which has value. And this value needs to be considered in the financial analysis and evaluation.',
      },
      {
        label: '(b)(i)',
        marks: 9,
        requirement: 'Calculate the NPV of Investment A. Full cash flow table with TAD, working capital, and tax.',
        markingPoints: [
          { description: 'Sales revenue years 1–4 correctly inflated at 5% per year', marks: 1 },
          { description: 'Production costs correctly inflated at given rates per year', marks: 2 },
          { description: 'TAD: 25% reducing balance years 1–3, balancing allowance year 4', marks: 2 },
          { description: 'Tax at 20% applied correctly in year of occurrence', marks: 1 },
          { description: 'Working capital: 10% of next year sales, invested at start, not released at year 25', marks: 2 },
          { description: 'Correct discounting at 12% including PV of years 5–25', marks: 1 },
        ],
        examinerCommentary: 'This part of the question was done well by many candidates and a number achieved full marks. The difficulties were encountered when applying different inflation rates to different years cash flows, and when calculating the working capital, which did not get released back to the company after four years.',
      },
      {
        label: '(b)(ii)',
        marks: 9,
        requirement: 'Calculate NPV of Investment B without the Kero real option. Then recalculate NPV of Investment B after adding the BSOP-valued abandonment option.',
        markingPoints: [
          { description: 'FCF years 1–4 correctly calculated (40% growth yrs 2–3, doubled yr 4)', marks: 2 },
          { description: 'PV of years 5–25 as delayed annuity at 12%', marks: 2 },
          { description: 'NPV of Investment B without real option', marks: 1 },
          { description: 'Pa = PV of cash flows forgone (years 4 onwards) correctly identified', marks: 1 },
          { description: 'Pe = $27m, t = 3, r = 5%, sigma = 40% applied to BSOP formula', marks: 2 },
          { description: 'NPV of Investment B with real option (base NPV + put option value)', marks: 1 },
        ],
        examinerCommentary: 'Candidates found this part of the calculations more challenging. Common errors here included: (i) not recognising that the option is a put option and using the call value instead; and (ii) getting the estimate of Pa wrong — Pa is the present value of the cash flows forgone, therefore the present value of year 4 cashflows and the present value of the cash flows related to years 5 to 25.',
      },
      {
        label: '(b)(iii)',
        marks: 7,
        requirement: 'Recommend on financial grounds which investment to choose. Discuss the assumptions behind your numbers.',
        markingPoints: [
          { description: 'Clear recommendation for Investment A based on higher NPV ($5.7m vs $4.4m)', marks: 1 },
          { description: 'Discuss accuracy of cash flow forecasts', marks: 1 },
          { description: 'Discuss reliability of 40% standard deviation estimate', marks: 1 },
          { description: 'Discuss whether Kero offer will materialise (no binding contract)', marks: 1 },
          { description: 'Discuss long-term nature of project and reliability of years 5–25 estimates', marks: 1 },
          { description: 'Discuss stability of cost of capital at 12%', marks: 1 },
          { description: 'Discuss real options assumptions (constant volatility, lognormal distribution)', marks: 1 },
        ],
        examinerCommentary: 'This part was answered adequately. Most candidates made a number of relevant points in the discussion, but mainly the answers stated the assumptions without going into a detailed discussion on the relevance and impact of the assumptions made.',
      },
      {
        label: '(b)(iv)',
        marks: 11,
        requirement: 'Discuss the four board directors comments in detail. Advise how Para Fuels should proceed if Investment B is adopted.',
        markingPoints: [
          { description: 'CEO/ESG: valid concern but must be balanced against shareholder value obligations', marks: 2 },
          { description: 'CMO/airlines: demand growth plausible but safety certification delays adoption timing', marks: 2 },
          { description: 'CFO/Kero: no binding contract is a material risk; option value may not materialise', marks: 2 },
          { description: 'CFO/two years: replacing further facilities with new tech increases cumulative risk', marks: 2 },
          { description: 'Early adopter advantage: real but magnitude uncertain', marks: 1 },
          { description: 'Practical next steps: pilot programme, negotiate binding Kero contract, phased approach', marks: 2 },
        ],
        examinerCommentary: 'Generally, this part was done less well than the other parts of the question. Many candidates presented the quotes from the various directors and then a few sentences to explain these comments. But very few went beyond that to turn the explanations and basic comments into a discussion by considering alternative positions and actions.',
      },
      {
        label: 'Professional skills',
        marks: 10,
        requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.',
        markingPoints: [
          { description: 'Communication: report format with introduction, subheadings, conclusion', marks: 3 },
          { description: 'Analysis and evaluation: calculations used to support discussion and recommendation', marks: 3 },
          { description: 'Scepticism: questioning assumptions and challenging director comments', marks: 2 },
          { description: 'Commercial acumen: real-world context applied to Para Fuels specific situation', marks: 2 },
        ],
        examinerCommentary: 'Candidates scored better with communication and analysis and evaluation marks, but less well on scepticism and commercial acumen. Fewer candidates scored well on scepticism because they did not question the relevance of the calculations, the validity of assumptions in any meaningful detail or question the opinion of directors.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 2 — Traditional technology, Investment A',
        content: 'The initial investment in the production facility will be $14m. Tax allowable depreciation is available on the production facility at an annual rate of 25% reducing balance in years 1 to 3. At the end of year 4, any remaining written down value can be written off as a balancing adjustment. There will be no residual value after the 25-year project life because of substantial decommissioning costs.\n\nSales revenue in year 1 is expected to be $12.75m and this is expected to increase by 5% per year in each of the years 2 to 4. Production costs are expected to be $5.25m in year 1. Pre-inflation amounts and inflation rates for years 2 to 4 are: year 2 $6.20m at 6%, year 3 $7.10m at 7%, year 4 $8.00m at 8%.\n\nWorking capital of 10% of sales revenue will be needed in years 1 to 4, at the start of each year. No additional working capital is needed in years 5 to 25. At the end of 25 years, the working capital will be required for the decommissioning costs and will not be released.\n\nTax: 20% on profits in the year the liability occurs. Tax on losses refunded the year the loss occurs.\n\nAn estimate has been made of the discounted value of post-tax cash flows for years 5 to 25. This totals $5.40m at the start of year 5.',
      },
      {
        title: 'Exhibit 3 — New technology, Investment B',
        content: 'The initial set-up costs for the Investment B production facility using the new technology are estimated to be $34.6m. The after-tax free cash flows generated by this investment are expected to be $1.4m in year 1. These are expected to increase by 40% in each of years 2 and 3. In year 4, when costs reduce and revenues increase, the after-tax free cash flows are expected to be twice as much as the year 3 amount. The annual after-tax free cash flows from years 5 to 25 will remain the same as year 4. The annuity factor for the 12% cost of capital based on a useful life of 25 years is 7.843.\n\nKero Innovations Co has suggested it may offer to purchase Investment B at the start of year 4 for $27m. Due to the uncertainties surrounding this investment, the cash flows are expected to vary by a standard deviation of as much as 40%. The risk-free rate of return is estimated to be 5%.',
      },
      {
        title: 'Exhibit 4 — Comments made at the BoD meeting',
        content: 'The CEO gave an enthusiastic talk about the need for Para Fuels Co to fulfil its ESG responsibilities. The CMO pointed out that airlines around the world will face increasing pressure on their ESG agendas, but also that airlines will need to ensure that this type of jet fuel is safe to use.\n\nThe CFO was more cautious. She pointed to the fact that there is no binding contract with Kero Innovations Co. She also said that while shareholders would be supportive of pursuing an environmental agenda, the majority will be concerned if that led to a significant negative impact on corporate value. The CFO reminded the BoD that although only one production facility needs to be replaced very soon, more will need to be replaced after two years.\n\nNevertheless, the CFO suggested that if this new technology becomes established and produces jet fuel which is safe to use, Para Fuels Co will get the benefit of being one of the first companies to adopt the new technology. This could be advantageous in terms of cost reduction and revenue maximisation.',
      },
    ],

    keyAnswerTips: 'Real options theory is often tested alongside investment appraisal. The BSOP calculator spreadsheet provided in the CBE helps to calculate option values very quickly. Be careful to pick up the correct figure from the spreadsheet — "C" is the value of a call option, and "P" is the value of a put option. The offer from Kero in this question gives Para Fuels an option to abandon the project in three years, which is an example of a put option.',

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
      {
        label: '(a)',
        marks: 9,
        requirement: 'Calculate the impact on intra-group cash flows if multilateral netting is used. Briefly explain the main advantage.',
        markingPoints: [
          { description: 'Convert all balances to USD at mid spot rates', marks: 2 },
          { description: 'Build netting matrix showing total payables and receivables per entity', marks: 3 },
          { description: 'Calculate net positions for each entity', marks: 2 },
          { description: 'Apply settlement order rule correctly (largest payer → smallest receiver)', marks: 1 },
          { description: 'Explain main advantage: fewer transactions, lower transaction costs', marks: 1 },
        ],
        examinerCommentary: 'Many candidates made a systematic attempt at the calculations and gained the majority of the marks. The most common error was failing to follow the instructions provided in the scenario, either by ignoring the need to calculate the final cash flow settlements once they had netted out the underlying transactions or by suggesting alternative settlement arrangements that were not in line with the instructions.',
      },
      {
        label: '(b)',
        marks: 4,
        requirement: 'Calculate the USD cost of hedging the SEK payment using the forward (money market) method.',
        markingPoints: [
          { description: 'Forward market hedge: SEK125m / 8.5308 = USD 14,650,252', marks: 1 },
          { description: 'Money market hedge: borrow SEK, convert at spot, invest in USD', marks: 2 },
          { description: 'Comparison and recommendation with brief justification', marks: 1 },
        ],
        examinerCommentary: 'Candidates normally answered this requirement satisfactorily. The most common errors involved using the spot rate rather than the forward rate, or using the ask rate instead of the bid rate in the forward hedge, and using the wrong interest and/or exchange rates in the money market hedge.',
      },
      {
        label: '(c)',
        marks: 7,
        requirement: 'Explain how a centralised treasury department assists with the cost-reduction strategy and discuss the advantages of the finance director\'s proposal to decentralise the treasury function.',
        markingPoints: [
          { description: 'Centralised: bulk pricing on derivatives, netting reduces transaction costs', marks: 2 },
          { description: 'Centralised: expertise, consistent risk management policy', marks: 1 },
          { description: 'Decentralised: faster decision-making, better local market knowledge', marks: 2 },
          { description: 'Decentralised: more delegation of authority — addresses problems identified', marks: 1 },
          { description: 'Application to Lough Co specific scenario (missed investment, failed float)', marks: 1 },
        ],
        examinerCommentary: 'Many candidates provided rote learned advantages of both centralised and decentralised treasury functions but very few were able to apply their answers to the specific scenario. Candidates who provide rote-learned explanations will always perform less well than candidates who take the time to apply their knowledge to the scenario.',
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis, scepticism, commercial acumen.',
        markingPoints: [
          { description: 'Analysis and evaluation: well-structured netting and hedging comparison', marks: 2 },
          { description: 'Scepticism: questioning whether hedging is necessary given expected SEK depreciation', marks: 1 },
          { description: 'Commercial acumen: discussion applied to Lough Co specific competitive situation', marks: 2 },
        ],
        examinerCommentary: 'Many candidates were also able to demonstrate reasonable analysis and evaluation skills but often struggled to demonstrate the requisite level of skills in scepticism and commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Intra-group balances',
        content: 'Cash flows between Lough Co (US, USD), Fitz Co (UK, GBP), Gahana Co (India, INR) and Adalar Co (Turkey, TRY):\n\nLough Co owes Gahana Co: INR 3,447.70m\nLough Co owes Adalar Co: TRY 126.20m\nFitz Co owes Lough Co: USD 75.75m\nFitz Co owes Gahana Co: INR 333.13m\nFitz Co owes Adalar Co: TRY 256.29m\nGahana Co owes Fitz Co: GBP 34.08m\nGahana Co owes Adalar Co: TRY 135.52m\nAdalar Co owes Lough Co: USD 12.80m\n\nSpot mid-rates: GBP/USD1 0.7070, INR/USD1 72.4000, TRY/USD1 7.2235.\n\nSettlements made in the order: company owing the largest net amount in USD settles with the company owed the smallest net amount in USD.',
      },
      {
        title: 'Exhibit 2 — Payment to Swedish supplier',
        content: 'Lough Co makes regular payments to a Swedish supplier. The next payment is for SEK125m due in five months.\n\nExchange rates (SEK per USD1): spot 8.4458–8.4924, five-month forward 8.5308–8.5778.\n\nAnnual interest rates available to Lough Co — investing/borrowing: United States 1.5% / 2.2%, Sweden 2.1% / 3.1%.',
      },
      {
        title: 'Exhibit 3 — Treasury function context',
        content: 'Lough Co operates in a highly competitive industry undergoing structural adjustment. A wave of M&A has led to consolidation and Lough Co\'s profitability has declined over recent years. The new CEO is implementing a cost-reduction strategy.\n\nThe finance director wants to restructure the treasury function due to ongoing problems: delays in approving finance for new projects (Gahana Co missed an investment opportunity); a failed plan to float Adalar Co on the local stock exchange; high turnover of senior management across subsidiaries due to lack of delegation. The FD believes a decentralised treasury function would help.',
      },
    ],

    keyAnswerTips: 'The most commonly tested topics in AFM when looking at currency hedging are futures and traded options. This question covered some different topics — money market hedge and multilateral netting. This shows the importance of revising all parts of the syllabus, not just the most commonly tested topics.',

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
  // FELINHEN CO — Sep/Dec 2022 — Section B
  // Source: Kaplan Exam Kit 2024-25 + ACCA Examiner Report Sep 2022
  // ─────────────────────────────────────────────
  {
    id: 'felinhen',
    name: 'Felinhen Co',
    session: 'Sep/Dec 2022',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['Valuation', 'MBO', 'Free cash flow', 'Stakeholders'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Who is Felinhen Co?',
        content: 'Felinhen Co carries out agricultural and woodland management. It owns a wholly-owned retail subsidiary, Counwood Co, with the same directors on both boards. Counwood runs two businesses: countryside stores and a woodcraft business.\n\nThe woodcraft business sells furniture and wood products. Wood is sourced from Felinhen-managed woodlands. Profits have declined for years and in the most recent year the woodcraft business made its first operating loss.',
      },
      {
        id: 'options',
        navLabel: '2. Three options',
        title: 'The three options on the table',
        content: 'The board initially decided to close all the woodcraft shops and craft centres. The proposals faced significant opposition. A group of shop employees, backed by business angels and a crowdfunding campaign, has offered to buy out the woodcraft business for $3m.\n\nThe finance director must value three scenarios:\n\n1. Close everything and sell the assets individually.\n2. Keep the craft centres open, close the shops, sell products through countryside stores and online.\n3. Keep all craft centres and woodcraft shops open (for comparison only — not an option the board is considering).',
        warning: 'Scenario 3 is comparison-only. The board is NOT considering keeping everything open. Many candidates recommend scenario 3 anyway and lose the discussion marks.',
      },
      {
        id: 'data',
        navLabel: '3. Valuation data',
        title: 'The valuation inputs',
        content: 'Scenario 1 — Close and sell:\nCounwood Co most recent balance sheet: non-current assets $5,820k, current assets $1,750k, current liabilities $970k, total equity $6,600k. Net assets of woodcraft business = 60% of Counwood Co total net assets. Realisable value = 75% of woodcraft net assets (net of closure costs).\n\nScenario 2 — Keep craft centres only:\nImmediate net cash inflow $800k. Years 1–5 after-tax profits: $470k, $494k, $516k, $536k, $558k. Annual additional investment $100k, $120k, $135k, $145k, $150k — exactly equal to depreciation. From year 6: same as year 5 in perpetuity. Cost of capital 12%.\n\nScenario 3 — Keep everything open (comparison only):\nImmediate investment $600k. Year 1–3 after-tax profits $380k, $420k, $440k. Year 1–3 depreciation $170k, $190k, $200k. Year 1–3 additional investment $300k, $250k, $210k. From year 4: free cash flows grow at 3% in perpetuity. Cost of capital 12%.',
        warning: 'Scenario 2 explicitly states additional investment = depreciation each year. Both cancel out of FCF. Use after-tax profits as FCF directly. Candidates who include both lose marks.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 9,
        requirement: 'Calculate the valuation of the woodcraft business in the three projected scenarios.',
        markingPoints: [
          { description: 'Scenario 1: 60% × $6,600k = $3,960k woodcraft net assets; × 75% realisable = $2,970k', marks: 3 },
          { description: 'Scenario 2: FCF = profits (depreciation = investment, both cancel). PV years 1–5 + terminal $558k/0.12 discounted from Y5 + $800k immediate', marks: 3 },
          { description: 'Scenario 3: FCF = profit + depreciation − investment. Year 4 grows at 3%; terminal = FCF₄/(0.12−0.03). Deduct $600k immediate', marks: 3 },
        ],
        examinerCommentary: 'Overall, candidates coped well with the calculations and many scored high marks. The most common error with the net asset valuation involved ignoring the adjustments that should have been made to Counwood Co\'s assets to determine the realisable value of the woodcraft business\'s share of those assets. Many candidates also included additional investment in the valuation for the second scenario despite being told that this was equivalent to depreciation.',
      },
      {
        label: '(b)',
        marks: 11,
        requirement: 'Discuss possible courses of action for Felinhen Co\'s board based on the valuations. Discuss other possible courses of action. Recommend a course of action.',
        markingPoints: [
          { description: 'Scenario 1 ($2,970k) is the floor value — compare to buyout offer of $3m', marks: 1 },
          { description: 'Scenario 2 ($5,275k) is the highest financial value — discuss execution risk', marks: 2 },
          { description: 'Buyout offer of $3m: marginally above floor — avoids job losses and reputational harm', marks: 2 },
          { description: 'Other options: negotiate higher buyout price, partial implementation, phased approach', marks: 2 },
          { description: 'Non-financial factors: employees, community, Felinhen reputation', marks: 2 },
          { description: 'Clear recommendation with justification', marks: 2 },
        ],
        examinerCommentary: 'Although there were some excellent answers to this requirement, a significant number of candidates provided limited responses. Some candidates wasted time repeating information from the scenario or discussing points that were not relevant to the scenario. The most common misunderstanding made by candidates involved recommending the hypothetical third scenario even though candidates were told in exhibit one that this is not an option that the board is considering.',
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
        markingPoints: [
          { description: 'Analysis: comprehensive and well-structured valuation calculations', marks: 2 },
          { description: 'Scepticism: questioning whether cash flow assumptions for scenarios 2 and 3 are realistic', marks: 1 },
          { description: 'Commercial acumen: practical recommendations balancing financial and stakeholder factors', marks: 2 },
        ],
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — The decision facing the board',
        content: 'Counwood Co (Felinhen\'s wholly-owned subsidiary) runs countryside stores and a woodcraft business. Profits from the woodcraft business have declined in recent years and made its first operating loss this year. The board initially decided to close all woodcraft shops and craft centres. After significant opposition, a group of shop employees, backed by business angels and a crowdfunding campaign, has offered to buy out the woodcraft business for $3m. The board has asked the FD to consider three valuations. (The "keep everything open" scenario is for comparison only — it is not an option the board is considering.)',
      },
      {
        title: 'Exhibit 2 — Scenario data',
        content: 'Scenario 1 (close & sell assets): Counwood balance sheet — non-current assets $5,820k, current assets $1,750k, current liabilities $970k, total equity $6,600k. Woodcraft net assets = 60% of Counwood total net assets. Realisable value = 75% of woodcraft net assets (net of closure costs).\n\nScenario 2 (keep craft centres, close shops, sell online): immediate net cash inflow $800k. After-tax profits years 1–5: $470k, $494k, $516k, $536k, $558k. Additional investment years 1–5: $100k, $120k, $135k, $145k, $150k — equal to depreciation. From year 6: as year 5 in perpetuity. Cost of capital 12%.\n\nScenario 3 (keep everything open — comparison only): immediate investment $600k. After-tax profits years 1–3: $380k, $420k, $440k. Depreciation years 1–3: $170k, $190k, $200k. Additional investment years 1–3: $300k, $250k, $210k. From year 4: FCF growth 3% in perpetuity. Cost of capital 12%.',
      },
    ],

    keyAnswerTips: 'There was a lot to read in this question — three different alternatives. The calculations were actually straightforward, especially scenario 2 where depreciation equalled investment so both figures could be ignored. More than half of the marks were for the discussion elements and the professional skills, so do not over-spend on the calculations.',

    verifiedNumbers: [
      { value: '$2,970,000', description: 'Scenario 1 valuation (close & sell assets)', source: 'A' },
      { value: '~$5,275,000', description: 'Scenario 2 valuation (keep craft centres)', source: 'A' },
      { value: '~$3,719,000', description: 'Scenario 3 valuation (keep everything — comparison)', source: 'A' },
      { value: '$3,000,000', description: 'Buyout offer from shop employees', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Scenario 1 is the floor value',
        explanation: 'Closing and selling assets gives the minimum anyone should accept for this business. Calculate the woodcraft share of Counwood\'s net assets (60%), then apply the 75% realisable rate (accounting for closure costs). The buyout offer of $3m sits just above this floor — the employee group is not being exploitative.',
        formula: 'Counwood net assets = $6,600,000 (total equity)\nWoodcraft share = 60% × $6,600,000 = $3,960,000\nRealisable value = 75% × $3,960,000 = $2,970,000',
        verifiedNumbers: ['$2,970,000 — Scenario 1 valuation (floor)'],
      },
      {
        stepNumber: 2,
        title: 'Scenario 2 cancels out additional investment',
        explanation: 'The question states additional investment equals depreciation in each year. So FCF = after-tax profits only. Do not include either in your cash flows. Terminal value at year 5 = $558k / 0.12 = $4,650k, discounted to today. Add the immediate $800k inflow.',
        verifiedNumbers: ['~$5,275,000 — Scenario 2 valuation (highest)'],
      },
      {
        stepNumber: 3,
        title: 'Scenario 3 uses FCF = profit + depreciation − investment',
        explanation: 'Scenario 3 has unequal depreciation and investment so both matter. FCF year 1 = $380k + $170k − $300k = $250k. Year 2 = $360k. Year 3 = $430k. Year 4 FCF = $430k × 1.03 = $442.9k. Terminal value at year 3 = $442.9k / (0.12 − 0.03) = $4,921k. Deduct the immediate $600k investment.',
        verifiedNumbers: ['~$3,719,000 — Scenario 3 valuation (comparison only — NOT an option)'],
      },
      {
        stepNumber: 4,
        title: 'Make a recommendation that engages with the buyout offer',
        explanation: 'Buyout ($3m) sits just above floor ($2.97m) but well below scenario 2 (~$5.3m). The employee group may be getting a bargain. Options: accept the offer (avoids job losses and reputational damage), negotiate upward toward scenario 2 value, or pursue scenario 2 themselves. Scenario 3 is NOT an option — do not recommend it.',
      },
    ],

    examinerFeedback: {
      didWell: 'Candidates coped well with the calculations and many scored high marks on the valuations — especially scenario 1\'s net asset approach.',
      commonErrors: 'Two recurring failures: including additional investment alongside depreciation in scenario 2 despite the question saying they were equal; and recommending scenario 3 even though the exhibit explicitly said it was not an option the board was considering.',
      tutorTip: 'When the question says two figures are equal and cancel, take them out. When the question says a scenario is for comparison only, do not recommend it. Read the exhibits twice before starting the calculations.',
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
      {
        label: '(a)',
        marks: 6,
        requirement: 'Explain the forex exposure Fondir faces in the Italian market and suggest how it could be managed.',
        examinerCommentary: 'The most common error in part (a) was failing to identify economic risk — almost all candidates wrote about transaction risk. Economic risk is a long-term permanent shift in the underlying exchange rate that affects competitive position; derivatives cannot fix it.',
      },
      {
        label: '(b)(i)',
        marks: 7,
        requirement: 'Calculate the amounts receivable in $ from Lothil in four months\' time, using the over-the-counter (OTC) forward rate and the OTC option.',
        examinerCommentary: 'The most common error was using annual interest rates without adjusting for the four-month period (divide by 3).',
      },
      {
        label: '(b)(ii)',
        marks: 9,
        requirement: 'Calculate the interest return in $ of the cash flows from Lothil when futures contracts are used to hedge the interest rate fluctuations of 0.5%. Calculations should include the number of futures contracts needed and the gain or loss in the futures market in $.',
        examinerCommentary: 'Performance on this part was described as "disappointing." Many did not adjust annual rates for the investment period (5/12) and IR futures direction (depositors buy futures) was often wrong.',
      },
      {
        label: '(b)(iii)',
        marks: 9,
        requirement: 'Comment on the results obtained in (b)(i) and (ii), and address the queries raised by the BoD with respect to alternative methods to hedge the receipt and the margin requirements.',
      },
      {
        label: '(b)(iv)',
        marks: 9,
        requirement: 'Discuss whether it would be beneficial for Fondir to manage its financial risks, and whether or not the company should communicate its risk management approach to its stakeholders.',
      },
      {
        label: 'Professional skills',
        marks: 10,
        requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Fondir Co, risk management',
        content: 'Fondir Co, based in the USA (currency $), is involved in the production and sale of high-quality foods under its popular brand "Delibeli". Initially aimed at the USA market, products are increasingly sold internationally to North and South America and to Europe. Fondir Co is expanding its production facilities and receiving its revenues in a variety of currencies.\n\nFondir Co has developed robust systems to manage its operational risks, but so far it has not managed its financial risk from currency and interest rate fluctuations. The BoD broadly supports using derivative products and communicating the risk approach to shareholders, managers, lenders and employees.\n\nThe marketing director questioned whether these and other financial risks should be managed at all, suggesting the costs would outweigh the benefits.\n\nThe finance director argued some risks were harder to manage. She gave the Italian market as an example: direct competitors from France and Germany have successfully penetrated the Italian market. Fondir\'s sales revenue from Italy has been falling, which the FD attributes to the weakening of the Euro against the $. She believes this relative weakening is likely to continue for some time and cannot be managed through derivatives.',
      },
      {
        title: 'Exhibit 2 — Receipt from Lothil',
        content: 'Fondir Co sells to customers in Lothil (currency LL). Expected receipt: LL357m in four months\' time, on 1 May. No exchange-traded derivatives for LL, but two OTC products are available.\n\nFour-month forward agreed today: Lothil annual base 6% + 60 bp; USA annual base 3.3% − 30 bp. Spot rate: LL84.00/$1.\n\nOTC $ call or put option, exercise price LL84.00. Call premium LL4.00 per $1; put premium LL3.00 per $1. Premium payable at commencement; Fondir borrows the premium using its overdraft (5.4% annual).',
      },
      {
        title: 'Exhibit 3 — Short-term investment',
        content: 'After the four-month conversion to $, the cash is invested for a further five months. The BoD wants to know how interest rate futures can be used to hedge ±0.5% in the base rate. Fondir invests short-term at USA base rate (3.3%) less 30 bp.\n\nJune three-month $ futures: contract size $500,000. June futures price 96.10 (quoted as 100 − annual % yield).\n\nAssumptions: settlement at month end; basis diminishes to zero at maturity (monthly time intervals); no basis risk; ignore margin requirements.\n\nThe BoD has heard dealing with futures can be expensive because of margin requirements and wants to understand what margins are.',
      },
    ],

    keyAnswerTips: 'Economic risk = the competitive position itself has shifted permanently. If the scenario says sales have been declining for years due to sustained exchange rate movements, write economic risk immediately and explain the strategic fix (overseas subsidiary, EUR sourcing, market exit), not derivatives. For Lothil: divide the annual interest rates by 3 (four months); for the futures hedge, divide by 12/5 then × 5/3 for contracts.',

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
        content: 'McKeever Co is a US company specialising in scientific-instrument design and production. Until now, it has never sold or manufactured outside the US. The CEO has proposed expansion into Erat — an emerging market that has experienced extreme economic challenges but where the new government has introduced foreign-investment incentives.\n\n4-year project. Today\'s spot: £3.31 per $1.\n\nUnit volumes: 55,000 / 67,000 / 82,000 / 90,000 units.\nSelling price £275/unit year 1 (inflates at Erat inflation). Variable costs £100/unit year 1 (inflates at Erat inflation) — this already includes a £20 transfer price from the US parent (pre-tax contribution to parent £10/unit, also inflated at Erat rate).\nFixed costs £750,000 year 1, +5% per year.',
      },
      {
        id: 'investment',
        navLabel: '2. Investment + tax',
        title: 'Capex, residual values and tax',
        content: 'Investment: £32m land and buildings + £18m plant and machinery = £50m total.\nTAD: 25% on cost of plant and machinery, straight-line (£18m × 25% = £4.5m/year, first allowance year 1).\nLand and buildings: government acts as buyer of last resort at end of year 4 → cost recovered in full. Plant and machinery: NOT recoverable.\n\nTax: Erat 20% (reduced from normal 30% as foreign-investor incentive), US 25%. Both pay in the year liability arises. Bilateral treaty allows McKeever to offset overseas tax against US tax incurred on overseas earnings.\n\nWorking capital: 15% of that year\'s CONTRIBUTION at start of year. Fully recoverable end of year 4.',
        warning: 'Many candidates apply 15% to REVENUE rather than CONTRIBUTION. The question explicitly says contribution. Also: TAD is on plant only (£18m), not on the full £50m investment.',
      },
      {
        id: 'exchange',
        navLabel: '3. Exchange rates',
        title: 'PPP rates and the marketing director\'s alternative',
        content: 'Inflation forecasts (US / Erat):\nYear 1: 6% / 5%\nYear 2: 6% / 5%\nYear 3: 7% / 4%\nYear 4: 7% / 4%\n\nThe finance director estimated these by attaching probabilities to a range of analysts\' predictions. The marketing director questions the consistency and methodology and proposes an alternative based on historical trend:\n£/$ Year 1: 3.37 / Year 2: 3.41 / Year 3: 3.47 / Year 4: 3.50.\n\nThe FD\'s counter: a weakening of the Eratian pound was suggested by less than 5% of analysts.\n\nUnder the alternative assumption, the PV of post-tax component contribution has already been calculated as $485,000.',
        warning: 'The PPP rates derived from the expected inflation differential have the £ APPRECIATING vs the $ (3.31 → 3.07). The marketing director\'s historical trend has the £ DEPRECIATING (3.31 → 3.50). The alternative swings NPV from positive to negative. Recognising the direction matters more than memorising the exact rates.',
      },
      {
        id: 'country',
        navLabel: '4. Country risk',
        title: 'Political risk and the CEO\'s discount-rate question',
        content: 'The board is concerned about country risk. Specific items in the scenario:\n• Main opposition party is challenging the tax incentives.\n• Opposition has overtaken the governing party in opinion polls less than 6 months after the last election.\n• Erat has a history of more frequent changes in government than the formal 5-year cycle suggests.\n• Dividend remittance restrictions removed — but could be reinstated.\n• Residual value guarantee on land/buildings depends on the government.\n\nThe CEO has suggested increasing the discount rate to reflect both forex and political risk — even though the project does not change McKeever\'s capital structure or normal business apart from being overseas. Part (vi) asks whether this is valid.',
      },
    ],

    questionParts: [
      {
        label: '(i)',
        marks: 8,
        requirement: 'Estimate the project\'s Erat-based cash flows, in pounds.',
        markingPoints: [
          { description: 'Sales revenue: units × £275 inflated at Erat 5%/5%/4%/4%', marks: 1 },
          { description: 'Variable costs: units × £100 inflated at Erat rates', marks: 1 },
          { description: 'Contribution = revenue − variable cost (includes £10/unit retained, £20 transfer price)', marks: 1 },
          { description: 'Fixed costs: £750k yr1 growing 5%/year', marks: 1 },
          { description: 'TAD: £4.5m/year on plant only (not on land/buildings)', marks: 1 },
          { description: 'Tax at 20% Erat, paid same year', marks: 1 },
          { description: 'Working capital: 15% of CONTRIBUTION at start of year; released yr4', marks: 1 },
          { description: 'Land and buildings recovered in full year 4 (govt buyer of last resort)', marks: 1 },
        ],
        examinerCommentary: 'Most candidates handled the cash flow structure but two errors recurred: applying TAD to the full £50m rather than just the £18m plant; and applying working capital to revenue rather than contribution. Many also missed that land and buildings are recovered but plant is not.',
      },
      {
        label: '(ii)',
        marks: 9,
        requirement: 'Estimate the net present value (NPV) of the project in dollars.',
        markingPoints: [
          { description: 'PPP exchange rates: £/$ 3.31 → 3.28 → 3.25 → 3.16 → 3.07', marks: 2 },
          { description: 'Convert £ cash flows to $ at each year\'s PPP rate', marks: 1 },
          { description: 'Add the US parent\'s after-tax component contribution (£10/unit × volume, inflated)', marks: 2 },
          { description: 'Bilateral treaty: Erat 20% < US 25% → US top-up tax of 5% on Erat taxable profits', marks: 2 },
          { description: 'Discount at 14% McKeever cost of capital', marks: 1 },
          { description: 'NPV = $1,061,000 (positive)', marks: 1 },
        ],
        examinerCommentary: 'The bilateral tax treaty top-up (5% to bring Erat\'s 20% up to US 25%) was the most common omission. Many candidates treated Erat tax as the only tax. Component contribution from the US parent was sometimes double-taxed.',
      },
      {
        label: '(iii)',
        marks: 6,
        requirement: 'Evaluate the impact of the marketing director\'s alternative exchange rate assumption on the project\'s NPV, recommending whether or not the project should be accepted.',
        markingPoints: [
          { description: 'Apply alternative rates 3.37/3.41/3.47/3.50 to Erat cash flows', marks: 2 },
          { description: 'Include the pre-calculated $485k PV of component contribution', marks: 1 },
          { description: 'NPV under alternative = −$513,000 (negative)', marks: 1 },
          { description: 'Recommendation: project marginal, recommend conditional acceptance with sensitivity analysis', marks: 2 },
        ],
      },
      {
        label: '(iv)',
        marks: 8,
        requirement: 'Discuss the assumptions made in the NPV calculations and respond to the marketing director\'s concerns about the methodology used to estimate the expected exchange rates in (ii).',
        markingPoints: [
          { description: 'PPP holds only loosely in practice; deviation in any single year possible', marks: 1 },
          { description: 'Expected-value methodology weights low-probability tail outcomes as if certain', marks: 1 },
          { description: '<5% of analysts predicted £ depreciation, so the alternative is a low-probability scenario', marks: 1 },
          { description: 'Assumption of constant inflation differential is itself uncertain', marks: 1 },
          { description: 'Cash flow assumptions: volume growth, selling price, fixed cost growth all are forecasts', marks: 1 },
          { description: 'Residual value of land/buildings depends on the buyer-of-last-resort guarantee holding', marks: 1 },
          { description: 'Practical fix: sensitivity analysis (volume −20%, FX +5%, etc.); scenario analysis', marks: 1 },
          { description: 'Recommend the project is robust under the central forecast but flag tail risk', marks: 1 },
        ],
      },
      {
        label: '(v)',
        marks: 5,
        requirement: 'Discuss the political risks the board should consider before making a final decision.',
        markingPoints: [
          { description: 'Opposition challenge to tax incentives → tax rate could revert to 30%', marks: 1 },
          { description: 'Opposition leading in polls + history of frequent changes → election risk', marks: 1 },
          { description: 'Dividend remittance restrictions could be reinstated', marks: 1 },
          { description: 'Buyer-of-last-resort guarantee depends on government continuity', marks: 1 },
          { description: 'Practical mitigants: political-risk insurance, joint venture with local partner, phased investment', marks: 1 },
        ],
        examinerCommentary: 'Country risk discussion was often generic — most candidates listed types of risk without applying them to McKeever and Erat. The strongest answers named the specific risk, said what it does to these cash flows, and suggested what management could do.',
      },
      {
        label: '(vi)',
        marks: 4,
        requirement: 'Discuss the validity of the chief executive officer\'s suggestion to adjust the project\'s discount rate to incorporate country risk.',
        markingPoints: [
          { description: 'Forex risk is largely diversifiable (shareholders hold global portfolios) — not a discount-rate adjustment', marks: 1 },
          { description: 'Political risk is more systematic and harder for shareholders to diversify — some argument for adjustment', marks: 1 },
          { description: 'Better approach: adjust expected cash flows (probability-weight downside scenarios) rather than rate', marks: 1 },
          { description: 'Discount-rate adjustment risks double-counting risk already in the cash-flow scenarios', marks: 1 },
        ],
        examinerCommentary: 'A short part for 4 marks; most candidates wrote too much theory and not enough application. The marking key wants a clear recommendation with brief justification.',
      },
      {
        label: 'Professional skills',
        marks: 10,
        requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — McKeever Co',
        content: 'McKeever Co specialises in the design and production of scientific instruments. Until now, the company has never sold or manufactured products outside its home market, the United States (US), but the chief executive officer (CEO) has identified a new growth opportunity in the country of Erat. Although Erat is an emerging market which has experienced extreme economic challenges in recent decades, the new government has introduced a series of incentives to promote inward foreign investment. These incentives were introduced after the recent election and were an important factor behind the CEO\'s proposal.',
      },
      {
        title: 'Exhibit 2 — Project information',
        content: 'Erat\'s currency is the Eratian pound (£) and today\'s exchange rate is £3.31 per $. The project will last 4 years.\n\nOperating cash flows:\nSales units: Yr1 55,000 / Yr2 67,000 / Yr3 82,000 / Yr4 90,000.\nSelling price £275/unit yr1; variable costs £100/unit yr1; both grow at Erat inflation. Variable cost includes £20 transfer price from US (pre-tax contribution to parent £10/unit, also inflated at Erat rate).\nFixed costs £750,000 yr1, growing 5%/year.\n\nInvestment: £32m land/buildings + £18m plant/machinery. TAD 25% straight-line on plant cost (first allowance yr1). Government acts as buyer of last resort for land and buildings at end of yr4 → land/buildings cost recovered in full; plant not recoverable.\n\nTaxation: Erat 20% (reduced from normal 30% as foreign-investor incentive); US 25%. Both pay in year liability arises. Bilateral treaty: offset overseas tax against US tax liabilities on overseas earnings.\n\nWorking capital: 15% of that year\'s contribution at start of year. Fully recoverable end of yr4.\n\nInflation: US 6%/6%/7%/7%; Erat 5%/5%/4%/4%. Use PPP to estimate forecast exchange rates.\n\nDividend remittance restrictions removed; board plans to extract positive annual cash flows at earliest opportunity. McKeever cost of capital 14%.',
      },
      {
        title: 'Exhibit 3 — Alternative exchange rate assumption',
        content: 'Expected inflation rates were estimated by attaching probabilities to a range of analysts\' predictions. The marketing director has concerns about consistency across the analysts and the methodology used.\n\nAs an alternative, he proposes re-assessing the project using exchange rates based on the historical trend:\nYr1 £/$ 3.37 / Yr2 3.41 / Yr3 3.47 / Yr4 3.50.\n\nThe finance director\'s counter: a weakening of the Eratian pound was suggested by less than 5% of analysts.\n\nUnder this alternative exchange rate assumption, the PV of post-tax component contribution has already been calculated as $485,000.',
      },
      {
        title: 'Exhibit 4 — Country risk',
        content: 'The board is concerned about country risk in an emerging market — particularly foreign exchange and political risks. Erat\'s main opposition party is challenging the tax incentives and has overtaken the governing party in opinion polls less than 6 months after the last election. The next election is officially 5+ years away but Erat has a history of more frequent changes in government.\n\nThe directors\' key concern is whether McKeever\'s shareholders (mainly institutional investors) will react favourably to the new project.\n\nThe CEO has questioned whether the project\'s discount rate should be increased — even though the project does not involve a change in capital structure or normal course of business, apart from being based in another country. The proposed adjustment would reflect increased risk exposure from both forex and political risk.',
      },
    ],

    keyAnswerTips: 'International NPV with bilateral tax treaty is the most-tested AFM investment-appraisal pattern. Routine matters: (1) Erat tax in Erat, then (2) US top-up of 5% to bring the rate up to 25%. Working capital is on CONTRIBUTION not revenue. TAD is on plant only, not full £50m. Land/buildings recovered (govt guarantee); plant not. Six sub-parts means time budget tight: ~14 min for (i), 16 min for (ii), 11 min for (iii), 14 min for (iv), 9 min for (v), 7 min for (vi).',

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
      {
        label: '(a)',
        marks: 5,
        requirement: 'Discuss the agency problems created by Joshua Co\'s proposed takeover of Fraser Co as a defence and risk diversification strategy and explain how these could be mitigated.',
      },
      {
        label: '(b)(i)',
        marks: 5,
        requirement: 'Calculate the post-acquisition weighted average cost of capital.',
      },
      {
        label: '(b)(ii)',
        marks: 11,
        requirement: 'Estimate the additional value to shareholders from Joshua Co\'s proposed acquisition of Fraser Co.',
      },
      {
        label: '(b)(iii)',
        marks: 6,
        requirement: 'Compare shareholder wealth before and after the acquisition by calculating the percentage change in equity value and next year\'s dividend income for both companies\' shareholders.',
      },
      {
        label: '(b)(iv)',
        marks: 8,
        requirement: 'Advise the board of any concerns either company\'s shareholders may have with the acquisition and discuss the validity of the assumptions made in evaluating the proposal in (b)(i), (ii) and (iii) above.',
      },
      {
        label: '(b)(v)',
        marks: 5,
        requirement: 'Discuss the credibility of the CEO\'s alternative suggestion to use a share buyback as a takeover defence and advise whether or not this is a feasible strategy for Joshua Co.',
      },
      {
        label: 'Professional skills',
        marks: 10,
        requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Joshua Co',
        content: 'Joshua Co is a listed leading fashion retailer with stores based in flagship retail centres nationwide. Financial performance has suffered recently due to problems with its online operation. These problems are causing concern for institutional shareholders.\n\nOnline rivals have emerged in recent years and are quickly reducing Joshua Co\'s market share. They have also diversified into other areas (e.g. household furnishings) once they have established a well-known brand. Joshua Co recently attempted to acquire one of these online rivals, Fraser Co, but neither company\'s shareholders approved the deal — it was unlikely to create value.\n\nFollowing a series of profit warnings there has been media speculation that Joshua Co is attracting takeover interest. No approach yet, but directors are concerned about their future. The chairman would like to discuss defence strategies at an upcoming board meeting — particularly the suggestion that Joshua Co could defend itself by improving its own takeover offer for Fraser Co (an enlarged Joshua Co would be harder to acquire and would introduce risk-diversification benefits).',
      },
      {
        title: 'Exhibit 2 — Acquisition of Fraser Co',
        content: 'Joshua Co\'s funding options have deteriorated since last year\'s cash offer was rejected. No cash reserves for a cash offer; shareholders unlikely to agree to another rights issue. Gearing significantly exceeds the industry average; close to breaching a bank covenant. The CEO has suggested a share-for-share exchange.\n\nFinancial data — Joshua Co / Fraser Co:\nMarket value of equity: $102m / $56m\nAsset beta: 0.85 / 1.18\nDividend: $2.7m / $3.2m\nOrdinary shares ($1): $40m / $10m\n\nCost of capital: Joshua post-acquisition asset beta = weighted average of both companies\' pre-acquisition asset betas (weighted by market value of equity). Maintain existing debt:equity 30:70 (market value). Pre-tax credit spread on Joshua\'s debt remains 410 bp above the risk-free rate.\n\nPost-acquisition cash flows: PBIT year 1 $27.2m, growing 5%/year in years 2–4. TAD = maintenance investment. Asset investment $2.7m year 1, then $2.13 per $1 increase in PBIT for years 2–4. After-tax synergies $9.2m/year for years 1–4. From year 5: FCF growth 3% in perpetuity.\n\nShare-for-share: 1 Fraser share for 3 Joshua shares. Minimum acquisition premium 35% (same as last year). Fraser\'s founder/majority shareholder will not approve a deal that reduces annual dividend income. Joshua\'s debt covenant restricts dividends to 25% of each year\'s free cash flow to firm.\n\nOther: corporation tax 18%. Risk-free rate 3.7%. Market risk premium 8.1%.',
      },
      {
        title: 'Exhibit 3 — Share buyback',
        content: 'No formal takeover offers yet. The board wants to be prepared in case Joshua\'s own takeover of Fraser is not viable. Topics for the next board meeting include using a share buyback as a defence tactic — Joshua buying and cancelling some of its own shares. The CEO has asked for advice on the credibility of such a defence and would like to discuss the effect on EPS, cost of capital and share price, in the context of liquidity problems and a further bank covenant restricting what assets can be disposed of.',
      },
    ],

    keyAnswerTips: 'Five sub-parts in (b), each with its own deliverable. Do not skip (b)(v) — the share-buyback discussion is 5 marks plus contributes to professional skills (scepticism), and it is independent of the FCFE calculations. The minimum acquisition premium is 35% — Fraser shareholders\' actual gain of 37.1% is just above this floor, so the deal scrapes through. Joshua shareholders only gain 0.3% so management needs to communicate the strategic rationale carefully.',

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
  // 12. PRYSOR CO — Mar/Jun 2022 — Section A
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'prysor',
    name: 'Prysor Co',
    session: 'Mar/Jun 2022',
    paperSection: 'A',
    totalMarks: 50,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['International NPV', 'Sensitivity', 'Duration', 'WTO', 'Going concern'],
    difficulty: 4,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The investment',
        title: 'Prysor: Marteg-based multinational, building a phone subsidiary in Elan',
        content: 'Prysor Co (Marteg, currency M$) is considering establishing a subsidiary in Elan (currency ED) to manufacture and sell a new mobile phone. 4-year board horizon, but subsidiary may operate longer — board would consider a going-concern offer.\n\nMarteg and Elan have a free trade agreement under WTO rules. Elan also trades on WTO terms with all other countries.\n\nUnit volumes: 50,000 / 65,000 / 83,000 / 90,000.\nSelling price ED160 yr1, +5%/year (years 2–4). Revenue (ED 000): 8,000 / 10,920 / 14,641 / 16,670.',
      },
      {
        id: 'component',
        navLabel: '2. The Marteg component',
        title: 'The transfer-price + lost-contribution interaction',
        content: 'The new phone needs a component made in Marteg, transferred to Elan at M$7/unit in year 1. Transfer price grows at MARTEG inflation. The Marteg parent earns 35% pre-tax contribution on the component (so cost = 65% × transfer price; contribution = 35% × transfer price).\n\nThe new phone cannibalises an existing phone: pre-tax contribution LOST from the existing-phone sales = M$400,000 in yr1, growing at Marteg inflation.\n\nOther Elan costs (after inflation, ED 000): 3,508 / 4,934 / 6,230 / 6,685.',
        warning: 'Three Marteg-side adjustments to remember: (1) the parent\'s 35% contribution on the component (a CASH INFLOW to Marteg, taxed at 30%); (2) the lost contribution from the existing phone (a CASH OUTFLOW, taxed at 30%); (3) both grow at Marteg inflation, not Elan inflation.',
      },
      {
        id: 'tax',
        navLabel: '3. Tax + capex',
        title: 'Bilateral treaty, tax holiday and TAD',
        content: 'Initial NCA investment: ED14,460,000.\nResidual value end of year 4 (if NOT sold as going concern): ED3,400,000.\n\nTAD (deductible in Elan): yr1 ED3,615 / yr2 ED2,711 / yr3 ED2,033 / yr4 balancing allowance ED2,701.\n\nElan tax 20% on profits — but EXEMPT years 1–2 (tax holiday).\nMarteg tax 30%. Bilateral treaty: Prysor is ASSUMED to have paid Elan 20% in ALL 4 years (i.e. years 1 and 2 the tax holiday doesn\'t change the Marteg top-up calculation).\nMarteg top-up: 30% − 20% = 10% on Elatian taxable profits, all 4 years.\n\nNo additional working capital. All post-tax cash flows remitted.\nOpening rate: ED2.6000 = M$1. Discount rate 14%.\n\nInflation: Elan 6% / 4% / 3% / 3%; Marteg 10% / 9% / 8% / 7%.',
        warning: 'The tax holiday is in ELAN only. The bilateral treaty wording "assumed to have paid Elan tax at 20% in all 4 years" means Marteg always charges only the 10% top-up — even in years 1 and 2 when Elan actually charged 0%. This is a generous treaty assumption that flatters years 1–2 cash flows.',
      },
      {
        id: 'sensitivity',
        navLabel: '4. Sensitivity + duration',
        title: 'The directors\' two specific questions',
        content: 'The directors are concerned about how low the initial selling price could go before the project breaks even. Part (b)(iii) asks for the % change in initial selling price that would make NPV zero, based on the PV of sales revenue.\n\nThey also want to know how long it will take the investment to contribute value. The FD has suggested DURATION as the metric. Part (b)(iii) asks for the investment\'s duration.\n\nPart (b)(iv) then asks for a discussion of the significance and concerns with both calculations.',
        warning: 'Duration in AFM is computed on cash flows, not just inflows. It tells you when, on average, the project pays back in PV terms. The earlier the duration, the lower the project\'s exposure to long-term forecasting error.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 4,
        requirement: 'Explain the role of the World Trade Organisation and assess the implications for Prysor Co of the free trade agreement between Elan and Marteg in the context of the World Trade Organisation\'s requirements.',
        markingPoints: [
          { description: 'WTO\'s aim: reduce barriers to trade (tariffs, quotas, restrictions)', marks: 1 },
          { description: 'Most-favoured-nation principle: reductions offered to one member offered to all', marks: 1 },
          { description: 'Free-trade-area exception: members may give preferential treatment within the FTA', marks: 1 },
          { description: 'Implication for Prysor: components into Elan and any sales back to Marteg benefit; but sales to non-FTA countries face tariffs', marks: 1 },
        ],
      },
      {
        label: '(b)(i)',
        marks: 17,
        requirement: 'Evaluate the financial acceptability of the investment in Elan.',
        markingPoints: [
          { description: 'Sales revenue years 1–4 (given as ED 000: 8,000 / 10,920 / 14,641 / 16,670)', marks: 1 },
          { description: 'Other costs (given, inflated): 3,508 / 4,934 / 6,230 / 6,685', marks: 1 },
          { description: 'Component cost in ED: M$7 × volume × Marteg inflation / exchange rate at PPP', marks: 2 },
          { description: 'TAD: 3,615 / 2,711 / 2,033 / 2,701 (balancing allowance yr4)', marks: 1 },
          { description: 'Elan tax 20%, exempt years 1–2', marks: 1 },
          { description: 'Residual value yr4: ED3,400,000', marks: 1 },
          { description: 'Translate to M$ at PPP exchange rates each year', marks: 2 },
          { description: 'Marteg-side 35% contribution on component (M$, inflated, taxed at 30%)', marks: 1 },
          { description: 'Marteg-side lost contribution M$400k yr1 inflated (cash outflow, tax relief at 30%)', marks: 1 },
          { description: 'Bilateral treaty: Marteg 10% top-up tax on Elatian taxable profits all 4 yrs', marks: 2 },
          { description: 'Discount at 14% and sum to NPV', marks: 2 },
          { description: 'Recommendation based on NPV sign and magnitude', marks: 2 },
        ],
      },
      {
        label: '(b)(ii)',
        marks: 5,
        requirement: 'Discuss the assumptions made with respect to the calculations in (b)(i) above.',
        markingPoints: [
          { description: 'Sales volumes / selling-price growth / cost inflation assumed accurate — significant uncertainty', marks: 1 },
          { description: 'PPP holds for FX translation — empirically only a long-run approximation', marks: 1 },
          { description: 'Tax holiday and bilateral treaty hold for the project\'s lifetime — political risk', marks: 1 },
          { description: 'Lost contribution from existing phone may be over- or under-estimated', marks: 1 },
          { description: 'Project ends after 4 years — going-concern offer not modelled, may add value', marks: 1 },
        ],
      },
      {
        label: '(b)(iii)',
        marks: 8,
        requirement: 'Calculate the investment\'s duration (2 marks) and the % change in initial selling price required for the investment to have a zero net present value, based on sales revenue (6 marks).',
        markingPoints: [
          { description: 'Duration: Σ(year × PV) / Σ(PV) — explicit table', marks: 2 },
          { description: 'Sensitivity: PV of selling-price-related sales revenue in M$', marks: 2 },
          { description: '% change = NPV / PV of sales revenue × 100%', marks: 2 },
          { description: 'Direction: a fall in selling price; quote the % drop required', marks: 2 },
        ],
      },
      {
        label: '(b)(iv)',
        marks: 6,
        requirement: 'Discuss the significance of, and concerns with, the calculations in (b)(iii) above.',
        markingPoints: [
          { description: 'Sensitivity tells you the % fall in initial selling price for NPV = 0', marks: 1 },
          { description: 'A small % means the project is very vulnerable to price-setting decisions', marks: 1 },
          { description: 'Sensitivity assumes only ONE variable changes at a time — unrealistic', marks: 1 },
          { description: 'Duration shows the average payback in PV terms; shorter = less exposure to forecasting error', marks: 1 },
          { description: 'Duration ignores volatility (only timing); should be used alongside scenario / Monte Carlo analysis', marks: 1 },
          { description: 'Practical recommendation: stress-test the price assumption before committing', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 10,
        requirement: 'Communication, analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Prysor Co\'s investment in Elan',
        content: 'Prysor Co is a multinational company, based in the country of Marteg (currency M$). Prysor Co\'s board is considering establishing a subsidiary in the country of Elan (currency ED) to manufacture and sell a new model of mobile phone.\n\nElan has free trade agreements in place with a number of countries, including Marteg, and trades on World Trade Organisation terms with other countries.',
      },
      {
        title: 'Exhibit 2 — Investment appraisal details',
        content: 'Board horizon 4 years; subsidiary may operate longer. Board would consider an offer for the subsidiary as a going concern.\n\nSales units and revenue (ED 000):\nYr1: 50,000 / 8,000\nYr2: 65,000 / 10,920\nYr3: 83,000 / 14,641\nYr4: 90,000 / 16,670\nBased on ED160 unit price yr1 +5%/year.\n\nNew phone needs a component made in Marteg, transferred to Elan at M$7/unit in year 1. Transfer price grows at Marteg inflation. Parent earns 35% pre-tax contribution on component sales to Elan.\n\nLost pre-tax contribution from sales of existing phone: M$400,000 yr1, +Marteg inflation each year.\n\nOther Elan costs (after inflation, ED 000): 3,508 / 4,934 / 6,230 / 6,685.\n\nImmediate NCA investment ED14,460,000. Realisable value yr4 = ED3,400,000 (if NOT sold as going concern).\n\nTAD (ED 000): yr1 3,615 / yr2 2,711 / yr3 2,033. Balancing allowance yr4 = ED2,701,000.\n\nTax: Elan 20% (EXEMPT years 1–2). Marteg 30%. Bilateral treaty: Prysor ASSUMED to have paid Elan 20% in ALL 4 years. Tax payable in year liability arises.\n\nNo additional working capital.\n\nInflation: Elan 6% / 4% / 3% / 3%; Marteg 10% / 9% / 8% / 7%.\nOpening exchange rate: ED2.6000 = M$1. Discount rate 14%.\n\nDirectors are concerned about (a) sensitivity to a lower initial selling price needed to establish the phone, and (b) how long the investment takes to contribute value — FD has suggested measuring this via duration.',
      },
    ],

    keyAnswerTips: 'Big and tricky international investment appraisal. Component cost and contribution are especially complex. A well-prepared candidate with good technique can pass by focusing on the simpler calculations and getting all written parts done in time. Don\'t spend 60 minutes on (b)(i) — leave time for (a), (b)(ii), (b)(iii) and (b)(iv) plus the 10 professional marks.',

    verifiedNumbers: [
      { value: 'ED14,460,000', description: 'Initial NCA investment', source: 'Q' },
      { value: 'ED2.6000 = M$1', description: 'Opening exchange rate', source: 'Q' },
      { value: '14%', description: 'Discount rate', source: 'Q' },
      { value: '20% / 30%', description: 'Elan / Marteg tax rates (Elan exempt yrs 1–2)', source: 'Q' },
      { value: '35%', description: 'Pre-tax contribution to Marteg parent on component', source: 'Q' },
      { value: 'M$400k', description: 'Lost contribution from existing phone yr1', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Build Elan-side cash flows in ED',
        explanation: 'Sales revenue is given (already inflated). Component cost in ED = M$7/unit × volume × Marteg inflation translated at the PPP exchange rate. Other costs given. TAD given. Tax: 0% years 1–2 (holiday), 20% years 3–4.',
      },
      {
        stepNumber: 2,
        title: 'Add Marteg-side adjustments',
        explanation: 'Component contribution to Marteg parent: 35% × transfer price × volume, in M$, taxed at 30%. Lost contribution from existing phone: M$400k yr1 × Marteg inflation, in M$, with 30% tax relief. Both are cash flows of the parent in M$ — do NOT translate them.',
      },
      {
        stepNumber: 3,
        title: 'Translate Elan cash flows to M$ at PPP and add the bilateral top-up',
        explanation: 'PPP rate each year: ED/M$ × (1 + ElanInflation) / (1 + MartegInflation). Translate the after-Elan-tax ED cash flow to M$. Then apply Marteg 10% top-up on Elatian taxable profit (all 4 years, even during the tax holiday — bilateral treaty wording).',
      },
      {
        stepNumber: 4,
        title: 'Discount and decide',
        explanation: 'Discount net M$ cash flows at 14%. Sum to NPV. Compare to zero. Then compute sensitivity and duration to address parts (b)(iii) and (iv).',
        formula: 'Duration: Σ(year × PV) / Σ(PV)\nSensitivity to selling price: NPV / PV of revenue × 100% = % fall in price for NPV = 0',
      },
    ],

    examinerFeedback: {
      didWell: 'Strong candidates correctly applied PPP, the dual-tax structure, and the bilateral treaty top-up. Most identified the lost-contribution adjustment.',
      commonErrors: 'Component cost was frequently miscalculated — many forgot to apply Marteg inflation or applied Elan inflation by mistake. The bilateral treaty\'s "assumed Elan tax paid" wording was missed by many, who computed zero top-up during the tax-holiday years. Duration was poorly attempted.',
      tutorTip: 'For duration: column 1 = year, column 2 = PV of that year\'s cash flow, column 3 = col 1 × col 2. Sum col 3 ÷ sum col 2 = duration. Show the table explicitly even if a number is wrong — the structure earns marks.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // 13. FRONGOCH CO — Mar/Jun 2022 — Section B
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'frongoch',
    name: 'Frongoch Co',
    session: 'Mar/Jun 2022',
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
        content: 'Frongoch Co is a US company with a centralised US treasury function. Today: 1 March. Payment due: €18,250,000 to a German supplier on 1 August (5 months).\n\nMarket data:\n• Spot: $1.1483 – $1.1497 per €1\n• 5-month forward: $1.1528 – $1.1544 per €1\n• September € futures price: $1.1560 (contract size €125,000)\n• Call options at 1.1540 strike (US cents/€): Mar 0.54 / Jun 0.61 / Sep 0.69\n• Put options at 1.1540 strike: Mar 0.79 / Jun 0.90 / Sep 1.02\n\nFutures and options mature at month end.',
        warning: 'Frongoch is PAYING EUR → BUYING EUR → use CALL options on EUR (not puts). Common error: candidates pick puts because they\'re hedging an outflow.',
      },
      {
        id: 'scenarios',
        navLabel: '2. Two outcome scenarios',
        title: 'What if the rates move? Part (b) tests this',
        content: 'Scenario (i) at 1 August:\n• Spot: 1.1519 – 1.1534\n• 5-month forward: 1.1565 – 1.1581\n• September futures: 1.1552\n\nScenario (ii) at 1 August:\n• Spot: 1.1532 – 1.1549\n• 5-month forward: 1.1566 – 1.1584\n• September futures: 1.1563\n\nKey insight: forward result is UNCHANGED in both scenarios (locked in 1 March). Futures result varies via basis risk. Options change behaviour — under scenario (i) they lapse (spot 1.1534 < strike 1.1540), under scenario (ii) they\'re exercised (spot 1.1549 > strike 1.1540).',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 9,
        requirement: 'Recommend, on financial grounds, a hedging strategy for the €18,250,000 payment using the market data available on 1 March (Exhibit 1) and assuming the options are exercised. Assume basis diminishes to zero at contract maturity at a constant rate, based on monthly intervals.',
        markingPoints: [
          { description: 'Forward: €18,250,000 × 1.1544 = $21,067,800', marks: 1 },
          { description: 'Futures: BUY September € futures (paying EUR = buying EUR)', marks: 1 },
          { description: 'Basis at 1 March: 1.1497 − 1.1560 = −0.0063 (using bid spot)', marks: 1 },
          { description: 'Unexpired basis at 1 Aug (2 of 7 months remaining): 2/7 × −0.0063 = −0.0018', marks: 1 },
          { description: 'Lock-in rate: 1.1560 − 0.0018 = 1.1542', marks: 1 },
          { description: 'Contracts = €18,250,000 / €125,000 = 146', marks: 1 },
          { description: 'Futures outcome: 146 × €125,000 × 1.1542 = $21,064,150', marks: 1 },
          { description: 'Options: BUY 146 September call options at 1.1540 strike; premium 146 × $0.0069 × 125,000 = $125,925', marks: 1 },
          { description: 'Options outcome if exercised: 146 × €125,000 × 1.1540 + $125,925 = $21,186,425; RECOMMEND FUTURES (lowest cost)', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 6,
        requirement: 'Evaluate the impact on the results of using the three hedging instruments being considered if the rates and futures prices are as per scenarios (i) and (ii) on 1 August (Exhibit 2).',
        markingPoints: [
          { description: 'Forward unchanged at $21,067,800 in BOTH scenarios (rate locked 1 Mar)', marks: 1 },
          { description: 'Scenario (i) futures: basis difference 1.1552 − 1.1534 = 0.0018, same as predicted → same outcome $21,064,150', marks: 1 },
          { description: 'Scenario (i) options: spot 1.1534 < strike 1.1540 → LAPSE; pay spot $21,049,550 + premium $125,925 = $21,175,475', marks: 1 },
          { description: 'Scenario (ii) futures: basis difference may differ from predicted → outcome varies', marks: 1 },
          { description: 'Scenario (ii) options: spot 1.1549 > strike 1.1540 → EXERCISE; same outcome as (a) $21,186,425', marks: 1 },
          { description: 'Discussion: forward eliminates uncertainty; futures partially exposed to basis risk; options behaviour depends on strike vs spot', marks: 1 },
        ],
      },
      {
        label: '(c)',
        marks: 5,
        requirement: 'Explain what is meant by basis and basis risk, and discuss the impact of basis risk on the hedging decision being considered in (a) and (b).',
        markingPoints: [
          { description: 'Basis = difference between spot price and futures price for the same maturity', marks: 1 },
          { description: 'Basis diminishes to zero at contract maturity (convergence)', marks: 1 },
          { description: 'Basis risk = risk that basis does not diminish linearly as assumed', marks: 1 },
          { description: 'Impact on Frongoch: futures hedge result depends on actual unexpired basis at 1 Aug, which may differ from the linear-decay assumption', marks: 1 },
          { description: 'Basis risk is NOT eliminated by hedging with futures — only currency risk is', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Frongoch Co hedging a payment',
        content: 'Frongoch Co is an American company, with a centralised treasury function based in the US. Today\'s date is 1 March. Frongoch Co\'s treasury team is currently looking at hedging a payment of €18,250,000 to a German supplier, which Frongoch Co is due to make on 1 August.\n\nExchange rates (quoted as US$ per €1):\nSpot 1 March: 1.1483 – 1.1497\nFive months forward: 1.1528 – 1.1544\n\nCurrency futures (contract size €125,000, price quoted as US$ per €1):\nSeptember: 1.1560\n\nCurrency options (contract size €125,000, exercise price as US$ per €1, premium in US cents per €1):\n               Calls                        Puts\nExercise   Mar    Jun    Sep         Mar    Jun    Sep\n1.1540    0.54   0.61   0.69        0.79   0.90   1.02\n\nFutures and options mature at month end.',
      },
      {
        title: 'Exhibit 2 — Alternative exchange rate scenarios at 1 August',
        content: 'Scenario (i) at 1 August:\nSpot: 1.1519 – 1.1534\nFive months forward: 1.1565 – 1.1581\nSeptember futures: 1.1552\n\nScenario (ii) at 1 August:\nSpot: 1.1532 – 1.1549\nFive months forward: 1.1566 – 1.1584\nSeptember futures: 1.1563\n\nThe treasury team has been asked to consider these scenarios alongside the significance of basis risk in deciding how the risk should be hedged.',
      },
    ],

    keyAnswerTips: 'Frongoch PAYS €. Paying = buying. Buying EUR = CALL options on EUR (not puts). Standard 3-way hedge comparison: forward $21,067,800; futures $21,064,150 (cheapest in baseline scenario); options $21,186,425 if exercised. In part (b) under scenario (i), the spot moves IN FRONGOCH\'S FAVOUR enough that the option lapses — and even then the premium is sunk, so options still cost more than spot purchase. Forward = certainty, futures = exposure to basis risk, options = exposure to strike-vs-spot.',

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
  // CHARBOROUGH CO — Mar/Jun 2022 — Section B Q2
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'charborough',
    name: 'Charborough Co',
    session: 'Mar/Jun 2022',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['Demerger', 'FCF valuation', 'EPS', 'WACC', 'Asset beta ungearing'],
    difficulty: 4,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'business',
        navLabel: '1. The business',
        title: 'CC: 20-year-old coffee chain considering selling the coffee shops',
        content: 'Charborough Co (CC) was established 20 years ago as a high-quality coffee chain. Listed 6 years ago. Used the IPO proceeds to buy a struggling fast-food chain and rebrand it as a fruit juice bar chain.\n\nTwo divisions now:\n• Coffee shops — historically the cash engine, but growth has slowed in the last 2 years and significant refurbishment expenditure is needed.\n• Juice bars — successful with fashionable young customers, but capital-hungry. Until recently funded by surpluses from coffee shops.\n\nA competitor has enquired about buying the coffee shops. Board likely to accept a reasonable offer because (a) juice bars offer better growth prospects, and (b) sale proceeds would fund juice bar expansion and refurbishment.',
      },
      {
        id: 'sale',
        navLabel: '2. Sale terms + assumptions',
        title: 'How the coffee-shop sale price is calculated',
        content: 'Sale price = PV of future free cash flows (DCF valuation).\n\nCoffee shop after-tax profits ($m): yr1 296 / yr2 328 / yr3 360 / yr4 388.\nCC total after-tax profits including coffee shops (yr1): $658m. Assume after-tax profits = after-tax cash flows.\n\nCapital investment in coffee shops: $60m yr1. In yrs 2–4: increases by $0.50 per $1 of after-tax profit increase.\nAfter yr 4: free cash flows grow at 3.5% per year forever.\nDiscount rate: CURRENT WACC = 10%.\n\nProceeds used FIRST to pay off the 9% loan notes ($1,700m). Remaining proceeds invested in juice bar non-current assets at a 17% pre-tax return.\n\nNet book value of coffee shop NCAs: $3,350m. Profit on sale goes directly to retained earnings.',
        warning: 'Sale price valuation uses CURRENT WACC of 10% even though WACC will fall to a different value after the sale (capital structure changes). The question is explicit. Many candidates re-derive a post-sale WACC and discount with that — don\'t.',
      },
      {
        id: 'capital',
        navLabel: '3. Capital structure',
        title: 'CC balance sheet pre-sale and post-sale',
        content: 'CC pre-sale balance sheet ($m):\nNCA 6,625 / CA 535 / Total 7,160\nShare capital 500 / Retained earnings 2,930 / Equity 3,430\n9% loan notes 1,700 / Bank loans 1,575 / NCL 3,275\nCurrent liabilities 455 / Total 7,160\n\n500 million $1 shares trading at $8 per share. Expected to rise 5% after the sale (improved juice-bar prospects).\nPre-tax cost of debt: 8% currently, falls to 7% after loan notes redeemed.\nJuice bars asset beta: 0.7. Risk-free rate 4%. Market return 11%. Tax 25%.',
      },
      {
        id: 'discussion',
        navLabel: '4. Sale discussion',
        title: 'Arguments for and against the sale',
        content: 'FOR the sale:\n• Cash to refurbish juice bars (which need it) and to expand them.\n• Removes the coffee-shop refurbishment liability ($significant unknown).\n• Removes the 9% loan notes → lower cost of debt going forward (8% → 7%).\n• Focuses CC on growth (juice bars) rather than mature/declining coffee shops.\n• Profit on sale of $534m boosts retained earnings.\n\nAGAINST the sale:\n• Coffee shops still profitable; predicted future cash flows are substantial.\n• Juice bars are a single business unit — less diversification.\n• Buyer\'s offer may not match true value (could be opportunistic).\n• Coffee-shop refurbishment might restore growth at lower cost than walking away.\n• 17% return assumption on new juice-bar investment is optimistic and unproven.\n• Loss of revenue diversity could increase business risk.',
      },
    ],

    questionParts: [
      {
        label: '(a)(i)',
        marks: 4,
        requirement: 'Calculate the expected sale price of the coffee shops.',
        markingPoints: [
          { description: 'Capital investment yrs 2–4: $0.50 × ΔPAT each year (76 / 92 / 106)', marks: 1 },
          { description: 'Free cash flow = PAT − capital investment: 236 / 252 / 268 / 282', marks: 1 },
          { description: 'PV at 10% yrs 1–4 = $817m', marks: 1 },
          { description: 'Terminal value at end of yr 4 = $282m × 1.035 / (0.10 − 0.035), discount = $3,067m; total = $3,884m', marks: 1 },
        ],
      },
      {
        label: '(a)(ii)',
        marks: 9,
        requirement: 'Calculate the impact of the sale of the coffee shops on CC\'s forecast statement of financial position, forecast earnings per share, and weighted average cost of capital.',
        markingPoints: [
          { description: 'Profit on sale = $3,884m − $3,350m = $534m → retained earnings', marks: 1 },
          { description: 'Cash flow application: $1,700m repays loan notes; $2,184m goes into juice bar NCA', marks: 2 },
          { description: 'Revised balance sheet: NCA $5,459m / equity $3,964m / NCL $1,575m / total $5,994m', marks: 1 },
          { description: 'EPS impact: lose $296m PAT, gain interest saved $115m + return on new NCA $278m = +$97m', marks: 1 },
          { description: 'Adjusted EPS: $755m / 500m shares = $1.51 (up from $1.32)', marks: 1 },
          { description: 'WACC: re-gear asset beta 0.7 with new debt ratio → equity beta ≈ 0.897', marks: 1 },
          { description: 'Cost of equity = 4% + (11% − 4%) × 0.897 ≈ 10.2%', marks: 1 },
          { description: 'WACC = Ke × E/(D+E) + Kd(1−t) × D/(D+E); recompute and recommend', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 7,
        requirement: 'Evaluate the arguments for and against the decision to sell the coffee shops.',
        markingPoints: [
          { description: 'FOR: cash to refurbish + expand juice bars; refurbishment liability removed', marks: 1 },
          { description: 'FOR: lower cost of debt (8% → 7%) when loan notes redeemed', marks: 1 },
          { description: 'FOR: strategic focus on growth business', marks: 1 },
          { description: 'AGAINST: coffee shops still profitable; cannibalised future cash flows', marks: 1 },
          { description: 'AGAINST: loss of business diversification — concentration risk in juice bars', marks: 1 },
          { description: 'AGAINST: 17% return on juice-bar reinvestment is optimistic and unproven', marks: 1 },
          { description: 'Recommendation with justification (e.g. accept only if offer ≥ DCF value)', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Introduction: Charborough Co',
        content: 'Charborough Co (CC) was established 20 years ago offering high-quality coffee at a reasonable price. As well as offering takeaway coffees, CC marketed its coffee shops as being comfortable places in which to spend time and meet friends. For most of its life, CC\'s coffee shops have outperformed its competitors and CC was able to obtain a listing six years ago.\n\nMost of the funds obtained from the listing were used to buy a struggling fast food chain and rebrand it as a fruit juice bar chain. The fruit juice bar chain and coffee shops are now separate divisions within CC.\n\nThe fruit juice bars offer a mix of drinks and salads with flavours from around the world. This chain has been successful in attracting fashionable young customers but has required considerable investment. Up until recently, much of this investment has come from surpluses generated by CC\'s coffee shops.\n\nHowever, the growth in the profits of the coffee shops has slowed in the last two years. Customer and media comment has suggested that CC\'s coffee shops now need significant refurbishment expenditure.\n\nCompetition in the coffee shop sector has led to some mergers between rival chains. CC has just received an enquiry from a competitor about whether it would be interested in selling its coffee shops. CC\'s board is likely to accept a reasonable offer for its coffee shops, as it believes the juice bars offer more prospects for future growth. A large cash inflow from the sale would fund further expansion and refurbishment of existing juice bars over the next few years.',
      },
      {
        title: 'Exhibit 2 — Sale of coffee shops',
        content: 'Sale price = sum of PV of predicted future free cash flows.\n\n1. Coffee-shop after-tax profits ($m): yr1 296 / yr2 328 / yr3 360 / yr4 388. CC total after-tax profits (yr1, incl. coffee shops): $658m. Assume after-tax profits = after-tax cash flows.\n\n2. Capital investment in coffee shops: $60m yr1. Yrs 2–4: increases by $0.50 per $1 increase in after-tax profits.\n\n3. After yr 4: free cash flows grow at 3.5% per year for the foreseeable future.\n\n4. Discount rate: current WACC = 10%.',
      },
      {
        title: 'Exhibit 3 — CC\'s statement of financial position',
        content: 'CC pre-sale balance sheet ($m):\n\nAssets\nNon-current assets         6,625\nCurrent assets               535\nTotal assets               7,160\n\nEquity and liabilities\nCalled-up share capital      500\nRetained earnings          2,930\nTotal equity               3,430\n\nNon-current liabilities\n9% loan notes              1,700\nBank loans                 1,575\nTotal NCL                  3,275\n\nCurrent liabilities          455\nTotal equity + liabilities 7,160',
      },
      {
        title: 'Exhibit 4 — Other information',
        content: '1. Proceeds used FIRST to pay off the 9% loan notes. Remaining proceeds invested in enhancement expenditure on juice bar non-current assets. Juice-bar new NCA expected to earn 17% pre-tax return.\n2. Current NBV of coffee-shop NCAs = $3,350m. Profit on sale goes directly to retained earnings.\n3. Current assets and liabilities unchanged.\n4. Overall pre-tax cost of debt currently 8%; falls to 7% when 9% loan notes redeemed.\n5. 500 million $1 shares currently trading at $8 per share. Expected to rise 5% as a result of the sale and improved juice-bar prospects.\n6. Juice bars asset beta: 0.7.\n7. Tax 25% on profits.\n8. Risk-free rate 4%, market return 11%.',
      },
    ],

    keyAnswerTips: 'A question that integrates lots of syllabus areas — DCF valuation, balance-sheet impact, EPS, WACC, plus a discursive evaluation. Leave time for part (b) (7 marks plus 5 prof = 12 marks). Sale price valuation uses CURRENT WACC of 10%; the post-sale WACC is only needed for part (a)(ii). Re-gear the juice-bar asset beta 0.7 using the new debt:equity ratio to get the new equity beta (≈0.897), then CAPM to get new Ke (≈10.2%).',

    verifiedNumbers: [
      { value: '$3,884m', description: 'Coffee shops DCF valuation (PV $817m + terminal $3,067m)', source: 'S' },
      { value: '$534m', description: 'Profit on sale ($3,884m − $3,350m NBV)', source: 'S' },
      { value: '$2,184m', description: 'Cash for juice-bar NCA after repaying loan notes', source: 'S' },
      { value: '$1.51 EPS', description: 'Revised EPS (up from $1.32)', source: 'S' },
      { value: '0.897 / 10.2%', description: 'Re-geared equity beta and revised Ke', source: 'S' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Compute the sale price as DCF of future free cash flows',
        explanation: 'FCF = PAT − capital investment. Capital investment yr1 = $60m given; yrs 2–4 = $0.50 × ΔPAT.',
        formula: 'PAT ($m):     296 / 328 / 360 / 388\nCapex ($m):    60 /  76 /  92 / 106 (yrs 2-4: $0.50 × ΔPAT)\nFCF ($m):     236 / 252 / 268 / 282\nDF @ 10%:   0.909/0.826/0.751/0.683\nPV ($m):      215 / 208 / 201 / 193 → sum $817m\nTerminal value at end of yr 4 = $282m × 1.035 / (0.10 − 0.035) = $4,490m\nPV of TV = $4,490m × 0.683 = $3,067m\nTotal sale price = $817m + $3,067m = $3,884m',
        verifiedNumbers: ['$3,884m — verified from Kaplan Solution Pack MJ22'],
      },
      {
        stepNumber: 2,
        title: 'Roll the sale through the balance sheet',
        explanation: 'Profit on sale = $3,884m − $3,350m NBV = $534m → retained earnings. Cash proceeds split: $1,700m repays loan notes, $2,184m invested in juice-bar NCA. Result: NCA $5,459m, equity $3,964m, NCL $1,575m, total $5,994m.',
        verifiedNumbers: ['Revised balance sheet totals $5,994m — verified from Kaplan model answer'],
      },
      {
        stepNumber: 3,
        title: 'Forecast revised EPS',
        explanation: 'Start with $658m baseline. Subtract $296m of coffee-shop PAT. Add interest saved net of tax: $1,700m × 9% × (1 − 25%) = $115m. Add return on new juice-bar NCA net of tax: $2,184m × 17% × (1 − 25%) = $278m. Revised profit $755m ÷ 500m shares = $1.51.',
        verifiedNumbers: ['$1.51 EPS (up from $1.32) — verified'],
      },
      {
        stepNumber: 4,
        title: 'Re-gear the juice-bar asset beta and re-compute WACC',
        explanation: 'Equity beta = 0.7 × (Ve + Vd(1 − t)) / Ve, with new equity value (500m × $8 × 1.05 = $4,200m) and remaining debt $1,575m. ≈ 0.897. Cost of equity = 4% + (11% − 4%) × 0.897 = 10.28%. Use new pre-tax cost of debt 7% × (1 − 25%) = 5.25%. Combine with new D/E weights for revised WACC.',
        verifiedNumbers: ['Equity beta 0.897, Ke 10.2% — verified from Kaplan model answer'],
      },
      {
        stepNumber: 5,
        title: 'Evaluate the sale decision (part b)',
        explanation: 'For: cash for juice bar refurb/expansion; refurbishment liability removed; lower cost of debt; strategic focus. Against: cannibalising profitable coffee business; concentration risk; 17% juice-bar return is unproven; offer may be opportunistic. Recommendation: accept only if competitor\'s offer ≥ the calculated $3,884m DCF value (or close to it).',
      },
    ],

    examinerFeedback: {
      didWell: 'DCF valuation was generally correctly structured. Most candidates correctly computed the $0.50 × ΔPAT capital investment rule.',
      commonErrors: 'Capital investment was often calculated on TOTAL PAT rather than the INCREASE in PAT. Terminal value timing errors (discounting from yr 5 instead of treating as a yr 4 sum). Re-gearing the equity beta was poorly attempted — many used the wrong formula direction.',
      tutorTip: 'Two recipes: (1) capital investment in yrs 2–4 = $0.50 × ΔPAT, where ΔPAT = PAT(yr n) − PAT(yr n−1). (2) Re-gearing: βe = βa × (Ve + Vd(1−t)) / Ve. The factor in the brackets is ALWAYS bigger than Ve, so βe > βa. If your βe < βa you\'ve inverted the formula.',
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
      {
        label: '(a)',
        marks: 12,
        requirement: 'Evaluate the financial acceptability of the proposed investment.',
        examinerCommentary: 'Many candidates produced workings without naming the specific real options visible in the scenario. The base NPV is negative ($2,221k) — the discussion mark is for recognising that flexibility (phased investment, abandon if mathematics sales disappoint) is what could make the project worthwhile.',
      },
      {
        label: '(b)',
        marks: 8,
        requirement: 'Discuss, with reference to Tonpantau Co\'s proposed investment: how real options build on traditional net present value analysis when evaluating investment decisions; and the problems with incorporating and valuing real options. Your answer should make specific reference to the Black-Scholes model.',
        examinerCommentary: 'Many candidates produced generic lists of real option types (delay, expand, abandon) without identifying which specific options were available to Tonpantau Co in the scenario. The examiner called this out explicitly. Always name the actual options visible in the scenario first.',
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Tonpantau Co proposed investment',
        content: 'Tonpantau Co is a publishing company, currently publishing mathematics and business studies texts and online study material for schools. The company is considering entering new markets in these subject areas. Initially, it will produce material for mathematics degree courses, but then it plans to produce material for other university courses and professional qualifications.\n\nTonpantau Co\'s directors feel that the decision to invest being made in phases, and the possibility of not pursuing the investment further if sales of the mathematics material are disappointing, are significant. However, they are unsure how to incorporate these factors into the investment appraisal. Tonpantau Co\'s directors are also uncertain about whether its closest competitors have any plans to enter these new markets, or how its competitors will react if Tonpantau Co is successful in its new markets.',
      },
      {
        title: 'Exhibit 2 — Detailed investment',
        content: 'Four-year time horizon based on current plans.\n\nPlanned capital expenditure: Year 0 $20,000k, Year 1 $20,000k, Year 2 $12,000k.\n\nWorking capital at the start of each year: Year 1 $3,000k, Year 2 $3,450k, Year 3 $4,000k, Year 4 $3,800k. Released in full at end of year 4.\n\nForecast pre-tax profits (after deduction of TAD, which equals accounting depreciation):\nYear 1: TAD $2,600k, pre-tax profit $8,700k\nYear 2: TAD $5,200k, pre-tax profit $11,600k\nYear 3: TAD $6,700k, pre-tax profit $15,200k\nYear 4: TAD $6,700k, pre-tax profit $15,500k\nTax payable at 20% in the year profits are made.\n\nBodfari Co is a comparable: debt/equity 25:75, equity beta 1.60. Tonpantau debt/equity 40:60. Risk-free rate 4.25%. MRP 5.5%. Debt beta = 0 for cost of capital estimation.\n\nTonpantau debt: 6% bond, $100 nominal, 4% premium on redemption in 4 years, annual coupon. Spot rates: 1yr 4.33%, 2yr 5.15%, 3yr 5.93%, 4yr 6.58%.',
      },
    ],

    verifiedNumbers: [
      { value: '($2,221k)', description: 'Base NPV (NEGATIVE — flexibility may rescue it)', source: 'A' },
      { value: '11%', description: 'WACC (derived from ungeared beta of Bodfari)', source: 'A' },
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
  // PROPLEIS / ADICTCAN CO — Dec 2022 — Section B
  // Source: Kaplan Exam Kit 2024-25 (verbatim) + ACCA Model Answer
  // ─────────────────────────────────────────────
  {
    id: 'propleis',
    name: 'Propleis / Adictcan Co',
    session: 'Dec 2022',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['M&A', 'FCFF', 'Synergies', 'Integration'],
    difficulty: 3,
    primarySource: 'A',

    scenarioSteps: [
      {
        id: 'companies',
        navLabel: '1. The companies',
        title: 'Propleis (acquirer) and Adictcan (target)',
        content: 'Both listed publishers. Propleis publishes property and lifestyle magazines (young in-house staff, high churn). Adictcan publishes professional-sports magazines (long-tenured specialist writers, current sports stars contribute, managerial autonomy given to most successful magazines).\n\nOnline: Propleis has won awards for e-marketing. Adictcan\'s website is criticised as old-fashioned but its online-only content writing is rated highly.\n\nPropleis is planning a takeover bid. Anticipated synergies: online presence, marketing, cross-selling, and savings in staff, administration and paper costs.',
        warning: 'Adictcan\'s strength is content quality and autonomy. Propleis\'s integration plan must avoid destroying these by imposing Propleis processes. The "synergies in staff" risk losing the specialist writers and sports stars who differentiate Adictcan\'s product.',
      },
      {
        id: 'valuation',
        navLabel: '2. Valuation inputs',
        title: 'FCFF inputs and target premium',
        content: 'Market value of equity — Propleis $620m, Adictcan $340m.\n\nAdictcan board says shareholders expect a premium of 20% above current equity value. Propleis board feels its shareholders will expect a gain of at least 20% of current equity value.\n\nFCFF method inputs:\n- Year 1 sales $720m (sum of both companies); years 2–4 sales growth 8%/year.\n- Post-tax operating cash flows: 14% of sales each year.\n- Additional non-current asset investment: $25m year 1; then $0.30 per $1 of sales-revenue increase years 2–4.\n- Terminal year 5+: 4% growth in perpetuity.\n- Cost of capital: 10%. Target D/E = 1:3 in the combined company.',
        warning: 'The acquisition premium (20%) and the acquirer\'s required gain (20%) together cap the room for negotiation. If the synergistic value isn\'t big enough to satisfy both, the deal does not work financially.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 10,
        requirement: 'Estimate: the equity value of the combination of Propleis Co and Adictcan Co; and the benefits which would be gained by Propleis Co\'s shareholders from the acquisition.',
        markingPoints: [
          { description: 'Year 1–4 FCFF: 14% post-tax operating × sales − $25m yr1 / $0.30 × ΔSales yrs 2–4', marks: 3 },
          { description: 'Discount yrs 1–4 at 10% → PV ≈ $292m', marks: 2 },
          { description: 'Terminal value at end of year 4 = FCFF₅ / (0.10 − 0.04), discounted to today → ≈ $414m', marks: 2 },
          { description: 'Combined equity value ≈ $706m (apply D/E 1:3 if needed)', marks: 1 },
          { description: 'Acquisition premium for Adictcan = 20% × $340m = $68m; max Propleis can pay = combined − Propleis ex ante − Propleis required gain', marks: 1 },
          { description: 'Conclude whether deal creates enough value to satisfy both required gains', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 6,
        requirement: 'Discuss the assumptions made in the calculations in (a), including whether the expected synergies are likely to be achieved.',
        markingPoints: [
          { description: '8% sales growth assumes both companies grow at the same combined rate (challenging — historic Propleis ≠ Adictcan)', marks: 1 },
          { description: '14% operating margin is constant despite different cost structures of the two companies', marks: 1 },
          { description: 'Investment rule of $0.30 per $1 sales increase is generic — print/online mix matters', marks: 1 },
          { description: '4% perpetuity growth in a structurally declining print market is optimistic', marks: 1 },
          { description: 'Synergy realisation risk: Adictcan\'s value depends on long-tenured staff Propleis may displace', marks: 1 },
          { description: '10% WACC assumes the target D/E of 1:3 is achieved post-acquisition', marks: 1 },
        ],
      },
      {
        label: '(c)',
        marks: 4,
        requirement: 'Explain the actions which Propleis Co\'s board can take to ensure that the companies are integrated successfully and synergies are realised.',
        markingPoints: [
          { description: 'Retain Adictcan\'s key writing/managerial talent with lock-in arrangements', marks: 1 },
          { description: 'Keep autonomy of successful magazines — do not impose Propleis house style', marks: 1 },
          { description: 'Apply Propleis\'s e-marketing skill to Adictcan\'s online product', marks: 1 },
          { description: 'Communicate integration plan to staff early to limit attrition risk', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Propleis Co and Adictcan Co',
        content: 'Propleis Co and Adictcan Co are two listed publishing companies. Main focus is publishing magazines, with some linked books.\n\nPropleis publishes property and lifestyle magazines. Adictcan publishes magazines covering professional sports. Both publish a combination of recently established titles and longer-running titles.\n\nPropleis has an in-house team of staff writers and editors who are responsible for content. Most are young and tend to stay for a limited time before moving on. Adictcan has a team of in-house writers and editors for each magazine — specialists in the sport their magazines cover, who in some cases have worked for the magazines for many years. Currently successful sports stars also write for Adictcan\'s magazines. Adictcan\'s board has given the managerial and writing teams of the most successful magazines considerable autonomy in determining content and development.\n\nBoth companies have an online presence in addition to paper copies. Electronic subscribers can access some online-only content. Propleis has won awards for its online presence and e-marketing; Adictcan\'s website has been criticised for looking old-fashioned, but the main appeal of its online offering is the high quality of the writing that is only available online.\n\nPropleis is planning to make a takeover bid for Adictcan and has contacted Adictcan\'s board. Propleis\'s board believes the acquisition could provide synergies — particularly in online presence, marketing and cross-selling — and also savings in staff, administration and paper costs.',
      },
      {
        title: 'Exhibit 2 — Acquisition valuation',
        content: 'Current market value of equity: Propleis $620m, Adictcan $340m.\n\nAdictcan board: shareholders expect a premium of 20% above current equity value. Propleis board: its shareholders will also expect a gain of at least 20% of the current equity value of their shares from the acquisition.\n\nFCFF method inputs:\n• Expected sales revenue in the first year combined: $720m (sum of both companies\' most recent revenue). Expected sales growth in each of years 2–4: 8%.\n• Expected post-tax operating cash flows in each of years 1–4: 14% of sales revenue.\n• Additional investment in non-current assets: $25m in year 1, and $0.30 per $1 increase in sales revenue in each of years 2–4.\n• After year 4: expected annual growth rate of FCFF = 4% for the foreseeable future.\n• Cost of capital: 10%.\n• Target debt/equity ratio of the combined company: 1:3.',
      },
    ],

    keyAnswerTips: 'FCFF valuations are most often tested with three traps: (1) the additional investment rule applies to the INCREASE in sales (not total sales), (2) terminal value is calculated AT end of year 4 then discounted, not in year 5, and (3) "post-tax operating cash flow" = post-tax operating profit + depreciation when depreciation is non-cash — but here the 14% of sales figure is given as the cash flow directly, so don\'t double-count.',

    verifiedNumbers: [
      { value: '$292m', description: 'PV of FCFs years 1–4 (verified Kaplan model answer)', source: 'A' },
      { value: '$414m', description: 'PV of terminal value years 5+ (verified)', source: 'A' },
      { value: '$706m', description: 'Combined company equity value (verified)', source: 'A' },
      { value: '$68m', description: 'Adictcan minimum premium (20% × $340m)', source: 'A' },
      { value: '$124m', description: 'Propleis minimum required gain (20% × $620m)', source: 'A' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Build FCFF years 1–4',
        explanation: 'Sales: yr1 $720m, yr2 $777.6m (+8%), yr3 $839.8m, yr4 $907m. Post-tax operating cash flow = 14% × sales. Additional investment: $25m yr1, then $0.30 × (sales increase) yrs 2–4. FCFF = operating cash flow − additional investment.',
        formula: 'Year 1: $720m × 14% = $100.8m − $25m = $75.8m\nYear 2: $777.6m × 14% = $108.9m − ($777.6−$720)×0.30 = $108.9 − $17.3 = $91.6m\nYear 3: $839.8m × 14% = $117.6m − ($839.8−$777.6)×0.30 = $117.6 − $18.7 = $98.9m\nYear 4: $907m × 14% = $127.0m − ($907−$839.8)×0.30 = $127.0 − $20.2 = $106.8m',
      },
      {
        stepNumber: 2,
        title: 'Discount and add terminal value',
        explanation: 'Discount FCFFs years 1–4 at 10%. Terminal value at end of year 4 = FCFF₅ / (WACC − g) = (FCFF₄ × 1.04) / (0.10 − 0.04). Discount terminal value back 4 years to today. Sum PVs.',
        formula: 'PV yrs 1–4 ≈ $292m\nFCFF₅ = $106.8m × 1.04 ≈ $111.1m\nTV at end of yr 4 = $111.1m / 0.06 ≈ $1,851m\nPV of TV = $1,851m × 0.683 ≈ $414m\nCombined equity value ≈ $292m + $414m ≈ $706m',
        verifiedNumbers: ['$706m combined equity value — verified from Kaplan model answer Dec 2022'],
      },
      {
        stepNumber: 3,
        title: 'Check both sides\' required gains',
        explanation: 'Adictcan needs 20% × $340m = $68m premium. Propleis needs 20% × $620m = $124m gain. Total needed: $192m of value above the standalone $960m. Combined value $706m is BELOW the standalone total — so on these assumptions the deal does NOT create enough value to satisfy both sides. Either synergies must be higher than baked into the 14% margin, or one side must accept less. Many candidates report the $706m number without comparing it to the $960m standalone total — the whole point of the question is to test whether the deal works for both sides.',
      },
      {
        stepNumber: 4,
        title: 'Integration risk discussion',
        explanation: 'Adictcan\'s value rests on long-tenured specialist writers and high-quality online content. Propleis\'s strength is e-marketing. The classic synergy story works if Propleis applies its e-marketing to Adictcan\'s superior content WITHOUT displacing Adictcan\'s writers. Heavy-handed integration that imposes Propleis processes risks losing the talent and the content quality that justified paying any premium at all.',
      },
    ],

    examinerFeedback: {
      didWell: 'FCFF mechanics were generally correct. Most candidates correctly applied the 14% margin and the $0.30 reinvestment rule.',
      commonErrors: 'Many candidates calculated the combined value without comparing it to the standalone total of both companies — missing whether the deal actually creates synergy. Integration risks were discussed generically without referencing Adictcan\'s specialist writers and autonomy culture.',
      tutorTip: 'For every M&A valuation question, do three things: (1) calculate the combined value, (2) compare it to the standalone total of both companies, (3) state whether the difference (synergy value) is enough to satisfy BOTH sides\' minimum required gains. That third step is where most candidates lose marks.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // BLACKBOSCA CO — Mar/Jun 2023 — Section B
  // Source: Kaplan Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'blackbosca',
    name: 'Blackbosca Co',
    session: 'Mar/Jun 2023',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'B',
    topics: ['inv'],
    tags: ['International NPV', 'PPP', 'Country risk', 'Business risk'],
    difficulty: 4,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'company',
        navLabel: '1. The company',
        title: 'Blackbosca: Turkish food-delivery market leader expanding to Üskistan',
        content: 'Blackbosca Co is the market-leading online food delivery company in Turkey. The founder is CEO and majority shareholder. The company already exceeds revenue targets quarterly. The CEO wants to repeat this success in new territories.\n\nProposed project: expansion into Üskistan (currency: Üskistani $). Today\'s spot: TL 3.82 per $1.',
      },
      {
        id: 'inputs',
        navLabel: '2. NPV inputs',
        title: 'Investment, revenue model and exchange rates',
        content: 'Revenue model is exponential (consultant-built). Pre-tax contribution margin 40% throughout 4-year project life.\n\nInflation-adjusted forecasts ($m):\n• Revenue yr1 110 / yr2 138 / yr3 463 / yr4 1,160\n• Pre-tax contribution (40%) yr1 44 / yr2 55.2 / yr3 185.2 / yr4 464\n• Fixed operating costs yr1 74 / yr2 93 / yr3 116 / yr4 145\n\nImmediate plant investment $220m (not recoverable). TAD straight-line 25% on cost.\n\nRoyalty payment (annual): $2.5m yr1, growing 5%/year.\n\nTax: Üskistan 20%, Turkey 15%, bilateral treaty (offset overseas tax against domestic). Üskistan allows tax loss carry-forward.\n\nWorking capital: 2% of that year\'s pre-tax contribution at start of year; released in full at end of project.\n\nInflation: Üskistan 3%, Turkey 12% (constant).\nPPP exchange rates (TL/$): yr0 3.82 / yr1 4.15 / yr2 4.51 / yr3 4.90 / yr4 5.33.\nBlackbosca cost of capital 16%.',
        warning: 'The revenue jumps from $138m (yr2) to $463m (yr3) — a factor of 3.4×. This is the consultant\'s exponential model. The CEO has flagged that the model is untested and that a single equation is too simple for a complex scenario. Flag this in part (a) discussion (up to 5 of 13 marks).',
      },
      {
        id: 'risk',
        navLabel: '3. Risks',
        title: 'Why Üskistan looks attractive — and what could go wrong',
        content: 'Attractive factors:\n• Excellent infrastructure, shared language with Turkey.\n• Riders treated as self-employed (Supreme Court win); no employer benefit contributions.\n• Stable current government (post-constitutional change); recently removed dividend remittance restriction.\n• Online food-delivery market just emerging — growth headroom.\n\nRisks to flag in part (b):\n• Government debt is high → pressure on government spending; possible tax-policy reversal.\n• Üskistan\'s recent history of frequent government changes.\n• Self-employed-rider ruling could be revisited.\n• Inflation differential (3% vs 12%) → TL persistently weakens — affects dividend value when remitted.\n• Business model relies on financial institutions to process payments — concentration risk.\n• Untested exponential revenue model — high forecasting error.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 13,
        requirement: 'Evaluate the suitability of the investment proposal in Üskistan, including in your analysis a discussion of the chief executive officer\'s concerns about the consultant\'s cash flow estimates. (Up to 5 marks available for discussion.)',
        markingPoints: [
          { description: 'Pre-tax operating cash flow yrs 1–4: contribution − fixed operating cost', marks: 1 },
          { description: 'TAD: $220m × 25% = $55m per year (straight-line) → taxable profit each year', marks: 1 },
          { description: 'Üskistan tax 20%; use loss carry-forward where contribution is below fixed cost', marks: 1 },
          { description: 'After-tax cash flow = pre-tax cash flow − Üskistan tax (add back TAD)', marks: 1 },
          { description: 'Royalty payment: $2.5m yr1 growing 5%/yr, paid to Turkish parent (taxable in Turkey)', marks: 1 },
          { description: 'Working capital: 2% × pre-tax contribution at start of each year; released at end', marks: 1 },
          { description: 'Translate cash flows TL → $ at PPP rates; or work in $ and use TL/$ to convert dividend remittance', marks: 1 },
          { description: 'Apply bilateral tax treaty: top-up tax to Turkey rate where Üskistan rate is lower (here 20% > 15% so no top-up)', marks: 1 },
          { description: 'Discount at 16% Blackbosca cost of capital; NPV in TL', marks: 1 },
          { description: 'Recommendation based on calculated NPV', marks: 1 },
          { description: 'Discussion: CEO\'s concern that exponential model is untested (3.4× jump yr2→yr3)', marks: 1 },
          { description: 'Discussion: fixed operating costs of $74–145m vs contribution of $44–464m — early years are loss-making, must rely on later growth materialising', marks: 1 },
          { description: 'Discussion: sensitivity of NPV to revenue assumption; recommend stress-test', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 7,
        requirement: 'Discuss the financial and business risks which Blackbosca Co will be exposed to if the project in Üskistan is approved.',
        markingPoints: [
          { description: 'Currency / translation risk: 3% vs 12% inflation → persistent TL weakening', marks: 1 },
          { description: 'Tax policy risk: Üskistan government under pressure on spending; rider-status ruling reversible', marks: 1 },
          { description: 'Political risk: history of frequent government changes; stability is recent', marks: 1 },
          { description: 'Operational risk: rider self-employment status is a single point of failure', marks: 1 },
          { description: 'Counterparty/concentration risk: payment processing depends on financial institutions', marks: 1 },
          { description: 'Forecasting risk: exponential revenue model is untested', marks: 1 },
          { description: 'Repatriation risk: dividend remittance restriction was only recently removed', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Blackbosca Co',
        content: 'Blackbosca Co is the market-leading online food delivery company in Turkey. The company was set up five years ago and is already highly profitable, exceeding all the founder\'s revenue targets by a wide margin every quarter. The founder is the company\'s majority shareholder and chief executive officer (CEO) and he would like to repeat this success in new territories, particularly in locations where the market has been slow to develop so far. The board is due to meet next week to review a potential expansion into the country of Üskistan.',
      },
      {
        title: 'Exhibit 2 — Üskistan expansion project',
        content: 'Üskistan currency $; spot 3.82 TL/$1.\n\nThe consultant\'s exponential revenue model takes into account market size, new-customer adoption rate, and competitor reaction. Pre-tax contribution margin 40% throughout the 4-year project life. Inflation-adjusted cash-flow estimates ($m):\nRevenue: yr1 110.0 / yr2 138.0 / yr3 463.0 / yr4 1,160.0\nPre-tax contribution (40% of revenue): yr1 44.0 / yr2 55.2 / yr3 185.2 / yr4 464.0\nFixed operating costs: yr1 74 / yr2 93 / yr3 116 / yr4 145.\n\nCEO concerns: untested model, mathematical equation is a simplification, validity of estimated fixed operating costs.\n\nImmediate investment $220m in plant and machinery (not recoverable). TAD: straight-line 25% on cost.\n\nRoyalty payment annually: $2.5m yr1, growing 5%/year.\n\nCorporation tax: Üskistan 20%, Turkey 15%; taxes paid in year liability arises. Üskistan allows tax loss carry-forward. Bilateral tax treaty: offset overseas tax against domestic.\n\nWorking capital: 2% of that year\'s pre-tax contribution at start of year; released in full at end of project. The board intends to extract positive free cash flows as dividends at the earliest opportunity.\n\nInflation constant: Üskistan 3%, Turkey 12% for project duration.\nPPP exchange rates (TL/$): yr0 3.82 / yr1 4.15 / yr2 4.51 / yr3 4.90 / yr4 5.33.\nBlackbosca cost of capital 16%.',
      },
      {
        title: 'Exhibit 3 — Business and financial risks',
        content: 'Üskistan is a developing country but attractive: excellent infrastructure, important cultural links with Turkey (shared language). Üskistan allows delivery companies to treat riders as self-employed rather than employees, avoiding employer benefit contributions. The tax authority\'s recent Supreme Court challenge on rider status was lost.\n\nFrequent government changes in recent history but the current government appears stable following a constitutional change. The new government recently removed a long-standing dividend remittance restriction. However, it has inherited high government debt creating pressure on expenditure.\n\nOnline food-delivery market just emerging in Üskistan — excellent growth prospects. The finance director plans to follow the same business model as in Turkey, relying on financial institutions for online payment processing.',
      },
    ],

    keyAnswerTips: 'International NPV with a developing-country setting — the routine matters more than the cleverness. Layer the calculations: (1) local-currency operating cash flow, (2) Üskistan tax with loss carry-forward, (3) royalty as a separate cash flow taxed in the parent\'s jurisdiction, (4) translate dividends at PPP rates, (5) apply bilateral treaty top-up tax to Turkey rate where needed. The discussion marks (up to 5 in part a) are won by engaging with the CEO\'s specific concerns about the exponential model rather than generic NPV-limitations theory.',

    verifiedNumbers: [
      { value: '$220m', description: 'Immediate plant investment (not recoverable)', source: 'Q' },
      { value: '$55m/yr', description: 'TAD = $220m × 25% straight-line', source: 'Q' },
      { value: '20% / 15%', description: 'Üskistan / Turkey tax rates', source: 'Q' },
      { value: '3% / 12%', description: 'Üskistan / Turkey inflation (constant)', source: 'Q' },
      { value: '16%', description: 'Blackbosca cost of capital', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Pre-tax operating cash flow year by year',
        explanation: 'Contribution − fixed operating cost. Years 1 and 2 are loss-making before tax ($44m − $74m = −$30m; $55.2m − $93m = −$37.8m). Years 3 and 4 swing positive ($185.2m − $116m = $69.2m; $464m − $145m = $319m).',
      },
      {
        stepNumber: 2,
        title: 'Üskistan tax with loss carry-forward',
        explanation: 'Taxable profit = operating profit − TAD. Year 1: −$30m − $55m = −$85m (loss carried forward). Year 2: −$37.8m − $55m = −$92.8m loss (cumulative carry-forward $177.8m). Year 3: $69.2m − $55m = $14.2m taxable, fully offset by carry-forward (still $163.6m carried). Year 4: $319m − $55m = $264m taxable, less $163.6m carry-forward = $100.4m × 20% = $20.08m tax.',
      },
      {
        stepNumber: 3,
        title: 'Add back TAD; royalty; working capital; treaty',
        explanation: 'After-tax cash flow = pre-tax cash flow − Üskistan tax (TAD is non-cash, so we don\'t subtract it). Royalty $2.5m × 1.05^(n−1) paid to Turkey parent (taxable at Turkey 15%). Working capital 2% of contribution at start of year; release in full at end of year 4. Bilateral treaty: Üskistan 20% > Turkey 15%, so no Turkey top-up tax on Üskistan profits.',
      },
      {
        stepNumber: 4,
        title: 'Translate to TL at PPP and discount at 16%',
        explanation: 'Use the PPP rates given (TL/$): yr1 4.15, yr2 4.51, yr3 4.90, yr4 5.33. Convert each year\'s $ cash flow to TL. Discount at 16% (Blackbosca cost of capital). Sum to NPV.',
      },
      {
        stepNumber: 5,
        title: 'Discussion engaging the CEO\'s specific concerns',
        explanation: 'The model exponentially scales revenue from $110m → $1,160m in 4 years (10.5× growth). The 3.4× jump between years 2 and 3 is the largest single-period leap and the most fragile assumption — a one-period delay turns NPV materially negative. Recommend sensitivity analysis (revenue −20%, +1 year delay, fixed-cost +25%) and a phased-investment alternative that exits before year 3 if revenue tracks below model.',
      },
    ],

    examinerFeedback: {
      didWell: 'Cash flow structure and PPP translation were mostly correct. Most candidates correctly applied the 40% contribution margin and recognised the loss-carry-forward.',
      commonErrors: 'Tax loss carry-forward was often ignored. Royalty payment was sometimes treated as taxed twice. Discussion in part (a) was generic — most candidates did not engage with the CEO\'s specific point that the exponential model is untested.',
      tutorTip: 'Up to 5 discussion marks in part (a) is rare for an NPV question. Treat them as a separate sub-deliverable: write a short three-paragraph commentary on the model risk, the fixed-cost validity, and the practical fix (phased investment / sensitivity stress tests).',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // OXWICK CO — Mar/Jun 2023 — Section B Q3
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'oxwick',
    name: 'Oxwick Co',
    session: 'Mar/Jun 2023',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'C',
    topics: ['ma'],
    tags: ['M&A', 'P/E valuation', 'FCF valuation', 'Diversification'],
    difficulty: 3,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'companies',
        navLabel: '1. The companies',
        title: 'Oxwick (acquirer) and Ludham (target)',
        content: 'Oxwick Co is a listed fruit-flavoured soft drinks manufacturer. Profits have grown significantly recently. Wants to expand.\n\nLudham Co is unlisted, family-owned, producing the premium Ludorchard brand. Ludorchard is stocked in retail outlets where Oxwick is not.\n\nThe acquisition rationale: Oxwick can spend more on marketing Ludorchard than Ludham has, driving sales growth, plus other synergies. A non-executive director disagrees — he argues the acquisition does not REDUCE risk and so creates no value for shareholders. He thinks Oxwick should instead acquire companies in different product streams (true diversification) or one of its suppliers (vertical integration).',
        warning: 'The non-exec director\'s view conflates portfolio theory (diversification by individual investors) with corporate diversification. Shareholders can already diversify risk by holding multiple stocks — they don\'t need Oxwick to do it for them. Synergy-driven acquisitions create real value; pure diversification acquisitions usually destroy it. This is the standard part (a) trap.',
      },
      {
        id: 'valuation',
        navLabel: '2. Valuation inputs',
        title: 'P/E for Ludham, FCF for combination',
        content: 'Oxwick: 200m shares × $11.52 = $2,304m market cap. Most recent post-tax earnings $128m → P/E = 18.\n\nLudham: 80m shares, post-tax earnings $52m. Profits static for 3 years. Use Oxwick\'s P/E ratio reduced by 40% for unlisted status → 18 × 0.60 = 10.8. Ludham value = 10.8 × $52m = $561.6m → $7.02 per share.\n\nCombined company FCF (4-year horizon then perpetuity):\n• Year 1: $270m\n• Year 2: +12% / Year 3: +10% / Year 4: +7%\n• TAD = maintenance investment (cancel out)\n• Additional investment: $28m at end of year 1; $0.80 per $1 of FCF increase end of years 2-4\n• From year 5: 5% perpetual growth, no additional capital investment\n• WACC 12% post-acquisition; debt:equity 20:80\n• Acquisition premium for Ludham: 15% above fair value\n• Oxwick shareholders\' minimum required gain: 15%',
        warning: 'The 40% discount applied to the P/E ratio is large. Many candidates apply 40% to the P/E itself (18 − 0.40 = 17.60). That\'s wrong. "Reduced by 40%" means multiplied by 60% → 18 × 0.60 = 10.8.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 5,
        requirement: 'Discuss the non-executive director\'s views in relation to Oxwick Co\'s acquisition strategy and the acquisition of Ludham Co.',
        markingPoints: [
          { description: 'Shareholders can diversify themselves — corporate diversification adds little if any value', marks: 1 },
          { description: 'Synergy-driven acquisitions (like Ludham) create real value through revenue and cost economies', marks: 1 },
          { description: 'Acquiring unrelated businesses risks destroying value through management distraction and lack of expertise', marks: 1 },
          { description: 'Vertical integration with suppliers can reduce supply risk but transfers risk, doesn\'t eliminate it', marks: 1 },
          { description: 'Recommend the Ludham acquisition on synergy/strategic grounds, rejecting the diversification argument', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 10,
        requirement: 'Estimate, using the data available: the equity value of the combination of Oxwick Co and Ludham Co; and the % gain in value which would be gained by Oxwick Co\'s shareholders from the acquisition, concluding whether it will fulfil the expected shareholder requirement of a 15% gain in value.',
        markingPoints: [
          { description: 'Oxwick P/E = 200m × $11.52 / $128m = 18; Ludham P/E = 18 × 60% = 10.8', marks: 1 },
          { description: 'Ludham value = 10.8 × $52m = $561.6m; with 15% premium = $645.84m', marks: 1 },
          { description: 'FCF year 1 = $270m − $28m = $242m', marks: 1 },
          { description: 'FCF years 2–4 grow by 12% / 10% / 7%; deduct $0.80 × ΔFCF investment each year', marks: 2 },
          { description: 'Terminal value at end of year 4 = FCF₅ × 1.05 / (0.12 − 0.05), discounted to today', marks: 2 },
          { description: 'Combined equity value = PV(FCF 1–4) + PV(TV)', marks: 1 },
          { description: 'Oxwick gain = combined value − $645.84m paid to Ludham − $2,304m Oxwick ex ante; express as %', marks: 1 },
          { description: 'Conclude whether ≥15% gain to Oxwick shareholders is met', marks: 1 },
        ],
      },
      {
        label: '(c)',
        marks: 5,
        requirement: 'Discuss the assumptions made in the calculations in part (b).',
        markingPoints: [
          { description: 'Using Oxwick\'s P/E for Ludham assumes similar risk and growth — Ludham\'s profits are static, suggesting lower growth', marks: 1 },
          { description: 'The 40% unlisted discount is a rule of thumb — actual marketability discount varies widely', marks: 1 },
          { description: 'Combined FCF growth rates assume synergies are achieved — increased marketing spend may not translate to sales', marks: 1 },
          { description: '5% terminal growth in perpetuity is high vs long-run economic growth', marks: 1 },
          { description: '$0.80 reinvestment ratio per $1 of FCF increase is a simplification', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Oxwick Co\'s acquisition of Ludham Co',
        content: 'Oxwick Co is a listed, fruit-flavoured soft drinks manufacturer which has increased its profits significantly over the last few years and is looking to expand. Oxwick Co\'s directors have identified Ludham Co as a potential target. Ludham Co is an unlisted, family-owned company. It produces a premium brand of soft drink, the Ludorchard brand. Oxwick Co\'s directors are aware that the Ludorchard brand is stocked in a number of retail outlets where Oxwick Co\'s drinks are not stocked.\n\nAssuming Ludham Co is acquired, Oxwick Co\'s directors believe that Oxwick Co will be able to spend more on marketing the Ludorchard brand than Ludham Co has been able to spend, increasing sales significantly. It will also achieve other synergies which will increase value and justify the acquisition. However, one of Oxwick Co\'s non-executive directors believes that the acquisition will be of no value to Oxwick Co because it does not reduce risk. He feels that Oxwick Co\'s shareholders want the company to make acquisitions which reduce risk and therefore increase company value. He believes that Oxwick Co should therefore consider acquiring companies with different product streams, or one or more of its suppliers.',
      },
      {
        title: 'Exhibit 2 — Financial data, both companies',
        content: 'Ludham Co\'s profits have remained static during the past three years. As it is an unlisted company, there is no information available about Ludham Co\'s forecast cash flows.\n\nOxwick Co has 200 million shares in issue and its current market price per share is $11.52. Its most recent post-tax earnings were $128m.\n\nLudham Co has 80 million shares in issue. Its most recent post-tax earnings were $52m.\n\nAssume that Ludham Co\'s current valuation can be obtained by using Oxwick Co\'s P/E ratio, reduced by 40% to reflect Ludham Co\'s unlisted status.\n\nThe post-tax cash flows for the first year of the combined company are estimated to be $270m. These are expected to increase by the following % each year as a result of sales volume increases, synergies and inflation:\nYear 2: 12%, Year 3: 10%, Year 4: 7%.\n\nTax allowable depreciation is assumed to be equivalent to the amount of investment needed to maintain existing operations. However, an additional investment in assets (including working capital) will be required of $28m at the end of year 1. In years 2 to 4, additional investment in assets at the end of each year will be $0.80 for every $1 increase in post-tax cash flows in that year.\n\nAfter four years, the annual growth rate of free cash flows is expected to be 5% for the foreseeable future. It is assumed that there will be no additional capital investment from year 5 onwards.\n\nThe combined company\'s cost of capital is estimated to be 12%. It is expected that the combined company\'s debt to equity level will be maintained at 20:80, in market value terms, after the acquisition has taken place.\n\nThe directors of Oxwick Co assume that the shareholders of Ludham Co will require a 15% premium on the fair value of their shares. To satisfy their own shareholders, Oxwick Co\'s directors believe that the acquisition should result in a minimum gain to their shareholders of at least 15%.',
      },
    ],

    keyAnswerTips: 'When AFM tests business valuations, strategic aspects of acquisitions are usually tested alongside. Make sure you can calculate the value using P/E AND FCF methods — Oxwick uses P/E for the target (Ludham is unlisted) but FCF for the combination. The non-exec director\'s diversification argument is a classic AFM trap: shareholders diversify themselves through their portfolios, so corporate diversification rarely adds value for shareholders.',

    verifiedNumbers: [
      { value: 'P/E = 18', description: 'Oxwick P/E ratio = 200m × $11.52 / $128m', source: 'Q' },
      { value: 'P/E = 10.8', description: 'Ludham P/E = 18 × 60% (40% unlisted discount)', source: 'Q' },
      { value: '$561.6m', description: 'Ludham fair value = 10.8 × $52m', source: 'Q' },
      { value: '$645.84m', description: 'Ludham with 15% acquisition premium', source: 'Q' },
      { value: '$2,304m', description: 'Oxwick market cap pre-acquisition (200m × $11.52)', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Establish Ludham\'s fair value with the discounted P/E',
        explanation: 'Ludham is unlisted so its value can\'t be observed directly. The standard approach: use the listed acquirer\'s P/E, discounted for marketability. Oxwick P/E = $2,304m / $128m = 18. Reduced by 40% means × 60%. Discounted P/E = 18 × 60% = 10.8. Ludham fair value = 10.8 × $52m = $561.6m. With 15% acquisition premium, Oxwick pays $645.84m for Ludham.',
        formula: 'Oxwick P/E = 200m × $11.52 / $128m = 18\nLudham P/E = 18 × (1 − 40%) = 18 × 0.60 = 10.8\nLudham fair value = 10.8 × $52m = $561.6m\nWith 15% premium: $561.6m × 1.15 = $645.84m',
      },
      {
        stepNumber: 2,
        title: 'Build the combined-company free cash flows',
        explanation: 'Year 1 FCF = $270m, less $28m additional investment = $242m. Years 2–4 grow by 12% / 10% / 7%. Additional investment = $0.80 × (FCF increase) each year. No additional investment from year 5.',
        formula: 'Year 1: $270m − $28m = $242m\nYear 2: $270m × 1.12 = $302.4m; ΔFCF = $32.4m; invest $25.92m → net $276.48m\nYear 3: $302.4m × 1.10 = $332.64m; ΔFCF = $30.24m; invest $24.19m → net $308.45m\nYear 4: $332.64m × 1.07 = $355.92m; ΔFCF = $23.28m; invest $18.62m → net $337.30m\nYear 5: $355.92m × 1.05 = $373.72m (no investment)',
      },
      {
        stepNumber: 3,
        title: 'Discount at 12% and apply terminal value',
        explanation: 'Terminal value at end of year 4 = FCF₅ / (WACC − g) = $373.72m / (0.12 − 0.05) = $5,338.86m. Discount all cash flows to today at 12% and sum.',
        formula: 'PV factors at 12%: 0.893 / 0.797 / 0.712 / 0.636\nPV of FCF 1–4: $242 × 0.893 + $276.48 × 0.797 + $308.45 × 0.712 + $337.30 × 0.636\n         ≈ $216.1 + $220.3 + $219.6 + $214.5 = $870.5m\nPV of terminal value: $5,338.86m × 0.636 ≈ $3,395.5m\nCombined firm value ≈ $4,266m\nCombined EQUITY value (apply D/E 20:80): $4,266m × 80% ≈ $3,413m',
      },
      {
        stepNumber: 4,
        title: 'Calculate Oxwick shareholders\' gain',
        explanation: 'Value going to Oxwick shareholders = combined equity value − $645.84m paid for Ludham. Compare to Oxwick\'s pre-acquisition $2,304m. Gain = (Oxwick share of new value − $2,304m) / $2,304m. Compare to 15% required gain.',
        formula: 'Oxwick share = $3,413m − $645.84m = $2,767.16m\nGain = ($2,767.16m − $2,304m) / $2,304m ≈ 20.1%\n20.1% > 15% required gain → acquisition meets the threshold',
      },
      {
        stepNumber: 5,
        title: 'Respond to the non-exec director',
        explanation: 'Concede the principle: pure diversification does not create shareholder value since shareholders can diversify themselves. But reject the application to Ludham: this is a synergy-driven acquisition (marketing-spend uplift on Ludorchard, distribution access to new retail outlets), not a diversification play. The calculations show a 20% gain — well above the 15% threshold. The director\'s alternative (acquire suppliers / unrelated businesses) is poorly defined and would not be screened against any specific synergy hypothesis.',
      },
    ],

    examinerFeedback: {
      didWell: 'Most candidates correctly calculated the P/E ratio and applied the 40% unlisted discount. FCF mechanics for years 1–4 were generally correct.',
      commonErrors: 'Many candidates applied the 40% discount additively (P/E − 0.40) rather than multiplicatively (× 0.60). Terminal value timing errors (discounting from year 5 rather than treating the year-5 number as the perpetuity value at end of year 4). Many candidates failed to compute Oxwick\'s gain as a percentage — they reported the combined value but didn\'t compare it to the 15% threshold.',
      tutorTip: 'Three-step recipe for every M&A valuation: (1) value the target, (2) value the combination, (3) check both sides\' required gains. Always express the final gain as a percentage of the acquirer\'s pre-acquisition equity value — that\'s the metric the question is testing against the 15% threshold.',
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

  // ─────────────────────────────────────────────
  // SOUTHMED CO — Sep/Dec 2023 — Section B Q2
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'southmed',
    name: 'Southmed Restaurants Co',
    session: 'Sep/Dec 2023',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'A',
    topics: ['ma'],
    tags: ['Ratio analysis', 'Performance evaluation', 'Strategic position'],
    difficulty: 3,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'business',
        navLabel: '1. The business',
        title: 'Southmed: 140 restaurants across three segments',
        content: 'Southmed Restaurants Co operates in Pangland, specialising in Southern Mediterranean food. Aims to provide a better dining experience than rival chains offering similar food — more comfortable seating, stylish surroundings.\n\nCentral procurement, but restaurants have discretion on local pricing and staffing.\n\nThree reported segments (24 / 32 / 84 restaurants):\n• Six largest cities in Pangland\n• Tourist centres, mostly coastal\n• Smaller cities and towns\n\nCompetitive threats:\n• Six largest cities: higher-quality, more-expensive competitors are eating Southmed\'s lunch (revenue and gross profit both falling materially).\n• Tourist centres: high-volume, cheaper competitors growing (revenue up but gross profit margin compressed).\n• Small cities/towns: flat performance.',
      },
      {
        id: 'financials',
        navLabel: '2. Financials 20X0–X2',
        title: 'The financial position is deteriorating',
        content: 'Revenue: $121.9m → $121.5m → $120.9m (falling slowly).\nGross profit: $20.8m → $20.2m → $19.3m → margin 17.1% / 16.6% / 16.0% (vs industry 19.6 / 19.1 / 18.6%).\nOperating profit: $9.8m → $9.0m → $7.7m → margin 8.0% / 7.4% / 6.4% (vs industry 9.0 / 8.6 / 8.1%).\nProfit after tax: $5.2m → $4.8m → $4.1m.\nDividends: $3.0m / $3.0m / $3.0m (constant despite falling earnings).\nDividend cover: 1.73 → 1.60 → 1.37 (deteriorating fast).\n\nBalance sheet:\nEquity: $51.2m → $53.0m → $54.1m (growing despite falling profit — retentions exceed dividends).\nNon-current liabilities: $28.0m → $26.0m → $23.4m (loan being amortised).\nMarket price: $5.70 → $5.35 → $4.85 (− 9.4% over 2 years, vs industry − 4.2%).\n\nGearing (industry definition: NCL / (NCL + MV equity)):\n20X0: 28.0 / (28.0 + 57.0) ≈ 32.9%\n20X1: 26.0 / (26.0 + 53.5) ≈ 32.7%\n20X2: 23.4 / (23.4 + 48.5) ≈ 32.5%\nVs industry 41.4 / 41.6 / 42.0% → Southmed is significantly LESS geared than peers.',
        warning: 'Margins are below industry AND falling faster than industry. The share price is falling almost 3× faster than the sector average. Dividend cover is deteriorating sharply because the dividend has been held constant despite falling profits. Together these signal a real strategic problem, not just a soft year.',
      },
      {
        id: 'segments',
        navLabel: '3. Segment analysis',
        title: 'Where the damage is being done',
        content: 'Six largest cities (24 restaurants):\nRevenue: $32.4m → $31.4m → $30.3m (−6.5% over 2 years)\nGross profit: $5.9m → $5.4m → $4.7m (−20.3%)\nGP margin: 18.2% → 17.2% → 15.5% — biggest margin compression.\nRevenue per restaurant: $1.35m → $1.31m → $1.26m.\n→ Premium competitors are stealing share.\n\nTourist centres (32 restaurants):\nRevenue: $28.2m → $29.0m → $29.6m (+5.0%)\nGross profit: $4.5m → $4.4m → $4.3m (−4.4%)\nGP margin: 16.0% → 15.2% → 14.5% — margin under pressure from value competitors.\nRevenue per restaurant: $0.88m → $0.91m → $0.93m.\n→ Volume up but margin compressed.\n\nSmall cities/towns (84 restaurants):\nRevenue: $61.3m → $61.1m → $61.0m (essentially flat)\nGross profit: $10.4m → $10.4m → $10.3m\nGP margin: 17.0% → 17.0% → 16.9% — stable.\nRevenue per restaurant: $0.73m → $0.73m → $0.73m.\n→ Cash cow segment but no growth.\n\nData gaps to flag in the discussion: number of customers per restaurant, average spend, employee headcount, advertising spend per segment, lease costs, capex per segment.',
      },
    ],

    questionParts: [
      {
        label: 'Question (single requirement)',
        marks: 20,
        requirement: 'Evaluate Southmed\'s financial performance and business situation. You should indicate in your discussion any omissions in the data provided, where further information would be helpful to extend your analysis. Provide relevant calculations for ratios and trends to support your evaluation. Note: 10 marks are available for the calculations.',
        markingPoints: [
          { description: 'GP margin: total + by segment, vs industry trend', marks: 1 },
          { description: 'Operating profit margin trend vs industry', marks: 1 },
          { description: 'ROCE / ROE based on opening or average equity', marks: 1 },
          { description: 'Gearing (industry definition: NCL / (NCL + MV equity))', marks: 1 },
          { description: 'Dividend cover trend (1.73 → 1.60 → 1.37)', marks: 1 },
          { description: 'Share price decline vs industry change in share price', marks: 1 },
          { description: 'Segment revenue and GP per restaurant for each of 3 segments', marks: 2 },
          { description: 'Working-capital / liquidity ratios (current, quick)', marks: 1 },
          { description: 'P/E ratio, EPS, dividend yield where useful', marks: 1 },
          { description: 'Discussion: margin and share-price decline both exceed industry — fundamental issue, not cyclical', marks: 1 },
          { description: 'Discussion: dividend cover deterioration — current policy unsustainable', marks: 1 },
          { description: 'Discussion: six-largest-cities segment is most damaged — competitor response needed there', marks: 1 },
          { description: 'Discussion: tourist centres growing but margin shrinking — pricing or cost issue', marks: 1 },
          { description: 'Discussion: small-cities-and-towns segment provides stable cash but no growth platform', marks: 1 },
          { description: 'Discussion: gearing well below industry → debt capacity for investment', marks: 1 },
          { description: 'Discussion: data omissions (customers per restaurant, average spend, lease costs, etc.)', marks: 1 },
          { description: 'Strategic recommendation: invest in six-largest-cities differentiation OR exit; review dividend policy', marks: 2 },
          { description: 'Recognition that the central procurement model may constrain segment-specific response', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Southmed Restaurants Co',
        content: 'Southmed Restaurants Co (Southmed) is a chain of restaurants operating in the country of Pangland, specialising in Southern Mediterranean food. Southmed aims to provide customers with a better dining experience than other chains offering similar food, with more comfortable seating and stylish surroundings. Sourcing of food and drink from suppliers is organised by a central procurement function, acting on orders from restaurants. Restaurants, however, have some discretion in the prices they charge in response to local business conditions and also in their staffing policies.\n\nFor segmental reporting, Southmed divides its restaurants into three segments: the six largest cities in Pangland; tourist centres (mostly coastal locations); and smaller cities and towns.\n\nSouthmed\'s board is currently reviewing its strategic positioning and financing. The directors wish to ensure that Southmed will have sufficient finance to sustain investment and keep shareholders happy by maintaining dividend levels. They view as a significant competitive threat the growth of more expensive restaurants offering higher quality food and better surroundings — particularly in the six largest cities.\n\nAbout five years ago, Southmed expanded the number of restaurants it had in tourist centres in response to a government campaign aiming to increase the number of holidays taken in Pangland. The board has been pleased with the results, but there is now considerable competition in the tourist centres, particularly from restaurants serving high customer numbers at cheaper prices than Southmed.\n\nSouthmed\'s board wishes to assess its current business situation, based on the figures in its most recent financial statements, before deciding on how it should respond to the competitive threats and how the response should be financed.',
      },
      {
        title: 'Exhibit 2 — Summarised financial statements 20X0–20X2',
        content: 'Statement of profit or loss for years ending 31 December ($000):\n\n                          20X2     20X1     20X0\nRevenue                 120,900  121,500  121,900\nCost of sales          (101,600)(101,300)(101,100)\nGross profit             19,300   20,200   20,800\nAdministrative costs    (11,600) (11,200) (11,000)\nOperating profit          7,700    9,000    9,800\nFinance costs            (2,400)  (2,600)  (2,800)\nProfit before tax         5,300    6,400    7,000\nTax                      (1,200)  (1,600)  (1,800)\nProfit after tax          4,100    4,800    5,200\nDividends                 3,000    3,000    3,000\n\nStatement of financial position ($000):\nNon-current assets       78,400   78,800   79,100\nBank and cash             8,000    8,000    8,200\nOther current assets      3,000    2,600    2,400\nTotal assets             89,400   89,400   89,700\nOrdinary shares ($1)     10,000   10,000   10,000\nReserves                 44,100   43,000   41,200\nEquity total             54,100   53,000   51,200\nNon-current liabilities  23,400   26,000   28,000\nTrade payables           10,600    8,600    8,500\nOther current liabilities 1,300    1,800    2,000\nTotal equity + liabs     89,400   89,400   89,700\nMarket price per share    $4.85    $5.35    $5.70\n\nNotes: NCA includes land, buildings, fixtures, equipment, vehicles. Other current assets = inventory of perishable foods + prepayments. NCL = loan notes redeemable in 7 years (market = nominal) + bank loan repayable in instalments.\n\nSegment revenue ($000):\nSix largest cities         30,300   31,400   32,400\nTourist centres            29,600   29,000   28,200\nSmall cities and towns     61,000   61,100   61,300\n\nSegment gross profit ($000):\nSix largest cities          4,700    5,400    5,900\nTourist centres             4,300    4,400    4,500\nSmall cities and towns     10,300   10,400   10,400\n\nNumber of restaurants:\nSix largest cities             24       24       24\nTourist centres                32       32       32\nSmall cities and towns         84       84       84\nTotal                         140      140      140\n\nIndustry figures (other national restaurant chains):\n                       20X2   20X1   20X0\nGP margin (%)          18.6   19.1   19.6\nOperating margin (%)    8.1    8.6    9.0\nGearing (%)            42.0   41.6   41.4\nChange in share price  -3.4   -0.8     —\n(Gearing = NCL / (NCL + MV equity))',
      },
    ],

    keyAnswerTips: 'Big ratio-analysis questions consistently see candidates over-spend on numbers and under-spend on discussion. 10 marks calculations + 10 marks discussion — budget 18 min on each. Always compare to industry, not just trend. Segment analysis is where the marks are — three segments mean three distinct competitive stories: premium-competitor attack in big cities, value-competitor attack in tourist centres, stable cash cow in small towns. Comment on dividend cover as a separate point: 1.73 → 1.37 is unsustainable.',

    verifiedNumbers: [
      { value: '16.0% vs 18.6%', description: 'GP margin 20X2 vs industry', source: 'Q' },
      { value: '6.4% vs 8.1%', description: 'Operating margin 20X2 vs industry', source: 'Q' },
      { value: '~32.5% vs 42.0%', description: 'Gearing 20X2 vs industry — well below', source: 'Q' },
      { value: '1.37', description: 'Dividend cover 20X2 (down from 1.73)', source: 'Q' },
      { value: '-15%', description: 'Share price 20X0→X2 vs industry -4.2%', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Compute the core ratios and compare to industry',
        explanation: 'Start with the obvious ones: GP margin (gross / revenue), operating margin, ROCE (operating / capital employed), gearing on the industry definition (NCL / (NCL + MV equity)). Each one alongside the industry figure for the same year. The story is consistent — Southmed underperforms on every margin metric and the gap is widening.',
      },
      {
        stepNumber: 2,
        title: 'Segment the segments',
        explanation: 'Compute revenue and gross profit per restaurant for each segment, and segment GP margin. Six-largest-cities is being attacked by premium competitors — revenue and margin both falling. Tourist centres are being attacked by value competitors — revenue up but margin compressed. Small cities are stable but offer no growth.',
      },
      {
        stepNumber: 3,
        title: 'Note dividend cover collapse and capital structure',
        explanation: 'Dividend held constant at $3.0m despite PAT falling from $5.2m to $4.1m → dividend cover 1.37×, down from 1.73× two years ago. Trajectory is unsustainable. On the other hand, gearing is well below industry (32% vs 42%) so there is debt capacity for transformation investment.',
      },
      {
        stepNumber: 4,
        title: 'Flag data gaps and recommend',
        explanation: 'Data gaps the question wants surfaced: customers per restaurant, average spend, advertising/marketing spend, employee productivity, lease costs, capex per segment, like-for-like sales growth. Recommend: (1) decide whether to fight premium competitors in big cities or exit; (2) reposition tourist-centre pricing; (3) protect cash flow from small towns; (4) revisit dividend policy given falling cover.',
      },
    ],

    examinerFeedback: {
      didWell: 'Strong candidates produced a clear story tied to industry comparison and segment-level analysis. Best answers identified gearing capacity for investment.',
      commonErrors: 'Most candidates over-spent on ratios and ran out of time for discussion (the 10/10 mark split was frequently ignored). Discussion was too generic — many didn\'t differentiate the three segments or notice the dividend-cover deterioration.',
      tutorTip: 'The 10/10 split is rigid. Budget 18 minutes each. Calculations: 8 ratios for the company + 6 segment ratios = 14 numbers, ~75 sec each. Discussion: 4 paragraphs (overall trend, segment-by-segment, capital structure / dividend, strategic recommendation), ~4 min each.',
      source: 'E',
    },
  },

  // ─────────────────────────────────────────────
  // ABERTAFOL CO — Sep/Dec 2023 — Section B Q3
  // Source: Kaplan AFM Exam Kit 2024-25 (verbatim)
  // ─────────────────────────────────────────────
  {
    id: 'abertafol',
    name: 'Abertafol Co',
    session: 'Sep/Dec 2023',
    paperSection: 'B',
    totalMarks: 25,
    syllabusSection: 'E',
    topics: ['hedg'],
    tags: ['IR futures', 'FRA', 'IR options', 'Loan + investment'],
    difficulty: 4,
    primarySource: 'Q',

    scenarioSteps: [
      {
        id: 'situation',
        navLabel: '1. The situation',
        title: 'Two-leg hedge: borrow then invest',
        content: 'Abertafol Co is rearranging distribution: selling its large central distribution centre and buying two smaller centres (north + south). Timing differences mean it needs to:\n\n• BORROW $24m from 1 May 20X8 to 1 Sep 20X8 (4 months).\n• INVEST $18m from 1 Sep 20X8 to 1 Feb 20X9 (5 months).\n\nToday: 1 February 20X8. Central bank base rate: 5.1%.\nBorrowing rate: base + 40 bp. Investment rate: base − 30 bp.\nFutures / options settle end of month; basis diminishes to zero at maturity (linear monthly); no basis risk; no margin requirement.',
        warning: 'Two different hedges, two different directions. Borrowing $24m → going to PAY interest → hedge against RATE RISES → SELL futures, buy PUT options. Investing $18m → going to RECEIVE interest → hedge against RATE FALLS → BUY futures, buy CALL options. Mixing these up costs ~5 marks in the calculation.',
      },
      {
        id: 'loan',
        navLabel: '2. $24m loan',
        title: 'Loan hedge (rate could rise to 5.9%)',
        content: 'Commentators expect the government to raise the base rate by up to 0.8% to 5.9% before 1 May 20X8.\n\nFRA: already calculated by the finance department. Net payment $461,600 = effective annual rate 5.77%.\n\nThree-month $ futures, $500,000 contract size, quoted at 100 − annual % yield:\nJune: 94.55\nSeptember: 94.50\n\nFor a 4-month loan from 1 May to 1 Sep, the natural futures expiry is June.\nSpot price equivalent at 5.1%: 100 − 5.10 = 94.90.\nBasis (June): 94.90 − 94.55 = 0.35.\nUnexpired basis at 1 May (close-out, 1 month from contract end): 1/4 × 0.35 = 0.0875.\nExpected futures price at 1 May if rate rises to 5.9%: 100 − 5.90 − 0.0875 = 94.0125.',
      },
      {
        id: 'invest',
        navLabel: '3. $18m investment',
        title: 'Investment hedge (rate could fall to 4.5%)',
        content: 'Election on 1 July 20X8. Main opposition has promised to reduce the base rate. Commentators expect the rate could fall to 4.5% if opposition wins. Result currently too close to call. Current government winning means no rate change.\n\nFRA: already calculated. Guaranteed $378,750 = effective annual rate 5.05% on the investment.\n\nFinance department is considering BUYING CALL OPTIONS as the alternative to the FRA — the upside of options is preserved if rates do not fall as far as 4.5%.\n\nOptions on three-month September $ futures, $500,000 contract size, premiums quoted in annual %:\nCall 94.75 exercise price: 0.298 premium.\n\nNumber of contracts for the investment (5-month exposure):\nContracts = $18m / $500,000 × 5/3 = 60 contracts.\n\nSpot price equivalent at 5.1%: 94.90.\nBasis (September): 94.90 − 94.50 = 0.40.\nUnexpired basis at 1 Sep (close-out is contract maturity): 0/6 × 0.40 = 0 (no unexpired basis).\nExpected futures price at 1 Sep if rate falls to 4.5%: 100 − 4.50 − 0 = 95.50.',
        warning: 'For the loan, close-out is 1 May; September futures don\'t expire until end of September → 4 months to expiry vs 1 month for June. For the investment, close-out is 1 September = contract maturity → unexpired basis is zero, simplifying things.',
      },
      {
        id: 'queries',
        navLabel: '4. Director queries',
        title: 'Part (b): three directors, three challenges',
        content: 'Director A: "Abertafol should not use derivatives — trading in derivatives is not part of normal business, so shareholders won\'t expect it."\n→ Counter: hedging ≠ speculating; reduces risk to known cash flows, supporting business plan. Shareholders generally support risk-reduction that protects value.\n\nDirector B: "What if rates rise by less than 0.8% or fall by less than 0.6%? We lose the chance to benefit from better-than-hedged rates."\n→ Hedging is about removing uncertainty, not maximising upside. Where uncertainty is high (election risk), the certainty of an FRA can be worth giving up the upside. Options preserve upside but at the cost of the premium.\n\nDirector C: "Options should not be used for the $18m investment — the premium means they\'re never the best choice. Better not to hedge at all."\n→ Wrong on both counts. Options are best when there is asymmetric uncertainty (rates might fall a lot, might not at all). Not hedging is fine if management has appetite for the rate risk, but exposes Abertafol to a worst-case scenario that could affect business plan.',
      },
    ],

    questionParts: [
      {
        label: '(a)',
        marks: 13,
        requirement: 'Advise on hedging strategies, based on the hedging choices that the finance department is considering for: the loan of $24m, assuming the central bank base rate rises to 5.9%; the investment of $18m, assuming the central bank base rate falls to 4.5%. Support your answer with appropriate calculations and discussion. Note: Up to 4 marks are available for discussion.',
        markingPoints: [
          { description: '$24m loan: identify SELL futures (borrowers sell) to hedge rate rise', marks: 1 },
          { description: 'Loan futures: 64 contracts ($24m / $500k × 4/3); basis 0.35; unexpired 0.0875', marks: 2 },
          { description: 'Futures gain on loan if rate rises to 5.9%: (94.55 − 94.0125) × 0.01 × $500k × 3/12 × 64', marks: 2 },
          { description: 'Loan: net interest = $24m × 5.9% × 4/12 − futures gain → effective rate calculation', marks: 1 },
          { description: 'Comparison: futures vs FRA 5.77% (already given) — recommend lower effective rate', marks: 1 },
          { description: '$18m investment: identify BUY call options (option to lock in rate)', marks: 1 },
          { description: 'Investment options: 60 contracts ($18m / $500k × 5/3); strike 94.75', marks: 1 },
          { description: 'Premium: 0.298% × $500k × 3/12 × 60 = $22,350', marks: 1 },
          { description: 'If rate falls to 4.5%: expected futures price 95.50; option gain = (95.50 − 94.75) × 0.01 × $500k × 3/12 × 60', marks: 1 },
          { description: 'Investment: net return = $18m × 4.2% × 5/12 + option gain − premium', marks: 1 },
          { description: 'Discussion (up to 4 of 13 marks): election uncertainty → options preserve upside if rate doesn\'t fall as far', marks: 1 },
        ],
      },
      {
        label: '(b)',
        marks: 7,
        requirement: 'Discuss the queries raised by each of the directors.',
        markingPoints: [
          { description: 'Director A: derivatives ≠ speculation; hedging reduces risk and supports business plan', marks: 1 },
          { description: 'Director A: shareholders generally support risk-reduction; lack of hedging could destroy more value than the cost of hedging', marks: 1 },
          { description: 'Director B: hedging removes uncertainty, doesn\'t maximise upside; trade-off is intentional', marks: 1 },
          { description: 'Director B: options preserve upside but cost a premium; FRA gives certainty but no upside', marks: 1 },
          { description: 'Director C: options are best when uncertainty is asymmetric (e.g. election where rates might fall a lot or not at all)', marks: 1 },
          { description: 'Director C: not hedging exposes Abertafol to worst-case rate; may be acceptable if risk appetite high but not "best"', marks: 1 },
          { description: 'Conclude: derivatives are valuable risk-management tools, not speculation; the right tool depends on risk profile', marks: 1 },
        ],
      },
      {
        label: 'Professional skills',
        marks: 5,
        requirement: 'Analysis and evaluation, scepticism, commercial acumen.',
      },
    ],

    exhibits: [
      {
        title: 'Exhibit 1 — Abertafol Co\'s interest rate hedging',
        content: 'Abertafol Co is planning a change in distribution arrangements: dispose of large central distribution centre, invest proceeds in two smaller centres (north + south).\n\nToday is 1 February 20X8. Because of expected timing differences, Abertafol expects to take out a SHORT-TERM LOAN of $24m from 1 May 20X8 to 1 September 20X8. It then expects to make a SHORT-TERM INVESTMENT of $18m from 1 September 20X8 to 1 February 20X9.\n\nAbertafol intends to hedge interest rate risk using derivatives. Terms based on central bank base rate. Assumptions: futures/options settle at end of each month; basis diminishes to zero at contract maturity (constant rate, monthly intervals); no basis risk; no margin requirements.\n\n$24m loan: Abertafol borrows at base + 40 bp. Base rate currently 5.1%. Commentators expect base to rise by up to 0.8% to 5.9% before 1 May 20X8.\nFRA already calculated: net payment $461,600 = effective 5.77%.\nThree-month $ futures, $500,000 contract size, quoted 100 − annual % yield:\nJune 94.55, September 94.50.\n\n$18m investment: Abertafol invests at base − 30 bp.\nElection 1 July 20X8. Main opposition promises to reduce base rate. Commentators: rate could fall to a minimum of 4.5% if opposition wins. Currently no confident prediction. Assume no rate reduction if current government wins.\nFRA already calculated: guaranteed $378,750 = effective 5.05%.\nFinance department is looking at buying call options as the alternative to the FRA for the investment hedge.\n\nOptions on three-month September $ futures, $500,000 contract size, premiums in annual %:\nCall 94.75 strike: 0.298 premium.',
      },
      {
        title: 'Exhibit 2 — Directors\' queries about hedging',
        content: 'At the last board meeting, Abertafol\'s finance director explained possible hedging strategies. She received the following queries:\n\nDirector A: Abertafol should not be using derivatives, as trading in derivatives is not part of the company\'s normal activities. Therefore shareholders would not expect the company to be using derivatives.\n\nDirector B: Understood that futures or an FRA might be the best solution if the central bank rate rose up to 5.9% or fell down to 4.5%. But queried what would happen if rates did not rise as high as 5.9% nor fall as low as 4.5% — Abertafol could possibly lose the chance of benefiting from more favourable rates than those offered by the futures or FRA.\n\nDirector C: Options should not be used to hedge the $18m investment, as they would never be the best choice because of their premium. The best choice would be not to hedge at all.',
      },
    ],

    keyAnswerTips: 'Two-leg hedge means two opposite directions. Borrower (loan) hedges rate RISES → SELL futures + buy PUT options. Investor (deposit) hedges rate FALLS → BUY futures + buy CALL options. The FRA effective rates for both legs are GIVEN (5.77% loan, 5.05% investment) — your futures/options calculations need to clear those benchmarks to be worth recommending. Up to 4 of 13 marks in part (a) are for discussion — write a short paragraph for each leg comparing futures/options against the given FRA and tying back to the directors\' concerns.',

    verifiedNumbers: [
      { value: '5.77% (FRA)', description: 'Loan effective rate via FRA (given)', source: 'Q' },
      { value: '5.05% (FRA)', description: 'Investment effective rate via FRA (given)', source: 'Q' },
      { value: '64 contracts', description: 'Loan futures: $24m / $500k × 4/3', source: 'Q' },
      { value: '60 contracts', description: 'Investment options: $18m / $500k × 5/3', source: 'Q' },
      { value: '0.298% × $500k × 3/12 × 60 = $22,350', description: 'Call option premium for investment hedge', source: 'Q' },
    ],

    solutionSteps: [
      {
        stepNumber: 1,
        title: 'Loan ($24m): sell futures to hedge rate rise',
        explanation: 'Borrowers SELL futures because if rates rise, futures prices FALL, and the futures gain offsets the higher loan interest. Number of contracts = $24m / $500,000 × (4 months / 3 months) = 64 contracts. Use June futures (closer to 1 May close-out).',
        formula: 'Spot today: 100 − 5.10 = 94.90\nJune futures: 94.55\nBasis (June): 94.90 − 94.55 = 0.35\nUnexpired basis at 1 May (1 of 4 months left): 1/4 × 0.35 = 0.0875\nExpected futures price 1 May (rate = 5.9%): 100 − 5.90 − 0.0875 = 94.0125\nFutures gain: (94.55 − 94.0125)/100 × $500k × 3/12 × 64 = $43,000\nLoan interest at 5.9% + 40 bp = 6.30%: $24m × 6.30% × 4/12 = $504,000\nNet cost: $504,000 − $43,000 = $461,000\nEffective annual: $461,000 / ($24m × 4/12) ≈ 5.76%',
      },
      {
        stepNumber: 2,
        title: 'Compare loan futures result to FRA',
        explanation: 'Futures hedge gives ~5.76% effective — virtually identical to the FRA\'s 5.77%. Either is fine; FRA wins on simplicity (no contracts to manage); futures win on liquidity and the ability to close out early. Recommendation: FRA for an unsophisticated treasury function; futures if Abertafol already has futures expertise.',
      },
      {
        stepNumber: 3,
        title: 'Investment ($18m): buy call options to preserve upside',
        explanation: 'Investor with election uncertainty needs the right (not obligation) to lock in the rate. BUY September call options at strike 94.75. Number of contracts = $18m / $500k × (5/3) = 60. Premium = 0.298% × $500,000 × 3/12 × 60 = $22,350.',
        formula: 'Spot today: 94.90; September futures 94.50; basis 0.40\nUnexpired basis at 1 Sep (0 of 6 months left): 0\nExpected futures price 1 Sep (rate = 4.5%): 100 − 4.50 − 0 = 95.50\nOption exercise: 95.50 > 94.75 strike → exercise\nOption gain: (95.50 − 94.75)/100 × $500k × 3/12 × 60 = $56,250\nNet option payoff: $56,250 − $22,350 = $33,900\nInvestment interest at 4.5% − 30 bp = 4.20%: $18m × 4.20% × 5/12 = $315,000\nTotal: $315,000 + $33,900 = $348,900\nEffective annual: $348,900 / ($18m × 5/12) ≈ 4.65%',
      },
      {
        stepNumber: 4,
        title: 'Compare investment options to FRA',
        explanation: 'FRA gives 5.05% guaranteed = $378,750. Options give 4.65% if rate falls to 4.5%. FRA wins in this scenario — but the question of which to use depends on what happens if the opposition LOSES the election (rate stays at 5.10%, options abandoned, net return = $18m × 4.80% × 5/12 − $22,350 = $337,650 vs FRA $378,750). FRA still wins. Recommendation: FRA, unless management is confident rates will rise above ~5.40%, in which case options dominate.',
      },
      {
        stepNumber: 5,
        title: 'Director responses (part b)',
        explanation: 'Director A: Hedging reduces risk and is fundamental treasury practice. Not hedging exposes the business plan to interest-rate shocks. Shareholders understand risk management.\n\nDirector B: The trade-off between certainty and upside is by design. Where uncertainty is high (e.g. election), the cost of giving up upside is worth the certainty. Options preserve upside at the cost of a premium.\n\nDirector C: Wrong. Options ARE the best choice when there is asymmetric uncertainty and the FRA effective rate is unattractive. Not hedging is fine if Abertafol\'s risk appetite tolerates the worst-case scenario — but that\'s a deliberate choice, not the "best" choice in absolute terms.',
      },
    ],

    examinerFeedback: {
      didWell: 'Most candidates correctly identified the direction of each hedge (sell futures for loan, buy options/futures for investment). FRA comparisons were generally well-set-up.',
      commonErrors: 'Confused direction of futures hedge for the loan (some bought instead of sold). Option premium calculation was frequently wrong — the 0.298% is annual, so × 3/12 is needed. Unexpired basis was often miscalculated, especially the loan close-out timing (1 May with June futures = 1 of 4 months remaining).',
      tutorTip: 'For every IR hedge: (1) am I PAYING or RECEIVING interest? (2) what direction is the rate risk? (3) what derivative position offsets that risk? (4) close-out timing → unexpired basis. Write these four answers down before touching a calculator.',
      source: 'E',
    },
  },

]; // end of PAPERS array
