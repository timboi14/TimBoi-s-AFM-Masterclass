---
name: TimBoi's Academy project
description: ACCA AFM exam-prep React/Vite app deployed to Vercel, gamified, single-developer
type: project
originSessionId: 96f1ab60-e31d-4cdf-a393-48188a813fee
---
TimBoi's Academy is a single-developer React 18 + Vite + Tailwind app for ACCA Advanced Financial Management (AFM) exam prep, deployed at https://timboi14masterclass.vercel.app/.

Architecture:
- React Router pages: Home, Topic, Theory, Cards, Mock, Formulas, ExamSkills, Practice, Memory.
- Local-only state via `localStorage` through `src/lib/store.ts` (no backend, no auth).
- Coach AI is a local rule-based KB in `src/lib/coach-ai.ts` with optional remote fallback via `VITE_COACH_API_URL`.
- Voice features (Web Speech API) live in `src/lib/voice.ts` and the global `CoachVoice` FAB.
- Football/Spurs theme (Anton display font, green #00a347 + gold #f5b800).
- Target sitting: June 2026 (countdown is hard-coded in Home.tsx).

Why: It's a personal study tool for the user (and friends) — every UX decision should optimise for *passing the exam*, not generic engagement.

How to apply: When asked to add features, prefer in-browser implementations that work offline. Don't add backend dependencies, paid APIs, or signup flows. Memorisation/coach features should default to local KB + Web Speech API rather than calling an LLM.
