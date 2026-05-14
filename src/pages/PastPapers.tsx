import { useRef } from 'react';
import { PAPERS } from '@/data/pastpapers/papers';
import { PastPapersView, type PastPapersViewHandle } from '@/components/PastPapers';
import {
  CenteredHero,
  HeroGold,
  SectionShell,
  StickySubNav,
  TonePill,
  type SubNavAnchor,
} from '@/components/Blocks';

export function PastPapersPage() {
  const viewRef = useRef<PastPapersViewHandle>(null);

  const sectionA = PAPERS.filter((p) => p.paperSection === 'A').length;
  const sectionB = PAPERS.filter((p) => p.paperSection === 'B').length;

  const anchors: SubNavAnchor[] = [
    {
      id: 'grid',
      label: 'All papers',
      onActivate: () => viewRef.current?.resetFilters(),
    },
    {
      id: 'grid',
      label: 'Section A',
      onActivate: () => {
        viewRef.current?.setSectionFilter('A');
        viewRef.current?.setTopicFilter('all');
      },
    },
    {
      id: 'grid',
      label: 'Section B',
      onActivate: () => {
        viewRef.current?.setSectionFilter('B');
        viewRef.current?.setTopicFilter('all');
      },
    },
    { id: 'by-topic', label: 'By topic' },
  ];

  return (
    <>
      <StickySubNav title="Past papers" anchors={anchors} />

      {/* Hero — tone-white per §12.3 */}
      <SectionShell tone="white" pad="xl">
        <CenteredHero
          eyebrow={
            <>
              <span aria-hidden>★</span>
              {PAPERS.length} verified papers · bionic reading
            </>
          }
          headline={
            <>
              {PAPERS.length} fixtures. One <HeroGold>trophy</HeroGold>. Boot up.
            </>
          }
          subline={
            <>
              Every number traced to a source file: Q-pack (OCR-verified), ACCA Model
              Answer, or Examiner Report. Each paper opens a four-tab dive — Scenario →
              Question → Solution → Examiner says.
            </>
          }
          actions={
            <>
              <TonePill as="a" href="#grid" variant="primary">
                View all {PAPERS.length} papers
              </TonePill>
              <TonePill as="a" href="#filters" variant="secondary">
                Open filters
              </TonePill>
            </>
          }
        />
      </SectionShell>

      {/* Mist exhale strip — quick stats, alternating tone per §12.2 rule 1 */}
      <SectionShell tone="mist" pad="md">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[var(--mist-200)]">
          <Stat n={PAPERS.length} label="Verified papers" />
          <Stat n={sectionA} label="Section A · 50m" />
          <Stat n={sectionB} label="Section B · 25m" />
          <Stat n={3} label="Topic groups" />
        </div>
      </SectionShell>

      {/* Filter rail + grid — tone-white per §12.3 */}
      <SectionShell tone="white" pad="lg">
        <PastPapersView ref={viewRef} />
      </SectionShell>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center md:px-6 text-center">
      <span className="font-display text-[var(--fs-display-md)] leading-none text-[var(--navy-900)]">
        {n}
      </span>
      <span className="mt-2 text-[var(--fs-micro)] uppercase tracking-[0.08em] text-[var(--mist-500)] font-bold">
        {label}
      </span>
    </div>
  );
}
