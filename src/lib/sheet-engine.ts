/**
 * Mini spreadsheet engine for the practice exam centre.
 * Supports: arithmetic, parentheses, cell refs (A1, AB12), ranges (A1:B5),
 * a function library tuned for AFM (NPV, IRR, PV, FV, PMT, ROUND, etc).
 * Recursive descent, no eval, no third-party deps.
 */

import { errorMessage } from '@/lib/guards';

export type Cell = string;
export type Sheet = Cell[][];

// Parser value algebra: scalars produced by primary expressions, or
// CellValue[] when a function arg is a range like A1:B5.
type CellValue = number | string | boolean;
type ExprValue = CellValue | CellValue[];

const MAX_ITER = 200;

export function colLetter(i: number): string {
  // 0 -> A, 25 -> Z, 26 -> AA
  let n = i;
  let s = '';
  while (n >= 0) {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
    if (n < 0) break;
  }
  return s;
}

function colIndex(letters: string): number {
  let n = 0;
  for (let i = 0; i < letters.length; i++) {
    n = n * 26 + (letters.charCodeAt(i) - 64);
  }
  return n - 1;
}

function getCell(sheet: Sheet, r: number, c: number): Cell {
  return sheet[r]?.[c] ?? '';
}

export type ComputeResult =
  | { ok: true; v: ExprValue }
  | { ok: false; v: '#CYCLE' | '#ERR'; err: string };

export function compute(sheet: Sheet, value: Cell, depth = 0): ComputeResult {
  if (depth > MAX_ITER) return { ok: false, v: '#CYCLE', err: 'cyclic reference' };
  if (typeof value !== 'string') return { ok: true, v: value };
  const s = value.trim();
  if (!s.startsWith('=')) {
    if (s === '') return { ok: true, v: '' };
    const n = Number(s.replace(/,/g, ''));
    if (!isNaN(n) && /^[-+]?[0-9.]+(?:[eE][-+]?\d+)?$/.test(s.replace(/,/g, ''))) return { ok: true, v: n };
    return { ok: true, v: s };
  }
  try {
    const expr = s.slice(1);
    const parser = new Parser(expr, sheet, depth);
    const v = parser.parseExpression();
    if (parser.peek() !== null) throw new Error('Unexpected: ' + parser.peek());
    return { ok: true, v };
  } catch (e) {
    return { ok: false, v: '#ERR', err: errorMessage(e, 'error') };
  }
}

export function display(sheet: Sheet, r: number, c: number): string {
  const raw = getCell(sheet, r, c);
  const out = compute(sheet, raw);
  if (!out.ok) return out.v;
  if (typeof out.v === 'number') {
    if (!isFinite(out.v)) return '#NUM';
    return Math.abs(out.v) > 1e9 || Math.abs(out.v) < 1e-6 ? out.v.toExponential(4) : Number(out.v.toFixed(4)).toString();
  }
  if (typeof out.v === 'boolean') return out.v ? 'TRUE' : 'FALSE';
  return String(out.v ?? '');
}

class Parser {
  i = 0;
  constructor(public src: string, public sheet: Sheet, public depth: number) {}

  peek(): string | null {
    while (this.i < this.src.length && /\s/.test(this.src[this.i])) this.i++;
    return this.i < this.src.length ? this.src[this.i] : null;
  }

  consume(s: string): boolean {
    this.peek();
    if (this.src.slice(this.i, this.i + s.length).toUpperCase() === s.toUpperCase()) {
      this.i += s.length;
      return true;
    }
    return false;
  }

