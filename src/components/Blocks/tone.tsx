import { createContext, useContext, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

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
  className,
  innerClassName,
  id,
  children,
}: SectionShellProps) {
  const bg = BG[tone];
  return (
    <ToneContext.Provider value={tone}>
      <section
        id={id}
        className={cn('relative px-4 sm:px-6', bg, PAD[pad], className)}
        style={{
          scrollMarginTop: '72px',
          ...(fullBleed
            ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)' }
            : null),
        }}
      >
        <div className={cn('max-w-[1240px] mx-auto', innerClassName)}>
          {children}
        </div>
      </section>
    </ToneContext.Provider>
  );
}
