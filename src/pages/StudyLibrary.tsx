import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AppIcon, type AppIconName } from '@/components/AppIcon';
import { HeroGold } from '@/components/Blocks';
import { parseMarkerScore, stripScoreLine } from '@/lib/marker-score';
import { SUBJECT, MODULES, SYLLABUS_NOTE, SYLLABUS_URL } from '@/data/curriculum';
import {
  downloadCalendar,
  buildPlan,
  completeReading,
  emptyProgress,
  importLibrary,
  loadCatalogue,
  loadPages,
  originalUrl,
  readFile,
  readPlanner,
  readProgress,
  saveAttempt,
  savePlanner,
  saveProgress,
  taskState,
  type Catalogue,
  type Progress,
  type SourceDoc,
  type SourcePage,
  type StudyTask,
} from '@/lib/study-library';
import '@/styles/study-library.css';

/**
 * /study-room — the personal, source-linked study room.
 *
 * Plan, Learn, Practice and Sources over the learner's own imported books.
 * The visual language follows the November 2026 overhaul layer (Settings and
 * the Momentum board): Anton headlines, mono eyebrows, soft cards on the page
 * background and the navy board for numbers. All colours come from the shared
 * tokens, so dark and high-contrast themes follow without overrides.
 */

const Spreadsheet = lazy(() =>
  import('@/components/CBEWorkspace/CBESpreadsheet').then((m) => ({ default: m.CBESpreadsheet })),
);

const TABS: Array<{ id: string; icon: AppIconName }> = [
  { id: 'Plan', icon: 'compass' },
  { id: 'Learn', icon: 'graduation' },
  { id: 'Practice', icon: 'pen' },
  { id: 'Sources', icon: 'files' },
];

const PLANNER_FIELDS = [
  { key: 'weekdayMinutes', label: 'Minutes per weeknight', max: 120 },
  { key: 'saturdayMinutes', label: 'Saturday minutes per subject', max: 240 },
  { key: 'sundayMinutes', label: 'Sunday minutes per subject', max: 240 },
] as const;

const DAY_MS = 86_400_000;

function StateChip({ state }: { state: string }) {
  return (
    <span className="sl-chip" data-state={state.replace(/\s+/g, '-')}>
      {state}
    </span>
  );
}

