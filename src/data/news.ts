/**
 * News flashes that link real-world finance to AFM topics.
 * Static editorial items styled like a live feed.
 * Refreshed for the June 2026 sitting.
 * No em dashes anywhere.
 */
export interface NewsItem {
  tag: string;
  title: string;
  body: string;
  topic: string;
  cta: string;
}

export const NEWS: NewsItem[] = [
  {
    tag: 'COURSE',
    title: 'Week 1 of the Resit Course is live: Investment Appraisal',
    body: 'Two guided walkthroughs are unlocked plus the Blackbosca Co self-review (international expansion). Homework due Sunday 3 May 23:59. Use the Course Companion page to track exit criteria as you go.',
    topic: 'npv',
    cta: 'Open Course Companion',
  },
  {
    tag: 'EXAMINER',
    title: 'Sep/Dec 2025 examiner report: candidates still lose marks on Fisher',
    body: 'The latest examiner report flagged that "many candidates mixed real and nominal cash flows" and that scenario figures were not quoted in the recommendation. Lead with the recommendation. State whether you are working real or nominal in W1. Stay there.',
    topic: 'npv',
    cta: 'Open NPV fixture',
  },
  {
    tag: 'M&A',
    title: 'Mega-deal premiums hit 35% as activists circle',
    body: 'Recent mid-cap consumer acquisitions paid 35% premiums while consensus synergy is only 18%. Classic AFM overpayment trap. The board paper must compute MAX BID, identify hubris bias, and recommend an independent due-diligence review.',
    topic: 'mna',
    cta: 'Open M&A fixture',
  },
  {
    tag: 'ESG',
    title: 'Carbon levy now baked into project NPVs',
    body: 'Examiner reports since Sep/Dec 2025 confirm ESG marks require Issue → Action → Outcome with a stakeholder. Generic "be more sustainable" earns ZERO. Quote a £ figure for the carbon cost or abatement capex, link to NPV impact.',
    topic: 'behav',
    cta: 'Open ESG playbook',
  },
  {
    tag: 'FX',
    title: 'GBP/USD swings 6% in 30 days, treasurers reach for collars',
    body: 'Volatility is sending corporate hedgers from forwards to option collars. The exam wants you to compare four hedges in a table (forward, MMH, futures, option), future-value the option premium, and recommend with the residual risk acknowledged.',
    topic: 'fx',
    cta: 'Open FX fixture',
  },
  {
    tag: 'IR',
    title: 'BoE cuts shift the short end down sharply',
    body: 'Yield curve has re-steepened. Floating-rate borrowers are weighing pay-fixed swaps. AFM wants the swap diagram with arrows, the QSD calculation split 50/50 less bank fees, and a recommendation tied to the firm risk appetite.',
    topic: 'ir',
    cta: 'Open IR fixture',
  },
  {
    tag: 'REAL OPTIONS',
    title: 'Tech infra projects model expansion options explicitly',
    body: 'A wave of data-centre projects discloses an "option to expand" in their NPV. AFM exam pattern: map Pa = PV of inflows on exercise, Pe = expansion capex, t = decision date, σ = project volatility. Add option value to the base NPV.',
    topic: 'real',
    cta: 'Open Real Options fixture',
  },
  {
    tag: 'ISLAMIC',
    title: 'Sukuk issuance hits record levels as alternative to bonds',
    body: 'Sovereign and corporate sukuk volumes are up 40% YoY. The exam wants you to map sukuk to its conventional equivalent (asset-backed bond), explain why riba is forbidden, and identify which assumption-break makes a conventional bond non-Sharia compliant.',
    topic: 'islam',
    cta: 'Open Islamic finance fixture',
  },
  {
    tag: 'TREASURY',
    title: 'VaR back in focus after market turbulence',
    body: 'Risk committees are quoting 1-day 99% VaR weekly. Memorise z = 2.326 (one-tail). State the confidence level, the time horizon, and the LIMITATION (silent on tail magnitude beyond the threshold; assumes normality).',
    topic: 'risk',
    cta: 'Open Risk fixture',
  },
];
