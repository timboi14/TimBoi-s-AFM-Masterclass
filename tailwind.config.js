/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stadium-day light theme. White base, navy ink, pitch green and electric yellow accents.
        // NOTE: `bg` is re-purposed as "deep ink" so that `text-bg` (used on coloured buttons) stays high-contrast navy.
        // The actual page background is set in body via styles.css.
        bg: '#0a0f1e',           // deep navy "ink" used for text on bright buttons
        surface: '#ffffff',      // cards
        card: '#ffffff',         // card body
        ink: '#0a0f1e',          // alias for clarity
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
      keyframes: {
        ping: { '0%': { transform: 'scale(1)', opacity: '0.85' }, '80%, 100%': { transform: 'scale(2.2)', opacity: '0' } },
        floodflicker: { '0%, 100%': { opacity: '0.95' }, '45%': { opacity: '1' }, '52%': { opacity: '0.6' }, '54%': { opacity: '1' } },
        scrollx: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        ping: 'ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
        floodflicker: 'floodflicker 6s ease-in-out infinite',
        scrollx: 'scrollx 38s linear infinite',
      },
    },
  },
  plugins: [],
};
