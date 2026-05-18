import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CenteredHero,
  HeroGold,
  SectionShell,
  StatStrip,
  StickySubNav,
  TonePill,
  type SubNavAnchor,
} from '@/components/Blocks';
import { TBA_STATS } from '@/data/stats';
import { EXAMINER_QUOTES, QUOTE_LABELS } from '@/data/examiner';
import { PITFALLS, type PitfallEntry } from '@/data/pitfalls';
import { SCOUT_FINDINGS, SCOUT_RULES, type ScoutFinding } from '@/data/scout.seed';
import { cn } from '@/lib/cn';

/**
 * /scout — Examiner Reports + Pitfalls + Capability Heatmap module.
 *
 * Spec audit batch 04: page must render at minimum the 9 verbatim examiner
 * quotes, the 7-rule cheat sheet, and a sortable capability-frequency table.
 * Body content was 1.1 KB; this rebuild targets 3 KB+ of real study material.
 */

type SortKey = 'capability' | 'area' | 'frequency' | 'lastSeen';
type SortDir = 'asc' | 'desc';

const PITFALL_RANK: Record<PitfallEntry['marksAtRisk'], number> = { high: 3, mid: 2, low: 1 };
const TOP_PITFALLS = [...PITFALLS]
  .sort((a, b) => PITFALL_RANK[b.marksAtRisk] - PITFALL_RANK[a.marksAtRisk])
  .slice(0, 7);

