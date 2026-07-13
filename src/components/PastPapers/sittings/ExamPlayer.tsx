import { useEffect, useState } from 'react';
import type { Sitting } from '@/lib/sittings';
import {
  clearSession,
  freshSession,
  loadSession,
  reconcile,
  saveSession,
  type ExamSession,
} from '@/lib/exam-session';
import { ExamWorkspace } from './ExamWorkspace';
import { ItemReview } from './ItemReview';
import { MarkingDashboard } from './MarkingDashboard';
import {
  EndExamStage1,
  EndExamStage2,
  ExamSummaryScreen,
  InstructionsScreen,
  IntroScreen,
  LoadingSplash,
  ReadyToBegin,
  ReadyToStart,
  ResumeModal,
} from './CeremonyScreens';

interface Props {
  sitting: Sitting;
  guestId: string;
  onExit: () => void;
}

type Phase =
  | 'ready'
  | 'loading'
  | 'intro'
  | 'ready-begin'
  | 'instructions'
  | 'summary'
  | 'exam'
  | 'end1'
  | 'end2'
  | 'review'
  | 'marking';

/**
 * Full-ceremony exam player. Drives the iAssess launch chain inline (no new
 * tab): Ready to start, loading, introduction, Ready to begin, instructions,
 * exam summary, the timed workspace with one clock across all questions, a
 * two-stage end, an item review, then self-marking. A resumable session jumps
 * straight back to where it was left.
 */
export function ExamPlayer({ sitting, guestId, onExit }: Props) {
  const durationSeconds = sitting.timingMinutes * 60;
  const [session, setSession] = useState<ExamSession | null>(null);
  const [phase, setPhase] = useState<Phase>('ready');
  const [resumePrompt, setResumePrompt] = useState(false);

  // On mount, look for a resumable session.
  useEffect(() => {
    const existing = loadSession(guestId, sitting.id);
    if (existing && !existing.ended) {
      setSession(reconcile(existing));
      setPhase(existing.stage === 'marking' ? 'marking' : existing.stage === 'review' ? 'review' : 'exam');
      setResumePrompt(true);
    } else if (existing && existing.ended) {
      // Finished before: drop straight into the marking dashboard, no ceremony.
      setSession(existing);
      setPhase('marking');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist session changes immediately. The timer ticks once a second, so a
  // debounce would keep resetting before it fired and never save; a sub-1KB
  // localStorage write per second is cheap and keeps resume accurate.
  useEffect(() => {
    if (session) saveSession(guestId, session);
  }, [session, guestId]);

  // Loading splash auto-advances to the introduction.
  useEffect(() => {
    if (phase !== 'loading') return;
    const id = window.setTimeout(() => setPhase('intro'), 1100);
    return () => window.clearTimeout(id);
  }, [phase]);

  const update = (updater: (s: ExamSession) => ExamSession) =>
    setSession((s) => (s ? updater(s) : s));

  const beginExam = () => {
    const fresh: ExamSession = {
      ...freshSession(sitting.id, durationSeconds),
      stage: 'exam',
      running: true,
      startedAt: Date.now(),
      lastTickMs: Date.now(),
    };
    setSession(fresh);
    saveSession(guestId, fresh);
    setPhase('exam');
  };

  const restart = () => {
    clearSession(guestId, sitting.id);
    setSession(null);
    setResumePrompt(false);
    setPhase('ready');
  };

  const confirmEnd = () => {
    update((s) => ({ ...s, ended: true, running: false, lastTickMs: null, stage: 'review' }));
    setPhase('review');
  };

  const goMarking = () => {
    update((s) => ({ ...s, stage: 'marking' }));
    setPhase('marking');
  };

  // Resume overlay sits above whatever stage was restored.
  if (resumePrompt) {
    return (
      <div className="exam-player">
        <ResumeModal onResume={() => setResumePrompt(false)} onRestart={restart} />
      </div>
    );
  }

  return (
    <div className="exam-player">
      {phase === 'ready' && (
        <ReadyToStart onYes={() => setPhase('loading')} onNot={onExit} />
      )}

      {phase === 'loading' && <LoadingSplash />}

      {phase === 'intro' && <IntroScreen sitting={sitting} onContinue={() => setPhase('ready-begin')} />}

      {phase === 'ready-begin' && (
        <ReadyToBegin onYes={() => setPhase('instructions')} onNo={() => setPhase('intro')} />
      )}

      {phase === 'instructions' && (
        <InstructionsScreen onDone={() => setPhase('summary')} onBack={() => setPhase('intro')} />
      )}

      {phase === 'summary' && <ExamSummaryScreen sitting={sitting} onBegin={beginExam} />}

      {(phase === 'exam' || phase === 'end1' || phase === 'end2') && session && (
        <>
          <ExamWorkspace
            sitting={sitting}
            guestId={guestId}
            session={session}
            setSession={update}
            onEnd={() => setPhase('end1')}
          />
          {phase === 'end1' && (
            <EndExamStage1 onContinue={() => setPhase('end2')} onCancel={() => setPhase('exam')} />
          )}
          {phase === 'end2' && (
            <EndExamStage2 onConfirm={confirmEnd} onCancel={() => setPhase('exam')} />
          )}
        </>
      )}

      {phase === 'review' && session && (
        <ItemReview sitting={sitting} guestId={guestId} session={session} onSelfMark={goMarking} />
      )}

      {phase === 'marking' && (
        <div className="exam-player__marking">
          <div className="exam-player__marking-bar">
            <button type="button" className="exam-dialog__btn" onClick={() => setPhase('review')}>
              ← Item review
            </button>
            <button type="button" className="exam-dialog__btn" onClick={restart}>
              Retake this sitting
            </button>
            <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={onExit}>
              Back to sittings
            </button>
          </div>
          <MarkingDashboard sitting={sitting} guestId={guestId} />
        </div>
      )}
    </div>
  );
}

