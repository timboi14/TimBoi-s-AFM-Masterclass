import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SHEET_COLS, SHEET_ROWS, colLabel } from '@/lib/cbe-storage';

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
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editing]);

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
    <div className="cbe-sheet">
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
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelected({ r, c });
                        if (!isEditing) setEditing(null);
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

/** =SUM(A1:A4), =AVG(...), =MIN(...), =MAX(...), or =A1+B2*C3 (numeric).
 *  Plain text otherwise. Returns the raw string for anything we can't evaluate. */
function evalIfFormula(cell: string, sheet: string[][]): string {
  if (!cell || !cell.startsWith('=')) return cell;
  try {
    const expr = cell.slice(1).trim();
    const fnMatch = /^(SUM|AVG|AVERAGE|MIN|MAX|COUNT)\(([A-Z]+\d+):([A-Z]+\d+)\)$/i.exec(expr);
    if (fnMatch) {
      const [, fn, fromRef, toRef] = fnMatch;
      const range = collectRange(fromRef, toRef, sheet);
      const nums = range.map(Number).filter((n) => !Number.isNaN(n));
      if (nums.length === 0) return '#N/A';
      switch (fn.toUpperCase()) {
        case 'SUM':
          return formatNum(nums.reduce((a, b) => a + b, 0));
        case 'AVG':
        case 'AVERAGE':
          return formatNum(nums.reduce((a, b) => a + b, 0) / nums.length);
        case 'MIN':
          return formatNum(Math.min(...nums));
        case 'MAX':
          return formatNum(Math.max(...nums));
        case 'COUNT':
          return String(nums.length);
      }
    }
    // Generic numeric expression with cell refs (A1, B2, ...)
    const substituted = expr.replace(/[A-Z]+\d+/g, (ref) => {
      const v = lookupCell(ref, sheet);
      const n = Number(v);
      return Number.isNaN(n) ? '0' : String(n);
    });
    // Only allow digits, operators, parens, dot, whitespace
    if (!/^[\d+\-*/().\s]+$/.test(substituted)) return '#ERR';
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${substituted});`)();
    return typeof result === 'number' && Number.isFinite(result) ? formatNum(result) : '#ERR';
  } catch {
    return '#ERR';
  }
}

function formatNum(n: number): string {
  // Avoid floating-point garbage tails like 0.30000000000000004
  if (Number.isInteger(n)) return n.toLocaleString();
  return Number(n.toFixed(4)).toLocaleString();
}

function parseRef(ref: string): { r: number; c: number } | null {
  const m = /^([A-Z]+)(\d+)$/i.exec(ref);
  if (!m) return null;
  const col = m[1].toUpperCase().split('').reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
  const row = Number(m[2]) - 1;
  if (row < 0 || row >= SHEET_ROWS || col < 0 || col >= SHEET_COLS) return null;
  return { r: row, c: col };
}

function lookupCell(ref: string, sheet: string[][]): string {
  const p = parseRef(ref);
  if (!p) return '';
  return sheet[p.r]?.[p.c] ?? '';
}

function collectRange(from: string, to: string, sheet: string[][]): string[] {
  const a = parseRef(from);
  const b = parseRef(to);
  if (!a || !b) return [];
  const r1 = Math.min(a.r, b.r);
  const r2 = Math.max(a.r, b.r);
  const c1 = Math.min(a.c, b.c);
  const c2 = Math.max(a.c, b.c);
  const out: string[] = [];
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      out.push(sheet[r]?.[c] ?? '');
    }
  }
  return out;
}
