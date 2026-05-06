import { useId, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface TopicTab {
  id: string;
  label: string;
  icon?: string;
  render: () => ReactNode;
}

/**
 * Accessible tab system with full ARIA roles, roving tabindex, and keyboard
 * navigation (ArrowLeft / ArrowRight / Home / End). Replaces the previous
 * tab UI which scrolled the page on switch and rendered empty for ~300ms.
 */
export function TopicTabs({
  tabs,
  defaultId,
  onChange,
  className,
}: {
  tabs: TopicTab[];
  defaultId?: string;
  onChange?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = useState(defaultId ?? tabs[0].id);
  const reduce = useReducedMotion();
  const groupId = useId();

  const select = (id: string) => {
    setActive(id);
    onChange?.(id);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((x) => x.id === active);
    if (e.key === 'ArrowRight') { e.preventDefault(); select(tabs[(i + 1) % tabs.length].id); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length].id); }
    else if (e.key === 'Home') { e.preventDefault(); select(tabs[0].id); }
    else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1].id); }
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Topic sections"
        onKeyDown={onKeyDown}
        className="flex flex-wrap gap-1 rounded-2xl border border-border bg-slate-100/70 p-1"
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              id={`${groupId}-${t.id}-tab`}
              aria-selected={selected}
              aria-controls={`${groupId}-${t.id}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold rounded-xl transition-colors',
                selected
                  ? 'bg-white text-ink shadow-sm border border-border'
                  : 'text-muted hover:text-ink hover:bg-white/60',
              )}
            >
              {t.icon && <i className={`fa-solid ${t.icon} text-[12px] ${selected ? 'text-primary' : ''}`} />}
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 min-h-[240px]">
        <AnimatePresence mode="wait" initial={false}>
          {tabs.map((t) =>
            t.id === active ? (
              <motion.section
                key={t.id}
                role="tabpanel"
                id={`${groupId}-${t.id}-panel`}
                aria-labelledby={`${groupId}-${t.id}-tab`}
                tabIndex={0}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="focus:outline-none"
              >
                {t.render()}
              </motion.section>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
