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
          { src: '/favicon.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
          { src: '/favicon.svg', sizes: 'any',     type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
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
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\//,
            handler: 'CacheFirst',
            options: { cacheName: 'tba-fa', expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 } },
          },
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
