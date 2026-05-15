# Subagent 7: Legacy and deprecated paths — discovery report

## Summary

7 candidates flagged.
- **0 propose immediate removal** (no fully orphaned modules — every candidate has at least one live import).
- **2 propose collapse / migrate-first** — the legacy Revision module (large, has live callers) and a one-shot script.
- **5 informational** — feature-flag confirmations, marker grep results (all benign), and coordination notes.

The headline finding: **the legacy `/revision/*` Revision module from `src/pages/Revision.tsx` is half-orphaned** — it is dropped from the top nav, no hub page links into it, but it is *still indirectly reached* via two live entry points (`Home.tsx`'s daily-quest tile, and `Revision.tsx`'s own internal CTA to `/progress`). It cannot be removed wholesale yet; a migration plan is needed.

## Method

1. Greps for explicit deprecation markers (`@deprecated`, `DEPRECATED`, `LEGACY`, `OLD`, `TEMP`, `temporary`, `REMOVE ME`, `XXX`, `HACK`, `_old`, `-old`, `v1`/`v2`, `TODO(remove)`, `FIXME(remove)`).
2. Greps for env-gated branches (`import.meta.env.VITE_*`, `process.env.*`).
3. Manual reachability check on the parallel papers schemas — list every importer of `@/data/papers` vs. `@/data/pastpapers`, every `Link to="/revision*"`, every navigation to `/progress`.
4. Cross-referenced `src/components/Layout.tsx` NAV definition against `src/App.tsx` route table to find routes that exist but are not in the global nav.
5. Inspected suspected files (`src/data/topics.ts`, `src/lib/source-labels.ts`, `scripts/extract-spec-blocks.mjs`, root `index.html`).

## Marker-based finds

Greps for `@deprecated|DEPRECATED|LEGACY|OLD|TEMP|temporary|REMOVE ME|XXX|HACK` across `src/`: **zero matches**.

Greps for `_old`, `-old`, `v1`, `v2` returned only false positives, all benign:
- `src/lib/coach-ai.ts:377` — the string `"12-year-old"` inside a Feynman-technique tutorial reply.
- `src/lib/sheet-engine.ts:467` — `NPV(rate, v1, v2, ...)` formula signature documentation.
- `src/pages/Memory.tsx:425` — UI copy `"Explain it as if to a 12-year-old"`.

Greps for `TODO(remove)`, `FIXME(remove)`, `TODO:.*remove`, `FIXME:.*remove`: **zero matches**.

There is also a `tba_attempts_v1` localStorage key in `src/lib/attempts.ts:7` — this is a versioned storage key (intentional), not a marker for legacy code. Leave it.

## Architectural parallel implementations

### Revision module (legacy past-paper attempt) vs. Past Papers module (new)

**Legacy module files (the `/revision/*` and `/progress` paths):**
- `src/pages/Revision.tsx` — single file containing five exported page components: `RevisionDashboard`, `PapersIndex`, `PaperView`, `QuestionDeepDive`, `TopicsIndex`, `ProgressDashboard` (~735 lines).
- `src/data/papers/index.ts` — paper catalogue (ACCA real papers + TBA-original sets bound to `/practice/:setId`). Exports `PAPERS`, `getPaper`, `getQuestion`.
- `src/data/papers/schema.ts` — type definitions (`Paper`, `PaperQuestion`, `PaperType`, `AttemptLog`, `AttemptRating`, `SyllabusArea`, etc.).
- `src/lib/attempts.ts` — localStorage attempts log + topic-mastery + CSV export (`tba_attempts_v1`). Imports `AttemptLog`/`AttemptRating` from `@/data/papers/schema`.

