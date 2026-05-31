---
name: master-build-contract
description: "The 2026-05-18 \"Perfection Master Build\" prompt is the canonical roadmap — backend is now sanctioned, target stack is Next.js 15 + Postgres + Drizzle"
metadata: 
  node_type: memory
  type: project
  originSessionId: bfa9e129-7723-483a-a728-76fd0d2d680d
---

On 2026-05-18 the user delivered a 24-section "Perfection Master Build" prompt as the official contract for TimBoi's Academy. Treat it as the authoritative roadmap; deviations go to `DECISIONS.md` in repo root.

**Headline change vs prior memory:** the "no backend dependencies, no signup flows" guidance is OBSOLETE. Backend is now real — Postgres (Neon/Supabase), Drizzle ORM, Redis (Upstash), Resend, auth (Argon2id + OAuth + passkeys + optional TOTP). Personal-use only — never reintroduce billing/tiers/paywalls/Stripe/upgrade/trial copy anywhere.

**Target stack:**
- Next.js 15 App Router + React 19 + TS strict (migrate from Vite SPA, preserve every page, copy block, mnemonic, examiner quote, visual rhythm).
- Postgres + Drizzle ORM. Edge for read-mostly routes; Node for AI streaming/PDF.
- Zustand (UI) + TanStack Query (server) + Yjs (collaborative docs).
- HyperFormula spreadsheet engine, TipTap word pad.
- FSRS v5 spaced repetition (Leitner kept as "Classic").
- IRT 2-PL adaptive diagnostic, Bayesian band predictor.
- Sentry + PostHog + pino structured logs.
- PWA (Workbox), real PNG/maskable icons, Web Push.
- WCAG 2.2 AA, Lighthouse ≥ 98 mobile cold.

**Identity is sacred:** Match-day / Boot Room / War Room / Scout / Group Stage / Fixtures / Drills / Stadium League Table / Dressing Room. "Lead. Justify. Quote. Comment." stays the Section A mantra.

**Why:** User wants this to become "the unambiguous best ACCA AFM study platform on earth" for their June 2026 sitting and beyond. Single-author/cohort, no commercialisation.

**How to apply:**
- New work matches the contract's acceptance criteria (§23). If something is unwise or impossible, log it in `DECISIONS.md` and ship the next-best alternative.
- Don't break the live Vite SPA during migration — strangler-fig approach: build Next.js alongside, switch routes over once at parity.
- Never reintroduce billing copy. The user's standing ban on Stripe/tiers/upgrade language is permanent.

Linked: [[project-timboi-academy]], [[user-design-taste]], [[feedback-autonomous]], [[feedback-coach-model-answers]]
