/**
 * Lightweight per-sitting display preferences mirrored from the iAssess card:
 * "Hide assignment" and "Offline" checkboxes. Persisted in localStorage so they
 * survive reloads. These are display-only hints; answers and exam state live
 * elsewhere.
 */
const HIDE_KEY = 'tba_sitting_hidden';
const OFFLINE_KEY = 'tba_sitting_offline';

function loadSet(storageKey: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSet(storageKey: string, set: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKey, JSON.stringify([...set]));
  } catch {
    /* silent */
  }
}

export const loadHidden = () => loadSet(HIDE_KEY);
export const loadOffline = () => loadSet(OFFLINE_KEY);

export function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export const persistHidden = (set: Set<string>) => saveSet(HIDE_KEY, set);
export const persistOffline = (set: Set<string>) => saveSet(OFFLINE_KEY, set);

