import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Sitting } from '@/lib/sittings';
import { formatTiming } from '@/lib/sittings';

/* ── Generic dialog ─────────────────────────────────────────── */
export function ExamDialog({
  title,
  children,
  actions,
}: {
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) {
  return (
    <div className="exam-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="exam-dialog">
        <h3 className="exam-dialog__title">{title}</h3>
        <div className="exam-dialog__body">{children}</div>
        <div className="exam-dialog__actions">{actions}</div>
      </div>
    </div>
  );
}

/* ── Ready to start? ────────────────────────────────────────── */
export function ReadyToStart({ onYes, onNot }: { onYes: () => void; onNot: () => void }) {
  return (
    <ExamDialog
      title="Ready to start?"
      actions={
        <>
          <button type="button" className="exam-dialog__btn" onClick={onNot}>
            Not yet
          </button>
          <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={onYes}>
            Yes, start exam
          </button>
        </>
      }
    >
      <p>You are about to open the exam player. Give yourself a clear run at it.</p>
    </ExamDialog>
  );
}

/* ── Resume test? ───────────────────────────────────────────── */
export function ResumeModal({ onResume, onRestart }: { onResume: () => void; onRestart: () => void }) {
  return (
    <ExamDialog
      title="Resume test?"
      actions={
        <>
          <button type="button" className="exam-dialog__btn" onClick={onRestart}>
            No, start over
          </button>
          <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={onResume}>
            Yes, resume
          </button>
        </>
      }
    >
      <p>You have an exam in progress for this sitting. Pick up where you left off, or start again.</p>
    </ExamDialog>
  );
}

/* ── Ready to begin? ────────────────────────────────────────── */
export function ReadyToBegin({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <ExamDialog
      title="Ready to begin?"
      actions={
        <>
          <button type="button" className="exam-dialog__btn" onClick={onNo}>
            No
          </button>
          <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={onYes}>
            Yes
          </button>
        </>
      }
    >
      <p>
        If you are ready to begin your exam, click Yes. If you are not ready, click No and read the
        introduction again.
      </p>
    </ExamDialog>
  );
}

/* ── Loading splash ─────────────────────────────────────────── */
export function LoadingSplash() {
  return (
    <div className="exam-loading">
      <div className="exam-loading__spinner" aria-hidden />
      <p className="exam-loading__label">Loading the exam player...</p>
    </div>
  );
}

/* ── Scrollable panel with an Unseen-content gate on Continue ─── */
function GatedPanel({
  children,
  continueLabel,
  onContinue,
  backLabel,
  onBack,
}: {
  children: ReactNode;
  continueLabel: string;
  onContinue: () => void;
  backLabel?: string;
  onBack?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setSeen(true);
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    return () => el.removeEventListener('scroll', check);
  }, []);

  return (
    <div className="exam-panel">
      <div className="exam-panel__scroll" ref={ref}>
        {children}
      </div>
      <div className="exam-panel__foot">
        {!seen && <span className="exam-panel__gate">Scroll to the bottom to continue</span>}
        {onBack && (
          <button type="button" className="exam-dialog__btn" onClick={onBack}>
            {backLabel ?? 'Back'}
          </button>
        )}
        <button
          type="button"
          className="exam-dialog__btn exam-dialog__btn--primary"
          disabled={!seen}
          onClick={onContinue}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Introduction ───────────────────────────────────────────── */
export function IntroScreen({ sitting, onContinue }: { sitting: Sitting; onContinue: () => void }) {
  return (
    <GatedPanel continueLabel="Continue" onContinue={onContinue}>
      <h3 className="exam-panel__h">Introduction</h3>
      <p>
        Welcome to {sitting.title}. This is a practice run of the ACCA Advanced Performance
        Management exam, presented the way the real computer-based exam presents it.
      </p>
      <p>
        In the live exam your answers are marked by an expert. Here you mark yourself. Use the
        solution material provided to assess your performance: the self-marking resources include a
        marking guide and a sample answer for each question. After you end the exam, go to the
        self-marking screen to score your work.
      </p>
      <p>
        Read the instructions on the next screens carefully. When you reach the exam, use the
        scenario, the exhibits and the requirements together, and make clear which requirement each
        part of your answer relates to.
      </p>
    </GatedPanel>
  );
}

/* ── Instructions (paginated) ───────────────────────────────── */
const INSTRUCTION_PAGES: { title: string; body: ReactNode }[] = [
  {
    title: 'Exam format',
    body: (
      <ul className="exam-panel__list">
        <li>Section A contains one question worth 50 marks.</li>
        <li>Section B contains two questions worth 25 marks each.</li>
        <li>All questions are compulsory. The paper is worth 100 marks in total.</li>
        <li>The live exam lasts 3 hours and 15 minutes.</li>
      </ul>
    ),
  },
  {
    title: 'How marking works here',
    body: (
      <ul className="exam-panel__list">
        <li>The live exam is marked by an expert. This practice exam is self-marked.</li>
        <li>Each question has a marking guide and a sample answer on the self-marking screen.</li>
        <li>End the exam first, then open self-marking and award yourself the points you earned.</li>
      </ul>
    ),
  },
  {
    title: 'Your tools',
    body: (
      <ul className="exam-panel__list">
        <li>The Scratch Pad lets you make notes. Notes on the Scratch Pad are not marked.</li>
        <li>Cut, copy and paste work with Ctrl-X, Ctrl-C and Ctrl-V.</li>
        <li>The Symbol button inserts currency symbols.</li>
        <li>The Navigator jumps to any question and shows viewed, attempted and flagged status.</li>
      </ul>
    ),
  },
  {
    title: 'Before you start',
    body: (
      <ul className="exam-panel__list">
        <li>Indicate clearly which requirement each part of your response relates to.</li>
        <li>Use all scrollbars and open any on-screen exhibits before moving to the next question.</li>
        <li>Flag anything you want to come back to.</li>
      </ul>
    ),
  },
];

export function InstructionsScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const [page, setPage] = useState(0);
  const last = INSTRUCTION_PAGES.length - 1;
  const p = INSTRUCTION_PAGES[page];
  return (
    <div className="exam-panel">
      <div className="exam-panel__scroll">
        <div className="exam-panel__counter">
          Instructions {page + 1} of {INSTRUCTION_PAGES.length}
        </div>
        <h3 className="exam-panel__h">{p.title}</h3>
        {p.body}
      </div>
      <div className="exam-panel__foot">
        <button
          type="button"
          className="exam-dialog__btn"
          onClick={() => (page === 0 ? onBack() : setPage((n) => n - 1))}
        >
          {page === 0 ? 'Back to intro' : 'Previous'}
        </button>
        <button
          type="button"
          className="exam-dialog__btn exam-dialog__btn--primary"
          onClick={() => (page === last ? onDone() : setPage((n) => n + 1))}
        >
          {page === last ? 'Continue' : 'Next'}
        </button>
      </div>
    </div>
  );
}

/* ── Exam summary ───────────────────────────────────────────── */
export function ExamSummaryScreen({ sitting, onBegin }: { sitting: Sitting; onBegin: () => void }) {
  return (
    <div className="exam-panel">
      <div className="exam-panel__scroll">
        <h3 className="exam-panel__h">Exam summary</h3>
        <p>
          {sitting.title}. {sitting.totalMarks} marks. {sitting.questions.length}{' '}
          {sitting.questions.length === 1 ? 'question' : 'questions'}, all compulsory. Exam pace here
          is {formatTiming(sitting.timingMinutes)}.
        </p>
        <table className="exam-summary__table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Section</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {sitting.questions.map((q) => (
              <tr key={q.paper.id}>
                <td>
                  <strong>{q.label}</strong> {q.paper.name}
                </td>
                <td>{q.paper.paperSection}</td>
                <td>{q.paper.totalMarks}</td>
              </tr>
            ))}
            <tr className="exam-summary__total">
              <td colSpan={2}>Total</td>
              <td>{sitting.totalMarks}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="exam-panel__foot">
        <button type="button" className="exam-dialog__btn exam-dialog__btn--primary" onClick={onBegin}>
          Begin exam
        </button>
      </div>
    </div>
  );
}

/* ── End exam, two-stage ────────────────────────────────────── */
export function EndExamStage1({ onContinue, onCancel }: { onContinue: () => void; onCancel: () => void }) {
  return (
    <ExamDialog
      title="End exam"
      actions={
        <>
          <button type="button" className="exam-dialog__btn" onClick={onCancel}>
            Back to exam
          </button>
          <button type="button" className="exam-dialog__btn exam-dialog__btn--danger" onClick={onContinue}>
            Continue
          </button>
        </>
      }
    >
      <p>
        You have chosen to end the exam. If you continue, you will not be able to return to the
        exam. Are you sure you want to end the exam?
      </p>
    </ExamDialog>
  );
}

export function EndExamStage2({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <ExamDialog
      title="End exam confirmation"
      actions={
        <>
          <button type="button" className="exam-dialog__btn" onClick={onCancel}>
            No
          </button>
          <button type="button" className="exam-dialog__btn exam-dialog__btn--danger" onClick={onConfirm}>
            Yes, end the exam
          </button>
        </>
      }
    >
      <p>Are you sure you want to end the exam?</p>
    </ExamDialog>
  );
}

