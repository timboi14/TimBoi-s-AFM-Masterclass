import { SectionShell } from '@/components/Blocks';

const materials = [
  ['Editable slide deck', 'AFM-learning-deck.pptx'],
  ['Study plan', 'study-plan.html'],
  ['Cheat sheets', 'cheat-sheets.html'],
  ['42-question guide', 'question-guide.html'],
  ['Coverage & tracker', 'coverage-matrix.html'],
  ['Voice companion guide', 'voice-tutor.html'],
  ['Answer sources & limits', 'answer-sources.html'],
];

export function Classroom14Page() { return <ClassroomRoom academy />; }

export function ClassroomPage() { return <ClassroomRoom />; }

function ClassroomRoom({ academy = false }: { academy?: boolean } = {}) {
  const room = academy ? "/afm-classroom/classroom14.html" : "/afm-classroom/index.html";
  return (
    <SectionShell pad="lg">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[.18em] text-primary">September study room · 14 papers · 42 questions</p>
          <h1 className="mt-3 font-display text-5xl text-ink sm:text-6xl">{academy ? 'Classroom 14' : 'AFM classroom'}</h1>
          <p className="mt-4 text-muted">Learn through 44 slides, attempt before revealing help, then record the error to retry. Eight focused hours a day, Wednesday readiness and a lighter Thursday before Friday 11 September.</p>
        </div>
        <a className="btn btn-secondary" href={room} target="_blank" rel="noreferrer">Open full study room ↗</a>
      </div>
      <nav aria-label="Classroom materials" className="mb-6 flex flex-wrap gap-2">
        {materials.map(([label, file]) => <a key={file} className="btn btn-ghost text-sm" href={`/afm-classroom/materials/${file}`} target="_blank" rel="noreferrer">{label} ↗</a>)}
      <a className="btn btn-ghost text-sm" href="/afm-classroom/AFM-classroom.zip" download>Offline classroom ZIP ↓</a>
      </nav>
      <iframe title="Interactive AFM classroom" src={room} className="w-full rounded-2xl border border-border bg-white" style={{height:'min(1100px, 85vh)', minHeight:620}} />
      <p className="mt-4 text-sm text-muted">{academy && "Classroom 14 shares your question and lesson progress with Classroom. "}Progress stays in this browser. To bring progress from the local classroom, save its backup and restore it here. Voice tutoring runs in your existing Codex voice conversation; answer-source coverage and verification limits are documented above.</p>
    </SectionShell>
  );
}
