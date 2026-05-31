/**
 * Defensive parsers for the localStorage keys most exposed to tampering.
 *
 * Why hand-rolled (not zod): the surface area is two keys. Pulling in a
 * runtime validator (~12KB gzipped) for two fields would be overkill.
 * Each helper validates shape, caps length, and strips control characters.
 *
 * Always treat localStorage as untrusted on read — another tab, a browser
 * extension, or a previous version of the app could have written garbage.
 */

const CONTROL_CHARS = /[\x00-\x1F\x7F<>]/g;

/** Cap length, strip control characters and angle brackets. Returns the cleaned name or empty string. */
export function safeFanName(raw: unknown, maxLen = 40): string {
  if (typeof raw !== 'string') return '';
  const cleaned = raw.replace(CONTROL_CHARS, '').trim();
  if (cleaned.length === 0) return '';
  return cleaned.slice(0, maxLen);
}

type OnboardingDistance = 'tonight' | 'week' | 'month' | 'twoMonth';
const VALID_DISTANCES = new Set<OnboardingDistance>(['tonight', 'week', 'month', 'twoMonth']);

export interface SafeOnboarding {
  distance: OnboardingDistance;
  dismissed: boolean;
}

/** Parse the onboarding payload. Returns null if missing or malformed. */
export function safeOnboarding(rawJson: string | null): SafeOnboarding | null {
  if (!rawJson) return null;
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') return null;
    const distance = (parsed as { distance?: unknown }).distance;
    const dismissed = (parsed as { dismissed?: unknown }).dismissed;
    if (typeof distance !== 'string' || !VALID_DISTANCES.has(distance as OnboardingDistance)) return null;
    if (typeof dismissed !== 'boolean') return null;
    return { distance: distance as OnboardingDistance, dismissed };
  } catch {
    return null;
  }
}

/**
 * Generic JSON read/write for tba_* keys.
 *
 * Defends against three real failure modes:
 *   - SSR / private mode (no `window` or `localStorage`).
 *   - Malformed payloads written by an older app version or extension.
 *   - QuotaExceededError on write.
 *
 * Callers that need schema validation (onboarding, fan name) keep their
 * own richer parsers above; these are the lowest-common-denominator
 * helpers for plain JSON blobs.
 */
export function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteJson(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}
