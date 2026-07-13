import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormGuideCompact } from '@/components/FormGuideCompact';
import { AppIcon, type AppIconName } from '@/components/AppIcon';
import { PUBLIC_STATS } from '@/data/public-stats.generated';
import { HOME_MISSIONS } from '@/data/public-missions.generated';
import { EXAM_DATE, SITTING, SYLLABUS } from '@/config/sitting';
import { loadAttempts } from '@/lib/attempts';
import { store, tierFor, useStore } from '@/lib/store';
import { cn } from '@/lib/cn';

type SessionLength = 10 | 25 | 50;

type SessionStep = {
  minutes: number;
  label: string;
  title: string;
  body: string;
  to: string;
  icon: AppIconName;
};

const SESSION_PLANS: Record<SessionLength, { label: string; promise: string; steps: SessionStep[] }> = {
  10: {
    label: 'Quick reset',
    promise: 'One idea in. One idea back out. Keep the streak alive.',
    steps: [
      {
        minutes: 3,
        label: 'Recall',
        title: 'Open one memory card',
        body: 'Retrieve before you reread. The struggle is the useful bit.',
        to: '/memory',
        icon: 'brain',
      },
      {
        minutes: 5,
        label: 'Repair',
        title: 'Fix one examiner trap',
        body: 'Turn a common mark-loser into a sentence you can use.',
        to: '/pitfalls',
        icon: 'alert',
      },
      {
        minutes: 2,
        label: 'Commit',
        title: 'Say the rule out loud',
        body: 'Explain the fix without notes, then stop. Short and clean.',
        to: '/theory',
        icon: 'mic',
      },
    ],
  },
  25: {
    label: 'Daily session',
    promise: 'Learn it, use it, then lock in the mark-winning move.',
    steps: [
      {
        minutes: 6,
        label: 'Warm-up',
        title: 'Learn the model in plain English',
        body: 'Start with the commercial point, not a memorised definition.',
        to: '/champions-league',
        icon: 'lightbulb',
      },
      {
        minutes: 14,
        label: 'Main set',
        title: 'Plan a requirement to time',
        body: 'Read the verb, mine the scenario and build a mark-budgeted plan.',
        to: '/practice',
        icon: 'stopwatch',
      },
      {
        minutes: 5,
        label: 'Cool-down',
        title: 'Debrief the technique',
        body: 'Name the exact behaviour you will repeat in the next answer.',
        to: '/debrief/new',
        icon: 'clipboard',
      },
    ],
  },
  50: {
    label: 'Deep work',
    promise: 'Build real exam evidence: timed work, feedback and a repair.',
    steps: [
      {
        minutes: 5,
        label: 'Brief',
        title: 'Choose one 25-mark requirement',
        body: 'Commit to the requirement before opening supporting material.',
        to: '/past-papers',
        icon: 'files',
      },
      {
        minutes: 36,
        label: 'Perform',
        title: 'Write inside the CBE workspace',
        body: 'Plan, write and move on at 1.8 minutes per mark.',
        to: '/training/mock',
        icon: 'laptop',
      },
      {
        minutes: 9,
        label: 'Review',
        title: 'Mark the pattern, not your mood',
        body: 'Record one strength, one leak and one specific next rep.',
        to: '/form-guide',
        icon: 'chart',
      },
    ],
  },
};

