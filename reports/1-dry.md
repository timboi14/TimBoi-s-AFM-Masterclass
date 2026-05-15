# Subagent 1: DRY and consolidation — discovery report

## Summary

jscpd flagged 9 clone groups across `src/` (~181 duplicated lines, ~2k tokens out of ~18k LOC). After classifying:

- **EXTRACT: 4 groups** (`Field` helper duplicate, hand-rolled localStorage hero gradient duplication on 5 legacy pages, `try { localStorage.setItem(...) } catch {}` boilerplate in 9 files, `WeekCard.tbaTopics` chip-list snippet inside `Course.tsx`).
- **LEAVE: 4 groups** (the four hub pages built from `Blocks/`, the four `PastPapers/tabs/*.tsx` siblings, the within-`Debrief.tsx` step-card frames, the within-`Mock.tsx` reveal-toggle snippet — all are convergent uses of an existing primitive or have legitimate per-domain divergence already happening).
- **INLINE: 1 group** (`Tile` in `Debrief.tsx` — not the same as `Blocks/StatStrip.tsx::Tile`; single caller, clearer inline).

Net LOC delta estimate: **-110 to -150 lines** (small but pays dividends in style drift). No new modules with > 3 params or > 1 type param proposed; no new barrel files proposed.

## Method

1. Ran `npx --yes jscpd --min-lines 8 --min-tokens 50 --reporters json --output reports/tmp-jscpd src` — clean run, JSON at `reports/tmp-jscpd/jscpd-report.json`.
2. Parsed the 9 reported clone groups via `node` and read each pair to judge intent vs accident.
3. Hand-checked named suspects: `src/components/PastPapers/tabs/*.tsx`, `src/pages/{Playbook,Training,Scout,BootRoom}.tsx`, `src/components/primitives.tsx`, `src/components/Blocks/*`, `src/lib/*`.
4. Grep heuristics for additional cross-file dupes the token-counter would miss:
   - `^function (Field|Tile|StatTile|MetricTile|MiniStat|StatBox|InfoBox|EmptyState)` → found `Field`+`Tile` redefined.
   - `try { localStorage` → found 9 files with the same `setItem(...)` swallow pattern.

## Findings

### Group 1: Hub pages built from `Blocks/` primitives — `Playbook`, `Scout`, `BootRoom`, `Training`

- **Files:**
  - `src/pages/Playbook.tsx:1-50`
  - `src/pages/Scout.tsx:1-53`
  - `src/pages/BootRoom.tsx:1-51`
  - `src/pages/Training.tsx:1-52`
- **What's duplicated:** Identical import block + `<StickySubNav>` + `<SectionShell tone="white" pad="lg">` wrapping `<CenteredHero>` + `<SectionShell tone="mist" pad="md">` wrapping `<StatStrip>` skeleton. jscpd flagged Playbook↔Scout (29 lines) and Scout↔BootRoom (32 lines).
- **Decision:** **LEAVE**.
- **Rationale:** This is exactly what the `Blocks` design system was built for. The repetition *is* the convention — a "HubPage" abstraction would need to take 4+ slot props (anchors, hero content, stats, two-up panels), violating the < 3 params guideline, and would erase the per-page copywriter latitude already evident (Playbook leans informational, Scout leans danger-coded, Training leans tempo). Recent commit `0762481 Consolidate nav: 17 tabs -> 10 via hub pages` shows this is a deliberate, recently established pattern. Future hub pages should keep copy/paste-then-edit ergonomics.

### Group 2: PastPapers tab siblings — `Examiner`, `Question`, `Scenario`, `Solution`

- **Files:**
  - `src/components/PastPapers/tabs/ExaminerTab.tsx:1-29`
  - `src/components/PastPapers/tabs/QuestionTab.tsx:1-36`
  - `src/components/PastPapers/tabs/ScenarioTab.tsx:1-81`
  - `src/components/PastPapers/tabs/SolutionTab.tsx:1-36`
