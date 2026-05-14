import { THEORY } from '@/data/theory';
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

export function PlaybookPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'theory', label: 'Theory' },
    { id: 'cards', label: 'Cards' },
    { id: 'formulas', label: 'Formulas' },
  ];

  return (
    <>
      <StickySubNav title="Playbook" anchors={anchors} />

      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Reference · {THEORY.length} Q&A · 5 decks · 1 cheat sheet</>}
          headline={<>The <HeroGold>playbook</HeroGold>.</>}
          subline={
            <>
              Everything you reach for between drills. Theory bank for discussion marks,
              flashcards for recall, formulas for the high-pressure moments.
            </>
          }
          actions={
            <>
              <TonePill as="link" to="/theory" variant="primary">Open theory bank</TonePill>
              <TonePill as="link" to="/formulas" variant="secondary">Print formulas</TonePill>
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <StatStrip
          stats={[
            { value: THEORY.length, label: 'Theory Q&A', sub: 'Bullets + full ACCA model' },
            { value: 5, label: 'Card decks', sub: 'Biases · Z-scores · Hedging · Formulas · Pitfalls' },
            { value: 1, label: 'Cheat sheet', sub: 'Print-ready, single page' },
          ]}
        />
      </SectionShell>

      <SectionShell tone="white" pad="lg" id="theory">
        <TwoUp
          left={{
            tone: 'mist',
            eyebrow: 'Theory bank',
            headline: 'Discussion-mark goldmine.',
            subline:
              '64+ examiner-style questions. Quick Bullets for revision; Full ACCA Model Answer for technique.',
            actions: <TonePill as="link" to="/theory" variant="primary">Browse all 64+</TonePill>,
          }}
          right={{
            tone: 'white',
            eyebrow: 'Flashcards',
            headline: 'Recall under pressure.',
            subline:
              'Five decks tuned to the exam: Biases, Z-scores, Hedging, Formulas, Pitfalls. Spaced repetition built-in.',
            actions: <TonePill as="link" to="/cards" variant="primary">Open card decks</TonePill>,
          }}
        />
      </SectionShell>

      <SectionShell tone="mist" pad="lg" id="formulas">
        <TwoUp
          left={{
            tone: 'navy',
            eyebrow: 'Cheat sheet',
            headline: 'Every formula, one page.',
            subline:
              'NPV, APV, BSOP, MIRR, VaR, Greeks, IRP, MM2 — printable for the night before.',
            actions: <TonePill as="link" to="/formulas" variant="primary">Open formulas</TonePill>,
          }}
          right={{
            tone: 'white',
            eyebrow: 'Cards · spaced',
            headline: 'Memory Lab queue.',
            subline: 'Cards you got wrong yesterday come back today. Then in three days. Then a week.',
            actions: <TonePill as="link" to="/memory" variant="primary">Open Memory Lab</TonePill>,
          }}
        />
      </SectionShell>
    </>
  );
}
