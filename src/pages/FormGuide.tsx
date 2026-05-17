import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';
import {
  computeFormGuide,
  FORM_GUIDE_EVENT,
  loadFormGuideInputs,
  type FormGuide,
} from '@/lib/formGuide';

const BAND_ORDER = ['Fail', 'Borderline', 'Comfortable', 'Strong'] as const;
const BAND_COLOUR: Record<string, string> = {
  Fail: '#dc2626',
  Borderline: '#f59e0b',
  Comfortable: '#10b981',
  Strong: '#00a347',
};

/**
 * Full Form Guide page — Work Item 3.
 *
 * Renders the 4-segment band bar with a position pin at `predicted`, plus
 * weakest×3 and strongest×3 columns and one big "next action" CTA at the
 * bottom. Subscribes to the `tba:marker:done` custom event so a new
 * AI-marker submission updates the dashboard within 1 second.
 */
export function FormGuidePage() {
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
    <>
      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Form guide · your predicted band</>}
          headline={<>Where you'd <HeroGold>land today</HeroGold>.</>}
          subline={
            <>
              Blended forecast from your AI-marker scores, Debrief averages, drill
              completion and streak. Range is ±6 marks — sit more papers to tighten it.
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="lg">
        {!fg.ready ? (
          <div className="rounded-2xl border border-border bg-white p-6 text-center">
            <i className="fa-solid fa-circle-info text-primary text-2xl mb-2" aria-hidden />
            <p className="text-[14px] text-ink mb-4">{fg.reason}</p>
            <Link to={fg.nextCta.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-bold text-[13px]">
              {fg.nextCta.label}
            </Link>
          </div>
        ) : (
          <>
            <FormBandBar predicted={fg.predicted} band={fg.band} range={fg.range} />

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl border-l-4 border-l-danger bg-white p-5">
                <h3 className="text-[11px] uppercase tracking-wider text-danger font-bold mb-3">
                  <i className="fa-solid fa-arrow-trend-down mr-1.5" aria-hidden /> Top 3 weakest
                </h3>
                {fg.weakest.length === 0 ? (
                  <p className="text-[13px] text-muted">No topic-level data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {fg.weakest.map((w) => (
                      <li key={w.topicId} className="flex items-center justify-between text-[13.5px]">
                        <Link to={`/topic/${w.topicId}`} className="text-ink hover:text-danger font-bold">
                          {w.topicId}
                        </Link>
                        <span className="font-mono text-danger">{Math.round(w.avg)}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="rounded-2xl border-l-4 border-l-primary bg-white p-5">
                <h3 className="text-[11px] uppercase tracking-wider text-primary font-bold mb-3">
                  <i className="fa-solid fa-arrow-trend-up mr-1.5" aria-hidden /> Top 3 strongest
                </h3>
                {fg.strongest.length === 0 ? (
                  <p className="text-[13px] text-muted">No topic-level data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {fg.strongest.map((s) => (
                      <li key={s.topicId} className="flex items-center justify-between text-[13.5px]">
                        <Link to={`/topic/${s.topicId}`} className="text-ink hover:text-primary font-bold">
                          {s.topicId}
                        </Link>
                        <span className="font-mono text-primary">{Math.round(s.avg)}%</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Link
                to={fg.nextAction.href}
                className="block w-full text-center px-5 py-3 rounded-2xl bg-ink text-white font-display tracking-wide uppercase text-[15px] hover:brightness-110"
              >
                {fg.nextAction.label} →
              </Link>
            </div>
          </>
        )}
      </SectionShell>
    </>
  );
}

interface BarProps {
  predicted: number;
  band: string;
  range: [number, number];
}
function FormBandBar({ predicted, band, range }: BarProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-baseline gap-3 mb-3">
        <div className="font-display text-5xl text-ink leading-none">{predicted}</div>
        <div className="text-[14px] text-muted">predicted (range {range[0]}–{range[1]})</div>
        <div
          className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold border"
          style={{ background: `${BAND_COLOUR[band]}18`, color: BAND_COLOUR[band], borderColor: `${BAND_COLOUR[band]}55` }}
        >
          {band}
        </div>
      </div>
      <div className="relative h-6 rounded-full overflow-hidden grid grid-cols-4">
        {BAND_ORDER.map((b) => (
          <div
            key={b}
            style={{ background: `${BAND_COLOUR[b]}33`, color: BAND_COLOUR[b] }}
            className="text-[10px] uppercase tracking-wider text-center leading-6 font-bold border-r border-white last:border-r-0"
          >
            {b}
          </div>
        ))}
        <div
          className="absolute top-0 bottom-0 w-1.5 bg-ink rounded-sm shadow-md"
          style={{ left: `calc(${predicted}% - 3px)` }}
          aria-label={`Predicted ${predicted}`}
        />
      </div>
      <div className="flex justify-between text-[10.5px] text-muted mt-1 font-mono">
        <span>0</span>
        <span>40</span>
        <span>50</span>
        <span>65</span>
        <span>100</span>
      </div>
    </div>
  );
}