export function StudyLibraryPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'Plan';
  const [catalog, setCatalog] = useState<Catalogue | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [settings, setSettings] = useState(readPlanner);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState(params.get('topic') || '');
  const [includeReference, setIncludeReference] = useState(false);
  const [searchHits, setSearchHits] = useState<{ doc: SourceDoc; page: SourcePage }[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadCatalogue()
      .then(setCatalog)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const plan = useMemo(() => buildPlan(catalog?.tasks || [], progress, settings), [catalog, progress, settings]);
  const task = catalog?.tasks.find((t) => t.id === params.get('task'));
  const document = catalog?.documents.find((d) => d.id === (params.get('source') || task?.source));

  const changeTab = (value: string) => {
    setParams({ tab: value });
    setQuery('');
    setTopic('');
  };
  const openTask = (t: StudyTask) => setParams({ tab: t.kind === 'practice' ? 'Practice' : 'Learn', task: t.id });
  const patchSettings = (patch: Partial<typeof settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    savePlanner(next);
  };

  async function doImport(files: FileList | null) {
    if (!files) return;
    setImporting(true);
    setError('');
    try {
      setCatalog(await importLibrary(Array.from(files)));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setImporting(false);
    }
  }

  async function searchSources() {
    if (!catalog || query.trim().length < 3) return;
    setSearching(true);
    try {
      const hits = [];
      for (const doc of catalog.documents) {
        const pages = await loadPages(doc);
        for (const page of pages) if (page.text.toLowerCase().includes(query.toLowerCase())) hits.push({ doc, page });
      }
      setSearchHits(hits);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSearching(false);
    }
  }

  const tasks = (catalog?.tasks || []).filter(
    (t) =>
      (includeReference || t.status === 'current') &&
      (!topic || t.topic === topic) &&
      (!query || `${t.title} ${t.topic}`.toLowerCase().includes(query.toLowerCase())) &&
      (tab === 'Practice' ? t.kind === 'practice' : t.kind !== 'practice'),
  );

  // Header facts follow the planner's exam date, so they move with the learner's choice.
  const exam = new Date(`${settings.examDate}T09:00:00`);
  const examValid = !Number.isNaN(exam.getTime());
  const daysLeft = examValid ? Math.max(0, Math.ceil((exam.getTime() - Date.now()) / DAY_MS)) : null;
  const examLabel = examValid ? exam.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

  return (
    <div className="sl">
      {/* The reading workspace needs the room, so the masthead steps aside while a source is open. */}
      {!document && (
        <>
          <header className="sl-head" data-va-skip>
            <div className="sl-head__copy">
              <p className="sl-eyebrow">Your {SUBJECT} study room · 2026–27</p>
              <h1>
                From the source. <HeroGold>Into your own words</HeroGold>.
              </h1>
              <p className="sl-lede">
                Your books, every kit question and a plan around your working day. Read, retrieve, attempt, compare and revisit.
              </p>
            </div>
            <aside className="sl-head__facts" aria-label="Your sitting">
              <p className="sl-eyebrow">Exam date</p>
              <strong>{examLabel}</strong>
              {daysLeft !== null && <span className="sl-head__days">{daysLeft} days to go</span>}
              <span>Work 07:00–18:00</span>
              <span>Evenings + weekends</span>
              <Link to="/settings#sitting">
                Change exam sitting <AppIcon name="arrowRight" size={14} />
              </Link>
            </aside>
          </header>

          <div className="sl-syllabus" data-va-skip>
            <strong>Syllabus check</strong>
            <p>
              {SYLLABUS_NOTE}{' '}
              <a href={SYLLABUS_URL} target="_blank" rel="noreferrer">
                ACCA study guide ↗
              </a>
            </p>
          </div>
        </>
      )}

      <nav className="sl-tabs" aria-label="Study room sections">
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-current={tab === t.id ? 'page' : undefined} onClick={() => changeTab(t.id)}>
            <AppIcon name={t.icon} size={15} />
            {t.id}
          </button>
        ))}
      </nav>

      {error && (
        <p className="sl-alert" role="alert" data-va-skip>
          {error}
        </p>
      )}
      {loading && (
        <p className="sl-loading" role="status" data-va-skip>
          Opening your library…
        </p>
      )}

      {!catalog && !loading && (
        <section className="sl-panel sl-panel--import" data-va-skip>
          <span className="sl-panel__icon" aria-hidden="true">
            <AppIcon name="book" size={22} />
          </span>
          <h2>Bring your library onto this device</h2>
          <p>
            Select the {SUBJECT} personal library folder prepared with your originals and extracts. Files stay in this browser. Use
            the same folder on each device.
          </p>
          <ImportButton importing={importing} onImport={doImport} primary />
          <p className="sl-muted">
            Study progress is included in Settings backups. Keep a copy of this library folder too: source files are stored
            separately.
          </p>
        </section>
      )}

      {catalog && document && (
        <SourceWorkspace
          key={`${task?.id || document.id}-${params.get('page') || ''}`}
          task={task}
          doc={document}
          initialPage={Number(params.get('page')) || task?.start || 1}
          progress={progress}
          setProgress={setProgress}
          onClose={() => setParams({ tab })}
        />
      )}

      {catalog && !document && (
        <>
          <div className="sl-stats" data-va-skip>
            <div>
              <strong>{catalog.documents.length}</strong>
              <span>original sources</span>
            </div>
            <div>
              <strong>{catalog.tasks.filter((t) => t.kind === 'practice').length}</strong>
              <span>practice tasks</span>
            </div>
            <div>
              <strong className={catalog.tasks.some((t) => taskState(t, progress) === 'due') ? 'is-due' : ''}>
                {catalog.tasks.filter((t) => taskState(t, progress) === 'due').length}
              </strong>
              <span>retests due</span>
            </div>
            <div>
              <strong className="is-secure">{catalog.tasks.filter((t) => taskState(t, progress) === 'secure').length}</strong>
              <span>questions secure</span>
            </div>
          </div>

          {tab === 'Plan' && (
            <>
              <section className="sl-panel" data-va-skip>
                <h2>A timetable you can sustain</h2>
                <p>
                  APM: Monday and Wednesday evenings. AFM: Tuesday and Thursday. Friday is free. Weekends: APM at 09:00, AFM at
                  14:00. Each site schedules its own subject; these time blocks avoid clashes.
                </p>
                <div className="sl-controls">
                  <label>
                    Weeknight start
                    <input
                      type="time"
                      min="19:00"
                      max="21:00"
                      value={settings.eveningStart}
                      onChange={(e) => patchSettings({ eveningStart: e.target.value })}
                    />
                  </label>
                  {PLANNER_FIELDS.map((f) => (
                    <label key={f.key}>
                      {f.label}
                      <input
                        type="number"
                        min="0"
                        max={f.max}
                        step="15"
                        value={settings[f.key]}
                        onChange={(e) => patchSettings({ [f.key]: Math.min(f.max, Math.max(0, Number(e.target.value))) })}
                      />
                    </label>
                  ))}
                  <label>
                    Exam date (confirm your docket)
                    <input type="date" value={settings.examDate} onChange={(e) => patchSettings({ examDate: e.target.value })} />
                  </label>
                </div>
                <p className="sl-muted">
                  March exam dates are provisional in the sitting configuration. This plan uses your chosen date. Session lengths
                  include reading or an attempt plus debrief, and are estimates.
                </p>
              </section>

              <section className={`sl-panel sl-load ${plan.backlogMinutes ? 'sl-capacity' : ''}`} data-va-skip>
                <h2>
                  {Math.round(plan.required / 60)} hours queued · {Math.round(plan.capacity / 60)} hours available
                </h2>
                <div className="sl-meter" aria-hidden="true">
                  <i style={{ width: `${plan.required ? Math.min(100, (plan.capacity / plan.required) * 100) : 100}%` }} />
                </div>
                <p>
                  {plan.backlogMinutes
                    ? `${Math.ceil(plan.backlogMinutes / 60)} hours do not fit before the exam. Increase available time, complete familiar readings with recall evidence, or consciously prioritise. Every task remains in Learn or Practice.`
                    : 'The currently queued work fits your available time. New retests will be added as you record marks.'}{' '}
                  Repeated practice and full mocks need additional time; this is a workload estimate, not a pass prediction.
                </p>
              </section>

              <section className="sl-block" data-va-skip>
                <div className="sl-block__head">
                  <div>
                    <h2>Your next sessions</h2>
                    <p className="sl-muted">
                      Calendar times use Africa/Gaborone (UTC+2). Re-export after changing your schedule or progress.
                    </p>
                  </div>
                  <button type="button" className="sl-btn" onClick={() => downloadCalendar(plan.slots)}>
                    Download calendar (.ics)
                  </button>
                </div>
                <div className="sl-sessions">
                  {plan.slots.slice(0, 14).map((s) => (
                    <article key={s.date} className="sl-panel sl-session">
                      <p className="sl-eyebrow">
                        {new Date(s.date + 'T12:00:00').toLocaleDateString(undefined, {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        · {s.start} · {s.minutes} MIN
                      </p>
                      {s.tasks.length ? (
                        s.tasks.map((a, i) => (
                          <button type="button" className="sl-task-button" key={`${a.task.id}-${i}`} onClick={() => openTask(a.task)}>
                            <span>
                              {a.continuation ? 'Continue: ' : ''}
                              {a.task.title}
                            </span>
                            <small>
                              {a.minutes} min · {a.task.kind}
                            </small>
                          </button>
                        ))
                      ) : (
                        <p className="sl-muted">Space for a mixed mock, due reviews or rest.</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>

              <details className="sl-panel sl-fold" data-va-skip>
                <summary>All scheduled sessions ({plan.slots.length})</summary>
                <div className="sl-agenda">
                  {plan.slots.slice(14).map((s) => (
                    <p key={s.date}>
                      <strong>
                        {s.date} {s.start}
                      </strong>{' '}
                      · {s.tasks.map((t) => t.task.title).join(' / ') || 'Review buffer'}
                    </p>
                  ))}
                </div>
              </details>
            </>
          )}

          {(tab === 'Learn' || tab === 'Practice') && (
            <>
              <div className="sl-controls sl-controls--bar">
                <label>
                  Find a task
                  <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Question name or topic" />
                </label>
                <label>
                  Topic
                  <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="">All topics</option>
                    {Array.from(new Set(catalog.tasks.map((t) => t.topic))).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="sl-check">
                  <input type="checkbox" checked={includeReference} onChange={(e) => setIncludeReference(e.target.checked)} /> Include
                  supplementary / mixed material
                </label>
              </div>

              {tab === 'Learn' && (
                <section className="sl-block">
                  <h2>Understand, then prove it</h2>
                  <p className="sl-lede">
                    Open the source lessons below. Explain each concept from memory, work through its examples, then attempt a related
                    kit question without the answer.
                  </p>
                  <div className="sl-modules">
                    {MODULES.filter((m) => !topic || topic === m.title).map((m) => (
                      <details className="sl-panel sl-fold" key={m.id}>
                        <summary>
                          {m.ref} · {m.title}
                        </summary>
                        <p>{m.teaching}</p>
                        <h3>Explain without looking</h3>
                        <ul>
                          {m.prompts.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                        <details className="sl-fold sl-fold--inner">
                          <summary>Check your explanation</summary>
                          <p>{m.answer}</p>
                        </details>
                        <div className="sl-actions">
                          <button type="button" className="sl-btn sl-btn--primary" onClick={() => setTopic(m.title)}>
                            Study this topic
                          </button>
                          <Link to={`/topic/${m.topicId}`}>Open topic drills ↗</Link>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {tab === 'Practice' && (
                <p className="sl-lede" data-va-skip>
                  Attempt first, then reveal the source solution. Record marks and the specific mistake you repaired. FSRS schedules the
                  next retest; “secure” requires at least 70% on two different days. Kit questions may be adapted versions of past exams.
                </p>
              )}

              <h2 className="sl-count" data-va-skip>
                {tasks.length} {tab === 'Practice' ? 'practice tasks' : 'reading tasks'}
              </h2>
              <div className="sl-task-list" data-va-skip>
                {tasks.map((t) => (
                  <button type="button" className="sl-task-row" key={t.id} onClick={() => openTask(t)}>
                    <span>
                      <strong>{t.title}</strong>
                      <small>
                        {t.topic} · PDF pp. {t.start}–{t.end}
                        {t.priority ? ' · Top 51 match' : ''}
                      </small>
                      {t.caution && <small className="sl-task-row__caution">{t.caution}</small>}
                    </span>
                    <span>
                      <StateChip state={taskState(t, progress)} />
                      <small>
                        {t.minutes} min{t.status !== 'current' ? ` · ${t.status}` : ''}
                      </small>
                    </span>
                  </button>
                ))}
                {!tasks.length && <p className="sl-empty">Nothing matches. Clear the search or pick another topic.</p>}
              </div>

              {tab === 'Practice' && catalog.top51 && (
                <details className="sl-panel sl-fold" data-va-skip>
                  <summary>All Top 51 recommendations and source matches</summary>
                  <p>
                    The workbook also contains row 52 recommending recent papers generally. Names and historical marks can differ from
                    the adapted kit. Unmatched entries are references, not invented question text.
                  </p>
                  <div className="sl-agenda">
                    {catalog.top51.map((r, i) => (
                      <p key={i}>
                        <strong>
                          {i + 1}. {r.name}
                        </strong>{' '}
                        · {r.reference} ·{' '}
                        {r.matchedTask ? (
                          <button type="button" className="sl-link" onClick={() => openTask(catalog.tasks.find((t) => t.id === r.matchedTask)!)}>
                            Open matched kit question
                          </button>
                        ) : (
                          <span>Full question not located in the uploaded kit; see original workbook row {r.row}.</span>
                        )}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </>
          )}

          {tab === 'Sources' && (
            <>
              <section className="sl-panel" data-va-skip>
                <h2>Your originals, preserved</h2>
                <p>
                  PDF page numbers are physical file pages, including front matter. Use the original for tables, formulas, handwritten
                  notes and diagrams. Extracted text is searchable but can lose layout.
                </p>
                <ImportButton importing={importing} onImport={doImport} />
                <div className="sl-controls">
                  <label className="sl-grow">
                    Search all source text
                    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="At least three characters" />
                  </label>
                  <button type="button" className="sl-btn sl-btn--primary" disabled={searching || query.trim().length < 3} onClick={searchSources}>
                    {searching ? 'Searching…' : 'Search sources'}
                  </button>
                </div>
                {searchHits.length > 0 && (
                  <details open className="sl-fold sl-fold--inner">
                    <summary>{searchHits.length} matching pages</summary>
                    {searchHits.slice(0, 100).map((h) => (
                      <button
                        type="button"
                        className="sl-task-button"
                        key={`${h.doc.id}-${h.page.page}`}
                        onClick={() => setParams({ tab: 'Sources', source: h.doc.id, page: String(h.page.page) })}
                      >
                        {h.doc.title} · page {h.page.page}
                      </button>
                    ))}
                    {searchHits.length > 100 && <p>Showing the first 100 results. Refine your search for more specific matches.</p>}
                  </details>
                )}
              </section>
              <div className="sl-modules">
                {catalog.documents.map((d) => (
                  <article className="sl-panel sl-source" key={d.id} data-va-skip>
                    <p className="sl-eyebrow">
                      {d.kind} · {d.pages} {d.kind === 'slides' ? 'slides' : d.kind === 'workbook' ? 'sheet' : 'pages'}
                    </p>
                    <h2>{d.title}</h2>
                    <p>{d.note}</p>
                    <button type="button" className="sl-btn" onClick={() => setParams({ tab: 'Sources', source: d.id })}>
                      Read original & extracts
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function ImportButton({
  importing,
  onImport,
  primary = false,
}: {
  importing: boolean;
  onImport: (f: FileList | null) => void;
  primary?: boolean;
}) {
  return (
    <label className={`sl-import sl-btn ${primary ? 'sl-btn--primary' : ''}`}>
      {importing ? 'Verifying and importing…' : 'Import personal library folder'}
      <input
        aria-label="Import personal library folder"
        type="file"
        multiple
        {...{ webkitdirectory: '' }}
        disabled={importing}
        onChange={(e) => onImport(e.target.files)}
      />
    </label>
  );
}

function SourceWorkspace({
  task,
  doc,
  initialPage,
  progress,
  setProgress,
  onClose,
}: {
  task?: StudyTask;
  doc: SourceDoc;
  initialPage: number;
  progress: Progress;
  setProgress: (p: Progress) => void;
  onClose: () => void;
}) {
  const [pages, setPages] = useState<SourcePage[]>([]);
  const [page, setPage] = useState(initialPage);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [view, setView] = useState<'text' | 'original'>('text');
  const [score, setScore] = useState('');
  const [available, setAvailable] = useState('');
  const [correction, setCorrection] = useState('');
  const [started, setStarted] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [saved, setSaved] = useState('');
  const sheetKey = `tba_library_sheet_${task?.id || doc.id}`;
  const [sheet, setSheet] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(sheetKey) || '[]');
    } catch {
      return [];
    }
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');
  const [aiRequirement, setAiRequirement] = useState('');
  const [aiController, setAiController] = useState<AbortController | null>(null);

  useEffect(() => () => aiController?.abort(), [aiController]);

  const current = task ? progress[task.id] || emptyProgress() : emptyProgress();

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    loadPages(doc)
      .then((p) => {
        if (active) setPages(p);
      })
      .catch((e) => setError(e.message));
    originalUrl(doc)
      .then((u) => {
        objectUrl = u;
        if (active) setUrl(u);
        else URL.revokeObjectURL(u);
      })
      .catch((e) => setError(e.message));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => clearInterval(t);
  }, [started]);

  function update(field: 'response' | 'recall', value: string) {
    if (!task) return;
    const next = { ...progress, [task.id]: { ...current, [field]: value } };
    try {
      saveProgress(next);
      setProgress(next);
    } catch {
      setError('Could not save. Download a backup and check browser storage.');
    }
  }

  const lower = showAnswer && task?.answerStart ? task.answerStart : task?.start || 1;
  const upper = showAnswer && task?.answerEnd ? task.answerEnd : task?.end || doc.pages;
  const sourcePage = pages.find((p) => p.page === page);

  async function requestFeedback() {
    if (!task || !task.answerStart || !Number(available)) return;
    setAiBusy(true);
    setAiFeedback('');
    setError('');
    const controller = new AbortController();
    setAiController(controller);
    try {
      const context = pages
        .filter((p) => p.page >= task.start && p.page <= task.end)
        .map((p) => `[Question PDF page ${p.page}]\n${p.text}`)
        .join('\n');
      const solution = pages
        .filter((p) => p.page >= task.answerStart! && p.page <= task.answerEnd!)
        .map((p) => `[Solution PDF page ${p.page}]\n${p.text}`)
        .join('\n');
      const res = await fetch('/api/mark', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          paperName: task.title,
          paperSession: 'Uploaded 2026–27 exam kit',
          partLabel: aiRequirement || 'Whole question',
          partMarks: Number(available),
          partRequirement: `${aiRequirement || 'Mark the whole question against the supplied requirements.'}\nSOURCE QUESTION AND EXHIBITS:\n${context}`,
          modelAnswerExtract: solution,
          studentWord: current.response,
          studentSheet: sheet
            .map((r: string[], i: number) =>
              r
                .map((v: string, j: number) => (v ? `${String.fromCharCode(65 + j)}${i + 1}: ${v}` : ''))
                .filter(Boolean)
                .join('\n'),
            )
            .filter(Boolean)
            .join('\n'),
        }),
      });
      if (!res.ok || !res.body || res.headers.get('content-type')?.includes('text/html'))
        throw new Error(
          res.status === 503
            ? 'AI marking is not configured here. Compare against the source solution and record your own marks.'
            : 'AI marking is unavailable on this server. Your answer is saved; use the source solution for self-marking.',
        );
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = '';
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        text += decoder.decode(chunk.value, { stream: true });
        setAiFeedback(stripScoreLine(text));
      }
      text += decoder.decode();
      setAiFeedback(stripScoreLine(text));
      const result = parseMarkerScore(text);
      if (result && result.available === Number(available)) setScore(String(result.awarded));
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError((e as Error).message);
    } finally {
      setAiBusy(false);
    }
  }

  function mark() {
    if (!task) return;
    try {
      const next = saveAttempt(task, progress, {
        response: current.response,
        score: Number(score),
        available: Number(available),
        correction,
        sheet,
        minutes: Math.round(elapsed / 60),
      });
      setProgress(next);
      setSaved('Attempt saved. Your next retest is scheduled.');
      setStarted(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <section className="sl-workspace">
      {/* Page chrome, not study text: the voice reader annotates the extract only. */}
      <div className="sl-workspace__head" data-va-skip>
        <button type="button" className="sl-back" onClick={onClose}>
          ← Back to study room
        </button>
        <p className="sl-eyebrow">
          {doc.title} · {task ? `physical PDF pages ${task.start}–${task.end}` : `${doc.pages} pages / slides / sheets`}
        </p>
        <h1 className="sl-workspace__title">{task?.title || doc.title}</h1>
        {doc.note && <p className="sl-muted">{doc.note}</p>}
        {task?.caution && <p className="sl-alert">{task.caution}</p>}
        {error && (
          <p role="alert" className="sl-alert">
            {error}
          </p>
        )}

        <div className="sl-controls sl-controls--bar">
          <button type="button" className="sl-btn" onClick={() => setView(view === 'text' ? 'original' : 'text')}>
            {view === 'text' ? 'View original layout' : 'View searchable text'}
          </button>
          {url && (
            <a href={`${url}${doc.kind === 'pdf' ? '#page=' + page : ''}`} target="_blank" rel="noreferrer">
              Open original at page {page} ↗
            </a>
          )}
          {url && (
            <a href={url} download={doc.filename}>
              Download unchanged original
            </a>
          )}
        </div>

        {task?.kind === 'practice' && (
          <div className="sl-controls sl-controls--bar sl-timer">
            <button
              type="button"
              className="sl-btn"
              onClick={() => {
                setStarted(Date.now());
                setElapsed(0);
              }}
            >
              <AppIcon name="stopwatch" size={15} /> Start / restart timer
            </button>
            <output aria-label="Elapsed time">
              {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
            </output>
            <span className="sl-muted">Time budget: attempt at exam pace, then debrief</span>
            {task.answerStart && (
              <button
                type="button"
                className={`sl-btn ${showAnswer ? '' : 'sl-btn--gold'}`}
                onClick={() => {
                  const show = !showAnswer;
                  setShowAnswer(show);
                  setPage(show ? task.answerStart! : task.start);
                }}
              >
                {showAnswer ? 'Return to question' : 'Reveal source solution'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="sl-reading-grid">
        <div>
          <div className="sl-page-controls">
            <button type="button" className="sl-btn sl-btn--small" disabled={page <= lower} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <label>
              Page
              <input
                type="number"
                min={lower}
                max={upper}
                value={page}
                onChange={(e) => setPage(Math.min(upper, Math.max(lower, Number(e.target.value))))}
              />
            </label>
            <span>
              of range {lower}–{upper}
            </span>
            <button type="button" className="sl-btn sl-btn--small" disabled={page >= upper} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
          {view === 'original' && url && doc.kind === 'pdf' ? (
            <iframe
              key={`${url}-${page}`}
              title={`${doc.title} original page ${page}`}
              src={`${url}#page=${page}&view=FitH`}
              className="sl-pdf"
            />
          ) : (
            <article className="sl-extract">
              {sourcePage?.image && <SourceImage path={sourcePage.image} />}
              <h3>{sourcePage?.title || `Page ${page}`}</h3>
              {sourcePage?.rows ? (
                <div className="sl-table-wrap">
                  <table>
                    <tbody>
                      {sourcePage.rows.map((r) => (
                        <tr key={r.row}>
                          <th>{r.row}</th>
                          {Object.entries(r.cells).map(([k, v]) => (
                            <td key={k}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre>
                  {sourcePage?.text ||
                    'This page has little or no extractable text. Open the original to see its complete content.'}
                </pre>
              )}
            </article>
          )}
        </div>

        {task && (
          <aside className="sl-answer" data-va-skip>
            <h3>{task.kind === 'practice' ? 'Your attempt' : 'Retrieve from memory'}</h3>
            {task.kind === 'practice' ? (
              <>
                <p>Read the requirement, identify its verb and marks, then write your answer. Save workings in the spreadsheet below.</p>
                <textarea
                  aria-label="Your answer"
                  value={current.response}
                  onChange={(e) => update('response', e.target.value)}
                  placeholder="Write to the requirement. Use scenario evidence and explain the implication."
                />
                <button type="button" className="sl-btn" onClick={() => setSheetOpen(!sheetOpen)}>
                  {sheetOpen ? 'Hide' : 'Open'} calculation workspace
                </button>
                {sheetOpen && (
                  <Suspense fallback={<p>Loading spreadsheet…</p>}>
                    <Spreadsheet
                      value={sheet}
                      onChange={(v) => {
                        setSheet(v);
                        localStorage.setItem(sheetKey, JSON.stringify(v));
                      }}
                    />
                  </Suspense>
                )}

                <h3>Compare and repair</h3>
                <details className="sl-ai sl-fold sl-fold--inner">
                  <summary>Get source-grounded AI feedback</summary>
                  <p>
                    On request, sends this question, its solution and your answer to the site's AI marker. AI feedback is advisory: check
                    calculations and marks against the original.
                  </p>
                  <label>
                    Requirement / part to mark (blank for whole question)
                    <input value={aiRequirement} onChange={(e) => setAiRequirement(e.target.value)} placeholder="For example, part (b) only" />
                  </label>
                  <p className="sl-muted">Set the available marks below before requesting feedback.</p>
                  <div className="sl-actions">
                    <button
                      type="button"
                      className="sl-btn sl-btn--primary"
                      disabled={aiBusy || !pages.length || !task.answerStart || !current.response.trim() || Number(available) <= 0}
                      onClick={requestFeedback}
                    >
                      {aiBusy ? 'Marking…' : 'Request AI feedback'}
                    </button>
                    {aiBusy && (
                      <button type="button" className="sl-btn" onClick={() => aiController?.abort()}>
                        Cancel
                      </button>
                    )}
                  </div>
                  {aiFeedback && <pre>{aiFeedback}</pre>}
                </details>
                <p>
                  Use the source solution and marking guide. Record your checked marks below. The saved score is your assessment,
                  including any AI suggestion you choose to accept.
                </p>
                <div className="sl-controls">
                  <label>
                    Awarded
                    <input type="number" min="0" value={score} onChange={(e) => setScore(e.target.value)} />
                  </label>
                  <label>
                    Available
                    <input type="number" min="1" value={available} onChange={(e) => setAvailable(e.target.value)} />
                  </label>
                </div>
                <label>
                  What lost marks, and how will you fix it?
                  <textarea
                    className="sl-short"
                    value={correction}
                    onChange={(e) => setCorrection(e.target.value)}
                    placeholder="Specific error → corrected method or reasoning"
                  />
                </label>
                <button
                  type="button"
                  className="sl-btn sl-btn--primary sl-btn--block"
                  disabled={score === '' || !available || !current.response.trim() || !correction.trim()}
                  onClick={mark}
                >
                  Save attempt & schedule retest
                </button>
                {current.fsrs && <p className="sl-muted">Next retest: {new Date(current.fsrs.due).toLocaleDateString()}</p>}
                <details className="sl-fold sl-fold--inner">
                  <summary>Attempt history ({current.attempts.length})</summary>
                  {current.attempts.map((a) => (
                    <div key={a.at} className="sl-attempt">
                      <strong>
                        {new Date(a.at).toLocaleDateString()} · {a.score}/{a.available}
                      </strong>
                      <p>{a.correction}</p>
                      <details className="sl-fold sl-fold--inner">
                        <summary>Saved answer</summary>
                        <pre>{a.response}</pre>
                        {a.sheet && (
                          <pre>
                            {a.sheet
                              .map((row: string[]) => row.join(' | '))
                              .filter((row: string) => row.replace(/[ |]/g, ''))
                              .join('\n')}
                          </pre>
                        )}
                      </details>
                    </div>
                  ))}
                </details>
              </>
            ) : (
              <>
                <p>
                  Close the extract. Explain the principle, an application and a limitation. Work through the source’s examples before
                  marking this block complete.
                </p>
                <textarea
                  aria-label="Recall notes"
                  value={current.recall}
                  onChange={(e) => update('recall', e.target.value)}
                  placeholder="What can you now explain or calculate without looking?"
                />
                <button
                  type="button"
                  className="sl-btn sl-btn--primary sl-btn--block"
                  disabled={!current.recall.trim() || current.read}
                  onClick={() => {
                    try {
                      setProgress(completeReading(task, progress));
                      setSaved('Reading and recall saved.');
                    } catch (e) {
                      setError((e as Error).message);
                    }
                  }}
                >
                  {current.read ? 'Reading completed' : 'Save reading & recall'}
                </button>
              </>
            )}
            {saved && (
              <p role="status" className="sl-saved">
                <AppIcon name="check" size={15} /> {saved}
              </p>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}

function SourceImage({ path }: { path: string }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    let u = '';
    readFile(path)
      .then((b) => {
        u = URL.createObjectURL(b);
        if (alive) setUrl(u);
        else URL.revokeObjectURL(u);
      })
      .catch(() => {
        /* Original PDF remains available if an image is missing. */
      });
    return () => {
      alive = false;
      if (u) URL.revokeObjectURL(u);
    };
  }, [path]);
  return url ? <img src={url} alt="Original source page including diagrams and annotations" /> : null;
}
