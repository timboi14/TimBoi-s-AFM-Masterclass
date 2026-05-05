/**
 * 64 frequently-asked theory Q&A. Two answer modes:
 *   bullets: revision-mode condensed marks
 *   full:    full ACCA examiner model answer
 * No em dashes anywhere.
 */

export interface ThoeryCard {
  ref: number;
  cat: ThoeryCat;
  q: string;
  bullets: string;
  full: string;
}

export type ThoeryCat =
  | 'bsop'
  | 'apv'
  | 'risk'
  | 'val'
  | 'mna'
  | 'fx'
  | 'ir'
  | 'islam'
  | 'behav'
  | 'treasury'
  | 'misc';

export const CAT_LABELS: Record<ThoeryCat, { label: string; icon: string; color: string }> = {
  bsop: { label: 'BSOP and Real Options', icon: 'fa-bolt', color: '#ffd600' },
  apv: { label: 'APV', icon: 'fa-sitemap', color: '#60a5fa' },
  risk: { label: 'Risk and VaR', icon: 'fa-shield-halved', color: '#f59e0b' },
  val: { label: 'Valuation and Dividends', icon: 'fa-coins', color: '#34d399' },
  mna: { label: 'M&A and Restructuring', icon: 'fa-handshake', color: '#a78bfa' },
  fx: { label: 'FX hedging', icon: 'fa-money-bill-transfer', color: '#22d3ee' },
  ir: { label: 'IR, Swaps, Collars', icon: 'fa-percent', color: '#f472b6' },
  islam: { label: 'Islamic finance', icon: 'fa-mosque', color: '#10b981' },
  behav: { label: 'Behavioural and Reporting', icon: 'fa-brain', color: '#ec4899' },
  treasury: { label: 'Treasury and IMF', icon: 'fa-building-columns', color: '#94a3b8' },
  misc: { label: 'Other', icon: 'fa-ellipsis', color: '#6b7280' },
};

