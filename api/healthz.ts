/**
 * GET /api/healthz → 200 + "ok" plain text. k8s-style liveness alias.
 * Edge runtime.
 */
export const config = { runtime: 'edge' };

export default async function handler(): Promise<Response> {
  return new Response('ok\n', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
