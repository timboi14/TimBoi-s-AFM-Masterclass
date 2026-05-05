import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { store, useStore } from '@/lib/store';

/** First-visit modal asking for fan name. Saves to localStorage. */
export function NameOverlay() {
  const state = useStore();
  const [v, setV] = useState('');
  const open = !state.fanName;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-bg/85 backdrop-blur-md" />
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border-2 border-accent/40 bg-card p-7 shadow-glow"
            initial={{ scale: 0.92, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <div className="font-display text-3xl tracking-wide uppercase text-accent">
              Welcome to TimBoi&apos;s Academy
            </div>
            <p className="text-text/85 mt-2 mb-5">
              Pick your fan name. Local only. Track points, streak, drills.
            </p>
            <input
              autoFocus
              value={v}
              onChange={(e) => setV(e.target.value)}
              placeholder="e.g. Sonny_07"
              maxLength={24}
              className="w-full px-4 py-3 rounded-xl bg-bg/70 border border-border focus:border-accent focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && v.trim()) {
                  store.set({ fanName: v.trim() });
                }
              }}
            />
            <button
              className="btn-primary w-full mt-4 justify-center"
              disabled={!v.trim()}
              onClick={() => store.set({ fanName: v.trim() })}
            >
              <i className="fa-solid fa-play" /> Kick off
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
