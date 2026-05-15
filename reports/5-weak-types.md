# Subagent 5: Weak types — discovery report

## Summary

47 weak-type sites identified across 11 source files. Of these:

- **34 REPLACEABLE** — precise type is statically knowable from the producer.
- **8 GENUINELY UNKNOWN** — input from browser APIs, fetched JSON, or `JSON.parse`; need runtime narrowing.
- **5 JUSTIFIED** — type system genuinely can't express it (framer-motion `ease` cubic-bezier tuple, deliberate prop-discriminated union refinements in `TonePill`).

Counts:

- `any` occurrences (TS, not English): **31** (1 in `ErrorBoundary`, 6 in `voice.ts`, 12 in `sheet-engine.ts`, 1 in `primitives.tsx`, 1 in `coach-ai.ts`, 1 in `Mock.tsx`, 2 in `Revision.tsx`, 1 in `Theory.tsx`, 9 in `Practice.tsx`, 2 in `Debrief.tsx`)
- `unknown` occurrences: **6** (all justified — `safe-storage.ts` parser inputs, `attempts.ts` CSV escape, `App.tsx` `lazyNamed` generic constraint)
- `as` casts (non-trivial, excluding `as const` / `as Pick<>`): **~22** (9 are the `as any` cluster in Practice/Mock/Revision/Theory listed above; 13 are legitimate refinements like `as PaperType`, `as Box`, `as Array<keyof typeof SKILL_LABELS>`, `as HTMLElement | null`, `as TouchEvent`, `as DebriefSession[]`)
- `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`: **0 / 0 / 0** (clean)
- `Function` / `Object` / `{}` as types: **0** (only `{}` value-literal in `voice.ts` line 46 inside an `as any` cast, and `hidden: {}` framer variant value in `primitives.tsx` line 7 — both are values, not types)

## Method

1. Read `tsconfig.json` (no `tsconfig.app.json` exists — single config governs all of `src/`).
2. Grepped for: `:\s*any\b`, `\bany\[\]`, `<any>`, `as any`, `as unknown`, `: unknown`, `<unknown>`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, `\bas \w`, `:\s*Function\b`, `:\s*Object\b`, `:\s*\{\s*\}`.
3. Filtered out matches in `src/data/**` that are English prose ("treat as a put", "as columns", etc.) — those are string literals in revision content, not types.
4. For each TypeScript site, opened the file, read 5+ lines of context, and traced the producer when relevant (e.g. `Pill` variant union in `primitives.tsx`, `band.tone` literal in `Mock.tsx`).

## tsconfig snapshot

`tsconfig.json` lines 2-21:

```json
{
  "target": "ES2022",
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
  "module": "ESNext",
  "moduleResolution": "Bundler",
  "jsx": "react-jsx",
  "strict": true,
  "noUnusedLocals": false,
  "noUnusedParameters": false,
  "noFallthroughCasesInSwitch": true,
  "esModuleInterop": true,
  ...
}
```

`strict: true` is on. Sub-flags relaxed (intentionally or by default):

- `noUnusedLocals: false` — explicitly off.
- `noUnusedParameters: false` — explicitly off.
- `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict` — all ON via `strict: true`.

**Note:** `useUnknownInCatchVariables` defaults to `true` under `strict`. Every `catch (e: any)` site below is therefore *deliberately weakening* the inferred `unknown`. They should all become `catch (e)` (implicit `unknown`) and narrow with `instanceof Error` or `e instanceof DOMException`. This overlaps with subagent 6.

## Sites (table)

Grouped by file. `src/` prefix omitted from paths.

### `ErrorBoundary.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `ErrorBoundary.tsx:12` | `: any` | `componentDidCatch(error: Error, info: any)` | `info: React.ErrorInfo` | REPLACEABLE | React class-component lifecycle signature; `ErrorInfo` is exported from `react`. |

