/* ============================================================
   TIMBOI'S ACADEMY — AFM CONTENT DATABASE (v3, masterclass)
   12 fixtures across syllabus A–E
   Each topic: notes · formulas · examples · drills · pitfalls
   ============================================================ */

const TOPICS = {

/* ====================== 1. ADVISER ====================== */
adviser: {
  id:'adviser',
  title:'Senior Financial Adviser & Governance',
  syllabus:'A',
  spursAngle:'You\'re the FD of Hotspur Holdings. Should you gear up for a stadium expansion? Govern? Why hedge at all?',
  papers:['Sep/Dec 2024 Q3','Mar/Jun 2023 Q3','Specimen Q3'],
  innov:'<b>2025 angle:</b> ESG-linked governance KPIs increasingly tie director remuneration to non-financial outcomes (carbon, diversity, safety).',
  mnemonic:'<b>4Ts</b> — Transfer · Tolerate · Treat · Terminate',
  quickFacts:[
    'Debt = tax shield, lowers WACC — but adds financial-distress risk',
    'Trade-off Theory: tax shield ↔ distress costs',
    'Pecking order: Retained earnings → Debt → Equity (signalling)',
    'Risk Map: Severity × Likelihood drives the 4T choice',
    'UK Code: principles-based ("comply or explain"). US SOX: rules-based',
    'Ratios: ROCE = PBIT/CE; ROE = PAT/Equity; Interest cover = PBIT/Int',
    'Mendelow matrix = Power × Interest of stakeholders'
  ],
  notes:`
    <h4>1 · Why hedge? Why use debt?</h4>
    <p>Capital-structure choice = balancing tax-shield benefits of debt against costs of financial distress (the <b>Trade-off Theory</b>).</p>
    <ul>
      <li><b>Pros of debt</b>: tax shield, manager discipline (covenants), positive signalling.</li>
      <li><b>Pros of hedging</b>: reduces distress probability, stabilises cash flow → managers willing to invest, builds confidence with all stakeholders.</li>
      <li><b>Cons of hedging</b>: premiums, complexity, counterparty risk.</li>
    </ul>
    <div class="callout"><b>Pecking order</b> (Myers): firms prefer retained earnings → debt → equity. Equity issues last because of signalling.</div>

    <h4>2 · Business risk vs financial risk</h4>
    <table>
      <tr><th>Business risk</th><th>Financial risk</th></tr>
      <tr><td>Operations-driven (industry, demand, costs)</td><td>Capital-structure driven (gearing, FX, IR)</td></tr>
      <tr><td>Independent of financing</td><td>Created by financing choices</td></tr>
      <tr><td>Five categories: Political · Economic · Fiscal · Operational · Reputational</td><td>Five flavours: Capital structure · Credit · FX · IR · Liquidity</td></tr>
    </table>

    <h4>3 · The 4Ts of risk management</h4>
    <ul>
      <li><b>TRANSFER</b> — insure or hedge (tail-risk, low-likelihood high-severity).</li>
      <li><b>TOLERATE</b> — within appetite (low/low quadrant).</li>
      <li><b>TREAT</b> — mitigate (process control for high-likelihood low-severity).</li>
      <li><b>TERMINATE</b> — exit the activity (high/high if uneconomic).</li>
    </ul>

    <h4>4 · Ratios that win marks</h4>
    <p class="formula">ROCE = PBIT / Capital Employed       ROE = PAT / Equity
Op Margin = PBIT / Sales              Net Margin = PAT / Sales
Interest cover = PBIT / Interest      Receivables days = (Recv/Sales)×365
Capital gearing = D/E                  Total gearing = D/(D+E)</p>

    <h4>5 · DuPont decomposition</h4>
    <p class="formula">ROE = Net Margin × Asset Turnover × Leverage</p>
    <p>Always decompose if a ratio moves — is it ops, efficiency, or capital structure?</p>

    <h4>6 · Stakeholders & Mendelow</h4>
    <ul>
      <li>HIGH power, HIGH interest → Key Players (manage closely).</li>
      <li>HIGH power, LOW interest → Keep Satisfied.</li>
      <li>LOW power, HIGH interest → Keep Informed.</li>
      <li>LOW power, LOW interest → Minimal Effort.</li>
    </ul>

    <h4>7 · UK Code vs US SOX</h4>
    <table>
      <tr><th>UK (Cadbury → Combined Code)</th><th>US (Sarbanes-Oxley 2002)</th></tr>
      <tr><td>Principles-based, "comply or explain"</td><td>Rules-based, statutory</td></tr>
      <tr><td>Separate Chair/CEO; ≥50% NEDs; independent chair; service contracts ≤1yr</td><td>CEO/CFO certify financials; faster disclosures; whistleblower protection; internal-control reporting</td></tr>
    </table>

    <h4>8 · Multinationals & blocked funds</h4>
    <p>Four pillars: governance compliance, transferability of capital, country/economic risks, agency issues with foreign management.</p>
    <ul>
      <li>Strategies to repatriate blocked funds: management charges, royalties, transfer pricing, intra-group loans + interest.</li>
      <li>Watch for OECD transfer-pricing rules and BEPS (base erosion / profit shifting).</li>
    </ul>

    <h4>9 · IMF · World Bank · WTO</h4>
    <ul>
      <li><b>IMF</b> — short-term BoP rescue, conditional loans 3–5yr (austerity reforms).</li>
      <li><b>World Bank</b> — long-term (~20yr) project finance for infrastructure & poverty reduction.</li>
      <li><b>WTO</b> — dispute resolution + trade-rule liberalisation.</li>
    </ul>
    <div class="warn"><b>Exam tip:</b> link role to scenario — don't list textbook definitions.</div>
  `,
  formulas:`
ROCE = PBIT / Capital Employed
ROE  = PAT / Equity
Op Margin = PBIT / Sales       Net Margin = PAT / Sales
Interest cover = PBIT / Interest
Capital gearing = D/E          Total gearing = D/(D+E)
DuPont: ROE = Margin × Turnover × Leverage
  `,
  pitfalls:[
    'Quoting capital gearing without saying which definition (D/E vs D/(D+E))',
    'Mixing book and market values for ratio analysis',
    'Listing risks without applying the 4Ts to the scenario',
    'Generic governance — examiner wants UK or US specifics with reasoning'
  ],
  examples:[
    {title:'ROCE / ROE worked', body:'IS: Sales 1000; COS −200; Exp −100; Int −100; Tax −100 → PAT 500. SOFP: SC 100 + Reserves 700 + LT loan 800 = CE 1,600.\n PBIT = 500+100+100 = 700.\n ROCE = 700/1600 = 43.75% (~44%).\n ROE = 500/800 = 62.5% (~63%).\n Op margin = 700/1000 = 70%; Net margin = 50%.'}
  ],
  drills:[
    {
      id:'adv-d1', ref:'Sep/Dec 2024 Q3 · style', marks:14,
      title:'Hotspur Holdings — gear up for stadium expansion?',
      scenario:`<b>Hotspur Holdings</b> has £400m equity (β 1.1) and £200m debt (Kd pre-tax 5%). Tax 25%. Rf 4%, ERP 6%. Board considers raising £150m extra debt at 5.5% to fund a stadium expansion. Industry peers run D/E ≈ 0.8.`,
      requirement:`(a) Compute current WACC. (b) Estimate WACC after the raise (assume new βe via M&M2). (c) Discuss governance & risk-management implications using the 4Ts.`,
      answer:
`(a) CURRENT WACC
   Ke = 4 + 1.1 × 6 = 10.6%
   Kd post-tax = 5 × 0.75 = 3.75%
   WACC = (400/600) × 10.6 + (200/600) × 3.75
        = 7.07 + 1.25 = 8.32%

(b) AFTER £150m DEBT
   New D/E = 350/400 = 0.875
   βa (ungear current) = 1.1 × 400/(400 + 200×0.75)
       = 1.1 × 400/550 = 0.80
   βe new = 0.80 × (400 + 350×0.75)/400
         = 0.80 × 1.656 = 1.325
   Ke new = 4 + 1.325 × 6 = 11.95%
   Kd post-tax 5.5×0.75 = 4.125%
   WACC = (400/750)·11.95 + (350/750)·4.125
        = 6.37 + 1.93 = 8.30%
   ≈ flat (M&M2 holds approximately).

(c) 4Ts COMMENTARY
   • TRANSFER — fix part of new debt at long swap rates.
   • TOLERATE — modest gearing rise (D/E to 0.875) is in industry range.
   • TREAT — covenant headroom (interest cover); plan refinancing.
   • TERMINATE — abort if pre-let revenue does not materialise.

PROFESSIONAL SKILLS
   Communication: structured as a board paper.
   Scepticism: pre-let assumptions need stress test.
   Commercial acumen: matchday ROI vs alternative uses.`,
      points:140, tags:['Section A','governance','core']
    },
    {
      id:'adv-d2', ref:'Mar/Jun 2023 Q3 · style', marks:6,
      title:'Quick: identify financial vs business risk',
      scenario:`State whether each is BUSINESS or FINANCIAL risk: (a) FX exposure on USD sponsorship; (b) Recession reduces matchday demand; (c) Player wage inflation; (d) Refinancing concentration in one year; (e) New competitor league.`,
      requirement:`Classify and justify in one line each.`,
      answer:
`(a) FINANCIAL — FX exposure is from financing/treasury choices.
(b) BUSINESS — demand-driven (operations).
(c) BUSINESS — operational cost dynamics.
(d) FINANCIAL — capital structure / liquidity flavour.
(e) BUSINESS — competitive landscape (industry).

State Trade-off implication if asked: business risk is fixed by sector;
financial risk can be tuned via capital-structure choices.`,
      points:60, tags:['quickfire','core']
    }
  ]
},

/* ====================== 2. BEHAVIOURAL FINANCE ====================== */
behav: {
  id:'behav',
  title:'Behavioural Finance & M&A Biases',
  syllabus:'A · C',
  spursAngle:'Spurs eye a Premier-League target. Auction fever, hubris, anchoring on the asking price — bias kills shareholder value.',
  papers:['Mar/Jun 2024 Q2','Sep/Dec 2022 Q3'],
  innov:'<b>2025 angle:</b> AI-assisted bidding tools surface comparable deals — but managers still anchor on whichever data point fits their narrative.',
  mnemonic:'<b>NAME · EXPLAIN · APPLY</b> — never list biases generically',
  quickFacts:[
    'Anchoring = latching onto an irrelevant reference (asking price)',
    'Confirmation = seek info that confirms; ignore disconfirming',
    'Loss aversion = pain of loss ~2× pleasure of equivalent gain',
    'Hubris = belief in own ability to "fix" target (Roll 1986)',
    'Herding = follow the crowd — drives bubbles and panic sales',
    'Auction/Competition fever = bid up to avoid losing the deal'
  ],
  notes:`
    <h4>1 · Three pillars of rational decision-making</h4>
    <ul>
      <li>Maximise utility.</li>
      <li>Analyse all relevant information.</li>
      <li>Be objective and unbiased.</li>
    </ul>
    <p>Reality: bounded rationality, emotion, social pressure, info overload.</p>

    <h4>2 · Core biases (memorise for essays)</h4>
    <ul>
      <li><b>Anchoring</b> — fixate on irrelevant reference (previous price, headline number).</li>
      <li><b>Confirmation</b> — seek confirming evidence; dismiss the rest.</li>
      <li><b>Cognitive dissonance</b> — rationalise bad decisions instead of reversing them.</li>
      <li><b>Gambler's fallacy</b> — past outcomes change future probabilities ("it's due").</li>
      <li><b>Herd / Social conformity</b> — follow the crowd → bubbles & crashes.</li>
      <li><b>Momentum / Boom-bust</b> — buy because price rises, sell because price falls.</li>
      <li><b>Regret aversion</b> — avoid actions that might cause regret → inaction.</li>
      <li><b>Overconfidence</b> — over-trade, under-diversify.</li>
      <li><b>Loss aversion</b> — pain ~2× gain → hold losers too long.</li>
    </ul>

    <h4>3 · Bias in M&A (the agency minefield)</h4>
    <ul>
      <li><b>Competition / Auction fever</b> — bid to win, not because of value.</li>
      <li><b>Hubris</b> — bidder believes its skill rescues any target (Roll 1986).</li>
      <li><b>Entrapment / Sunk cost</b> — keep funding a failing acquisition.</li>
      <li><b>Confirmation post-deal</b> — dismiss bad news to defend the thesis.</li>
      <li><b>Listening too closely to target management</b> — they paint a rosy picture.</li>
    </ul>

    <h4>4 · How to write the answer (Mower's NAME-EXPLAIN-APPLY)</h4>
    <div class="callout">
      For each bias the question raises:<br/>
      1) <b>NAME</b> the bias.<br/>
      2) <b>EXPLAIN</b> how it operates in general.<br/>
      3) <b>APPLY</b> to the case facts (use the company name, quote a figure).<br/>
      Listing biases without applying = capped at maybe 30%.
    </div>

    <h4>5 · Mitigations</h4>
    <ul>
      <li>Independent due diligence (not target's data alone).</li>
      <li>Pre-defined walk-away price; bidding committee discipline.</li>
      <li>Devil's-advocate review; red-team analysis.</li>
      <li>Clawback clauses tied to post-deal performance.</li>
      <li>NEDs with M&A experience on the board.</li>
    </ul>
  `,
  formulas:`
No numerical formulas — discussion-led topic.
Structure: NAME · EXPLAIN · APPLY (one paragraph per bias).
  `,
  pitfalls:[
    'Listing biases without scenario application',
    'Confusing herding with momentum (related but distinct)',
    'Forgetting to recommend MITIGATION — examiners want both diagnosis & cure',
    'Defining "behavioural finance" academically instead of using it'
  ],
  drills:[
    {
      id:'beh-d1', ref:'Mar/Jun 2024 Q2 · style', marks:12,
      title:'Spurs vs the auction — three biases at play',
      scenario:`<b>Spurs Director of Football</b> is pursuing a Premier-League rival\'s top scorer. Asking price £80m (set by the selling club). Internal valuation £52m. Rival club Liverpool is also bidding. Spurs board approves £75m to "win the auction".`,
      requirement:`Identify three behavioural biases at work and recommend mitigations. (12 marks)`,
      answer:
`BIAS 1 — ANCHORING (4 marks)
NAME: Anchoring on the £80m asking price.
EXPLAIN: The first number sets a mental reference; subsequent
"discounts" feel like value when they may still over-pay.
APPLY: Spurs internal valuation is £52m, yet £75m bid is judged
"a bargain" only relative to £80m, not relative to fair value.
MITIGATE: pre-set walk-away price BEFORE seeing seller's quote;
require board sign-off on any deviation > 5%.

BIAS 2 — COMPETITION FEVER / AUCTION BIAS (4 marks)
NAME: Competition bias — bidding to win, not because of value.
EXPLAIN: Presence of Liverpool as a rival raises emotional stakes.
APPLY: Director's framing "win the auction" reveals the bias.
MITIGATE: independent valuation committee with veto power;
explicit policy that "we walk if competitor outbids".

BIAS 3 — HUBRIS (Roll 1986) (4 marks)
NAME: Hubris — belief that Spurs management can extract value
others cannot.
EXPLAIN: Bidder convinced its "Spurs system" lifts player output.
APPLY: Implicit in approving 44% premium to internal valuation.
MITIGATE: external scout report; historical analysis of Spurs
players bought at premium and their output trajectory.

PROFESSIONAL SKILLS (bonus)
Scepticism: stress-test the premium against transfer-fee history.
Commercial acumen: opportunity cost — could £75m fund 3 other gaps?`,
      points:120, tags:['Section A','must-master','discussion']
    },
    {
      id:'beh-d2', ref:'Sep/Dec 2022 Q3 · style', marks:6,
      title:'Quick: name the bias',
      scenario:`(a) FD doubles down on a failing project to "prove the original decision right". (b) Trader buys a stock because everyone in the office is buying it. (c) Investor refuses to sell a losing stock because realising the loss feels worse than the equivalent gain.`,
      requirement:`Name each bias and one consequence.`,
      answer:
`(a) ENTRAPMENT / SUNK-COST FALLACY
    Consequence: throwing good money after bad; capital tied up
    in a value-destroying project.

(b) HERDING / SOCIAL CONFORMITY
    Consequence: bubbles & momentum-driven mispricings;
    correlated losses when herd reverses.

(c) LOSS AVERSION
    Consequence: portfolio over-weighted to losers; inferior
    risk-adjusted return; "disposition effect".`,
      points:60, tags:['quickfire']
    }
  ]
},

/* ====================== 3. COST OF CAPITAL ====================== */
coc: {
  id:'coc',
  title:'Cost of Capital — WACC, CAPM, MM2',
  syllabus:'B',
  spursAngle:'Spurs Treasury must compute the right hurdle rate for stadium-tech, women\'s academy, and an overseas tour. Each has its own risk profile.',
  papers:['Specimen Q2','Mar/Jun 2024 Q2','Sep/Dec 2023 Q1'],
  innov:'<b>2025 angle:</b> Sustainability-linked debt resets Kd dynamically with ESG KPIs — the cost of capital becomes a moving target.',
  mnemonic:'<b>FCFF→WACC · FCFE→Ke</b> (never mix)',
  quickFacts:[
    'WACC = (E/V)·Ke + (D/V)·Kd·(1−T)',
    'CAPM: Ke = Rf + β·(Rm−Rf)  — only systematic risk priced',
    'DVM: Ke = D₁/P₀ + g  — practical, but assumes constant g',
    'Bank loan Kd = i·(1−T); Pref shares Kpref = D/MV (no tax adj)',
    'Irredeemable Kd = i·(1−T)/MV; Redeemable Kd = IRR',
    'M&M2: Ke_g = Ke_u + (Ke_u − Kd)·(D/E)·(1−T)',
    'Ungear β to remove gearing; regear at YOUR D/E'
  ],
  notes:`
    <h4>1 · The three sources (cheapest to most expensive)</h4>
    <ol>
      <li><b>Debt</b> — tax shield makes it cheapest after tax.</li>
      <li><b>Preference shares</b> — middle, no tax relief.</li>
      <li><b>Equity</b> — most expensive, last in line.</li>
    </ol>
    <p class="formula">WACC = (E/V)·Ke + (D/V)·Kd·(1−T)</p>

    <h4>2 · Cost of equity — CAPM</h4>
    <p class="formula">Ke = Rf + β · (Rm − Rf)</p>
    <ul>
      <li>β &gt; 1: more volatile than market. β &lt; 1: defensive.</li>
      <li>Equity risk premium typically 4–7% in mature markets.</li>
      <li>CAPM only prices SYSTEMATIC risk (unsystematic diversifies away).</li>
    </ul>

    <h4>3 · DVM — practical but limited</h4>
    <p class="formula">Ke = D₁ / P₀ + g</p>
    <p>Limitations: assumes constant growth forever, current dividend representative, Ke constant. <b>Useless for non-dividend payers.</b></p>
    <p><b>Ex-div trick:</b> if quoted CUM-DIV, strip the dividend first: P_ex = P_cum − D₀.</p>

    <h4>4 · Cost of debt by instrument</h4>
    <table>
      <tr><th>Instrument</th><th>Formula</th></tr>
      <tr><td>Bank loan</td><td>Kd = i × (1−T)</td></tr>
      <tr><td>Preference shares</td><td>Kpref = D/MV (no tax)</td></tr>
      <tr><td>Irredeemable bond</td><td>Kd = i(1−T)/MV</td></tr>
      <tr><td>Redeemable bond</td><td>IRR of post-tax cash flows</td></tr>
      <tr><td>Convertible bond</td><td>IRR using MAX(redemption, conversion)</td></tr>
    </table>

    <h4>5 · Ungear / regear (project CAPM)</h4>
    <p class="formula">βa = βe × E / (E + D(1−T))      (often βd = 0)
βe_new = βa × (E_new + D_new(1−T)) / E_new</p>
    <p>Use when project risk profile differs from parent — pull a "pure-play" comparable's beta, ungear it, then regear at YOUR D/E.</p>

    <h4>6 · M&M Proposition 2 (with tax)</h4>
    <p class="formula">Ke_g = Ke_u + (Ke_u − Kd) × (D/E) × (1 − T)</p>
    <p>Allows you to back out the ungeared cost of equity if you only have geared data — the link to APV.</p>

    <h4>7 · Two-sector / combined cost of capital (M&A)</h4>
    <p>Post-merger, weight asset betas by value (or sales/profits): βa_combined = w₁·βa₁ + w₂·βa₂. Then regear at the new D/E.</p>

    <h4>8 · Common errors</h4>
    <ul>
      <li>Using book values instead of market values for WACC weights.</li>
      <li>Forgetting (1−T) on Kd — double-counting.</li>
      <li>Discounting FCFE at WACC (must be Ke).</li>
      <li>CAPM beta from a comparable but not ungearing first.</li>
    </ul>
  `,
  formulas:`
WACC = (E/V)·Ke + (D/V)·Kd·(1−T)
CAPM Ke = Rf + β · (Rm − Rf)
DVM   Ke = D₁/P₀ + g    (g via geometric or Gordon b·ROE)
Kd: bank = i(1−T); pref = D/MV; irred = i(1−T)/MV; redeem = IRR
βa = βe · E/(E + D(1−T))     βe = βa · (E + D(1−T))/E
M&M2: Ke_g = Ke_u + (Ke_u − Kd)·(D/E)·(1−T)
  `,
  pitfalls:[
    'Book values vs market values — examiner wants MV for WACC',
    'Forgetting tax on Kd or double-applying it',
    'Discounting FCFE at WACC (must be Ke) or FCFF at Ke',
    'Using comparable beta WITHOUT ungearing first'
  ],
  examples:[
    {title:'Redeemable bond IRR', body:'5yr 12% coupon, MV 107.59, ignore tax. CFs: −107.59, 12, 12, 12, 12, 112. IRR ≈ 10%.'},
    {title:'Convertible Kd', body:'5yr 8% bond, MV 85, SP 4 growing 7%, $100 nominal converts to 20 shares.\n SP yr5 = 4·1.07⁵ = 5.61\n Conversion value = 20×5.61 = 112.20 (> 100 par, so use)\n CFs: −85; +5.6 ×4yrs; +5.6 + 112.20 yr5\n IRR ≈ 11.66%.'},
    {title:'Ungear/regear', body:'Comparable βe 1.40, D/E 0.6 (D 0.6, E 1), T 25%.\n βa = 1.40 × 1/(1 + 0.6×0.75) = 1.40/1.45 = 0.9655\n Project at D/E 0.3:\n βe_new = 0.9655 × (1 + 0.3×0.75) = 0.9655 × 1.225 = 1.18'}
  ],
  drills:[
    {
      id:'coc-d1', ref:'Sep/Dec 2023 Q1 · style', marks:14,
      title:'Spurs WACC for stadium-tech project',
      scenario:`<b>Spurs Tech</b>: equity MV £600m, βe 1.20, debt MV £200m at 5% pre-tax. Tax 25%. Rf 4%, ERP 6%. New project is in cybersecurity (comparable: pure-play β 1.5, D/E 0.4). Project funded with same parent capital structure.`,
      requirement:`(a) Parent WACC. (b) Project-specific cost of capital using ungear/regear.`,
      answer:
`(a) PARENT WACC
   Ke = 4 + 1.20 × 6 = 11.20%
   Kd post-tax = 5 × 0.75 = 3.75%
   Weights: E/V = 600/800 = 0.75; D/V = 0.25
   WACC = 0.75 × 11.20 + 0.25 × 3.75 = 8.40 + 0.9375
        = 9.34%

(b) PROJECT WACC (different business risk)
   Step 1 — UNGEAR comparable (βe 1.5, D/E 0.4):
       βa = 1.5 × 1/(1 + 0.4 × 0.75) = 1.5/1.30 = 1.154
   Step 2 — REGEAR at parent D/E 0.333:
       βe_new = 1.154 × (1 + 0.333 × 0.75)
             = 1.154 × 1.250 = 1.443
   Step 3 — Project Ke = 4 + 1.443 × 6 = 12.66%
   Step 4 — Project WACC = 0.75 × 12.66 + 0.25 × 3.75
        = 9.50 + 0.9375 = 10.43%

DECISION: Use 10.43% (not 9.34%) — cybersecurity is riskier
than parent's blended business mix. Using parent WACC would
under-state the hurdle rate and accept value-destroying projects.

PROFESSIONAL SKILLS:
 • Scepticism: pure-play beta sourced from how many firms?
 • Commercial acumen: justify why cybersecurity beta differs.`,
      points:140, tags:['Section A','must-master']
    },
    {
      id:'coc-d2', ref:'Specimen Q2 · style', marks:8,
      title:'M&M2 — back out ungeared Ke',
      scenario:`Geared Ke 10%, Kd pre-tax 7% (post-tax 5.6%), MV equity £2,000m, MV debt £832m, Tax 20%.`,
      requirement:`Compute the ungeared cost of equity using M&M2.`,
      answer:
`M&M2 with tax:
  Ke_g = Ke_u + (Ke_u − Kd) × (D/E) × (1 − T)

  10 = Ke_u + (Ke_u − 5.6) × (832/2,000) × 0.80
  10 = Ke_u + (Ke_u − 5.6) × 0.333
  10 = Ke_u + 0.333·Ke_u − 1.866
  11.866 = 1.333 · Ke_u
  Ke_u = 8.90%

INTERPRETATION: if the firm became all-equity-financed, the cost
of equity would be 8.90% (lower than the geared 10% because
no financial-risk premium is needed).

EXAM TIP: lay out algebra step by step. Easy marks for showing
the rearrangement.`,
      points:80, tags:['M&M2','must-know']
    }
  ]
},

/* ====================== 4. NPV ====================== */
npv: {
  id:'npv',
  title:'NPV — Inflation, Tax & Project CF',
  syllabus:'B',
  spursAngle:'Spurs are appraising a £150m new training-ground extension. Real vs nominal, tax timing, working-capital release — every line is examinable.',
  papers:['Mar/Jun 2023 Q1','Sep/Dec 2024 Q1','Mar/Jun 2022 Q1'],
  innov:'<b>2025 angle:</b> Live-CPI APIs auto-feed Excel models — but the examiner still wants you to <b>state inflation per line item</b>.',
  mnemonic:'<b>Real with real, nominal with nominal</b> (Mower\'s rule)',
  quickFacts:[
    '6-step NPV: op CF → tax (loss c/f) → CF after tax → invest/RV/WC → discount → NPV',
    'Inflate each line at its own rate, then discount at NOMINAL Ke',
    'Tax-allowable depreciation: only the SAVING is a CF',
    'Tax timing 1-yr arrears = last year extends one beyond project life',
    'Working capital RELEASED at end of project — common trip-up',
    'Fisher: (1 + nom) = (1 + real) × (1 + inflation)',
    'PPP forecasts FX: F = S·(1 + i_counter)/(1 + i_base)'
  ],
  notes:`
    <h4>1 · The 6-step proforma</h4>
    <ol>
      <li>Operating CASH FLOWS BEFORE TAX (revenue − costs).</li>
      <li>TAX on TAXABLE PROFIT (= CF − TAD), with loss carry-forward.</li>
      <li>Bring forward TAX LOSSES — offset against future taxable profits.</li>
      <li>CASH FLOW AFTER TAX = pre-tax CF − tax payable.</li>
      <li>Add INVESTMENT (yr 0), RESIDUAL VALUE (final yr), WC movements.</li>
      <li>Discount net CFs at WACC → NPV. Decision: NPV > 0 → ACCEPT.</li>
    </ol>

    <h4>2 · Inflation traps</h4>
    <p>Different cash flows often inflate at <b>different rates</b>: sales general, costs industry, wages wage-inflation. Inflate each separately.</p>
    <p class="formula">Nominal CFt = Real CF (today) × (1 + specific inflation)^t</p>
    <div class="warn"><b>Mar/Jun 2024 examiner:</b> "Difficulties were encountered when applying different inflation rates to different years' cash flows."</div>

    <h4>3 · Tax-allowable depreciation (TAD)</h4>
    <ul>
      <li><b>Reducing balance</b> 25%: Yr1 = cost × 25%; Yr_n = NBV × 25%.</li>
      <li><b>Balancing allowance / charge</b> in disposal year:
        if proceeds &gt; WDV → balancing CHARGE (extra tax);
        if proceeds &lt; WDV → balancing ALLOWANCE (extra saving).</li>
      <li>NEVER deduct TAD as a cash flow — only the tax saving (TAD × T) hits cash.</li>
    </ul>

    <h4>4 · Working capital</h4>
    <ul>
      <li>Initial WC at year 0 (or year 1 start).</li>
      <li>INCREMENTAL change each year as sales grow.</li>
      <li>FULL RELEASE in final year — sum of incremental investments.</li>
    </ul>

    <h4>5 · Inflation conversions (Fisher)</h4>
    <p class="formula">(1 + nominal) = (1 + real) × (1 + inflation)</p>
    <ul>
      <li>Real 10% + inflation 5% → nominal 15.5%.</li>
      <li>Real 6% + inflation 4% → nominal 10.24%.</li>
      <li>Real 8% + inflation 4% → nominal 12.32%.</li>
    </ul>

    <h4>6 · FX in NPV — PPP & IRP</h4>
    <p class="formula">PPP:  F = S × (1 + i_counter)/(1 + i_base)
IRP:  F = S × (1 + r_counter)/(1 + r_base)</p>

    <h4>7 · Sensitivity analysis</h4>
    <p class="formula">Sensitivity = NPV / PV of variable
Lower % = MORE sensitive = HIGHER risk</p>
    <p>Tests ONE variable at a time — for combinations use scenario or Monte Carlo.</p>
  `,
  formulas:`
NPV = Σ CFt / (1+r)^t  −  Initial outlay
Fisher: (1 + nom) = (1 + real)(1 + inflation)
TAD (RB) Yr1 = cost × rate; Yr_n = NBV × rate
Bal allow = NBV − scrap; Bal charge if scrap > NBV
WC released at end of project (sum of incremental investments)
Sensitivity = NPV / PV(variable)
PPP: F = S × (1 + i_c)/(1 + i_b)
  `,
  pitfalls:[
    'Mixing real CFs with nominal Ke (caps marks at maybe 6/15)',
    'Using ONE inflation rate for all lines',
    'Tax 1-yr lag ignored — last year of tax extends one beyond project',
    'TAD deducted as a cash flow (it is non-cash; only the saving)',
    'Working capital invested but not released at end of project'
  ],
  examples:[
    {title:'Sensitivity quick', body:'NPV 5,619.83. PV Sales 17,355 → sales sensitivity = 5,619/17,355 = 32%.\n PV Costs 1,735 → costs sensitivity = 5,619/1,735 = 324%.\n SALES is more sensitive.'},
    {title:'PPP forecast', body:'Spot 1.50, UK inflation 10%, US 1%. F = 1.50 × 1.01/1.10 = 1.38.'}
  ],
  drills:[
    {
      id:'npv-d1', ref:'Mar/Jun 2023 Q1 · style', marks:18,
      title:'Tronkster Co — 4-year nominal NPV',
      scenario:`<b>Tronkster Co</b> appraises a 4-year project. Outlay £42m. Yr1 sales 1.6m units at £30 (today prices), price inflation 4%. VC £14/unit, inflation 3%. FC £6m today, inflation 3%. Tax 25%, 1-yr arrears. TAD 25% RB on £42m. Scrap yr4 £8m. Nominal Ke 11%. Sales VOLUME +5% real per year.`,
      requirement:`Compute NPV.`,
      answer:
`STEP 1  Sales (nominal):
  Yr1 1.60m × 30 × 1.04   = 49.92
  Yr2 1.68m × 30 × 1.04²  = 54.46
  Yr3 1.764m × 30 × 1.04³ = 59.50
  Yr4 1.852m × 30 × 1.04⁴ = 65.00

STEP 2  Variable costs:
  Yr1 1.60m × 14 × 1.03   = 23.07
  Yr2 1.68m × 14 × 1.03²  = 24.94
  Yr3 1.764m × 14 × 1.03³ = 26.97
  Yr4 1.852m × 14 × 1.03⁴ = 29.16

STEP 3  Fixed costs (× 1.03^t):
  6.18 / 6.37 / 6.55 / 6.75

STEP 4  TAD (RB 25% on £42m):
  Yr1 10.50 (NBV 31.50)
  Yr2  7.88 (NBV 23.63)
  Yr3  5.91 (NBV 17.72)
  Yr4 balancing allow = 17.72 − 8.00 = 9.72

STEP 5  Tax (25%, lag 1yr) on (Sales − VC − FC − TAD):
  Yr1 (49.92−23.07−6.18−10.50) = 10.17 → tax 2.54
  Yr2 (54.46−24.94−6.37− 7.88) = 15.27 → tax 3.82
  Yr3 (59.50−26.97−6.55− 5.91) = 20.07 → tax 5.02
  Yr4 (65.00−29.16−6.75− 9.72) = 19.37 → tax 4.84

STEP 6  Project net CFs:
  Yr0  −42.00
  Yr1  +20.67
  Yr2  +20.61 (less Yr1 tax 2.54)
  Yr3  +22.16 (less Yr2 tax 3.82)
  Yr4  +32.07 (incl scrap 8.00, less Yr3 tax 5.02)
  Yr5   −4.84 (final tax)

STEP 7  Discount @ 11%:
  PV = −42 + 18.62 + 16.74 + 16.20 + 21.13 − 2.87
     ≈ +£27.82m  → ACCEPT

EXAMINER REMINDERS:
 • Real vs nominal mix is the #1 marks-loser.
 • Tax lag — last year extends to yr 5.
 • Show 2 sensitivities for professional-skills marks.`,
      points:160, tags:['Section A','core proforma','must-master']
    },
    {
      id:'npv-d2', ref:'Mar/Jun 2022 Q1 · style', marks:6,
      title:'Working-capital release pitfall',
      scenario:`Project requires year-end WC of £4m yr1, £6m yr2, £6m yr3 (project ends yr3). Discount 10%.`,
      requirement:`Compute WC cash flows for inclusion in NPV.`,
      answer:
`Incremental WC (cash actually invested each year):
 Yr0 −4.0  (set up at project start)
 Yr1 −2.0  (rise from 4 to 6)
 Yr2  0    (stays at 6)
 Yr3 +6.0  WC RELEASED at end

PV at 10%:
 −4 + (−2/1.10) + 0 + (6/1.10³)
 = −4 − 1.818 + 4.508 = −£1.31m

EXAMINER WARNING: many candidates show the WC investment but
forget to release it — costs ~3 marks. Always release at end.`,
      points:60, tags:['trap','must-not-miss']
    }
  ]
},

/* ====================== 5. RISK & VAR ====================== */
risk: {
  id:'risk',
  title:'Risk Analysis — VaR (★ star) · Monte Carlo · MIRR',
  syllabus:'B',
  spursAngle:'Spurs treasury runs daily VaR on its FX book. £50m portfolio, 1.2% daily σ, 95% confidence — what\'s the worst-case 10-day loss?',
  papers:['Mar/Jun 2023 Q3','Sep/Dec 2024 Q3','Specimen Q3'],
  innov:'<b>2025 angle:</b> GenAI Monte Carlo stress-tests beyond historical σ — VaR + Expected Shortfall (CVaR) is the modern combo.',
  mnemonic:'<b>VaR = z · σ · V</b> · 95% one-tail z = <b>1.645</b>',
  quickFacts:[
    'VaR = z × σ × Portfolio value (1-day)',
    'z(95%) one-tail = 1.645; z(99%) = 2.326',
    'T-day VaR = 1-day × √T (assumes IID)',
    'EV only valid for repeated decisions — not one-offs',
    'MIRR = (TV/Investment)^(1/n) − 1 (TV at WACC)',
    'Sensitivity = NPV / PV(variable) — lower % = riskier',
    'Monte Carlo: distributions → random samples → NPV histogram'
  ],
  notes:`
    <h4>1 · Value at Risk (VaR) — the star topic</h4>
    <p><b>Statement form:</b> "We are 95% confident that losses will not exceed £X over T days."</p>
    <p class="formula">VaR(1-day) = z · σ · Portfolio value
VaR(T-day) = VaR(1-day) × √T</p>

    <h4>2 · Z-scores to memorise</h4>
    <table>
      <tr><th>Confidence</th><th>One-tail</th><th>Two-tail</th></tr>
      <tr><td>90%</td><td>1.282</td><td>—</td></tr>
      <tr><td>95%</td><td><b>1.645</b></td><td>1.96</td></tr>
      <tr><td>99%</td><td><b>2.326</b></td><td>2.576</td></tr>
    </table>

    <h4>3 · Limitations (always quoted)</h4>
    <ul>
      <li>Assumes normal distribution → ignores fat tails (kurtosis).</li>
      <li>Tells you the threshold, not the loss BEYOND it (use ETL/CVaR).</li>
      <li>σ assumed stable; spikes in crises break the model.</li>
      <li>√T scaling assumes IID; trending markets violate.</li>
      <li>Liquidity & correlation breakdown not captured.</li>
    </ul>

    <h4>4 · Expected values (probability-weighted)</h4>
    <p>EV = Σ(p × outcome). Valid only for LONG-RUN repeated decisions. For one-offs use risk-adjusted measures (utility, certainty equivalents).</p>

    <h4>5 · MIRR — fixes the IRR reinvestment problem</h4>
    <p class="formula">MIRR = (TV / Initial Investment)^(1/n) − 1
where TV = compound inflows forward at WACC.</p>
    <ul>
      <li>If IRR > WACC → MIRR &lt; IRR.</li>
      <li>If IRR &lt; WACC → MIRR > IRR.</li>
      <li>MIRR pulls back toward WACC — more realistic.</li>
    </ul>

    <h4>6 · Monte Carlo simulation</h4>
    <ol>
      <li>Identify variables (sales, costs, growth).</li>
      <li>Assign probability distribution to each.</li>
      <li>Random sample → recompute NPV → repeat thousands of times.</li>
      <li>Read off Expected NPV, σ, P(NPV&lt;0), VaR.</li>
    </ol>
    <p><b>Pros:</b> handles correlation, captures non-linearity, full distribution.</p>
    <p><b>Cons:</b> complex, GIGO, false sense of precision.</p>

    <h4>7 · Capital rationing</h4>
    <table>
      <tr><th>Hard</th><th>Soft</th></tr>
      <tr><td>External (markets won't lend, low rating, no security)</td><td>Self-imposed (limit exposure, maintain cover, no dilution)</td></tr>
    </table>
    <p>For DIVISIBLE projects rank by Profitability Index = NPV / Investment. For INDIVISIBLE, trial all combos.</p>
  `,
  formulas:`
VaR (1-day) = z · σ · Value
VaR (T-day) = VaR(1) · √T
z(95%) = 1.645    z(99%) = 2.326
EV = Σ(p × outcome)
MIRR = (TV / Investment)^(1/n) − 1
PI = NPV / Investment
Sensitivity = NPV / PV(variable)
  `,
  pitfalls:[
    'Not quoting the z-value explicitly (1.645 / 2.326)',
    'Confusing 1-tail and 2-tail',
    'Treating EV as valid for a one-off decision',
    'Forgetting √T for multi-period VaR',
    'PI used on indivisible projects (use trial combinations instead)'
  ],
  examples:[
    {title:'1-day & 10-day VaR', body:'V=£50m, σ=1.20%, 95% conf.\n 1-day = 50,000,000 × 1.645 × 0.0120 = £987,000\n 10-day = 987k × √10 = 987k × 3.162 = £3,121,000'},
    {title:'MIRR', body:'CFs: −1,000, +400, +600, +300; WACC 10%, n=3.\n TV at yr3 = 400·1.1² + 600·1.1 + 300 = 484 + 660 + 300 = 1,444\n MIRR = (1,444/1,000)^(1/3) − 1 = 13.03%'}
  ],
  drills:[
    {
      id:'risk-d1', ref:'Mar/Jun 2023 Q3 · style', marks:10,
      title:'1-day & 10-day VaR — equity portfolio',
      scenario:`Equity portfolio £50m. Daily σ of returns = 1.20%. Returns ~ Normal(0, σ²).`,
      requirement:`(a) 1-day 95% VaR. (b) 10-day 95% VaR. (c) Limitations.`,
      answer:
`(a) z(95%) = 1.645
    1-day VaR = 50,000,000 × 1.645 × 0.0120 = £987,000

(b) 10-day VaR = 987,000 × √10 = 987,000 × 3.162
              = £3,121,000

(c) LIMITATIONS:
   • Fat tails — normal underestimates extreme losses
   • VaR ≠ Expected Shortfall (use CVaR for what's beyond)
   • σ assumed stable; spikes in crises break the model
   • √T scaling assumes IID; trending markets violate
   • Correlations break down in stress

EXAMINER (Mar/Jun 23): candidates who didn't quote z = 1.645
lost an easy mark.`,
      points:120, tags:['must-know','star topic']
    },
    {
      id:'risk-d2', ref:'Sep/Dec 2024 Q3 · style', marks:8,
      title:'MIRR vs IRR — pick the project',
      scenario:`Project: Yr0 −£20m, then Yr1–5 inflows £5m / £6.5m / £7m / £5.7m / £4m + £3m terminal yr5. WACC 8%.`,
      requirement:`Compute MIRR and discuss vs IRR.`,
      answer:
`STEP 1 — Compound inflows to year 5 at 8%:
  Yr1 5.0 × 1.08⁴ = 6.80
  Yr2 6.5 × 1.08³ = 8.19
  Yr3 7.0 × 1.08² = 8.16
  Yr4 5.7 × 1.08¹ = 6.16
  Yr5 4.0 + 3.0   = 7.00
  TV = 6.80 + 8.19 + 8.16 + 6.16 + 7.00 = 36.31
       (book example shows 31.63 with diff terminal config)

STEP 2 — MIRR
  MIRR = (36.31 / 20)^(1/5) − 1
       = 1.8155^0.2 − 1
       = 1.1262 − 1 = 12.62%

DISCUSSION:
 IRR overstates by assuming reinvestment at IRR (often
 unrealistic). MIRR assumes WACC reinvestment → more realistic
 hurdle. If IRR was ~16% but WACC 8%, MIRR ≈ 12.6% — pulls back.

 Use MIRR for ranking competing projects when IRRs are very
 different from WACC.`,
      points:80, tags:['MIRR','high-yield']
    }
  ]
},

/* ====================== 6. APV ====================== */
apv: {
  id:'apv',
  title:'APV — Adjusted Present Value',
  syllabus:'B',
  spursAngle:'A subsidised stadium-energy upgrade: govt-backed loan at 1% vs market 6%. APV cleanly isolates the subsidy benefit.',
  papers:['Sep/Dec 2023 Q1','Mar/Jun 2021 Q1','Sep/Dec 2020 Q1'],
  innov:'<b>2025 angle:</b> Sustainability-linked loans (SLLs) reset margin with ESG KPIs — APV neatly handles the conditional savings.',
  mnemonic:'<b>Base @ Ke_u · Side-effects @ Kd</b>',
  quickFacts:[
    'APV = Base NPV + PV(financing side-effects) − Issue costs',
    'Base @ UNGEARED Ke (treat project as all-equity)',
    'Tax shield + subsidy @ pre-tax Kd',
    'Subsidy benefit: (rₘ − rₛ) × Loan × (1 − T)',
    'Use APV when capital structure changes year-to-year',
    'Or when there\'s a special-purpose loan / grant',
    'NEVER use WACC inside APV (defeats the point)'
  ],
  notes:`
    <h4>1 · Three-line APV</h4>
    <p class="formula">APV = Base-case NPV + PV(financing side-effects)
Base @ ungeared Ke (Ke_u)
Side-effects @ debt rate (Kd)</p>

    <h4>2 · When to use APV vs WACC</h4>
    <ul>
      <li>Capital structure CHANGES year by year (amortising debt).</li>
      <li>Project has SUBSIDISED loan or grant.</li>
      <li>Issue costs material.</li>
      <li>Highly geared LBOs.</li>
      <li>M&A target with different gearing than parent.</li>
    </ul>

    <h4>3 · Step-by-step</h4>
    <ol>
      <li><b>Ungear equity beta:</b> βa = βe · E/(E+D(1−T)).</li>
      <li><b>Compute Ke_u:</b> Ke_u = Rf + βa · ERP.</li>
      <li><b>Base NPV</b> = PV operating CFs at Ke_u (project as all-equity).</li>
      <li><b>PV tax shield</b>: interest × T, discounted at Kd (or risk-adjusted Kd).</li>
      <li><b>PV subsidy benefit</b>: (rₘ − rₛ) × Loan × (1 − T) discounted at Kd.</li>
      <li><b>Less issue costs</b> (often tax-deductible).</li>
    </ol>
    <div class="callout"><b>Why discount at Kd?</b> Tax-shield/subsidy CFs have similar risk to debt CFs (depend on contracted interest), so Kd is the right rate.</div>

    <h4>4 · Loan amortisation tax shield</h4>
    <p>Equal-instalment loan: payment = Principal / annuity factor. Each payment splits into INTEREST (op bal × rate) + CAPITAL repayment. Tax shield = INTEREST × T each year (only the interest portion).</p>

    <h4>5 · Common errors</h4>
    <ul>
      <li>WACC used inside APV (the WHOLE point of APV is to NOT do that).</li>
      <li>Subsidy benefit not netted of (1−T).</li>
      <li>Tax shield discounted at WACC instead of Kd.</li>
      <li>Issue costs forgotten or not tax-relieved.</li>
    </ul>
  `,
  formulas:`
βa = βe · E/(E + D(1−T))      (often βd = 0)
Ke_u = Rf + βa · ERP
Base NPV = Σ CFt/(1 + Ke_u)^t  − Outlay
PV tax shield = Σ (Interest × T) / (1 + Kd)^t
PV subsidy = Σ (rₘ − rₛ) · Loan · (1 − T) / (1 + Kd)^t
APV = Base + Tax shield + Subsidy − Issue costs
  `,
  pitfalls:[
    'WACC used inside APV (defeats the point)',
    'Subsidy benefit not netted of (1 − T)',
    'Tax shield discounted at WACC instead of Kd',
    'Forgetting issue costs OR forgetting they are tax-deductible'
  ],
  examples:[
    {title:'Loan amortisation tax shield', body:'£1,000 loan, 10%, 2yr equal payments, T 30%.\n Annuity factor 2yr,10% = 1.7355\n Annual payment = 1,000 / 1.7355 = 576.19\n Yr1 interest = 100 (×30% = 30 saving)\n Yr2 interest = 52.38 (×30% = 15.71 saving)\n PV tax shield @ 10% = 30/1.10 + 15.71/1.21 = 27.27 + 12.99 = £40.26'}
  ],
  drills:[
    {
      id:'apv-d1', ref:'Sep/Dec 2023 Q1 · style', marks:18,
      title:'Subsidised loan APV',
      scenario:`Project needs £60m. £30m via govt loan at <b>3%</b> (market 6%), interest-only 4 yrs, repaid yr4. Asset β 0.9, Rf 4%, ERP 6%. Tax 25%. Operating CF £14m p.a. for 4 yrs. Issue costs nil.`,
      requirement:`Calculate APV.`,
      answer:
`STEP 1 — Ungeared Ke:
  Ke_u = 4 + 0.9 × 6 = 9.4%

STEP 2 — Base NPV (all-equity):
  AF(4yr, 9.4%) = (1 − 1.094^−4)/0.094 ≈ 3.221
  Base NPV = −60 + 14 × 3.221
           = −60 + 45.094 = −£14.91m

STEP 3 — PV of tax shield (on subsidised loan @3%):
  Annual interest = 3% × 30 = £0.9m
  Tax saving = 0.9 × 25% = £0.225m
  PV @ Kd 6%, AF(4yr,6%) = 3.465
  → 0.225 × 3.465 = £0.78m

STEP 4 — PV of subsidy benefit:
  Annual saving vs market = (6% − 3%) × 30 = £0.9m
  After-tax saving = 0.9 × 0.75 = £0.675m
  PV @ 6%, 4 yrs = 0.675 × 3.465 = £2.34m

STEP 5 — Issue costs: nil.

APV = −14.91 + 0.78 + 2.34 = −£11.79m  → REJECT

EXAMINER POINTS:
 • Discount BASE at UNGEARED Ke (9.4%).
 • Discount tax shield + subsidy at DEBT rate (6% pre-tax).
 • Subsidy benefit must be (1 − T) — easy 2 marks lost otherwise.

If asked for advice with synergies → mention that an APV-negative
project should NOT be saved by financing benefits alone; revisit
operating drivers.`,
      points:160, tags:['Section A','must-master']
    },
    {
      id:'apv-d2', ref:'Mar/Jun 2021 Q1 · style', marks:6,
      title:'Quick: ungear and regear beta',
      scenario:`Comparable: βe 1.40, D/E 0.6 (D 0.6, E 1). Tax 25%. Project firm has D/E 0.3.`,
      requirement:`Compute βa and project βe.`,
      answer:
`Step 1 — UNGEAR comparable:
  βa = 1.40 × 1 / (1 + 0.6 × 0.75)
     = 1.40 / 1.45 = 0.9655

Step 2 — REGEAR at project D/E 0.3:
  Project βe = 0.9655 × (1 + 0.3 × 0.75)
            = 0.9655 × 1.225 = 1.18

Use this βe in CAPM for the project Ke.

NOTE: assumes βd = 0 unless told otherwise.`,
      points:60, tags:['ungear/regear','must-know']
    }
  ]
},

/* ====================== 7. REAL OPTIONS ====================== */
real: {
  id:'real',
  title:'Real Options — Delay · Expand · Abandon · Switch',
  syllabus:'B',
  spursAngle:'Spurs\' new women\'s academy — NPV negative today, but the option to expand into Asia in 3 years is huge. Real options unlock that value.',
  papers:['Mar/Jun 2024 Q3','Sep/Dec 2022 Q3','Mar/Jun 2021 Q3'],
  innov:'<b>2025 angle:</b> AI capex = a CALL option. High σ + flexibility = high option value. Don\'t reject on NPV alone.',
  mnemonic:'<b>Adjusted NPV = Traditional NPV + Option value</b>',
  quickFacts:[
    'Pa = PV of inflows (NOT capex). Pe = exercise price.',
    'DELAY = call. EXPAND = call. ABANDON = put. SWITCH = compound.',
    'Higher σ → HIGHER option value (not lower)',
    'Longer t → higher value',
    'Put-call parity: p = c − Pa + Pe·e^(−rt)',
    'BSOP assumes EUROPEAN — UNDER-states American option value',
    'Real options ≠ NPV alternative; they ADD to NPV'
  ],
  notes:`
    <h4>1 · Four real-option types</h4>
    <ul>
      <li><b>Delay/Defer</b> — CALL on the project. Pa = PV CFs; Pe = capex.</li>
      <li><b>Expand/Follow-on</b> — CALL on a future bigger project.</li>
      <li><b>Abandon</b> — PUT. Pa = PV remaining CFs; Pe = salvage/scrap.</li>
      <li><b>Switch / Redesign</b> — compound option (rarely numerical, just explain).</li>
    </ul>

    <h4>2 · BSOP inputs (the 5)</h4>
    <table>
      <tr><th>Variable</th><th>Meaning</th></tr>
      <tr><td>Pa</td><td>Current asset value (PV inflows)</td></tr>
      <tr><td>Pe</td><td>Exercise price (capex / salvage)</td></tr>
      <tr><td>r</td><td>Risk-free rate (continuously compounded)</td></tr>
      <tr><td>t</td><td>Time to expiry (years)</td></tr>
      <tr><td>σ</td><td>Volatility (annualised SD of returns)</td></tr>
    </table>

    <h4>3 · The two formulas</h4>
    <p class="formula">d₁ = [ ln(Pa/Pe) + (r + σ²/2)·t ] / (σ·√t)
d₂ = d₁ − σ·√t
Call c = Pa·N(d₁) − Pe·e^(−r·t)·N(d₂)
Put  p = c − Pa + Pe·e^(−r·t)   (parity)</p>

    <h4>4 · Decision rules</h4>
    <ul>
      <li><b>DELAY:</b> exercise (invest) when Pa > Pe + option value foregone.</li>
      <li><b>ABANDON:</b> exercise when salvage > PV of continuing.</li>
    </ul>
    <div class="warn"><b>Mar/Jun 2024 examiner:</b> "Many candidates failed to discuss real options. Generic discussion did not earn marks." Tie σ, t, Pa to the SCENARIO.</div>

    <h4>5 · Limitations of BSOP for real options (essay points)</h4>
    <ul>
      <li>Real assets not freely traded → no perfect market.</li>
      <li>Volatility hard to estimate (no historical price series).</li>
      <li>Returns may not be lognormal.</li>
      <li>BSOP assumes EUROPEAN exercise → understates American option.</li>
      <li>Competitor entry can erode the option over time.</li>
      <li>Strategic / non-financial value not captured.</li>
    </ul>
  `,
  formulas:`
d1 = [ln(Pa/Pe) + (r + σ²/2)·t] / (σ·√t)
d2 = d1 − σ·√t
Call c = Pa · N(d1) − Pe · e^(−r·t) · N(d2)
Put  p = c − Pa + Pe · e^(−r·t)
Total project value = traditional NPV + real-option value
  `,
  pitfalls:[
    'Pa and Pe swapped (Pa = PV inflows, Pe = capex)',
    'σ assumed = β; volatility ≠ beta',
    'No discussion of limitations of Black-Scholes for real options',
    'Total project value (NPV + option) not stated',
    'Confusing call vs put for the option type'
  ],
  examples:[
    {title:'Option to delay (Mar/Jun 2024)', body:'Pa=85, Pe=92, t=2, r=4%, σ=35%.\n d1 = (ln(85/92) + (0.04 + 0.06125)·2) / 0.495 = 0.249 → N(d1)=0.598\n d2 = −0.246 → N(d2)=0.403\n Call = 85·0.598 − 92·e^(−0.08)·0.403 = 50.87 − 34.22 = £16.65m'},
    {title:'Equity as call (Merton)', body:'Pa=200 (assets), Pe=170 (debt face), t=5, r=5%, σ=30%.\n d1 = 0.95 → N=0.829\n d2 = 0.28 → N=0.610\n Equity = 200·0.829 − 170·e^(−0.25)·0.610 = 165.8 − 80.76 = £85m\n Implied yield = (170/115)^(1/5) − 1 = 8.1% (vs Rf 5% → spread 313bp)'}
  ],
  drills:[
    {
      id:'real-d1', ref:'Mar/Jun 2024 Q3 · style', marks:14,
      title:'Option to delay a 5-yr project',
      scenario:`Project: PV of inflows £85m, capex £92m → conventional NPV = −£7m. Management can <b>delay</b> 2 years. σ = 35%. r = 4%.`,
      requirement:`Value the delay option and recommend.`,
      answer:
`Pa = 85,  Pe = 92,  t = 2,  r = 0.04,  σ = 0.35

d1 = [ ln(85/92) + (0.04 + 0.35²/2) × 2 ] / (0.35 × √2)
   = [ ln(0.9239) + 0.10125 × 2 ] / 0.4950
   = [ −0.0791 + 0.2025 ] / 0.4950
   = 0.2493
   → N(d1) ≈ 0.5985

d2 = 0.2493 − 0.4950 = −0.2457
   → N(d2) ≈ 0.4030

Call = 85 × 0.5985 − 92 × e^(−0.08) × 0.4030
     = 50.87 − 92 × 0.9231 × 0.4030
     = 50.87 − 34.22
     = £16.65m

DECISION:
  Conventional NPV     = −£7.00m  → reject
  Real-option value    = +£16.65m
  TOTAL                = +£9.65m  → ACCEPT (delay)

DISCUSSION (mark earners):
 • Volatility is the biggest assumption — sensitise.
 • Competitor entry erodes the option as time passes.
 • European call OK approx; American would be slightly higher.
 • Tie σ to industry analogue (30–40% for tech).`,
      points:140, tags:['high-yield','must-master']
    },
    {
      id:'real-d2', ref:'Sep/Dec 2022 Q3 · style', marks:10,
      title:'Option to abandon — Duck Co / Swan Co',
      scenario:`Duck Co 5-yr project, cost $37.5m, NPV stand-alone = −$0.45m. Swan Co offers $28m to take over at start of yr3. Asset value of put = PV of CFs foregone yr3–5 = $30.6m. σ=35%, Rf=4%, t=2.`,
      requirement:`Value the put option to abandon and recompute adjusted NPV.`,
      answer:
`Pa = 30.6, Pe = 28, t = 2, r = 0.04, σ = 0.35

d1 = [ln(30.6/28) + (0.04 + 0.06125)·2] / (0.35·√2)
   = [0.0888 + 0.2025] / 0.495
   = 0.5885
   → N(d1) ≈ 0.722

d2 = 0.5885 − 0.495 = 0.0935
   → N(d2) ≈ 0.537

Call c = 30.6 × 0.722 − 28 × e^(−0.08) × 0.537
       = 22.09 − 28 × 0.9231 × 0.537
       = 22.09 − 13.88 = $8.21m

Put p = c − Pa + Pe · e^(−rt)
      = 8.21 − 30.60 + 28 × 0.9231
      = 8.21 − 30.60 + 25.85 = $3.46m

ADJUSTED NPV = −0.45 + 3.46 = +$3.01m  → PROCEED

The sell-back option converts a marginal loser into a winner.
Discuss: this is European in BSOP but actually American
(can sell yr3); BSOP UNDERSTATES the put — actual value higher.`,
      points:120, tags:['put option','advanced']
    }
  ]
},

/* ====================== 8. VALUATION ====================== */
val: {
  id:'val',
  title:'Business Valuation — DCF · FCF · DDM · Multiples',
  syllabus:'B',
  spursAngle:'A boutique sport-science consultancy: 3-year forecast then perpetuity. FCFE → equity, FCFF → enterprise. WACC iteration is the trap.',
  papers:['Sep/Dec 2024 Q2','Mar/Jun 2023 Q1','Specimen Q2'],
  innov:'<b>2025 angle:</b> Real-time DCF dashboards (Tegus, AlphaSense) — but examiner still wants explicit WACC iteration.',
  mnemonic:'<b>FCFF→WACC→EV. FCFE→Ke→equity.</b> Don\'t double-discount.',
  quickFacts:[
    'FCFF = NOPAT + D&A − Capex − ΔWC',
    'FCFE = FCFF − Int(1−T) − net debt repayment',
    'EV (Gordon) = FCF₁ / (WACC − g)',
    'TV at year n = FCF(n+1) / (r − g)',
    'Two-stage DDM: PV explicit dividends + PV of perpetuity TV',
    'Marketability discount 20–30% for unlisted',
    'Control premium 20–40% (vs minority discount)'
  ],
  notes:`
    <h4>1 · Valuation pyramid (rank from most reliable)</h4>
    <ol>
      <li><b>FCFF/WACC → EV</b> → minus debt → equity.</li>
      <li><b>FCFE/Ke → equity</b> directly.</li>
      <li><b>Dividend Discount Model</b> (Gordon, two-stage).</li>
      <li><b>Multiples</b> (P/E, EV/EBITDA): triangulate, don't rely solely.</li>
      <li><b>Asset-based</b>: floor for asset-rich firms.</li>
    </ol>

    <h4>2 · FCFF vs FCFE</h4>
    <p class="formula">FCFF = NOPAT + Depreciation − Capex − ΔWC
FCFE = FCFF − Interest(1−T) − Net debt repayment</p>
    <p>Or directly: FCFE = NetIncome + Dep − Capex − ΔWC + Net new debt.</p>

    <h4>3 · Two-stage DCF</h4>
    <p class="formula">V = Σ FCFt/(1+r)^t  +  FCF(n+1)/(r−g)/(1+r)^n</p>
    <p>FCF(n+1) uses LONG-RUN growth, not the high-growth phase.</p>

    <h4>4 · Two-stage DVM (worked)</h4>
    <p>Yr1 D=10, Yr2 D=40, Yr3 D=30, then 5% growth, Ke 10%.<br/>
    TV at end yr3 = 30·1.05/0.05 = 630.<br/>
    PV = 9.09 + 33.06 + (30+630)/1.331 = 9.09 + 33.06 + 495.87 = <b>538.02</b>.</p>

    <h4>5 · Discount-rate signpost</h4>
    <table>
      <tr><th>Cash flow</th><th>Discount rate</th></tr>
      <tr><td>FCFF (firm)</td><td>WACC</td></tr>
      <tr><td>FCFE (equity)</td><td>Ke</td></tr>
      <tr><td>Dividends</td><td>Ke</td></tr>
      <tr><td>Debt CFs / tax shields</td><td>Kd</td></tr>
    </table>

    <h4>6 · WACC iteration trap</h4>
    <p>If MV equity unknown: pick guess → compute WACC → compute V → recompute weights → repeat. Most candidates use book values — mention BOOK vs MV explicitly to bank an easy mark.</p>

    <h4>7 · Adjustments (Mower)</h4>
    <ul>
      <li><b>Marketability discount</b> for unlisted: 20–30%.</li>
      <li><b>Control premium / minority discount:</b> 20–40%.</li>
      <li><b>Synergy add-back</b> when valuing a target.</li>
    </ul>

    <h4>8 · Yield curve & spot rates</h4>
    <p>For credit-risky bonds, ADD CREDIT SPREAD per rating to the relevant spot rate. Term structure of interest rates differs for each maturity.</p>
  `,
  formulas:`
FCFF = NOPAT + D&A − Capex − ΔWC
FCFE = FCFF − Int(1−T) − Net debt repayment
EV = FCFF₁ / (WACC − g)    (Gordon)
TV at yr n = FCF(n+1) / (r − g), discount back at (1+r)^n
WACC = (E/V)·Ke + (D/V)·Kd·(1−T)
Macaulay D = Σ(t · PV(CF)) / Bond Price
Modified D = Macaulay / (1 + y)
  `,
  pitfalls:[
    'FCFE discounted at WACC (must be Ke)',
    'Reinvestment shown as depreciation alone (= Capex − Dep + ΔWC)',
    'Book values used in WACC instead of market values',
    'Terminal value at year n discounted as if at year n+1',
    'Forgetting to subtract debt to get equity value'
  ],
  examples:[
    {title:'Gordon perpetuity', body:'FCF 100, growth 4%, WACC 10%.\n EV = 100 × 1.04 / (0.10 − 0.04) = 104/0.06 = 1,733'},
    {title:'Macaulay duration', body:'Yield 10%, 4yr 10% bond. PVs: 9.09 / 8.26 / 7.51 / 47.66. Sum 72.52.\n D = (9.09·1 + 8.26·2 + 7.51·3 + 47.66·4) / 72.52 = 240/72.52 = 3.31 years.'}
  ],
  drills:[
    {
      id:'val-d1', ref:'Sep/Dec 2024 Q2 · style', marks:16,
      title:'FCFF + WACC equity value per share',
      scenario:`Target: revenue £200m growing 6% for 3 yrs then 2.5% perpetuity. Op margin 18%. Tax 25%. Reinvest (capex − dep + ΔWC) £8m yr1 rising 5% p.a. Debt £80m at 5%. βe 1.2. Rf 4%. ERP 6%. 300m shares.`,
      requirement:`Per-share equity value via FCFF + WACC.`,
      answer:
`STEP 1 — WACC (initial guess MV equity ≈ £320m):
  Ke = 4 + 1.2 × 6 = 11.2%
  Kd post-tax = 5 × 0.75 = 3.75%
  WACC = (320/400)·11.2 + (80/400)·3.75 = 8.96 + 0.75 = 9.71%

STEP 2 — FCFF forecast yrs 1–3:
  Yr1: Rev 212.0, EBIT 38.16, NOPAT 28.62, − reinv 8.00 = 20.62
  Yr2: Rev 224.7, EBIT 40.45, NOPAT 30.34, − reinv 8.40 = 21.94
  Yr3: Rev 238.2, EBIT 42.88, NOPAT 32.16, − reinv 8.82 = 23.34

STEP 3 — Terminal Value (g = 2.5%):
  FCFF yr4 = 23.34 × 1.025 = 23.92
  TV = 23.92 / (0.0971 − 0.025) = £331.4m

STEP 4 — PV at 9.71%:
  PV(FCFFs) = 20.62/1.0971 + 21.94/1.0971² + 23.34/1.0971³
            = 18.79 + 18.23 + 17.66 = 54.68
  PV(TV)    = 331.4/1.0971³ = 250.74
  EV = 54.68 + 250.74 = £305.4m

STEP 5 — Equity value:
  E = EV − Debt = 305.4 − 80 = £225.4m
  Per share = 225.4 / 300m = £0.751

ITERATE: with new MV equity 225 vs debt 80, WACC adjusts to
~9.95% → V drops slightly. State the iteration.

EXAMINER POINTS:
 • Reinvestment ≠ depreciation alone.
 • Use POST-TAX Kd; don't tax twice.
 • Triangulate with a P/E sanity check.`,
      points:160, tags:['Section A','high-yield']
    },
    {
      id:'val-d2', ref:'Mar/Jun 2023 Q1 · style', marks:8,
      title:'P/E vs DDM cross-check',
      scenario:`Listed peer P/E 18×. Target earnings £15m. DDM: Div yr1 £6m, growth 5%, Ke 11%. Discounts: marketability 25%, minority discount 20%.`,
      requirement:`Triangulate range and recommend.`,
      answer:
`P/E approach:
  18 × £15m = £270m
  − marketability 25% → 270 × 0.75 = £202.5m
  − minority 20%      → 202.5 × 0.80 = £162.0m

DDM approach:
  V = 6 / (0.11 − 0.05) = £100m
  (intrinsic — no marketability discount needed)

RANGE: £100m (DDM) to £162m (adjusted P/E)
RECOMMEND mid-range ~£130m absent further data.

COMMENT (Mower):
 • DDM very sensitive to (Ke − g). Sensitise.
 • P/E uses peers' mood — bull market may overstate.
 • Triangulation > a single number.`,
      points:80, tags:['triangulation','must-know']
    }
  ]
},

/* ====================== 9. ISLAMIC ====================== */
islam: {
  id:'islam',
  title:'Islamic Finance & Ethical Funding',
  syllabus:'B · E',
  spursAngle:'A Sharia-compliant stadium financing: Sukuk asset-backed structure replaces interest-bearing bond. ESG bonus: avoids riba.',
  papers:['Sep/Dec 2022 Q3','Mar/Jun 2024 Q2'],
  innov:'<b>2025 angle:</b> Green Sukuk (Sharia-compliant + ESG) bridges two trillion-dollar capital pools — football clubs in the Gulf are early adopters.',
  mnemonic:'<b>No riba · No gharar · No maysir</b>',
  quickFacts:[
    'Murabaha = cost-plus trade financing (no interest, mark-up)',
    'Mudaraba = profit-share partnership (capital + labour split)',
    'Musharaka = full equity JV (all partners contribute & manage)',
    'Sukuk = Islamic bond, ASSET-BACKED, returns from rentals',
    'Ijara = Islamic leasing (lessor keeps ownership)',
    'Debts must be < 33% of company MV to be Sharia-compliant',
    'No haram industries (alcohol, gambling, pork, conventional banking)'
  ],
  notes:`
    <h4>1 · Three forbidden things</h4>
    <ul>
      <li><b>Riba</b> — interest of any kind.</li>
      <li><b>Gharar</b> — excessive uncertainty (e.g. derivatives without underlying asset).</li>
      <li><b>Maysir</b> — speculation / gambling.</li>
    </ul>

    <h4>2 · Five core instruments</h4>
    <table>
      <tr><th>Instrument</th><th>Mechanic</th><th>Closest Western analog</th></tr>
      <tr><td>Murabaha</td><td>Bank buys asset, sells to client at mark-up, instalments</td><td>Trade credit / hire-purchase</td></tr>
      <tr><td>Mudaraba</td><td>Investor (rabb-ul-mal) gives capital; entrepreneur (mudarib) gives labour. Profits shared per ratio; LOSSES borne by capital provider only.</td><td>Limited partnership</td></tr>
      <tr><td>Musharaka</td><td>Full JV — all partners contribute capital + management. Profits per ratio; losses per capital share.</td><td>Equity JV</td></tr>
      <tr><td>Sukuk</td><td>Holders own a share of underlying ASSET. Returns from rental/lease, NOT interest.</td><td>Asset-backed bond</td></tr>
      <tr><td>Ijara</td><td>Lessor retains ownership; lessee pays rent.</td><td>Operating lease</td></tr>
    </table>

    <h4>3 · Compliance criteria</h4>
    <ul>
      <li>Asset-backed (real underlying, not synthetic).</li>
      <li>Profit & risk shared.</li>
      <li>Investments must contribute socially/ethically.</li>
      <li>Total debts < 33% of company market value.</li>
      <li>No haram industry exposure.</li>
    </ul>

    <h4>4 · Why Western firms care</h4>
    <p>Sharia-compliant capital pool exceeds $4 trillion globally. Sukuk issuance opens GCC, Malaysian, Indonesian investor base. Pricing comparable to investment-grade bonds; structuring more complex.</p>
  `,
  formulas:`
No formulas — discussion + structuring topic.
Sukuk return = pre-agreed share of asset rental/profit
Mudaraba: profits split per agreed ratio; losses to capital provider only
  `,
  pitfalls:[
    'Confusing Mudaraba (capital + labour) with Musharaka (all contribute)',
    'Treating Sukuk as a simple bond with the word changed',
    'Forgetting losses in Mudaraba fall ONLY on the capital provider',
    'Ignoring asset-backing requirement (Sukuk MUST own real underlying)'
  ],
  drills:[
    {
      id:'isl-d1', ref:'Sep/Dec 2022 Q3 · style', marks:8,
      title:'Choose the right Islamic instrument',
      scenario:`Spurs Holdings considers four projects: (a) £200m new training-ground build, (b) £50m equipment for medical wing, (c) £30m JV with Saudi tech firm, (d) £80m short-term inventory finance for merchandise.`,
      requirement:`Recommend the most appropriate Islamic instrument for each and justify.`,
      answer:
`(a) £200m TRAINING GROUND
   → SUKUK (Ijara-Sukuk variant). Holders own the asset and
   receive rental as return. Asset-backed nature aligns with
   real-estate, no riba.

(b) £50m MEDICAL EQUIPMENT
   → IJARA (Islamic lease). Lessor (bank) keeps ownership;
   Spurs pays rent. Common for capex with clear underlying.

(c) £30m SAUDI JV
   → MUSHARAKA. Both parties contribute capital + management.
   Profits per agreed ratio (often 50/50). Suits genuine JV.
   Mudaraba would also work if Saudi side provides only capital
   and Spurs provides expertise.

(d) £80m INVENTORY FINANCE
   → MURABAHA. Bank buys merchandise, sells to Spurs at agreed
   mark-up over deferred instalments. Trade-financing classic.

EXAMINER MARKS: name + structure + why-this-not-that.`,
      points:80, tags:['discussion','must-know']
    }
  ]
},

/* ====================== 10. M&A ====================== */
mna: {
  id:'mna',
  title:'M&A · Reorganisation · Buybacks',
  syllabus:'C',
  spursAngle:'A hypothetical Spurs takeover bid for an analytics start-up. Floor = stand-alone value. Ceiling = stand-alone + synergy − integration. Bid sits between.',
  papers:['Sep/Dec 2021 Q1','Mar/Jun 2023 Q2','Sep/Dec 2025 Q3'],
  innov:'<b>2025 angle:</b> AI due-diligence (DealRoom, Carta) speeds deals 80%. Synergy valuation still done on PAPER in the exam.',
  mnemonic:'<b>Floor · Bid · Ceiling</b> — always state all three',
  quickFacts:[
    'Synergy: V(A+B) > V(A) + V(B) — must exceed bid premium',
    'Three synergy types: REVENUE (hardest) · COST (easiest) · FINANCIAL',
    'Floor = target stand-alone. Ceiling = stand-alone + synergy − integration',
    'Bootstrapping EPS: high-PE acquirer + low-PE target = mechanical EPS rise (illusion)',
    'Reverse takeover: private firm buys listed shell to gain listing without IPO',
    'Demerger reverses the conglomerate discount',
    'MBO/MBI: management knows the business; PE adds discipline'
  ],
  notes:`
    <h4>1 · Three-step M&A framework</h4>
    <ol>
      <li><b>Stand-alone</b> value of target (FCFE perpetuity, P/E, DDM).</li>
      <li><b>Synergy</b> = PV(extra CFs) − PV(integration cost).</li>
      <li><b>Maximum bid</b> = stand-alone + synergy.<br/>
          <b>Minimum acceptable</b> = stand-alone (target's view).</li>
    </ol>

    <h4>2 · Synergy types</h4>
    <ul>
      <li><b>Revenue</b> — cross-sell, expanded base, pricing power. Hardest to defend.</li>
      <li><b>Cost</b> — economies of scale & scope, eliminate duplication, bulk purchasing.</li>
      <li><b>Financial</b> — lower WACC via diversification, internal capital markets, increased debt capacity, tax-loss utilisation.</li>
    </ul>

    <h4>3 · Cash vs share offer</h4>
    <table>
      <tr><th>Cash</th><th>Shares</th></tr>
      <tr><td>Certain value</td><td>Diluted earnings/control</td></tr>
      <tr><td>Drains liquidity</td><td>No cash needed</td></tr>
      <tr><td>CGT now for target shareholders</td><td>Tax deferred (rollover)</td></tr>
      <tr><td>Target shareholders exit</td><td>Stay invested in synergy</td></tr>
    </table>

    <h4>4 · Bootstrapping EPS — the illusion</h4>
    <p>High-P/E acquirer issues paper to buy low-P/E target. Combined EPS rises mechanically. <b>NO real value created</b> — markets often see through and re-rate combined firm at lower blended P/E.</p>

    <h4>5 · Capital reconstruction (rescue scheme)</h4>
    <p><b>Liquidation priority order</b> (UK):</p>
    <ol>
      <li>Liquidator / wages.</li>
      <li>Tax.</li>
      <li>Secured (fixed charge).</li>
      <li>Secured (floating charge).</li>
      <li>Unsecured creditors.</li>
      <li>Preference shareholders.</li>
      <li>Ordinary shareholders.</li>
    </ol>
    <p>6-step fairness test: principles → liquidation comparison → finance sufficiency → parties better off → post-scheme viability → conclude.</p>

    <h4>6 · Unbundling / demerger</h4>
    <ul>
      <li><b>Trade sale</b>, <b>MBO/MBI</b>, <b>spin-off / demerger</b>.</li>
      <li>Reverses conglomerate discount; gives sharper management focus.</li>
      <li>Cost: lose economies of scale, internal capital market, scope efficiency.</li>
    </ul>

    <h4>7 · Share buybacks (3 routes)</h4>
    <ol><li>Open-market.</li><li>Negotiated.</li><li>Tender offer at premium.</li></ol>
    <p>Rationale: signal undervaluation, return surplus cash, raise EPS, change structure, takeover defence, satisfy option dilution.</p>

    <h4>8 · Mower's bid-letter structure</h4>
    <ol>
      <li>State floor and ceiling.</li>
      <li>Justify offered price within that range.</li>
      <li>Comment on payment structure (cash/share/mix).</li>
      <li>Identify 2 risks (integration, culture, key staff).</li>
      <li>One ESG / professional-skills line.</li>
    </ol>
  `,
  formulas:`
Stand-alone (perp) = FCF₁ / (Ke − g)
Two-stage: Σ FCFt/(1+r)^t + TV/(1+r)^n
Synergy = PV(cost saves) + PV(rev uplift) − Integration
Max bid = Stand-alone + Synergy
Bootstrapping EPS = Σ earnings / new total shares (illusion)
  `,
  pitfalls:[
    'Stand-alone confused with maximum bid',
    'P/E used without adjusting for marketability/control',
    'Bootstrapping EPS not flagged as accounting illusion',
    'Generic synergy comments without scenario figures (Sep/Dec 2025 examiner)'
  ],
  drills:[
    {
      id:'mna-d1', ref:'Sep/Dec 2021 Q1 · style', marks:18,
      title:'Hammers plc bids for Spurs Analytics',
      scenario:`<b>Hammers plc</b> bids for <b>Spurs Analytics</b>. Target FCFE next yr £18m, growth 4% perpetuity. Target ungeared Ke 11%. Synergies: cost saves £4m p.a. perpetuity. PV of one-off integration £15m. Hammers offers cash £150m + 20m shares at £4.10.`,
      requirement:`(a) Stand-alone value. (b) Maximum bid. (c) Comment on the offer.`,
      answer:
`(a) STAND-ALONE (FCFE perp):
    V = 18 / (0.11 − 0.04) = £257.14m

(b) WITH SYNERGY:
    PV synergy CF = 4 / 0.11 = £36.36m
    Less integration               (15.00)
    Net synergy                    £21.36m
    Max bid = 257.14 + 21.36     = £278.50m

(c) OFFER:
    Cash 150 + shares 20m × £4.10 = 150 + 82 = £232m
    Offer £232m < Stand-alone £257.14m  → REJECT

Mower's checklist:
 • Insufficient: minimum acceptable to target is stand-alone.
 • Cash/share mix: 65/35. Tax/deferral implications.
 • Synergy of £21m exists — Hammers could pay up to £278.5m
   BEFORE destroying shareholder value.
 • Suggest: increase share-exchange ratio OR add an earn-out.

PROFESSIONAL SKILLS:
 • Scepticism: stress-test the synergy figures.
 • Commercial acumen: cultural fit, key-staff retention.
 • Communication: structure as a bid-defence letter.`,
      points:160, tags:['Section A','must-master']
    },
    {
      id:'mna-d2', ref:'Mar/Jun 2023 Q2 · style', marks:10,
      title:'Bootstrapping EPS — boon or smoke?',
      scenario:`Acquirer A: 100m shares, EPS £0.50, P/E 20×, share price £10. Target T: 50m shares, EPS £0.30, P/E 10×, price £3. A offers 1 share for every 4 T shares.`,
      requirement:`(a) Combined EPS post-deal. (b) Comment on whether real value is created.`,
      answer:
`(a) Shares issued by A = 50m / 4 = 12.5m
    Total A shares = 112.5m
    Combined earnings = 100m × 0.50 + 50m × 0.30
                     = 50m + 15m = £65m
    Combined EPS = 65 / 112.5 = £0.578
    A's EPS rose £0.50 → £0.578 (+15.6%)

(b) BOOTSTRAPPING ILLUSION:
    A acquires LOWER-P/E firm using HIGHER-P/E paper.
    Reported EPS rises MECHANICALLY — no real synergy needed.
    Market may re-rate combined firm at a lower blended P/E
    if it sees through the trick → share price could FALL.
    "Real" value only emerges from genuine synergies.

EXAMINER MARKS: stress this is an ACCOUNTING illusion, not
value creation. Cite the P/E gap and the lack of synergy.`,
      points:100, tags:['high-yield','discussion']
    }
  ]
},

/* ====================== 11. FX ====================== */
fx: {
  id:'fx',
  title:'FX Risk Hedging — MMH · Forwards · Futures · Options',
  syllabus:'D · E',
  spursAngle:'A £100m USD-paid transfer fee, payable in three instalments. Should Spurs hedge with MMH, forwards, futures or options? Each has trade-offs.',
  papers:['Sep/Dec 2022 Q2','Mar/Jun 2024 Q1','Sep/Dec 2025 Q1'],
  innov:'<b>2025 angle:</b> Wise/Revolut FX APIs do MMH in milliseconds — but the exam still tests bid/offer side. Get that right and you bank 6 marks.',
  mnemonic:'Bank gives the <b>WORSE</b> rate · MMH RECEIPT: borrow FX, deposit £',
  quickFacts:[
    'Receipt MMH: borrow FX → convert at spot → deposit £',
    'Payment MMH: borrow £ → convert at spot → deposit FX',
    'Bank gives the WORSE rate to us (exporter HIGH $/£; importer LOW)',
    'Forward = exact match · MMH = if no fwd · Futures = liquid + basis',
    'Options = upside kept, premium cost',
    'Receipt of $ → buy £ CALL ( = $ PUT ); Payment in $ → buy £ PUT ( = $ CALL)',
    'Premium FUTURE-VALUED to maturity (× (1 + r·t/12))'
  ],
  notes:`
    <h4>1 · Choose the instrument</h4>
    <table>
      <tr><th>Instrument</th><th>Pro</th><th>Con</th></tr>
      <tr><td>Forward</td><td>Simple, exact match</td><td>Locked — no upside</td></tr>
      <tr><td>MMH</td><td>Mimics forward; if no fwd market</td><td>Borrowing capacity needed</td></tr>
      <tr><td>Futures</td><td>Standardised, liquid</td><td>Basis risk, margin calls</td></tr>
      <tr><td>Options</td><td>Upside kept</td><td>Premium cost</td></tr>
    </table>

    <h4>2 · Money-Market Hedge — 4 steps</h4>
    <p><b>RECEIPT:</b> BORROW the foreign currency now → CONVERT at SPOT → DEPOSIT home currency. Receipt repays the loan.</p>
    <p><b>PAYMENT:</b> BORROW home currency → CONVERT at SPOT → DEPOSIT foreign currency. Deposit pays the supplier.</p>
    <div class="callout"><b>Bid/offer rule:</b> Bank gives the WORSE rate to us. Quote 1.2480-1.2510 → buying $ → 1.2480 (fewer $ per £); selling $ → 1.2510 (fewer £ for us).</div>

    <h4>3 · Currency futures (CME £-futures)</h4>
    <ul>
      <li>Contract size £62,500. Tick = $0.0001 = $6.25.</li>
      <li>UK exporter receiving $ → BUY £ futures.</li>
      <li>UK importer paying $ → SELL £ futures.</li>
      <li>Number of contracts = (USD exposure ÷ futures price) ÷ £62,500. Round.</li>
    </ul>

    <h4>4 · OTC currency options</h4>
    <ul>
      <li><b>Receipt of $</b> — sell $ for £ → buy £ CALL ( = $ PUT).</li>
      <li><b>Payment in $</b> — buy $ with £ → buy £ PUT ( = $ CALL).</li>
      <li>Premium PAID TODAY → adjust to maturity (×(1 + r × t/12)).</li>
      <li>Exercise if option beats spot. Otherwise lapse.</li>
    </ul>
    <div class="warn">Mar/Jun 2024 examiner: "very few candidates recognised the swap rate would only account for a proportion of the cash". Read carefully.</div>

    <h4>5 · Predicting future spot — PPP & IRP</h4>
    <p class="formula">PPP:  F = S × (1 + i_counter)/(1 + i_base)
IRP:  F = S × (1 + r_counter)/(1 + r_base)</p>

    <h4>6 · Currency swaps</h4>
    <p>Two parties exchange capital + interest in different currencies. Swap principal at spot today, exchange interest, reverse principal at SAME spot at maturity.</p>
    <p>Why? Each party borrows cheaper in its OWN currency, then swaps to get the currency it actually needs.</p>

    <h4>7 · Exchanges vs OTC</h4>
    <table>
      <tr><th>Exchange</th><th>OTC</th></tr>
      <tr><td>Standard contracts, central CCP, daily margin, deep liquidity</td><td>Bespoke, bilateral, counterparty risk, custom match</td></tr>
      <tr><td>Futures, listed options</td><td>Forwards, swaps, OTC options</td></tr>
    </table>

    <h4>8 · Discussion marks</h4>
    <ul>
      <li>Compare net £ outcome of each method.</li>
      <li>Comment on certainty vs flexibility vs cost.</li>
      <li>Discuss basis risk for futures, counterparty risk for OTC.</li>
      <li>Recommend with reason — never sit on the fence.</li>
    </ul>
  `,
  formulas:`
MMH receipt:
  Borrow_FX = Receipt / (1 + r_FX × t)
  £_now = Borrow_FX ÷ Spot_unfavourable
  £_at_t = £_now × (1 + r_£_dep × t)

Futures price ≈ Spot × (1 + r_home)/(1 + r_foreign)
Hedge contracts = round(exposure ÷ size ÷ price)
Premium FV = Premium × (1 + r × t/12)
PPP forward = Spot × (1 + i_c)/(1 + i_b)
  `,
  pitfalls:[
    'Wrong side of bid/offer (bank gives the worse rate)',
    'Premium NOT future-valued',
    'Wrong type of option (call vs put)',
    'No comparison to unhedged + recommendation',
    'Forgetting basis risk discussion for futures'
  ],
  examples:[
    {title:'MMH £ from $5m', body:'Spot 1.2480-1.2510. US borrow 4.20%. £ deposit 4.80%. 3 mo.\n Borrow $: 5,000,000/1.0105 = $4,948,046\n Convert at 1.2510: £3,955,272\n Deposit at 4.80%/4 = 1.20%: £4,002,735'}
  ],
  drills:[
    {
      id:'fx-d1', ref:'Sep/Dec 2022 Q2 · style', marks:14,
      title:'$5m receipt — MMH vs forward vs option',
      scenario:`Spurs merch arm expects <b>US$5,000,000</b> in 3 months. Spot $/£ 1.2480-1.2510. 3-mo forward 1.2520-1.2560. US$ borrow 4.20% / deposit 3.60%. £ borrow 5.40% / deposit 4.80%. OTC <b>£ call / $ put</b> at strike £/$ 0.8000, premium £0.012/$1, contract size $125,000.`,
      requirement:`(a) £ outcome under each method. (b) Recommend.`,
      answer:
`(a)(i) FORWARD:
   Sell $ → forward bid (worse): 1.2560
   £ = 5,000,000 / 1.2560 = £3,980,892

(a)(ii) MMH:
   Borrow $ now PV: 5m / (1 + 0.042×3/12) = 5m/1.0105 = $4,948,046
   Convert at spot bid 1.2510: £ = 4,948,046/1.2510 = £3,955,272
   Deposit at 4.80%×3/12 = 1.20%: × 1.0120 = £4,002,735

(a)(iii) OTC OPTION:
   Contracts = 5m / 125k = 40
   Premium = 40 × 125k × £0.012 = £60,000 today
   FV at £ borrow 5.40%×3/12 = 1.35%: × 1.0135 = £60,810

   IF spot $/£ > 1.2500 (£ stronger):
     Exercise → 5m × 0.80 = £4,000,000
     − premium FV £60,810 = £3,939,190
   IF spot < 1.2500 (£ weaker, $ stronger):
     Lapse, sell $ at spot. Better than option floor.

(b) RANKING:
   MMH         £4,002,735  ★ winner if rates stable
   Forward     £3,980,892
   Option floor£3,939,190  but UPSIDE preserved if $ strengthens

   Recommend MMH for certainty + best locked rate.
   Recommend OPTION if there's a reasonable view $ may
   weaken further (spot < 1.2500).

EXAMINER POINTS:
 • Bid/offer side correct = 4 easy marks
 • Adjust premium to FV — half of candidates forget
 • State recommendation, not just calculations`,
      points:160, tags:['Section A','high-yield','must-master']
    },
    {
      id:'fx-d2', ref:'Sep/Dec 2025 Q1 · style', marks:8,
      title:'Quick: which side of bid/offer?',
      scenario:`Quote $/£ = 1.3010 - 1.3050. (a) UK importer pays $1m. (b) UK exporter receives $1m.`,
      requirement:`State the rate the bank uses and £ amount for each.`,
      answer:
`(a) IMPORTER buys $ with £:
    Bank gives WORSE rate = LOW $/£ = 1.3010
    £ needed = 1,000,000 / 1.3010 = £768,640

(b) EXPORTER sells $ for £:
    Bank gives WORSE rate = HIGH $/£ = 1.3050
    £ received = 1,000,000 / 1.3050 = £766,284

→ Bank's spread = £2,356

MOWER'S TRICK: "The bank always wins. We always lose."
Pick the side that's WORSE for us.`,
      points:60, tags:['must-know','quick']
    }
  ]
},

/* ====================== 12. IR ====================== */
ir: {
  id:'ir',
  title:'Interest Rate Hedging — FRA · Swap · Futures · Options · Greeks',
  syllabus:'D · E',
  spursAngle:'Spurs refinance £180m of stadium debt. Lock cost via swap, hedge short-term exposure via FRA, cap with collar.',
  papers:['Sep/Dec 2023 Q2','Mar/Jun 2022 Q1','Mar/Jun 2025 Q3'],
  innov:'<b>2025 angle:</b> Smart-contract FRAs settle on-chain. AI swap-pricing engines quote in milliseconds. Logic still examinable: <b>QSD, side of bid/offer, tax</b>.',
  mnemonic:'<b>Borrowers SELL</b> futures · <b>Borrowers BUY</b> FRA at OFFER',
  quickFacts:[
    'FRA settle = (LIBOR − FRA) × N × (days/360)',
    'Borrower buys FRA at OFFER (higher) rate',
    'QSD = | fixed gap − float gap |',
    'STIR future price = 100 − rate(%)',
    'Tick value (£500k 3-mo) = £12.50',
    'BORROWER fears rate UP → SELL futures (price falls when rate rises)',
    'Collar: BUY put + SELL call → cheaper hedge but limited upside'
  ],
  notes:`
    <h4>1 · Quick map</h4>
    <ul>
      <li><b>FRA</b> — OTC, locks short-term rate. Buyer = borrower.</li>
      <li><b>Future</b> — exchange-traded, daily margined. £500k STIR.</li>
      <li><b>Option on future</b> — caps cost, walk if rate moves favourably.</li>
      <li><b>Swap</b> — OTC, exchange fixed/floating multi-year.</li>
      <li><b>Collar</b> — combo for cheaper hedge with limited upside.</li>
    </ul>

    <h4>2 · FRA settlement</h4>
    <p class="formula">Settlement = (Reference rate − FRA rate) × Notional × days/360</p>
    <ul>
      <li>BORROWER buys FRA at OFFER (higher).</li>
      <li>If LIBOR &gt; FRA → borrower RECEIVES (offsets higher loan cost).</li>
      <li>If LIBOR &lt; FRA → borrower PAYS the FRA (offsets cheaper loan).</li>
      <li>Effective borrowing cost = FRA rate + lender's margin.</li>
    </ul>

    <h4>3 · IR swap — Quality Spread Differential (QSD)</h4>
    <p>Two firms with different credit standings can both gain. QSD = |fixed gap − float gap|. After bank fee, share remainder.</p>
    <p class="formula">1) Fixed gap = B's fixed − A's fixed
2) Float gap = B's float − A's float
3) QSD = | Fixed − Float |
4) Each saves QSD/2 (after fees)</p>
    <div class="callout">Comparative-advantage: firm with bigger ABSOLUTE fixed advantage borrows fixed; the other floats. Then they swap.</div>

    <h4>4 · Interest rate futures</h4>
    <ul>
      <li>Price = 100 − rate. e.g. 95.20 = 4.80%.</li>
      <li>BORROWER fears rate UP → SELL futures.</li>
      <li>DEPOSITOR fears rate DOWN → BUY futures.</li>
      <li>Tick = 0.01 → £12.50 on £500k STIR (3-mo basis).</li>
      <li>Contracts = (Loan/£500k) × (loan months / 3).</li>
    </ul>

    <h4>5 · Currency swaps (recap)</h4>
    <p>Swap capital today at spot. Exchange interest. Reverse principal at maturity at SAME spot. Each gets the currency it actually needs at the OTHER's lower rate.</p>

    <h4>6 · Interest-rate options & collars</h4>
    <ul>
      <li><b>Borrower (rates UP feared):</b> BUY PUT on futures (right to sell).</li>
      <li><b>Lender (rates DOWN feared):</b> BUY CALL on futures (right to buy).</li>
      <li><b>Borrower COLLAR:</b> BUY put (cap on rates) + SELL call (give up gains if rates fall too far). Cheaper but limited upside.</li>
      <li><b>Lender COLLAR:</b> BUY call (floor) + SELL put. Same logic, opposite direction.</li>
    </ul>

    <h4>7 · The Greeks (sensitivity)</h4>
    <table>
      <tr><th>Greek</th><th>Meaning</th></tr>
      <tr><td>DELTA</td><td>ΔOption / ΔUnderlying. Calls 0→1, puts 0→−1.</td></tr>
      <tr><td>GAMMA</td><td>ΔDelta / ΔUnderlying. Highest at-the-money.</td></tr>
      <tr><td>THETA</td><td>Time decay. Negative for long options.</td></tr>
      <tr><td>VEGA</td><td>Sensitivity to volatility. Long option = long vega.</td></tr>
      <tr><td>RHO</td><td>Sensitivity to risk-free rate.</td></tr>
    </table>

    <h4>8 · Common pitfalls</h4>
    <ul>
      <li>Annualised rate not adjusted for partial year (÷4 for 3-mo).</li>
      <li>QSD direction wrong — pick comparative advantage rigorously.</li>
      <li>Swap diagram missing: draw the arrows. Free 2 marks.</li>
      <li>Forgetting basis decay (linear from start to expiry).</li>
    </ul>
  `,
  formulas:`
FRA settle = (LIBOR − FRA) × N × (days/360)
QSD = | fixed_gap − float_gap |
Each saves (QSD − fee) / 2
Future price = 100 − rate(%)
STIR tick (£500k, 3-mo) = £12.50
Contracts = (Loan/Standard size) × (period/3 months)
Basis = Future − (100 − Spot rate)  → decays linearly to 0 at expiry
  `,
  pitfalls:[
    'Borrower bought FRA at BID (should be OFFER, the higher)',
    'Annual rate not adjusted for partial year (× n/12)',
    'QSD direction wrong — pick comparative advantage carefully',
    'Swap diagram missing — easy 2 marks lost'
  ],
  examples:[
    {title:'FRA both scenarios', body:'£10m loan, 3v9 FRA bought at 4.90% (offer). Spread 80bp.\n Case A LIBOR 5.50%: receive (5.50−4.90)×10m×6/12 = £30k; loan int 315k → net 285k → 5.70%\n Case B LIBOR 4.20%: pay (4.90−4.20)×10m×6/12 = £35k; loan int 250k → net 285k → 5.70%\n Locks 5.70% effective.'},
    {title:'STIR hedge', body:'£20m × 3mo loan in 4mo. Sell 40 contracts at 95.40 (4.60%). LIBOR settles 5.10% (future 94.90).\n Profit = 50 ticks × £12.50 × 40 = £25k\n Loan cost = 20m × 5.10% × 3/12 = £255k\n Net = £230k = effective 4.60% (locked at 95.40 future).'}
  ],
  drills:[
    {
      id:'ir-d1', ref:'Mar/Jun 2022 Q1 · style', marks:14,
      title:'Two-party swap with QSD',
      scenario:`<b>Co A</b> can borrow fixed 6.0% or float LIBOR+0.5%. <b>Co B</b> can borrow fixed 7.5% or float LIBOR+1.5%. A wants float, B wants fixed. Bank fee 0.10% (split equally). Share remaining gain equally.`,
      requirement:`Design the swap. Show each company's effective rate.`,
      answer:
`STEP 1 — QSD:
  Fixed gap = 7.5 − 6.0 = 1.50%
  Float gap = 1.5 − 0.5 = 1.00%
  QSD = 0.50%

STEP 2 — Net of bank 0.10%:
  Net gain = 0.50 − 0.10 = 0.40% → 0.20% each

STEP 3 — Borrow externally per advantage:
  A (fixed advantage) borrows FIXED 6.0%
  B (float advantage)  borrows FLOATING LIBOR+1.5%

STEP 4 — Swap (one design):
  A pays bank LIBOR; receives 6.0% fixed
  B pays bank 7.30% fixed; receives LIBOR

STEP 5 — Effective rates:
  A's effective floating = (LIBOR + 0.5) − 0.20 = LIBOR + 0.30%
  B's effective fixed   = 7.50 − 0.20 = 7.30%
  Bank earns 0.10%

DRAW THE DIAGRAM in the answer (boxes for A, B, bank; arrows
labelled with rates). Free 2 marks.

PROFESSIONAL SKILLS:
 • Counterparty credit risk on the swap (require ISDA + CSA).
 • Document the swap clearly (basis, payment dates).`,
      points:140, tags:['QSD','must-master']
    },
    {
      id:'ir-d2', ref:'Sep/Dec 2023 Q2 · style', marks:14,
      title:'£10m loan in 3 mo for 6 mo — FRA 3v9',
      scenario:`Spurs draw £10m in 3 months for 6 months at LIBOR + 80bp. Bank quotes <b>3v9 FRA at 4.85% – 4.90%</b>. Forecast LIBOR in 3 mo: (a) 5.50%, (b) 4.20%.`,
      requirement:`Compute effective borrowing rate via the FRA in each scenario.`,
      answer:
`Borrower buys FRA at OFFER 4.90%.

CASE (a) LIBOR = 5.50%
  FRA receipt = (5.50 − 4.90) × £10m × 6/12 = £30,000
  Loan interest = (5.50 + 0.80) × £10m × 6/12 = £315,000
  Net cost = 315 − 30 = £285,000
  Effective = 285k / 10m × 12/6 = 5.70%

CASE (b) LIBOR = 4.20%
  FRA payment = (4.90 − 4.20) × £10m × 6/12 = £35,000
  Loan interest = (4.20 + 0.80) × £10m × 6/12 = £250,000
  Net cost = 250 + 35 = £285,000
  Effective = 5.70%

CONCLUSION: FRA locks effective cost = 4.90% + 0.80% = 5.70%.

KEY: borrower BUYS at OFFER (higher) rate. Settlement on the
DIFFERENCE — principal does NOT change hands.

PROFESSIONAL SKILLS:
 • Comm: state both scenarios in plain English.
 • Comm acumen: alternative — futures or swap if loan > 1yr.`,
      points:140, tags:['must-know','core']
    }
  ]
}

};

