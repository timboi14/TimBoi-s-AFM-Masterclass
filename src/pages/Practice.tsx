import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { PRACTICE_SETS, type PracticeSet } from '@/data/practice';
import { GoalBurst } from '@/components/Confetti';
import { store } from '@/lib/store';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────
   1) PRACTICE INDEX (when no id is given)
   ───────────────────────────────────────────── */
export function PracticePage() {
  const { id } = useParams();
  const set = id ? PRACTICE_SETS.find((s) => s.id === id) : null;
  if (set) return <ExamSimulator set={set} />;
  return <PracticeIndex />;
}

function PracticeIndex() {
  const [filter, setFilter] = useState<'all' | 'A' | 'B' | 1 | 2 | 3 | 4>('all');

  const list = useMemo(() => {
    if (filter === 'all') return PRACTICE_SETS;
    if (filter === 'A' || filter === 'B') return PRACTICE_SETS.filter((s) => s.section === filter);
    return PRACTICE_SETS.filter((s) => s.module === filter);
  }, [filter]);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 border-l-4 border-l-primary">
          <Pill variant="primary" className="mb-2">Practice exam centre</Pill>
          <h1 className="font-display text-4xl tracking-wide uppercase">14 sets, 450 marks</h1>
          <p className="mt-2 max-w-2xl">
            Football-themed practice questions in the format of the actual ACCA AFM CBE.
            Multi-panel exam simulator with exhibits, scratchpad, word processor, spreadsheet, calculator,
            hints on demand, and a full model-answer reveal with mark scheme. Sit one as a 25 or 50 mark
            standalone, or stitch three together for a full 3h 15m mock.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                { v: 'all', l: 'All' },
                { v: 'A', l: 'Section A (50m)' },
                { v: 'B', l: 'Section B (25m)' },
                { v: 1, l: 'Module 1: Investment' },
                { v: 2, l: 'Module 2: M&A and Valuation' },
                { v: 3, l: 'Module 3: Options and Reorg' },
                { v: 4, l: 'Module 4: Risk and Hedging' },
              ] as const
            ).map((f) => (
              <button
                key={String(f.v)}
                onClick={() => setFilter(f.v as any)}
                className={cn(
                  'pill border border-border',
                  filter === f.v && (f.v === 'A' ? 'bg-accent text-bg' : 'bg-primary text-bg')
                )}
              >
                {f.l}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-3">
        {list.map((s) => (
          <motion.div key={s.id} variants={fadeUp}>
            <Link to={`/practice/${s.id}`}>
              <Card className="hover:border-primary transition-colors group">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill variant={s.section === 'A' ? 'accent' : 'primary'}>Section {s.section}</Pill>
                  <Pill>{s.marks} marks</Pill>
                  <Pill>Module {s.module}</Pill>
                  <span className="font-display text-2xl tracking-wide uppercase">
                    Set {s.number}: {s.club}
                  </span>
                  <span className="ml-auto btn-outline group-hover:bg-primary group-hover:text-bg transition-colors">
                    <i className="fa-solid fa-play" /> Open simulator
                  </span>
                </div>
                <p className="mt-2 text-sm">{s.topic}</p>
                <p className="mt-2 muted text-[13px] line-clamp-2">{s.background}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   2) EXAM SIMULATOR (CBE-style multi-panel)
   ───────────────────────────────────────────── */
type PanelKey = 'exhibits' | 'word' | 'sheet' | 'calc' | 'scratch' | 'hints' | 'mark';

function ExamSimulator({ set }: { set: PracticeSet }) {
  const [openPanels, setOpenPanels] = useState<Record<PanelKey, boolean>>({
    exhibits: true,
    word: true,
    sheet: false,
    calc: false,
    scratch: false,
    hints: false,
    mark: false,
  });
  const [secs, setSecs] = useState(set.minutes * 60);
  const [running, setRunning] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(set.exhibits[0]?.number || 1);
  const [activeReq, setActiveReq] = useState(0);
  const [reveal, setReveal] = useState<Record<number, number>>({}); // requirement index -> hint step revealed
  const [showFullSolution, setShowFullSolution] = useState<Record<number, boolean>>({});
  const [burst, setBurst] = useState(false);

  // Persisted answers
  const sk = (key: string) => `tba_practice_${set.id}_${key}`;
  const [wp, setWp] = useState(() => localStorage.getItem(sk('word')) || '');
  const [scratch, setScratch] = useState(() => localStorage.getItem(sk('scratch')) || '');
  const [sheet, setSheet] = useState<string[][]>(() => {
    const raw = localStorage.getItem(sk('sheet'));
    if (raw) try { return JSON.parse(raw); } catch {}
    return Array.from({ length: 12 }, () => Array.from({ length: 6 }, () => ''));
  });
  useEffect(() => { localStorage.setItem(sk('word'), wp); }, [wp, set.id]);
  useEffect(() => { localStorage.setItem(sk('scratch'), scratch); }, [scratch, set.id]);
  useEffect(() => { localStorage.setItem(sk('sheet'), JSON.stringify(sheet)); }, [sheet, set.id]);

  // Timer
  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, secs]);

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return (h > 0 ? `${String(h).padStart(2, '0')}:` : '') +
      `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const togglePanel = (k: PanelKey) => setOpenPanels((p) => ({ ...p, [k]: !p[k] }));

  const askHint = (i: number) => {
    const req = set.requirements[i];
    if (!req) return;
    const cur = reveal[i] || 0;
    if (cur === 0) {
      setReveal((r) => ({ ...r, [i]: 1 }));
    } else if (cur < req.solution.length) {
      setReveal((r) => ({ ...r, [i]: Math.min(req.solution.length, cur + 1) }));
    }
  };

  const completeAndAward = () => {
    store.set({ points: store.get().points + 100, drills: store.get().drills + 1 });
    setBurst(true);
  };

  return (
    <div className="text-bg">
      {/* HEADER BAR (mimics ACCA shell) */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-4 bg-white/95 backdrop-blur border-b border-primary/30">
        <div className="flex flex-wrap items-center gap-3 text-text">
          <Link to="/practice" className="btn-ghost !text-xs !py-1.5">
            <i className="fa-solid fa-arrow-left" /> All sets
          </Link>
          <Pill variant={set.section === 'A' ? 'accent' : 'primary'}>Section {set.section}</Pill>
          <Pill>{set.marks} marks</Pill>
          <span className="font-display text-lg tracking-wider uppercase">
            Set {set.number}: {set.club}
          </span>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setRunning(!running)}
              className={cn('btn !py-1.5 !px-3 !text-xs', running ? 'bg-danger text-white' : 'btn-primary')}
            >
              <i className={`fa-solid ${running ? 'fa-stop' : 'fa-play'}`} /> {running ? 'Pause' : 'Start timer'}
            </button>
            <button
              onClick={() => { setSecs(set.minutes * 60); setRunning(false); }}
              className="btn-outline !py-1.5 !px-3 !text-xs"
              title="Reset timer"
            >
              <i className="fa-solid fa-rotate-left" />
            </button>
            <span className={cn(
              'font-mono text-xl scoreboard-led tracking-wider px-3 py-1 rounded-md border border-border bg-card',
              secs < 300 && running && 'text-danger'
            )} style={{ color: secs < 300 && running ? '#ef4444' : '#ffd600' }}>
              {fmt(secs)}
            </span>
          </div>
        </div>

        {/* Tool-bar of panels */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <ToolBtn icon="fa-folder-open" label="Exhibits" active={openPanels.exhibits} onClick={() => togglePanel('exhibits')} />
          <ToolBtn icon="fa-pen-to-square" label="Word Processor" active={openPanels.word} onClick={() => togglePanel('word')} />
          <ToolBtn icon="fa-table-cells" label="Spreadsheet" active={openPanels.sheet} onClick={() => togglePanel('sheet')} />
          <ToolBtn icon="fa-calculator" label="Calculator" active={openPanels.calc} onClick={() => togglePanel('calc')} />
          <ToolBtn icon="fa-note-sticky" label="Scratch Pad" active={openPanels.scratch} onClick={() => togglePanel('scratch')} />
          <ToolBtn icon="fa-lightbulb" label="Hints" active={openPanels.hints} onClick={() => togglePanel('hints')} accent />
          <ToolBtn icon="fa-list-check" label="Mark Scheme" active={openPanels.mark} onClick={() => togglePanel('mark')} accent />
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        {/* LEFT COLUMN: requirements + scenario */}
        <div className="grid gap-4">
          {/* Scenario / requirements */}
          <Card>
            <Pill variant="primary" className="mb-2">{set.banner}</Pill>
            <h2 className="font-display text-2xl tracking-wide uppercase">{set.club}: {set.topic}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed">{set.background}</p>
            <div className="mt-4 grid gap-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold">Requirements ({set.marks} marks)</div>
              {set.requirements.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReq(i)}
                  className={cn(
                    'text-left p-3 rounded-lg border transition-colors',
                    activeReq === i ? 'border-primary bg-primary/[0.06]' : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-xs text-accent">[{r.marks}]</span>
                    <span className="font-bold text-[14px]">{r.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/[0.05] border border-primary/30 text-[13px]">
              <i className="fa-solid fa-circle-info text-primary mr-1.5" />
              <b>Examiner note:</b> {set.examinerNote}
            </div>
          </Card>

          {/* Exhibit viewer (always visible to mimic CBE multi-pane) */}
          {openPanels.exhibits && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-folder-open text-primary" />
                <span className="font-display text-lg tracking-wide uppercase">Exhibits</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {set.exhibits.map((ex) => (
                  <button
                    key={ex.number}
                    onClick={() => setActiveExhibit(ex.number)}
                    className={cn(
                      'pill border',
                      activeExhibit === ex.number ? 'bg-primary text-bg border-primary' : 'border-border'
                    )}
                  >
                    {ex.number}. {ex.title}
                  </button>
                ))}
              </div>
              {set.exhibits.map((ex) =>
                ex.number === activeExhibit ? (
                  <div key={ex.number} className="p-3.5 rounded-lg bg-slate-50 border border-border">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold mb-1.5">
                      Exhibit {ex.number}
                    </div>
                    <h4 className="font-bold mb-2">{ex.title}</h4>
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">{ex.body}</p>
                  </div>
                ) : null
              )}
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN: workspace panels */}
        <div className="grid gap-4">
          {openPanels.word && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-pen-to-square text-primary" />
                <span className="font-display text-lg tracking-wide uppercase">Word Processor</span>
                <span className="ml-auto text-[11px] text-muted">Auto-saved · {wp.length} chars</span>
              </div>
              <textarea
                value={wp}
                onChange={(e) => setWp(e.target.value)}
                rows={14}
                placeholder={`Write your answer here.\n\nExam tip: lead with the recommendation, quote scenario figures, head sub-sections by requirement (a), (b), (c).`}
                className="w-full p-3 rounded-lg bg-slate-50 border border-border focus:border-primary focus:outline-none font-mono text-[13px] leading-relaxed resize-y"
              />
            </Card>
          )}

          {openPanels.sheet && <Spreadsheet sheet={sheet} setSheet={setSheet} />}
          {openPanels.calc && <Calculator />}
          {openPanels.scratch && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-note-sticky text-accent" />
                <span className="font-display text-lg tracking-wide uppercase">Scratch Pad</span>
              </div>
              <textarea
                value={scratch}
                onChange={(e) => setScratch(e.target.value)}
                rows={6}
                placeholder="Notes, working numbers, plan structure..."
                className="w-full p-3 rounded-lg bg-accent/[0.04] border border-accent/40 focus:border-accent focus:outline-none font-mono text-[13px] resize-y"
              />
            </Card>
          )}

          {openPanels.hints && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-lightbulb text-accent" />
                <span className="font-display text-lg tracking-wide uppercase">Hints</span>
                <span className="ml-auto text-[11px] text-muted">For requirement ({String.fromCharCode(97 + activeReq)})</span>
              </div>
              <div className="p-3.5 rounded-lg bg-accent/[0.06] border border-accent/40">
                <div className="text-[11px] uppercase tracking-[0.18em] text-accent font-bold mb-1.5">
                  <i className="fa-solid fa-compass mr-1" /> Approach
                </div>
                <p className="text-[13.5px] leading-relaxed">{set.requirements[activeReq]?.hint}</p>
              </div>
              <div className="mt-3">
                <button
                  className="btn-accent !text-xs !py-2"
                  onClick={() => askHint(activeReq)}
                  disabled={(reveal[activeReq] || 0) >= (set.requirements[activeReq]?.solution.length || 0)}
                >
                  <i className="fa-solid fa-eye" /> Reveal next solution step
                </button>
                <button
                  className="btn-outline !text-xs !py-2 ml-2"
                  onClick={() => setShowFullSolution((s) => ({ ...s, [activeReq]: !s[activeReq] }))}
                >
                  <i className="fa-solid fa-bolt" /> {showFullSolution[activeReq] ? 'Hide' : 'Reveal full'} model
                </button>
              </div>
              <div className="mt-3 grid gap-2">
                {(set.requirements[activeReq]?.solution || []).map((step, i) => {
                  const visible = (reveal[activeReq] || 0) > i || showFullSolution[activeReq];
                  if (!visible) return null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-md bg-primary/[0.06] border border-primary/30 text-[13px] leading-relaxed font-mono"
                    >
                      <span className="text-primary font-bold mr-2">{i + 1}.</span>
                      {step}
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          )}

          {openPanels.mark && (
            <Card className="relative overflow-visible">
              <GoalBurst play={burst} onDone={() => setBurst(false)} />
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-list-check text-accent" />
                <span className="font-display text-lg tracking-wide uppercase">Mark Scheme</span>
              </div>
              <table className="w-full text-[13px]">
                <tbody>
                  {set.markScheme.map((m, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-b-0">
                      <td className="py-1.5 pr-2">{m.item}</td>
                      <td className="py-1.5 text-right font-mono text-accent">{m.marks}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-accent">
                    <td className="py-2 font-bold">Total</td>
                    <td className="py-2 text-right font-mono text-accent font-bold">{set.marks}</td>
                  </tr>
                </tbody>
              </table>
              <button className="btn-primary mt-4" onClick={completeAndAward}>
                <i className="fa-solid fa-flag-checkered" /> Mark complete (+100 pts)
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolBtn({ icon, label, active, onClick, accent }: { icon: string; label: string; active: boolean; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors border',
        active
          ? (accent ? 'bg-accent text-bg border-accent' : 'bg-primary text-bg border-primary')
          : 'border-border hover:border-primary/50'
      )}
    >
      <i className={`fa-solid ${icon} text-[11px]`} />
      {label}
    </button>
  );
}

/* ── Mini Spreadsheet ──────────────────────────────────── */
function Spreadsheet({ sheet, setSheet }: { sheet: string[][]; setSheet: (s: string[][]) => void }) {
  const cols = sheet[0]?.length || 6;
  const rows = sheet.length;
  const colLetter = (i: number) => String.fromCharCode(65 + i);

  function update(r: number, c: number, v: string) {
    const next = sheet.map((row) => [...row]);
    next[r][c] = v;
    setSheet(next);
  }

  function compute(value: string): string {
    if (!value.startsWith('=')) return value;
    try {
      const expr = value.slice(1)
        .replace(/SUM\(([^)]+)\)/gi, (_m, range: string) => {
          const m = range.match(/([A-Z])(\d+):([A-Z])(\d+)/);
          if (!m) return '0';
          const c1 = m[1].charCodeAt(0) - 65, r1 = +m[2] - 1, c2 = m[3].charCodeAt(0) - 65, r2 = +m[4] - 1;
          let total = 0;
          for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) {
            const v = parseFloat(sheet[r]?.[c] || '0'); if (!isNaN(v)) total += v;
          }
          return String(total);
        })
        .replace(/([A-Z])(\d+)/g, (_m, col: string, row: string) => {
          const c = col.charCodeAt(0) - 65, r = +row - 1;
          return String(parseFloat(sheet[r]?.[c] || '0') || 0);
        });
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict";return (' + expr + ')')();
      return typeof result === 'number' ? Number(result.toFixed(4)).toString() : String(result);
    } catch {
      return '#ERR';
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-table-cells text-primary" />
        <span className="font-display text-lg tracking-wide uppercase">Spreadsheet</span>
        <span className="ml-auto text-[11px] text-muted">Use =A1+B1, =SUM(A1:A5), basic Excel</span>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse text-[12px] font-mono">
          <thead>
            <tr>
              <th className="w-8 bg-card border border-border" />
              {Array.from({ length: cols }).map((_, c) => (
                <th key={c} className="min-w-[80px] px-2 py-1 bg-card border border-border text-muted">{colLetter(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.map((row, r) => (
              <tr key={r}>
                <th className="w-8 bg-card border border-border text-muted text-center">{r + 1}</th>
                {row.map((cell, c) => (
                  <td key={c} className="border border-border p-0">
                    <input
                      value={cell}
                      onChange={(e) => update(r, c, e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.startsWith('=')) {
                          // compute on blur, but keep the formula as raw so user can edit
                        }
                      }}
                      className="w-full px-2 py-1 bg-slate-50 focus:bg-primary/[0.05] outline-none focus:ring-1 ring-primary"
                      title={cell.startsWith('=') ? `Computed: ${compute(cell)}` : ''}
                    />
                    {cell.startsWith('=') && (
                      <div className="px-2 pb-1 text-[10px] text-primary">= {compute(cell)}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ── Calculator ──────────────────────────────────── */
function Calculator() {
  const [expr, setExpr] = useState('');
  const [history, setHistory] = useState<{ e: string; v: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function evalExpr() {
    if (!expr.trim()) return;
    try {
      // eslint-disable-next-line no-new-func
      const v = Function('"use strict"; const sqrt=Math.sqrt; const ln=Math.log; const log=Math.log10; const exp=Math.exp; return (' + expr + ')')();
      const result = typeof v === 'number' ? Number(v.toFixed(6)).toString() : String(v);
      setHistory((h) => [{ e: expr, v: result }, ...h].slice(0, 8));
      setExpr(result);
    } catch {
      setHistory((h) => [{ e: expr, v: 'ERROR' }, ...h]);
    }
  }

  const KEYS = [
    ['7', '8', '9', '/', 'sqrt('],
    ['4', '5', '6', '*', 'exp('],
    ['1', '2', '3', '-', 'ln('],
    ['0', '.', '(', ')', '+'],
  ];
  const press = (k: string) => {
    setExpr((e) => e + k);
    inputRef.current?.focus();
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-calculator text-primary" />
        <span className="font-display text-lg tracking-wide uppercase">Calculator</span>
        <span className="ml-auto text-[11px] text-muted">+ - * / sqrt ln exp ()</span>
      </div>
      <input
        ref={inputRef}
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && evalExpr()}
        placeholder="e.g. 1.27 * (1.045/1.030)^3"
        className="w-full p-2.5 rounded-lg bg-slate-50 border border-border focus:border-primary focus:outline-none font-mono"
      />
      <div className="grid grid-cols-5 gap-1.5 mt-2">
        {KEYS.flat().map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="py-2 rounded-md bg-card border border-border hover:bg-primary hover:text-bg hover:border-primary text-sm font-mono"
          >
            {k}
          </button>
        ))}
        <button
          onClick={() => setExpr('')}
          className="py-2 col-span-2 rounded-md bg-danger/15 text-danger border border-danger/40 text-sm font-bold"
        >
          Clear
        </button>
        <button
          onClick={evalExpr}
          className="py-2 col-span-3 rounded-md bg-primary text-bg text-sm font-bold"
        >
          =
        </button>
      </div>
      {history.length > 0 && (
        <div className="mt-3 grid gap-1 text-[12px] font-mono max-h-32 overflow-y-auto">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between p-1.5 rounded bg-slate-100 border border-border/50">
              <span className="text-muted truncate pr-2">{h.e}</span>
              <span className="text-accent">{h.v}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
