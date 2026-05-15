# Subagent 2: Type consolidation — discovery report

## Summary
~70 type/interface declarations inventoried across `src/`. Confirmed 4 distinct collisions / near-collisions, plus 2 known intentional duplications that should be documented. Proposed: 1 MERGE (a small literal-union "tone" type), 1 RENAME (the legacy `Paper`/`PaperQuestion` schema), 0 deletions. The two flagship "duplicates" the brief asked about (paper schemas + Pill/TonePill) are both intentional and should LEAVE — only naming/comments need clarifying.

## Method
- `Grep` for `^export (type|interface) <name>` and `^(type|interface) <name>` across `src/**/*.{ts,tsx}` to enumerate declarations.
- Targeted `Grep` for repeat names (`Paper`, `Pill`, `Tone`, `Question`, `State`, `ButtonProps`, `Props`, `CoachTip`, `Pitfall*`, etc.) to surface collisions.
- `Read` of every shape behind a candidate collision to compare fields.
- Cross-checked imports of `data/papers/schema` vs `data/pastpapers/schema` to confirm the modules are sibling but disjoint.

## Type inventory (top 40 most central)

| Name | File:Line | Exported? | Shape fingerprint |
| --- | --- | --- | --- |
| `Paper` (legacy) | `src/data/papers/schema.ts:29` | yes | `{id,label,year,month,type,source,sourceUrl?,examinerReportUrl?,questions:PaperQuestion[]}` |
| `PaperQuestion` | `src/data/papers/schema.ts:13` | yes | `{id,number,section,marks,topics[],syllabusAreas[],difficulty,estMinutes,questionAssetUrl,...}` |
| `PaperType` | `src/data/papers/schema.ts:6` | yes | union `'real' \| 'mock' \| 'pre-mock' \| 'specimen' \| 'tba-original'` |
| `PaperSource` | `src/data/papers/schema.ts:7` | yes | union `'ACCA' \| 'internal' \| 'licensed'` |
| `Section` | `src/data/papers/schema.ts:8` | yes | `'A' \| 'B'` |
| `SyllabusArea` | `src/data/papers/schema.ts:9` | yes | `'A'..'F'` |
| `Month` | `src/data/papers/schema.ts:10` | yes | `'Mar' \| 'Jun' \| 'Sep' \| 'Dec'` |
| `Difficulty` | `src/data/papers/schema.ts:11` | yes | `1\|2\|3\|4\|5` |
| `AttemptRating` | `src/data/papers/schema.ts:41` | yes | `'again' \| 'hard' \| 'good' \| 'easy'` |
| `AttemptLog` | `src/data/papers/schema.ts:43` | yes | `{id,questionId,paperId,startedAt,finishedAt?,selfScore?,selfRating,notes?,revealed?}` |
| `Paper` (new) | `src/data/pastpapers/schema.ts:54` | yes | `{id,name,session,paperSection,totalMarks,syllabusSection,topics,tags,difficulty,primarySource,scenarioSteps,questionParts,verifiedNumbers,solutionSteps,examinerFeedback}` |
| `DataSource` | `src/data/pastpapers/schema.ts:2` | yes | `'Q' \| 'A' \| 'S' \| 'E'` |
| `SyllabusSection` | `src/data/pastpapers/schema.ts:8` | yes | `'A'..'E'` |
| `PaperSection` | `src/data/pastpapers/schema.ts:9` | yes | `'A' \| 'B'` |
| `TopicCategory` | `src/data/pastpapers/schema.ts:10` | yes | `'inv' \| 'hedg' \| 'ma'` |
| `VerifiedNumber` | `src/data/pastpapers/schema.ts:12` | yes | `{value,description,source:DataSource}` |
| `QuestionPart` | `src/data/pastpapers/schema.ts:18` | yes | `{label,marks,requirement}` |
| `ScenarioStep` | `src/data/pastpapers/schema.ts:24` | yes | `{id,navLabel,title,content,warning?,table?}` |
| `ScenarioTable` | `src/data/pastpapers/schema.ts:33` | yes | `{headers,rows,highlightLastRow?}` |
| `SolutionStep` | `src/data/pastpapers/schema.ts:39` | yes | `{stepNumber,title,explanation,formula?,verifiedNumbers?}` |
| `ExaminerFeedback` | `src/data/pastpapers/schema.ts:47` | yes | `{didWell,commonErrors,tutorTip,source:'E'}` |
| `Topic` | `src/data/topics.ts:44` | yes | `{id,title,syllabus,matchday,badge,papers,hook,notes,formulas,worked,drills,pitfalls}` |
| `Note` / `Drill` / `Worked` / `Formula` / `Pitfall` / `CoachTip` (data) | `src/data/topics.ts:7-42` | yes | atomic content shapes used by `Topic` |
| `PitfallEntry` | `src/data/pitfalls.ts:7` | yes | `{id,symptom,why,fix,topics,marksAtRisk,source}` |
| `ExamCase` / `ExaminerQuote` | `src/data/examiner.ts:7,18` | yes | examiner-report content |
| `ShWeek` | `src/data/shplus.ts:8` | yes | study-hours-plus weekly shape |
| `ThoeryCard` / `ThoeryCat` | `src/data/theory.ts:8,16` | yes | theory deck (note: typo "Thoery") |
| `SampleAnswer` / `SampleLine` | `src/data/sample-answers.ts:13,19` | yes | model-answer content |
| `Spotlight` | `src/data/spotlights.ts:9` | yes | examiner spotlight card |
| `NewsItem` | `src/data/news.ts:7` | yes | news strip item |
| `PracticeSet` / `Exhibit` / `Requirement` / `MarkSchemeRow` | `src/data/practice.ts:7-25` | yes | practice-set content |
| `Tier` / `State` (store) | `src/lib/store.ts:20,55` | yes | zustand store types |
| `SafeOnboarding` / `OnboardingDistance` | `src/lib/safe-storage.ts:22-25` | yes | persisted onboarding |
| `SiteStats` | `src/lib/site-stats.ts:43` | yes | derived |
| `SkillRating` / `DebriefSession` / `StructuralCritique` / `DebriefTrends` | `src/lib/debrief.ts` | yes | post-mock debrief |
| `RecognitionHandle` / `RecognitionState` / `VoiceOption` | `src/lib/voice.ts` | both | speech-recognition wrapper |
| `Cell` / `Sheet` | `src/lib/sheet-engine.ts:8-9` | yes | mini-spreadsheet types |
| `CoachReply` | `src/lib/coach-ai.ts:10` | yes | coach-AI response |
| `SourceId` | `src/lib/source-labels.ts:6` | yes | `'examiner' \| 'mower' \| 'acowtancy' \| 'tba'` |
| `Mnemonic` | `src/lib/mnemonics.ts:6` | yes | mnemonic card |
| `Tone` | `src/components/Blocks/tone.tsx:4` | yes | `'white' \| 'mist' \| 'navy' \| 'black'` (canonical) |
| `TonePillProps` (+ private `BaseProps`/`ButtonProps`/`AnchorProps`/`RouterProps`/`Variant`/`Size`) | `src/components/Blocks/TonePill.tsx` | yes/no | tone-aware pill button discriminated union |
| `ButtonProps` (shadcn) | `src/components/ui/button.tsx:36` | yes | shadcn variant-driven button |
| `TopicTab` | `src/components/TopicTabs.tsx:5` | yes | `{id,label,icon?,render}` |
| `SubNavAnchor` / `StickySubNavProps` | `src/components/Blocks/StickySubNav.tsx` | mixed | sub-nav block |
| `TripCard` / `ThreeUpCardRowProps` | `src/components/Blocks/ThreeUpCardRow.tsx` | mixed | three-up block |
| `StatItem` / `StatStripProps` | `src/components/Blocks/StatStrip.tsx` | mixed | stat strip |
| `ListItem` / `ListFilterChip<T>` / `TabularListProps<T>` | `src/components/Blocks/TabularList.tsx` | mixed | tabular list block |
| `TwoUpPanel` / `TwoUpProps` | `src/components/Blocks/TwoUp.tsx` | mixed | two-up block |
| `ConfiguratorOption` / `ConfiguratorProps` | `src/components/Blocks/Configurator.tsx` | mixed | configurator block |
| `PremiumDarkTileProps` | `src/components/Blocks/PremiumDarkTile.tsx` | no | local |
| `CenteredHeroProps` | `src/components/Blocks/CenteredHero.tsx` | no | local |
| `PastPapersViewHandle` | `src/components/PastPapers/PastPapersView.tsx:10` | yes | imperative handle |
| `Tab` / `FilterSection` / `FilterTopic` (PastPapers) | `src/components/PastPapers/...` | no | local UI state |
| `Props` (×8 in `src/components/PastPapers/**`) | various | no | per-component prop bag |
| Local `Question`, `ChatMsg`, `FlipCard`, `SRItem`, `FeynDraft`, `PivotEntry`, `ChecklistItem`, `ChecklistGroup`, `PanelKey`, `SheetMode`, `WeekProgress`, `AllProgress`, `Box`, `Msg`, `Prefs`, `OnbState`, `State` (ErrorBoundary), `FlipCard` | various pages/components | no | leaf, single-file scope |

