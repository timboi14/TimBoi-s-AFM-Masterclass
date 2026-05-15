/**
 * Runtime type-narrowing helpers.
 *
 * Two thin guards used across the app:
 *  - errorMessage: pull a string out of an `unknown` caught value
 *  - readEnum: narrow a localStorage string to a known literal union
 */

/** Narrow an `unknown` thrown value to an Error-like message. */
export function errorMessage(e: unknown, fallback = 'Unexpected error'): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return fallback;
}

/** Narrow a localStorage string to a known string-literal union. */
export function readEnum<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return (allowed as readonly string[]).includes(raw ?? '') ? (raw as T) : fallback;
}
