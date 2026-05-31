import { useEffect, useRef, useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { ScenarioTab } from '@/components/PastPapers/tabs/ScenarioTab';
import { QuestionTab } from '@/components/PastPapers/tabs/QuestionTab';
import { useCBE } from './cbe-context';
import { applyStoredHighlights } from '@/lib/cbe-highlight';
import { loadHighlights } from '@/lib/cbe-tools-storage';

interface Props {
  paper: Paper;
}

type ExhibitView = 'scenario' | 'question';

/**
 * Left-pane exhibit viewer used inside the CBE split view. Registers its body
 * with the CBE context so the ribbon Highlight tool can mark up the bionic
 * scenario text, and re-applies persisted highlights after each render.
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
          <button
            type="button"
            role="tab"
            aria-selected={view === 'scenario'}
            className={`exhibits-panel__tab sidebar-tile ${view === 'scenario' ? 'exhibits-panel__tab--active' : ''}`}
            onClick={() => setView('scenario')}
          >
            Scenario
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'question'}
            className={`exhibits-panel__tab sidebar-tile ${view === 'question' ? 'exhibits-panel__tab--active' : ''}`}
            onClick={() => setView('question')}
          >
            Question
          </button>
        </div>
      </div>
      <div className="exhibits-panel__body" ref={bodyRef}>
        {view === 'scenario' ? <ScenarioTab paper={paper} /> : <QuestionTab paper={paper} />}
      </div>
    </div>
  );
}
