# Google voice integration

Added server-side Gemini TTS to the shared Voice & reading controls. Four opt-in Google voices: Kore, Puck, Charon and Aoede. Existing browser reading, microphone, full-question coverage and hint gates remain. Google mode sends selected text to Google; the interface explains this. The production key is stored as a Vercel Secret, never in repository or client bundles.

The endpoint uses Gemini 3.1 Flash TTS Preview via Interactions, with store=false. Text is split into sequential chunks without truncation, with pause/resume/stop and five audio chunks cached in page memory. Durable Upstash quotas fail closed: 100,000 input characters per IP per UTC day and 250,000 across the site. Quotas count attempted generation, including provider failures. These are usage bounds, not an exact monetary budget. Browser voices remain available after provider or quota errors. Google speech requires the hosted site; offline ZIP uses browser speech.

Validation: production build and server TypeScript check passed. Seventeen focused classroom/voice/API checks passed, including all 42 full source questions. Cloud playback tests use mocked audio; live provider verification is recorded separately after deployment.

Sources: https://ai.google.dev/gemini-api/docs/speech-generation and https://ai.google.dev/api/interactions-api