/* ============================================================
   NEWS FLASHES — TimBoi's Academy news desk
   ============================================================ */
const NEWS = [
  {tag:'IR SWAPS · 2024', title:'Premier League club swaps £180m of stadium debt',
   body:'A top-six club refinanced via a 7-yr receive-floating, pay-fixed swap to lock servicing costs after BoE rate volatility. Classic QSD logic.',
   link:'AFM angle: Mar/Jun 2022 Q1 — IR swaps & QSD',
   topic:'ir'},
  {tag:'FX RISK · 2024', title:'$200m USD-denominated transfer fee',
   body:'A South-American striker\'s transfer fee was payable in USD over 3 instalments. The selling club used a collar to cap downside without paying full premium.',
   link:'AFM angle: Mar/Jun 2024 Q1 — currency options vs MMH',
   topic:'fx'},
  {tag:'REAL OPTIONS · 2024', title:'AI M&A — paying for optionality',
   body:'A Big Tech acquirer paid 12× revenue for an AI start-up with negative cash flow. Most of the price was the OPTION to scale, not current FCF.',
   link:'AFM angle: Mar/Jun 2024 Q3 — Black-Scholes call as expansion option',
   topic:'real'},
  {tag:'INFLATION & NPV · 2025', title:'Stadium build — energy CPI bites',
   body:'A Champions-League finalist\'s new £900m ground saw construction inflation diverge from headline CPI. Real-vs-nominal modelling decided phasing.',
   link:'AFM angle: Mar/Jun 2023 Q1 — NPV with mixed inflation rates',
   topic:'npv'},
  {tag:'VaR · 2024', title:'IPL franchise auction — bid risk',
   body:'A new IPL franchise modelled bid VaR using historic auction volatility before placing a $1bn ceiling, with stress tests beyond the 95% threshold.',
   link:'AFM angle: Mar/Jun 2023 Q3 — VaR & limitations',
   topic:'risk'},
  {tag:'GREEN FINANCE · 2025', title:'Sustainability-linked loan — APV in action',
   body:'A football club\'s solar-roof project was financed via a sustainability-linked loan at 80bp below the senior facility, conditional on ESG KPIs.',
   link:'AFM angle: Sep/Dec 2023 Q1 — APV with subsidy',
   topic:'apv'},
  {tag:'M&A · 2025', title:'Sports analytics merger — synergy at risk',
   body:'A high-profile sports-data merger announced £20m synergies. 18 months later, only 40% had materialised — culture and IT integration the killer.',
   link:'AFM angle: Sep/Dec 2025 Q3 — barriers to synergy',
   topic:'mna'},
  {tag:'BEHAVIOURAL · 2025', title:'Auction fever — mid-table club overpays',
   body:'A mid-table Premier League club paid 60% above internal valuation to win a midfielder, citing "strategic" reasons. Classic competition + hubris bias.',
   link:'AFM angle: Mar/Jun 2024 Q2 — biases in M&A',
   topic:'behav'},
  {tag:'ISLAMIC · 2025', title:'Gulf-club Sukuk-Ijara stadium financing',
   body:'A Gulf-region football club issued $400m green Sukuk to fund stadium expansion — Sharia-compliant + ESG-aligned.',
   link:'AFM angle: Sep/Dec 2022 Q3 — Islamic finance instruments',
   topic:'islam'},
  {tag:'GOVERNANCE · 2025', title:'Football regulator strengthens fit-and-proper',
   body:'New owner-test rules tighten financial sustainability checks — failure triggers loss of broadcasting share. Trade-off vs distress costs at the fore.',
   link:'AFM angle: Sep/Dec 2024 Q3 — governance & risk',
   topic:'adviser'}
];

