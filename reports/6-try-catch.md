# Subagent 6: Defensive code — discovery report

## Summary
- **27** `try`/`catch` sites inspected
- **0** standalone `.catch()` promise handlers (all promise rejection handling lives inside `try`/`catch await` blocks)
- **~35** `??` nullish-fallback uses; **~114** `||` uses — most are legitimate defaults (`array || []`, `'a' || 'b'` etc.). I flag only the suspect ones below.
- Decisions: **22 KEEP-AS-IS** / **5 KEEP-IMPROVE** / **0 DELETE** for try/catch sites.
- Decisions for fallbacks: **~6 flagged for review** out of 149 total uses.

The codebase already takes a defensive-but-lightweight stance. There are no swallowed-then-rethrown handlers, no catches around code that cannot throw, and `safe-storage.ts` is the deliberate parsed-boundary pattern called out in the brief. The biggest opportunity is consistency: there is a recurring `try { JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; }` idiom duplicated across 9 files that should be DRYed into `safeReadJson<T>(key, fallback)` rather than improved per-site. That is a refactor candidate, not a defensive bug.

## Method

1. `Grep` for `\btry\s*\{`, `\bcatch\s*[\(\{]`, `\.catch\(`, `\?\?`, `\|\|\s*['"\[\{0]`, and `console\.(warn|error|log)`.
2. Read every catch site in context (full function body) to determine: (a) what throws, (b) whether the catch communicates the failure, (c) whether the fallback hides a bug.
3. Cross-checked `safeOnboarding`/`safeFanName` against caller — confirmed they are the parsed-boundary pattern, retained.
4. Skipped service-worker generated code.

## Catch site inventory

