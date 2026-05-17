import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PAPERS } from '@/data/pastpapers/papers';
import {
  composeMock,
  freshSeed,
  loadMockReport,
  loadMockState,
  MOCK_DURATION_SECONDS,
  saveMockReport,
  saveMockState,
  type MockReport,
  type MockReportPart,
  type MockState,
} from '@/lib/mockComposer';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';

/**
 * Composite Mock — three routes:
 *   /training/mock              briefing + Start button
 *   /training/mock/sit/:id      live sitting (3h 15m timer, Coach disabled)
 *   /training/mock/report/:id   per-part report
 *
 * Work Item 4 of the Platinum-tier upgrade.
 */

const COACH_DISABLED_KEY = 'tba.coach.disabled';

// ─── Briefing page ──────────────────────────────────────────────────
export function MockBriefingPage() {
  const navigate = useNavigate();

  const start = () => {
    const seed = freshSeed();
    const comp = composeMock(seed);
    const startedAt = Date.now();
    const state: MockState = {
      id: comp.id,
      seed,
      startedAt,
      endsAt: startedAt + MOCK_DURATION_SECONDS * 1000,
      sectionAId: comp.sectionA.id,
      b1Id: comp.b1.id,
      b2Id: comp.b2.id,
      activePaperId: comp.sectionA.id,
      answers: {},
      lastPivotAt: startedAt,
    };
    saveMockState(state);
    sessionStorage.setItem(COACH_DISABLED_KEY, '1');
    navigate(`/training/mock/sit/${state.id}`);
  };

  return (
    <SectionShell tone="white" pad="lg">
      <CenteredHero
        eyebrow={<>Composite mock · 3h 15m · auto-submit at zero</>}
        headline={<>Sit a <HeroGold>full mock</HeroGold>.</>}
        subline={
          <>
            One Section A 50-mark paper + two Section B 25-mark papers, drawn
            from the bank with no topic duplication. Coach is locked off for
            the duration. Timer auto-submits and routes you to the report.
          </>
        }
      />
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Stat label="Duration" value="3h 15m" sub="Real exam length" />
        <Stat label="Composition" value="A + B + B" sub="50 + 25 + 25 marks" />
        <Stat label="Topic spread" value="3 areas" sub="No topic repeats" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={start}
          className="px-5 py-3 rounded-2xl bg-primary text-white font-display tracking-wide uppercase text-[14px] hover:brightness-110"
        >
          Start the mock →
        </button>
        <Link to="/training" className="text-[13px] text-muted hover:text-ink underline">
          Back to training
        </Link>
      </div>
    </SectionShell>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 text-center">
      <div className="text-[11px] uppercase tracking-wider text-muted font-bold">{label}</div>
      <div className="font-display text-3xl text-ink mt-1">{value}</div>
      <div className="text-[12px] text-muted mt-1">{sub}</div>
    </div>
  );
}

