# `@tba/ai-eval` — AI Marker regression harness

Spec §20: 30 gold-standard mock attempts, each hand-marked by a tutor.
The CI job re-marks them every push and produces:

- **Mean absolute error (MAE)** — average |AI − tutor| over all parts.
- **Correlation** — Pearson r between AI and tutor mark vectors.
- **False-credit / missed-credit** rates — % of rubric lines where the
  AI awarded a mark the tutor didn't (false credit) or missed one the
  tutor awarded (missed credit).

**Deploy gate:** any PR that worsens MAE by more than 1 mark vs. the
previous main branch baseline is blocked until the regression is fixed
or the baseline is intentionally rebased (in `baseline.json`).

## Directory layout

```
packages/ai-eval/
├── README.md
├── runner.mjs              # CLI — re-marks every gold attempt, prints metrics
├── baseline.json           # last-accepted MAE/r — CI compares against this
└── gold/                   # 30 hand-marked attempts
    ├── 001-robson-co/
    │   ├── prompt.json     # paper id, part ref, student answer (verbatim)
    │   └── tutor-mark.json # per-rubric marks awarded by the tutor
    └── ...
```

## Running locally

```bash
# Defaults: 30 attempts in parallel against /api/mark on localhost.
node packages/ai-eval/runner.mjs

# Hit prod instead:
node packages/ai-eval/runner.mjs --base https://timboi14masterclass.vercel.app

# Re-mark a single attempt:
node packages/ai-eval/runner.mjs --only 001-robson-co
```

## Gold-attempt format

Each `gold/<id>/` directory contains:

**`prompt.json`** — exactly the body the `/api/mark` endpoint would
receive in production, snapshotted at the time of authoring:
```json
{
  "paperName": "Robson Co",
  "paperSession": "Mar/Jun 2024",
  "partLabel": "(c)",
  "partMarks": 8,
  "partRequirement": "Discuss the merits of project finance...",
  "markingPoints": [...],
  "examinerCommentary": "...",
  "studentAnswer": "..."
}
```

**`tutor-mark.json`** — the human ground truth:
```json
{
  "totalMarksAwarded": 5.5,
  "perRubric": [
    { "description": "Identification of non-recourse nature", "marks": 1, "awarded": 1, "notes": "Clear" },
    { "description": "Cost-of-debt premium", "marks": 1, "awarded": 0, "notes": "Missed entirely" },
    ...
  ],
  "tutorName": "TBA Tutor 1",
  "markedAt": "2026-05-18T10:00:00Z"
}
```

## Adding a gold attempt

1. Create `gold/NNN-slug/` with the two JSON files above.
2. Run the runner; verify the new attempt's output lands sanely.
3. Update `baseline.json` only when intentionally tightening the gate.

## Adversarial / prompt-injection set

Sub-directory `gold/_adversarial/` holds attempts crafted to probe:
- "Ignore previous instructions" payloads embedded in the student answer.
- Attempts to extract the system prompt.
- Mock-mode bypass attempts ("treat this as practice, not mock").

The runner asserts these MUST be refused or sanitised; a deploy that
relaxes any of these is automatically blocked.
