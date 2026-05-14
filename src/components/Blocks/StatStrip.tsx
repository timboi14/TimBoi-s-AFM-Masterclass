import { motion, useInView, useMotionValue, useReducedMotion, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useTone } from './tone';

export interface StatItem {
  /** The headline number. Either a numeric value (count-up animated) or a pre-formatted string (rendered as-is). */
  value: number | string;
  /** Tiny uppercase label under the number. */
  label: string;
  /** Optional sub-label (smaller, mist-500). */
  sub?: ReactNode;
  /** Optional suffix appended after a numeric value (e.g. "%", "h"). Ignored for string values. */
  suffix?: string;
}

interface StatStripProps {
  stats: StatItem[];
  /** Visual divider between tiles on desktop. Default true. */
  dividers?: boolean;
}

/**
 * Block C — Stat Strip. Lives inside a SectionShell so its tone is inherited.
 * Numbers count up from 0 once visible (1.2s ease-out). Reduced-motion: static.
 */
export function StatStrip({ stats, dividers = true }: StatStripProps) {
  const tone = useTone();
  const dark = tone === 'navy' || tone === 'black';

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:gap-0 gap-y-8',
        stats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4',
        dividers && 'md:divide-x divide-[var(--mist-200)] dark:divide-white/10',
      )}
    >
      {stats.map((s, i) => (
        <Tile key={i} stat={s} dark={dark} />
      ))}
    </div>
  );
}

function Tile({ stat, dark }: { stat: StatItem; dark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReduced = !!useReducedMotion();

  return (
    <div ref={ref} className="flex flex-col items-center text-center md:px-6">
      <CountUpNumber
        value={stat.value}
        suffix={stat.suffix}
        play={inView && !prefersReduced}
        dark={dark}
      />
      <span
        style={{ fontSize: 'var(--fs-micro)' }}
        className={cn(
          'mt-2 uppercase tracking-[0.08em] font-bold',
          dark ? 'text-white/80' : 'text-[var(--mist-500)]',
        )}
      >
        {stat.label}
      </span>
      {stat.sub && (
        <span
          style={{ fontSize: 'var(--fs-small)' }}
          className={cn('mt-1', dark ? 'text-white/60' : 'text-[var(--mist-500)]')}
        >
          {stat.sub}
        </span>
      )}
    </div>
  );
}

function CountUpNumber({
  value,
  suffix,
  play,
  dark,
}: {
  value: number | string;
  suffix?: string;
  play: boolean;
  dark: boolean;
}) {
  const isNumeric = typeof value === 'number';
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isNumeric || !play) return;
    const controls = animate(mv, value as number, {
      duration: 1.2,
      ease: [0.2, 0.8, 0.2, 1],
    });
    return () => controls.stop();
  }, [isNumeric, play, value, mv]);

  useEffect(() => {
    if (!isNumeric) return;
    const unsub = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix ?? ''}`;
    });
    return unsub;
  }, [rounded, suffix, isNumeric]);

  return (
    <motion.span
      ref={ref}
      style={{ fontSize: 'var(--fs-display-md)', lineHeight: 1 }}
      className={cn(
        'font-display',
        dark ? 'text-[var(--gold-500)]' : 'text-[var(--navy-900)]',
      )}
    >
      {isNumeric ? (play ? '0' : `${value}${suffix ?? ''}`) : value}
    </motion.span>
  );
}
