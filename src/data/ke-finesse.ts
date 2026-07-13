import type { AppIconName } from '@/components/AppIcon';

export type KeFinesseKind = 'direction' | 'knowledge' | 'technique' | 'pressure' | 'repair';

export interface KeFinesseResource {
  id: string;
  title: string;
  kind: KeFinesseKind;
  eyebrow: string;
  description: string;
  merit: string;
  tags: string[];
  to: string;
  cta: string;
  icon: AppIconName;
  minutes?: string;
}

export const KE_FINESSE_KIND_LABELS: Record<KeFinesseKind, string> = {
  direction: 'Direction',
  knowledge: 'Knowledge',
  technique: 'Technique',
  pressure: 'Pressure',
  repair: 'Repair',
};

export const KE_FINESSE_MERITS = [
  {
    icon: 'compass' as const,
    title: 'Less choice. Faster starts.',
    body: 'A learner should not spend the first ten minutes deciding what to study. Leave It To Us chooses the move; Ke Finesse opens the right tool.',
  },
  {
    icon: 'lock' as const,
    title: 'One trusted stack.',
    body: 'Formula support, examiner patterns, technique, papers and repair live in one academy. No tab safari and no conflicting revision systems.',
  },
  {
    icon: 'pen' as const,
    title: 'Outputs beat browsing.',
    body: 'Every room asks for evidence: a recalled rule, a calculation skeleton, a timed response or a named correction—not another hour of passive reading.',
  },
  {
    icon: 'repeat' as const,
    title: 'The loop closes.',
    body: 'Practice is only useful when the leak changes the next session. Debrief and the form guide turn feedback into a scheduled repair.',
  },
];

export const KE_FINESSE_STACK = [
  { n: '01', label: 'Decide', title: 'Let the plan choose', body: 'Use current-sitting facts and your on-device evidence.', to: '/leave-it-to-us', icon: 'sparkles' as const },
  { n: '02', label: 'Retrieve', title: 'Pull it from memory', body: 'Recall the commercial rule before reopening the notes.', to: '/memory-lab', icon: 'brain' as const },
  { n: '03', label: 'Shape', title: 'Build the answer frame', body: 'Set the method, workings and professional voice.', to: '/playbook', icon: 'wand' as const },
  { n: '04', label: 'Pressure', title: 'Put it on the clock', body: 'Produce marks in the CBE workspace, not in your head.', to: '/past-papers', icon: 'stopwatch' as const },
  { n: '05', label: 'Repair', title: 'Name the next rep', body: 'Keep one strength, isolate one leak and schedule the fix.', to: '/debrief/new', icon: 'wrench' as const },
];

