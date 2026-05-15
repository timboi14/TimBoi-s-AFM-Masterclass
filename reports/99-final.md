# Phase C — Final report

**Date:** 2026-05-15
**Branch:** `main`
**Baseline commit:** `7941409` ("Spurs visuals: per-route banner art")
**Final commit:** `74eecea` ("cleanup(3b-knip): drop residual unused re-exports")
**Commits added:** 26 cleanup commits (one report-baseline + 25 code).

## Final gate

| Gate | Result |
|---|---|
| `npm install --no-audit --no-fund` | up to date in 2s |
| `npx tsc -b --noEmit --force` | clean (exit 0) |
| `npm run build` | built in 7.37s |
| `npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/` | 86 files processed, **zero cycles** |
| `npx knip --no-progress` | clean (no unused exports) |
| Tests | n/a (no suite in this repo) |
| ESLint | n/a (no config in this repo) |

## Baseline vs final deltas

| Metric | Baseline | Final | Delta |
|---|---:|---:|---:|
| `.ts` + `.tsx` files under `src/` | 85 | 85 | 0 |
| Total lines in `src/` | 18,026 | 17,545 | **-481 (-2.7%)** |
| Main bundle (raw) | 669.7 KiB | 670.51 KiB | +0.81 KiB |
| Main bundle (gzip) | ~228 KiB | 224.31 KiB | **-3.69 KiB (-1.6%)** |
| PWA precache total | 1375.51 KiB | 1372.89 KiB | -2.62 KiB |
| Production deps | 13 | 12 | -1 (`sonner`) |
| Dev deps | 10 | 10 | 0 |
| TypeScript errors | 0 | 0 | 0 |
| Madge cycles | 1 | 0 | -1 |
| Knip unused exports | 22 + 4 files + 1 dep + 4 type re-exports | 0 | clean |
| Explicit `any` sites | 31 | 0 unjustified | -31 (5 justified TonePill narrowings remain) |
| Justified `@ts-ignore` / `@ts-expect-error` | 0 / 0 | 0 / 0 | unchanged |

## Per-agent summary

- **Subagent 3 (unused)** — 5 commits. Deleted `scripts/extract-spec-blocks.mjs`, 3 unused Blocks (E/F/H), `sonner` dep, `bionicHTML_safe`, plus 5 fully-dead helpers (`fadeIn`, `PRACTICE_BY_MODULE`, `SH_SUPPORT`, `PITFALL_TAGS`, `updateAttempt`, `deleteAttempt`). Dropped `export` keyword on ~15 internal-only symbols. Report: [3-unused.md](3-unused.md).
- **Subagent 4 (circular)** — 1 commit. Extracted `COMMON_LOSERS` to `src/data/war-room.ts`, breaking the `lib -> pages` cycle. Madge now clean. Report: [4-circular.md](4-circular.md).
- **Subagent 2 (types)** — 1 commit. Added `export type AccentTone = 'primary' | 'accent' | 'danger'` to `primitives.tsx` and reused in `Pill`, `KpiTile`, `ChecklistGroup`. The two `Paper` interfaces left intentionally separate per discovery. Report: [2-types.md](2-types.md).
- **Subagent 5 (weak types)** — 8 commits. Added `src/lib/guards.ts` (`errorMessage`, `readEnum`) and `src/vite-env.d.ts`. Typed Web Speech, sheet-engine parser (`CellValue`/`ExprValue`), and every page-level `as any`. All `catch (e: any)` migrated to `catch (e)` + `errorMessage` narrowing. Report: [5-weak-types.md](5-weak-types.md) + [5-weak-types-execution.md](5-weak-types-execution.md).
- **Subagent 1 (DRY)** — 4 commits. Extracted `Field` to primitives, inlined `Tile`, added `safeReadJson`/`safeWriteJson` helpers and migrated ~9 storage call sites, extracted file-local `TbaTopicChips` in `Course.tsx`. Group 4 (hero migration) deferred per triage. Report: [1-dry.md](1-dry.md) + [1-dry-execution.md](1-dry-execution.md).
- **Subagent 6 (defensive)** — 2 commits. Tightened `askCoach` so a misconfigured remote URL surfaces in console rather than rendering an empty bubble. Removed redundant throw-then-catch in the Practice Calculator. Report: [6-try-catch.md](6-try-catch.md).
- **Subagent 8 (slop)** — 4 commits. Removed 23 decorative `/* ─── N) SECTION ─── */` banners across pages, tightened 23 dash-banner comments in shared modules, replaced 5 marketing-flavoured JSDoc/comment phrasings, dropped wasted `eslint-disable` directive. Report: [8-slop.md](8-slop.md) + [8-slop-execution.md](8-slop-execution.md).
- **3b knip residual** — 1 follow-up commit. Dropped 1 unused export (`bionic`) and 4 type re-exports in Blocks barrel after final knip scan.

## Deferred items (rolled up)

These were intentionally out of scope; the triage doc records the reasoning.

1. **Revision module deletion** (subagent 7). Migrate-first per discovery. Requires product calls on the attempts log, the Home daily-quest tile's deep-link target, and TBA-original synthetic papers. Track separately.
2. **Hero migration to `CenteredHero`** (subagent 1 Group 4). Visual change on 5 pages; design-call, not a DRY-call.
3. **Optional `Paper` -> `RevisionPaper` rename** (subagent 2). Cosmetic; revisit when Revision module is migrated.
4. **PNG asset optimisation** (`public/spurs/*` ~63 MB). Separate sharp/WebP pass.
5. **`coach-ai.ts` remote-fail UX surface** (subagent 6 follow-up). Currently logged to console; could surface a toast or a small "Coach offline" badge in the UI. Defer until product opinion.
6. **No test suite, no ESLint, no CI.** All flagged for follow-up. None blocking.

## Verification — live site

The Vercel deployment from this `main` is the next push. Confirmed locally that:
- `dist/index.html` produces no console errors under `npm run preview`.
- All 26 lazy-loaded route chunks are emitted.
- PWA precache lists 53 entries including the new `vite-env.d.ts` (build-time only, not runtime).

Manual UI verification of the live preview (Vercel auto-deploys from `main`) is the operator's call. The chrome-devtools MCP path is blocked by Vercel's bot challenge per the handoff; visual inspection in a real browser is required.

## Sign-off

Build green, type-check clean, cycles zero, knip clean. No tests to run, no lint to run. 25 commits stage the work in clear, atomic, agent-bounded units. Each individual commit's `tsc -b --noEmit` was clean at the time of commit; the final state is clean against both `tsc` and `vite build`.

Cleanup pass complete.
