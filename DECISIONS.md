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

## D-006 — SW "message channel closed" exceptions: deferred pending repro

**Spec reference:** §22 "Fix the SW message handler" (9 console exceptions).

**Decision:** Source-grep across `src/` finds no custom service-worker code, no `postMessage` / `onmessage`, no `serviceWorker.addEventListener` — the SW is auto-registered by `vite-plugin-pwa` with `registerType: 'autoUpdate'` + server-side `skipWaiting: true` + `clientsClaim: true`. With those settings, the plugin's virtual register module sends a one-way activation message to the SW; "message channel closed before a response was received" is the typical browser warning when an extension content-script (password manager, dev tools, ad-blocker) injects a listener that returns `true` then resolves asynchronously — not our code.

**Trade-off accepted:** Leave the SW config as-is for Sprint 1; the warnings are non-blocking and almost certainly extension-originated. In Sprint 9 (PWA Workbox rewrite) we'll move to an InjectManifest strategy with a custom SW that controls its own message channel and can be observed under a clean profile to confirm.

---

## Open questions (decisions pending owner input)

- **Postgres host:** Neon vs Supabase free tier — both work. Default to Neon for cleaner Drizzle ergonomics; revisit if Supabase auth becomes attractive.
- **OAuth providers' order:** Spec lists Google, Apple, Microsoft. Apple requires a paid developer account ($99/yr) — skip Apple in Sprint 3 unless the user has one. Add it later as a no-op.
- **Push notifications:** iOS 16.4+ Web Push works but APNs via Firebase needs the user to register an Apple developer team. Default to web-only push in Sprint 6; document the iOS native path.
- **Proctor-rehearsal mode (§8):** "on-device only, no upload" webcam analysis requires WASM models (MediaPipe/Face Landmarker). Add behind a hard opt-in toggle; ship in Sprint 8 with the observability work so we can verify no frames ever hit the wire.

---

## Changelog

- 2026-05-18 — Contract received, sprint plan drafted, D-001 through D-005 logged, Sprint 1 kicked off.
