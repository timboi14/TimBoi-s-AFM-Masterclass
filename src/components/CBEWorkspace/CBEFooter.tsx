import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PAPERS } from '@/data/pastpapers/papers';
import { useCBE } from './cbe-context';

/** iAssess-style footer: Help/Formulae on the left, Prev · Navigator · Next on the right. */
export function CBEFooter({ paperId }: { paperId: string }) {
  const { openPopup } = useCBE();
  const [, setSearchParams] = useSearchParams();

  const idx = useMemo(() => PAPERS.findIndex((p) => p.id === paperId), [paperId]);
  const goto = (i: number) => {
    const p = PAPERS[i];
    if (!p) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('p', p.id);
      return next;
    });
  };

  return (
    <div className="cbe-footer">
      <a
        href="/formulas"
        target="_blank"
        rel="noreferrer"
        className="cbe-footer__link"
        title="Formulae sheet (opens the Formulas reference)"
      >
        ⓘ Help / Formulae Sheet
      </a>
      <div className="cbe-footer__nav">
        <button type="button" className="cbe-footer__link" disabled={idx <= 0} onClick={() => goto(idx - 1)}>
          ← Previous
        </button>
        <button type="button" className="cbe-footer__link" onClick={() => openPopup('navigator')}>
          ▦ Navigator
        </button>
        <button type="button" className="cbe-footer__link" disabled={idx < 0 || idx >= PAPERS.length - 1} onClick={() => goto(idx + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}
