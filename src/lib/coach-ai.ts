/**
 * Coach AI: local rule-based AFM expert.
 * Pattern-matches on keywords and returns structured, examiner-grade explanations.
 *
 * The reply shape is markdown-like text. The chat panel renders it with simple
 * line-break formatting and bold (**...**) handling.
 *
 * Resolution order in askCoach():
 *   1. Generic VITE_COACH_API_URL remote (legacy escape hatch).
 *   2. Paper-specific request → local scaffold (fast quick reference).
 *      Trigger-phrase requests ("model answer for …") are handled by
 *      CoachVoice BEFORE askCoach is called — those stream directly
 *      from /api/coach for an LLM-quality top-achiever answer.
 *   3. Topic KB regex matches (e.g. "explain APV with subsidised loan").
 *   4. Generic topic-menu FALLBACK — only when no paper and no topic match.
 *
 * Policy: Coach writes the model answer when asked. The "won't write your
 * homework" framing has been removed at the site owner's request — Coach
 * is a benchmark generator. The Debrief page is where the user's own
 * submissions go.
 */

import { buildScaffold, detectPaperReference } from '@/lib/coach-paper-scaffold';

export interface CoachReply {
  text: string;
  cite?: string[]; // optional related-topic links
}

const KB: { match: RegExp; reply: () => CoachReply }[] = [
  {
    match: /\b(npv|net present value|inflation|fisher)\b/i,
    reply: () => ({
      text:
        "**NPV core technique:**\n\n" +
        "1. Build the proforma with years 0 to N as columns and items as rows.\n" +
        "2. Inflate **per line** at its own rate. Never pool.\n" +
        "3. Tax at 25% with one-year lag unless told otherwise.\n" +
        "4. Working capital invests in year 0, increments by 2% of incremental revenue, fully released at year N.\n" +
        "5. Tax-allowable depreciation is a non-cash deduction that creates the **tax shield**, not a cash flow itself.\n\n" +
        "**Fisher trap (most common marks-loser):**\n" +
        "(1 + nominal) = (1 + real) (1 + inflation). Pick one and stay there. Mixing real cash flows with a nominal cost of capital wipes the entire NPV mark.\n\n" +
        "**Examiner watch:**\n" +
        "- Quote scenario figures in the conclusion.\n" +
        "- Lead with the recommendation, not the definition.\n" +
        "- Show working notes W1 to W4 below the proforma. Each W is a separate mark.",
      cite: ['npv', 'apv'],
    }),
  },
  {
    match: /\b(apv|adjusted present value|tax shield|subsid)/i,
    reply: () => ({
      text:
        "**APV vs NPV:** NPV uses one discount rate (often WACC) for everything. APV separates the analysis.\n\n" +
        "**Two-stage process:**\n" +
        "1. Base case: discount project cash flows at the **ungeared cost of equity (Ke_u)**.\n" +
        "2. Add the present value of financing side effects:\n" +
        "   - Tax shield on debt interest: PV at Kd or risk-free rate.\n" +
        "   - Issue costs: deduct upfront, net of tax.\n" +
        "   - Subsidised loan benefit: PV of (commercial - subsidised rate) * principal * (1 - T) at unsubsidised post-tax rate.\n\n" +
        "**When to use APV:**\n" +
        "- Project gearing differs from parent gearing.\n" +
        "- Capital structure shifts during project life (LBO, project finance).\n" +
        "- Special financing: subsidies, grants, tax holidays, issue costs.\n\n" +
        "**Common mistake:** discounting the tax shield at WACC. WACC already embeds the tax shield, so you would double-count.",
      cite: ['apv', 'coc'],
    }),
  },
  {
    match: /\b(wacc|cost of capital|m&m|m and m|modigliani|miller|gear|ungear|asset beta|capm|m&m2)/i,
    reply: () => ({
      text:
        "**WACC and the M&M ungear-regear pattern:**\n\n" +
        "The whole drill:\n" +
        "1. Identify a proxy with similar **business** risk.\n" +
        "2. Ungear its equity beta to isolate business risk:\n" +
        "   `Beta_a = Beta_e * E / (E + D * (1 - T))`\n" +
        "3. Regear at the **target project gearing**:\n" +
        "   `Beta_e_new = Beta_a * (1 + D * (1 - T) / E)`\n" +
        "4. CAPM for the new Ke: `Ke = Rf + Beta_e * MRP`\n" +
        "5. Build project WACC: `WACC = (E/V) * Ke + (D/V) * Kd * (1 - T)`\n\n" +
        "**M&M2 with tax (the proposition itself):**\n" +
        "`Ke_g = Ke_u + (Ke_u - Kd) * (D/E) * (1 - T)`\n" +
        "Implication: higher gearing raises Ke (compensating equity holders for higher financial risk), but the after-tax WACC falls because of the tax shield.\n\n" +
        "**Examiner watch:** show the formula, sub in the numbers, quote the result, then a one-line comment. Four lines, four marks.",
      cite: ['coc'],
    }),
  },
  {
    match: /\b(black[- ]?scholes|bsop|bsm|real option|option to (delay|expand|abandon|switch)|d1|d2|n\(d|gamma|delta|vega)/i,
    reply: () => ({
      text:
        "**BSOP for real options:** map the real-world flexibility to the five inputs first.\n\n" +
        "- **Pa** = present value of cash flows you GET on exercise (the asset).\n" +
        "- **Pe** = exercise cost (the bigger investment).\n" +
        "- **t** = years to the decision.\n" +
        "- **r** = risk-free rate.\n" +
        "- **sigma** = volatility of project asset value.\n\n" +
        "Never flip Pa and Pe. Common 4-mark loser.\n\n" +
        "**Formulas:**\n" +
        "`d1 = (ln(Pa/Pe) + (r + 0.5 * sigma^2) * t) / (sigma * sqrt(t))`\n" +
        "`d2 = d1 - sigma * sqrt(t)`\n" +
        "`Call = Pa * N(d1) - Pe * e^(-rt) * N(d2)`\n\n" +
        "**Worked example (option to expand):**\n" +
        "Pa = 25m PV inflows. Pe = 30m capex. t = 2 years. sigma = 30%. r = 4%.\n" +
        "d1 = (ln(25/30) + (0.04 + 0.045) * 2) / (0.3 * sqrt(2)) = (-0.182 + 0.17) / 0.424 = -0.029\n" +
        "d2 = -0.029 - 0.424 = -0.453\n" +
        "N(d1) = 0.488, N(d2) = 0.326\n" +
        "Call = 25 * 0.488 - 30 * e^-0.08 * 0.326 = 12.20 - 9.03 = 3.17m\n\n" +
        "Add 3.17m to the base project NPV. The flexibility itself is worth 3.17m.\n\n" +
        "**Limits to mention:** European-only (single exercise date), constant volatility, fixed strike, tradeable underlying assumption fails for real assets. Compound options need binomial trees.",
      cite: ['real'],
    }),
  },
  {
    match: /\b(fx|hedg|forward|future|money market|mmh|currency|exchange rate)\b/i,
    reply: () => ({
      text:
        "**FX hedging: always tabulate four alternatives.**\n\n" +
        "| Method | When | Side |\n" +
        "|---|---|---|\n" +
        "| Forward | committed CF | bank's offer side when buying foreign |\n" +
        "| Money market | similar economics, BS impact | borrow home, deposit foreign |\n" +
        "| Currency futures | tradeable, basis risk | sell £ futures to hedge £ payable |\n" +
        "| Currency options | uncertain CF | premium upfront, future-value to cash date |\n\n" +
        "**Money market hedge (paying foreign):**\n" +
        "1. PV the foreign payable at the foreign deposit rate.\n" +
        "2. Convert at spot.\n" +
        "3. Borrow home currency to fund.\n" +
        "4. At maturity, deposit pays the foreign payable; you owe the home borrowing principal plus interest.\n\n" +
        "**Common 3-mark losers:**\n" +
        "- Wrong side of bid/ask. Buying foreign uses the higher (offer) side.\n" +
        "- Premium not future-valued.\n" +
        "- No comparison table. The recommendation mark requires picking the cheapest from a side-by-side.\n\n" +
        "**Interest rate parity:** F = S * (1 + i_q) / (1 + i_b). Higher-interest currency depreciates forward.\n" +
        "**Purchasing power parity:** S_n = S_0 * ((1 + h_q) / (1 + h_b))^n. Use for long-run forecasts beyond the forward market.",
      cite: ['fx'],
    }),
  },
  {
    match: /\b(swap|fra|cap|floor|collar|interest rate)\b/i,
    reply: () => ({
      text:
        "**Interest rate hedging: pick the right side.**\n\n" +
        "**FRA:** locks the rate today for a future borrowing. Borrowers BUY FRAs (fearing rises). Depositors SELL FRAs (fearing falls). Settlement = N * (r_ref - r_fra) * days/360, discounted at r_ref. Settled at start of period.\n\n" +
        "**Short sterling futures:** number of contracts = (notional / contract size) * (period / contract period). Sell to hedge against rising rates. Tick value £12.50 on £500k 3m sterling.\n\n" +
        "**Swap with QSD (comparative advantage):**\n" +
        "1. Compute fixed differential and floating differential.\n" +
        "2. QSD = fixed gap minus floating gap.\n" +
        "3. Less bank fees, split remainder 50/50.\n" +
        "4. Each party borrows where it has comparative advantage, then swaps.\n" +
        "5. **Always draw the swap diagram with arrows.** One mark for layout.\n\n" +
        "**Collar:** buy cap and sell floor at different strikes. Net premium near zero. Trade-off: you cap upside if rates fall.\n\n" +
        "**Examiner watch:** show settlement formula explicitly. Periodise annual rates for sub-annual periods.",
      cite: ['ir'],
    }),
  },
  {
    match: /\b(synerg|m\s?and\s?a|m&a|acquisition|merger|max bid|standalone|stand-alone|bootstrap|reverse merger)\b/i,
    reply: () => ({
      text:
        "**M&A: three valuations, three columns.**\n\n" +
        "1. **Stand-alone target:** PV of target FCFF at target WACC. The floor.\n" +
        "2. **With synergy:** stand-alone + PV of synergy at combined WACC.\n" +
        "3. **Maximum bid:** stand-alone + acquirer's share of synergy. The ceiling.\n\n" +
        "Bidding above max bid destroys acquirer wealth.\n\n" +
        "**Three sources of synergy:**\n" +
        "- Revenue (cross-sell, pricing) - hardest to deliver, often overstated.\n" +
        "- Cost (scale, scope, eliminate duplication) - most defensible.\n" +
        "- Financial (lower WACC, debt capacity, tax-loss).\n\n" +
        "**Why is synergy systematically overestimated?**\n" +
        "- M&A waves and cheap credit drive bidding competition.\n" +
        "- Adviser conflict of interest (banks paid on completion).\n" +
        "- Hubris and management overconfidence.\n" +
        "- Agency costs (managers prefer empire).\n" +
        "- Integration always harder than modelled.\n\n" +
        "**Bootstrapping:** share-for-share where acquirer PE > target PE flatters EPS without creating value. Always flag this in the answer.",
      cite: ['mna'],
    }),
  },
  {
    match: /\b(esg|environment|carbon|emiss|sustainab|tcfd|integrated reporting)/i,
    reply: () => ({
      text:
        "**ESG marks since Sep/Dec 2025: 3-step formula.**\n\n" +
        "Generic textbook prose earns ZERO. Apply to scenario.\n\n" +
        "1. **Issue (specific):** pick a fact from the case (e.g. 12,000 tonnes CO2 emissions, supplier modern slavery, board ESG oversight).\n" +
        "2. **Action (costed):** install scrubbers at £8m capex, audit suppliers, appoint ESG committee.\n" +
        "3. **Outcome (quantified):** reduces NPV by £1.2m but secures social licence; saves 30bp on green-loan refinancing; avoids £2m fine.\n\n" +
        "**Cover all three pillars:**\n" +
        "- E: emissions cost, capex on green tech, carbon tax, stranded assets.\n" +
        "- S: jobs, community, safety, supply-chain ethics.\n" +
        "- G: board ESG oversight, disclosure, integrated reporting.\n\n" +
        "**Strong answer template:** \"Annual carbon emissions of 12,000 tonnes from the new line trigger a £4.8m carbon levy at the 2026 rate. Spending £8m upfront on scrubbers reduces NPV by £1.2m but secures planning permission and social licence to operate; without it, the £45m project faces protests delaying first revenue by an estimated 18 months. The community and the regulator are the affected stakeholders.\"\n\n" +
        "Three sentences. Three marks. Memorise the rhythm.",
      cite: ['behav'],
    }),
  },
  {
    match: /\b(islamic|riba|sukuk|murabaha|mudaraba|musharaka|ijara|salam|sharia)\b/i,
    reply: () => ({
      text:
        "**Islamic finance: 5 instruments, 4 principles.**\n\n" +
        "**Principles:**\n" +
        "- Wealth from legitimate trade and asset-backed investment.\n" +
        "- Investment must have social and ethical benefit.\n" +
        "- Risk shared.\n" +
        "- No haram industries.\n" +
        "- Forbidden: riba (interest), gharar (uncertainty), maysir (speculation).\n\n" +
        "**Instruments mapped to conventional equivalents:**\n" +
        "- **Murabaha:** cost-plus trade credit (vs term loan). Bank buys asset, sells with fixed mark-up.\n" +
        "- **Sukuk:** asset-backed bond (vs corporate bond). Holders own the asset, earn rentals.\n" +
        "- **Ijara:** lease.\n" +
        "- **Mudaraba:** capital-plus-management partnership. Profit shared, losses borne by capital provider only.\n" +
        "- **Musharaka:** joint venture. Both contribute capital and share profit/loss.\n\n" +
        "**Salam vs futures:** Salam pays full price upfront, no daily marking-to-market, fixed quality. Futures violate gharar via mark-to-market and standardised contracts.",
      cite: ['islam'],
    }),
  },
  {
    match: /\b(var|value at risk|z\s?value|2\.326|1\.645|sigma|volatility|variance|portfolio)/i,
    reply: () => ({
      text:
        "**Value at Risk:** quote z, sigma, and confidence explicitly. Three sentences, three marks.\n\n" +
        "**Formulas:**\n" +
        "- 1-day VaR = z * sigma * Value (one-tail).\n" +
        "- T-day VaR = 1-day VaR * sqrt(T).\n" +
        "- z(95%) = 1.645. z(99%) = 2.326.\n\n" +
        "**Interpretation template:** \"We are 99% confident the 10-day loss will not exceed £X.\"\n\n" +
        "**Limitations to mention:**\n" +
        "- Assumes normal distribution; real returns have fat tails.\n" +
        "- Silent about tail magnitude beyond the threshold (use Expected Shortfall).\n" +
        "- Sensitive to historical window choice.\n" +
        "- Pro-cyclical: low-vol periods understate true risk.\n\n" +
        "**Worked example:** Annual sigma 18%, daily sigma = 0.18 / sqrt(252) = 1.13%. Portfolio £20m. 1-day 99% VaR = 2.326 * 0.0113 * 20m = £526k. 10-day VaR = 526k * sqrt(10) = £1.66m.\n\n" +
        "**Diversification:** removes unsystematic risk; ~15-20 stocks gets ~95% of the achievable benefit.",
      cite: ['risk'],
    }),
  },
  {
    match: /\b(mirr|irr|profitability index|capital rationing|payback|discounted payback)/i,
    reply: () => ({
      text:
        "**Investment appraisal metrics ranked:**\n\n" +
        "1. **NPV** (best for ranking). Absolute value created. Use for mutually exclusive projects.\n" +
        "2. **MIRR** (good for IRR with explicit reinvestment assumption). MIRR = (TV inflows at reinvestment rate / |PV outflows|)^(1/n) - 1.\n" +
        "3. **IRR** (weakest). Assumes reinvestment at IRR itself, can have multiple values.\n" +
        "4. **PI** (single-period rationing). NPV / Investment. Pick highest PI first within budget.\n" +
        "5. **Payback / Discounted payback** (liquidity check, not a ranking metric).\n\n" +
        "**Multi-period rationing:** PI fails. Use linear programming, project investment as decision variable, total NPV as objective, budget per period as constraint.\n\n" +
        "**Why rankings differ:**\n" +
        "- NPV vs IRR: scale and timing.\n" +
        "- IRR vs MIRR: IRR assumes reinvestment at IRR.\n" +
        "- Multiple IRRs: non-conventional cash flows.",
      cite: ['npv'],
    }),
  },
  {
    match: /\b(divid|payout|share buyback|repurchase|psr|dividend irrelevance)/i,
    reply: () => ({
      text:
        "**Dividend policy:** start with M&M, then break each assumption.\n\n" +
        "**M&M dividend irrelevance:** in perfect markets, dividend policy doesn't affect firm value. Investors create homemade dividends.\n\n" +
        "**Real-world breaks:**\n" +
        "- Tax differential: capital gains often lower than dividends.\n" +
        "- Brokerage fees if shareholders need to sell to create income.\n" +
        "- Internal finance cheaper than external (issue costs 3%+).\n" +
        "- Information asymmetry: dividends signal management confidence.\n" +
        "- Investment opportunities: many positive NPV = retain; few = return cash.\n\n" +
        "**Buyback vs dividend:**\n" +
        "- Buyback gives shareholders control over cash and tax timing.\n" +
        "- Reduces share count, raises EPS.\n" +
        "- Signals undervaluation (positive market reaction).\n" +
        "- Dividends force a tax event on every shareholder.\n\n" +
        "**Football PSR twist:** dividends do NOT count in PSR loss calculations directly, but reduce buffer for cash shocks. Always state: PSR neutrality, signal, capital flexibility, owner relations.",
      cite: ['val'],
    }),
  },
  {
    match: /\b(prof skills|professional skills|communication|scepticism|commercial acumen|analysis)/i,
    reply: () => ({
      text:
        "**Professional Skills: 20 marks per paper. They are NOT optional.**\n\n" +
        "Four categories, easy to bank:\n\n" +
        "1. **Communication:** structured headings, signposted bullets, audience-fit tone. Lead with the recommendation.\n" +
        "2. **Analysis & Evaluation:** compare alternatives in numbers AND words. Sensitivity analysis. Sub-conclusions.\n" +
        "3. **Scepticism:** stress-test assumptions. Flag bias. \"Synergy of £14m looks aggressive given...\". Question the forecast.\n" +
        "4. **Commercial Acumen:** industry context, implementation feasibility, stakeholder pushback, ESG and reputational dimensions.\n\n" +
        "**The deliberate-skill trick:** at the end of every long answer, write 4 short bullets, one per skill, tied to the case. 4 bullets in 3 minutes can earn 4 marks.\n\n" +
        "**Common pattern:** candidates who score 50%+ on technical work earn full Professional Skills marks 9 times out of 10. Candidates who scrape 40% on technical lose ~5 of these too.",
      cite: [],
    }),
  },
  {
    match: /\b(senior adviser|board paper|report|stakeholder|recommendation|advise the board)/i,
    reply: () => ({
      text:
        "**Section A board paper format:**\n\n" +
        "```\n" +
        "BOARD PAPER\n" +
        "To: Board of [Company]\n" +
        "From: Senior Financial Adviser\n" +
        "Subject: [recommendation in one line]\n" +
        "```\n\n" +
        "**Section structure:**\n" +
        "1. Executive Summary (3 sentences max). Your recommendation upfront.\n" +
        "2. Methodology / approach.\n" +
        "3. Numerical analysis.\n" +
        "4. Sensitivities and risks.\n" +
        "5. Discussion of strategic and non-financial factors.\n" +
        "6. Recommendations (numbered, actionable).\n\n" +
        "**Stakeholder mapping (Mendelow):** power x interest grid. Identify who matters, who doesn't, and what tensions exist.\n\n" +
        "**Common stakeholder tensions in football:**\n" +
        "- Owners want returns; clubs need reinvestment.\n" +
        "- Regulators (PL/FA/UEFA/DFL/MLB) want club-level solvency; owners want extraction.\n" +
        "- Players want investment; finance team wants cost discipline.\n" +
        "- Supporters want sporting success; commercial wants ticket pricing.\n\n" +
        "Adviser balances; doesn't optimise one dimension.",
      cite: ['adviser'],
    }),
  },
  {
    match: /\b(yield curve|term structure|liquidity preference|expectations|segmentation|duration|convexity|bond)/i,
    reply: () => ({
      text:
        "**Yield curve and bond mathematics:**\n\n" +
        "**Why curves slope upward (3 theories):**\n" +
        "1. Future expectations: short rates expected to rise.\n" +
        "2. Liquidity preference: investors demand premium for longer maturity.\n" +
        "3. Market segmentation / preferred habitat: banks at short end, pension funds at long end.\n\n" +
        "**Duration:** weighted average time to receive cash flows. Higher coupon = lower D.\n" +
        "Price sensitivity: dP/P approximately = -D * di / (1 + i).\n\n" +
        "**Limitations of duration:**\n" +
        "- Linear approximation; the real price-yield relationship is convex.\n" +
        "- Underestimates gain (overestimates loss) for large rate moves.\n" +
        "- Assumes parallel shifts; doesn't handle yield-curve shape changes.\n\n" +
        "**Convexity** corrects for the curvature: dP/P = -D * di + 0.5 * Convexity * (di)^2.",
      cite: ['ir', 'risk'],
    }),
  },
  {
    match: /\b(reconstruction|liquidation|distress|insolven|company doctor|going concern|haircut)/i,
    reply: () => ({
      text:
        "**Corporate reconstruction: liquidation waterfall first.**\n\n" +
        "1. Compute liquidation distribution by **legal priority**:\n" +
        "   - Secured creditors get their secured asset value.\n" +
        "   - Bank floating charge next.\n" +
        "   - Trade payables and unsecured next (often nothing).\n" +
        "   - Equity last (usually zero).\n\n" +
        "2. For each class, compare reconstruction recovery vs liquidation recovery.\n\n" +
        "3. Identify the **critical class** that loses out under reconstruction. Their support is the dealbreaker.\n\n" +
        "**Indicators of distress:**\n" +
        "- Persistent negative FCF despite revenue growth.\n" +
        "- Interest cover < 2 and falling.\n" +
        "- Working capital deterioration: extended payable days, deferred liabilities.\n" +
        "- Wage-to-revenue above 70% in football.\n" +
        "- Auditor going-concern qualification.\n\n" +
        "**Senior adviser role:** rolling 18-month forecast, stress-test scenarios, covenant management, Plan B optionality before distress is acute (negotiating leverage is highest before crisis hits).",
      cite: ['mna'],
    }),
  },
  {
    match: /\b(behavioural|behaviour|herd|hubris|loss aversion|anchoring|gamblers fallacy|entrapment|sunk cost)/i,
    reply: () => ({
      text:
        "**Behavioural finance: name, explain, apply.**\n\n" +
        "Generic lists fail. Pick 2-3 biases relevant to the scenario. For each:\n" +
        "- NAME the precise bias (use ACCA terminology).\n" +
        "- EXPLAIN the mechanism in one sentence.\n" +
        "- APPLY to a scenario figure or fact.\n\n" +
        "**The 7 biases the examiner uses:**\n" +
        "1. Anchoring: irrelevant reference (asking price).\n" +
        "2. Availability: over-react to recent news.\n" +
        "3. Hubris/overconfidence: synergy estimates, M&A premiums.\n" +
        "4. Loss aversion: pain ~2x pleasure; holding losers too long.\n" +
        "5. Herd: M&A waves, bubble formation.\n" +
        "6. Gambler's fallacy: past changes future probability.\n" +
        "7. Entrapment / sunk-cost: throwing good money after bad.\n\n" +
        "**Worked example (M&A overpayment):**\n" +
        "\"Hubris is the bias here. Acquirers overestimate synergy and underestimate integration time. Hav Co's track record (4 of 6 past deals destroyed value) signals this risk is live, so the board should commission independent due diligence and set a binding maximum bid.\"",
      cite: ['behav'],
    }),
  },
  {
    match: /\b(memori[sz]e|memory palace|loci|mnemon|recall technique|spaced repetition|leitner|feynman|active recall|chunking|dual coding|elaborat)/i,
    reply: () => ({
      text:
        "**Six techniques that beat re-reading every time:**\n\n" +
        "1. **Active recall:** close the notes, write the formula from memory, then check. The retrieval *is* the learning. Re-reading feels productive but the brain doesn't encode.\n" +
        "2. **Spaced repetition (Leitner 5-box):** seen today -> 1d -> 3d -> 7d -> 14d. Each correct recall promotes the card; each miss demotes to box 1. The Cards page does this for you.\n" +
        "3. **Feynman technique:** explain the concept in plain English to an imaginary 12-year-old. Where you stumble is exactly where understanding is missing. Try it on M&M2 right now.\n" +
        "4. **Memory palace (method of loci):** anchor each formula to a room in a place you know. WACC at the front door, CAPM in the kitchen, Black-Scholes in the bedroom. Walk the route mentally on exam morning.\n" +
        "5. **Chunking:** APV is one chunk, not nine steps. Group: base case + tax shield + issue costs + subsidy. Four chunks recall faster than nine separate facts.\n" +
        "6. **Dual coding:** pair every formula with a doodle. Swap diagram = arrows. Yield curve = a hill. Real option = a fork in the road. Verbal + visual encoding doubles retrieval paths.\n\n" +
        "Open the **Memory Lab** page for working palaces, mnemonic generators, and a Leitner box you can drive with one click.",
      cite: [],
    }),
  },
  {
    match: /\b(explain.*(simple|like.*5|eli5|plain english|in plain|analog)|analogy|metaphor)/i,
    reply: () => ({
      text:
        "**Plain-English explainer mode.** Pick one of these and ask again with 'ELI5' in front:\n\n" +
        "- **WACC = the average rent your money pays.** Equity rent + debt rent, weighted by how much you borrowed each from. Tax discount on the debt rent because interest is deductible.\n" +
        "- **APV = NPV with the receipts itemised.** First, what would the project be worth if 100% equity-financed? Then add the cash you save because the taxman lets you deduct interest. Then add or subtract any one-off financing perks.\n" +
        "- **Real option = paying for the right to change your mind.** Like buying a refundable plane ticket. The flexibility itself has value, even if you never use it.\n" +
        "- **VaR = the worst night you'd expect 1 in 100 nights.** Doesn't tell you how bad the *worst-ever* night is; just sets the threshold.\n" +
        "- **Black-Scholes = an option-priced calculator.** Inputs: today's price, strike, time, volatility, rate. Outputs: a fair premium. The d1, d2, N() machinery just turns those five numbers into a price.\n" +
        "- **M&M2 = adding debt makes equity riskier, but the tax shield more than pays you back, up to a point.**\n\n" +
        "Want me to explain a *specific* AFM concept this way? Type: 'ELI5 [topic]'.",
      cite: [],
    }),
  },
];

const FALLBACK: CoachReply = {
  text:
    "I cover the core AFM topics. Try asking about:\n\n" +
    "- NPV with inflation, APV, Fisher trap\n" +
    "- WACC, M&M2, ungear-regear\n" +
    "- Black-Scholes, real options\n" +
    "- FX hedging, money market, forward, options\n" +
    "- IR swaps, FRA, futures, collars\n" +
    "- M&A synergy, max bid, bootstrapping\n" +
    "- ESG marks structure (issue / action / outcome)\n" +
    "- Islamic finance instruments\n" +
    "- VaR, portfolio diversification, behavioural biases\n" +
    "- Section A board paper format and Professional Skills marks\n\n" +
    "Or paste a specific question from a practice set and I will give you the structure to start with.",
};

export async function askCoach(question: string): Promise<CoachReply> {
  const remoteUrl = import.meta.env.VITE_COACH_API_URL;
  if (remoteUrl) {
    try {
      const res = await fetch(remoteUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Coach API HTTP ${res.status}`);
      const data = await res.json();
      const text = typeof data?.text === 'string' && data.text.trim()
        ? data.text
        : typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : null;
      if (!text) throw new Error('Coach API returned no text');
      return { text, cite: Array.isArray(data?.cite) ? data.cite : undefined };
    } catch (err) {
      // Configured remote failed. Log once so a misconfigured URL is
      // visible, then degrade to local KB (don't render an empty bubble).
      // eslint-disable-next-line no-console
      console.warn('[coach-ai] remote failed, using local KB:', err);
    }
  }
  // Simulate "thinking" briefly so the UX is alive
  await new Promise((r) => setTimeout(r, 350 + Math.random() * 350));

  // 1. Paper-specific (non-trigger) request: return the local scaffold
  //    as a fast, no-cost quick reference. Trigger-phrase requests
  //    ("model answer for …") are routed to /api/coach by CoachVoice
  //    BEFORE askCoach is called, so by the time we get here we know
  //    the user wanted the lightweight lookup.
  const paperMatch = detectPaperReference(question);
  if (paperMatch) {
    return {
      text: buildScaffold({
        paper: paperMatch.paper,
        partLabel: paperMatch.partLabel,
      }),
      cite: paperMatch.paper.topics,
    };
  }

  // 2. Topic KB — concept-level questions ("explain APV with subsidies").
  for (const entry of KB) {
    if (entry.match.test(question)) return entry.reply();
  }

  // 3. Only when nothing else matched.
  return FALLBACK;
}

/** Suggested prompts for the chat UI. */
export const COACH_SUGGESTIONS = [
  'Write me the model answer for Para Fuels Co part (a)',
  'Top-achiever model answer for Fondir Co part (b)(i)',
  'Model answer for Lough Co part (a) with the marking key',
  'How do I structure an APV calculation with a subsidised loan?',
  'Walk me through the 3-column M&A valuation',
  'Map a real option to expand to Black-Scholes inputs',
  'How do I bank ESG marks in a Section A scenario?',
  'Explain M&M2 ungear-regear step by step',
];

