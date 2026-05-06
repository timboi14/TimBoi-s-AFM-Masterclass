import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { PAPERS, getPaper, getQuestion } from '@/data/papers';
import type { Paper, PaperType, AttemptRating, SyllabusArea } from '@/data/papers/schema';
import { TOPICS } from '@/data/topics';
import { THEORY } from '@/data/theory';
import {
  attemptsByQuestion,
  exportAttemptsCsv,
  lastAttempt,
  loadAttempts,
  logAttempt,
  topicMastery,
  totalStudyMinutes,
  uniquePapersAttempted,
} from '@/lib/attempts';
import { cn } from '@/lib/cn';

const TYPE_LABEL: Record<PaperType, { label: string; color: string }> = {
  real:           { label: 'ACCA real',  color: '#0ea5e9' },
  mock:           { label: 'Mock',       color: '#f59e0b' },
  'pre-mock':     { label: 'Pre-mock',   color: '#a78bfa' },
  specimen:       { label: 'Specimen',   color: '#10b981' },
  'tba-original': { label: 'TBA',        color: '#00a347' },
};

const SYLLABUS_LABEL: Record<SyllabusArea, string> = {
  A: 'Senior adviser', B: 'Investment appraisal', C: 'M&A', D: 'Reorganisation', E: 'Treasury & risk', F: 'Other',
};

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─────────────────────────────────────────────
   /revision — Dashboard
   ───────────────────────────────────────────── */
