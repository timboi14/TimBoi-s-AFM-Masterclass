/**
 * User identity resolution — Sprint 3 transitional shim.
 *
 * Until auth lands (Spec §3, blocked on DATABASE_URL + OAuth credentials),
 * the workspace uses one of three handles in order:
 *
 *   1. The authenticated user's `handle` from the session — TODO Sprint 3.
 *   2. The user's hand-typed `fanName` from store.ts (legacy localStorage).
 *   3. A stable demo handle auto-seeded into localStorage with a 6-char
 *      readable suffix (e.g. "Demo · K7Z3PQ") so the badge never says
 *      "timboi" by default and demo data is keyed predictably.
 *
 * Why a deterministic suffix: the badge needs to look intentional rather
 * than blank, and the suffix gives users a way to spot if a different
 * browser/profile is using the same study tool (collision protection).
 */

import { safeFanName } from './safe-storage';

const DEMO_KEY = 'tba.identity.demo.v1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // skip I,O,0,1 for readability

export interface ResolvedIdentity {
  /** Stable storage key — used everywhere the workspace persists per-user state. */
  storageKey: string;
  /** Display label — what shows in the workspace badge. */
  displayLabel: string;
  /** Source mode for the UI to render a clear badge. */
  mode: 'authenticated' | 'fan-name' | 'demo';
}

export function resolveIdentity(fanName?: string): ResolvedIdentity {
  const fan = safeFanName(fanName);
  if (fan) {
    return {
      storageKey: fan,
      displayLabel: fan,
      mode: 'fan-name',
    };
  }
  const demoSuffix = loadOrCreateDemoSuffix();
  return {
    storageKey: `demo-${demoSuffix.toLowerCase()}`,
    displayLabel: `Demo · ${demoSuffix}`,
    mode: 'demo',
  };
}

function loadOrCreateDemoSuffix(): string {
  if (typeof window === 'undefined') return 'SERVER';
  const existing = localStorage.getItem(DEMO_KEY);
  if (existing && /^[A-Z0-9]{6}$/.test(existing)) return existing;
  const suffix = randomSuffix(6);
  try { localStorage.setItem(DEMO_KEY, suffix); } catch { /* private mode — fall through with ephemeral suffix */ }
  return suffix;
}

function randomSuffix(len: number): string {
  let out = '';
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint8Array(len);
    crypto.getRandomValues(buf);
    for (let i = 0; i < len; i++) out += ALPHABET[buf[i] % ALPHABET.length];
    return out;
  }
  // Fallback when crypto is unavailable (very old browsers / locked-down envs).
  for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}
