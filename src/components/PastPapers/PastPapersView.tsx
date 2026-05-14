import { useState, useMemo } from 'react';
import { PAPERS } from '@/data/pastpapers/papers';
import type { PaperSection, TopicCategory } from '@/data/pastpapers/schema';
import { PaperCard } from './PaperCard';
import { PaperDetail } from './PaperDetail';

type FilterSection = 'all' | PaperSection;
type FilterTopic = 'all' | TopicCategory;

export function PastPapersView() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterSection, setFilterSection] = useState<FilterSection>('all');
  const [filterTopic, setFilterTopic] = useState<FilterTopic>('all');

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => {
      if (filterSection !== 'all' && p.paperSection !== filterSection) return false;
      if (filterTopic !== 'all' && !p.topics.includes(filterTopic)) return false;
      return true;
    });
  }, [filterSection, filterTopic]);

  const selectedPaper = PAPERS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="past-papers-view">
      <div className="source-notice">
        <span aria-hidden>📎</span>
        <span>
          Every number in this module is pulled directly from verified source files.{' '}
          <strong>Green</strong> = Question Pack (OCR).{' '}
          <strong>Blue</strong> = ACCA Model Answer.{' '}
          <strong>Grey</strong> = Examiner Report.
        </span>
      </div>

      <div className="filter-bar">
        {(['all', 'A', 'B'] as FilterSection[]).map((s) => (
          <button
            key={s}
            className={`filter-btn ${filterSection === s ? 'active' : ''}`}
            onClick={() => setFilterSection(s)}
          >
            {s === 'all' ? 'All papers' : s === 'A' ? 'Section A (50m)' : 'Section B (25m)'}
          </button>
        ))}
        <span className="filter-bar__divider" aria-hidden />
        {(['all', 'inv', 'hedg', 'ma'] as FilterTopic[]).map((t) => (
          <button
            key={t}
            className={`filter-btn ${filterTopic === t ? 'active' : ''}`}
            onClick={() => setFilterTopic(t)}
          >
            {t === 'all'
              ? 'All topics'
              : t === 'inv'
                ? 'Investment appraisal'
                : t === 'hedg'
                  ? 'Hedging'
                  : 'M&A'}
          </button>
        ))}
      </div>

      <div className="paper-grid">
        {filtered.map((paper) => (
          <PaperCard
            key={paper.id}
            paper={paper}
            isSelected={paper.id === selectedId}
            onClick={() => setSelectedId(paper.id === selectedId ? null : paper.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="paper-grid__empty">No papers match those filters.</div>
        )}
      </div>

      {selectedPaper && (
        <PaperDetail paper={selectedPaper} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
