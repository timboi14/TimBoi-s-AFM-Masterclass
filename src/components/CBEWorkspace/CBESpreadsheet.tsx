import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SHEET_COLS, SHEET_ROWS, colLabel } from '@/lib/cbe-storage';
import { compute as computeCell, CBE_ENGINE_V1 } from '@/lib/sheet-engine';
import { useCBE } from './cbe-context';

// Force the engine-version marker to ship into the production bundle so
// scripts/check-deployed-bundle.mjs can grep for it. A no-op at runtime —
// minifiers preserve literal string references unless DCE'd. The data-attr
// in the wrapper below is the production tripwire.
const _engineMarker = CBE_ENGINE_V1;

// Rows are unbounded. We keep this many empty rows below the furthest-used row
// (and below the cursor) so navigating/typing downward always has somewhere to
// go — the grid grows on demand instead of being capped at SHEET_ROWS.
const ROW_BUFFER = 12;
const ADD_ROWS_STEP = 25;

const emptyRow = (): string[] => Array.from({ length: SHEET_COLS }, () => '');

function lastNonEmptyRow(sheet: string[][]): number {
  for (let r = sheet.length - 1; r >= 0; r--) {
    if (sheet[r]?.some((c) => c !== '')) return r;
  }
  return -1;
}

interface Props {
  value: string[][];
  onChange: (next: string[][]) => void;
}

interface CellKey {
  r: number;
  c: number;
}

/**
 * Minimal ACCA-CBE-style spreadsheet. Unlimited rows × {SHEET_COLS} columns;
 * the grid auto-grows as you fill or navigate downward (plus an "Add rows"
 * button). Double-click or type to edit, arrow / tab / enter navigation,
 * basic =SUM(A1:A4), =AVG, =MIN, =MAX, =A1+B1 numeric formulas.
 * No cycle detection — keep formulas non-circular.
 */
