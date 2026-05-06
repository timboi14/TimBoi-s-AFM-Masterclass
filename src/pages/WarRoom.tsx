import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { cn } from '@/lib/cn';

const WAR_KEY = 'tba_warroom_v1';

interface ChecklistItem { id: string; text: string; }
interface ChecklistGroup { id: string; title: string; icon: string; tone: 'primary' | 'accent' | 'danger'; items: ChecklistItem[]; }

const GROUPS: ChecklistGroup[] = [
  {
    id: 'tnight',
    title: 'T-1 night',
    icon: 'fa-moon',
    tone: 'primary',
    items: [
      { id: 'tn1', text: 'Skim the Formula sheet ONCE. Cover, recall, check. Do not open new topics.' },
      { id: 'tn2', text: 'Read the Section A board-paper template aloud (heading, recommendation, methodology, numbers, sensitivities, ESG, recommendations).' },
      { id: 'tn3', text: 'Verify CBE access: ACCA-On-Demand link works, ID ready, location confirmed.' },
      { id: 'tn4', text: 'Lay out: photo ID, calculator, pen, water, tissue, snack, layered clothes.' },
      { id: 'tn5', text: 'Light dinner. No alcohol. Phone off by 22:00.' },
      { id: 'tn6', text: 'Sleep target: 7-8 hours. Set TWO alarms.' },
    ],
  },
  {
    id: 'tmorning',
    title: 'T-0 morning',
    icon: 'fa-sun',
    tone: 'accent',
    items: [
      { id: 'tm1', text: 'Wake 2.5 hours before exam. Eat protein + slow carbs.' },
      { id: 'tm2', text: 'Skim the 6 high-yield mnemonics: WACC, CAPM, M&M2 ungear, Fisher, IRP, BSOP call.' },
      { id: 'tm3', text: 'Re-read the Issue-Action-Outcome ESG pattern.' },
      { id: 'tm4', text: 'Walk 10 minutes. Lower cortisol.' },
      { id: 'tm5', text: 'Arrive 30 minutes early. Phone in locker. Drink water.' },
    ],
  },
  {
    id: 'opening',
    title: 'First 10 minutes of the paper',
    icon: 'fa-stopwatch',
    tone: 'danger',
    items: [
      { id: 'o1', text: 'Read Section A requirements FIRST (not the case). 3 minutes.' },
      { id: 'o2', text: 'Choose 2 of the 3 Section B questions before reading them in full. 2 minutes.' },
      { id: 'o3', text: 'Mark the time budget on each question (1.95 min/mark = roughly 1m 57s).' },
      { id: 'o4', text: 'Open the spreadsheet shell. Set up your proforma rows: Year 0, 1, 2, 3, 4, 5.' },
      { id: 'o5', text: 'Open a Word answer doc. Type your headings BEFORE the calculations.' },
    ],
  },
  {
    id: 'fivemin',
    title: 'Final 5 minutes (before submit)',
    icon: 'fa-flag-checkered',
    tone: 'primary',
    items: [
      { id: 'f1', text: 'Add the Professional Skills bullets (Communication, Analysis, Scepticism, Commercial). 4 marks earned in 3 minutes.' },
      { id: 'f2', text: 'Confirm every calculation has a one-line conclusion ("Recommend proceed because NPV is +£X").' },
      { id: 'f3', text: 'Confirm ESG paragraph is in Section A answer.' },
      { id: 'f4', text: 'Number every working W1-W5 and reference them from the main answer.' },
      { id: 'f5', text: 'Submit BEFORE the timer hits zero — auto-submit risks losing the last paragraph.' },
    ],
  },
];

const CALC_SHORTCUTS: { keys: string; label: string; tip: string }[] = [
  { keys: 'Ctrl + Z / Y', label: 'Undo / Redo', tip: 'Critical when you fat-finger a formula. Works in both spreadsheet and word answer.' },
  { keys: 'Ctrl + B / I / U', label: 'Bold / italic / underline', tip: 'Use bold for headings and the recommendation. The marker scans for structure first.' },
  { keys: 'Ctrl + Shift + 7', label: 'Bullet list (Word answer)', tip: 'Bullet your professional-skills section.' },
  { keys: 'Ctrl + 1', label: 'Format cells (spreadsheet)', tip: 'Switch number formatting to comma + 2dp once. Saves rework on every number.' },
  { keys: 'F2', label: 'Edit cell in place', tip: 'Faster than double-clicking when checking a long formula.' },
  { keys: 'F4', label: 'Toggle absolute reference $A$1', tip: 'Locks the cost-of-capital cell when you copy NPV across years.' },
  { keys: 'Alt + Enter', label: 'New line within a cell', tip: 'Clean working notes inside one cell.' },
  { keys: 'Ctrl + Arrow', label: 'Jump to data edge', tip: 'Navigate the proforma without scroll-fatigue.' },
];

