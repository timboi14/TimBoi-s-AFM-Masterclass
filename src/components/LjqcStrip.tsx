import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 28px sticky strip directly below the main nav, reminding the candidate of
 * the Section A rubric: LEAD. JUSTIFY. QUOTE. COMMENT. — every paragraph.
 *
 * Visible on /past-papers/**, /debrief, /training/**, /topic/**.
 * NOT on Home or /start. Dismissable per session via sessionStorage.
 *
 * Work Item 6 of the Platinum-tier upgrade.
 */

const SS_KEY = 'tba.ljqc.dismissed';

function shouldShow(pathname: string): boolean {
  if (pathname === '/' || pathname === '/start') return false;
  if (pathname.startsWith('/past-papers')) return true;
  if (pathname.startsWith('/debrief')) return true;
  if (pathname.startsWith('/training')) return true;
  if (pathname.startsWith('/topic')) return true;
  return false;
}

export function LjqcStrip() {
  const { pathname } = useLocation();
  const [dismissed, setDismissed] = useState(false);

  // Reset on full page load (sessionStorage is the session source of truth)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDismissed(sessionStorage.getItem(SS_KEY) === '1');
  }, []);

  if (!shouldShow(pathname) || dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem(SS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div
      className="ljqc-strip relative z-20 w-full"
      role="note"
      aria-label="Section A rubric"
      style={{
        background: '#0b1437',
        color: '#f7c948',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '12px',
        height: '28px',
        lineHeight: '28px',
        textAlign: 'center',
      }}
    >
      <div className="px-3 inline-flex items-center justify-center gap-2 max-w-full">
        <strong style={{ letterSpacing: '0.08em' }}>LEAD. JUSTIFY. QUOTE. COMMENT.</strong>
        <span className="hidden sm:inline" style={{ opacity: 0.75 }}>— every Section A paragraph.</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss rubric"
        onClick={dismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 grid place-items-center rounded hover:bg-white/10 transition-colors"
        style={{ color: '#f7c948', fontSize: '14px', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
