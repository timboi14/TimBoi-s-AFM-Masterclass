# Cleanup baseline — pre-Phase-A snapshot

**Date:** 2026-05-14
**Branch:** `main`
**HEAD:** `7941409` — "Spurs visuals: per-route banner art + bobbing mascot in active nav pill"
**Working tree:** clean

## Stack adaptations from spec

The orchestration spec assumes pnpm + Next.js. This repo is npm + Vite + React Router. Adaptations applied to every subagent prompt:

| Spec | This repo |
|---|---|
| `pnpm` | `npm` |
| `pnpm dlx <tool>` | `npx <tool>` |
| `app/` directory entrypoints | `src/main.tsx` → `src/App.tsx` (BrowserRouter) |
| `next.config.*` | `vite.config.ts` |
| `pnpm test` | no test suite (skip in Phase C gate) |
| `pnpm typecheck` | `npx tsc -b --noEmit` |
| `pnpm lint` | no eslint configured (skip lint gate; subagents can install temporarily for inspection but must not commit the config) |
| `pnpm build` | `npm run build` (which runs `tsc -b && vite build`) |

## Snapshot metrics

### Source size
- **Files:** 85 `.ts`/`.tsx` files under `src/`
- **Lines:** 18,026 total

### Dependencies (`package.json`)
- **Production (13):** `@fontsource/anton`, `@fontsource/dm-sans`, `@fontsource/jetbrains-mono`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `framer-motion`, `lucide-react`, `react`, `react-dom`, `react-router-dom`, `sonner`, `tailwind-merge`
- **Development (10):** `@types/node`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `autoprefixer`, `postcss`, `tailwindcss`, `typescript`, `vite`, `vite-plugin-pwa`

### Last build (artifacts in `dist/assets/`)
- Main bundle: **669.7 KiB** (gzip ~228 KiB per most recent vite output)
- CSS: 96.5 KiB
- Largest lazy chunks: `PastPapers` 92.3 KiB, `Practice` 82.7 KiB
- Self-hosted fonts: ~30 KiB per woff2

### Type-check
- `tsc -b --noEmit` (via `npm run build`) is **clean** — last build succeeded with no TS errors

### Static assets
- `public/spurs/` — 11 PNGs, ~63 MB total. Known oversized; flagged in `7941409` commit message for follow-up optimization. Not part of this cleanup pass unless agent 3 can confirm any are unreferenced.

## Reports namespace

All Phase-A reports live in `reports/<n>-<slug>.md`. The directory is added to `.gitignore` only for the duration of the cleanup pass; the orchestrator will commit final reports as part of Phase C.
