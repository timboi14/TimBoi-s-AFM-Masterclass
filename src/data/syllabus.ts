/** ACCA AFM September 2026–June 2027, verified against official study guide p.6.
 * No year-on-year changes; the previous site grid mislabelled D/E.
 * Topic links indicate related material, not complete outcome coverage.
 * Full source chapters, including D1/D2, are in /study-room.
 */
export interface SyllabusCapability { ref: string; capability: string; tbaTopicId: string | null; drillId: string | null; }
export const AFM_SYLLABUS: SyllabusCapability[] = [
  {
    "ref": "A1",
    "capability": "Role and responsibility of the senior financial executive/advisor",
    "tbaTopicId": "adviser",
    "drillId": "MD1"
  },
  {
    "ref": "A2",
    "capability": "Financial strategy formulation",
    "tbaTopicId": "adviser",
    "drillId": "MD1"
  },
  {
    "ref": "A3",
    "capability": "Corporate environmental, social, governance and ethical issues",
    "tbaTopicId": "adviser",
    "drillId": "MD1"
  },
  {
    "ref": "A4",
    "capability": "Management of international trade and finance",
    "tbaTopicId": "fx",
    "drillId": "MD6"
  },
  {
    "ref": "A5",
    "capability": "Strategic business and financial planning for multinational organisations",
    "tbaTopicId": "fx",
    "drillId": "MD6"
  },
  {
    "ref": "A6",
    "capability": "Dividend policy in multinationals and transfer pricing",
    "tbaTopicId": "adviser",
    "drillId": null
  },
  {
    "ref": "B1",
    "capability": "Discounted cash flow techniques",
    "tbaTopicId": "npv",
    "drillId": "MD3"
  },
  {
    "ref": "B2",
    "capability": "Application of option pricing theory in investment decisions",
    "tbaTopicId": "real",
    "drillId": "MD5"
  },
  {
    "ref": "B3",
    "capability": "Impact of financing on investment decisions and adjusted present values",
    "tbaTopicId": "apv",
    "drillId": "MD4"
  },
  {
    "ref": "B4",
    "capability": "Valuation and the use of free cash flows",
    "tbaTopicId": "val",
    "drillId": "MD9"
  },
  {
    "ref": "B5",
    "capability": "International investment and financing decisions",
    "tbaTopicId": "fx",
    "drillId": "MD6"
  },
  {
    "ref": "C1",
    "capability": "Acquisitions and mergers versus other growth strategies",
    "tbaTopicId": "mna",
    "drillId": "MD8"
  },
  {
    "ref": "C2",
    "capability": "Valuation for acquisitions and mergers",
    "tbaTopicId": "mna",
    "drillId": "MD8"
  },
  {
    "ref": "C3",
    "capability": "Regulatory framework and processes",
    "tbaTopicId": "mna",
    "drillId": "MD8"
  },
  {
    "ref": "C4",
    "capability": "Financing acquisitions and mergers",
    "tbaTopicId": "mna",
    "drillId": "MD8"
  },
  {
    "ref": "D1",
    "capability": "Financial reconstruction",
    "tbaTopicId": null,
    "drillId": null
  },
  {
    "ref": "D2",
    "capability": "Business reorganisation",
    "tbaTopicId": null,
    "drillId": null
  },
  {
    "ref": "E1",
    "capability": "Role of the treasury function in multinationals",
    "tbaTopicId": "risk",
    "drillId": null
  },
  {
    "ref": "E2",
    "capability": "Use of financial derivatives to hedge forex risk",
    "tbaTopicId": "fx",
    "drillId": "MD6"
  },
  {
    "ref": "E3",
    "capability": "Use of financial derivatives to hedge interest rate risk",
    "tbaTopicId": "ir",
    "drillId": "MD7"
  },
  {
    "ref": "F1",
    "capability": "Communication",
    "tbaTopicId": "adviser",
    "drillId": null
  },
  {
    "ref": "F2",
    "capability": "Analysis and evaluation",
    "tbaTopicId": "adviser",
    "drillId": null
  },
  {
    "ref": "F3",
    "capability": "Scepticism",
    "tbaTopicId": "adviser",
    "drillId": null
  },
  {
    "ref": "F4",
    "capability": "Commercial acumen",
    "tbaTopicId": "adviser",
    "drillId": null
  },
  {
    "ref": "G1",
    "capability": "Use technology to access and manipulate information",
    "tbaTopicId": "npv",
    "drillId": null
  },
  {
    "ref": "G2",
    "capability": "Work on response options using available functions and technology",
    "tbaTopicId": "npv",
    "drillId": null
  },
  {
    "ref": "G3",
    "capability": "Navigate windows and screens to amend exam responses",
    "tbaTopicId": "npv",
    "drillId": null
  },
  {
    "ref": "G4",
    "capability": "Present data and information effectively",
    "tbaTopicId": "npv",
    "drillId": null
  }
];
