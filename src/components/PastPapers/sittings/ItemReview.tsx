import { useState } from 'react';
import type { Sitting } from '@/lib/sittings';
import type { ExamSession } from '@/lib/exam-session';
import { hasAnswer, loadFlag } from '@/lib/cbe-tools-storage';

interface Props {
  sitting: Sitting;
  guestId: string;
  session: ExamSession;
  onSelfMark: () => void;
}

type Status = 'Attempted' | 'Not attempted' | 'Unseen';
type Filter = 'all' | 'not-attempted' | 'flagged';

/**
 * Item Review screen, shown straight after the exam ends. Mirrors the iAssess
 * states verbatim: each question is Attempted, Not attempted or Unseen, with a
 * flag column and quick filters. From here you move on to self-marking.
 */
export function ItemReview({ sitting, guestId, session, onSelfMark }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = sitting.questions.map((sq, i) => {
    const seen = session.viewed.includes(i);
    const attempted = hasAnswer(guestId, sq.paper.id);
    const flagged = loadFlag(sq.paper.id);
    const status: Status = !seen ? 'Unseen' : attempted ? 'Attempted' : 'Not attempted';
    return { sq, status, flagged };
  });

  const visible = rows.filter((r) => {
    if (filter === 'not-attempted') return r.status !== 'Attempted';
    if (filter === 'flagged') return r.flagged;
    return true;
  });

  const FILTERS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Review all' },
    { id: 'not-attempted', label: 'Review not attempted' },
    { id: 'flagged', label: 'Review flagged' },
  ];

  return (
    <div className="item-review">
      <h3 className="item-review__title">Item review</h3>
      <p className="item-review__intro">
        The exam is over. Here is where every question landed. When you are ready, move on to
        self-marking to score your answers against the guide.
      </p>

      <div className="item-review__filters" role="group" aria-label="Item review filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`item-review__filter ${filter === f.id ? 'item-review__filter--active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <table className="item-review__table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Status</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={r.sq.paper.id}>
              <td>
                <strong>{r.sq.label}</strong> {r.sq.paper.name}
              </td>
              <td>
                <span className={`item-review__status item-review__status--${r.status.toLowerCase().replace(' ', '-')}`}>
                  {r.status}
                </span>
              </td>
              <td>{r.flagged ? <span aria-label="Flagged">⚑</span> : <span className="item-review__dash">—</span>}</td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={3} className="item-review__empty">
                Nothing matches this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="item-review__actions">
        <button type="button" className="item-review__primary" onClick={onSelfMark}>
          Go to self-marking →
        </button>
      </div>
    </div>
  );
}