// ─── Sitting page ───────────────────────────────────────────────────
export function MockSittingPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<MockState | null>(() => loadMockState(id));
  const [now, setNow] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(COACH_DISABLED_KEY, '1');
    return () => { sessionStorage.removeItem(COACH_DISABLED_KEY); };
  }, []);

  useEffect(() => {
    const tid = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tid);
  }, []);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (state && !state.submittedAt) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [state]);

  if (!state) {
    return (
      <SectionShell tone="white" pad="lg">
        <p className="text-[14px] text-ink">
          Mock not found. <Link to="/training/mock" className="text-primary">Start a new one</Link>.
        </p>
      </SectionShell>
    );
  }

  const msLeft = Math.max(0, state.endsAt - now);
  if (msLeft === 0 && !state.submittedAt && !submitting) {
    setSubmitting(true);
    const submitted: MockState = { ...state, submittedAt: now };
    saveMockState(submitted);
    void submitMock(submitted).then(() => navigate(`/training/mock/report/${state.id}`));
  }

  const hh = Math.floor(msLeft / 3600000);
  const mm = Math.floor((msLeft % 3600000) / 60000);
  const ss = Math.floor((msLeft % 60000) / 1000);
  const seconds = Math.floor(msLeft / 1000);
  const danger = seconds < 600;
  const flashing = seconds < 60;

  const papers = [
    PAPERS.find((p) => p.id === state.sectionAId),
    PAPERS.find((p) => p.id === state.b1Id),
    PAPERS.find((p) => p.id === state.b2Id),
  ].filter(Boolean) as NonNullable<ReturnType<typeof PAPERS.find>>[];

  const pivot = (paperId: string) => {
    const ts = Date.now();
    const elapsed = ts - state.lastPivotAt;
    const cur = state.answers[state.activePaperId] ?? { partLabel: '', word: '', timeMs: 0 };
    const updated: MockState = {
      ...state,
      activePaperId: paperId,
      lastPivotAt: ts,
      answers: { ...state.answers, [state.activePaperId]: { ...cur, timeMs: cur.timeMs + elapsed } },
    };
    setState(updated);
    saveMockState(updated);
  };

  const updateWord = (paperId: string, word: string) => {
    const cur = state.answers[paperId] ?? { partLabel: '', word: '', timeMs: 0 };
    const updated: MockState = {
      ...state,
      answers: { ...state.answers, [paperId]: { ...cur, word } },
    };
    setState(updated);
    saveMockState(updated);
  };

  const submitNow = async () => {
    if (!window.confirm('Submit and view the report now?')) return;
    setSubmitting(true);
    const submitted: MockState = { ...state, submittedAt: Date.now() };
    saveMockState(submitted);
    await submitMock(submitted);
    navigate(`/training/mock/report/${state.id}`);
  };

  return (
    <SectionShell tone="white" pad="md">
      <div className="sticky top-0 z-30 -mt-4 mb-4 py-3 bg-white/95 backdrop-blur border-b border-border flex items-center gap-3 flex-wrap">
        <div
          className="font-display text-3xl font-bold"
          style={{ color: danger ? '#dc2626' : '#0a0f1e', animation: flashing ? 'cbeFlash 1s infinite' : 'none' }}
          aria-live="polite"
        >
          {String(hh).padStart(2, '0')}:{String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </div>
        <span className="text-[11px] uppercase tracking-wider text-muted font-bold">remaining · auto-submit at zero</span>
        <span
          className="ml-auto inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold bg-slate-100 text-muted border border-border"
          title="Coach off during mocks. Available again on submission."
        >
          <i className="fa-solid fa-volume-xmark" aria-hidden /> Coach locked
        </span>
        <button
          onClick={submitNow}
          disabled={submitting}
          className="px-3 py-1.5 rounded-lg bg-danger text-white font-bold text-[12px] hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit now'}
        </button>
      </div>

      <p className="text-[12px] text-muted mb-3">
        Click a panel header to focus on that paper. Time-per-part tracked automatically.
      </p>

      <div className="space-y-3">
        {papers.map((p) => {
          const active = state.activePaperId === p.id;
          const ans = state.answers[p.id] ?? { partLabel: '', word: '', timeMs: 0 };
          const elapsed = active ? ans.timeMs + (now - state.lastPivotAt) : ans.timeMs;
          return (
            <details
              key={p.id}
              open={active}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) pivot(p.id);
              }}
              className="rounded-2xl border border-border bg-white overflow-hidden"
            >
              <summary className="px-4 py-3 cursor-pointer flex items-center justify-between bg-slate-50 border-b border-border">
                <span className="font-bold text-ink">
                  {p.name} <span className="text-muted font-normal">· Section {p.paperSection} · {p.totalMarks}m</span>
                </span>
                <span className="font-mono text-[12px] text-muted">{formatElapsed(elapsed)}</span>
              </summary>
              <div className="p-4">
                <p className="text-[12.5px] text-muted mb-2 italic">
                  {p.questionParts[0]?.requirement?.slice(0, 220) ?? p.name}
                </p>
                <textarea
                  rows={12}
                  value={ans.word}
                  onChange={(e) => updateWord(p.id, e.target.value)}
                  className="w-full resize-y px-3 py-2 rounded-lg border border-border bg-white text-[14px] focus:outline-none focus:border-primary font-mono leading-relaxed"
                  placeholder={`Type your answer for ${p.name}. Markdown is fine.`}
                />
              </div>
            </details>
          );
        })}
      </div>
    </SectionShell>
  );
}

