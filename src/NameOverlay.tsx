import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { store, useStore } from '@/lib/store';

/**
 * Fan-name capture. The product must paint FIRST — and now the learner must
 * DO something first too. The sheet only appears after the first completed
 * bit of work (points, a drill, a note or a theory prompt), so the invite
 * lands when there is finally something to put on the board. Dismissal
 * persists across visits (store.fanPromptDismissedAt); a name can always be
 * set later in Settings. The sheet also stays out of the way while the
 * mobile nav menu is open (html[data-tba-menu-open] hides it, styles.css).
 */
export function NameOverlay() {
  const state = useStore();
  const reduced = useReducedMotion();
  const [v, setV] = useState('');
  const [armed, setArmed] = useState(false);

  // First completed action on this device — the moment a leaderboard name
  // starts meaning something. Until then, never interrupt.
  const engaged =
    state.points > 0 || state.drills > 0 || state.notesRead.length > 0 || state.theoryRead.length > 0;

  // Small settle delay so the sheet never pops mid-click on the action that
  // earned the points. No body-scroll lock — the page stays interactive.
  useEffect(() => {
    if (!engaged) return;
    const id = setTimeout(() => setArmed(true), 900);
    return () => clearTimeout(id);
  }, [engaged]);

  const open = engaged && armed && !state.fanName && !state.fanPromptDismissedAt;

  const submit = () => {
    const trimmed = v.trim();
    if (!trimmed) return;
    store.set({ fanName: trimmed });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tba-fan-sheet fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-5 pointer-events-none"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          role="dialog"
          aria-label="Set your fan name"
        >
          <div className="pointer-events-auto relative w-full max-w-xl rounded-2xl border border-accent/40 bg-white/95 backdrop-blur-md p-5 shadow-floodlight">
            <button
              type="button"
              onClick={() => store.set({ fanPromptDismissedAt: new Date().toISOString() })}
              aria-label="Dismiss"
              className="absolute top-3 right-3 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-ink hover:bg-slate-100"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink px-2 py-0.5 rounded-full bg-accent">
                Make it yours
              </span>
            </div>
            <div className="font-display text-xl sm:text-2xl tracking-wide uppercase text-ink leading-tight">
              Pick a fan name for the leaderboard
            </div>
            <p className="text-muted mt-1 mb-3 text-[13px] leading-relaxed">
              Optional, saves to this browser only. Skip it and keep going — you can set one any time in Settings.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={v}
                onChange={(e) => setV(e.target.value)}
                placeholder="e.g. Sonny_07"
                maxLength={24}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-border focus:border-accent focus:outline-none text-ink"
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              />
              <button
                className="btn-primary justify-center whitespace-nowrap disabled:opacity-50"
                disabled={!v.trim()}
                onClick={submit}
              >
                <i className="fa-solid fa-play" /> Kick off
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {['SonnyHM_7', 'HarryK_9', 'COYS_Legend'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setV(s)}
                  className="text-[11px] py-1 px-2 rounded-md border border-border text-muted hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
