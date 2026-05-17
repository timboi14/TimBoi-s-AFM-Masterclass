import type { Config } from 'tailwindcss';

/**
 * Mirrors the root tailwind.config.js token-for-token so a page ported
 * into this app renders pixel-identical to the canonical Vite version.
 * Source of truth lives at the repo root; this file copies (not imports)
 * to keep the migration's two trees independently buildable until cutover.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1e',
        surface: '#ffffff',
        card: '#ffffff',
        ink: '#0a0f1e',
        primary: { DEFAULT: '#00a347', dark: '#00803a', light: '#33d375' },
        accent: { DEFAULT: '#f5b800', dark: '#cc9900', light: '#ffd84a' },
        text: '#0a0f1e',
        muted: '#64748b',
        danger: '#dc2626',
        border: '#e2e8f0',
      },
      fontFamily: {
        display: ['Anton', 'Bebas Neue', 'Impact', 'sans-serif'],
        body: ['DM Sans', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,163,71,0.25), 0 24px 48px -16px rgba(0,163,71,0.18)',
        gold: '0 0 0 1px rgba(245,184,0,0.3), 0 24px 48px -16px rgba(245,184,0,0.25)',
        floodlight: '0 32px 64px -24px rgba(0,163,71,0.35), 0 8px 24px -8px rgba(245,184,0,0.18)',
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
