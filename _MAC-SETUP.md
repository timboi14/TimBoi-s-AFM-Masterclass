# TimBoi's AFM Masterclass — MacBook setup & deploy guide

This zip is a **complete, self-contained copy** of the project, including the `.git`
folder. That means it is already a working git repository wired to the same GitHub
remote and Vercel project as the Windows PC — so you can edit and ship the live site
(<https://timboi14masterclass.vercel.app/>) entirely from the Mac, even with the PC off.

- **Live site:** <https://timboi14masterclass.vercel.app/>
- **GitHub remote (origin):** <https://github.com/timboi14/TimBoi-s-AFM-Masterclass>
- **Branch that deploys:** `main` — Vercel auto-builds and deploys on every push.
- **Stack (canonical):** Vite 5 + React 18 + TypeScript + Tailwind 3 + Framer Motion + React Router (PWA).
- **Stack (migration target):** Next.js 15 App Router lives in `apps/web/` (strangler-fig; not yet canonical). See `_context/project_master_build_contract.md`.

---

## 1. One-time setup on the Mac

1. **Install Node 20+** (the repo builds on Node 20/22). Easiest via Homebrew:
   ```bash
   brew install node            # or: brew install node@22
   node -v                      # confirm v20+ 
   ```
2. **Unzip** this bundle somewhere permanent, e.g. `~/Projects/TimBoi-AFM`.
3. **Install dependencies** (the zip intentionally excludes `node_modules` — reinstall fresh):
   ```bash
   cd ~/Projects/TimBoi-AFM
   npm install
   ```
4. **Confirm git is connected** (it already is — `.git` travelled in the zip):
   ```bash
   git status            # should say "On branch main", clean
   git remote -v         # should show origin -> github.com/timboi14/TimBoi-s-AFM-Masterclass
   git pull              # grab anything newer than this snapshot
   ```
   If git asks for credentials when you push, sign in to GitHub (a Personal Access
   Token or the `gh` CLI `gh auth login` is the simplest). Account: **timboi14**.

---

## 2. Run the site locally

```bash
npm run dev          # Vite dev server, usually http://localhost:5173
```

Other scripts (see `package.json`):

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build (`tsc -b && vite build`) into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run icons` | Regenerate PWA icons |
| `npm run sitemap` | Regenerate the sitemap |
| `npm run check:bundle` | Verify the deployed bundle |
| `npm run test:e2e` | Playwright E2E tests (`npx playwright install` first) |

The **Next.js migration app** is separate and has its own deps:
```bash
cd apps/web
npm install
npm run dev          # next dev
```

---

## 3. Edit → deploy the live website

Vercel watches `main`. To ship a change:

```bash
git add <files>
git commit -m "your message"
git push              # -> Vercel auto-builds and deploys to timboi14masterclass.vercel.app
```

Watch the build at <https://vercel.com> (project dashboard). There is **no manual
deploy step and no GitHub Action** — pushing to `main` is the entire deploy.

---

## 4. Gotchas carried over from the Windows machine

(Full detail in `handoff.md` — read its "Don'ts" section before big changes.)

- **Don't replace `tba_*` localStorage shapes without migration logic** — real study
  progress lives in the browser. Use `src/lib/safe-storage.ts` helpers.
- **Don't generate a literal "Tottenham Hotspur" badge/wordmark** — trademark.
- **Don't merge the two `Paper` interfaces** (`src/data/papers/` vs `src/data/pastpapers/`).
- **Don't push the old Workbox config back** — `skipWaiting + clientsClaim + NetworkFirst nav`
  in `vite.config.ts` is load-bearing for deploy hygiene.
- **Never reintroduce billing / tiers / paywalls / Stripe / upgrade copy** — permanent ban
  (personal-use app). See `_context/project_master_build_contract.md`.
- **No CI / no ESLint config committed / no test suite gate** yet — known debt (`handoff.md`).
- Several Windows-specific PowerShell one-liners in `handoff.md` use full `npm.cmd` paths —
  on Mac just use plain `npm` / `npx` / `node`.

---

## 5. What's in this bundle

```
.git/                  full history + origin remote (this is what lets you deploy)
src/                   the live Vite SPA (pages, components, lib, data)
api/                   serverless functions (coach.ts, mark.ts, health checks)
apps/web/              Next.js 15 migration target (own package.json)
packages/              ai-eval, db (Drizzle) workspaces
public/                static assets incl. optimized Spurs art (webp/avif/png)
reports/               codebase-cleanup discovery + execution reports
scripts/               icon/sitemap/image/bundle-check node scripts
vercel.json            deploy config: rewrites + security headers + CSP + caching
vite.config.ts         build + PWA (Workbox) config
DECISIONS.md           project decision log
handoff.md             detailed operator handoff (read this to resume cold)
README.md              project overview
_context/              roadmap + standing-preference notes (see below)
_MAC-SETUP.md          this file
```

`_context/` holds the canonical roadmap and standing decisions (exported from the
Windows machine's Claude memory):
- `project_master_build_contract.md` — the authoritative 24-section roadmap.
- `project_timboi_academy.md` — project overview.
- `user_design_taste.md`, `feedback_autonomous.md`, `feedback_coach_model_answers.md` — working preferences.
- `MEMORY.md` — index of the above.

Excluded from the zip (regenerate on the Mac): `node_modules/`, `dist/`, `.vite/`,
local editor/tooling caches.
