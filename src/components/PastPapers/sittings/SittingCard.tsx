import type { Sitting } from '@/lib/sittings';
import { formatTiming } from '@/lib/sittings';
import { DifficultyDots } from '../shared/DifficultyDots';

interface Props {
  sitting: Sitting;
  resumable: boolean;
  offline: boolean;
  hidden: boolean;
  onStart: () => void;
  onToggleOffline: () => void;
  onToggleHide: () => void;
}

const TYPE_LABEL: Record<Sitting['type'], string> = {
  'PAST EXAM': 'Past exam',
  'PRACTICE EXAM': 'Practice exam',
  SPECIMEN: 'Specimen',
  MOCK: 'Mock',
};

const FORMAT_NOTE: Record<Sitting['format'], string> = {
  modern: 'Full paper · Section A + two Section B',
  legacy: 'Legacy four-question paper (pre-Sep 2018)',
  partial: 'Partial capture · the questions we hold for this sitting',
};

/**
 * Friendly take on the iAssess assignment card. Carries the same information
 * the real platform shows (type, ACCA source, timing, offline + hide toggles,
 * syllabus link, start/resume) but warmer: matchday tone, plain-English labels,
 * a clear mark and question count instead of a bare clock row.
 */
export function SittingCard({
  sitting,
  resumable,
  offline,
  hidden,
  onStart,
  onToggleOffline,
  onToggleHide,
}: Props) {
  const qCount = sitting.questions.length;
  return (
    <div className={`sitting-card ${hidden ? 'sitting-card--hidden' : ''}`}>
      <div className="sitting-card__top">
        <span className={`sitting-card__type sitting-card__type--${sitting.format}`}>
          {TYPE_LABEL[sitting.type]}
        </span>
        <span className="sitting-card__source">ACCA</span>
      </div>

      <h3 className="sitting-card__title">{sitting.title}</h3>
      <p className="sitting-card__format">{FORMAT_NOTE[sitting.format]}</p>

      <div className="sitting-card__stats">
        <span className="sitting-card__stat" title="Standard exam timing at the live 1.95 min per mark rate">
          <span aria-hidden>🕒</span> {formatTiming(sitting.timingMinutes)}
        </span>
        <span className="sitting-card__stat">
          <span aria-hidden>📝</span> {sitting.totalMarks} marks
        </span>
        <span className="sitting-card__stat">
          <span aria-hidden>📄</span> {qCount} {qCount === 1 ? 'question' : 'questions'}
        </span>
      </div>

      <div className="sitting-card__qlist">
        {sitting.questions.map((q) => (
          <span key={q.paper.id} className="sitting-card__qchip">
            <strong>{q.label}</strong> {q.paper.name}
            <span className="sitting-card__qmarks"> · {q.paper.totalMarks}m</span>
          </span>
        ))}
      </div>

      <div className="sitting-card__footrow">
        <DifficultyDots level={sitting.difficulty} />
        <div className="sitting-card__checks">
          <label className="sitting-card__check" title="Mark this sitting saved for offline study (the app already works offline as a PWA)">
            <input type="checkbox" checked={offline} onChange={onToggleOffline} />
            Offline
          </label>
          <label className="sitting-card__check" title="Hide this sitting from the grid">
            <input type="checkbox" checked={hidden} onChange={onToggleHide} />
            Hide
          </label>
        </div>
      </div>

      <div className="sitting-card__actions">
        <a className="sitting-card__syllabus" href="/course#syllabus">
          View syllabus
        </a>
        <button type="button" className="sitting-card__start" onClick={onStart}>
          {resumable ? 'Resume' : 'Start'} <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}