(The Blocks props (`TwoUpProps`, `ConfiguratorProps`, etc.) are intentionally co-located with their components in the same file — that is idiomatic and not a collision.)

## Collisions

### Collision 1: `Paper` (and adjacent paper-domain types)
- **Instances:**
  - `src/data/papers/schema.ts:29` — legacy "revision" paper: `{id,label,year,month,type,source,...,questions:PaperQuestion[]}`
  - `src/data/pastpapers/schema.ts:54` — new "past-papers walkthrough" paper: `{id,name,session,paperSection,totalMarks,...,scenarioSteps,questionParts,verifiedNumbers,solutionSteps,examinerFeedback}`
- **Importers (disjoint, confirmed):**
  - Legacy: `src/pages/Revision.tsx`, `src/lib/attempts.ts`
  - New: `src/components/PastPapers/**` (8 files: `PastPapersView`, `PaperDetail`, `PaperCard`, `tabs/{Scenario,Question,Solution,Examiner}Tab`, `shared/{SourceBadge,VerifiedNumberCard}`)
- **Decision: LEAVE (with rename suggested, see below).** Shapes are entirely different domains: the legacy schema describes an *index of paper attempts and links* for the Revision module; the new schema describes a *fully-modelled walkthrough* for the Past Papers module. Merging would force one consumer or the other to carry a large optional surface area it never uses. The brief asked us to confirm they don't accidentally collide — confirmed: no file imports both, and the type names happen to match only because both modules genuinely model "an ACCA paper" at different levels of detail.
- **Soft suggestion (RENAME, not required):** to make the collision impossible to misuse if both are ever imported into the same module, rename one of them at declaration: e.g. `Paper` in `src/data/papers/schema.ts` → `RevisionPaper` (with `PaperQuestion` → `RevisionPaperQuestion`). Importers would update in 2 files (`pages/Revision.tsx`, `lib/attempts.ts`). Aliasing on import (`import type { Paper as RevisionPaper }`) would also work and require zero declaration edits. Either way this is a *naming* fix, not a shape fix. Defer the call to the owner — a code comment at the top of each schema file noting the sibling would also be acceptable.

