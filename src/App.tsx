import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/Home';
import { NameOverlay } from '@/NameOverlay';
import { Onboarding } from '@/components/Onboarding';

// When a deploy lands, the user's cached index.html still references the old
// chunk hashes. import() then 404s and React throws a "Loading chunk failed".
// On the first such failure we soft-reload once so the browser pulls fresh
// HTML; the sessionStorage flag prevents an infinite reload if the failure is
// not actually a stale-chunk issue (e.g. the dev server is down).
const CHUNK_RELOAD_KEY = 'tba-chunk-reloaded';
const lazyWithRetry = <T extends React.ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>,
) =>
  lazy(async () => {
    try {
      const mod = await importer();
      sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      return mod;
    } catch (err) {
      if (typeof window !== 'undefined' && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
        window.location.reload();
      }
      throw err;
    }
  });

// Helper to lazy-load a page with a named export, with stale-chunk self-heal.
const lazyNamed = <K extends string>(loader: () => Promise<Record<K, React.ComponentType<unknown>>>, name: K) =>
  lazyWithRetry(() => loader().then((m) => ({ default: m[name] })));

// Home stays in the main bundle (it's the landing page; lazy here would just delay TTI).
// Every other route ships in its own chunk.
const TopicPage = lazyNamed(() => import('@/pages/Topic'), 'TopicPage');
const TheoryPage = lazyNamed(() => import('@/pages/Theory'), 'TheoryPage');
const CardsPage = lazyNamed(() => import('@/pages/Cards'), 'CardsPage');
const MockPage = lazyNamed(() => import('@/pages/Mock'), 'MockPage');
const FormulasPage = lazyNamed(() => import('@/pages/Formulas'), 'FormulasPage');
const ExamSkillsPage = lazyNamed(() => import('@/pages/ExamSkills'), 'ExamSkillsPage');
const PracticePage = lazyNamed(() => import('@/pages/Practice'), 'PracticePage');
const MemoryPage = lazyNamed(() => import('@/pages/Memory'), 'MemoryPage');
const WarRoomPage = lazyNamed(() => import('@/pages/WarRoom'), 'WarRoomPage');
const ExaminerPage = lazyNamed(() => import('@/pages/Examiner'), 'ExaminerPage');
const CoursePage = lazyNamed(() => import('@/pages/Course'), 'CoursePage');
const RevisionDashboard = lazyNamed(() => import('@/pages/Revision'), 'RevisionDashboard');
const PapersIndex = lazyNamed(() => import('@/pages/Revision'), 'PapersIndex');
const PaperView = lazyNamed(() => import('@/pages/Revision'), 'PaperView');
const QuestionDeepDive = lazyNamed(() => import('@/pages/Revision'), 'QuestionDeepDive');
const TopicsIndex = lazyNamed(() => import('@/pages/Revision'), 'TopicsIndex');
const ProgressDashboard = lazyNamed(() => import('@/pages/Revision'), 'ProgressDashboard');
const PastPapersPage = lazyNamed(() => import('@/pages/PastPapers'), 'PastPapersPage');
const PlaybookPage = lazyNamed(() => import('@/pages/Playbook'), 'PlaybookPage');
const TrainingPage = lazyNamed(() => import('@/pages/Training'), 'TrainingPage');
const ScoutPage = lazyNamed(() => import('@/pages/Scout'), 'ScoutPage');
const BootRoomPage = lazyNamed(() => import('@/pages/BootRoom'), 'BootRoomPage');
const DebriefIndexPage = lazyNamed(() => import('@/pages/Debrief'), 'DebriefIndexPage');
const DebriefNewPage = lazyNamed(() => import('@/pages/Debrief'), 'DebriefNewPage');
const DebriefViewPage = lazyNamed(() => import('@/pages/Debrief'), 'DebriefViewPage');
const PitfallsPage = lazyNamed(() => import('@/pages/Pitfalls'), 'PitfallsPage');
const StudyGuidePage = lazyNamed(() => import('@/pages/StudyGuide'), 'StudyGuidePage');
const SyllabusPage = lazyNamed(() => import('@/pages/Syllabus'), 'SyllabusPage');
const MemoryLabPage = lazyNamed(() => import('@/pages/MemoryLab'), 'MemoryLabPage');
const FormGuidePage = lazyNamed(() => import('@/pages/FormGuide'), 'FormGuidePage');
const MockBriefingPage = lazyNamed(() => import('@/pages/MockComposite'), 'MockBriefingPage');
const MockSittingPage = lazyNamed(() => import('@/pages/MockComposite'), 'MockSittingPage');
const MockReportPage = lazyNamed(() => import('@/pages/MockComposite'), 'MockReportPage');
const SettingsPage = lazyNamed(() => import('@/pages/Settings'), 'SettingsPage');
const StartPage = lazyNamed(() => import('@/pages/Start'), 'StartPage');
const DiagnosticPage = lazyNamed(() => import('@/pages/Diagnostic'), 'DiagnosticPage');