| File:Line | What's wrapped | Catch action | Classification | Proposed change |
| --- | --- | --- | --- | --- |
| `src/ErrorBoundary.tsx:12-16` | React render-tree errors (lifecycle hook `componentDidCatch`) | `console.error('TBA crash:', error, info)` and renders fallback UI with `<details>` showing stack | **KEEP, AS-IS** | Real React error boundary, surfaces to user, gives a "Reset and reload" button. Best in repo. |
| `src/lib/safe-storage.ts:33-43` (`safeOnboarding`) | `JSON.parse(rawJson)` of untrusted localStorage payload | Returns `null`, caller treats as "not onboarded" | **KEEP, AS-IS** | Brief explicitly preserves this. Boundary parser. |
| `src/lib/store.ts:47-52` (`readArr`) | `JSON.parse(localStorage.getItem(key))` for tba_notesRead/tba_theoryRead/tba_weakAreas | Returns `[]` | **KEEP, AS-IS** | localStorage tampering / older app version writes are realistic; empty array is the correct invariant. |
| `src/lib/voice.ts:81-83` (`r.start`) | `SpeechRecognition.start()` — throws `InvalidStateError` if mic already started, security errors on insecure context | Calls `onError(err.message)` which surfaces to UI text | **KEEP, AS-IS** | Real third-party API failure surface, surfaced to UI. |
| `src/lib/voice.ts:85` (`r.stop`) | `SpeechRecognition.stop()` — throws if not started | Empty catch | **KEEP, AS-IS** | "Stop something that isn't running" is genuinely a no-op. Comment would help. |
| `src/lib/coach-ai.ts:421-433` (`askCoach` remote fetch) | `fetch(remoteUrl)` to optional VITE_COACH_API_URL | Empty catch + comment "fall through to local KB" | **KEEP, IMPROVE** | Network failure is real, but **silently** falling back hides the case where the user *configured* a remote URL and it broke. See rewrite below. |
| `src/components/CoachVoice.tsx:32-36` (`loadPrefs`) | `JSON.parse` of tba_coach_prefs_v2 | Empty catch, returns hard-coded defaults | **KEEP, AS-IS** | Boundary parse. |
| `src/components/CoachVoice.tsx:41` (`loadLog`) | `JSON.parse` of coach log | Returns `[]` | **KEEP, AS-IS** | Boundary parse. |
| `src/components/CoachVoice.tsx:71-72` (persist effects) | `localStorage.setItem` of messages (capped to 30) and prefs | Empty catch | **KEEP, AS-IS** | Quota exceeded / private mode storage block is realistic. |
| `src/components/CoachVoice.tsx:145-146` (`send`) | `await askCoach(q)` | Sets `reply = { text: 'Coach is offline right now…' }` | **KEEP, AS-IS** | Surfaces to UI as a coach message. Best practice. |
| `src/components/Onboarding.tsx:39` (`save`) | `localStorage.setItem(KEY, JSON.stringify(s))` | Empty catch | **KEEP, AS-IS** | Quota / private-mode realistic. |
| `src/lib/attempts.ts:11` (`load`) | `JSON.parse` of tba_attempts | Returns `[]` | **KEEP, AS-IS** | Boundary parse. |
| `src/lib/attempts.ts:15` (persist) | `setItem(slice(-500))` | Empty catch | **KEEP, AS-IS** | Quota realistic. |
| `src/lib/debrief.ts:47-53` (`loadSessions`) | `JSON.parse` of tba_debrief_v1 | Returns `[]` | **KEEP, AS-IS** | Boundary parse. |
| `src/lib/debrief.ts:61` (`saveSession`) | `setItem` of `slice(0,50)` | Empty catch | **KEEP, AS-IS** | Quota realistic. |
| `src/lib/debrief.ts:66` (`deleteSession`) | `setItem` after filter | Empty catch | **KEEP, AS-IS** | Quota realistic. |
| `src/lib/sheet-engine.ts:47-55` (`compute`) | `Parser.parseExpression()` on user formula `=…` | Returns `{ ok:false, v:'#ERR', err:e?.message || 'error' }` | **KEEP, AS-IS** | This is the spreadsheet's domain-error pattern. Excellent. |
| `src/pages/Course.tsx:33` (`loadProg`) | `JSON.parse` of tba_course_prog | Returns `{}` | **KEEP, AS-IS** | Boundary parse. |
| `src/pages/Course.tsx:36` (`saveProg`) | `setItem` | Empty catch | **KEEP, AS-IS** | Quota. |
| `src/pages/Debrief.tsx:193-203` (`runCritique`) | `buildCritique(...)` (pure function over user input) | `setError(e.message || 'Could not generate critique.')` surfaces to UI | **KEEP, IMPROVE** | `buildCritique` is ours and arguably should not throw — but defensive guard is fine while heuristics evolve. Type the catch as `unknown`. |
| `src/pages/Home.tsx:659-660` (`DailyQuest` init) | `JSON.parse` of `tba_quest_<date>` | Returns hard-coded all-false defaults | **KEEP, AS-IS** | Boundary parse. |
| `src/pages/Home.tsx:676` (persist) | `setItem` | Empty catch | **KEEP, AS-IS** | Quota. |
| `src/pages/Memory.tsx:25-28` (`loadSR`) | `JSON.parse` of tba_sr_v1 | Empty catch, falls through to seed | **KEEP, AS-IS** | Boundary parse + seed fallback is correct. |
| `src/pages/Memory.tsx:35,42,44,73-76,81` | `JSON.parse` / `setItem` of feyn / palace | Empty catch, returns `[]` / `{}` / seed | **KEEP, AS-IS** | Boundary parses. |
| `src/pages/Practice.tsx:452` (sheet load) | `JSON.parse` of stored sheet | Empty catch, falls through to fresh 40×14 grid | **KEEP, AS-IS** | Boundary parse. |
| `src/pages/Practice.tsx:798-806` (`Calculator.evalExpr`) | `compute([['']], '=' + expr)` | Pushes error to history list | **KEEP, IMPROVE** | `compute` already returns `{ok:false, err}` — the explicit `throw new Error(out.err)` then catching is roundabout. See rewrite. |
| `src/pages/Practice.tsx:996-1003` (Practice CoachDrawer `send`) | `await askCoach(msg)` | Pushes "Coach AI hit an error. Try again." message | **KEEP, IMPROVE** | Type `e: unknown`, drop unused binding. Same shape as `CoachVoice.tsx:145` — could share. |
| `src/pages/Revision.tsx:333,338` (scratch persist) | `localStorage.getItem` / `setItem` of scratchpad | Empty catch | **KEEP, AS-IS** | Quota. |
| `src/pages/StudyGuide.tsx:259,264,399,402` (timer + plan persist) | `JSON.parse` / `setItem` | Empty catches | **KEEP, AS-IS** | Boundary parses + quota. |
| `src/pages/WarRoom.tsx:128,132` (war-room status) | `JSON.parse` / `setItem` | Empty catches | **KEEP, AS-IS** | Boundary parse + quota. |

