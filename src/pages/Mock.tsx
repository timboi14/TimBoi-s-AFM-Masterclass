import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Card, Pill, fadeUp, stagger, CoachTip } from '@/components/primitives';
import { cn } from '@/lib/cn';

interface Question {
  ref: string;
  title: string;
  marks: number;
  brief: string;
  requirements: { label: string; marks: number; }[];
  modelAnswer: string[];
  markScheme: { item: string; marks: number; }[];
}

const QUESTIONS: Question[] = [
  {
    ref: 'Drimpton',
    title: 'Drimpton plc - NPV with ESG',
    marks: 50,
    brief:
      'Drimpton plc is considering a £45m four-year project to expand its UK manufacturing line. Selling-price inflation 3.5%, materials 4.2%, labour 5.1%. Tax 25% paid one year in arrears. Working capital is 12% of incremental revenue. The project would emit an additional 12,000 tonnes of CO2 per year unless £8m is spent upfront on emissions abatement, which would also save £0.5m per year in operating cost.',
    requirements: [
      { label: '(a) Compute the NPV of the project before ESG abatement', marks: 18 },
      { label: '(b) Recommend whether the abatement should be undertaken', marks: 8 },
      { label: '(c) Identify three ESG considerations and link to financial outcome', marks: 8 },
      { label: '(d) Sensitivity to a 15% adverse volume shift', marks: 8 },
      { label: '(e) Professional skills (communication, analysis, scepticism, commercial)', marks: 8 },
    ],
    modelAnswer: [
      'Open with the recommendation: "I recommend Drimpton proceeds with the £45m project conditional on the £8m emissions abatement and a phased volume rollout."',
      'NPV proforma: years 0 to 4 across, lines for revenue, materials, labour, depreciation tax shield, working capital, tax (one-year lag), residual.',
      'Inflate each line at its own rate. Working capital invest in year 0, increment with incremental revenue, release in year 4.',
      'Discount factors at the project WACC, sum to find NPV. Quote 6.4m positive in this scenario.',
      'Abatement: incremental NPV is the £8m capex versus £0.5m operating savings each year for 4 years, plus reputational and regulatory benefit. Show it is value-positive at the project WACC.',
      'ESG: identify carbon emissions level (12,000 tonnes), quantify abatement cost and saving, link to social licence to operate, name the stakeholder (community, regulator, investor).',
      'Sensitivity: at -15% volume the NPV falls below zero, so the project is volume-sensitive and a phased rollout with milestones is recommended.',
      'Professional skills: structured headings, comparison table for sensitivity, scepticism on optimistic volume forecasts, commercial: implementation phasing and supplier concentration risk.',
    ],
    markScheme: [
      { item: 'NPV proforma layout (per-line inflation, tax lag, WC release)', marks: 6 },
      { item: 'Correct discount factors and NPV result', marks: 6 },
      { item: 'Inflation applied per line', marks: 3 },
      { item: 'Working capital phased', marks: 3 },
      { item: 'Abatement decision with figures', marks: 8 },
      { item: 'ESG: 3 distinct points with scenario application', marks: 8 },
      { item: 'Sensitivity computed and recommendation drawn', marks: 8 },
      { item: 'Professional skills (4 x 2 marks)', marks: 8 },
    ],
  },
  {
    ref: 'Marnhall',
    title: 'Marnhall - M&A synergy',
    marks: 25,
    brief:
      'Marnhall is bidding for Tilford Ltd. Tilford stand-alone value is £80m. Cost synergy is estimated at £4m perpetuity. Sellers demand a 30% premium on stand-alone. Marnhall WACC 9%. Acquirer captures 50% of synergy.',
    requirements: [
      { label: '(a) Stand-alone, with-synergy and max bid for Tilford', marks: 10 },
      { label: '(b) Recommend bid level with reasoning', marks: 6 },
      { label: '(c) Sources of synergy: revenue, cost, financial', marks: 6 },
      { label: '(d) Risk of overpayment and how to mitigate', marks: 3 },
    ],
    modelAnswer: [
      'Three-column valuation: Stand-alone £80m, With Synergy £124.4m (synergy PV is £44.4m), Max Bid £102.2m (Marnhall captures 50% of synergy).',
      'Sellers want 30% premium on stand-alone = £104m. This exceeds max bid, so Marnhall should walk away unless synergy can be lifted.',
      'Sources: revenue (cross-sell, pricing), cost (scale, scope, eliminate duplication), financial (lower WACC, debt capacity, tax-loss).',
      'Overpayment mitigation: independent due diligence, max bid discipline, allocated synergy ownership, named integration leader.',
    ],
    markScheme: [
      { item: '3-column table with workings', marks: 10 },
      { item: 'Recommendation and walk-away discipline', marks: 6 },
      { item: '3 synergy sources with scenario application', marks: 6 },
      { item: 'Mitigation actions named', marks: 3 },
    ],
  },
  {
    ref: 'Passmore',
    title: 'Passmore - FX hedge',
    marks: 25,
    brief:
      'Passmore Ltd has a $1m payable in 3 months. Spot GBP/USD 1.25. UK rate 5%, US rate 4% per year. 3-month forward 1.247. December $/£ futures contract size £62,500, current price 1.246. December $/£ option strike 1.250, premium 1.5 cents per £.',
    requirements: [
      { label: '(a) Forward, MMH, futures, option hedge results, table', marks: 16 },
      { label: '(b) Recommend the best hedge with reasoning', marks: 4 },
      { label: '(c) Residual risk under each hedge', marks: 5 },
    ],
    modelAnswer: [
      'Forward: $1m / 1.247 = £802,005. Simple, certain, no premium.',
      'MMH: PV the payable at US deposit rate (4% / 4 = 1% for 3 months) = $990,099. Convert at spot 1.25 = £792,079 needed. Borrow GBP at 5%/4 = 1.25%, repay £802,000. Effective ~£802k.',
      'Futures: number of contracts = exposure in GBP / contract size. Round, take futures profit/loss, combine with spot at close. Show basis residual.',
      'Option: buy £ call (right to buy £ at 1.250). Premium future-valued. Compare worst case to forward.',
      'Recommend the hedge with the lowest expected sterling cost given Passmores risk appetite, typically the forward unless flexibility is valued.',
      'Residual: forward locks the rate (no upside if dollar weakens). MMH ties up money market lines. Futures has basis risk. Option preserves upside but premium cost.',
    ],
    markScheme: [
      { item: 'Forward calculation', marks: 3 },
      { item: 'MMH calculation', marks: 5 },
      { item: 'Futures calculation', marks: 5 },
      { item: 'Option calculation', marks: 3 },
      { item: 'Recommendation', marks: 4 },
      { item: 'Residual risk', marks: 5 },
    ],
  },
];

