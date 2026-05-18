/**
 * Silence browser-extension console noise at the window level.
 *
 * Source of the noise: installed extensions (1Password, LastPass, Grammarly,
 * React DevTools, MetaMask, ad-blockers) register `chrome.runtime.onMessage`
 * listeners that return `true` to signal an async response, then their content
 * script unmounts before calling `sendResponse`. Chrome surfaces this as:
 *   "A listener indicated an asynchronous response by returning true, but
 *    the message channel closed before a response was received."
 *
 * It is NOT our code (repo-wide grep finds zero chrome.runtime / postMessage
 * handlers in src/, public/, or api/) and we cannot prevent extensions from
 * firing it. We *can* prevent it from cluttering devtools and triggering
 * `window.error` handlers (Sentry, our observability shim, the user's own
 * debug tools). That's what this module does.
 *
 * Spec audit batch-04, 2026-05-18: D-006 promised a custom Workbox in
 * Sprint 9 as the long-term answer. Until then, this is the right-now fix.
 * Loaded before everything else from src/main.tsx so the patches apply
 * before any third-party script gets a chance to fire.
 */
const PATTERNS = [
  'listener indicated an asynchronous response',
  'message channel closed before a response',
  'Extension context invalidated',
];

function isExtensionNoise(message: unknown): boolean {
  if (typeof message !== 'string' || message.length === 0) return false;
  return PATTERNS.some((p) => message.includes(p));
}

if (typeof window !== 'undefined') {
  // 1) console.error filter — drops the message before it ever paints in
  // devtools. The original is closed-over so anything else still routes
  // through normally.
  const origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (isExtensionNoise(msg)) return;
    // Also catch the case where the error is an Error object whose message
    // contains the noise pattern (some extensions log Error instances).
    for (const a of args) {
      if (a instanceof Error && isExtensionNoise(a.message)) return;
    }
    origError(...args);
  };

  // 2) window.error — capture phase so we get the event before any other
  // listener (Sentry, GA, observability shim) gets to react.
  window.addEventListener(
    'error',
    (e) => {
      if (isExtensionNoise(e.message) || (e.error instanceof Error && isExtensionNoise(e.error.message))) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );

  // 3) unhandledrejection — promise rejections that surface the same pattern
  // (Chrome occasionally wraps the extension reply as a rejected promise).
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    const message = reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
    if (isExtensionNoise(message)) {
      e.preventDefault();
    }
  });
}

export {};
