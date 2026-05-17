import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';
import { TBA_STATS } from '@/data/stats';

/**
 * /start — Executive Summary Onboarding Tab.
 *
 * Work Item 15 of the Platinum-tier upgrade. A single-scroll, 60-second
 * orientation for first-time users. Marking `tba.onboarding.completed=1`
 * on page-load hides the homepage "60-second tour" banner from then on.
 */

const COMPLETED_KEY = 'tba.onboarding.completed';

interface Tile {
  want: string;
  to: string;
  destination: string;
  what: string;
}

const TILES: Tile[] = [
  {
    want: 'Sit a past paper under exam conditions',
    to: '/past-papers',
    destination: 'Past Papers → Practice (CBE)',
    what: `${TBA_STATS.verifiedPapers} OCR-verified papers, CBE shell, AI marker grades you against the Kaplan marking guide and ACCA examiner notes.`,
  },
  {
    want: 'Ask the coach a question by voice',
    to: '/#coach',
    destination: 'Coach AI (green headset, bottom-right)',
    what: 'Hands-free voice + text coach; ask for a "model answer" on any past paper and get a top-scorer response with a marking key.',
  },
  {
    want: 'Learn the technique behind a topic',
    to: '/topic/adviser',
    destination: 'Topics',
    what: `${TBA_STATS.topicGroups} group-stage modules — Senior Adviser through Behavioural+ESG — with Notes / Formulas / Worked / Drills / Pitfalls.`,
  },
  {
    want: 'Drill discussion marks for theory',
    to: '/playbook',
    destination: 'Playbook → Theory Bank',
    what: `${TBA_STATS.theoryQA} examiner-style Q&As, dual-mode (bullets for revision, full ACCA model for technique).`,
  },
  {
    want: 'See where I am right now',
    to: '/form-guide',
    destination: 'Form Guide',
    what: 'Predicted mark band ±6 marks, your three weakest areas and a single recommended next action.',
  },
  {
    want: 'Prep the 24 hours before exam day',
    to: '/war-room',
    destination: 'War Room',
    what: `21-item T-1 / T-0 / opening / closing checklist, command-word translator, ${TBA_STATS.spreadsheetShortcuts} spreadsheet shortcuts, and the ${TBA_STATS.traps} mistakes that cost the pass.`,
  },
];

const FIRST_DRILL_HREF = '/past-papers';

