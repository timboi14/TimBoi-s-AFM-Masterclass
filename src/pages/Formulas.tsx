import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Pill, fadeUp, stagger } from '@/components/primitives';
import { TOPIC_LIST, type Formula } from '@/data/topics';
import { cn } from '@/lib/cn';

const CATEGORY_ORDER: Formula['category'][] = ['CoC', 'Valuation', 'Options', 'FX', 'IRR', 'M&A', 'Portfolio'];
const CATEGORY_LABELS: Record<Formula['category'], string> = {
  CoC: 'Cost of Capital',
  Valuation: 'Valuation',
  Options: 'Options & Real Options',
  FX: 'FX hedging',
  IRR: 'Interest rate risk',
  'M&A': 'M&A',
  Portfolio: 'Portfolio Theory',
};

export function FormulasPage() {
  const [search, setSearch] = useState('');
  const [printMode, setPrintMode] = useState(false);

  const all = useMemo(() => TOPIC_LIST.flatMap((t) => t.formulas), []);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return all;
    return all.filter((f) =>
      [f.name, f.formula, f.context, ...f.variables].some((v) => v.toLowerCase().includes(q))
    );
  }, [all, search]);

  const grouped = useMemo(() => {
    const m = new Map<Formula['category'], Formula[]>();
    filtered.forEach((f) => {
      if (!m.has(f.category)) m.set(f.category, []);
      m.get(f.category)!.push(f);
    });
    return m;
  }, [filtered]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={stagger}
      className={cn(printMode && 'bg-white text-black')}
    >
      <motion.div variants={fadeUp}>
        <Card className="!p-7 border-l-4 border-l-primary">
          <Pill variant="primary" className="mb-2">Formula sheet</Pill>
          <h1 className="font-display text-4xl tracking-wide uppercase">Cheat-sheet, with context</h1>
          <p className="text-text/80 mt-2 max-w-2xl">
            Searchable formulas, grouped by category. Each one includes the equation, variables, and a one-line
            exam context. Toggle clean view to print.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[260px]">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search formulas, e.g. WACC, parity, beta..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-bg/70 border border-border focus:border-primary focus:outline-none text-text placeholder:text-muted"
              />
            </div>
            <button className="btn-outline" onClick={() => setPrintMode(!printMode)}>
              <i className="fa-solid fa-print" /> {printMode ? 'Studio mode' : 'Clean view'}
            </button>
            <button className="btn-outline" onClick={() => window.print()}>
              <i className="fa-solid fa-file-pdf" /> Print
            </button>
          </div>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-6">
        {CATEGORY_ORDER.map((c) => {
          const items = grouped.get(c) || [];
          if (items.length === 0) return null;
          return (
            <motion.div variants={fadeUp} key={c}>
              <h2 className="font-display text-2xl tracking-wide uppercase mb-3 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                {CATEGORY_LABELS[c]}
                <Pill>{items.length}</Pill>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {items.map((f) => (
                  <motion.div key={f.name} variants={fadeUp}>
                    <Card className={cn(printMode && 'bg-white text-black border-gray-300')}>
                      <h3 className="font-display text-lg tracking-wide uppercase">{f.name}</h3>
                      <div className="mt-2 p-3.5 rounded-lg bg-bg/60 border border-border font-mono text-accent text-[14px] overflow-x-auto whitespace-nowrap">
                        {f.formula}
                      </div>
                      {f.variables.length > 0 && (
                        <ul className="mt-3 grid gap-1 text-[12.5px] text-text/80">
                          {f.variables.map((v, i) => (
                            <li key={i}>
                              <span className="text-primary">•</span> {v}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-3 text-[12.5px] italic text-muted leading-relaxed border-t border-border pt-2">
                        {f.context}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
