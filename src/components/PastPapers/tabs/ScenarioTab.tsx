import { useState } from 'react';
import type { Paper, ScenarioStep } from '@/data/pastpapers/schema';
import { bionicHTML } from '@/utils/bionic';
import { WarnBox } from '../shared/WarnBox';
import { DataTable } from '../shared/DataTable';
import { VerifiedNumberCard } from '../shared/VerifiedNumberCard';
import { SourceBadge } from '../shared/SourceBadge';
import { Cite } from '@/components/Cite';
import { ScenarioRender, hasCiteTokens } from '@/components/ScenarioRender';
import { PAPER_CITATIONS } from '@/data/paperCitations';

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

        {step.content.split('\n\n').map((para, i) =>
          hasCiteTokens(para) ? (
            <p key={i} className="step-content__para">
              <ScenarioRender text={para} />
            </p>
          ) : (
            <p
              key={i}
              className="bionic-text step-content__para"
              {...bionicHTML(para)}
            />
          ),
        )}

        {step.warning && <WarnBox text={step.warning} />}

        {step.table && (
          <DataTable
            headers={step.table.headers}
            rows={step.table.rows}
            highlightLastRow={step.table.highlightLastRow}
          />
        )}
      </div>

      {/* Inline citation strip — visible on EVERY step, not just the last. */}
      {PAPER_CITATIONS[paper.id] && PAPER_CITATIONS[paper.id].length > 0 && (
        <div className="mt-5 rounded-xl border border-border bg-white/70 p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">
            <i className="fa-solid fa-link mr-1.5 text-primary" aria-hidden /> Inline citations · hover or Tab for source
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink">
            {PAPER_CITATIONS[paper.id].map((c, i) => (
              <span key={i}>
                {i > 0 && ' · '}
                <Cite source={c.source} paper={c.paper} note={c.note}>
                  {c.text}
                </Cite>
              </span>
            ))}
          </p>
        </div>
      )}

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
