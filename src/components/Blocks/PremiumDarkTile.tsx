import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useTone } from './tone';

interface PremiumDarkTileProps {
  eyebrow?: ReactNode;
  headline: ReactNode;
  subline?: ReactNode;
  /** Up to two action elements (TonePill instances). */
  actions?: ReactNode;
  /** Optional centred artwork beneath the actions. */
  artwork?: ReactNode;
  /** Slim variant — less vertical padding, no artwork slot. */
  slim?: boolean;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

/** Block G — Premium dark tile for hero CTAs. Requires SectionShell tone="navy" or "black". */
export function PremiumDarkTile({ eyebrow, headline, subline, actions, artwork, slim = false }: PremiumDarkTileProps) {
  const tone = useTone();
  const dark = tone === 'navy' || tone === 'black';
  const prefersReduced = !!useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.8, ease }}
      className={cn('relative flex flex-col items-center text-center', slim ? 'py-2' : 'py-6 md:py-12')}
      style={{
        backgroundImage:
          'radial-gradient(60% 60% at 50% 0%, rgba(255,215,0,0.06), transparent 60%)',
      }}
    >
      {eyebrow && (
        <Stagger delay={0.1} prefersReduced={prefersReduced}>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] mb-6',
              'border-[var(--gold-500)]/60 text-white bg-transparent',
            )}
          >
            {eyebrow}
          </span>
        </Stagger>
      )}

      <Stagger delay={0.2} prefersReduced={prefersReduced}>
        <h2
          style={{
            fontSize: slim ? 'clamp(1.8rem, 3.6vw, 3rem)' : 'var(--fs-display-xl)',
            lineHeight: 'var(--lh-tight)',
          }}
          className={cn(
            'font-display uppercase tracking-[-0.005em] max-w-[20ch] m-0',
            dark ? 'text-white' : 'text-[var(--navy-900)]',
          )}
        >
          {headline}
        </h2>
      </Stagger>

      {subline && (
        <Stagger delay={0.3} prefersReduced={prefersReduced}>
          <p
            style={{ fontSize: 'var(--fs-subline)', lineHeight: 'var(--lh-snug)' }}
            className={cn('mt-4 max-w-[58ch]', dark ? 'text-[var(--mist-200)]' : 'text-[var(--mist-500)]')}
          >
            {subline}
          </p>
        </Stagger>
      )}

      {actions && (
        <Stagger delay={0.4} prefersReduced={prefersReduced}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div>
        </Stagger>
      )}

      {artwork && !slim && (
        <Stagger delay={0.5} prefersReduced={prefersReduced}>
          <div className="mt-12 w-full max-w-[480px]">{artwork}</div>
        </Stagger>
      )}
    </motion.div>
  );
}

function Stagger({ delay, children, prefersReduced }: { delay: number; children: ReactNode; prefersReduced: boolean }) {
  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, delay: delay + 0.2, ease }}
    >
      {children}
    </motion.div>
  );
}