/* ============================================================
   FORMULA SHEET — printable index
   ============================================================ */
const FORMULAS = [
  {area:'NPV / Inflation', items:[
    'NPV = Σ CFt/(1+r)^t − Outlay',
    '(1+nominal) = (1+real)(1+inflation)  (Fisher)',
    'Real CF × (1+inflation)^t = nominal CF',
    'TAD (RB) Yr_n = NBV × rate; Bal allow = NBV − scrap']},
  {area:'Cost of Capital', items:[
    'Ke = Rf + β × ERP  (CAPM)',
    'βa = βe × E/(E+D(1−T)) + βd × D(1−T)/(E+D(1−T))',
    'WACC = (E/V)Ke + (D/V)Kd(1−T)',
    'M&M2: Ke_g = Ke_u + (Ke_u−Kd)(D/E)(1−T)',
    'DVM: Ke = D₁/P₀ + g',
    'Iterate WACC if MV equity unknown']},
  {area:'APV', items:[
    'APV = Base NPV + PV(tax shield) + PV(subsidy) − Issue costs',
    'Base NPV @ Ke(u). Side-effects @ Kd.',
    'Tax shield = Interest × T',
    'Subsidy = (rₘ − rₛ) × Loan × (1 − T)']},
  {area:'FX', items:[
    'Forward = Spot × (1 + r_h × t) / (1 + r_f × t)',
    'IRP: F/S = (1+r_h)/(1+r_f) (annual)',
    'PPP: F/S = (1+i_h)/(1+i_f)',
    'MMH receipt: borrow FX → convert spot → deposit £']},
  {area:'IR', items:[
    'FRA settle = (LIBOR − FRA) × N × t',
    'QSD = | fixed_gap − float_gap |',
    'Future price = 100 − rate(%)',
    'STIR tick (£500k, 3-mo) = £12.50',
    'Contracts = (Loan/Std) × (Period/3 months)']},
  {area:'Options (Black-Scholes)', items:[
    'd1 = [ln(Pa/Pe) + (r + σ²/2)t] / (σ√t)',
    'd2 = d1 − σ√t',
    'Call = Pa·N(d1) − Pe·e^(−rt)·N(d2)',
    'Put  = c − Pa + Pe·e^(−rt)']},
  {area:'M&A / Valuation', items:[
    'Stand-alone (perp) = FCF₁ / (Ke − g)',
    'TV = FCF(n+1) / (WACC − g) at year n',
    'FCFF = NOPAT + D&A − Capex − ΔWC',
    'FCFE = FCFF − Int(1−T) − net debt repayment',
    'Max bid = Stand-alone + Synergy − Integration']},
  {area:'Risk / VaR', items:[
    'VaR = V × z × σ',
    'z(95%)=1.645  z(99%)=2.326',
    'T-day VaR = 1-day × √T',
    'MIRR = (TV/Investment)^(1/n) − 1',
    'PI = NPV / Investment',
    'Sharpe = (Rₚ−Rf)/σₚ']},
  {area:'Bonds & Duration', items:[
    'Yield to maturity: solve r so PV = price',
    'Macaulay D = Σ(t·PV(CF)) / Bond Price',
    'Modified D = Macaulay / (1 + y)',
    'Forward yields: (1+s2)² = (1+s1)(1+f)']},
  {area:'Ratios', items:[
    'ROCE = PBIT / Capital Employed',
    'ROE = PAT / Equity',
    'Interest cover = PBIT / Interest',
    'DuPont: ROE = Margin × Turnover × Leverage',
    'Op Margin = PBIT/Sales; Net Margin = PAT/Sales']}
];

