import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  computeFormGuide,
  FORM_GUIDE_EVENT,
  loadFormGuideInputs,
  type FormGuide,
} from '@/lib/formGuide';
import { predictMark, type BayesianBand } from '@/lib/bayesianPredictor';

const LEGACY_BAND_COLOUR: Record<string, string> = {
  Fail: '#dc2626',
  Borderline: '#f59e0b',
  Comfortable: '#10b981',
  Strong: '#00a347',
};
const BAYES_BAND_COLOUR: Record<BayesianBand, string> = {
  'Below pass': '#dc2626',
  'On the edge': '#f59e0b',
  'Comfortable': '#10b981',
  'Strong': '#00a347',
};

/**
 * Compact Form Guide card for the Home page.
 *
 * Spec §5 + audit feedback 2026-05-18: even with zero marker runs, show the
 * Bayesian prior (centre 50, σ=15) so the card has a live number instead of
 * the static "Need N more runs to forecast" string. As marker observations
 * accumulate, the posterior tightens and the band shifts automatically.
 *
 * Subscribes to tba:marker:done + storage events so a new marker submission
 * refreshes the prediction without a full reload.
 */
export function FormGuideCompact() {
  const [fg, setFg] = useState<FormGuide>(() => computeFormGuide(loadFormGuideInputs()));
  const [bayes, setBayes] = useState(() => predictMark(loadFormGuideInputs().marker));

  useEffect(() => {
    const refresh = () => {
      const inputs = loadFormGuideInputs();
      setFg(computeFormGuide(inputs));
      setBayes(predictMark(inputs.marker));
    };
    window.addEventListener(FORM_GUIDE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(FORM_GUIDE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const bandColour = BAYES_BAND_COLOUR[bayes.band];
  const lowCount = bayes.nObservations < 3;
  const weakest = fg.ready ? fg.weakest[0] : null;
  const linearBand = fg.ready ? fg.band : null;

  return (
    <Link
      to="/form-guide"
      className="block rounded-2xl border border-border bg-white p-4 hover:border-primary transition-colors"
      aria-label="Open form guide"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl grid place-items-center text-white" style={{ background: 'linear-gradient(135deg, #0a0f1e, #122046)' }}>
            <i className="fa-solid fa-gauge-high text-lg" aria-hidden />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-primary font-bold">
              <i className="fa-solid fa-bullseye mr-1.5" aria-hidden /> Form guide · Bayesian predicted band
            </div>
            <div className="font-display text-[28px] leading-none text-ink mt-0.5">
              {Math.round(bayes.mean)}
              <span className="ml-2 text-[12px] font-mono text-muted">
                ± {bayes.sigma.toFixed(1)} (80% CI {Math.round(bayes.ci80[0])}–{Math.round(bayes.ci80[1])})
              </span>
            </div>
            <div className="text-[11.5px] text-muted mt-0.5">
              {bayes.nObservations === 0
                ? 'Prior only — band tightens with each marker run.'
                : `Posterior from ${bayes.nObservations} marker run${bayes.nObservations === 1 ? '' : 's'} (recency-weighted N≈${bayes.effectiveN}).`}
            </div>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border"
          style={{ background: `${bandColour}18`, color: bandColour, borderColor: `${bandColour}55` }}
        >
          {bayes.band}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        {weakest ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] bg-danger/10 text-danger font-bold">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden /> Weakest: {weakest.topicId} ({Math.round(weakest.avg)}%)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] bg-slate-100 text-muted font-bold">
            <i className="fa-solid fa-bullseye" aria-hidden /> Sit a paper to identify weak areas
          </span>
        )}
        <span className="text-[12px] text-primary font-bold">
          {fg.ready ? fg.nextAction.label : lowCount ? 'Open Form Guide →' : 'Open Form Guide →'}
        </span>
      </div>
      {linearBand && linearBand !== bayes.band && (
        <div className="mt-2 text-[10.5px] text-muted">
          Linear band <strong style={{ color: LEGACY_BAND_COLOUR[linearBand] }}>{linearBand}</strong> (legacy) differs from Bayesian — variance is wide, sit more papers to tighten.
        </div>
      )}
    </Link>
  );
}
