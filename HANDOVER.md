# TimBoi's Academy — Project Handover

_Last updated: 2026-05-31 · branch `main` @ `fa770ed` (in sync with origin, deployed)_

A full handover of the AFM Masterclass study site: where it lives, how it ships,
what was done this cycle, and what to watch. For a one-screen version see
[HANDOVER-COMPACT.md](HANDOVER-COMPACT.md).

---

## 1. What this is

ACCA **Advanced Financial Management (AFM)** exam-prep PWA — a football/Spurs
match-day themed study engine: course plan, topic drills, past-paper bank with an
iAssess-style CBE practice shell, spaced-repetition memory lab, AI coach/marker.

- **Live:** https://timboi14masterclass.vercel.app
- **Repo:** https://github.com/timboi14/TimBoi-s-AFM-Masterclass (branch `main`)
- **Stack:** Vite 5 · React 18 · TypeScript · Tailwind 3 · Framer Motion · React
  Router · PWA (Workbox). Added this cycle: **mathjs** (calculator engine).

## 2. Where the code lives

| Location | What it is |
|---|---|
| `~/Documents/timboi14-masterclass/` | **Active working copy** (this repo). Edit here. |
| `~/TimBoi-s-AFM-Masterclass/` | A **separate, older clone** (different git lineage). Source we recovered the Champions League page from. Not edited — do not confuse with the active repo. |
| GitHub `main` | Canonical/backup. Pushed over **SSH** (`git@github.com:…`); the HTTPS remote had no stored creds, so `origin` was switched to SSH. |
| Vercel | Live deployment. Auto-builds on every push to `main`. No CI, no manual deploy step. |

**Deploy flow:** edit → `git add/commit` → `git push origin main` → Vercel auto-builds.
After a deploy, **hard-refresh** the site — the PWA service worker caches aggressively.

## 3. What was done this cycle (newest first)

| Commit | Summary |
|---|---|
| `fa770ed` | **Unlimited spreadsheet rows** — CBE sheet auto-grows (12-row buffer below cursor/content), "+ Add 25 rows" button + row counter, storage accepts any row count, Clear resets to A1. |
| `1d088ec` | `feat(ui): expand academy visual world` — authored outside this session, **approved by owner**, deployed alongside. |
| `c688482` | **CBE popup root-cause fix** — popups portalled to `document.body` (they were trapped in a Framer-Motion transformed wrapper → clipped behind the sticky nav + click-bubbling). z-index raised above nav; spawn tops set below the header. |
| `e2a0fc1` | First pass at 4 ribbon bugs (close propagation, symbol tiles, calc/nav position). |
| `d634ca2` | **iAssess CBE upgrade** — tool ribbon, draggable popups (Scratch Pad, Symbol, **TI-30XS MultiView calculator** w/ mathjs + 2nd-shift + degree trig), highlight (WP + bionic scenario, offset-persisted) & strikethrough, Flag for Review + grid badge, Navigator overlay, extended WP toolbar, Realistic-mode skin. |
| `1daa2c3` | **Two-way merge** with the deployed clone — brought in production improvements the snapshot lacked: derive Playbook/Practice counts from `TBA_STATS`, `Guest ·` identity badge, Course key-date Past/Live/Upcoming pills, `cardDecks`/`cheatSheets` stats. |
| `cbbe112` | **Restored the Champions League tab/page** (recovered verbatim from the clone; it was live but absent from the snapshot). |
| `7a7d4c6` | **Syllabus tab merged into Course** (CapabilityMap section + sub-nav anchor; `/syllabus` → `/course#syllabus`); **mnemonics 10→32**; new **77-term abbreviations cheat sheet** on the Memory page. |

## 4. CBE practice shell — architecture (this cycle's big feature)

Lives under `src/components/CBEWorkspace/` + `src/lib/cbe-*`. Mounted from the
Practice (CBE) tab in [`src/components/PastPapers/PaperDetail.tsx`](src/components/PastPapers/PaperDetail.tsx).

- `cbe-context.tsx` — pane-level provider: popup open-set, z-index bring-to-front
  (base 4000, above the `z-[60]` nav), last-focused editor (for symbol insert),
  highlight colour, flag state, `applyHighlight`/`applyStrikethrough`.
- `DraggablePopup.tsx` — shared chrome; **portals to `document.body`**; pointer-drag,
  viewport clamp, optional resize. `spawnTop` prop positions below the header.
- `CalculatorPopup.tsx` + `src/lib/cbe-calc.ts` — TI-30XS keypad, 2nd-shift,
  mathjs engine (degree trig, log10/ln, auto-close parens). Verified: 25×4=100,
  sin30=0.5, reset→MEMORY CLEARED.
- `ScratchPadPopup.tsx`, `SymbolPopup.tsx`, `Navigator.tsx`, `CBEToolRibbon.tsx`,
  `CBEPopups.tsx`, `CBEFooter.tsx`.
- `src/lib/cbe-highlight.ts` — Range-offset highlight persistence for the **read-only
  bionic scenario panel** (never rewrites innerHTML — bionic `<b>` runs preserved).
- `src/lib/cbe-tools-storage.ts` — localStorage buckets:
  `tba_cbe_<guestId>_<paperId>_highlights` / `_scratchpad`, `tba_cbe_<paperId>_flagged`.
- `CBEWordProcessor.tsx` (extended toolbar) + `CBESpreadsheet.tsx` (unlimited rows).

## 5. Known caveats / follow-ups

- **CBE not fully click-tested in a browser** — built, type-checked, calculator
  engine verified, routes boot 200; but the interactive 14-point checklist
  (drag feel, highlight edge cases, etc.) should be spot-checked live.
- **Symbol → spreadsheet cell** is best-effort (the sheet commits on blur, so the
  cell input unmounts); symbol insertion reliably targets the **word processor**.
- **Navigator lists papers, not sub-parts** — answers are stored per-paper, not per (a)/(b)/(c).
- **Realistic mode** font falls back to **Arial** (Proxima Nova isn't bundled).
- **PastPapers chunk ≈ 725 KB** (mathjs + calculator) but lazy-loaded.
- **Two divergent repos** exist (active `~/Documents` copy + the `~/TimBoi-s-AFM-Masterclass`
  clone, separate git histories). Worth consolidating to one eventually.
- Pre-existing debt (from `handoff.md`): **no CI, no committed ESLint config, no test gate.**

## 6. Don'ts (load-bearing — carried from `_MAC-SETUP.md` / `handoff.md`)

- **Don't** change `tba_*` localStorage shapes without migration logic (real study
  progress lives in the browser; use `src/lib/safe-storage.ts`).
- **Don't** touch the bionic rendering (`src/utils/bionic.ts`) — highlights use Range
  offsets, never innerHTML replacement.
- **Don't** reintroduce billing / tiers / paywalls / Stripe — permanent ban (personal-use app).
- **Don't** merge the two `Paper` interfaces (`src/data/papers/` vs `src/data/pastpapers/`).
- **Don't** push the old Workbox config (`skipWaiting + clientsClaim + NetworkFirst nav` in
  `vite.config.ts` is load-bearing).
- **Don't** generate a literal "Tottenham Hotspur" badge/wordmark (trademark).

## 7. Run it

```bash
cd ~/Documents/timboi14-masterclass
npm install          # reinstall deps (now includes mathjs)
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build  (the deploy gate)
```
