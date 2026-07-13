/**
 * Sitting layer over the per-question PAPERS dataset.
 *
 * The ACCA iAssess platform presents a whole exam as ONE assignment: Q1 worth
 * 50 marks (Section A) plus two 25-mark Section B questions, 100 marks, sat in
 * one go. Our source data is stored per question, so this module regroups the
 * 50 questions back into the sittings they were drawn from, numbers them Q1..Qn
 * (Section A always first), and attaches the assignment-level metadata the grid
 * needs (type badge, timing, completeness).
 *
 * Honesty note: not every historic session in the dataset is a full 100-mark
 * paper. Some are partial captures (one or two questions only) and the older
 * pre-September-2018 papers ran four questions / 125 marks. The `format` and
 * `complete` flags carry that so the UI never pretends a partial sitting is the
 * whole exam.
 */
import { PAPERS } from '@/data/pastpapers/papers';
import type { Paper } from '@/data/pastpapers/schema';

export type SittingType = 'PAST EXAM' | 'PRACTICE EXAM' | 'SPECIMEN' | 'MOCK';
export type SittingFormat = 'modern' | 'legacy' | 'partial';

export interface SittingQuestion {
  /** Display number within the sitting, 1-based. Section A is always Q1. */
  no: number;
  /** e.g. "Q1" */
  label: string;
  paper: Paper;
}

export interface Sitting {
  id: string; // slug, e.g. 'sep-dec-2022'
  session: string; // verbatim session string, e.g. 'Sep/Dec 2022'
  title: string; // e.g. 'AFM September/December 2022'
  type: SittingType;
  questions: SittingQuestion[];
  totalMarks: number;
  /** Standard exam timing in minutes (1.95 min per mark, the live AFM rate). */
  timingMinutes: number;
  format: SittingFormat;
  /** True for a standard one-Section-A-plus-two-Section-B 100-mark paper. */
  complete: boolean;
  /** Spread of difficulty across the questions, rounded. */
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const SESSION_EXPANSIONS: Record<string, string> = {
  Mar: 'March', Jun: 'June', Sep: 'September', Dec: 'December',
};

/** "Sep/Dec 2022" -> "September/December 2022" for the friendlier card title. */
function expandSession(session: string): string {
  const [months, year] = session.split(' ');
  const long = months
    .split('/')
    .map((m) => SESSION_EXPANSIONS[m] ?? m)
    .join('/');
  return `${long} ${year}`;
}

/** Sort key: newest sitting first. Year desc, then month-window desc. */
function sortKey(session: string): number {
  const m = /(\d{4})$/.exec(session);
  const year = m ? Number(m[1]) : 0;
  const monthRank = session.includes('Sep') || session.includes('Dec')
    ? 1 // back half of the year
    : 0; // Mar/Jun front half
  return year * 10 + monthRank;
}

function slugify(session: string): string {
  return session.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildSitting(session: string, questions: Paper[]): Sitting {
  // Section A first, then Section B in dataset order. Numbering follows that.
  const ordered = [...questions].sort((a, b) => {
    if (a.paperSection !== b.paperSection) return a.paperSection === 'A' ? -1 : 1;
    return 0;
  });
  const sittingQuestions: SittingQuestion[] = ordered.map((paper, i) => ({
    no: i + 1,
    label: `Q${i + 1}`,
    paper,
  }));

  const totalMarks = ordered.reduce((n, p) => n + p.totalMarks, 0);
  const sectionA = ordered.filter((p) => p.paperSection === 'A').length;
  const sectionB = ordered.filter((p) => p.paperSection === 'B').length;

  let format: SittingFormat;
  let complete: boolean;
  if (sectionA === 1 && sectionB === 2) {
    format = 'modern';
    complete = true;
  } else if (sectionA === 1 && sectionB >= 3) {
    format = 'legacy'; // pre-Sep-2018 four-question / 125-mark structure
    complete = true;
  } else {
    format = 'partial';
    complete = false;
  }

  const avgDifficulty = Math.round(
    ordered.reduce((n, p) => n + p.difficulty, 0) / ordered.length,
  ) as Sitting['difficulty'];

  return {
    id: slugify(session),
    session,
    title: `AFM ${expandSession(session)}`,
    type: 'PAST EXAM',
    questions: sittingQuestions,
    totalMarks,
    timingMinutes: Math.round(totalMarks * 1.95),
    format,
    complete,
    difficulty: avgDifficulty,
  };
}

function buildSittings(): Sitting[] {
  const bySession = new Map<string, Paper[]>();
  for (const paper of PAPERS) {
    const bucket = bySession.get(paper.session);
    if (bucket) bucket.push(paper);
    else bySession.set(paper.session, [paper]);
  }
  return [...bySession.entries()]
    .map(([session, questions]) => buildSitting(session, questions))
    .sort((a, b) => sortKey(b.session) - sortKey(a.session));
}

export const SITTINGS: Sitting[] = buildSittings();

export function getSitting(id: string): Sitting | undefined {
  return SITTINGS.find((s) => s.id === id);
}

/** Friendly timing string, e.g. "3h 15m" or "1h 50m". */
export function formatTiming(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

