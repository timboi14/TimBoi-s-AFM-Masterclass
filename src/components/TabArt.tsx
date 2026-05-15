import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

/**
 * Maps a route pathname to a Spurs-themed banner image in /public/spurs/.
 * Order matters — first matching prefix wins, so list the longer paths first.
 */
const ROUTE_ART: Array<{ match: (p: string) => boolean; src: string; label: string }> = [
  { match: (p) => p.startsWith('/past-papers'), src: '/spurs/past-papers.png', label: 'Past Papers' },
  { match: (p) => p.startsWith('/playbook'),    src: '/spurs/playbook.png',    label: 'Playbook' },
  { match: (p) => p.startsWith('/training'),    src: '/spurs/training.png',    label: 'Training' },
  { match: (p) => p.startsWith('/scout'),       src: '/spurs/scout.png',       label: 'Scout' },
  { match: (p) => p.startsWith('/boot-room'),   src: '/spurs/boot-room.png',   label: 'Boot Room' },
  { match: (p) => p.startsWith('/war-room'),    src: '/spurs/war-room.png',    label: 'War Room' },
  { match: (p) => p.startsWith('/course'),      src: '/spurs/course.png',      label: 'Course' },
  { match: (p) => p.startsWith('/topic'),       src: '/spurs/topics.png',      label: 'Topics' },
  { match: (p) => p.startsWith('/study-guide'), src: '/spurs/tools.png',       label: 'Tools' },
  // Old sub-routes that fold into the hub pages
  { match: (p) => p.startsWith('/theory') || p.startsWith('/cards') || p.startsWith('/formulas'), src: '/spurs/playbook.png', label: 'Playbook' },
  { match: (p) => p.startsWith('/practice') || p.startsWith('/mock') || p.startsWith('/debrief'), src: '/spurs/training.png', label: 'Training' },
  { match: (p) => p.startsWith('/pitfalls') || p.startsWith('/examiner'), src: '/spurs/scout.png', label: 'Scout' },
  { match: (p) => p.startsWith('/memory') || p.startsWith('/exam-skills'), src: '/spurs/boot-room.png', label: 'Boot Room' },
  // Home is the catch-all for /
  { match: (p) => p === '/', src: '/spurs/home.png', label: 'Home' },
];

function useTabArt() {
  const { pathname } = useLocation();
  const hit = ROUTE_ART.find((r) => r.match(pathname));
  return hit ?? null;
}

/**
 * Soft-faded Spurs banner anchored top-right of the page content area.
 * Renders behind everything via -z-10. opacity-15 + multiply blend so it
 * tints rather than dominates. Hidden on small screens (where it overflows).
 */
export function TabArtBanner() {
  const art = useTabArt();
  if (!art) return null;
  return (
    <img
      src={art.src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className="pointer-events-none absolute -right-12 -top-12 hidden md:block w-[420px] lg:w-[520px] opacity-[0.15] mix-blend-multiply -z-10 select-none"
    />
  );
}

/**
 * Floating mascot tucked next to whichever element this is rendered alongside.
 * Bobs gently. Static when prefers-reduced-motion is on.
 */
export function MascotBob({ size = 40, className = '' }: { size?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <img
      src="/spurs/mascot.png"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className={`pointer-events-none select-none ${reduced ? '' : 'animate-mascot-bob'} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
