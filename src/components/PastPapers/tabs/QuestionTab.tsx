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

      {paper.exhibits && paper.exhibits.length > 0 && (
        <details className="paper-exhibits">
          <summary className="paper-exhibits__summary">
            Scenario exhibits (verbatim from Kaplan) · {paper.exhibits.length}
          </summary>
          <div className="paper-exhibits__list">
            {paper.exhibits.map((ex) => (
              <div key={ex.title} className="paper-exhibit">
                <p className="paper-exhibit__title">{ex.title}</p>
                {ex.content.split('\n\n').map((para, i) => (
                  <p key={i} className="paper-exhibit__para bionic-text" {...bionicHTML(para)} />
                ))}
              </div>
            ))}
          </div>
        </details>
      )}

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

            {part.markingPoints && part.markingPoints.length > 0 && (
              <details className="marking-guide">
                <summary className="marking-guide__summary">
                  Marking guide · {part.markingPoints.reduce((n, m) => n + m.marks, 0)}/{part.marks} marks broken down
                </summary>
                <ul className="marking-guide__list">
                  {part.markingPoints.map((m, i) => (
                    <li key={i} className="marking-guide__item">
                      <span className="marking-guide__marks">{m.marks}m</span>
                      <span className="marking-guide__desc bionic-text" {...bionicHTML(m.description)} />
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {part.examinerCommentary && (
              <div className="part-examiner">
                <p className="part-examiner__label">
                  <span aria-hidden>✎</span> ACCA examiner on this part
                </p>
                <p className="part-examiner__body bionic-text" {...bionicHTML(part.examinerCommentary)} />
              </div>
            )}
          </li>
        ))}
      </ol>

      {paper.keyAnswerTips && (
        <div className="key-tips">
          <p className="key-tips__label">
            <span aria-hidden>★</span> Kaplan key answer tip
          </p>
          <p className="key-tips__body bionic-text" {...bionicHTML(paper.keyAnswerTips)} />
        </div>
      )}
    </div>
  );
}
