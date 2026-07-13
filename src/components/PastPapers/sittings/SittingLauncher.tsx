import { useSearchParams } from 'react-router-dom';
import type { Sitting } from '@/lib/sittings';
import { formatTiming } from '@/lib/sittings';
import { ExamPlayer } from './ExamPlayer';
import { FriendlyPractice } from './FriendlyPractice';

interface Props {
  sitting: Sitting;
  guestId: string;
  onClose: () => void;
}

type Mode = 'friendly' | 'exam';

/**
 * Inline launcher for one sitting. Two ways in, per the brief:
 *  - Friendly practice (default): warm, study-first, with the realistic skin
 *    toggle when you want the exam look without the ceremony.
 *  - Full exam (iAssess): the faithful launch ceremony, scroll discipline,
 *    two-stage end, then self-marking.
 */
export function SittingLauncher({ sitting, guestId, onClose }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode: Mode = searchParams.get('mode') === 'exam' ? 'exam' : 'friendly';

  const setMode = (next: Mode) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === 'friendly') p.delete('mode');
        else p.set('mode', next);
        return p;
      },
      { replace: true },
    );
  };

  return (
    <div className="sitting-launcher" role="region" aria-label={`${sitting.title}`}>
      <div className="sitting-launcher__header">
        <div>
          <h2 className="sitting-launcher__title">{sitting.title}</h2>
          <p className="sitting-launcher__meta">
            {sitting.totalMarks} marks · {sitting.questions.length} questions ·{' '}
            {formatTiming(sitting.timingMinutes)} at exam pace
          </p>
        </div>
        <button
          type="button"
          className="sitting-launcher__close"
          onClick={onClose}
          aria-label="Close this sitting"
        >
          ×
        </button>
      </div>

      <div className="sitting-launcher__modes" role="tablist" aria-label="How to sit this paper">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'friendly'}
          className={`sitting-launcher__mode ${mode === 'friendly' ? 'sitting-launcher__mode--active' : ''}`}
          onClick={() => setMode('friendly')}
        >
          <span className="sitting-launcher__mode-title">🟢 Friendly practice</span>
          <span className="sitting-launcher__mode-sub">
            Study one question at a time. Scenario, requirements and self-marking side by side.
            Flip on the realistic skin whenever you want the exam look.
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'exam'}
          className={`sitting-launcher__mode ${mode === 'exam' ? 'sitting-launcher__mode--active' : ''}`}
          onClick={() => setMode('exam')}
        >
          <span className="sitting-launcher__mode-title">🎯 Full exam</span>
          <span className="sitting-launcher__mode-sub">
            The real iAssess run: launch ceremony, one clock across all questions, scroll
            discipline, two-stage end, then self-mark against the guide.
          </span>
        </button>
      </div>

      <div className="sitting-launcher__body">
        {mode === 'exam' ? (
          <ExamPlayer sitting={sitting} guestId={guestId} onExit={onClose} />
        ) : (
          <FriendlyPractice sitting={sitting} guestId={guestId} />
        )}
      </div>
    </div>
  );
}

