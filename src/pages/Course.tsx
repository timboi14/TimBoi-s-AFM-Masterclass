import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import {
  SH_WEEKS,
  SH_KEY_DATES,
  SH_SUPPORT,
  SH_TECHNICAL_ARTICLES,
  getCurrentShWeek,
  type ShWeek,
} from '@/data/shplus';
import { TOPICS } from '@/data/topics';
import { EXAM_CASES } from '@/data/examiner';
import { cn } from '@/lib/cn';

const PROG_KEY = 'tba_sh_progress_v1';

type WeekProgress = Record<string, boolean>;
type AllProgress = Record<number, WeekProgress>;

function loadProgress(): AllProgress {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(PROG_KEY) || '{}'); } catch { return {}; }
}
function saveProgress(p: AllProgress) {
  try { localStorage.setItem(PROG_KEY, JSON.stringify(p)); } catch {}
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
function fmtDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
function daysUntil(iso: string, now = new Date()) {
  const ms = +new Date(iso) - +now;
  return Math.ceil(ms / 86_400_000);
}

export function CoursePage() {
  const [now, setNow] = useState(() => new Date());
  const [progress, setProgress] = useState<AllProgress>(() => loadProgress());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const current = useMemo(() => getCurrentShWeek(now), [now]);
  const nextDeadline = useMemo(() => SH_KEY_DATES.find((d) => +new Date(d.date) > +now), [now]);

  const totalCriteria = SH_WEEKS.reduce((n, w) => n + w.exitCriteria.length, 0);
  const doneCriteria = useMemo(
    () => SH_WEEKS.reduce((n, w) => n + (progress[w.num] ? Object.values(progress[w.num]).filter(Boolean).length : 0), 0),
    [progress],
  );
  const pct = Math.round((doneCriteria / totalCriteria) * 100);

  const toggle = (week: number, idx: number) => {
    setProgress((prev) => ({
      ...prev,
      [week]: { ...(prev[week] || {}), [idx]: !((prev[week] || {})[idx]) },
    }));
  };

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* HERO */}
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-sky-500/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }} />
        <div className="aurora w-72 h-72 -bottom-12 -left-12" style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary"><i className="fa-solid fa-graduation-cap" /> Resit Roadmap</span>
            <span className="chip">June 2026 sitting</span>
            <span className="chip" style={{ borderColor: 'rgba(14,165,233,0.4)', background: 'rgba(14,165,233,0.10)', color: '#0369a1' }}>
              5 weeks · 1 mock
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Your resit schedule,<br /><span className="text-gradient">mirrored & tracked.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Five weeks. Four guided walkthroughs. One full mock. Every course deliverable mapped to
            TimBoi&apos;s Academy fixtures, theory cards and examiner traps so the two reinforce each other.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <KpiTile
              label={current.status === 'live' ? 'Current week' : current.status === 'pre' ? 'Up next' : current.status === 'exam-week' ? 'Exam week' : 'Course complete'}
              value={current.week ? `W${current.week.num}` : '—'}
              sub={current.week?.title || ''}
              tone="primary"
            />
            <KpiTile
              label="Next deadline"
              value={nextDeadline ? `${daysUntil(nextDeadline.date, now)}d` : 'None'}
              sub={nextDeadline ? nextDeadline.label : ''}
              tone={nextDeadline?.tone === 'critical' ? 'danger' : 'accent'}
            />
            <KpiTile
              label="Completion"
              value={`${pct}%`}
              sub={`${doneCriteria} / ${totalCriteria} exit criteria`}
              tone="primary"
            />
          </div>
        </div>
      </motion.section>

      {/* THIS WEEK BANNER */}
      {current.week && (
        <SectionTitle icon="fa-solid fa-calendar-day" badge={<Pill variant={current.status === 'live' ? 'primary' : 'accent'}>{current.status === 'live' ? 'Live now' : current.status === 'exam-week' ? 'Exam week' : 'Up next'}</Pill>}>
          {current.status === 'live' ? 'Working this week' : 'Next week of the course'}
        </SectionTitle>
      )}
      {current.week && (
        <motion.div variants={fadeUp}>
          <ThisWeekCard week={current.week} now={now} live={current.status === 'live'} />
        </motion.div>
      )}

      {/* FULL 5-WEEK GRID */}
      <SectionTitle icon="fa-solid fa-list-ol" badge={<Pill>5 weeks · 1 mock</Pill>}>
        Full course timeline
      </SectionTitle>
      <motion.div variants={stagger} className="space-y-3">
        {SH_WEEKS.map((w) => (
          <motion.div key={w.num} variants={fadeUp}>
            <WeekCard
              week={w}
              isCurrent={current.week?.num === w.num && current.status === 'live'}
              progress={progress[w.num] || {}}
              onToggle={(idx) => toggle(w.num, idx)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* KEY DATES */}
      <SectionTitle icon="fa-solid fa-calendar-check" badge={<Pill variant="danger">Hard dates</Pill>}>
        Key dates
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-0 overflow-hidden">
          <table className="w-full text-[14px]">
            <thead className="bg-slate-50">
              <tr className="text-[11px] uppercase tracking-wider text-muted">
                <th className="text-left px-4 py-2.5">When</th>
                <th className="text-left px-4 py-2.5">What</th>
                <th className="text-right px-4 py-2.5">Days from now</th>
              </tr>
            </thead>
            <tbody>
              {SH_KEY_DATES.map((d) => {
                const days = daysUntil(d.date, now);
                const past = days < 0;
                return (
                  <tr key={d.date + d.label} className={cn('border-t border-border', past && 'opacity-50', d.tone === 'critical' && 'bg-danger/5')}>
                    <td className="px-4 py-3 font-mono text-[12.5px] text-ink">{fmtDateTime(d.date)}</td>
                    <td className="px-4 py-3 text-ink">
                      {d.tone === 'critical' && <i className="fa-solid fa-flag text-danger mr-2" />}
                      {d.tone === 'warn' && <i className="fa-solid fa-circle-exclamation text-accent-dark mr-2" />}
                      {d.label}
                    </td>
                    <td className={cn('px-4 py-3 text-right font-mono text-[13px]',
                      past ? 'text-muted' : days <= 7 ? 'text-danger font-bold' : days <= 21 ? 'text-accent-dark font-bold' : 'text-primary font-bold')}>
                      {past ? `${Math.abs(days)}d ago` : `${days}d`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* BLACKBOSCA STUDY COMPANION (Week 1 self-review) */}
      <SectionTitle icon="fa-solid fa-microscope" badge={<Pill variant="primary">Week 1 self-review</Pill>}>
        Self-review study companion
      </SectionTitle>
      <motion.div variants={fadeUp}>
        <BlackboscaCompanion />
      </motion.div>

      {/* TUTOR + ASSISTANT SUPPORT */}
      <SectionTitle icon="fa-solid fa-headset" badge={<Pill variant="accent">Course support</Pill>}>
        Reach the tutors
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center text-primary">
                <i className="fa-solid fa-chalkboard-user" />
              </div>
              <div>
                <div className="font-display text-base uppercase tracking-wide text-ink">Lead Tutor</div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Course Expert</div>
              </div>
            </div>
            <a href={SH_SUPPORT.expert.linkedin} target="_blank" rel="noreferrer" className="text-[13px] text-primary hover:underline">
              <i className="fa-brands fa-linkedin mr-1.5" /> Tutor LinkedIn
            </a>
            <p className="mt-2 text-[12.5px] text-muted">Support tutors available alongside the lead.</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/15 grid place-items-center text-accent-dark">
                <i className="fa-brands fa-whatsapp" />
              </div>
              <div>
                <div className="font-display text-base uppercase tracking-wide text-ink">WhatsApp</div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-bold">{SH_SUPPORT.whatsappNote}</div>
              </div>
            </div>
            <a href={`https://wa.me/${SH_SUPPORT.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-[13px] text-primary hover:underline font-mono">
              {SH_SUPPORT.whatsapp}
            </a>
            <p className="mt-2 text-[12.5px] text-muted">For technical and exam-technique questions.</p>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/15 grid place-items-center text-sky-600">
                <i className="fa-solid fa-robot" />
              </div>
              <div>
                <div className="font-display text-base uppercase tracking-wide text-ink">Course Assistant</div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-bold">24/7 AI tutor</div>
              </div>
            </div>
            <a href={SH_SUPPORT.assistant.url} target="_blank" rel="noreferrer" className="text-[13px] text-primary hover:underline">
              learning.accaglobal.com
            </a>
            <p className="mt-2 text-[12.5px] text-muted">{SH_SUPPORT.assistant.note}</p>
            <p className="mt-1 text-[11.5px] text-muted">For admin/access: <code>studyhubplus@accaglobal.com</code></p>
          </Card>
        </motion.div>
      </motion.div>

      {/* ACCA TECHNICAL ARTICLES BUTTON-RACK */}
      <SectionTitle icon="fa-solid fa-newspaper" badge={<Pill>Curriculum scope</Pill>}>
        ACCA technical articles in scope
      </SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {SH_TECHNICAL_ARTICLES.map((a) => {
          const topic = TOPICS[a.topic];
          return (
            <motion.div key={a.title} variants={fadeUp}>
              {topic ? (
                <Link to={`/topic/${a.topic}`} className="block">
                  <div className="rounded-xl border border-border bg-white px-3.5 py-2.5 hover:border-primary transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
                      <i className={`fa-solid ${topic.badge}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-ink leading-tight truncate">{a.title}</div>
                      <div className="text-[11px] uppercase tracking-wider text-muted">→ {topic.title}</div>
                    </div>
                    <i className="fa-solid fa-arrow-right text-muted text-xs" />
                  </div>
                </Link>
              ) : (
                <div className="rounded-xl border border-border bg-white px-3.5 py-2.5 text-[13px] text-ink">{a.title}</div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* MANTRA */}
      <motion.div variants={fadeUp} className="mt-10">
        <Card className="!p-7 text-center" glow>
          <p className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">
            "Just keep swimming."
          </p>
          <p className="mt-3 text-ink/70 max-w-xl mx-auto">
            The rule for stuck calculations. Move on, bank what you can, come back if time allows.
            Own-figure marks add up.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ─── components ─── */

function KpiTile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'primary' | 'accent' | 'danger' }) {
  const colors = {
    primary: { text: 'text-primary', border: 'border-primary/30', bg: 'bg-primary/5' },
    accent: { text: 'text-accent-dark', border: 'border-accent/40', bg: 'bg-accent/5' },
    danger: { text: 'text-danger', border: 'border-danger/40', bg: 'bg-danger/5' },
  }[tone];
  return (
    <div className={cn('rounded-2xl border p-4', colors.border, colors.bg)}>
      <div className="text-[11px] uppercase tracking-wider text-muted font-bold">{label}</div>
      <div className={cn('font-display text-3xl mt-1 leading-none', colors.text)}>{value}</div>
      <div className="text-[12px] text-ink/70 mt-1 truncate">{sub}</div>
    </div>
  );
}

function ThisWeekCard({ week, now, live }: { week: ShWeek; now: Date; live: boolean }) {
  const homeworkDays = daysUntil(week.homeworkDue, now);
  const examinerCases = EXAM_CASES.filter((c) => week.examinerCases.includes(c.id));
  const tbaTopics = week.tbaTopics.map((id) => TOPICS[id]).filter(Boolean);

  return (
    <Card className="!p-6 border-l-4 border-l-primary shine">
      <div className="flex items-start gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-2xl bg-primary text-white grid place-items-center font-display text-2xl">
          W{week.num}
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Pill variant="primary">{live ? 'Live now' : 'Up next'}</Pill>
            <Pill>w/c {fmtDate(week.weekStart)}</Pill>
            <Pill variant="accent">{week.marks} marks homework</Pill>
          </div>
          <h3 className="font-display text-2xl tracking-wide uppercase text-ink">{week.title}</h3>
          <p className="text-[13.5px] text-muted mt-1">{week.topic}</p>
          <p className="text-[13.5px] text-ink mt-2"><strong>Focus:</strong> {week.mowerEmphasis}</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Homework due</div>
          <div className={cn('font-display text-3xl', homeworkDays < 0 ? 'text-muted line-through' : homeworkDays <= 2 ? 'text-danger' : homeworkDays <= 5 ? 'text-accent-dark' : 'text-primary')}>
            {homeworkDays < 0 ? 'Past' : homeworkDays === 0 ? 'Today' : `${homeworkDays}d`}
          </div>
          <div className="text-[11.5px] text-muted">{fmtDateTime(week.homeworkDue)}</div>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Andrew&apos;s walkthroughs</div>
          <div className="flex flex-wrap gap-1.5">
            {week.tutorScenarios.map((s) => (
              <span key={s} className="chip"><i className="fa-solid fa-play text-primary text-[10px]" /> {s}</span>
            ))}
          </div>
          {week.selfReview && (
            <>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold mt-3 mb-1">Self-review question</div>
              <div className="text-[13px] text-ink">{week.selfReview}</div>
            </>
          )}
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Drill these on TimBoi</div>
          <div className="flex flex-wrap gap-1.5">
            {tbaTopics.map((t) => (
              <Link key={t.id} to={`/topic/${t.id}`} className="chip text-primary hover:bg-primary hover:text-white transition-colors">
                <i className={`fa-solid ${t.badge} text-[10px]`} /> {t.title}
              </Link>
            ))}
          </div>
          {examinerCases.length > 0 && (
            <>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold mt-3 mb-1">Examiner cases worth revisiting</div>
              <div className="flex flex-wrap gap-1.5">
                {examinerCases.map((c) => (
                  <Link key={c.id} to="/examiner" className="chip hover:border-primary transition-colors">
                    <i className="fa-solid fa-file-signature text-[10px] text-sky-600" /> {c.company}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

function WeekCard({ week, isCurrent, progress, onToggle }: { week: ShWeek; isCurrent: boolean; progress: WeekProgress; onToggle: (idx: number) => void }) {
  const [open, setOpen] = useState(isCurrent);
  const doneCount = Object.values(progress).filter(Boolean).length;
  const pct = Math.round((doneCount / week.exitCriteria.length) * 100);
  const tbaTopics = week.tbaTopics.map((id) => TOPICS[id]).filter(Boolean);

  return (
    <Card className={cn('!p-5', isCurrent && 'border-2 border-primary shadow-glow')}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left">
        <div className="flex items-center gap-4">
          <div className={cn(
            'w-12 h-12 rounded-xl grid place-items-center font-display text-lg',
            isCurrent ? 'bg-primary text-white' : 'bg-slate-100 text-ink',
          )}>
            W{week.num}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Pill variant={isCurrent ? 'primary' : 'outline'}>{week.title}</Pill>
              <Pill>w/c {fmtDate(week.weekStart)}</Pill>
              {week.marks > 0 && <Pill variant="accent">{week.marks}m</Pill>}
            </div>
            <div className="text-[12.5px] text-muted mt-1 truncate">{week.topic}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted">Exit criteria</div>
            <div className="font-mono text-[13px] text-primary font-bold">{doneCount} / {week.exitCriteria.length}</div>
          </div>
          <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'} text-muted ml-2`} />
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.25 }}
          className="mt-4 grid md:grid-cols-2 gap-5 overflow-hidden"
        >
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Exit criteria — tap to tick</div>
            <ul className="space-y-1.5">
              {week.exitCriteria.map((c, idx) => {
                const done = !!progress[idx];
                return (
                  <li key={idx}>
                    <button
                      onClick={() => onToggle(idx)}
                      className={cn(
                        'w-full text-left rounded-lg border px-3 py-2 flex items-start gap-3 transition-colors',
                        done ? 'border-primary bg-primary/5 line-through text-ink/60' : 'border-border bg-white hover:border-primary',
                      )}
                    >
                      <span className={cn(
                        'mt-0.5 w-4 h-4 rounded border-2 grid place-items-center shrink-0',
                        done ? 'bg-primary border-primary text-white' : 'border-border',
                      )}>
                        {done && <i className="fa-solid fa-check text-[8px]" />}
                      </span>
                      <span className="text-[13px] leading-snug">{c}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1.5">Focus this week</div>
              <p className="text-[13px] text-ink leading-relaxed">{week.mowerEmphasis}</p>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1.5">Drill on TimBoi</div>
              <div className="flex flex-wrap gap-1.5">
                {tbaTopics.map((t) => (
                  <Link key={t.id} to={`/topic/${t.id}`} className="chip text-primary hover:bg-primary hover:text-white transition-colors">
                    <i className={`fa-solid ${t.badge} text-[10px]`} /> {t.title}
                  </Link>
                ))}
              </div>
            </div>
            {week.tutorScenarios.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1.5">Walkthrough scenarios</div>
                <div className="flex flex-wrap gap-1.5">
                  {week.tutorScenarios.map((s) => (
                    <span key={s} className="chip"><i className="fa-solid fa-play text-primary text-[10px]" /> {s}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="text-[11px] text-muted pt-2">
              Homework due {fmtDateTime(week.homeworkDue)} · marked answer unlocks {fmtDateTime(week.answerUnlocks)}
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

function BlackboscaCompanion() {
  return (
    <Card className="!p-6">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Pill variant="primary">25 marks · 60 minutes</Pill>
        <Pill variant="accent">+5 PS marks</Pill>
        <Pill>International expansion · NPV + Risk</Pill>
      </div>
      <h3 className="font-display text-2xl tracking-wide uppercase text-ink">
        Blackbosca Co · Üskistan project
      </h3>
      <p className="mt-3 text-[14px] text-ink/85 leading-relaxed">
        The Week 1 self-review. Use this companion as your debrief framework: attempt the question
        cold first on the practice platform, then map your answer to the structure below.
      </p>

      <div className="mt-5 grid md:grid-cols-2 gap-5">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">Scenario flags to spot</div>
          <ul className="space-y-2 text-[13.5px] text-ink leading-relaxed">
            <li className="flex gap-2"><i className="fa-solid fa-flag text-accent-dark mt-1 text-[11px]" /><span><strong>Self-employed riders</strong> recently upheld in Supreme Court — favourable cost basis but politically fragile. Sensitivity required.</span></li>
            <li className="flex gap-2"><i className="fa-solid fa-flag text-accent-dark mt-1 text-[11px]" /><span><strong>Removed dividend remittance restriction</strong> — but new government has high debt; risk of reversal. Flag in scepticism.</span></li>
            <li className="flex gap-2"><i className="fa-solid fa-flag text-accent-dark mt-1 text-[11px]" /><span><strong>Frequent regime change</strong> stabilised by new constitution. Country risk premium adjustment justified.</span></li>
            <li className="flex gap-2"><i className="fa-solid fa-flag text-accent-dark mt-1 text-[11px]" /><span><strong>Cultural & language tie to Turkey</strong> — assess whether this materially de-risks customer adoption.</span></li>
            <li className="flex gap-2"><i className="fa-solid fa-flag text-accent-dark mt-1 text-[11px]" /><span><strong>Reliance on financial institutions for online payment</strong> — single point of failure; counterparty &amp; infrastructure risk.</span></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">Answer structure</div>
          <ol className="space-y-2 text-[13.5px] text-ink leading-relaxed list-decimal pl-5">
            <li><strong>Lead with recommendation</strong> in one sentence (proceed / reject / proceed-conditional).</li>
            <li><strong>Headline financials:</strong> NPV in £, IRR if computed, payback if relevant. One line each.</li>
            <li><strong>CEO&apos;s concerns about cash-flow estimates</strong> — challenge two assumptions explicitly (revenue growth optimism, rider cost stability). Sensitivity output.</li>
            <li><strong>Financial risks:</strong> FX (USD/Üskistani lira), translation on consolidation, country risk premium, dividend remittance reversal.</li>
            <li><strong>Business risks:</strong> regulatory (rider classification), political (regime change), market (emerging market adoption rate), operational (payment infrastructure).</li>
            <li><strong>Professional skills (5 marks):</strong> 4 short bullets, one per skill, woven through (not appended).</li>
          </ol>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-accent/60 bg-accent/[0.08] p-4">
        <div className="text-[11px] uppercase tracking-wider text-accent-dark font-bold mb-1">
          <i className="fa-solid fa-trophy" /> Banker phrases to deploy
        </div>
        <ul className="text-[13px] text-ink leading-relaxed space-y-1">
          <li>&ldquo;The CEO&apos;s scepticism is justified — the consultant&apos;s revenue forecast appears optimistic given...&rdquo;</li>
          <li>&ldquo;While the Supreme Court ruling is favourable, regulatory reversal remains a tail risk; we recommend sensitivity analysis at +25% rider cost.&rdquo;</li>
          <li>&ldquo;Dividend remittance freedom is recent and politically contingent. We recommend stress-testing NPV with a 50% remittance restriction in years 4-5.&rdquo;</li>
          <li>&ldquo;Reliance on financial institutions for payment processing creates concentration risk; recommend dual-rail integration in Phase 2.&rdquo;</li>
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link to="/topic/npv" className="btn-primary"><i className="fa-solid fa-square-root-variable" /> Drill NPV mechanics</Link>
        <Link to="/topic/fx" className="btn-outline"><i className="fa-solid fa-money-bill-transfer" /> Drill FX exposure</Link>
        <Link to="/examiner" className="btn-outline"><i className="fa-solid fa-file-signature" /> Examiner traps to avoid</Link>
      </div>
    </Card>
  );
}
