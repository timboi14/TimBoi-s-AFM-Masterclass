/**
 * Evaluation engine for the TI-30XS MultiView calculator popup.
 * Uses mathjs with degree-mode trig and base-10 log, matching a TI in DEG mode.
 */
import { create, all } from 'mathjs';

const math = create(all, {});

const toRad = (x: number) => (x * Math.PI) / 180;
const toDeg = (x: number) => (x * 180) / Math.PI;

math.import(
  {
    sin: (x: number) => Math.sin(toRad(x)),
    cos: (x: number) => Math.cos(toRad(x)),
    tan: (x: number) => Math.tan(toRad(x)),
    asin: (x: number) => toDeg(Math.asin(x)),
    acos: (x: number) => toDeg(Math.acos(x)),
    atan: (x: number) => toDeg(Math.atan(x)),
    log: (x: number) => Math.log10(x), // TI "log" = base 10
    ln: (x: number) => Math.log(x), // natural log
  },
  { override: true },
);

/** Translate the on-screen TI expression into mathjs syntax. */
export function toMathExpr(display: string): string {
  let e = display
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/√/g, 'sqrt')
    .replace(/π/g, 'pi')
    .replace(/e\^\(/g, 'exp(')
    .replace(/ᴇ/g, '*10^')
    .replace(/%/g, '/100');
  // Auto-close any unbalanced opening parens so "sin(30" evaluates.
  const opens = (e.match(/\(/g) || []).length;
  const closes = (e.match(/\)/g) || []).length;
  if (opens > closes) e += ')'.repeat(opens - closes);
  return e;
}

export interface CalcScope {
  ans: number;
  M: number;
}

/** Evaluate the display expression; returns a formatted result string or 'ERROR'. */
export function evaluateExpr(display: string, scope: CalcScope): string {
  if (!display.trim()) return '0';
  try {
    const result = math.evaluate(toMathExpr(display), { ans: scope.ans, M: scope.M });
    const num = typeof result === 'number' ? result : Number(result);
    if (!isFinite(num)) return 'ERROR';
    const rounded = Number(math.round(num, 10));
    return String(rounded);
  } catch {
    return 'ERROR';
  }
}
