import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Field, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';
import { cn } from '@/lib/cn';

const TIMER_KEY = 'tba_timer_pivots_v1';
const PLAN_KEY = 'tba_answer_plan_v1';

const VERB_CARDS = [
  { word: 'Recommend', shape: 'Lead with the decision in sentence 1, then justify with numbers, then condition.' },
  { word: 'Evaluate', shape: 'Set criteria up front. Score each option. Conclude with a pick and one reason.' },
  { word: 'Discuss', shape: 'For / against / synthesis. Quote scenario in each side. End with a balanced view.' },
  { word: 'Calculate', shape: 'Show every working line. Even wrong final numbers earn working marks.' },
  { word: 'Advise', shape: 'Address audience by role. Action verb. Conditional clauses. Watch for "the board".' },
  { word: 'Critically appraise', shape: 'Strengths, weaknesses, alternatives. Weight toward limitations + improvements.' },
  { word: 'Comment on', shape: '2-3 sentences. State, explain, link to wider implication.' },
  { word: 'Explain', shape: 'Define + worked example + why it matters in this scenario. No padding.' },
  { word: 'Assess', shape: 'Like evaluate but more directional. Pick a side and defend it.' },
  { word: 'Justify', shape: 'Recommendation already given; back it with 2-3 case-specific reasons.' },
  { word: 'Analyse', shape: 'Decompose into components. Quantify each. Conclude on driver vs symptom.' },
  { word: 'Compare', shape: 'Side-by-side table. Equal weight per item. Conclude on the differentiator.' },
];

const PLAN_TEMPLATES = [
  {
    id: 'plan-25-npv',
    title: '25-mark Investment Appraisal plan',
    fields: [
      { label: 'Method chosen (NPV / APV / FCF)', placeholder: 'APV — subsidised loan and changing gearing make this the right choice' },
      { label: 'Assumptions to flag in W1', placeholder: 'Nominal cash flows; tax 25% one-year lag; FX held constant; sensitivity on revenue' },
      { label: 'Workings to do (W1-W5)', placeholder: 'W1 revenues, W2 costs, W3 tax shield, W4 working capital, W5 discount rate' },
      { label: 'Sensitivity to test (variable + reason)', placeholder: 'Revenue volume — single-product launch in untested market' },
      { label: 'Recommendation skeleton', placeholder: 'Accept conditional on FX hedge in place and Phase 2 review at year 2' },
      { label: 'Two scenario figures to quote', placeholder: '£8m abatement capex; £45m project value' },
    ],
  },
  {
    id: 'plan-25-hedge',
    title: '25-mark Hedging plan',
    fields: [
      { label: 'Exposure (direction, amount, date)', placeholder: 'Receiving USD 12m in 90 days; want to fix GBP receipt' },
      { label: 'Instruments to compare', placeholder: 'Forward; MMH; futures (Sep contract); option (USD put strike 1.27)' },
      { label: 'Comparison table headings', placeholder: 'Method | Effective rate | Cash certain? | Cost / premium | Residual risk' },
      { label: 'Recommendation skeleton', placeholder: 'Use forward as base; consider 30% option overlay for upside if firm tolerates premium' },
      { label: 'Qualitative trade-off to mention', placeholder: 'Options preserve upside; balance-sheet impact of MMH; basis risk on futures' },
    ],
  },
  {
    id: 'plan-50-val',
    title: '50-mark Valuation / Acquisition plan',
    fields: [
      { label: 'Purpose of valuation (1 line)', placeholder: 'Acquisition target — bidder evaluating max bid for board' },
      { label: 'Method 1: name + assumption + value', placeholder: 'FCFF — 5-year explicit forecast, TV at year 5 with g=0' },
      { label: 'Method 2: name + assumption + value', placeholder: 'EV/EBITDA multiple — comparator listed peers, 8x' },
      { label: 'Method 3: name + assumption + value', placeholder: 'Asset-based floor — replacement value of facilities' },
      { label: 'Range: low / central / high', placeholder: 'Floor £80m, central £105m, upside £130m with synergies' },
      { label: 'Synergies — separate line', placeholder: '£12m PV cost synergies; £4m revenue synergies (stress-test heavily)' },
      { label: 'Negotiation stance', placeholder: 'Open at £95m; max bid £115m; walk-away at £125m' },
      { label: 'ESG / scepticism / commercial bullets', placeholder: 'Stress-test synergy at -50%; integration cost £6m; Roll hubris flag' },
    ],
  },
  {
    id: 'plan-100-mock',
    title: '100-mark Mock paper time-slice',
    fields: [
      { label: 'Q1 (50m, Section A) — minutes budget', placeholder: '90 min — read 5, plan 10, calc 50, write-up 25' },
      { label: 'Q1 mandatory headings', placeholder: 'Recommendation | Methodology | Numerical analysis | Risks | ESG | Conclusion' },
      { label: 'Q2 (25m, Section B) — minutes budget', placeholder: '45 min — pick the topic you\'re strongest on first' },
      { label: 'Q3 (25m, Section B) — minutes budget', placeholder: '45 min — hard-stop discipline; bullet rest if running out' },
      { label: 'Reading + planning total', placeholder: '15 min reading + 10 min planning across the paper' },
      { label: 'Submit buffer', placeholder: 'Stop writing at 3h 10m; 5 min to add PS bullets and submit' },
    ],
  },
];

