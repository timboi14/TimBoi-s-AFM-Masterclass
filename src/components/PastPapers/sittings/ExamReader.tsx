import { useEffect, useRef } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { useCBE } from '@/components/CBEWorkspace/cbe-context';
import { applyStoredHighlights } from '@/lib/cbe-highlight';
import { loadHighlights } from '@/lib/cbe-tools-storage';
import { DataTable } from '../shared/DataTable';
import { WarnBox } from '../shared/WarnBox';

interface Props {
  paper: Paper;
  /** Fires once the reader has been scrolled to the bottom (Unseen-content guard). */
  onSeenToEnd: () => void;
}

/**
 * Exam-mode reference reader: scenario plus requirements only. Deliberately
 * does NOT expose the solution or examiner notes, since those are not available
 * in a live exam. Registers its body with the CBE context so the Highlight tool
 * works, and reports when the candidate has scrolled to the end so the bottom
 * bar can release the Unseen-content guard.
 */
export function ExamReader({ paper, onSeenToEnd }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { registerScenarioPanel, guestId, paperId } = useCBE();

  useEffect(() => {
    registerScenarioPanel(bodyRef.current);
    return () => registerScenarioPanel(null);
  }, [registerScenarioPanel]);

  useEffect(() => {
    if (bodyRef.current) {
      applyStoredHighlights(bodyRef.current, loadHighlights(guestId, paperId));
    }
  }, [paper.id, guestId, paperId]);

  // Mark "seen to end" when the candidate scrolls near the bottom. Short content
  // that does not scroll is treated as seen on mount.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const check = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) onSeenToEnd();
    };
    check();
    el.addEventListener('scroll', check, { passive: true });
    return () => el.removeEventListener('scroll', check);
  }, [paper.id, onSeenToEnd]);

  const totalMarks = paper.questionParts.reduce((n, p) => n + p.marks, 0);

  return (
    <div className="exam-reader" ref={bodyRef}>
      <div className="exam-reader__scenario">
        <h3 className="exam-reader__h">Scenario</h3>
        {paper.scenarioSteps.map((step) => (
          <section key={step.id} className="exam-reader__step">
            <h4 className="exam-reader__step-title">{step.title}</h4>
            {step.content.split('\n\n').map((para, i) => (
              <p key={i} className="exam-reader__para bionic-text" {...bionicHTML(para)} />
            ))}
            {step.table && (
              <DataTable
                headers={step.table.headers}
                rows={step.table.rows}
                highlightLastRow={step.table.highlightLastRow}
              />
            )}
            {step.warning && <WarnBox text={step.warning} />}
          </section>
        ))}

        {paper.exhibits && paper.exhibits.length > 0 && (
          <div className="exam-reader__exhibits">
            {paper.exhibits.map((ex) => (
              <section key={ex.title} className="exam-reader__step">
                <h4 className="exam-reader__step-title">{ex.title}</h4>
                {ex.content.split('\n\n').map((para, i) => (
                  <p key={i} className="exam-reader__para bionic-text" {...bionicHTML(para)} />
                ))}
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="exam-reader__reqs">
        <h3 className="exam-reader__h">
          Requirements <span className="exam-reader__marks">{totalMarks} marks</span>
        </h3>
        <ol className="exam-reader__req-list">
          {paper.questionParts.map((part) => (
            <li key={part.label} className="exam-reader__req">
              <div className="exam-reader__req-head">
                <span className="exam-reader__req-label">{part.label}</span>
                <span className="exam-reader__req-marks">{part.marks} marks</span>
              </div>
              <p className="exam-reader__para bionic-text" {...bionicHTML(part.requirement)} />
            </li>
          ))}
        </ol>
        <p className="exam-reader__hint">
          Indicate clearly which requirement each part of your response relates to.
        </p>
      </div>
    </div>
  );
}

