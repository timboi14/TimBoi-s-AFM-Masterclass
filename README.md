# TimBoi's Academy — ACCA AFM Pass Engine

A single-folder, zero-build, gamified study site for ACCA Advanced Financial Management (AFM).
Built around the AFM Masterclass notes, real ACCA examiner reports, Andrew Mower's published
exam tips, and the Acowtancy course structure.

Open [`index.html`](index.html) in any browser. No server, no build, no signup.

## Pages

| File | What it does |
|------|--------------|
| [`index.html`](index.html) | Hub — 12 fixtures, syllabus map (A · B · C · D/E), 12-week plan, news, leaderboard |
| [`topic.html`](topic.html) | Per-topic page — Notes · Formulas · Worked examples · Drills · Pitfalls (open with `?t=npv` etc.) |
| [`cards.html`](cards.html) | Flip-card flashcards across 5 decks (biases, z-scores, hedging, formulas, pitfalls) |
| [`mock.html`](mock.html) | Mock-exam mode — 90-min Section A · 8-min Quickfire · 45-min Section B · Weak-area drill |
| [`formulas.html`](formulas.html) | Printable one-page formula sheet (Ctrl+P) |
| [`exam-skills.html`](exam-skills.html) | Coach's playbook — command words, time mgmt, ESG marks, 12 rules |

## Topics covered (12 fixtures)

**Section A — Senior Financial Adviser**
1. Senior Financial Adviser & Governance
2. Behavioural Finance & M&A Biases

**Section B — Advanced Investment Appraisal**
3. Cost of Capital — WACC, CAPM, M&M2
4. NPV — Inflation, Tax & Project CF
5. Risk Analysis — VaR (★) · Monte Carlo · MIRR
6. APV — Adjusted Present Value
7. Real Options — Delay · Expand · Abandon
8. Business Valuation — DCF · FCF · Multiples
9. Islamic Finance & Ethical Funding

**Section C — M&A and Reconstruction**
10. M&A · Reorganisation · Buybacks

**Section D/E — Treasury & Risk Management**
11. FX Risk Hedging — MMH · Forwards · Futures · Options
12. Interest Rate Hedging — FRA · Swap · Futures · Options · Greeks

## Features

- **Past-paper drills** — 24 worked drills with full numerical model answers (Mar/Jun 2023, Sep/Dec 2024, etc.)
- **Gamification** — points, streaks, squad tier (Academy → Spurs Legend), confetti, leaderboard, weakness tracker
- **Coach FAB** — floating button surfaces a contextual tip based on your weakest topic
- **Web-Audio sound** — beeps, cheer, whistle, chant; toggleable, no autoplay
- **Mobile-first** — 44px touch targets, sticky blurred nav, responsive bento layouts
- **Print-ready** — formula sheet inverts to ink-on-paper for clean printing
- **Local-only** — all progress in `localStorage`, no servers, no signup

## Tech

- HTML + Tailwind (Play CDN) + shadcn-flavored component CSS
- Vanilla JS — no framework, no build step
- Font Awesome 6 + Google Fonts (Bebas Neue, Inter)

## Sources

- [AFM Masterclass notes (109 pages)](AFM_Masterclass.md)
- [ACCA AFM technical articles](https://www.accaglobal.com/an/en/student/exam-support-resources/professional-exams-study-resources/p4/technical-articles.html)
- [ACCA AFM examiner reports](https://www.accaglobal.com/gb/en/student/exam-support-resources/professional-exams-study-resources/p4/examiners-reports1.html)
- [Andrew Mower — AFM Exam Tips](https://andrewmower.com/acca-afm-exam-tips-pass-advanced-financial-management/)
- [Acowtancy AFM exam centre](https://www.acowtancy.com/exams/acca-afm/)

---

> "Practise calculations until they're muscle memory." — Coach TimBoi