const TRAINING_LOOP = [
  {
    number: '01',
    eyebrow: 'Understand',
    title: 'Get the commercial point',
    body: 'Plain-English explanations and football analogies make the model usable before the jargon arrives.',
    to: '/champions-league',
    cta: 'Learn a concept',
    icon: 'lightbulb',
  },
  {
    number: '02',
    eyebrow: 'Apply',
    title: 'Make it belong to the scenario',
    body: 'Train the issue → evidence → impact → action chain that turns knowledge into professional marks.',
    to: '/training',
    cta: 'Enter training',
    icon: 'pen',
  },
  {
    number: '03',
    eyebrow: 'Perform',
    title: 'Write with the clock running',
    body: 'Use a focused CBE-style workspace and published-paper practice instead of comfortable rereading.',
    to: '/past-papers',
    cta: 'Sit a paper',
    icon: 'stopwatch',
  },
  {
    number: '04',
    eyebrow: 'Repair',
    title: 'Turn feedback into the next rep',
    body: 'Debrief structure, update your form guide and revisit the exact skill that leaked marks.',
    to: '/debrief',
    cta: 'Run a debrief',
    icon: 'wrench',
  },
];

const PRODUCT_ROOMS = [
  {
    eyebrow: 'Ke Finesse',
    title: 'The final-mile tool stack.',
    body: 'Let the plan choose, then move through recall, answer shape, pressure and repair without hunting across the academy.',
    to: '/ke-finesse',
    cta: 'Open the Finesse room',
    icon: 'wand',
    tone: 'navy',
  },
  {
    eyebrow: 'Match centre',
    title: 'Past papers without the PDF shuffle.',
    body: `${PUBLIC_STATS.sourcedPaperItems} sourced practice items, requirement-first navigation and a workspace built for exam posture.`,
    to: '/past-papers',
    cta: 'Explore papers',
    icon: 'fileCheck',
    tone: 'green',
  },
  {
    eyebrow: 'Boot room',
    title: 'Memory that survives exam morning.',
    body: 'Spaced repetition, mnemonics and active recall turn models into cues you can retrieve under pressure.',
    to: '/boot-room',
    cta: 'Train recall',
    icon: 'brain',
    tone: 'gold',
  },
  {
    eyebrow: 'Coach + scout',
    title: 'Feedback with a job to do.',
    body: 'Ask a focused question, inspect examiner patterns and leave with a concrete change for the next answer.',
    to: '/scout',
    cta: 'Open the scout report',
    icon: 'headset',
    tone: 'blue',
  },
];

function useCountdown() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, +EXAM_DATE - +now);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
  };
}

function eyebrow(icon: AppIconName, text: string) {
  return (
    <span className="home-v3__eyebrow">
      <AppIcon name={icon} size={14} />
      {text}
    </span>
  );
}

const ENTRY_SNOOZE_KEY = 'tba_entrySnoozedThisVisit';
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });

/**
 * Being entered for the sitting is pass-factor #1 — no amount of studying
 * counts if the entry window closes. This banner owns that risk on Home until
 * the learner confirms entry (persisted), then gets out of the way for good.
 * The X snoozes it for the current visit only: an unconfirmed entry must
 * come back next visit, by design.
 */
function EntryDeadlineBanner({ entered }: { entered: boolean }) {
  const [snoozed, setSnoozed] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(ENTRY_SNOOZE_KEY) === '1',
  );

  const now = Date.now();
  const standardAt = +new Date(SITTING.entryDeadlineAt);
  const lateAt = +new Date(SITTING.lateEntryDeadlineAt);
  if (entered || snoozed || now >= lateAt) return null;

  const lateWindow = now >= standardAt;
  const daysLeft = Math.max(1, Math.ceil(((lateWindow ? lateAt : standardAt) - now) / 86_400_000));

  const snooze = () => {
    try {
      sessionStorage.setItem(ENTRY_SNOOZE_KEY, '1');
    } catch { /* ignore */ }
    setSnoozed(true);
  };

  return (
    <aside
      className={cn('home-v3__entry', lateWindow && 'home-v3__entry--late')}
      aria-label="Exam entry deadline"
    >
      <div className="home-v3__entry-copy">
        <span className="home-v3__entry-eyebrow">
          <AppIcon name="bell" size={13} /> Pass-factor #1
        </span>
        <strong>
          {lateWindow
            ? `Standard entry has closed — late entry ends in ${daysLeft}d (${shortDate(SITTING.lateEntryDeadlineAt)}, higher fee).`
            : `Entered for ${SITTING.examDayLabel}? Standard entry closes in ${daysLeft}d (${shortDate(SITTING.entryDeadlineAt)}).`}
        </strong>
        <span>Being entered beats every study plan. Confirm it, then forget it.</span>
      </div>
      <div className="home-v3__entry-actions">
        <a href="https://myacca.accaglobal.com" target="_blank" rel="noopener noreferrer">
          Open myACCA <AppIcon name="arrowUpRight" size={13} />
        </a>
        <button
          type="button"
          onClick={() => store.set({ examEntryConfirmedAt: new Date().toISOString() })}
        >
          <AppIcon name="check" size={13} /> I&apos;m entered
        </button>
      </div>
      <button
        type="button"
        className="home-v3__entry-snooze"
        onClick={snooze}
        aria-label="Hide until next visit"
        title="Hide until next visit"
      >
        <AppIcon name="x" size={14} />
      </button>
    </aside>
  );
}