export function CBESpreadsheet({ value, onChange }: Props) {
  const { reportFocus } = useCBE();
  const [selected, setSelected] = useState<CellKey>({ r: 0, c: 0 });
  const [editing, setEditing] = useState<CellKey | null>(null);
  const [draft, setDraft] = useState<string>('');
  const editRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /**
   * Cell-input focus rule (Excel parity, audit batch 04):
   *   - Start-typing path: cell holds the seed character, caret at end so the
   *     next keystroke appends.
   *   - F2 / double-click: existing cell content is loaded, caret at end so
   *     the user can edit a formula without losing it.
   *   - Never select-all on mount. (Old behaviour cost the `=` prefix when a
   *     user typed `=1+1`, and silently destroyed formulas under F2 when the
   *     next typed char replaced the entire selection.)
   */
  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      const len = editRef.current.value.length;
      editRef.current.setSelectionRange(len, len);
    }
  }, [editing]);

  // Grow the grid on demand: always keep a buffer of empty rows below the last
  // used row and below the cursor, so rows are effectively unlimited.
  useEffect(() => {
    const need = Math.max(
      SHEET_ROWS,
      lastNonEmptyRow(value) + 1 + ROW_BUFFER,
      selected.r + 1 + ROW_BUFFER,
    );
    if (value.length < need) {
      onChange([...value, ...Array.from({ length: need - value.length }, emptyRow)]);
    }
  }, [value, selected.r, onChange]);

  const addRows = () => onChange([...value, ...Array.from({ length: ADD_ROWS_STEP }, emptyRow)]);

  const setCell = useCallback(
    (r: number, c: number, v: string) => {
      const next = value.map((row, ri) => (ri === r ? row.map((cv, ci) => (ci === c ? v : cv)) : row));
      onChange(next);
    },
    [value, onChange],
  );

  const beginEdit = (r: number, c: number, withInitial?: string) => {
    setSelected({ r, c });
    setEditing({ r, c });
    setDraft(withInitial !== undefined ? withInitial : value[r]?.[c] ?? '');
  };

  const commitEdit = () => {
    if (!editing) return;
    setCell(editing.r, editing.c, draft);
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const move = (dr: number, dc: number) => {
    setSelected((prev) => ({
      // Down is only bounded by the current grid length; the grow-effect keeps a
      // buffer below, so the cursor can always descend (rows are unlimited).
      r: Math.max(0, Math.min(value.length - 1, prev.r + dr)),
      c: Math.min(SHEET_COLS - 1, Math.max(0, prev.c + dc)),
    }));
  };

  const onGridKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (editing) return; // editing handles its own keys
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        move(-1, 0);
        return;
      case 'ArrowDown':
      case 'Enter':
        e.preventDefault();
        move(1, 0);
        return;
      case 'ArrowLeft':
        e.preventDefault();
        move(0, -1);
        return;
      case 'ArrowRight':
      case 'Tab':
        e.preventDefault();
        move(0, e.shiftKey ? -1 : 1);
        return;
      case 'Backspace':
      case 'Delete':
        e.preventDefault();
        setCell(selected.r, selected.c, '');
        return;
      case 'F2':
        e.preventDefault();
        beginEdit(selected.r, selected.c);
        return;
      default:
        // Start typing → enter edit mode with that character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          beginEdit(selected.r, selected.c, e.key);
          e.preventDefault();
        }
    }
  };

  const onEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
      move(1, 0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      commitEdit();
      move(0, e.shiftKey ? -1 : 1);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  };

  const clearAll = () => {
    if (window.confirm('Clear all spreadsheet cells for this paper?')) {
      setEditing(null);
      setSelected({ r: 0, c: 0 });
      onChange(Array.from({ length: SHEET_ROWS }, emptyRow));
    }
  };

  return (
    <div className="cbe-sheet" data-engine={_engineMarker}>
      <div className="cbe-sheet__toolbar" role="toolbar" aria-label="Spreadsheet">
        <span className="cbe-sheet__addr">
          {colLabel(selected.c)}
          {selected.r + 1}
        </span>
        <span className="cbe-sheet__formula" aria-live="polite">
          {editing ? draft : value[selected.r]?.[selected.c] ?? ''}
        </span>
        <span className="cbe-sheet__rowcount" title="Rows grow automatically as you fill the sheet">
          {value.length} rows
        </span>
        <button type="button" onClick={addRows} className="cbe-sheet__btn">
          + Add {ADD_ROWS_STEP} rows
        </button>
        <button type="button" onClick={clearAll} className="cbe-sheet__btn cbe-sheet__btn--danger">
          ✕ Clear sheet
        </button>
      </div>
      <div
        ref={gridRef}
        className="cbe-sheet__grid-wrap"
        tabIndex={0}
        onKeyDown={onGridKeyDown}
        aria-label="Spreadsheet grid; arrows to navigate, type to edit"
        role="grid"
      >
        <table className="cbe-sheet__grid">
          <thead>
            <tr>
              <th className="cbe-sheet__corner" />
              {Array.from({ length: SHEET_COLS }, (_, c) => (
                <th key={c} className="cbe-sheet__colhead" scope="col">
                  {colLabel(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.map((row, r) => (
              <tr key={r}>
                <th className="cbe-sheet__rowhead" scope="row">
                  {r + 1}
                </th>
                {row.map((cellValue, c) => {
                  const isSelected = selected.r === r && selected.c === c;
                  const isEditing = editing?.r === r && editing?.c === c;
                  return (
                    <td
                      key={c}
                      className={`cbe-sheet__cell ${isSelected ? 'cbe-sheet__cell--selected' : ''}`}
                      onPointerDown={(e) => {
                        // Don't preventDefault — we need focus to land on the grid
                        // wrapper so the keyboard handler can pick up typing/F2/arrows.
                        // If the user taps a cell that's already selected, enter edit
                        // mode immediately (Google-Sheets-style behaviour on touch).
                        if (isSelected && !isEditing) {
                          beginEdit(r, c);
                          return;
                        }
                        setSelected({ r, c });
                        if (!isEditing) setEditing(null);
                        // Pull focus onto the grid wrapper so subsequent keys work.
                        // Defer to next tick so React's onPointerDown completes first.
                        if (!isEditing) {
                          requestAnimationFrame(() => gridRef.current?.focus());
                        }
                      }}
                      onDoubleClick={() => beginEdit(r, c)}
                    >
                      {isEditing ? (
                        <input
                          ref={editRef}
                          className="cbe-sheet__input"
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          onKeyDown={onEditKeyDown}
                          onBlur={commitEdit}
                          onFocus={() => editRef.current && reportFocus(editRef.current, 'sheet')}
                        />
                      ) : (
                        <span className="cbe-sheet__display">{evalIfFormula(cellValue, value)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Render a cell's display value.
 *
 * Routes every `=formula` through the real sheet-engine (`computeCell`),
 * which supports the full ACCA function library: NPV, AFM_NPV (year-0 aware),
 * IRR, MIRR, SUMPRODUCT, NORMSDIST / NORM.S.DIST, NORMSINV / NORM.S.INV,
 * EXP, LN, SQRT, BSCALL/BSPUT, IRP/PPP, etc.
 *
 * Audit feedback 2026-05-18: the previous in-file evalIfFormula only handled
 * SUM/AVG/MIN/MAX ranges + basic arithmetic, so AFM_NPV / SUMPRODUCT etc were
 * dead code. This delegates to compute() so the engine work in
 * src/lib/sheet-engine.ts actually reaches users.
 */
function evalIfFormula(cell: string, sheet: string[][]): string {
  if (!cell) return '';
  if (!cell.startsWith('=')) return cell;
  const out = computeCell(sheet, cell);
  if (!out.ok) return out.v; // "#ERR" or "#CYCLE" — already a string
  if (typeof out.v === 'number') {
    if (!Number.isFinite(out.v)) return '#NUM';
    return formatNum(out.v, inferPrecision(cell));
  }
  if (typeof out.v === 'boolean') return out.v ? 'TRUE' : 'FALSE';
  if (Array.isArray(out.v)) return out.v.map((x) => String(x ?? '')).join(', ');
  return String(out.v ?? '');
}

type Precision = 'currency' | 'pv4' | 'integer' | 'auto';

/**
 * Infer a display precision from the leading function in the formula. ACCA
 * exam convention is 4dp for present-value factors and probabilities, 2dp
 * for currency, integer for counts. Audit batch 04: makes display rounding
 * consistent (`=POWER(1.1,5)` now reads 1.6105, `=NORM.S.INV(0.975)` reads
 * 1.9600, not 1.96).
 */
function inferPrecision(formula: string): Precision {
  // Strip "=" and any leading whitespace, take the first identifier.
  const head = /^=\s*([A-Z][A-Z0-9_.]*)/i.exec(formula);
  if (!head) return 'auto';
  const fn = head[1].toUpperCase();
  if (fn === 'NPV' || fn === 'AFM_NPV' || fn === 'AFM.NPV' || fn === 'PV' || fn === 'FV' || fn === 'PMT' || fn === 'WACC' || fn === 'IRR' || fn === 'MIRR') return 'currency';
  if (fn === 'NORMSDIST' || fn === 'NORM.S.DIST' || fn === 'NORMSINV' || fn === 'NORM.S.INV' || fn === 'BSCALL' || fn === 'BSPUT' || fn === 'PVIF' || fn === 'AF' || fn === 'ANNUITYFACTOR' || fn === 'POWER' || fn === 'POW' || fn === 'EXP' || fn === 'LN' || fn === 'LOG' || fn === 'LOG10' || fn === 'SQRT' || fn === 'CAPM' || fn === 'UNGEAR' || fn === 'REGEAR' || fn === 'FISHER' || fn === 'IRP' || fn === 'PPP') return 'pv4';
  if (fn === 'COUNT' || fn === 'IF' || fn === 'AND' || fn === 'OR' || fn === 'NOT' || fn === 'CEIL' || fn === 'CEILING' || fn === 'FLOOR' || fn === 'ROUND') return 'integer';
  return 'auto';
}

function formatNum(n: number, precision: Precision = 'auto'): string {
  // Avoid floating-point garbage tails like 0.30000000000000004 while keeping
  // exam-grade precision. Currency shows 2dp with grouping; pv4 shows 4dp;
  // integer drops the fractional part; auto picks the tightest non-zero dp
  // up to 4.
  if (precision === 'integer') return Math.round(n).toLocaleString();
  if (precision === 'currency') {
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (precision === 'pv4') {
    return n.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }
  // auto
  if (Number.isInteger(n)) return n.toLocaleString();
  const rounded = Number(n.toFixed(4));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// Range / ref helpers used to live here; they've moved into
// src/lib/sheet-engine.ts where compute() handles all of it natively.