const FN_LIBRARY: { fn: string; usage: string; afm: string }[] = [
  { fn: 'NPV(rate, cf1, cf2, ...)', usage: 'NPV(0.10, B2:B6) + B1', afm: 'CRITICAL: ACCA NPV() ignores year-0 cash flow. Add the year-0 outflow separately.' },
  { fn: 'IRR(values, [guess])', usage: 'IRR(A1:A6)', afm: 'Pass the FULL series including the year-0 outflow as a negative.' },
  { fn: 'MIRR(values, finance_rate, reinvest_rate)', usage: 'MIRR(A1:A6, 0.06, 0.10)', afm: 'Use MIRR when the question gives a separate reinvestment rate.' },
  { fn: 'NORM.S.DIST(z, TRUE)', usage: 'NORM.S.DIST(1.96, TRUE)', afm: 'Look up N(d1) and N(d2) for Black-Scholes without tables.' },
  { fn: 'EXP(x)', usage: 'EXP(-r*t)', afm: 'Continuous discounting: e^(-rt). Used in BSOP for Pe discount.' },
  { fn: 'LN(x)', usage: 'LN(Pa/Pe)', afm: 'Natural log inside the d1 numerator for Black-Scholes.' },
  { fn: 'SQRT(x)', usage: 'SQRT(t)', afm: 'Volatility scaling. Also for T-day VaR = 1-day VaR × sqrt(T).' },
  { fn: 'SUMPRODUCT', usage: 'SUMPRODUCT(probs, outcomes)', afm: 'Expected NPV with discrete probabilities. Faster than IF chains.' },
];

const COMMON_LOSERS: { topic: string; loss: string; fix: string }[] = [
  { topic: 'NPV', loss: 'Mixing real cash flows with a nominal discount rate (Fisher trap)', fix: 'State whether you are working in real or nominal terms in W1. Stay consistent.' },
  { topic: 'NPV', loss: 'Treating tax-allowable depreciation as a cash outflow', fix: 'Depreciation is not cash. The tax SAVING on it (Dep × T) is the cash flow.' },
  { topic: 'WACC', loss: 'Using book values not market values for E and D weights', fix: 'Always market values unless told otherwise. Quote the source.' },
  { topic: 'APV', loss: 'Discounting the tax shield at WACC', fix: 'WACC already embeds the tax shield. Discount it at Kd or Rf to avoid double-counting.' },
  { topic: 'BSOP', loss: 'Flipping Pa and Pe (asset price vs exercise price)', fix: 'Pa = what you GET on exercise. Pe = what you PAY on exercise. Write them down before any sums.' },
  { topic: 'BSOP', loss: 'Using simple discounting on Pe instead of e^(-rt)', fix: 'Black-Scholes uses CONTINUOUS discounting. Always EXP(-rt).' },
  { topic: 'M&A', loss: 'Bidding above the maximum bid price', fix: 'Max bid = stand-alone target value + acquirer share of synergy. Above this destroys acquirer wealth.' },
  { topic: 'FX hedge', loss: 'Wrong side of bid/ask on the forward', fix: 'BUY foreign at bank OFFER (the higher rate). SELL foreign at bank BID. Walk through bank perspective.' },
  { topic: 'FX hedge', loss: 'Forgetting to future-value the option premium', fix: 'Premium is paid TODAY. Compare on the same date by future-valuing to the cash flow date.' },
  { topic: 'IR hedge', loss: 'Confusing borrower vs depositor side of an FRA', fix: 'BORROWERS BUY FRAs (fearing rate rises). DEPOSITORS SELL FRAs (fearing rate falls).' },
  { topic: 'VaR', loss: 'Quoting two-tailed z values for a one-tailed VaR', fix: 'One-tail at 99% = 2.326. Two-tail 99% = 2.576. AFM normally one-tailed.' },
  { topic: 'ESG', loss: 'Generic ESG prose with no scenario figure', fix: 'Always Issue → Action → Outcome with a £ figure or stakeholder name from the case.' },
  { topic: 'Real options', loss: 'Quoting volatility from the WRONG underlying', fix: 'Volatility = sigma of the project asset value, not the share price.' },
  { topic: 'Section A', loss: 'Burying the recommendation in paragraph 4', fix: 'Lead with your recommendation in sentence one. The marker is busy.' },
];

