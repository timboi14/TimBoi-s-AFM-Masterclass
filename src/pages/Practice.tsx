import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { PRACTICE_SETS, type PracticeSet } from '@/data/practice';
import { getSampleAnswer, type SampleLine } from '@/data/sample-answers';
import { GoalBurst } from '@/components/Confetti';
import { store } from '@/lib/store';
import { cn } from '@/lib/cn';
import {
  compute,
  display,
  colLetter,
  FN_CATALOG,
  type Sheet,
} from '@/lib/sheet-engine';
import { askCoach, COACH_SUGGESTIONS, type CoachReply } from '@/lib/coach-ai';
import {
  ChatInput,
  ChatInputSubmit,
  ChatInputTextArea,
} from '@/components/ui/chat-input';
import { readEnum } from '@/lib/guards';
import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';

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
          <h1 className="font-display text-4xl tracking-wide uppercase text-ink">14 sets, 450 marks</h1>
          <p className="mt-2 max-w-2xl">
            Football-themed practice questions matching the live ACCA AFM CBE shell. Multi-panel exam simulator
            with a real spreadsheet engine (NPV, IRR, BSCALL, WACC, UNGEAR functions), a Coach AI for stuck moments,
            full-mark sample answers with line-by-line mark allocations, and the official mark scheme.
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
                onClick={() => setFilter(f.v)}
                className={cn(
                  'pill border border-border bg-white',
                  filter === f.v && (f.v === 'A' ? 'bg-accent text-bg border-accent' : 'bg-primary text-white border-primary')
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
                  <span className="font-display text-2xl tracking-wide uppercase text-ink">
                    Set {s.number}: {s.club}
                  </span>
                  <span className="ml-auto btn-outline group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
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
   2) EXAM SIMULATOR
   ───────────────────────────────────────────── */
type PanelKey = 'exhibits' | 'word' | 'sheet' | 'calc' | 'scratch' | 'hints' | 'sample' | 'mark';

function ExamSimulator({ set }: { set: PracticeSet }) {
  const [openPanels, setOpenPanels] = useState<Record<PanelKey, boolean>>({
    exhibits: true,
    word: true,
    sheet: false,
    calc: false,
    scratch: false,
    hints: false,
    sample: false,
    mark: false,
  });
  const [secs, setSecs] = useState(set.minutes * 60);
  const [running, setRunning] = useState(false);
  const [activeExhibit, setActiveExhibit] = useState(set.exhibits[0]?.number || 1);
  const [activeReq, setActiveReq] = useState(0);
  const [reveal, setReveal] = useState<Record<number, number>>({});
  const [showFullSolution, setShowFullSolution] = useState<Record<number, boolean>>({});
  const [burst, setBurst] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);

  const sk = (key: string) => `tba_practice_${set.id}_${key}`;
  const [wp, setWp] = useState(() => localStorage.getItem(sk('word')) || '');
  const [scratch, setScratch] = useState(() => localStorage.getItem(sk('scratch')) || '');

  useEffect(() => { localStorage.setItem(sk('word'), wp); }, [wp, set.id]);
  useEffect(() => { localStorage.setItem(sk('scratch'), scratch); }, [scratch, set.id]);

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
    if (cur < req.solution.length) setReveal((r) => ({ ...r, [i]: Math.min(req.solution.length, cur + 1) }));
  };

  const completeAndAward = () => {
    store.set({ points: store.get().points + 100, drills: store.get().drills + 1 });
    setBurst(true);
  };

  return (
    <div>
      {/* HEADER BAR */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-4 bg-white/95 backdrop-blur border-b border-primary/30">
        <div className="flex flex-wrap items-center gap-3 text-text">
          <Link to="/practice" className="btn-ghost !text-xs !py-1.5">
            <i className="fa-solid fa-arrow-left" /> All sets
          </Link>
          <Pill variant={set.section === 'A' ? 'accent' : 'primary'}>Section {set.section}</Pill>
          <Pill>{set.marks} marks</Pill>
          <span className="font-display text-lg tracking-wider uppercase text-ink hidden md:inline-block">
            Set {set.number}: {set.club}
          </span>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setCoachOpen(true)}
              className="btn !py-1.5 !px-3 !text-xs bg-accent text-ink hover:bg-accent-dark"
              title="Coach AI"
            >
              <i className="fa-solid fa-robot" /> Coach AI
            </button>
            <button
              onClick={() => setRunning(!running)}
              className={cn('btn !py-1.5 !px-3 !text-xs', running ? 'bg-danger text-white' : 'btn-primary')}
            >
              <i className={`fa-solid ${running ? 'fa-stop' : 'fa-play'}`} /> {running ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => { setSecs(set.minutes * 60); setRunning(false); }}
              className="btn-outline !py-1.5 !px-3 !text-xs"
              title="Reset timer"
            >
              <i className="fa-solid fa-rotate-left" />
            </button>
            <span className={cn(
              'font-mono text-xl scoreboard-led tracking-wider px-3 py-1 rounded-md border border-ink/20 bg-ink',
              secs < 300 && running && 'animate-pulse'
            )} style={{ color: secs < 300 && running ? '#ef4444' : '#f5b800' }}>
              {fmt(secs)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <ToolBtn icon="fa-folder-open" label="Exhibits" active={openPanels.exhibits} onClick={() => togglePanel('exhibits')} />
          <ToolBtn icon="fa-pen-to-square" label="Word Processor" active={openPanels.word} onClick={() => togglePanel('word')} />
          <ToolBtn icon="fa-table-cells" label="Spreadsheet" active={openPanels.sheet} onClick={() => togglePanel('sheet')} />
          <ToolBtn icon="fa-calculator" label="Calculator" active={openPanels.calc} onClick={() => togglePanel('calc')} />
          <ToolBtn icon="fa-note-sticky" label="Scratch" active={openPanels.scratch} onClick={() => togglePanel('scratch')} />
          <ToolBtn icon="fa-lightbulb" label="Hints" active={openPanels.hints} onClick={() => togglePanel('hints')} accent />
          <ToolBtn icon="fa-trophy" label="Sample Answer" active={openPanels.sample} onClick={() => togglePanel('sample')} accent />
          <ToolBtn icon="fa-list-check" label="Mark Scheme" active={openPanels.mark} onClick={() => togglePanel('mark')} accent />
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        {/* LEFT */}
        <div className="grid gap-4">
          <Card>
            <Pill variant="primary" className="mb-2">{set.banner}</Pill>
            <h2 className="font-display text-2xl tracking-wide uppercase text-ink">{set.club}: {set.topic}</h2>
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
                    <span className="font-mono text-xs text-accent-dark">[{r.marks}]</span>
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

          {openPanels.exhibits && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-folder-open text-primary" />
                <span className="font-display text-lg tracking-wide uppercase text-ink">Exhibits</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {set.exhibits.map((ex) => (
                  <button
                    key={ex.number}
                    onClick={() => setActiveExhibit(ex.number)}
                    className={cn(
                      'pill border bg-white',
                      activeExhibit === ex.number ? 'bg-primary text-white border-primary' : 'border-border'
                    )}
                  >
                    {ex.number}. {ex.title}
                  </button>
                ))}
              </div>
              {set.exhibits.map((ex) =>
                ex.number === activeExhibit ? (
                  <div key={ex.number} className="p-3.5 rounded-lg bg-slate-50 border border-border">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-accent-dark font-bold mb-1.5">
                      Exhibit {ex.number}
                    </div>
                    <h4 className="font-bold mb-2 text-ink">{ex.title}</h4>
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">{ex.body}</p>
                  </div>
                ) : null
              )}
            </Card>
          )}
        </div>

        {/* RIGHT */}
        <div className="grid gap-4">
          {openPanels.word && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-pen-to-square text-primary" />
                <span className="font-display text-lg tracking-wide uppercase text-ink">Word Processor</span>
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

          {/* Spreadsheet is rendered in a full-width docked section below to give it the entire page width */}
          {openPanels.calc && <Calculator />}
          {openPanels.scratch && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-note-sticky text-accent-dark" />
                <span className="font-display text-lg tracking-wide uppercase text-ink">Scratch Pad</span>
              </div>
              <textarea
                value={scratch}
                onChange={(e) => setScratch(e.target.value)}
                rows={6}
                placeholder="Notes, working numbers, plan structure..."
                className="w-full p-3 rounded-lg bg-accent/[0.06] border border-accent/40 focus:border-accent-dark focus:outline-none font-mono text-[13px] resize-y"
              />
            </Card>
          )}

          {openPanels.hints && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-lightbulb text-accent-dark" />
                <span className="font-display text-lg tracking-wide uppercase text-ink">Hints</span>
                <span className="ml-auto text-[11px] text-muted">For requirement ({String.fromCharCode(97 + activeReq)})</span>
              </div>
              <div className="p-3.5 rounded-lg bg-accent/[0.10] border border-accent/40">
                <div className="text-[11px] uppercase tracking-[0.18em] text-accent-dark font-bold mb-1.5">
                  <i className="fa-solid fa-compass mr-1" /> Approach
                </div>
                <p className="text-[13.5px] leading-relaxed">{set.requirements[activeReq]?.hint}</p>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  className="btn-accent !text-xs !py-2"
                  onClick={() => askHint(activeReq)}
                  disabled={(reveal[activeReq] || 0) >= (set.requirements[activeReq]?.solution.length || 0)}
                >
                  <i className="fa-solid fa-eye" /> Reveal next step
                </button>
                <button
                  className="btn-outline !text-xs !py-2"
                  onClick={() => setShowFullSolution((s) => ({ ...s, [activeReq]: !s[activeReq] }))}
                >
                  <i className="fa-solid fa-bolt" /> {showFullSolution[activeReq] ? 'Hide' : 'Reveal full'} solution
                </button>
                <button
                  className="btn-ghost !text-xs !py-2 ml-auto"
                  onClick={() => setCoachOpen(true)}
                >
                  <i className="fa-solid fa-robot" /> Ask Coach AI
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

          {openPanels.sample && (
            <SampleAnswerPanel setId={set.id} reqIndex={activeReq} reqLabel={set.requirements[activeReq]?.label || ''} />
          )}

          {openPanels.mark && (
            <Card className="relative overflow-visible">
              <GoalBurst play={burst} onDone={() => setBurst(false)} />
              <div className="flex items-center gap-2 mb-3">
                <i className="fa-solid fa-list-check text-accent-dark" />
                <span className="font-display text-lg tracking-wide uppercase text-ink">Mark Scheme</span>
              </div>
              <table className="w-full text-[13px]">
                <tbody>
                  {set.markScheme.map((m, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-b-0">
                      <td className="py-1.5 pr-2">{m.item}</td>
                      <td className="py-1.5 text-right font-mono text-accent-dark">{m.marks}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary">
                    <td className="py-2 font-bold text-ink">Total</td>
                    <td className="py-2 text-right font-mono text-primary font-bold">{set.marks}</td>
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

      {/* SPREADSHEET DOCK — full page width, resizable height */}
      {openPanels.sheet && (
        <div className="mt-4">
          <SpreadsheetWS setId={set.id} onClose={() => togglePanel('sheet')} />
        </div>
      )}

      {/* COACH AI DRAWER */}
      <CoachDrawer open={coachOpen} onClose={() => setCoachOpen(false)} setContext={set.club + ' / ' + set.topic} />
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
          ? (accent ? 'bg-accent text-ink border-accent' : 'bg-primary text-white border-primary')
          : 'bg-white border-border hover:border-primary/50'
      )}
    >
      <i className={`fa-solid ${icon} text-[11px]`} />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────
   3) EXPANDABLE SPREADSHEET
   ───────────────────────────────────────────── */
type SheetMode = 'inline' | 'docked';

function SpreadsheetWS({ setId, onClose }: { setId: string; onClose?: () => void }) {
  const sk = (key: string) => `tba_practice_${setId}_sheet_v2_${key}`;
  const [sheet, setSheet] = useState<Sheet>(() => {
    // Start big: 40 rows x 14 columns. Comfortably holds a 7-year NPV proforma
    // with 30+ working lines or a Section A multi-stage model.
    const empty = (): Sheet => Array.from({ length: 40 }, () => Array.from({ length: 14 }, () => ''));
    return safeReadJson<Sheet>(sk('data'), empty());
  });
  const [active, setActive] = useState<{ r: number; c: number } | null>({ r: 0, c: 0 });
  const [showFns, setShowFns] = useState(false);
  const [search, setSearch] = useState('');
  const [zoom, setZoom] = useState(100); // percent

  // Mode + resizable dock height
  const [mode, setMode] = useState<SheetMode>(() => readEnum(localStorage.getItem('tba_sheet_mode'), ['inline', 'docked'] as const, 'inline'));
  const [dockHeight, setDockHeight] = useState<number>(() => {
    const stored = localStorage.getItem('tba_sheet_dock_h');
    if (stored) return Math.max(220, Math.min(window.innerHeight - 120, parseInt(stored, 10) || 480));
    return Math.round(window.innerHeight * 0.55);
  });

  useEffect(() => { safeWriteJson(sk('data'), sheet); }, [sheet, setId]);
  useEffect(() => { localStorage.setItem('tba_sheet_mode', mode); }, [mode]);
  useEffect(() => { localStorage.setItem('tba_sheet_dock_h', String(dockHeight)); }, [dockHeight]);

  // ESC to switch back to inline mode
  useEffect(() => {
    if (mode !== 'docked') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMode('inline'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode]);

  // Drag handle: resize the dock by pulling the top edge up or down.
  // Split into mouse/touch handlers because React event handler prop types
  // are invariant; we delegate to a shared `startDrag` core.
  const dragRef = useRef<{ startY: number; startH: number } | null>(null);
  function startDrag(startY: number) {
    dragRef.current = { startY, startH: dockHeight };
    const applyDrag = (cy: number) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - cy; // dragging UP increases height
      const next = Math.max(220, Math.min(window.innerHeight - 80, dragRef.current.startH + delta));
      setDockHeight(next);
    };
    const onMouseMove = (ev: MouseEvent) => applyDrag(ev.clientY);
    const onTouchMove = (ev: TouchEvent) => applyDrag(ev.touches[0].clientY);
    const onEnd = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);
  }
  const onMouseDownDrag: React.MouseEventHandler = (e) => {
    e.preventDefault();
    startDrag(e.clientY);
  };
  const onTouchStartDrag: React.TouchEventHandler = (e) => {
    e.preventDefault();
    startDrag(e.touches[0].clientY);
  };

  function update(r: number, c: number, v: string) {
    setSheet((cur) => {
      const next = cur.map((row) => [...row]);
      while (next.length <= r) next.push(Array.from({ length: cur[0]?.length || 14 }, () => ''));
      while (next[r].length <= c) next[r].push('');
      next[r][c] = v;
      return next;
    });
  }
  function addRow() {
    setSheet((cur) => [...cur, Array.from({ length: cur[0]?.length || 14 }, () => '')]);
  }
  function addCol() {
    setSheet((cur) => cur.map((row) => [...row, '']));
  }
  function addRows(n: number) {
    setSheet((cur) => [...cur, ...Array.from({ length: n }, () => Array.from({ length: cur[0]?.length || 14 }, () => ''))]);
  }
  function addCols(n: number) {
    setSheet((cur) => cur.map((row) => [...row, ...Array.from({ length: n }, () => '')]));
  }
  function removeRow() {
    setSheet((cur) => (cur.length > 1 ? cur.slice(0, -1) : cur));
  }
  function removeCol() {
    setSheet((cur) => (cur[0]?.length > 1 ? cur.map((row) => row.slice(0, -1)) : cur));
  }
  function clearAll() {
    if (!confirm('Clear the spreadsheet?')) return;
    setSheet(Array.from({ length: 40 }, () => Array.from({ length: 14 }, () => '')));
  }

  const cols = sheet[0]?.length || 0;
  const rows = sheet.length;
  const activeCell = active ? sheet[active.r]?.[active.c] || '' : '';
  const activeRef = active ? `${colLetter(active.c)}${active.r + 1}` : '';
  const activeComputed = active ? compute(sheet, activeCell) : null;

  const fns = useMemo(() => {
    if (!search.trim()) return FN_CATALOG;
    const q = search.toLowerCase();
    return FN_CATALOG.filter((f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q));
  }, [search]);

  function insertFunction(sig: string) {
    if (!active) return;
    const fnCall = '=' + sig.split('(')[0] + '(';
    update(active.r, active.c, fnCall);
  }

  // Viewport sizing:
  //  - inline: tall but bounded so it sits in the page flow at full width
  //  - docked: docked to the bottom of the viewport, height set by user via drag handle
  // Shell padding/header consumes ~150px of the dock height for chrome.
  const inlineHeight = 720;
  const sheetViewportPx = mode === 'docked' ? Math.max(120, dockHeight - 180) : inlineHeight;
  const cellWidth = Math.round(112 * (zoom / 100));   // base 112px per column
  const headerHeight = 32;
  const cellHeight = Math.round(28 * (zoom / 100));
  const fontPx = Math.round(13 * (zoom / 100));

  const body = (
    <Card className={cn(mode === 'docked' && '!rounded-none !border-0 !shadow-none h-full flex flex-col')}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <i className="fa-solid fa-table-cells text-primary" />
        <span className="font-display text-lg tracking-wide uppercase text-ink">Spreadsheet</span>
        <span className="text-[11px] text-muted">{rows} rows · {cols} cols</span>
        <div className="ml-auto flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setZoom(Math.max(60, zoom - 10))}
            className="btn-outline !text-xs !py-1 !px-2"
            title="Zoom out"
          >
            <i className="fa-solid fa-magnifying-glass-minus" />
          </button>
          <span className="font-mono text-xs text-muted w-10 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="btn-outline !text-xs !py-1 !px-2"
            title="Zoom in"
          >
            <i className="fa-solid fa-magnifying-glass-plus" />
          </button>
          <button
            onClick={() => setMode(mode === 'docked' ? 'inline' : 'docked')}
            className={cn('btn !text-xs !py-1 !px-2', mode === 'docked' ? 'btn-accent' : 'btn-outline')}
            title={mode === 'docked' ? 'Undock (Esc)' : 'Dock to bottom (resizable)'}
          >
            <i className={`fa-solid ${mode === 'docked' ? 'fa-window-maximize' : 'fa-window-restore'}`} />
            <span className="hidden sm:inline">{mode === 'docked' ? ' Undock' : ' Dock'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="btn-outline !text-xs !py-1 !px-2"
              title="Close spreadsheet"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          )}
        </div>
      </div>

      {/* Formula bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-xs text-muted px-2 py-1 rounded bg-slate-100 min-w-[52px] text-center font-bold">
          {activeRef}
        </span>
        <span className="font-mono text-xs text-muted">f<sub>x</sub></span>
        <input
          value={activeCell}
          onChange={(e) => active && update(active.r, active.c, e.target.value)}
          className="flex-1 px-2 py-1.5 rounded-md bg-white border border-border focus:border-primary focus:outline-none font-mono text-[13px]"
          placeholder="Enter a value or =formula..."
        />
        <button
          onClick={() => setShowFns(!showFns)}
          className={cn('btn !py-1.5 !px-3 !text-xs', showFns ? 'btn-accent' : 'btn-outline')}
        >
          f<sub>x</sub> Functions
        </button>
      </div>

      {/* Active cell computed value */}
      {active && activeCell && activeCell.startsWith('=') && (
        <div className="mb-2 px-2 py-1 rounded bg-primary/[0.05] border border-primary/30 text-[12px] font-mono">
          <span className="text-muted">= </span>
          <span className={activeComputed?.ok ? 'text-primary' : 'text-danger'}>
            {activeComputed?.ok ? display(sheet, active.r, active.c) : (activeComputed?.err || 'error')}
          </span>
        </div>
      )}

      {/* Function picker */}
      <AnimatePresence>
        {showFns && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 30+ functions: NPV, IRR, BSCALL, WACC, UNGEAR..."
              className="w-full px-3 py-2 rounded-md border border-border focus:border-primary focus:outline-none text-[13px] mb-2"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 max-h-60 overflow-y-auto p-2 rounded-md bg-slate-50 border border-border">
              {fns.map((f) => (
                <button
                  key={f.name}
                  onClick={() => insertFunction(f.sig)}
                  className="text-left p-2 rounded-md bg-white border border-border hover:border-primary text-[12px]"
                >
                  <div className="font-mono font-bold text-primary">{f.sig}</div>
                  <div className="text-muted text-[11px] mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sheet viewport: scrollable container, sticky row + column headers */}
      <div
        className={cn('rounded-md border-2 border-border overflow-auto bg-white', mode === 'docked' && 'flex-1 min-h-0')}
        style={{ fontSize: fontPx, height: mode === 'docked' ? undefined : sheetViewportPx }}
      >
        <table className="border-collapse font-mono w-max">
          <thead className="sticky top-0 z-20">
            <tr>
              <th
                className="bg-slate-200 border border-border sticky left-0 z-30"
                style={{ width: 48, height: headerHeight }}
              />
              {Array.from({ length: cols }).map((_, c) => (
                <th
                  key={c}
                  className="px-2 bg-slate-200 border border-border text-muted font-bold"
                  style={{ width: cellWidth, height: headerHeight }}
                >
                  {colLetter(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sheet.map((row, r) => (
              <tr key={r}>
                <th
                  className="bg-slate-200 border border-border text-muted text-center sticky left-0 z-10 font-bold"
                  style={{ width: 48, height: cellHeight }}
                >
                  {r + 1}
                </th>
                {row.map((cell, c) => {
                  const isActive = active?.r === r && active?.c === c;
                  const showValue = !isActive && cell.startsWith('=');
                  const computed = showValue ? display(sheet, r, c) : null;
                  return (
                    <td
                      key={c}
                      className={cn('border border-border p-0 align-middle', isActive && 'outline outline-2 outline-primary z-10 relative')}
                      style={{ width: cellWidth, height: cellHeight }}
                    >
                      {showValue ? (
                        <button
                          onClick={() => setActive({ r, c })}
                          className="w-full h-full px-2 text-left text-primary font-mono truncate hover:bg-primary/[0.05]"
                          title={cell}
                        >
                          {computed}
                        </button>
                      ) : (
                        <input
                          value={cell}
                          onFocus={() => setActive({ r, c })}
                          onChange={(e) => update(r, c, e.target.value)}
                          className={cn(
                            'w-full h-full px-2 outline-none',
                            isActive ? 'bg-primary/[0.05]' : 'bg-white'
                          )}
                          style={{ fontSize: fontPx }}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button onClick={addRow} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-plus" /> Row</button>
        <button onClick={() => addRows(10)} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-plus" /> +10 rows</button>
        <button onClick={addCol} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-plus" /> Column</button>
        <button onClick={() => addCols(5)} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-plus" /> +5 cols</button>
        <button onClick={removeRow} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-minus" /> Row</button>
        <button onClick={removeCol} className="btn-outline !text-xs !py-1.5"><i className="fa-solid fa-minus" /> Column</button>
        <button onClick={clearAll} className="btn-outline !text-xs !py-1.5 border-danger text-danger"><i className="fa-solid fa-trash" /> Clear</button>
      </div>

      <div className="mt-3 p-2.5 rounded-md bg-slate-50 border border-border text-[11px] text-muted">
        <b>Tip:</b> hit <kbd className="px-1.5 py-0.5 rounded bg-white border border-border font-mono text-[10px]">Dock</kbd> to slide the sheet to the bottom of the screen, then drag the top edge up or down to balance it against the question above. Esc undocks. Zoom shrinks or grows every cell.
        Built-ins: <code className="text-primary">NPV</code>, <code className="text-primary">IRR</code>, <code className="text-primary">MIRR</code>, <code className="text-primary">BSCALL</code>, <code className="text-primary">WACC</code>, <code className="text-primary">UNGEAR</code>, <code className="text-primary">REGEAR</code>, <code className="text-primary">CAPM</code>, <code className="text-primary">FISHER</code>, <code className="text-primary">IRP</code>, <code className="text-primary">PPP</code>, <code className="text-primary">AF</code>, <code className="text-primary">PV</code>, <code className="text-primary">FV</code>, <code className="text-primary">PMT</code>.
      </div>
    </Card>
  );

  if (mode === 'docked') {
    return (
      <>
        {/* Spacer keeps page content (questions, exhibits) visible above the docked sheet */}
        <div style={{ height: dockHeight }} aria-hidden />
        <div
          className="fixed left-0 right-0 bottom-0 z-40 bg-white border-t-2 border-primary shadow-floodlight flex flex-col"
          style={{ height: dockHeight }}
        >
          {/* Drag handle */}
          <div
            onMouseDown={onMouseDownDrag}
            onTouchStart={onTouchStartDrag}
            className="h-3 cursor-row-resize bg-gradient-to-b from-primary/15 to-primary/0 border-b border-primary/30 flex items-center justify-center group"
            title="Drag to resize. Pull up for more sheet, pull down for more question"
          >
            <span className="w-12 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
          </div>
          <div className="flex-1 overflow-auto p-3">
            {body}
          </div>
        </div>
      </>
    );
  }
  return body;
}

/* ─────────────────────────────────────────────
   4) CALCULATOR
   ───────────────────────────────────────────── */
function Calculator() {
  const [expr, setExpr] = useState('');
  const [history, setHistory] = useState<{ e: string; v: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function evalExpr() {
    if (!expr.trim()) return;
    const out = compute([['']], '=' + expr);
    if (!out.ok) {
      setHistory((h) => [{ e: expr, v: out.err || 'ERROR' }, ...h]);
      return;
    }
    const result = typeof out.v === 'number' ? Number(out.v.toFixed(6)).toString() : String(out.v);
    setHistory((h) => [{ e: expr, v: result }, ...h].slice(0, 8));
    setExpr(result);
  }

  const KEYS = [
    ['7', '8', '9', '/', 'SQRT('],
    ['4', '5', '6', '*', 'EXP('],
    ['1', '2', '3', '-', 'LN('],
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
        <span className="font-display text-lg tracking-wide uppercase text-ink">Calculator</span>
        <span className="ml-auto text-[11px] text-muted">All sheet functions available</span>
      </div>
      <input
        ref={inputRef}
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && evalExpr()}
        placeholder="e.g. NPV(0.09, 8, 11, 14, 16, 18)"
        className="w-full p-2.5 rounded-lg bg-slate-50 border border-border focus:border-primary focus:outline-none font-mono"
      />
      <div className="grid grid-cols-5 gap-1.5 mt-2">
        {KEYS.flat().map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="py-2 rounded-md bg-white border border-border hover:bg-primary hover:text-white hover:border-primary text-sm font-mono"
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
          className="py-2 col-span-3 rounded-md bg-primary text-white text-sm font-bold"
        >
          =
        </button>
      </div>
      {history.length > 0 && (
        <div className="mt-3 grid gap-1 text-[12px] font-mono max-h-32 overflow-y-auto">
          {history.map((h, i) => (
            <div key={i} className="flex justify-between p-1.5 rounded bg-slate-50 border border-border/50">
              <span className="text-muted truncate pr-2">{h.e}</span>
              <span className="text-primary">{h.v}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ─────────────────────────────────────────────
   5) SAMPLE ANSWER PANEL (full-mark exam-style)
   ───────────────────────────────────────────── */
function SampleAnswerPanel({ setId, reqIndex, reqLabel }: { setId: string; reqIndex: number; reqLabel: string }) {
  const sample = getSampleAnswer(setId, reqIndex);
  if (!sample) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <i className="fa-solid fa-trophy text-accent-dark" />
          <span className="font-display text-lg tracking-wide uppercase text-ink">Sample Answer</span>
        </div>
        <p className="text-muted">
          Full-mark sample answers are bundled for the most-tested requirements. For this requirement, use the
          <b className="text-primary"> Hints</b> panel for the step-by-step solution, then ask the
          <b className="text-accent-dark"> Coach AI</b> for additional structure tips.
        </p>
      </Card>
    );
  }
  const tagColor = (t?: SampleLine['tag']) => {
    switch (t) {
      case 'calc': return 'border-primary text-primary';
      case 'workings': return 'border-accent text-accent-dark';
      case 'discuss': return 'border-blue-500 text-blue-700';
      case 'recommend': return 'border-violet-600 text-violet-700';
      case 'esg': return 'border-emerald-600 text-emerald-700';
      case 'skill': return 'border-pink-500 text-pink-700';
      default: return 'border-border text-muted';
    }
  };
  return (
    <Card className="relative">
      <div className="flex items-center gap-2 mb-2">
        <i className="fa-solid fa-trophy text-accent-dark" />
        <span className="font-display text-lg tracking-wide uppercase text-ink">Full-mark Sample Answer</span>
        <span className="ml-auto pill bg-accent text-ink !text-[10px]">Examiner-grade</span>
      </div>
      <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold mb-1">For requirement</div>
      <p className="text-[13px] mb-3 italic">{reqLabel}</p>

      <div className="p-3 rounded-lg bg-accent/[0.06] border border-accent/40 mb-4">
        <div className="text-[11px] uppercase tracking-[0.18em] text-accent-dark font-bold mb-1.5">
          <i className="fa-solid fa-bullseye mr-1" /> What earns full marks
        </div>
        <p className="text-[13.5px] leading-relaxed">{sample.intro}</p>
      </div>

      <div className="grid gap-2">
        {sample.lines.map((line, i) => (
          <div key={i} className={cn('p-3 rounded-md border-l-4 bg-white text-[13px] leading-relaxed', tagColor(line.tag))}>
            <div className="flex items-start justify-between gap-3">
              <span>{line.text}</span>
              {typeof line.marks === 'number' && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary text-white shrink-0">
                  {line.marks}m
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-primary/[0.06] border border-primary/30">
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-1.5">
          <i className="fa-solid fa-comment mr-1" /> Examiner commentary
        </div>
        <p className="text-[13px] leading-relaxed">{sample.notes}</p>
      </div>

      {sample.profSkills.length > 0 && (
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold mb-2">Professional Skills marks</div>
          <div className="grid gap-2">
            {sample.profSkills.map((p, i) => (
              <div key={i} className="p-2.5 rounded-md border border-border bg-slate-50 text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="pill bg-pink-100 text-pink-700 !text-[10px]">{p.skill}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-pink-500 text-white shrink-0">
                    {p.marks}m
                  </span>
                </div>
                <p className="mt-1.5">{p.example}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ─────────────────────────────────────────────
   6) COACH AI DRAWER
   ───────────────────────────────────────────── */
interface ChatMsg { role: 'user' | 'coach'; text: string; }

function CoachDrawer({ open, onClose, setContext }: { open: boolean; onClose: () => void; setContext?: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        role: 'coach',
        text:
          `Coach AI here. Working with you on **${setContext || 'AFM'}**.\n\nAsk me anything about the question or general AFM technique. I cover NPV/APV/WACC, real options, FX and IR hedging, M&A, ESG marks, Islamic finance, behavioural biases, VaR, and Section A board paper structure.\n\nTry one of the suggestions below or paste a specific stuck point.`,
      },
    ]);
  }, [open, setContext]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const reply: CoachReply = await askCoach(msg);
      setMessages((m) => [...m, { role: 'coach', text: reply.text }]);
    } catch {
      setMessages((m) => [...m, { role: 'coach', text: 'Coach AI hit an error. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[460px] bg-white border-l border-border shadow-floodlight flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <div className="p-4 border-b border-border flex items-center gap-2 bg-gradient-to-br from-accent/10 via-white to-primary/5">
              <div className="w-9 h-9 rounded-full bg-accent grid place-items-center text-ink">
                <i className="fa-solid fa-robot" />
              </div>
              <div>
                <div className="font-display text-lg tracking-wide uppercase text-ink leading-none">Coach AI</div>
                <div className="text-[11px] text-muted mt-0.5">Expert AFM tutor, online</div>
              </div>
              <button onClick={onClose} className="ml-auto btn-ghost !p-2">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <ChatBubble key={i} msg={m} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted text-sm">
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="ml-1">Coach is thinking...</span>
                </div>
              )}
              {!loading && messages.length <= 1 && (
                <div className="grid gap-1.5 mt-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-muted font-bold">Try asking</div>
                  {COACH_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left p-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/[0.05] text-[13px]"
                    >
                      <i className="fa-solid fa-arrow-right text-primary mr-2 text-[10px]" /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border bg-white">
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onSubmit={() => send()}
                loading={loading}
                onStop={() => setLoading(false)}
              >
                <ChatInputTextArea placeholder="Ask Coach AI anything about AFM..." />
                <ChatInputSubmit className="bg-primary text-white hover:bg-primary-dark border-primary" />
              </ChatInput>
              <div className="text-[10px] text-muted text-center mt-2">
                Coach AI runs locally with an AFM expert knowledge base. Set <code>VITE_COACH_API_URL</code> to plug in a remote LLM.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChatBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line',
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-slate-50 border border-border text-ink rounded-bl-sm'
        )}
      >
        {renderChatMarkup(msg.text)}
      </div>
    </div>
  );
}

/** Tokenise `**bold**` and `` `code` `` segments into React elements. No HTML strings ever cross the boundary. */
function renderChatMarkup(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const re = /(\*\*([\s\S]+?)\*\*)|(`([^`\n]+)`)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) tokens.push(text.slice(lastIndex, m.index));
    if (m[2] !== undefined) {
      tokens.push(<b key={key++} className="text-primary">{m[2]}</b>);
    } else if (m[4] !== undefined) {
      tokens.push(<code key={key++} className="bg-slate-100 px-1 rounded text-primary text-[12px]">{m[4]}</code>);
    }
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) tokens.push(text.slice(lastIndex));
  return tokens;
}
