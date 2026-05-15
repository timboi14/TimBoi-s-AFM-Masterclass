# Subagent 4: Circular dependencies — discovery report

## Summary

**1 cycle found.** 0 type-only, **1 real cycle**, 0 spurious-via-barrel.

The suspects called out in the brief (`Blocks/index.ts`, `PastPapers/index.tsx`, `lib/store.ts` ↔ `lib/safe-storage.ts`, `Layout.tsx` ↔ `Home.tsx`) are all clean. The only cycle is `lib/site-stats.ts` ↔ `pages/WarRoom.tsx` and is straightforward to break with a one-line data extraction.

## Method

1. Ran `npx madge --circular --extensions ts,tsx src/`. First pass returned `No circular dependency found!` but reported **60 skipped files** because madge could not resolve the `@/*` path alias defined in `tsconfig.json` (`paths: { "@/*": ["src/*"] }`). With ~70 % of imports unresolved the result was meaningless.
2. Re-ran with TS path resolution: `npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/`. This processed all 86 files with **zero skipped** and surfaced one cycle.
3. Inspected the cycle's two files manually to classify it (TYPE-ONLY / REAL / SPURIOUS) and identify the minimum fix.
4. Spot-checked the four suspects in the brief by grepping for self-barrel imports (`from './index'`, `from '.'`) and reverse imports between the named pairs. All clean.
5. Skipped `--image` SVG generation (graphviz not assumed available; the cycle list is sufficient).

## Cycles

### Cycle 1 — `site-stats.ts` ↔ `WarRoom.tsx`

- **Files:**
  - `src/lib/site-stats.ts:15` → `import { COMMON_LOSERS } from '@/pages/WarRoom';`
    - Used at line 38: `warRoomTraps: COMMON_LOSERS.length` inside the exported `siteStats` object.
  - `src/pages/WarRoom.tsx:4` → `import { siteStats } from '@/lib/site-stats';`
    - Used at lines 161 and 324 to render `{siteStats.warRoomTraps}`.
- **Classification:** **REAL.** Both sides consume runtime values — `COMMON_LOSERS` is a `const` array literal, `siteStats` is a computed object with `.length` reductions. Switching one direction to `import type` would not work.
- **Why it's wrong architecturally:** `site-stats.ts` is positioned as the "single source of truth for site-wide counters" and pulls every other counter from `src/data/*` modules. `COMMON_LOSERS` is the only data array still living inside a page component, which forces the lib layer to import upward into the pages layer.
- **Proposed fix:** Move `COMMON_LOSERS` (and its row type `{ topic: string; loss: string; fix: string }`) out of `src/pages/WarRoom.tsx` into a new data module — `src/data/war-room.ts` — alongside the other counter sources. Both files then import it from `@/data/war-room`, and the upward `lib → pages` edge disappears.
  - `src/lib/site-stats.ts` line 15 becomes `import { COMMON_LOSERS } from '@/data/war-room';`
  - `src/pages/WarRoom.tsx` adds `import { COMMON_LOSERS } from '@/data/war-room';` and drops the local `export const COMMON_LOSERS = [...]` definition (currently lines 90–~325 region; only the array literal moves, not the JSX that consumes it).
  - No other consumers exist — `grep COMMON_LOSERS src/` returns only `WarRoom.tsx` and `site-stats.ts`.
- **Files touched by the fix:** 3 (1 new data module, 1 import line change in `site-stats.ts`, 1 export-removal + import-add in `WarRoom.tsx`).
- **Estimated effort:** **trivial.** ~10 minutes including a local typecheck.

> The brief says "Do NOT propose creating new files purely to satisfy madge if a rename of an existing file would do." Creating `src/data/war-room.ts` is justified here on its own architectural merit (consistency with `src/data/practice.ts`, `src/data/theory.ts`, `src/data/pitfalls.ts`, etc., which are already the pattern that `site-stats` consumes). The alternative — inverting the dependency by inlining `siteStats.warRoomTraps` as a literal in `WarRoom.tsx` — would re-introduce exactly the count-drift problem the file's header comment warns against. No file rename is available because no existing data module owns "war-room mistakes."

## Madge raw output

First pass (alias unresolved — misleading clean result):

```
$ npx madge --circular --extensions ts,tsx src/
- Finding files
Processed 86 files (2.3s) (60 warnings)

✔ No circular dependency found!
```

With `--warning` flag, the 60 skipped files were every `@/...` import (e.g. `@/components/Layout`, `@/lib/store`, `@/data/practice`, etc.). Result was not trustworthy.

Second pass (alias resolved via tsconfig — authoritative):

```
$ npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/
- Finding files
Processed 86 files (2.6s)

✖ Found 1 circular dependency!

1) lib/site-stats.ts > pages/WarRoom.tsx
```

86 files processed, 0 skipped, 1 cycle.

## Suspects from the brief — verification

- **`src/components/Blocks/`** (`index.ts` barrel + `tone.tsx`, `TonePill.tsx`, `TwoUp.tsx`, etc.) — Grep for `from './index'` or `from '.'` inside the directory: **no matches.** All blocks import `useTone` / `Tone` directly from `./tone`. Clean.
- **`src/components/PastPapers/`** (`index.tsx` barrel + `PaperCard.tsx`, `PaperDetail.tsx`, `PastPapersView.tsx`, `shared/`, `tabs/`) — Same grep: **no matches.** Clean.
- **`src/lib/store.ts` ↔ `src/lib/safe-storage.ts`** — Grep for `from '@/lib/store'` inside `safe-storage.ts`: **no matches.** One-way dependency only. Clean.
- **`src/components/Layout.tsx` ↔ `src/pages/Home.tsx`** — Grep for `from '@/components/Layout'` inside `Home.tsx`: **no matches.** `Home` is rendered via `<Outlet/>`, no upward import. Clean.

## Coordination flags

- **Subagent 2 (type relocations):** No overlap. The single cycle requires moving a runtime data constant, not a type. If subagent 2 is touching `site-stats.ts` for its `SiteStats` type export, no conflict — the type definition stays put.
- **Subagent 3 (file deletions):** Possible overlap. If subagent 3 marks `src/lib/site-stats.ts` as dead code (it is consumed by Home, WarRoom, and a few hub pages — likely live, but worth confirming), the cycle dissolves automatically and this fix becomes moot. Likewise if `WarRoom.tsx` itself is on a deletion list (unlikely — it's a routed page). Recommend: subagent 3 reviews its kill-list before any fixer agent touches this cycle.
- **Other subagents:** Anyone touching `src/pages/WarRoom.tsx` should be aware that the `COMMON_LOSERS` array (lines ~90 onward) is destined for relocation into `src/data/war-room.ts`.

## Open questions

- None blocking. The fix is mechanical and isolated.
