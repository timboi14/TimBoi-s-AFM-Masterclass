import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CenteredHero,
  HeroGold,
  SectionShell,
  StatStrip,
  StickySubNav,
  type SubNavAnchor,
} from '@/components/Blocks';
import { TBA_STATS } from '@/data/stats';
import { loadFormGuideInputs } from '@/lib/formGuide';
import { predictMark } from '@/lib/bayesianPredictor';
import { AFM_SYLLABUS } from '@/data/syllabus';
import { SCOUT_FINDINGS } from '@/data/scout.seed';
import { cn } from '@/lib/cn';

/**
 * /training — Simulator hub.
 *
 * Spec audit batch 04: render Practice / Mock / Debrief mode cards, a
 * personal-best (PB) table sourced from existing marker results, and a
 * "next recommended drill" hook into the Form Guide's weakest capability.
 * Body content was 1.5 KB; this rebuild targets 3 KB+ of real study UX.
 */
export function TrainingPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'modes', label: 'Modes' },
    { id: 'pb', label: 'Personal bests' },
    { id: 'next', label: 'Next drill' },
  ];

  const { topicHighs, weakestFinding, totalRuns } = useMemo(() => {
    const fg = loadFormGuideInputs();
    const byTopic = new Map<string, { best: number; lastPct: number; lastTs: number; paperId: string }>();
    for (const m of fg.marker) {
      if (!m.topicId) continue;
      const prev = byTopic.get(m.topicId);
      if (!prev || m.pct > prev.best) {
        byTopic.set(m.topicId, { best: m.pct, lastPct: prev?.lastPct ?? m.pct, lastTs: m.ts, paperId: m.paperId });
      }
    }
    const highs = Array.from(byTopic.entries()).map(([topic, v]) => ({ topic, ...v }))
      .sort((a, b) => b.best - a.best);
    // Pick weakest finding to drill — by user mastery if a diagnostic ran, else
    // by highest examiner frequency among topics with no recorded best.
    const drilled = new Set(highs.map((h) => h.topic));
    const candidate = SCOUT_FINDINGS.filter((f) => !drilled.has(f.topicId)).sort((a, b) => b.frequency - a.frequency)[0]
      ?? SCOUT_FINDINGS.sort((a, b) => b.frequency - a.frequency)[0];
    return { topicHighs: highs, weakestFinding: candidate, totalRuns: fg.marker.length };
  }, []);

  const bayes = useMemo(() => predictMark(loadFormGuideInputs().marker), []);

  return (
    <>
      <StickySubNav title="Training Ground" anchors={anchors} />

      <SectionShell tone="mist" pad="lg">
        <CenteredHero
          eyebrow={<>{TBA_STATS.practiceExams} sets · {TBA_STATS.practiceMarks} marks · 8 examiner markers</>}
          headline={<>Get reps in the <HeroGold>simulator</HeroGold>.</>}
          subline={
            <>
              Practice for technique, mock for stamina, debrief for the marks you nearly had.
              The marker is alive; submit an answer and it scores it like the examiner.
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="white" pad="md">
        <StatStrip
          stats={[
            { value: TBA_STATS.practiceExams, label: 'Practice sets', sub: 'CBE-style multi-panel' },
            { value: TBA_STATS.practiceMarks, label: 'Marks total', sub: `${Math.round(TBA_STATS.practiceMarks / 100)} full mocks worth` },
            { value: 3, label: 'Modes', sub: 'Practice / Mock / Debrief' },
            { value: totalRuns, label: 'Your marker runs', sub: bayes.nObservations > 0 ? `Posterior band: ${bayes.band}` : 'Sit a paper to unlock' },
          ]}
        />
      </SectionShell>

      {/* ── Three mode cards ───────────────────────────────────── */}
      <SectionShell tone="mist" pad="lg" id="modes">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
            <i className="fa-solid fa-stopwatch mr-1.5" aria-hidden /> Three training modes
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            Pick the rep that matches the gap.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Each mode rewards a different muscle. Practice = technique. Mock = stamina under
            pressure. Debrief = converting near-misses into next-attempt marks.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Practice */}
          <article className="rounded-2xl border border-border bg-white p-5 shadow-soft flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                <i className="fa-solid fa-dumbbell" aria-hidden />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-ink">Practice</h3>
            </div>
            <p className="text-[14px] text-ink/80 leading-relaxed flex-1">
              Per-question, timer off by default. Coach AI on tap. Sample answer revealed when you submit.
              Best for: building technique on a new topic, drilling formulas, fixing a recent debrief item.
            </p>
            <ul className="mt-3 space-y-1 text-[12.5px] text-muted">
              <li>· No clock pressure — set your own pace</li>
              <li>· Coach AI explains every working step</li>
              <li>· Full sample answer + marker feedback</li>
            </ul>
            <Link to="/practice" className="btn-primary mt-4 inline-flex items-center justify-center" aria-label="Practice">
              <i className="fa-solid fa-play mr-1.5" aria-hidden /> Practice
            </Link>
          </article>

          {/* Mock */}
          <article className="rounded-2xl border border-border bg-white p-5 shadow-soft flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-ink/90 grid place-items-center text-white">
                <i className="fa-solid fa-stopwatch-20" aria-hidden />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-ink">Mock</h3>
            </div>
            <p className="text-[14px] text-ink/80 leading-relaxed flex-1">
              3 hours 15 minutes. Section A + two Section B. Composite drawn with no topic repeats in 30 days.
              Coach is locked off. Auto-submits at T-0. Report waiting on the other side.
            </p>
            <ul className="mt-3 space-y-1 text-[12.5px] text-muted">
              <li>· Real-clock timer, examiner conditions</li>
              <li>· Coach disabled · paste-bomb detection on</li>
              <li>· Per-marker rubric breakdown after submit</li>
            </ul>
            <Link to="/training/mock" className="btn mt-4 inline-flex items-center justify-center bg-ink text-white hover:brightness-110" aria-label="Mock">
              <i className="fa-solid fa-stopwatch mr-1.5" aria-hidden /> Mock
            </Link>
          </article>

          {/* Debrief */}
          <article className="rounded-2xl border border-border bg-white p-5 shadow-soft flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center text-accent-dark">
                <i className="fa-solid fa-clipboard-list" aria-hidden />
              </div>
              <h3 className="font-display text-xl uppercase tracking-wide text-ink">Debrief</h3>
            </div>
            <p className="text-[14px] text-ink/80 leading-relaxed flex-1">
              Self-marking with the 8-marker rubric immediately after a mock. Tap each marker to surface
              the exact sentences in your answer that scored or missed it. Where the next marks come from.
            </p>
            <ul className="mt-3 space-y-1 text-[12.5px] text-muted">
              <li>· 8 examiner-rubric markers, evidence-linked</li>
              <li>· Time-vs-marks chart with pass-band overlay</li>
              <li>· Auto-creates SR cards for marks-lost lines</li>
            </ul>
            <Link to="/debrief" className="btn mt-4 inline-flex items-center justify-center border border-accent text-ink bg-white hover:bg-accent" aria-label="Debrief">
              <i className="fa-solid fa-clipboard-check mr-1.5" aria-hidden /> Debrief
            </Link>
          </article>
        </div>
      </SectionShell>

      {/* ── Personal bests ─────────────────────────────────────── */}
      <SectionShell tone="white" pad="lg" id="pb">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
            <i className="fa-solid fa-trophy mr-1.5" aria-hidden /> Personal bests
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            Your best mark by topic.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Highest AI-marker percentage you&apos;ve scored on each topic across every paper you&apos;ve sat.
            Sourced from the live marker log — refreshes after every submission.
          </p>
        </header>

        {topicHighs.length > 0 ? (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-muted border-b border-border">
                  <th scope="col" className="p-3 text-left">Topic</th>
                  <th scope="col" className="p-3 text-right">PB %</th>
                  <th scope="col" className="p-3 text-right">Latest %</th>
                  <th scope="col" className="p-3 text-left">Best on</th>
                  <th scope="col" className="p-3 text-left">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {topicHighs.map((h) => {
                  const cap = AFM_SYLLABUS.find((c) => c.tbaTopicId === h.topic);
                  const trending = h.lastPct > h.best - 5;
                  return (
                    <tr key={h.topic} className="border-b border-border/60 last:border-b-0 hover:bg-primary/[0.03]">
                      <td className="p-3">
                        <Link to={`/topic/${h.topic}`} className="font-bold text-ink hover:text-primary">
                          {cap?.capability ?? h.topic}
                        </Link>
                        {cap && <span className="ml-2 text-[11px] font-mono text-muted">{cap.ref}</span>}
                      </td>
                      <td className="p-3 text-right">
                        <span className={cn('inline-flex items-center justify-center min-w-[44px] px-2 py-1 rounded-md font-bold text-[12.5px]', h.best >= 65 ? 'bg-primary/15 text-primary' : h.best >= 50 ? 'bg-accent/15 text-accent-dark' : 'bg-danger/15 text-danger')}>
                          {Math.round(h.best)}%
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-muted">
                        {Math.round(h.lastPct)}%
                        {trending && <i className="fa-solid fa-arrow-trend-up text-primary ml-1" aria-hidden />}
                      </td>
                      <td className="p-3 text-muted">{h.paperId}</td>
                      <td className="p-3 text-muted whitespace-nowrap">
                        {new Date(h.lastTs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-white p-6 text-center">
            <i className="fa-solid fa-trophy text-3xl text-muted mb-2" aria-hidden />
            <p className="text-[14px] text-ink/80">
              No personal bests yet — sit a past paper and submit it to the AI marker to set your first PB.
            </p>
            <Link to="/past-papers" className="btn-primary mt-3 inline-block">
              <i className="fa-solid fa-play mr-1.5" /> Open Match Centre
            </Link>
          </div>
        )}
      </SectionShell>

      {/* ── Next recommended drill ──────────────────────────────── */}
      <SectionShell tone="mist" pad="lg" id="next">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-accent-dark font-bold mb-2">
            <i className="fa-solid fa-bullseye mr-1.5" aria-hidden /> Next recommended drill
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            What to train next.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Picked from your Form Guide&apos;s weakest capability and the examiner&apos;s
            highest-frequency mark centre. Open the topic, drill the worked example,
            then sit the matching past-paper part.
          </p>
        </header>

        {weakestFinding && (
          <div className="mt-8 rounded-2xl border border-border bg-white p-6 shadow-soft">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark grid place-items-center text-white">
                <i className="fa-solid fa-bolt text-2xl" aria-hidden />
              </div>
              <div className="flex-1 min-w-[260px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[11px] font-bold text-primary uppercase">{weakestFinding.capability}</span>
                  <span className="text-[11px] text-muted">·</span>
                  <span className="text-[11px] text-muted uppercase tracking-wider font-bold">Seen in {weakestFinding.frequency} sittings 2020–25</span>
                  <span className="text-[11px] text-muted">·</span>
                  <span className="text-[11px] text-muted uppercase tracking-wider">Last: {weakestFinding.lastSeen}</span>
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-ink">{weakestFinding.area}</h3>
                <p className="mt-2 text-[14px] text-ink/80 leading-relaxed">
                  <span className="font-bold text-primary">Technique to drill: </span>{weakestFinding.technique}
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Link to={`/topic/${weakestFinding.topicId}`} className="btn-primary">
                    <i className="fa-solid fa-book mr-1.5" /> Open topic
                  </Link>
                  <Link to="/past-papers" className="btn border border-border bg-white text-ink hover:bg-slate-50">
                    <i className="fa-solid fa-stopwatch mr-1.5" /> Sit a matching paper
                  </Link>
                  <Link to="/start/diagnostic" className="btn border border-border bg-white text-ink hover:bg-slate-50">
                    <i className="fa-solid fa-clipboard-question mr-1.5" /> Take the 10-min diagnostic
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionShell>
    </>
  );
}