**New module files (the `/past-papers` path):**
- `src/pages/PastPapers.tsx` — page wrapper (`PastPapersPage`).
- `src/components/PastPapers/index.tsx`, `PastPapersView.tsx`, `PaperCard.tsx`, `PaperDetail.tsx`, plus `tabs/{ScenarioTab, QuestionTab, SolutionTab, ExaminerTab}.tsx` and `shared/{VerifiedNumberCard, SourceBadge}.tsx`.
- `src/data/pastpapers/papers.ts` — full Paper records (verified-numbers, scenario steps, solution steps, examiner feedback).
- `src/data/pastpapers/schema.ts` — richer schema (`Paper`, `ScenarioStep`, `SolutionStep`, `ExaminerFeedback`, `VerifiedNumber`, `DataSource`, `TopicCategory`, etc.).

The two `Paper` types are **incompatible** (same name, different shape) and live in separate folders, so there is no symbol collision but also no shared anything.

**Reachability of legacy `/revision/*` from current UI:**

From the consolidated NAV in `src/components/Layout.tsx:14-25` (10 entries: Home, Course, Past Papers, Topics, Playbook, Training, Scout, Boot Room, Tools, War Room), neither `/revision` nor `/progress` appears. The Layout comment at `:11-13` explicitly notes "Old top-level entries (… Revision) still exist as routes — they are reached through their hub page or via deep links, just not surfaced in the global nav" — but **no hub page actually links to `/revision`**.

External links into the legacy module:
- `src/pages/Home.tsx:20` imports `PAPERS` from `@/data/papers` (legacy catalogue).
- `src/pages/Home.tsx:672` flattens `PAPERS` into one random "question of the day".
- `src/pages/Home.tsx:720` deep-links into `` `/revision/papers/${question.p.id}/q/${question.q.number}` `` from the daily-quest tile (third tile of `DailyQuest`).

That is the **only** external entry point — and it lands directly on the deepest leaf (`QuestionDeepDive`). Once the user is inside the legacy module, internal navigation is self-contained:
- `src/pages/Revision.tsx:88, 107, 110, 113, 159, 210, 256, 282, 374, 486, 528, 560, 656, 702` — all `Link to="/revision*"` or `to="/progress"` references are within `Revision.tsx` itself.

`/progress` is **never linked from outside** `Revision.tsx`. Same for `/revision`, `/revision/papers`, `/revision/topics`.

`src/App.tsx:78-82, 88` still routes all five legacy paths.

**Recommendation:** **MIGRATE-FIRST** (do not remove yet).
- The new `/past-papers` module replaces *most* of what the legacy module did (paper browsing + question detail), but it does NOT replace:
  - The attempts log (`src/lib/attempts.ts`) and its tied UI surfaces (`ProgressDashboard`, `TopicsIndex`, paper-level KPIs, CSV export).
  - The `PRACTICE_SETS`-derived "TBA-original" papers wired into `/practice/:setId` (only present in `src/data/papers/index.ts:127-163`).
  - The "Heatmap year × month" visualisation in `RevisionDashboard`.
- The Home daily-quest tile (`Home.tsx:670-732`) currently picks a random question from the legacy `PAPERS` catalogue and links into `/revision/papers/.../q/...`. Removing the legacy module would break this tile.

**Migration plan stub:**
1. **Decide the future of the attempts log.** Either (a) port `attempts.ts` to use the new `pastpapers/schema.ts` Paper type (the new schema lacks `AttemptLog`, `AttemptRating`, `selfScore`, `selfRating` — those would need adding, plus the new schema has no `questions[]` array since each new "Paper" is itself a single question), or (b) delete the attempts feature entirely if it is no longer in the product surface.
2. **Re-point the Home daily-quest tile.** Either swap the source to `@/data/pastpapers/papers` and link to a deep-link inside `/past-papers`, or swap to a different pool entirely (e.g. `PRACTICE_SETS` → `/practice/:id`, which the page already supports).
3. **Decide the fate of TBA-original synthetic papers.** The bridge `tbaPapers` block in `src/data/papers/index.ts:127-163` exists only to expose `/practice` sets inside `/revision/papers`. If kept, it needs a new home; if the new `/past-papers` module is meant to be the only paper browser, this bridge can be retired.
4. **Then, and only then, delete:** `src/pages/Revision.tsx`, `src/data/papers/` (both files), `src/lib/attempts.ts`, plus the six route entries in `src/App.tsx:25-30, 78-82, 88` and the matching `lazyNamed` imports.