  // expression: comparison
  parseExpression(): ExprValue {
    return this.parseComparison();
  }
  parseComparison(): ExprValue {
    let left: ExprValue = this.parseAdd();
    this.peek();
    while (true) {
      const op = this.peekOp(['<>', '<=', '>=', '<', '>', '=']);
      if (!op) break;
      this.i += op.length;
      const right = this.parseAdd();
      switch (op) {
        case '=': left = left === right; break;
        case '<>': left = left !== right; break;
        case '<': left = num(left) < num(right); break;
        case '<=': left = num(left) <= num(right); break;
        case '>': left = num(left) > num(right); break;
        case '>=': left = num(left) >= num(right); break;
      }
    }
    return left;
  }
  peekOp(ops: string[]): string | null {
    this.peek();
    for (const op of ops) {
      if (this.src.slice(this.i, this.i + op.length) === op) return op;
    }
    return null;
  }
  parseAdd(): ExprValue {
    let v: ExprValue = this.parseMul();
    while (true) {
      const c = this.peek();
      if (c === '+') { this.i++; v = num(v) + num(this.parseMul()); }
      else if (c === '-') { this.i++; v = num(v) - num(this.parseMul()); }
      else if (c === '&') { this.i++; v = String(v) + String(this.parseMul()); }
      else break;
    }
    return v;
  }
  parseMul(): ExprValue {
    let v: ExprValue = this.parsePow();
    while (true) {
      const c = this.peek();
      if (c === '*') { this.i++; v = num(v) * num(this.parsePow()); }
      else if (c === '/') {
        this.i++;
        const r = num(this.parsePow());
        if (r === 0) throw new Error('div by zero');
        v = num(v) / r;
      }
      else break;
    }
    return v;
  }
  parsePow(): ExprValue {
    let v: ExprValue = this.parseUnary();
    while (this.peek() === '^') {
      this.i++;
      v = Math.pow(num(v), num(this.parseUnary()));
    }
    return v;
  }
  parseUnary(): ExprValue {
    const c = this.peek();
    if (c === '-') { this.i++; return -num(this.parseUnary()); }
    if (c === '+') { this.i++; return this.parseUnary(); }
    return this.parsePrimary();
  }
  parsePrimary(): ExprValue {
    this.peek();
    const c = this.src[this.i];
    if (c === '(') {
      this.i++;
      const v = this.parseExpression();
      if (this.src[this.i] !== ')') throw new Error('missing )');
      this.i++;
      return v;
    }
    if (c === '"') {
      this.i++;
      let s = '';
      while (this.i < this.src.length && this.src[this.i] !== '"') {
        s += this.src[this.i++];
      }
      this.i++;
      return s;
    }
    if (/[0-9.]/.test(c)) {
      let m = '';
      while (this.i < this.src.length && /[0-9.eE+\-]/.test(this.src[this.i])) {
        const ch = this.src[this.i];
        if ((ch === '+' || ch === '-') && !/[eE]/.test(m[m.length - 1] || '')) break;
        m += ch;
        this.i++;
      }
      return parseFloat(m);
    }
    if (/[A-Za-z_]/.test(c)) {
      // function name or cell ref
      let name = '';
      while (this.i < this.src.length && /[A-Za-z0-9_]/.test(this.src[this.i])) {
        name += this.src[this.i++];
      }
      this.peek();
      if (this.src[this.i] === '(') {
        // function call
        this.i++;
        const args: ExprValue[] = [];
        if (this.src[this.i] !== ')') {
          while (true) {
            // arg can be a range
            const startIdx = this.i;
            const a = this.parseRangeOrExpr();
            args.push(a);
            this.peek();
            if (this.src[this.i] === ',') { this.i++; continue; }
            else if (this.src[this.i] === ')') break;
            else throw new Error('bad arg list near ' + this.src.slice(startIdx, startIdx + 8));
          }
        }
        if (this.src[this.i] !== ')') throw new Error('missing )');
        this.i++;
        return callFunc(name.toUpperCase(), args, this.sheet, this.depth);
      } else {
        // cell ref like A1, AB12
        const m = name.match(/^([A-Z]+)(\d+)$/i);
        if (m) {
          const c = colIndex(m[1].toUpperCase());
          const r = parseInt(m[2], 10) - 1;
          const raw = getCell(this.sheet, r, c);
          const out = compute(this.sheet, raw, this.depth + 1);
          if (!out.ok) throw new Error(out.err || 'ref err');
          return out.v === '' ? 0 : out.v;
        }
        const upper = name.toUpperCase();
        if (upper === 'TRUE') return true;
        if (upper === 'FALSE') return false;
        if (upper === 'PI') return Math.PI;
        if (upper === 'E') return Math.E;
        throw new Error('unknown name: ' + name);
      }
    }
    throw new Error('unexpected char: ' + c);
  }