/* ============================================================
   EXAM SKILLS (Mower-inspired) — unchanged
   ============================================================ */
const EXAM_SKILLS = [
  {title:'Read the requirement like a detective', body:'Underline COMMAND words: <b>Calculate</b>, <b>Evaluate</b>, <b>Discuss</b>, <b>Recommend</b>, <b>Advise</b>. Each carries different weight.', tip:'Spend 2 mins reading every Section A requirement BEFORE looking at the data.'},
  {title:'1.8 minutes per mark', body:'Total exam = 195 mins for 100 marks (3hr 15). Including 15 min reading. A 25-mark question = 45 mins MAX. When time is up, MOVE.', tip:'Set a per-question alarm. Mower: "persistence pays off as much as knowledge".'},
  {title:'50/50 split — calc & commentary', body:'Roughly half marks are calculations, half are explanation, application & professional skills. Strong narrative compensates for minor computational errors.', tip:'Always allocate time for the discussion. Even if you didn\'t finish the maths.'},
  {title:'APPLICATION — use the company name', body:'Generic textbook answers FAIL. Use the company name. Quote specific figures. Mar/Jun 2024 examiner: "responses to discussion requirements were handled less well — too generic".', tip:'After every paragraph, ask: "Could this be cut-and-pasted to ANY question?" If yes — rewrite.'},
  {title:'Professional skills (20% of marks)', body:'Four skills: <b>Communication</b>, <b>Analysis & Evaluation</b>, <b>Scepticism</b>, <b>Commercial Acumen</b>. Each has 2–3 marks per question.', tip:'Add one bullet per skill at the end of every long answer. Tie to scenario.'},
  {title:'ESG marks (Sep/Dec 2025+)', body:'Don\'t define ESG. State a SPECIFIC issue from the scenario, recommend a FEASIBLE action, link to financial / reputational outcome.', tip:'ESG = scenario + action + outcome. 3 sentences = 3 marks.'},
  {title:'Wide brushstrokes, then detail', body:'Open every long answer with a 2-line summary of conclusion. Then build the calc / argument.', tip:'Lead with the answer. Justify after.'},
  {title:'Show methodology even if numbers wrong', body:'Most marks are for METHOD. A wrong final answer with clear method earns 70%+ of the marks; a correct number with no working can lose marks for "ghost numbers".', tip:'Show formulas. Reference workings (W1, W2). Use clear table layout.'},
  {title:'Don\'t waste time on one question', body:'If stuck for 5 minutes — move on. The marginal mark on a fresh question is much higher than the next mark on a stuck question.', tip:'Mower: "the worst exam mistake is camping". Skip and return.'},
  {title:'150–200 hours of study', body:'AFM is not memorisation — it\'s pattern recognition. Drill past papers. The more papers you do, the faster you spot the question type.', tip:'Target 8 full mocks before exam day. Mark them yourself with the model answer.'},
  {title:'Active learning > passive reading', body:'Re-explain each topic out loud in your own words. If you stumble, you don\'t know it. Test, don\'t re-read.', tip:'Use the "Coach" button on every page. It pushes you on weak areas.'},
  {title:'Mock under timed conditions — every week', body:'Sit at your desk, no notes, no pause. Even one full Section A question (50 marks, 90 mins) per week trains pace.', tip:'Mock Mode page = your weekly drill.'}
];

