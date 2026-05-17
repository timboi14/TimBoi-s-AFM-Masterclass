# `apps/web` — Next.js 15 strangler-fig migration target

Per **DECISIONS.md D-001**, the canonical production build remains the Vite
SPA at the repo root. This directory is the parity destination: pages port
over here, and once every route is at pixel-parity Vercel's project root
flips from the repo root to `apps/web`.

## Why a sibling, not a rewrite

A direct big-bang rewrite would risk multi-day downtime during the user's
June 2026 sitting prep window. Strangler-fig lets the live site stay green
while Next.js fills in route by route.

## What's here

| Path | Purpose |
|---|---|
| `package.json` | Next 15 + React 19 + TS strict + the Sprint-3+ deps (Drizzle, Argon2, libsodium, Sentry, PostHog, HyperFormula, TipTap, Yjs). |
| `next.config.mjs` | App Router, typed routes, security headers, `serverExternalPackages` for native deps. |
| `tsconfig.json` | `strict: true`, `noUncheckedIndexedAccess: true`, paths to root packages. |
| `tailwind.config.ts` | Mirror of the root Tailwind tokens — pixel-parity guarantee. |
| `src/app/layout.tsx` | Root layout, metadata, icons, manifest. |
| `src/app/page.tsx` | Home parity stub. Real port lands once primitives are extracted. |
| `src/app/not-found.tsx` | 404. |

## First-time setup

```bash
cd apps/web
npm install          # pulls Next.js, React 19, Drizzle, Argon2, libsodium, etc.
cp .env.local.example .env.local   # then paste DATABASE_URL etc.
npm run dev          # http://localhost:3000
```

`npm install` here pulls a lot — Argon2 and libsodium build native bindings
on first install. Expect a 2-3 minute setup. The deps are intentionally not
installed by the root `package.json`, so the existing Vite build stays fast.

## Promoting Next.js to canonical

When every route in the Vite app has a parity equivalent here AND Lighthouse
mobile cold scores match the §16 budget (LCP <1.8s, INP <200ms, CLS <0.05):

1. Verify on a Vercel preview branch (`apps/web` as project root).
2. Switch the production project's root directory to `apps/web` in Vercel.
3. Move `vercel.json` headers + rewrites into `apps/web/next.config.mjs`.
4. Delete the Vite tree in a follow-up cleanup commit.
