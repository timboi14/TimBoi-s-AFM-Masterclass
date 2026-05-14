import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode } from 'react';
import { useTone } from './tone';
import { cn } from '@/lib/cn';

export interface TripCard {
  /** Top-of-card pill (e.g. "68%", "Read", "Match-day"). */
  scoreChip?: ReactNode;
  /** Body of the card — quote, headline, or short paragraph. */
  body: ReactNode;
  /** Footer attribution / source. */
  attribution?: ReactNode;
}

interface ThreeUpCardRowProps {
  cards: TripCard[];
  /** Force a snap-scrolling carousel even on desktop. Default false. */
  forceCarousel?: boolean;
  className?: string;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Block E — Three-Up Card Row. Triptych for testimonials / featured trios.
 * 3-up at >= 1024px, snap carousel below. Inherits surrounding section tone.
 */
export function ThreeUpCardRow({ cards, forceCarousel = false, className }: ThreeUpCardRowProps) {
  const tone = useTone();
  const dark = tone === 'navy' || tone === 'black';
  const prefersReduced = !!useReducedMotion();

  return (
    <div
      className={cn(
        forceCarousel
          ? 'flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-none'
          : 'grid grid-cols-1 lg:grid-cols-3 gap-4',
        className,
      )}
    >
      {cards.map((c, i) => (
        <motion.article
          key={i}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, delay: i * 0.12, ease }}
          className={cn(
            'rounded-3xl p-8 shrink-0',
            forceCarousel ? 'snap-center w-[85%] sm:w-[60%] lg:w-auto' : '',
            dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-[var(--mist-200)]',
            'shadow-[var(--shadow-md)]',
          )}
        >
          {c.scoreChip && (
            <span
              style={{ fontSize: 'var(--fs-micro)' }}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--gold-500)] text-[var(--navy-900)] font-bold uppercase tracking-[0.1em] mb-4"
            >
              {c.scoreChip}
            </span>
          )}
          <div
            style={{ fontSize: 'var(--fs-headline)', lineHeight: 1.35 }}
            className={cn('font-display tracking-[-0.005em]', dark ? 'text-white' : 'text-[var(--navy-900)]')}
          >
            {c.body}
          </div>
          {c.attribution && (
            <div
              style={{ fontSize: 'var(--fs-small)' }}
              className={cn(
                'mt-6 uppercase tracking-[0.1em] font-bold',
                dark ? 'text-white/60' : 'text-[var(--mist-500)]',
              )}
            >
              {c.attribution}
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}