export function RevisionDashboard() {
  const last = lastAttempt();
  const lastPaper = last ? getPaper(last.paperId) : null;
  const lastQ = last && lastPaper ? lastPaper.questions.find((q) => q.id === last.questionId) : null;

  const totalMinutes = totalStudyMinutes();
  const papersAttempted = uniquePapersAttempted();
  const attempts = loadAttempts();

  // Heatmap year × month based on attempts
  const years = useMemo(() => {
    const set = new Set<number>();
    attempts.forEach((a) => set.add(new Date(a.startedAt).getFullYear()));
    if (set.size === 0) set.add(new Date().getFullYear());
    return Array.from(set).sort();
  }, [attempts]);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-sky-500/[0.10]" />
        <div className="aurora w-72 h-72 -top-12 -right-12" style={{ background: 'radial-gradient(circle, rgba(0,163,71,0.45), transparent 70%)' }} />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary"><i className="fa-solid fa-folder-open" /> Past-paper revision</span>
            <span className="chip">{PAPERS.length} papers in scope</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Real papers.<br /><span className="text-gradient">Real-time mastery.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            ACCA past papers linked out. TBA practice sets bound to the simulator.
            Attempts logged on this device, mastery tracked per topic, due cards surfaced for revision.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <KpiTile label="Hours studied" value={`${(totalMinutes / 60).toFixed(1)}h`} sub={`${attempts.length} attempts logged`} tone="primary" />
            <KpiTile label="Papers touched" value={`${papersAttempted}`} sub={`of ${PAPERS.length} available`} tone="accent" />
            <KpiTile label="Last attempt" value={last ? fmtDate(last.startedAt) : '—'} sub={lastQ?.caseName || lastQ?.id || 'No attempts yet'} tone="primary" />
          </div>
        </div>
      </motion.section>

      {/* RESUME */}
      {last && lastPaper && lastQ && (
        <>
          <SectionTitle icon="fa-solid fa-rotate-right" badge={<Pill variant="primary">Resume</Pill>}>Pick up where you left off</SectionTitle>
          <motion.div variants={fadeUp}>
            <Link to={`/revision/papers/${lastPaper.id}/q/${lastQ.number}`}>
              <Card className="!p-5 hover:border-primary transition-colors shine">
                <div className="flex flex-wrap items-center gap-3">
                  <Pill variant="primary">{lastPaper.label}</Pill>
                  <Pill>Q{lastQ.number} · {lastQ.marks}m</Pill>
                  {lastQ.caseName && <Pill variant="accent">{lastQ.caseName}</Pill>}
                  <span className="ml-auto btn-primary"><i className="fa-solid fa-arrow-right" /> Resume</span>
                </div>
                {lastQ.hookLine && <p className="mt-2 text-[14px] text-ink/80">{lastQ.hookLine}</p>}
              </Card>
            </Link>
          </motion.div>
        </>
      )}

      {/* CTAs */}
      <SectionTitle icon="fa-solid fa-bullseye">Start somewhere</SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <motion.div variants={fadeUp}>
          <Link to="/revision/papers"><CtaCard icon="fa-folder" title="Open papers" body={`Filter ${PAPERS.length} papers by year, type, topic.`} /></Link>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/revision/topics"><CtaCard icon="fa-list-tree" title="Topic mastery" body="Drill the syllabus areas where attempts are weakest." /></Link>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/progress"><CtaCard icon="fa-chart-line" title="Progress dashboard" body="Hours, papers, mastery, CSV export." /></Link>
        </motion.div>
      </motion.div>

      {/* HEATMAP */}
      <SectionTitle icon="fa-solid fa-table-cells">Attempt heatmap</SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-5">
          <Heatmap years={years} attempts={attempts} />
          <p className="mt-3 text-[12px] text-muted">Each cell = one calendar month. Darker green = more attempts.</p>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   /revision/papers — Index
   ───────────────────────────────────────────── */
export function PapersIndex() {
  const [year, setYear] = useState<number | 'all'>('all');
  const [type, setType] = useState<PaperType | 'all'>('all');
  const [topic, setTopic] = useState<string>('all');

  const years = useMemo(() => Array.from(new Set(PAPERS.map((p) => p.year))).sort((a, b) => b - a), []);
  const topics = useMemo(() => Object.values(TOPICS), []);

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => {
      if (year !== 'all' && p.year !== year) return false;
      if (type !== 'all' && p.type !== type) return false;
      if (topic !== 'all' && !p.questions.some((q) => q.topics.includes(topic))) return false;
      return true;
    });
  }, [year, type, topic]);

  const allAttempts = loadAttempts();

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary"><i className="fa-solid fa-folder" /> Papers index</span>
            <span className="chip">{PAPERS.length} total</span>
            <Link to="/revision" className="chip text-muted hover:text-primary ml-auto"><i className="fa-solid fa-arrow-left" /> Back to revision</Link>
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink leading-tight">All AFM papers in one shelf</h1>
          <p className="mt-3 max-w-2xl text-ink/80 leading-relaxed">
            ACCA originals link out (we never reproduce ACCA copyrighted PDFs). TBA-original sets open
            inside the practice simulator.
          </p>
        </div>
      </motion.section>

      {/* Filters */}
      <SectionTitle icon="fa-solid fa-filter">Filter</SectionTitle>
      <motion.div variants={fadeUp} className="space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-wider text-muted font-bold">Year:</span>
          {(['all', ...years] as const).map((y) => (
            <button key={String(y)} onClick={() => setYear(y as any)}
              className={cn('pill border border-border bg-white', year === y && 'bg-primary text-white border-primary')}>{String(y)}</button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-wider text-muted font-bold">Type:</span>
          {(['all', 'real', 'specimen', 'tba-original'] as const).map((t) => (
            <button key={t} onClick={() => setType(t as any)}
              className={cn('pill border border-border bg-white', type === t && 'bg-primary text-white border-primary')}>
              {t === 'all' ? 'All' : TYPE_LABEL[t as PaperType]?.label || t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] uppercase tracking-wider text-muted font-bold">Topic:</span>
          <button onClick={() => setTopic('all')}
            className={cn('pill border border-border bg-white', topic === 'all' && 'bg-primary text-white border-primary')}>All</button>
          {topics.map((t) => (
            <button key={t.id} onClick={() => setTopic(t.id)}
              className={cn('pill border border-border bg-white', topic === t.id && 'bg-primary text-white border-primary')}>
              <i className={`fa-solid ${t.badge} text-[10px]`} /> {t.title}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={stagger} className="mt-5 grid gap-3">
        {filtered.map((p) => {
          const totalMarks = p.questions.reduce((n, q) => n + q.marks, 0);
          const sectionA = p.questions.filter((q) => q.section === 'A').length;
          const sectionB = p.questions.filter((q) => q.section === 'B').length;
          const lastFor = allAttempts.find((a) => a.paperId === p.id);
          const tone = TYPE_LABEL[p.type];
          return (
            <motion.div key={p.id} variants={fadeUp}>
              <Link to={`/revision/papers/${p.id}`}>
                <Card className="hover:border-primary transition-colors !p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="chip" style={{ borderColor: `${tone.color}66`, color: tone.color, background: `${tone.color}10` }}>
                      {tone.label}
                    </span>
                    <span className="font-display text-lg uppercase tracking-wide text-ink">{p.label}</span>
                    <Pill>{totalMarks} marks</Pill>
                    {sectionA > 0 && <Pill>A×{sectionA}</Pill>}
                    {sectionB > 0 && <Pill>B×{sectionB}</Pill>}
                    {lastFor && <Pill variant="accent">Attempted {fmtDate(lastFor.startedAt)}</Pill>}
                    <span className="ml-auto text-primary text-[12px] font-bold">Open <i className="fa-solid fa-arrow-right" /></span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.questions.map((q) => (
                      <span key={q.id} className="chip text-[10px] !text-[10px]">
                        Q{q.number}{q.caseName ? ` · ${q.caseName}` : ''}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="!p-6 text-center text-muted">No papers match those filters.</Card>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   /revision/papers/:paperId
   ───────────────────────────────────────────── */
export function PaperView() {
  const { paperId = '' } = useParams();
  const paper = getPaper(paperId);
  if (!paper) return <Navigate />;
  const tone = TYPE_LABEL[paper.type];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-white shadow-soft p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Link to="/revision/papers" className="chip text-muted hover:text-primary"><i className="fa-solid fa-arrow-left" /> All papers</Link>
          <span className="chip" style={{ borderColor: `${tone.color}66`, color: tone.color, background: `${tone.color}10` }}>{tone.label}</span>
          <Pill>{paper.questions.reduce((n, q) => n + q.marks, 0)} marks total</Pill>
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink">{paper.label}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {paper.sourceUrl && (
            <a href={paper.sourceUrl} target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-solid fa-up-right-from-square" /> Open on ACCA
            </a>
          )}
          {paper.examinerReportUrl && (
            <a href={paper.examinerReportUrl} target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-solid fa-file-signature" /> Examiner report
            </a>
          )}
          <Link to="/examiner" className="btn-outline">
            <i className="fa-solid fa-bookmark" /> TBA examiner digest
          </Link>
        </div>
      </motion.section>

      <SectionTitle icon="fa-solid fa-list-ol">Questions</SectionTitle>
      <motion.div variants={stagger} className="grid gap-3">
        {paper.questions.map((q) => (
          <motion.div key={q.id} variants={fadeUp}>
            <Link to={`/revision/papers/${paper.id}/q/${q.number}`}>
              <Card className="hover:border-primary transition-colors !p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Pill variant="primary">Q{q.number}</Pill>
                  <Pill>Section {q.section}</Pill>
                  <Pill variant="accent">{q.marks} marks</Pill>
                  <Pill>{q.estMinutes} min target</Pill>
                  {q.simulatorSetId && <Pill>Simulator-bound</Pill>}
                  <span className="ml-auto text-[11px] uppercase tracking-wider text-muted font-bold">Difficulty {q.difficulty}/5</span>
                </div>
                {q.caseName && <h3 className="font-display text-xl tracking-wide uppercase text-ink">{q.caseName}</h3>}
                {q.hookLine && <p className="mt-1 text-[13.5px] text-ink/80">{q.hookLine}</p>}
                <div className="mt-3 flex flex-wrap gap-1">
                  {q.topics.map((t) => {
                    const topic = TOPICS[t];
                    return topic ? (
                      <span key={t} className="chip text-primary"><i className={`fa-solid ${topic.badge} text-[10px]`} /> {topic.title}</span>
                    ) : null;
                  })}
                  {q.syllabusAreas.map((a) => (
                    <span key={a} className="chip text-muted">Section {a} · {SYLLABUS_LABEL[a]}</span>
                  ))}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   /revision/papers/:paperId/q/:qNo — Deep dive
   ───────────────────────────────────────────── */
export function QuestionDeepDive() {
  const { paperId = '', qNo = '0' } = useParams();
  const paper = getPaper(paperId);
  const q = getQuestion(paperId, Number(qNo));
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);
  const [scratch, setScratch] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [rating, setRating] = useState<AttemptRating | null>(null);
  const [score, setScore] = useState<string>('');
  const [savedId, setSavedId] = useState<string | null>(null);

  const SCRATCH_KEY = q ? `tba_scratch_${q.id}` : '';

  useEffect(() => {
    if (!SCRATCH_KEY) return;
    try { setScratch(localStorage.getItem(SCRATCH_KEY) || ''); } catch {}
  }, [SCRATCH_KEY]);

  useEffect(() => {
    if (!SCRATCH_KEY) return;
    try { localStorage.setItem(SCRATCH_KEY, scratch); } catch {}
  }, [scratch, SCRATCH_KEY]);

  if (!paper || !q) return <Navigate />;

  const linkedTheory = THEORY.filter((t) => q.topics.some((topicId) => t.cat === topicId || (t.cat as string) === topicId)).slice(0, 6);
  const similar = PAPERS.flatMap((p) => p.questions
    .filter((other) => other.id !== q.id && other.topics.filter((t) => q.topics.includes(t)).length >= 1)
    .map((other) => ({ paper: p, q: other })))
    .slice(0, 5);

  const startTimer = () => setStartedAt(Date.now());
  const reveal = () => {
    if (!revealed && !confirm('Reveal answer guidance? Try the question first — model answers are most useful after a real attempt.')) return;
    setRevealed(true);
  };
  const saveAttempt = () => {
    if (!rating) { alert('Pick a self-rating before saving.'); return; }
    const att = logAttempt({
      questionId: q.id, paperId: paper.id,
      startedAt: startedAt ?? Date.now() - q.estMinutes * 60_000,
      finishedAt: Date.now(),
      selfScore: score ? Math.max(0, Math.min(q.marks, Number(score))) : undefined,
      selfRating: rating,
      revealed,
      notes: scratch.trim() || undefined,
    });
    setSavedId(att.id);
  };

  const past = attemptsByQuestion(q.id);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-white shadow-soft p-6 md:p-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Link to={`/revision/papers/${paper.id}`} className="chip text-muted hover:text-primary"><i className="fa-solid fa-arrow-left" /> {paper.label}</Link>
          <Pill variant="primary">Q{q.number}</Pill>
          <Pill variant="accent">{q.marks} marks</Pill>
          <Pill>{q.estMinutes} min target</Pill>
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink">
          {q.caseName || `${paper.label} · Q${q.number}`}
        </h1>
        {q.hookLine && <p className="mt-2 text-[14px] text-ink/80 max-w-2xl leading-relaxed">{q.hookLine}</p>}

        <div className="mt-5 flex flex-wrap gap-2">
          {q.simulatorSetId ? (
            <Link to={`/practice/${q.simulatorSetId}`} className="btn-primary">
              <i className="fa-solid fa-play" /> Open in simulator
            </Link>
          ) : (
            <a href={q.questionAssetUrl} target="_blank" rel="noreferrer" className="btn-primary">
              <i className="fa-solid fa-up-right-from-square" /> Open question on ACCA
            </a>
          )}
          {!startedAt ? (
            <button onClick={startTimer} className="btn-outline"><i className="fa-solid fa-stopwatch" /> Start timer</button>
          ) : (
            <span className="chip text-primary">
              <i className="fa-solid fa-stopwatch" /> Started {new Date(startedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={reveal} className="btn-outline">
            <i className={`fa-solid ${revealed ? 'fa-eye-slash' : 'fa-eye'}`} /> {revealed ? 'Hide answer' : 'Reveal model answer'}
          </button>
          {paper.examinerReportUrl && (
            <a href={paper.examinerReportUrl} target="_blank" rel="noreferrer" className="btn-outline">
              <i className="fa-solid fa-file-signature" /> Examiner report
            </a>
          )}
        </div>

        {revealed && (
          <div className="mt-4 rounded-xl border-l-4 border-l-primary bg-primary/5 p-4 text-[13.5px] leading-relaxed text-ink">
            <strong className="text-primary">Reveal note.</strong> Model answers are not reproduced in TBA.
            For ACCA papers, click "Examiner report" or "Open on ACCA" above. For TBA simulator sets,
            sample answers live inside the simulator after submission.
          </div>
        )}
      </motion.section>

      <div className="mt-6 grid lg:grid-cols-[2fr_1fr] gap-4">
        {/* Scratch + self-debrief */}
        <Card className="!p-5">
          <h2 className="font-display text-xl tracking-wide uppercase text-ink mb-2">Scratchpad & self-debrief</h2>
          <p className="text-[12.5px] text-muted mb-3">Auto-saves to this device. After your attempt, log a self-rating to track mastery.</p>

          <textarea
            value={scratch}
            onChange={(e) => setScratch(e.target.value)}
            rows={8}
            placeholder={'Working notes, planned answer structure, things to check…'}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[13.5px] font-mono leading-relaxed"
          />

          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-2">Self-rating</div>
            <div className="flex flex-wrap gap-2">
              {(['again', 'hard', 'good', 'easy'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={cn(
                    'pill border-2',
                    r === 'again' && 'border-danger text-danger',
                    r === 'hard' && 'border-accent text-accent-dark',
                    r === 'good' && 'border-primary text-primary',
                    r === 'easy' && 'border-sky-500 text-sky-600',
                    rating === r && (
                      r === 'again' ? 'bg-danger text-white border-danger' :
                      r === 'hard' ? 'bg-accent text-ink border-accent' :
                      r === 'good' ? 'bg-primary text-white border-primary' :
                      'bg-sky-500 text-white border-sky-500'
                    ),
                  )}
                >
                  {r === 'again' && <i className="fa-solid fa-rotate-left mr-1" />}
                  {r === 'hard' && <i className="fa-solid fa-mountain mr-1" />}
                  {r === 'good' && <i className="fa-solid fa-check mr-1" />}
                  {r === 'easy' && <i className="fa-solid fa-feather mr-1" />}
                  {r[0].toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1 block">Self-score (optional)</span>
              <input
                type="number" min={0} max={q.marks}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`/ ${q.marks}`}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-[14px]"
              />
            </label>
            <div className="text-[12px] text-muted self-end">
              {past.length > 0 ? `${past.length} previous attempt${past.length === 1 ? '' : 's'}` : 'No previous attempts'}
            </div>
            <button onClick={saveAttempt} className="btn-primary self-end" disabled={!rating}>
              <i className="fa-solid fa-save" /> Log attempt
            </button>
          </div>

          {savedId && (
            <div className="mt-3 rounded-lg border border-primary/40 bg-primary/[0.06] p-2.5 text-[12.5px] text-ink">
              <i className="fa-solid fa-circle-check text-primary" /> Attempt saved. View it on the <Link to="/progress" className="text-primary font-bold hover:underline">progress dashboard</Link>.
            </div>
          )}

          {past.length > 0 && (
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wider text-muted font-bold mb-1.5">Past attempts</div>
              <ul className="space-y-1 text-[12.5px] text-ink">
                {past.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex justify-between border-t border-border pt-1.5">
                    <span>{fmtDate(a.startedAt)} · <span className="text-muted">{a.selfRating}</span></span>
                    {typeof a.selfScore === 'number' && <span className="font-mono text-primary">{a.selfScore}/{q.marks}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        {/* Linked theory + similar */}
        <div className="space-y-4">
          <Card className="!p-5">
            <h2 className="font-display text-lg tracking-wide uppercase text-ink mb-2">Linked theory</h2>
            {linkedTheory.length === 0 && <p className="text-[13px] text-muted">Nothing in the theory bank tagged with these topics yet.</p>}
            <ul className="space-y-2">
              {linkedTheory.map((t) => (
                <li key={t.ref} className="rounded-lg border border-border bg-white px-3 py-2 text-[13px] leading-snug">
                  <Link to="/theory" className="text-ink hover:text-primary">
                    <span className="text-[10.5px] uppercase tracking-wider text-primary font-bold mr-1.5">#{t.ref}</span>
                    {t.q}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="!p-5">
            <h2 className="font-display text-lg tracking-wide uppercase text-ink mb-2">Similar past questions</h2>
            {similar.length === 0 && <p className="text-[13px] text-muted">No overlapping past questions yet.</p>}
            <ul className="space-y-1.5">
              {similar.map(({ paper: p, q: other }) => (
                <li key={other.id}>
                  <Link to={`/revision/papers/${p.id}/q/${other.number}`} className="block rounded-lg border border-border bg-white px-3 py-2 text-[13px] hover:border-primary transition-colors">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-bold text-ink">{p.label} · Q{other.number}</span>
                      <Pill>{other.marks}m</Pill>
                    </div>
                    {other.caseName && <span className="text-[12px] text-muted">{other.caseName}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   /revision/topics — Topic mastery
   ───────────────────────────────────────────── */
export function TopicsIndex() {
  const allTopics = Object.values(TOPICS);
  const masteries = allTopics.map((t) => {
    const ratio = topicMastery(t.id, PAPERS);
    const occurrences = PAPERS.reduce((n, p) => n + p.questions.filter((q) => q.topics.includes(t.id)).length, 0);
    return { topic: t, ratio, occurrences };
  });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-white shadow-soft p-6 md:p-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Link to="/revision" className="chip text-muted hover:text-primary"><i className="fa-solid fa-arrow-left" /> Back</Link>
          <span className="chip text-primary"><i className="fa-solid fa-list-tree" /> Topic mastery</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink">
          Where to drill next
        </h1>
        <p className="mt-2 max-w-2xl text-ink/80 leading-relaxed">
          Mastery is computed from your last 5 attempts per topic. Empty bars mean no attempts logged yet —
          start with the highest-frequency topics (largest occurrence count) and work downward.
        </p>
      </motion.section>

      <SectionTitle icon="fa-solid fa-chart-simple">Topics ranked by frequency</SectionTitle>
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {masteries.sort((a, b) => b.occurrences - a.occurrences).map(({ topic: t, ratio, occurrences }) => {
          const pct = ratio === null ? null : Math.round(ratio * 100);
          return (
            <motion.div key={t.id} variants={fadeUp}>
              <Card className="!p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center text-primary"><i className={`fa-solid ${t.badge}`} /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg uppercase tracking-wide text-ink leading-tight">{t.title}</h3>
                    <div className="text-[11.5px] text-muted">{occurrences} questions in scope · Section {t.syllabus}</div>
                  </div>
                  <Link to={`/topic/${t.id}`} className="btn-outline !py-1.5 !px-2.5 !text-[11px]">
                    <i className="fa-solid fa-arrow-right" /> Drill
                  </Link>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1 text-[11px]">
                    <span className="uppercase tracking-wider text-muted font-bold">Mastery</span>
                    <span className="font-mono text-ink font-bold">{pct === null ? '—' : `${pct}%`}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className={cn('h-full transition-all', pct === null ? 'bg-slate-300' : pct >= 70 ? 'bg-primary' : pct >= 40 ? 'bg-accent' : 'bg-danger')} style={{ width: pct === null ? '6%' : `${pct}%` }} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   /progress — Dashboard
   ───────────────────────────────────────────── */
export function ProgressDashboard() {
  const attempts = loadAttempts();
  const totalMin = totalStudyMinutes();
  const papers = uniquePapersAttempted();

  const downloadCsv = () => {
    const csv = exportAttemptsCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tba-attempts-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const ratingCounts: Record<AttemptRating, number> = { again: 0, hard: 0, good: 0, easy: 0 };
  attempts.forEach((a) => { ratingCounts[a.selfRating]++; });

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      <motion.section variants={fadeUp} className="rounded-3xl border border-border bg-white shadow-soft p-6 md:p-10">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="chip text-primary"><i className="fa-solid fa-chart-line" /> Progress</span>
          <span className="chip">{attempts.length} attempts logged</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase text-ink">Your training log</h1>
        <p className="mt-2 max-w-2xl text-ink/80 leading-relaxed">
          Everything you&apos;ve done, on this device. Export to CSV to back it up before clearing browser data.
        </p>

        <div className="mt-5 grid sm:grid-cols-3 gap-3">
          <KpiTile label="Hours studied" value={`${(totalMin / 60).toFixed(1)}h`} sub={`${attempts.length} attempts`} tone="primary" />
          <KpiTile label="Papers touched" value={`${papers}`} sub={`of ${PAPERS.length}`} tone="accent" />
          <KpiTile label="Easy / Good ratio" value={`${ratingCounts.easy + ratingCounts.good}/${attempts.length || 1}`} sub="self-rated easy or good" tone="primary" />
        </div>

        <div className="mt-5">
          <button onClick={downloadCsv} className="btn-primary"><i className="fa-solid fa-download" /> Export attempts as CSV</button>
        </div>
      </motion.section>

      <SectionTitle icon="fa-solid fa-list">Recent attempts</SectionTitle>
      <motion.div variants={fadeUp}>
        <Card className="!p-0 overflow-hidden">
          {attempts.length === 0 ? (
            <p className="p-5 text-center text-muted">No attempts yet. Open <Link to="/revision/papers" className="text-primary hover:underline">Papers</Link> and pick one.</p>
          ) : (
            <table className="w-full text-[13.5px]">
              <thead className="bg-slate-50">
                <tr className="text-[11px] uppercase tracking-wider text-muted">
                  <th className="text-left px-4 py-2.5">When</th>
                  <th className="text-left px-4 py-2.5">Paper</th>
                  <th className="text-left px-4 py-2.5">Question</th>
                  <th className="text-right px-4 py-2.5">Time</th>
                  <th className="text-right px-4 py-2.5">Score</th>
                  <th className="text-right px-4 py-2.5">Rating</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 50).map((a) => {
                  const p = getPaper(a.paperId);
                  const q = p?.questions.find((x) => x.id === a.questionId);
                  const minutes = a.finishedAt ? Math.round((a.finishedAt - a.startedAt) / 60_000) : null;
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-2.5 text-muted">{fmtDate(a.startedAt)}</td>
                      <td className="px-4 py-2.5 text-ink">{p?.label || a.paperId}</td>
                      <td className="px-4 py-2.5 text-ink">{q ? `Q${q.number}${q.caseName ? ` · ${q.caseName}` : ''}` : a.questionId}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{minutes !== null ? `${minutes}m` : '—'}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{typeof a.selfScore === 'number' && q ? `${a.selfScore}/${q.marks}` : '—'}</td>
                      <td className="px-4 py-2.5 text-right">
                        <Pill variant={a.selfRating === 'easy' || a.selfRating === 'good' ? 'primary' : a.selfRating === 'hard' ? 'accent' : 'danger'}>
                          {a.selfRating}
                        </Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ─── shared bits ───────────────────────────── */

function Navigate() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/revision', { replace: true }); }, [navigate]);
  return null;
}

function CtaCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <Card className="h-full hover:border-primary transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/15 grid place-items-center text-primary"><i className={`fa-solid ${icon}`} /></div>
        <h3 className="font-display text-lg uppercase tracking-wide text-ink">{title}</h3>
      </div>
      <p className="text-[13px] text-ink/75 leading-relaxed">{body}</p>
      <span className="text-[12px] text-primary font-bold mt-2 inline-block">Open <i className="fa-solid fa-arrow-right" /></span>
    </Card>
  );
}

function KpiTile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: 'primary' | 'accent' }) {
  const colors = tone === 'primary' ? 'border-primary/30 bg-primary/5 text-primary' : 'border-accent/40 bg-accent/5 text-accent-dark';
  return (
    <div className={cn('rounded-2xl border p-4', colors)}>
      <div className="text-[11px] uppercase tracking-wider text-muted font-bold">{label}</div>
      <div className="font-display text-3xl mt-1 leading-none">{value}</div>
      <div className="text-[12px] text-ink/70 mt-1 truncate">{sub}</div>
    </div>
  );
}

function Heatmap({ years, attempts }: { years: number[]; attempts: { startedAt: number }[] }) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const cellCount = (y: number, m: number) => attempts.filter((a) => {
    const d = new Date(a.startedAt);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
  const max = Math.max(1, ...years.flatMap((y) => months.map((_, m) => cellCount(y, m))));
  const intensity = (n: number) => n === 0 ? 0 : 0.2 + (n / max) * 0.8;

  return (
    <div className="overflow-x-auto">
      <table className="text-[11px]">
        <thead>
          <tr>
            <th className="text-left pr-2 pb-1 font-bold text-muted uppercase tracking-wider">Year</th>
            {months.map((m) => <th key={m} className="px-1 pb-1 text-muted font-bold uppercase tracking-wider">{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {years.map((y) => (
            <tr key={y}>
              <td className="pr-2 py-0.5 font-bold text-ink">{y}</td>
              {months.map((_, m) => {
                const n = cellCount(y, m);
                const a = intensity(n);
                return (
                  <td key={m} className="p-0.5">
                    <div
                      title={`${months[m]} ${y}: ${n} attempt${n === 1 ? '' : 's'}`}
                      className="w-7 h-7 rounded"
                      style={{ background: a === 0 ? '#e2e8f0' : `rgba(0,163,71,${a.toFixed(2)})` }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
