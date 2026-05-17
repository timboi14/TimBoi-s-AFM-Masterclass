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

export function TrainingPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'practice', label: 'Practice' },
    { id: 'mock', label: 'Mock' },
    { id: 'debrief', label: 'Debrief' },
  ];

  return (
    <>
      <StickySubNav title="Training Ground" anchors={anchors} />

      <SectionShell tone="mist" pad="lg">
        <CenteredHero
          eyebrow={<>{TBA_STATS.practiceExams} sets · {TBA_STATS.practiceMarks} marks · 8 examiner markers</>}
          headline={<>Get reps in the <HeroGold>simulator</HeroGold>.</>}
          subline={
            <>
              Practice drills any time. Full mock when you're ready to be timed.
              Debrief after every attempt — that's where the marks come from.
            </>
          }
          actions={
            <>
              <TonePill as="link" to="/practice" variant="primary">Open practice grid</TonePill>
              <TonePill as="link" to="/mock" variant="secondary">Start a mock</TonePill>
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="white" pad="md">
        <StatStrip
          stats={[
            { value: TBA_STATS.practiceExams, label: 'Practice sets', sub: 'CBE-style multi-panel' },
            { value: TBA_STATS.practiceMarks, label: 'Marks total', sub: `${Math.round(TBA_STATS.practiceMarks / 100)} full mocks worth` },
            { value: 2, label: 'Modes', sub: 'Practice / Mock' },
            { value: 8, label: 'Examiner markers', sub: 'Per-line mark scheme' },
          ]}
        />
      </SectionShell>

      <SectionShell tone="mist" pad="lg" id="practice">
        <TwoUp
          left={{
            tone: 'white',
            eyebrow: 'Practice',
            headline: 'Pick. Sit. Open the spreadsheet.',
            subline:
              'Untimed by default. Coach AI on tap, full-mark sample answers after submission.',
            actions: <TonePill as="link" to="/practice" variant="primary">Open practice</TonePill>,
          }}
          right={{
            tone: 'navy',
            eyebrow: 'Composite mock',
            headline: 'Three hours fifteen. One trophy.',
            subline:
              'A + B + B drawn from the bank with no topic repeats. Timer auto-submits at zero, Coach locked off, report waiting at the other end.',
            actions: <TonePill as="link" to="/training/mock" variant="primary">Start composite mock</TonePill>,
          }}
        />
      </SectionShell>

      <SectionShell tone="white" pad="lg" id="debrief">
        <TwoUp
          left={{
            tone: 'mist',
            eyebrow: 'Debrief',
            headline: 'The marks are in the post-mortem.',
            subline:
              'Log what happened, what went wrong, what to fix next time. The act of writing it is the practice.',
            actions: <TonePill as="link" to="/debrief" variant="primary">Open debriefs</TonePill>,
          }}
          right={{
            tone: 'white',
            eyebrow: 'Tools',
            headline: 'Study toolkit.',
            subline: 'Memory palace, study planner, spaced-repetition queue, hot-topic radar.',
            actions: <TonePill as="link" to="/study-guide" variant="primary">Open tools</TonePill>,
          }}
        />
      </SectionShell>
    </>
  );
}
