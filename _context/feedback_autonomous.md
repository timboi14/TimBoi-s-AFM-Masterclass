---
name: Autonomous execution and auto-deploy preference
description: Auto-mode + standing authorization to commit and push to main (auto-deploys to Vercel)
type: feedback
originSessionId: 96f1ab60-e31d-4cdf-a393-48188a813fee
---
User runs in Auto mode and explicitly invites broad redesigns ("you have liberty to fix the existing designs and improve").

**Standing authorization (granted 2026-05-06):** for THIS repo only, after completing any working change, commit and push directly to `main` without asking. Vercel auto-deploys from main, so push = ship to https://timboi14masterclass.vercel.app/.

Why: User wants iterations live ASAP and doesn't want to babysit the deploy step. They prefer reacting to live changes over reviewing diffs.

How to apply:
- Skip EnterPlanMode unless the change is destructive or genuinely ambiguous.
- After verifying with `npm run build`, stage relevant files, commit with a clear message, and `git push`.
- Still NEVER skip hooks (`--no-verify`), force-push, or run destructive git ops (`reset --hard`, `branch -D`, etc.) without explicit per-instance permission.
- Still flag truly destructive operations (rm -rf, dropping data, etc.) before doing them.
- This authorization is repo-scoped (TimBoi's Academy). Don't generalise it to other projects without a fresh ask.
