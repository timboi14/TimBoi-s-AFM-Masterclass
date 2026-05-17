import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
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
  const [pane, setPane] = useState<Pane>('word');
  const [state, setState] = useState<CBEWorkspaceState>(() =>
    fanName ? reconcileTimer(loadWorkspace(fanName, paperId)) : emptyState(),
  );
  const lastSavedRef = useRef<string>('');

  // When fanName/paperId changes (user switches paper or first signs in), rehydrate.
  useEffect(() => {
    if (!fanName) return;
    setState(reconcileTimer(loadWorkspace(fanName, paperId)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fanName, paperId]);

  // Debounced autosave.
  useEffect(() => {
    if (!fanName) return;
    const serialised = JSON.stringify(state);
    if (serialised === lastSavedRef.current) return;
    const id = window.setTimeout(() => {
      saveWorkspace(fanName, paperId, state);
      lastSavedRef.current = serialised;
    }, 500);
    return () => window.clearTimeout(id);
  }, [state, fanName, paperId]);

  const savedAgo = useMemo(() => {
    if (!state.updatedAt) return null;
    const secs = Math.max(0, Math.floor((Date.now() - state.updatedAt) / 1000));
    if (secs < 5) return 'Saved just now';
    if (secs < 60) return `Saved ${secs}s ago`;
    if (secs < 3600) return `Saved ${Math.floor(secs / 60)} min ago`;
    return `Saved ${Math.floor(secs / 3600)} h ago`;
  }, [state.updatedAt]);

  if (!fanName) {
    return (
      <div className="practice-workspace practice-workspace--locked">
        <p>
          Please set a fan name (top of the page) before using the practice workspace.
          Your work is auto-saved against that name on this browser.
        </p>
      </div>
    );
  }

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
        `Clear ALL practice work for "${paperName}" under fan name ${fanName}? This cannot be undone.`,
      )
    ) {
      clearWorkspace(fanName, paperId);
      setState(emptyState());
    }
  };

  return (
    <div className="practice-workspace">
      <div className="practice-workspace__topbar">
        <div className="practice-workspace__brand">
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
        <span className="practice-workspace__user">
          <span aria-hidden>👤</span> {fanName}
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
          <CBEWordProcessor value={state.word} onChange={setWord} />
        ) : (
          <CBESpreadsheet value={state.sheet} onChange={setSheet} />
        )}
      </div>

      <AIMarker paper={paper} word={state.word} sheet={state.sheet} />

      <p className="practice-workspace__footnote">
        Everything you type is auto-saved against <strong>{fanName}</strong> for this paper, in this browser.
        It will be here when you come back.
      </p>
    </div>
  );
}
