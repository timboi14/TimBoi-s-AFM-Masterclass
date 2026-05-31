import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAPERS } from '@/data/pastpapers/papers';
import { useCBE } from './cbe-context';
import { hasAnswer, loadFlag } from '@/lib/cbe-tools-storage';

type Status = 'answered' | 'flagged' | 'none';

/**
 * iAssess-style Navigator overlay: lists every paper with its status and jumps
 * to one on click (via the ?p= URL param the grid already reads).
 */
export function Navigator() {
  const { closePopup, guestId } = useCBE();
  const [, setSearchParams] = useSearchParams();

  const rows = useMemo(
    () =>
      PAPERS.map((p) => {
        const flagged = loadFlag(p.id);
        const answered = hasAnswer(guestId, p.id);
        const status: Status = answered ? 'answered' : flagged ? 'flagged' : 'none';
        return { id: p.id, name: p.name, session: p.session, section: p.paperSection, status, flagged };
      }),
    [guestId],
  );

  const go = (id: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('p', id);
      return next;
    });
    closePopup('navigator');
    requestAnimationFrame(() => {
      document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <div className="cbe-nav-overlay" role="dialog" aria-modal="true" aria-label="Question navigator">
      <div className="cbe-nav-overlay__backdrop" onClick={() => closePopup('navigator')} />
      <div className="cbe-nav">
        <div className="cbe-nav__head">
          <span className="cbe-nav__title">▦ Navigator</span>
          <button type="button" className="cbe-nav__close" onClick={() => closePopup('navigator')} aria-label="Close">
            ×
          </button>
        </div>
        <div className="cbe-nav__legend">
          <span><span className="cbe-nav__dot cbe-nav__dot--answered" /> Answered</span>
          <span><span className="cbe-nav__dot cbe-nav__dot--flagged" /> Flagged</span>
          <span><span className="cbe-nav__dot cbe-nav__dot--none" /> Not started</span>
        </div>
        <ul className="cbe-nav__list">
          {rows.map((r) => (
            <li key={r.id}>
              <button type="button" className="cbe-nav__item" onClick={() => go(r.id)}>
                <span className={`cbe-nav__dot cbe-nav__dot--${r.status}`} aria-hidden />
                <span className="cbe-nav__item-name">{r.name}</span>
                <span className="cbe-nav__item-meta">
                  {r.flagged && <span className="cbe-nav__flag" aria-label="Flagged">⚑</span>}
                  Sec {r.section} · {r.session}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
