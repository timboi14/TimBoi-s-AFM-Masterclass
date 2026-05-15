/**
 * Attempts log — persists past-paper attempts to localStorage.
 * Powers the Revision dashboard, topic mastery, and progress page.
 */
import type { AttemptLog, AttemptRating } from '@/data/papers/schema';

const KEY = 'tba_attempts_v1';

export function loadAttempts(): AttemptLog[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function save(all: AttemptLog[]) {
  try { localStorage.setItem(KEY, JSON.stringify(all.slice(-500))); } catch {}
}

export function logAttempt(input: Omit<AttemptLog, 'id'>): AttemptLog {
  const all = loadAttempts();
  const id = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const att: AttemptLog = { id, ...input };
  all.unshift(att);
  save(all);
  return att;
}

export function attemptsByQuestion(questionId: string): AttemptLog[] {
  return loadAttempts().filter((a) => a.questionId === questionId);
}

export function lastAttempt(): AttemptLog | null {
  const all = loadAttempts();
  return all[0] ?? null;
}

export function totalStudyMinutes(): number {
  return loadAttempts()
    .filter((a) => a.startedAt && a.finishedAt)
    .reduce((n, a) => n + Math.max(0, ((a.finishedAt as number) - a.startedAt) / 60_000), 0);
}

export function uniquePapersAttempted(): number {
  return new Set(loadAttempts().map((a) => a.paperId)).size;
}

/* ── Topic mastery ─────────────────────────────────────────────
   For each topic id, mean(selfScore / marks) across the last 5 attempts
   that quoted that topic, clipped to [0,1]. Falls back to attempt rating
   when selfScore is absent. */

const RATING_WEIGHTS: Record<AttemptRating, number> = { again: 0.2, hard: 0.5, good: 0.75, easy: 1.0 };

export function topicMastery(topicId: string, papers: { id: string; questions: { id: string; topics: string[]; marks: number }[] }[]): number | null {
  const allAttempts = loadAttempts();
  const matches: { ratio: number }[] = [];
  for (const p of papers) {
    for (const q of p.questions) {
      if (!q.topics.includes(topicId)) continue;
      const att = allAttempts.filter((a) => a.questionId === q.id).slice(0, 5);
      for (const a of att) {
        if (typeof a.selfScore === 'number' && q.marks > 0) {
          matches.push({ ratio: Math.max(0, Math.min(1, a.selfScore / q.marks)) });
        } else {
          matches.push({ ratio: RATING_WEIGHTS[a.selfRating] });
        }
      }
    }
  }
  if (matches.length === 0) return null;
  const sum = matches.reduce((n, x) => n + x.ratio, 0);
  return sum / matches.length;
}

export function exportAttemptsCsv(): string {
  const rows = loadAttempts();
  const header = 'id,paperId,questionId,startedAt,finishedAt,minutes,selfScore,selfRating,revealed,notes';
  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((a) => {
    const minutes = a.finishedAt ? Math.round((a.finishedAt - a.startedAt) / 60_000) : '';
    return [a.id, a.paperId, a.questionId, new Date(a.startedAt).toISOString(),
            a.finishedAt ? new Date(a.finishedAt).toISOString() : '',
            minutes, a.selfScore ?? '', a.selfRating, a.revealed ? 'true' : 'false', a.notes ?? '']
      .map(escape).join(',');
  });
  return [header, ...lines].join('\n');
}
