import { useEffect, useState } from 'react';
import { HeroGold } from '@/components/Blocks';
import {
  applySettings,
  loadSettings,
  SETTINGS_KEY,
  type FontScale,
  type SettingsState,
  type Theme,
} from '@/lib/user-settings';
import { store, useStore } from '@/lib/store';
import { SittingPanel } from '@/components/settings/SittingPanel';
import { GoalPanel } from '@/components/settings/GoalPanel';
import { DataPanel } from '@/components/settings/DataPanel';

/**
 * /settings — accessibility + data controls.
 *
 * Spec §14 + §18 + §22:
 *  - Reduced motion
 *  - Dyslexia-friendly font (Atkinson Hyperlegible)
 *  - Font-size scale (16 / 18 / 20 px root)
 *  - Dark theme
 *  - High-contrast theme (WCAG AAA contrast for primary text/UI)
 *  - Bionic reading (global toggle)
 *  - Data export (full JSON + Anki-importable TSV) and account wipe
 *
 * All settings persist to localStorage and apply via root <html> classes
 * (see styles.css), keeping the FOUC cost zero on subsequent visits.
 */

export function SettingsPage() {
  const [s, setS] = useState<SettingsState>(() => loadSettings());
  const { fanName } = useStore();
  const [nameDraft, setNameDraft] = useState(() => store.get().fanName);

  useEffect(() => {
    applySettings(s);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch { /* ignore */ }
  }, [s]);

  // Deep links such as /settings#goal land on the right card once it exists.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }, []);

  return (
    <div className="st">
      <header className="st__head" data-va-skip>
        <p className="st__eyebrow">Settings</p>
        <h1>Make it <HeroGold>fit you</HeroGold>.</h1>
        <p>Your sitting, your weekly target, how the page reads, and where your progress is kept.</p>
        <nav className="st__jump" aria-label="Settings sections">
          <a href="#sitting">Sitting</a>
          <a href="#goal">Weekly goal</a>
          <a href="#display">Display</a>
          <a href="#data">Your data</a>
        </nav>
      </header>

      <div className="st__grid">
        <SittingPanel />
        <GoalPanel />

        <section className="st-card" id="display" aria-labelledby="st-theme-title">
          <header className="st-card__head">
            <h2 id="st-theme-title">Theme</h2>
            <p>Dark dims every surface. AAA raises contrast for primary text and controls.</p>
          </header>
          <div role="radiogroup" aria-label="Theme" className="st-seg">
            {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
              <button key={t} type="button" role="radio" aria-checked={s.theme === t} className={s.theme === t ? 'is-active' : ''} onClick={() => setS((p) => ({ ...p, theme: t }))}>
                {t === 'high-contrast' ? 'AAA' : t}
              </button>
            ))}
          </div>
        </section>

        <section className="st-card" aria-labelledby="st-size-title">
          <header className="st-card__head">
            <h2 id="st-size-title">Text size</h2>
            <p>Scales the whole interface. Layouts reflow instead of overflowing.</p>
          </header>
          <div role="radiogroup" aria-label="Font size" className="st-seg">
            {(['normal', 'large', 'xl'] as FontScale[]).map((scale, i) => (
              <button key={scale} type="button" role="radio" aria-checked={s.fontScale === scale} className={s.fontScale === scale ? 'is-active' : ''} style={{ fontSize: `${12 + i * 1.5}px` }} onClick={() => setS((p) => ({ ...p, fontScale: scale }))}>
                {scale === 'xl' ? '20 px' : scale === 'large' ? '18 px' : '16 px'}
              </button>
            ))}
          </div>
        </section>

        <section className="st-card st-card--wide" aria-label="Reading and motion">
          <div className="st-toggles">
            <Toggle
              id="set-motion"
              label="Reduce motion"
              sub="Turns off transitions, page slides and count-up numbers. Your system setting is respected too."
              value={s.reduceMotion}
              onChange={(v) => setS((p) => ({ ...p, reduceMotion: v }))}
            />
            <Toggle
              id="set-dyslexia"
              label="Dyslexia-friendly font"
              sub="Atkinson Hyperlegible with looser letter spacing. Loaded on demand from Google Fonts."
              value={s.dyslexia}
              onChange={(v) => setS((p) => ({ ...p, dyslexia: v }))}
            />
            <Toggle
              id="set-bionic"
              label="Bionic reading"
              sub="Bolds the first half of each word to anchor the eye. Applies to body copy across the site."
              value={s.bionic}
              onChange={(v) => setS((p) => ({ ...p, bionic: v }))}
            />
          </div>
        </section>

        {/* FAN NAME — the invite sheet points here ("set one any time in Settings") */}
        <section className="st-card st-card--wide" aria-labelledby="st-name-title">
          <header className="st-card__head">
            <h2 id="st-name-title">Fan name</h2>
            <p>Shows on this device&apos;s leaderboard and squad chips. It never leaves the browser.</p>
          </header>
          <div className="st-actions">
            <input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder="e.g. Sonny_07"
              maxLength={24}
              aria-label="Fan name"
              className="st-input"
            />
            <button type="button" className="st-btn st-btn--primary" disabled={!nameDraft.trim() || nameDraft.trim() === fanName} onClick={() => store.set({ fanName: nameDraft })}>
              Save name
            </button>
            {fanName && (
              <button
                type="button"
                className="st-btn"
                onClick={() => {
                  // Deliberate clear — also stop the invite sheet re-nagging.
                  store.set({ fanName: '', fanPromptDismissedAt: new Date().toISOString() });
                  setNameDraft('');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <DataPanel />
      </div>
    </div>
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
    <div className="st-toggle">
      <label htmlFor={id}>
        <strong>{label}</strong>
        <span>{sub}</span>
      </label>
      <button id={id} type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={value ? 'is-on' : ''}>
        <i aria-hidden />
        <span className="sr-only">{value ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
