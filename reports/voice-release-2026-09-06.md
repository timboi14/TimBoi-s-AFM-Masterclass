# Browser voice accessibility — 6 September 2026

## Shipped scope

Shared Voice & reading controls are installed across the academy, both classrooms, and all classroom HTML papers/reference pages. Text blocks have Read aloud controls; selected text and chosen editable fields can also be read. Playback includes available voice selection, website voice preference, preview, rate, pause/resume/repeat/stop and state feedback.

Read full question consumes the complete original source for each of the 42 classroom questions, in order, with labelled table rows/columns. Exhibit selectors allow targeted playback. The existing past-paper viewer and exam reader load a matched full source before enabling full reading; unmatched papers clearly report that only the site's available context is supplied. Question playback excludes teaching-hint/solution fields.

Microphone access is explicit, feature-detected and separate from playback. Commands and dictation are distinct modes. Dictation supports notes, answer fields, text/search/email/telephone/URL fields and rich-text editors; password and non-text fields are excluded. Text uses the existing save behavior. Commands respect disabled attempt gates. Reading stops recognition; Commands can pause this reader and resume with the microphone off. Navigation and visibility changes stop voice activity. Academy and embedded classroom voice controls coordinate with the existing Coach.

## Verification

- Production TypeScript/Vite/PWA build passed; all four engine-marker checks passed.
- 26 regression checks verified: 25 passed in the final full run; one existing spreadsheet caret test timed out during a run reporting 1.7 hours elapsed, then passed separately in 6.5 seconds.
- Ten new tests cover playback controls and rate, no automatic microphone start, locked hints, final-only dictation, command/dictation separation, full paragraph/table-cell coverage across all 42 source questions, Northney / Sep-Dec 2024 original source and exhibit selection, unsupported APIs, permission refusal, navigation shutdown, mobile layout, rich-text/form persistence and cross-frame microphone handoff.
- Voice tests mock browser speech APIs. They validate state transitions and complete spoken text, not actual microphone recognition accuracy, audio output or voice quality.
- Mobile reading panel and classroom desktop/mobile visuals inspected. Original classroom styling and shared progress regressions pass.
- The offline ZIP includes both classroom appearances and shared voice assets. Local-file recognition support depends on the browser; no offline recognition guarantee is made.

## Boundaries

Browser voices and recognition support vary by browser/OS. Recognition may use the browser provider's online service. This feature saves no audio and adds no paid API or conversational AI backend. Existing Codex voice handover remains the route to adaptive tutoring. Full official answer/mark-scheme gaps remain explicitly documented in the answer-source materials.
