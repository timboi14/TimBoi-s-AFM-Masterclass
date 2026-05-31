import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { resolveIdentity } from '@/lib/identity';
import {
  clearWorkspace,
  emptyState,
  loadWorkspace,
  reconcileTimer,
  saveWorkspace,
  DEFAULT_DURATION_SECONDS,
  type CBEWorkspaceState,
} from '@/lib/cbe-storage';
import type { Paper } from '@/data/pastpapers/schema';
import { CBETimer } from './CBETimer';
import { CBEWordProcessor } from './CBEWordProcessor';
import { CBESpreadsheet } from './CBESpreadsheet';
import { AIMarker } from './AIMarker';

interface Props {
  /** Full paper object — needed by the AI marker for the requirement + marking guide. */
  paper: Paper;
  /** Kept for the topbar — duplicates Paper but matches existing call sites. */
  paperId: string;
  paperName: string;
  paperSession: string;
}

type Pane = 'word' | 'sheet';

/**
 * ACCA-CBE practice workspace. Top-right countdown (3h 15m), two-pane
 * answer area (word processor + spreadsheet), full per-user-per-paper
 * persistence. Designed to feel like the real CBE editor without trying
 * to be a pixel-perfect clone of it.
 */
export function PracticeWorkspace({ paper, paperId, paperName, paperSession }: Props) {
  const { fanName } = useStore();
  // Resolve identity — falls back to a stable "Demo · ABC123" handle when
  // no fanName is set, so the workspace never blocks and the badge never
  // shows a hard-coded username. Once auth lands (Spec §3) this becomes a
  // server-resolved handle.
  const identity = useMemo(() => resolveIdentity(fanName), [fanName]);
  const userKey = identity.storageKey;

  const [pane, setPane] = useState<Pane>('word');
  const [state, setState] = useState<CBEWorkspaceState>(() =>
    reconcileTimer(loadWorkspace(userKey, paperId)),
  );
  const lastSavedRef = useRef<string>('');

  // When identity/paperId changes (user switches paper or first signs in), rehydrate.
  useEffect(() => {
    setState(reconcileTimer(loadWorkspace(userKey, paperId)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, paperId]);

  // Debounced autosave.
  useEffect(() => {
    const serialised = JSON.stringify(state);
    if (serialised === lastSavedRef.current) return;
    const id = window.setTimeout(() => {
      saveWorkspace(userKey, paperId, state);
      lastSavedRef.current = serialised;
    }, 500);
    return () => window.clearTimeout(id);
  }, [state, userKey, paperId]);

  const savedAgo = useMemo(() => {
    if (!state.updatedAt) return null;
    const secs = Math.max(0, Math.floor((Date.now() - state.updatedAt) / 1000));
    if (secs < 5) return 'Saved just now';
    if (secs < 60) return `Saved ${secs}s ago`;
    if (secs < 3600) return `Saved ${Math.floor(secs / 60)} min ago`;
    return `Saved ${Math.floor(secs / 3600)} h ago`;
  }, [state.updatedAt]);

  const setTimerSeconds = (s: number) =>
    setState((prev) => ({
      ...prev,
      timerSecondsRemaining: s,
      timerLastTickMs: prev.timerRunning ? Date.now() : prev.timerLastTickMs,
    }));

  const startTimer = () =>
    setState((prev) => ({
      ...prev,
      timerRunning: true,
      timerLastTickMs: Date.now(),
    }));

  const pauseTimer = () =>
    setState((prev) => ({ ...prev, timerRunning: false, timerLastTickMs: null }));

  const resetTimer = () => {
    if (
      state.timerSecondsRemaining !== DEFAULT_DURATION_SECONDS &&
      !window.confirm('Reset timer back to 3 hours 15 minutes? Your written answers are kept.')
    ) {
      return;
    }
    setState((prev) => ({
      ...prev,
      timerSecondsRemaining: DEFAULT_DURATION_SECONDS,
      timerRunning: false,
      timerLastTickMs: null,
    }));
  };

  const setWord = (html: string) => setState((prev) => ({ ...prev, word: html }));
  const setSheet = (sheet: string[][]) => setState((prev) => ({ ...prev, sheet }));

  const clearAll = () => {
    if (
      window.confirm(
        `Clear ALL practice work for "${paperName}" under ${identity.displayLabel}? This cannot be undone.`,
      )
    ) {
      clearWorkspace(userKey, paperId);
      setState(emptyState());
    }
  };

  return (
    <div className="practice-workspace">
      <div className="practice-workspace__topbar cbe-header">
        <div className="practice-workspace__brand">
          <span className="cbe-header-dot" aria-hidden />
          <div className="practice-workspace__brand-label">ACCA-style CBE</div>
          <div className="practice-workspace__brand-paper">
            {paperName} · {paperSession}
          </div>
        </div>
        <CBETimer
          secondsRemaining={state.timerSecondsRemaining}
          running={state.timerRunning}
          onTick={setTimerSeconds}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
        />
      </div>

      <div className="practice-workspace__meta">
        <span
          className="practice-workspace__user"
          title="Demo handle — auto-assigned. Once auth is wired this becomes your signed-in handle."
        >
          <span aria-hidden>👤</span> {identity.displayLabel}
          <span className="ml-1 text-[10px] uppercase tracking-wider text-muted font-bold">· local</span>
        </span>
        {savedAgo && <span className="practice-workspace__saved">✓ {savedAgo}</span>}
        <button type="button" onClick={clearAll} className="practice-workspace__clear-all">
          Clear all my work for this paper
        </button>
      </div>

      <div className="practice-workspace__pane-tabs" role="tablist" aria-label="Answer pane">
        <button
          type="button"
          role="tab"
          aria-selected={pane === 'word'}
          className={`practice-workspace__pane-tab ${pane === 'word' ? 'practice-workspace__pane-tab--active' : ''}`}
          onClick={() => setPane('word')}
        >
          📝 Word processor
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={pane === 'sheet'}
          className={`practice-workspace__pane-tab ${pane === 'sheet' ? 'practice-workspace__pane-tab--active' : ''}`}
          onClick={() => setPane('sheet')}
        >
          📊 Spreadsheet
        </button>
      </div>

      <div className="practice-workspace__pane">
        {pane === 'word' ? (
          <CBEWordProcessor value={state.word} onChange={setWord} paperSection={paper.paperSection} />
        ) : (
          <CBESpreadsheet value={state.sheet} onChange={setSheet} />
        )}
      </div>

      <AIMarker paper={paper} word={state.word} sheet={state.sheet} />

      <p className="practice-workspace__footnote">
        Everything you type is auto-saved against <strong>{identity.displayLabel}</strong> for this paper, in this browser.
        It will be here when you come back.
      </p>
    </div>
  );
}
