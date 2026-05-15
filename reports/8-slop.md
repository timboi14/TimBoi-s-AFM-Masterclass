# 8 — Slop, stubs, LARP, comment hygiene

## Summary

Codebase comment hygiene is unusually clean for a Vite/React app of this size. No `TODO/FIXME/HACK/XXX` markers, no "Changed from / Previously" decay comments, no commented-out code blocks, no stub functions or LARP validation. The dominant slop pattern is decorative banner comments in `src/pages/*.tsx` (~25 occurrences using long `─` rules) and a smaller set of section-header banners in `src/data/*.ts` (~110 occurrences but those are content-organising and largely earn their space). One `console.error` (ErrorBoundary) earns its place. A handful of file-level JSDoc headers lean self-congratulatory ("**HARD RULES**", "premium feel", "Reserved for emotionally important moments") and could be tightened. One single-line wrapper barrel exists. UI copy contains the most AI-flavoured language but is product-owner territory.

## Method

- Grepped for `TODO|FIXME|HACK|XXX`, `console.(log|warn|error|info|debug)`, `^\s*//`, `/\*`, `^\s*\*\s`, banner runs `[─=\-]{5,}`, slop adjectives `(robust|elegant|comprehensive|powerful|beautifully|seamless|leveraging|cutting-edge|state-of-the-art|world-class)`, decay markers `(Changed from|Previously|Old version|Used to|Now uses|Migration)`, stub patterns `(not implemented|throw new Error|placeholder|stub)`.
- Read every file with comment density above ~5 lines (Layout, Practice, Revision, Memory, Debrief, StudyGuide, Home, CoachVoice, Onboarding, NameOverlay, ErrorBoundary, App, main, all Blocks/*, all lib/*).
- Spot-checked data/ comment density (banner runs are content separators between paper entries; left as live).

## Findings

### Decorative comment banners (DELETE)

These add no information beyond the function signature that immediately follows. Suggest removing the banner block; keep the function name as the marker.

- `src/pages/Practice.tsx:24-26, 107-109, 443-445, 788-790, 872-874, 964-966` — six `/* ─── N) SECTION ─── */` blocks. Replace each with a single-line comment or delete; the numbered headers (1, 2, 3, 4, 5, 6) restate what `function ExamSimulator`, `function SpreadsheetWS`, etc. already say.
- `src/pages/Revision.tsx:37-39, 129-131, 243-245, 314-316, 545-547, 607-609, 698` — same pattern. `698:/* ─── shared bits ───────────────────────────── */` is a section marker for a `Navigate` helper.
- `src/pages/Debrief.tsx:25-27, 161-163, 420-422, 490` — same. `490:/* ─── shared ─── */`.
- `src/pages/Memory.tsx:84-86, 178-180` — same.
- `src/pages/StudyGuide.tsx:124-126, 248-250, 392-394` — same.
- `src/components/primitives.tsx:5, 19, 33, 58, 77` — `/* Match-day stagger container ------ */` style banners. The dashes are decorative; the label itself is fine if kept as `// Match-day stagger container`.
- `src/components/CoachVoice.tsx:70, 74, 92, 103, 135, 166, 184, 198, 470` — `/* Persist */`, `/* Auto-scroll on changes */`, `/* ── Render ─── */`, `/* ─── bubble ─── */`. The labelling is fine; the long `──` runs are slop. Tighten.
- `src/pages/Course.tsx:285` — `/* ─── components ─── */` banner.
- `src/lib/attempts.ts:57-60` — `/* ── Topic mastery ──── For each topic id...*/`. The comment body has signal; the banner rule does not.
- `src/lib/voice.ts:90, 155` — `/* ─── voice catalogue + picker ─── */` etc.
- `src/lib/debrief.ts:86, 98, 111, 132, 145, 157, 168, 182, 191` — numbered signal blocks `/* ── 1) Recommendation upfront ─── */`. The numbering helps readability of `signals.push({...})` blocks; consider keeping the number, dropping the rule.

### AI-slop phrasings to replace (REPLACE — tighten)

- `src/components/Layout.tsx:61` — `{/* Sticky glass header — premium feel */}` → `{/* Sticky glass header */}`. "premium feel" is filler.
- `src/components/Blocks/PremiumDarkTile.tsx:21-23` — `/** Block G — Premium Dark Tile. Reserved for emotionally important moments. ... Spotlight gradient overlay simulates stadium lighting. */`. Replace with: `/** Block G — Premium dark tile for hero CTAs. Requires SectionShell tone="navy" or "black". */`. "emotionally important moments" and "simulates stadium lighting" are marketing.
- `src/styles.css:6` — `/* Stadium-light palette, refined. Premium whites, calibrated greens, sun-yellow accents. */` → `/* Stadium-light palette: whites, greens, sun-yellow accents. */`.
- `src/styles.css:171` — `/* Premium gradient text used in display headlines */` → `/* Gradient text for display headlines */`.
- `src/styles.css:251` — `/* Premium chip with soft ring */` → `/* Chip with soft ring */`.
- `src/lib/debrief.ts:4-9` — `* HARD RULES (enforced here, not just in UI):` This earns its space (it explains a design constraint that's actively enforced by `if (!s.ownWorkConfirmed) throw`). KEEP.
- `src/components/Blocks/Configurator.tsx:15` — `/** Two-tone Apple-style heading: first part navy/white, continuation muted. */` → `/** Two-tone heading: primary in navy/white, continuation muted. */`. Drop "Apple-style".
- `src/components/CoachVoice.tsx:45-50` — file-level JSDoc reads like a feature blurb. Acceptable for a top-level component; lightly tighten if touching the file but not urgent.

### Restate-the-code comments (DELETE)

- `src/main.tsx:17` — `// Clear the static loading splash so React owns the node`. The line below is `rootEl.innerHTML = ''`. Comment slightly restates code, but the *why* (loading splash) is non-obvious so this is borderline KEEP. Lean KEEP.
- `src/NameOverlay.tsx:11` — `// Make sure body cannot scroll behind the modal on first visit`. Useful WHY. KEEP.
- `src/lib/sheet-engine.ts:14` — `// 0 -> A, 25 -> Z, 26 -> AA`. Useful (clarifies base-26 logic). KEEP.
- `src/lib/sheet-engine.ts:188, 195, 200, 214, 236` — parser progress markers (`// function name or cell ref`). Useful for tokenisation logic. KEEP.
- `src/lib/sheet-engine.ts:316-440` — every function entry has a one-line `// PV(rate, nper, ...)` signature comment. These ARE the docs for an internal function library. KEEP.
- `src/pages/Practice.tsx:462` — `// Mode + resizable dock height`. Marginal; the two `useState` lines below are self-explanatory but the cluster benefits from a header. KEEP.
- `src/components/CoachVoice.tsx:80` — `// Auto-pick a default the first time`. Useful WHY (explains the `if (!prefs.voiceName)` gate). KEEP.
- `src/components/CoachVoice.tsx:159` — `// crude end detection: poll until synthesis is done`. KEEP (flags it's a known compromise).
- `src/App.tsx:8` — `// Helper to lazy-load a page with a named export.` KEEP.
- `src/App.tsx:12-13` — `// Home stays in the main bundle (it's the landing page; lazy here would just delay TTI). // Every other route ships in its own chunk.` KEEP (load-strategy rationale).

### Stubs and LARP

None found. No functions throw "not implemented", no validators return `true` unconditionally, no analytics no-ops. Coordinate with reports/3-unused.md for the three already-flagged unused Block components (E/F/H).

### Console statements

- `src/ErrorBoundary.tsx:13-15` — `// Log to console for debugging in browser dev tools` + `// eslint-disable-next-line no-console` + `console.error('TBA crash:', error, info);`. Earns its place (this is the documented operational logging point for crashes). KEEP. The two preceding comments are redundant since the disable directive is wasted (no ESLint config exists). Suggest dropping just the `eslint-disable-next-line` line.

No other `console.*` calls anywhere in `src/`.

### Empty files / single-export wrappers

- `src/components/PastPapers/index.tsx` — one-line barrel: `export { PastPapersView, type PastPapersViewHandle } from './PastPapersView';`. Standard barrel pattern; tolerable, but if simplifying coordinate with reports/1-dry.md before removing imports could be retargeted to `./PastPapersView` directly. No action recommended.

No empty files, no `export {}` placeholders.

### TODO / FIXME / HACK / XXX / NOTE inventory

None. Zero markers across `src/`.

### UI copy slop (product call, NOT cleanup)

These are user-facing strings, not comments. Flagging only — do not change without product owner sign-off.

- `src/pages/Home.tsx:65-69` `PASS_QUOTES` — fabricated testimonials with score percentages. Editorial decision.
- `src/components/Layout.tsx:80` — `"ACCA AFM Pass Engine · Match-day energy"`.
- `src/pages/Home.tsx:71-76` `STADIUM_STATS` labels — `"Practice exams"`, `"Theory Q&A"`, etc. Fine.
- `src/pages/Practice.tsx:48-51` — the index hero copy uses "real spreadsheet engine", "full-mark sample answers". These are product claims; verify they hold then leave.
- `src/components/Layout.tsx:151-158` — footer copy `TECHNIQUE BEATS KNOWLEDGE ON EXAM DAY.` and `Built for the June 2026 sitting. Examiner-style technique, Spurs energy, zero filler.` Editorial.
- `src/pages/Practice.tsx:1077` — `Coach AI runs locally with an AFM expert knowledge base.` (Microcopy in CoachDrawer.)
- The em dashes appearing in user-visible copy (Home stat sub-labels, Course hero, Course buttons) are inside string literals, not comments. Outside scope.

## Coordination flags

- **vs reports/3-unused.md** — sibling agent already proposes deleting `ThreeUpCardRow.tsx`, `TabularList.tsx`, `Configurator.tsx`. Whichever lands first, the JSDoc cleanup proposals above on those three files become moot. No conflict.
- **vs reports/4-circular.md** — `src/lib/site-stats.ts:15` still imports `COMMON_LOSERS` from `@/pages/WarRoom`. The comment-cleanup recommendations don't touch this; sibling owns the move.
- **vs reports/5-weak-types.md** — none of the comments flagged here are about narrowing types. The "JSDoc on exported APIs" comments in Blocks/* are intentionally untouched since they power IDE tooltips.
- **vs reports/6-try-catch.md** — `src/lib/coach-ai.ts:431-432 // fall through to local KB` and `:435 // Simulate "thinking" briefly so the UX is alive` are inside try/catch blocks that the sibling agent may rework. Comments are useful and should survive any refactor.
- **vs reports/7-legacy.md** — Revision module comments are decorative banners (see Revision.tsx list above). If sibling migrates the module, decorative banners disappear naturally; if not, they're still worth removing. No conflict.

## Open questions

1. `src/lib/safe-storage.ts:4-9` is the only file-level comment that justifies its own length (explains why hand-rolled vs zod). It's verbose but the WHY is load-bearing for a future contributor. Confirm KEEP-as-is.
2. `src/lib/debrief.ts` numbered signal banners (`/* ── 1) Recommendation upfront ── */` through `/* ── 8) Length ── */`) are decorative but they line up with the eight `signals.push(...)` blocks. Reader value is real. Recommend tightening the dashes only, keeping the numbering. Confirm.
3. Data files in `src/data/pastpapers/papers.ts` use `// ──────` banners between every paper entry (~17 occurrences). They function as TOC markers for a 1300-line file. KEEP — they have utility, but a reader could consider moving each paper to its own file if reports/1-dry.md isn't already planning that.
