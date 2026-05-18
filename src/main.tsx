// Silence browser-extension console noise before anything else runs so the
// devtools console stays clean during development AND in user sessions.
// See src/lib/silence-extension-noise.ts for the rationale.
import '@/lib/silence-extension-noise';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './ErrorBoundary';
// Self-hosted fonts via Fontsource (replaces Google Fonts CDN).
import '@fontsource/anton/400.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
// Self-hosted Font Awesome (previously cdnjs — that origin returned 503 intermittently).
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';
import '@fortawesome/fontawesome-free/css/regular.min.css';
import '@fortawesome/fontawesome-free/css/brands.min.css';
import './styles.css';
// Apply persisted accessibility settings (reduce-motion / dyslexia / large
// text) on app bootstrap — module side-effect inside the file does the work.
import '@/pages/Settings';
import { installGlobalHandlers } from '@/lib/observability';

// Install Sentry/PostHog hooks if their env vars are set; no-op otherwise.
installGlobalHandlers();

const rootEl = document.getElementById('root')!;
// Clear the static loading splash so React owns the node
rootEl.innerHTML = '';

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
