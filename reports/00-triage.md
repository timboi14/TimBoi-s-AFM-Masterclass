# Triage — Phase A complete, Phase B plan

**Date:** 2026-05-15
**Baseline:** `7941409` on `main` (clean working tree, `reports/` + `handoff.md` untracked).
**Phase A status:** all 8 discovery reports written.

## Conflict map (files touched by multiple agents)

| File | Agents | Resolution |
|---|---|---|
| `src/components/Blocks/index.ts` | 3 (drop dead re-exports), 8 (no-op) | 3 owns. |
| `src/components/Blocks/{ThreeUpCardRow,TabularList,Configurator}.tsx` | 3 (delete files), 8 (JSDoc tighten) | 3 deletes — 8's JSDoc proposals on these files become moot. |
| `src/data/papers/schema.ts` | 2 (LEAVE per Collision 1), 3 (drop `export` on internal-only types), 7 (Revision schema is migrate-first) | 7 defers (see Deferred items). 3 owns the export-keyword cleanup. 2 takes no action on this file. |
| `src/data/pastpapers/schema.ts` | 3 (drop unnecessary `export`) | 3 owns. |
| `src/lib/safe-storage.ts` | 1 (add `safeJsonRead`/`safeJsonWrite`), 6 (same — defers) | 1 owns. |
| `src/pages/Debrief.tsx` | 1 (`Tile` inline + `Field` extract), 5 (`catch unknown`), 6 (same — defers), 8 (banner removal) | 1 owns the structural edits; 5 owns the catch; 8 owns banner removal. Apply in that order in separate commits to avoid line-number drift. |
| `src/pages/Practice.tsx` | 5 (9 `any` sites), 6 (Calculator double-handle simplify), 8 (banner removal) | 5 owns catches + casts. 6 owns the Calculator rewrite (small, isolated). 8 owns banners. |
| `src/pages/WarRoom.tsx` | 4 (extract `COMMON_LOSERS`), 8 (banner removal) | 4 first (structural), 8 last (cosmetic). |
| `src/lib/site-stats.ts` | 4 (re-point import) | 4 owns. |
| `src/components/primitives.tsx` | 5 (`ease` `as any` → `as const`), 2 (add `AccentTone` export), 8 (banner cleanup) | 2 owns `AccentTone`. 5 owns the `as any` fix. 8 owns banners. |
| `src/lib/voice.ts` | 5 (Web Speech typing), 6 (catch narrow — defers), 8 (banner) | 5 owns types + catch (overlap pre-resolved). 8 owns banner. |
| `src/lib/sheet-engine.ts` | 5 (`CellValue`/`ExprValue`), 6 (catch narrow — defers), 3 (drop internal `export`) | 3 owns export-keyword cleanup. 5 owns types + catch. |
| `src/pages/Home.tsx` | 1 (storage helper migration), 7 (daily-quest tile depends on legacy `PAPERS`) | 7 defers (see Deferred items). 1 owns. |
| `src/pages/Revision.tsx` | 7 (migrate-first, do not delete), 5 (Year/type `as any`), 8 (banners), 1 (storage helpers) | 7 keeps file. 5 + 8 + 1 may still edit it. |
| `src/lib/coach-ai.ts` | 5 (`import.meta.env` typing), 6 (silent remote-fail rewrite), 7 (VITE flag is intentional) | 5 owns typing. 6 owns rewrite. 7 takes no action. |

## Deferred items (out of scope this pass)