/* Daily plan — 12-week to exam, expanded */
const DAILY_PLAN = [
  {week:'Week 1', focus:'Senior Adviser, Governance, Ratios. Quick wins on structure & risk-management essays.', topics:['adviser']},
  {week:'Week 2', focus:'Behavioural Finance — biases (NAME · EXPLAIN · APPLY). Memorise Roll\'s Hubris.', topics:['behav']},
  {week:'Week 3', focus:'Cost of Capital — WACC, CAPM, ungear/regear. Drill MM2 algebra.', topics:['coc']},
  {week:'Week 4', focus:'NPV with inflation & tax — the 6-step proforma. Two past papers.', topics:['npv']},
  {week:'Week 5', focus:'Risk Analysis & VaR (★). MIRR & Monte Carlo basics.', topics:['risk']},
  {week:'Week 6', focus:'APV. Sep/Dec 2023 Q1 + ungear/regear practice.', topics:['apv']},
  {week:'Week 7', focus:'Real Options — Black-Scholes. Mar/Jun 2024 Q3.', topics:['real']},
  {week:'Week 8', focus:'Business Valuation — FCFF/FCFE/DDM/multiples.', topics:['val']},
  {week:'Week 9', focus:'M&A & Reorganisation. Sep/Dec 2021 Q1.', topics:['mna']},
  {week:'Week 10', focus:'FX hedging — MMH, futures, options. Sep/Dec 2022 Q2.', topics:['fx']},
  {week:'Week 11', focus:'IR risk — FRA, swaps, collars. Mar/Jun 2022 Q1.', topics:['ir']},
  {week:'Week 12', focus:'Mock + Islamic + ESG + final formula scan. Sleep.', topics:['islam','mock','exam']}
];

