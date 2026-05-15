# Subagent 3: Dead code — discovery report

## Summary

**4 files / 22 exports / 1 dependency proposed for action.** Zero unused assets (all 11 `public/spurs/*.png` are referenced by `src/components/TabArt.tsx`). Zero TypeScript build artefacts (`reports/00-baseline.md` confirms `tsc -b` is clean).

| Bucket | Count | Estimated LOC removed |
|---|---:|---:|
| Files (full deletes) | 4 | ~568 LOC src + 52 LOC scripts = **~620 LOC** |
| Exports (within still-live files) | 22 | ~10 LOC of `export` keyword removals + 1 small export-only function |
| Production deps | 1 (`sonner`) | n/a — package removal |
| Assets | 0 | 0 MB |

The headline wins are:
- **`scripts/extract-spec-blocks.mjs`** — one-shot extractor for `PAST_PAPERS_MODULE_SPEC_1.md`; the spec has been ingested, this is now landfill.
- **`src/components/Blocks/{ThreeUpCardRow,TabularList,Configurator}.tsx`** — phase-3 design-system blocks (E, F, H) that are exported from the barrel but **no page imports them**. Confirmed by reading every consumer of `@/components/Blocks` (7 pages); none pull these names.
- **`sonner`** — toast library on `package.json` deps; **zero references** anywhere in `src/`.

No assets are removable. No tests exist (so no "test-only cascade" bucket).

## Method

1. Ran `npx --yes knip --no-progress --reporter json` once it auto-installed (~30 s). Output captured at `tasks/bmv8jmor0.output` (1 line of JSON, parsed inline).
2. For every flagged candidate, ran a confirmation pass via `Grep` across the whole repo (NOT just `src/`) to catch:
   - String-based dynamic imports / lazy loaders
   - Re-exports through barrel files
   - Config-file consumers (`tailwind.config.js`, `vite.config.ts`, `index.html`, `postcss.config.js`)
