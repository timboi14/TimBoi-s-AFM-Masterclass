import { useState } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { SourceBadge } from './shared/SourceBadge';
import { ScenarioTab } from './tabs/ScenarioTab';
import { QuestionTab } from './tabs/QuestionTab';
import { SolutionTab } from './tabs/SolutionTab';
import { ExaminerTab } from './tabs/ExaminerTab';

type Tab = 'scenario' | 'question' | 'solution' | 'examiner';

interface Props {
  paper: Paper;
  onClose: () => void;
}

export function PaperDetail({ paper, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('scenario');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenario', label: 'Scenario' },
    { id: 'question', label: 'Question' },
    { id: 'solution', label: 'Solution walkthrough' },
    { id: 'examiner', label: 'Examiner says' },
  ];

  return (
    <div className="paper-detail" role="region" aria-label={`${paper.name} detail`}>
      <div className="paper-detail__header">
        <div>
          <h2 className="paper-detail__title">{paper.name}</h2>
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

      <div className="tab-nav" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab-nav__btn ${activeTab === tab.id ? 'tab-nav__btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'scenario' && <ScenarioTab paper={paper} />}
        {activeTab === 'question' && <QuestionTab paper={paper} />}
        {activeTab === 'solution' && <SolutionTab paper={paper} />}
        {activeTab === 'examiner' && <ExaminerTab paper={paper} />}
      </div>
    </div>
  );
}
