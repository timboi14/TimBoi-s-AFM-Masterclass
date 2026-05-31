import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, Pill, SectionTitle, fadeUp, stagger } from '@/components/primitives';
import { cn } from '@/lib/cn';
import { DIAGNOSTIC_ITEMS, type DiagItem } from '@/data/diagnostic-items';
import {
  type DiagState,
  initialState,
  pickNext,
  applyResponse,
  mastery,
  rankWeakAreas,
} from '@/lib/diagnostic';
import { AFM_SYLLABUS } from '@/data/syllabus';
import { safeWriteJson } from '@/lib/safe-storage';
import { store } from '@/lib/store';

const N_QUESTIONS = 10;
const PROFILE_KEY = 'tba.diagnostic.profile.v1';

interface DiagnosticProfile {
  takenAt: number;
  theta: number;
  se: number;
  mastery: Record<string, number>;
  weakAreas: string[]; // capability refs A1..E5, ranked weak-first
}

export function DiagnosticPage() {
  const [state, setState] = useState<DiagState>(() => initialState());
  const [currentItem, setCurrentItem] = useState<DiagItem | null>(() => pickNext(initialState(), DIAGNOSTIC_ITEMS));
  const [chosen, setChosen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  const answered = state.responses.length;
  const progress = Math.round((answered / N_QUESTIONS) * 100);

  const submit = () => {
    if (chosen === null || !currentItem) return;
    const isCorrect = chosen === currentItem.correctIdx;
    setRevealed(true);
    const next = applyResponse(state, currentItem, isCorrect);
    setState(next);
    if (next.responses.length >= N_QUESTIONS) {
      // Finalise and persist the profile.
      const m = mastery(next.theta, DIAGNOSTIC_ITEMS);
      const ranked = rankWeakAreas(m);
      const profile: DiagnosticProfile = {
        takenAt: Date.now(),
        theta: next.theta,
        se: next.se,
        mastery: m,
        weakAreas: ranked.map((r) => r.capability),
      };
      safeWriteJson(PROFILE_KEY, profile);
      // Mirror weakest 3 caps into the global store so other pages can read them.
      store.set({ weakAreas: ranked.slice(0, 3).map((r) => r.capability) });
      setFinished(true);
    }
  };

  const advance = () => {
    setRevealed(false);
    setChosen(null);
    const nextItem = pickNext(state, DIAGNOSTIC_ITEMS);
    setCurrentItem(nextItem);
  };

  const finalProfile = useMemo(() => {
    if (!finished) return null;
    const m = mastery(state.theta, DIAGNOSTIC_ITEMS);
    return { mastery: m, ranked: rankWeakAreas(m) };
  }, [finished, state.theta]);

  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl mx-auto">
      <motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-white to-accent/[0.10]" />
        <div className="relative p-6 md:p-10">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="chip text-primary"><i className="fa-solid fa-stopwatch" /> 10-minute screener</span>
            <span className="chip">IRT 2-PL · adaptive</span>
            {finished && <span className="chip text-accent-dark"><i className="fa-solid fa-circle-check" /> Done</span>}
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-wide uppercase text-ink leading-[0.95]">
            Diagnostic.
            <br />
            <span className="text-gradient">Find your weak areas in 10 questions.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-ink/80 leading-relaxed">
            Adaptive — each question is chosen to give the most information about your current ability across the 23 AFM capabilities.
            Your score at the end maps to a per-capability mastery score and a recommended 4-week study plan.
          </p>
        </div>
      </motion.section>

      {!finished && currentItem && (
        <>
          <SectionTitle icon="fa-solid fa-clipboard-question" badge={<Pill variant="primary">{answered + 1} of {N_QUESTIONS}</Pill>}>
            Question {answered + 1}
          </SectionTitle>
          <motion.div variants={fadeUp}>
            <Card>
              <div className="mb-2 h-1.5 rounded-full bg-slate-100 overflow-hidden" aria-label={`Progress: ${progress}%`}>
                <div className="h-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted mt-3 mb-2">
                Probing capability {currentItem.capability}
              </div>
              <p className="text-[15.5px] text-ink leading-relaxed mb-4">{currentItem.stem}</p>
              <div className="space-y-2" role="radiogroup" aria-label="Answer options">
                {currentItem.options.map((opt, i) => {
                  const isCorrect = i === currentItem.correctIdx;
                  const isChosen = chosen === i;
                  const showResult = revealed;
                  return (
                    <button
                      key={i}
                      role="radio"
                      aria-checked={isChosen}
                      disabled={revealed}
                      onClick={() => setChosen(i)}
                      className={cn(
                        'w-full text-left rounded-xl border px-4 py-3 text-[14px] transition-colors',
                        !showResult && isChosen && 'border-primary bg-primary/5',
                        !showResult && !isChosen && 'border-border bg-white hover:border-primary/50',
                        showResult && isCorrect && 'border-primary bg-primary/10 text-ink',
                        showResult && !isCorrect && isChosen && 'border-danger bg-danger/10 text-ink',
                        showResult && !isCorrect && !isChosen && 'border-border bg-white opacity-60',
                      )}
                    >
                      <span className="inline-block w-6 h-6 mr-2 text-[12px] font-bold leading-6 text-center rounded-full bg-ink/10">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {showResult && isCorrect && <i className="fa-solid fa-check ml-2 text-primary" />}
                      {showResult && isChosen && !isCorrect && <i className="fa-solid fa-xmark ml-2 text-danger" />}
                    </button>
                  );
                })}
              </div>
              {revealed && currentItem.rationale && (
                <div className="mt-4 rounded-xl border border-accent/40 bg-accent/[0.08] px-4 py-3 text-[13.5px] text-ink leading-relaxed">
                  <strong className="text-accent-dark">Why:</strong> {currentItem.rationale}
                </div>
              )}
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-[11px] text-muted font-mono">
                  θ ≈ {state.theta.toFixed(2)} · SE {state.se.toFixed(2)}
                </div>
                {!revealed ? (
                  <button
                    disabled={chosen === null}
                    onClick={submit}
                    className="btn-primary disabled:opacity-40"
                  >
                    Submit answer <i className="fa-solid fa-arrow-right" />
                  </button>
                ) : (
                  <button onClick={advance} className="btn-primary">
                    Next question <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      )}

      {finished && finalProfile && (
        <>
          <SectionTitle icon="fa-solid fa-chart-line" badge={<Pill variant="primary">Result</Pill>}>
            Your mastery map
          </SectionTitle>
          <motion.div variants={fadeUp}>
            <Card>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted mb-1">Ability θ</div>
                  <div className="font-display text-3xl uppercase text-ink">{state.theta.toFixed(2)}</div>
                  <div className="text-[12px] text-muted mt-1">SE ± {state.se.toFixed(2)} · range −3 to +3</div>
                </div>
                <div className="rounded-2xl border border-border bg-white p-4">
                  <div className="text-[11px] uppercase tracking-wider text-muted mb-1">Capabilities probed</div>
                  <div className="font-display text-3xl uppercase text-ink">
                    {new Set(state.responses.map((r) => r.capability)).size} / 23
                  </div>
                  <div className="text-[12px] text-muted mt-1">{state.responses.length} answers</div>
                </div>
              </div>
              <div className="text-[11px] uppercase tracking-wider text-muted mb-2">Weakest 5 — start drilling here</div>
              <div className="space-y-2">
                {finalProfile.ranked.slice(0, 5).map((r) => {
                  const cap = AFM_SYLLABUS.find((c) => c.ref === r.capability);
                  const pct = Math.round(r.mastery * 100);
                  return (
                    <Link
                      key={r.capability}
                      to={cap?.tbaTopicId ? `/topic/${cap.tbaTopicId}` : '/course#syllabus'}
                      className="block rounded-xl border border-border bg-white px-4 py-3 hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-ink">{r.capability} · {cap?.capability ?? 'Capability'}</div>
                          <div className="text-[12px] text-muted">Mastery {pct}%</div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-primary" />
                      </div>
                      <div className="h-1.5 mt-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn('h-full', pct < 40 ? 'bg-danger' : pct < 60 ? 'bg-accent' : 'bg-primary')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                <Link to="/study-guide" className="btn-primary">
                  <i className="fa-solid fa-rocket" /> Open my 4-week plan
                </Link>
                <Link to="/training" className="btn">
                  <i className="fa-solid fa-dumbbell" /> Drill weak areas
                </Link>
                <button
                  onClick={() => {
                    if (!confirm('Retake the diagnostic? Your current result will be kept in history.')) return;
                    setState(initialState());
                    setCurrentItem(pickNext(initialState(), DIAGNOSTIC_ITEMS));
                    setChosen(null);
                    setRevealed(false);
                    setFinished(false);
                  }}
                  className="btn border border-border bg-white text-ink hover:bg-slate-50"
                >
                  <i className="fa-solid fa-rotate" /> Retake
                </button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
