import { useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { SourceBadge } from './shared/SourceBadge';
import { ScenarioTab } from './tabs/ScenarioTab';
import { QuestionTab } from './tabs/QuestionTab';
import { SolutionTab } from './tabs/SolutionTab';
import { ExaminerTab } from './tabs/ExaminerTab';
import { PracticeWorkspace } from '@/components/CBEWorkspace/PracticeWorkspace';
import { ExhibitsPanel } from '@/components/CBEWorkspace/ExhibitsPanel';

type Tab = 'scenario' | 'question' | 'practice' | 'solution' | 'examiner';

interface Props {
  paper: Paper;
  onClose: () => void;
}

export function PaperDetail({ paper, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('scenario');
  const [practiceLayout, setPracticeLayout] = useState<'split' | 'focus'>('split');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenario', label: 'Scenario' },
    { id: 'question', label: 'Question' },
    { id: 'practice', label: '⏱ Practice (CBE)' },
    { id: 'solution', label: 'Solution walkthrough' },
    { id: 'examiner', label: 'Examiner says' },
  ];

  return (
    <div className="paper-detail" role="region" aria-label={`${paper.name} detail`}>
      <div className="paper-detail__header">
        <div>
          <h2 className="paper-detail__title" tabIndex={-1}>{paper.name}</h2>
          <p className="paper-detail__meta">
            {paper.session} · Section {paper.paperSection} · {paper.totalMarks} marks · Syllabus {paper.syllabusSection}
          </p>
        </div>
        <button className="paper-detail__close" onClick={onClose} aria-label="Close detail panel">
          ×
        </button>
      </div>

      <div className="paper-detail__source">
        <SourceBadge source={paper.primarySource} />
        {paper.tags.length > 0 && (
          <div className="paper-detail__tags">
            {paper.tags.map((t) => (
              <span key={t} className="paper-detail__tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="tab-nav" role="tablist" aria-label={`${paper.name} sections`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${paper.id}-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${paper.id}-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`tab-nav__btn ${activeTab === tab.id ? 'tab-nav__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className="tab-content"
        role="tabpanel"
        id={`tabpanel-${paper.id}-${activeTab}`}
        aria-labelledby={`tab-${paper.id}-${activeTab}`}
      >
        {activeTab === 'scenario' && <ScenarioTab paper={paper} />}
        {activeTab === 'question' && <QuestionTab paper={paper} />}
        {activeTab === 'practice' && (
          <div className={`cbe-split cbe-split--${practiceLayout}`}>
            <div className="cbe-split__layout-toggle">
              <button
                type="button"
                onClick={() => setPracticeLayout('split')}
                className={`cbe-split__layout-btn ${practiceLayout === 'split' ? 'cbe-split__layout-btn--active' : ''}`}
                aria-pressed={practiceLayout === 'split'}
                title="Show question alongside the workspace"
              >
                ⬛ ⬛ Split view
              </button>
              <button
                type="button"
                onClick={() => setPracticeLayout('focus')}
                className={`cbe-split__layout-btn ${practiceLayout === 'focus' ? 'cbe-split__layout-btn--active' : ''}`}
                aria-pressed={practiceLayout === 'focus'}
                title="Hide the question and use the full width for the workspace"
              >
                ⬛ Focus mode
              </button>
            </div>
            {practiceLayout === 'split' && (
              <div className="cbe-split__left">
                <ExhibitsPanel paper={paper} />
              </div>
            )}
            <div className="cbe-split__right">
              <PracticeWorkspace
                paperId={paper.id}
                paperName={paper.name}
                paperSession={paper.session}
              />
            </div>
          </div>
        )}
        {activeTab === 'solution' && <SolutionTab paper={paper} />}
        {activeTab === 'examiner' && <ExaminerTab paper={paper} />}
      </div>
    </div>
  );
}
