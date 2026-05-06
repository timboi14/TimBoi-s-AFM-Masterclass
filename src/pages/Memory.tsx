import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { MNEMONICS } from '@/lib/mnemonics';
import { store } from '@/lib/store';
import { speak, isSpeechSynthesisSupported } from '@/lib/voice';
import { cn } from '@/lib/cn';

/* ── Spaced repetition queue (Leitner 5-box) ────────────────── */
type Box = 1 | 2 | 3 | 4 | 5;
interface SRItem { id: string; front: string; back: string; topic: string; box: Box; due: number; }
const SR_KEY = 'tba_sr_v1';

const SR_INTERVALS_DAYS: Record<Box, number> = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 14 };

const SEED_SR: Omit<SRItem, 'box' | 'due'>[] = MNEMONICS.map((m) => ({
  id: `m-${m.id}`,
  front: m.topic,
  back: `${m.formula} — ${m.phrase}`,
  topic: m.topic,
}));

function loadSR(): SRItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SR_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const now = Date.now();
  const seeded: SRItem[] = SEED_SR.map((s) => ({ ...s, box: 1, due: now }));
  localStorage.setItem(SR_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveSR(items: SRItem[]) {
  try { localStorage.setItem(SR_KEY, JSON.stringify(items)); } catch {}
}

/* ── Feynman drafts ─────────────────────────────────────────── */
const FEYN_KEY = 'tba_feyn_v1';
interface FeynDraft { topic: string; text: string; updated: number; }
function loadFeyn(): FeynDraft[] {
  try { return JSON.parse(localStorage.getItem(FEYN_KEY) || '[]'); } catch { return []; }
}
function saveFeyn(d: FeynDraft[]) { try { localStorage.setItem(FEYN_KEY, JSON.stringify(d)); } catch {} }

/* ── Memory palace (slot:concept) ───────────────────────────── */
const PALACE_KEY = 'tba_palace_v1';
const PALACE_ROOMS = [
  { id: 'door', label: 'Front door', icon: 'fa-door-open' },
  { id: 'hall', label: 'Hallway', icon: 'fa-shoe-prints' },
  { id: 'kitchen', label: 'Kitchen', icon: 'fa-utensils' },
  { id: 'lounge', label: 'Lounge', icon: 'fa-couch' },
  { id: 'stairs', label: 'Stairs', icon: 'fa-stairs' },
  { id: 'bath', label: 'Bathroom', icon: 'fa-bath' },
  { id: 'bedroom', label: 'Bedroom', icon: 'fa-bed' },
  { id: 'desk', label: 'Study desk', icon: 'fa-pen-ruler' },
  { id: 'window', label: 'Window', icon: 'fa-window-maximize' },
  { id: 'garden', label: 'Garden', icon: 'fa-tree' },
];
const DEFAULT_PALACE: Record<string, string> = {
  door: 'WACC = the cost of letting capital in (equity + debt × (1−T))',
  hall: 'CAPM = Rf + β × (Rm − Rf) — the corridor leading from risk-free to market',
  kitchen: 'NPV proforma cooking — inflate every line, tax with one-year lag',
  lounge: 'APV — sit back: base case NPV + tax shield + perks − issue costs',
  stairs: 'M&M2 ungear-regear ladder: climb up to project gearing, climb back down',
  bath: 'VaR — wash away outliers; quote z, σ and value',
  bedroom: 'Black-Scholes — sleep on it; map Pa, Pe, t, σ, r before plugging in',
  desk: 'M&A 3-column table: stand-alone | with-synergy | max-bid',
  window: 'FX hedge view: forward, MMH, futures, options — pick cheapest',
  garden: 'ESG: issue → action → outcome (three sentences in the soil)',
};
function loadPalace(): Record<string, string> {
  try {
    const raw = localStorage.getItem(PALACE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(PALACE_KEY, JSON.stringify(DEFAULT_PALACE));
  return DEFAULT_PALACE;
}
function savePalace(p: Record<string, string>) {
  try { localStorage.setItem(PALACE_KEY, JSON.stringify(p)); } catch {}
}

/* ─────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────── */
export function MemoryPage() {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }} />
        <div className="aurora w-72 h-72 -bottom-12 -left-12" style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="chip text-primary"><i className="fa-solid fa-brain" /> Memory Lab</span>
            <span className="chip">Six techniques · zero filler</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Memorisation isn't talent.
            <br />
            <span className="text-gradient">It's a system.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Re-reading is the most popular study technique and the worst-performing one.
            This lab gives you the four techniques that beat it: spaced retrieval, active recall,
            elaborative encoding (memory palace + mnemonics), and the Feynman test.
          </p>
        </div>
      </motion.section>

      {/* Spaced repetition */}
      <SectionTitle icon="fa-solid fa-rotate" badge={<Pill variant="primary">Leitner 5-box</Pill>}>
        Spaced repetition queue
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <SRQueue />
      </motion.div>

      {/* Mnemonics */}
      <SectionTitle icon="fa-solid fa-lightbulb" badge={<Pill variant="accent">{MNEMONICS.length} formulas</Pill>}>
        Mnemonic generator
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MNEMONICS.map((m) => (
          <motion.div key={m.id} variants={fadeUp}>
            <MnemonicCard m={m} />
          </motion.div>
        ))}
      </motion.div>

      {/* Memory palace */}
      <SectionTitle icon="fa-solid fa-house-chimney" badge={<Pill>Method of loci</Pill>}>
        Build your memory palace
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Palace />
      </motion.div>

      {/* Feynman */}
      <SectionTitle icon="fa-solid fa-chalkboard-user" badge={<Pill variant="primary">Test of understanding</Pill>}>
        Feynman drafts
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Feynman />
      </motion.div>

      {/* Dual coding pairs */}
      <SectionTitle icon="fa-solid fa-shapes" badge={<Pill>Verbal + visual</Pill>}>
        Dual coding cheatsheet
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUAL_CODING.map((d) => (
          <motion.div key={d.title} variants={fadeUp}>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center text-accent-dark">
                  <i className={`fa-solid ${d.icon}`} />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink">{d.title}</h3>
              </div>
              <p className="text-[13.5px] text-ink/80 leading-relaxed">{d.body}</p>
              <div className="mt-3 rounded-lg bg-slate-50 border border-border px-3 py-2 text-[12.5px] font-mono text-ink whitespace-pre">
                {d.diagram}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────── */

function SRQueue() {
  const [items, setItems] = useState<SRItem[]>(() => loadSR());
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { saveSR(items); }, [items]);

  const due = useMemo(() => items.filter((i) => i.due <= Date.now()).sort((a, b) => a.box - b.box), [items]);
  const counts = useMemo(() => {
    const c: Record<Box, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    items.forEach((i) => c[i.box]++);
    return c;
  }, [items]);
  const totalDue = due.length;
  const current = due[0];

  const grade = (correct: boolean) => {
    if (!current) return;
    const nextBox = (correct ? Math.min(5, current.box + 1) : 1) as Box;
    const nextDue = Date.now() + SR_INTERVALS_DAYS[nextBox] * 86_400_000;
    setItems((prev) => prev.map((i) => i.id === current.id ? { ...i, box: nextBox, due: nextDue } : i));
    setFlipped(false);
    if (correct) store.set({ points: store.get().points + 5 });
  };

  return (
    <Card className="!p-6">
      <div className="grid md:grid-cols-[1fr_220px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <Pill variant="primary">{totalDue} due now</Pill>
            <span className="text-[11px] uppercase tracking-wider text-muted">Active recall · graded</span>
          </div>
          {!current && (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center">
              <i className="fa-solid fa-circle-check text-3xl text-primary mb-2" />
              <p className="font-display text-2xl tracking-wide uppercase text-ink">Inbox zero</p>
              <p className="text-[13.5px] text-muted mt-1">Come back tomorrow — the box-2 cards will be ready.</p>
            </div>
          )}
          {current && (
            <button
              onClick={() => setFlipped((v) => !v)}
              className="block w-full text-left rounded-2xl border border-border bg-white px-5 py-6 hover:border-primary transition-colors min-h-[180px]"
            >
              <div className="text-[11px] uppercase tracking-wider text-muted mb-2">{current.topic}</div>
              {!flipped ? (
                <div className="font-display text-3xl tracking-wide uppercase text-ink">{current.front}</div>
              ) : (
                <div className="text-[15px] leading-relaxed text-ink">{current.back}</div>
              )}
              <div className="mt-4 text-[11px] text-muted">
                <i className="fa-solid fa-hand-pointer mr-1" /> Tap to {flipped ? 'hide' : 'reveal'} answer
              </div>
            </button>
          )}
          {current && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                disabled={!flipped}
                onClick={() => grade(false)}
                className="btn border border-danger text-danger bg-white hover:bg-danger hover:text-white disabled:opacity-40"
              >
                <i className="fa-solid fa-rotate-left" /> Got it wrong → box 1
              </button>
              <button
                disabled={!flipped}
                onClick={() => grade(true)}
                className="btn-primary disabled:opacity-40"
              >
                <i className="fa-solid fa-check" /> Recalled → promote
              </button>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wider text-muted mb-1">Box distribution</div>
          {([1, 2, 3, 4, 5] as Box[]).map((b) => {
            const pct = items.length ? Math.round((counts[b] / items.length) * 100) : 0;
            return (
              <div key={b} className="rounded-lg border border-border bg-white px-3 py-2">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-bold text-ink">Box {b}</span>
                  <span className="font-mono text-muted">{counts[b]} · every {SR_INTERVALS_DAYS[b]}d</span>
                </div>
                <div className="h-1.5 mt-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          <button
            onClick={() => {
              if (!confirm('Reset spaced repetition queue?')) return;
              localStorage.removeItem(SR_KEY);
              setItems(loadSR());
            }}
            className="w-full text-[11px] text-danger hover:underline mt-2"
          >
            Reset queue
          </button>
        </div>
      </div>
    </Card>
  );
}

function MnemonicCard({ m }: { m: typeof MNEMONICS[number] }) {
  const tts = isSpeechSynthesisSupported();
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Pill variant="primary" className="mb-2">{m.topic}</Pill>
          <div className="font-mono text-[13px] text-ink bg-slate-50 border border-border rounded-lg px-2.5 py-1.5 inline-block">
            {m.formula}
          </div>
        </div>
        <div className="text-right">
          <div className="stadium-num text-3xl text-primary">{m.acronym}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted">acronym</div>
        </div>
      </div>
      <p className="mt-3 text-[14px] text-ink leading-relaxed"><strong>Phrase:</strong> {m.phrase}</p>
      <p className="mt-2 text-[13.5px] text-ink/80 italic leading-relaxed">{m.story}</p>
      {tts && (
        <button
          onClick={() => speak(`${m.acronym}. ${m.phrase}. ${m.story}`)}
          className="mt-3 inline-flex items-center gap-2 text-[12px] text-primary hover:underline"
        >
          <i className="fa-solid fa-volume-high" /> Read aloud
        </button>
      )}
    </Card>
  );
}

function Palace() {
  const [palace, setPalace] = useState<Record<string, string>>(() => loadPalace());
  const [walking, setWalking] = useState(false);
  const [step, setStep] = useState(0);
  const update = (id: string, val: string) => {
    const next = { ...palace, [id]: val };
    setPalace(next);
    savePalace(next);
  };

  useEffect(() => {
    if (!walking) return;
    const id = setInterval(() => setStep((s) => (s + 1) % PALACE_ROOMS.length), 2200);
    return () => clearInterval(id);
  }, [walking]);

  const reset = () => {
    if (!confirm('Restore the default palace?')) return;
    setPalace(DEFAULT_PALACE);
    savePalace(DEFAULT_PALACE);
  };

  return (
    <Card className="!p-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Pill variant="accent">10 rooms</Pill>
        <span className="text-[12.5px] text-muted">
          Edit each room with the AFM concept you want anchored there.
          The "walk" mode auto-paces a mental tour.
        </span>
        <button
          onClick={() => { setStep(0); setWalking((v) => !v); }}
          className={cn('ml-auto pill', walking ? 'bg-danger text-white' : 'bg-primary text-white')}
        >
          <i className={`fa-solid ${walking ? 'fa-pause' : 'fa-play'}`} /> {walking ? 'Pause walk' : 'Take a walk'}
        </button>
        <button onClick={reset} className="text-[11px] text-muted hover:text-danger">Reset</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PALACE_ROOMS.map((r, idx) => {
          const active = walking && idx === step;
          return (
            <div
              key={r.id}
              className={cn(
                'rounded-2xl border p-3 transition-all',
                active ? 'border-accent bg-accent/[0.08] shadow-gold' : 'border-border bg-white',
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  'w-8 h-8 rounded-lg grid place-items-center',
                  active ? 'bg-accent text-ink' : 'bg-primary/10 text-primary',
                )}>
                  <i className={`fa-solid ${r.icon}`} />
                </div>
                <span className="text-[11px] uppercase tracking-wider text-muted font-bold">{r.label}</span>
              </div>
              <textarea
                value={palace[r.id] || ''}
                onChange={(e) => update(r.id, e.target.value)}
                rows={3}
                className="w-full text-[12.5px] leading-relaxed text-ink bg-transparent border-0 focus:outline-none resize-none"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Feynman() {
  const FEYN_TOPICS = [
    'WACC and the M&M propositions',
    'APV vs NPV when to use each',
    'Black-Scholes for a real option to delay',
    'Why M&A synergy is systematically overestimated',
    'Money market hedge for a USD payable',
    'The three pillars of ESG and how they affect NPV',
  ];
  const [drafts, setDrafts] = useState<FeynDraft[]>(() => loadFeyn());
  const [topic, setTopic] = useState(FEYN_TOPICS[0]);
  const [text, setText] = useState('');
  const tts = isSpeechSynthesisSupported();

  const save = () => {
    if (!text.trim()) return;
    const next = [{ topic, text, updated: Date.now() }, ...drafts.filter((d) => d.topic !== topic)].slice(0, 10);
    setDrafts(next);
    saveFeyn(next);
    store.set({ points: store.get().points + 10 });
  };

  return (
    <Card className="!p-6">
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1">Topic</div>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px] mb-3"
          >
            {FEYN_TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1">
            Explain it as if to a 12-year-old
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={7}
            placeholder={`No jargon. Use everyday words. Where you stumble, that's where you don't actually understand.\n\nExample for WACC: "It's the average cost of every pound the business uses..."`}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px] focus:outline-none focus:border-primary"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={save} className="btn-primary"><i className="fa-solid fa-save" /> Save draft (+10 pts)</button>
            {tts && (
              <button onClick={() => speak(text)} className="btn-outline" disabled={!text.trim()}>
                <i className="fa-solid fa-volume-high" /> Read it back
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Saved drafts</div>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {drafts.length === 0 && (
              <div className="text-[13px] text-muted">No drafts yet. Write one and save — your future self will thank you.</div>
            )}
            {drafts.map((d) => (
              <div key={d.topic + d.updated} className="rounded-xl border border-border bg-white p-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-primary">{d.topic}</div>
                <p className="text-[12.5px] text-ink/80 mt-1 line-clamp-3 leading-relaxed">{d.text}</p>
                <button
                  onClick={() => { setTopic(d.topic); setText(d.text); }}
                  className="mt-1 text-[11px] text-primary hover:underline"
                >
                  Edit →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

const DUAL_CODING: { title: string; body: string; diagram: string; icon: string }[] = [
  {
    title: 'Swap with QSD',
    icon: 'fa-arrows-left-right',
    body: 'Two arrows crossing in the middle: each party borrows where they have advantage, then trades the obligation.',
    diagram:
      'A: borrows fixed ─→ B\n         ↑\nB: borrows floating ←─ A',
  },
  {
    title: 'Yield curve',
    icon: 'fa-chart-line',
    body: 'A hill rising left-to-right when normal. Inverted = recession alarm.',
    diagram: 'rate\n │       __/\n │   __/\n │_/\n └────── maturity',
  },
  {
    title: 'Real option fork',
    icon: 'fa-code-branch',
    body: 'Decision-tree fork: at the option date, the project value branches between exercise and abandon.',
    diagram: '         /─→ Exercise NPV+\nProject ─•\n         \\─→ Walk away (0)',
  },
  {
    title: 'M&A 3-column',
    icon: 'fa-table-columns',
    body: 'Three vertical columns: stand-alone | with synergy | max bid. The synergy split is the deal-room negotiation.',
    diagram: '┌──────┬──────┬──────┐\n│ SA   │ +Syn │ Max  │\n│ £80m │ £110m│ £105m│\n└──────┴──────┴──────┘',
  },
  {
    title: 'NPV proforma',
    icon: 'fa-table',
    body: 'Years across, items down. Inflate every line at its own rate. Tax with one-year lag.',
    diagram: '       Y0   Y1   Y2   Y3\nRev    -    100  110  121\nCosts  -   (60) (66) (73)\nTax    -    -   (10) (11)',
  },
  {
    title: 'VaR distribution',
    icon: 'fa-bell-curve',
    body: 'Bell curve tilted left. Vertical line at the z-cutoff. Area to the left = loss probability.',
    diagram: '       __\n      /  \\\n     /    \\__\n    /        \\___\n  ──┴──── z ────',
  },
];
