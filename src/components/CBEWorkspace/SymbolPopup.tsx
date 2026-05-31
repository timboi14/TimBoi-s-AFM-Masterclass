import { useState, type CSSProperties } from 'react';
import { DraggablePopup } from './DraggablePopup';
import { useCBE } from './cbe-context';

const SYMBOLS = ['$', '£', '€', '¥', '₱'];

const TILE_STYLE: CSSProperties = {
  minWidth: 44,
  minHeight: 44,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 22,
  color: '#1c1c1c',
};

export function SymbolPopup() {
  const { closePopup, insertAtCaret } = useCBE();
  const [selected, setSelected] = useState(SYMBOLS[0]);

  return (
    <DraggablePopup id="symbol" title="$ Symbol" onClose={() => closePopup('symbol')} width={300} spawnTop={220}>
      <div className="cbe-symbol">
        <div className="cbe-symbol__row" role="listbox" aria-label="Symbols" style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {SYMBOLS.map((s) => (
            <button
              key={s}
              type="button"
              role="option"
              aria-selected={selected === s}
              className={`cbe-symbol__tile ${selected === s ? 'cbe-symbol__tile--active' : ''}`}
              style={TILE_STYLE}
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
