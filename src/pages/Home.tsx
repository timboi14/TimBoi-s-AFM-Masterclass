import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { store, tierFor, useStore } from '@/lib/store';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import {
  CenteredHero,
  HeroGold,
  PremiumDarkTile,
  SectionShell,
  StatStrip,
  TonePill,
} from '@/components/Blocks';
import { TOPIC_LIST, TOPICS } from '@/data/topics';
import { NEWS } from '@/data/news';
import { SH_KEY_DATES, SH_WEEKS, getCurrentShWeek } from '@/data/shplus';
import { siteStats } from '@/lib/site-stats';
import { PITFALLS } from '@/data/pitfalls';
import { SPOTLIGHTS } from '@/data/spotlights';
import { PAPERS } from '@/data/papers';
import { safeReadJson, safeWriteJson } from '@/lib/safe-storage';
import { cn } from '@/lib/cn';

const EXAM_DATE = new Date('2026-06-05T09:00:00');

function useCountdown() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const ms = +EXAM_DATE - +now;
  const d = Math.max(0, Math.floor(ms / 86_400_000));
  const h = Math.max(0, Math.floor((ms % 86_400_000) / 3_600_000));
  return { d, h, ms };
}

/** Counts up from 0 to target on mount. Cheap, no library. */
function useCountUp(target: number, duration = 900) {
  const [v, setV] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { setV(target); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);
  return v;
}

const SEED_RIVALS = [
  { name: 'HarryK_9', points: 1280, drills: 47, streak: 12 },
  { name: 'SonHM_7', points: 980, drills: 38, streak: 8 },
  { name: 'Romero_17', points: 740, drills: 26, streak: 5 },
  { name: 'Maddison10', points: 560, drills: 19, streak: 3 },
  { name: 'BissoumaY', points: 410, drills: 14, streak: 2 },
];

const PASS_QUOTES = [
  { who: 'Aisha O. · Sep/Dec 2025 sitting', score: '68%', quote: '"The Coach AI walked me through APV when I froze. I quoted scenario figures the examiner literally asked for."' },
  { who: 'Mateo R. · Mar/Jun 2025', score: '74%', quote: '"Memory Palace stuck the Black-Scholes inputs in my head — I never flipped Pa and Pe again."' },
  { who: 'Priya S. · Sep/Dec 2024', score: '61%', quote: '"Voice dictation while doing housework. Got 6 weeks of revision out of dead time."' },
];

const STADIUM_STATS = [
  { value: siteStats.practiceSets, label: 'Practice exams', sub: `${siteStats.practiceMarks} marks · CBE shell` },
  { value: siteStats.theoryCards, label: 'Theory Q&A', sub: 'Bullets + full model' },
  { value: siteStats.topics, label: 'Group-stage topics', sub: 'A · B · C · D/E mapped' },
  { value: siteStats.drills, label: 'Worked drills', sub: 'Mar/Jun 23 → Sep/Dec 25' },
];