## Fallback pattern inventory (suspect `??` / `||` only)

| File:Line | Pattern | Is the LHS a possibly-undefined "I haven't computed it yet" or a possibly-bug? | Verdict |
| --- | --- | --- | --- |
| `src/lib/coach-ai.ts:429` | `data.text ?? data.message ?? ''` | The remote schema is undocumented; falling back to empty string would render an empty coach bubble. **Suspect.** | **REVIEW** — should reject the response (throw, hit the outer catch, surface "Coach is offline") if neither field exists, rather than render an empty bubble. |
| `src/pages/Theory.tsx:10` | `(localStorage.getItem('tba_theory_mode') as any) || 'bullets'` | `as any` plus `\|\|` — if a future `as 'bullets' \| 'full'` cast is added, an old garbage value would silently default. | **REVIEW** — narrow to a `Set` membership check (same pattern as `safeOnboarding`). |
| `src/pages/Practice.tsx:463` | `(localStorage.getItem('tba_sheet_mode') as SheetMode) \|\| 'inline'` | Same as above — unchecked cast. | **REVIEW** — guard against invalid stored mode. |
| `src/pages/Practice.tsx:466` | `parseInt(stored, 10) \|\| 480` | If `parseInt` returns `0` (legitimate but unwanted) or `NaN`, both fall through. `Math.max(220, …)` further clamps so behaviour is fine. | **KEEP** — clamped immediately. |
| `src/pages/Home.tsx:83` | `state.fanName \|\| 'Fan'` | `safeFanName` already guarantees string. Empty string is the documented "no name" sentinel; `'Fan'` is the rendered placeholder. | **KEEP** — legitimate display default. |
| `src/lib/voice.ts:65,82` | `e?.error \|\| 'Speech recognition error.'` | Web Speech `SpeechRecognitionErrorEvent.error` is a string, not undefined in practice, but optional-chain + fallback is defensible against impl variance. | **KEEP** — safe. |
| `src/lib/sheet-engine.ts:54` | `e?.message \|\| 'error'` | Caught error from custom `Parser`; messages are always set, but `??` would be more correct (don't accept empty string as "no message"). | **KEEP-IMPROVE** — switch `\|\|` → `??` after typing catch as `unknown` and narrowing. Subagent 5 will likely cover this. |
| All other `\|\|` defaults on JSON-parse (`localStorage.getItem(K) \|\| '[]'`) | Standard idiom: `getItem` returns `string \| null` and `JSON.parse('[]')` is the seed. | **KEEP** — textbook usage, `??` would also be correct (null is the only false-y; the operators are equivalent here). |

## Specific rewrites proposed (sketches only, do not apply)

### 1. `src/lib/coach-ai.ts:421-433` — surface remote API errors when the user opted in to remote
The user explicitly set `VITE_COACH_API_URL` so silently dropping back to the local KB hides a real bug:

```ts
// before
try {
  const res = await fetch(remoteUrl, { ... });
  if (res.ok) {
    const data = await res.json();
    return { text: data.text ?? data.message ?? '', cite: data.cite };
  }
} catch {
  // fall through to local KB
}
// fall through to KB...

// after
try {
  const res = await fetch(remoteUrl, { ... });
  if (!res.ok) throw new Error(`Coach API HTTP ${res.status}`);
  const data = await res.json();
  const text = typeof data?.text === 'string' && data.text.trim()
    ? data.text
    : typeof data?.message === 'string' && data.message.trim()
      ? data.message
      : null;
  if (!text) throw new Error('Coach API returned no text');
  return { text, cite: Array.isArray(data?.cite) ? data.cite : undefined };
} catch (err) {
  // Configured remote failed — log once, then degrade to local KB.
  // Don't return an empty bubble; that looks like a bug to the user.
  console.warn('[coach-ai] remote failed, using local KB:', err);
}
// ...local KB fall-through unchanged
```

### 2. `src/pages/Practice.tsx:798-806` — Calculator double-handles errors
`compute()` already returns `{ ok, v, err }`. We `throw` then immediately `catch` to put the message in history. Cut out the middleman:

```ts
// before
try {
  const out = compute([['']], '=' + expr);
  if (!out.ok) throw new Error(out.err);
  const result = ...;
  setHistory((h) => [{ e: expr, v: result }, ...h].slice(0, 8));
  setExpr(result);
} catch (e: any) {
  setHistory((h) => [{ e: expr, v: e.message || 'ERROR' }, ...h]);
}

// after
const out = compute([['']], '=' + expr);
if (!out.ok) {
  setHistory((h) => [{ e: expr, v: out.err || 'ERROR' }, ...h]);
  return;
}
const result = typeof out.v === 'number' ? Number(out.v.toFixed(6)).toString() : String(out.v);
setHistory((h) => [{ e: expr, v: result }, ...h].slice(0, 8));
setExpr(result);
```

### 3. `src/pages/Debrief.tsx:200` and `src/pages/Practice.tsx:804, 999` — `e: any` → `e: unknown`
All three use `e: any` then `e.message`. Should be `e: unknown` with a small narrow:

```ts
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : 'Could not generate critique.';
  setError(msg);
}
```

(This is squarely in subagent 5's narrowing scope — flagged below.)

### 4. Optional consolidation (refactor, not defensive fix)
Nine call sites duplicate `try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch { return []; }`. A helper would erase ~50 lines:

```ts
// src/lib/safe-storage.ts (new export)
export function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function safeWriteJson(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}
```

Out-of-scope for this discovery pass — flagging for the orchestration parent.

### 5. `src/pages/Theory.tsx:10` and `src/pages/Practice.tsx:463` — unchecked enum reads
```ts
// before
useState<'bullets' | 'full'>(() => (localStorage.getItem('tba_theory_mode') as any) || 'bullets');

// after
const VALID_MODES = new Set(['bullets', 'full'] as const);
useState<'bullets' | 'full'>(() => {
  const v = localStorage.getItem('tba_theory_mode');
  return v && (VALID_MODES as Set<string>).has(v) ? (v as 'bullets' | 'full') : 'bullets';
});
```

## Coordination flags

- **Overlaps with subagent 5 (`catch (e: unknown)` narrowing):** sites at `src/pages/Debrief.tsx:200`, `src/pages/Practice.tsx:804`, `src/pages/Practice.tsx:999`, `src/lib/voice.ts:81`, `src/lib/sheet-engine.ts:53` all use `catch (e: any)`. Subagent 5 should own the `any` → `unknown` migration; defensive intent is already correct.
- **Overlaps with whoever is doing DRY/dedup:** the `safeReadJson` / `safeWriteJson` consolidation (rewrite #4) touches 9 files. If another subagent is already proposing a unified storage helper, defer.
- **Subagent X (storage abstraction) coordination:** if such a subagent exists, they should know `localStorage.setItem` empty catches in this app are quota-handlers, not bug-hiders — every write is non-critical (UI persistence, not authoritative data).

## Open questions

1. **`coach-ai.ts:421` — silent remote degradation.** Is the intent that `VITE_COACH_API_URL` is always experimental and silent fallback is desired? If yes, keep as-is; if no, apply rewrite #1. (My read of the brief is "swallowing remote API errors silently" is a smell.)
2. **`Practice.tsx:463` (sheet mode) and `Theory.tsx:10` (theory mode).** A garbage stored value would currently survive the cast and crash later when used as a discriminated union. Is this worth the boundary check, or are these "I'd notice in dev tools" cases?
3. **`Memory.tsx:25-32` `loadSR`** writes the seed back into localStorage on every fresh-storage page load. That's intentional (seed-once), but if a user manually nukes `tba_sr_v1` while the page is open, the seed is silently rewritten. Acceptable?
4. **`ErrorBoundary.tsx`** logs to `console.error` only — there is no telemetry sink. If product wants crash visibility in production, that's a (small) feature, not a defensive fix. Out of scope here but worth flagging for the human.

No catches were found that should be **deleted outright**. Defensive code in this repo is right-sized for a client-side SPA.