- **Revision module deletion (subagent 7).** Migrate-first per the discovery report — requires product calls on attempts log, daily-quest re-pointing, and TBA-original synthetic papers. Out of scope here.
- **Hero migration to `CenteredHero` (subagent 1, Group 4).** Visually changes 5 pages (`Pitfalls`, `WarRoom`, `Examiner`, `Debrief`, possibly `Memory`, `ExamSkills`). Defer — design-call, not a DRY-call. Out of scope here.
- **Legacy `Pill` deprecation vs `TonePill` (subagent 2, Collision 2).** Acknowledged as parallel-by-design; revisit when one is decisively retired.
- **`coach-ai.ts` remote-fail UX (subagent 6 rewrite #1).** Apply tightened version (throw on non-200 + warn) — keep semantic of degrading to local KB.
- **Optional rename `Paper` → `RevisionPaper` (subagent 2).** Cosmetic only. Defer to file-rename moment when Revision module is migrated.
- **PNG asset optimization (`public/spurs/*` 63 MB).** Not a cleanup task; separate sharp/WebP pass.

## Per-agent action list (after deferrals)

### Agent 3 — Dead code

- Delete `scripts/extract-spec-blocks.mjs` (and empty `scripts/` dir).
- Delete `src/components/Blocks/ThreeUpCardRow.tsx`, `src/components/Blocks/TabularList.tsx`, `src/components/Blocks/Configurator.tsx`.
- Update `src/components/Blocks/index.ts` to remove lines 8-10 (and their type re-exports).
- Remove `sonner` from `package.json` dependencies + run `npm install` to regenerate lockfile.
- Delete export-only `bionicHTML_safe` (4-LOC function body).
- Drop `export` keyword on internal-only symbols listed in 3-unused.md (~22 sites across `src/data/papers/schema.ts`, `src/data/pastpapers/schema.ts`, `src/data/practice.ts`, `src/data/topics.ts`, `src/data/shplus.ts`, `src/data/pitfalls.ts`, `src/data/sample-answers.ts`, `src/lib/store.ts`, `src/lib/site-stats.ts`, `src/lib/safe-storage.ts`, `src/lib/attempts.ts`, `src/lib/sheet-engine.ts`, `src/utils/bionic.ts`, `src/components/primitives.tsx`, `src/components/ui/button.tsx`, `src/components/TabArt.tsx`, `src/components/Blocks/index.ts`).

### Agent 7 — Legacy paths

- Confirm 3 already deleted `scripts/extract-spec-blocks.mjs` — no separate action needed.
- Revision module: **no action this pass** (migrate-first deferred).
- No other legacy candidates.

### Agent 4 — Circular dependencies

- Create `src/data/war-room.ts` with `COMMON_LOSERS` and its row type, exported.
- `src/pages/WarRoom.tsx`: replace local `export const COMMON_LOSERS` with `import { COMMON_LOSERS } from '@/data/war-room';`.
- `src/lib/site-stats.ts`: change `from '@/pages/WarRoom'` to `from '@/data/war-room'`.
- Verify `npx madge --circular --extensions ts,tsx --ts-config tsconfig.json src/` reports zero.

### Agent 2 — Type consolidation

- Add `export type AccentTone = 'primary' | 'accent' | 'danger'` to `src/components/primitives.tsx`.
- Re-use in `Pill.variant` (`'outline' | AccentTone`), `Course.tsx::KpiTile.tone`, `WarRoom.tsx::ChecklistGroup.tone`.
- No other shape changes. Defer `Paper` rename.

### Agent 5 — Weak types

- Apply the 34 REPLACEABLE sites from 5-weak-types.md verbatim.
- Add `src/lib/guards.ts` with `errorMessage` and `readEnum` helpers.
- Add `src/vite-env.d.ts` with `interface ImportMetaEnv { readonly VITE_COACH_API_URL?: string; }`.
- Apply the GENUINELY UNKNOWN narrowings via the new guards.
- Leave the 5 JUSTIFIED sites untouched.

### Agent 1 — DRY

- Group 5: extract `Field` to `src/components/primitives.tsx`; update `Debrief.tsx`, `StudyGuide.tsx`.
- Group 6: inline `Tile` at its single call site in `Debrief.tsx`.
- Group 7: add `safeReadJson<T>`/`safeWriteJson` to `src/lib/safe-storage.ts`; migrate ~9 call sites.
- Group 8: extract file-local `TbaTopicChips` in `Course.tsx`.
- Skip Group 4 (deferred, see above).

### Agent 6 — Defensive code

- Apply rewrite #1 to `src/lib/coach-ai.ts:421-433` (non-200 → throw, narrow data fields, `console.warn` then degrade).
- Apply rewrite #2 to `src/pages/Practice.tsx:798-806` (Calculator: drop the throw-then-catch, branch on `out.ok`).
- All `catch (e: any)` → `catch (e)` narrowing: defer to 5 (already in 5's action list).
- Apply rewrite #5 (`Theory.tsx` and `Practice.tsx` `as any` → `readEnum` guard) — coordinated with 5.

### Agent 8 — Slop

- Remove decorative `/* ─── N) SECTION ─── */` banner blocks (~25 sites listed in 8-slop.md).
- Tighten 5 marketing-flavoured JSDoc headers (`Layout.tsx:61`, `Blocks/PremiumDarkTile.tsx:21-23`, `styles.css:6,171,251`, `Blocks/Configurator.tsx:15` — note: Configurator.tsx will be deleted by 3, so skip).
- Remove the `// eslint-disable-next-line no-console` line in `ErrorBoundary.tsx:14` (no ESLint config exists).
- Leave all "earned" comments untouched per the report.

## Execution order

Default per spec: **3 → 7 → 4 → 2 → 5 → 1 → 6 → 8**.

Agent 7 has no concrete action after deferrals, so the effective order is:

**3 → 4 → 2 → 5 → 1 → 6 → 8**

## Workflow per agent

- Cut branch `cleanup/<n>-<slug>` from latest `main`.
- Apply actions one logical change per commit.
- After each commit run: `npx tsc -b --noEmit` then `npm run build`. If anything fails, revert the commit, note in report, move on.
- After all commits, fast-forward merge to `main`, push (Vercel auto-deploys), delete branch.
- Next agent cuts from the new `main`.

## Stop conditions

- If `npm run build` reports new TS errors that the agent cannot resolve in 1 follow-up commit → halt and surface to human.
- If the Vercel preview regresses on basic navigation → halt.
- If any test of a deferred-item invariant fails (e.g. `npx madge --circular` non-zero after agent 4) → halt.
