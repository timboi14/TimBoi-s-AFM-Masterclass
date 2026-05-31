# Subagent 5: Weak types — execution report

Cleanup pass completed on branch `cleanup/5-weak-types`, fast-forward merged to `main`. Eight commits, all type-check clean (`tsc -b --noEmit` exit 0) and full `npm run build` green. All 34 REPLACEABLE sites and the 8 GENUINELY UNKNOWN sites from `reports/5-weak-types.md` are addressed via `src/lib/guards.ts` (errorMessage / readEnum) and `src/vite-env.d.ts` (ImportMetaEnv augmentation plus vendor declarations for the Web Speech API, which lib.dom in TS 5.9 does NOT ship — only the `SpeechRecognitionResult*` subset is present, so I added minimal `SpeechRecognition` / `SpeechRecognitionEvent` / `SpeechRecognitionErrorEvent` declarations). The 5 JUSTIFIED `TonePill` casts are untouched. No deferred sites. Final commit list:

- `173ac75` cleanup(5-weak-types): add vite-env.d.ts with VITE_COACH_API_URL
- `97b0aa7` cleanup(5-weak-types): add guards.ts with errorMessage and readEnum
- `64d646d` cleanup(5-weak-types): type Web Speech API in voice.ts
- `a775830` cleanup(5-weak-types): type the sheet-engine parser as ExprValue
- `be82ce2` cleanup(5-weak-types): tighten three one-line weak casts
- `f44f643` cleanup(5-weak-types): drop page-level any casts in Mock and Revision
- `cd5400c` cleanup(5-weak-types): narrow Practice and Theory casts
- `4df923c` cleanup(5-weak-types): narrow Debrief critique catch with errorMessage

Final `tsc -b --noEmit`: exit 0 (no output).

Final `npm run build` (last 5 lines):

```
PWA v1.3.0
mode      generateSW
precache  53 entries (1374.32 KiB)
files generated
  dist/sw.js
```

Branch merged with `--ff-only` from `c059525` to `4df923c`; `cleanup/5-weak-types` deleted. `main` is 8 commits ahead of `origin/main` (orchestrator to push).

Notable deviation from the discovery report: `Revision.tsx:182` resolved via narrowing state to a new local `PaperTypeFilter = 'all' | 'real' | 'specimen' | 'tba-original'` type (matching the chip list) rather than widening the chips, per the spec's pragmatic-fix direction.