function RouteFallback() {
  return (
    <div className="min-h-[40vh] grid place-items-center" aria-busy="true">
      <div className="flex flex-col items-center gap-3">
        <div
          aria-hidden
          className="w-10 h-10 rounded-full border-[3px] border-[var(--border)] border-t-[var(--primary)] animate-spin"
        />
        <span className="text-[11px] uppercase tracking-[0.16em] text-muted font-bold">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <NameOverlay />
      <Onboarding />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="*"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/topic/:id" element={<TopicPage />} />
                  <Route path="/practice" element={<PracticePage />} />
                  <Route path="/practice/:id" element={<PracticePage />} />
                  <Route path="/theory" element={<TheoryPage />} />
                  <Route path="/cards" element={<CardsPage />} />
                  <Route path="/memory" element={<MemoryPage />} />
                  <Route path="/war-room" element={<WarRoomPage />} />
                  <Route path="/examiner" element={<ExaminerPage />} />
                  <Route path="/course" element={<CoursePage />} />
                  <Route path="/revision" element={<RevisionDashboard />} />
                  <Route path="/revision/papers" element={<PapersIndex />} />
                  <Route path="/revision/papers/:paperId" element={<PaperView />} />
                  <Route path="/revision/papers/:paperId/q/:qNo" element={<QuestionDeepDive />} />
                  <Route path="/revision/topics" element={<TopicsIndex />} />
                  <Route path="/past-papers" element={<PastPapersPage />} />
                  <Route path="/playbook" element={<PlaybookPage />} />
                  <Route path="/training" element={<TrainingPage />} />
                  <Route path="/scout" element={<ScoutPage />} />
                  <Route path="/boot-room" element={<BootRoomPage />} />
                  <Route path="/progress" element={<ProgressDashboard />} />
                  <Route path="/debrief" element={<DebriefIndexPage />} />
                  <Route path="/debrief/new" element={<DebriefNewPage />} />
                  <Route path="/debrief/:id" element={<DebriefViewPage />} />
                  <Route path="/pitfalls" element={<PitfallsPage />} />
                  <Route path="/syllabus" element={<SyllabusPage />} />
                  <Route path="/memory-lab" element={<MemoryLabPage />} />
                  <Route path="/form-guide" element={<FormGuidePage />} />
                  <Route path="/training/mock" element={<MockBriefingPage />} />
                  <Route path="/training/mock/sit/:id" element={<MockSittingPage />} />
                  <Route path="/training/mock/report/:id" element={<MockReportPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/start" element={<StartPage />} />
                  <Route path="/start/diagnostic" element={<DiagnosticPage />} />
                  <Route path="/study-guide" element={<StudyGuidePage />} />
                  <Route path="/mock" element={<MockPage />} />
                  <Route path="/formulas" element={<FormulasPage />} />
                  <Route path="/exam-skills" element={<ExamSkillsPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
