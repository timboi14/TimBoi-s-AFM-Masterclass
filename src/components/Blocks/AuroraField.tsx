import { type CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { useTone, type Tone } from './tone';

/**
 * AuroraField — the motion-site "living backdrop": slow-drifting, brand-coloured
 * aurora orbs behind a section. Codifies the previously-scattered `.aurora`
 * pattern (Examiner/Home/WarRoom each hand-rolled their own) into one Block so
 * the look stays consistent and tasteful.
 *
 * - `aria-hidden`: purely decorative.
 * - Reuses the `.aurora` class, which is already killed by the global
 *   `prefers-reduced-motion` block — so motion stops for users who ask for calm,
 *   leaving a soft static brand tint (no jank, no contrast loss).
 * - Tone-aware: subtle on light surfaces so headline text keeps WCAG AA contrast;
 *   richer on navy/black where the orbs read as stadium floodlight.
 */

type Orb = { size: string; pos: string; color: string; opacity: number; delay: string };

const LIGHT: Orb[] = [
  { size: 'w-[600px] h-[600px]', pos: '-top-44 -right-24', color: 'rgba(0,163,71,0.40)',  opacity: 0.95, delay: '0s' },
  { size: 'w-[560px] h-[560px]', pos: '-bottom-48 -left-20', color: 'rgba(245,184,0,0.36)', opacity: 0.9,  delay: '-6s' },
  { size: 'w-[460px] h-[460px]', pos: 'top-[58%] left-1/2 -translate-x-1/2', color: 'rgba(14,165,233,0.22)', opacity: 0.8, delay: '-11s' },
];

const DARK: Orb[] = [
  { size: 'w-[600px] h-[600px]', pos: '-top-44 -right-20', color: 'rgba(0,194,90,0.55)',  opacity: 0.85, delay: '0s' },
  { size: 'w-[560px] h-[560px]', pos: '-bottom-48 -left-16', color: 'rgba(255,215,0,0.42)', opacity: 0.75, delay: '-7s' },
  { size: 'w-[460px] h-[460px]', pos: 'top-1/4 left-1/3', color: 'rgba(29,50,121,0.65)', opacity: 0.7, delay: '-13s' },
];

interface AuroraFieldProps {
  /** Override the inherited SectionShell tone. */
  tone?: Tone;
  /** Add a masked pitch-grid over the orbs for extra depth. */
  grid?: boolean;
  className?: string;
}

export function AuroraField({ tone: toneProp, grid = false, className }: AuroraFieldProps) {
  const ctxTone = useTone();
  const tone = toneProp ?? ctxTone;
  const dark = tone === 'navy' || tone === 'black';
  const orbs = dark ? DARK : LIGHT;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 z-0 overflow-hidden', className)}
    >
      {orbs.map((o, i) => (
        <div
          key={i}
          className={cn('aurora', o.size, o.pos)}
          style={{
            background: `radial-gradient(circle, ${o.color}, transparent 70%)`,
            opacity: o.opacity,
            animationDelay: o.delay,
          } as CSSProperties}
        />
      ))}
      {grid && <div className="pitch-grid absolute inset-0" />}
    </div>
  );
}

