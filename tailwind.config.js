/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0f1e',
        surface: '#111827',
        card: '#1a2235',
        primary: { DEFAULT: '#00c853', dark: '#00a347', light: '#33d375' },
        accent: { DEFAULT: '#ffd600', dark: '#e6c000', light: '#ffe14a' },
        text: '#f0f4ff',
        muted: '#6b7280',
        danger: '#ef4444',
        border: '#243049',
      },
      fontFamily: {
        display: ['Anton', 'Bebas Neue', 'Impact', 'sans-serif'],
        body: ['DM Sans', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,200,83,0.35), 0 24px 48px -16px rgba(0,200,83,0.25)',
        gold: '0 0 0 1px rgba(255,214,0,0.4), 0 24px 48px -16px rgba(255,214,0,0.3)',
        floodlight: '0 32px 64px -24px rgba(0,200,83,0.45), 0 8px 24px -8px rgba(255,214,0,0.2)',
      },
      keyframes: {
        ping: {
          '0%': { transform: 'scale(1)', opacity: '0.85' },
          '80%, 100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        floodflicker: {
          '0%, 100%': { opacity: '0.95' },
          '45%': { opacity: '1' },
          '52%': { opacity: '0.6' },
          '54%': { opacity: '1' },
        },
        scrollx: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
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
