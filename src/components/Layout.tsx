import { NavLink, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { store, useStore, tierFor } from '@/lib/store';
import { cn } from '@/lib/cn';
import { StopVoice } from '@/components/StopVoice';
import { LjqcStrip } from '@/components/LjqcStrip';
import { KeyboardHelp } from '@/components/KeyboardHelp';
import { TabArtBanner, tabArtFor, prefetchTabArt } from '@/components/TabArt';
import { AppIcon, type AppIconName } from '@/components/AppIcon';
import { SH_KEY_DATES } from '@/data/shplus';

// Coach carries the local knowledge base, markdown renderer and paper lookup.
// Delay it until after first paint so those hundreds of KB never block the
// dashboard or the first learner action.
const CoachVoice = lazy(() => import('@/components/CoachVoice').then((module) => ({ default: module.CoachVoice })));

type NavItem = {
  to: string;
  label: string;
  icon: AppIconName;
  matches?: string[];
};

// Seven durable learner intents stay visible ("Leave it to us" joined 11 Jul —
// the S26–J27 game plan earns front-row placement). Specialist rooms live
// under More, keeping the global chrome calm without hiding the depth.
const PRIMARY_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/leave-it-to-us', label: 'Leave it to us', icon: 'sparkles', matches: ['/leave-it-to-us'] },
  { to: '/course', label: 'Learn', icon: 'graduation', matches: ['/course', '/champions-league', '/topic'] },
  { to: '/training', label: 'Training', icon: 'stopwatch', matches: ['/training', '/practice', '/mock', '/debrief'] },
  { to: '/past-papers', label: 'Papers', icon: 'files', matches: ['/past-papers', '/revision/papers'] },
  { to: '/form-guide', label: 'Progress', icon: 'chart', matches: ['/form-guide', '/progress'] },
  { to: '/war-room', label: 'Matchday', icon: 'shield', matches: ['/war-room'] },
];

const MORE_NAV: NavItem[] = [
  { to: '/start', label: 'Start here', icon: 'compass', matches: ['/start'] },
  { to: '/champions-league', label: 'Plain-English concepts', icon: 'lightbulb', matches: ['/champions-league'] },
  { to: '/topic/adviser', label: 'Topic library', icon: 'list', matches: ['/topic'] },
  { to: '/playbook', label: 'Playbook', icon: 'book', matches: ['/playbook'] },
  { to: '/boot-room', label: 'Memory & recall', icon: 'brain', matches: ['/boot-room', '/memory'] },
  { to: '/scout', label: 'Scout report', icon: 'binoculars', matches: ['/scout', '/examiner'] },
  { to: '/settings', label: 'Settings & accessibility', icon: 'accessibility', matches: ['/settings'] },
];

const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

function isNavActive(item: NavItem, pathname: string) {
  if (item.to === '/') return pathname === '/';
  return (item.matches ?? [item.to]).some((prefix) => pathname.startsWith(prefix));
}