  parseRangeOrExpr(): ExprValue {
    // Look ahead for a cell-range pattern A1:B5 (only as a special form for function args)
    const save = this.i;
    this.peek();
    const startIdx = this.i;
    const cellM = /^([A-Z]+)(\d+):([A-Z]+)(\d+)/i.exec(this.src.slice(startIdx));
    if (cellM) {
      this.i += cellM[0].length;
      const c1 = colIndex(cellM[1].toUpperCase());
      const r1 = parseInt(cellM[2], 10) - 1;
      const c2 = colIndex(cellM[3].toUpperCase());
      const r2 = parseInt(cellM[4], 10) - 1;
      const values: CellValue[] = [];
      for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
        for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
          const raw = getCell(this.sheet, r, c);
          const out = compute(this.sheet, raw, this.depth + 1);
          if (!out.ok) throw new Error(out.err || 'ref err');
          if (out.v !== '') {
            // Out is `compute` result; arrays only appear at function-arg
            // positions, not here, so the scalar branch is the only one.
            if (Array.isArray(out.v)) {
              for (const x of out.v) values.push(x);
            } else {
              values.push(out.v);
            }
          }
        }
      }
      return values;
    }
    this.i = save;
    return this.parseExpression();
  }
}

function num(v: ExprValue | null | undefined): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v === null || v === undefined || v === '') return 0;
  if (Array.isArray(v)) throw new Error('not a number: array');
  const n = parseFloat(v);
  if (isNaN(n)) throw new Error('not a number: ' + v);
  return n;
}

function flat(args: ExprValue[]): number[] {
  const out: number[] = [];
  for (const a of args) {
    if (Array.isArray(a)) for (const x of a) out.push(num(x));
    else if (a !== '' && a !== null && a !== undefined) out.push(num(a));
  }
  return out;
}

