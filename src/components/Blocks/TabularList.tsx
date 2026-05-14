import { motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { useTone } from './tone';
import { cn } from '@/lib/cn';

export interface ListFilterChip<T extends string = string> {
  id: T;
  label: ReactNode;
}

export interface ListItem {
  id: string;
  /** Top-line title — bold, navy. */
  title: ReactNode;
  /** Right-side meta line (e.g. "Sep/Dec 2022 · Sec A · 50m"). */
  meta?: ReactNode;
  /** Pills row (Section / Source / Status / etc.). */
  pills?: ReactNode;
  /** Body copy — one or two lines max. */
  body?: ReactNode;
  /** Difficulty 1–5 (renders 5 mini Spurs-shirt SVGs). */
  difficulty?: 1 | 2 | 3 | 4 | 5;
  /** Footer actions row (status pill, CTA arrow). */
  footer?: ReactNode;
  /** Optional click-through (renders the card as a button/link). */
  href?: string;
  onClick?: () => void;
}

interface TabularListProps<T extends string> {
  items: ListItem[];
  /** Filter chips. Active state animates the background pill via layoutId. */
  filters?: ListFilterChip<T>[];
  activeFilter?: T | 'all';
  onFilterChange?: (id: T | 'all') => void;
  /** Empty-state body when no items match. */
  emptyState?: ReactNode;
  /** Sticky filter bar offset from top (px). Default 152 (Layout header 96 + sub-nav 56). */
  stickyTop?: number;
  className?: string;
}

const ease = [0.2, 0.8, 0.2, 1] as const;

/**
 * Block F — Tabular List. Filter chips on a sticky rail, then a responsive
 * grid of compact cards. Inherits surrounding section tone for empty-state colour.
 */
export function TabularList<T extends string>({
  items,
  filters,
  activeFilter = 'all' as T | 'all',
  onFilterChange,
  emptyState,
  stickyTop = 152,
  className,
}: TabularListProps<T>) {
  const tone = useTone();
  const dark = tone === 'navy' || tone === 'black';
  const prefersReduced = !!useReducedMotion();

  return (
    <div className={cn('w-full', className)}>
      {filters && filters.length > 0 && (
        <div
          style={{ top: `${stickyTop}px` }}
          className={cn(
            'sticky z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 mb-4 backdrop-blur-xl backdrop-saturate-150 border-b',
            dark ? 'bg-[rgba(10,15,30,0.7)] border-white/10' : 'bg-white/85 border-[var(--mist-200)]',
          )}
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <FilterChip
              key="all"
              id={'all'}
              label="All"
              active={activeFilter === 'all'}
              dark={dark}
              onClick={() => onFilterChange?.('all')}
            />
            {filters.map((f) => (
              <FilterChip
                key={f.id}
                id={f.id}
                label={f.label}
                active={activeFilter === f.id}
                dark={dark}
                onClick={() => onFilterChange?.(f.id)}
              />
            ))}
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div
          className={cn(
            'rounded-2xl border border-dashed p-10 text-center',
            dark ? 'border-white/20 text-white/70' : 'border-[var(--mist-200)] text-[var(--mist-500)]',
          )}
        >
          {emptyState ?? <span>No fixtures today.</span>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <Card key={it.id} item={it} dark={dark} prefersReduced={prefersReduced} order={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip<T extends string>({
  id,
  label,
  active,
  dark,
  onClick,
}: {
  id: T | 'all';
  label: ReactNode;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors',
        active
          ? dark
            ? 'text-[var(--navy-900)]'
            : 'text-white'
          : dark
            ? 'text-white/70 hover:text-white'
            : 'text-[var(--navy-800)]/80 hover:text-[var(--navy-900)]',
      )}
    >
      {active && (
        <motion.span
          layoutId={`filterchip-bg-${dark ? 'dark' : 'light'}`}
          className={cn(
            'absolute inset-0 rounded-full -z-10',
            dark ? 'bg-[var(--gold-500)]' : 'bg-[var(--navy-800)]',
          )}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
      {/* hidden readout for testing */}
      <span className="sr-only">{id}</span>
    </button>
  );
}

function Card({
  item,
  dark,
  prefersReduced,
  order,
}: {
  item: ListItem;
  dark: boolean;
  prefersReduced: boolean;
  order: number;
}) {
  const [hover, setHover] = useState(false);

  const inner = (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.32, delay: Math.min(order, 8) * 0.04, ease }}
      animate={hover && !prefersReduced ? { y: -2 } : { y: 0 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className={cn(
        'rounded-2xl p-5 transition-shadow duration-200',
        dark ? 'bg-white/5 border border-white/10' : 'bg-white border border-[var(--mist-200)]',
        hover ? 'shadow-[var(--shadow-md)]' : '',
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1.5">
        <div
          style={{ fontSize: 'var(--fs-headline)', lineHeight: 1.2 }}
          className={cn('font-display uppercase tracking-[-0.005em]', dark ? 'text-white' : 'text-[var(--navy-900)]')}
        >
          {item.title}
        </div>
        {item.meta && (
          <div
            style={{ fontSize: 'var(--fs-micro)' }}
            className={cn('uppercase tracking-[0.06em] font-bold', dark ? 'text-white/60' : 'text-[var(--mist-500)]')}
          >
            {item.meta}
          </div>
        )}
      </div>

      {item.pills && <div className="flex flex-wrap gap-1.5 mb-3">{item.pills}</div>}

      {item.body && (
        <p
          style={{ fontSize: 'var(--fs-small)', lineHeight: 1.5 }}
          className={cn(dark ? 'text-white/80' : 'text-[var(--ink)]/80', 'mb-3 line-clamp-2')}
        >
          {item.body}
        </p>
      )}

      {typeof item.difficulty === 'number' && (
        <div className="flex gap-1 mb-3" aria-label={`Difficulty ${item.difficulty} of 5`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <ShirtIcon
              key={n}
              filled={n <= (item.difficulty ?? 0)}
              dark={dark}
            />
          ))}
        </div>
      )}

      {item.footer && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-current/10">
          {item.footer}
        </div>
      )}
    </motion.div>
  );

  if (item.href) {
    return (
      <a href={item.href} className="block no-underline">
        {inner}
      </a>
    );
  }
  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} className="block w-full text-left">
        {inner}
      </button>
    );
  }
  return inner;
}

/** Mini Spurs-style shirt SVG, 12x14. */
function ShirtIcon({ filled, dark }: { filled: boolean; dark: boolean }) {
  const fill = filled
    ? dark
      ? 'var(--gold-500)'
      : 'var(--navy-800)'
    : dark
      ? 'rgba(255,255,255,0.15)'
      : 'var(--mist-200)';
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
      <path
        d="M3.5 1L1 2.5V5l2 1v6.5h6V6l2-1V2.5L8.5 1 6 2.5 3.5 1z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