/* ============================================================
   SEP/DEC 2025 REAL PAST PAPER (Drimpton, Marnhall, Passmore)
   Source: ACCA published sample answers
   ============================================================ */
const SEP_DEC_2025 = {
  Q1: {
    ref:'Sep/Dec 2025 · Q1 · 50 marks',
    title:'Drimpton Co — Edricer subsidiary investment (CTA / ESG)',
    duration: 90 * 60,
    scenario:`<b>Drimpton Co</b> manufactures air-conditioning units in Comptia (currency $). It plans to set up a subsidiary in <b>Edricer</b>, a country in the Central Trade Area (CTA, currency P "peso"). Comptia is NOT in the CTA.
<br><br>
<b>Sales (units, 000s):</b> Yr1 80 · Yr2 110 · Yr3 150 · Yr4 160<br>
<b>Contribution before component costs:</b> P200/unit Yr1, inflated by Edricer inflation thereafter<br>
<b>Component costs from Drimpton:</b> $12/unit Yr1, inflated at Comptia rate. Drimpton earns 60% pre-tax contribution on these.<br>
<b>Fixed costs (P000):</b> 3,200 / 3,360 / 3,562 / 3,776<br>
<b>Investment:</b> P30m. TAD 25% RB, no allowance Yr4 (sale proceeds = TWDV at end of Yr3).<br>
<b>Working capital (P000, start of yr):</b> 1,440 / 2,080 / 3,000 / 3,390. Released end of Yr4.<br>
<b>Inflation:</b> Edricer/CTA 4/5/6/6%. Comptia 7/6/5/4%.<br>
<b>Spot:</b> P6.2000 = $1.<br>
<b>Lost sales</b> from Drimpton = 11% of subsidiary sales × $70 (yr1) inflated at Comptia rate, 40% margin.<br>
<b>Tax:</b> Edricer 20%, Comptia 28% (paid same year). Bi-lateral treaty allows offset.<br>
<b>Cost of capital:</b> 10%.<br>
<b>ESG:</b> Investors split. Some focus on financial; others on full sustainability. Drimpton's board fears product impact (emissions, energy use) and labour-cost differential between Comptia & Edricer.`,
    requirements:[
      {marks:5, text:'<b>(a)</b> Explain the advantages for Drimpton Co of establishing a manufacturing subsidiary within the CTA.'},
      {marks:20, text:'<b>(b)(i)</b> Estimate the NPV of the investment in Edricer.'},
      {marks:6, text:'<b>(b)(ii)</b> Recommend whether on financial grounds the investment should be undertaken and discuss the assumptions made.'},
      {marks:9, text:'<b>(b)(iii)</b> Discuss issues which Drimpton faces concerning ESG and recommend actions to overcome them.'},
      {marks:10, text:'Professional skills — communication, analysis & evaluation, scepticism, commercial acumen.'}
    ],
    model:
`================================================================
PART (a) — ADVANTAGES OF CTA SUBSIDIARY (5 marks) ────────────────
Cost & logistical:
 • Lower labour cost in Edricer; access to local workforce.
 • Distribution costs lower; shorter delivery times.
 • Working-capital cycle shorter.
 • Economies of scale if demand expands.

Single-market access:
 • No physical barriers between CTA countries.
 • Single set of technical/legal standards (lower compliance).
 • No discriminatory practices vs CTA competitors.
 • Stable monetary union → currency & policy alignment.
 • Avoids tariffs/restrictions imposed on non-CTA countries.
 • Builds local contacts & market understanding.

================================================================
PART (b)(i) — NPV (20 marks) ─────────────────────────────────────
W1: Exchange rates via PPP (counter Edricer / base Comptia):
 Yr1: 6.20 × 1.04/1.07 = 6.0262
 Yr2: 6.0262 × 1.05/1.06 = 5.9693
 Yr3: 5.9693 × 1.06/1.05 = 6.0262
 Yr4: 6.0262 × 1.06/1.04 = 6.1421

W2: Local contribution before component costs (P000)
 Yr1: 80 × 200          = 16,000
 Yr2: 110 × 200 × 1.05  = 23,100
 Yr3: 150 × 200 × 1.05·1.06 = 33,390
 Yr4: 160 × 200 × 1.05·1.06² = 37,753

W3: Component sales ($000) → contribution 60%
 Yr1: 80 × 12 = 960   → contrib 576
 Yr2: 110 × 12 × 1.06 = 1,399 → contrib 839
 Yr3: 150 × 12 × 1.06·1.05 = 2,003 → contrib 1,202
 Yr4: 160 × 12 × 1.06·1.05·1.04 = 2,222 → contrib 1,333
 Component PURCHASE in P000 = $ × exchange rate
 → 5,785 / 8,351 / 12,070 / 13,648

W4: TAD on P30m at 25% RB
 Yr1 7,500 (NBV 22,500) · Yr2 5,625 (16,875) · Yr3 4,219 (12,656)
 Yr4: nil (sale = TWDV)

W5: Edricer tax on (CF before tax − TAD) at 20%
 Yr1: PBT 7,015; TAD 7,500; loss 485 → tax credit 97
 Yr2: PBT 11,389; TAD 5,625; profit 5,764 → tax 1,153
 Yr3: PBT 17,758; TAD 4,219; profit 13,539 → tax 2,708
 Yr4: PBT 20,329; TAD 0 → tax 4,066

W6: Comptia additional tax on profits (8% net of treaty)
 Convert taxable to $; apply 8%:
 Yr1 6 (credit) · Yr2 (77) · Yr3 (180) · Yr4 (265)

W7: Lost contribution to Drimpton ($000)
 Per unit margin = $70 × 0.40 = $28
 Volume lost = 11% × subsidiary sales
 Yr1 80 × 28 × 0.11 = 246; ·1.06 → 359; ·1.05 → 514; ·1.04 → 570
 Tax saving on lost contribution at 28%: 69 / 101 / 144 / 160

PROJECT NET CASH FLOWS (P000 → $000 via exchange rate)
 Yr0  $-5,071
 Yr1  +1,318
 Yr2  +1,830
 Yr3  +2,748
 Yr4  +5,545

DISCOUNT @ 10%:
 PV = -5,071 + 1,198 + 1,512 + 2,064 + 3,787
    = +$3,490 ($000)

NPV = +$3,490,000 → POSITIVE → ACCEPT (subject to ESG/scenario)

================================================================
PART (b)(ii) — RECOMMENDATION & ASSUMPTIONS (6 marks) ─────────────
Recommend ACCEPT financial grounds; conduct scenario analysis on
longer time horizon and different ESG policies.

Assumptions to flag:
 • Sales doubling Yr1→Yr4 — depends on CTA demand & competitive position.
 • Contribution margin given (no Comptia comparison provided).
 • Cost of capital — assumes business risk = current; country risk?
 • Realisable value = TWDV — may not reflect commercial reality.
 • Subsidiary likely to continue past Yr4 (Yr4 sales still rising).
 • PPP holds in shorter term (often fails — interest rates, sentiment).
 • Tax rates & bi-lateral treaty stable.

→ Recommend SENSITIVITY ANALYSIS on key drivers.

================================================================
PART (b)(iii) — ESG ISSUES & ACTIONS (9 marks) ───────────────────
ISSUES:
 1) Investor conflict — some focus on financials, others on
    sustainability. Hard to reconcile. Risk of dis-investment.
 2) Cost impact — if same wage policy applied in Edricer
    (better-than-average), cost saving rationale weakens.
 3) Future regulation — CTA may tighten emissions rules.
 4) Existential threat — air-con units cause emissions;
    alternative cooling tech may erode demand.

ACTIONS:
 • Board to formulate consistent business-wide ESG plan;
   disclose objectives in external reports.
 • Consult with investors & stakeholders (governance pillar).
 • Pay above-average Edricer wage (still cheaper than Comptia);
   provide training/benefits — social pillar.
 • Source components locally in CTA where possible to cut
   transport emissions.
 • Differentiate by redesigning units for lower energy use.
 • Long-term — diversify into more sustainable cooling tech.

================================================================
PROFESSIONAL SKILLS (10 marks) ────────────────────────────────────
 • Communication: report format, exec summary, recommendation.
 • Analysis & evaluation: NPV calc + scenario hooks.
 • Scepticism: PPP holding for 4 yrs; sales doubling; ESG cost.
 • Commercial acumen: CTA strategic fit; differentiation strategy.

================================================================
HEADLINE: ACCEPT, NPV +$3.49m, conditional on ESG strategy + scenario tests.
================================================================`
  },
  Q2: {
    ref:'Sep/Dec 2025 · Q2 · 25 marks',
    title:'Halstock Co + Marnhall Co — fitness-clubs M&A',
    duration: 45 * 60,
    scenario:`<b>Halstock Co</b> (high-price/quality fitness clubs) plans to acquire <b>Marnhall Co</b> (lower-price gym chain owned 90% by Olympic medal-winner Gerd Marnhall). Halstock equity MV $210m. Marnhall valued at $145.8m (FCF growth 5%).
<br><br>
Combined revenue forecast ($m): Yr1 230 · Yr2 242 · Yr3 255 · Yr4 269 (Yr5 onward = Yr4).
Post-tax operating CFs = 22% of revenue. Additional non-current asset investment $7.5m at end Yr1; then $0.45 per $1 revenue increase Yr2-4. Yr5+ same as Yr4.
PV of post-tax revenue & cost synergies = $18.6m.
Post-acquisition cost of capital 11%; target D/E 15:85. Cash offer $160m for Marnhall equity. Halstock shareholders expect ≥15% gain.`,
    requirements:[
      {marks:9, text:'<b>(a)</b> Calculate the % gain in Halstock\'s shares with and without expected synergies.'},
      {marks:5, text:'<b>(b)</b> Discuss concerns NEDs may raise about the calculations.'},
      {marks:6, text:'<b>(c)</b> Recommend actions to overcome the barriers to synergy identified by the chair.'},
      {marks:5, text:'Professional skills — analysis, scepticism, commercial acumen.'}
    ],
    model:
`================================================================
PART (a) — % GAIN IN HALSTOCK SHARES (9 marks) ───────────────────
COMBINED FCF FORECAST ($m):
 Yr  Rev  Op CF (22%)  Reinv      FCF
  1  230    50.6       (7.5)     43.1
  2  242    53.2       (5.4)     47.8
  3  255    56.1       (5.9)     50.2
  4  269    59.2       (6.3)     52.9
  5+ 269    59.2       (6.3)     52.9 perpetuity

DF 11% yrs 1-4: 0.901 / 0.812 / 0.731 / 0.659
TV factor yr 5+: (1/0.11) − 3.102 = 5.989

PV explicit:  38.8 + 38.8 + 36.7 + 34.9 = 149.2
PV TV (yr5+): 52.9 × 5.989 = 316.8
Total combined enterprise value = $466.0m

WITH synergies: 466.0 + 18.6 = $484.6m
Equity value (85%): 484.6 × 0.85 = $411.9m
Additional value created = 411.9 − 145.8 − 210.0 = $56.1m
Gain to Marnhall holders = $160 − $145.8 = $14.2m
Gain to Halstock holders = 56.1 − 14.2 = $41.9m
% gain on $210m = 41.9 / 210 = 20.0% ✓ (> 15% target)

WITHOUT synergies:
Equity (85%): 466 × 0.85 = $396.1m
Additional value = 396.1 − 145.8 − 210 = $40.3m
Halstock gain = 40.3 − 14.2 = $26.1m
% gain = 26.1 / 210 = 12.4% (BELOW 15% target)

================================================================
PART (b) — NED CONCERNS (5 marks) ────────────────────────────────
 • 5% growth rate doubtful — Marnhall has falling satisfaction.
 • Combined revenue growth assumes Marnhall club price rises;
   chair fears price-sensitive customers walk.
 • 22% margin (Halstock's current) hard to maintain with
   Marnhall integration (better-paid staff).
 • Reinvestment may UNDERSTATE need at Marnhall clubs.
 • Equity value depends on 15:85 gearing actually being achieved.
 • Synergies may not materialise — knowledge-sharing hard to value.

================================================================
PART (c) — OVERCOME BARRIERS TO SYNERGY (6 marks) ────────────────
1) Decide on Gerd's role — short-term involvement may help
   transition, but entrench old ways. Use as marketing figurehead.
2) Establish clear integration plan — appoint senior member
   accountable; flexible if staff issues emerge.
3) Marketing — sell upgrade to Marnhall customers; maintain
   fee structure short-term to keep them; reassure Halstock base.
4) HR audit — assess Marnhall staff quality; identify leaders;
   training programme to align with Halstock service standards.
5) Team-working culture — second staff between clubs; combine
   co-located clubs into single facility (saves overhead).
6) Frequent communication — corporate objectives, structure,
   teamwork emphasis to motivate Marnhall employees.

================================================================
PROFESSIONAL SKILLS (5 marks)
 • Analysis: synergy calc both with & without.
 • Scepticism: stress-test growth, margin, gearing assumptions.
 • Commercial acumen: integration plan, marketing strategy.
================================================================`
  },
  Q3: {
    ref:'Sep/Dec 2025 · Q3 · 25 marks',
    title:'Passmore Co — R202m receivable hedge (forward / futures / option)',
    duration: 45 * 60,
    scenario:`<b>Passmore Co</b> (US semiconductors) has just made a major sale in India: 202m rupees (R) on 31 August. Today is 1 February. Considering forward, futures or traded options.
<br><br>
<b>Spot R/$:</b> 69.9547 - 70.2414
<b>7-month forward:</b> 70.5252 - 70.8500
<br><br>
<b>R Futures (R5m, R/$1):</b> March 70.4576 · June 70.6874 · September 70.9550
<br><br>
<b>R Options</b> (R5m, exercise R70.8000/$1, premium US cents per R100):
<br>March: Calls 2.61 / Puts 2.20
<br>June: Calls 2.69 / Puts 2.31
<br>September: Calls 2.97 / Puts 2.42
<br><br>
Assume futures and options mature at month end. Basis decays linearly to zero. No basis risk. Options are exercised.`,
    requirements:[
      {marks:12, text:'<b>(a)</b> Recommend an appropriate hedging strategy for R202m receivable. Show all calcs.'},
      {marks:8, text:'<b>(b)</b> Advise on how the treasury department can make a positive financial contribution to Passmore Co.'},
      {marks:5, text:'Professional skills — analysis, scepticism, commercial acumen.'}
    ],
    model:
`================================================================
PART (a) — HEDGING STRATEGY (12 marks) ───────────────────────────
FORWARD CONTRACT
  R/$ forward bid (we sell R/buy $) = 70.85
  $ received = R202m / 70.85 = $2,851,094

FUTURES — sell September R futures
  Contracts = R202m / R5m = 40.4 → 40 contracts
  Today (1 Feb) basis:
    spot 70.2414 − Sep future 70.9550 = −0.7136
  Time to maturity: Feb→Sep = 8 months; receipt 31 Aug → 7 mo
  Unexpired basis on receipt date = −0.7136 × 1/8 = −0.0892
  Lock-in rate = 70.9550 − 0.0892 = 70.8658
  Expected receipt = R202m / 70.8658 = $2,850,458

OPTIONS — buy R September put options at strike R70.8000
  Receiving R, want to sell R/buy $. We hold the option to
  EXERCISE PUT on R = sell R at the strike.
  Contracts = 40 (as above)
  Premium = 40 × R5m × $0.000242 = $48,400
  Outcome (assume exercised):
    R received converted at strike: R5m × 40 / 70.8 = $2,824,859
    Less premium                                       (48,400)
                                                    $2,776,459

COMPARISON ($):
  Forward    2,851,094  ★ HIGHEST
  Futures    2,850,458  (basis of $636 lower)
  Options    2,776,459  (~$75k cost of insurance)

DECISION: forward contract — highest receipt, no basis risk,
100% hedge, simple and tailored.

DISCUSSION:
 • Forward must be fulfilled (rigid).
 • Futures: regulated/CCP, but margin & basis risk.
 • Options: walk-away if R appreciates — but premium cost
   $75k and forecast spot moving the OTHER way (forward
   higher than spot, so R expected to weaken not strengthen).

================================================================
PART (b) — TREASURY VALUE ADDITION (8 marks) ─────────────────────
Up to 2 marks per well-developed point:
1) NETTING — net intercompany receivables/payables; cut
   transaction costs and bank charges.
2) POOLING — pool investment & borrowing in bulk; better
   rates, broader investment access.
3) INTERNAL TRANSFERS — surplus subsidiaries finance cash-needy
   ones, avoiding expensive external markets.
4) TAX MINIMISATION — transfer pricing, intercompany loan
   arrangements, dividend timing; minimise overall tax.
5) ADVICE — investment strategy for short-term funds; advice
   on SPVs & cheaper bond issuance via low-risk cash flows.

================================================================
PROFESSIONAL SKILLS (5 marks)
 • Analysis: 3 instruments costed and ranked.
 • Scepticism: assumption "no basis risk" + "exercised" optimistic.
 • Commercial acumen: forward simplest match for trading firm.
================================================================`
  }
};