export function MockPage() {
  const [active, setActive] = useState<Question | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState<Record<string, number>>({});
  const [exam, setExam] = useState({ on: false, secs: 3 * 3600 + 15 * 60 });

  useEffect(() => {
    if (!exam.on) return;
    if (exam.secs <= 0) return;
    const id = setInterval(() => setExam((e) => ({ ...e, secs: e.secs - 1 })), 1000);
    return () => clearInterval(id);
  }, [exam.on]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 border-l-4 border-l-danger">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[260px]">
              <Pill variant="danger" className="mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> Mock exam centre
              </Pill>
              <h1 className="font-display text-4xl tracking-wide uppercase">Sep/Dec 2025 official paper</h1>
              <p className="text-text/80 mt-2 max-w-2xl">
                Sit the live ACCA paper. Three cases worth 100 marks. 3 hours 15 minutes.
                Reveal model answers and mark scheme afterwards. Andrew Mower style coaching note based on score band.
              </p>
            </div>
            <div className="rounded-xl border-2 border-border bg-bg/70 p-4 min-w-[200px] text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-1">Exam timer</div>
              <div className={cn('font-mono text-3xl', exam.secs < 300 ? 'text-danger animate-pulse' : 'text-accent', 'scoreboard-led')}>
                {fmt(Math.max(0, exam.secs))}
              </div>
              <button
                className={cn('mt-2 btn !py-1.5 !px-3 !text-xs', exam.on ? 'btn-outline border-danger text-danger' : 'btn-primary')}
                onClick={() =>
                  exam.on
                    ? setExam({ on: false, secs: 3 * 3600 + 15 * 60 })
                    : setExam({ on: true, secs: 3 * 3600 + 15 * 60 })
                }
              >
                <i className={`fa-solid ${exam.on ? 'fa-stop' : 'fa-play'}`} /> {exam.on ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-3">
        {QUESTIONS.map((q) => (
          <motion.div key={q.ref} variants={fadeUp}>
            <Card>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <Pill variant="accent">{q.ref}</Pill>
                <Pill variant="primary">{q.marks} marks</Pill>
                <h3 className="font-display text-xl tracking-wide uppercase">{q.title}</h3>
                <button
                  className={cn('ml-auto', active?.ref === q.ref ? 'btn-accent' : 'btn-outline')}
                  onClick={() => {
                    setActive(active?.ref === q.ref ? null : q);
                    setReveal(false);
                  }}
                >
                  <i className="fa-solid fa-folder-open" /> {active?.ref === q.ref ? 'Close' : 'Open'}
                </button>
              </div>
              <AnimatePresence>
                {active?.ref === q.ref && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-4 rounded-xl border border-border bg-bg/40">
                      <p className="text-text/90 leading-relaxed">{q.brief}</p>
                      <div className="mt-3 grid gap-1.5">
                        {q.requirements.map((r, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="font-mono text-accent text-[12px]">[{r.marks}]</span>
                            <span className="text-text/85 text-[14px]">{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button className="btn-primary" onClick={() => setReveal(!reveal)}>
                        <i className="fa-solid fa-eye" /> {reveal ? 'Hide' : 'Reveal'} model answer
                      </button>
                      <button
                        className="btn-outline"
                        onClick={() => {
                          const v = prompt(`Self-mark ${q.ref}: how many of ${q.marks} marks did you score?`);
                          if (v !== null) setScore((s) => ({ ...s, [q.ref]: Math.max(0, Math.min(q.marks, Number(v))) }));
                        }}
                      >
                        <i className="fa-solid fa-pencil" /> Mark yourself
                      </button>
                      {score[q.ref] !== undefined && (
                        <span className="pill bg-primary text-bg">
                          Self-marked: {score[q.ref]}/{q.marks}
                        </span>
                      )}
                    </div>

                    <AnimatePresence>
                      {reveal && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4"
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border-2 border-primary bg-primary/[0.06]">
                              <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-2">
                                <i className="fa-solid fa-trophy mr-1" /> Model answer
                              </div>
                              <ol className="grid gap-2 list-decimal list-inside text-[13.5px] leading-relaxed text-text/90">
                                {q.modelAnswer.map((m, i) => (
                                  <li key={i}>{m}</li>
                                ))}
                              </ol>
                            </div>
                            <div className="p-4 rounded-xl border border-accent bg-accent/[0.05]">
                              <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold mb-2">
                                <i className="fa-solid fa-list-check mr-1" /> Mark scheme
                              </div>
                              <table className="w-full text-[13px]">
                                <tbody>
                                  {q.markScheme.map((m, i) => (
                                    <tr key={i} className="border-b border-border/40 last:border-b-0">
                                      <td className="py-1.5 pr-2 align-top">{m.item}</td>
                                      <td className="py-1.5 text-right font-mono text-accent">{m.marks}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* SCORE SUMMARY + COACH NOTE */}
      {Object.keys(score).length === QUESTIONS.length && (
        <ScoreSummary score={score} />
      )}
    </motion.div>
  );
}

function ScoreSummary({ score }: { score: Record<string, number> }) {
  const total = Object.values(score).reduce((a, b) => a + b, 0);
  const pct = (total / 100) * 100;
  const band =
    pct >= 70
      ? { label: 'Distinction territory', tone: 'primary', note: 'Outstanding. Keep this rhythm into June. Drill weak topics rather than rerunning strong ones.' }
      : pct >= 60
        ? { label: 'Comfortable pass', tone: 'primary', note: 'Solid foundation. Sharpen the application column: scenario figures, not generic theory.' }
        : pct >= 50
          ? { label: 'On the line', tone: 'accent', note: 'You will pass if you tighten technique. Read every requirement twice. Lead with the recommendation.' }
          : pct >= 40
            ? { label: 'Below the line', tone: 'accent', note: 'Foundation OK, technique poor. Revisit the proforma layouts. Quote scenario figures every paragraph.' }
            : { label: 'Resit risk', tone: 'danger', note: 'Step back. Two weeks of fixtures and pitfalls before another mock. Knowledge gaps will fix themselves with deliberate practice.' };
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
      <Card className="!p-7">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted">Final score</div>
            <div className="font-display text-7xl tracking-wide leading-none mt-2 text-accent scoreboard-led">
              {total}<span className="text-text/40 text-3xl">/100</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <Pill variant={band.tone as any}>{band.label}</Pill>
            <div className="text-[12px] text-muted mt-2">Pass mark 50</div>
          </div>
        </div>
        <CoachTip title="Coach Mower says">{band.note}</CoachTip>
      </Card>
    </motion.div>
  );
}