- **What's duplicated:** Each tab takes `interface Props { paper: Paper }` and opens with a `<SourceBadge>`. jscpd did NOT flag any of these as clones.
- **Decision:** **LEAVE**.
- **Rationale:** Same prop shape, completely different render trees (examiner = 3 coloured callouts; question = ordered list of marked parts; scenario = stateful step navigator + tables; solution = numbered formula steps). Forcing a shared shell would either require a 4-way variant union or kill per-tab CSS class names (`.examiner-tab`, `.scenario-tab`, …) that are already styled discretely. The shared 1-line `<SourceBadge source={paper.primarySource} />` is too thin to factor.

### Group 3: Within-`Debrief.tsx` step Cards (jscpd #3, #4)

- **Files:**
  - `src/pages/Debrief.tsx:240-255` (Step 1 — metadata form Card)
  - `src/pages/Debrief.tsx:277-297` (Step 2 — paste-attempt Card)
  - `src/pages/Debrief.tsx:360-382` (Step 4 — run-critique Card)
- **What's duplicated:** Outer `<motion.div key="sN" initial={{ opacity:0, y:8 }} animate={…} exit={…}> <Card className="!p-6"><h2>…</h2>…</Card></motion.div>` shell.
- **Decision:** **LEAVE**.
- **Rationale:** Each step's *body* differs sharply: form fields, multi-line textarea + checkbox + back/next, info banner + error pane + run button, etc. Wrapping in a `<DebriefStepCard step={n} title={…} actions={…}>` would only be 3 lines saved per step (~15 lines total) at the cost of obscuring the very explicit "Step N is a Card with these specific contents" structure that this single-file 5-step wizard derives readability from. The wizard is also already a one-shot — no other step authors will use this shell.

### Group 4: Hero gradient banner — `Pitfalls`, `WarRoom`, `Examiner`, `Debrief`, etc.

- **Files:**
  - `src/pages/Pitfalls.tsx:43-49`
  - `src/pages/WarRoom.tsx:142-148`
  - `src/pages/Examiner.tsx:25-31`
  - `src/pages/Debrief.tsx:40-46`
  - (jscpd flagged Pitfalls↔WarRoom 9-line clone; manual check shows the pattern is on at least 4 pages.)
- **What's duplicated:** `<motion.section variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border bg-white shadow-soft"> <div className="absolute inset-0 bg-gradient-to-br from-…/[0.06] via-white to-…/[0.10]" /> <div className="aurora w-72 h-72 …" /> [optional second aurora] <div className="relative p-6 md:p-10"> …` — the legacy "page hero" frame from before the `Blocks/CenteredHero.tsx` system existed.
- **Decision:** **EXTRACT**, but as a migration to the existing `<CenteredHero>` / `<SectionShell>` Blocks rather than a new abstraction.
- **Rationale:** The new hub pages (Group 1) already use `<CenteredHero>`. These older pages are pre-Blocks survivors. The "extract" here is really a migration: convert each `motion.section` hero block to `<SectionShell tone="white" pad="lg"><CenteredHero …/></SectionShell>` with chips going into `eyebrow={…}`. That collapses ~20 lines per page to ~10 (saving ~50 LOC across 5 pages) AND aligns design tone (gold/navy palette of Blocks vs the legacy danger-tinted aurora gradients).
- **If EXTRACT:** No new module. Reuse `@/components/Blocks::CenteredHero` and `SectionShell`. Affected files: `src/pages/Pitfalls.tsx`, `src/pages/WarRoom.tsx`, `src/pages/Examiner.tsx`, `src/pages/Debrief.tsx`, `src/pages/Memory.tsx`, `src/pages/ExamSkills.tsx` (likely; needs grep verification by the agent that does the migration). Public surface unchanged.
- **Coordination caveat:** This visually changes those pages. If subagent 4 (visual/design) is in flight, coordinate ordering — they may have an opinion on whether the migration target is `CenteredHero` or a new "alert-tone hero" variant for danger-coded pages.

