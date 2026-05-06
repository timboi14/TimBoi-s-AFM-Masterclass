import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';

const KEY = 'tba_onboarding_v1';

interface OnbState { distance: 'tonight' | 'week' | 'month' | 'twoMonth'; dismissed: boolean; }

const PATHS: { id: OnbState['distance']; label: string; subtitle: string; icon: string; route: string; copy: string }[] = [
  {
    id: 'tonight', label: 'One night', subtitle: 'Exam tomorrow / very soon', icon: 'fa-bell',
    route: '/war-room',
    copy: 'Open the War Room. Tickable T-1 / T-0 / opening / closing checklists, command-word translator, 8 spreadsheet shortcuts, and the mistakes that cost the pass.',
  },
  {
    id: 'week', label: 'One week', subtitle: '5–7 days to sitting', icon: 'fa-stopwatch',
    route: '/examiner',
    copy: 'Drill the Examiner Reports digest first — read the 7 cases / 24 traps / 9 quotes, then sit one full mock, then review weak signals via Memory Lab.',
  },
  {
    id: 'month', label: 'About a month', subtitle: '3–4 weeks to sitting', icon: 'fa-calendar-week',
    route: '/course',
    copy: 'Use the 5-week Resit Roadmap. Each week ticks off exit criteria, with linked TimBoi fixtures, theory cards, and examiner traps. Mock in week 4.',
  },
  {
    id: 'twoMonth', label: '8 weeks or more', subtitle: 'Plenty of runway', icon: 'fa-route',
    route: '/',
    copy: 'Full pass-engine flow: today\'s mission, group-stage topics, 88-card theory bank, Memory Lab spaced repetition, then weekly mocks. Build the streak.',
  },
];

function load(): OnbState | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function save(s: OnbState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

/**
 * One-time first-visit modal: "How long until your sitting?"
 * Persists answer + dismissal flag. Never re-appears once dismissed,
 * unless the user resets via /settings (not yet built — manual localStorage clear works).
 */
export function Onboarding() {
  const state = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<OnbState['distance'] | null>(null);

  useEffect(() => {
    // Defer until the name overlay is gone (so we don't stack two modals)
    if (!state.fanName) return;
    const stored = load();
    if (stored?.dismissed) return;
    const id = setTimeout(() => setOpen(true), 250);
    return () => clearTimeout(id);
  }, [state.fanName]);

  const choose = (id: OnbState['distance']) => {
    setPicked(id);
    save({ distance: id, dismissed: true });
  };

  const go = () => {
    if (!picked) return;
    const path = PATHS.find((p) => p.id === picked);
    setOpen(false);
    if (path) setTimeout(() => navigate(path.route), 200);
  };

  const skip = () => {
    save({ distance: 'twoMonth', dismissed: true });
    setOpen(false);
  };

  const pickedPath = picked ? PATHS.find((p) => p.id === picked) : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
          aria-labelledby="onboarding-title"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-ink/70 backdrop-blur-md" onClick={skip} />
          <motion.div
            initial={{ scale: 0.95, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 8 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="relative w-full max-w-2xl rounded-3xl border-2 border-accent/40 bg-white p-7 shadow-floodlight"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-ink text-[10px] font-bold uppercase tracking-widest">
              Quick set-up
            </div>
            <h2 id="onboarding-title" className="font-display text-3xl tracking-wide uppercase text-ink">
              How long until your sitting?
            </h2>
            <p className="mt-2 text-[14px] text-ink/75 leading-relaxed">
              The site adapts to your runway. Pick one — we&apos;ll send you to the right starting point.
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PATHS.map((p) => {
                const active = picked === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => choose(p.id)}
                    className={
                      'text-left rounded-2xl border-2 px-4 py-3 transition-colors ' +
                      (active ? 'border-primary bg-primary/[0.06]' : 'border-border bg-white hover:border-primary/50')
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={'w-9 h-9 rounded-lg grid place-items-center ' + (active ? 'bg-primary text-white' : 'bg-slate-100 text-ink')}>
                        <i className={`fa-solid ${p.icon}`} />
                      </div>
                      <div>
                        <div className="font-display text-base uppercase tracking-wide text-ink leading-tight">{p.label}</div>
                        <div className="text-[11px] text-muted uppercase tracking-wider font-bold">{p.subtitle}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {pickedPath && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 rounded-xl border border-primary/30 bg-primary/[0.05] p-4 text-[13.5px] leading-relaxed text-ink"
              >
                <i className="fa-solid fa-arrow-right text-primary mr-2" /> {pickedPath.copy}
              </motion.div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <button onClick={skip} className="text-[12px] text-muted hover:text-ink">
                Skip — I&apos;ll find my way
              </button>
              <button onClick={go} disabled={!picked} className="btn-primary disabled:opacity-40">
                <i className="fa-solid fa-play" /> Let&apos;s go
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
