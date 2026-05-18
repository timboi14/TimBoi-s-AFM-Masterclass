import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SHEET_COLS, SHEET_ROWS, colLabel } from '@/lib/cbe-storage';
import { compute as computeCell, CBE_ENGINE_V1 } from '@/lib/sheet-engine';

// Force the engine-version marker to ship into the production bundle so
// scripts/check-deployed-bundle.mjs can grep for it. A no-op at runtime —
// minifiers preserve literal string references unless DCE'd. The data-attr
// in the wrapper below is the production tripwire.
const _engineMarker = CBE_ENGINE_V1;

interface Props {
  value: string[][];
  onChange: (next: string[][]) => void;
}

interface CellKey {
  r: number;
  c: number;
}

/**
 * Minimal ACCA-CBE-style spreadsheet. {SHEET_ROWS} × {SHEET_COLS} editable
 * cells, double-click or type to edit, arrow / tab / enter navigation,
 * basic =SUM(A1:A4), =AVG, =MIN, =MAX, =A1+B1 numeric formulas.
 * No cycle detection — keep formulas non-circular.
 */
export function CBESpreadsheet({ value, onChange }: Props) {
  const [selected, setSelected] = useState<CellKey>({ r: 0, c: 0 });
  const [editing, setEditing] = useState<CellKey | null>(null);
  const [draft, setDraft] = useState<string>('');
  /**
   * `selectOnFocus` tells the next-frame effect whether to select-all (F2 /
   * double-click) or place the caret at the end (start-typing). Until now we
   * unconditionally select-all, which silently dropped the first character
   * when a user typed `=` to start a formula: draft="=" → input mounts →
   * select-all picks "=" → user's next keypress replaces it → cell ends up
   * storing "1+1" instead of "=1+1". Audit feedback 2026-05-18.
   */
  const [selectOnFocus, setSelectOnFocus] = useState<boolean>(true);
  const editRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      if (selectOnFocus) {
        editRef.current.select();
      } else {
        const len = editRef.current.value.length;
        editRef.current.setSelectionRange(len, len);
      }
    }
  }, [editing, selectOnFocus]);

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
    // If the user is starting a fresh edit by typing (withInitial supplied),
    // the next keystroke must APPEND to the seed character, not replace it.
    // F2 / double-click paths leave selectOnFocus=true so the existing cell
    // value is highlighted for one-keystroke replace, matching Excel.
    setSelectOnFocus(withInitial === undefined);
  };

  const commitEdit = () => {
    if (!editing) return;
    setCell(editing.r, editing.c, draft);
    setEditing(null);
  };

  const cancelEdit = () => setEditing(null);

  const move = (dr: number, dc: number) => {
    setSelected((prev) => ({
      r: Math.min(SHEET_ROWS - 1, Math.max(0, prev.r + dr)),
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
      onChange(Array.from({ length: SHEET_ROWS }, () => Array.from({ length: SHEET_COLS }, () => '')));
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
    return formatNum(out.v);
  }
  if (typeof out.v === 'boolean') return out.v ? 'TRUE' : 'FALSE';
  if (Array.isArray(out.v)) return out.v.map((x) => String(x ?? '')).join(', ');
  return String(out.v ?? '');
}

function formatNum(n: number): string {
  // Avoid floating-point garbage tails like 0.30000000000000004 while still
  // showing four decimal places of useful precision for AFM workings.
  if (Number.isInteger(n)) return n.toLocaleString();
  const rounded = Number(n.toFixed(4));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// Range / ref helpers used to live here; they've moved into
// src/lib/sheet-engine.ts where compute() handles all of it natively.
