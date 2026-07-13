/**
 * Self-marking ticks for a sitting, per guest. Maps a paper id to the set of
 * marking-guide point indices the candidate awarded themselves. Kept separate
 * from the answer store so re-marking never touches the written answer.
 */
const PREFIX = 'tba_selfmark_';

const key = (guestId: string, sittingId: string) =>
  `${PREFIX}${encodeURIComponent(guestId)}_${sittingId}`;

export type SelfMarkMap = Record<string, number[]>; // paperId -> ticked point indices

export function loadSelfMark(guestId: string, sittingId: string): SelfMarkMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(key(guestId, sittingId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as SelfMarkMap) : {};
  } catch {
    return {};
  }
}

export function saveSelfMark(guestId: string, sittingId: string, map: SelfMarkMap): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key(guestId, sittingId), JSON.stringify(map));
  } catch {
    /* silent */
  }
}

