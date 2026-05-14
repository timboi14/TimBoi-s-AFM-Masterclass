import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useTone } from './tone';

interface CenteredHeroProps {
  /** Optional eyebrow chip above the headline. Accepts a string OR React node. */
  eyebrow?: ReactNode;
  /**
   * Headline. The string is rendered as plain text. To highlight a single
   * word in gold, pass JSX:  `<>17 fixtures. One <Gold>trophy</Gold>.</>`
   * (use the exported <HeroGold/> helper).
   */
  headline: ReactNode;
  /** One-line sub-line under the headline. Optional. */
  subline?: ReactNode;
  /** Up to two action elements (TonePill / Link). Primary first, secondary second. */
  actions?: ReactNode;
  /** Optional artwork rendered below the buttons (Lottie / SVG / img). */
  artwork?: ReactNode;
  /** Slim variant for detail pages: 40% hero height, no artwork slot rendered. */
  slim?: boolean;
  className?: string;
}

/** Highlight a single word inside the headline in gold. */
export function HeroGold({ children }: { children: ReactNode }) {
  return <span className="text-[var(--gold-500)]">{children}</span>;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

function v(initialY: number, delaySec: number, durSec: number, prefersReduced: boolean): HTMLMotionProps<'div'>['variants'] {
  return {
    hidden: prefersReduced ? { opacity: 0 } : { opacity: 0, y: initialY },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0.2 : durSec, delay: delaySec, ease },
    },
  };
}

/**
 * Block A — Centred Hero. Lives inside a <SectionShell> so its tone is inherited.
 * Used as the FIRST block on every top-level page.
 */
export function CenteredHero({ eyebrow, headline, subline, actions, artwork, slim = false, className }: CenteredHeroProps) {
  const tone = useTone();
  const prefersReduced = !!useReducedMotion();
  const dark = tone === 'navy' || tone === 'black';

  return (
    <motion.div
      initial="hidden"
      animate="show"
      className={cn(
        'flex flex-col items-center text-center',
        slim ? 'pt-2 sm:pt-4' : 'pt-2 sm:pt-6',
        className,
      )}
    >
      {eyebrow && (
        <motion.div
          variants={v(8, 0.2, 0.4, prefersReduced)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] mb-6',
            dark
              ? 'border-[var(--gold-500)]/60 text-white'
              : 'border-[var(--mist-200)] text-[var(--navy-800)] bg-white/60 backdrop-blur',
          )}
        >
          {eyebrow}
        </motion.div>
      )}

      <motion.h1
        variants={v(16, 0.4, 0.5, prefersReduced)}
        style={{
          fontSize: slim ? 'clamp(2rem, 4.5vw, 3.5rem)' : 'var(--fs-display-xl)',
          lineHeight: slim ? 1.05 : 'var(--lh-tight)',
        }}
        className={cn(
          'font-display uppercase tracking-[-0.005em] max-w-[22ch] m-0',
          dark ? 'text-white' : 'text-[var(--navy-900)]',
        )}
      >
        {headline}
      </motion.h1>

      {subline && (
        <motion.p
          variants={v(12, 0.5, 0.45, prefersReduced)}
          style={{
            fontSize: 'var(--fs-subline)',
            lineHeight: 'var(--lh-snug)',
          }}
          className={cn(
            'mt-4 max-w-[58ch]',
            dark ? 'text-[var(--mist-200)]' : 'text-[var(--mist-500)]',
          )}
        >
          {subline}
        </motion.p>
      )}

      {actions && (
        <motion.div
          variants={v(8, 0.6, 0.4, prefersReduced)}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {actions}
        </motion.div>
      )}

      {artwork && !slim && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: prefersReduced ? 0.2 : 0.8, delay: 0.8, ease } }}
          className="mt-20 w-[78%] max-w-[920px]"
          style={{ maxHeight: '60vh' }}
        >
          {artwork}
        </motion.div>
      )}
    </motion.div>
  );
}
