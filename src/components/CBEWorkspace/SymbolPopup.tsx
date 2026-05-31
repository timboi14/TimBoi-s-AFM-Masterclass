import { useState } from 'react';
import { DraggablePopup } from './DraggablePopup';
import { useCBE } from './cbe-context';

const SYMBOLS = ['$', '£', '€', '¥', '₱'];

export function SymbolPopup() {
  const { closePopup, insertAtCaret } = useCBE();
  const [selected, setSelected] = useState(SYMBOLS[0]);

  return (
    <DraggablePopup id="symbol" title="$ Symbol" onClose={() => closePopup('symbol')} width={300}>
      <div className="cbe-symbol">
        <div className="cbe-symbol__row" role="listbox" aria-label="Symbols">
          {SYMBOLS.map((s) => (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected={selected === s}
              className={`cbe-symbol__tile ${selected === s ? 'cbe-symbol__tile--active' : ''}`}
              onClick={() => setSelected(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="cbe-symbol__actions">
          <button
            type="button"
            className="cbe-btn cbe-btn--primary"
            onClick={() => insertAtCaret(selected)}
          >
            Insert
          </button>
          <button type="button" className="cbe-btn" onClick={() => closePopup('symbol')}>
            Close
          </button>
        </div>
      </div>
    </DraggablePopup>
  );
}