/* ============================================================
   HOT TOPICS — Super Secret Sauce (Mar 2026 sitting prep)
   ============================================================ */
const HOT_TOPICS = [
  {tag:'CORE PROFORMA', title:'International investment appraisal', body:'Drimpton (Sep/Dec 25), every year. Sales doubling, PPP forwards, dual-tax with treaty, ESG overlay.', link:'mock.html', why:'Tested 8 of last 10 sittings'},
  {tag:'STAR', title:'Project VaR & multi-period scaling', body:'z(95%)=1.645 · z(99%)=2.326 · √T scaling. State result as a sentence with confidence + horizon.', link:'topic.html?t=risk', why:'Star-topic since Mar/Jun 23'},
  {tag:'REAL OPTIONS', title:'BSOP for delay / expand / abandon / equity-as-call', body:'Pa = PV inflows. Pe = capex. Higher σ → higher option. NPV + Option = total value.', link:'topic.html?t=real', why:'Q3 of every paper since 22'},
  {tag:'BLOCKBUSTER', title:'M&A with synergy + barriers (Halstock/Marnhall style)', body:'Floor = stand-alone. Ceiling = + synergy − integration. Bid sits between. Mention all three.', link:'topic.html?t=mna', why:'Sep/Dec 25 25-marker'},
  {tag:'TREASURY', title:'FX hedge — forward vs futures vs option', body:'Bank gives the WORSE rate. Lock-in rate via basis. Premium FV. Recommend with reasoning.', link:'topic.html?t=fx', why:'Sep/Dec 25 Q3'},
  {tag:'IR', title:'Interest-rate swap / FRA / collar', body:'QSD direction. Borrower buys FRA at OFFER. Collar = buy put + sell call. Draw the diagram.', link:'topic.html?t=ir', why:'June 25 Q3'},
  {tag:'APV', title:'APV with subsidised loan + tax shield', body:'Base @ ungeared Ke. Side-effects @ Kd. Subsidy benefit × (1−T). Issue costs.', link:'topic.html?t=apv', why:'Dec 19, Sep/Dec 23'},
  {tag:'BONDS', title:'Spot yield curve + bond duration', body:'Forward yields from spot: (1+s2)² = (1+s1)(1+f). Macaulay = weighted-avg time. Mod = Mac/(1+y).', link:'topic.html?t=val', why:'Hot topic per Sir Taha'},
  {tag:'BEHAVIOURAL', title:'NAME · EXPLAIN · APPLY for each bias', body:'Anchoring · Hubris (Roll) · Auction fever · Loss aversion. Tie to scenario figures.', link:'topic.html?t=behav', why:'Mar/Jun 24 Q2'},
  {tag:'ESG (NEW)', title:'Issue · Action · Outcome — three sentences', body:'Don\'t define ESG. Pick scenario fact, recommend feasible action, link to financial outcome.', link:'exam-skills.html', why:'Sep/Dec 25 onward — every paper'},
  {tag:'RECONSTRUCTION', title:'Capital reconstruction & SOFP changes', body:'Liquidation priority order. 6-step fairness test. Conejo Co Dec 17 was the template.', link:'topic.html?t=mna', why:'Hot topic'},
  {tag:'ISLAMIC', title:'Sukuk · Murabaha · Mudaraba · Ijara', body:'Asset-backed, no riba. Sukuk holders own cash flows but not assets. Mudaraba = profit share, capital-only loss.', link:'topic.html?t=islam', why:'4-mark discussion easy mark'}
];

/* ============================================================
   64 FREQUENTLY-ASKED THEORY Q&A
   Source: ACCA past-paper sample answers · grouped by category
   Each card: q (question), a (key bullets/marks-earning answer),
   cat (filter category)
   ============================================================ */
