import {
  CenteredHero,
  HeroGold,
  SectionShell,
  StatStrip,
  StickySubNav,
  TonePill,
  TwoUp,
  type SubNavAnchor,
} from '@/components/Blocks';
import { TBA_STATS } from '@/data/stats';

export function ScoutPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'pitfalls', label: 'Pitfalls' },
    { id: 'examiner', label: 'Examiner' },
  ];

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
              <TonePill as="link" to="/pitfalls" variant="primary">Open pitfalls library</TonePill>
              <TonePill as="link" to="/examiner" variant="secondary">Examiner reports</TonePill>
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <StatStrip
          stats={[
            { value: TBA_STATS.pitfalls, label: 'Pitfalls catalogued', sub: 'Cross-referenced to past papers' },
            { value: TBA_STATS.examinerReports, label: 'Examiner reports', sub: 'Sep/Dec 2020 onwards' },
            { value: TBA_STATS.traps, label: 'Trap categories', sub: 'TAD · NPV sign · period adj · ...' },
          ]}
          dividers
        />
      </SectionShell>

      <SectionShell tone="white" pad="lg" id="pitfalls">
        <TwoUp
          left={{
            tone: 'navy',
            eyebrow: 'Pitfalls',
            headline: 'Make the mistake here, not on exam day.',
            subline:
              'Each pitfall has a setup, the trap, the fix, and the past papers it appeared in. Risk-rated 1–5.',
            actions: <TonePill as="link" to="/pitfalls" variant="primary">Browse pitfalls</TonePill>,
          }}
          right={{
            tone: 'white',
            eyebrow: 'Examiner says',
            headline: 'What did well. What lost marks.',
            subline:
              'Every paper since 2020 — the examiner\'s actual feedback. Not a paraphrase. Source-cited.',
            actions: <TonePill as="link" to="/examiner" variant="primary">Open reports</TonePill>,
          }}
        />
      </SectionShell>
    </>
  );
}
