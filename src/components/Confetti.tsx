import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lightweight confetti burst. Triggered by `play` going truthy.
 * Particles are placed within the parent (must be position:relative).
 */
export function GoalBurst({ play, onDone }: { play: boolean; onDone?: () => void }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (play) {
      setPieces(Array.from({ length: 26 }, (_, i) => i));
      const t = setTimeout(() => {
        setPieces([]);
        onDone?.();
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [play, onDone]);

  return (
    <AnimatePresence>
      {play && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* green flash */}
          <motion.div
            className="absolute inset-0 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ duration: 0.6 }}
          />
          {pieces.map((i) => {
            const ang = (Math.PI * 2 * i) / pieces.length + (Math.random() - 0.5) * 0.4;
            const dist = 80 + Math.random() * 80;
            const colors = ['#00c853', '#ffd600', '#ffffff', '#33d375'];
            const color = colors[i % colors.length];
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 block w-2.5 h-2.5 rounded-sm"
                style={{ background: color, boxShadow: `0 0 12px ${color}` }}
                initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(ang) * dist,
                  y: Math.sin(ang) * dist,
                  rotate: 360 + Math.random() * 360,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.95, ease: [0.2, 0.7, 0.3, 1] }}
              />
            );
          })}
          <motion.div
            className="absolute inset-0 flex items-center justify-center font-display text-7xl tracking-widest text-primary"
            style={{ textShadow: '0 0 24px rgba(0,200,83,0.8), 0 0 48px rgba(0,200,83,0.5)' }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.7, 1.05, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.4, 1] }}
          >
            GOAL!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