### `lib/voice.ts` (Web Speech API shims)

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `lib/voice.ts:22` | `as any` | `const w = window as any;` | Declare a module-level `interface SpeechWindow extends Window { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition; }` and cast `window as SpeechWindow`. | REPLACEABLE | `SpeechRecognition` exists in `lib.dom.d.ts` since TS 4.6; vendor prefix is the only missing piece. |
| `lib/voice.ts:46` | `as any` (and `{}` value) | `const w = (typeof window !== 'undefined' ? window : {}) as any;` | Same `SpeechWindow` interface; replace `{}` fallback with `(undefined as unknown as SpeechWindow)` and gate on the `typeof window` check above (early-return path already handled at line 21). | REPLACEABLE | Same as above; SSR fallback can be eliminated since `createRecognition` is only called from event handlers in the browser. |
| `lib/voice.ts:55` | `: any` | `const r: any = new SR();` | `const r: SpeechRecognition = new SR();` | REPLACEABLE | `SpeechRecognition` is in lib.dom; `SR` is `typeof SpeechRecognition`. |
| `lib/voice.ts:63` | `: any` | `r.onerror = (e: any) => { ... e?.error ... }` | `r.onerror = (e: SpeechRecognitionErrorEvent) => { ... e.error ... }` | REPLACEABLE | DOM lib provides `SpeechRecognitionErrorEvent` with `.error: SpeechRecognitionErrorCode`. |
| `lib/voice.ts:67` | `: any` | `r.onresult = (e: any) => { ... e.resultIndex, e.results ... }` | `r.onresult = (e: SpeechRecognitionEvent) => { ... }` | REPLACEABLE | `SpeechRecognitionEvent` exists in lib.dom and has `resultIndex`, `results: SpeechRecognitionResultList`. |
| `lib/voice.ts:81` | `: any` (catch) | `catch (err: any) { onError?.(err?.message || ...) }` | `catch (err) { onError?.(err instanceof Error ? err.message : 'Could not start microphone'); }` | GENUINELY UNKNOWN (use narrowing) | DOMException is what `SpeechRecognition.start()` actually throws; narrow via `instanceof Error`. Coordinates with subagent 6. |
| `lib/voice.ts:122` | `as any` | `(v as any).localService` | `v.localService` (no cast) — `SpeechSynthesisVoice.localService: boolean` is in lib.dom. | REPLACEABLE | The cast is unnecessary; the type is already declared. |

### `lib/sheet-engine.ts` (recursive-descent spreadsheet parser)

The parser produces values of type `number | string | boolean | (number|string|boolean)[]`. Define one shared alias:

```ts
type CellValue = number | string | boolean;
type ExprValue = CellValue | CellValue[]; // arrays appear only at function-arg positions for ranges
```

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `lib/sheet-engine.ts:37` | `v: any` (return) | `compute(...): { ok: boolean; v: any; err?: string }` | `{ ok: true; v: ExprValue } \| { ok: false; v: '#CYCLE' \| '#ERR'; err: string }` (discriminated union) | REPLACEABLE | All return sites set `v` to `string` (literal `''`, `'#CYCLE'`, `'#ERR'`), `number`, or the parser result. `display()` already branches on `typeof out.v === 'number'` / `'boolean'`. |
| `lib/sheet-engine.ts:53` | `: any` (catch) | `catch (e: any) { return { ok: false, v: '#ERR', err: e?.message || 'error' }; }` | `catch (e) { return { ok: false, v: '#ERR', err: e instanceof Error ? e.message : 'error' }; }` | GENUINELY UNKNOWN (use narrowing) | Parser throws `new Error(...)` everywhere; `instanceof Error` narrows. |
| `lib/sheet-engine.ts:89,92,118,129,144,152,158,235` | `parseXxx(): any` × 8 | All parse methods return `any`. | All return `ExprValue`. `parsePrimary` and `parseRangeOrExpr` may return `CellValue[]` (range arrays); the others return `CellValue`. | REPLACEABLE | Each method's body composes `num()` (returns `number`) and string/boolean literals. The only branch that can return arrays is `parseRangeOrExpr`. |
| `lib/sheet-engine.ts:197` | `any[]` | `const args: any[] = [];` (function call args) | `const args: ExprValue[] = [];` | REPLACEABLE | Each `args.push(a)` where `a` came from `parseRangeOrExpr(): ExprValue`. |
| `lib/sheet-engine.ts:247` | `any[]` | `const values: any[] = [];` (cell-range collector) | `const values: CellValue[] = [];` | REPLACEABLE | Pushed values come from `compute().v` after the `out.ok` check. |
| `lib/sheet-engine.ts:263` | `v: any` | `function num(v: any): number` | `function num(v: ExprValue \| null \| undefined): number` | REPLACEABLE | All call sites pass parser return values. |
| `lib/sheet-engine.ts:272` | `args: any[]` | `function flat(args: any[]): number[]` | `function flat(args: ExprValue[]): number[]` | REPLACEABLE | Every call site passes the function-args array. |
| `lib/sheet-engine.ts:281` | `args: any[]` and `): any` | `function callFunc(name: string, args: any[], sheet: Sheet, depth: number): any` | `function callFunc(name: string, args: ExprValue[], sheet: Sheet, depth: number): CellValue` | REPLACEABLE | All `case` branches return `number`, `boolean`, or `string`; `IF` returns `args[1] \| args[2]` which are themselves `ExprValue`. Tighten signature with `\| ExprValue` for the `IF` case if needed (but the called value will always be a scalar in practice). |

