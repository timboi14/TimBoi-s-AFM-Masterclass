import { motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useTone } from './tone';
import { cn } from '@/lib/cn';

export interface ConfiguratorOption {
  id: string;
  title: ReactNode;
  meta?: ReactNode;
  /** Imagery shown on the left when this option is active. */
  imagery: ReactNode;
}

interface ConfiguratorProps {
  /** Two-tone Apple-style heading: first part navy/white, continuation muted. */
  headingPrimary: ReactNode;
  headingMuted: ReactNode;
  options: ConfiguratorOption[];
  /** Initially-selected option id. Defaults to options[0].id. */
  defaultSelectedId?: string;
  /** Optional Help-Me-Decide expandable panel content. */
  helpMeDecide?: ReactNode;
  /** Footer area below the options column (e.g. confirm button). */
  optionsFooter?: ReactNode;
  className?: string;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Block H — Side-by-side Configurator. 60/40 split at >= 1024px:
 * imagery left, picker right. Stacks vertically below.
 * Inherits the surrounding section tone for picker chrome contrast.
 */
export function Configurator({
  headingPrimary,
  headingMuted,
  options,
  defaultSelectedId,
  helpMeDecide,
  optionsFooter,
  className,
}: ConfiguratorProps) {
  const tone = useTone();
  const dark = tone === 'navy' || tone === 'black';
  const prefersReduced = !!useReducedMotion();
  const [selectedId, setSelectedId] = useState(defaultSelectedId ?? options[0]?.id);
  const [helpOpen, setHelpOpen] = useState(false);

  const selected = options.find((o) => o.id === selectedId) ?? options[0];

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12', className)}>
      {/* Left — imagery card (mist tint regardless of section tone for contrast) */}
      <div
        className={cn(
          'rounded-3xl aspect-square flex items-center justify-center p-8 overflow-hidden',
          dark ? 'bg-white/5' : 'bg-[var(--mist-100)]',
        )}
      >
        <motion.div
          key={selected?.id}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease }}
          className="w-full h-full flex items-center justify-center"
        >
          {selected?.imagery}
        </motion.div>
      </div>

      {/* Right — picker column */}
      <div className="flex flex-col gap-4">
        <h3
          style={{ fontSize: 'var(--fs-headline)', lineHeight: 1.25 }}
          className={cn('font-display tracking-[-0.005em] m-0', dark ? 'text-white' : 'text-[var(--navy-900)]')}
        >
          <span>{headingPrimary}</span>{' '}
          <span className={dark ? 'text-white/60' : 'text-[var(--mist-500)]'}>{headingMuted}</span>
        </h3>

        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const active = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedId(opt.id)}
                className={cn(
                  'rounded-2xl p-5 text-left transition-all duration-200',
                  dark ? 'bg-white/5' : 'bg-white',
                  active
                    ? dark
                      ? 'border-2 border-[var(--gold-500)] shadow-[inset_0_0_0_4px_rgba(255,215,0,0.12)]'
                      : 'border-2 border-[var(--navy-800)] shadow-[inset_0_0_0_4px_rgba(255,215,0,0.12)]'
                    : dark
                      ? 'border border-white/10 hover:border-white/30'
                      : 'border border-[var(--mist-200)] hover:border-[var(--navy-800)]',
                )}
              >
                <div
                  style={{ fontSize: 'var(--fs-subline)', lineHeight: 1.25 }}
                  className={cn('font-display uppercase tracking-[-0.005em]', dark ? 'text-white' : 'text-[var(--navy-900)]')}
                >
                  {opt.title}
                </div>
                {opt.meta && (
                  <div
                    style={{ fontSize: 'var(--fs-small)' }}
                    className={cn('mt-1', dark ? 'text-white/60' : 'text-[var(--mist-500)]')}
                  >
                    {opt.meta}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {helpMeDecide && (
          <div
            className={cn(
              'rounded-2xl border',
              dark ? 'bg-white/5 border-white/10' : 'bg-white border-[var(--mist-200)]',
            )}
          >
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-5 py-4 text-left"
            >
              <span
                style={{ fontSize: 'var(--fs-small)' }}
                className={cn('font-bold', dark ? 'text-white' : 'text-[var(--navy-900)]')}
              >
                Help me decide
              </span>
              <span aria-hidden className={dark ? 'text-white/60' : 'text-[var(--mist-500)]'}>
                {helpOpen ? '−' : '+'}
              </span>
            </button>
            {helpOpen && (
              <div
                style={{ fontSize: 'var(--fs-small)', lineHeight: 1.5 }}
                className={cn('px-5 pb-4', dark ? 'text-white/80' : 'text-[var(--ink)]/80')}
              >
                {helpMeDecide}
              </div>
            )}
          </div>
        )}

        {optionsFooter && <div>{optionsFooter}</div>}
      </div>
    </div>
  );
}