export function HomePage() {
  const state = useStore();
  const countdown = useCountdown();
  const tier = tierFor(state.points);
  const [sessionLength, setSessionLength] = useState<SessionLength>(25);

  const todaysMission = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86_400_000);
    return HOME_MISSIONS[(daySeed + state.streak) % HOME_MISSIONS.length];
  }, [state.streak]);

  const completedAttempts = useMemo(
    () => loadAttempts().filter((attempt) => Boolean(attempt.finishedAt)).length,
    [state.points],
  );

  const nextTierPoints = tier.next ? Math.max(0, tier.next.min - state.points) : 0;
  const plan = SESSION_PLANS[sessionLength];

  return (
    <div className="home-v3">
      <EntryDeadlineBanner entered={Boolean(state.examEntryConfirmedAt)} />
      <section className="home-v3__hero" aria-labelledby="home-title">
        <picture aria-hidden="true" className="home-v3__hero-picture">
          <source srcSet="/spurs/home@2x.avif" type="image/avif" />
          <img
            src="/spurs/home@2x.webp"
            alt=""
            width="1040"
            height="580"
            {...({ fetchpriority: 'high' } as { fetchpriority: 'high' })}
          />
        </picture>
        <div className="home-v3__hero-wash" aria-hidden="true" />
        <div className="home-v3__hero-grid" aria-hidden="true" />

        <div className="home-v3__hero-copy">
          <div className="home-v3__live-line">
            <span><AppIcon name="circle" size={8} /> Live match plan</span>
            <span>{countdown.days}d {countdown.hours}h to {SITTING.label}</span>
            {state.examEntryConfirmedAt && (
              <span className="home-v3__entered-chip" title={`Entry confirmed for ${SITTING.examDayLabel}`}>
                Entered ✓
              </span>
            )}
          </div>
          <h1 id="home-title">
            Know what to do next.
            <span>Then do it under pressure.</span>
          </h1>
          <p>
            A focused ACCA AFM training loop: understand the model, apply it to the scenario,
            write to time and repair what cost marks.
          </p>
          <div className="home-v3__hero-actions">
            <Link to={`/topic/${todaysMission.id}`} className="home-v3__button home-v3__button--gold">
              <AppIcon name="zap" size={16} />
              Start today&apos;s mission
            </Link>
            <Link to="/past-papers" className="home-v3__button home-v3__button--glass">
              Sit a past paper <AppIcon name="arrowRight" size={16} />
            </Link>
          </div>
          <div className="home-v3__trust-row" aria-label="Product trust signals">
            <span><AppIcon name="cloud" size={14} /> Offline-first</span>
            <span><AppIcon name="shield" size={14} /> Progress stays on device</span>
            <span><AppIcon name="accessibility" size={14} /> Keyboard friendly</span>
          </div>
        </div>

        <aside className="home-v3__mission-card" aria-label="Today's recommended mission">
          <div className="home-v3__mission-topline">
            <span>Recommended today</span>
            <span>{todaysMission.matchday}</span>
          </div>
          <div className="home-v3__mission-icon" aria-hidden>
            <AppIcon name="target" size={22} />
          </div>
          <p>Section {todaysMission.syllabus} · adaptive pick</p>
          <h2>{todaysMission.title}</h2>
          <span className="home-v3__mission-hook">{todaysMission.hook}</span>
          <Link to={`/topic/${todaysMission.id}`}>
            Open the fixture <AppIcon name="arrowUpRight" size={14} />
          </Link>
        </aside>

        <div className="home-v3__hero-scoreboard" aria-label="Your current training status">
          <div>
            <span>Streak</span>
            <strong>{state.streak}<small>d</small></strong>
          </div>
          <div>
            <span>Points</span>
            <strong>{state.points}</strong>
          </div>
          <div>
            <span>Squad</span>
            <strong className="home-v3__tier">{tier.emoji} {tier.tier}</strong>
          </div>
          <div>
            <span>Timed attempts</span>
            <strong>{completedAttempts}</strong>
          </div>
        </div>
      </section>

      <section className="home-v3__section home-v3__session" aria-labelledby="session-title">
        <div className="home-v3__section-heading">
          <div>
            {eyebrow('stopwatch', 'Build today\'s session')}
            <h2 id="session-title">How much time have you got?</h2>
          </div>
          <p>Choose a window. The academy turns it into a useful loop with a clear finish line.</p>
        </div>

        <div className="home-v3__session-picker" role="group" aria-label="Choose session length">
          {([10, 25, 50] as SessionLength[]).map((minutes) => (
            <button
              key={minutes}
              type="button"
              aria-pressed={sessionLength === minutes}
              onClick={() => setSessionLength(minutes)}
              className={cn(sessionLength === minutes && 'is-active')}
            >
              <strong>{minutes}</strong>
              <span>minutes</span>
            </button>
          ))}
        </div>

        <div key={sessionLength} className="home-v3__plan home-v3__plan--enter">
            <div className="home-v3__plan-intro">
              <span>{plan.label}</span>
              <h3>Win the next {sessionLength} minutes.</h3>
              <p>{plan.promise}</p>
              <div className="home-v3__plan-time" aria-hidden>
                {plan.steps.map((step) => (
                  <span key={step.label} style={{ flexGrow: step.minutes }} />
                ))}
              </div>
            </div>
            <div className="home-v3__plan-steps">
              {plan.steps.map((step, index) => (
                <Link to={step.to} key={step.label} className="home-v3__plan-step">
                  <div className="home-v3__step-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="home-v3__step-icon" aria-hidden>
                    <AppIcon name={step.icon} size={18} />
                  </div>
                  <div>
                    <span>{step.label} · {step.minutes} min</span>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                  <AppIcon name="arrowRight" size={18} className="home-v3__step-arrow" />
                </Link>
              ))}
            </div>
        </div>
      </section>

      <section className="home-v3__section" aria-labelledby="loop-title">
        <div className="home-v3__section-heading home-v3__section-heading--center">
          <div>
            {eyebrow('repeat', 'The pass loop')}
            <h2 id="loop-title">Content is not the finish line.</h2>
          </div>
          <p>The platform keeps moving you from knowing to doing—the gap that decides AFM.</p>
        </div>
        <div className="home-v3__loop-grid">
          {TRAINING_LOOP.map((item) => (
            <Link to={item.to} key={item.number} className="home-v3__loop-card">
              <span className="home-v3__loop-number" aria-hidden="true">{item.number}</span>
              <div className="home-v3__loop-icon" aria-hidden>
                <AppIcon name={item.icon as AppIconName} size={18} />
              </div>
              <span className="home-v3__loop-eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="home-v3__text-link">{item.cta} <AppIcon name="arrowRight" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-v3__section home-v3__cockpit" aria-labelledby="cockpit-title">
        <div className="home-v3__section-heading">
          <div>
            {eyebrow('bars', 'Your cockpit')}
            <h2 id="cockpit-title">See evidence, not vibes.</h2>
          </div>
          <p>Your activity and form guide are built from work completed on this device.</p>
        </div>
        <div className="home-v3__cockpit-grid">
          <div className="home-v3__form-guide-wrap">
            <FormGuideCompact />
          </div>
          <div className="home-v3__activity-card">
            <div className="home-v3__activity-title">
              <div>
                <span>This device</span>
                <h3>Training activity</h3>
              </div>
              <span className="home-v3__privacy"><AppIcon name="lock" size={12} /> Private</span>
            </div>
            <div className="home-v3__activity-grid">
              <div><strong>{state.notesRead.length}</strong><span>lesson notes opened</span></div>
              <div><strong>{state.theoryRead.length}</strong><span>theory prompts reviewed</span></div>
              <div><strong>{state.drills}</strong><span>drills completed</span></div>
              <div><strong>{completedAttempts}</strong><span>timed attempts finished</span></div>
            </div>
            <div className="home-v3__tier-progress">
              <div>
                <span>{tier.emoji} {tier.tier}</span>
                <span>{tier.next ? `${nextTierPoints} pts to ${tier.next.tier}` : 'Top tier reached'}</span>
              </div>
              <div className="home-v3__tier-track" aria-hidden>
                <span
                  style={{
                    // Progress within the current tier band, not from zero —
                    // this card promises evidence, so the bar must not flatter.
                    width: tier.next
                      ? `${Math.min(100, Math.max(5, ((state.points - tier.min) / (tier.next.min - tier.min)) * 100))}%`
                      : '100%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-v3__section" aria-labelledby="rooms-title">
        <div className="home-v3__section-heading">
          <div>
            {eyebrow('door', 'Built for the hard parts')}
            <h2 id="rooms-title">Four rooms worth knowing.</h2>
          </div>
          <p>Every other tool stays available, but these are the shortest routes to better exam behaviour.</p>
        </div>
        <div className="home-v3__rooms-grid">
          {PRODUCT_ROOMS.map((room) => (
            <Link to={room.to} key={room.title} className={`home-v3__room home-v3__room--${room.tone}`}>
              <div className="home-v3__room-icon" aria-hidden><AppIcon name={room.icon as AppIconName} size={20} /></div>
              <span>{room.eyebrow}</span>
              <h3>{room.title}</h3>
              <p>{room.body}</p>
              <span className="home-v3__room-cta">{room.cta} <AppIcon name="arrowUpRight" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-v3__proof" aria-labelledby="proof-title">
        <div>
          {eyebrow('shield', 'Built on exam evidence')}
          <h2 id="proof-title">A serious study tool wearing a football shirt.</h2>
          <p>
            Practice is mapped to the {SYLLABUS.label} {SYLLABUS.structure} syllabus structure.
            Dates and requirements remain clearly labelled so you can distinguish verified exam data from coaching guidance.
          </p>
          <div className="home-v3__proof-actions">
            <Link to="/course" className="home-v3__button home-v3__button--gold">View the course map</Link>
            <Link to="/examiner" className="home-v3__button home-v3__button--glass">Read examiner patterns</Link>
          </div>
        </div>
        <dl>
          <div><dt>{PUBLIC_STATS.sourcedPaperItems}</dt><dd>sourced paper items</dd></div>
          <div><dt>{PUBLIC_STATS.topicGroups}</dt><dd>syllabus topic groups</dd></div>
          <div><dt>{PUBLIC_STATS.theoryPrompts}</dt><dd>theory prompts</dd></div>
          <div><dt>{PUBLIC_STATS.examinerCases}</dt><dd>examiner cases</dd></div>
        </dl>
      </section>
    </div>
  );
}
