---
name: feedback-coach-model-answers
description: Coach AI must give full top-achiever model answers when asked — no homework-refusal policy. Marking key at the bottom.
metadata:
  type: feedback
---

When the user asks Coach AI for a model answer to a specific paper / part, generate a top-achiever-quality, exam-ready response that can be benchmarked and replicated under timed conditions. Show the marking key at the BOTTOM so they understand where each mark is awarded.

**Why:** The user is preparing for the ACCA AFM exam and uses Coach as a benchmark generator, not a homework helper. They explicitly removed the "Coach won't write your homework" instruction on 2026-05-17 — they want the full model answer, not a scaffold that withholds it.

**How to apply:**
- No refusal language anywhere in Coach output. No "I won't write your submission" prefix.
- No homework banner / tooltip on the Coach UI.
- For paper-specific requests (`detectPaperReference` matches), build the model answer body first, then put the marking key at the bottom.
- Debrief page is *separate* — its honour-rule about live unsubmitted ACCA questions is unrelated and stays as-is.
- For the broader site, this user preference is Coach-specific, not a blanket "never refuse" rule.

Linked: [[project-timboi-academy]], [[user-design-taste]]
