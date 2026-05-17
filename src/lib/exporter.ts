/**
 * /settings/data — full account export.
 *
 * Spec §21 + §22: One-click backup containing JSON of all state plus
 * an Anki-importable card export. Pure browser — no server roundtrip
 * needed for the local-storage portion (which is currently the canonical
 * data source until Sprint 3 brings Postgres online).
 *
 * What's shipped now:
 *   - JSON backup of every tba_* localStorage key
 *   - Anki-importable TSV (front\tback\ttags) — Anki imports this natively
 *
 * Deferred (see DECISIONS.md):
 *   - Real .apkg (sqlite-in-zip) — needs sql.js or a server-side script;
 *     planned for the Sprint 10 server-side export worker.
 *   - SCORM 1.2 zip — same Sprint 10 worker.
 *   - PDF progress certificate — server-side pdfkit; Sprint 10.
 */

const TBA_PREFIX_RX = /^tba[._]/i;

export interface ExportManifest {
  version: 1;
  exportedAt: string; // ISO
  agent: string;
  app: 'tba-academy';
  /** Total number of keys backed up. */
  keyCount: number;
}

export interface FullExport {
  manifest: ExportManifest;
  storage: Record<string, unknown>;
}

/**
 * Collect every TBA-namespaced localStorage key into a JSON object.
 * Non-JSON values are stored as raw strings; valid JSON is parsed so the
 * resulting file is human-diffable.
 */
export function collectFullExport(): FullExport {
  const storage: Record<string, unknown> = {};
  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k || !TBA_PREFIX_RX.test(k)) continue;
      const raw = localStorage.getItem(k);
      if (raw === null) continue;
      try {
        storage[k] = JSON.parse(raw);
      } catch {
        storage[k] = raw;
      }
    }
  }
  return {
    manifest: {
      version: 1,
      exportedAt: new Date().toISOString(),
      agent: typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent,
      app: 'tba-academy',
      keyCount: Object.keys(storage).length,
    },
    storage,
  };
}

/**
 * Convert the SR queue (sr_engine + Memory.tsx seed) into an Anki-importable
 * TSV. Anki accepts plain TSV with up to N fields per line; here we use
 * `front\tback\ttags`. Tags are space-separated per Anki convention.
 */
export function collectAnkiTsv(): string {
  if (typeof window === 'undefined') return '';
  const raw = localStorage.getItem('tba_sr_v1');
  if (!raw) return '';
  let cards: Array<{ front: string; back: string; topic?: string; deck?: string }>;
  try {
    cards = JSON.parse(raw);
  } catch {
    return '';
  }
  if (!Array.isArray(cards)) return '';
  const lines = cards.map((c) => {
    const tags = [c.topic ?? '', c.deck ?? ''].filter(Boolean).join(' ').trim() || 'tba';
    return [tba(c.front), tba(c.back), tags].join('\t');
  });
  return ['#separator:tab', '#html:false', '#tags column:3', ...lines].join('\n');
}

function tba(s: string): string {
  // Anki TSV: replace tabs/newlines so each card is one line; preserve apostrophes.
  return s.replace(/\t/g, ' ').replace(/\r?\n/g, ' ').trim();
}

/**
 * Trigger a download of a Blob with the given filename. Uses an anchor
 * because it's the only cross-browser way that works without permission.
 */
export function downloadBlob(filename: string, blob: Blob): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a tick so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function todayStamp(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Wipe every TBA key from localStorage. Caller is expected to confirm
 * (this is the "delete my data" action).
 */
export function wipeAllLocalData(): number {
  if (typeof window === 'undefined') return 0;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && TBA_PREFIX_RX.test(k)) keys.push(k);
  }
  for (const k of keys) localStorage.removeItem(k);
  return keys.length;
}