### Collision 2: `Pill` (primitives) vs `TonePill` (Blocks)
- **Instances:**
  - `src/components/primitives.tsx:59` — `Pill` is a *value* (component) with inline prop type `{className?, children, variant?: 'outline'|'primary'|'accent'|'danger'}`. Used in 17 page files.
  - `src/components/Blocks/TonePill.tsx:68` — `TonePillProps` is an *exported type* (discriminated union over `as: 'button'|'a'|'link'`, with `variant: 'primary'|'secondary'|'ghost'`, `size`, `fullWidth`, etc.). Tone-aware via `useTone()`.
- **Decision: LEAVE.** Different design systems and not a type collision (the `Pill` primitive doesn't export a named type; `TonePillProps` is uniquely named). Per the brief, this duplication is intentional: `primitives.tsx` is the legacy badge-style chip used as visual labels inside cards, and `Blocks/TonePill.tsx` is the modern tone-aware CTA button used in the new design-system Blocks. They serve different purposes (label vs action) and have non-overlapping APIs.
- **Coordination flag:** subagent 3 may want to evaluate whether the legacy `Pill` from `primitives.tsx` is on a deprecation path — if its 17 usages are all label-style, it may eventually be replaced by a smaller `TonePill`-style chip. Out of scope for this report.

### Collision 3: `Tone` literal-union (canonical confirmed; one near-duplicate)
- **Instances:**
  - **Canonical:** `src/components/Blocks/tone.tsx:4` — `export type Tone = 'white' | 'mist' | 'navy' | 'black'` (semantic surface tone for `SectionShell` + `TonePill`).
  - **Near-duplicate (different domain, same shape pattern):**
    - `src/pages/Course.tsx:287` — inline `tone: 'primary' | 'accent' | 'danger'` on `KpiTile` props.
    - `src/pages/WarRoom.tsx:10` — `interface ChecklistGroup { ...; tone: 'primary' | 'accent' | 'danger'; ... }`.
    - `src/components/primitives.tsx:66` — `Pill`'s `variant?: 'outline' | 'primary' | 'accent' | 'danger'` (superset).
- **Decision: LEAVE the canonical `Tone`** (as the brief specified — confirmed no other file redefines `'white'|'mist'|'navy'|'black'`).
- **Decision: MERGE the `'primary'|'accent'|'danger'` literal** into a single named alias. Both `Course.KpiTile` and `WarRoom.ChecklistGroup` repeat the same three-letter union verbatim, and `Pill` extends it. Suggested:
  - **Canonical location:** new export in `src/components/primitives.tsx` (already the home of `Pill`), e.g. `export type AccentTone = 'primary' | 'accent' | 'danger'`. Then `Pill.variant` becomes `'outline' | AccentTone`, and `KpiTile`/`ChecklistGroup` reuse it.
  - **Files whose imports would update:** `src/pages/Course.tsx`, `src/pages/WarRoom.tsx`, `src/components/primitives.tsx` (declaration only).
  - This is a low-risk dedup of a 3-member literal that has already drifted once (Pill adds `'outline'`); centralising prevents further drift.

### Collision 4: `ButtonProps`
- **Instances:**
  - `src/components/ui/button.tsx:36` — `export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }` (shadcn pattern).
  - `src/components/Blocks/TonePill.tsx:64` — local `type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }` (NOT exported, used only inside the discriminated union for `TonePillProps`).
- **Decision: LEAVE.** The TonePill one is file-private (no `export`) and is a building block for `TonePillProps`. The shadcn one is exported but only consumed within `components/ui/`. No file imports both. Shapes are unrelated. No action required.

### Collision 5: `State`
- **Instances:**
  - `src/lib/store.ts:55` — `export interface State` (zustand store: ~40 fields covering progress, settings, debrief, etc.).
  - `src/ErrorBoundary.tsx:3` — local `interface State { error: Error | null }` (React class-component state).
- **Decision: LEAVE.** The ErrorBoundary one is unexported and file-private to a class component (the conventional React pattern). No collision in practice — they live in different modules and one is namespace-private. The store's `State` could optionally be renamed `AppState` for clarity (currently it isn't ambiguous because nothing else exports `State`), but that is a stylistic call, not a dedup.

