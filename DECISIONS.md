# DECISIONS

> Per the Perfection Master Build contract (2026-05-18), every deviation from spec is logged here with rationale and the next-best alternative shipped. The contract is the source of truth; this file is the running diff.

---

## Sprint plan (high-level)

The contract is a multi-month roadmap. To preserve the live study site (`timboi14masterclass.vercel.app`) while building toward it, work is split into delivery sprints. Each sprint commits to a thin, shippable slice.

| Sprint | Focus | State |
|---|---|---|
| 1 | Contract recorded; kill-list quick wins (`/api/health`, sitemap, manifest icons, SW exceptions, billing-language sweep); `DECISIONS.md` scaffold; auto-memory updated. | **In progress** |
| 2 | Next.js 15 strangler-fig branch — `apps/web` sibling, App Router skeleton, mirror of `Home` + `BootRoom` + `WarRoom` at parity. Vite stays canonical at root until parity is verified. | Planned |
| 3 | Drizzle schema + Neon Postgres provisioning + auth flow (email-pw, magic link, passkeys) + `/settings/data` export/delete. | Planned |
| 4 | CBE spreadsheet engine swap (string parser → HyperFormula); TipTap word pad; Yjs CRDT for documents. | Planned |
| 5 | AI marker v2 (deterministic rubric parser + LLM judge per leaf); AI eval harness with 30 gold attempts; `aiMarkerVersion` versioning. | Planned |
| 6 | FSRS v5 (Leitner kept as "Classic"); generated cards from marker outputs; mobile review widget; Web Push. | Planned |
| 7 | Adaptive diagnostic (IRT 2-PL); Bayesian band predictor; 12-week plan engine. | Planned |
| 8 | Observability (Sentry, PostHog, pino, healthz/readyz, synthetic checks, SLOs). | Planned |
| 9 | A11y AAA pass; PWA Workbox rewrite; perf budgets enforced in CI; SEO (JSON-LD, OG generation). | Planned |
| 10 | Content pipeline (MDX + Zod, `/admin`, OCR review flow); exports (Anki, SCORM, xAPI); native shells via Capacitor. | Planned |

---

## D-001 — Migration approach: strangler-fig, not big-bang rewrite

**Spec reference:** §0.2 "Migrate, don't rewrite. Convert the existing Vite vanilla-JS SPA to Next.js 15 (App Router) + React 19 + TypeScript strict without losing a single page, copy block, mnemonic, pitfall, examiner quote, or visual rhythm. Pixel-parity diff."

**Decision:** Build Next.js 15 alongside the existing Vite app in an `apps/web` sibling. Vite remains the canonical production build at the repo root until Next.js reaches pixel-parity on every existing route. Then a single Vercel project-settings switch promotes Next.js to canonical.

**Why:** The user has a live study tool used to prepare for the June 2026 sitting. A direct big-bang rewrite would risk multi-day downtime or regressions during a critical study window. Strangler-fig preserves the live site, allows page-by-page parity diffs, and keeps `main` always shippable.

**Trade-off accepted:** A short-lived monorepo with two stacks. The duplication is bounded by Sprint 2-completion; the contract's "pixel-parity diff" requirement is satisfied page-by-page rather than at one big-bang cutover.

---

## D-002 — One-session scope: contract recording + kill-list, not full migration

**Spec reference:** §0 "Treat this prompt as the contract. Every section is acceptance criteria. Do not silently skip."

**Decision:** Sprint 1 (this session) ships the contract record (`DECISIONS.md`, auto-memory), and the kill-list items from §22 that can land without a backend (`/api/health`, real PNG manifest icons, `sitemap.xml`, SW exception audit, billing-language sweep). It does NOT ship Next.js, Postgres, auth, HyperFormula, FSRS v5, AI marker v2, observability, or the eval harness — those land in Sprints 2-10.

**Why:** The full §1-23 acceptance criteria realistically span months for a team. Attempting it in one session would ship half-finished code and break the live site. Per spec §0 "If something is impossible or unwise, document the decision in DECISIONS.md and ship the next best alternative" — this is that.

**Trade-off accepted:** The contract is not fully satisfied this session. Subsequent sessions sprint through the remaining items in the order in §24.

---

## D-003 — Personal API keys instead of server-funded LLM quotas

**Spec reference:** §0.4 + §3 + §5.

