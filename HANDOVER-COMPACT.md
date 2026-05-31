# TimBoi's Academy — Compact Handover

_2026-05-31 · `main` @ `fa770ed` · in sync with origin · deployed._
Full version: [HANDOVER.md](HANDOVER.md)

**App:** ACCA AFM exam-prep PWA (football-themed). **Live:** https://timboi14masterclass.vercel.app
· **Repo:** github.com/timboi14/TimBoi-s-AFM-Masterclass (`main`)
· **Stack:** Vite + React 18 + TS + Tailwind 3 + Framer Motion + Router + PWA (+ mathjs).

**Code:** `~/Documents/timboi14-masterclass` (active). Separate older clone at
`~/TimBoi-s-AFM-Masterclass` (Champions League recovery source — don't edit).
**Deploy:** push to `main` (SSH remote) → Vercel auto-builds. Hard-refresh after (PWA cache).

**Done this cycle:**
- Spreadsheet **rows now unlimited** (auto-grow + "Add 25 rows"). `fa770ed`
- **iAssess CBE shell**: tool ribbon, draggable popups, **TI-30XS calculator** (mathjs),
  highlight/strikethrough, Flag+grid badge, Navigator, extended WP toolbar, Realistic mode. `d634ca2`
  → popup bugs fixed by **portalling to `document.body`** (escapes transformed wrapper). `c688482`
- **Champions League tab restored** (was live, missing from snapshot). `cbbe112`
- **Syllabus merged into Course**; **mnemonics 10→32**; **77-term abbreviations cheat sheet**. `7a7d4c6`
- **Two-way merge** w/ deployed clone: TBA_STATS-derived counts, `Guest ·` badge,
  Course Past/Live/Upcoming pills. `1daa2c3`
- `1d088ec` "expand academy visual world" = owner-authored, approved, deployed.

**Watch:**
- CBE not fully browser click-tested (built + engine-verified) — spot-check the live shell.
- Symbol insert targets the word processor reliably (sheet cells best-effort).
- Realistic-mode font falls back to Arial; PastPapers chunk ~725 KB (lazy).
- Two divergent repo lineages exist — consolidate someday. No CI / no test gate yet.

**Don'ts:** no billing/tiers/paywalls (banned); don't break `tba_*` localStorage shapes
(use `safe-storage`); don't touch bionic rendering; don't merge the two `Paper` interfaces;
don't revert the Workbox config; no literal Spurs trademark.

**Run:** `npm install` → `npm run dev` (5173) → `npm run build` (deploy gate).
