/**
 * Gamification store. localStorage only, no server.
 * Keys are namespaced with the tba_ prefix.
 */

const KEY = {
  fanName: 'tba_fanName',
  points: 'tba_points',
  streak: 'tba_streak',
  tier: 'tba_tier',
  drills: 'tba_drills',
  lastVisit: 'tba_lastVisit',
  notesRead: 'tba_notesRead',
  theoryRead: 'tba_theoryRead',
  weakAreas: 'tba_weakAreas',
} as const;

export type Tier = 'Academy' | 'Reserve' | 'First Team' | 'Club Legend' | 'COYS Legend';

export const TIER_THRESHOLDS: Array<{ tier: Tier; min: number; emoji: string; color: string }> = [
  { tier: 'Academy', min: 0, emoji: '🌱', color: '#9ca3af' },
  { tier: 'Reserve', min: 250, emoji: '🛡️', color: '#60a5fa' },
  { tier: 'First Team', min: 750, emoji: '⚽', color: '#00c853' },
  { tier: 'Club Legend', min: 1500, emoji: '🏆', color: '#ffd600' },
  { tier: 'COYS Legend', min: 3000, emoji: '👑', color: '#ec4899' },
];

export function tierFor(points: number): { tier: Tier; emoji: string; color: string; next?: { tier: Tier; min: number } } {
  let current = TIER_THRESHOLDS[0];
  for (const t of TIER_THRESHOLDS) if (points >= t.min) current = t;
  const next = TIER_THRESHOLDS.find((t) => t.min > points);
  return { tier: current.tier, emoji: current.emoji, color: current.color, next };
}

function readNum(key: string, fallback: number): number {
  const v = typeof window === 'undefined' ? null : localStorage.getItem(key);
  return v === null ? fallback : Number(v) || fallback;
}
function readStr(key: string, fallback: string): string {
  const v = typeof window === 'undefined' ? null : localStorage.getItem(key);
  return v ?? fallback;
}
function readArr(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface State {
  fanName: string;
  points: number;
  streak: number;
  drills: number;
  notesRead: string[];
  theoryRead: string[];
  weakAreas: string[];
  lastVisit: string;
}

const listeners = new Set<() => void>();

export const store = {
  get(): State {
    return {
      fanName: readStr(KEY.fanName, ''),
      points: readNum(KEY.points, 0),
      streak: readNum(KEY.streak, 0),
      drills: readNum(KEY.drills, 0),
      notesRead: readArr(KEY.notesRead),
      theoryRead: readArr(KEY.theoryRead),
      weakAreas: readArr(KEY.weakAreas),
      lastVisit: readStr(KEY.lastVisit, ''),
    };
  },
  set(patch: Partial<State>) {
    if (patch.fanName !== undefined) localStorage.setItem(KEY.fanName, patch.fanName);
    if (patch.points !== undefined) localStorage.setItem(KEY.points, String(Math.max(0, patch.points)));
    if (patch.streak !== undefined) localStorage.setItem(KEY.streak, String(Math.max(0, patch.streak)));
    if (patch.drills !== undefined) localStorage.setItem(KEY.drills, String(Math.max(0, patch.drills)));
    if (patch.notesRead) localStorage.setItem(KEY.notesRead, JSON.stringify(patch.notesRead));
    if (patch.theoryRead) localStorage.setItem(KEY.theoryRead, JSON.stringify(patch.theoryRead));
    if (patch.weakAreas) localStorage.setItem(KEY.weakAreas, JSON.stringify(patch.weakAreas));
    if (patch.lastVisit !== undefined) localStorage.setItem(KEY.lastVisit, patch.lastVisit);
    // tier auto-derived from points
    const points = readNum(KEY.points, 0);
    localStorage.setItem(KEY.tier, tierFor(points).tier);
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  reset() {
    Object.values(KEY).forEach((k) => localStorage.removeItem(k));
    listeners.forEach((fn) => fn());
  },
  /** Award points for a correct drill, with streak multiplier. */
  awardCorrect(driIlld: string, base = 100) {
    const cur = this.get();
    const mult = 1 + Math.min(cur.streak * 0.05, 0.5);
    this.set({
      points: cur.points + Math.round(base * mult),
      drills: cur.drills + 1,
    });
  },
  awardShown(_id: string) {
    const cur = this.get();
    this.set({ points: cur.points + 50 });
  },
  markNoteRead(id: string) {
    const cur = this.get();
    if (cur.notesRead.includes(id)) return;
    this.set({ notesRead: [...cur.notesRead, id], points: cur.points + 5 });
  },
  markTheoryRead(id: string) {
    const cur = this.get();
    if (cur.theoryRead.includes(id)) return;
    this.set({ theoryRead: [...cur.theoryRead, id], points: cur.points + 5 });
  },
  /** Bump streak if last visit was different day; reset if gap > 1 day. */
  bumpStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const cur = this.get();
    if (cur.lastVisit === today) return;
    if (!cur.lastVisit) {
      this.set({ streak: 1, lastVisit: today });
      return;
    }
    const prev = new Date(cur.lastVisit);
    const cur0 = new Date(today);
    const days = Math.round((+cur0 - +prev) / 86400000);
    this.set({ streak: days === 1 ? cur.streak + 1 : 1, lastVisit: today });
  },
};

import { useSyncExternalStore } from 'react';
export function useStore(): State {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
