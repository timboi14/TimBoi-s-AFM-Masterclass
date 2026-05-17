import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  computeFormGuide,
  FORM_GUIDE_EVENT,
  loadFormGuideInputs,
  type FormGuide,
} from '@/lib/formGuide';

const BAND_COLOUR: Record<string, string> = {
  Fail: '#dc2626',
  Borderline: '#f59e0b',
  Comfortable: '#10b981',
  Strong: '#00a347',
};

/**
 * Compact Form Guide card for the Home page — predicted band + range +
 * weakest-area chip + single CTA. Subscribes to tba:marker:done so a new
 * marker submission refreshes this card immediately.
 */
export function FormGuideCompact() {
  const [fg, setFg] = useState<FormGuide>(() => computeFormGuide(loadFormGuideInputs()));

  useEffect(() => {
    const refresh = () => setFg(computeFormGuide(loadFormGuideInputs()));
    window.addEventListener(FORM_GUIDE_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(FORM_GUIDE_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

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
              <i className="fa-solid fa-bullseye mr-1.5" aria-hidden /> Form guide · predicted band
            </div>
            {fg.ready ? (
              <div className="font-display text-[28px] leading-none text-ink mt-0.5">
                {fg.predicted}
                <span className="ml-2 text-[12px] font-mono text-muted">range {fg.range[0]}–{fg.range[1]}</span>
              </div>
            ) : (
              <div className="text-[13px] text-ink mt-0.5">{fg.reason}</div>
            )}
          </div>
        </div>
        {fg.ready && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border"
            style={{ background: `${BAND_COLOUR[fg.band]}18`, color: BAND_COLOUR[fg.band], borderColor: `${BAND_COLOUR[fg.band]}55` }}
          >
            {fg.band}
          </div>
        )}
      </div>
      {fg.ready && fg.weakest[0] && (
        <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] bg-danger/10 text-danger font-bold">
            <i className="fa-solid fa-triangle-exclamation" aria-hidden /> Weakest: {fg.weakest[0].topicId} ({Math.round(fg.weakest[0].avg)}%)
          </span>
          <span className="text-[12px] text-primary font-bold">
            {fg.nextAction.label} →
          </span>
        </div>
      )}
    </Link>
  );
}