3. Distinguished "unused export from a still-live file" (knip's most common false-positive flavour for internal helpers) from "unused export of a top-level public API surface".
4. Cross-referenced `reports/1-dry.md` and `reports/2-types.md` to flag overlaps with sibling agents.

Knip ran cleanly — no fallback to `ts-prune` was needed.

## Candidates by category

### SAFE TO DELETE — files

| Path | LOC | Why dead | Verification |
| --- | ---: | --- | --- |
| `scripts/extract-spec-blocks.mjs` | 52 | One-shot Markdown fenced-block extractor for `PAST_PAPERS_MODULE_SPEC_1.md`. Not referenced by `package.json` scripts, not by `vite.config.ts`, not by any `.github/workflows/` (none exist), not by any source file. The spec it parsed has already been consumed (resulting in `src/data/pastpapers/papers.ts`). | `Grep "extract-spec-blocks"` → 0 hits outside the file itself. `package.json` scripts are only `dev`/`build`/`preview`. |
| `src/components/Blocks/ThreeUpCardRow.tsx` | 85 | Block "E" (three-up testimonial/card row) — exported from `src/components/Blocks/index.ts:8` but no page imports `ThreeUpCardRow` or its `TripCard` type. Inspected the import statements of all 7 `@/components/Blocks` consumers (`Course`, `BootRoom`, `Home`, `PastPapers`, `Playbook`, `Scout`, `Training`); none pull this name. | `Grep "ThreeUpCardRow"` → only `Blocks/index.ts` (re-export), the file itself, and `handoff.md` documentation. |
| `src/components/Blocks/TabularList.tsx` | 273 | Block "F" (filterable tabular list) — exported from `Blocks/index.ts:9` (`TabularList`, `ListItem`, `ListFilterChip`) but no page imports any of these names. The Past-Papers list view that one would expect to use it (`src/components/PastPapers/PastPapersView.tsx`) renders its own `paper-grid` via `PaperCard` instead. | `Grep "TabularList\|ListItem\|ListFilterChip"` → only `Blocks/index.ts`, the file itself, `handoff.md`. |
| `src/components/Blocks/Configurator.tsx` | 158 | Block "H" (Apple-style side-by-side configurator) — exported from `Blocks/index.ts:10` (`Configurator`, `ConfiguratorOption`) but no page imports either name. | `Grep "Configurator\|ConfiguratorOption"` → only `Blocks/index.ts`, the file itself, `handoff.md`. |

**Total: 4 files, ~568 LOC.**

If these three Blocks are deleted, also clean up `src/components/Blocks/index.ts` lines 8–10 (the corresponding re-exports). The barrel will still export 7 healthy primitives: `SectionShell`, `useTone`, `Tone`, `TonePill`, `TonePillProps`, `CenteredHero`, `HeroGold`, `StickySubNav`, `SubNavAnchor`, `StatStrip`, `StatItem`, `TwoUp`, `TwoUpPanel`, `PremiumDarkTile`. All are imported by at least one page.

### SAFE TO DELETE — exports (file stays alive)

These exports have no external consumers but the file containing them is still in use. Deleting (or down-grading the `export` keyword to local) is a 1-line edit per export. Listing in priority order — `bionicHTML_safe` is a real function nobody calls, the rest are 1-line schema/type re-exports.

| Symbol | File:Line | Why dead |
| --- | --- | --- |
| `bionicHTML_safe` | `src/utils/bionic.ts:19` (4 LOC body) | Only `bionicHTML` (the non-safe variant) is imported, by 5 PastPapers files. `bionicHTML_safe` has zero callers. The "safe" variant exists in case HTML strings ever need parsing — none do; all callers pass plain text. |
| `TIER_THRESHOLDS` | `src/lib/store.ts:22` | Used internally by `tierFor()` in the same file; no external consumer. |
| `useTabArt` | `src/components/TabArt.tsx:27` | Used internally by `TabArtBanner` (same file); no external consumer. |
| `SH_SUPPORT` | `src/data/shplus.ts:140` | Defined and exported, never imported. |
| `fadeIn` | `src/components/primitives.tsx:14` | Defined and exported, never imported. (Sibling `fadeUp` and `stagger` ARE used widely.) |
| `PRACTICE_BY_MODULE` | `src/data/practice.ts:1220` | Helper function never imported. |
| `PITFALL_TAGS` | `src/data/pitfalls.ts:280` | Defined and exported, never imported. (Sibling `PITFALLS` IS used by `Home.tsx`.) |
| `colIndex`, `getCell` | `src/lib/sheet-engine.ts:25,33` | Used internally within `sheet-engine.ts`; no external consumer. |
| `updateAttempt`, `deleteAttempt` | `src/lib/attempts.ts:27,33` | Defined and exported, never imported. |
| `buttonVariants` | `src/components/ui/button.tsx:52` | Re-exported alongside `Button`; no external file uses the standalone `buttonVariants` cva. (`Button` IS used by `chat-input.tsx`.) |
| Type re-exports (Blocks): `useTone`, `ThreeUpCardRow`, `TabularList`, `Configurator`, plus types `Tone`, `TonePillProps`, `TwoUpPanel`, `TripCard`, `ListItem`, `ListFilterChip`, `ConfiguratorOption` | `src/components/Blocks/index.ts:1-10` | These re-exports are only consumed by direct file imports inside `Blocks/`; consumers import the value re-exports (`SectionShell`, `TonePill`, etc.) but rarely the named types. **NOTE:** `SubNavAnchor` and `StatItem` ARE actively imported by 5 hub pages — keep those. |
| Internal-only schema types: `PaperSource`, `Section`, `Month`, `Difficulty`, `PaperQuestion` | `src/data/papers/schema.ts:7-13` | Used inside the same file only (composing the `Paper` interface). The `export` keyword is unnecessary. |
| Internal-only schema types: `SyllabusSection`, `QuestionPart`, `ScenarioTable`, `SolutionStep`, `ExaminerFeedback` | `src/data/pastpapers/schema.ts:8-47` | Same pattern — used only to compose the `Paper` interface in the same file. |
| Internal-only `ButtonProps` | `src/components/ui/button.tsx:36` | Knip flagged it; only `Button` itself is consumed. (Coordinates with `2-types.md`'s LEAVE call — both ButtonProps shapes are file-private in practice.) |
| Internal-only types: `Exhibit`, `Requirement`, `MarkSchemeRow` | `src/data/practice.ts:7-25` | Compose `PracticeSet`, used only in same file. |
| Internal-only `SAMPLE_ANSWERS` | `src/data/sample-answers.ts:27` | Used by the local `getSampleAnswer(setId, reqIndex)` helper only; the helper IS consumed by `Practice.tsx`. Drop the `export` keyword on the constant. |
| Internal-only types: `Worked`, `CoachTip`, `Note`, `Pitfall` | `src/data/topics.ts:16-39` | Compose `Topic`, used only in same file. **Note:** `CoachTip` collides in name with `src/components/primitives.tsx::CoachTip` (the React component) — not a type collision because `topics.ts::CoachTip` is data shape; `2-types.md` already inventoried this. |
| Internal-only `SiteStats` | `src/lib/site-stats.ts:43` | `typeof siteStats` re-exported as a name; only the `siteStats` value is consumed. |
| Internal-only `OnboardingDistance` | `src/lib/safe-storage.ts:22` | Used inside `safe-storage.ts` only. (`SafeOnboarding` IS imported by `Onboarding.tsx`.) |

**Aggregate impact for export-only cleanup:** ~25 lines (mostly removing `export` keywords + the `bionicHTML_safe` 4-line body). Low risk; pure surface-area reduction.

### SAFE TO DELETE — dependencies

| Package | Type | Why dead |
| --- | --- | --- |
| `sonner` | prod | Toast notification lib. `Grep "sonner\|Toaster"` returned 0 hits in `src/` (only `package-lock.json` and `00-baseline.md`). Knip flagged it explicitly. Nothing imports it; no `<Toaster />` rendered anywhere. |

`@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, `lucide-react`, `clsx` are all live (`Grep` confirmed each has at least one importer in `src/`).

`postcss`, `autoprefixer`, `@types/node` were NOT flagged by knip and are intentionally retained per the brief's boundaries.

### SAFE TO DELETE — assets

**None.** All 11 PNGs in `public/spurs/` are explicitly referenced by string literals in `src/components/TabArt.tsx`:

- `boot-room.png`, `course.png`, `home.png`, `mascot.png`, `past-papers.png`, `playbook.png`, `scout.png`, `tools.png` (referenced as `/spurs/tools.png` for `/study-guide`), `topics.png`, `training.png`, `war-room.png` — all 11 mapped, each has at least one route.

`public/og-cover.svg` and `public/favicon.svg` referenced from `index.html` and `vite.config.ts` (vite-pwa `includeAssets`) — keep, per brief.

Note: `public/spurs/` totals **61 MB** of PNGs. Not in scope for *deletion* (all referenced) but flagged in `00-baseline.md` and `handoff.md` for a future WebP/sharp pass. Out of this subagent's remit.

### PROBABLY DEAD — uncertain

| Item | Concern |
| --- | --- |
| (none) | Nothing reaches the "uncertain" bucket. The Blocks E/F/H deletion is unambiguous because they take no string-keyed lookup, no env-gated registration, and have no FontAwesome-style dynamic-class consumption. The `sonner` package likewise has no plugin-style auto-registration. |

### TEST-ONLY (cascade)

Empty — no test suite exists in this repo. `package.json` has only `dev`/`build`/`preview` scripts. `00-baseline.md` confirms "no test suite (skip in Phase C gate)".

## Coordination flags

- **Overlap with Subagent 7 (legacy):** if subagent 7 is also recommending the legacy `src/data/papers/` schema be removed in favour of the new `src/data/pastpapers/` schema, **DO NOT delete `src/data/papers/index.ts` or `src/data/papers/schema.ts`** as part of *this* unused-code pass — they are still live consumers via `src/lib/attempts.ts`, `src/pages/Home.tsx`, `src/pages/Revision.tsx`. The legacy schema is "alive but parallel" until the Revision Dashboard is migrated. That's a refactor, not dead-code removal.
- **Overlap with Subagent 1 (DRY):** subagent 1's "Group 1 LEAVE" call protects the four hub pages built from `Blocks/`. My ThreeUpCardRow / TabularList / Configurator deletions do NOT contradict that — those Blocks were *added* in commit `3c6f223 "Design system phase 3: Blocks E (Three-Up), F (Tabular List), H (Configurator)"` but the hub-page wave (`0762481`) and the home-page wave (`7d7024b`) ended up not adopting them. They are a design-system-only deliverable that no consumer materialised for. Safe to remove without affecting any of subagent 1's planned work.
- **Overlap with Subagent 2 (types):** subagent 2's report inventories most of the same `data/papers/schema.ts` and `data/pastpapers/schema.ts` types as MERGE/RENAME candidates (their renaming `Paper` → `PaperSlim` etc.). If subagent 2's MERGE goes ahead, several of my "remove unnecessary `export` keyword" recommendations are moot — the types will be deleted outright. Coordinate ordering: do subagent 2's type pass first, then re-verify the export-only list.
- **`Blocks/index.ts` edit:** the file is touched by both this report (lines 8–10 to remove) and potentially subagent 4 (visual). Should be a single batched edit.
- **`bionicHTML_safe` removal:** confirm with subagent 6 (security) — the "safe" naming suggests it was added defensively for sanitisation. It currently does no sanitisation (it just splits on `<` and bionic-fies non-tag parts), so deletion is fine, but the *concept* of a safe HTML→bionic might want resurrecting later if any user-supplied HTML appears.

## Open questions

1. **Sonner removal vs. future toast plans.** Are there in-flight plans for toast notifications (e.g. "saved to localStorage" feedback)? If yes, leaving `sonner` installed but unimported is a 30 KB-cost mistake; if no, drop it.
2. **Blocks E/F/H — delete vs. keep on the shelf.** These were built to spec and are stylistically polished. Two options: (a) delete now and re-add when a consumer materialises (cleanest); (b) leave but move to `src/components/Blocks/_unused/` to signal "shelf inventory". Recommend (a) — git history is the shelf.
3. **Schema file cleanup ordering.** If subagent 2 will rename/merge `data/papers/schema.ts`, this report's "unnecessary `export` keyword" list for that file is wasted effort. Defer to subagent 2.
