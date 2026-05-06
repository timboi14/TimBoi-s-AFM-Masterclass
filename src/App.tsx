import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/Home';
import { TopicPage } from '@/pages/Topic';
import { TheoryPage } from '@/pages/Theory';
import { CardsPage } from '@/pages/Cards';
import { MockPage } from '@/pages/Mock';
import { FormulasPage } from '@/pages/Formulas';
import { ExamSkillsPage } from '@/pages/ExamSkills';
import { PracticePage } from '@/pages/Practice';
import { MemoryPage } from '@/pages/Memory';
import { WarRoomPage } from '@/pages/WarRoom';
import { ExaminerPage } from '@/pages/Examiner';
import { CoursePage } from '@/pages/Course';
import { NameOverlay } from '@/NameOverlay';

export default function App() {
  return (
    <BrowserRouter>
      <NameOverlay />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:id" element={<TopicPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/practice/:id" element={<PracticePage />} />
          <Route path="/theory" element={<TheoryPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/war-room" element={<WarRoomPage />} />
          <Route path="/examiner" element={<ExaminerPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/mock" element={<MockPage />} />
          <Route path="/formulas" element={<FormulasPage />} />
          <Route path="/exam-skills" element={<ExamSkillsPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
