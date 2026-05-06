import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { EXAM_CASES, EXAMINER_QUOTES, QUOTE_LABELS, type ExamCase } from '@/data/examiner';
import { cn } from '@/lib/cn';

const PAPER_FILTERS = [
  { v: 'all', label: 'All papers' },
  { v: 'sd25', label: 'Sep/Dec 25' },
  { v: 'mj25', label: 'Mar/Jun 25' },
  { v: 'sd24', label: 'Sep/Dec 24' },
];

export function ExaminerPage() {
  const [filter, setFilter] = useState('all');
  const [openCase, setOpenCase] = useState<string | null>(null);

  const cases = useMemo(() => {
    if (filter === 'all') return EXAM_CASES;
    return EXAM_CASES.filter((c) => c.id.startsWith(filter));
  }, [filter]);

  const totalTraps = useMemo(() => EXAM_CASES.reduce((n, c) => n + c.traps.length, 0), []);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.06] via-white to-primary/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.45), transparent 70%)' }} />
        <div className="aurora w-72 h-72 -bottom-12 -left-12" style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip" style={{ borderColor: 'rgba(14,165,233,0.4)', background: 'rgba(14,165,233,0.10)', color: '#0369a1' }}>
              <i className="fa-solid fa-file-signature" /> Examiner Reports
            </span>
            <span className="chip">Sep/Dec 24 → Sep/Dec 25</span>
            <span className="chip text-danger" style={{ borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.10)' }}>
              March 2026 pass rate: 44%
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            What the examiner<br /><span className="text-gradient">just told you.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Concrete case-by-case traps from the last four sittings. Drimpton, Halstock, Passmore,
            Kampai, Northney, Zulla. The exact mistakes the examiner flagged, with the fix.
            Read this once and you will not lose those marks.
          </p>
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <Pill variant="primary"><i className="fa-solid fa-triangle-exclamation" /> {totalTraps} traps catalogued</Pill>
            <Pill variant="accent"><i className="fa-solid fa-quote-right" /> {EXAMINER_QUOTES.length} verbatim quotes</Pill>
            <Pill><i className="fa-solid fa-trophy" /> Per-case "win" technique</Pill>
          </div>
        </div>
      </motion.section>

      {/* Filter */}
      <SectionTitle icon="fa-solid fa-filter">
        Browse by sitting
      </SectionTitle>
      <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-2">
        {PAPER_FILTERS.map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={cn(
              'pill border border-border bg-white',
              filter === f.v && 'bg-primary text-white border-primary',
            )}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Cases */}
      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {cases.map((c) => (
          <motion.div key={c.id} variants={fadeUp}>
            <CaseCard c={c} open={openCase === c.id} onToggle={() => setOpenCase(openCase === c.id ? null : c.id)} />
          </motion.div>
        ))}
      </motion.div>

      {/* Examiner quote wall */}
      <SectionTitle icon="fa-solid fa-quote-left" badge={<Pill variant="accent">Memorise these</Pill>}>
        Verbatim from the examiner
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXAMINER_QUOTES.map((q) => {
          const meta = QUOTE_LABELS[q.category];
          return (
            <motion.div key={q.text} variants={fadeUp}>
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <span className="chip" style={{ color: meta.color, borderColor: `${meta.color}66`, background: `${meta.color}15` }}>
                    <i className={`fa-solid ${meta.icon}`} /> {meta.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted ml-auto font-bold">{q.paper}</span>
                </div>
                <p className="text-[14px] leading-relaxed text-ink italic">"{q.text}"</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Cheat-sheet card */}
      <SectionTitle icon="fa-solid fa-bullseye" badge={<Pill variant="primary">Drilled summary</Pill>}>
        The 7-rule cheat-sheet
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-6">
          <ol className="space-y-3 text-[14px] leading-relaxed text-ink list-decimal pl-5">
            <li><strong>FCFF → WACC, FCFE → Ke.</strong> Mnemonic: "F goes with W, E goes with E." Always end with EV − Debt = Equity.</li>
            <li><strong>Sunk cost = ignored. Amortisation = added back. Working capital = released at end.</strong> Three rules, three marks.</li>
            <li><strong>Tag every synergy as ONE-OFF or ANNUITY</strong> before discounting. Kampai cost candidates this in MJ25.</li>
            <li><strong>Use the OFFER price for gain-to-target</strong>, not the analyst valuation. Different inputs.</li>
            <li><strong>"Variables remain the same after Y4" = ZERO growth.</strong> Read the scenario for the explicit growth signal.</li>
            <li><strong>ALWAYS round contract count UP</strong> for hedges. Better over-hedge than under-hedge.</li>
            <li><strong>Future-value the option premium</strong> to the cash-flow date. Never compare premium-today to outcome-at-maturity.</li>
          </ol>
        </Card>
      </motion.div>

      {/* Mantra */}
      <motion.div variants={fadeUp} className="mt-10">
        <Card className="!p-7 text-center" glow>
          <p className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">
            Apply the scenario.<br />Challenge the assumption.<br />Quote the figure.
          </p>
          <p className="mt-3 text-ink/70 max-w-xl mx-auto">
            The examiner has said this in every report since 2022. The candidates who do it pass.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function CaseCard({ c, open, onToggle }: { c: ExamCase; open: boolean; onToggle: () => void }) {
  return (
    <Card className="h-full !p-5">
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Pill variant="primary">{c.paper}</Pill>
          <Pill>{c.marks} marks</Pill>
          <Pill variant="danger" className="ml-auto">{c.traps.length} traps</Pill>
        </div>
        <h3 className="font-display text-2xl tracking-wide uppercase text-ink leading-tight">{c.company}</h3>
        <p className="text-[13.5px] text-muted mt-1">{c.topic}</p>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          className="mt-4 space-y-3 overflow-hidden"
        >
          {c.traps.map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-slate-50 p-3">
              <div className="text-[11px] uppercase tracking-wider text-danger font-bold mb-1.5">
                Trap {i + 1}
              </div>
              <div className="text-[14px] font-bold text-ink leading-tight">{t.what}</div>
              <p className="mt-1.5 text-[13px] text-ink/75 leading-relaxed">
                <strong className="text-muted">Why:</strong> {t.why}
              </p>
              <p className="mt-1 text-[13px] text-ink/85 leading-relaxed">
                <strong className="text-primary">Fix:</strong> {t.fix}
              </p>
            </div>
          ))}
          {c.examinerQuote && (
            <div className="rounded-xl border border-dashed border-accent/60 bg-accent/[0.08] p-3">
              <div className="text-[10px] uppercase tracking-wider text-accent-dark font-bold mb-1">
                <i className="fa-solid fa-quote-right" /> Examiner said
              </div>
              <p className="text-[13.5px] text-ink italic leading-relaxed">"{c.examinerQuote}"</p>
            </div>
          )}
          <div className="rounded-xl bg-primary/5 border border-primary/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
              <i className="fa-solid fa-trophy" /> Technique win
            </div>
            <p className="text-[13.5px] text-ink leading-relaxed">{c.techniqueWin}</p>
          </div>
        </motion.div>
      )}
      {!open && (
        <button onClick={onToggle} className="mt-3 text-[12px] text-primary font-bold hover:underline">
          Open all traps & technique →
        </button>
      )}
    </Card>
  );
}