export function ScoutPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'rules', label: '7-rule sheet' },
    { id: 'quotes', label: 'Examiner quotes' },
    { id: 'heatmap', label: 'Capability heatmap' },
    { id: 'pitfalls', label: 'Top pitfalls' },
  ];

  const [sortKey, setSortKey] = useState<SortKey>('frequency');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sortedFindings = useMemo(() => {
    const sorted = [...SCOUT_FINDINGS];
    sorted.sort((a, b) => {
      const cmp = compareKey(a, b, sortKey);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(k);
      setSortDir(k === 'capability' || k === 'area' ? 'asc' : 'desc');
    }
  };

  return (
    <>
      <StickySubNav title="Scout report" anchors={anchors} />

      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Where most marks were lost</>}
          headline={<>Read the <HeroGold>opposition</HeroGold>.</>}
          subline={
            <>
              The traps the examiner sets every sitting. The phrasing they reward.
              The careless errors that cost passes. Memorise these before you walk in.
            </>
          }
          actions={
            <>
              <TonePill as="link" to="/pitfalls" variant="primary">Full pitfall library</TonePill>
              <TonePill as="link" to="/examiner" variant="secondary">Examiner reports digest</TonePill>
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <StatStrip
          stats={[
            { value: SCOUT_RULES.length, label: 'Section A rules', sub: 'Lead → Justify → Quote → Comment' },
            { value: EXAMINER_QUOTES.length, label: 'Verbatim quotes', sub: 'Sep/Dec 2020 onwards' },
            { value: SCOUT_FINDINGS.length, label: 'Capabilities tracked', sub: '2020–2025 frequency × technique' },
            { value: TBA_STATS.pitfalls, label: 'Pitfalls catalogued', sub: 'Cross-referenced to past papers' },
          ]}
          dividers
        />
      </SectionShell>

      {/* ── 7-rule cheat sheet ───────────────────────────────────── */}
      <SectionShell tone="white" pad="lg" id="rules">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
            <i className="fa-solid fa-list-check mr-1.5" aria-hidden /> The 7-rule cheat sheet
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            Apply these in every Section A answer.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Drawn from the highest-frequency mark-loss patterns across the 2020–2025 examiner reports.
            Each rule pairs with the examiner&apos;s own words and a one-line application note.
          </p>
        </header>

        <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCOUT_RULES.map((r) => (
            <li
              key={r.n}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-full bg-primary text-white grid place-items-center font-display text-lg">
                  {r.n}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg uppercase tracking-wide text-ink leading-tight">{r.rule}</h3>
                  <p className="mt-2 text-[14px] text-ink/80 leading-relaxed">{r.detail}</p>
                  <p className="mt-3 text-[12.5px] italic text-muted border-l-2 border-accent pl-3">
                    Examiner: &ldquo;{r.examinerEcho}&rdquo;
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>

      {/* ── 9 verbatim examiner quotes ───────────────────────────── */}
      <SectionShell tone="mist" pad="lg" id="quotes">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
            <i className="fa-solid fa-quote-left mr-1.5" aria-hidden /> Verbatim examiner quotes
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            What the examiner actually said.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Direct lifts from the published ACCA examiner&apos;s reports. Use these phrasings in
            your own answers — they match the marking scheme&apos;s vocabulary.
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMINER_QUOTES.map((q, i) => {
            const label = QUOTE_LABELS[q.category];
            return (
              <figure
                key={i}
                className="rounded-2xl border border-border bg-white p-5 shadow-soft flex flex-col h-full"
              >
                <span
                  className="inline-flex items-center gap-1.5 self-start px-2 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider"
                  style={{ color: label.color, background: `${label.color}1a`, border: `1px solid ${label.color}3a` }}
                >
                  <i className={`fa-solid ${label.icon}`} aria-hidden /> {label.label}
                </span>
                <blockquote className="mt-3 text-[14.5px] leading-relaxed text-ink italic flex-1">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-[11.5px] uppercase tracking-wider text-muted font-bold">
                  — {q.paper}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </SectionShell>

      {/* ── Capability heatmap (sortable) ────────────────────────── */}
      <SectionShell tone="white" pad="lg" id="heatmap">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-primary font-bold mb-2">
            <i className="fa-solid fa-table-cells-large mr-1.5" aria-hidden /> Capability heatmap
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            What appears, how often, what wins the marks.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            Click a column header to sort. Frequency = distinct sittings 2020–2025 where the
            capability was the dominant marks centre of a question or part.
          </p>
        </header>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-muted border-b border-border">
                <ColHeader sortKey={sortKey} sortDir={sortDir} k="capability" label="Cap" onClick={toggleSort} />
                <ColHeader sortKey={sortKey} sortDir={sortDir} k="area" label="Area" onClick={toggleSort} />
                <ColHeader sortKey={sortKey} sortDir={sortDir} k="frequency" label="Sittings" onClick={toggleSort} align="right" />
                <ColHeader sortKey={sortKey} sortDir={sortDir} k="lastSeen" label="Last seen" onClick={toggleSort} />
                <th className="p-3 text-left font-bold">Mark-winning technique</th>
              </tr>
            </thead>
            <tbody>
              {sortedFindings.map((f) => (
                <tr key={f.capability + '/' + f.topicId} className="border-b border-border/60 last:border-b-0 hover:bg-primary/[0.03]">
                  <td className="p-3 font-mono font-bold text-primary">{f.capability}</td>
                  <td className="p-3">
                    <Link to={`/topic/${f.topicId}`} className="text-ink hover:text-primary underline-offset-4 hover:underline">
                      {f.area}
                    </Link>
                  </td>
                  <td className="p-3 text-right font-mono">
                    <FrequencyChip n={f.frequency} />
                  </td>
                  <td className="p-3 text-muted whitespace-nowrap">{f.lastSeen}</td>
                  <td className="p-3 text-ink/85 leading-snug">{f.technique}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionShell>

      {/* ── Top 7 pitfalls ───────────────────────────────────────── */}
      <SectionShell tone="mist" pad="lg" id="pitfalls">
        <header className="max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-danger font-bold mb-2">
            <i className="fa-solid fa-triangle-exclamation mr-1.5" aria-hidden /> Top pitfalls
          </p>
          <h2 className="font-display text-4xl tracking-wide uppercase text-ink leading-[0.95]">
            Make the mistake here, not on exam day.
          </h2>
          <p className="mt-3 text-ink/80 leading-relaxed">
            The seven highest-marks-at-risk pitfalls. Each has a symptom, why it loses marks,
            and the fix. <Link to="/pitfalls" className="text-primary font-bold underline underline-offset-4">Open the full library →</Link>
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {TOP_PITFALLS.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-soft"
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider',
                    p.marksAtRisk === 'high' && 'text-danger bg-danger/10 border border-danger/30',
                    p.marksAtRisk === 'mid' && 'text-accent-dark bg-accent/10 border border-accent/30',
                    p.marksAtRisk === 'low' && 'text-muted bg-slate-100 border border-border',
                  )}
                >
                  <i className="fa-solid fa-bolt" aria-hidden /> {p.marksAtRisk === 'high' ? 'High risk' : p.marksAtRisk === 'mid' ? 'Mid risk' : 'Low risk'}
                </span>
                {p.topics.slice(0, 2).map((t) => (
                  <span key={t} className="text-[10.5px] uppercase tracking-wider text-muted font-bold">
                    · {t}
                  </span>
                ))}
              </div>
              <p className="text-[14px] leading-relaxed text-ink font-bold">{p.symptom}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">
                <span className="font-bold text-danger">Why: </span>{p.why}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">
                <span className="font-bold text-primary">Fix: </span>{p.fix}
              </p>
            </article>
          ))}
        </div>
      </SectionShell>
    </>
  );
}

function compareKey(a: ScoutFinding, b: ScoutFinding, k: SortKey): number {
  if (k === 'frequency') return a.frequency - b.frequency;
  if (k === 'lastSeen') return a.lastSeen.localeCompare(b.lastSeen);
  if (k === 'capability') return a.capability.localeCompare(b.capability);
  return a.area.localeCompare(b.area);
}

function ColHeader({ sortKey, sortDir, k, label, onClick, align = 'left' }: {
  sortKey: SortKey;
  sortDir: SortDir;
  k: SortKey;
  label: string;
  onClick: (k: SortKey) => void;
  align?: 'left' | 'right';
}) {
  const active = sortKey === k;
  return (
    <th
      scope="col"
      className={cn('p-3 cursor-pointer select-none font-bold', align === 'right' ? 'text-right' : 'text-left', active && 'text-primary')}
      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      onClick={() => onClick(k)}
    >
      <button type="button" className="inline-flex items-center gap-1.5">
        {label}
        <span aria-hidden className={cn('text-[9px]', !active && 'opacity-30')}>
          {active ? (sortDir === 'asc' ? '▲' : '▼') : '▲'}
        </span>
      </button>
    </th>
  );
}

function FrequencyChip({ n }: { n: number }) {
  // Visual heat: 7+ sittings = deep green, 4–6 = amber, ≤3 = grey.
  const tone = n >= 7 ? 'bg-primary/15 text-primary' : n >= 4 ? 'bg-accent/15 text-accent-dark' : 'bg-slate-100 text-muted';
  return (
    <span className={cn('inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md font-bold text-[12.5px]', tone)}>
      {n}
    </span>
  );
}
