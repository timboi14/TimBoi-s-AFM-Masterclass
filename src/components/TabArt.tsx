import { useState, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

/**
 * Maps a route pathname to a Spurs-themed banner image base name in /public/spurs/.
 * Order matters: first matching prefix wins, list longer paths first.
 */
const ROUTE_ART: Array<{ match: (p: string) => boolean; base: string; label: string }> = [
  { match: (p) => p.startsWith('/past-papers'), base: 'past-papers', label: 'Past Papers' },
  { match: (p) => p.startsWith('/playbook'),    base: 'playbook',    label: 'Playbook' },
  { match: (p) => p.startsWith('/training'),    base: 'training',    label: 'Training' },
  { match: (p) => p.startsWith('/scout'),       base: 'scout',       label: 'Scout' },
  { match: (p) => p.startsWith('/boot-room'),   base: 'boot-room',   label: 'Boot Room' },
  { match: (p) => p.startsWith('/war-room'),    base: 'war-room',    label: 'War Room' },
  { match: (p) => p.startsWith('/course'),      base: 'course',      label: 'Course' },
  { match: (p) => p.startsWith('/topic'),       base: 'topics',      label: 'Topics' },
  { match: (p) => p.startsWith('/study-guide'), base: 'tools',       label: 'Tools' },
  // Old sub-routes that fold into the hub pages
  { match: (p) => p.startsWith('/theory') || p.startsWith('/cards') || p.startsWith('/formulas'), base: 'playbook',   label: 'Playbook' },
  { match: (p) => p.startsWith('/practice') || p.startsWith('/mock') || p.startsWith('/debrief'), base: 'training',   label: 'Training' },
  { match: (p) => p.startsWith('/pitfalls') || p.startsWith('/examiner'),                         base: 'scout',      label: 'Scout' },
  { match: (p) => p.startsWith('/memory') || p.startsWith('/exam-skills'),                        base: 'boot-room',  label: 'Boot Room' },
  // Home is the catch-all for /
  { match: (p) => p === '/', base: 'home', label: 'Home' },
];

export function tabArtFor(pathname: string) {
  return ROUTE_ART.find((r) => r.match(pathname)) ?? null;
}

const NAV_TO_BASE: Record<string, string> = {
  '/': 'home',
  '/course': 'course',
  '/past-papers': 'past-papers',
  '/topic/adviser': 'topics',
  '/playbook': 'playbook',
  '/training': 'training',
  '/scout': 'scout',
  '/boot-room': 'boot-room',
  '/study-guide': 'tools',
  '/war-room': 'war-room',
};

/** Warm the browser cache for the backdrop a user is about to navigate to. */
export function prefetchTabArt(to: string) {
  const base = NAV_TO_BASE[to];
  if (!base) return;
  // Pull the format the browser will actually use. Using `new Image()` lets
  // the request inherit the source order and accept-headers a <picture> uses.
  const img = new Image();
  img.src = `/spurs/${base}.webp`;
}

/**
 * Soft-faded Spurs backdrop anchored to the right edge of the page content.
 * Renders behind everything via -z-10 and mix-blend-multiply so it tints rather
 * than dominates. Fades in on load to avoid a flash. Hidden under md.
 */
export function TabArtBanner() {
  const { pathname } = useLocation();
  const art = tabArtFor(pathname);
  const [loaded, setLoaded] = useState(false);

  if (!art) return null;
  const { base } = art;

  // Reset the fade when the route changes so each hero animates in cleanly.
  // The key forces React to remount the <picture> on route change.
  return (
    <picture key={base} className="pointer-events-none">
      <source
        type="image/avif"
        srcSet={`/spurs/${base}.avif 1x, /spurs/${base}@2x.avif 2x`}
      />
      <source
        type="image/webp"
        srcSet={`/spurs/${base}.webp 1x, /spurs/${base}@2x.webp 2x`}
      />
      <img
        src={`/spurs/${base}.png`}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        // React's type for fetchPriority is recent; pass via a typed attr bag.
        {...({ fetchpriority: 'high' } as { fetchpriority: 'high' })}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 0.15 : 0, transition: 'opacity 320ms ease-out' } as CSSProperties}
        className="pointer-events-none absolute inset-y-0 right-0 hidden md:block max-w-[40%] w-auto h-full object-contain object-right-top mix-blend-multiply -z-10 select-none"
      />
    </picture>
  );
}

/**
 * Floating mascot tucked next to whichever element this is rendered alongside.
 * Bobs gently. Static when prefers-reduced-motion is on.
 */
export function MascotBob({ size = 40, className = '' }: { size?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <picture>
      <source type="image/avif" srcSet="/spurs/mascot.avif 1x, /spurs/mascot@2x.avif 2x" />
      <source type="image/webp" srcSet="/spurs/mascot.webp 1x, /spurs/mascot@2x.webp 2x" />
      <img
        src="/spurs/mascot.png"
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        width={size}
        height={size}
        className={`pointer-events-none select-none ${reduced ? '' : 'animate-mascot-bob'} ${className}`}
        style={{ width: size, height: size }}
      />
    </picture>
  );
}