export const THEORY: ThoeryCard[] = [
  // BSOP and Real Options
  {
    ref: 1,
    cat: 'bsop',
    q: 'How does a DECREASE in each BSOP determinant change a CALL price?',
    bullets:
      'Security price down: call down (less profitable to exercise)\nExercise price down: call up (more profit on exercise)\nRisk free rate down: call down (lower opportunity benefit)\nTime to expiry down: call down (less time value)\nVolatility down: call down (less chance of being ITM)',
    full: 'The value of the option depends on five variables. (i) The price of the security: a decrease will mean a call option becomes less valuable, since exercising means buying a security worth less. (ii) The exercise price: a decrease in the strike makes the call more valuable, since the profit on exercise is larger. (iii) Risk free rate: a decrease makes the call less valuable. The option holder has spare cash that could be invested at Rf. A lower Rf reduces the benefit of holding the option. (iv) Time to expiry: a decrease reduces the time value component, so the call is worth less. (v) Volatility: a decrease reduces the chance the security ends in the money at expiry, so the call is worth less.',
  },
  {
    ref: 63,
    cat: 'bsop',
    q: 'How can BSOP value the EQUITY and DEBT of a company?',
    bullets:
      'Equity = call option on firm assets (Merton)\nPa = fair value of assets\nPe = redemption value of equivalent zero coupon debt\nt = time to debt maturity, r = Rf, sigma = asset volatility\nDebt value via put-call parity from equity value',
    full: 'Because of limited liability, shareholders can walk away when debt exceeds asset value. When assets exceed debts, shareholders keep the surplus. So equity is a call option on the firm assets. Inputs are: Pa fair value of assets, Pe redemption value of equivalent zero-coupon debt (the amount owed including interest), t time to debt maturity, r risk-free rate, sigma asset volatility. Debt value can be obtained from put-call parity: equity (call) plus risk-free debt equals firm assets plus put. So debt = risk-free bond minus put on assets.',
  },
  {
    ref: 62,
    cat: 'bsop',
    q: 'BSOP assumptions (5)?',
    bullets:
      'European-style option only\nLognormal share price; continuous trading\nUnrestricted short selling\nNo taxes or transaction costs\nNo dividends during option life',
    full: 'The five Black-Scholes assumptions: (1) European exercise only (no early exercise). (2) Share price follows a log-normal distribution and is continuously traded. (3) Unrestricted short selling of the underlying. (4) No market frictions: zero taxes and transaction costs. (5) No dividends are paid during the option life. These restrictions matter because real markets have frictions, dividends, and discrete trading. Adjustments such as dividend yield versions or binomial trees relax these assumptions.',
  },
  {
    ref: 13,
    cat: 'bsop',
    q: 'How can REAL OPTIONS help NPV decisions?',
    bullets:
      'NPV assumes now-or-never. Real options recognise managerial flexibility.\nDelay, expand, abandon, switch.\nCaptures TIME VALUE of flexibility plus intrinsic value.\nUpside captured, downside avoided.\nAdjusted NPV = traditional NPV + option value.',
    full: 'NPV assumes the decision must be made immediately or not at all, and once made, it cannot be reversed. Real options recognise that most investments contain flexibility: the choice to delay until uncertainty resolves, to expand if conditions are favourable, to abandon if they deteriorate, or to switch inputs and outputs. Real options assign a value to this flexibility using option pricing. The total project value becomes the static NPV plus the option value of the flexibility. Real options view risk as opportunity, since the holder can capture upside while declining downside.',
  },
  {
    ref: 58,
    cat: 'bsop',
    q: 'When do we use BSOP for company valuation?',
    bullets:
      'When conventional methods miss risk: unlisted, unpredictable growth, distressed debt.\nEquity = call on assets (limited liability = walk-away put).\nFive inputs: assets fair value, debt face (zero-coupon equivalent), time, asset volatility, Rf.',
    full: 'BSOP is useful when conventional valuation methods do not capture risk fully. For unlisted companies, distressed firms, or companies with unpredictable growth, BSOP can value equity as a call on the firm assets. Proxies: exercise price equals the value of an equivalent zero-coupon bond with the same yield and maturity as existing debt. Underlying asset is the fair value of company assets less current liabilities. Time to expiry equals time until debt redemption. Volatility is the volatility of business assets. The risk-free rate is a short-term government bond rate.',
  },
  {
    ref: 45,
    cat: 'bsop',
    q: 'High GAMMA on a long call means what?',
    bullets:
      'Gamma = ΔDelta/ΔUnderlying\nHighest at-the-money and close to expiry\nHigh-gamma long call = ATM, short time to expiry, very sensitive',
    full: 'Gamma measures the rate of change of delta. Delta ranges near 0 deep out of the money to near 1 deep in the money. At the money, delta is near 0.5 and changes most rapidly. Therefore gamma is highest at the money. Gamma is also higher closer to expiry. So a high-gamma long call is at the money with short time to expiry, meaning the option is very sensitive to small changes in the underlying.',
  },
  {
    ref: 46,
    cat: 'bsop',
    q: 'Using DELTA as hedge ratio: how many contracts?',
    bullets:
      'Delta = ΔOption/ΔUnderlying\nTo hedge $1 with delta 0.8: need 1/0.8 = 1.25 option contracts\nInverse of delta = hedge ratio',
    full: 'Delta measures how much the option price changes for a unit change in the underlying. With a delta of 0.8, a $1 rise in underlying produces only a $0.80 rise in option value. To hedge $1 of exposure, you need 1/0.8 = 1.25 option contracts. The hedge ratio is the inverse of delta. As delta changes, gamma forces the hedge to be rebalanced, called dynamic delta hedging.',
  },
  {
    ref: 50,
    cat: 'bsop',
    q: 'How does combining real options with NPV improve company valuation?',
    bullets:
      'Traditional NPV = intrinsic value only\nReal options ADD time value of flexibility\nCrucial for innovative pipelines, R&D, staged investments\nAdjusted value = NPV + option value',
    full: 'Traditional NPV captures only the intrinsic value of taking the project today. Real options capture the time value of waiting, expanding or abandoning. For companies with innovative product pipelines, the option to commercialise after R&D success is essentially a call on a future investment. The standalone NPV of R&D may be negative, but the option value of the commercialisation step makes the whole package positive. Combining the two gives a better view of total value.',
  },

  // Islamic finance
  {
    ref: 5,
    cat: 'islam',
    q: 'Islamic finance vs conventional: main differences?',
    bullets:
      'Wealth from legitimate trade and asset-backed investment (no money from money)\nInvestment must have social and ethical benefit\nRisk shared\nNo haram industries\nForbidden: riba (interest), gharar (uncertainty), maysir (speculation)\nKey instruments: Murabaha, Sukuk, Ijara, Mudaraba, Musharaka',
    full: 'Islamic finance applies Sharia law. The four principles are: wealth must come from legitimate trade and asset-backed investment, not from money making money; investment should have social and ethical benefit; risk should be shared between provider and user of capital; harmful activities such as gambling, alcohol and pork are avoided. Conventional debt at interest violates these principles, since the lender earns regardless of project outcome. Alternatives include Murabaha (cost-plus trade credit), Sukuk (asset-backed bond), Ijara (lease), Mudaraba (capital plus management partnership) and Musharaka (joint venture).',
  },
  {
    ref: 14,
    cat: 'islam',
    q: 'Mudaraba contract explained',
    bullets:
      'Partnership: rabb-ul-mal (capital owner) + mudarib (manager)\nProfits split per agreed ratio\nLosses ONLY borne by capital provider\nNo interest. No bank interference in management.',
    full: 'Mudaraba is a partnership in which one party (rabb-ul-mal) provides capital and the other (mudarib) provides expertise and effort. Profits are shared per a pre-agreed ratio. Crucially, losses are borne entirely by the capital provider. The mudarib loses only time and effort. There is no interest. The bank does not interfere in day-to-day management. This shifts the financial downside to the financier, which makes mudaraba especially suitable for higher-uncertainty businesses where conventional debt service would be risky.',
  },
  {
    ref: 47,
    cat: 'islam',
    q: 'Salam vs Futures: key differences',
    bullets:
      'Salam: full payment at start, deliver later. Price/quantity/quality fixed.\nFutures: marked-to-market daily, standard size and expiry.\nSalam Sharia-compliant; futures may breach gharar/maysir.',
    full: 'Islamic principles require avoidance of uncertainty (gharar) and speculation (maysir). In a Salam contract, the buyer pays in full at contract date for delivery later. Price, quantity and quality are fixed at the start, removing speculative ambiguity. Futures, by contrast, are marked-to-market daily with daily cash flows, have standardised contract sizes and expiry dates that do not match the underlying perfectly, and most are settled before delivery in cash. The standardisation creates basis risk and the daily settlement creates uncertainty.',
  },

  // M&A
  {
    ref: 6,
    cat: 'mna',
    q: 'Why may a firm switch from organic growth to acquisition?',
    bullets:
      'Quicker access to products/markets/tech/expertise\nHorizontal: eliminate competitor, scale economies\nVertical: secure supply/value chain\nSaturated markets: little room for organic\nBalanced against: integration risk, premium overpayment, culture clash',
    full: 'Organic growth is slow and expensive in saturated markets. Acquisitions deliver instant scale, market access, technology and talent. Horizontal acquisitions consolidate market share and unlock economies of scale. Vertical acquisitions secure the supply chain or distribution. The downside is that synergies are often overestimated and integration is consistently underplanned, so many acquisitions destroy value. The decision rests on whether the time and risk premium of organic growth exceeds the integration risk and acquisition premium of buying.',
  },
  {
    ref: 7,
    cat: 'mna',
    q: 'Three types of synergy?',
    bullets:
      'REVENUE: cross-sell, pricing power, longer competitive moat (hardest to defend)\nCOST: scale and scope economies, eliminate duplication, bulk purchasing\nFINANCIAL: lower WACC, internal capital market, debt capacity, tax loss',
    full: 'Synergy comes in three forms. Revenue synergy: cross-selling, pricing power, geographic expansion. These are the hardest to deliver and are systematically overestimated in deal models. Cost synergy: scale economies, scope economies, elimination of duplicated overhead. These are more defensible because they reflect physical reorganisation. Financial synergy: lower cost of capital, debt capacity expansion, internal capital allocation, tax-shield monetisation. Each type should be costed separately and stress tested in the bid model.',
  },
  {
    ref: 8,
    cat: 'mna',
    q: 'How to reduce risk of value destruction in an acquisition?',
    bullets:
      'Post-audit recent deals to learn from failures\nProper due diligence; reasonable valuation inputs\nSynergy targets allocated to senior managers and tracked\nClear maximum premium and walk-away discipline\nIntegration plan and retention strategy for key staff',
    full: 'A board can reduce the risk of value destruction by: post-auditing recent deals to identify what went wrong; commissioning independent due diligence; setting and tracking specific synergy targets owned by senior managers; defining a maximum bid above which the buyer walks away; designing an integration plan with clear stakeholders and milestones; planning retention packages for key target staff and respecting the cultural fit. Generic claims of synergy without an owner and a number rarely materialise.',
  },
  {
    ref: 9,
    cat: 'mna',
    q: 'Sell-off vs MBI: what differs?',
    bullets:
      'BOTH dispose non-core. Sell-off: third party for cash, lose control.\nMBI: external mgmt team buys, equity stake, suits where new mgmt can run better.',
    full: 'Both forms of unbundling dispose non-core operations. A sell-off is a sale to a third party (often a competitor or PE firm) for cash or other consideration. The seller loses control. A management buy-in is a particular type of sell-off in which an external management team purchases the unit, taking equity and running it themselves. MBIs suit situations where a new management team can run the asset better than incumbent owners, especially where the asset is undervalued under current ownership.',
  },
  {
    ref: 11,
    cat: 'mna',
    q: 'IPO vs Reverse takeover: when each?',
    bullets:
      'IPO: conventional listing, marketing, prospectus, costly, slow.\nReverse: private firm buys listed shell, gains listing without IPO. Cheaper, faster, certain.\nBut: shell hidden liabilities, weaker analyst following.',
    full: 'IPO is the standard route to a stock listing: prepare a prospectus, market the shares, comply with regulator requirements, sell shares to investors. Costly and slow but builds analyst coverage. Reverse takeover: a private company merges with an already-listed shell, transferring the private companys business into the listed shell. Faster, cheaper, certain. Drawbacks: the shell may carry hidden liabilities; due diligence is essential. Listings via reverse takeover often have weaker analyst coverage and may struggle to raise follow-on capital.',
  },
  {
    ref: 19,
    cat: 'mna',
    q: 'Why is synergy often OVERESTIMATED?',
    bullets:
      'Cheap-credit waves drive bidding competition\nConflicts of interest: deal advisers earn from completion\nManagement overconfidence; reluctance to admit mistake\nAgency costs: managers pursue size over value\nIntegration difficulties (culture, systems)',
    full: 'Synergies are systematically overestimated for structural reasons. Cheap credit drives M&A waves and bidding competition pushes premiums above realistic synergy. Deal advisers (banks, lawyers) are paid on completion, so they have an incentive to support the deal. Management overconfidence and reluctance to admit a mistake post-deal compounds the bias. Agency costs encourage managers to pursue empire size over shareholder value. Integration is always harder than modelled, particularly across cultures, IT systems and operating models. Address by separating evaluation from advice, owning synergies, and walking away above the max bid.',
  },
  {
    ref: 28,
    cat: 'mna',
    q: 'Mandatory bid, equal treatment, squeeze-out: purpose?',
    bullets:
      'All protect minority shareholders.\nMANDATORY BID: at trigger %, acquirer must offer ALL shareholders the highest price already paid.\nEQUAL TREATMENT: same terms to minority as to controlling sellers.\nSQUEEZE-OUT: at high % (80-95%), acquirer can FORCE remaining minority to sell.',
    full: 'These three rules protect minority shareholders. The mandatory-bid threshold (typically 30% of voting rights) requires an acquirer who crosses it to offer all remaining shareholders the highest price they have paid in the previous twelve months, ensuring no minority is left behind on inferior terms. The principle of equal treatment requires identical terms across minority and majority. Squeeze-out, triggered at typically 90 to 95% acceptance, gives the acquirer the right to compulsorily acquire remaining shareholders at the offer price, enabling 100% control and delisting.',
  },
  {
    ref: 53,
    cat: 'mna',
    q: 'Sell-off vs Demerger: advantages?',
    bullets:
      'BOTH restructure, may unlock reverse synergy.\nSell-off: third party, CASH realised, control lost.\nDemerger: NO ownership change, new co created, original shareholders get shares in both. Reduces conglomerate discount.',
    full: 'Both unlock value by separating businesses. A sell-off raises cash from a third party but loses control of the asset. A demerger is internal: a new company is incorporated, the assets transferred, and existing shareholders receive shares in both the parent and the demerged entity. No cash is raised, but the conglomerate discount disappears, since each business is now valued on its own merits. Demergers suit cases where the businesses have different growth, risk and capital profiles that confuse a single share price.',
  },
  {
    ref: 56,
    cat: 'mna',
    q: 'Why do many real-world acquisitions fail?',
    bullets:
      'Lack of industrial/commercial fit\nLack of goal congruence\nCheap purchases hide turnaround costs\nPaying too much (premium beyond synergy)\nFailure to integrate effectively (culture, systems, opposition)',
    full: 'Common reasons for failure: lack of industrial or commercial fit, where the target turns out not to match the strategic logic; lack of goal congruence between acquirer and target management; "cheap" acquisitions that mask turnaround costs much larger than the bargain price; paying premiums above achievable synergy; failing to integrate effectively because cultural, system and personnel issues are underestimated. Mitigation: independent due diligence, max bid discipline, and a named integration leader with budget.',
  },
  {
    ref: 64,
    cat: 'mna',
    q: 'MBO disposal benefits to PARENT?',
    bullets:
      'Costs less than third-party sale\nQuickest method to raise funds\nLess internal resistance, staff/managers cooperate\nRetain trading relationship (supplier/customer)\nHigher price possible because mgmt knows value',
    full: 'A management buy-out is often the simplest disposal route for a parent. Costs are lower than running a competitive third-party sale, the timeline is shorter because the buyer is already inside, and internal resistance from staff and management is reduced because they are the buyers. The parent often retains a trading relationship with the spun-out unit (supplier or customer). The MBO team, knowing the asset best, may pay a higher price than an external buyer who would discount for information asymmetry.',
  },

  // FX
  {
    ref: 10,
    cat: 'fx',
    q: 'Exchange-traded vs OTC options: pros/cons?',
    bullets:
      'Exchange: ready, transparent pricing, no negotiation, lower transaction cost, regulated, American-style.\nOTC: tailored size and expiry, longer terms, wider product range, but counterparty risk.',
    full: 'Exchange-traded options trade on regulated exchanges (CME, ICE, Eurex) with standard contract sizes and expiry dates. Pricing is transparent, the clearing house removes counterparty risk, and most are American-style. Lower transaction costs but no flexibility. OTC options are bilateral contracts negotiated between bank and counterparty: any size, any expiry, often European-style. The negotiation accommodates non-standard exposures, but counterparty risk is real and bid-offer spreads can be wider, especially for thin currency pairs.',
  },
  {
    ref: 12,
    cat: 'fx',
    q: 'Forward contract vs OTC currency option, and why exchange-traded?',
    bullets:
      'Forward: no premium, simple, certain. But locked in even if FX moves favourably.\nOption: keeps upside, can lapse. But premium cost.\nExchange-traded: tradeable, regulated, low counterparty risk.',
    full: 'A forward locks the rate with no premium. Simple, certain budgeting. But the holder cannot benefit from a favourable spot move at maturity, and the contract is binding. An OTC option allows the holder to walk away if the spot is favourable, but at the cost of an upfront premium. The choice depends on the firms tolerance for premium cost versus rigidity. Exchange-traded contracts (futures and listed options) add tradability before expiry and reduce counterparty risk via central clearing, at the price of fixed contract size and expiry.',
  },
  {
    ref: 22,
    cat: 'fx',
    q: 'Money market hedge vs exchange-traded derivatives?',
    bullets:
      'MMH: replicates forward via spot + money markets; cheap if good market access; cumbersome to reverse.\nExchange derivatives: rapid, easily closed; standard size means imperfect hedge; basis risk; margin needs.',
    full: 'A money market hedge replicates a forward by simultaneously borrowing in one currency, converting at spot, and depositing in the other currency. The deposit grows to settle the future foreign cash flow. Useful when the firm has good access to money markets in both currencies, but cumbersome to set up and unwind. Exchange-traded derivatives (futures, listed options) provide immediate execution and easy close-out, at the cost of standardised contract sizes (basis risk) and ongoing margin requirements.',
  },
  {
    ref: 23,
    cat: 'fx',
    q: 'Economic exposure: what is it, how managed?',
    bullets:
      'Long-term value change due to unexpected FX moves.\nHard to hedge with derivatives (amount unknown).\nManage via INTERNATIONAL DIVERSIFICATION, flexibility in production, raw material and financing locations.',
    full: 'Economic exposure is the change in firm value caused by unexpected exchange-rate moves over the long term. It is harder to hedge with derivatives because the size and timing of the exposure are uncertain. Management techniques: international diversification of operations, production and financing; flexibility to switch production location, raw material sources or sales markets in response to FX moves; matching foreign-currency revenues with foreign-currency costs (operational hedge); building a global financing structure that absorbs FX swings.',
  },
  {
    ref: 26,
    cat: 'fx',
    q: 'PPP and economic exposure: connection?',
    bullets:
      'PPP says exchange rates adjust to relative inflation. "Law of one price" long term.\nEconomic exposure if PPP fails (permanent shifts due to relative competitive position changes).\nWhere PPP fails, foreign cash flows decline materially.',
    full: 'Purchasing power parity argues that exchange rates adjust over time to differences in inflation between countries, so the law of one price holds in the long run. If PPP held perfectly and continuously, economic exposure would not exist: any FX move would be offset by relative inflation adjustments. In practice, PPP fails over multi-year horizons, particularly when relative competitive positions of countries shift (technology, productivity, terms of trade). Cash flows from foreign customers can decline materially in home-currency terms, creating real economic exposure.',
  },

  // IR
  {
    ref: 15,
    cat: 'ir',
    q: 'Swaps for IR hedging: pros and cons?',
    bullets:
      'PROS: low transaction cost, fixed swap into floating; OTC tailored size and period; comparative advantage savings; longer than other derivatives.\nCONS: counterparty risk; cannot easily reverse; locked into commitment if rates move favourably.',
    full: 'Interest rate swaps allow a firm to convert a fixed-rate exposure to floating, or vice versa, without disturbing the underlying loan. Advantages: low transaction costs (no upfront premium), tailored size and period, comparative-advantage savings between two firms with different credit ratings, and longer maturities than most futures. Disadvantages: counterparty default risk (mitigated by central clearing post-2008), inability to easily reverse, and the commitment locks in the firm even if interest rates move favourably.',
  },
  {
    ref: 43,
    cat: 'ir',
    q: 'Collar: main advantage and disadvantage vs option?',
    bullets:
      'PRO: lower cost. Premium received from sold option offsets premium paid on bought option (often near zero net cost).\nCON: caps the upside. Gain on favourable underlying move is limited or surrendered.',
    full: 'A collar combines a long protective option with a short option at a different strike. A borrower buying a cap (call) sells a floor (put). The premium received from the sold option offsets the premium of the bought option, often producing a near-zero net cost. The cost is the cap on upside benefit: any favourable move beyond the sold strike is forfeited. Useful when the firm is willing to accept a known band rather than pay full premium for full upside.',
  },
  {
    ref: 44,
    cat: 'ir',
    q: 'Basis risk: what is it?',
    bullets:
      'Basis = futures price minus spot price.\nAt maturity = 0. If contract closed early, basis non-zero, imperfect hedge.\nMagnitude of basis residual = risk you carry.',
    full: 'Basis is the difference between the futures price and the spot price of the underlying. At futures maturity, basis converges to zero by arbitrage. If a hedger closes the futures position before maturity, basis is non-zero and the hedge is imperfect. The size of the basis residual is the risk the hedger carries. Basis risk is minimised by holding to maturity, by choosing futures whose underlying matches the exposure exactly, or by accepting it as the price of liquidity.',
  },
  {
    ref: 25,
    cat: 'ir',
    q: 'Are derivatives a "time bomb" or hedging tool?',
    bullets:
      'Both. Hedge: offsets underlying risk. Speculation: increases risk (no underlying need).\nBuffett worries about speculative use and historic-cost accounting hiding losses.\nIAS 39 fair value mitigates but volatility remains.',
    full: 'Derivatives are neutral instruments: they amplify whatever the user is doing. Used to offset an underlying exposure, they reduce risk (hedging). Used without an underlying exposure, they create new risk (speculation). Buffetts warning targets speculative use combined with historic-cost accounting, which hid mark-to-market losses for years until revealed. Modern accounting (IAS 39, IFRS 9) requires fair-value measurement of most derivatives, but the volatility of values still creates earnings risk. The systemic risk depends on the user, not the instrument.',
  },

  // Behavioural / reporting
  {
    ref: 2,
    cat: 'behav',
    q: 'Triple Bottom Line reporting: what is it?',
    bullets:
      'Quantitative summary of social, financial AND environmental performance.\nDecisions must grow each pillar without sacrificing the others.\nEnhances shareholder value if benefits > costs.',
    full: 'Triple Bottom Line (TBL) reporting evaluates corporate performance across three pillars: profit (financial), people (social), and planet (environmental). Each pillar is measured quantitatively. Decisions should grow each pillar without sacrificing the others, recognising that long-term shareholder value depends on social and environmental sustainability. TBL is voluntary in most jurisdictions but increasingly demanded by ESG-conscious investors. The cost of reporting is justified when the disclosed value to investors and stakeholders exceeds the reporting cost.',
  },
  {
    ref: 31,
    cat: 'behav',
    q: 'Integrated Reporting: objectives?',
    bullets:
      'Improve quality of information for capital providers\nCohesive approach to corporate reporting\nAccountability and stewardship over 6 capitals (financial, manufactured, intellectual, human, social, natural)\nSupport integrated thinking across short/medium/long term',
    full: 'Integrated Reporting (IR) aims to give capital providers a fuller view of how a company creates value over time. Its four objectives: improve information quality for capital providers; provide a cohesive corporate-reporting approach combining financial and non-financial; promote accountability and stewardship over the six capitals (financial, manufactured, intellectual, human, social and relationship, natural); support integrated thinking across short, medium and long-term. The IIRC framework provides guiding principles and content elements but is not a prescriptive standard.',
  },
  {
    ref: 42,
    cat: 'behav',
    q: 'Behavioural finance: insights about investor behaviour',
    bullets:
      'Sewell: psychology influences finance practitioners and markets.\nRational: clear stable preferences, utility maximising, full info.\nReality: bounded rationality, emotion, social pressure, info overload.\nDecisions vary on same facts at different times.',
    full: 'Behavioural finance, as defined by Sewell, studies the influence of psychology on the behaviour of finance practitioners and the consequent effects on markets. Classical finance assumes rational decision-makers with stable preferences, utility maximising, and full information. Real decision-making is bounded by limited information, emotional reactions, social pressure (herding), cognitive biases and information overload. The same person can make different decisions on identical facts at different times. This explains anomalies such as bubbles, crashes, momentum and value effects.',
  },
  {
    ref: 60,
    cat: 'behav',
    q: 'Key behavioural-finance biases?',
    bullets:
      'ANCHORING: irrelevant reference (asking price)\nGAMBLERS FALLACY: past changes future probability\nHERD: mimicking large group\nOVERREACTION + AVAILABILITY: over-react to recent news\nHUBRIS: overconfidence\nLOSS AVERSION: pain ~2x pleasure\nENTRAPMENT: sunk-cost throw-good-after-bad',
    full: 'Major biases identified in behavioural finance: anchoring (over-weighting an irrelevant reference such as initial asking price); gamblers fallacy (believing recent outcomes change future probabilities of independent events); herd behaviour (mimicking the actions of a larger group rather than independent analysis); overreaction and availability bias (over-weighting recent news in expectations); hubris and overconfidence (overestimating own ability to predict and control); loss aversion (the pain of a loss is roughly twice the pleasure of a same-size gain); entrapment or sunk-cost fallacy (continuing investment because of past commitment rather than future expected value).',
  },

  // APV
  {
    ref: 4,
    cat: 'apv',
    q: 'APV vs NPV: when to use APV?',
    bullets:
      'NPV: discount project CFs at single rate (often WACC).\nAPV: separate project (Ke ungeared) and financing side-effects (Kd).\nUse APV when: capital structure changes; complex tax; subsidised loans, grants, issue costs; different risk profile from parent.',
    full: 'NPV typically uses a single WACC to discount cash flows, which assumes the gearing of the project equals the company average and stays constant. APV separates the analysis into two stages: discount the unlevered cash flows at the unlevered cost of equity (base NPV), then add the present value of all financing side-effects (tax shield on debt interest, issue costs, subsidised loans, government grants). APV is more robust when capital structure shifts during the project, when there are complex tax events such as tax holidays, when special financing exists (subsidies, issue costs, government support), or when the project has a different risk profile from the parent.',
  },
  {
    ref: 17,
    cat: 'apv',
    q: 'Why may APV be preferred over NPV?',
    bullets:
      'Separating CFs allocates the right discount rate to each cash flow risk.\nManagers see which part of the project creates value.\nSubsidies, tax shields and issue costs become explicit.\nUseful for LBOs, project finance, M&A.',
    full: 'APV is often preferred for three reasons: it allocates the appropriate discount rate to each cash flow type (unlevered cash flows at the unlevered cost of equity, debt-related side-effects at the cost of debt or risk-free rate); it makes value sources explicit, so managers see which part of a project creates value (operational vs financing); and it handles non-standard financing cleanly, including subsidised loans, government grants, issue costs, and tax shields. APV is the standard tool for LBOs and project finance, where gearing schedules change over time.',
  },

  // Risk
  {
    ref: 3,
    cat: 'risk',
    q: 'Diversified portfolio: what benefit?',
    bullets:
      'Portfolio theory: diversification removes UNSYSTEMATIC (firm-specific) risk; only SYSTEMATIC remains.\n~15 to 20 stocks gives ~95% benefit.\nCompanies invest in markets shareholders cannot (e.g. emerging markets) for further diversification.',
    full: 'Portfolio theory shows that combining assets whose returns are imperfectly correlated reduces total risk without reducing expected return. Diversification eliminates unsystematic (firm-specific) risk, leaving only systematic (market) risk. Empirically, 15 to 20 stocks chosen across sectors deliver about 95% of the achievable benefit. Companies can extend diversification by investing in markets that individual shareholders cannot easily access, such as emerging markets, infrastructure or unlisted private equity, providing diversification beyond what shareholders can replicate at home.',
  },
  {
    ref: 32,
    cat: 'risk',
    q: 'Upward-sloping yield curve: reasons?',
    bullets:
      'Future expectations: short rates expected to rise.\nLiquidity preference: investors demand premium for longer maturity.\nMarket segmentation: banks at short end, pension funds at long end.',
    full: 'A yield curve slopes upward when long-term yields exceed short-term yields. Three theories explain this. Expectations theory: long rates equal the geometric average of expected short rates, so an upward slope reflects expectations of rising short rates. Liquidity preference theory: investors demand a premium for tying up capital longer, since longer maturities carry more uncertainty and price risk. Market segmentation: different investors specialise in different parts of the curve (banks short, pension funds long), and demand and supply at each maturity is set by these distinct clienteles.',
  },
  {
    ref: 33,
    cat: 'risk',
    q: 'VaR worked example: 99% one-year and five-year?',
    bullets:
      'sigma = $800k, mean = $2.2m, z(99%) = 2.33.\nAnnual VaR = 2.33 * 800k = $1.864m\n5-year VaR = 1.864m * sqrt(5) ≈ $4.168m\n99% confident return >= $336k/yr or >= $6.832m total/5yr.',
    full: 'With annual standard deviation of $800,000 and z(99%) = 2.33, the annual one-tail VaR is 2.33 * 800,000 = $1,864,000. Over five years, scaling by sqrt(5) gives VaR of approximately $4,168,000. The interpretation: with 99% confidence, annual return will not fall below $2,200,000 minus $1,864,000 = $336,000, and five-year return will not fall below $11,000,000 minus $4,168,000 = $6,832,000. Quote z, sigma and confidence explicitly in the answer; one mark each.',
  },
  {
    ref: 34,
    cat: 'risk',
    q: 'Capital rationing: single vs multi-period?',
    bullets:
      'Single period: rank divisible projects by PROFITABILITY INDEX = NPV / Investment.\nMulti-period: PI fails. Use LINEAR PROGRAMMING to maximise total NPV subject to all constraints.',
    full: 'Capital rationing is the situation where the firm has more positive-NPV projects than capital. Single-period rationing is solved by ranking divisible projects by profitability index (NPV per dollar invested) and selecting in order until the budget runs out. The PI method fails for multi-period rationing because it cannot trade off year 1 budget against year 2 budget. Multi-period requires linear programming with project investments as decision variables, total NPV as the objective, and budget per period as the binding constraints.',
  },

  // Valuation / dividends
  {
    ref: 59,
    cat: 'val',
    q: 'Increase in dividends: benefit shareholders?',
    bullets:
      'M&M: irrelevant in perfect markets.\nReal-world factors: tax (capital gains often lower), brokerage fees, internal finance cheaper than external, info asymmetry signal, investment opportunity set.',
    full: 'Modigliani and Miller showed dividends are irrelevant to firm value in perfect markets. In practice, four real-world factors matter. Tax: capital gains are often taxed at lower rates than dividends, so retention is tax-efficient. Brokerage fees: shareholders who need cash income avoid sale-and-rebuy costs if the firm pays dividends. Cost of capital: external finance has issue costs, so retained earnings are cheaper than new issuance. Information asymmetry: a dividend increase signals management confidence in future cash flows, which the market rewards. The investment opportunity set also matters: a firm with positive-NPV projects should retain.',
  },
  {
    ref: 40,
    cat: 'val',
    q: 'Share buyback vs dividend: benefits?',
    bullets:
      'Buyback: shareholder chooses (controls cash and tax timing); reduces share count, EPS rises; positive market signal; share price often rises.\nDividend: forced cash receipt, tax bill, transaction costs to reinvest. Buyback gives flexibility.',
    full: 'A buyback gives shareholders the choice to participate or not, allowing each investor to manage their own cash needs and tax position. The remaining shares represent a larger ownership share in the company, which raises EPS mechanically. Buybacks are often interpreted as a positive signal that management believes shares are undervalued, supporting the share price. A dividend forces a cash receipt on every shareholder, which may trigger tax and transaction costs to reinvest. Buybacks therefore offer more flexibility but require careful timing to avoid signalling overpayment.',
  },

  // Treasury
  {
    ref: 16,
    cat: 'treasury',
    q: 'Treasury staffing: why need experienced staff?',
    bullets:
      'Day-to-day work needs judgement (which lender/instrument); poor decisions cost.\nMonitor international markets, political risk.\nSet policies aligned with risk appetite.\nLaw/tax/accounting knowledge saves penalties.\nStrategic advice on M&A/financing/cost of capital.',
    full: 'Treasury work looks routine but requires substantial judgement. Choosing the right lender or hedging instrument among several available options needs knowledge of market depth, counterparty credit, regulatory treatment and legal documentation. Junior staff can execute well-defined transactions but cannot weigh trade-offs across these dimensions. Experienced treasurers also monitor international markets and political risk, set policies aligned with company risk appetite, ensure compliance with tax and accounting rules, and provide strategic advice on M&A financing and cost-of-capital decisions.',
  },
  {
    ref: 24,
    cat: 'treasury',
    q: 'IMF role and significance to multinationals?',
    bullets:
      'Bretton Woods 1945. BoP support; conditional loans 3 to 5 years (austerity reforms).\nReduces FX volatility, facilitates trade.\nCostly: short-term deflation, smaller markets.\nUp to 25% quota unconditional; further tranches conditional.',
    full: 'The IMF was created at Bretton Woods in 1945 to support balance-of-payments stability through conditional lending. Programmes typically last 3 to 5 years and require recipient countries to undertake fiscal and monetary austerity to qualify. For multinationals, IMF involvement reduces FX volatility and supports trade flows, which is positive. The cost is short-term deflation in the affected country, which shrinks local market demand. IMF lending up to 25% of quota is unconditional; further tranches require structural conditionality. IMF programmes can also include capital-flow restrictions, which affect multinational repatriation.',
  },
  {
    ref: 39,
    cat: 'treasury',
    q: 'Money laundering: global response?',
    bullets:
      'International task force on money laundering (FATF)\nRecommendations for nation-states\nLegislation: criminal justice/law enforcement, financial regulation, international cooperation',
    full: 'The Financial Action Task Force (FATF), established by the G7 in 1989, is the global standard-setter for AML and counter-terrorism financing. It issues 40 recommendations that nation-states implement through domestic legislation. The framework covers: criminal justice and law enforcement (predicate offences, investigation powers); financial-system regulation (KYC, customer due diligence, suspicious activity reporting); international cooperation (information sharing, mutual legal assistance, asset recovery). Multinationals are bound by AML rules in every jurisdiction where they operate.',
  },
  {
    ref: 48,
    cat: 'treasury',
    q: 'Regional vs national vs global treasury function?',
    bullets:
      'Regional vs national: fewer duplicate roles, specialists, pooled cash, located in financial centres.\nRegional vs global: local expertise, time-zone alignment, better local market knowledge, more responsive to subsidiaries.',
    full: 'A national treasury serves one country. Pooling treasury into a regional centre eliminates duplication, allows specialists, enables cash pooling and netting across the region, and locates treasury in a financial-centre time zone. A regional approach is preferred over a fully global function because regional treasurers have local expertise (regulation, market practice, banking relationships), share the time zone with subsidiaries, and respond faster than a remote global centre. Many multinationals run a hub-and-spoke model: regional treasuries report into a global head with policy oversight only.',
  },
  {
    ref: 55,
    cat: 'treasury',
    q: 'Borrowing: domestic banks vs Euromarkets?',
    bullets:
      'Domestic: smaller loans, more regulation, wider spreads, often secured, banks scrutinise.\nEuromarkets: very large unsecured loans, lower regulation/spreads, often slightly cheaper, syndication possible.',
    full: 'Domestic bank loans tend to be smaller, more regulated and often secured against assets. Spreads are wider because of regulatory cost and the smaller pool of lenders. The benefit is that domestic banks scrutinise borrowers carefully, which signals creditworthiness. Euromarket lending (Eurobonds, syndicated loans, commercial paper) offers very large unsecured borrowings, lower regulatory cost, tighter spreads and the ability to syndicate across many lenders. Euromarkets are therefore preferred for large multinational financings. The trade-off: less due diligence by individual lenders.',
  },

  // Misc
  {
    ref: 18,
    cat: 'misc',
    q: 'Stakeholder recognition: why important in investment decisions?',
    bullets:
      'Identifies risk/disruption sources (env. groups, legal action)\nMendelow matrix: power x interest = influence\nIdentifies conflict areas; resolve disagreement\nEthical/reputational case (society can withdraw support)\nDeep-green view: failing to recognise = bad governance',
    full: 'Recognising stakeholders matters for several reasons. It identifies sources of risk and disruption (environmental groups, regulators, communities, employees) that can derail a project even if the financials look strong. The Mendelow matrix categorises stakeholders by power and interest, identifying who needs to be managed closely and who needs to be kept informed. It surfaces conflicts that need resolution (e.g. expansion vs community opposition). It is an ethical and reputational requirement: society can withdraw its social licence. A deep-green perspective treats failure to consider stakeholders as bad governance, not just bad PR.',
  },
  {
    ref: 36,
    cat: 'misc',
    q: 'EU free trade area: benefits?',
    bullets:
      'Remove trade barriers; free movement of capital/labour\nCommon legal and technical standards; lower compliance\nNo discrimination; competitive level playing field\nCommon external tariffs (block non-members)\nAccess to EU-only grants',
    full: 'The EU Single Market is more than a free trade area: it removes tariff and non-tariff barriers, allows free movement of capital, labour, goods and services, and harmonises legal and technical standards across member states. This reduces compliance cost, supports competitive markets without discrimination, and provides a common external trade policy that block non-EU competitors. Companies based in member states can access EU-only programmes such as research grants, structural funds and ESG financing.',
  },
  {
    ref: 37,
    cat: 'misc',
    q: 'Credit rating criteria: how to assess?',
    bullets:
      'INDUSTRY RISK: economic resilience, cyclicality\nEARNINGS PROTECTION: diversity, margins, ROCE\nFINANCIAL FLEXIBILITY: alternatives, covenants\nMANAGEMENT: strategy, succession, KPIs',
    full: 'Credit rating agencies assess four broad dimensions. Industry risk: economic resilience, cyclicality, growth profile, structural challenges (technology disruption, regulation). Earnings protection: revenue diversity, margin stability, return on capital, sensitivity to cyclical pressure. Financial flexibility: liquidity, covenant headroom, refinancing alternatives, contingency funding. Management quality: strategy clarity, execution track record, succession planning, alignment of incentives. Each dimension is scored, weighted and aggregated into the issuer rating. The rating drives both cost of debt and access to debt markets.',
  },
  {
    ref: 41,
    cat: 'misc',
    q: 'Dark pool networks: what and why?',
    bullets:
      'Anonymous trading away from public scrutiny.\nOrder details hidden until trade done.\nReasons: avoid moving share price, lower fees (mid-price, broker-dealer pools).\nCriticism: reduces market efficiency. Defenders: prevents large trades from moving price.',
    full: 'Dark pools are private trading venues that match buy and sell orders without publishing the orders before execution. They were originally set up for institutional investors to execute large block trades without moving the public market against them. Order size and price are typically only revealed after execution. Defenders argue dark pools enable efficient large-trade execution and reduce price impact. Critics argue they reduce price-discovery quality on lit markets, can create information asymmetry, and may benefit broker-dealers who internalise their own client flow.',
  },

  // BONUS: high-leverage Mar 2026 cards
  {
    ref: 65,
    cat: 'val',
    q: 'M&M propositions on capital structure: explain (with and without tax)',
    bullets:
      'M&M I (no tax): firm value independent of capital structure. WACC flat as gearing rises.\nM&M I (with tax): debt creates tax shield. V_geared = V_ungeared + (Tax * Debt). WACC falls.\nM&M II (with tax): Ke_g = Ke_u + (Ke_u - Kd)(D/E)(1-T). Higher gearing = higher Ke.\nLimits: bankruptcy costs, agency costs, asymmetric info; trade-off theory.',
    full: 'Modigliani and Miller (M&M) proposed two propositions on capital structure. M&M I without tax: firm value is independent of capital structure. Gearing changes who claims the cash flows but not their total value. WACC is flat as gearing rises. M&M I with tax: debt interest is tax-deductible, creating a tax shield. Firm value rises with gearing: V_geared = V_ungeared + (Tax rate * Debt). WACC falls with gearing. M&M II with tax: cost of equity rises with gearing to compensate equity holders for higher financial risk: Ke_geared = Ke_ungeared + (Ke_ungeared - Kd) * (D/E) * (1 - T). The implication that 100% debt is optimal does not hold in practice because of bankruptcy costs (lost customers, fire-sale assets), agency costs (debtholder-equityholder conflict, asset substitution), and asymmetric information (signalling). The trade-off theory balances tax-shield benefit against bankruptcy and agency costs to find an optimal interior gearing.',
  },
  // Extra to reach 64
  {
    ref: 20,
    cat: 'ir',
    q: 'IR swaps and currency swaps: value to corporate finance manager?',
    bullets:
      'Convert fixed to floating or vice versa without retiring debt.\nMatch asset and liability profiles by currency.\nLower borrowing cost via comparative advantage.\nLong tenors otherwise unavailable in cash markets.',
    full: 'Swaps allow a treasurer to convert fixed-rate exposure to floating, or vice versa, without disturbing the underlying debt. They allow currency mismatches to be hedged by exchanging streams of cash flow between currencies. Comparative-advantage analysis can show two firms with different credit ratings can each borrow more cheaply by borrowing in their preferred market and swapping. Long tenors (10 years and beyond) are easier to access via swap markets than via cash debt markets in many currencies.',
  },
  {
    ref: 21,
    cat: 'ir',
    q: 'Currency swap: advantages and risks?',
    bullets:
      'PROS: long-term FX hedging, cheaper than long forwards, arbitrage funding advantage, restructure debt without redemption, bypass exchange controls.\nRISKS: counterparty default, political/sovereign, basis risk, FX risk if no underlying.',
    full: 'A currency swap exchanges principal and interest payments in two currencies between counterparties. Advantages include long-term FX hedging well beyond forward market depth, often cheaper than rolling forward contracts, ability to exploit comparative funding advantage in different currencies, restructure currency debt profile without redeeming, and access markets behind exchange controls. Risks: counterparty default in OTC markets, political and sovereign risk, basis risk on floating legs, and creating new FX risk if used without an underlying exposure.',
  },
  {
    ref: 27,
    cat: 'behav',
    q: 'TBL for monitoring a project investment?',
    bullets:
      'TBL gives 3-pillar view (people, planet, profit).\nCatches success/failure missed by financials alone.\nUseful for X-IT type investments where social/env. impact matters.\nCost of report < benefits = enhances value.',
    full: 'Triple bottom line reporting tracks people, planet and profit alongside one another. For project investment monitoring, TBL catches dimensions of success and failure that pure financial reporting misses. For investments with material social or environmental impact (mining, energy, infrastructure, large data centres), TBL surfaces issues that would otherwise fester until they damage the financial case. TBL reporting cost is justified when it enhances investor and stakeholder confidence to a degree that exceeds the reporting cost.',
  },
  {
    ref: 30,
    cat: 'islam',
    q: 'Islamic finance and Strayer: identify two instruments',
    bullets:
      'Murabaha: cost-plus trade credit. Bank buys, resells with mark-up.\nSukuk: asset-backed bond. Holders own a slice of the asset and earn rentals.\nKey: no riba, no gharar, asset backing, share risk.',
    full: 'For a firm choosing between Sharia-compliant alternatives, two often-suitable instruments: (1) Murabaha is cost-plus trade credit. The bank buys the asset and sells it on at a fixed mark-up payable in instalments. There is no interest, only a fixed profit margin disclosed at the outset. (2) Sukuk is an asset-backed bond. Holders own a proportional share of the underlying asset (such as a building or fleet of aircraft) and earn rentals or revenues from the asset. Key principles in both: no riba (interest), no gharar (uncertainty), tangible asset backing, and risk sharing between provider and user of capital.',
  },
  {
    ref: 38,
    cat: 'risk',
    q: 'Duration as bond price-sensitivity measure: usefulness?',
    bullets:
      'Macaulay D = weighted average time to receive CFs.\nHigher coupon = lower D.\ndP/P = -D * di / (1+i).\nUseful for SMALL changes only (linear). Real curve is convex.',
    full: 'Duration measures the weighted average time to receive bond cash flows, with weights equal to the present-value share of each cash flow. Higher coupons reduce duration because more of the value comes earlier. Macaulay duration relates to price sensitivity: dP/P approximately equals -D * di / (1 + i). This linear approximation works for small changes only. For large yield changes, convexity adds a quadratic correction term. Duration is most useful for matching liabilities (immunisation), not for predicting price for large interest-rate moves.',
  },
  {
    ref: 49,
    cat: 'mna',
    q: 'Mandatory bid + poison pills + crown jewels: defence effectiveness?',
    bullets:
      'Mandatory bid + equal treatment PROTECT minorities.\nPoison pill: existing holders buy more at discount once bidder hits trigger; makes target costly.\nCrown jewels: dispose key assets; unattractive.\nLIMITS: shareholders must approve; selling crown jewels weakens long-term competitiveness.',
    full: 'Defensive tactics against hostile takeovers vary in effectiveness. Mandatory-bid rules and equal-treatment principles protect minority shareholders but do not stop a determined acquirer. Poison pills (rights plans) allow existing shareholders to buy additional shares at a discount when an acquirer crosses a threshold, diluting the bidder and raising the cost. Crown-jewels defence sells key assets to make the target unattractive. Both tactics have limits: shareholders typically must approve the defences, and selling crown jewels weakens long-term competitiveness whether or not the bid succeeds. The market may also discount the share price for poor governance.',
  },
  {
    ref: 51,
    cat: 'mna',
    q: 'Portfolio vs Organisational restructuring: what and why?',
    bullets:
      'PORTFOLIO: acquisitions, disposals, demergers, MBOs/MBIs (which businesses).\nORGANISATIONAL: divisions, processes, governance (how organised).\nBOTH aim to increase performance and value.',
    full: 'Restructuring takes two forms. Portfolio restructuring changes the businesses owned by the group: acquisitions, disposals, divestments, demergers, MBOs and MBIs. The question is "which businesses". Organisational restructuring changes how the firm is organised: divisional structure, business processes, governance, reporting lines. The question is "how organised". Both aim to increase performance and value. Portfolio changes are visible to the market and discrete; organisational changes are continuous and internal but often have larger total impact on operating performance.',
  },
  {
    ref: 52,
    cat: 'mna',
    q: 'Reverse takeover: process and lock-up considerations?',
    bullets:
      'Private firm buys equity in listed shell, takes board, lists shares via share-exchange.\nOften shell renamed.\nPros: fast, cheap, listing certain.\nCons: hidden liabilities, weak analyst coverage, lock-up needed.',
    full: 'A reverse takeover lists a private company by acquiring a publicly listed shell. Process: the private firm buys equity in the listed shell, takes board control, then exchanges shares so the listed shell ends up holding the private company business. The shell is often renamed. Advantages: faster than IPO, lower cost, listing certain (no failed bookbuild risk). Disadvantages: the listed shell may carry undisclosed liabilities (litigation, tax, environmental); analyst coverage is weak compared with an IPO; major existing shareholders should be subject to a lock-up agreement preventing immediate sale, otherwise the share price collapses on listing.',
  },
  {
    ref: 54,
    cat: 'mna',
    q: 'Organic vs Acquisition growth: full pros and cons?',
    bullets:
      'ORGANIC: careful, planned, but slow and costly to research/build.\nACQUISITION: fast access to markets/tech/competitor elimination; less complete info; integration risks.\nAcquisition the only way to grow VERY rapidly.',
    full: 'Organic growth is internally generated through new products, new markets, capacity expansion. Pros: careful planning, controlled execution, deep institutional knowledge. Cons: slow (often 3 to 5 years for material results), costly in R&D and capacity build, exposed to execution risk in unfamiliar markets. Acquisition: fast access to markets, technology, brand and customers; can eliminate competitors. Cons: less complete information about target, integration risk, often paying premium that consumes synergy. For rapid growth (to capture a window or block a competitor), acquisition is often the only viable route.',
  },
  {
    ref: 57,
    cat: 'mna',
    q: 'Why does synergy exist (sources)?',
    bullets:
      'ECONOMIC EFFICIENCY: scale (fixed costs, equipment), scope (advertising, distribution), vertical control of supply.\nFINANCIAL: lower variability of returns, better credit, tax-loss/shield use.\nMARKET POWER: pricing power post-merger.',
    full: 'Synergy sources fall into three groups. Economic efficiency: scale economies (fixed costs spread across larger output), scope economies (one advertising campaign for two products, shared distribution), vertical control over inputs and outputs. Financial: lower variability of combined cash flows reduces cost of capital, better credit rating supports cheaper debt, ability to use the targets unused tax shields. Market power: pricing power if the combined firm has higher market share, ability to extract better terms from suppliers and distributors. The economic-efficiency synergies are the most defensible; the others are more contestable.',
  },
  {
    ref: 35,
    cat: 'risk',
    q: 'Capital Investment Monitoring System: features and benefits?',
    bullets:
      'CIMS sets plan, budget, milestones, risk register.\nMonitors actuals vs plan; sets contingency plans.\nBenefits: project meets expectations, completed on time, risks managed proactively, communication device, re-assess if environment changes.',
    full: 'A capital investment monitoring system (CIMS) is the post-approval governance framework for tracking investment performance against the original business case. Features: a baseline plan with milestones, a budget broken down by phase and category, a risk register updated as the project progresses, and contingency plans for the highest-impact risks. Benefits: ensures the project actually achieves the expected outcome, supports timely completion, surfaces emerging risks early, enables proactive corrective action, and provides a formal communication channel between project sponsor, executor and the board. Should be used to revisit the business case if the external environment changes materially.',
  },
  {
    ref: 61,
    cat: 'risk',
    q: 'Business risk vs financial risk: relationship?',
    bullets:
      'BUSINESS: from operations (industry, demand, costs).\nFINANCIAL: from capital structure (gearing, FX, IR, liquidity).\nHigh business risk = less appetite for financial risk and vice versa.\nManage via mitigation (transfer/hedge/insure) and diversification.',
    full: 'Business risk arises from operating the firms business: industry cyclicality, demand volatility, cost-base flexibility, regulatory exposure. Financial risk arises from the capital structure: gearing magnifies returns and exposes the firm to interest-rate moves, FX exposure, liquidity squeezes. Business risk and financial risk are inversely related in good capital-structure design: a firm with high business risk should carry low financial risk (low gearing), and a firm with stable cash flows can support higher gearing. Manage either through mitigation (transfer the risk via insurance or derivatives, hedge it, accept it with capital) or through diversification (multiple products, multiple geographies, multiple counterparties).',
  },
  {
    ref: 66,
    cat: 'behav',
    q: 'ESG marks: how to bank them in Section A scenario answers?',
    bullets:
      'STRUCTURE: SCENARIO link, ACTION, OUTCOME, stakeholder.\nDo NOT list ESG generically. Tie EACH point to scenario figures or events.\nE: emissions cost, capex on green tech, carbon tax, stranded assets\nS: jobs, community, safety, supply-chain ethics\nG: board ESG oversight, disclosure, Integrated Reporting\nMin 2 to 3 distinct ESG points; show TRADE-OFFS vs financial outcome.',
    full: 'ACCA awards ESG marks for application, not for textbook recital. The pattern: identify a SPECIFIC ESG issue from the scenario (emissions level, community impact, supply-chain risk, board ESG governance), recommend a specific ACTION (capex on abatement, supplier audit, board ESG committee), quantify the OUTCOME (financial cost, reputational benefit, stakeholder support), and identify the STAKEHOLDER affected (community, regulator, investor, employee). Cover environmental, social, and governance with at least 2 to 3 distinct points. Always show the TRADE-OFF: ESG actions reduce NPV in the short term but secure social licence, avoid penalties, support refinancing covenants. Drimpton Sep/Dec 25: the £8m emissions abatement reduces NPV by £1.2m but secures the social licence to operate, without which the project faces protest delay of 18 months.',
  },
];
