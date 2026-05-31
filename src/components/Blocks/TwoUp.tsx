import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useTone, type Tone } from './tone';

interface TwoUpPanel {
  /** Background tone for this panel (overrides the surrounding section tone). */
  tone: Tone;
  /** Optional eyebrow chip above the headline. */
  eyebrow?: ReactNode;
  headline: ReactNode;
  subline?: ReactNode;
  /** Up to two action elements (TonePill instances). */
  actions?: ReactNode;
  /** Optional imagery/SVG/Lottie placed below the copy. */
  imagery?: ReactNode;
  /** Optional click-through wrapping the whole panel. */
  href?: string;
}

interface TwoUpProps {
  left: TwoUpPanel;
  right: TwoUpPanel;
}

const PANEL_BG: Record<Tone, string> = {
  white: 'bg-[var(--tone-white)] text-[var(--ink)]',
  mist:  'bg-[var(--tone-mist)] text-[var(--ink)]',
  navy:  'bg-[var(--tone-navy)] text-white',
  black: 'bg-[var(--tone-black)] text-white',
};

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Block D — Two-Up Feature Grid. Two equal panels with independent tone.
 * Each panel: eyebrow / headline / subline / actions / imagery (in that order).
 */
export function TwoUp({ left, right }: TwoUpProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Panel data={left} delay={0} />
      <Panel data={right} delay={0.08} />
    </div>
  );
}

function Panel({ data, delay }: { data: TwoUpPanel; delay: number }) {
  const prefersReduced = !!useReducedMotion();
  const dark = data.tone === 'navy' || data.tone === 'black';

  const inner = (
    <div className="flex flex-col items-center text-center max-w-[480px] mx-auto">
      {data.eyebrow && (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] mb-4',
            dark
              ? 'border-[var(--gold-500)]/60 text-white'
              : 'border-[var(--mist-200)] text-[var(--navy-800)] bg-white/60',
          )}
        >
          {data.eyebrow}
        </span>
      )}
      <h3
        style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', lineHeight: 1.1 }}
        className={cn(
          'font-display uppercase tracking-[-0.005em] m-0',
          dark ? 'text-white' : 'text-[var(--navy-900)]',
        )}
      >
        {data.headline}
      </h3>
      {data.subline && (
        <p
          style={{ fontSize: 'var(--fs-subline)', lineHeight: 'var(--lh-snug)' }}
          className={cn('mt-3', dark ? 'text-white/80' : 'text-[var(--mist-500)]')}
        >
          {data.subline}
        </p>
      )}
      {data.actions && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {data.actions}
        </div>
      )}
      {data.imagery && (
        <motion.div
          whileHover={prefersReduced ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.4, ease }}
          className="mt-8 w-full max-w-[420px]"
        >
          {data.imagery}
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn('rounded-3xl px-6 py-12 md:px-12 md:py-16', PANEL_BG[data.tone])}
    >
      {data.href ? (
        <a href={data.href} className="block no-underline">
          {inner}
        </a>
      ) : (
        inner
      )}
    </motion.div>
  );
}
