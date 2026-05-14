import { useState } from 'react';
import type { Paper, ScenarioStep } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { WarnBox } from '../shared/WarnBox';
import { DataTable } from '../shared/DataTable';
import { VerifiedNumberCard } from '../shared/VerifiedNumberCard';
import { SourceBadge } from '../shared/SourceBadge';

interface Props { paper: Paper; }

export function ScenarioTab({ paper }: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const step: ScenarioStep = paper.scenarioSteps[activeStep];

  return (
    <div className="scenario-tab">
      <div className="step-nav" role="tablist">
        {paper.scenarioSteps.map((s, i) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={i === activeStep}
            className={`step-nav__btn ${i === activeStep ? 'step-nav__btn--active' : ''}`}
            onClick={() => setActiveStep(i)}
          >
            {s.navLabel}
          </button>
        ))}
      </div>

      <div className="step-content">
        <SourceBadge source={paper.primarySource} />
        <h3 className="step-content__title">{step.title}</h3>

        {step.content.split('\n\n').map((para, i) => (
          <p
            key={i}
            className="bionic-text step-content__para"
            {...bionicHTML(para)}
          />
        ))}

        {step.warning && <WarnBox text={step.warning} />}

        {step.table && (
          <DataTable
            headers={step.table.headers}
            rows={step.table.rows}
            highlightLastRow={step.table.highlightLastRow}
          />
        )}
      </div>

      {(activeStep === paper.scenarioSteps.length - 1 || paper.scenarioSteps.length <= 2) && (
        <div className="verified-numbers">
          <p className="verified-numbers__label">
            <SourceBadge source={paper.primarySource} /> Verified numbers from source files
          </p>
          <div className="verified-numbers__grid">
            {paper.verifiedNumbers.map((n, i) => (
              <VerifiedNumberCard key={i} number={n} />
            ))}
          </div>
        </div>
      )}

      <div className="step-footer">
        {activeStep > 0 && (
          <button className="step-footer__prev" onClick={() => setActiveStep(activeStep - 1)}>
            ← Previous
          </button>
        )}
        {activeStep < paper.scenarioSteps.length - 1 && (
          <button className="step-footer__next" onClick={() => setActiveStep(activeStep + 1)}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
