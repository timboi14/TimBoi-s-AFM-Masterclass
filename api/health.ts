/**
 * GET /api/health → 200 + JSON liveness payload.
 *
 * Spec §19: ship the missing /api/health (was 404). Side-effect-free;
 * safe to poll from synthetic monitors every 5 min.
 *
 * Edge runtime so the latency budget stays under 50ms.
 */
export const config = { runtime: 'edge' };

const startedAt = Date.now();
const REVISION = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev';
const REGION = process.env.VERCEL_REGION || 'unknown';

export default async function handler(): Promise<Response> {
  return new Response(
    JSON.stringify(
      {
        status: 'ok',
        service: 'tba-academy',
        revision: REVISION,
        region: REGION,
        uptimeMs: Date.now() - startedAt,
        now: new Date().toISOString(),
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  );
}
