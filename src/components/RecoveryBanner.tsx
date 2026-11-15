import { useEffect, useState } from 'react';
import { findRecoverable, restoreSnapshot, type SnapshotInfo } from '@/lib/db/backup';

const DISMISS_KEY = 'tba-recovery-dismissed';

/**
 * Shown only when this device has no saved progress but an automatic
 * snapshot still holds some: the browser's storage was cleared. One tap
 * puts everything back.
 */
export function RecoveryBanner() {
  const [snap, setSnap] = useState<SnapshotInfo | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try { if (sessionStorage.getItem(DISMISS_KEY)) return; } catch { /* ignore */ }
    let live = true;
    void findRecoverable().then((s) => { if (live) setSnap(s); });
    return () => { live = false; };
  }, []);

  if (!snap) return null;
  const when = new Date(snap.exportedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long' });

  return (
    <div className="rb" role="alert" data-va-skip>
      <p>
        <strong>Your progress is missing from this browser.</strong>{' '}
        A snapshot from {when} has {snap.keyCount} saved item{snap.keyCount === 1 ? '' : 's'}
        {snap.eventCount ? ` and ${snap.eventCount} study events` : ''}.
      </p>
      <div>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void restoreSnapshot(snap.day).then((ok) => { if (ok) window.location.reload(); else setBusy(false); });
          }}
        >
          {busy ? 'Restoring…' : 'Restore it'}
        </button>
        <button
          type="button"
          className="rb__quiet"
          onClick={() => {
            try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
            setSnap(null);
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
