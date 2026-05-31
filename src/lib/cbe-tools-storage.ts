/**
 * localStorage buckets for the iAssess-style CBE tools, harmonised with the
 * existing `tba_cbe_` prefix used by cbe-storage.ts.
 *
 *   highlights : tba_cbe_<guestId>_<paperId>_highlights   (per guest + paper)
 *   scratchpad : tba_cbe_<guestId>_<paperId>_scratchpad   (per guest + paper)
 *   flag       : tba_cbe_<paperId>_flagged                (per paper — spec §7)
 */
import { loadWorkspace } from '@/lib/cbe-storage';
import type { StoredHighlight } from '@/lib/cbe-highlight';

const PREFIX = 'tba_cbe_';

const hlKey = (guestId: string, paperId: string) =>
  `${PREFIX}${encodeURIComponent(guestId)}_${paperId}_highlights`;
const scratchKey = (guestId: string, paperId: string) =>
  `${PREFIX}${encodeURIComponent(guestId)}_${paperId}_scratchpad`;
const flagKey = (paperId: string) => `${PREFIX}${paperId}_flagged`;

/* ── Highlights ─────────────────────────────────────────────── */
export function loadHighlights(guestId: string, paperId: string): StoredHighlight[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(hlKey(guestId, paperId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export function saveHighlights(guestId: string, paperId: string, highlights: StoredHighlight[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(hlKey(guestId, paperId), JSON.stringify(highlights));
  } catch {
    /* quota / disabled — silent */
  }
}

/* ── Scratch pad ────────────────────────────────────────────── */
export function loadScratch(guestId: string, paperId: string): string {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(scratchKey(guestId, paperId)) ?? '';
  } catch {
    return '';
  }
}
export function saveScratch(guestId: string, paperId: string, text: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(scratchKey(guestId, paperId), text);
  } catch {
    /* silent */
  }
}

/* ── Flag for review ────────────────────────────────────────── */
export function loadFlag(paperId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(flagKey(paperId)) === 'true';
  } catch {
    return false;
  }
}
export function saveFlag(paperId: string, flagged: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (flagged) localStorage.setItem(flagKey(paperId), 'true');
    else localStorage.removeItem(flagKey(paperId));
  } catch {
    /* silent */
  }
}

/** Navigator status: has the guest written any answer for this paper? */
export function hasAnswer(guestId: string, paperId: string): boolean {
  try {
    const ws = loadWorkspace(guestId, paperId);
    if (ws.word && ws.word.replace(/<[^>]*>/g, '').trim().length > 0) return true;
    return ws.sheet.some((row) => row.some((cell) => cell.trim().length > 0));
  } catch {
    return false;
  }
}
