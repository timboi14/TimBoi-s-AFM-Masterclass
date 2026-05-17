import { useEffect, useState } from 'react';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';

/**
 * /settings — accessibility toggles persisted to localStorage.
 *
 * Work Item 12 of the Platinum-tier upgrade.
 *
 * Three toggles:
 *   - Reduce motion (disables CSS transitions + count-up animations)
 *   - Dyslexia mode (Atkinson Hyperlegible + extra letter-spacing)
 *   - Large text (root font-size 16px → 18px)
 *
 * Settings apply via <html class="…"> classes (see styles.css) and a
 * Google-Fonts <link> appended on demand.
 */

const KEY = 'tba.settings.v1';

interface SettingsState {
  reduceMotion: boolean;
  dyslexia: boolean;
  largeText: boolean;
}

const DEFAULT: SettingsState = { reduceMotion: false, dyslexia: false, largeText: false };

function load(): SettingsState {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const v = JSON.parse(raw) as Partial<SettingsState>;
    return { ...DEFAULT, ...v };
  } catch {
    return DEFAULT;
  }
}

function apply(state: SettingsState): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('tba-reduce-motion', state.reduceMotion);
  root.classList.toggle('tba-dyslexia', state.dyslexia);
  root.classList.toggle('tba-large-text', state.largeText);

  // Lazy-load Atkinson Hyperlegible when first enabled.
  if (state.dyslexia) {
    const id = 'tba-dyslexia-font';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
      document.head.appendChild(link);
    }
  }
}

/** Module-level apply so the settings stick across SPA route changes. */
if (typeof window !== 'undefined') {
  apply(load());
}

export function SettingsPage() {
  const [s, setS] = useState<SettingsState>(() => load());

  useEffect(() => {
    apply(s);
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch { /* ignore */ }
  }, [s]);

  return (
    <>
      <SectionShell tone="white" pad="lg">
        <CenteredHero
          eyebrow={<>Accessibility · WCAG 2.1 AA</>}
          headline={<>Make it <HeroGold>fit you</HeroGold>.</>}
          subline={
            <>
              Three toggles for the things that actually trip people up: motion,
              readability and text size. All settings persist on this device.
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <div className="rounded-2xl border border-border bg-white p-5 space-y-4 max-w-2xl">
          <Toggle
            id="set-motion"
            label="Reduce motion"
            sub="Disables transitions and the count-up stats animation. Also respects your OS-level prefers-reduced-motion."
            value={s.reduceMotion}
            onChange={(v) => setS((p) => ({ ...p, reduceMotion: v }))}
          />
          <Toggle
            id="set-dyslexia"
            label="Dyslexia mode"
            sub="Atkinson Hyperlegible font with looser letter-spacing. Loaded on demand from Google Fonts."
            value={s.dyslexia}
            onChange={(v) => setS((p) => ({ ...p, dyslexia: v }))}
          />
          <Toggle
            id="set-large"
            label="Large text"
            sub="Bumps root font-size from 16 px to 18 px. Layouts reflow rather than overflowing."
            value={s.largeText}
            onChange={(v) => setS((p) => ({ ...p, largeText: v }))}
          />
        </div>
        <p className="mt-3 text-[11.5px] text-muted max-w-2xl">
          Saved to your device under <code>tba.settings.v1</code>. Clear browser storage or reset
          via DevTools to revert.
        </p>
      </SectionShell>
    </>
  );
}

interface ToggleProps {
  id: string;
  label: string;
  sub: string;
  value: boolean;
  onChange: (next: boolean) => void;
}
function Toggle({ id, label, sub, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-start gap-4">
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <div className="font-bold text-ink">{label}</div>
        <div className="text-[12.5px] text-muted leading-snug">{sub}</div>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-border transition-colors ${
          value ? 'bg-primary' : 'bg-slate-200'
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
        <span className="sr-only">{value ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
