import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { store, useStore } from '@/lib/store';

/** First-visit modal asking for fan name. Saves to localStorage. */
export function NameOverlay() {
  const state = useStore();
  const [v, setV] = useState('');
  const open = !state.fanName;

  // Make sure body cannot scroll behind the modal on first visit
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const submit = () => {
    const trimmed = v.trim();
    if (!trimmed) return;
    store.set({ fanName: trimmed });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-md rounded-3xl border-2 border-accent/40 bg-white p-7 shadow-floodlight"
            initial={{ scale: 0.92, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-ink text-[10px] font-bold uppercase tracking-widest">
              First-time setup
            </div>
            <div className="font-display text-3xl tracking-wide uppercase text-ink">
              Welcome to TimBoi&apos;s Academy
            </div>
            <p className="text-muted mt-2 mb-5 text-[14px] leading-relaxed">
              Pick your fan name. It only saves to this browser. We use it to greet you, score the leaderboard,
              and personalise the coach.
            </p>
            <label className="block text-[11px] uppercase tracking-[0.18em] font-bold text-muted mb-1.5">
              Your fan name
            </label>
            <input
              autoFocus
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="e.g. Sonny_07"
              maxLength={24}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:border-accent focus:outline-none text-ink"
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {['SonnyHM_7', 'HarryK_9', 'COYS_Legend'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setV(s)}
                  className="text-[11px] py-1.5 px-2 rounded-md border border-border text-muted hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              className="btn-primary w-full mt-4 justify-center"
              disabled={!v.trim()}
              onClick={submit}
            >
              <i className="fa-solid fa-play" /> Kick off
            </button>
            <p className="text-[11px] text-muted mt-3 text-center">
              You can reset this any time from the Home page.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
