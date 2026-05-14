import type { Paper } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { SourceBadge } from '../shared/SourceBadge';

interface Props { paper: Paper; }

export function SolutionTab({ paper }: Props) {
  return (
    <div className="solution-tab">
      <SourceBadge source={paper.primarySource} />
      {paper.solutionSteps.map((step) => (
        <div key={step.stepNumber} className="solution-step">
          <div className="solution-step__header">
            <span className="solution-step__number">{step.stepNumber}</span>
            <h4 className="solution-step__title bionic-text" {...bionicHTML(step.title)} />
          </div>

          <p className="solution-step__body bionic-text" {...bionicHTML(step.explanation)} />

          {step.formula && <pre className="solution-step__formula">{step.formula}</pre>}

          {step.verifiedNumbers && step.verifiedNumbers.length > 0 && (
            <div className="solution-step__verified">
              {step.verifiedNumbers.map((n, i) => (
                <div key={i} className="verified-callout">
                  <span className="verified-callout__icon" aria-hidden>✓</span>
                  <span className="bionic-text" {...bionicHTML(n)} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
