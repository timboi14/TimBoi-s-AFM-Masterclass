import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TOPICS, TOPIC_LIST, type Drill } from '@/data/topics';
import { Card, CoachTip, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { store, useStore } from '@/lib/store';
import { GoalBurst } from '@/components/Confetti';
import { TopicTabs, type TopicTab } from '@/components/TopicTabs';
import { cn } from '@/lib/cn';

export function TopicPage() {
  const { id = 'adviser' } = useParams();
  const topic = TOPICS[id];

  if (!topic) return <Navigate to="/" replace />;

  const tabs: TopicTab[] = [
    { id: 'notes', label: 'Notes', icon: 'fa-book-open', render: () => <NotesTab topic={topic} /> },
    { id: 'formulas', label: 'Formulas', icon: 'fa-square-root-variable', render: () => <FormulasTab topic={topic} /> },
    { id: 'worked', label: 'Worked', icon: 'fa-pen-ruler', render: () => <WorkedTab topic={topic} /> },
    { id: 'drills', label: 'Drills', icon: 'fa-stopwatch-20', render: () => <DrillsTab topic={topic} /> },
    { id: 'pitfalls', label: 'Pitfalls', icon: 'fa-triangle-exclamation', render: () => <PitfallsTab topic={topic} /> },
  ];

  return (
    <motion.div initial="hidden" animate="show" variants={stagger}>
      {/* HEADER */}
      <motion.div variants={fadeUp}>
        <Card className="!p-7 relative overflow-hidden border-l-4 border-l-primary">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary text-bg text-[10px] font-bold uppercase tracking-widest rounded-bl-xl">
            {topic.matchday}
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 grid place-items-center text-primary text-xl">
              <i className={`fa-solid ${topic.badge}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Pill variant="primary">Section {topic.syllabus}</Pill>
                {topic.papers.map((p) => (
                  <Pill key={p}>{p}</Pill>
                ))}
              </div>
              <h1 className="font-display text-3xl md:text-4xl tracking-wide uppercase">{topic.title}</h1>
              <p className="text-text/80 mt-2 max-w-2xl leading-relaxed">{topic.hook}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ACCESSIBLE TABS */}
      <motion.div variants={fadeUp} className="mt-6">
        <TopicTabs tabs={tabs} defaultId="notes" />
      </motion.div>

      {/* NEXT FIXTURE */}
      <SectionTitle icon="fa-solid fa-forward">Next fixture</SectionTitle>
      <NextFixture currentId={topic.id} />
    </motion.div>
  );
}

/* TAB CONTENT ----------------------------------------------------------- */

function NotesTab({ topic }: { topic: ReturnType<typeof getTopic> }) {
  useEffect(() => {
    topic.notes.forEach((_, i) => store.markNoteRead(`${topic.id}-${i}`));
  }, [topic.id]);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5">
      {topic.notes.map((n, i) => (
        <motion.div key={i} variants={fadeUp}>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-lg grid place-items-center bg-accent text-bg font-display text-base">
                {i + 1}
              </span>
              <h3 className="font-display text-2xl tracking-wide uppercase">{n.heading}</h3>
            </div>
            <p className="text-text/85 leading-relaxed">{n.intro}</p>
            <div className="mt-4 grid gap-2">
              {n.bullets.map((b, bi) => (
                <div key={bi} className="flex items-start gap-3">
                  <i className="fa-solid fa-circle-check text-primary mt-1 text-sm" />
                  <span className="text-text/85 leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3.5 rounded-xl border border-primary/30 bg-primary/[0.06]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-1">
                <i className="fa-solid fa-bullseye mr-1" /> Apply
              </div>
              <p className="text-text/90 text-[14px] leading-relaxed">{n.apply}</p>
            </div>
            {n.coach && <CoachTip title={n.coach.title}>{n.coach.body}</CoachTip>}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function FormulasTab({ topic }: { topic: ReturnType<typeof getTopic> }) {
  if (topic.formulas.length === 0) {
    return (
      <Card>
        <p className="text-muted">No formulas required for this fixture. The marks are in technique.</p>
        <Link to="/formulas" className="btn-outline mt-3">
          <i className="fa-solid fa-square-root-variable" /> Open the full formula sheet
        </Link>
      </Card>
    );
  }
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
      {topic.formulas.map((f) => (
        <motion.div key={f.name} variants={fadeUp}>
          <Card className="group cursor-help">
            <Pill variant="primary" className="mb-2">{f.category}</Pill>
            <h4 className="font-display text-xl tracking-wide uppercase">{f.name}</h4>
            <div className="mt-3 p-3.5 rounded-lg bg-slate-50 border border-border font-mono text-accent text-[15px] overflow-x-auto whitespace-nowrap">
              {f.formula}
            </div>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 grid gap-1"
            >
              {f.variables.map((v, i) => (
                <div key={i} className="text-[12.5px] text-muted leading-relaxed">
                  <span className="text-text/80">•</span> {v}
                </div>
              ))}
            </motion.div>
            <div className="mt-3 text-[12.5px] text-text/70 italic leading-relaxed border-t border-border pt-2">
              {f.context}
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function WorkedTab({ topic }: { topic: ReturnType<typeof getTopic> }) {
  return (
    <Card>
      <h3 className="font-display text-2xl tracking-wide uppercase mb-4">{topic.worked.title}</h3>
      <ol className="grid gap-3">
        {topic.worked.steps.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3"
          >
            <span className="w-8 h-8 shrink-0 rounded-full bg-primary text-bg grid place-items-center font-display">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="text-accent text-[11px] uppercase tracking-[0.18em] font-bold">{s.label}</div>
              <div className="text-text/85 text-[14px] leading-relaxed">{s.detail}</div>
              {s.calc && (
                <div className="mt-1 inline-block p-2 rounded bg-slate-50 border border-border font-mono text-primary text-[13.5px]">
                  {s.calc}
                </div>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
      <div className="mt-5 p-4 rounded-xl border-2 border-primary bg-primary/[0.08]">
        <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-1">Result</div>
        <div className="text-text font-bold leading-relaxed">{topic.worked.result}</div>
      </div>
    </Card>
  );
}

function DrillsTab({ topic }: { topic: ReturnType<typeof getTopic> }) {
  if (topic.drills.length === 0) {
    return <Card><p className="text-muted">No drill yet for this fixture.</p></Card>;
  }
  return (
    <div className="grid gap-5">
      {topic.drills.map((d) => (
        <DrillCard key={d.id} drill={d} />
      ))}
    </div>
  );
}

function DrillCard({ drill }: { drill: Drill }) {
  const [reveal, setReveal] = useState(false);
  const [marked, setMarked] = useState<'right' | 'wrong' | null>(null);
  const [secs, setSecs] = useState(90);
  const [running, setRunning] = useState(false);
  const [burst, setBurst] = useState(false);
  const state = useStore();

  useEffect(() => {
    if (!running) return;
    if (secs <= 0) { setRunning(false); return; }
    const id = setInterval(() => setSecs((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, secs]);

  const start = () => { setSecs(90); setReveal(false); setMarked(null); setRunning(true); };
  const showAnswer = () => {
    setReveal(true);
    setRunning(false);
    if (!state.notesRead.includes(`drill-shown-${drill.id}`)) {
      store.awardShown(drill.id);
      store.markNoteRead(`drill-shown-${drill.id}`);
    }
  };
  const correct = () => {
    if (marked === 'right') return;
    setMarked('right');
    store.awardCorrect(drill.id);
    setBurst(true);
  };
  const wrong = () => {
    setMarked('wrong');
    const cur = store.get();
    if (!cur.weakAreas.includes(drill.id)) {
      store.set({ weakAreas: [...cur.weakAreas, drill.id] });
    }
  };

  return (
    <Card glow>
      <GoalBurst play={burst} onDone={() => setBurst(false)} />
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Pill variant="primary">{drill.marks} marks</Pill>
        <Pill>90 sec drill</Pill>
        <span className="ml-auto font-mono text-2xl text-accent">
          <i className="fa-solid fa-stopwatch mr-2" />
          {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(secs % 60).padStart(2, '0')}
        </span>
      </div>
      <p className="text-text font-bold leading-relaxed">{drill.prompt}</p>
      {drill.approach.length > 0 && (
        <div className="mt-3 grid gap-1.5">
          {drill.approach.map((a, i) => (
            <div key={i} className="text-[13px] text-muted">
              <i className="fa-solid fa-angles-right text-accent mr-2" /> {a}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!running && !reveal && (
          <button className="btn-primary" onClick={start}>
            <i className="fa-solid fa-play" /> Start 90s drill
          </button>
        )}
        <button className="btn-outline" onClick={showAnswer}>
          <i className="fa-solid fa-eye" /> Show answer (+50 pts)
        </button>
      </div>

      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {drill.workings.length > 0 && (
              <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-border font-mono text-[13px] grid gap-1">
                {drill.workings.map((w, i) => (
                  <div key={i} className="text-text/80">{w}</div>
                ))}
              </div>
            )}
            <div className="mt-3 p-4 rounded-xl border-2 border-primary bg-primary/[0.08]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary font-bold mb-1">Model answer</div>
              <p className="text-text leading-relaxed">{drill.answer}</p>
            </div>
            <div className="mt-3 p-3.5 rounded-lg border border-danger/40 bg-danger/[0.06]">
              <div className="text-[11px] uppercase tracking-[0.18em] text-danger font-bold mb-1">
                <i className="fa-solid fa-triangle-exclamation mr-1" /> Trap
              </div>
              <p className="text-text/85 text-[13.5px] leading-relaxed">{drill.trap}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className={cn('btn', marked === 'right' ? 'bg-primary text-bg' : 'btn-outline border-primary text-primary')}
                onClick={correct}
              >
                <i className="fa-solid fa-check" /> I had it
              </button>
              <button
                className={cn('btn', marked === 'wrong' ? 'bg-danger text-white' : 'btn-outline border-danger text-danger')}
                onClick={wrong}
              >
                <i className="fa-solid fa-xmark" /> I missed it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function PitfallsTab({ topic }: { topic: ReturnType<typeof getTopic> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
      {topic.pitfalls.map((p, i) => (
        <motion.div key={i} variants={fadeUp}>
          <Card className="border-l-4 border-l-danger">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-danger/15 grid place-items-center text-danger shrink-0">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <div>
                <h4 className="font-bold text-[15px]">{p.title}</h4>
                <p className="text-text/80 mt-1.5 text-[13.5px] leading-relaxed">{p.body}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function NextFixture({ currentId }: { currentId: string }) {
  const idx = TOPIC_LIST.findIndex((t) => t.id === currentId);
  const next = TOPIC_LIST[(idx + 1) % TOPIC_LIST.length];
  return (
    <Link to={`/topic/${next.id}`}>
      <Card className="hover:border-primary transition-colors">
        <div className="flex items-center gap-4">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted">Up next</div>
          <Pill variant="primary">{next.matchday}</Pill>
          <h3 className="font-display text-xl tracking-wide uppercase">{next.title}</h3>
          <i className="fa-solid fa-arrow-right ml-auto text-primary" />
        </div>
      </Card>
    </Link>
  );
}

function getTopic() {
  return TOPIC_LIST[0];
}
