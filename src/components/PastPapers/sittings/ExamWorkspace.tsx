import { useEffect, useMemo, useRef, useState } from 'react';
import type { Sitting } from '@/lib/sittings';
import type { ResponseOption } from '@/data/pastpapers/schema';
import type { ExamSession } from '@/lib/exam-session';
import {
  loadWorkspace,
  reconcileTimer,
  saveWorkspace,
  type CBEWorkspaceState,
} from '@/lib/cbe-storage';
import { hasAnswer, loadFlag } from '@/lib/cbe-tools-storage';
import { CBEProvider, useCBE } from '@/components/CBEWorkspace/cbe-context';
import { CBEToolRibbon } from '@/components/CBEWorkspace/CBEToolRibbon';
import { CBEPopups } from '@/components/CBEWorkspace/CBEPopups';
import { CBETimer } from '@/components/CBEWorkspace/CBETimer';
import { CBEWordProcessor } from '@/components/CBEWorkspace/CBEWordProcessor';
import { CBESpreadsheet } from '@/components/CBEWorkspace/CBESpreadsheet';
import { ExamReader } from './ExamReader';

interface Props {
  sitting: Sitting;
  guestId: string;
  session: ExamSession;
  setSession: (updater: (s: ExamSession) => ExamSession) => void;
  onEnd: () => void;
}

/** Per-question response area: word processor + spreadsheet, autosaved per paper. */
function QuestionResponse({
  guestId,
  paperId,
  paperSection,
  responseOptions,
}: {
  guestId: string;
  paperId: string;
  paperSection: 'A' | 'B';
  responseOptions?: ResponseOption[];
}) {
  const options: ResponseOption[] = responseOptions && responseOptions.length > 0 ? responseOptions : ['word', 'sheet'];
  const showTabs = options.length > 1;
  const [pane, setPane] = useState<'word' | 'sheet'>(options[0]);
  const [state, setState] = useState<CBEWorkspaceState>(() => reconcileTimer(loadWorkspace(guestId, paperId)));
  const lastSaved = useRef('');

  useEffect(() => {
    const serialised = JSON.stringify(state);
    if (serialised === lastSaved.current) return;
    const id = window.setTimeout(() => {
      saveWorkspace(guestId, paperId, state);
      lastSaved.current = serialised;
    }, 500);
    return () => window.clearTimeout(id);
  }, [state, guestId, paperId]);

  return (
    <div className="exam-response">
      {showTabs ? (
        <div className="exam-response__tabs" role="tablist" aria-label="Response option">
          <button
            type="button"
            role="tab"
            aria-selected={pane === 'word'}
            className={`exam-response__tab ${pane === 'word' ? 'exam-response__tab--active' : ''}`}
            onClick={() => setPane('word')}
          >
            📝 Word processor
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={pane === 'sheet'}
            className={`exam-response__tab ${pane === 'sheet' ? 'exam-response__tab--active' : ''}`}
            onClick={() => setPane('sheet')}
          >
            📊 Spreadsheet
          </button>
        </div>
      ) : (
        <div className="exam-response__single" aria-label="Response option">
          {options[0] === 'word' ? '📝 Word processor' : '📊 Spreadsheet'}
        </div>
      )}
      <div className="exam-response__pane">
        {pane === 'word' ? (
          <CBEWordProcessor
            value={state.word}
            onChange={(html) => setState((p) => ({ ...p, word: html }))}
            paperSection={paperSection}
          />
        ) : (
          <CBESpreadsheet value={state.sheet} onChange={(sheet) => setState((p) => ({ ...p, sheet }))} />
        )}
      </div>
    </div>
  );
}

