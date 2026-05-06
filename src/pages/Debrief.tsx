import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import {
  buildCritique,
  loadSessions,
  saveSession,
  deleteSession,
  summariseTrends,
  type DebriefSession,
  type SkillRating,
  type StructuralCritique,
} from '@/lib/debrief';
import { cn } from '@/lib/cn';

const SKILL_LABELS: Record<keyof DebriefSession['selfRating'], string> = {
  communication: 'Communication',
  analysis: 'Analysis & Evaluation',
  scepticism: 'Scepticism',
  commercial: 'Commercial Acumen',
  calc: 'Calculation accuracy',
};

/* ─────────────────────────────────────────────
   Index
   ───────────────────────────────────────────── */
export function DebriefIndexPage() {
  const [sessions, setSessions] = useState<DebriefSession[]>(() => loadSessions());
  const trends = useMemo(() => summariseTrends(sessions), [sessions]);
  const navigate = useNavigate();

  const startNew = () => navigate('/debrief/new');
  const remove = (id: string) => {
    if (!confirm('Delete this debrief session?')) return;
    deleteSession(id);
    setSessions(loadSessions());
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.06] via-white to-primary/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip" style={{ borderColor: 'rgba(14,165,233,0.4)', background: 'rgba(14,165,233,0.10)', color: '#0369a1' }}>
              <i className="fa-solid fa-clipboard-check" /> Self-Debrief
            </span>
            <span className="chip">After-attempt only</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            What did I miss?<br /><span className="text-gradient">Get the structural review.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Already attempted a question? Paste your <strong>own</strong> answer and get a structural critique:
            recommendation upfront, working refs, sensitivity, scenario figures, ESG, time discipline.
            We never rewrite your answer or produce a model answer.
          </p>
          <div className="mt-5">
            <button onClick={startNew} className="btn-primary">
              <i className="fa-solid fa-plus" /> Start a new debrief
            </button>
          </div>

          {/* Disclaimer banner */}
          <div className="mt-5 rounded-xl border-l-4 border-l-danger bg-danger/[0.04] p-4 text-[13px] leading-relaxed text-ink">
            <strong className="text-danger">Honour rule.</strong> This tool will not write your homework for you,
            and it will not rephrase live ACCA Practice Platform questions. It only reviews <em>your already-submitted attempt</em>
            against the technique markers the AFM examiner rewards.
          </div>
        </div>
      </motion.section>

      {/* Trends */}
      {sessions.length > 0 && (
        <>
          <SectionTitle icon="fa-solid fa-chart-line">Trends across {trends.total} session{trends.total === 1 ? '' : 's'}</SectionTitle>
          <motion.div variants={fadeUp}>
            <Card className="!p-5">
              <div className="grid sm:grid-cols-3 gap-4">
                <Tile label="Avg structural score" value={`${trends.averageMarksPercent}%`} sub="across past critiques" />
                <Tile label="Weakest skill (self-rated)" value={trends.weakestSkill ? SKILL_LABELS[trends.weakestSkill as keyof typeof SKILL_LABELS] || '—' : '—'} sub="lowest of the four PS skills" />
                <Tile label="Most-missed signal" value={trends.weakestSignals[0]?.name || '—'} sub={trends.weakestSignals[0] ? `weak in ${trends.weakestSignals[0].weakCount} sessions` : ''} />
              </div>
              {trends.weakestSignals.length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Drill these next</div>
                  <ul className="space-y-1 text-[13.5px] text-ink">
                    {trends.weakestSignals.map((w) => (
                      <li key={w.name} className="flex justify-between border-t border-border pt-1.5">
                        <span>{w.name}</span>
                        <span className="font-mono text-danger">×{w.weakCount} weak</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}

      {/* Past sessions */}
      <SectionTitle icon="fa-solid fa-list" badge={<Pill>{sessions.length} saved</Pill>}>
        Past debriefs
      </SectionTitle>
      {sessions.length === 0 && (
        <motion.div variants={fadeUp}>
          <Card className="!p-6 text-center">
            <p className="text-ink/70 leading-relaxed">
              No debriefs yet. Sit a 25-mark practice question, submit it on the SH+ Practice Platform,
              then paste your answer here for a structural review.
            </p>
            <button onClick={startNew} className="btn-primary mt-4 mx-auto">
              <i className="fa-solid fa-arrow-right" /> Start your first debrief
            </button>
          </Card>
        </motion.div>
      )}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sessions.map((s) => {
          const date = new Date(s.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          const score = s.critique ? Math.round((s.critique.signals.filter((x) => x.verdict === 'strong').length / s.critique.signals.length) * 100) : null;
          return (
            <motion.div key={s.id} variants={fadeUp}>
              <Card className="h-full">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Pill variant="primary">W{s.weekNum}</Pill>
                  <Pill>{s.marks}m</Pill>
                  <Pill>{date}</Pill>
                  {score !== null && (
                    <Pill variant={score >= 70 ? 'primary' : score >= 50 ? 'accent' : 'danger'} className="ml-auto">{score}%</Pill>
                  )}
                </div>
                <h3 className="font-display text-xl tracking-wide uppercase text-ink leading-tight">{s.topic || 'Untitled'}</h3>
                <p className="text-[13px] text-muted mt-1">
                  Took {s.timeTakenMin} / {s.timeAllowedMin} min · {s.userAnswer.trim().split(/\s+/).length} words
                </p>
                {s.actionItems.length > 0 && (
                  <ul className="mt-2 text-[12.5px] text-ink/85 space-y-0.5">
                    {s.actionItems.slice(0, 2).map((a, i) => (
                      <li key={i} className="line-clamp-1"><i className="fa-solid fa-arrow-right text-primary text-[10px] mr-1.5" />{a}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex items-center gap-3 text-[12px]">
                  <Link to={`/debrief/${s.id}`} className="text-primary font-bold hover:underline">Open <i className="fa-solid fa-arrow-right" /></Link>
                  <button onClick={() => remove(s.id)} className="text-muted hover:text-danger ml-auto">Delete</button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   New / Edit
   ───────────────────────────────────────────── */
export function DebriefNewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState('');
  const [weekNum, setWeekNum] = useState(1);
  const [marks, setMarks] = useState(25);
  const [timeAllowedMin, setTimeAllowedMin] = useState(45);
  const [timeTakenMin, setTimeTakenMin] = useState(45);
  const [ownWorkConfirmed, setOwnWorkConfirmed] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [rating, setRating] = useState<DebriefSession['selfRating']>({
    communication: 3, analysis: 3, scepticism: 3, commercial: 3, calc: 3,
  });
  const [actionItems, setActionItems] = useState<string[]>(['', '', '']);
  const [critique, setCritique] = useState<StructuralCritique | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canRunCritique = ownWorkConfirmed && userAnswer.trim().length > 80;

  const runCritique = () => {
    setError(null);
    if (!ownWorkConfirmed) {
      setError('You must confirm this is your own already-submitted work before any critique runs.');
      return;
    }
    if (userAnswer.trim().length < 80) {
      setError('Paste your full attempt (at least 80 characters) before running a critique.');
      return;
    }
    try {
      const c = buildCritique({
        id: '', createdAt: 0, weekNum, topic, marks, timeAllowedMin, timeTakenMin,
        ownWorkConfirmed, selfRating: rating, userAnswer, actionItems: [],
      });
      setCritique(c);
      setStep(5);
    } catch (e: any) {
      setError(e.message || 'Could not generate critique.');
    }
  };

  const save = () => {
    const s: DebriefSession = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      weekNum, topic, marks, timeAllowedMin, timeTakenMin,
      ownWorkConfirmed, selfRating: rating, userAnswer,
      critique,
      actionItems: actionItems.map((a) => a.trim()).filter(Boolean),
    };
    saveSession(s);
    navigate(`/debrief/${s.id}`);
  };

  const STEPS = [
    { n: 1, label: 'Question metadata' },
    { n: 2, label: 'Your own attempt' },
    { n: 3, label: 'Self-rating' },
    { n: 4, label: 'Run critique' },
    { n: 5, label: 'Action items' },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-5 mb-4">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Pill variant="primary"><i className="fa-solid fa-clipboard-check" /> Debrief workflow</Pill>
            <Pill>Step {step} of 5</Pill>
            <Link to="/debrief" className="text-[12px] text-muted hover:text-primary ml-auto">← Back to index</Link>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {STEPS.map((s) => (
              <div key={s.n} className={cn(
                'h-1.5 rounded-full',
                step >= s.n ? 'bg-primary' : 'bg-slate-200',
              )} />
            ))}
          </div>
          <div className="mt-2 text-[11.5px] uppercase tracking-wider text-muted font-bold">{STEPS[step - 1].label}</div>
        </Card>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="!p-6">
              <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-4">Question metadata</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Topic (free text — generic only)">
                  <input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. International NPV, FX hedge, M&A valuation"
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]"
                  />
                </Field>
                <Field label="SH+ week">
                  <select value={weekNum} onChange={(e) => setWeekNum(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]">
                    {[0,1,2,3,4,5].map((w) => <option key={w} value={w}>{w === 0 ? 'Foundations' : `Week ${w}`}</option>)}
                  </select>
                </Field>
                <Field label="Marks">
                  <input type="number" min={1} max={100} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]" />
                </Field>
                <Field label="Time allowed (min)">
                  <input type="number" min={1} max={300} value={timeAllowedMin} onChange={(e) => setTimeAllowedMin(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]" />
                </Field>
                <Field label="Time you actually took (min)">
                  <input type="number" min={1} max={300} value={timeTakenMin} onChange={(e) => setTimeTakenMin(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]" />
                </Field>
              </div>
              <div className="mt-5 flex justify-end">
                <button onClick={() => setStep(2)} className="btn-primary">
                  Next <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="!p-6">
              <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-2">Your own attempt</h2>

              <div className="rounded-xl border-l-4 border-l-danger bg-danger/[0.04] p-4 mb-4 text-[13px] leading-relaxed text-ink">
                <strong className="text-danger">Read first.</strong> Paste your <strong>own</strong> answer that you have <strong>already submitted</strong> on the ACCA Practice Platform.
                This tool reviews technique only. It will not rewrite your answer.
              </div>

              <Field label="Paste your own answer (markdown OK; W1, W2 working refs encouraged)">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={14}
                  placeholder="To: Board of [Company]&#10;From: Senior Financial Adviser&#10;Subject: Recommendation on...&#10;&#10;EXECUTIVE SUMMARY&#10;I recommend ..."
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[13.5px] font-mono leading-relaxed"
                />
              </Field>

              <label className="mt-4 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ownWorkConfirmed}
                  onChange={(e) => setOwnWorkConfirmed(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-primary"
                />
                <span className="text-[13px] leading-relaxed text-ink">
                  <strong className="text-ink">I confirm</strong> this is my own work, already submitted to ACCA (or my private practice attempt).
                  I am using this tool only to review my technique. I will not paste a live, unsubmitted homework question.
                </span>
              </label>

              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(1)} className="btn-ghost"><i className="fa-solid fa-arrow-left" /> Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!ownWorkConfirmed || userAnswer.trim().length < 80}
                  className="btn-primary disabled:opacity-40"
                >
                  Next <i className="fa-solid fa-arrow-right" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="!p-6">
              <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-1">Self-rating</h2>
              <p className="text-[13px] text-muted mb-4">Rate yourself before the tool gives you its view. Honest ratings beat optimistic ones.</p>
              <div className="space-y-3">
                {(Object.keys(SKILL_LABELS) as Array<keyof typeof SKILL_LABELS>).map((k) => (
                  <div key={k} className="flex items-center gap-3">
                    <span className="text-[13px] w-44 text-ink">{SKILL_LABELS[k]}</span>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setRating((r) => ({ ...r, [k]: n as SkillRating }))}
                          className={cn(
                            'w-9 h-9 rounded-lg border text-[13px] font-bold transition-colors',
                            rating[k] === n ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-border hover:border-primary',
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(2)} className="btn-ghost"><i className="fa-solid fa-arrow-left" /> Back</button>
                <button onClick={() => setStep(4)} className="btn-primary">Next <i className="fa-solid fa-arrow-right" /></button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <Card className="!p-6">
              <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-2">Run structural critique</h2>
              <div className="rounded-xl border-l-4 border-l-primary bg-primary/[0.05] p-4 mb-4 text-[13.5px] leading-relaxed text-ink">
                <strong>What this does.</strong> Checks 8 structural signals on your answer: recommendation upfront,
                working references, sensitivity, counter-arguments, scenario figures quoted, headings,
                ESG mention, time discipline, depth.
                <br /><br />
                <strong>What it does not do.</strong> Rewrite your answer. Generate a model answer. Suggest specific numbers
                or content for the question.
              </div>
              {error && (
                <div className="rounded-xl border border-danger bg-danger/5 p-3 mb-4 text-[13px] text-danger">{error}</div>
              )}
              <div className="flex justify-between">
                <button onClick={() => setStep(3)} className="btn-ghost"><i className="fa-solid fa-arrow-left" /> Back</button>
                <button onClick={runCritique} disabled={!canRunCritique} className="btn-primary disabled:opacity-40">
                  <i className="fa-solid fa-bolt" /> Run critique
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {step === 5 && critique && (
          <motion.div key="s5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <CritiquePanel critique={critique} />
            <Card className="!p-6 mt-4">
              <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-2">Action items</h2>
              <p className="text-[13px] text-muted mb-3">Three things you will do differently next time. Keep them concrete.</p>
              <div className="space-y-2">
                {actionItems.map((a, i) => (
                  <input
                    key={i}
                    value={a}
                    onChange={(e) => setActionItems((arr) => arr.map((x, j) => j === i ? e.target.value : x))}
                    placeholder={['Lead with the recommendation in sentence 1.', 'Add at least one "however" sentence.', 'Quote three scenario figures.'][i]}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]"
                  />
                ))}
              </div>
              <div className="mt-5 flex justify-between">
                <button onClick={() => setStep(4)} className="btn-ghost"><i className="fa-solid fa-arrow-left" /> Back</button>
                <button onClick={save} className="btn-primary"><i className="fa-solid fa-save" /> Save debrief</button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   View saved
   ───────────────────────────────────────────── */
export function DebriefViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = useMemo(() => loadSessions().find((s) => s.id === id) || null, [id]);

  useEffect(() => {
    if (!session && id !== 'new') navigate('/debrief', { replace: true });
  }, [session, id, navigate]);

  if (!session) return null;
  const date = new Date(session.createdAt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Pill variant="primary">W{session.weekNum}</Pill>
            <Pill>{session.marks}m</Pill>
            <Pill>{date}</Pill>
            <Pill>{session.timeTakenMin} / {session.timeAllowedMin} min</Pill>
            <Link to="/debrief" className="text-[12px] text-muted hover:text-primary ml-auto">← All debriefs</Link>
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">
            {session.topic || 'Debrief'}
          </h1>
          <p className="mt-2 text-ink/75 text-[13.5px]">
            {session.userAnswer.trim().split(/\s+/).length} words submitted · {session.actionItems.length} action items logged.
          </p>
        </Card>
      </motion.div>

      {session.critique && (
        <motion.div variants={fadeUp} className="mt-4">
          <CritiquePanel critique={session.critique} />
        </motion.div>
      )}

      {session.actionItems.length > 0 && (
        <>
          <SectionTitle icon="fa-solid fa-list-check">Action items</SectionTitle>
          <motion.div variants={fadeUp}>
            <Card className="!p-5">
              <ol className="space-y-2 list-decimal pl-5 text-[14px] text-ink leading-relaxed">
                {session.actionItems.map((a, i) => <li key={i}>{a}</li>)}
              </ol>
            </Card>
          </motion.div>
        </>
      )}

      <SectionTitle icon="fa-solid fa-star-half-stroke">Your self-rating</SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(Object.keys(SKILL_LABELS) as Array<keyof typeof SKILL_LABELS>).map((k) => (
          <motion.div key={k} variants={fadeUp}>
            <Card className="!p-4 text-center">
              <div className="text-[10.5px] uppercase tracking-wider text-muted font-bold">{SKILL_LABELS[k]}</div>
              <div className="font-display text-3xl text-primary mt-1">{session.selfRating[k]}</div>
              <div className="text-[10px] text-muted">/ 5</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── shared ─── */

function CritiquePanel({ critique }: { critique: StructuralCritique }) {
  const strong = critique.signals.filter((s) => s.verdict === 'strong').length;
  const pct = Math.round((strong / critique.signals.length) * 100);
  return (
    <Card className="!p-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-2xl grid place-items-center font-display text-2xl text-white" style={{ background: 'linear-gradient(135deg, #00b54e 0%, #f5b800 140%)' }}>
          {pct}%
        </div>
        <div>
          <h2 className="font-display text-2xl tracking-wide uppercase text-ink leading-tight">Structural critique</h2>
          <p className="text-[12.5px] text-muted">{strong} of {critique.signals.length} signals strong.</p>
        </div>
      </div>
      <div className="space-y-2">
        {critique.signals.map((s) => (
          <div key={s.name} className={cn(
            'rounded-xl border px-3.5 py-2.5',
            s.verdict === 'strong' && 'border-primary/30 bg-primary/5',
            s.verdict === 'weak' && 'border-accent/40 bg-accent/[0.06]',
            s.verdict === 'absent' && 'border-danger/40 bg-danger/[0.04]',
          )}>
            <div className="flex items-center gap-2">
              <i className={cn(
                'fa-solid',
                s.verdict === 'strong' && 'fa-circle-check text-primary',
                s.verdict === 'weak' && 'fa-circle-exclamation text-accent-dark',
                s.verdict === 'absent' && 'fa-circle-xmark text-danger',
              )} />
              <span className="font-bold text-ink text-[13.5px]">{s.name}</span>
            </div>
            <p className="text-[12.5px] text-ink/75 mt-1 leading-relaxed">{s.note}</p>
          </div>
        ))}
      </div>
      {critique.professionalSkillsRisks.length > 0 && (
        <div className="mt-4 rounded-xl border border-dashed border-danger/40 bg-danger/[0.04] p-4">
          <div className="text-[11px] uppercase tracking-wider text-danger font-bold mb-2">
            <i className="fa-solid fa-triangle-exclamation" /> Professional skill marks at risk
          </div>
          <ul className="space-y-1 text-[13px] text-ink leading-relaxed">
            {critique.professionalSkillsRisks.map((r, i) => (
              <li key={i}><strong>{r.skill}.</strong> {r.risk}</li>
            ))}
          </ul>
        </div>
      )}
      {critique.techniqueGaps.length > 0 && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
          <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">
            <i className="fa-solid fa-arrow-right" /> Technique to revisit
          </div>
          <ul className="space-y-1 text-[13px] text-ink leading-relaxed">
            {critique.techniqueGaps.map((g) => (
              <li key={g}><i className="fa-solid fa-bookmark text-primary text-[10px] mr-1.5" /> {g}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-4 text-[11.5px] italic text-muted leading-relaxed">{critique.noticesNotReWrite}</p>
    </Card>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3.5">
      <div className="text-[10.5px] uppercase tracking-wider text-muted font-bold">{label}</div>
      <div className="font-display text-2xl text-primary leading-none mt-1">{value}</div>
      <div className="text-[11.5px] text-ink/70 mt-1">{sub}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1 block">{label}</span>
      {children}
    </label>
  );
}
