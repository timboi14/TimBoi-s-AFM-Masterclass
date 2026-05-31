import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { THEORY, CAT_LABELS, type ThoeryCat } from '@/data/theory';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { store, useStore } from '@/lib/store';
import { cn } from '@/lib/cn';
import { readEnum } from '@/lib/guards';

export function TheoryPage() {
  const [mode, setMode] = useState<'bullets' | 'full'>(() =>
    readEnum(localStorage.getItem('tba_theory_mode'), ['bullets', 'full'] as const, 'bullets')
  );
  const setModeP = (m: 'bullets' | 'full') => {
    setMode(m);
    localStorage.setItem('tba_theory_mode', m);
  };
  const [cat, setCat] = useState<ThoeryCat | 'all'>('all');
  const [search, setSearch] = useState('');
  const state = useStore();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return THEORY.filter((c) => {
      if (cat !== 'all' && c.cat !== cat) return false;
      if (!q) return true;
      const hay = `${c.q} ${c.bullets} ${c.full}`.toLowerCase();
      return hay.includes(q);
    });
  }, [cat, search]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    THEORY.forEach((c) => m.set(c.cat, (m.get(c.cat) || 0) + 1));
    return m;
  }, []);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <Card className="!p-7 relative overflow-hidden border-l-4 border-l-accent">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[260px]">
              <Pill variant="accent" className="mb-2">64 Q&amp;A bank, dual mode</Pill>
              <h1 className="font-display text-4xl tracking-wide uppercase">Discussion-mark goldmine</h1>
              <p className="text-text/80 mt-2 max-w-2xl leading-relaxed">
                Every AFM paper has 30+ marks of discussion. Each card has two modes: <b className="text-accent">Quick Bullets</b>
                {' '}for revision recall, and the <b className="text-accent">Full ACCA Model Answer</b> for examiner-style essays.
                Search, filter, repeat. +5 points per first read.
              </p>
            </div>
            <div className="flex gap-2 p-1 rounded-xl bg-slate-50 border border-border">
              <button
                className={cn('px-3.5 py-2 rounded-lg text-xs font-bold transition', mode === 'bullets' ? 'bg-primary text-bg' : 'text-muted hover:text-text')}
                onClick={() => setModeP('bullets')}
              >
                <i className="fa-solid fa-list-ul mr-1.5" /> Quick bullets
              </button>
              <button
                className={cn('px-3.5 py-2 rounded-lg text-xs font-bold transition', mode === 'full' ? 'bg-accent text-bg' : 'text-muted hover:text-text')}
                onClick={() => setModeP('full')}
              >
                <i className="fa-solid fa-scroll mr-1.5" /> Full model answer
              </button>
            </div>
          </div>

          <div className="mt-5 relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search: synergy, BSOP, Mudaraba, ESG, M&M..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-accent focus:outline-none text-text placeholder:text-muted"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setCat('all')} className={cn('pill', cat === 'all' ? 'bg-accent text-bg' : 'border border-border')}>
              <i className="fa-solid fa-asterisk" /> All <span className="opacity-70">{THEORY.length}</span>
            </button>
            {(Object.keys(CAT_LABELS) as ThoeryCat[]).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn('pill border border-border', cat === c && 'bg-primary text-bg')}
              >
                <i className={`fa-solid ${CAT_LABELS[c].icon}`} />
                {CAT_LABELS[c].label}
                <span className="opacity-70 ml-1">{counts.get(c) || 0}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-3">
        <AnimatePresence>
          {filtered.length === 0 && (
            <Card>
              <p className="text-muted text-center">No results. Try a different keyword.</p>
            </Card>
          )}
          {filtered.map((c) => (
            <CardItem key={c.ref} card={c} mode={mode} read={state.theoryRead.includes(`t-${c.ref}`)} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CardItem({ card, mode, read }: { card: typeof THEORY[number]; mode: 'bullets' | 'full'; read: boolean }) {
  const [open, setOpen] = useState(false);
  const meta = CAT_LABELS[card.cat];

  function onOpen() {
    if (!open && !read) store.markTheoryRead(`t-${card.ref}`);
    setOpen(!open);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={cn(
        'card-base overflow-hidden transition-colors',
        open ? 'border-primary' : 'hover:border-accent/50'
      )}
    >
      <button onClick={onOpen} className="w-full text-left p-4 flex items-center gap-3">
        <span className="font-display text-lg text-accent w-10 shrink-0">#{card.ref}</span>
        <span className="font-bold text-[14.5px] leading-snug flex-1">{card.q}</span>
        <span className="pill border border-border text-[10px] hidden sm:inline-flex" style={{ color: meta.color, borderColor: `${meta.color}55` }}>
          <i className={`fa-solid ${meta.icon}`} /> {meta.label}
        </span>
        <motion.i
          className="fa-solid fa-chevron-down text-muted ml-2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, rotateX: -8 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: 8 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl border border-border bg-slate-50 p-4"
                >
                  {mode === 'bullets' ? (
                    <pre className="font-body whitespace-pre-wrap text-[13.5px] leading-relaxed text-text/90 m-0">{card.bullets}</pre>
                  ) : (
                    <p className="text-[13.5px] leading-relaxed text-text/90">{card.full}</p>
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="mt-3 flex items-center text-[11px] text-muted">
                <span className="pill border border-border" style={{ color: meta.color, borderColor: `${meta.color}55` }}>
                  <i className={`fa-solid ${meta.icon}`} /> {meta.label}
                </span>
                <span className="ml-auto">
                  <i className="fa-solid fa-bolt text-accent" /> +5 pts on first read
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