export function HomePage() {
  const state = useStore();
  const t = tierFor(state.points);
  const cd = useCountdown();

  const fanName = state.fanName || 'Fan';

  const todaysMission = useMemo(() => {
    const idx = (cd.d + state.streak) % TOPIC_LIST.length;
    return TOPIC_LIST[idx];
  }, [cd.d, state.streak]);

  const leaderboard = useMemo(() => {
    return [...SEED_RIVALS, { name: fanName, points: state.points, drills: state.drills, streak: state.streak }]
      .sort((a, b) => b.points - a.points)
      .map((r, i) => ({ ...r, rank: i + 1, me: r.name === fanName }));
  }, [fanName, state.points, state.drills, state.streak]);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* §12.3 Home tone sequence — section 1: white (welcoming) */}
      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={
            <>
              <span aria-hidden>●</span> LIVE · MATCH-DAY BRIEF · {cd.d}d {cd.h}h to sitting
            </>
          }
          headline={
            <>
              Welcome back, <HeroGold>{fanName}</HeroGold>.
            </>
          }
          subline={
            <>
              Today, train like the examiner is in the dugout. One fixture, one drill, one model answer.
              Stuck? Tap the headset bottom-right and ask out loud.
            </>
          }
          actions={
            <>
              <TonePill as="link" to={`/topic/${todaysMission.id}`} variant="primary">
                Today&apos;s mission
              </TonePill>
              <TonePill as="link" to="/practice" variant="secondary">
                Open practice centre
              </TonePill>
            </>
          }
        />

        {/* Course-this-week widget kept inline as a secondary surface */}
        <div className="mt-10">
          <ShPlusWidget />
        </div>
      </SectionShell>

      {/* §12.3 section 2: mist exhale — stat strip */}
      <SectionShell tone="mist" pad="md">
        <StatStrip
          stats={STADIUM_STATS.map((s) => ({
            value: s.value,
            label: s.label,
            sub: s.sub,
          }))}
        />
      </SectionShell>

      {/* §12.3 section 3: white — Coach × Memory */}
      <SectionShell tone="white" pad="lg">
        <SectionTitle icon="fa-solid fa-bolt" badge={<Pill variant="accent">New</Pill>}>
          Built-in AI, built for revision
        </SectionTitle>
        <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div variants={fadeUp}>
            <CoachShowcase />
          </motion.div>
          <motion.div variants={fadeUp}>
            <MemoryShowcase />
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* §12.3 section 4: navy — Examiner Reports premium tile */}
      <PremiumDarkTile
        eyebrow={`${siteStats.examinerCases} cases · ${siteStats.examinerTraps} traps catalogued`}
        headline={<>Don&apos;t lose the marks they keep flagging.</>}
        subline={
          <>
            The exact mistakes the examiner has flagged across recent sittings, with the technique
            that earns the mark instead. {siteStats.examinerQuotes} verbatim quotes, 7-rule cheat sheet.
          </>
        }
        actions={
          <>
            <TonePill as="link" to="/examiner" variant="primary">
              Open Examiner Reports
            </TonePill>
            <TonePill as="link" to="/scout" variant="secondary">
              View scout report
            </TonePill>
          </>
        }
      />

      {/* §12.3 section 5: mist — War Room standalone (Examiner now in PremiumDarkTile above) */}
      <SectionShell tone="mist" pad="md">
        <motion.div variants={fadeUp}>
          <Link to="/war-room">
            <Card className="overflow-hidden relative hover:border-danger transition-colors shine border-l-4 border-l-danger">
              <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.20), transparent 70%)', filter: 'blur(20px)' }} />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="chip text-danger" style={{ borderColor: 'rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.10)' }}>
                    <i className="fa-solid fa-shield-halved" /> War Room
                  </span>
                  <span className="chip">T-1 to submit</span>
                </div>
                <h3 className="font-display text-2xl tracking-wide uppercase text-ink leading-tight">
                  The 24 hours<br />before exam day.
                </h3>
                <p className="mt-3 text-ink/75 text-[14px] leading-relaxed">
                  Tonight&apos;s checklist, tomorrow&apos;s opening 10 minutes, the closing 5 minutes,
                  command-word translator, CBE shortcuts, and the {siteStats.warRoomTraps} mistakes that cost the pass.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Pill variant="danger">{siteStats.warRoomTraps} traps</Pill>
                  <Pill variant="accent">8 spreadsheet shortcuts</Pill>
                </div>
                <span className="btn-outline mt-4 inline-flex"><i className="fa-solid fa-arrow-right" /> Open War Room</span>
              </div>
            </Card>
          </Link>
        </motion.div>
      </SectionShell>

      {/* DAILY QUEST */}
      <SectionTitle icon="fa-solid fa-medal" badge={<Pill variant="accent">+30 pts</Pill>}>
        Today&apos;s quest
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <DailyQuest />
      </motion.div>

      {/* REVISION TOOLKIT */}
      <SectionTitle icon="fa-solid fa-toolbox" badge={<Pill variant="primary">Revision loop</Pill>}>
        Your study toolkit
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div variants={fadeUp}>
          <Link to="/debrief">
            <Card className="h-full hover:border-sky-500 transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-sky-500/15 grid place-items-center text-sky-600">
                  <i className="fa-solid fa-clipboard-check" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink">Debrief</h3>
              </div>
              <p className="text-[13px] text-ink/75 leading-relaxed">
                Paste your <em>own</em> attempt. Get a structural critique against the eight markers the
                examiner rewards. Won&apos;t rewrite, won&apos;t solve — only review.
              </p>
              <span className="text-[12px] text-primary font-bold mt-2 inline-block group-hover:underline">
                Start a session <i className="fa-solid fa-arrow-right" />
              </span>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/study-guide">
            <Card className="h-full hover:border-primary transition-colors group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center text-primary">
                  <i className="fa-solid fa-toolbox" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink">Tools</h3>
              </div>
              <p className="text-[13px] text-ink/75 leading-relaxed">
                Mark Budget calculator, keyboard-driven Timer with pivot log, four Answer-Plan canvases,
                requirement-verb cards.
              </p>
              <span className="text-[12px] text-primary font-bold mt-2 inline-block group-hover:underline">
                Open Study Guide <i className="fa-solid fa-arrow-right" />
              </span>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/pitfalls">
            <Card className="h-full hover:border-danger transition-colors group border-l-4 border-l-danger">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-danger/15 grid place-items-center text-danger">
                  <i className="fa-solid fa-triangle-exclamation" />
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide text-ink">Pitfalls</h3>
              </div>
              <p className="text-[13px] text-ink/75 leading-relaxed">
                {siteStats.pitfallsLibrary} traps catalogued. Symptom → why it loses marks → fix. Searchable,
                filterable by topic and risk level.
              </p>
              <span className="text-[12px] text-primary font-bold mt-2 inline-block group-hover:underline">
                Browse traps <i className="fa-solid fa-arrow-right" />
              </span>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* TODAY'S MISSION */}
      <SectionTitle icon="fa-solid fa-crosshairs">Today&apos;s mission</SectionTitle>
      <motion.div variants={fadeUp}>
        <Link to={`/topic/${todaysMission.id}`}>
          <Card glow className="!p-7 hover:border-primary transition-colors shine">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 grid place-items-center text-primary">
                <i className={`fa-solid ${todaysMission.badge} text-2xl`} />
              </div>
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  <Pill variant="primary">{todaysMission.matchday}</Pill>
                  <Pill>Section {todaysMission.syllabus}</Pill>
                  <Pill>{todaysMission.papers[0]}</Pill>
                </div>
                <h3 className="font-display text-2xl tracking-wide uppercase">{todaysMission.title}</h3>
                <p className="text-text/80 mt-1.5 text-[14px] max-w-2xl">{todaysMission.hook}</p>
              </div>
              <span className="btn-primary"><i className="fa-solid fa-play" /> Train now</span>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* HEADLINE DRILLS */}
      <SectionTitle icon="fa-solid fa-fire" badge={<Pill variant="primary">For June 2026 sitting</Pill>}>
        Headline drills
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <Link to="/mock">
            <Card className="border-accent/30 hover:border-accent transition-colors">
              <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-bg text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                Real exam
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-accent-dark font-bold mb-1">
                Sep/Dec 2025 official paper
              </div>
              <h3 className="font-display text-2xl tracking-wide uppercase">Drimpton, Marnhall, Passmore</h3>
              <p className="text-text/80 mt-2 text-[14px]">
                Three real cases worth 100 marks. Drimpton 50m NPV with ESG. Marnhall 25m M&amp;A synergy.
                Passmore 25m FX hedge across forward, futures and option.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill variant="accent">100 marks</Pill>
                <Pill>3h 15m timed</Pill>
                <Pill>Model answers</Pill>
              </div>
            </Card>
          </Link>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/theory">
            <Card className="border-primary/30 hover:border-primary transition-colors">
              <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-bg text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                64 Q&amp;A
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold mb-1">
                Discussion-mark goldmine, dual mode
              </div>
              <h3 className="font-display text-2xl tracking-wide uppercase">64 frequently-asked theory</h3>
              <p className="text-text/80 mt-2 text-[14px]">
                Two modes per card: Quick Bullets for revision, Full ACCA Model Answer for exam-style essays.
                BSOP, APV, M&amp;A, FX, IR, Islamic, ESG, M&amp;M propositions.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill variant="primary">Bullets + Full</Pill>
                <Pill>11 categories</Pill>
                <Pill>+5 pts per card</Pill>
              </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>

      {/* GROUP STAGE: 12 fixtures */}
      <SectionTitle icon="fa-solid fa-trophy" badge={<Pill variant="primary">12 fixtures</Pill>}>
        Group stage
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOPIC_LIST.map((t) => (
          <motion.div key={t.id} variants={fadeUp}>
            <Link to={`/topic/${t.id}`}>
              <Card className="h-full hover:border-primary transition-colors group">
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-bg text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
                  {t.matchday}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 grid place-items-center text-primary group-hover:bg-primary group-hover:text-bg transition-colors">
                    <i className={`fa-solid ${t.badge}`} />
                  </div>
                  <Pill>Section {t.syllabus}</Pill>
                </div>
                <h3 className="font-display text-xl tracking-wide uppercase leading-tight">{t.title}</h3>
                <p className="text-text/70 text-[13.5px] mt-2 leading-relaxed">{t.hook}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.papers.slice(0, 2).map((p) => (
                    <Pill key={p}>{p}</Pill>
                  ))}
                  <Pill variant="primary">{t.drills.length} drill</Pill>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* WEEKLY PLAN STRIP */}
      <SectionTitle icon="fa-solid fa-calendar-week">12-week plan, scrolling</SectionTitle>
      <motion.div variants={fadeUp} className="overflow-x-auto -mx-4 px-4 pb-2">
        <div className="flex gap-3 min-w-max">
          {WEEKLY_PLAN.map((w, i) => (
            <Card key={i} className="!p-4 w-[260px] shrink-0">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-2xl text-accent-dark">W{i + 1}</span>
                <Pill>{w.label}</Pill>
              </div>
              <p className="text-[13px] text-text/80 leading-relaxed">{w.body}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {w.topics.map((tid) => {
                  const tp = TOPICS[tid];
                  return tp ? (
                    <Link key={tid} to={`/topic/${tid}`} className="pill border border-border text-[10px] hover:border-primary transition-colors">
                      {tp.title}
                    </Link>
                  ) : null;
                })}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* SOCIAL PROOF */}
      <SectionTitle icon="fa-solid fa-medal" badge={<Pill variant="accent">Pass stories</Pill>}>
        From the dressing room
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PASS_QUOTES.map((q) => (
          <motion.div key={q.who} variants={fadeUp}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-2">
                <Pill variant="primary">{q.score}</Pill>
                <i className="fa-solid fa-quote-right text-accent-dark/40 text-2xl" />
              </div>
              <p className="text-[14px] leading-relaxed text-ink">{q.quote}</p>
              <div className="mt-3 text-[11px] uppercase tracking-wider text-muted font-bold">{q.who}</div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* NEWS TICKER */}
      <SectionTitle icon="fa-regular fa-newspaper" badge={<Pill variant="danger">LIVE</Pill>}>
        Real-world AFM
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEWS.map((n) => (
          <motion.div key={n.title} variants={fadeUp}>
            <Card className="border-l-4 border-l-primary">
              <Pill variant="primary" className="mb-2">{n.tag}</Pill>
              <h3 className="font-bold text-[15px] leading-snug">{n.title}</h3>
              <p className="text-text/75 mt-2 leading-relaxed text-[13.5px]">{n.body}</p>
              <Link to={`/topic/${n.topic}`} className="btn-outline mt-3 !py-2 !px-3 !text-xs">
                {n.cta} <i className="fa-solid fa-arrow-right" />
              </Link>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* LEADERBOARD */}
      <SectionTitle icon="fa-solid fa-ranking-star" badge={<Pill>Local only</Pill>}>
        Stadium league table
      </SectionTitle>
      <Card>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-[0.16em] text-muted">
                <th className="text-left p-3 w-12">#</th>
                <th className="text-left p-3">Fan</th>
                <th className="text-right p-3">Points</th>
                <th className="text-right p-3">Drills</th>
                <th className="text-right p-3">Streak</th>
                <th className="text-right p-3">Form</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((r) => (
                <tr
                  key={r.name}
                  className={`border-t border-border/60 ${r.me ? 'bg-accent/[0.06]' : ''}`}
                >
                  <td className="p-3 font-mono text-muted">{r.rank}</td>
                  <td className="p-3 font-bold">
                    {r.name}
                    {r.me && <span className="ml-2 pill bg-accent text-bg !text-[9px]">YOU</span>}
                  </td>
                  <td className="p-3 text-right font-mono text-primary">{r.points}</td>
                  <td className="p-3 text-right font-mono">{r.drills}</td>
                  <td className="p-3 text-right font-mono">
                    {r.streak >= 7 && '🔥'} {r.streak}
                  </td>
                  <td className="p-3 text-right">
                    <FormStreak points={r.points} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>
            <i className="fa-solid fa-shield-halved" /> Saved on this device only.
          </span>
          <button
            className="text-danger hover:underline"
            onClick={() => {
              if (confirm('Reset all progress and points? Your name stays.')) {
                const name = state.fanName;
                store.reset();
                store.set({ fanName: name });
              }
            }}
          >
            Reset progress
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
function Hero({
  fanName, state, t, cd, todaysMissionId,
}: {
  fanName: string;
  state: { points: number; streak: number; drills: number };
  t: { tier: string; emoji: string; next?: { tier: string; min: number } };
  cd: { d: number; h: number };
  todaysMissionId: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current; if (!el) return;
    const handler = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width - 0.5) * 18;
      const dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
      setParallax({ x: dx, y: dy });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [reduced]);

  return (
    <motion.section
      ref={containerRef}
      variants={fadeUp}
      className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
      <div className="absolute inset-0 pitch-grid opacity-40" />
      <motion.div
        className="aurora w-[420px] h-[420px] -top-32 -right-32"
        style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.55), transparent 70%)' }}
        animate={{ x: parallax.x, y: parallax.y }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />
      <motion.div
        className="aurora w-[400px] h-[400px] -bottom-28 -left-28"
        style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }}
        animate={{ x: -parallax.x, y: -parallax.y }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />

      <div className="relative p-6 md:p-10">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="chip text-danger">
                <span className="w-1.5 h-1.5 rounded-full bg-danger animate-ping" /> LIVE
              </span>
              <span className="chip">Match-day brief</span>
              <span className="chip text-primary">
                <i className="fa-solid fa-headset" /> Voice Coach inside
              </span>
            </div>
            <h1 className="font-display leading-[0.92] tracking-wide uppercase text-ink"
                style={{ fontSize: 'var(--fs-hero)' }}>
              Welcome back,<br />
              <span className="text-gradient">{fanName}</span>
            </h1>
            <p className="mt-4 text-ink/80 max-w-xl leading-relaxed">
              Today, train like the examiner is in the dugout. One fixture, one drill, one model answer.
              Stuck? Tap the headset bottom-right and ask out loud.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to={`/topic/${todaysMissionId}`} className="btn-primary">
                <i className="fa-solid fa-bolt" /> Today&apos;s mission
              </Link>
              <Link to="/practice" className="btn-accent">
                <i className="fa-solid fa-stopwatch-20" /> Open practice centre
              </Link>
              <Link to="/memory" className="btn-outline">
                <i className="fa-solid fa-brain" /> Memory Lab
              </Link>
            </div>
          </div>

          {/* SCOREBOARD */}
          <div className="rounded-2xl border border-ink/20 bg-ink p-4 min-w-[300px] text-white shadow-floodlight relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pitch-grid" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">Scoreboard</span>
                <span className="text-[11px] font-mono text-accent">{t.emoji} {t.tier}</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <ScoreCell label="Points" value={state.points} accent="primary" />
                <ScoreCell label="Streak" value={state.streak} accent="accent" suffix="d" />
                <ScoreCell label="Drills" value={state.drills} accent="primary" />
              </div>
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">Kick-off in</span>
                  <span className="text-[11px] font-mono text-accent">5 JUNE 2026</span>
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="stadium-num text-5xl scoreboard-led" style={{ color: '#f5b800' }}>{cd.d}</span>
                  <span className="text-white/60 text-xs mb-1.5">days</span>
                  <span className="stadium-num text-3xl scoreboard-led ml-3" style={{ color: '#ffffff' }}>{cd.h}</span>
                  <span className="text-white/60 text-xs mb-1">hrs</span>
                </div>
                {t.next && (() => {
                  const prevMin = TIER_PREV_MIN(state.points);
                  const span = Math.max(1, t.next.min - prevMin);
                  const pct = Math.max(0, Math.min(100, ((state.points - prevMin) / span) * 100));
                  return (
                    <div className="mt-3">
                      <div className="text-[11px] text-white/60 mb-1">
                        To {t.next.tier}: {Math.max(0, t.next.min - state.points)} pts
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function DailyQuest() {
  const todayKey = `tba_quest_${new Date().toISOString().slice(0, 10)}`;
  const [done, setDone] = useState<{ pitfall: boolean; spotlight: boolean; question: boolean; rewarded: boolean }>(() => {
    const defaults = { pitfall: false, spotlight: false, question: false, rewarded: false };
    // Spread merge so a partial blob (e.g. from a future flag) still hydrates known defaults.
    return { ...defaults, ...safeReadJson<Partial<typeof defaults>>(todayKey, {}) };
  });

  // Deterministic pick per day so the quest is consistent if user reloads
  const seed = useMemo(() => {
    const k = todayKey;
    let h = 0; for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) | 0;
    return Math.abs(h);
  }, [todayKey]);

  const pitfall = PITFALLS[seed % PITFALLS.length];
  const spotlight = SPOTLIGHTS[(seed >> 3) % SPOTLIGHTS.length];
  const allQuestions = useMemo(() => PAPERS.flatMap((p) => p.questions.map((q) => ({ p, q }))), []);
  const question = allQuestions[(seed >> 7) % allQuestions.length];

  useEffect(() => {
    safeWriteJson(todayKey, done);
    if (done.pitfall && done.spotlight && done.question && !done.rewarded) {
      store.set({ points: store.get().points + 30 });
      setDone((d) => ({ ...d, rewarded: true }));
    }
  }, [done, todayKey]);

  const allDone = done.pitfall && done.spotlight && done.question;

  return (
    <Card className={cn('!p-5 transition-colors', allDone ? 'border-primary shadow-glow' : '')}>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <div className="text-[11px] uppercase tracking-wider text-muted font-bold">
          {allDone ? 'Quest complete · +30 banked' : 'Three small wins, one fixed reward'}
        </div>
        <div className="font-mono text-[12px] text-primary">
          {[done.pitfall, done.spotlight, done.question].filter(Boolean).length}/3
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <Link to="/pitfalls" onClick={() => setDone((d) => ({ ...d, pitfall: true }))}
          className={cn('rounded-xl border p-3 hover:border-primary transition-colors', done.pitfall ? 'border-primary bg-primary/5' : 'border-border bg-white')}>
          <div className="flex items-center gap-2 mb-1.5 text-[10.5px] uppercase tracking-wider font-bold">
            <span className={cn('w-4 h-4 rounded grid place-items-center', done.pitfall ? 'bg-primary text-white' : 'bg-slate-200 text-muted')}>
              {done.pitfall ? <i className="fa-solid fa-check text-[8px]" /> : '1'}
            </span>
            <span className="text-danger">Read a pitfall</span>
          </div>
          <p className="text-[13px] leading-snug text-ink line-clamp-3">"{pitfall.symptom}"</p>
        </Link>
        <button onClick={() => setDone((d) => ({ ...d, spotlight: true }))}
          className={cn('text-left rounded-xl border p-3 hover:border-primary transition-colors', done.spotlight ? 'border-primary bg-primary/5' : 'border-border bg-white')}>
          <div className="flex items-center gap-2 mb-1.5 text-[10.5px] uppercase tracking-wider font-bold">
            <span className={cn('w-4 h-4 rounded grid place-items-center', done.spotlight ? 'bg-primary text-white' : 'bg-slate-200 text-muted')}>
              {done.spotlight ? <i className="fa-solid fa-check text-[8px]" /> : '2'}
            </span>
            <span className="text-accent-dark">Hear a spotlight</span>
          </div>
          <p className="text-[13px] font-bold text-ink leading-tight">{spotlight.title}</p>
          <p className="text-[12px] text-muted mt-1 line-clamp-2">{spotlight.hookLine}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary font-bold">
            <i className="fa-solid fa-headset" /> Open Coach to listen
          </span>
        </button>
        <Link to={`/revision/papers/${question.p.id}/q/${question.q.number}`} onClick={() => setDone((d) => ({ ...d, question: true }))}
          className={cn('rounded-xl border p-3 hover:border-primary transition-colors', done.question ? 'border-primary bg-primary/5' : 'border-border bg-white')}>
          <div className="flex items-center gap-2 mb-1.5 text-[10.5px] uppercase tracking-wider font-bold">
            <span className={cn('w-4 h-4 rounded grid place-items-center', done.question ? 'bg-primary text-white' : 'bg-slate-200 text-muted')}>
              {done.question ? <i className="fa-solid fa-check text-[8px]" /> : '3'}
            </span>
            <span className="text-primary">Open one question</span>
          </div>
          <p className="text-[13px] font-bold text-ink leading-tight">{question.p.label} · Q{question.q.number}</p>
          <p className="text-[12px] text-muted mt-1 line-clamp-2">{question.q.caseName || question.q.hookLine || `${question.q.marks} marks`}</p>
        </Link>
      </div>
    </Card>
  );
}

function ShPlusWidget() {
  const now = new Date();
  const { week, status } = getCurrentShWeek(now);
  const nextDate = SH_KEY_DATES.find((d) => +new Date(d.date) > +now);
  const days = (iso: string) => Math.ceil((+new Date(iso) - +now) / 86_400_000);
  const totalWeeks = SH_WEEKS.length;
  const weekIdx = week ? SH_WEEKS.findIndex((w) => w.num === week.num) : 0;
  const pctOfCourse = Math.round(((weekIdx + (status === 'live' ? 0.5 : status === 'pre' ? 0 : 1)) / totalWeeks) * 100);

  return (
    <Link to="/course">
      <Card className="!p-5 hover:border-primary transition-colors group">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white grid place-items-center font-display text-xl">
            {week ? `W${week.num}` : '—'}
          </div>
          <div className="flex-1 min-w-[260px]">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Pill variant="primary"><i className="fa-solid fa-graduation-cap" /> Resit Course</Pill>
              <Pill variant={status === 'live' ? 'accent' : 'outline'}>
                {status === 'live' ? 'Live this week' : status === 'pre' ? 'Up next' : status === 'exam-week' ? 'Exam week' : 'Course complete'}
              </Pill>
              {week?.tutorScenarios.length ? <Pill>{`Walkthroughs: ${week.tutorScenarios.join(' & ')}`}</Pill> : null}
            </div>
            <h2 className="font-display text-xl tracking-wide uppercase text-ink leading-tight">
              {week ? week.title : 'Course complete'}
            </h2>
            <p className="text-[13px] text-ink/75 mt-1 leading-relaxed">
              {week ? week.mowerEmphasis : 'You sat the exam. Wait for results 13 July 2026.'}
            </p>
          </div>
          <div className="text-right min-w-[140px]">
            <div className="text-[10px] uppercase tracking-wider text-muted font-bold">Next deadline</div>
            {nextDate ? (
              <>
                <div className={cn('font-display text-3xl leading-none mt-0.5',
                  days(nextDate.date) <= 2 ? 'text-danger' : days(nextDate.date) <= 7 ? 'text-accent-dark' : 'text-primary')}>
                  {days(nextDate.date)}d
                </div>
                <div className="text-[11px] text-ink/70 mt-1 leading-tight">{nextDate.label}</div>
              </>
            ) : (
              <div className="text-[12px] text-muted">No deadlines remaining</div>
            )}
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${pctOfCourse}%` }} />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted">
          <span>Progress · {pctOfCourse}% through the 5-week course</span>
          <span className="text-primary font-bold group-hover:underline">Open companion <i className="fa-solid fa-arrow-right" /></span>
        </div>
      </Card>
    </Link>
  );
}

function CoachShowcase() {
  return (
    <Card className="!p-0 overflow-hidden h-full">
      <div className="p-6 md:p-7" style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #122046 80%)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="chip text-accent" style={{ borderColor: 'rgba(245,184,0,0.4)', background: 'rgba(245,184,0,0.10)' }}>
            <i className="fa-solid fa-headset" /> Coach AI
          </span>
          <span className="chip text-white/70" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.10)' }}>
            Voice + text
          </span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-white leading-tight">
          Ask out loud.<br />Get an examiner-grade answer.
        </h3>
        <p className="text-white/70 mt-3 leading-relaxed text-[14px]">
          Hands-on the spreadsheet? Speak the question — the Coach hears you, replies in markdown,
          and reads it back so you can keep typing. Tap the green headset (bottom-right) any time.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: 'fa-microphone', label: 'Dictate' },
            { icon: 'fa-volume-high', label: 'Speak back' },
            { icon: 'fa-link', label: 'Cite topics' },
          ].map((b) => (
            <div key={b.label} className="stat-tile text-center">
              <i className={`fa-solid ${b.icon} text-accent`} />
              <div className="text-[11px] uppercase tracking-wider text-white/70 font-bold mt-1">{b.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl bg-white/[0.04] border border-white/10 p-3 text-[13px] text-white/85 leading-relaxed">
          <span className="text-accent font-bold">You:</span> "How do I bank ESG marks in Section A?"<br />
          <span className="text-primary-light font-bold">Coach:</span> "Three sentences. Issue → costed action → quantified outcome…"
        </div>
      </div>
    </Card>
  );
}

function MemoryShowcase() {
  return (
    <Card className="h-full overflow-hidden relative">
      <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-44 h-44 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="chip text-primary"><i className="fa-solid fa-brain" /> Memory Lab</span>
          <span className="chip">Spaced · palace · Feynman</span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-wide uppercase text-ink leading-tight">
          Remember the formulas<br /><span className="text-gradient">before exam morning.</span>
        </h3>
        <p className="text-ink/75 mt-3 leading-relaxed text-[14px]">
          Drive a Leitner spaced-repetition queue, build a 10-room memory palace, and stress-test understanding
          with the Feynman technique. All offline; all on your device.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Leitner box</div>
            <div className="font-display text-2xl text-primary mt-1">5 stages</div>
            <div className="text-[11.5px] text-ink/70">0d → 1d → 3d → 7d → 14d</div>
          </div>
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Mnemonic library</div>
            <div className="font-display text-2xl text-accent-dark mt-1">{siteStats.mnemonics} acronyms</div>
            <div className="text-[11.5px] text-ink/70">WACC, CAPM, BSOP…</div>
          </div>
        </div>
        <Link to="/memory" className="btn-primary mt-4">
          <i className="fa-solid fa-arrow-right" /> Open Memory Lab
        </Link>
      </div>
    </Card>
  );
}

function StatCard({ value, label, sub }: { value: number; label: string; sub: string }) {
  const v = useCountUp(value, 1100);
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
      <div className="stadium-num text-4xl text-primary leading-none">{v}</div>
      <div className="text-[12px] uppercase tracking-wider text-ink font-bold mt-1.5">{label}</div>
      <div className="text-[11px] text-muted mt-0.5">{sub}</div>
    </motion.div>
  );
}

const WEEKLY_PLAN: { label: string; body: string; topics: string[] }[] = [
  { label: 'Foundations', body: 'Set up the proforma. WACC ungear-regear drills. Read the syllabus once.', topics: ['coc', 'adviser'] },
  { label: 'NPV core', body: 'Inflation, tax timing, working capital. Drill three Section A problems.', topics: ['npv'] },
  { label: 'APV', body: 'Project finance, subsidised loans, tax shield. Two worked APV examples.', topics: ['apv'] },
  { label: 'Real options', body: 'BSOP mapping for delay, expand, abandon. Drill d1 and d2 by hand.', topics: ['real'] },
  { label: 'Valuation', body: 'FCFE vs FCFF. Two-stage growth. PE relative.', topics: ['val'] },
  { label: 'M&A', body: '3-column valuation table. Synergy stress-test. Bootstrapping comment.', topics: ['mna'] },
  { label: 'FX hedge', body: 'Compare forward, MMH, futures, option in a table. Recommend.', topics: ['fx'] },
  { label: 'IR hedge', body: 'FRA settlement, swap diagram, collar trade-off.', topics: ['ir'] },
  { label: 'Islamic', body: 'Murabaha, sukuk, mudaraba. One paragraph each.', topics: ['islam'] },
  { label: 'Risk + VaR', body: 'z values cold. T-day scaling. Limitations of VaR.', topics: ['risk'] },
  { label: 'Behav + ESG', body: 'NEA pattern. Three biases applied. Issue-action-outcome.', topics: ['behav'] },
  { label: 'Mocks', body: 'Two full mocks. Mark with model answers. Identify weak areas.', topics: [] },
];

function ScoreCell({ label, value, accent, suffix }: { label: string; value: number; accent: 'primary' | 'accent'; suffix?: string }) {
  const color = accent === 'primary' ? '#33d375' : '#f5b800';
  const v = useCountUp(value, 800);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">{label}</div>
      <div className="stadium-num text-3xl scoreboard-led mt-1" style={{ color }}>
        {v}
        {suffix && <span className="text-white/40 text-base ml-0.5">{suffix}</span>}
      </div>
    </div>
  );
}

function FormStreak({ points }: { points: number }) {
  const cells = 5;
  const wins = Math.min(cells, Math.round(points / 200));
  return (
    <span className="inline-flex gap-1">
      {Array.from({ length: cells }).map((_, i) => {
        const win = i < wins;
        return (
          <span
            key={i}
            className={`w-2 h-3 rounded-sm ${win ? 'bg-primary' : 'bg-slate-200'}`}
            title={win ? 'W' : '-'}
          />
        );
      })}
    </span>
  );
}

function TIER_PREV_MIN(points: number): number {
  const ts = [0, 250, 750, 1500, 3000];
  let prev = 0;
  for (const v of ts) if (points >= v) prev = v;
  return prev;
}
