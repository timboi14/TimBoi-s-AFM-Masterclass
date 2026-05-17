import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Keyboard help overlay (Work Item 10).
 *
 * - `?` (Shift+/) opens the modal from any page.
 * - `Esc` closes it.
 * - `g <key>` two-key combos navigate without opening the modal.
 * - All shortcuts are suppressed while focus is in an input, textarea or
 *   contenteditable element.
 */

interface Shortcut {
  /** Final key in a `g {key}` chord. */
  key: string;
  /** Route to navigate to. */
  to: string;
  /** Human label. */
  label: string;
}

const NAV_SHORTCUTS: Shortcut[] = [
  { key: 'h', to: '/', label: 'Home' },
  { key: 'c', to: '/course', label: 'Course' },
  { key: 'p', to: '/past-papers', label: 'Past Papers' },
  { key: 't', to: '/topic/adviser', label: 'Topics' },
  { key: 'y', to: '/syllabus', label: 'Syllabus' },
  { key: 'b', to: '/playbook', label: 'Playbook' },
  { key: 'r', to: '/training', label: 'Training' },
  { key: 'x', to: '/scout', label: 'Scout' },
  { key: 'o', to: '/boot-room', label: 'Boot Room' },
  { key: 'm', to: '/memory-lab', label: 'Memory Lab' },
  { key: 'f', to: '/form-guide', label: 'Form Guide' },
  { key: 'w', to: '/war-room', label: 'War Room' },
  { key: 'd', to: '/debrief', label: 'Debrief' },
  { key: 's', to: '/settings', label: 'Settings' },
];

const GLOBAL_SHORTCUTS: Array<{ keys: string; label: string }> = [
  { keys: '?', label: 'Open this keyboard help' },
  { keys: 'Esc', label: 'Close any open overlay' },
  { keys: '/', label: 'Summon Coach AI' },
  { keys: 'Space (in Coach)', label: 'Push-to-talk while Coach is open' },
];

function isTypingTarget(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  if (!t) return false;
  if (t.isContentEditable) return true;
  return /input|textarea|select/i.test(t.tagName);
}

export function KeyboardHelp() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const lastGAt = useRef<number>(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      // Close any open overlay
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
        // Restore focus to the element that opened the modal, if any.
        triggerRef.current?.focus?.();
        return;
      }

      // ? opens the modal (Shift+/ on UK/US layouts)
      if (e.key === '?' && !open) {
        e.preventDefault();
        triggerRef.current = (document.activeElement as HTMLElement) ?? null;
        setOpen(true);
        return;
      }

      // `g {key}` two-key navigation. Press g, then within 1.2s press a nav key.
      const now = Date.now();
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        lastGAt.current = now;
        return;
      }
      if (now - lastGAt.current < 1200) {
        const hit = NAV_SHORTCUTS.find((s) => s.key === e.key.toLowerCase());
        if (hit) {
          e.preventDefault();
          lastGAt.current = 0;
          navigate(hit.to);
          if (open) setOpen(false);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, open]);

  // Focus trap: when the modal opens, focus moves to the dialog.
  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kbd-help-title"
      className="fixed inset-0 z-[60] grid place-items-center px-4"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-[640px] max-h-[85vh] overflow-y-auto rounded-3xl bg-white border border-border shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] p-6 outline-none"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="kbd-help-title" className="font-display text-2xl tracking-wide uppercase text-ink">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-muted hover:text-ink px-2 py-1"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        <p className="text-[12.5px] text-muted mb-4">
          Press <Kbd>?</Kbd> anywhere outside a text field to open this overlay. Hit{' '}
          <Kbd>g</Kbd> then a letter to jump to that section.
        </p>

        <section className="mb-5">
          <h3 className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">Navigate (g + key)</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13.5px]">
            {NAV_SHORTCUTS.map((s) => (
              <div key={s.to} className="flex items-center justify-between gap-2 border-b border-border/60 py-1">
                <span className="text-ink">{s.label}</span>
                <span className="font-mono text-[12px]">
                  <Kbd>g</Kbd> <Kbd>{s.key}</Kbd>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] uppercase tracking-wider text-primary font-bold mb-2">Global</h3>
          <div className="grid grid-cols-1 gap-y-1.5 text-[13.5px]">
            {GLOBAL_SHORTCUTS.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-2 border-b border-border/60 py-1">
                <span className="text-ink">{s.label}</span>
                <span className="font-mono text-[12px]">
                  <Kbd>{s.keys}</Kbd>
                </span>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-5 text-[11px] text-muted">
          Shortcuts are suppressed while you are typing in an input, textarea or rich-text editor.
        </p>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded bg-slate-100 border border-border text-ink font-bold text-[11.5px]">
      {children}
    </kbd>
  );
}
