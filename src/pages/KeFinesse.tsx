import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppIcon } from '@/components/AppIcon';
import { SectionShell, StickySubNav } from '@/components/Blocks';
import {
  KE_FINESSE_KIND_LABELS,
  KE_FINESSE_MERITS,
  KE_FINESSE_RESOURCES,
  KE_FINESSE_STACK,
  KE_FINESSE_TOTALS,
  type KeFinesseKind,
} from '@/data/ke-finesse';

type Filter = 'all' | KeFinesseKind;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'All tools' },
  ...Object.entries(KE_FINESSE_KIND_LABELS).map(([value, label]) => ({ value: value as KeFinesseKind, label })),
];

const anchors = [
  { id: 'why-finesse', label: 'Why it works' },
  { id: 'finesse-stack', label: 'The stack' },
  { id: 'finesse-vault', label: 'Tool vault' },
];

export function KeFinessePage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const resources = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KE_FINESSE_RESOURCES.filter((resource) => {
      if (filter !== 'all' && resource.kind !== filter) return false;
      if (!q) return true;
      return [resource.title, resource.eyebrow, resource.description, resource.merit, ...resource.tags]
        .some((value) => value.toLowerCase().includes(q));
    });
  }, [filter, query]);

  return (
    <>
      <StickySubNav title="ke finesse" anchors={anchors} />

      <SectionShell tone="navy" pad="lg" aura auraGrid className="overflow-hidden">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-accent">
              <AppIcon name="wand" size={15} /> AFM final-mile room
            </span>
            <h1 className="mt-5 font-display text-6xl leading-[.88] text-white sm:text-7xl lg:text-[7.5rem]">ke finesse</h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Build the answer before the answer. Ke Finesse is the trusted AFM tool stack that turns a chosen topic
              into recall, a board-ready structure, timed evidence and a specific repair—without leaving the academy.
            </p>
            <div className="mt-7 flex flex-wrap gap-2" aria-label="Ke Finesse totals">
              <Stat value={KE_FINESSE_TOTALS.resources} label="tools" />
              <Stat value={KE_FINESSE_TOTALS.categories} label="rooms" />
              <Stat value={KE_FINESSE_TOTALS.stages} label="stage loop" />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-primary" href="#finesse-stack">Run the stack</a>
              <Link className="btn btn-secondary" to="/leave-it-to-us">Choose the move for me</Link>
            </div>
          </div>

          <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/[.055] p-5 shadow-2xl sm:p-7">
            <picture aria-hidden="true" className="absolute inset-0 opacity-[.14]">
              <source type="image/avif" srcSet="/spurs/tools.avif 1x, /spurs/tools@2x.avif 2x" />
              <source type="image/webp" srcSet="/spurs/tools.webp 1x, /spurs/tools@2x.webp 2x" />
              <img className="h-full w-full object-cover" src="/spurs/tools.png" alt="" />
            </picture>
            <div className="relative z-10 rounded-3xl border border-white/10 bg-[rgba(5,15,34,.82)] p-5 backdrop-blur-sm sm:p-7">
              <span className="text-xs font-black uppercase tracking-[.16em] text-accent">The handoff</span>
              <h2 className="mt-3 font-display text-4xl text-white">Direction becomes evidence.</h2>
              <div className="mt-6 grid gap-3">
                {[
                  ['01', 'Leave It To Us', 'chooses the next useful move'],
                  ['02', 'Ke Finesse', 'opens the right tools in sequence'],
                  ['03', 'Matchday', 'tests the work under pressure'],
                  ['04', 'Debrief', 'feeds the leak into the next plan'],
                ].map(([n, title, body]) => (
                  <div key={n} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-white/10 pt-3 first:border-0 first:pt-0">
                    <span className="font-display text-2xl text-accent">{n}</span>
                    <div><strong className="block text-sm text-white">{title}</strong><span className="text-sm text-white/60">{body}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="white" pad="lg" id="why-finesse">
        <div className="max-w-6xl mx-auto">
          <span className="kicker">What the APM build taught us</span>
          <div className="mt-3 grid gap-4 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
            <h2 className="font-display text-4xl leading-none text-ink sm:text-6xl">A resource room only earns its tab if it removes friction.</h2>
            <p className="max-w-2xl text-base leading-7 text-muted lg:justify-self-end">
              The merit is not having more material. It is putting the smallest useful set in the learner&apos;s path,
              preserving source confidence and making every visit end in work that can be judged.
            </p>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KE_FINESSE_MERITS.map((merit) => (
              <article key={merit.title} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-accent"><AppIcon name={merit.icon} size={19} /></span>
                <h3 className="mt-5 font-display text-2xl leading-tight text-ink">{merit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{merit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="black" pad="lg" id="finesse-stack">
        <div className="max-w-6xl mx-auto text-white">
          <span className="kicker text-accent">The Finesse stack</span>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-3xl font-display text-4xl leading-none sm:text-6xl">Five moves. One closed pass loop.</h2>
            <p className="max-w-xl text-sm leading-6 text-white/65">Start anywhere only when you have evidence to justify it. Otherwise, run the sequence left to right.</p>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-5">
            {KE_FINESSE_STACK.map((step) => (
              <Link key={step.n} to={step.to} className="group rounded-3xl border border-white/15 bg-white/[.055] p-5 transition hover:-translate-y-1 hover:border-accent/60 hover:bg-white/10">
                <div className="flex items-center justify-between"><span className="font-display text-4xl text-accent">{step.n}</span><AppIcon name={step.icon} size={18} className="text-white/45 transition group-hover:text-accent" /></div>
                <span className="mt-5 block text-[.68rem] font-black uppercase tracking-[.15em] text-white/45">{step.label}</span>
                <h3 className="mt-2 font-display text-2xl leading-tight">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{step.body}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-accent">Open move <AppIcon name="arrowRight" size={13} /></span>
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell tone="mist" pad="lg" id="finesse-vault">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-5 lg:grid-cols-[1fr_21rem] lg:items-end">
            <div>
              <span className="kicker">The AFM tool vault</span>
              <h2 className="mt-3 font-display text-4xl leading-none text-ink sm:text-6xl">Everything has a job.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Search by the result you need—formula, professional skills, recall, paper, examiner or repair.</p>
            </div>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-muted">Search the vault</span>
              <input
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try formulas, examiner, mock..."
                type="search"
              />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter Ke Finesse tools">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${filter === item.value ? 'border-primary bg-primary text-white' : 'border-border bg-white text-muted hover:border-primary/40 hover:text-primary'}`}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs font-bold text-muted" aria-live="polite">Showing {resources.length} of {KE_FINESSE_TOTALS.resources} tools</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Link key={resource.id} to={resource.to} className="group flex min-h-[22rem] flex-col rounded-3xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-accent"><AppIcon name={resource.icon} size={19} /></span>
                  <div className="text-right">
                    <span className="block text-[.66rem] font-black uppercase tracking-[.14em] text-primary">{KE_FINESSE_KIND_LABELS[resource.kind]}</span>
                    {resource.minutes && <span className="mt-1 block text-xs font-bold text-muted">{resource.minutes}</span>}
                  </div>
                </div>
                <span className="mt-6 text-[.68rem] font-black uppercase tracking-[.14em] text-muted">{resource.eyebrow}</span>
                <h3 className="mt-2 font-display text-3xl leading-tight text-ink">{resource.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{resource.description}</p>
                <div className="mt-4 rounded-2xl bg-mist p-3 text-xs leading-5 text-ink"><strong>Why it earns the tab:</strong> {resource.merit}</div>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {resource.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-border bg-white px-2.5 py-1 text-[.65rem] font-bold text-muted">{tag}</span>)}
                </div>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-primary">{resource.cta} <AppIcon name="arrowUpRight" size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
              </Link>
            ))}
          </div>
          {resources.length === 0 && (
            <div className="mt-5 rounded-3xl border border-dashed border-border bg-white p-10 text-center">
              <h3 className="font-display text-3xl text-ink">No tool matches that search.</h3>
              <button type="button" className="mt-3 text-sm font-black text-primary" onClick={() => { setQuery(''); setFilter('all'); }}>Reset the vault</button>
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell tone="navy" pad="md">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 text-white lg:flex-row lg:items-center lg:justify-between">
          <div><span className="kicker text-accent">No hunting required</span><h2 className="mt-2 font-display text-4xl">Not sure where to start? That is what the first room solves.</h2></div>
          <Link className="btn btn-primary shrink-0" to="/leave-it-to-us">Leave the next move to us <AppIcon name="arrowRight" size={14} /></Link>
        </div>
      </SectionShell>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return <span className="inline-flex items-baseline gap-2 rounded-xl border border-white/15 bg-white/[.07] px-3 py-2 text-xs font-black uppercase tracking-[.12em] text-white/70"><strong className="font-display text-2xl text-accent">{value}</strong>{label}</span>;
}
