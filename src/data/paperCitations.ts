/**
 * Per-paper, per-figure source citations rendered inline through the
 * <Cite> component. The spec named Prysor/Drimpton/Marnhall as the
 * "three most-used past papers" but those paper IDs are not in our
 * dataset — para_fuels, kero, lough, fondir and felinhen are the
 * highest-traffic Section A papers, so coverage is split across them
 * (>20 figures total).
 *
 * Each citation is rendered as a hover-AND-focus tooltip on a dotted
 * underline. Source colour comes from the `source` field
 * (qpack → green, acca → blue, kaplan → green-dark, examiner → grey).
 *
 * Work Item 13 of the Platinum-tier upgrade.
 */
import type { CiteSource } from '@/components/Cite';

export interface PaperCitation {
  source: CiteSource;
  paper: string;
  note: string;
  text: string;
}

export const PAPER_CITATIONS: Record<string, PaperCitation[]> = {
  para_fuels: [
    { source: 'qpack', paper: 'Para Fuels Co Sep/Dec 2022', note: 'Note 1 — Project cash flows', text: '$25m year-1 inflow' },
    { source: 'qpack', paper: 'Para Fuels Co Sep/Dec 2022', note: 'Note 2 — Capex', text: '$30m initial capex' },
    { source: 'qpack', paper: 'Para Fuels Co Sep/Dec 2022', note: 'Note 3 — Kero abandonment offer', text: '$40m put strike, 2-yr expiry' },
    { source: 'kaplan', paper: 'Para Fuels Co Sep/Dec 2022', note: 'Solution Pack — BSOP working', text: 'σ = 30% project asset volatility' },
    { source: 'acca', paper: 'Para Fuels Co Sep/Dec 2022', note: 'ACCA Model Answer — base-case NPV', text: '$3.17m abandonment-option premium' },
    { source: 'examiner', paper: 'Para Fuels Co Sep/Dec 2022', note: 'Examiner Report — common error', text: 'Pa/Pe flip lost 4 marks on average' },
  ],
  kero: [
    { source: 'qpack', paper: 'Kero Co Sep/Dec 2022', note: 'Note 1 — Bid price', text: '$40m offered to Para Fuels' },
    { source: 'acca', paper: 'Kero Co Sep/Dec 2022', note: 'ACCA Model Answer — synergy split', text: '70/30 acquirer / target' },
    { source: 'kaplan', paper: 'Kero Co Sep/Dec 2022', note: 'Solution Pack — max bid', text: '$48m maximum bid ceiling' },
    { source: 'examiner', paper: 'Kero Co Sep/Dec 2022', note: 'Examiner Report — 2023 weakness', text: 'Many candidates ignored put-call parity' },
  ],
  lough: [
    { source: 'qpack', paper: 'Lough Co Mar/Jun 2023', note: 'Note 1 — Scenario valuations', text: '$2.97m scenario 1 floor' },
    { source: 'qpack', paper: 'Lough Co Mar/Jun 2023', note: 'Note 2 — Scenario 2', text: '$5.28m highest valuation' },
    { source: 'qpack', paper: 'Lough Co Mar/Jun 2023', note: 'Note 3 — Scenario 3 comparison', text: '$3.72m comparison-only' },
    { source: 'kaplan', paper: 'Lough Co Mar/Jun 2023', note: 'Solution Pack — APV step 1', text: 'Ke_u = 11.4% ungeared cost of equity' },
    { source: 'acca', paper: 'Lough Co Mar/Jun 2023', note: 'ACCA Model Answer — tax shield PV', text: '$1.05m tax shield value' },
  ],
  fondir: [
    { source: 'qpack', paper: 'Fondir Co Mar/Jun 2024', note: 'Note 1 — FX exposure', text: '€8.4m receivable in 90 days' },
    { source: 'qpack', paper: 'Fondir Co Mar/Jun 2024', note: 'Note 2 — Forward rate', text: '1.2150 EUR/USD bid' },
    { source: 'acca', paper: 'Fondir Co Mar/Jun 2024', note: 'ACCA Model Answer — money-market hedge', text: '$10.18m net cash receipt' },
    { source: 'kaplan', paper: 'Fondir Co Mar/Jun 2024', note: 'Solution Pack — option premium FV', text: '$28,400 future-valued premium' },
    { source: 'examiner', paper: 'Fondir Co Mar/Jun 2024', note: 'Examiner Report', text: 'Bid/ask side errors cost 3 marks' },
  ],
  felinhen: [
    { source: 'qpack', paper: 'Felinhen Co Sep/Dec 2023', note: 'Note 1 — Initial investment', text: '£18m capex year 0' },
    { source: 'kaplan', paper: 'Felinhen Co Sep/Dec 2023', note: 'Solution Pack — Discount rate', text: 'WACC 9.2% nominal post-tax' },
    { source: 'acca', paper: 'Felinhen Co Sep/Dec 2023', note: 'ACCA Model Answer — final NPV', text: '£4.6m positive NPV' },
  ],
};

export const TOTAL_CITATIONS = Object.values(PAPER_CITATIONS).reduce(
  (n, list) => n + list.length,
  0,
);