**Decision (consistent with spec):** `/settings/ai-keys` is the only surface for token cost — server keys exist for local dev and a generous default; user-supplied keys are encrypted with libsodium sealed boxes (server-side decrypt only) and never logged. The current rate-limit copy in `/api/coach.ts` and `/api/mark.ts` reading "Daily limit reached (N model answers per day)" stays as a fairness rail, not a paywall — when the user adds a personal key the rail switches off.

**Why:** Keeps the platform free for the single user/cohort while still preventing one runaway loop from burning a shared key.

---

## D-004 — Personal API key encryption: libsodium sealed boxes, server-only decrypt

**Spec reference:** §18 "User-supplied API keys encrypted with libsodium sealed boxes; decrypt only inside server runtimes."

**Decision:** When the `api_keys` table is implemented, encryption uses `crypto_box_seal` (sealed box) with the server's long-lived keypair stored in Vercel encrypted env (`TBA_SECRETS_PRIV`, `TBA_SECRETS_PUB`). Decryption never happens in client bundles or in Edge contexts that log inputs.

**Why:** Sealed boxes give anonymous-sender public-key encryption, so even the database compromise alone does not yield the plaintext keys.

---

## D-005 — Stadium League → personal trend board (bots removed entirely)

**Spec reference:** §10 + Sprint 17 follow-up (2026-05-18).

**Decision:** The "Stadium league table" on Home is replaced with a **Personal trend board** computed from real data — current/longest streak, fastest 25-mark debrief, week-on-week marker delta, and personal-best % per topic with deep links to the matching `/topic/:id`. The synthetic personas (HarryK_9, SonHM_7, etc.) are deleted entirely per the 2026-05-18 follow-up.

**Why:** Single-cohort use makes a competitive leaderboard meaningless; the follow-up explicitly directed removal of the fake rivals. The football-league identity is preserved by the section header style and emoji language, not by fake competitors.

**Future work:** An opt-in `/settings/community` toggle for pseudonymous comparison against an anonymised median of opted-in users is still possible later, gated on auth + DB (Sprint 3+).

---

## D-006 — SW "message channel closed" exceptions: extension noise, filtered

**Spec reference:** §22 "Fix the SW message handler" (originally 9 → audit re-counted 61 console exceptions).

**Confirmation:** Grep across the entire repo (`src/`, `public/`, `api/`) finds zero `chrome.runtime`, `postMessage`, `onmessage`, or `serviceWorker.addEventListener` — the only "chrome" string in our code is the literal English word in a comment about UI chrome. The SW is auto-registered by `vite-plugin-pwa`. The "asynchronous response by returning true; the message channel closed before a response was received" pattern is emitted by Chrome when an *extension* content script (password manager, dev tools, ad-blocker, MetaMask) registers a `chrome.runtime.onMessage` listener that returns `true` (promising an async response) and is then unloaded before calling `sendResponse`. The volume scales with how many extensions are active.

**Mitigation shipped 2026-05-18:**
1. `src/lib/observability.ts → isExtensionNoise()` filters this error pattern at capture time so Sentry doesn't drown in extension noise.
2. Workbox `cacheId: 'tba-v2'` bump in `vite.config.ts` forces all SW caches to recycle on next activation, which incidentally clears the stale "Stadium League Table" HTML some users were still seeing.

**Still deferred to Sprint 9:** custom Workbox InjectManifest SW that owns its own message channel so the chain can be observed under a clean profile to confirm zero our-code origin.

---

## Open questions (decisions pending owner input)

- **Postgres host:** Neon vs Supabase free tier — both work. Default to Neon for cleaner Drizzle ergonomics; revisit if Supabase auth becomes attractive.
- **OAuth providers' order:** Spec lists Google, Apple, Microsoft. Apple requires a paid developer account ($99/yr) — skip Apple in Sprint 3 unless the user has one. Add it later as a no-op.
- **Push notifications:** iOS 16.4+ Web Push works but APNs via Firebase needs the user to register an Apple developer team. Default to web-only push in Sprint 6; document the iOS native path.
- **Proctor-rehearsal mode (§8):** "on-device only, no upload" webcam analysis requires WASM models (MediaPipe/Face Landmarker). Add behind a hard opt-in toggle; ship in Sprint 8 with the observability work so we can verify no frames ever hit the wire.

---

## D-007 — Observability shim, no SDK install yet

**Spec reference:** §19 + §20.

**Decision:** `src/lib/observability.ts` is a dep-free Sentry-envelope + PostHog-`/capture` POST shim, env-gated on `VITE_SENTRY_DSN` / `VITE_POSTHOG_KEY`. It is a no-op when those vars are missing. Real `@sentry/nextjs` and `posthog-js` SDKs land during the Next.js promotion (Sprint 2 → cutover), not in the Vite tree.