### Group 5: Duplicate `Field` helper

- **Files:**
  - `src/pages/Debrief.tsx:566-573`
  - `src/pages/StudyGuide.tsx:457-464`
- **What's duplicated:** Identical 7-line `function Field({ label, children }: { label: string; children: React.ReactNode })` defining a `<label>` with uppercase eyebrow + child input slot.
- **Decision:** **EXTRACT**.
- **Rationale:** Same shape, same intent, two callers, will absolutely drift (the eyebrow's `tracking-wider` and `text-muted` colour will diverge silently). Two callers is the minimum threshold but the abstraction is trivially obvious — single string + children, zero variants. Already exists in spirit; just under-named.
- **If EXTRACT:** Add `export function Field({ label, children }) {…}` to `src/components/primitives.tsx` (alongside `Card`, `Pill`, `SectionTitle`, `CoachTip` — same family). Public surface = `<Field label="…">…</Field>`. 2 affected files. Saves ~14 lines.

### Group 6: `Tile` in `Debrief.tsx`

- **Files:**
  - `src/pages/Debrief.tsx:556-563`
- **What's duplicated:** Self-contained `function Tile({ label, value, sub })` — 3-line gold-number card. Distinct from `src/components/Blocks/StatStrip.tsx:46`'s `Tile` (which takes `{ stat, dark }`, has its own internal type).
- **Decision:** **INLINE**.
- **Rationale:** Single caller (`Debrief.tsx` line ~83 `<Tile label="Avg structural score" …/>`), and the 3-tile `<div className="grid sm:grid-cols-3 gap-4">` block where it's used is already inline. Confusingly shadows the same-named `Blocks/StatStrip` tile. Either inline (8 lines saved + name collision removed) or — if there's appetite — replace the whole block with `<StatStrip stats={[…]} />` for consistency with the hub pages. **Recommend inline first**; let subagent 4 decide whether to switch to the StatStrip later.

### Group 7: localStorage write boilerplate

- **Files (jscpd missed; grep-found):**
  - `src/lib/attempts.ts:15`, `src/lib/debrief.ts:61,66`, `src/components/Onboarding.tsx:39`, `src/components/CoachVoice.tsx:71-72`, `src/pages/Course.tsx:36`, `src/pages/Memory.tsx:35,44,81`, `src/pages/Home.tsx:676`, plus reads in `Practice.tsx`, `Revision.tsx`, `Theory.tsx`, `WarRoom.tsx`.
- **What's duplicated:** `try { localStorage.setItem(KEY, JSON.stringify(value)); } catch {}` (write) and `try { return JSON.parse(localStorage.getItem(KEY) || '...') } catch { return ... }` (read) — the same swallow-and-fall-back-on-quota-exceeded shape, 9+ files.
- **Decision:** **EXTRACT** (cautious).
- **Rationale:** Truly identical intent (defend against private mode, quota, JSON parse errors). Recent commit `ec5977d Operational hardening: code-split, self-host fonts, validate local storage` shows the team is actively investing in this surface. A `safeJsonRead<T>(key, fallback)` + `safeJsonWrite(key, value)` pair in the existing `src/lib/safe-storage.ts` would unify them — and that file's docstring already says the surface is "two keys" but is silently growing past that.
- **If EXTRACT:** Add to `src/lib/safe-storage.ts`:
  - `export function safeJsonRead<T>(key: string, fallback: T): T`
  - `export function safeJsonWrite(key: string, value: unknown): boolean` (returns success so callers can warn)
  Two functions, one type parameter each, 2 params each — well within the no-fat-abstraction guideline. Migration touches ~10 files; ~30-40 lines saved; net win is consistency, not LOC.
- **Coordination flag:** Subagent dealing with security/storage hardening or QA may want to own this rather than DRY agent — flag to orchestrator.

### Group 8: `Course.tsx` self-clone (jscpd #7)

- **Files:**
  - `src/pages/Course.tsx:348-356`
  - `src/pages/Course.tsx:448-456`
- **What's duplicated:** The "Drill these on TimBoi" chip-list rendering `tbaTopics.map(…) → <Link to={…} className="chip …"><i className="fa-solid …" /> {t.title}</Link>`. Appears once in the static `WeekFooter` (collapsed view) and once again in the `WeekCard` expanded view.
- **Decision:** **EXTRACT** (file-local, not exported).
- **Rationale:** Same source data (`week.tbaTopics`), identical render, two call sites in the same file. A file-local `function TbaTopicChips({ topics }: { topics: TopicEntry[] })` would dedupe ~10 lines and make the future "add a hover tooltip" change a one-line edit instead of a search-and-replace.
- **If EXTRACT:** Local helper inside `src/pages/Course.tsx`; do not export. Saves ~9 LOC.

### Group 9: `Mock.tsx` reveal/markscheme block (jscpd #2)

- **Files:**
  - `src/pages/Mock.tsx:174-200` ↔ `src/pages/Mock.tsx:200-245`
- **What's duplicated:** jscpd reports a 46-line within-file clone covering the question-card open/close + reveal markup. On read, the two ranges actually overlap (one ends where the other begins) and represent two adjacent question render branches inside the same `.map`.
- **Decision:** **LEAVE**.
- **Rationale:** False positive — this is one continuous render expression that jscpd flagged because of the repeated motion-wrapper + grid-card pattern between two AnimatePresence subtrees. Splitting would just hide the linear "open → reveal → mark scheme" flow that authors clearly wrote to be read top-to-bottom.

## Net LOC change estimate

If all EXTRACT/INLINE proposals are taken:

- Group 4 (hero migration to CenteredHero):  **-50 lines**
- Group 5 (`Field` to primitives):  **-14 lines, +7 lines** (new export) → **-7**
- Group 6 (`Tile` inline):  **-8 lines**
- Group 7 (`safeJsonRead/Write`):  **-35 lines, +15 lines** (new helpers + JSDoc) → **-20**
- Group 8 (file-local `TbaTopicChips`):  **-9 lines, +4** → **-5**

**Total: roughly -90 lines net** (removing ~120 lines of repeated/legacy code, adding ~25-30 lines of named primitives). Group 4 is most of the win and most of the visual coordination risk.

## Coordination flags

- **Group 4 hero migration → potential overlap with subagent doing visual/design pass.** Pages affected: `src/pages/Pitfalls.tsx`, `src/pages/WarRoom.tsx`, `src/pages/Examiner.tsx`, `src/pages/Debrief.tsx`, possibly `src/pages/Memory.tsx`, `src/pages/ExamSkills.tsx`. The legacy hero uses red/sky aurora gradients; `<CenteredHero>` uses navy/gold tone system. Visual change is intentional but worth flagging.
- **Group 7 storage helpers → potential overlap with subagent doing storage/security pass.** Touches `src/lib/safe-storage.ts` (which already has a docstring claiming the surface is "two keys"). If a security/hardening agent is updating that file, let them own this consolidation.
- **Group 1 LEAVE call → potential conflict with subagent doing further nav consolidation.** If agent 8 (or whoever) is consolidating hub pages further, they may want a `HubPage` shell. I argue against it but flag for visibility.
- **`src/pages/Debrief.tsx` is touched by groups 3, 4, 5, 6** — whoever applies these should batch them in a single edit to avoid conflict cascades.

## Open questions

1. **Group 4 priority.** Is the visual change (legacy aurora hero → tone-system `CenteredHero`) acceptable as a DRY-driven refactor, or should the visual agent green-light each page first?
2. **Group 7 ownership.** DRY agent or storage/security agent? The function signatures are trivial; either can do it. Defer to orchestrator.
3. **Hub pages future.** Confirm Group 1 stays as-is. If the policy is "no new hub pages without an abstraction," then a `HubPageShell` does become viable — but I'd want explicit per-prop typing rather than a generic slot machine.
