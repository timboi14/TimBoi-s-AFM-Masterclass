import { useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { ScenarioTab } from '@/components/PastPapers/tabs/ScenarioTab';
import { QuestionTab } from '@/components/PastPapers/tabs/QuestionTab';

interface Props {
  paper: Paper;
}

type ExhibitView = 'scenario' | 'question';

/**
 * Left-pane exhibit viewer used inside the CBE split view.
 * Mirrors the real ACCA CBE layout where the question scenario is
 * displayed alongside the answer panes — switchable between the
 * full scenario walkthrough and the question requirements.
 */
export function ExhibitsPanel({ paper }: Props) {
  const [view, setView] = useState<ExhibitView>('scenario');

  return (
    <div className="exhibits-panel">
      <div className="exhibits-panel__header">
        <div className="exhibits-panel__label">Question reference</div>
        <div className="exhibits-panel__tabs" role="tablist" aria-label="Exhibit view">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'scenario'}
            className={`exhibits-panel__tab ${view === 'scenario' ? 'exhibits-panel__tab--active' : ''}`}
            onClick={() => setView('scenario')}
          >
            Scenario
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'question'}
            className={`exhibits-panel__tab ${view === 'question' ? 'exhibits-panel__tab--active' : ''}`}
            onClick={() => setView('question')}
          >
            Question
          </button>
        </div>
      </div>
      <div className="exhibits-panel__body">
        {view === 'scenario' ? <ScenarioTab paper={paper} /> : <QuestionTab paper={paper} />}
      </div>
    </div>
  );
}
