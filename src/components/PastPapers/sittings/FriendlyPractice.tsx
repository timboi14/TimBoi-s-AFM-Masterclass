import { useState } from 'react';
import type { Sitting } from '@/lib/sittings';
import { PaperDetail } from '../PaperDetail';

interface Props {
  sitting: Sitting;
  guestId: string;
}

/**
 * Friendly study mode for a whole sitting: a question chooser strip across the
 * top, then the full per-question detail (scenario, question, timed CBE
 * practice, solution walkthrough, examiner notes) for the chosen question. The
 * realistic skin toggle lives inside that detail, so "exam look without the
 * ceremony" is one click away.
 */
export function FriendlyPractice({ sitting }: Props) {
  const [active, setActive] = useState(0);
  const activeQ = active >= 0 ? sitting.questions[active] : null;

  return (
    <div className="friendly-practice">
      <div className="friendly-practice__chooser" role="tablist" aria-label="Questions in this sitting">
        {sitting.questions.map((q, i) => (
          <button
            key={q.paper.id}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`friendly-practice__q ${active === i ? 'friendly-practice__q--active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="friendly-practice__q-label">{q.label}</span>
            <span className="friendly-practice__q-name">{q.paper.name}</span>
            <span className="friendly-practice__q-marks">
              Section {q.paper.paperSection} · {q.paper.totalMarks}m
            </span>
          </button>
        ))}
      </div>

      {activeQ ? (
        <PaperDetail key={activeQ.paper.id} paper={activeQ.paper} onClose={() => setActive(-1)} />
      ) : (
        <p className="friendly-practice__empty">Pick a question above to open it.</p>
      )}
    </div>
  );
}

