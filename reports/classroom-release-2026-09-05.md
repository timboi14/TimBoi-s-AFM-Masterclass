# Classroom release verification — 5 September 2026

- Production build passed (TypeScript, Vite, PWA generation).
- All 13 Playwright regression tests passed, including two new classroom tests.
- Verified attempt-first hints, 44 lessons, 42 library rows, day filtering, timer countdown, voice handover, persisted attempt/confidence, backup download and restore, invalid-format rejection, mobile overflow, real PPTX download and source paper delivery.
- Existing four deployed-bundle engine marker checks passed locally.
- All 14 published source Markdown files match their supplied originals byte for byte.
- All local HTML material links resolve; editable deck contains 44 slides.
- All 44 rendered slides individually inspected. Presentation package/layout checks and first-party import passed; native PowerPoint execution not tested.
- Scope of answer verification is documented in the classroom's answer-sources materials. Full official solutions and official marking schemes are not claimed for all papers.
- Hosted progress uses the site's origin. The offline ZIP uses file-origin browser storage; users transfer progress by backup/restore.

The /classroom header scrolls normally so it cannot cover controls inside the embedded room. Other academy routes retain the sticky header. Only classroom static responses permit same-origin framing; the global frame-denial policy is preserved elsewhere.
