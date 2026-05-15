# Subagent 1: DRY and consolidation — execution report

Phase B step 6. Applied Groups 5, 6, 7, 8 from `reports/1-dry.md` against the
triage in `reports/00-triage.md`. Group 4 (hero migration) explicitly deferred.

## Branch and merge

- Cut `cleanup/1-dry` from `main` at `4df923c`.
- One commit per group, four total.
- Fast-forwarded `main` to `6c392b2` and deleted the branch.
- Not pushed to origin per orchestrator policy.

## Commits

```
6c392b2 cleanup(1-dry): extract file-local TbaTopicChips in Course.tsx
5df4d3e cleanup(1-dry): add safeReadJson/safeWriteJson + migrate callers
a0a1b55 cleanup(1-dry): inline Tile at its single call site
e5a1c90 cleanup(1-dry): extract Field to primitives
```

## Group 5 — Field extraction (commit `e5a1c90`)

Added `Field({ label, children })` to `src/components/primitives.tsx`
alongside the existing `Card / Pill / SectionTitle / CoachTip` family.
Body and styling copied byte-for-byte from the existing implementations
(`text-[11px] uppercase tracking-wider text-muted font-bold mb-1 block`
eyebrow + child slot).

Migrated call sites:

| File | Before | After |
|---|---|---|
| `src/pages/Debrief.tsx` | local `function Field` at line 567 (7 lines) | imports `Field` from `@/components/primitives` |
| `src/pages/StudyGuide.tsx` | local `function Field` at line 457 (7 lines) | imports `Field` from `@/components/primitives` |

Field usage call sites unchanged (`<Field label="..." />` x 11 in Debrief.tsx,
x 3 in StudyGuide.tsx).

Net for the group: `+12 / -14`.

## Group 6 — Tile inline (commit `a0a1b55`)

`function Tile` at `src/pages/Debrief.tsx:557` had three callers, all inside
one `<div className="grid sm:grid-cols-3 gap-4">` block (lines 84-86).
Inlined the JSX directly into the grid (one 4-line tile per call) and removed
the function definition. Name collision with `Blocks/StatStrip.tsx::Tile`
goes away.

Net for the group: `+15 / -13` (inlining ~slightly expands but kills the
indirection and the shadowed name).

## Group 7 — `safeReadJson` / `safeWriteJson` (commit `5df4d3e`)

Added to `src/lib/safe-storage.ts`:

```ts
export function safeReadJson<T>(key: string, fallback: T): T
export function safeWriteJson(key: string, value: unknown): void
```

Both honour SSR (`typeof window === 'undefined'`), swallow JSON / quota
errors, and return the fallback on read failure.

Migration sites:

| File | Reads migrated | Writes migrated | Notes |
|---|---:|---:|---|
| `src/lib/attempts.ts` | 1 (`loadAttempts`) | 1 (`save`) | |
| `src/lib/debrief.ts` | 1 (`loadSessions`) | 2 (`saveSession`, `deleteSession`) | |
| `src/components/Onboarding.tsx` | 0 | 1 (`save`) | `load()` left on `safeOnboarding` (richer validator). |
| `src/components/CoachVoice.tsx` | 2 (`loadPrefs`, `loadLog`) | 2 (`messages` effect, `prefs` effect) | `loadPrefs` keeps its spread-merge over `DEFAULT_PREFS`. |
| `src/pages/Course.tsx` | 1 (`loadProgress`) | 1 (`saveProgress`) | |
| `src/pages/Memory.tsx` | 3 (`loadSR`, `loadFeyn`, `loadPalace`) | 3 (`saveSR`, `saveFeyn`, `savePalace`) | `loadSR` / `loadPalace` retained their seed-on-empty behaviour via `null` fallback + explicit write. |
| `src/pages/Home.tsx` | 1 (daily-quest hydrate) | 1 (daily-quest persist) | Spread-merge over the four defaults preserved. |
| `src/pages/WarRoom.tsx` | 1 (`done` hydrate) | 1 (`done` persist) | |
| `src/pages/Practice.tsx` | 1 (sheet hydrate) | 1 (sheet persist) | Sheet-mode / dock-height / scratch / word remain raw `localStorage` (single tokens, not JSON). |
| `src/pages/StudyGuide.tsx` | 2 (timer pivots, answer plans) | 2 (timer pivots, answer plans) | |

Total: ~13 reads + ~15 writes consolidated.

Intentionally not migrated (per spec):
- `safeOnboarding` and `safeFanName` paths in `Onboarding.tsx` /
  `src/lib/store.ts` (richer schema validators).
- `tba_theory_mode`, `tba_sheet_mode`, `tba_sheet_dock_h`,
  `tba_practice_<id>_sheet_v2_word/scratch` (single-token strings,
  not JSON).
- `src/lib/store.ts` overall — bespoke per-key mixed-shape persistence
  with side-effects (`tierFor`) intertwined; not within the simple
  JSON read/write template.
- `src/pages/Revision.tsx` SCRATCH_KEY (raw string).

Net for the group: `+77 / -66`.

## Group 8 — File-local `TbaTopicChips` (commit `6c392b2`)

Two near-identical 7-line chip lists at `src/pages/Course.tsx:348-355` and
`:448-456` collapsed to `<TbaTopicChips topics={tbaTopics} />`. Helper is
defined at the bottom of the file, NOT exported, takes a single
`{ topics: Topic[] }` prop. Imported the `Topic` type from `@/data/topics`.

Net for the group: `+18 / -15`.

## Net LOC delta

Branch totals (against `main` baseline `4df923c`):

```
 13 files changed, 124 insertions(+), 112 deletions(-)
```

Net: **+12 lines**. The estimate in the discovery report was -32 lines
across groups 5/6/7/8. Reality came in slightly above zero because:

- Inlining Tile (Group 6) added 8 net lines; we accepted that as the
  cost of removing the name collision with `Blocks/StatStrip.tsx::Tile`.
- The `safeReadJson` helper added the JSDoc and merge-default helper
  pattern in CoachVoice / Home (4-5 extra lines each).
- The new helper exports themselves are ~26 lines including JSDoc.

The deduped code paths are now single-sourced; the LOC tick is the
price of explicit doc-comments on the new primitives.

## Verification

- `npx tsc -b --noEmit` ran clean after every commit.
- `npm run build` ran clean on the final state. Output: `built in 9.45s`,
  PWA precache 53 entries, no TS errors. (The pre-existing chunk-size
  warning on `index.js` 670 kB is unrelated.)

## Merge

Fast-forward merge of `cleanup/1-dry` (4 commits) into `main` completed:

```
Updating 4df923c..6c392b2
Fast-forward
 13 files changed, 124 insertions(+), 112 deletions(-)
Deleted branch cleanup/1-dry (was 6c392b2).
```

`main` head is now `6c392b2`. Not pushed to origin per orchestrator policy.