export function StartPage() {
  useEffect(() => {
    try { localStorage.setItem(COMPLETED_KEY, '1'); } catch { /* ignore */ }
  }, []);

  return (
    <>
      {/* A — hero / one-line promise */}
      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<><span aria-hidden>●</span> START HERE · 60-SECOND TOUR</>}
          headline={
            <>
              TIMBOI&apos;S ACADEMY<br />
              <HeroGold>THE ACCA AFM PASS ENGINE.</HeroGold>
            </>
          }
          subline={
            <>
              One platform. {TBA_STATS.verifiedPapers} verified past papers. {TBA_STATS.topicGroups} topic modules.
              An on-device coach that writes model answers. A war-room checklist for the night before.
              <br />
              <strong>Designed to put you in the top quartile of your sitting.</strong>
            </>
          }
          actions={
            <>
              <Link to={FIRST_DRILL_HREF} className="px-4 py-2 rounded-2xl bg-primary text-white font-bold text-[13px]">
                Sit your first drill (10 min) →
              </Link>
              <Link to="/" className="px-4 py-2 rounded-2xl border border-border bg-white font-bold text-[13px] text-ink">
                Skip to the dashboard →
              </Link>
            </>
          }
        />
      </SectionShell>

      {/* B — what you can do here (the map) */}
      <SectionShell tone="mist" pad="lg">
        <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-4">What you can do here</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TILES.map((t) => (
            <Link
              key={t.want}
              to={t.to}
              className="block rounded-2xl border border-border bg-white p-4 hover:border-primary transition-colors"
            >
              <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-1">
                I want to…
              </div>
              <div className="font-bold text-ink mb-1.5 leading-tight">{t.want}</div>
              <div className="text-[12.5px] text-muted leading-snug">{t.destination}</div>
              <div className="text-[12.5px] text-ink/80 mt-2 leading-snug">{t.what}</div>
              <div className="mt-3 text-[11.5px] text-primary font-bold">Open →</div>
            </Link>
          ))}
        </div>
      </SectionShell>

      {/* C — recommended first 60 minutes */}
      <SectionShell tone="white" pad="lg">
        <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-4">Your first 60 minutes</h2>
        <ol className="space-y-3 max-w-2xl">
          <Step n={1} title="Sit one 10-mark drill cold (10 min)" link={{ to: '/past-papers', label: 'Open the past-papers grid' }}>
            Pick any Section B 25-mark paper. Submit one part to the AI marker without notes. You need a baseline before the Form Guide can forecast.
          </Step>
          <Step n={2} title="Read your debrief and the marking key (10 min)" link={{ to: '/debrief', label: 'Open Debrief' }}>
            The AI marker grades against the verbatim Kaplan marking guide and the ACCA examiner notes. Note the three biggest gaps.
          </Step>
          <Step n={3} title="Drill the topic you scored lowest on (20 min)" link={{ to: '/topic/adviser', label: 'Open Topics' }}>
            Each module has Notes → Formulas → Worked → Drills. Run two drills, then look at the Pitfalls tab for that topic.
          </Step>
          <Step n={4} title="Ask Coach for the model answer (10 min)" link={{ to: '/#coach', label: 'Summon Coach' }}>
            On any past paper requirement, type <em>"model answer for Para Fuels part (a)"</em> — Coach writes the top-scorer response with the marking key at the bottom.
          </Step>
          <Step n={5} title="Set your goal in the dashboard (5 min)" link={{ to: '/', label: 'Open the dashboard' }}>
            The Form Guide compact card sits under the hero. Aim for a Comfortable band by sitting two more papers this week.
          </Step>
        </ol>
      </SectionShell>

      {/* D — gotchas to know up front */}
      <SectionShell tone="mist" pad="lg">
        <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-3">Three things to know up front</h2>
        <ul className="space-y-2 text-[14px] text-ink max-w-2xl">
          <li>
            <strong className="text-primary">Coach won&apos;t mark for you.</strong> Coach writes the benchmark model answer.
            For grading your own attempt, use Debrief (8 examiner markers) or the AI marker on the practice page.
          </li>
          <li>
            <strong className="text-primary">Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">?</kbd> anywhere</strong>{' '}
            to see all keyboard shortcuts. <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">g p</kbd> jumps to past papers, <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">g t</kbd> to topics, etc.
          </li>
          <li>
            <strong className="text-primary">Mocks lock Coach off.</strong> Starting a composite mock greys out the green
            headset for the full 3h 15m. It unlocks on submission so you can debrief.
          </li>
        </ul>
      </SectionShell>

      {/* E — CTA footer */}
      <SectionShell tone="white" pad="lg">
        <div className="rounded-3xl border-2 border-primary bg-primary/[0.04] p-6 text-center">
          <h2 className="font-display text-2xl tracking-wide uppercase text-ink mb-2">Tour done. Time to sit a paper.</h2>
          <p className="text-[14px] text-muted mb-4">Ten minutes of effort now will calibrate the entire dashboard around your real level.</p>
          <Link to={FIRST_DRILL_HREF} className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-display tracking-wide uppercase text-[14px] hover:brightness-110">
            Sit your first drill →
          </Link>
        </div>
      </SectionShell>
    </>
  );
}

interface StepProps { n: number; title: string; link: { to: string; label: string }; children: React.ReactNode }
function Step({ n, title, link, children }: StepProps) {
  return (
    <li className="rounded-2xl border border-border bg-white p-4 flex gap-3">
      <div className="w-9 h-9 shrink-0 grid place-items-center rounded-full bg-primary text-white font-display text-sm">{n}</div>
      <div className="flex-1">
        <div className="font-bold text-ink mb-0.5">{title}</div>
        <div className="text-[13.5px] text-ink/85 leading-relaxed">{children}</div>
        <Link to={link.to} className="inline-block mt-2 text-[12px] text-primary font-bold hover:underline">
          {link.label} →
        </Link>
      </div>
    </li>
  );
}
