export const SETTINGS_KEY = 'tba.settings.v2';

export type FontScale = 'normal' | 'large' | 'xl';
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface SettingsState {
  reduceMotion: boolean;
  dyslexia: boolean;
  bionic: boolean;
  fontScale: FontScale;
  theme: Theme;
}

const DEFAULT_SETTINGS: SettingsState = {
  reduceMotion: false,
  dyslexia: false,
  bionic: false,
  fontScale: 'normal',
  theme: 'light',
};

export function loadSettings(): SettingsState {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      const v1 = localStorage.getItem('tba.settings.v1');
      if (v1) {
        const old = JSON.parse(v1) as Partial<{ reduceMotion: boolean; dyslexia: boolean; largeText: boolean }>;
        return {
          ...DEFAULT_SETTINGS,
          reduceMotion: Boolean(old.reduceMotion),
          dyslexia: Boolean(old.dyslexia),
          fontScale: old.largeText ? 'large' : 'normal',
        };
      }
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function applySettings(state: SettingsState): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('tba-reduce-motion', state.reduceMotion);
  root.classList.toggle('tba-dyslexia', state.dyslexia);
  root.classList.toggle('tba-bionic', state.bionic);
  root.classList.toggle('tba-text-large', state.fontScale === 'large');
  root.classList.toggle('tba-text-xl', state.fontScale === 'xl');
  root.classList.toggle('tba-dark', state.theme === 'dark');
  root.classList.toggle('tba-high-contrast', state.theme === 'high-contrast');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', state.theme === 'light' ? '#0a0f1e' : '#000000');

  if (state.dyslexia && !document.getElementById('tba-dyslexia-font')) {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);

    const stylesheet = document.createElement('link');
    stylesheet.id = 'tba-dyslexia-font';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
    document.head.appendChild(stylesheet);
  }
}

if (typeof window !== 'undefined') applySettings(loadSettings());