function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

// ─── Submit logic ───────────────────────────────────────────────────
async function submitMock(state: MockState): Promise<void> {
  const papers = [
    PAPERS.find((p) => p.id === state.sectionAId),
    PAPERS.find((p) => p.id === state.b1Id),
    PAPERS.find((p) => p.id === state.b2Id),
  ].filter(Boolean) as NonNullable<ReturnType<typeof PAPERS.find>>[];
  const submittedAt = state.submittedAt ?? Date.now();
  const parts: MockReportPart[] = [];

  for (const p of papers) {
    for (const part of p.questionParts) {
      const ans = state.answers[p.id]?.word ?? '';
      const timeMs = state.answers[p.id]?.timeMs ?? 0;
      const timeMinutes = Math.round(timeMs / 1000 / 60 / Math.max(p.questionParts.length, 1));
      let feedback = '';
      let scorePct: number | null = null;
      if (ans.trim().length > 0) {
        try {
          const res = await fetch('/api/mark', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              paperName: p.name,
              paperSession: p.session,
              partLabel: part.label,
              partMarks: part.marks,
              partRequirement: part.requirement,
              markingPoints: part.markingPoints,
              examinerCommentary: part.examinerCommentary,
              studentWord: ans,
              studentSheet: '',
            }),
          });
          if (res.ok && res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let acc = '';
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              acc += decoder.decode(value, { stream: true });
            }
            feedback = acc;
            scorePct = extractScorePct(acc);
          }
        } catch {
          // best-effort
        }
      }
      parts.push({
        paperId: p.id,
        paperName: p.name,
        partLabel: part.label,
        marks: part.marks,
        scorePct,
        feedback,
        timeMinutes,
      });
    }
  }

  const allFeedback = parts.map((p) => p.feedback).join('\n');
  const psRubric = derivePsRubric(allFeedback);
  let threeFixes: string[] = [];
  try {
    const res = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        paperName: 'Composite Mock',
        paperSession: new Date(submittedAt).toLocaleDateString('en-GB'),
        partLabel: 'overall',
        partRequirement:
          "You are reviewing a candidate's full 100-mark AFM mock. Return EXACTLY three concrete fixes, each starting with a verb, max 18 words each. No preamble, no numbering — just one fix per line.",
        markingPoints: [],
        paperContext: parts
          .map((pp) => `${pp.paperName} ${pp.partLabel} (${pp.marks}m) score=${pp.scorePct ?? '?'} feedback="${pp.feedback.slice(0, 400)}"`)
          .join('\n'),
      }),
    });
    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
      }
      threeFixes = acc
        .split(/\r?\n/)
        .map((l) => l.replace(/^[-*\d.\s]+/, '').trim())
        .filter((l) => l.length > 0 && l.length < 240)
        .slice(0, 3);
    }
  } catch {
    // ignore
  }

  const report: MockReport = {
    id: state.id,
    startedAt: state.startedAt,
    submittedAt,
    parts,
    psRubric,
    threeFixes,
  };
  saveMockReport(report);
}

function extractScorePct(feedback: string): number | null {
  const fraction = feedback.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (fraction) {
    const num = parseFloat(fraction[1]);
    const den = parseFloat(fraction[2]);
    if (den > 0) return Math.max(0, Math.min(100, (num / den) * 100));
  }
  const pct = feedback.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pct) return Math.max(0, Math.min(100, parseFloat(pct[1])));
  return null;
}

function derivePsRubric(text: string): MockReport['psRubric'] {
  const score = (rx: RegExp): number => {
    const negatives = (text.match(rx) ?? []).length;
    return Math.max(0, Math.min(5, 5 - negatives));
  };
  return {
    communication: score(/unclear|hard to follow|messy structure/i),
    analysis: score(/no sensitivity|insufficient analysis|surface-level/i),
    scepticism: score(/unquestioned|unchallenged assumption|accepts/i),
    commercial: score(/no stakeholder|impractical|generic recommendation/i),
  };
}

