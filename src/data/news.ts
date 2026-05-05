/**
 * News flashes that link real-world finance to AFM topics.
 * These are static editorial items styled like a live feed.
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
    tag: 'M&A',
    title: 'Mega-deal premiums under scrutiny again',
    body: 'Activist investors have flagged that recent acquisitions of mid-cap consumer brands paid 35% premiums while consensus synergy is only 18%. Classic case of overpayment risk for the AFM exam, with synergy estimates that need stress-testing before the bid is approved.',
    topic: 'mna',
    cta: 'Open M&A fixture',
  },
  {
    tag: 'ESG',
    title: 'Carbon levy now baked into project NPVs',
    body: 'Latest ACCA examiner reports confirm ESG marks since Sep/Dec 2025 require scenario-specific application. Generic "be more sustainable" answers earn zero. Quote the carbon cost, link to NPV impact, name the stakeholder.',
    topic: 'behav',
    cta: 'Open ESG playbook',
  },
  {
    tag: 'FX',
    title: 'Dollar volatility raises hedge committee meetings',
    body: 'GBP/USD has swung over 6% in 30 days. Treasurers are reaching for option collars rather than forwards. The exam wants you to compare four hedges in a table and recommend, with the premium future-valued and the residual risk acknowledged.',
    topic: 'fx',
    cta: 'Open FX fixture',
  },
  {
    tag: 'IR',
    title: 'Yield curve inverts back to upward sloping',
    body: 'Central-bank cuts shifted the short end down sharply. Treasurers with floating debt are weighing pay-fixed swaps. The AFM exam wants the swap diagram, the QSD calculation, and a recommendation tied to firm risk appetite.',
    topic: 'ir',
    cta: 'Open IR fixture',
  },
];
