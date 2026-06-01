import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAPERS } from '@/data/pastpapers/papers';
import type { DataSource, PaperSection, TopicCategory } from '@/data/pastpapers/schema';
import { PaperCard } from './PaperCard';
import { PaperDetail } from './PaperDetail';
import { SOURCE_META } from './shared/SourceBadge';
import { ScenarioTab } from './tabs/ScenarioTab';
import { QuestionTab } from './tabs/QuestionTab';
import { SolutionTab } from './tabs/SolutionTab';
import { ExaminerTab } from './tabs/ExaminerTab';

// Sections available in a pop-out reference window (the timed Practice CBE is
// never popped out — it's the thing you write in, not a reference).
const POPOUT_TABS = ['scenario', 'question', 'solution', 'examiner'] as const;
const POPOUT_LABELS: Record<(typeof POPOUT_TABS)[number], string> = {
  scenario: 'Scenario',
  question: 'Question',
  solution: 'Solution walkthrough',
  examiner: 'Examiner says',
};

type FilterSection = 'all' | PaperSection;
type FilterTopic = 'all' | TopicCategory;

const TAB_IDS = ['scenario', 'question', 'practice', 'solution', 'examiner'] as const;
type Tab = (typeof TAB_IDS)[number];
const isTab = (v: unknown): v is Tab =>
  typeof v === 'string' && (TAB_IDS as readonly string[]).includes(v);

export interface PastPapersViewHandle {
  setSectionFilter: (s: FilterSection) => void;
  setTopicFilter: (t: FilterTopic) => void;
  resetFilters: () => void;
}

export const PastPapersView = forwardRef<PastPapersViewHandle>(function PastPapersView(_, ref) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('p');
  const isPopout = searchParams.get('popout') === 'true';
  const urlTab = searchParams.get('tab');
  const activeTab: Tab = isTab(urlTab) ? urlTab : 'scenario';
  const setSelectedId = useCallback(
    (id: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) {
            next.set('p', id);
          } else {
            next.delete('p');
            next.delete('tab');
            next.delete('sub');
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );
  const setActiveTab = useCallback(
    (tab: Tab) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (tab === 'scenario') next.delete('tab');
          else next.set('tab', tab);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );
  const [filterSection, setFilterSection] = useState<FilterSection>('all');
  const [filterTopic, setFilterTopic] = useState<FilterTopic>('all');
  const detailRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      setSectionFilter: (s) => setFilterSection(s),
      setTopicFilter: (t) => setFilterTopic(t),
      resetFilters: () => {
        setFilterSection('all');
        setFilterTopic('all');
      },
    }),
    [],
  );

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => {
      if (filterSection !== 'all' && p.paperSection !== filterSection) return false;
      if (filterTopic !== 'all' && !p.topics.includes(filterTopic)) return false;
      return true;
    });
  }, [filterSection, filterTopic]);

  const sectionCounts = useMemo(() => {
    const base = PAPERS.filter((p) => filterTopic === 'all' || p.topics.includes(filterTopic));
    return {
      all: base.length,
      A: base.filter((p) => p.paperSection === 'A').length,
      B: base.filter((p) => p.paperSection === 'B').length,
    };
  }, [filterTopic]);

  const topicCounts = useMemo(() => {
    const base = PAPERS.filter((p) => filterSection === 'all' || p.paperSection === filterSection);
    return {
      all: base.length,
      inv: base.filter((p) => p.topics.includes('inv')).length,
      hedg: base.filter((p) => p.topics.includes('hedg')).length,
      ma: base.filter((p) => p.topics.includes('ma')).length,
    };
  }, [filterSection]);

  const selectedPaper = PAPERS.find((p) => p.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedPaper && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const heading = detailRef.current.querySelector<HTMLElement>('.paper-detail__title');
      heading?.focus();
    }
  }, [selectedPaper?.id]);

  // Standalone reference window: a minimal tab bar + the selected section,
  // no filters / grid / site chrome. Tab clicks reuse setActiveTab, which keeps
  // the ?tab param in sync (and preserves ?p and ?popout). Returned after all
  // hooks above so hook order is identical across both render paths.
  if (isPopout) {
    const popTab: (typeof POPOUT_TABS)[number] =
      activeTab === 'practice' ? 'question' : activeTab;
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-white">
        <div className="flex border-b border-gray-200 px-4 pt-2">
          {POPOUT_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`mr-1 rounded-t-md px-4 py-2 text-sm font-medium ${
                popTab === tab
                  ? 'bg-white border border-b-white border-gray-200 -mb-px'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {POPOUT_LABELS[tab]}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedPaper ? (
            <p className="text-gray-500">
              No paper matches <code>?p={selectedId}</code>.
            </p>
          ) : popTab === 'scenario' ? (
            <ScenarioTab paper={selectedPaper} />
          ) : popTab === 'question' ? (
            <QuestionTab paper={selectedPaper} />
          ) : popTab === 'solution' ? (
            <SolutionTab paper={selectedPaper} />
          ) : (
            <ExaminerTab paper={selectedPaper} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="past-papers-view">
      <div className="source-notice">
        <span aria-hidden>📎</span>
        <span>
          Every number in this module is pulled directly from verified source files.{' '}
          {(['Q', 'A', 'S', 'E'] as DataSource[]).map((code, i, arr) => {
            const m = SOURCE_META[code];
            return (
              <span key={code}>
                <strong className={`source-legend source-legend--${m.colour}`}>
                  {m.colour[0].toUpperCase() + m.colour.slice(1)}
                </strong>
                {' = '}
                {m.legendNote}
                {i < arr.length - 1 ? '. ' : '.'}
              </span>
            );
          })}
        </span>
      </div>

      <div id="filters" className="filter-bar" role="group" aria-label="Past paper filters">
        {(['all', 'A', 'B'] as FilterSection[]).map((s) => {
          const label = s === 'all' ? 'All papers' : s === 'A' ? 'Section A (50m)' : 'Section B (25m)';
          const count = sectionCounts[s];
          return (
            <button
              key={s}
              className={`filter-btn ${filterSection === s ? 'active' : ''}`}
              aria-pressed={filterSection === s}
              onClick={() => setFilterSection(s)}
            >
              {label} <span className="filter-btn__count">({count})</span>
            </button>
          );
        })}
        <span className="filter-bar__divider" aria-hidden />
        <span id="by-topic" />
        {(['all', 'inv', 'hedg', 'ma'] as FilterTopic[]).map((t) => {
          const label =
            t === 'all'
              ? 'All topics'
              : t === 'inv'
                ? 'Investment appraisal'
                : t === 'hedg'
                  ? 'Hedging'
                  : 'M&A';
          const count = topicCounts[t];
          return (
            <button
              key={t}
              className={`filter-btn ${filterTopic === t ? 'active' : ''}`}
              aria-pressed={filterTopic === t}
              onClick={() => setFilterTopic(t)}
            >
              {label} <span className="filter-btn__count">({count})</span>
            </button>
          );
        })}
      </div>

      <div id="grid" className="paper-grid">
        {filtered.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isSelected={paper.id === selectedId}
            onClick={() => setSelectedId(paper.id === selectedId ? null : paper.id)}
          />
        ))}
        {selectedId && !selectedPaper && (
          <div className="paper-grid__empty">
            No paper matches <code>?p={selectedId}</code>. <button onClick={() => setSelectedId(null)}>Clear</button>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="paper-grid__empty">No papers match those filters.</div>
        )}
      </div>

      {selectedPaper && (
        <div ref={detailRef}>
          <PaperDetail
            paper={selectedPaper}
            tab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}
    </div>
  );
});