function callFunc(name: string, args: ExprValue[], sheet: Sheet, depth: number): ExprValue {
  switch (name) {
    case 'SUM': return flat(args).reduce((a, b) => a + b, 0);
    case 'AVERAGE':
    case 'AVG':
    case 'MEAN': {
      const v = flat(args);
      if (!v.length) throw new Error('no values');
      return v.reduce((a, b) => a + b, 0) / v.length;
    }
    case 'MIN': return Math.min(...flat(args));
    case 'MAX': return Math.max(...flat(args));
    case 'COUNT': return flat(args).length;
    case 'PRODUCT': return flat(args).reduce((a, b) => a * b, 1);
    case 'ABS': return Math.abs(num(args[0]));
    case 'ROUND': return Number(num(args[0]).toFixed(num(args[1] ?? 0)));
    case 'CEIL':
    case 'CEILING': return Math.ceil(num(args[0]));
    case 'FLOOR': return Math.floor(num(args[0]));
    case 'SQRT': return Math.sqrt(num(args[0]));
    case 'POW':
    case 'POWER': return Math.pow(num(args[0]), num(args[1]));
    case 'EXP': return Math.exp(num(args[0]));
    case 'LN': return Math.log(num(args[0]));
    case 'LOG': return args.length > 1 ? Math.log(num(args[0])) / Math.log(num(args[1])) : Math.log10(num(args[0]));
    case 'LOG10': return Math.log10(num(args[0]));
    case 'IF': {
      const cond = args[0];
      const t = typeof cond === 'boolean' ? cond : num(cond) !== 0;
      return t ? args[1] : args[2];
    }
    case 'AND': return args.every((a) => (typeof a === 'boolean' ? a : num(a) !== 0));
    case 'OR': return args.some((a) => (typeof a === 'boolean' ? a : num(a) !== 0));
    case 'NOT': return !(typeof args[0] === 'boolean' ? args[0] : num(args[0]) !== 0);
    case 'PV': {
      // PV(rate, nper, pmt[, fv][, type])
      const rate = num(args[0]); const nper = num(args[1]); const pmt = num(args[2] ?? 0);
      const fv = num(args[3] ?? 0); const type = num(args[4] ?? 0);
      if (rate === 0) return -(pmt * nper + fv);
      return -(pmt * (1 + rate * type) * (1 - Math.pow(1 + rate, -nper)) / rate + fv * Math.pow(1 + rate, -nper));
    }
    case 'FV': {
      const rate = num(args[0]); const nper = num(args[1]); const pmt = num(args[2] ?? 0);
      const pv = num(args[3] ?? 0); const type = num(args[4] ?? 0);
      if (rate === 0) return -(pv + pmt * nper);
      return -(pv * Math.pow(1 + rate, nper) + pmt * (1 + rate * type) * (Math.pow(1 + rate, nper) - 1) / rate);
    }
    case 'PMT': {
      const rate = num(args[0]); const nper = num(args[1]); const pv = num(args[2]);
      const fv = num(args[3] ?? 0); const type = num(args[4] ?? 0);
      if (rate === 0) return -(pv + fv) / nper;
      return -(rate * (pv * Math.pow(1 + rate, nper) + fv) / ((1 + rate * type) * (Math.pow(1 + rate, nper) - 1)));
    }
    case 'NPV': {
      // NPV(rate, value1, value2, ...)
      const rate = num(args[0]);
      const vals = flat(args.slice(1));
      let s = 0;
      for (let t = 0; t < vals.length; t++) s += vals[t] / Math.pow(1 + rate, t + 1);
      return s;
    }
    case 'IRR': {
      const vals = flat([args[0]]);
      const guess = num(args[1] ?? 0.1);
      // Newton-Raphson
      let r = guess;
      for (let it = 0; it < 100; it++) {
        let f = 0, df = 0;
        for (let t = 0; t < vals.length; t++) {
          const d = Math.pow(1 + r, t);
          f += vals[t] / d;
          if (t > 0) df -= t * vals[t] / (d * (1 + r));
        }
        if (Math.abs(f) < 1e-7) return r;
        if (df === 0) break;
        r = r - f / df;
      }
      throw new Error('IRR did not converge');
    }
    case 'MIRR': {
      // MIRR(values, finance_rate, reinvest_rate)
      const vals = flat([args[0]]);
      const fin = num(args[1]); const re = num(args[2]);
      let pvOut = 0, fvIn = 0;
      const n = vals.length;
      for (let t = 0; t < n; t++) {
        if (vals[t] < 0) pvOut += vals[t] / Math.pow(1 + fin, t);
        else fvIn += vals[t] * Math.pow(1 + re, n - 1 - t);
      }
      if (pvOut === 0) throw new Error('no outflows');
      return Math.pow(fvIn / -pvOut, 1 / (n - 1)) - 1;
    }
    case 'AF':
    case 'ANNUITYFACTOR': {
      // AF(rate, nper) -> standard PV annuity factor
      const r = num(args[0]); const n = num(args[1]);
      if (r === 0) return n;
      return (1 - Math.pow(1 + r, -n)) / r;
    }
    case 'PVIF': {
      // PV factor: 1 / (1+r)^n
      return 1 / Math.pow(1 + num(args[0]), num(args[1]));
    }
    case 'WACC': {
      // WACC(Ke, We, Kd_after_tax, Wd)
      return num(args[0]) * num(args[1]) + num(args[2]) * num(args[3]);
    }
    case 'CAPM': {
      // CAPM(Rf, beta, MRP)
      return num(args[0]) + num(args[1]) * num(args[2]);
    }
    case 'UNGEAR': {
      // UNGEAR(Beta_e, E, D, T) -> Beta_a per M&M2
      const be = num(args[0]); const e = num(args[1]); const d = num(args[2]); const t = num(args[3]);
      return be * e / (e + d * (1 - t));
    }
    case 'REGEAR': {
      // REGEAR(Beta_a, E, D, T) -> Beta_e
      const ba = num(args[0]); const e = num(args[1]); const d = num(args[2]); const t = num(args[3]);
      return ba * (1 + d * (1 - t) / e);
    }
    case 'NORMSDIST': {
      // standard normal cumulative distribution
      const z = num(args[0]);
      // Abramowitz & Stegun 26.2.17
      const t = 1 / (1 + 0.2316419 * Math.abs(z));
      const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
      const v = 1 - phi * (0.319381530 * t - 0.356563782 * t * t + 1.781477937 * Math.pow(t, 3) - 1.821255978 * Math.pow(t, 4) + 1.330274429 * Math.pow(t, 5));
      return z >= 0 ? v : 1 - v;
    }
    case 'BSCALL': {
      // BSCALL(S, K, r, T, sigma)
      const S = num(args[0]); const K = num(args[1]); const r = num(args[2]); const T = num(args[3]); const sig = num(args[4]);
      if (T <= 0 || sig <= 0) return Math.max(0, S - K * Math.exp(-r * T));
      const d1 = (Math.log(S / K) + (r + sig * sig / 2) * T) / (sig * Math.sqrt(T));
      const d2 = d1 - sig * Math.sqrt(T);
      return S * cdfN(d1) - K * Math.exp(-r * T) * cdfN(d2);
    }
    case 'BSPUT': {
      const S = num(args[0]); const K = num(args[1]); const r = num(args[2]); const T = num(args[3]); const sig = num(args[4]);
      if (T <= 0 || sig <= 0) return Math.max(0, K * Math.exp(-r * T) - S);
      const d1 = (Math.log(S / K) + (r + sig * sig / 2) * T) / (sig * Math.sqrt(T));
      const d2 = d1 - sig * Math.sqrt(T);
      return K * Math.exp(-r * T) * cdfN(-d2) - S * cdfN(-d1);
    }
    case 'FISHER': {
      // FISHER(real, h) -> nominal
      return (1 + num(args[0])) * (1 + num(args[1])) - 1;
    }
    case 'IRP': {
      // IRP(spot, i_quote, i_base) -> forward
      return num(args[0]) * (1 + num(args[1])) / (1 + num(args[2]));
    }
    case 'PPP': {
      // PPP(spot, h_quote, h_base) -> forward
      return num(args[0]) * (1 + num(args[1])) / (1 + num(args[2]));
    }
    default:
      throw new Error('unknown function: ' + name);
  }
}