/** The chrome that lives inside the CBE context (so the ribbon + flag work). */
function WorkspaceInner({ sitting, guestId, session, setSession, onEnd }: Props) {
  const { flagged, toggleFlag } = useCBE();
  const total = sitting.questions.length;
  const current = Math.min(session.currentQ, total - 1);
  const q = sitting.questions[current];
  const [seen, setSeen] = useState(false);
  const [showUnseen, setShowUnseen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Reset the per-question "seen to end" gate whenever the question changes.
  useEffect(() => {
    setSeen(false);
    setShowUnseen(false);
  }, [current]);

  const markViewed = () =>
    setSession((s) => (s.viewed.includes(current) ? s : { ...s, viewed: [...s.viewed, current] }));

  const goTo = (idx: number) => {
    setNavOpen(false);
    setSession((s) => ({ ...s, currentQ: Math.max(0, Math.min(total - 1, idx)) }));
  };

  const onNext = () => {
    if (!seen) {
      setShowUnseen(true);
      return;
    }
    if (current < total - 1) goTo(current + 1);
  };

  const timeUp = session.secondsRemaining <= 0;

  return (
    <div className="exam-workspace">
      <div className="exam-workspace__header cbe-header">
        <div className="exam-workspace__brand">
          <span className="cbe-header-dot" aria-hidden />
          <span className="exam-workspace__exam-title">{sitting.title}</span>
          <span className="exam-workspace__progress">
            {q.label} of {total}
          </span>
        </div>
        <CBETimer
          secondsRemaining={session.secondsRemaining}
          running={session.running}
          onTick={(n) => setSession((s) => ({ ...s, secondsRemaining: n, lastTickMs: Date.now() }))}
          onStart={() => setSession((s) => ({ ...s, running: true, lastTickMs: Date.now() }))}
          onPause={() => setSession((s) => ({ ...s, running: false, lastTickMs: null }))}
          onReset={() => {
            if (window.confirm('Reset the exam clock? Your written answers are kept.')) {
              setSession((s) => ({
                ...s,
                secondsRemaining: sitting.timingMinutes * 60,
                running: false,
                lastTickMs: null,
              }));
            }
          }}
        />
      </div>

      <CBEToolRibbon />

      <div className="exam-workspace__body">
        <div className="exam-workspace__reader">
          <ExamReader
            key={q.paper.id}
            paper={q.paper}
            onSeenToEnd={() => {
              setSeen(true);
              markViewed();
            }}
          />
        </div>
        <div className="exam-workspace__response">
          <QuestionResponse
            key={q.paper.id}
            guestId={guestId}
            paperId={q.paper.id}
            paperSection={q.paper.paperSection}
            responseOptions={q.paper.responseOptions}
          />
        </div>
      </div>

      <div className="exam-workspace__footbar">
        <button
          type="button"
          className="exam-workspace__flag"
          aria-pressed={flagged}
          onClick={toggleFlag}
        >
          {flagged ? '⚑ Flagged' : '⚐ Flag for review'}
        </button>

        <div className="exam-workspace__nav">
          <button
            type="button"
            className="exam-workspace__navbtn"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ← Previous
          </button>
          <div className="exam-workspace__navigator-wrap">
            <button
              type="button"
              className="exam-workspace__navbtn"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              Navigator
            </button>
            {navOpen && (
              <div className="exam-navigator" role="menu">
                <p className="exam-navigator__title">Jump to a question</p>
                {sitting.questions.map((sq, i) => {
                  const attempted = hasAnswer(guestId, sq.paper.id);
                  const isFlagged = loadFlag(sq.paper.id);
                  const status = !session.viewed.includes(i)
                    ? 'Unseen'
                    : attempted
                      ? 'Attempted'
                      : 'Not attempted';
                  return (
                    <button
                      key={sq.paper.id}
                      type="button"
                      className={`exam-navigator__item ${i === current ? 'exam-navigator__item--current' : ''}`}
                      onClick={() => goTo(i)}
                    >
                      <span className="exam-navigator__q">{sq.label}</span>
                      <span className="exam-navigator__name">{sq.paper.name}</span>
                      <span className={`exam-navigator__status exam-navigator__status--${status.toLowerCase().replace(' ', '-')}`}>
                        {status}
                      </span>
                      {isFlagged && <span className="exam-navigator__flag" aria-label="Flagged">⚑</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="button"
            className="exam-workspace__navbtn"
            onClick={onNext}
            disabled={current === total - 1}
          >
            Next →
          </button>
        </div>

        <button type="button" className="exam-workspace__end" onClick={onEnd}>
          End exam
        </button>
      </div>

      {timeUp && (
        <div className="exam-workspace__timeup" role="status">
          Time is up. You can still review and end the exam, but the clock has stopped.
        </div>
      )}

      {showUnseen && (
        <div className="exam-overlay" role="dialog" aria-modal="true" aria-label="Unseen content">
          <div className="exam-dialog">
            <h3 className="exam-dialog__title">Unseen content</h3>
            <p className="exam-dialog__body">
              You have not yet viewed the entire screen. Please use all scrollbars and open any
              on-screen exhibits before moving on.
            </p>
            <div className="exam-dialog__actions">
              <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={() => setShowUnseen(false)}>
                Back to the question
              </button>
            </div>
          </div>
        </div>
      )}

      <CBEPopups />
    </div>
  );
}

export function ExamWorkspace(props: Props) {
  const current = Math.min(props.session.currentQ, props.sitting.questions.length - 1);
  const paperId = props.sitting.questions[current].paper.id;
  // Re-mount the CBE context per question so highlights, flag and popups bind to
  // the active paper. useMemo keeps the key stable across unrelated re-renders.
  const ctxKey = useMemo(() => paperId, [paperId]);
  return (
    <CBEProvider key={ctxKey} paperId={paperId} guestId={props.guestId}>
      <WorkspaceInner {...props} />
    </CBEProvider>
  );
}

