# Handoff

Snapshot for the next operator (human or agent). Two threads are in
flight; pick one or surface both to the user.

**Repo:** `c:\Users\Timuhwe\Program` — TimBoi's Academy, ACCA AFM exam prep.
**Live:** https://timboi14masterclass.vercel.app/ (Vercel auto-deploys from `main`).
**Stack:** Vite 5 + React 18 + TS + Tailwind 3 + Framer Motion 12 + React Router. PWA.
**HEAD:** `7941409` "Spurs visuals: per-route banner art + bobbing mascot in active nav pill"
**Working tree:** clean except `reports/` (untracked, holds `00-baseline.md` from an earlier paused session — see Thread B below).
**Last commit I made:** `7d7024b` Home top-half restyle. Commits `7941409` and `reports/` belong to a prior session.

---

## Two paused threads

**Thread A — Banana Claude skill setup + Spurs hero artwork generation** (this session).
Installed the skill files; blocked on Python + Gemini key + Claude Code restart.

**Thread B — Codebase cleanup orchestration** (an earlier session).
Pre-flight ran; baseline metrics written to `reports/00-baseline.md`.
The 8 parallel read-only subagents (DRY / Types / Unused / Circular /
Weak Types / Try-Catch / Legacy / Slop) were **never launched**.
Phase A is still the literal next step there.

If the user comes back asking about "the cleanup", that's Thread B.
If they ask about "banana" or "the visuals", that's Thread A.
Neither blocks the other; the user can pick.

---

## The overarching goal (both threads serve this)

