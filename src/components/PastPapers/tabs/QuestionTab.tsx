import type { Paper } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { SourceBadge } from '../shared/SourceBadge';

interface Props { paper: Paper; }

export function QuestionTab({ paper }: Props) {
  const totalMarks = paper.questionParts.reduce((n, p) => n + p.marks, 0);
  return (
    <div className="question-tab">
      <SourceBadge source={paper.primarySource} />
      <p className="question-tab__intro">
        <strong>{paper.questionParts.length} parts</strong> · {totalMarks} marks total ·
        Target {Math.round(totalMarks * 1.8)} minutes (1.8 min / mark)
      </p>

      <ol className="question-parts">
        {paper.questionParts.map((part) => (
          <li key={part.label} className="question-part">
            <div className="question-part__head">
              <span className="question-part__label">{part.label}</span>
              <span className="question-part__marks">{part.marks} marks</span>
              <span className="question-part__minutes">
                {Math.round(part.marks * 1.8)} min target
              </span>
            </div>
            <p
              className="question-part__body bionic-text"
              {...bionicHTML(part.requirement)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
