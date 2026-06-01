import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Paper } from '@/data/pastpapers/schema';
import { SourceBadge } from './shared/SourceBadge';
import { ScenarioTab } from './tabs/ScenarioTab';
import { QuestionTab } from './tabs/QuestionTab';
import { SolutionTab } from './tabs/SolutionTab';
import { ExaminerTab } from './tabs/ExaminerTab';
import { PracticeWorkspace } from '@/components/CBEWorkspace/PracticeWorkspace';
import { ExhibitsPanel } from '@/components/CBEWorkspace/ExhibitsPanel';
import { CBEProvider } from '@/components/CBEWorkspace/cbe-context';
import { CBEToolRibbon } from '@/components/CBEWorkspace/CBEToolRibbon';
import { CBEPopups } from '@/components/CBEWorkspace/CBEPopups';
import { CBEFooter } from '@/components/CBEWorkspace/CBEFooter';
import { useStore } from '@/lib/store';
import { resolveIdentity } from '@/lib/identity';

const REALISTIC_KEY = 'cbe_realistic_mode';

const TAB_IDS = ['scenario', 'question', 'practice', 'solution', 'examiner'] as const;
type Tab = (typeof TAB_IDS)[number];

interface Props {
  paper: Paper;
  /** Optional controlled-mode tab; if provided, onTabChange should also be supplied. */
  tab?: Tab;
  onTabChange?: (next: Tab) => void;
  onClose: () => void;
}

function isTab(v: unknown): v is Tab {
  return typeof v === 'string' && (TAB_IDS as readonly string[]).includes(v);
}

export function PaperDetail({ paper, tab, onTabChange, onClose }: Props) {
  const [internalTab, setInternalTab] = useState<Tab>('scenario');
  const activeTab: Tab = isTab(tab) ? tab : internalTab;
  const setActiveTab = (next: Tab) => {
    if (onTabChange) onTabChange(next);
    else setInternalTab(next);
  };
  const [practiceLayout, setPracticeLayout] = useState<'split' | 'focus'>('split');
  const { fanName } = useStore();
  const guestId = resolveIdentity(fanName).storageKey;
  const [realistic, setRealistic] = useState<boolean>(() => {
    try { return localStorage.getItem(REALISTIC_KEY) === 'true'; } catch { return false; }
  });
  const toggleRealistic = () => {
    setRealistic((prev) => {
      const next = !prev;
      try { localStorage.setItem(REALISTIC_KEY, String(next)); } catch { /* ignore */ }
      return next;
    });
  };
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    scenario: null, question: null, practice: null, solution: null, examiner: null,
  });

  // Tabs that have been opened at least once. Used so we can keep their
  // rendered subtrees mounted (but `hidden`) and preserve state across switches.
  const [opened, setOpened] = useState<Set<Tab>>(() => new Set<Tab>(['scenario']));
  useEffect(() => {
    setOpened((s) => (s.has(activeTab) ? s : new Set<Tab>(s).add(activeTab)));
  }, [activeTab]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'scenario', label: 'Scenario' },
    { id: 'question', label: 'Question' },
    { id: 'practice', label: '⏱ Practice (CBE)' },
    { id: 'solution', label: 'Solution walkthrough' },
    { id: 'examiner', label: 'Examiner says' },
  ];

  // Open the question (or solution, if that's where you are) in a separate,
  // chrome-free window sized to sit beside the CBE workspace. Named per paper
  // so re-clicks reuse the same window rather than stacking new ones.
  const handlePopOut = () => {
    const targetTab = activeTab === 'solution' ? 'solution' : 'question';
    const url = `/past-papers?p=${paper.id}&tab=${targetTab}&popout=true`;
    const width = Math.round(window.screen.width * 0.48);
    const height = window.screen.height;
    window.open(
      url,
      `paper_popout_${paper.id}`,
      `width=${width},height=${height},left=0,top=0,resizable=yes,scrollbars=yes`,
    );
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const order = TAB_IDS;
    const i = order.indexOf(activeTab);
    let next: Tab | null = null;
    switch (e.key) {
      case 'ArrowRight': next = order[(i + 1) % order.length]; break;
      case 'ArrowLeft':  next = order[(i - 1 + order.length) % order.length]; break;
      case 'Home':       next = order[0]; break;
      case 'End':        next = order[order.length - 1]; break;
      default: return;
    }
    e.preventDefault();
    setActiveTab(next);
    // Move focus to the newly active tab so a screen reader announces it.
    requestAnimationFrame(() => tabRefs.current[next!]?.focus());
  };

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

      <div
        className="tab-nav"
        role="tablist"
        aria-label={`${paper.name} sections`}
        onKeyDown={onTabKeyDown}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el; }}
            role="tab"
            id={`tab-${paper.id}-${t.id}`}
            aria-selected={activeTab === t.id}
            aria-controls={`tabpanel-${paper.id}-${t.id}`}
            tabIndex={activeTab === t.id ? 0 : -1}
            className={`tab-nav__btn ${activeTab === t.id ? 'tab-nav__btn--active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handlePopOut}
          title="Open in separate window (for side-by-side study)"
          className="ml-auto flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Pop out
        </button>
      </div>

      {/* A tab panel per tab that has been opened. Inactive panels are kept
          mounted but hidden so state (CBE workspace timer, scroll, etc.) is
          preserved when the user switches away and back. */}
      {tabs.map((t) =>
        opened.has(t.id) ? (
          <div
            key={t.id}
            className="tab-content"
            role="tabpanel"
            id={`tabpanel-${paper.id}-${t.id}`}
            aria-labelledby={`tab-${paper.id}-${t.id}`}
            hidden={activeTab !== t.id}
          >
            {t.id === 'scenario' && <ScenarioTab paper={paper} />}
            {t.id === 'question' && <QuestionTab paper={paper} />}
            {t.id === 'practice' && (
              <CBEProvider paperId={paper.id} guestId={guestId}>
                <div className={`cbe-practice ${realistic ? 'cbe-realistic' : ''}`}>
                  <CBEToolRibbon />
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
                    <button
                      type="button"
                      onClick={toggleRealistic}
                      className={`cbe-split__layout-btn ${realistic ? 'cbe-split__layout-btn--active' : ''}`}
                      aria-pressed={realistic}
                      title="Flat-grey enterprise skin that mirrors the ACCA iAssess exam shell"
                    >
                      🖥 Realistic mode
                    </button>
                  </div>
                  <div className={`cbe-split cbe-split--${practiceLayout}`}>
                    {practiceLayout === 'split' && (
                      <div className="cbe-split__left">
                        <ExhibitsPanel paper={paper} />
                      </div>
                    )}
                    <div className="cbe-split__right">
                      <PracticeWorkspace
                        paper={paper}
                        paperId={paper.id}
                        paperName={paper.name}
                        paperSession={paper.session}
                      />
                    </div>
                  </div>
                  <CBEFooter paperId={paper.id} />
                </div>
                <CBEPopups />
              </CBEProvider>
            )}
            {t.id === 'solution' && <SolutionTab paper={paper} />}
            {t.id === 'examiner' && <ExaminerTab paper={paper} />}
          </div>
        ) : null,
      )}
    </div>
  );
}
