import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAPERS } from '@/data/pastpapers/papers';
import { SITTINGS } from '@/lib/sittings';
import { TBA_STATS } from '@/data/stats';
import { PastPapersView, type PastPapersViewHandle } from '@/components/PastPapers';
import { SittingsView } from '@/components/PastPapers/sittings/SittingsView';
import { CenteredHero, HeroGold, SectionShell, StickySubNav, type SubNavAnchor } from '@/components/Blocks';

type View = 'sittings' | 'questions';

export function PastPapersPage() {
  const viewRef = useRef<PastPapersViewHandle>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isPopout = searchParams.get('popout') === 'true';
  const view: View = isPopout || searchParams.get('view') === 'questions' ? 'questions' : 'sittings';
  const setView = (next: View) => setSearchParams((prev) => {
    const p = new URLSearchParams(prev);
    if (next === 'sittings') p.delete('view'); else p.set('view', 'questions');
    p.delete('p'); p.delete('s'); p.delete('mode'); p.delete('tab');
    return p;
  }, { replace: true });

  const anchors: SubNavAnchor[] = view === 'questions' ? [
    { id: 'grid', label: 'All questions', onActivate: () => viewRef.current?.resetFilters() },
    { id: 'grid', label: 'Section A', onActivate: () => viewRef.current?.setSectionFilter('A') },
    { id: 'grid', label: 'Section B', onActivate: () => viewRef.current?.setSectionFilter('B') },
    { id: 'by-topic', label: 'By topic' },
  ] : [{ id: 'grid', label: 'All sittings' }];
  const complete = SITTINGS.filter((s) => s.complete).length;

  return <>
    <StickySubNav title="Past papers" anchors={anchors} />
    <SectionShell tone="white" pad="xl">
      <CenteredHero
        eyebrow={<><span aria-hidden>★</span>{SITTINGS.length} sittings · {PAPERS.length} sourced questions · iAssess-style</>}
        headline={view === 'sittings' ? <>Sit the whole <HeroGold>paper</HeroGold>. Like exam day.</> : <>{PAPERS.length} fixtures. One <HeroGold>trophy</HeroGold>. Boot up.</>}
        subline={view === 'sittings'
          ? <>Questions are regrouped into the sittings they came from. Choose friendly practice or the full exam ceremony, keep one countdown, review unseen items and self-mark the complete response.</>
          : <>Prefer one question at a time? Open the scenario, requirement, CBE workspace, worked solution and examiner feedback without losing your place.</>}
        actions={<div className="pp-viewtoggle" role="tablist" aria-label="Past papers view">
          <button type="button" role="tab" aria-selected={view === 'sittings'} className={`pp-viewtoggle__btn ${view === 'sittings' ? 'pp-viewtoggle__btn--active' : ''}`} onClick={() => setView('sittings')}>Full sittings ({SITTINGS.length})</button>
          <button type="button" role="tab" aria-selected={view === 'questions'} className={`pp-viewtoggle__btn ${view === 'questions' ? 'pp-viewtoggle__btn--active' : ''}`} onClick={() => setView('questions')}>By question ({PAPERS.length})</button>
        </div>}
      />
    </SectionShell>
    <SectionShell tone="mist" pad="md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-[var(--mist-200)]">
        {view === 'sittings' ? <><Stat n={SITTINGS.length} label="Sittings" /><Stat n={complete} label="Complete 100m papers" /><Stat n={PAPERS.length} label="Questions inside" /><Stat n={TBA_STATS.topicGroups} label="Topic groups" /></> : <><Stat n={TBA_STATS.verifiedPapers} label="Sourced questions" /><Stat n={TBA_STATS.sectionA50m} label="Section A · 50m" /><Stat n={TBA_STATS.sectionB25m} label="Section B · 25m" /><Stat n={TBA_STATS.topicGroups} label="Topic groups" /></>}
      </div>
    </SectionShell>
    <SectionShell tone="white" pad="lg"><div id="grid">{view === 'sittings' ? <SittingsView /> : <PastPapersView ref={viewRef} />}</div></SectionShell>
  </>;
}

function Stat({ n, label }: { n: number; label: string }) {
  return <div className="flex flex-col items-center text-center md:px-6"><span className="font-display text-5xl text-[var(--navy-900)]">{n}</span><span className="mt-2 text-[11px] uppercase tracking-wider text-muted font-bold">{label}</span></div>;
}
