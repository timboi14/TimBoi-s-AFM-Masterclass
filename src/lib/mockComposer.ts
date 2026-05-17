/**
 * Composite Mock composer — Work Item 4.
 *
 * Given a numeric seed, draw one Section A 50-mark paper and two Section
 * B 25-mark papers with NO topic duplication (so the candidate covers
 * three distinct AFM areas across one sitting).
 */
import { PAPERS } from '@/data/pastpapers/papers';
import type { Paper } from '@/data/pastpapers/schema';

export interface MockComposition {
  id: string;
  startedAt: number;
  sectionA: Paper;
  b1: Paper;
  b2: Paper;
}

/** Deterministic seeded RNG. */
function mulberry32(seed: number) {
  let t = seed | 0;
  return () => {
    t = (t + 0x6D2B79F5) | 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)];
}

export function composeMock(seed: number): MockComposition {
  const rng = mulberry32(seed);
  const sectionAPool = PAPERS.filter((p) => p.paperSection === 'A');
  const sectionBPool = PAPERS.filter((p) => p.paperSection === 'B');

  const sectionA = pickOne(rng, sectionAPool);
  const b1 = pickOne(rng, sectionBPool);
  const b1Topics = new Set(b1.topics);
  // No topic duplication between b1 and b2
  const b2Pool = sectionBPool.filter((p) => p.id !== b1.id && !p.topics.some((t) => b1Topics.has(t)));
  const b2 = b2Pool.length > 0 ? pickOne(rng, b2Pool) : pickOne(rng, sectionBPool.filter((p) => p.id !== b1.id));

  return {
    id: `mock-${seed}-${Date.now().toString(36)}`,
    startedAt: Date.now(),
    sectionA,
    b1,
    b2,
  };
}

/** Generate a fresh seed (uses crypto when available). */
export function freshSeed(): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
  }
  return Math.floor(Math.random() * 4294967295);
}

// ──────────────────────────────────────────────────────────────────
// Local persistence
// ──────────────────────────────────────────────────────────────────
export const MOCK_STATE_KEY = 'tba.mock.state.v1';
export const MOCK_REPORTS_KEY = 'tba.mockReports.v1';
export const MOCK_DURATION_SECONDS = 3 * 3600 + 15 * 60; // 3h 15m

export interface MockAnswerState {
  partLabel: string;
  word: string;
  /** ms spent on this part, derived from pivot log */
  timeMs: number;
}

export interface MockState {
  id: string;
  seed: number;
  startedAt: number;
  endsAt: number;
  sectionAId: string;
  b1Id: string;
  b2Id: string;
  activePaperId: string;
  answers: Record<string, MockAnswerState>;
  lastPivotAt: number;
  submittedAt?: number;
}

export interface MockReportPart {
  paperId: string;
  paperName: string;
  partLabel: string;
  marks: number;
  scorePct: number | null;
  feedback: string;
  timeMinutes: number;
}

export interface MockReport {
  id: string;
  startedAt: number;
  submittedAt: number;
  parts: MockReportPart[];
  psRubric: { communication: number; analysis: number; scepticism: number; commercial: number };
  threeFixes: string[];
}

export function saveMockState(state: MockState): void {
  try {
    localStorage.setItem(MOCK_STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadMockState(id: string): MockState | null {
  try {
    const raw = localStorage.getItem(MOCK_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockState;
    return parsed.id === id ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMockReport(report: MockReport): void {
  try {
    const raw = localStorage.getItem(MOCK_REPORTS_KEY);
    const list: MockReport[] = raw ? JSON.parse(raw) : [];
    const filtered = Array.isArray(list) ? list.filter((r) => r.id !== report.id) : [];
    filtered.push(report);
    localStorage.setItem(MOCK_REPORTS_KEY, JSON.stringify(filtered.slice(-20)));
  } catch {
    // ignore
  }
}

export function loadMockReport(id: string): MockReport | null {
  try {
    const raw = localStorage.getItem(MOCK_REPORTS_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as MockReport[];
    if (!Array.isArray(list)) return null;
    return list.find((r) => r.id === id) ?? null;
  } catch {
    return null;
  }
}