### `components/primitives.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `components/primitives.tsx:12` | `as any` | `transition: { ..., ease: [0.2, 0.8, 0.2, 1] as any }` | `ease: [0.2, 0.8, 0.2, 1] as const` *and* type the variant as `Variants` from `framer-motion`. The `as any` exists because TS widens the array literal to `number[]` and framer's `Easing` union doesn't accept it. `as const` produces `readonly [0.2, 0.8, 0.2, 1]` which framer types accept since v10. | REPLACEABLE | Other Block files (`TwoUp.tsx:33`, `ThreeUpCardRow.tsx:22`, `PremiumDarkTile.tsx:18`, `Configurator.tsx:28`, `StickySubNav.tsx:58`, `CenteredHero.tsx:31`) already use `as const` for the same tuple — `primitives.tsx` is the lone holdout. |

### `lib/coach-ai.ts`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `lib/coach-ai.ts:419` | `as any` | `const remoteUrl = (import.meta as any).env?.VITE_COACH_API_URL as string \| undefined;` | Add to `src/vite-env.d.ts` (or create one): `interface ImportMetaEnv { readonly VITE_COACH_API_URL?: string; }`. Then `import.meta.env.VITE_COACH_API_URL` is typed naturally. | REPLACEABLE | tsconfig already has `"types": ["vite/client"]` which provides `ImportMetaEnv` extension point. No `vite-env.d.ts` exists in `src/` — adding one with the augmentation removes both the `as any` and the redundant `as string \| undefined`. **Coordinate with subagent 2** (centralised types). |

### `pages/Mock.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `pages/Mock.tsx:297` | `as any` | `<Pill variant={band.tone as any}>` | Change `band.tone` literals (`'primary'`, `'accent'`, `'danger'`) to be typed as `PillVariant` at the source. Either (a) export `type PillVariant = 'outline' \| 'primary' \| 'accent' \| 'danger'` from `primitives.tsx` and annotate `band: { label: string; tone: PillVariant; note: string }`, or (b) use `as const` on the band-object literals so `tone` narrows to its literal type. | REPLACEABLE | `Pill.variant` is `'outline' \| 'primary' \| 'accent' \| 'danger'` (`primitives.tsx:66`); `band.tone` only ever gets one of those four strings. **Coordinate with subagent 2** to export `PillVariant` once. |

### `pages/Revision.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `pages/Revision.tsx:175` | `as any` | `setYear(y as any)` where `y: 'all' \| number` | Drop the cast. `y` is already `'all' \| number` from the `as const` tuple, and `setYear` expects `number \| 'all'`. The literal-union widening is the issue: spread `years` (which is `number[]`) into a tuple. Fix by mapping: `(['all' as const, ...years] as Array<'all' \| number>).map(...)`. | REPLACEABLE | `useState<number \| 'all'>` at line 133. |
| `pages/Revision.tsx:182` | `as any` | `setType(t as any)` where `t: 'all' \| 'real' \| 'specimen' \| 'tba-original'` | `setType(t)` directly; `t` already narrows from the `as const` tuple. The cast is only needed because `setType` expects `PaperType \| 'all'` and the tuple literal is missing `'mock' \| 'pre-mock'`. The real fix: either add those two to the chip list or change `setType`'s state type to the narrower union shown in the chips. | REPLACEABLE | Either widen the chips to cover all `PaperType`s, or narrow the state's union to match the chips. Code change to type, not cast. |