**Effort:** **medium** — the deletion itself is small but step 1 (attempts log future) needs a product call, and step 2 is a one-line code change but a UX change (the daily quest will look different).

## Dead conditional branches

`VITE_COACH_API_URL` (`src/lib/coach-ai.ts:419`):
- The flag is read at runtime in `askCoach()` and falls back to a local KB if unset.
- No `.env`, `.env.local`, `.env.production` files exist in the repo.
- `vercel.json` does not set the variable.
- BUT the flag is **deliberately user-configurable** at deploy time: `src/pages/Practice.tsx:1077` has UI copy `"Set VITE_COACH_API_URL to plug in a remote LLM"`.
- **Verdict:** intentional extension point, not dead code. Leave alone.

No other `import.meta.env.*` or `process.env.*` references exist anywhere in `src/` (one match in `scripts/extract-spec-blocks.mjs:7-8` is `process.argv` for the one-shot CLI).

## One-shot scripts / cruft

### `scripts/extract-spec-blocks.mjs`
- Reads `PAST_PAPERS_MODULE_SPEC_1.md` (file does not exist anywhere in the repo, including untracked) and writes numbered code blocks to a directory.
- Output dir matches `.spec-blocks/` listed in `.gitignore:32` — confirming this was a one-shot scaffolding tool used during the initial `pastpapers` build.
- Not referenced from `package.json` scripts, not imported anywhere.
- **Recommendation:** **REMOVE.** Effort: trivial. The whole `scripts/` directory becomes empty after; remove that too.

### `index.html` (root)
- Standard Vite SPA entrypoint. Contains a noscript fallback and a CSS spinner. **Not legacy** — this is the production index.
- No HTML files from a pre-React era exist in the repo root.

### `src/lib/source-labels.ts`
- Used by `src/pages/Pitfalls.tsx:6` (live import). **Not vestigial.** The earlier suspicion is wrong — this file is in active use by the Pitfalls page to render badge labels for `examiner` / `mower` / `acowtancy` / `tba` source IDs.

### `src/data/topics.ts`
- Used by 7 live consumers: `Course.tsx`, `Cards.tsx`, `Formulas.tsx`, `Pitfalls.tsx`, `Topic.tsx`, `Home.tsx`, `Revision.tsx`, plus `src/lib/site-stats.ts`. **Core data file. Keep.**

## Coordination flags

Items that overlap with subagent 3 ("dead code: no callers anywhere") — defer to 3 if they confirm:
- **None of the legacy candidates are fully unreferenced.** Every file in the Revision module has at least one live import (the `lazyNamed` calls in `App.tsx`, plus `Home.tsx`'s `PAPERS` import, plus `attempts.ts` from `Revision.tsx`). If subagent 3 also flags `src/pages/Revision.tsx` it should be on the basis of the route being unreachable from the nav, not "no callers" — they ARE called from `App.tsx`.
- `scripts/extract-spec-blocks.mjs` may also be flagged by subagent 3 as a fully unreferenced file. Defer to 3 for the actual delete proposal — I am noting it here under "superseded one-shot tooling" rather than claiming the removal.

## Open questions

1. **Is the daily-quest tile in `Home.tsx` an intended product feature?** If yes, the Revision module's deep-link target needs replacement before deletion. If the tile itself is being retired (consolidated nav phase suggests aggressive simplification), the whole legacy module can go in one commit.
2. **Is anyone using the attempts log?** The CSV export is a power-user feature. If product is willing to drop it, the migration becomes "delete and re-point Home" instead of "port the schema".
3. **Are TBA-original "papers" (the `tbaPapers` synthetic block in `src/data/papers/index.ts`) supposed to surface inside `/past-papers`?** Currently the new module shows only ACCA papers from `src/data/pastpapers/papers.ts`. If yes, that's a feature gap that the migration would need to address.
4. **Vercel referrer logs** — would confirm whether real users ever hit `/revision/*` or `/progress` directly via bookmarks. Outside the scope of this read-only pass; flag for product owner.
