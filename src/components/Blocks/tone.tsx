import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AuroraField } from './AuroraField';

/**
 * Scroll-reveal for section content (MotionSites-style blur-up). Sections
 * already in the first viewport show instantly — the route-level entrance
 * covers them — while sections the learner scrolls to get one restrained
 * reveal each. Respects both prefers-reduced-motion and the Settings toggle
 * (html.tba-reduce-motion), and falls back to always-visible without
 * IntersectionObserver.
 */
function useSectionReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('tba-reduce-motion');
    if (reduced || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      setShown(true);
      return;
    }
    setInstant(false);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return {
    ref,
    className: cn('section-reveal', shown && 'is-visible', instant && 'is-instant'),
  };
}

export type Tone = 'white' | 'mist' | 'navy' | 'black';

const ToneContext = createContext<Tone>('white');

export const useTone = () => useContext(ToneContext);

const BG: Record<Tone, string> = {
  white: 'bg-[var(--tone-white)] text-[var(--ink)]',
  mist:  'bg-[var(--tone-mist)] text-[var(--ink)]',
  navy:  'bg-[var(--tone-navy)] text-white',
  black: 'bg-[var(--tone-black)] text-white',
};

interface SectionShellProps {
  tone?: Tone;
  /** Apply the section's tonal background full-bleed (edge to edge). */
  fullBleed?: boolean;
  /** Vertical padding override; defaults to a generous rhythm. */
  pad?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  /** Drifting brand aurora backdrop (motion-site signature). Clips inside the section. */
  aura?: boolean;
  /** When `aura`, also lay a masked pitch-grid over the orbs for depth. */
  auraGrid?: boolean;
  className?: string;
  innerClassName?: string;
  id?: string;
  children: ReactNode;
}

const PAD: Record<NonNullable<SectionShellProps['pad']>, string> = {
  none: '',
  sm: 'py-8 md:py-10',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
};

/**
 * Tier-tone aware section. Drives bg/text and exposes the tone via context
 * so descendants (TonePill, etc.) pick the right variant automatically.
 */
export function SectionShell({
  tone = 'white',
  fullBleed = true,
  pad = 'lg',
  aura = false,
  auraGrid = false,
  className,
  innerClassName,
  id,
  children,
}: SectionShellProps) {
  const bg = BG[tone];
  const reveal = useSectionReveal();
  return (
    <ToneContext.Provider value={tone}>
      <section
        id={id}
        className={cn('relative px-4 sm:px-6', bg, PAD[pad], className)}
        style={{
          scrollMarginTop: 'calc(var(--app-header-h, 96px) + 8px)',
          ...(fullBleed
            ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }
            : null),
        }}
      >
        {aura && <AuroraField tone={tone} grid={auraGrid} />}
        {/* Reveal animates the inner content only — the section keeps its
            tonal background at all times so nothing flashes white. */}
        <div
          ref={reveal.ref}
          className={cn('max-w-[1240px] mx-auto', aura && 'relative z-10', reveal.className, innerClassName)}
        >
          {children}
        </div>
      </section>
    </ToneContext.Provider>
  );
}
