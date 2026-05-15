# 8 — Slop / comment hygiene — execution log

**Branch:** `cleanup/8-slop` (fast-forward merged into `main`, branch deleted).
**Commits:** 4.
**Behaviour change:** none — comments and JSDoc only.

## Commits (oldest first)

| Sha | Subject |
|---|---|
| `93eb9a6` | cleanup(8-slop): drop decorative section banners across page files |
| `d4e33e9` | cleanup(8-slop): tighten dash-banner comments in shared modules |
| `aed2de5` | cleanup(8-slop): tighten marketing phrasings in comments and JSDoc |
| `ede3f29` | cleanup(8-slop): drop wasted eslint-disable directive in ErrorBoundary |

## (a) Banner deletions — page files

Decorative `/* ─── N) SECTION ─── */` 3-line blocks removed entirely. The
function/component name immediately below is now the section marker.

| File | Banners removed | Locations (pre-edit) |
|---|---|---|
| `src/pages/Practice.tsx` | 6 | before `PracticePage`, `type PanelKey` (ExamSimulator block), `type SheetMode` (Spreadsheet), `Calculator`, `SampleAnswerPanel`, `CoachDrawer` |
| `src/pages/Revision.tsx` | 7 | before `RevisionDashboard`, papers-index PaperType chip list, `PaperView`, `QuestionDeepDive`, `TopicsIndex`, `ProgressDashboard`, `Navigate` (shared bits) |
| `src/pages/Debrief.tsx` | 4 | before `DebriefIndexPage`, `DebriefNewPage`, `DebriefViewPage`, `CritiquePanel` (shared) |
| `src/pages/Memory.tsx` | 2 | before `MemoryPage`, `SRQueue` (sub-components) |
| `src/pages/StudyGuide.tsx` | 3 | before `MarkBudget`, `PivotEntry` (Timer), `AnswerPlanCanvas` |
| `src/pages/Course.tsx` | 1 | before `KpiTile` (`/* ─── components ─── */`) |

Total banner blocks removed in pass (a): **23**.

Small inline `/* ── X ── */` single-line labels in Memory.tsx (Spaced
repetition queue / Feynman drafts / Memory palace) were NOT touched —
not listed in the spec; they each carry meaningful descriptive content,
unlike the numbered section dividers.

## (b) Banner tightening — primitives, CoachVoice, lib

Decorative dashes dropped; labels preserved.

| File | Items tightened |
|---|---|
| `src/components/primitives.tsx` | 6 `/* Label ----- */` block comments converted to `// Label` (stagger, Card base, Section title, Pill, Form Field, Coach Tip card) |
| `src/components/CoachVoice.tsx` | 5 dash banners converted to plain `//` (Coach send/answer, Voice dictation, Teach me something, Render, bubble). Single-line `/* Persist */`, `/* Load voices ... */`, `/* Auto-scroll on changes */`, and the multi-line Hotkeys block were already concise and were left as-is. |
| `src/lib/attempts.ts` | 1 — `/* ── Topic mastery ─── ...` → `/* Topic mastery.\n ...` (kept body, dropped rule) |
| `src/lib/voice.ts` | 2 — `/* ─── voice catalogue + picker ─── */` and `/* ─── speech synthesis ... ─── */` → `// label` |
| `src/lib/debrief.ts` | 9 — numbered signal banners `1)` through `8)` plus the trailing `Aggregate` banner. Numbering retained (still aligns with each `signals.push(...)` block); only the decorative `── …. ──` rules removed |

## (c) AI-slop phrasing replacements

| File:line | Before | After |
|---|---|---|
| `src/components/Layout.tsx:61` | `{/* Sticky glass header — premium feel */}` | `{/* Sticky glass header */}` |
| `src/components/Blocks/PremiumDarkTile.tsx:20-24` | `/**\n * Block G — Premium Dark Tile. Reserved for emotionally important moments.\n * Must be inside a SectionShell with tone="navy" or tone="black".\n * Spotlight gradient overlay simulates stadium lighting.\n */` | `/** Block G — Premium dark tile for hero CTAs. Requires SectionShell tone="navy" or "black". */` |
| `src/styles.css:6` | `/* Stadium-light palette, refined. Premium whites, calibrated greens, sun-yellow accents. */` | `/* Stadium-light palette: whites, greens, sun-yellow accents. */` |
| `src/styles.css:171` | `/* Premium gradient text used in display headlines */` | `/* Gradient text for display headlines */` |
| `src/styles.css:251` | `/* Premium chip with soft ring */` | `/* Chip with soft ring */` |

`Configurator.tsx:15` was on the spec's original list but the file was
already deleted by agent 3 — skipped per pre-coordination note.

## (d) ErrorBoundary tidy

`src/ErrorBoundary.tsx`: dropped the `// eslint-disable-next-line
no-console` pragma (no ESLint config exists, so the directive matched
nothing). Adjacent `// Log to console for debugging in browser dev
tools` comment kept, as did the `console.error` call.

## Verification

- `npx tsc -b --noEmit` after each commit: clean (no output).
- `npm run build` after final commit: success in 8.46s. PWA precache and
  service worker generated as usual. No new chunk-size warnings beyond
  the pre-existing index bundle >500 kB warning.
- `git status` post-merge on `main`: clean (only `reports/*` untracked).
- Fast-forward merge to `main` confirmed; `cleanup/8-slop` branch
  deleted.

## Files unchanged (per spec)

- `src/components/Blocks/Configurator.tsx` — deleted by agent 3.
- `src/lib/safe-storage.ts` — file-level docstring kept (load-bearing
  WHY per open question 1).
- `src/data/pastpapers/papers.ts` — `// ────` paper separators kept (TOC
  markers per open question 3).
- `src/components/CoachVoice.tsx` JSDoc on the `CoachVoice` export
  (drives IDE tooltips).
- All UI copy / string literals (product owner territory).
- `src/lib/debrief.ts` HARD RULES JSDoc header (load-bearing).

## Hold-aside

No surprises. No untracked or accidentally-staged files. Original
`reports/1-dry-execution.md` and `reports/5-weak-types-execution.md`
remain untracked as expected.
