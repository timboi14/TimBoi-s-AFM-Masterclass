// Source-linked curriculum, verified 15 November 2026. Original extracts live in the personal library.
export const SUBJECT = "AFM" as string;
export const SYLLABUS_NOTE = "AFM has no syllabus changes for September 2026\u2013June 2027. The site map now follows A\u2013G, including reconstruction (D), treasury (E) and professional skills (F).";
export const SYLLABUS_URL = "https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/syllabus-study-guide.html";
export const MODULES = [
  {
    "id": "afm-chapter-1",
    "ref": "A1–A3",
    "title": "Role and responsibility of the financial manager",
    "topicId": "adviser",
    "start": 35,
    "end": 74,
    "teaching": "Financial decisions connect investment, financing and distributions to stakeholder objectives. Explain value creation, constraints, ethical tensions and the assumptions behind your recommendation.",
    "prompts": [
      "How would you resolve a shareholder–stakeholder conflict?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Compare the financial effect and ethical consequences of each action; recommend a feasible policy with safeguards rather than treating shareholder wealth as permission to ignore other stakeholders."
  },
  {
    "id": "afm-chapter-2",
    "ref": "B1",
    "title": "Investment appraisal",
    "topicId": "npv",
    "start": 75,
    "end": 104,
    "teaching": "Build incremental after-tax cash flows at their actual dates. Match nominal cash flows with a nominal discount rate. Separate sunk costs, opportunity costs, working capital movements and terminal recovery.",
    "prompts": [
      "Why can a profitable project have a negative NPV?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Accounting profit does not capture cash timing or the opportunity cost of capital. NPV discounts incremental cash flows, including investment and working capital. Test tax timing and inflation before interpreting the result."
  },
  {
    "id": "afm-chapter-3",
    "ref": "A4–A5, B5",
    "title": "International operations and investment",
    "topicId": "fx",
    "start": 105,
    "end": 152,
    "teaching": "Distinguish project cash flows from cash remitted to the parent. Model exchange rates, withholding taxes, tax credits, blocked funds and remittance timing before evaluating political and commercial risks.",
    "prompts": [
      "When do local cash flows overstate value to the parent?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "When funds cannot be remitted, incur additional taxes, or translate at adverse exchange rates. Keep currency and discount-rate assumptions consistent and evaluate the limits of parity forecasts."
  },
  {
    "id": "afm-chapter-4",
    "ref": "A2, B3",
    "title": "Financing decisions",
    "topicId": "coc",
    "start": 153,
    "end": 200,
    "teaching": "Choose funding by considering cost, maturity, currency, covenants and flexibility. Relate capital structure theory to taxes, distress, information asymmetry and the company’s financing capacity.",
    "prompts": [
      "Why might the cheapest quoted borrowing be unsuitable?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Its maturity, currency exposure or covenants may create risks and refinancing costs. Evaluate the total risk-adjusted consequences, including tax relief and financial flexibility."
  },
  {
    "id": "afm-chapter-5",
    "ref": "A6",
    "title": "Dividend policy",
    "topicId": "adviser",
    "start": 201,
    "end": 232,
    "teaching": "Dividend capacity depends on cash, distributable reserves and investment needs. Separate a sustainable distribution policy from one-off cash releases, and consider signalling and shareholder preferences.",
    "prompts": [
      "How would you distinguish capacity to pay from willingness to pay?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Forecast cash and legal reserves first, then assess investment, liquidity buffers and financing constraints. A payout recommendation should explain both affordability and strategic suitability."
  },
  {
    "id": "afm-chapter-6",
    "ref": "B3",
    "title": "Weighted average cost of capital",
    "topicId": "coc",
    "start": 233,
    "end": 260,
    "teaching": "Use market-value weights and an after-tax cost of debt where relief is available. A company WACC is suitable only when the project’s operating and financing risks are comparable.",
    "prompts": [
      "When does discounting at the current WACC mislead?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "When project business risk or gearing differs materially. Estimate a project-specific asset beta and regear appropriately, or value financing effects separately with APV."
  },
  {
    "id": "afm-chapter-7",
    "ref": "B3",
    "title": "Risk-adjusted WACC and APV",
    "topicId": "apv",
    "start": 261,
    "end": 284,
    "teaching": "Ungear comparable equity betas to isolate business risk, then regear for the target financing. APV adds the present value of financing benefits and costs to an all-equity base-case NPV.",
    "prompts": [
      "How do you avoid counting interest tax relief twice?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Use unlevered cash flows and an ungeared discount rate for the APV base case, then add financing effects separately. Do not also embed that relief in a debt-adjusted WACC."
  },
  {
    "id": "afm-chapter-8",
    "ref": "B2",
    "title": "Option pricing",
    "topicId": "real",
    "start": 285,
    "end": 312,
    "teaching": "Identify the flexibility to expand, delay or abandon before using option pricing. Map the underlying project value, exercise cost, time, volatility and risk-free rate to the decision.",
    "prompts": [
      "What makes a real option valuable, and what limits the model?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Flexibility permits favourable choices while limiting losses. Model inputs, traded-asset assumptions and managerial ability to exercise can be uncertain; explain these limitations alongside the valuation."
  },
  {
    "id": "afm-chapter-9",
    "ref": "E1",
    "title": "Risk management and treasury",
    "topicId": "risk",
    "start": 313,
    "end": 352,
    "teaching": "Identify exposures before selecting a hedge. Treasury policies should distinguish transaction, translation and economic risks and balance risk reduction against cost and control requirements.",
    "prompts": [
      "Why might a hedge reduce risk without maximising profit?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "A hedge gives greater certainty by offsetting adverse outcomes and may surrender favourable movements. Judge it against the approved risk objective rather than hindsight gains."
  },
  {
    "id": "afm-chapter-10",
    "ref": "E2",
    "title": "Foreign exchange hedging",
    "topicId": "fx",
    "start": 353,
    "end": 392,
    "teaching": "For each receipt or payment, fix the currency, amount and date. Compare forwards, money-market hedges, futures and options on a consistent home-currency basis, allowing for premiums and basis risk.",
    "prompts": [
      "How do you choose the correct side of a bid–offer quote?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Write the currency conversion explicitly and identify what the bank buys or sells. Check the units cancel. For derivatives, choose the position that offsets the underlying exposure."
  },
  {
    "id": "afm-chapter-11",
    "ref": "E3",
    "title": "Interest rate hedging",
    "topicId": "ir",
    "start": 393,
    "end": 426,
    "teaching": "Identify borrowing or deposit exposure, reset date and tenor. Compare FRAs, futures, options, collars and swaps, including premiums, contract counts, basis and timing differences.",
    "prompts": [
      "Why does a borrower sell interest-rate futures?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "A rise in market rates reduces the quoted futures price, so a short futures position gains and offsets the higher borrowing cost. Match contract periods and assess residual basis exposure."
  },
  {
    "id": "afm-chapter-12",
    "ref": "C1–C4",
    "title": "Acquisitions and mergers",
    "topicId": "mna",
    "start": 427,
    "end": 466,
    "teaching": "Compare acquisition with organic growth, value synergy separately, and assess how the consideration divides gains. Evaluate integration, regulation, culture and defensive measures.",
    "prompts": [
      "What is the maximum rational acquisition premium?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "The value of achievable net synergy, subject to risk and integration costs. Calculate gains to both shareholder groups and explain how cash, shares and mixed offers allocate risk."
  },
  {
    "id": "afm-chapter-13",
    "ref": "B4, C2",
    "title": "Business valuation",
    "topicId": "val",
    "start": 467,
    "end": 508,
    "teaching": "Match the valuation model to its cash flow: FCFF with WACC, FCFE with cost of equity. Convert enterprise to equity value consistently and test terminal growth and comparable multiples.",
    "prompts": [
      "Why is enterprise value not the shareholders’ proceeds?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Enterprise value belongs to all capital providers. Deduct debt and other relevant claims and add surplus non-operating assets where appropriate. Avoid inconsistent treatment of cash."
  },
  {
    "id": "afm-chapter-14",
    "ref": "D1–D2",
    "title": "Corporate reconstruction and reorganisation",
    "topicId": "mna",
    "start": 509,
    "end": 558,
    "teaching": "Compare going-concern reconstruction with liquidation and alternative reorganisations. Assess the value and risk received by each stakeholder, including dilution and new financing.",
    "prompts": [
      "How can a viable reconstruction still fail?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Stakeholders may reject unequal sacrifices or unsupported forecasts. Show post-reconstruction solvency, sustainable cash flows and the distribution of gains versus liquidation."
  },
  {
    "id": "afm-chapter-15",
    "ref": "F1–F4",
    "title": "Professional skills",
    "topicId": "adviser",
    "start": 559,
    "end": 568,
    "teaching": "Use the requested report format. Make workings traceable, challenge assumptions, connect calculations to commercial consequences and finish with a justified recommendation.",
    "prompts": [
      "How do professional skills appear in a numerical answer?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "Through clear assumptions, labelled workings, sensible rounding, scepticism about input reliability, interpretation of the result and a recommendation suited to the business."
  },
  {
    "id": "afm-chapter-16",
    "ref": "G1–G4",
    "title": "Employability and technology skills",
    "topicId": "npv",
    "start": 569,
    "end": 578,
    "teaching": "Practise the spreadsheet and word processor as part of every timed answer. Organise calculations so a reviewer can follow formulas and distinguish inputs from results.",
    "prompts": [
      "What should a reviewer be able to trace?",
      "Work one source example without its solution. What assumptions or limitations matter?"
    ],
    "answer": "The source of each input, the calculation applied, the result and its implication for the recommendation. Use the existing CBE tools and practise navigating exhibits under time pressure."
  }
];
