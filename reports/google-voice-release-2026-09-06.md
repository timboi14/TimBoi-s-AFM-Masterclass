# Google voice integration

Added server-side Gemini TTS to the shared Voice & reading controls. Four opt-in Google voices: Kore, Puck, Charon and Aoede. Existing browser reading, microphone, full-question coverage and hint gates remain. Google mode sends selected text to Google; the interface explains this. The production key is stored as a Vercel Secret, never in repository or client bundles.

The endpoint uses Gemini 3.1 Flash TTS Preview via Interactions, with store=false. Text is split into sequential chunks without truncation, with pause/resume/stop and five audio chunks cached in page memory. Durable Upstash quotas fail closed: 100,000 input characters per IP per UTC day and 250,000 across the site. Quotas count attempted generation, including provider failures. These are usage bounds, not an exact monetary budget. Browser voices remain available after provider or quota errors. Google speech requires the hosted site; offline ZIP uses browser speech.

Validation: production build and server TypeScript check passed. Seventeen focused classroom/voice/API checks passed, including all 42 full source questions. Cloud playback tests use mocked audio; live provider verification is recorded separately after deployment.

Sources: https://ai.google.dev/gemini-api/docs/speech-generation and https://ai.google.dev/api/interactions-api

Follow-up: settings now synchronize between the academy page and embedded classroom. Three Google-specific tests pass, including cancellation while generation is pending. Production GET confirms Gemini configuration, but actual generation currently returns 503 because the pre-existing Upstash host does not resolve. Browser reading remains operational. Upstash account sign-in is needed to restore the quota connection; Google audio has not yet been verified live.

## 6 September 2026 — quota decoupling and reading-panel fixes

Google speech no longer depends on a reachable Upstash instance. Every Google request in production was returning `503 Speech quota service unavailable`, so the natural voices were selectable but never produced audio and every read fell back to a browser voice. `/api/speech` now treats the durable counter as the preferred layer and drops to a best-effort per-isolate budget — 20,000 characters per IP and 50,000 in total per isolate per UTC day — when the store is absent or unreachable, logging `[speech] durable quota unavailable`. Genuine limit breaches still return 429 in both modes, so a dead quota store throttles speech instead of disabling it.

A dead store answered in roughly 0.4 s per call, which would otherwise have been added ahead of every chunk of a long read, so three consecutive failures now park the durable check for 60 seconds before it is retried.

This is a deliberate change of posture: the best-effort ceiling is per isolate, not a durable site-wide guarantee, so worst-case spend scales with however many edge isolates are warm. Restoring Upstash, or setting a spend cap on the Gemini key, returns the hard bound. `GET /api/speech` now reports `durableQuota` so the active mode is visible, and `available` no longer requires the quota variables.

The reading panel no longer reopens itself. `expand()` forced the panel visible on every read, so minimising it was undone by the next Read aloud press. An explicit collapse is now remembered until the reader opens the panel again. The MutationObserver's self-filter also failed to recognise its own work — text-node targets are not elements, and inserted Read-aloud buttons are reported against the host element — so the expensive full-document decorate pass ran far more often than needed. Browser reading now splits on sentence boundaries rather than a blind 260-character cut, removing mid-clause pauses.

Validation: production build and 30/30 Playwright checks pass, including new regression tests for the minimised panel and for best-effort quota exhaustion. Verified live after deploy on 6 September 2026: `POST /api/speech` returns 200 `audio/wav` — 4.72 s of 24 kHz mono speech, peak amplitude 25435, 87% non-silent — and selecting Google · Kore in the reading panel plays it end to end. The panel also stays minimised through a read on production. `durableQuota` still reports true because the dead Upstash variables remain set; the circuit breaker absorbs them, so removing those variables or capping the Gemini key is still the outstanding choice.
