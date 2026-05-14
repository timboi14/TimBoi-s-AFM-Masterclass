import { motion, useMotionValueEvent, useScroll, useReducedMotion } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SubNavAnchor {
  /** Hash target without the `#`. Must match an `id` on the page. */
  id: string;
  label: string;
  /** Optional side-effect fired when the anchor is clicked, before the scroll. */
  onActivate?: () => void;
}

interface StickySubNavProps {
  /** Page name shown on the left (e.g. "Past papers"). */
  title: string;
  anchors: SubNavAnchor[];
  /** Optional CTA on the right. Pass a TonePill size="sm". */
  cta?: ReactNode;
  /** Set true on `tone-navy`/`tone-black` hero pages so the bar stays legible. */
  dark?: boolean;
  /**
   * Pixel offset before the bar appears (anti-flash on initial scroll).
   * Default 240px — clears the hero band on a typical viewport.
   */
  appearAfter?: number;
}

/**
 * Block B — Sticky Sub-Nav.
 * Mounts when the user scrolls past `appearAfter` px. Hides on scroll-down,
 * reveals on scroll-up (Apple product-page behaviour).
 */
export function StickySubNav({ title, anchors, cta, dark = false, appearAfter = 240 }: StickySubNavProps) {
  const [revealed, setRevealed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const { scrollY } = useScroll();
  const prefersReduced = !!useReducedMotion();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const past = y > appearAfter;
    setRevealed(past);
    if (past) {
      const dy = y - lastY.current;
      if (Math.abs(dy) > 8) {
        setHidden(dy > 0); // scrolling DOWN → hide
        lastY.current = y;
      }
    } else {
      setHidden(false);
      lastY.current = y;
    }
  });

  const offscreen = !revealed || hidden;
  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.2, 0.8, 0.2, 1] as const };

  const onAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, anchor: SubNavAnchor) => {
    e.preventDefault();
    anchor.onActivate?.();
    const el = document.getElementById(anchor.id);
    if (el) {
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
    history.replaceState(null, '', `#${anchor.id}`);
  };

  return (
    <motion.nav
      aria-label="Page sections"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: offscreen ? 0 : 1, y: offscreen ? -16 : 0 }}
      transition={transition}
      // Sits just below the Layout's primary nav (Layout header ≈ 96px tall on desktop).
      style={{
        top: 'var(--app-header-h, 96px)',
        pointerEvents: offscreen ? 'none' : 'auto',
      }}
      className={cn(
        'fixed left-0 right-0 z-40 h-14 border-b',
        dark
          ? 'bg-[rgba(10,15,30,0.7)] border-white/10 text-white backdrop-blur-xl backdrop-saturate-150'
          : 'bg-white/85 border-[var(--mist-200)] text-[var(--navy-800)] backdrop-blur-xl backdrop-saturate-150',
      )}
    >
      <div className="mx-auto flex h-full max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <span
          className={cn(
            'shrink-0 truncate font-display text-[14px] uppercase tracking-[0.06em]',
            dark ? 'text-white' : 'text-[var(--navy-900)]',
          )}
        >
          {title}
        </span>

        <ul
          className={cn(
            'flex min-w-0 flex-1 items-center gap-0 overflow-x-auto sm:overflow-visible',
            'scrollbar-none',
          )}
        >
          {anchors.map((a) => (
            <li key={a.id} className="shrink-0">
              <a
                href={`#${a.id}`}
                onClick={(e) => onAnchorClick(e, a)}
                className={cn(
                  'relative inline-flex h-14 items-center px-3 text-[13px] font-semibold transition-colors sm:px-4',
                  dark ? 'text-white/80 hover:text-white' : 'text-[var(--navy-800)]/80 hover:text-[var(--navy-900)]',
                )}
              >
                {a.label}
                <span className="pointer-events-none absolute bottom-3 left-3 right-3 h-[2px] origin-left scale-x-0 bg-[var(--gold-500)] transition-transform group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {cta && <div className="ml-auto shrink-0">{cta}</div>}
      </div>
    </motion.nav>
  );
}
