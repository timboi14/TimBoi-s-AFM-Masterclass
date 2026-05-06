import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { store, useStore, tierFor } from '@/lib/store';
import { cn } from '@/lib/cn';
import { CoachVoice } from '@/components/CoachVoice';

const NAV = [
  { to: '/', label: 'Home', icon: 'fa-house' },
  { to: '/course', label: 'SH+ Course', icon: 'fa-graduation-cap' },
  { to: '/topic/adviser', label: 'Topics', icon: 'fa-list', match: '/topic' },
  { to: '/practice', label: 'Practice', icon: 'fa-stopwatch-20', match: '/practice' },
  { to: '/theory', label: 'Theory', icon: 'fa-book' },
  { to: '/cards', label: 'Cards', icon: 'fa-clone' },
  { to: '/memory', label: 'Memory Lab', icon: 'fa-brain' },
  { to: '/mock', label: 'Mock', icon: 'fa-stopwatch' },
  { to: '/formulas', label: 'Formulas', icon: 'fa-square-root-variable' },
  { to: '/exam-skills', label: 'Skills', icon: 'fa-trophy' },
  { to: '/examiner', label: 'Examiner', icon: 'fa-file-signature' },
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

  return (
    <div className="min-h-screen relative">
      <div className="pointer-events-none fixed inset-0 z-0 pitch-grid floodlight" />

      {/* Sticky glass header — premium feel */}
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

          <nav className="pb-2 flex items-center gap-1 overflow-x-auto -mx-1 px-1 marquee-mask">
            {NAV.map((item) => {
              const isActive = item.match
                ? location.pathname.startsWith(item.match)
                : location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap',
                    isActive ? 'text-white' : 'text-muted hover:text-ink hover:bg-slate-100',
                  )}
                >
                  <i className={`fa-solid ${item.icon}`} />
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-primary z-[-1] shadow-glow"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-32">
        <AnimatePresence mode="wait">
          <motion.main
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
            Built for the June 2026 sitting. Mower-style technique, Spurs energy, zero filler.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted/70">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">/</kbd> anywhere to summon Coach AI
          </p>
        </footer>
      </div>

      {/* Global voice-enabled coach */}
      <CoachVoice />
    </div>
  );
}
