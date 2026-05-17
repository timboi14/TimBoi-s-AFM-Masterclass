import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { store, useStore, tierFor } from '@/lib/store';
import { cn } from '@/lib/cn';
import { CoachVoice } from '@/components/CoachVoice';
import { StopVoice } from '@/components/StopVoice';
import { LjqcStrip } from '@/components/LjqcStrip';
import { TabArtBanner, MascotBob, tabArtFor, prefetchTabArt } from '@/components/TabArt';
import { SH_KEY_DATES } from '@/data/shplus';

// Consolidated nav per design-system spec §11.1: hub pages group related sub-routes.
// Old top-level entries (Theory, Cards, Formulas, Practice, Mock, Debrief, Pitfalls,
// Examiner, Memory Lab, Skills, Revision) still exist as routes — they are reached
// through their hub page or via deep links, just not surfaced in the global nav.
const NAV = [
  { to: '/', label: 'Home', icon: 'fa-house' },
  { to: '/course', label: 'Course', icon: 'fa-graduation-cap' },
  { to: '/past-papers', label: 'Past Papers', icon: 'fa-file-lines', match: '/past-papers' },
  { to: '/topic/adviser', label: 'Topics', icon: 'fa-list', match: '/topic' },
  { to: '/syllabus', label: 'Syllabus', icon: 'fa-table-list', match: '/syllabus' },
  { to: '/playbook', label: 'Playbook', icon: 'fa-book', match: '/playbook' },
  { to: '/training', label: 'Training', icon: 'fa-stopwatch', match: '/training' },
  { to: '/scout', label: 'Scout', icon: 'fa-binoculars', match: '/scout' },
  { to: '/boot-room', label: 'Boot Room', icon: 'fa-brain', match: '/boot-room' },
  { to: '/study-guide', label: 'Tools', icon: 'fa-toolbox' },
  { to: '/war-room', label: 'War Room', icon: 'fa-shield-halved' },
];

export function Layout() {
  const location = useLocation();
  const state = useStore();
  const t = tierFor(state.points);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (state.fanName) store.bumpStreak();
  }, [state.fanName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Inject a <link rel="preload"> for the current route's backdrop so a fresh
  // page-load can start the fetch before the <picture> in TabArtBanner parses.
  // Client-side route changes use the same link element (we update its imageSrcset).
  useEffect(() => {
    const art = tabArtFor(location.pathname);
    if (!art) return;
    const id = 'tba-tab-art-preload';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'preload';
      link.as = 'image';
      document.head.appendChild(link);
    }
    link.type = 'image/webp';
    link.setAttribute('imagesrcset', `/spurs/${art.base}.webp 1x, /spurs/${art.base}@2x.webp 2x`);
    link.setAttribute('imagesizes', '520px');
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-accent focus:text-ink focus:px-3 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-floodlight"
      >
        Skip to main content
      </a>
      <div className="pointer-events-none fixed inset-0 z-0 pitch-grid floodlight" />

      <DeadlineBanner />

      {/* Sticky glass header */}
      <div
        className={cn(
          'sticky top-0 z-30 transition-all duration-300',
          scrolled ? 'glass border-b border-border/70 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.20)]' : 'bg-transparent',
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <header className="py-3 flex flex-wrap items-center gap-3">
            <NavLink to="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 grid place-items-center rounded-xl bg-ink overflow-hidden border border-ink/30">
                <span className="font-display text-[15px] text-accent tracking-wider">TBA</span>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/10 to-primary/0 group-hover:via-accent/30 transition-colors" />
              </div>
              <div>
                <div className="font-display text-xl md:text-2xl tracking-wider leading-none text-ink">
                  TIMBOI&apos;S <span className="text-primary">ACADEMY</span>
                </div>
                <div className="text-[10.5px] text-muted uppercase tracking-[0.18em] mt-1">
                  ACCA AFM Pass Engine · Match-day energy
                </div>
              </div>
            </NavLink>

            <div className="ml-auto hidden md:flex items-center gap-2">
              <span className="chip">
                <i className="fa-solid fa-fire text-accent-dark" /> Streak {state.streak}
              </span>
              <span className="chip">
                <i className="fa-solid fa-bolt text-primary" /> {state.points} pts
              </span>
              <span className="chip" style={{ borderColor: 'rgba(245,184,0,0.5)', background: 'rgba(245,184,0,0.10)', color: '#866900' }}>
                {t.emoji} {t.tier}
              </span>
            </div>
          </header>

          <nav className="pb-2 flex flex-wrap items-center gap-1 -mx-1 px-1">
            {NAV.map((item) => {
              const isActive = item.match
                ? location.pathname.startsWith(item.match)
                : location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onMouseEnter={() => prefetchTabArt(item.to)}
                  onFocus={() => prefetchTabArt(item.to)}
                  className={cn(
                    'relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors whitespace-nowrap',
                    isActive ? 'text-white' : 'text-muted hover:text-ink hover:bg-slate-100',
                  )}
                >
                  <i className={`fa-solid ${item.icon} text-[12px]`} />
                  {item.label}
                  {isActive && (
                    <>
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-primary z-[-1] shadow-glow"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                      <MascotBob size={28} className="ml-1 -mr-1" />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <LjqcStrip />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-32">
        {/* Route-keyed backdrop. Self-bounded to a 480/560 px box at top-right
            of this page wrapper, so it sits behind the hero band of the route
            below without any dependence on the page's full height. */}
        <TabArtBanner />

        <AnimatePresence mode="wait">
          <motion.main
            id="main-content"
            tabIndex={-1}
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>

        <footer className="mt-16 pt-8 border-t border-border text-center text-muted text-sm">
          <p className="font-display text-primary tracking-widest text-base">
            TECHNIQUE BEATS KNOWLEDGE ON EXAM DAY.
          </p>
          <p className="mt-2">
            Built for the June 2026 sitting. Examiner-style technique, Spurs energy, zero filler.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted/70">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">/</kbd> anywhere to summon Coach AI
          </p>
        </footer>
      </div>

      {/* Global voice-enabled coach + voice stop button */}
      <CoachVoice />
      <StopVoice />
    </div>
  );
}

/** Persistent banner when the next hard deadline is < 48h away. */
function DeadlineBanner() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const next = SH_KEY_DATES.find((d) => +new Date(d.date) > +now);
  if (!next) return null;
  const hours = Math.round((+new Date(next.date) - +now) / 3_600_000);
  if (hours > 48) return null;

  const tone = next.tone === 'critical' ? 'bg-danger text-white' : 'bg-accent text-ink';
  return (
    <div className={cn('relative z-40 text-center text-[12.5px] py-2 px-4 font-bold', tone)}>
      <i className="fa-solid fa-bell mr-2" />
      {hours <= 24 ? `${hours}h to deadline:` : `~${Math.round(hours / 24)}d to deadline:`} {next.label}
    </div>
  );
}
