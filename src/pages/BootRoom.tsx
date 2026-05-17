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

export function BootRoomPage() {
  const anchors: SubNavAnchor[] = [
    { id: 'memory', label: 'Memory Lab' },
    { id: 'skills', label: 'Skills' },
    { id: 'tools', label: 'Study tools' },
  ];

  return (
    <>
      <StickySubNav title="Boot room" anchors={anchors} />

      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Where the work gets done</>}
          headline={<>Boot up your <HeroGold>memory</HeroGold>.</>}
          subline={
            <>
              Spaced repetition for the cards you keep getting wrong. Examiner skills for
              the marks no formula will give you — communication, scepticism, commercial acumen.
            </>
          }
          actions={
            <>
              <TonePill as="link" to="/memory" variant="primary">Open Memory Lab</TonePill>
              <TonePill as="link" to="/exam-skills" variant="secondary">Skills playbook</TonePill>
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <StatStrip
          stats={[
            { value: 'Leitner', label: 'Recall system', sub: 'Wrong today → tomorrow → 3 days → week' },
            { value: 4, label: 'Skills tracked', sub: 'Comm · Analysis · Scepticism · Commercial' },
            { value: '20%', label: 'Of total marks', sub: 'Professional skills allocation' },
          ]}
        />
      </SectionShell>

      <SectionShell tone="white" pad="lg" id="memory">
        <TwoUp
          left={{
            tone: 'mist',
            eyebrow: 'Memory Lab',
            headline: 'Cards that learn how you forget.',
            subline:
              'Schedule what you saw today against when you\'re likely to forget. Wrong cards come back fast.',
            actions: <TonePill as="link" to="/memory" variant="primary">Start a session</TonePill>,
          }}
          right={{
            tone: 'navy',
            eyebrow: 'Skills',
            headline: 'Twenty marks for HOW you write.',
            subline:
              'Communication, analysis, scepticism, commercial acumen. Drilled with examiner-style prompts.',
            actions: <TonePill as="link" to="/exam-skills" variant="primary">Open skills</TonePill>,
          }}
        />
      </SectionShell>

      <SectionShell tone="mist" pad="lg" id="tools">
        <TwoUp
          left={{
            tone: 'white',
            eyebrow: 'Study tools',
            headline: 'Mark budget · timer · answer plans · verb translator.',
            subline:
              'The four tools you reach for mid-revision. Apportion marks across a paper, time your drills, plan before you write, translate the requirement verb. Everything saves to your device.',
            actions: <TonePill as="link" to="/study-guide" variant="primary">Open study tools</TonePill>,
          }}
          right={{
            tone: 'mist',
            eyebrow: 'Memory Lab Pro',
            headline: 'Leitner queue, palace, Feynman pad.',
            subline:
              'The full retrieval workshop — 5-stage spaced repetition, a 10-room memory palace, and a Feynman pad that forces a 4-sentence plain-English explanation.',
            actions: <TonePill as="link" to="/memory-lab" variant="primary">Open Memory Lab</TonePill>,
          }}
        />
      </SectionShell>
    </>
  );
}