export function StudyGuidePage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary"><i className="fa-solid fa-toolbox" /> Study Guide</span>
            <span className="chip">Mark Budget · Timer · Plans · Verbs</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            The four tools<br /><span className="text-gradient">you reach for mid-revision.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Apportion marks. Time your attempts. Plan your answer before you write. Translate the requirement verb.
            Everything saves to your device.
          </p>
        </div>
      </motion.section>

      <SectionTitle icon="fa-solid fa-coins">Mark Budget calculator</SectionTitle>
      <motion.div variants={fadeUp}><MarkBudget /></motion.div>

      <SectionTitle icon="fa-solid fa-stopwatch">Timer with Pivot log</SectionTitle>
      <motion.div variants={fadeUp}><TimerTool /></motion.div>

      <SectionTitle icon="fa-solid fa-pen-ruler" badge={<Pill>Saves locally</Pill>}>Answer Plan canvas</SectionTitle>
      <motion.div variants={fadeUp}><AnswerPlanCanvas /></motion.div>

      <SectionTitle icon="fa-solid fa-language" badge={<Pill variant="accent">Translate the verb</Pill>}>
        Requirement verb cards
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VERB_CARDS.map((v) => (
          <motion.div key={v.word} variants={fadeUp}>
            <Card className="!p-4 h-full">
              <div className="font-display text-lg uppercase tracking-wide text-primary">{v.word}</div>
              <p className="mt-1.5 text-[13px] text-ink leading-relaxed">{v.shape}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

function MarkBudget() {
  const [marks, setMarks] = useState(50);
  const [calcSplit, setCalcSplit] = useState(50);
  const [verb, setVerb] = useState('Recommend');

  const minutes = +(marks * 1.8).toFixed(1);
  const calcMin = +(minutes * (calcSplit / 100)).toFixed(1);
  const writeMin = +(minutes - calcMin).toFixed(1);

  // Heuristic split based on verb
  const verbSplit = useMemo(() => {
    const v = verb.toLowerCase();
    if (/calculat|analyse/.test(v)) return { calc: 65, app: 25, rec: 5, ps: 5 };
    if (/recommend|advise/.test(v)) return { calc: 30, app: 35, rec: 25, ps: 10 };
    if (/discuss|evaluate|assess|critically/.test(v)) return { calc: 20, app: 45, rec: 25, ps: 10 };
    if (/explain|comment|justify|compare/.test(v)) return { calc: 25, app: 50, rec: 15, ps: 10 };
    return { calc: 40, app: 35, rec: 15, ps: 10 };
  }, [verb]);

  return (
    <Card className="!p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Field label="Total marks">
            <input
              type="number"
              min={1}
              max={100}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]"
            />
          </Field>
          <Field label="Requirement verb">
            <select
              value={verb}
              onChange={(e) => setVerb(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px] mt-3"
            >
              {VERB_CARDS.map((v) => <option key={v.word}>{v.word}</option>)}
            </select>
          </Field>
          <Field label={`Time on calcs vs commentary (${calcSplit}% / ${100 - calcSplit}%)`}>
            <input
              type="range"
              min={20}
              max={80}
              value={calcSplit}
              onChange={(e) => setCalcSplit(Number(e.target.value))}
              className="w-full mt-3 accent-primary"
            />
          </Field>
          <p className="mt-3 text-[12px] text-muted">
            Rule of thumb: 1 mark ≈ 1.8 min (3h 15m for 100 marks). For calc-heavy parts, target 40-50% on the model, 50-60% on commentary.
          </p>
        </div>
        <div className="space-y-3">
          <KpiRow label="Total time" value={`${minutes} min`} sub={`${marks} marks × 1.8`} tone="primary" />
          <KpiRow label="Calculation block" value={`${calcMin} min`} sub={`${calcSplit}% of total`} tone="accent" />
          <KpiRow label="Commentary / write-up" value={`${writeMin} min`} sub={`${100 - calcSplit}% of total`} tone="primary" />
          <div className="rounded-xl border border-border bg-slate-50 p-4">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">
              Suggested mark split for "{verb}"
            </div>
            <SplitBar split={verbSplit} marks={marks} />
            <p className="mt-2 text-[11.5px] text-muted">
              Heuristic only. Read the requirement carefully — examiner allocations are explicit.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function SplitBar({ split, marks }: { split: { calc: number; app: number; rec: number; ps: number }; marks: number }) {
  // Reconciled split — first three segments round normally; PS absorbs
  // rounding error so the four marks ALWAYS sum to `marks`.
  const calc = Math.round((split.calc / 100) * marks);
  const app = Math.round((split.app / 100) * marks);
  const rec = Math.round((split.rec / 100) * marks);
  const ps = marks - calc - app - rec;
  const raw = [
    { label: 'Calc', pct: split.calc, color: '#00a347', marks: calc },
    { label: 'Application', pct: split.app, color: '#f5b800', marks: app },
    { label: 'Recommend', pct: split.rec, color: '#0ea5e9', marks: rec },
    { label: 'PS', pct: split.ps, color: '#a78bfa', marks: ps },
  ];
  const segments = raw;
  return (
    <div>
      <div className="h-3 rounded-full overflow-hidden flex" role="img" aria-label="Mark allocation split">
        {segments.map((s) => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label} ${s.pct}% · ${s.marks}m`} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11.5px]">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} aria-hidden="true" />
            <span className="text-muted">{s.label}</span>
            <span className="text-ink font-mono ml-auto">{s.marks}m</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KpiRow({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'primary' | 'accent' }) {
  const colors = tone === 'primary' ? 'border-primary/30 bg-primary/5' : 'border-accent/40 bg-accent/5';
  const text = tone === 'primary' ? 'text-primary' : 'text-accent-dark';
  return (
    <div className={cn('rounded-xl border p-4', colors)}>
      <div className="text-[11px] uppercase tracking-wider text-muted font-bold">{label}</div>
      <div className={cn('font-display text-3xl mt-1 leading-none', text)}>{value}</div>
      <div className="text-[11.5px] text-muted mt-1">{sub}</div>
    </div>
  );
}

interface PivotEntry { ts: number; note: string; elapsedSec: number; }

function TimerTool() {
  const [budgetMin, setBudgetMin] = useState(45);
  const [secLeft, setSecLeft] = useState(45 * 60);
  const [running, setRunning] = useState(false);
  const [pivots, setPivots] = useState<PivotEntry[]>(() => safeReadJson<PivotEntry[]>(TIMER_KEY, []));
  const [pivotNote, setPivotNote] = useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => { safeWriteJson(TIMER_KEY, pivots.slice(-30)); }, [pivots]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setSecLeft((s) => {
        if (s <= 0) { setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [running]);

  // keyboard: space toggles, P pivots, R resets
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (e.code === 'Space') { e.preventDefault(); setRunning((r) => !r); }
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); pivot(); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); reset(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetMin, secLeft]);

  const totalSec = budgetMin * 60;
  const elapsed = totalSec - secLeft;
  const pct = Math.max(0, Math.min(100, (elapsed / totalSec) * 100));
  const warn75 = pct >= 75 && pct < 90;
  const warn90 = pct >= 90;

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => { setRunning(false); setSecLeft(budgetMin * 60); };

  const pivot = () => {
    const entry: PivotEntry = {
      ts: Date.now(),
      note: pivotNote.trim() || `Pivoted at ${Math.round(elapsed / 60)} min`,
      elapsedSec: elapsed,
    };
    setPivots((p) => [entry, ...p].slice(0, 30));
    setPivotNote('');
  };
  const clearPivots = () => { if (confirm('Clear pivot log?')) setPivots([]); };

  const setBudget = (m: number) => { setBudgetMin(m); setSecLeft(m * 60); setRunning(false); };

  const mm = String(Math.floor(secLeft / 60)).padStart(2, '0');
  const ss = String(secLeft % 60).padStart(2, '0');

  return (
    <Card className="!p-6">
      <div className="grid md:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[11px] uppercase tracking-wider text-muted font-bold">Time remaining</span>
            <span className={cn('text-[11px] font-mono ml-auto', warn90 ? 'text-danger font-bold' : warn75 ? 'text-accent-dark font-bold' : 'text-muted')}>
              {warn90 ? 'Final 10% — submit / pivot now' : warn75 ? '75% used — wrap up' : `${Math.round(pct)}% used`}
            </span>
          </div>
          <div className={cn(
            'rounded-2xl border-2 p-6 grid place-items-center transition-colors',
            warn90 ? 'border-danger bg-danger/5' : warn75 ? 'border-accent bg-accent/5' : 'border-primary bg-primary/5',
          )}>
            <div className={cn('font-mono text-[80px] leading-none tracking-wider', warn90 ? 'text-danger' : warn75 ? 'text-accent-dark' : 'text-primary')}>
              {mm}:{ss}
            </div>
            <div className="mt-1 text-[12px] text-muted uppercase tracking-wider">{budgetMin}-min budget</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className={cn('h-full transition-all', warn90 ? 'bg-danger' : warn75 ? 'bg-accent' : 'bg-primary')} style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {!running && <button onClick={start} className="btn-primary"><i className="fa-solid fa-play" /> Start</button>}
            {running && <button onClick={pause} className="btn-outline"><i className="fa-solid fa-pause" /> Pause</button>}
            <button onClick={reset} className="btn-ghost"><i className="fa-solid fa-rotate-left" /> Reset</button>
            <button onClick={pivot} className="btn-accent"><i className="fa-solid fa-arrow-right-arrow-left" /> Pivot · log</button>
            <span className="text-[11px] text-muted ml-auto self-center">
              Keyboard: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">Space</kbd> start/pause ·
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">P</kbd> pivot ·
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border ml-1">R</kbd> reset
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[25, 35, 45, 90].map((m) => (
              <button
                key={m}
                onClick={() => setBudget(m)}
                className={cn('pill border border-border bg-white justify-center', budgetMin === m && 'bg-primary text-white border-primary')}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Pivot note (optional)</div>
          <input
            value={pivotNote}
            onChange={(e) => setPivotNote(e.target.value)}
            placeholder="e.g. Moved off APV to start hedge calc"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[13px]"
          />
          <div className="mt-3 text-[11px] uppercase tracking-wider text-muted font-bold flex items-center justify-between">
            <span>Pivot log ({pivots.length})</span>
            {pivots.length > 0 && <button onClick={clearPivots} className="text-danger hover:underline normal-case tracking-normal">Clear</button>}
          </div>
          <div className="mt-2 max-h-[260px] overflow-y-auto pr-1 space-y-1.5">
            {pivots.length === 0 && <p className="text-[12.5px] text-muted">No pivots yet. Each time you move off a sub-part before finishing it, log the moment so the next debrief has data.</p>}
            {pivots.map((p, i) => (
              <div key={p.ts + '_' + i} className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-[12px]">
                <div className="flex justify-between text-muted">
                  <span className="font-mono">{Math.floor(p.elapsedSec / 60)}m {p.elapsedSec % 60}s in</span>
                  <span>{new Date(p.ts).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-ink">{p.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function AnswerPlanCanvas() {
  const [openId, setOpenId] = useState(PLAN_TEMPLATES[0].id);
  const [plans, setPlans] = useState<Record<string, Record<string, string>>>(() => safeReadJson<Record<string, Record<string, string>>>(PLAN_KEY, {}));

  useEffect(() => { safeWriteJson(PLAN_KEY, plans); }, [plans]);

  const open = PLAN_TEMPLATES.find((t) => t.id === openId)!;
  const planData = plans[openId] || {};

  const setField = (label: string, val: string) => {
    setPlans((p) => ({ ...p, [openId]: { ...(p[openId] || {}), [label]: val } }));
  };

  const clear = () => {
    if (!confirm(`Clear the "${open.title}" plan?`)) return;
    setPlans((p) => { const next = { ...p }; delete next[openId]; return next; });
  };

  return (
    <Card className="!p-5">
      <div className="flex flex-wrap gap-2 mb-4">
        {PLAN_TEMPLATES.map((t) => {
          const filled = plans[t.id] ? Object.values(plans[t.id]).filter((v) => v && v.trim()).length : 0;
          return (
            <button
              key={t.id}
              onClick={() => setOpenId(t.id)}
              className={cn(
                'pill border border-border bg-white',
                openId === t.id && 'bg-primary text-white border-primary',
              )}
            >
              {t.title} {filled > 0 && <span className="ml-1.5 text-[10px] opacity-70">·{filled}</span>}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {open.fields.map((f) => (
          <div key={f.label}>
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1">{f.label}</div>
            <textarea
              rows={2}
              value={planData[f.label] || ''}
              onChange={(e) => setField(f.label, e.target.value)}
              placeholder={f.placeholder}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[13.5px] leading-relaxed"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11.5px] text-muted">
        <span><i className="fa-solid fa-floppy-disk text-primary" /> Auto-saved on this device</span>
        <button onClick={clear} className="text-danger hover:underline">Clear this plan</button>
      </div>
    </Card>
  );
}