// ─── Report page ────────────────────────────────────────────────────
export function MockReportPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [report, setReport] = useState<MockReport | null>(() => loadMockReport(id));

  useEffect(() => {
    sessionStorage.removeItem(COACH_DISABLED_KEY);
    const i = window.setInterval(() => {
      const r = loadMockReport(id);
      if (r && (!report || r.parts.length !== report.parts.length)) setReport(r);
    }, 2000);
    return () => window.clearInterval(i);
  }, [id, report]);

  if (!report) {
    return (
      <SectionShell tone="white" pad="lg">
        <p className="text-[14px] text-ink">
          Marking your mock… If this takes more than a minute, the AI provider may be busy.
          <br />
          <Link to="/training/mock" className="text-primary">Start a new mock</Link>.
        </p>
      </SectionShell>
    );
  }

  const totalScore = report.parts.reduce(
    (n, p) => n + (p.scorePct !== null ? (p.scorePct / 100) * p.marks : 0),
    0,
  );
  const totalMarks = report.parts.reduce((n, p) => n + p.marks, 0);
  const totalMinutes = report.parts.reduce((n, p) => n + p.timeMinutes, 0);
  const psTotal =
    report.psRubric.communication +
    report.psRubric.analysis +
    report.psRubric.scepticism +
    report.psRubric.commercial;

  return (
    <SectionShell tone="white" pad="lg">
      <div className="mock-report">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <h1 className="font-display text-3xl tracking-wide uppercase text-ink">Mock report</h1>
            <p className="text-[12.5px] text-muted">
              Submitted {new Date(report.submittedAt).toLocaleString('en-GB')} · {totalMinutes} minutes total
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-ink text-white font-bold text-[12px] no-print"
            aria-label="Print report"
          >
            <i className="fa-solid fa-print mr-1.5" aria-hidden /> Print
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-5">
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Total marks</div>
            <div className="font-display text-3xl text-ink">{Math.round(totalScore)} / {totalMarks}</div>
            <div className="text-[12px] text-muted">{totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0}%</div>
          </div>
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Professional skills</div>
            <div className="font-display text-3xl text-ink">{psTotal} / 20</div>
            <div className="text-[12px] text-muted">
              Comm {report.psRubric.communication} · An {report.psRubric.analysis} · Sc {report.psRubric.scepticism} · Co {report.psRubric.commercial}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-white p-3">
            <div className="text-[11px] uppercase tracking-wider text-muted font-bold">Time spent</div>
            <div className="font-display text-3xl text-ink">{totalMinutes}m</div>
            <div className="text-[12px] text-muted">of 195m budget</div>
          </div>
        </div>

        {report.threeFixes.length > 0 && (
          <div className="rounded-2xl border-l-4 border-l-accent bg-accent/[0.05] p-4 mb-5">
            <h2 className="text-[11px] uppercase tracking-wider text-accent-dark font-bold mb-2">Three things to fix before next mock</h2>
            <ol className="list-decimal pl-5 space-y-1 text-[14px] text-ink">
              {report.threeFixes.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ol>
          </div>
        )}

        <h2 className="font-display text-xl tracking-wide uppercase text-ink mb-2">Per-part breakdown</h2>
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <table className="w-full text-[13.5px]">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-muted font-bold">
              <tr>
                <th className="text-left px-3 py-2">Paper</th>
                <th className="text-left px-3 py-2">Part</th>
                <th className="text-right px-3 py-2">Marks</th>
                <th className="text-right px-3 py-2">Score</th>
                <th className="text-right px-3 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {report.parts.map((p, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-ink">{p.paperName}</td>
                  <td className="px-3 py-2 text-muted font-mono">{p.partLabel}</td>
                  <td className="px-3 py-2 text-right font-mono">{p.marks}</td>
                  <td className="px-3 py-2 text-right font-mono">{p.scorePct === null ? '—' : `${Math.round(p.scorePct)}%`}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted">{p.timeMinutes}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionShell>
  );
}
