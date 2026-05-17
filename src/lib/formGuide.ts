/**
 * Predicted Mark Dashboard — Work Item 3.
 *
 * Pure function: takes the user's marker/debrief/drill/streak signals from
 * localStorage and produces a predicted band, range, and the top-3 weakest
 * and strongest topic areas. All inputs are guarded so the result never
 * renders NaN/Infinity.
 */
import { TBA_STATS } from '@/data/stats';

export interface MarkerResult {
  paperId: string;
  topicId: string;
  pct: number; // 0..100
  ts: number;
}

export interface DebriefResultV1 {
  attemptId: string;
  markersOutOf8: number;
  ts: number;
}

export interface FormGuideInputs {
  marker: MarkerResult[];
  debrief: DebriefResultV1[];
  drillsDone: number;
  drillsTotal: number;
  streakDays: number;
}

export type Band = 'Fail' | 'Borderline' | 'Comfortable' | 'Strong';

export interface FormGuideUnready {
  ready: false;
  reason: string;
  nextCta: { label: string; href: string };
}

export interface FormGuideReady {
  ready: true;
  predicted: number;
  band: Band;
  range: [number, number];
  weakest: { topicId: string; avg: number }[];
  strongest: { topicId: string; avg: number }[];
  nextAction: { label: string; href: string };
}

export type FormGuide = FormGuideUnready | FormGuideReady;

const avg = (xs: number[]): number => (xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length);

export function computeFormGuide(inputs: FormGuideInputs): FormGuide {
  const { marker, debrief, drillsDone, drillsTotal, streakDays } = inputs;

  if (marker.length < 3) {
    return {
      ready: false,
      reason: `Need ${3 - marker.length} more AI-marker run${3 - marker.length === 1 ? '' : 's'} to forecast — sit a past paper and submit the answer to the marker.`,
      nextCta: { label: 'Sit a past paper', href: '/past-papers' },
    };
  }

  const avgAIMarkerPct = clamp(avg(marker.map((m) => m.pct)));
  const avgDebriefPct = debrief.length
    ? clamp(avg(debrief.map((d) => (d.markersOutOf8 / 8) * 100)))
    : avgAIMarkerPct; // don't penalise users who haven't run a debrief
  const total = Math.max(drillsTotal, 1);
  const drillCompletionPct = clamp((drillsDone / total) * 100);
  const streakFactor = clamp(Math.min(streakDays / 14, 1) * 100);

  const predicted = Math.round(
    0.55 * avgAIMarkerPct +
      0.20 * avgDebriefPct +
      0.15 * drillCompletionPct +
      0.10 * streakFactor,
  );

  const band: Band = predicted < 40 ? 'Fail' : predicted < 50 ? 'Borderline' : predicted < 65 ? 'Comfortable' : 'Strong';
  const range: [number, number] = [Math.max(0, predicted - 6), Math.min(100, predicted + 6)];

  const byTopic = new Map<string, number[]>();
  marker.forEach((m) => {
    if (!m.topicId) return;
    if (!byTopic.has(m.topicId)) byTopic.set(m.topicId, []);
    byTopic.get(m.topicId)!.push(m.pct);
  });
  const topicAverages = [...byTopic.entries()]
    .map(([topicId, pcts]) => ({ topicId, avg: avg(pcts) }))
    .sort((a, b) => a.avg - b.avg);

  const weakest = topicAverages.slice(0, 3);
  const strongest = [...topicAverages].reverse().slice(0, 3);

  const nextAction = weakest[0]
    ? {
        label: `Drill ${weakest[0].topicId} — your weakest area (${Math.round(weakest[0].avg)}%)`,
        href: `/topic/${weakest[0].topicId}#drills`,
      }
    : { label: 'Sit a 25-mark Section B mock', href: '/training' };

  return { ready: true, predicted, band, range, weakest, strongest, nextAction };
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

// ─────────────────────────────────────────────────────────────────
// Local storage helpers
// ─────────────────────────────────────────────────────────────────
export const AI_MARKER_KEY = 'tba.aiMarker.results.v1';
export const DEBRIEF_KEY = 'tba.debrief.results.v1';
export const DRILLS_KEY = 'tba.drills.completion.v1';
export const STREAK_KEY = 'tba.streak.v1';

interface DrillsStore { doneIds?: string[] }
interface StreakStore { days?: number; lastSeenIso?: string }

function safeArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}
function safeObject<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadFormGuideInputs(): FormGuideInputs {
  if (typeof window === 'undefined') {
    return { marker: [], debrief: [], drillsDone: 0, drillsTotal: TBA_STATS.workedDrills, streakDays: 0 };
  }
  const marker = safeArray<MarkerResult>(localStorage.getItem(AI_MARKER_KEY));
  const debrief = safeArray<DebriefResultV1>(localStorage.getItem(DEBRIEF_KEY));
  const drills = safeObject<DrillsStore>(localStorage.getItem(DRILLS_KEY), {});
  const streak = safeObject<StreakStore>(localStorage.getItem(STREAK_KEY), {});
  return {
    marker,
    debrief,
    drillsDone: Array.isArray(drills.doneIds) ? drills.doneIds.length : 0,
    drillsTotal: TBA_STATS.workedDrills,
    streakDays: typeof streak.days === 'number' ? streak.days : 0,
  };
}

export const FORM_GUIDE_EVENT = 'tba:marker:done';
