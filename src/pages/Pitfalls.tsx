import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { PITFALLS, type PitfallEntry } from '@/data/pitfalls';
import { TOPICS } from '@/data/topics';
import { SOURCE_LABELS } from '@/lib/source-labels';
import { cn } from '@/lib/cn';

const FILTERS: { id: string; label: string; predicate: (p: PitfallEntry) => boolean }[] = [
  { id: 'all', label: 'All', predicate: () => true },
  { id: 'high', label: 'High mark risk', predicate: (p) => p.marksAtRisk === 'high' },
  { id: 'examiner', label: 'Examiner-flagged', predicate: (p) => p.source === 'examiner' },
  { id: 'coach', label: 'Coach technique', predicate: (p) => p.source === 'mower' },
];

export function PitfallsPage() {
  const [filter, setFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [query, setQuery] = useState('');

  const topics = useMemo(() => {
    const ids = new Set<string>();
    PITFALLS.forEach((p) => p.topics.forEach((t) => ids.add(t)));
    return Array.from(ids).map((id) => TOPICS[id]).filter(Boolean);
  }, []);

  const list = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!.predicate;
    const q = query.trim().toLowerCase();
    return PITFALLS.filter(f).filter((p) => {
      if (topicFilter !== 'all' && !p.topics.includes(topicFilter)) return false;
      if (!q) return true;
      return (p.symptom + ' ' + p.why + ' ' + p.fix).toLowerCase().includes(q);
    });
  }, [filter, topicFilter, query]);

  const counts = {
    high: PITFALLS.filter((p) => p.marksAtRisk === 'high').length,
    mid: PITFALLS.filter((p) => p.marksAtRisk === 'mid').length,
    examiner: PITFALLS.filter((p) => p.source === 'examiner').length,
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* Hero */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-danger/[0.06] via-white to-accent/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-danger" style={{ borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.10)' }}>
              <i className="fa-solid fa-triangle-exclamation" /> Pitfalls library
            </span>
            <span className="chip">{PITFALLS.length} entries</span>
            <span className="chip text-danger" style={{ borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.10)' }}>
              {counts.high} high-risk
            </span>
            <span className="chip">{counts.examiner} examiner-flagged</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Symptom. Why.<br /><span className="text-gradient">Fix.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Searchable catalogue of every trap the AFM examiner keeps flagging. Each one named the way you&apos;d
            actually catch yourself making it, paired with the technique fix.
          </p>
        </div>
      </motion.section>

      {/* Filters */}
      <SectionTitle icon="fa-solid fa-filter">Filter</SectionTitle>
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'pill border border-border bg-white',
                filter === f.id && 'bg-primary text-white border-primary',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-wider text-muted font-bold">Topic:</span>
          <button
            onClick={() => setTopicFilter('all')}
            className={cn('pill border border-border bg-white', topicFilter === 'all' && 'bg-primary text-white border-primary')}
          >
            All topics
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setTopicFilter(t.id)}
              className={cn('pill border border-border bg-white', topicFilter === t.id && 'bg-primary text-white border-primary')}
            >
              <i className={`fa-solid ${t.badge} text-[10px]`} /> {t.title}
            </button>
          ))}
        </div>
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symptoms, fixes, keywords…"
            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border bg-white text-[14px] focus:outline-none focus:border-primary"
          />
        </div>
      </motion.div>

      {/* List */}
      <motion.div variants={stagger} className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map((p) => (
          <motion.div key={p.id} variants={fadeUp}>
            <PitfallCard p={p} />
          </motion.div>
        ))}
        {list.length === 0 && (
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card className="!p-6 text-center text-muted">
              No pitfalls match those filters. Try widening the search.
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Mantra */}
      <motion.div variants={fadeUp} className="mt-10">
        <Card className="!p-7 text-center" glow>
          <p className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">
            A trap caught in revision is a mark saved on exam day.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function PitfallCard({ p }: { p: PitfallEntry }) {
  const riskColor = p.marksAtRisk === 'high' ? 'danger' : p.marksAtRisk === 'mid' ? 'accent' : 'outline';
  const meta = SOURCE_LABELS[p.source];
  return (
    <Card className="h-full !p-5">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Pill variant={riskColor}>{p.marksAtRisk === 'high' ? 'High risk' : p.marksAtRisk === 'mid' ? 'Mid risk' : 'Low risk'}</Pill>
        <span className="chip text-muted" title={meta.tooltip}>
          <i className={`fa-solid ${meta.icon}`} aria-hidden="true" /> {meta.label}
        </span>
        <div className="ml-auto flex flex-wrap gap-1">
          {p.topics.map((t) => {
            const topic = TOPICS[t];
            return topic ? <span key={t} className="chip text-primary"><i className={`fa-solid ${topic.badge} text-[10px]`} /> {topic.title}</span> : null;
          })}
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-l-danger bg-danger/[0.04] px-3.5 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-danger font-bold mb-1">
          <i className="fa-solid fa-quote-left" /> Symptom
        </div>
        <p className="text-[14px] font-bold text-ink leading-snug italic">"{p.symptom}"</p>
      </div>

      <div className="mt-3">
        <div className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Why it loses marks</div>
        <p className="text-[13px] text-ink leading-relaxed">{p.why}</p>
      </div>

      <div className="mt-3 rounded-xl bg-primary/5 border border-primary/30 px-3.5 py-2.5">
        <div className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1">
          <i className="fa-solid fa-wrench" /> Fix
        </div>
        <p className="text-[13.5px] text-ink leading-relaxed">{p.fix}</p>
      </div>
    </Card>
  );
}
