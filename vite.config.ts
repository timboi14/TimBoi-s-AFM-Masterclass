import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'og-cover.svg'],
      manifest: {
        name: "TimBoi's Academy · ACCA AFM Pass Engine",
        short_name: 'TBA Academy',
        description: 'Match-day energy. Examiner traps, technique, and the four habits that pass AFM.',
        theme_color: '#0a0f1e',
        background_color: '#f6f8fb',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          // Real PNG / maskable / monochrome set generated from public/favicon.svg
          // via scripts/generate-icons.mjs. SVG kept as the `any` fallback so
          // browsers that prefer vector still get it.
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/monochrome-512.png', sizes: '512x512', type: 'image/png', purpose: 'monochrome' },
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
        shortcuts: [
          { name: 'Sit a paper', short_name: 'Sit', url: '/past-papers', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Open Coach', short_name: 'Coach', url: '/scout', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Review cards', short_name: 'Review', url: '/cards', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Bump cacheId when the stored HTML schema changes (e.g. removed
        // sections) so old caches are abandoned and `cleanupOutdatedCaches`
        // sweeps them on the next activation. Audit feedback 2026-05-18:
        // post-personal-trend-board rollout, some users were still seeing
        // "STADIUM LEAGUE TABLE" because the old NetworkFirst HTML cache
        // had a 24h max-age. Changing cacheId is the canonical workbox
        // way to invalidate everything in one shot.
        cacheId: 'tba-v2',
        // Take over open tabs immediately when a new SW activates so users
        // running on stale HTML get the fresh chunk manifest on next nav.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        // Only fall back to cached index.html for genuine navigations, never
        // for hashed asset URLs (which would mask a stale-chunk 404).
        navigateFallbackDenylist: [/^\/assets\//, /\/sw\.js$/, /\/workbox-.*\.js$/],
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        runtimeCaching: [
          {
            // SPA navigations: prefer the network so a fresh deploy's HTML
            // (and its updated chunk hashes) reach the client without waiting
            // for the next SW cycle. Falls back to cache if offline.
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tba-html',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/practice'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/cards') || url.pathname.startsWith('/theory') || url.pathname.startsWith('/formulas') || url.pathname.startsWith('/memory'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'tba-static-pages', expiration: { maxEntries: 30, maxAgeSeconds: 30 * 24 * 60 * 60 } },
          },
          {
            // Backdrop and mascot artwork: stable filenames, long cache.
            urlPattern: ({ url }) => url.pathname.startsWith('/spurs/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'tba-spurs',
              expiration: { maxEntries: 60, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'tba-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 } },
          },
          // FontAwesome is now bundled locally via @fortawesome/fontawesome-free —
          // no longer fetched from cdnjs, so no runtime cache rule needed.
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: { port: 5173 },
  build: { outDir: 'dist', sourcemap: false },
});