**Why:** The full Sentry browser SDK is ~40 KB gz and would bloat the current 380 KB gz main bundle further. Until we have RSC-based code-splitting via Next.js, a thin shim that handles the 95% case (errors + events) is the right trade-off. PII scrubbing + circuit breaker + 1.5s timeout + keepalive means it can't take down the page.

---

## D-008 — Spreadsheet engine upgrade in-place, not HyperFormula yet

**Spec reference:** §4 + Sprint 2 (CBE).

**Decision:** Rather than swap the existing recursive-descent engine (`src/lib/sheet-engine.ts`) for HyperFormula right now, the existing engine gets the spec's 8 AFM-critical functions added directly: `AFM_NPV` (year-0-aware), `IRR` (already present), `MIRR` (already present), `NORM.S.DIST` / `NORMSDIST`, `NORMSINV` (new), `EXP`, `LN`, `SQRT`, `SUMPRODUCT` (new). Dotted Excel/ACCA names like `NORM.S.DIST(z)` and `AFM.NPV(rate, A1:A6)` are accepted via a one-pass preprocessor.

**Why:** HyperFormula is a 200 KB+ dep and the current engine already passes the AFM-critical surface area when given the missing functions. The Pearson-VUE keyboard parity (F2/F4/Ctrl+Arrow/etc.) lives in the React shell, not the engine, so swapping the engine doesn't unblock it. HyperFormula adoption belongs in the Next.js port where we can lazy-load it inside `/training/*` only, per the spec's perf budget.

**Acceptance:** `=AFM_NPV(0.10, -100, 30, 35, 40, 45, 50)` returns 48.03 (matches Excel `=NPV(0.10,B2:B6)+B1` to 4dp). Verified by node REPL during Sprint 2 work; once Vitest harness lands in Sprint 9, this becomes a regression test.

---

## D-009 — Next.js scaffold without `npm install` in this session

**Spec reference:** D-001 + Sprint 2.

**Decision:** `apps/web/` is fully scaffolded — `package.json` declaring Next 15 / React 19 / Drizzle / Argon2 / libsodium / Sentry / PostHog / HyperFormula / TipTap / Yjs, `next.config.mjs`, `tailwind.config.ts` mirroring root tokens, `src/app/{layout,page,not-found}.tsx`, `.env.local.example` with every env var the spec requires. `npm install` deliberately not run in this session.

**Why:** Argon2 and libsodium build native bindings on first install — that's a 2-3 minute compile on a fresh box, and the resulting `apps/web/node_modules` is ~600 MB. Running it inside an agent session would burn time without producing additional value beyond the lockfile, which depends on the user's npm registry mirror anyway. The scaffold is install-ready; user runs `cd apps/web && npm install` when they're ready to start porting pages.

---

## D-010 — Real CBE regression: select() drops first keystroke

**Spec reference:** Regression audit 2026-05-18, Issue #2.

**Root cause:** When the user typed `=` to start editing a cell, the
`useEffect` in `CBESpreadsheet.tsx` unconditionally called
`editRef.current.select()` on mount. This selected the seed character (`=`)
in the freshly-mounted input. The next keystroke (`1`) replaced the entire
selection, so the `=` was silently dropped — the cell stored `1+1` and the
display rendered it as the literal string, not a formula.

**Fix:** Introduce `selectOnFocus` state that distinguishes "start-typing"
edit mode (caret to end, no select-all) from "F2 / double-click" edit mode
(select-all so the existing value replaces with one keystroke, Excel-style).
The unit-level repro test (`compute('=1+1')` → 2) was always passing because
it bypassed React's input event flow; the Playwright e2e in
`tests/cbe-formula-eval.spec.ts` catches the regression at the right layer.

**Lesson learned:** Unit-level engine tests are necessary but not sufficient
for a CBE compute claim. Anything that asserts user-visible behaviour needs
an e2e through the actual keyboard event chain.

---

## D-011 — `/api/marker` via vercel.json rewrite, not file re-export

**Spec reference:** Regression audit 2026-05-18, Issue #6.

**Root cause:** The first attempt at aliasing was `export { default, config }
from './mark'` in `api/marker.ts`. Vercel's Edge bundler raised
`FUNCTION_INVOCATION_FAILED` on cold start because re-exports of `default`
through Edge-runtime files don't survive the bundle correctly.