### Collision 6: `Props` (8 instances under `src/components/PastPapers/`)
- **Instances:** every per-component prop bag in `PastPapers/**` is named `interface Props { ... }` — `PaperCard`, `PaperDetail`, `tabs/{Scenario,Question,Solution,Examiner}Tab`, `shared/{DataTable,WarnBox,VerifiedNumberCard,SourceBadge,DifficultyDots}`.
- **Decision: LEAVE.** All are file-private (no `export`), single-component-scoped, and the convention is internally consistent within this subtree. There is no actual TS collision because each lives in its own module. (Subagent 5 / a style pass might prefer `<ComponentName>Props`, but that is a naming convention choice, out of scope here.)

### Non-collision noted in passing: `CoachTip`
- **Instances:**
  - `src/data/topics.ts:21` — `export interface CoachTip { title, body }` (data shape attached to `Note.coach`).
  - `src/components/primitives.tsx:78` — `export function CoachTip({ title, children })` (React component).
- **Decision: LEAVE.** One is a *type*, the other is a *value* — TypeScript places them in different namespaces, so they cannot collide on import. They are also semantically related (the data shape feeds the component), so the name match is intentional. No action.

## Coordination flags
- **Subagent 3 (deletes):** the legacy `Pill` primitive in `src/components/primitives.tsx` is used in 17 places but may be a deprecation candidate vs the newer `TonePill`. If subagent 3 finds either form is dead, the `'primary'|'accent'|'danger'` MERGE in Collision 3 may simplify or become moot.
- **Subagent 3 (deletes):** confirm `src/data/papers/schema.ts` (the legacy schema) is still consumed — yes, by `pages/Revision.tsx` and `lib/attempts.ts` only. Don't accidentally delete.
- **Subagent 5 (weak types):** the mass of `interface Props { paper: Paper }` files in `src/components/PastPapers/` are well-typed but verbose; subagent 5 may also touch them. Don't rename `Props` to `<X>Props` from this subagent's report — that is a style change, not consolidation.
- **Subagent 5 (weak types):** `src/components/Blocks/TonePill.tsx` contains `as any` cast in `fadeUp` siblings (`primitives.tsx:12`) — out of my scope but adjacent.
- **General:** if anyone renames the legacy `Paper` to `RevisionPaper` (suggested in Collision 1), 2 files update: `pages/Revision.tsx`, `lib/attempts.ts`.

## Open questions
1. Should the legacy `Paper`/`PaperQuestion` schema be renamed at declaration (`RevisionPaper`/`RevisionPaperQuestion`) to make the collision impossible, or is the file-path separation (`papers/` vs `pastpapers/`) considered enough? Either is defensible; the rename is mechanically trivial (2 importers).
2. Is the legacy `Pill` from `src/components/primitives.tsx` on a deprecation path, given `Blocks/TonePill.tsx` is the modern tone-aware equivalent? Answering this would resolve whether to invest in a shared `AccentTone` (Collision 3) or simply let `Pill` get phased out.
3. The data file `src/data/theory.ts` exports `ThoeryCard` and `ThoeryCat` (typo "Thoery" — should be "Theory"). Out of scope for this report (it's a rename, not a dedup), but worth flagging to the owner.