export const KE_FINESSE_RESOURCES: KeFinesseResource[] = [
  {
    id: 'leave-it-to-us',
    title: 'Leave It To Us',
    kind: 'direction',
    eyebrow: 'The selector',
    description: 'A current-sitting plan that turns deadlines, exam shape and device evidence into the next three moves.',
    merit: 'Removes decision fatigue before the session starts.',
    tags: ['plan', 'priorities', 'next move', 'September 2026'],
    to: '/leave-it-to-us',
    cta: 'Choose for me',
    icon: 'sparkles',
    minutes: '2 min',
  },
  {
    id: 'diagnostic',
    title: 'Ten-question calibration',
    kind: 'direction',
    eyebrow: 'Evidence first',
    description: 'A short diagnostic that replaces revision guesswork with a useful weakness signal saved on this device.',
    merit: 'Makes the plan personal without accounts or surveillance.',
    tags: ['diagnostic', 'weak areas', 'calibration'],
    to: '/start/diagnostic',
    cta: 'Calibrate',
    icon: 'compass',
    minutes: '10 min',
  },
  {
    id: 'course-map',
    title: 'Five-week course map',
    kind: 'knowledge',
    eyebrow: 'Current sitting',
    description: 'The AFM syllabus arranged into a time-bound route from investment appraisal through treasury and matchday.',
    merit: 'Shows what belongs together instead of presenting a flat content list.',
    tags: ['course', 'syllabus', 'five weeks'],
    to: '/course',
    cta: 'Open the route',
    icon: 'graduation',
  },
  {
    id: 'plain-english',
    title: 'Plain-English concept map',
    kind: 'knowledge',
    eyebrow: 'Commercial meaning',
    description: 'Models and methods explained from the business decision outward, before the technical notation closes in.',
    merit: 'Gives calculations a reason, which makes them easier to retrieve and discuss.',
    tags: ['concepts', 'plain English', 'commercial'],
    to: '/champions-league',
    cta: 'Understand a model',
    icon: 'lightbulb',
  },
  {
    id: 'formula-wall',
    title: 'Formula wall',
    kind: 'knowledge',
    eyebrow: 'Calculation skeletons',
    description: 'A printable reference for the equations, assumptions and working patterns AFM repeatedly demands.',
    merit: 'Turns formula recall into a starting structure, not an isolated memory test.',
    tags: ['formula', 'calculation', 'print'],
    to: '/formulas',
    cta: 'Open formulas',
    icon: 'bars',
  },
  {
    id: 'playbook',
    title: 'Answer playbook',
    kind: 'technique',
    eyebrow: 'Build before writing',
    description: 'Requirement verbs, mark budgets and issue → evidence → impact → action structures for board-ready responses.',
    merit: 'Makes professional judgement repeatable under time pressure.',
    tags: ['answer plan', 'verbs', 'professional skills'],
    to: '/playbook',
    cta: 'Shape the answer',
    icon: 'book',
  },
  {
    id: 'exam-skills',
    title: 'Professional-skills coach',
    kind: 'technique',
    eyebrow: '20 real marks',
    description: 'Train analysis, scepticism, commercial acumen and communication as behaviours inside the response.',
    merit: 'Treats professional skills as scoreable work rather than vague presentation advice.',
    tags: ['professional skills', 'analysis', 'communication'],
    to: '/exam-skills',
    cta: 'Train the voice',
    icon: 'mic',
  },
  {
    id: 'pitfalls',
    title: 'Mark-leak bank',
    kind: 'technique',
    eyebrow: 'Common failures',
    description: 'Examiner and tutor patterns translated into the exact behaviour that prevents each recurring loss.',
    merit: 'Converts warnings into actions that can be rehearsed.',
    tags: ['pitfalls', 'examiner', 'mistakes'],
    to: '/pitfalls',
    cta: 'Repair a trap',
    icon: 'alert',
  },
  {
    id: 'scout',
    title: 'Examiner intelligence',
    kind: 'technique',
    eyebrow: 'Read the game',
    description: 'Capability heatmaps, examiner language and repeat weaknesses condensed into a practical scout report.',
    merit: 'Keeps authoritative feedback close to the work it should change.',
    tags: ['examiner reports', 'patterns', 'heatmap'],
    to: '/scout',
    cta: 'Open the scout report',
    icon: 'binoculars',
  },
  {
    id: 'memory-lab',
    title: 'Memory lab',
    kind: 'pressure',
    eyebrow: 'Retrieval practice',
    description: 'Spaced recall with a choice of FSRS or Leitner grading for models that must survive exam morning.',
    merit: 'Uses desirable difficulty instead of recognition disguised as learning.',
    tags: ['memory', 'FSRS', 'recall'],
    to: '/memory-lab',
    cta: 'Run recall',
    icon: 'brain',
    minutes: '10 min',
  },
  {
    id: 'training',
    title: 'CBE training ground',
    kind: 'pressure',
    eyebrow: 'Produce evidence',
    description: 'Focused drills, mocks and CBE tools for doing the work in the posture the real exam demands.',
    merit: 'Shrinks the gap between knowing AFM and performing AFM.',
    tags: ['CBE', 'practice', 'timed'],
    to: '/training',
    cta: 'Enter training',
    icon: 'laptop',
    minutes: '25 min',
  },
  {
    id: 'past-papers',
    title: 'Full-sitting paper room',
    kind: 'pressure',
    eyebrow: 'Match conditions',
    description: 'Full-sitting and by-question routes with a timer, reader, workspace, review and honest partial-paper labels.',
    merit: 'Turns paper practice into a complete performance cycle.',
    tags: ['past papers', 'full sitting', 'timer'],
    to: '/past-papers',
    cta: 'Choose a sitting',
    icon: 'files',
    minutes: '50–195 min',
  },
  {
    id: 'mock',
    title: 'Mock matchday',
    kind: 'pressure',
    eyebrow: 'No-comfort rep',
    description: 'Brief, sit and report on a mock with the clock and workspace doing the disciplining.',
    merit: 'Creates credible evidence of readiness before the real fixture.',
    tags: ['mock', 'exam conditions', 'readiness'],
    to: '/training/mock',
    cta: 'Brief the mock',
    icon: 'shield',
    minutes: '195 min',
  },
  {
    id: 'debrief',
    title: 'Debrief room',
    kind: 'repair',
    eyebrow: 'Feedback with a job',
    description: 'Record one strength, one leak and one specific next rep while the attempt is still fresh.',
    merit: 'Stops the same mistake from surviving into the next paper.',
    tags: ['debrief', 'reflection', 'next rep'],
    to: '/debrief/new',
    cta: 'Run a debrief',
    icon: 'clipboard',
    minutes: '9 min',
  },
  {
    id: 'form-guide',
    title: 'Form guide',
    kind: 'repair',
    eyebrow: 'Evidence over vibes',
    description: 'See attempts, current form and weak-area evidence without turning progress into vanity metrics.',
    merit: 'Makes the next decision from performance data, not confidence alone.',
    tags: ['progress', 'attempts', 'form'],
    to: '/form-guide',
    cta: 'Inspect the evidence',
    icon: 'chart',
  },
  {
    id: 'study-guide',
    title: 'Source room',
    kind: 'repair',
    eyebrow: 'Authority check',
    description: 'Official syllabus, technical-article and examiner-resource routes kept separate from TimBoi training material.',
    merit: 'Preserves source confidence and makes editorial judgement visible.',
    tags: ['official', 'ACCA', 'sources'],
    to: '/study-guide',
    cta: 'Check the source',
    icon: 'fileCheck',
  },
];

export const KE_FINESSE_TOTALS = {
  resources: KE_FINESSE_RESOURCES.length,
  categories: Object.keys(KE_FINESSE_KIND_LABELS).length,
  stages: KE_FINESSE_STACK.length,
} as const;