**Fix:** Drop the file. Add a rewrite in `vercel.json`:
`{ "source": "/api/marker", "destination": "/api/mark" }`. Vercel rewrites
are battle-tested and don't depend on TS export semantics.

---

## D-012 — Identity display: always demo handle pre-auth, even if fanName exists

**Spec reference:** Spec §3 + regression audit Issue #4.

**Decision:** The identity badge above the CBE workspace now ALWAYS renders
`Demo · ABC123` until auth is wired (Sprint 3, blocked on DATABASE_URL +
OAuth credentials). The legacy `fanName` localStorage value is kept as the
internal storageKey so existing users' saved spreadsheet / word answer
state is still reachable — but it is no longer displayed.

**Why the previous fix was insufficient:** `resolveIdentity(fanName)` was
returning the fanName as the display label when set. Users who had typed
"timboi" into the NameOverlay before this refactor were still seeing
"👤 timboi" in the badge. The display vs storage distinction is the
correct one — display = always demo until auth, storage = legacy fanName
for continuity.

---

## D-013 — Quality gates: bundle marker + Playwright e2e

**Spec reference:** Regression audit 2026-05-18, quality-gate section.

**Decision:** Two new gates land alongside the regression fixes:

1. **`scripts/check-deployed-bundle.mjs`** — scans the live (or local
   `./dist`) JS chunks for required marker strings (`CBE_ENGINE_V1`,
   `AFM_NPV`, `NORMSINV`, `SUMPRODUCT`). Exits non-zero if any are
   missing. `CBE_ENGINE_V1` is exported from `src/lib/sheet-engine.ts`
   and referenced from `CBESpreadsheet.tsx` (`data-engine` attribute) so
   tree-shaking can't elide it. Run as `npm run check:bundle:local`
   (local dist) or `npm run check:bundle` (production URL).

2. **`tests/`** — Playwright config + two reproduce e2es:
   `cbe-formula-eval.spec.ts` types `=1+1` and `=AFM_NPV(...)` into a
   real CBE workspace and asserts numeric output;
   `fsrs-grading.spec.ts` visits `/memory-lab`, asserts the FSRS/Leitner
   toggle exists, both rating-button modes render correctly, and mode
   persists across reloads. Run as `npm run test:e2e`.

Neither runs in CI yet (the project doesn't have a CI pipeline beyond
Vercel's build step). The user can run them locally; once we add GitHub
Actions in Sprint 9, both become deploy-blocking.

---

## Changelog

- **2026-05-18 — Sprint 1 (Foundations)** — Contract recorded, sprint plan drafted, D-001..D-006 logged, kill-list pass (/api/health{,z}+/api/readyz, real PNG manifest icons, sitemap.xml, robots.txt, billing-language sweep clean).
- **2026-05-18 — Sprint 6+7 (SR engine + diagnostic)** — FSRS v5 pure-TS algorithm, switchable Leitner-classic facade, Memory.tsx 4-way grading UI. Bayesian band predictor (mean+σ+80%CI). IRT 2-PL adaptive diagnostic at /start/diagnostic with 26-item bank covering all 23 capabilities.
- **2026-05-18 — Sprint 17 (Personal trend board)** — HarryK_9/SonHM_7/Romero_17/Maddison10/BissoumaY bot personas deleted; Home leaderboard section replaced with personal-trend board fed by real marker/attempt/streak data. D-005 flipped to record removal.
- **2026-05-18 — Sprint 3 (DB schema) + Sprint 5 (eval harness)** — Full Drizzle schema for the 21 tables in §2 with libsodium-sealed-box pattern documented. AI marker eval runner at packages/ai-eval/ with seed Robson Co gold attempt, baseline.json gate.
- **2026-05-18 — Sprint 18 + 20 + 22 + CSP** — Accessibility v2 (dark theme, AAA high-contrast, font-size scale, bionic reading, Atkinson Hyperlegible, reduced motion). Data export (full JSON + Anki-importable TSV) and account-wipe. Env-gated Sentry-envelope + PostHog-/capture shim (D-007). CSP loosened minimally to support fonts.googleapis.com + Sentry/PostHog hosts.
- **2026-05-18 — Sprint 2 (Next.js scaffold) + Sprint 7 (CBE engine)** — apps/web/ Next.js 15 + React 19 + TS strict scaffold (install-ready, not installed in-session — D-009). sheet-engine.ts gains AFM_NPV (year-0-aware), SUMPRODUCT, NORMSINV, plus dotted-name aliases (NORM.S.DIST, AFM.NPV) via formula preprocessor (D-008).
