import { useState } from 'react';
import { DraggablePopup } from './DraggablePopup';
import { useCBE } from './cbe-context';
import { evaluateExpr } from '@/lib/cbe-calc';

// Memory + last-answer persist for the whole browser session (spec: the popup
// keeps its memory value even when closed and re-opened).
let sessionMemory = 0;
let sessionAns = 0;

interface Key {
  p: string;            // primary label
  s?: string;           // 2nd-shift label (small, above)
  run: () => void;      // primary action
  run2?: () => void;    // 2nd action
  cls?: string;         // colour variant
  wide?: boolean;
}

export function CalculatorPopup() {
  const { closePopup } = useCBE();
  const [display, setDisplay] = useState('');
  const [done, setDone] = useState(false); // last action was = / reset
  const [shifted, setShifted] = useState(false);
  const [mem, setMem] = useState(sessionMemory);

  const show = display === '' ? '0' : display;

  const append = (tok: string) => {
    setDisplay((d) => {
      if (done) return /[-+×÷^]/.test(tok) ? d + tok : tok;
      if (d === 'MEMORY CLEARED' || d === 'ERROR') return tok;
      return d + tok;
    });
    setDone(false);
  };

  const enter = () => {
    const res = evaluateExpr(display, { ans: sessionAns, M: sessionMemory });
    if (res !== 'ERROR') {
      sessionAns = Number(res) || 0;
    }
    setDisplay(res);
    setDone(true);
  };

  const clearEntry = () => { setDisplay(''); setDone(false); };
  const del = () => {
    if (done) { setDisplay(''); setDone(false); return; }
    setDisplay((d) => (d === 'ERROR' || d === 'MEMORY CLEARED' ? '' : d.slice(0, -1)));
  };
  const reset = () => {
    sessionMemory = 0; sessionAns = 0; setMem(0);
    setDisplay('MEMORY CLEARED'); setDone(true);
  };
  const clearVar = () => {
    sessionMemory = 0; setMem(0);
    setDisplay('MEMORY CLEARED'); setDone(true);
  };
  const store = () => {
    const res = evaluateExpr(display, { ans: sessionAns, M: sessionMemory });
    if (res !== 'ERROR') { sessionMemory = Number(res) || 0; setMem(sessionMemory); setDisplay(res); setDone(true); }
  };

  const press = (k: Key) => {
    if (shifted && k.run2) { k.run2(); setShifted(false); return; }
    k.run();
    setShifted(false);
  };

  const a = (t: string) => () => append(t);

  const ROWS: Key[][] = [
    [
      { p: '2nd', run: () => setShifted((s) => !s), cls: 'second' },
      { p: 'mode', s: 'quit', run: () => {} },
      { p: 'del', s: 'insert', run: del },
      { p: '▲', run: () => {}, cls: 'dpad' },
    ],
    [
      { p: 'log', s: '10ˣ', run: a('log('), run2: a('10^(') },
      { p: 'prb', s: 'angle', run: () => {} },
      { p: 'data', s: 'stat', run: () => {} },
      { p: '◀', run: () => {}, cls: 'dpad' },
      { p: '●', run: () => {}, cls: 'dpad' },
      { p: '▶', run: () => {}, cls: 'dpad' },
    ],
    [
      { p: 'ln', s: 'eˣ', run: a('ln('), run2: a('e^(') },
      { p: 'n/d', s: 'Uⁿ/d', run: () => {} },
      { p: '×10ⁿ', s: 'eng', run: a('ᴇ') },
      { p: 'f◀▶d', s: 'table', run: () => {} },
      { p: 'clear', run: clearEntry },
      { p: '▼', run: () => {}, cls: 'dpad' },
    ],
    [
      { p: 'π', s: 'hyp', run: a('π') },
      { p: 'sin', s: 'sin⁻¹', run: a('sin('), run2: a('asin(') },
      { p: 'cos', s: 'cos⁻¹', run: a('cos('), run2: a('acos(') },
      { p: 'tan', s: 'tan⁻¹', run: a('tan('), run2: a('atan(') },
      { p: '÷', s: 'K', run: a('÷'), cls: 'op' },
    ],
    [
      { p: '^', s: 'xʸ', run: a('^') },
      { p: 'x⁻¹', run: a('^(-1)') },
      { p: '(', s: '%', run: a('('), run2: a('%') },
      { p: ')', s: '▸%', run: a(')') },
      { p: '×', run: a('×'), cls: 'op' },
    ],
    [
      { p: 'x²', s: '√', run: a('^2'), run2: a('√(') },
      { p: '7', run: a('7'), cls: 'num' },
      { p: '8', run: a('8'), cls: 'num' },
      { p: '9', run: a('9'), cls: 'num' },
      { p: '−', run: a('−'), cls: 'op' },
    ],
    [
      { p: 'clrvar', run: clearVar },
      { p: '4', run: a('4'), cls: 'num' },
      { p: '5', run: a('5'), cls: 'num' },
      { p: '6', run: a('6'), cls: 'num' },
      { p: '+', run: a('+'), cls: 'op' },
    ],
    [
      { p: 'sto▸', s: 'rcl', run: store, run2: a('M') },
      { p: '1', run: a('1'), cls: 'num' },
      { p: '2', run: a('2'), cls: 'num' },
      { p: '3', run: a('3'), cls: 'num' },
      { p: '◂▸', run: () => {} },
    ],
    [
      { p: 'on', s: 'off', run: () => {} },
      { p: '0', s: 'reset', run: a('0'), run2: reset, cls: 'num' },
      { p: '.', s: ',', run: a('.'), cls: 'num' },
      { p: '(−)', s: 'ans', run: a('-'), run2: a('ans') },
      { p: 'enter', run: enter, cls: 'op' },
    ],
  ];

  return (
    <DraggablePopup
      id="calculator"
      title={
        <span className="cbe-calc__brand">
          <strong>TEXAS INSTRUMENTS</strong> <i>TI-30XS MultiView</i>
        </span>
      }
      onClose={() => closePopup('calculator')}
      width={300}
      className="cbe-calc-popup"
    >
      <div className="cbe-calc">
        <div className="cbe-calc__modes">Scientific ▾</div>
        <div className="cbe-calc__lcd" aria-live="polite">
          <span className="cbe-calc__deg">DEG{mem ? ' M' : ''}</span>
          <span className="cbe-calc__readout">{show}</span>
        </div>
        <div className="cbe-calc__keys">
          {ROWS.map((row, ri) => (
            <div key={ri} className="cbe-calc__row">
              {row.map((k, ki) => (
                <button
                  key={ki}
                  type="button"
                  className={`cbe-calc__key ${k.cls ? `cbe-calc__key--${k.cls}` : ''} ${
                    k.p === '2nd' && shifted ? 'cbe-calc__key--shift-on' : ''
                  }`}
                  onClick={() => press(k)}
                >
                  {k.s && <span className="cbe-calc__key-2nd">{k.s}</span>}
                  <span className="cbe-calc__key-main">{k.p}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DraggablePopup>
  );
}
