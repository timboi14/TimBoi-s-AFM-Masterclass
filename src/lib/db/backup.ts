/**
 * Backup and restore.
 *
 * Three layers protect learner progress, all on the device:
 *  1. Manual export: one JSON file with every tba key plus the event log.
 *  2. Manual import: restore that file on any browser or device.
 *  3. Automatic snapshots: once a day the same payload is written to
 *     IndexedDB, which survives a localStorage wipe. If the app boots with
 *     no progress but a snapshot exists, it offers to restore it.
 *
 * Restores always replace (never merge) and always snapshot the current
 * state first, so a mistaken import can be undone from Settings.
 */
import { idb } from './idb';
import { clearEvents, getEvents, importEvents, initEvents, isEvent, type StudyEvent } from './events';

/**
 * Every key this app owns. Hyphenated keys (theme, a11y) are included, as is
 * the `afm` prefix used by the AFM classroom and reading preferences.
 */
export const TBA_KEY_RX = /^(tba|afm)[._-]/i;
/** Keys that describe the device, not the learner; never a sign of progress. */
const DEVICE_KEY_RX = /^(?:tba|afm)[._-](reading-preference|read-source|voice|settings|dark|reduce-motion|dyslexia|dyslexia-font|high-contrast|text-large|text-xl|bionic|tab-art-preload|chunk-reloaded|events_fallback|events_journal|sitting_choice|weekly_goal|recovery-dismissed)/i;

const KEEP_SNAPSHOTS = 14;
const MAX_IMPORT_BYTES = 25 * 1024 * 1024;

export interface BackupFile {
  manifest: {
    version: 1 | 2;
    exportedAt: string;
    agent: string;
    app: 'tba-academy';
    keyCount: number;
    /** v2: number of study events included. */
    eventCount?: number;
  };
  storage: Record<string, unknown>;
  /** v2: the study event log. */
  events?: StudyEvent[];
}

interface Snapshot extends BackupFile {
  day: string;
  /** 'auto' daily snapshot, or 'pre-restore' safety copy. */
  kind: 'auto' | 'pre-restore';
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function collectStorage(): Record<string, unknown> {
  const storage: Record<string, unknown> = {};
  if (typeof localStorage === 'undefined') return storage;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !TBA_KEY_RX.test(k)) continue;
    const raw = localStorage.getItem(k);
    if (raw === null) continue;
    try { storage[k] = JSON.parse(raw); } catch { storage[k] = raw; }
  }
  return storage;
}

/** Number of stored keys that represent learner progress. */
export function progressKeyCount(storage: Record<string, unknown> = collectStorage()): number {
  return Object.keys(storage).filter((k) => !DEVICE_KEY_RX.test(k)).length;
}

export function buildBackup(): BackupFile {
  const storage = collectStorage();
  const events = getEvents().map(({ id: _id, ...rest }) => rest);
  return {
    manifest: {
      version: 2,
      exportedAt: new Date().toISOString(),
      agent: typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent,
      app: 'tba-academy',
      keyCount: Object.keys(storage).length,
      eventCount: events.length,
    },
    storage,
    events,
  };
}

export type ParseResult =
  | { ok: true; backup: BackupFile; keyCount: number; eventCount: number; exportedAt: string }
  | { ok: false; error: string };

/** Validate untrusted file text. Rejects anything that is not this app's export. */
export function parseBackup(text: string): ParseResult {
  if (text.length > MAX_IMPORT_BYTES) return { ok: false, error: 'That file is too large to be an Academy backup.' };
  let data: unknown;
  try { data = JSON.parse(text); } catch { return { ok: false, error: 'That file is not valid JSON.' }; }
  if (!data || typeof data !== 'object') return { ok: false, error: 'That file is not an Academy backup.' };
  const { manifest, storage, events } = data as Partial<BackupFile>;
  if (!manifest || manifest.app !== 'tba-academy' || (manifest.version !== 1 && manifest.version !== 2)) {
    return { ok: false, error: 'That file is not an Academy backup, or it comes from a newer version.' };
  }
  if (!storage || typeof storage !== 'object' || Array.isArray(storage)) {
    return { ok: false, error: 'The backup has no saved data in it.' };
  }
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(storage)) {
    // Only keys this app owns are ever written back.
    if (TBA_KEY_RX.test(k) && k.length <= 200) clean[k] = v;
  }
  const cleanEvents = Array.isArray(events) ? events.filter(isEvent) : [];
  return {
    ok: true,
    backup: { manifest, storage: clean, events: cleanEvents },
    keyCount: Object.keys(clean).length,
    eventCount: cleanEvents.length,
    exportedAt: typeof manifest.exportedAt === 'string' ? manifest.exportedAt : '',
  };
}

