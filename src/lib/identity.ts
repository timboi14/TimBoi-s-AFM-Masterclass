/**
 * User identity resolution — Sprint 3 transitional shim.
 *
 * Until auth lands (Spec §3, blocked on DATABASE_URL + OAuth credentials),
 * every visitor is treated as a Demo user. The workspace persists work
 * under a stable demo handle so a single browser keeps state across visits,
 * but the BADGE never shows a hand-typed username — that's the spec's
 * §3 rule "Hard-coded `timboi` username removed — replaced by authenticated
 * user handle. Anonymous demo mode preserved behind /demo with a watermark
 * and capped local persistence."
 *
 * Legacy fanName (typed into NameOverlay before this refactor) is preserved
 * as the storageKey suffix so existing users don't lose their attempt data,
 * but it is NEVER used as the displayed label.
 *
 * Regression audit feedback 2026-05-18: previous version showed fanName when
 * present, which meant existing users still saw "timboi" forever — fix is to
 * always display the demo handle and confine fanName to internal storage
 * keying only.
 */

import { safeFanName } from './safe-storage';

const DEMO_KEY = 'tba.identity.demo.v1';
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // skip I,O,0,1 for readability

export interface ResolvedIdentity {
  /** Stable storage key — used everywhere the workspace persists per-user state. */
  storageKey: string;
  /** Display label — what shows in the workspace badge. Always demo-shaped pre-auth. */
  displayLabel: string;
  /** Source mode for the UI to render a clear badge. */
  mode: 'authenticated' | 'demo';
}

export function resolveIdentity(fanName?: string): ResolvedIdentity {
  // Storage key preserves the legacy fanName verbatim so existing saved
  // workspace data (cbe_<fanName>__<paperId> in localStorage) is still
  // reachable. Display label is ALWAYS the demo handle so the badge never
  // leaks the legacy name.
  const fan = safeFanName(fanName);
  const demoSuffix = loadOrCreateDemoSuffix();
  const storageKey = fan || `demo-${demoSuffix.toLowerCase()}`;
  // Audit 2026-05-26: previous "Demo · …" prefix read as a debug/seed account
  // to first-time visitors. "Guest · …" keeps the §3 constraint (no legacy
  // fanName leak) while making the badge feel like an intentional anonymous mode.
  return {
    storageKey,
    displayLabel: `Guest · ${demoSuffix}`,
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
