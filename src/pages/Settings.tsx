import { useEffect, useMemo, useState } from 'react';
import { CenteredHero, HeroGold, SectionShell } from '@/components/Blocks';
import {
  collectFullExport,
  collectAnkiTsv,
  downloadBlob,
  todayStamp,
  wipeAllLocalData,
} from '@/lib/exporter';
import {
  applySettings,
  loadSettings,
  SETTINGS_KEY,
  type FontScale,
  type SettingsState,
  type Theme,
} from '@/lib/user-settings';
import { store, useStore } from '@/lib/store';

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
  const [exportBusy, setExportBusy] = useState(false);
  const [wipeBusy, setWipeBusy] = useState(false);
  const { fanName } = useStore();
  const [nameDraft, setNameDraft] = useState(() => store.get().fanName);

  useEffect(() => {
    applySettings(s);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    } catch { /* ignore */ }
  }, [s]);

  const exportSummary = useMemo(() => {
    if (typeof window === 'undefined') return { keyCount: 0, srCount: 0 };
    let keyCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && /^tba[._]/i.test(k)) keyCount++;
    }
    let srCount = 0;
    try {
      const raw = localStorage.getItem('tba_sr_v1');
      if (raw) srCount = (JSON.parse(raw) as unknown[]).length;
    } catch { /* ignore */ }
    return { keyCount, srCount };
  }, [s, exportBusy]);

  const doJsonExport = () => {
    setExportBusy(true);
    try {
      const data = collectFullExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(`tba_export_${todayStamp()}.json`, blob);
    } finally {
      setExportBusy(false);
    }
  };

  const doAnkiExport = () => {
    setExportBusy(true);
    try {
      const tsv = collectAnkiTsv();
      const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
      downloadBlob(`tba_cards_${todayStamp()}.tsv`, blob);
    } finally {
      setExportBusy(false);
    }
  };

  const doWipe = () => {
    if (!confirm('Delete every saved item on this device — points, streak, cards, attempts, notes? This cannot be undone unless you exported first.')) return;
    setWipeBusy(true);
    try {
      const n = wipeAllLocalData();
      alert(`Wiped ${n} stored item${n === 1 ? '' : 's'}. Refresh the page to seed defaults.`);
    } finally {
      setWipeBusy(false);
    }
  };

  return (
    <>
      <SectionShell tone="white" pad="lg" aura>
        <CenteredHero
          eyebrow={<>Accessibility · WCAG 2.2 AA</>}
          headline={<>Make it <HeroGold>fit you</HeroGold>.</>}
          subline={
            <>
              All controls for motion, readability, contrast and your data — in one place.
              Every setting persists on this device; export anytime.
            </>
          }
        />
      </SectionShell>

      <SectionShell tone="mist" pad="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {/* THEME PICKER */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-display text-lg uppercase tracking-wide text-ink mb-1">Theme</h2>
            <p className="text-[12.5px] text-muted mb-3">Light is the default. Dark dims surfaces; high-contrast uses AAA-grade combinations.</p>
            <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'high-contrast'] as Theme[]).map((t) => (
                <button
                  key={t}
                  role="radio"
                  aria-checked={s.theme === t}
                  onClick={() => setS((p) => ({ ...p, theme: t }))}
                  className={`rounded-xl border px-3 py-2 text-[12.5px] font-bold uppercase tracking-wider ${
                    s.theme === t ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink hover:border-primary/40'
                  }`}
                >
                  {t === 'high-contrast' ? 'AAA' : t}
                </button>
              ))}
            </div>
          </div>

          {/* FONT SIZE */}
          <div className="rounded-2xl border border-border bg-white p-5">
            <h2 className="font-display text-lg uppercase tracking-wide text-ink mb-1">Text size</h2>
            <p className="text-[12.5px] text-muted mb-3">Root font-size scale. Layouts reflow rather than overflowing.</p>
            <div role="radiogroup" aria-label="Font size" className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xl'] as FontScale[]).map((scale, i) => (
                <button
                  key={scale}
                  role="radio"
                  aria-checked={s.fontScale === scale}
                  onClick={() => setS((p) => ({ ...p, fontScale: scale }))}
                  className={`rounded-xl border px-3 py-2 font-bold uppercase tracking-wider ${
                    s.fontScale === scale ? 'border-primary bg-primary text-white' : 'border-border bg-white text-ink hover:border-primary/40'
                  }`}
                  style={{ fontSize: `${12 + i}px` }}
                >
                  {scale === 'xl' ? '20 px' : scale === 'large' ? '18 px' : '16 px'}
                </button>
              ))}
            </div>
          </div>

          {/* TOGGLES */}
          <div className="rounded-2xl border border-border bg-white p-5 space-y-4 md:col-span-2">
            <Toggle
              id="set-motion"
              label="Reduce motion"
              sub="Disables transitions and count-up animations. Also respects your OS-level prefers-reduced-motion."
              value={s.reduceMotion}
              onChange={(v) => setS((p) => ({ ...p, reduceMotion: v }))}
            />
            <Toggle
              id="set-dyslexia"
              label="Dyslexia-friendly font"
              sub="Atkinson Hyperlegible with looser letter-spacing. Loaded on demand from Google Fonts."
              value={s.dyslexia}
              onChange={(v) => setS((p) => ({ ...p, dyslexia: v }))}
            />
            <Toggle
              id="set-bionic"
              label="Bionic reading"
              sub="Bolds the first half of each word to anchor saccades. Global toggle — applies to body copy across the site."
              value={s.bionic}
              onChange={(v) => setS((p) => ({ ...p, bionic: v }))}
            />
          </div>

          {/* FAN NAME — the invite sheet points here ("set one any time in Settings") */}
          <div className="rounded-2xl border border-border bg-white p-5 md:col-span-2">
            <h2 className="font-display text-lg uppercase tracking-wide text-ink mb-1">Fan name</h2>
            <p className="text-[12.5px] text-muted mb-3">
              Shows on this device&apos;s leaderboard and squad chips. Saved locally — it never leaves the browser.
            </p>
            <div className="flex gap-2 flex-wrap">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="e.g. Sonny_07"
                maxLength={24}
                aria-label="Fan name"
                className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-slate-50 border border-border focus:border-accent focus:outline-none text-ink"
              />
              <button
                className="btn-primary disabled:opacity-50"
                disabled={!nameDraft.trim() || nameDraft.trim() === fanName}
                onClick={() => store.set({ fanName: nameDraft })}
              >
                Save name
              </button>
              {fanName && (
                <button
                  className="btn border border-border bg-white text-ink hover:bg-slate-50"
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
          </div>

          {/* DATA EXPORT (§22) */}
          <div className="rounded-2xl border border-border bg-white p-5 md:col-span-2">
            <h2 className="font-display text-lg uppercase tracking-wide text-ink mb-1">Your data</h2>
            <p className="text-[12.5px] text-muted mb-3">
              Everything you've saved on this device — {exportSummary.keyCount} keys, {exportSummary.srCount} flashcards.
              JSON gives you a full backup; the .tsv is Anki-importable (File → Import).
            </p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={doJsonExport}
                disabled={exportBusy}
                className="btn-primary disabled:opacity-50"
              >
                <i className="fa-solid fa-file-export" /> Download full JSON
              </button>
              <button
                onClick={doAnkiExport}
                disabled={exportBusy || exportSummary.srCount === 0}
                className="btn border border-border bg-white text-ink hover:bg-slate-50 disabled:opacity-50"
              >
                <i className="fa-solid fa-clone" /> Export cards (Anki TSV)
              </button>
              <button
                onClick={doWipe}
                disabled={wipeBusy}
                className="btn border border-danger text-danger bg-white hover:bg-danger hover:text-white disabled:opacity-50"
              >
                <i className="fa-solid fa-trash" /> Delete all my data
              </button>
            </div>
            <p className="mt-3 text-[11.5px] text-muted">
              SCORM, .apkg (real Anki package), and a PDF progress certificate will land once the server-side export worker ships (DECISIONS.md Sprint 10).
            </p>
          </div>
        </div>

        <p className="mt-4 text-[11.5px] text-muted max-w-2xl">
          Settings stored under <code>{SETTINGS_KEY}</code>. Clear browser storage or use "Delete all my data" to revert.
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