function writeStorage(storage: Record<string, unknown>): void {
  const stale: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && TBA_KEY_RX.test(k)) stale.push(k);
  }
  for (const k of stale) localStorage.removeItem(k);
  for (const [k, v] of Object.entries(storage)) {
    localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
  }
}

/**
 * Replace everything on this device with the backup. The current state is
 * snapshotted first. The caller should reload afterwards so every module
 * re-reads its storage.
 */
export async function restoreBackup(backup: BackupFile): Promise<void> {
  await initEvents();
  await saveSnapshot('pre-restore');
  writeStorage(backup.storage);
  if (backup.events && backup.events.length) await importEvents(backup.events, { replace: true });
  else if (backup.manifest.version === 2) await clearEvents();
  // A v1 backup has no event log: keep the existing one instead of losing it.
}

async function saveSnapshot(kind: Snapshot['kind']): Promise<void> {
  const backup = buildBackup();
  if (progressKeyCount(backup.storage) === 0 && (backup.events?.length ?? 0) === 0) return;
  const day = kind === 'auto' ? today() : `${today()}-pre-restore`;
  await idb.put('backups', { ...backup, day, kind } satisfies Snapshot);
  const all = (await idb.getAll<Snapshot>('backups')).sort((a, b) => a.day.localeCompare(b.day));
  for (const old of all.slice(0, Math.max(0, all.length - KEEP_SNAPSHOTS))) await idb.delete('backups', old.day);
}

/** Take today's automatic snapshot if there is not one yet. */
export async function snapshotIfDue(): Promise<void> {
  if (!(await idb.available())) return;
  await initEvents();
  const existing = await idb.get<Snapshot>('backups', today());
  // Refresh today's snapshot at most once per session start; cheap and bounded.
  if (existing && Date.now() - +new Date(existing.manifest.exportedAt) < 6 * 3_600_000) return;
  await saveSnapshot('auto');
}

export interface SnapshotInfo { day: string; kind: Snapshot['kind']; exportedAt: string; keyCount: number; eventCount: number }

export async function listSnapshots(): Promise<SnapshotInfo[]> {
  const all = await idb.getAll<Snapshot>('backups');
  return all
    .map((s) => ({ day: s.day, kind: s.kind, exportedAt: s.manifest.exportedAt, keyCount: progressKeyCount(s.storage), eventCount: s.events?.length ?? 0 }))
    .sort((a, b) => b.exportedAt.localeCompare(a.exportedAt));
}

export async function restoreSnapshot(day: string): Promise<boolean> {
  const snap = await idb.get<Snapshot>('backups', day);
  if (!snap) return false;
  await restoreBackup({ manifest: snap.manifest, storage: snap.storage, events: snap.events });
  return true;
}

/**
 * Boot check: progress is gone from localStorage but a snapshot holds some.
 * Returns the newest useful snapshot so the UI can offer a one-tap restore.
 */
export async function findRecoverable(): Promise<SnapshotInfo | null> {
  if (progressKeyCount() > 0) return null;
  const snaps = await listSnapshots();
  return snaps.find((s) => s.keyCount > 0) ?? null;
}

export interface StorageHealth {
  indexedDb: boolean;
  /** True when the browser has promised not to evict this site's data. */
  persisted: boolean;
  usageBytes: number | null;
  quotaBytes: number | null;
  /** Approximate size of this app's localStorage keys. */
  localBytes: number;
  snapshots: number;
}

export async function storageHealth(): Promise<StorageHealth> {
  let localBytes = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && TBA_KEY_RX.test(k)) localBytes += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2;
    }
  } catch { /* ignore */ }
  let persisted = false;
  let usageBytes: number | null = null;
  let quotaBytes: number | null = null;
  try {
    persisted = (await navigator.storage?.persisted?.()) ?? false;
    const est = await navigator.storage?.estimate?.();
    usageBytes = est?.usage ?? null;
    quotaBytes = est?.quota ?? null;
  } catch { /* unsupported */ }
  const indexedDb = await idb.available();
  return { indexedDb, persisted, usageBytes, quotaBytes, localBytes, snapshots: indexedDb ? (await idb.getAll('backups')).length : 0 };
}

/** Ask the browser to protect this site's storage from eviction. */
export async function requestPersistence(): Promise<boolean> {
  try {
    if (await navigator.storage?.persisted?.()) return true;
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}