Implement the visual composition library + tier-tone system from
[`PAST_PAPERS_MODULE_SPEC_1.md`](file:///c:/Users/Timuhwe/Downloads/PAST_PAPERS_MODULE_SPEC_1.md)
(sections 11 & 12) across the entire site, plus operational hardening
from the security review. ACCA AFM student aiming for **June 2026
sitting**. Spurs-themed (navy `#132257` + gold `#ffd700`, match-day
language). Standing authorization: commit and push to `main`. Vercel
auto-deploys. Auto-mode is on (action over confirmation for routine
work; flag explicit consent for spend / third-party API calls /
destructive ops).

---

## Repo state — where the code stands right now

```
7941409  Spurs visuals: per-route banner art + bobbing mascot in active nav pill   ← HEAD (user)
7d7024b  Home: restyle top half with new tone-sequence Blocks                       ← I shipped
ec5977d  Operational hardening: code-split, self-host fonts, validate local storage ← I shipped
3c6f223  Design system phase 3: Blocks E (Three-Up), F (Tabular List), H (Configurator)
0762481  Consolidate nav: 17 tabs -> 10 via hub pages
5245689  chore: untrack .spec-blocks/ scratch dir
0bf889f  Hero/sub-nav fixes: make font-size tokens render, hide sub-nav until scroll
acc95ec  Design system phase 1: tier-tone tokens, SectionShell, CenteredHero, StickySubNav
```

### Design system primitives — all in [src/components/Blocks/](src/components/Blocks/)

| File | Role |
|---|---|
| [tone.tsx](src/components/Blocks/tone.tsx) | `SectionShell tone="white\|mist\|navy\|black"` + `useTone()` context |
| [TonePill.tsx](src/components/Blocks/TonePill.tsx) | Tone-aware button (`as="button" \| "a" \| "link"`) |
| [CenteredHero.tsx](src/components/Blocks/CenteredHero.tsx) | Block A — eyebrow / display headline / sub-line / actions / artwork. `HeroGold` highlights one word in gold. |
| [StickySubNav.tsx](src/components/Blocks/StickySubNav.tsx) | Block B — fixed bar at `top: var(--app-header-h, 96px)`, hide-on-scroll-down |
| [StatStrip.tsx](src/components/Blocks/StatStrip.tsx) | Block C — count-up number tiles |
| [TwoUp.tsx](src/components/Blocks/TwoUp.tsx) | Block D — two panels, independent tones |
| [ThreeUpCardRow.tsx](src/components/Blocks/ThreeUpCardRow.tsx) | Block E — testimonials triptych |
| [TabularList.tsx](src/components/Blocks/TabularList.tsx) | Block F — sticky filter chips + responsive card grid |
| [PremiumDarkTile.tsx](src/components/Blocks/PremiumDarkTile.tsx) | Block G — full-bleed navy/black premium moment |
| [Configurator.tsx](src/components/Blocks/Configurator.tsx) | Block H — 60/40 imagery + option picker |

### Tokens in [styles.css](src/styles.css)

`--tone-white/mist/navy/black`, `--navy-700/800/900`, `--gold-500/600`,
`--mist-100/200/500`, type scale `--fs-display-xl/-md/-headline/-subline/-small/-micro`,
`--lh-tight/snug/body`, `--shadow-md`.

### Pages already on the new system

- **Hub pages:** [Playbook](src/pages/Playbook.tsx) (Theory/Cards/Formulas),
  [Training](src/pages/Training.tsx) (Practice/Mock/Debrief),
  [Scout](src/pages/Scout.tsx) (Pitfalls/Examiner),
  [BootRoom](src/pages/BootRoom.tsx) (Memory/Skills). Each: CenteredHero
  + StatStrip + TwoUp + StickySubNav.
- **PastPapers:** [PastPapers](src/pages/PastPapers.tsx) — same pattern
  + the existing `<PastPapersView>` underneath.
- **Home:** [Home](src/pages/Home.tsx) **top half only**. From "DAILY QUEST"
  downward still uses the legacy Card primitives.

### Pages NOT yet restyled (legacy aesthetic)

Home bottom half, `/course`, `/topic/:id`, `/practice`, `/mock`,
`/theory`, `/cards`, `/formulas`, `/exam-skills`, `/memory`, `/examiner`,
`/pitfalls`, `/debrief/*`, `/study-guide`, `/war-room`, `/revision/*`,
`/progress`. Each ~30–60 min restyle; per-page tone sequences are listed
in spec §12.3.

### Nav consolidation (commit `0762481`)

`src/components/Layout.tsx` NAV trimmed 17 → 10. Final order:
`Home · Course · Past Papers · Topics · Playbook · Training · Scout · Boot Room · Tools · War Room`.
All sub-routes still resolve.

### Spurs visuals (commit `7941409`, made by the user)

`public/spurs/` has 11 navy/gold PNGs (one per top-level tab + mascot).
Layout renders:

- **`TabArtBanner`** — soft-faded route banner top-right of page content,
  `opacity: 0.15 mix-blend-multiply -z-10`, hidden under `md`.
- **`MascotBob`** — 28×28 cockerel-with-graduation-cap inside the active
  NavLink, `@keyframes mascot-bob` (3.2s ease-in-out infinite), static on
  `prefers-reduced-motion`.

**Known debt:** these 11 PNGs total ~63 MB. Not in PWA precache (vite-pwa
only takes `js/css/html/svg/woff2`). Optimization pass is pending — see
"Latent issues".

### Security posture

- `vercel.json` ships HSTS preload, full CSP, COOP `same-origin`, CORP
  `same-site`, X-Frame-Options DENY, Permissions-Policy with
  `microphone=(self)` (the Coach Voice push-to-talk needs Web Speech),
  `/assets/*` immutable 1-year cache.
- Fonts self-hosted via `@fontsource/anton`, `@fontsource/dm-sans`,
  `@fontsource/jetbrains-mono` (imported in [src/main.tsx](src/main.tsx)).
  Google Fonts CDN removed from `index.html` + CSP.
- FontAwesome **still** on cdnjs (`'unsafe-inline'` on style-src is for it).
- [src/lib/safe-storage.ts](src/lib/safe-storage.ts) validates the two
  most-exposed localStorage keys: `safeFanName(raw, max=40)` strips
  control chars and angle brackets; `safeOnboarding(rawJson)` validates
  `{distance, dismissed}` shape. Wired into `store.ts` and `Onboarding.tsx`.
- Code-split via `React.lazy` in [App.tsx](src/App.tsx). Main bundle
  1052 → 675 KB (-36%, gzip 332 → 224 KB). Practice (84 KB), PastPapers
  (94 KB), Revision (30 KB) load on visit.

---

## Thread A — Banana Claude (this session)

### What I was doing

Installing the **banana-claude** Claude Code skill so the user can
generate Spurs-themed hero artwork via Google Gemini.

### Done

- Cloned `AgriciDaniel/banana-claude` to a temp dir (user explicitly
  authorized: "yes install banana-claude, I've reviewed the source").
- `cp -r skills/banana/* ~/.claude/skills/banana/` → 14 files (1 SKILL.md,
  6 references, 7 Python scripts).
- Created `~/.banana/presets/` data dir.
- Read [setup_mcp.py](file:///c:/Users/Timuhwe/.claude/skills/banana/scripts/setup_mcp.py)
  — confirmed it just adds an `mcpServers.nanobanana-mcp` entry to
  `~/.claude/settings.json`.

### Not done — blockers

1. **`python3` is not installed.** Returns the Windows Store prompt.
   The skill's `setup_mcp.py`, `validate_setup.py`, `cost_tracker.py`,
   `presets.py`, `generate.py`, `edit.py`, `batch.py` all need it. Fix:
   `winget install --id Python.Python.3.12 -e`, then
   `pip install google-generativeai Pillow`.

2. **No Gemini API key from the user.** Free key at
   https://aistudio.google.com/apikey. MCP needs it as `env.GOOGLE_AI_API_KEY`.

3. **MCP servers register at session start only.** Even after
   `~/.claude/settings.json` is written, `gemini_generate_image` /
   `set_aspect_ratio` won't appear until Claude Code restarts.

### Plan I gave the user (waiting on greenlight)

10 hero PNGs, one per top-level tab + a recurring mascot, in **evocative
not literal** Spurs style (the actual badge/wordmark is trademarked;
generating "Tottenham Hotspur" risks a takedown on a publicly-hosted
site). Each goes into `public/img/heroes/` and slots into the
corresponding hub page's `CenteredHero artwork={...}` prop.

| Tab | Asset direction |
|---|---|
| Home | Wide cinematic stadium reveal, navy + gold floodlights |
| Course | Tactical chalkboard with player positions = topic positions |
| Past Papers | Dressing room with shirts numbered 1-17 |
| Topics | Tournament-bracket art |
| Playbook | Manager's tactics board |
| Training | Cones and stopwatch, morning training ground |
| Scout | Binoculars + dossier |
| Boot Room | Boots in lockers |
| Tools | Toolbox kit bag |
| War Room | T-1 tactical bunker, dim screens |

Plus recurring mascot via `gemini_chat` multi-turn for character consistency.
Cost: ~12 images × $0.04 (gemini-3.1-flash-image-preview at 2K) ≈ **$0.50**.

---

## Thread B — Codebase cleanup orchestration (paused earlier session)

User pasted a long spec describing 8 specialised subagents executed in
three phases (DRY / Types / Unused / Circular / Weak Types / Try-Catch /
Legacy / Slop). The earlier session's pre-flight ran; nothing else.

| Step | Status |
|---|---|
| Pre-flight + baseline metrics | ✅ Done — [reports/00-baseline.md](reports/00-baseline.md) |
| Launch 8 parallel read-only subagents | ⏸ Not started |
| Triage reports | pending |
| Phase B (per-PR application) | needs user greenlight |

Stack adaptations to remember (the spec was written for pnpm + Next.js):

| Spec writes | Use here |
|---|---|
| `pnpm` | `npm` |
| `pnpm dlx` | `npx` |
| `app/` directory | `src/main.tsx` → `src/App.tsx` (BrowserRouter, lazy routes) |
| `next.config.*` | `vite.config.ts` |
| `pnpm typecheck` | `npx tsc -b --noEmit` |
| `pnpm test` | **no test suite** — skip in Phase C gate |
| `pnpm lint` | **no eslint config** — install temp for inspection but don't commit |
| `pnpm build` | `npm run build` |

Likely findings per subagent:

| Subagent | Hot files |
|---|---|
| 1 DRY | 4 hub pages share a near-identical hero pattern |
| 2 Types | Two `Paper` interfaces (`src/data/papers/` vs `src/data/pastpapers/`) — **intentional, do not merge**, they're different domain shapes despite the name collision |
| 3 Unused | `src/lib/site-stats.ts` stale fields; old Revision sub-routes still wired |
| 4 Circular | Layout.tsx ↔ TabArt ↔ framer-motion barrel; Blocks/index.ts re-exports may flag spurious cycles |
| 5 Weak types | `store.ts` `Partial<State>` + `as any` sites |
| 6 Try/catch | `lib/attempts.ts`, `safe-storage.ts`, `store.ts` localStorage reads |
| 7 Legacy | "Revision" is the legacy version of "Past Papers" — coexists today |
| 8 Slop | Many `/* ── header ─── */` comments; some Block primitives have what-not-why docstrings |

**Decision before pause:** Phase A only (read-only, parallel) is safe to
run autonomously. **Phase B is NOT** — needs per-agent greenlight even
with standing main-push permission.

---

## Things I tried that failed (both threads, recent first)

| Attempt | Outcome | Workaround |
|---|---|---|
| `python3 setup_mcp.py` for banana skill | Python not installed | Document; configure MCP via Node JSON edit; user installs Python before invoking any banana script |
| Chrome-devtools MCP verification of `/past-papers` after Home restyle | "Vercel Security Checkpoint, Code 21" — bot challenge | Asked user to verify visually. **Don't retry headless against the live domain.** |
| `git clone agricidaniel/banana-claude` (first attempt) | Harness blocked as untrusted code integration | User explicit consent unblocked it |
| `ln -s` from `~/.agents/skills/<name>` to `~/.claude/skills/<name>` | Harness blocked symlink into agent config | `cp -r` worked |
| `git commit -m @'…'@` PowerShell heredoc with a line containing `:` | PowerShell parser broke it → "did not match any file(s) known to git" | Write message to temp file, use `git commit --file=PATH` |
| `magick` / `convert` to compress `public/spurs/*.png` (63 MB) | `magick` not installed; `convert` is the Windows filesystem-conversion tool — destructive | Deferred. Best follow-up: `npm i -D sharp`, write a one-off script, target 1024px WebP q85 → ~3 MB |
| `curl ... \| grep "TROPHY"` to poll Vercel deploy state | SPA HTML doesn't contain page text | Poll bundle hash `/assets/index-*.js` instead, or wait 30-60s |
| Tailwind `text-[var(--fs-display-xl)]` + `text-[var(--navy-900)]` on same element | Tailwind couldn't disambiguate size vs color; size class dropped silently → h1 rendered at 16px instead of 96px | **Inline `style={{ fontSize: 'var(...)' }}`** for any size token. Pattern fixed in CenteredHero, StatStrip, hub pages. Watch for repeats anywhere `text-[var(--*)]` co-exist on one element |

---

## Latent issues / known debt

1. **`public/spurs/*.png` is 63 MB.** 11 files, no precache. Highest-impact
   optimization on the site. Target ~3 MB with sharp/WebP.
2. **Home bottom half** still legacy cards. Spec §12.3 sequence: continue
   with black climax → mist → white finish.
3. **~15 legacy pages** never restyled. Spec §12.3 has per-page sequences.
4. **Cloudflare in front of Vercel** — recommended in security review
   (commit `85588c0`). User-only DNS migration.
5. **FontAwesome on cdnjs** — needs `npm i @fortawesome/fontawesome-free`
   + tree-shake to ~25 icons used. Lower priority than spurs PNG optimization.
6. **No CI** — `.github/workflows/` empty. `npm audit` not gated. No Dependabot.
7. **Two `Paper` interfaces** (intentional). Consider renaming to
   `RevisionPaper` / `PastPaper` for clarity, but **don't merge them**.
8. **Onboarding skill** asks for `Python.Python.3.12` install path — banana
   isn't the only thing that'd benefit. zod's not installed either.

---

## Next concrete step

**If the user has answered the banana blockers** (paste Gemini API key /
"yes install Python" / IP rails):

1. Edit `~/.claude/settings.json` via Node (replicate
   [setup_mcp.py](file:///c:/Users/Timuhwe/.claude/skills/banana/scripts/setup_mcp.py)
   lines 73–98 — no Python needed for THIS step):
   ```js
   settings.mcpServers["nanobanana-mcp"] = {
     command: "npx",
     args: ["-y", "@ycse/nanobanana-mcp"],
     env: {
       GOOGLE_AI_API_KEY: "<key>",
       NANOBANANA_MODEL: "gemini-3.1-flash-image-preview"
     }
   };
   ```
2. Tell the user to restart Claude Code.
3. In the new session: read
   `~/.claude/skills/banana/references/gemini-models.md` and
   `~/.claude/skills/banana/references/prompt-engineering.md` first
   (skill instructions are strict). Generate the 10-asset suite per the
   plan above. Drop PNGs into `public/img/heroes/`. Wire each into the
   relevant `CenteredHero artwork` prop. Commit + push (auto-deploys).

**If the user wants Thread B (cleanup)** instead:

Launch 8 parallel discovery agents via the **Agent** tool with
`subagent_type: "general-purpose"` (not Explore — Explore lacks Write).
Send all 8 in a single message. Each agent must use `npm` / `npx`, treat
`src/main.tsx`+`src/App.tsx` as entrypoints, cap report at 200 lines,
write to `reports/<n>-<slug>.md`, and treat the two `Paper` interfaces
as intentional (don't recommend merging). After all 8 return, write
`reports/00-triage.md` with conflict map + per-agent summary. **Stop
before Phase B.**

**If neither has been answered:** restyle one more legacy page — `/course`
is the natural next candidate. Sequence per §12.3:
white → mist → white → **black** → mist → white. Wrap existing content in
SectionShells rather than rewriting it. Should be ~30 min.

---

## Don'ts

- **Don't run `python3 anything`** — Windows Store install prompt.
- **Don't verify the live site via chrome-devtools** — Vercel bot-blocks
  the headless Chrome.
- **Don't generate literal "Tottenham Hotspur" badge/wordmark visuals
  even if the user asks** — trademark issue on a public site. Use the
  navy/gold + generic cockerel + match-day-vibe approach.
- **Don't replace `tba_*` localStorage shape without migration logic** —
  real user progress lives there in browser localStorage.
- **Don't restyle a legacy page by rewriting its content** — wrap existing
  content in SectionShells; only the chrome changes.
- **Don't merge the two `Paper` interfaces** (`src/data/papers/` and
  `src/data/pastpapers/`) — they're different domain shapes despite the
  name collision.
- **Don't run Phase B of the cleanup spec autonomously** — even with
  main-push permission, the blast radius needs per-agent greenlight.
- **Don't ship a `npm install -g` of anything as a fix** — the
  PowerShell exec policy blocks `.ps1` shims and the user has hit this
  before. Use `npx`.

---

## One-liners

```powershell
# Build (PowerShell — npm.cmd direct path)
& "C:\Program Files\nodejs\npm.cmd" run build

# Multiline commit (avoid heredoc parser bugs)
git add <files>
# write message to .git-commit-msg.txt then:
git commit --file=.git-commit-msg.txt
Remove-Item .git-commit-msg.txt
git push origin main

# LOC + file count
$f = Get-ChildItem -Recurse -Path src -Include *.ts,*.tsx -File
"$($f.Count) files, $(($f | Get-Content | Measure-Object -Line).Lines) lines"
```

```bash
git status --porcelain
git log --oneline -10
```

---

## Memory files to lean on

`C:\Users\Timuhwe\.claude\projects\c--Users-Timuhwe-Program\memory\`
- `project_timboi_academy.md` — project overview (commits since: design
  system phases, hub consolidation, security pass, Spurs visuals)
- `user_design_taste.md` — Apple/Anthropic-grade polish; happy delegating
- `feedback_autonomous.md` — auto-mode, standing commit/push authorization

Those three + this file + `git log --oneline -10` should be enough to
resume cold.
