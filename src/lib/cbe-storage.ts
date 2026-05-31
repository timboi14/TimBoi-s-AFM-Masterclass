/**
 * ACCA-CBE practice workspace storage.
 *
 * Per-user, per-paper persistence of:
 *   - Word-processor HTML
 *   - Spreadsheet grid (string[][])
 *   - Countdown timer state (secondsRemaining, running, lastTick)
 *
 * Keyed in localStorage as: tba_cbe_<fanName>_<paperId>
 * A second top-level key (tba_cbe_users) tracks all (fanName) used on
 * this browser so we can clear / migrate later if needed.
 *
 * No backend — all state is browser-local.
 */

const VERSION = 1;
const PREFIX = 'tba_cbe_';
const INDEX_KEY = 'tba_cbe_users';

export const DEFAULT_DURATION_SECONDS = 3 * 60 * 60 + 15 * 60; // 3h 15m — ACCA AFM CBE

export const SHEET_ROWS = 30;
export const SHEET_COLS = 10;

export interface CBEWorkspaceState {
  version: number;
  word: string;
  sheet: string[][];
  timerSecondsRemaining: number;
  timerRunning: boolean;
  /** When running, the wall-clock ms at which we last set secondsRemaining. Used to compute drift on rehydrate. */
  timerLastTickMs: number | null;
  updatedAt: number;
}

function emptySheet(): string[][] {
  return Array.from({ length: SHEET_ROWS }, () => Array.from({ length: SHEET_COLS }, () => ''));
}

export function emptyState(): CBEWorkspaceState {
  return {
    version: VERSION,
    word: '',
    sheet: emptySheet(),
    timerSecondsRemaining: DEFAULT_DURATION_SECONDS,
    timerRunning: false,
    timerLastTickMs: null,
    updatedAt: 0,
  };
}

function keyFor(fanName: string, paperId: string): string {
  // Encode in case fanName contains characters that could collide with our delimiter.
  return `${PREFIX}${encodeURIComponent(fanName)}__${paperId}`;
}

function recordUser(fanName: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    if (!set.has(fanName)) {
      set.add(fanName);
      localStorage.setItem(INDEX_KEY, JSON.stringify([...set]));
    }
  } catch {
    // ignore
  }
}

export function loadWorkspace(fanName: string, paperId: string): CBEWorkspaceState {
  if (typeof window === 'undefined' || !fanName || !paperId) return emptyState();
  try {
    const raw = localStorage.getItem(keyFor(fanName, paperId));
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<CBEWorkspaceState>;
    const base = emptyState();
    // Rows are unbounded — accept any saved row count, only normalising each
    // row's width to SHEET_COLS. (Was a strict === SHEET_ROWS check, which
    // discarded any sheet grown beyond the original 30 rows.)
    const normalizeRow = (row: unknown): string[] => {
      const arr = Array.isArray(row) ? row.map((c) => (typeof c === 'string' ? c : String(c ?? ''))) : [];
      if (arr.length < SHEET_COLS) return [...arr, ...Array.from({ length: SHEET_COLS - arr.length }, () => '')];
      return arr.length > SHEET_COLS ? arr.slice(0, SHEET_COLS) : arr;
    };
    const sheet =
      Array.isArray(parsed.sheet) && parsed.sheet.length > 0
        ? parsed.sheet.map(normalizeRow)
        : base.sheet;
    return {
      version: VERSION,
      word: typeof parsed.word === 'string' ? parsed.word : '',
      sheet,
      timerSecondsRemaining:
        typeof parsed.timerSecondsRemaining === 'number'
          ? Math.max(0, Math.min(parsed.timerSecondsRemaining, DEFAULT_DURATION_SECONDS))
          : DEFAULT_DURATION_SECONDS,
      timerRunning: Boolean(parsed.timerRunning),
      timerLastTickMs:
        typeof parsed.timerLastTickMs === 'number' ? parsed.timerLastTickMs : null,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    };
  } catch {
    return emptyState();
  }
}

export function saveWorkspace(
  fanName: string,
  paperId: string,
  state: CBEWorkspaceState,
): void {
  if (typeof window === 'undefined' || !fanName || !paperId) return;
  try {
    const payload: CBEWorkspaceState = { ...state, version: VERSION, updatedAt: Date.now() };
    localStorage.setItem(keyFor(fanName, paperId), JSON.stringify(payload));
    recordUser(fanName);
  } catch {
    // quota exceeded or storage disabled — silent fail
  }
}

export function clearWorkspace(fanName: string, paperId: string): void {
  if (typeof window === 'undefined' || !fanName || !paperId) return;
  try {
    localStorage.removeItem(keyFor(fanName, paperId));
  } catch {
    // ignore
  }
}

/** When the timer is running, account for time elapsed since lastTick (e.g. tab closed). */
export function reconcileTimer(state: CBEWorkspaceState): CBEWorkspaceState {
  if (!state.timerRunning || state.timerLastTickMs == null) return state;
  const elapsed = Math.floor((Date.now() - state.timerLastTickMs) / 1000);
  const remaining = Math.max(0, state.timerSecondsRemaining - elapsed);
  return {
    ...state,
    timerSecondsRemaining: remaining,
    timerRunning: remaining > 0 && state.timerRunning,
    timerLastTickMs: remaining > 0 ? Date.now() : null,
  };
}

export function formatHMS(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function colLabel(idx: number): string {
  // 0 → 'A', 25 → 'Z', 26 → 'AA'
  let n = idx;
  let label = '';
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}