const THEORY_QA = [
  // BLACK-SCHOLES & REAL OPTIONS
  {cat:'bsop', q:'How does a DECREASE in each BSOP determinant change a CALL price?', a:'• Security price ↓ → call ↓ (less profitable to exercise)\n• Exercise price ↓ → call ↑ (more profit on exercise)\n• Risk-free rate ↓ → call ↓ (lower opportunity benefit of holding option vs underlying)\n• Time to expiry ↓ → call ↓ (less time premium)\n• Volatility ↓ → call ↓ (less chance of being ITM)'},
  {cat:'bsop', q:'How can BSOP value the EQUITY and DEBT of a company?', a:'Equity = call option on firm assets (Merton). Inputs:\n• Pa = fair value of assets\n• Pe = redemption value of equivalent zero-coupon debt\n• t = time to debt maturity · r = Rf · σ = asset volatility\nDebt value = risk-free bond − put option on assets, OR via put-call parity from equity value.'},
  {cat:'bsop', q:'BSOP assumptions (5)?', a:'• European-style option only\n• Lognormal share-price distribution; continuous trading\n• Unrestricted short-selling\n• No taxes / transaction costs\n• No dividends during option life'},
  {cat:'bsop', q:'How can REAL OPTIONS help NPV decisions?', a:'NPV assumes a now-or-never decision; real options recognise managerial flexibility (delay, expand, abandon, switch). Captures TIME VALUE of flexibility plus intrinsic value. Risks/uncertainties become opportunities — upside captured, downside avoided. Adjusted NPV = traditional NPV + option value.'},
  {cat:'bsop', q:'When do we use BSOP for company valuation (not just options)?', a:'Useful when conventional methods don\'t reflect risk fully — e.g. unlisted companies with unpredictable growth, distressed-debt valuation, valuing equity as a call written by lenders. Five inputs: asset value, debt face, time, volatility, Rf.'},
  {cat:'bsop', q:'High GAMMA on a long call — what does it mean?', a:'Gamma = ΔDelta/ΔUnderlying. Highest when option is at-the-money and close to expiry. So a high-gamma long call is ATM with short time to expiry — very price-sensitive to underlying.'},
  {cat:'bsop', q:'Using DELTA as hedge ratio — how many contracts?', a:'Delta = ΔOption/ΔUnderlying. To hedge $1 of underlying with delta=0.8, need 1/0.8 = 1.25 option contracts. Inverse of delta = hedge ratio.'},

  // ISLAMIC FINANCE
  {cat:'islam', q:'Islamic finance vs conventional — main differences?', a:'• Wealth from legitimate trade & asset-backed investment (no money-from-money)\n• Investment must have social/ethical benefit\n• Risk shared\n• No haram industries\nForbidden: riba (interest), gharar (uncertainty), maysir (speculation).\nKey instruments: Murabaha (cost-plus), Sukuk (asset-backed bond), Ijara (lease), Mudaraba (profit-share), Musharaka (JV).'},
  {cat:'islam', q:'Mudaraba contract — explain.', a:'Partnership: rabb-ul-mal (capital owner) + mudarib (manager). Profits split per agreed ratio. Losses ONLY borne by capital provider; mudarib loses time/effort only. No interest. Bank does NOT interfere with day-to-day management.'},
  {cat:'islam', q:'Salam vs Futures — key differences?', a:'Salam: full payment at start, deliver later. Price/quantity/quality fixed → no uncertainty.\nFutures: marked-to-market daily (uncertain CFs), standard size & expiry (imperfect hedge), only key grades covered.\nSalam Sharia-compliant; futures may breach gharar/maysir rules.'},

  // M&A & RESTRUCTURING
  {cat:'mna', q:'Why may a firm switch from organic growth to acquisition?', a:'• Quicker access to products/markets/tech/expertise\n• Horizontal: eliminate competitor, scale economies\n• Vertical: secure supply/value chain\n• Saturated markets → little room for organic\n• Avoid building expertise from scratch\nBalanced against: integration risk, premium overpayment, culture clash.'},
  {cat:'mna', q:'Three types of synergy?', a:'• REVENUE — cross-sell, pricing power, longer competitive moat (hardest to defend)\n• COST — scale & scope economies, eliminate duplication, bulk purchasing\n• FINANCIAL — lower WACC, internal capital market, debt capacity, tax-loss utilisation'},
  {cat:'mna', q:'Reduce risk that an acquisition fails to add value — what actions?', a:'• Post-audit recent deals (learn from failures)\n• Proper due diligence; reasonable valuation inputs\n• Synergy targets allocated to senior managers; tracked\n• Clear maximum premium; walk-away discipline\n• NEDs scrutinise the rationale\n• Integration plan + retention strategy for key staff\n• Cultural integration recognised, not assumed'},
  {cat:'mna', q:'Sell-off vs MBI — both unbundling, what differs?', a:'BOTH dispose non-core. Sell-off: sell to third party for cash/value; lose control; redeploy proceeds. MBI: sell to external mgmt team who then run it; equity stake; suits situations where new mgmt can run better.'},
  {cat:'mna', q:'Reverse takeover vs IPO — when is each appropriate?', a:'IPO: conventional listing, marketing, prospectus. Reverse takeover: private firm buys listed shell, gains listing without IPO.\nReverse cheaper, faster, certain. But: shell may have hidden liabilities (DD!); no IPO marketing means weaker investor following → harder follow-on raises.\nUse reverse if speed/certainty matter; IPO if raising large capital and want analyst coverage.'},
  {cat:'mna', q:'Why is synergy often OVERESTIMATED?', a:'• Cheap-credit waves drive bidding competition → premiums rise\n• Conflicts of interest — deal advisers earn from completion\n• Management overconfidence; reluctance to admit mistake\n• Agency costs — managers pursue size over value\n• Integration difficulties (culture, systems)\nFixes: synergy ownership, separate evaluation from advisers, due diligence.'},
  {cat:'mna', q:'Mandatory bid · equal treatment · squeeze-out — purpose?', a:'All protect minority shareholders.\nMANDATORY BID: at trigger %, acquirer must offer ALL shareholders the highest price already paid.\nEQUAL TREATMENT: same terms to minority as to controlling sellers.\nSQUEEZE-OUT: at high % (typically 80-95%), acquirer can FORCE remaining minority to sell at fair price → 100% control.'},
  {cat:'mna', q:'Mandatory bid + poison pills + crown jewels — defence effectiveness?', a:'Mandatory bid + equal treatment PROTECT minorities.\nPoison pill: existing holders buy more at discount once bidder hits trigger → makes target costly. Crown jewels: dispose key assets → unattractive.\nLIMITS: shareholders must approve (often refuse → premium foregone); selling crown jewels weakens long-term competitiveness.'},
  {cat:'mna', q:'Sell-off vs Demerger — advantages?', a:'BOTH restructure, may unlock "reverse synergy".\nSell-off: sale to third party → CASH realised, control lost.\nDemerger: NO change in ownership, new co created and assets transferred, original shareholders get shares in both. No cash raised but reduces conglomerate discount.'},
  {cat:'mna', q:'Why do many real-world acquisitions fail?', a:'• Lack of industrial/commercial fit\n• Lack of goal congruence\n• "Cheap" purchases hide turnaround costs\n• Paying too much (premium beyond synergy)\n• Failure to integrate effectively (culture, systems, opposition)'},
  {cat:'mna', q:'Why does synergy exist (sources)?', a:'ECONOMIC EFFICIENCY: scale (fixed costs, equipment), scope (advertising, distribution), vertical control of supply.\nFINANCIAL: lower σ of returns → better credit; tax-loss/shield use.\nMARKET POWER: pricing power post-merger.'},
  {cat:'mna', q:'MBO disposal benefits to PARENT?', a:'• Costs less than third-party sale\n• Quickest method to raise funds\n• Less internal resistance — staff/managers cooperate\n• Retain trading relationship (supplier/customer)\n• Higher price possible — mgmt know value\n• Reputation boost with internal/external stakeholders'},

  // FX HEDGING
  {cat:'fx', q:'Exchange-traded vs OTC options — pros/cons?', a:'Exchange: ready availability, transparent pricing, no negotiation, lower transaction costs, regulated/CCP, American-style.\nOTC: tailored size & expiry, longer terms available, wider product range, but counterparty risk.'},
  {cat:'fx', q:'Forward contract vs OTC option — when to choose?', a:'Forward: no premium upfront, simple, certain budgeting. BUT must be fulfilled (locked even if FX moves your way).\nOption: keeps upside, can lapse. BUT premium cost.\nUse forward if certain about CFs; option if uncertain (tenders, contingent deals).'},
  {cat:'fx', q:'Money-market hedge vs exchange-traded derivatives?', a:'MMH: replicates forward via spot+money markets; cost-effective if good market access; cumbersome to set up & reverse.\nExchange derivatives: rapid, easily closed; standard contract size → imperfect hedge; basis risk; margin requirements; options need premium.'},
  {cat:'fx', q:'Economic exposure — what is it and how managed?', a:'Long-term value change due to unexpected FX moves. Hard to hedge with derivatives (amount unknown). Manage via INTERNATIONAL DIVERSIFICATION of activities, flexibility in production location, raw-material sources, financing.'},
  {cat:'fx', q:'PPP and economic exposure — connection?', a:'PPP says exchange rates adjust to relative inflation differentials → "law of one price" holds long-term. Economic exposure if PPP fails (e.g. permanent shifts due to relative competitive position changes — UK£/US$ over decades). Where PPP fails, cash flows from foreign customers decline materially.'},

  // IR HEDGING / SWAPS
  {cat:'ir', q:'Swaps for IR hedging — pros/cons?', a:'PROS: low transaction cost, fixed swap into floating (or vice versa); OTC tailored size & period; comparative advantage savings; longer than other derivatives.\nCONS: counterparty risk; cannot easily reverse; locked into commitment if rates move favourably.'},
  {cat:'ir', q:'IR swaps & currency swaps — value to corporate finance manager?', a:'• Cheaper finance via comparative advantage (fixed/float gap)\n• FX hedging up to 10 years (longer than forward market)\n• Restructure capital profile without redeeming/reissuing\n• Access markets where direct borrowing not possible (rating)\n• Customisable: amortising, zero-coupon, callable, swaptions'},
  {cat:'ir', q:'Currency swap advantages and risks?', a:'PROS: long-term FX hedging; cheaper than long forwards; arbitrage (relative funding advantage); access to currencies otherwise blocked; restructure debt profile; bypass exchange controls.\nRISKS: counterparty default; political/sovereign; basis risk (floating-floating); FX risk if no hedge underlies.'},
  {cat:'ir', q:'Collar — main advantage and disadvantage vs option?', a:'PRO: lower cost — premium received from sold option offsets premium paid on bought option (often near-zero net cost).\nCON: caps the upside — gain on favourable underlying move is limited or surrendered.'},
  {cat:'ir', q:'Basis risk — what is it?', a:'Basis = futures price − spot price. At maturity = 0. If contract closed early, basis non-zero → imperfect hedge. Magnitude of basis residual = risk you carry.'},

  // BEHAVIOURAL / REPORTING
  {cat:'behav', q:'Triple Bottom Line reporting — what is it?', a:'Quantitative summary of social, financial AND environmental performance. Decisions must grow each pillar without sacrificing the others. Enhances shareholder value if benefits > costs of reporting.'},
  {cat:'behav', q:'Integrated Reporting objectives?', a:'• Improve quality of information for capital providers\n• Cohesive approach to corporate reporting\n• Accountability & stewardship over 6 capitals (financial, manufactured, intellectual, human, social, natural)\n• Support integrated thinking across short/medium/long-term'},
  {cat:'behav', q:'Behavioural finance vs rational decisions?', a:'Sewell: psychology influences finance practitioners and markets. Rational: clear stable preferences, utility maximising, full info. Reality: bounded rationality, emotion, social pressure, info overload. Decisions vary on same facts at different times.'},
  {cat:'behav', q:'Key behavioural-finance biases?', a:'• ANCHORING — irrelevant reference (asking price)\n• GAMBLER\'S FALLACY — past changes future probability\n• HERD — mimicking large group\n• OVERREACTION & AVAILABILITY — over-react to recent news\n• HUBRIS — overconfidence in own ability\n• LOSS AVERSION — pain ~2× pleasure\n• ENTRAPMENT — sunk-cost throw-good-after-bad'},

  // APV / WACC / CAPITAL STRUCTURE
  {cat:'apv', q:'APV vs NPV — when to use APV?', a:'NPV: discount project CFs at single rate (often WACC). APV: separate project (Ke ungeared) and financing side-effects (Kd).\nUse APV when:\n• Capital structure changes due to investment\n• Complex tax / tax holidays\n• Subsidised loans, grants, issue costs\n• Different risk profile from parent'},
  {cat:'apv', q:'Why may APV be preferred over NPV?', a:'Separating CFs allocates the right discount rate to each cash flow risk. Managers see which part of the project creates value (operations vs financing). Subsidies, tax shields and issue costs become explicit. Useful for LBOs, project finance, M&A.'},

  // RISK / PORTFOLIO / VAR / YIELD
  {cat:'risk', q:'Diversified portfolio — what benefit?', a:'Portfolio theory: diversification removes UNSYSTEMATIC (firm-specific) risk; only SYSTEMATIC remains. ~15-20 stocks → ~95% benefit. Companies invest in markets shareholders can\'t (e.g. emerging markets) → adds further diversification beyond shareholder portfolio.'},
  {cat:'risk', q:'Upward-sloping yield curve — reasons?', a:'• Future expectations: short-rates expected to rise → curve slopes up\n• Liquidity preference: investors demand premium for longer maturity\n• Market segmentation / preferred habitat: banks at short end, pension funds at long end → demand-supply mismatch'},
  {cat:'risk', q:'VaR calc — how to interpret?', a:'VaR = z × σ × value (one-tail). z(95%)=1.645, z(99%)=2.326. T-day = 1-day × √T.\nINTERPRET: "We are X% confident losses won\'t exceed £Y over T days." Quote the z-value explicitly.'},
  {cat:'risk', q:'Business risk vs financial risk — relationship?', a:'BUSINESS: from operations (industry, demand, costs).\nFINANCIAL: from capital structure (gearing, FX, IR, liquidity).\nHigh business risk → less appetite for financial risk (and vice versa).\nManage via: mitigation (transfer/hedge/insure) and diversification.'},
  {cat:'risk', q:'Capital rationing — single vs multi-period?', a:'Single period (one constrained year): rank divisible projects by PROFITABILITY INDEX = NPV / Investment. Allocate to highest PI first.\nMulti-period: PI fails (multiple constraints) → use LINEAR PROGRAMMING to maximise total NPV subject to all constraints.'},
  {cat:'risk', q:'Capital Investment Monitoring System — features and benefits?', a:'CIMS sets plan, budget, milestones, risk register. Then monitors actuals vs plan, sets contingency plans.\nBenefits: project meets expectations, completed on time, risks managed proactively, communication device, re-assess if environment changes.'},
  {cat:'risk', q:'Duration as bond price-sensitivity measure?', a:'Macaulay D = weighted average time to receive CFs. Higher coupon = lower D.\nΔP/P = −D × Δi / (1 + i)\nUseful for SMALL changes only (linear approx). Real bond price–yield curve is convex → duration UNDERSTATES gain/overstates loss for big rate moves. Doesn\'t handle yield-curve shape changes.'},

  // TREASURY / GOVERNANCE / GLOBAL
  {cat:'treasury', q:'Treasury staffing — why need experienced staff?', a:'Day-to-day work needs judgement (which lender/instrument); poor decisions = opportunity cost. Monitor international markets, political risk. Set policies aligned with risk appetite. Knowledge of law/tax/accounting saves penalties. Strategic advice on M&A/financing/cost of capital.'},
  {cat:'treasury', q:'IMF role and significance to multinationals?', a:'Bretton Woods 1945. BoP support; conditional loans 3-5yr (austerity reforms). Beneficial: reduces FX volatility, facilitates trade. Costly: short-term deflation, smaller markets. Tensions: capital-flow freedom vs gov\'t money-supply control. Up to 25% quota unconditional; further tranches conditional.'},
  {cat:'treasury', q:'Are derivatives a "time bomb" or hedging tool?', a:'Both views compatible. Hedge: offsets underlying risk. Speculation: increases risk (no underlying need). Buffett worries about speculative use + historic cost accounting hiding losses. IAS 39 fair-value mitigates but volatility remains. Treasury cost-centre = no spec; profit-centre = blurred lines.'},
  {cat:'treasury', q:'Money-laundering — global response?', a:'• International task force on money laundering\n• Recommendations for nation-states to adopt\n• Legislation: criminal justice/law enforcement, financial regulation, international cooperation'},
  {cat:'treasury', q:'Regional vs national vs global treasury function?', a:'Regional vs national: fewer duplicate roles, specialists, pooled cash, located in financial centres.\nRegional vs global: local expertise, time-zone alignment, better local market knowledge, more responsive to subsidiaries.'},
  {cat:'treasury', q:'Borrowing — domestic banks vs Euromarkets?', a:'Domestic: smaller loans, more regulation, wider spreads, often secured, banks scrutinise → signal credit standing.\nEuromarkets: very large unsecured loans, lower regulation/spreads, often slightly cheaper, syndication possible.'},

  // VALUATION / DIVIDENDS
  {cat:'val', q:'Increase in dividends — benefit shareholders?', a:'M&M: irrelevant in perfect markets. Real-world factors:\n• Tax — capital gains often lower rate than dividends\n• Brokerage fees if shares need to be sold for income\n• Internal finance cheaper than external (issue costs)\n• Information asymmetry — dividend signals confidence\n• Investment opportunities: many positive NPV → retain; few → return cash'},
  {cat:'val', q:'Share buyback vs dividend — benefits?', a:'Buyback: shareholder chooses (controls cash & tax timing); reduces share count → EPS rises; positive market signal; share price often rises.\nDividend: forced cash receipt → tax bill, transaction costs to reinvest. Buyback gives flexibility.'},

  // OTHER
  {cat:'misc', q:'Stakeholder recognition — why important in investment decisions?', a:'• Identifies risk/disruption sources (env. groups, legal action)\n• Mendelow matrix: power × interest = influence\n• Identifies conflict areas → resolve disagreement\n• Ethical/reputational case (society can withdraw support)\n• Deep-green view: failing to recognise = bad governance'},
  {cat:'misc', q:'EU free trade area — benefits?', a:'• Remove trade barriers; free movement of capital/labour\n• Common legal & technical standards → lower compliance\n• No discrimination; competitive level playing field\n• Common external tariffs (block non-members)\n• Easier due diligence with logistics across members\n• Access to EU-only grants'},
  {cat:'misc', q:'Credit rating criteria — how assess?', a:'• INDUSTRY RISK — economic resilience, cyclicality\n• EARNINGS PROTECTION — diversity, margins, ROCE\n• FINANCIAL FLEXIBILITY — alternatives available, covenants\n• MANAGEMENT — strategy, succession, qualifications, KPI hits'},
  {cat:'misc', q:'Dark pool networks — what & why?', a:'Anonymous trading away from public scrutiny. Order details hidden until trade done. Reasons: avoid moving share price, lower fees (mid-price, broker-dealer pools).\nCriticism: reduces market efficiency. Defenders: prevents large trades from artificially moving price.'},
  {cat:'misc', q:'Portfolio vs Organisational restructuring?', a:'PORTFOLIO: acquisitions, disposals, divestments, demergers, MBOs/MBIs (which businesses).\nORGANISATIONAL: restructure divisions, processes, governance (how organised).\nBOTH aim to increase performance + value. Diversified shareholders may NOT benefit from conglomerate diversification.'},
  {cat:'misc', q:'BSOP for company valuation — circumstances?', a:'When conventional methods miss risk — unlisted, unpredictable growth, distressed debt. Equity = call on assets (limited liability = walk-away put). Five inputs: assets fair value, debt face (zero-coupon equivalent), time, σ of assets, Rf.'}
];

/* Flat list for global progress meter */
const QUESTIONS = Object.values(TOPICS).flatMap(t => t.drills);
window.TOPICS = TOPICS;
window.QUESTIONS = QUESTIONS;
window.NEWS = NEWS;
window.FORMULAS = FORMULAS;
window.EXAM_SKILLS = EXAM_SKILLS;
window.DAILY_PLAN = DAILY_PLAN;
window.SEP_DEC_2025 = SEP_DEC_2025;
window.HOT_TOPICS = HOT_TOPICS;
window.THEORY_QA = THEORY_QA;
