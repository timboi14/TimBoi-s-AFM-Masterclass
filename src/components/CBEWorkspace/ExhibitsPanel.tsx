import { useEffect, useRef, useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { ScenarioTab } from '@/components/PastPapers/tabs/ScenarioTab';
import { QuestionTab } from '@/components/PastPapers/tabs/QuestionTab';
import { SolutionTab } from '@/components/PastPapers/tabs/SolutionTab';
import { ExaminerTab } from '@/components/PastPapers/tabs/ExaminerTab';
import { useCBE } from './cbe-context';
import { applyStoredHighlights } from '@/lib/cbe-highlight';
import { loadHighlights } from '@/lib/cbe-tools-storage';

interface Props {
  paper: Paper;
}

type ExhibitView = 'scenario' | 'question' | 'solution' | 'examiner';

const VIEWS: { id: ExhibitView; label: string }[] = [
  { id: 'scenario', label: 'Scenario' },
  { id: 'question', label: 'Question' },
  { id: 'solution', label: 'Solution walkthrough' },
  { id: 'examiner', label: 'Examiner says' },
];

/**
 * Left-pane exhibit viewer used inside the CBE split view. Registers its body
 * with the CBE context so the ribbon Highlight tool can mark up the bionic
 * scenario text, and re-applies persisted highlights after each render.
 *
 * Beyond the scenario and question requirements, the solution walkthrough and
 * examiner notes are switchable here too, so they can be referenced alongside
 * the workspace without leaving the timed practice view.
 */
export function ExhibitsPanel({ paper }: Props) {
  const [view, setView] = useState<ExhibitView>('scenario');
  const bodyRef = useRef<HTMLDivElement>(null);
  const { registerScenarioPanel, guestId, paperId } = useCBE();

  useEffect(() => {
    registerScenarioPanel(bodyRef.current);
    return () => registerScenarioPanel(null);
  }, [registerScenarioPanel]);

  // Re-apply saved highlights whenever the rendered content changes.
  useEffect(() => {
    if (bodyRef.current) {
      applyStoredHighlights(bodyRef.current, loadHighlights(guestId, paperId));
    }
  }, [view, paper.id, guestId, paperId]);

  return (
    <div className="exhibits-panel">
      <div className="exhibits-panel__header">
        <div className="exhibits-panel__label sidebar-section-label">Question reference</div>
        <div className="exhibits-panel__tabs" role="tablist" aria-label="Exhibit view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={view === v.id}
              className={`exhibits-panel__tab sidebar-tile ${view === v.id ? 'exhibits-panel__tab--active' : ''}`}
              onClick={() => setView(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="exhibits-panel__body" ref={bodyRef}>
        {view === 'scenario' && <ScenarioTab paper={paper} />}
        {view === 'question' && <QuestionTab paper={paper} />}
        {view === 'solution' && <SolutionTab paper={paper} />}
        {view === 'examiner' && <ExaminerTab paper={paper} />}
      </div>
    </div>
  );
}