### `pages/Theory.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `pages/Theory.tsx:10` | `as any` | `(localStorage.getItem('tba_theory_mode') as any) \|\| 'bullets'` | Hand-rolled guard: `const raw = localStorage.getItem('tba_theory_mode'); return raw === 'bullets' \|\| raw === 'full' ? raw : 'bullets';` | GENUINELY UNKNOWN (narrow with literal check) | localStorage is untrusted (matches the pattern already used in `safe-storage.ts`). |

### `pages/Practice.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `pages/Practice.tsx:67` | `as any` | `setFilter(f.v as any)` | Drop cast. The chip-array tuple is `as const` so `f.v` is already `'all' \| 'A' \| 'B' \| 1 \| 2 \| 3 \| 4`, exactly matching the state type. | REPLACEABLE | `useState<'all' \| 'A' \| 'B' \| 1 \| 2 \| 3 \| 4>` at line 35. |
| `pages/Practice.tsx:497, 499, 502, 504` | `as any` × 4 | `window.addEventListener('mousemove', onMove as any)` (and `removeEventListener`) | Type `onMove` properly: `const onMove = (ev: MouseEvent \| TouchEvent) => { ... }`. Then split into two listeners: `window.addEventListener('mousemove', onMove as (ev: MouseEvent) => void)` and `window.addEventListener('touchmove', onMove as (ev: TouchEvent) => void, { passive: false })`. Or split into two narrowly-typed handlers. | REPLACEABLE | The function already accepts `MouseEvent \| TouchEvent` and uses `'touches' in ev` to narrow. The `as any` only papers over DOM's overloaded `addEventListener`. |
| `pages/Practice.tsx:771, 772` | `as any` × 2 | `onMouseDown={onDragStart as any}` / `onTouchStart={onDragStart as any}` | Define two handlers (`onMouseDownDrag: React.MouseEventHandler`, `onTouchStartDrag: React.TouchEventHandler`) that delegate to a shared `startDrag(y: number, height: number)` core. | REPLACEABLE | `onDragStart` is `(e: React.MouseEvent \| React.TouchEvent) => void` (line 484) and React event handlers are invariant — won't accept the union for either prop. Split, don't cast. |
| `pages/Practice.tsx:804` | `: any` (catch) | `catch (e: any) { setHistory((h) => [{ e: expr, v: e.message \|\| 'ERROR' }, ...h]); }` | `catch (e) { ... v: e instanceof Error ? e.message : 'ERROR' ... }` | GENUINELY UNKNOWN (use narrowing) | `compute()` itself doesn't throw, but `new Error(out.err)` does — `instanceof Error` narrows. Coordinates with subagent 6. |
| `pages/Practice.tsx:999` | `: any` (catch) | `catch (e: any) { setMessages((m) => [...m, { role: 'coach', text: 'Coach AI hit an error. Try again.' }]); }` | `catch { ... }` — the `e` is unused. | REPLACEABLE | Catch binding is dead code; remove it entirely. |

### `pages/Debrief.tsx`

| File:Line | Pattern | Current | Proposed | Classification | Evidence |
| --- | --- | --- | --- | --- | --- |
| `pages/Debrief.tsx:200` | `: any` (catch) | `catch (e: any) { setError(e.message \|\| 'Could not generate critique.'); }` | `catch (e) { setError(e instanceof Error ? e.message : 'Could not generate critique.'); }` | GENUINELY UNKNOWN (use narrowing) | `buildCritique()` may throw; use `instanceof Error`. Coordinates with subagent 6. |

### `components/Blocks/TonePill.tsx`

The five `as` casts at lines 75-93 are all polymorphic-component prop refinements (discriminated by `props.as === 'a' \| 'link' \| 'button'`). They are `JUSTIFIED`:

| File:Line | Pattern | Current | Proposed | Classification |
| --- | --- | --- | --- | --- |
| `TonePill.tsx:75, 76, 78, 83, 84, 86, 91, 93` | `as AnchorProps`, `as RouterProps`, `as ButtonProps`, `as React.Ref<HTMLAnchorElement>`, `as React.Ref<HTMLButtonElement>` | discriminated-union refinement of `props` | Keep as-is; consider extracting a small `discriminate(props): Variant` helper to centralise the cast. The ref cast is also intrinsic to `forwardRef<HTMLElement, ...>`. | JUSTIFIED — TypeScript can't narrow a union by reading a property off the union without a user-defined predicate. The ref widening is required because `forwardRef<HTMLElement>` covers all three element types. |

### Other "as X" casts that appear in grep but are genuinely fine (recorded for completeness)

- `as const` everywhere (Block files, Practice.tsx:63, Revision.tsx:174,181, ExamSkills.tsx:27) — keep.
- `as Box` (Memory.tsx:199,258), `as PaperType` (Revision.tsx:184), `as ThoeryCat[]` (Theory.tsx:81), `as Array<keyof typeof SKILL_LABELS>` (Debrief.tsx:338,476), `as keyof typeof SKILL_LABELS` (Debrief.tsx:84), `as SkillRating` (Debrief.tsx:345), `as 3 \| 4` (papers/index.ts:155), `as PaperType \| 'all'` not needed — these are narrowing casts on safe inputs (`Object.keys` returns `string[]` by design, the runtime values are truly the literal union). All keep.
- `as DebriefSession[]` (debrief.ts:50) — JSON parse cast; keep but consider validating the shape (subagent 6 territory).
- `as HTMLElement \| null` (StudyGuide.tsx:280, CoachVoice.tsx:110) — `e.target` is `EventTarget \| null` in lib.dom; cast is the standard idiom. Keep.
- `as TouchEvent` / `as MouseEvent` / `as React.MouseEvent` (Practice.tsx:486, 490) — narrow within an `'touches' in e` block. Keep.
- `as SheetMode` (Practice.tsx:463) — same untrusted-localStorage pattern as `Theory.tsx:10` above; should be a hand-rolled guard (`raw === 'inline' \|\| raw === 'docked' ? raw : 'inline'`). **Add to GENUINELY UNKNOWN list.**
- `as OnboardingDistance` (safe-storage.ts:38, 40) — already inside a runtime guard (`VALID_DISTANCES.has(...)`). Keep.
- `as { distance?: unknown }` (safe-storage.ts:36, 37) — defensive parse-time access; keep.
- `as number` (attempts.ts:50, `(a.finishedAt as number)`) — pre-checked by `.filter((a) => a.startedAt && a.finishedAt)`. Could use a type predicate instead: `(a): a is AttemptLog & { finishedAt: number } => a.startedAt != null && a.finishedAt != null`. REPLACEABLE-NICE-TO-HAVE.
- `as number` (StatStrip.tsx:98, `value as number`) — guarded by `isNumeric` (`typeof value === 'number'`) earlier; TS doesn't carry that narrowing across the function boundary. Either wrap value-handling in a pre-narrowed local, or use a type predicate. REPLACEABLE-NICE-TO-HAVE.
- `as FilterSection[]`, `as FilterTopic[]` (PastPapersView.tsx:57, 68) — array-literal widening. Use `satisfies readonly FilterSection[]` (TS 4.9+) for safer typing. Keep / nice-to-have.

### Additional `unknown` audit (all justified)

| File:Line | Pattern | Status |
| --- | --- | --- |
| `App.tsx:9` | `Promise<Record<K, React.ComponentType<unknown>>>` | JUSTIFIED. `lazyNamed` doesn't know each page's prop shape; pages are zero-prop. Could tighten to `React.ComponentType<{}>` or `React.ComponentType` (defaults to `{}`). Keep `unknown`. |
| `lib/attempts.ts:88` | `escape = (v: unknown) => ...` | JUSTIFIED. CSV escape accepts truly any value, immediately wraps in `String(v ?? '')`. Keep. |
| `lib/safe-storage.ts:15, 36, 37` | `safeFanName(raw: unknown, ...)`, `(parsed as { distance?: unknown }).distance`, `(parsed as { dismissed?: unknown }).dismissed` | JUSTIFIED. Defensive parser inputs from `JSON.parse` and unknown-source strings. `unknown` immediately narrowed via `typeof === 'string'` / `typeof === 'boolean'`. Keep. |

