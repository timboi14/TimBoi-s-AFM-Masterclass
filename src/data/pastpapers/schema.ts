/** Which file the data was verified against */
export type DataSource =
  | 'Q'  // Question Pack (OCR-verified JPEG pages)
  | 'A'  // ACCA Sample Model Answer (text file verified)
  | 'S'  // Solution Pack (text file verified)
  | 'E'; // Examiner Report only (no numerical data from file)

type SyllabusSection = 'A' | 'B' | 'C' | 'D' | 'E';
export type PaperSection = 'A' | 'B'; // Section A = 50 marks, B = 25 marks
export type TopicCategory = 'inv' | 'hedg' | 'ma'; // investment, hedging, M&A

export interface VerifiedNumber {
  value: string;       // e.g. "$5,716,000" or "14 contracts"
  description: string; // e.g. "NPV of Investment A"
  source: DataSource;
}

export interface MarkingPoint {
  description: string;
  marks: number;
}

export interface QuestionPart {
  label: string;     // e.g. "(a)" or "(b)(i)"
  marks: number;
  requirement: string; // What the question actually asks — plain text, bionic applied at render
  /** Per-mark breakdown of what earns each mark (verbatim from Kaplan marking guide). */
  markingPoints?: MarkingPoint[];
  /** Verbatim ACCA examiner commentary for this specific part. */
  examinerCommentary?: string;
}

/** Optional verbatim scenario exhibit — paper-level, rendered above the step nav when present. */
export interface ScenarioExhibit {
  title: string;
  content: string;
}

export interface ScenarioStep {
  id: string;        // e.g. "company" | "transaction" | "calculations"
  navLabel: string;  // Short label for step nav button, e.g. "1. The company"
  title: string;     // Displayed heading inside the step
  content: string;   // Plain text — bionic applied at render. Can include \n\n for paragraphs.
  warning?: string;  // Optional trap/pitfall box — rendered with amber warning styling
  table?: ScenarioTable; // Optional data table
}

interface ScenarioTable {
  headers: string[];
  rows: string[][];
  highlightLastRow?: boolean; // marks the last row as a total/result row
}

interface SolutionStep {
  stepNumber: number;
  title: string;     // e.g. "Build the cash flow table"
  explanation: string; // Plain text — bionic applied at render
  formula?: string;  // Optional formula block — monospace, not bionic
  verifiedNumbers?: string[]; // Key results confirmed from source files
}

interface ExaminerFeedback {
  didWell: string;     // What the examiner said candidates did correctly
  commonErrors: string; // What the examiner said went wrong
  tutorTip: string;    // Actionable advice for this specific paper
  source: 'E';         // Always E — this data comes from Examiner Reports
}

export interface Paper {
  id: string;                    // slug, e.g. 'para_fuels'
  name: string;                  // e.g. 'Para Fuels Co'
  session: string;               // e.g. 'Sep/Dec 2022'
  paperSection: PaperSection;    // A (50 marks) or B (25 marks)
  totalMarks: 50 | 25;
  syllabusSection: SyllabusSection;
  topics: TopicCategory[];
  tags: string[];                // Display tags e.g. ['Real options', 'NPV', 'BSOP']
  difficulty: 1 | 2 | 3 | 4 | 5;
  primarySource: DataSource;     // Source of scenario data
  scenarioSteps: ScenarioStep[]; // Step-by-step scenario walkthrough
  questionParts: QuestionPart[];
  verifiedNumbers: VerifiedNumber[];
  solutionSteps: SolutionStep[];
  examinerFeedback: ExaminerFeedback;
  /** Optional verbatim Kaplan "key answer tips" callout. */
  keyAnswerTips?: string;
  /** Optional verbatim Kaplan model answer extract (collapsible block on solution tab). */
  modelAnswerText?: string;
  /** Optional verbatim Kaplan scenario exhibits (rendered on scenario tab). */
  exhibits?: ScenarioExhibit[];
}