const TIME_BUDGET = [
  { label: 'Section A', marks: 50, mins: 90, ratio: '1.8 min/mark' },
  { label: 'Section B Q1', marks: 25, mins: 45, ratio: '1.8 min/mark' },
  { label: 'Section B Q2', marks: 25, mins: 45, ratio: '1.8 min/mark' },
  { label: 'Reading + planning', marks: 0, mins: 15, ratio: 'Built into the 195 min total' },
  { label: 'TOTAL', marks: 100, mins: 195, ratio: 'Including 15min reading' },
];

const COMMAND_WORDS: { word: string; what: string; how: string }[] = [
  { word: 'Recommend', what: 'A clear decision with a one-line justification', how: 'Lead with "I recommend X because Y." Then numbers.' },
  { word: 'Evaluate', what: 'Compare options against a criterion', how: 'Tabulate options × criteria. Conclude with a pick and a reason.' },
  { word: 'Discuss', what: 'Multiple perspectives, balanced', how: 'For/against, then a synthesised view. Quote the scenario.' },
  { word: 'Calculate', what: 'A number with workings', how: 'Show every step. Even wrong final numbers earn working marks.' },
  { word: 'Advise', what: 'Action-oriented recommendation to a named audience', how: 'Address the audience by role. Action verb. Conditional clauses.' },
  { word: 'Critically appraise', what: 'Strengths, weaknesses, alternatives', how: 'Three of each, with the weighting toward limitations and improvements.' },
  { word: 'Comment on', what: 'A short reaction with insight', how: '2-3 sentences. State, explain, link to the wider implication.' },
];

