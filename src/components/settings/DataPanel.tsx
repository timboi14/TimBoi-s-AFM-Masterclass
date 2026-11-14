import { useEffect, useRef, useState } from 'react';
import {
  buildBackup, listSnapshots, parseBackup, requestPersistence, restoreBackup, restoreSnapshot, storageHealth,
  type BackupFile, type SnapshotInfo, type StorageHealth,
} from '@/lib/db/backup';
import { clearEvents, useEvents } from '@/lib/db/events';
import { idb } from '@/lib/db/idb';
import { collectAnkiTsv, downloadBlob, todayStamp, wipeAllLocalData } from '@/lib/exporter';

const kb = (n: number | null) => (n === null ? 'unknown' : n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
const when = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(+d) ? 'unknown date' : d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

type Pending = { backup: BackupFile; keyCount: number; eventCount: number; exportedAt: string; name: string };

/**
 * Your data: export, import, automatic snapshots and storage health.
 * Destructive steps (restore, delete) need an explicit second click and
 * always leave a safety snapshot behind.
 */
export function DataPanel() {
  const events = useEvents();
  const fileRef = useRef<HTMLInputElement>(null);
  const [health, setHealth] = useState<StorageHealth | null>(null);
  const [snaps, setSnaps] = useState<SnapshotInfo[]>([]);
  const [pending, setPending] = useState<Pending | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const cardCount = (() => {
    try { const v: unknown = JSON.parse(localStorage.getItem('tba_sr_v1') ?? '[]'); return Array.isArray(v) ? v.length : 0; } catch { return 0; }
  })();

  const refresh = () => {
    void storageHealth().then(setHealth);
    void listSnapshots().then(setSnaps);
  };
  useEffect(refresh, []);

  const doExport = () => {
    const data = buildBackup();
    downloadBlob(`tba_backup_${todayStamp()}.json`, new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    setMsg({ tone: 'ok', text: `Backup saved: ${data.manifest.keyCount} items and ${data.manifest.eventCount} study events.` });
  };

  const doAnki = () => {
    downloadBlob(`tba_cards_${todayStamp()}.tsv`, new Blob([collectAnkiTsv()], { type: 'text/tab-separated-values' }));
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setMsg(null);
    const result = parseBackup(await file.text());
    if (!result.ok) { setPending(null); setMsg({ tone: 'bad', text: result.error }); return; }
    setPending({ backup: result.backup, keyCount: result.keyCount, eventCount: result.eventCount, exportedAt: result.exportedAt, name: file.name });
  };

  const applyPending = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      await restoreBackup(pending.backup);
      window.location.reload();
    } catch {
      setBusy(false);
      setMsg({ tone: 'bad', text: 'The restore did not complete. Your current data is unchanged.' });
    }
  };

  const applySnapshot = async (day: string) => {
    setBusy(true);
    const ok = await restoreSnapshot(day);
    if (ok) window.location.reload();
    else { setBusy(false); setMsg({ tone: 'bad', text: 'That snapshot could not be read.' }); }
  };

  const doWipe = async () => {
    setBusy(true);
    const n = wipeAllLocalData();
    await clearEvents();
    await idb.clear('backups');
    await idb.clear('meta');
    setBusy(false);
    setConfirmWipe(false);
    setMsg({ tone: 'ok', text: `Deleted ${n} stored item${n === 1 ? '' : 's'}, the study log and every snapshot. Reload to start fresh.` });
    refresh();
  };

  const protect = async () => {
    const ok = await requestPersistence();
    setMsg(ok
      ? { tone: 'ok', text: 'This browser will now keep your data even when storage runs low.' }
      : { tone: 'bad', text: 'The browser declined. Installing the app or bookmarking the site usually unlocks this.' });
    refresh();
  };

  return (
    <section className="st-card st-card--wide" id="data" aria-labelledby="st-data-title">
      <header className="st-card__head">
        <h2 id="st-data-title">Your data</h2>
        <p>Progress lives on this device. A backup file moves it to another browser or device, and a daily snapshot guards against a wiped browser.</p>
      </header>

      <dl className="st-health">
        <div><dt>Study events</dt><dd>{events.length}</dd></div>
        <div><dt>Flashcards</dt><dd>{cardCount}</dd></div>
        <div><dt>Snapshots kept</dt><dd>{health?.snapshots ?? '–'}</dd></div>
        <div><dt>Space used</dt><dd>{health ? kb(health.usageBytes ?? health.localBytes) : '–'}</dd></div>
        <div>
          <dt>Eviction protection</dt>
          <dd className={health?.persisted ? 'is-ok' : ''}>
            {health === null ? '–' : health.persisted ? 'On' : <button type="button" className="st-link" onClick={protect}>Turn on</button>}
          </dd>
        </div>
      </dl>
      {health && !health.indexedDb && (
        <p className="st-alert st-alert--bad" role="status">This browser is blocking IndexedDB (often a private window). Study history falls back to basic storage and automatic snapshots are off.</p>
      )}

      <div className="st-actions">
        <button type="button" className="st-btn st-btn--primary" onClick={doExport}>Download backup</button>
        <button type="button" className="st-btn" onClick={() => fileRef.current?.click()}>Restore from file</button>
        <button type="button" className="st-btn" onClick={doAnki} disabled={cardCount === 0}>Export cards for Anki</button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Choose a backup file to restore"
          onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }}
        />
      </div>

      {pending && (
        <div className="st-confirm" role="alertdialog" aria-labelledby="st-restore-title">
          <h3 id="st-restore-title">Replace everything on this device?</h3>
          <p>
            <strong>{pending.name}</strong> holds {pending.keyCount} item{pending.keyCount === 1 ? '' : 's'}
            {pending.eventCount ? ` and ${pending.eventCount} study events` : ''}, saved {when(pending.exportedAt)}.
            Your current data is snapshotted first, so this can be undone below.
          </p>
          <div className="st-actions">
            <button type="button" className="st-btn st-btn--primary" disabled={busy} onClick={applyPending}>{busy ? 'Restoring…' : 'Replace and reload'}</button>
            <button type="button" className="st-btn" disabled={busy} onClick={() => setPending(null)}>Cancel</button>
          </div>
        </div>
      )}

      {msg && <p className={`st-alert st-alert--${msg.tone}`} role="status">{msg.text}</p>}

      {snaps.length > 0 && (
        <details className="st-snaps">
          <summary>Automatic snapshots ({snaps.length})</summary>
          <ul>
            {snaps.map((s) => (
              <li key={s.day}>
                <span>
                  <strong>{when(s.exportedAt)}</strong>
                  <em>{s.kind === 'pre-restore' ? 'Saved before a restore' : 'Daily snapshot'} · {s.keyCount} items · {s.eventCount} events</em>
                </span>
                <button type="button" className="st-link" disabled={busy} onClick={() => { void applySnapshot(s.day); }}>Restore</button>
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="st-danger">
        {confirmWipe ? (
          <>
            <p><strong>This deletes points, cards, attempts, the study log and every snapshot.</strong> It cannot be undone unless you downloaded a backup.</p>
            <div className="st-actions">
              <button type="button" className="st-btn st-btn--danger" disabled={busy} onClick={() => { void doWipe(); }}>Yes, delete everything</button>
              <button type="button" className="st-btn" disabled={busy} onClick={() => setConfirmWipe(false)}>Keep my data</button>
            </div>
          </>
        ) : (
          <button type="button" className="st-link st-link--danger" onClick={() => setConfirmWipe(true)}>Delete all my data…</button>
        )}
      </div>
    </section>
  );
}
