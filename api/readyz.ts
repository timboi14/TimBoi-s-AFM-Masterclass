/**
 * GET /api/readyz → 200 ready / 503 degraded, JSON.
 *
 * Spec §19: explicit dep-pings so synthetic monitors can distinguish
 * "app is live" (health) from "app + its deps are live" (ready).
 * Treat unconfigured optional deps (e.g. Upstash not set) as ok.
 *
 * Edge runtime.
 */
export const config = { runtime: 'edge' };

const REVISION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev';
const REGION = process.env.VERCEL_REGION || 'unknown';
const PING_TIMEOUT_MS = 1500;

interface CheckResult {
  name: string;
  ok: boolean;
  optional: boolean;
  detail?: string;
  ms: number;
}

export default async function handler(): Promise<Response> {
  const checks = await Promise.all([check('upstash', pingUpstash), check('deepseek', pingDeepseekConfig)]);

  // The service is "ready" if every required check passes. An optional check
  // that's not configured doesn't fail readiness — it's reported but not gating.
  const ready = checks.every((c) => c.ok || c.optional);

  return new Response(
    JSON.stringify(
      { status: ready ? 'ready' : 'degraded', revision: REVISION, region: REGION, checks },
      null,
      2,
    ),
    {
      status: ready ? 200 : 503,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
}

async function check(name: string, fn: () => Promise<{ ok: boolean; optional?: boolean; detail?: string }>): Promise<CheckResult> {
  const t = Date.now();
  try {
    const r = await fn();
    return { name, ok: r.ok, optional: r.optional ?? false, detail: r.detail, ms: Date.now() - t };
  } catch (e) {
    return { name, ok: false, optional: true, detail: (e as Error).message, ms: Date.now() - t };
  }
}

async function pingUpstash(): Promise<{ ok: boolean; optional?: boolean; detail?: string }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { ok: true, optional: true, detail: 'not configured' };
  const res = await fetch(`${url.replace(/\/$/, '')}/ping`, {
    method: 'GET',
    signal: AbortSignal.timeout(PING_TIMEOUT_MS),
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { ok: false, detail: `HTTP ${res.status}` };
  const body = (await res.json().catch(() => ({}))) as { result?: string };
  return body?.result === 'PONG' ? { ok: true } : { ok: false, detail: 'unexpected body' };
}

async function pingDeepseekConfig(): Promise<{ ok: boolean; optional?: boolean; detail?: string }> {
  // Don't actually hit the API on every readyz; that would cost tokens.
  // Just confirm the key is configured.
  const k = process.env.DEEPSEEK_API_KEY;
  if (!k) return { ok: true, optional: true, detail: 'DEEPSEEK_API_KEY not set' };
  return { ok: k.length > 10 };
}