export function WarRoomPage() {
  const [done, setDone] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem(WAR_KEY) || '{}'); } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(WAR_KEY, JSON.stringify(done)); } catch {}
  }, [done]);

  const totalItems = useMemo(() => GROUPS.reduce((n, g) => n + g.items.length, 0), []);
  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const pct = Math.round((doneCount / totalItems) * 100);

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const reset = () => { if (confirm('Reset the War Room checklist?')) setDone({}); };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-danger/[0.06] via-white to-accent/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.45), transparent 70%)' }} />
        <div className="aurora w-72 h-72 -bottom-12 -left-12" style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip text-danger" style={{ borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.10)' }}>
              <i className="fa-solid fa-shield-halved" /> War Room
            </span>
            <span className="chip">T-minus checklist</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            The 24 hours before the<br /><span className="text-gradient">AFM exam.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            What to do tonight, what to do tomorrow morning, and what to do in the first and last minutes of the paper.
            Plus the calculator shortcuts, command-word translations, and the 14 mistakes that cost candidates the pass.
          </p>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 max-w-xl">
              <div className="flex items-baseline justify-between mb-1.5 text-[12px]">
                <span className="font-bold text-ink">Checklist progress</span>
                <span className="font-mono text-muted">{doneCount} / {totalItems} · {pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
            <button onClick={reset} className="text-[11px] text-muted hover:text-danger">Reset</button>
          </div>
        </div>
      </motion.section>

      {/* Checklist groups */}
      <SectionTitle icon="fa-solid fa-list-check" badge={<Pill variant="primary">Tap to tick</Pill>}>
        Pre-exam checklist
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GROUPS.map((g) => (
          <motion.div key={g.id} variants={fadeUp}>
            <Card className="h-full !p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  'w-10 h-10 rounded-xl grid place-items-center text-white',
                  g.tone === 'primary' && 'bg-primary',
                  g.tone === 'accent' && 'bg-accent text-ink',
                  g.tone === 'danger' && 'bg-danger',
                )}>
                  <i className={`fa-solid ${g.icon}`} />
                </div>
                <h3 className="font-display text-xl tracking-wide uppercase text-ink">{g.title}</h3>
              </div>
              <ul className="space-y-2">
                {g.items.map((it) => {
                  const isDone = !!done[it.id];
                  return (
                    <li key={it.id}>
                      <button
                        onClick={() => toggle(it.id)}
                        className={cn(
                          'w-full text-left rounded-xl border px-3 py-2.5 flex items-start gap-3 transition-colors',
                          isDone
                            ? 'border-primary bg-primary/5 text-ink/60 line-through'
                            : 'border-border bg-white hover:border-primary',
                        )}
                      >
                        <span className={cn(
                          'mt-0.5 w-5 h-5 rounded-md border-2 grid place-items-center shrink-0 transition-colors',
                          isDone ? 'bg-primary border-primary text-white' : 'border-border',
                        )}>
                          {isDone && <i className="fa-solid fa-check text-[10px]" />}
                        </span>
                        <span className="text-[13.5px] leading-relaxed">{it.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Time budget */}
      <SectionTitle icon="fa-solid fa-clock" badge={<Pill variant="accent">3h 15m total</Pill>}>
        Time budget
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-slate-50">
              <tr className="text-[11px] uppercase tracking-wider text-muted">
                <th className="text-left px-4 py-2.5">Block</th>
                <th className="text-right px-4 py-2.5">Marks</th>
                <th className="text-right px-4 py-2.5">Minutes</th>
                <th className="text-right px-4 py-2.5">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {TIME_BUDGET.map((row, i) => (
                <tr key={row.label} className={cn('border-t border-border', i === TIME_BUDGET.length - 1 && 'font-bold bg-primary/5')}>
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="px-4 py-3 text-right font-mono">{row.marks || '—'}</td>
                  <td className="px-4 py-3 text-right font-mono text-primary">{row.mins}</td>
                  <td className="px-4 py-3 text-right text-muted text-[12.5px]">{row.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Command words */}
      <SectionTitle icon="fa-solid fa-language" badge={<Pill>Translate the verb</Pill>}>
        Command-word translator
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {COMMAND_WORDS.map((c) => (
          <motion.div key={c.word} variants={fadeUp}>
            <Card className="h-full">
              <div className="font-display text-lg uppercase tracking-wide text-primary">{c.word}</div>
              <div className="mt-1 text-[13px] text-ink/80 leading-relaxed"><strong>What it asks:</strong> {c.what}</div>
              <div className="mt-1.5 text-[13px] text-ink/80 leading-relaxed"><strong>How to answer:</strong> {c.how}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CBE shortcuts */}
      <SectionTitle icon="fa-solid fa-keyboard" badge={<Pill variant="primary">CBE shell</Pill>}>
        Spreadsheet & word shortcuts
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CALC_SHORTCUTS.map((s) => (
          <motion.div key={s.keys} variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-3">
                <kbd className="font-mono text-[12px] px-2.5 py-1 rounded-md bg-ink text-white whitespace-nowrap">{s.keys}</kbd>
                <span className="font-bold text-ink">{s.label}</span>
              </div>
              <p className="mt-2 text-[13px] text-ink/80 leading-relaxed">{s.tip}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* AFM-specific functions */}
      <SectionTitle icon="fa-solid fa-square-root-variable" badge={<Pill variant="accent">Memorise these 8</Pill>}>
        AFM spreadsheet functions
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead className="bg-slate-50">
              <tr className="text-[11px] uppercase tracking-wider text-muted">
                <th className="text-left px-4 py-2.5">Function</th>
                <th className="text-left px-4 py-2.5">Example</th>
                <th className="text-left px-4 py-2.5">Why for AFM</th>
              </tr>
            </thead>
            <tbody>
              {FN_LIBRARY.map((f) => (
                <tr key={f.fn} className="border-t border-border">
                  <td className="px-4 py-2.5 font-mono text-primary text-[12.5px] whitespace-nowrap">{f.fn}</td>
                  <td className="px-4 py-2.5 font-mono text-ink text-[12px] whitespace-nowrap">{f.usage}</td>
                  <td className="px-4 py-2.5 text-ink/80 leading-relaxed">{f.afm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Common losers */}
      <SectionTitle icon="fa-solid fa-triangle-exclamation" badge={<Pill variant="danger">14 traps</Pill>}>
        Mistakes that cost the pass
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {COMMON_LOSERS.map((l) => (
          <motion.div key={l.topic + l.loss} variants={fadeUp}>
            <Card className="border-l-4 border-l-danger">
              <Pill variant="danger" className="mb-2">{l.topic}</Pill>
              <div className="text-[14px] font-bold text-ink">{l.loss}</div>
              <div className="mt-1.5 text-[13px] text-ink/80 leading-relaxed"><strong className="text-primary">Fix:</strong> {l.fix}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pass mantra */}
      <motion.div variants={fadeUp} className="mt-10">
        <Card className="!p-7 text-center" glow>
          <p className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">
            Lead. Justify. Quote. Comment.
          </p>
          <p className="mt-3 text-ink/70 max-w-xl mx-auto">
            Four words. Tape them to your monitor. Every Section A paragraph follows them. Generic answers fail. You will not write generic answers.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
