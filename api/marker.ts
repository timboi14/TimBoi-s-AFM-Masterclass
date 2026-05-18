/**
 * POST /api/marker → alias of /api/mark.
 *
 * Spec §11 + audit 2026-05-18: the contract names this route `/api/marker`.
 * We keep `/api/mark` for backwards-compat with the existing FE; both paths
 * resolve to the same handler so the FE can migrate at its own pace.
 *
 * Vercel routes are file-based — re-exporting the default handler is the
 * canonical way to alias one route to another.
 */
export { default, config } from './mark';
