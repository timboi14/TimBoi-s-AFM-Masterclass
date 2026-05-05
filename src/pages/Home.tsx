import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { store, tierFor, useStore } from '@/lib/store';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { TOPIC_LIST, TOPICS } from '@/data/topics';
import { NEWS } from '@/data/news';

const EXAM_DATE = new Date('2026-06-01T09:00:00');

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

const SEED_RIVALS = [
  { name: 'HarryK_9', points: 1280, drills: 47, streak: 12 },
  { name: 'SonHM_7', points: 980, drills: 38, streak: 8 },
  { name: 'Romero_17', points: 740, drills: 26, streak: 5 },
  { name: 'Maddison10', points: 560, drills: 19, streak: 3 },
  { name: 'BissoumaY', points: 410, drills: 14, streak: 2 },
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
      {/* SCOREBOARD HERO — light theme: ink-on-white card with primary/accent accents */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
        <div className="absolute inset-0 pitch-grid opacity-40" />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative p-6 md:p-10">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex-1 min-w-[260px]">
              <div className="flex items-center gap-2 mb-3">
                <span className="pill bg-danger text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> LIVE
                </span>
                <span className="pill border border-border bg-white text-ink">Match-day brief</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl leading-[0.95] tracking-wide uppercase text-ink">
                Welcome back,{' '}
                <span className="text-primary" style={{ textShadow: '0 0 24px rgba(0,163,71,0.25)' }}>
                  {fanName}
                </span>
              </h1>
              <p className="mt-4 text-ink/80 max-w-lg leading-relaxed">
                Today, train like Andrew Mower is in the dugout. Open one fixture, finish one drill, ship the
                technique. Generic answers fail; quote scenario figures and lead with the recommendation.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to={`/topic/${todaysMission.id}`} className="btn-primary">
                  <i className="fa-solid fa-bolt" /> Today&apos;s mission
                </Link>
                <Link to="/practice" className="btn-accent">
                  <i className="fa-solid fa-stopwatch-20" /> Open practice centre
                </Link>
                <Link to="/exam-skills" className="btn-outline">
                  <i className="fa-solid fa-chalkboard-user" /> Coach&apos;s playbook
                </Link>
              </div>
            </div>

            {/* SCOREBOARD: dark navy panel for the LED look on white page */}
            <div className="rounded-2xl border border-ink/20 bg-ink p-4 min-w-[280px] text-white shadow-floodlight">
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
                  <span className="text-[11px] font-mono text-accent">JUNE 2026 SITTING</span>
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="stadium-num text-5xl scoreboard-led" style={{ color: '#f5b800' }}>
                    {cd.d}
                  </span>
                  <span className="text-white/60 text-xs mb-1.5">days</span>
                  <span className="stadium-num text-3xl scoreboard-led ml-3" style={{ color: '#ffffff' }}>
                    {cd.h}
                  </span>
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
      </motion.section>

      {/* TODAY'S MISSION */}
      <SectionTitle icon="fa-solid fa-crosshairs">Today&apos;s mission</SectionTitle>
      <motion.div variants={fadeUp}>
        <Link to={`/topic/${todaysMission.id}`}>
          <Card glow className="!p-7 hover:border-primary transition-colors">
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
              <div className="text-[11px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
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
                  <Pill variant="outline">Section {t.syllabus}</Pill>
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
                <span className="font-display text-2xl text-accent">W{i + 1}</span>
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
                  <td className="p-3 text-right font-mono text-accent">{r.points}</td>
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
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/60">{label}</div>
      <div className="stadium-num text-3xl scoreboard-led mt-1" style={{ color }}>
        {value}
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
            className={`w-2 h-3 rounded-sm ${win ? 'bg-primary' : 'bg-white/10'}`}
            title={win ? 'W' : '-'}
          />
        );
      })}
    </span>
  );
}

function TIER_PREV_MIN(points: number): number {
  // helper: previous tier threshold
  const ts = [0, 250, 750, 1500, 3000];
  let prev = 0;
  for (const v of ts) if (points >= v) prev = v;
  return prev;
}
