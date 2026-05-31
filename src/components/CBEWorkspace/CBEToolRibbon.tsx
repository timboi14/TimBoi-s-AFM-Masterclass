import { useState, type ReactNode } from 'react';
import { useCBE, type PopupId } from './cbe-context';

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Green', value: '#CCFF99' },
  { name: 'Pink', value: '#FFB3BA' },
  { name: 'Blue', value: '#BAD9FF' },
];

/** Label with the first letter underlined (access-key style, like iAssess). */
function AccessLabel({ text }: { text: string }) {
  return (
    <>
      <u>{text.charAt(0)}</u>
      {text.slice(1)}
    </>
  );
}

function RibbonButton({
  icon,
  label,
  active,
  onClick,
  extra,
  tone = 'red',
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  extra?: ReactNode;
  tone?: 'red' | 'amber';
}) {
  return (
    <span className="cbe-ribbon__group-btn">
      <button
        type="button"
        className={`cbe-ribbon__btn ${active ? `cbe-ribbon__btn--active cbe-ribbon__btn--${tone}` : ''}`}
        onClick={onClick}
      >
        <span className="cbe-ribbon__icon" aria-hidden>{icon}</span>
        <span className="cbe-ribbon__label"><AccessLabel text={label} /></span>
      </button>
      {extra}
    </span>
  );
}

export function CBEToolRibbon() {
  const {
    isOpen, togglePopup, openPopup, closeAll,
    applyHighlight, applyStrikethrough,
    highlightColor, setHighlightColor,
    flagged, toggleFlag,
  } = useCBE();
  const [swatchOpen, setSwatchOpen] = useState(false);

  const tool = (id: PopupId) => () => togglePopup(id);

  return (
    <div className="cbe-ribbon tool-ribbon" role="toolbar" aria-label="CBE tools">
      <div className="cbe-ribbon__left">
        <RibbonButton icon="✏" label="Scratch Pad" active={isOpen('scratchpad')} onClick={tool('scratchpad')} />
        <RibbonButton icon="$" label="Symbol" active={isOpen('symbol')} onClick={tool('symbol')} />
        <RibbonButton
          icon="▣"
          label="Highlight"
          onClick={applyHighlight}
          extra={
            <span className="cbe-ribbon__hl">
              <span className="cbe-ribbon__swatch" style={{ background: highlightColor }} aria-hidden />
              <button
                type="button"
                className="cbe-ribbon__caret"
                aria-label="Highlight colour"
                aria-expanded={swatchOpen}
                onClick={() => setSwatchOpen((o) => !o)}
              >
                ▾
              </button>
              {swatchOpen && (
                <div className="cbe-ribbon__swatch-menu" role="menu">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      role="menuitemradio"
                      aria-checked={highlightColor === c.value}
                      className="cbe-ribbon__swatch-opt"
                      style={{ background: c.value }}
                      title={c.name}
                      onClick={() => { setHighlightColor(c.value); setSwatchOpen(false); }}
                    />
                  ))}
                </div>
              )}
            </span>
          }
        />
        <RibbonButton icon="┼" label="Strikethrough" onClick={applyStrikethrough} />
        <RibbonButton icon="🖩" label="Calculator" active={isOpen('calculator')} onClick={tool('calculator')} />
      </div>

      <div className="cbe-ribbon__right">
        <RibbonButton icon="⊠" label="Close All" onClick={closeAll} />
        <RibbonButton icon="▦" label="Navigator" active={isOpen('navigator')} onClick={() => openPopup('navigator')} />
        <RibbonButton
          icon={flagged ? '⚑' : '⚐'}
          label="Flag for Review"
          active={flagged}
          tone="amber"
          onClick={toggleFlag}
        />
      </div>
    </div>
  );
}
