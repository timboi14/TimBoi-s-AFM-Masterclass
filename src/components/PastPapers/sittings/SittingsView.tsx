import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SITTINGS, getSitting } from '@/lib/sittings';
import { loadSession } from '@/lib/exam-session';
import {
  loadHidden,
  loadOffline,
  persistHidden,
  persistOffline,
  toggleInSet,
} from '@/lib/sitting-prefs';
import { useStore } from '@/lib/store';
import { resolveIdentity } from '@/lib/identity';
import { SittingCard } from './SittingCard';
import { SittingLauncher } from './SittingLauncher';

export function SittingsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('s');
  const { fanName } = useStore();
  const guestId = useMemo(() => resolveIdentity(fanName).storageKey, [fanName]);

  const [hidden, setHidden] = useState<Set<string>>(() => loadHidden());
  const [offline, setOffline] = useState<Set<string>>(() => loadOffline());
  const [showHidden, setShowHidden] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  const setSelectedId = useCallback(
    (id: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) next.set('s', id);
          else {
            next.delete('s');
            next.delete('mode');
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleHide = (id: string) => {
    setHidden((prev) => {
      const next = toggleInSet(prev, id);
      persistHidden(next);
      return next;
    });
  };
  const toggleOffline = (id: string) => {
    setOffline((prev) => {
      const next = toggleInSet(prev, id);
      persistOffline(next);
      return next;
    });
  };

  // Recompute resume state when the selection clears (returning from a sitting).
  const [resumeTick, setResumeTick] = useState(0);
  const isResumable = useCallback(
    (id: string) => {
      void resumeTick; // dependency: refresh after a sitting closes
      const s = loadSession(guestId, id);
      return !!s && !s.ended;
    },
    [guestId, resumeTick],
  );

  const selectedSitting = selectedId ? getSitting(selectedId) ?? null : null;

  useEffect(() => {
    if (selectedSitting && launcherRef.current) {
      launcherRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedSitting?.id]);

  const visible = SITTINGS.filter((s) => showHidden || !hidden.has(s.id));
  const hiddenCount = SITTINGS.filter((s) => hidden.has(s.id)).length;
  const fullCount = SITTINGS.filter((s) => s.complete).length;

  return (
    <div className="sittings-view">
      <div className="sittings-view__notice">
        <span aria-hidden>🎟️</span>
        <span>
          Each card is a whole sitting, the way the real ACCA iAssess exam presents it:
          Section A worth 50 marks plus two Section B questions worth 25 each.{' '}
          <strong>{fullCount}</strong> of the {SITTINGS.length} sittings here are full
          papers. Open one and pick how you want to sit it.
        </span>
      </div>

      {hiddenCount > 0 && (
        <div className="sittings-view__hidden-toggle">
          <button type="button" onClick={() => setShowHidden((v) => !v)}>
            {showHidden ? 'Hide hidden sittings' : `Show hidden sittings (${hiddenCount})`}
          </button>
        </div>
      )}

      <div className="sittings-grid">
        {visible.map((s) => (
          <SittingCard
            key={s.id}
            sitting={s}
            resumable={isResumable(s.id)}
            offline={offline.has(s.id)}
            hidden={hidden.has(s.id)}
            onStart={() => setSelectedId(s.id === selectedId ? null : s.id)}
            onToggleOffline={() => toggleOffline(s.id)}
            onToggleHide={() => toggleHide(s.id)}
          />
        ))}
      </div>

      {selectedSitting && (
        <div ref={launcherRef} className="sitting-launcher-mount">
          <SittingLauncher
            key={selectedSitting.id}
            sitting={selectedSitting}
            guestId={guestId}
            onClose={() => {
              setSelectedId(null);
              setResumeTick((t) => t + 1);
            }}
          />
        </div>
      )}
    </div>
  );
}

