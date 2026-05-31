import type { Paper } from '@/data/pastpapers/schema';
import { DifficultyDots } from './shared/DifficultyDots';
import { SourceBadge } from './shared/SourceBadge';
import { loadFlag } from '@/lib/cbe-tools-storage';

interface Props {
  paper: Paper;
  isSelected: boolean;
  onClick: () => void;
}

export function PaperCard({ paper, isSelected, onClick }: Props) {
  // Read once at render so flagged papers stand out at a glance on the grid.
  const flagged = loadFlag(paper.id);
  return (
    <button
      className={`paper-card ${isSelected ? 'paper-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      {flagged && (
        <span className="paper-card__flag" title="Flagged for review" aria-label="Flagged for review">
          ⚑
        </span>
      )}
      <div className="paper-card__name">{paper.name}</div>
      <div className="paper-card__meta">
        {paper.session} · Sec {paper.paperSection} · {paper.totalMarks}m
      </div>
      <div className="paper-card__tags">
        <span className={`tag tag--${paper.paperSection === 'A' ? 'a' : 'b'}`}>
          Section {paper.paperSection}
        </span>
        <SourceBadge source={paper.primarySource} compact />
      </div>
      <DifficultyDots level={paper.difficulty} />
    </button>
  );
}