/** Native-details dropdown that also dismisses on outside click and Escape. */
function DismissableDetails({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const closeIfOutside = (event: PointerEvent) => {
      if (el.open && event.target instanceof Node && !el.contains(event.target)) el.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && el.open) {
        el.open = false;
        el.querySelector('summary')?.focus();
      }
    };
    document.addEventListener('pointerdown', closeIfOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeIfOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}

export function Layout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Pop-out reference windows (?popout=true) drop all site chrome so the
  // window is a clean, side-by-side reference next to the CBE workspace.
  const isPopout = searchParams.get('popout') === 'true';
  const state = useStore();
  const t = tierFor(state.points);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.fanName) store.bumpStreak();
  }, [state.fanName]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  }, [location.pathname]);

  // Floating sheets (fan-name invite) hide via CSS while the mobile menu is
  // open, so the two surfaces never stack (styles.css: html[data-tba-menu-open]).
  useEffect(() => {
    document.documentElement.toggleAttribute('data-tba-menu-open', menuOpen);
    return () => document.documentElement.removeAttribute('data-tba-menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Publish the real two-row shell height for sticky page nav and hash targets.
  // The height changes across breakpoints and when the mobile menu opens.
  useEffect(() => {
    const shell = headerShellRef.current;
    if (!shell) return;
    const updateHeaderHeight = () => {
      document.documentElement.style.setProperty('--app-header-h', `${Math.ceil(shell.getBoundingClientRect().height)}px`);
    };
    updateHeaderHeight();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeaderHeight) : null;
    observer?.observe(shell);
    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateHeaderHeight);
      document.documentElement.style.removeProperty('--app-header-h');
    };
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

  // Chrome-free shell for pop-out reference windows. Returned after all hooks
  // above have run so hook order stays stable across the two render paths.
  if (isPopout) {
    return (
      <div className="min-h-screen bg-white">
        <Outlet />
      </div>
    );
  }

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
        ref={headerShellRef}
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
                  ACCA AFM · September 2026
                </div>
              </div>
            </NavLink>

            <div className="ml-auto hidden md:flex items-center gap-2">
              <span className="chip">
                <AppIcon name="flame" size={12} className="text-accent-dark" /> Streak {state.streak}
              </span>
              <span className="chip">
                <AppIcon name="zap" size={12} className="text-primary" /> {state.points} pts
              </span>
              <span className="chip" title={`Current squad: ${t.tier}`}>{t.emoji} {t.tier}</span>
              <NavLink
                to="/settings"
                aria-label="Open settings and accessibility"
                title="Settings & accessibility"
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full border transition-colors',
                  location.pathname.startsWith('/settings')
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white/70 text-muted hover:border-primary hover:text-primary',
                )}
              >
                <AppIcon name="accessibility" size={15} />
              </NavLink>
            </div>

            {/* Mobile menu toggle — keeps the first phone viewport for product, not nav */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden ml-auto w-11 h-11 grid place-items-center rounded-xl border border-border bg-white/70 text-ink"
            >
              <AppIcon name={menuOpen ? 'x' : 'menu'} size={19} />
            </button>
          </header>

          <nav className="pb-2 hidden md:flex flex-wrap items-center gap-1 -mx-1 px-1" aria-label="Primary navigation">
            {PRIMARY_NAV.map((item) => {
              const isActive = isNavActive(item, location.pathname);
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
                  <AppIcon name={item.icon} size={12} />
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg bg-primary z-[-1] shadow-glow" />
                  )}
                </NavLink>
              );
            })}
            <DismissableDetails key={location.pathname} className="relative ml-1 group/more">
              <summary className="list-none cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold text-muted hover:text-ink hover:bg-slate-100 transition-colors">
                <AppIcon name="grip" size={12} />
                More
                <AppIcon name="chevronDown" size={11} className="transition-transform group-open/more:rotate-180" />
              </summary>
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-border bg-white/95 p-2 shadow-[0_24px_70px_-30px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                {MORE_NAV.map((item) => {
                  const active = isNavActive(item, location.pathname);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onMouseEnter={() => prefetchTabArt(item.to)}
                      onFocus={() => prefetchTabArt(item.to)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors',
                        active ? 'bg-primary/10 text-primary' : 'text-ink hover:bg-slate-100',
                      )}
                    >
                      <span className={cn('grid h-8 w-8 place-items-center rounded-lg', active ? 'bg-primary text-white' : 'bg-slate-100 text-muted')}>
                        <AppIcon name={item.icon} size={13} />
                      </span>
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </DismissableDetails>
          </nav>

          {/* Mobile menu: compact 2-col grid, no layoutId/mascot (avoids clashing
              with the desktop nav's shared-element pill) */}
          {menuOpen && (
              <nav key="mobile-nav" className="md:hidden overflow-hidden layout-mobile-menu">
                <div className="grid grid-cols-2 gap-1.5 pb-3 pt-1">
                  {ALL_NAV.map((item) => {
                    const isActive = isNavActive(item, location.pathname);
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-colors',
                          isActive
                            ? 'bg-primary text-white shadow-glow'
                            : 'text-ink bg-white/70 border border-border hover:bg-slate-100',
                        )}
                      >
                        <AppIcon name={item.icon} size={13} className="w-4 shrink-0" />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </nav>
          )}
        </div>
        <LjqcStrip />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 pt-4 pb-32">
        {/* Route-keyed backdrop. Self-bounded to a 480/560 px box at top-right
            of this page wrapper, so it sits behind the hero band of the route
            below without any dependence on the page's full height. */}
        <TabArtBanner />

          <main
            id="main-content"
            tabIndex={-1}
            key={location.pathname}
            className="layout-route-enter"
          >
            <Outlet />
          </main>

        <footer className="mt-16 pt-8 border-t border-border text-center text-muted text-sm">
          <p className="font-display text-primary tracking-widest text-base">
            TECHNIQUE BEATS KNOWLEDGE ON EXAM DAY.
          </p>
          <p className="mt-2">
            Built for your next AFM sitting. Examiner-style technique, Spurs energy, zero filler.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-muted/70">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-border">/</kbd> anywhere to summon Coach AI
          </p>
        </footer>
      </div>

      {/* Global voice-enabled coach + voice stop button + keyboard help */}
      <DeferredCoach />
      <StopVoice />
      <KeyboardHelp />
    </div>
  );
}

function DeferredCoach() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const launchFromKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isField = target && (/input|textarea|select/i.test(target.tagName) || target.isContentEditable);
      if (event.key === '/' && !isField) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#coach`);
        setReady(true);
      }
    };
    const launchFromHash = () => {
      if (window.location.hash === '#coach') setReady(true);
    };
    launchFromHash();
    window.addEventListener('keydown', launchFromKeyboard);
    window.addEventListener('hashchange', launchFromHash);
    return () => {
      window.removeEventListener('keydown', launchFromKeyboard);
      window.removeEventListener('hashchange', launchFromHash);
    };
  }, []);

  if (!ready) {
    return (
      <button
        type="button"
        onClick={() => {
          window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#coach`);
          setReady(true);
        }}
        className="fixed bottom-5 right-5 z-40 group h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center text-white shadow-[0_18px_40px_-12px_rgba(0,163,71,0.55)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
        style={{ backgroundImage: 'linear-gradient(135deg, #00b54e 0%, #008f3d 55%, #f5b800 140%)' }}
        aria-label="Open Coach AI"
        title="Open Coach AI"
      >
        <span className="relative">
          <AppIcon name="headset" size={24} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent ring-2 ring-white animate-ping" aria-hidden />
        </span>
        <span className="hidden md:block absolute right-[110%] top-1/2 -translate-y-1/2 mr-1 px-2.5 py-1 rounded-md bg-ink text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Coach AI · press /
        </span>
      </button>
    );
  }
  return (
    <Suspense fallback={null}>
      <CoachVoice />
    </Suspense>
  );
}

/** Persistent banner when the next hard deadline is < 48h away. */
function DeadlineBanner() {
  const { examEntryConfirmedAt } = useStore();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Once the learner has confirmed their exam entry (Home banner), the
  // entry deadline stops being their deadline — don't shout about it.
  const next = SH_KEY_DATES.find(
    (d) => +new Date(d.date) > +now && !(examEntryConfirmedAt && /entry/i.test(d.label)),
  );
  if (!next) return null;
  const hours = Math.round((+new Date(next.date) - +now) / 3_600_000);
  if (hours > 48) return null;

  const tone = next.tone === 'critical' ? 'bg-danger text-white' : 'bg-accent text-ink';
  return (
    <div className={cn('relative z-40 text-center text-[12.5px] py-2 px-4 font-bold', tone)}>
      <AppIcon name="bell" size={14} className="mr-2 inline-block" />
      {hours <= 24 ? `${hours}h to deadline:` : `~${Math.round(hours / 24)}d to deadline:`} {next.label}
    </div>
  );
}
