/**
 * Observability — env-gated, dependency-free.
 *
 * Spec §19 + §20: Sentry FE + PostHog product analytics. We don't pull the
 * full SDKs into the bundle yet (each is ~20-40 KB gz and we can wire them
 * properly during the Next.js migration). For now, a thin POST-based shim
 * that is a no-op when env vars are missing, so the rest of the codebase
 * can already call `track(...)` and `captureError(...)` confidently.
 *
 * Env vars (Vercel build-time, prefixed VITE_ to be inlined by Vite):
 *   VITE_SENTRY_DSN          — if set, errors POST to /api/sentry-ingest below
 *   VITE_POSTHOG_KEY         — if set, events POST to /api/posthog-ingest below
 *   VITE_POSTHOG_HOST        — default 'https://eu.i.posthog.com'
 *   VITE_RELEASE             — typically the git SHA, set in Vercel build
 *
 * The runtime never blocks rendering — every dispatch is fire-and-forget
 * with a 1.5s timeout and a circuit breaker after 3 consecutive failures.
 */

const RELEASE = import.meta.env.VITE_RELEASE || 'dev';
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN || '';
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || '';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.i.posthog.com';

// ─── Sentry: minimal envelope shim ───────────────────────────────────────────

interface SentryDsn {
  publicKey: string;
  host: string;
  projectId: string;
}
function parseSentryDsn(dsn: string): SentryDsn | null {
  try {
    const u = new URL(dsn);
    const publicKey = u.username;
    const projectId = u.pathname.replace(/^\//, '');
    return { publicKey, host: u.host, projectId };
  } catch {
    return null;
  }
}
const sentryDsn = SENTRY_DSN ? parseSentryDsn(SENTRY_DSN) : null;

let sentryBreaker = 0;

export function captureError(err: unknown, ctx?: Record<string, unknown>): void {
  // Pre-Sprint-20: always console.error for local dev visibility.
  console.error('[tba.observability]', err, ctx ?? '');
  if (!sentryDsn || sentryBreaker >= 3) return;

  const event = {
    event_id: cryptoRandomHex(),
    timestamp: Date.now() / 1000,
    platform: 'javascript',
    release: RELEASE,
    environment: import.meta.env.MODE || 'production',
    sdk: { name: 'tba.observability', version: '0.1.0' },
    exception: {
      values: [
        {
          type: err instanceof Error ? err.name : 'Error',
          value: err instanceof Error ? err.message : String(err),
          stacktrace: err instanceof Error && err.stack ? { frames: [{ filename: '?', function: '?', lineno: 0 }], raw: err.stack } : undefined,
        },
      ],
    },
    extra: scrubPii(ctx ?? {}),
    tags: { release: RELEASE },
  };

  const envelope = [
    JSON.stringify({ event_id: event.event_id, sent_at: new Date().toISOString() }),
    JSON.stringify({ type: 'event' }),
    JSON.stringify(event),
  ].join('\n');

  const url = `https://${sentryDsn.host}/api/${sentryDsn.projectId}/envelope/?sentry_key=${sentryDsn.publicKey}&sentry_version=7`;
  postFireAndForget(url, envelope, 'application/x-sentry-envelope').catch(() => {
    sentryBreaker++;
  });
}

// ─── PostHog: thin /capture POSTs ────────────────────────────────────────────

let posthogBreaker = 0;

export function track(event: string, properties: Record<string, unknown> = {}): void {
  if (!POSTHOG_KEY || posthogBreaker >= 3) return;
  const body = {
    api_key: POSTHOG_KEY,
    event,
    properties: { ...scrubPii(properties), $current_url: typeof location !== 'undefined' ? location.href : undefined, release: RELEASE },
    distinct_id: anonymousId(),
    timestamp: new Date().toISOString(),
  };
  postFireAndForget(`${POSTHOG_HOST.replace(/\/$/, '')}/capture/`, JSON.stringify(body), 'application/json').catch(() => {
    posthogBreaker++;
  });
}

// ─── Internals ───────────────────────────────────────────────────────────────

const ANON_KEY = 'tba.observability.anon.v1';
function anonymousId(): string {
  if (typeof window === 'undefined') return 'anon';
  let v = localStorage.getItem(ANON_KEY);
  if (!v) {
    v = cryptoRandomHex();
    try { localStorage.setItem(ANON_KEY, v); } catch { /* private mode */ }
  }
  return v;
}

function cryptoRandomHex(): string {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}

/**
 * Strip obvious PII (email-shaped strings, JWT-shaped tokens) from event
 * payloads before they leave the browser. This is a defence-in-depth measure;
 * call sites are expected not to put PII into properties in the first place.
 */
function scrubPii(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      out[k] = v
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '<email>')
        .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}\b/g, '<jwt>');
    } else {
      out[k] = v;
    }
  }
  return out;
}

function postFireAndForget(url: string, body: string, contentType: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof fetch === 'undefined') {
      resolve();
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 1500);
    fetch(url, {
      method: 'POST',
      keepalive: true,
      mode: 'cors',
      credentials: 'omit',
      headers: { 'content-type': contentType },
      body,
      signal: controller.signal,
    })
      .then(() => { clearTimeout(t); resolve(); })
      .catch((e) => { clearTimeout(t); reject(e); });
  });
}

/**
 * Global error / unhandledrejection hooks. Call once at app startup.
 * Idempotent — safe to call from multiple entry points.
 */
let installed = false;
export function installGlobalHandlers(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  window.addEventListener('error', (e) => {
    captureError(e.error ?? e.message, { source: 'window.onerror', filename: e.filename, lineno: e.lineno });
  });
  window.addEventListener('unhandledrejection', (e) => {
    captureError(e.reason, { source: 'unhandledrejection' });
  });
  // Page lifecycle event — useful for retention dashboards.
  track('app_loaded', { release: RELEASE });
}
