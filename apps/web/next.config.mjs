/**
 * Next.js 15 config.
 *
 * Strangler-fig: this app lives alongside the canonical Vite SPA at the
 * repo root. Vercel currently builds the root (Vite) — see DECISIONS.md
 * D-001. When parity is achieved, flip the Vercel project root to apps/web.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    typedRoutes: true,
    serverActions: { bodySizeLimit: '2mb' },
  },
  // Inherit security headers from the root vercel.json once promoted.
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      ],
    },
  ],
  // Edge for read-mostly content; Node for AI streaming + PDF.
  serverExternalPackages: ['argon2', 'libsodium-wrappers'],
};

export default nextConfig;
