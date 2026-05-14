import type { Paper } from '@/data/pastpapers/schema';
import { DifficultyDots } from './shared/DifficultyDots';
import { SourceBadge } from './shared/SourceBadge';

interface Props {
  paper: Paper;
  isSelected: boolean;
  onClick: () => void;
}

export function PaperCard({ paper, isSelected, onClick }: Props) {
  return (
    <button
      className={`paper-card ${isSelected ? 'paper-card--selected' : ''}`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
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