## Narrowing strategies (for GENUINELY UNKNOWN cases)

Three reusable guards will retire most of the remaining weakness. Place all of them in `src/lib/guards.ts` (new file) so subagent 2 can register them in the centralised types index.

```ts
// src/lib/guards.ts

/** Narrow an `unknown` thrown value to an Error-like message. */
export function errorMessage(e: unknown, fallback = 'Unexpected error'): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return fallback;
}

/** Narrow a localStorage string to a known string-literal union. */
export function readEnum<T extends string>(
  raw: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return (allowed as readonly string[]).includes(raw ?? '') ? (raw as T) : fallback;
}
```

Replacements:

- `Theory.tsx:10` → `useState<'bullets' | 'full'>(() => readEnum(localStorage.getItem('tba_theory_mode'), ['bullets', 'full'] as const, 'bullets'))`.
- `Practice.tsx:463` → `useState<SheetMode>(() => readEnum(localStorage.getItem('tba_sheet_mode'), ['inline', 'docked'] as const, 'inline'))`.
- All `catch (e: any)` → `catch (e) { setError(errorMessage(e, '...')); }`.

`voice.ts:22, 46` use a typed declaration, not a runtime guard:

```ts
// add to a vendor.d.ts or top of voice.ts
interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}
```

## Coordination flags

- **Subagent 2 (centralised types)** —
  - Export `PillVariant` from `primitives.tsx` (used in `Mock.tsx:297` and any future `Pill` consumers).
  - Add `src/vite-env.d.ts` with `interface ImportMetaEnv { readonly VITE_COACH_API_URL?: string; }` so `coach-ai.ts:419` can drop both casts.
  - Add `src/lib/guards.ts` with the two helpers above.
  - Define `type CellValue = number | string | boolean; type ExprValue = CellValue | CellValue[];` in `lib/sheet-engine.ts` and re-export.
  - Consider adding a `vendor.d.ts` for the `SpeechRecognitionWindow` interface (or putting it inline in `voice.ts`).

- **Subagent 6 (try/catch)** — every `catch (e: any)` site here is also a `catch` cleanup target. Owner overlap on:
  - `lib/voice.ts:81`, `lib/sheet-engine.ts:53`, `pages/Practice.tsx:804, 999`, `pages/Debrief.tsx:200`. The `errorMessage(e)` helper proposed above gives subagent 6 a single chokepoint to use.

- **Subagent 4 (?)** if there's a "polymorphic component" cleanup — `TonePill.tsx`'s 8 casts could be wrapped behind a `discriminate(props)` helper, but the casts themselves are JUSTIFIED.

## Open questions

1. `coach-ai.ts:419` reads `VITE_COACH_API_URL` but no `.env` file is committed and the Vercel build doesn't appear to set it (per `vercel.json`). Confirm with the user whether this code path is ever taken; if not, the entire remote-fetch block (lines 418-434) can be deleted along with the `as any`.
2. `Revision.tsx:182` — chips list `'tba-original'` but `PaperType` also includes `'mock'` and `'pre-mock'`. Confirm whether the chip list is intentionally a subset (UX decision) or a bug. Affects whether the fix is "narrow state type" or "expand chip list".
3. `lib/sheet-engine.ts` `IF` returns `args[1] | args[2]` — if `args[1]` is a range array (a user wrote `=IF(cond, A1:A5, 0)`), the return type leaks `CellValue[]`. The proposed `CellValue` return signature would need `CellValue | CellValue[]`. In practice no one writes that, but the type system needs to express it; keep `ExprValue` as the return type and trust callers (`compute()` discards arrays via `display()`).
4. `attempts.ts:50` — the `(a.finishedAt as number)` cast could be eliminated by making `AttemptLog.finishedAt: number` non-optional in the schema and storing `0` for "in-progress". Out of scope for this report; flag for subagent owning data-schema cleanup if any.