function cdfN(z: number): number {
  // Standard normal CDF (same as NORMSDIST)
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  const v = 1 - phi * (0.319381530 * t - 0.356563782 * t * t + 1.781477937 * Math.pow(t, 3) - 1.821255978 * Math.pow(t, 4) + 1.330274429 * Math.pow(t, 5));
  return z >= 0 ? v : 1 - v;
}

export const FN_CATALOG: { name: string; sig: string; desc: string }[] = [
  { name: 'SUM', sig: 'SUM(range)', desc: 'Total of values' },
  { name: 'AVERAGE', sig: 'AVERAGE(range)', desc: 'Mean value' },
  { name: 'MIN', sig: 'MIN(range)', desc: 'Smallest value' },
  { name: 'MAX', sig: 'MAX(range)', desc: 'Largest value' },
  { name: 'COUNT', sig: 'COUNT(range)', desc: 'Count of values' },
  { name: 'IF', sig: 'IF(cond, then, else)', desc: 'Conditional' },
  { name: 'ROUND', sig: 'ROUND(x, dp)', desc: 'Round to dp' },
  { name: 'ABS', sig: 'ABS(x)', desc: 'Absolute value' },
  { name: 'SQRT', sig: 'SQRT(x)', desc: 'Square root' },
  { name: 'EXP', sig: 'EXP(x)', desc: 'e^x' },
  { name: 'LN', sig: 'LN(x)', desc: 'Natural log' },
  { name: 'POWER', sig: 'POWER(x, y) or x^y', desc: 'Exponent' },
  { name: 'PV', sig: 'PV(rate, nper, pmt, [fv], [type])', desc: 'Present value annuity' },
  { name: 'FV', sig: 'FV(rate, nper, pmt, [pv], [type])', desc: 'Future value annuity' },
  { name: 'PMT', sig: 'PMT(rate, nper, pv, [fv], [type])', desc: 'Annuity payment' },
  { name: 'NPV', sig: 'NPV(rate, v1, v2, ...)', desc: 'Net present value (v1 at t=1)' },
  { name: 'IRR', sig: 'IRR(values, [guess])', desc: 'Internal rate of return' },
  { name: 'MIRR', sig: 'MIRR(values, fin, reinv)', desc: 'Modified IRR' },
  { name: 'AF', sig: 'AF(rate, nper)', desc: 'Annuity factor' },
  { name: 'PVIF', sig: 'PVIF(rate, n)', desc: 'PV factor 1/(1+r)^n' },
  { name: 'WACC', sig: 'WACC(Ke, We, Kd_at, Wd)', desc: 'Weighted average cost of capital' },
  { name: 'CAPM', sig: 'CAPM(Rf, beta, MRP)', desc: 'Cost of equity' },
  { name: 'UNGEAR', sig: 'UNGEAR(Be, E, D, T)', desc: 'Asset beta from equity beta' },
  { name: 'REGEAR', sig: 'REGEAR(Ba, E, D, T)', desc: 'Equity beta from asset beta' },
  { name: 'NORMSDIST', sig: 'NORMSDIST(z)', desc: 'Standard normal CDF' },
  { name: 'BSCALL', sig: 'BSCALL(S, K, r, T, sigma)', desc: 'Black-Scholes call' },
  { name: 'BSPUT', sig: 'BSPUT(S, K, r, T, sigma)', desc: 'Black-Scholes put' },
  { name: 'FISHER', sig: 'FISHER(real, h)', desc: 'Nominal rate from real and inflation' },
  { name: 'IRP', sig: 'IRP(spot, i_q, i_b)', desc: 'Forward FX via interest rate parity' },
  { name: 'PPP', sig: 'PPP(spot, h_q, h_b)', desc: 'Forward FX via purchasing power parity' },
];
