# Site Map: TimBoi's Academy — ACCA AFM Pass Engine

**Project Title:** TimBoi's Academy
**Project ID:** _(set this when first Stitch project is created)_
**Source Repo:** https://github.com/timboi14/TimBoi-s-AFM-Masterclass
**Vibe (one line):** A gamified, sport-stadium-themed AFM masterclass — dark navy with neon gold, masterclass content, examiner-tested rigour.

---

## Generation Order (stitch-loop priority)
The loop should generate screens in this order so later screens can reuse the design tokens established by Home.

| # | Page | File | Role | Status |
|---|------|------|------|--------|
| 1 | Home | `home.md` | Hub · the front door · sets the design tokens | **Generate first** |
| 2 | Topic Detail | `topic.md` | Per-fixture deep-dive (Notes · Formulas · Worked · Drills · Pitfalls) | After Home |
| 3 | Theory Q&A | `theory.md` | 64 frequently-asked theory cards · search & filter | After Home |
| 4 | Mock Exam | `mock.md` | Sit a timed mock — 4 modes including Sep/Dec 2025 real paper | After Home |
| 5 | Flashcards | `cards.md` | 3D flip-card drill across 5 decks | After Home |
| 6 | Formula Sheet | `formulas.md` | Printable one-page cheat sheet | After Home |
| 7 | Exam Skills | `skills.md` | Coach playbook · 12 rules · ESG · timeline | After Home |

---

## 1 · Home (the Hub)

**Audience:** Working ACCA AFM student on commute or after-work study.
**Primary goal:** Get the user one click into productive study within 5 seconds of landing.
**Primary CTA:** "Random drill" or "Sit a mock".
**Status hierarchy:** Profile → Headline drills (NEW) → Syllabus map → 12 fixtures → 12-week plan → Hot topics → News → Leaderboard.

**Key components:**
- Sticky glass nav with crest "TBA" + 7 nav links
- Aurora gradient + pitch-grid background (subtle)
- Profile card (gold glow ring) with greeting · 4 stat tiles · animated progress bar · sound toggle
- Live news ticker strip (gold dashed border, animated scroll)
- **Headline drills row** — 2 large cards: Sep/Dec 2025 official paper · 64 Theory Q&A goldmine
- Syllabus map (4 cards: Section A · B · C · D/E) with topic chips
- **Group Stage** — 12 fixture cards in bento grid, each shows: matchday ribbon · paper refs · title · spurs angle · meta chips · innovation note · mnemonic
- 12-week pre-season plan (3-col grid)
- Hot topics for next sitting (3-col grid · 12 cards · gold tag)
- News flash grid (2-col)
- Stadium leaderboard (table with rank styles · current user highlighted in gold)
- Floating gold coach FAB (bottom-right)

**Data dependencies:**
- `state` from localStorage: name, points, level, streak, solved, leaderboard
- `TOPICS` (12), `NEWS` (10), `HOT_TOPICS` (12), `DAILY_PLAN` (12), `SEP_DEC_2025`, `THEORY_QA` (64)

**Empty / first-visit state:**
- Name overlay modal asking for fan name → all metrics show 0 → ticker still scrolls
- Hot topics + headline drills always visible (regardless of state)

---

## 2 · Topic Detail

**Audience:** Student in deep study on a specific syllabus area.
**Primary goal:** Master one topic via notes → formulas → worked examples → drills → examiner pitfalls.
**Primary CTA:** "Open drill" buttons inside Drills tab.

**Key components:**
- Same nav as Home
- Topic chip switcher (12 chips, active highlighted)
- Hero card with: paper-references badge · syllabus section badge · title · Spurs angle · mnemonic line
- Quick-fact chip grid (5–8 chips per topic)
- 5 tabs (Notes · Formulas · Worked Examples · Drills · Pitfalls) — pill-style tab list, active state has card-on-muted lift
- Drill cards expand into a centred modal dialog with timer, scenario, requirement, tags, reveal button, "I got it" / "I missed it" actions
- Prev / Next fixture buttons at bottom

**URL parameter:** `?t=adviser|behav|coc|npv|risk|apv|real|val|islam|mna|fx|ir|random`

---

## 3 · Theory Q&A

**Audience:** Student grinding for discussion-mark fluency.
**Primary goal:** Search and read 64 frequently-asked theory answers, expand bullet-point format.

**Key components:**
- Search input with magnifier icon, gold focus ring, live keyword highlight in results
- 12 category pills (All · BSOP · APV · Risk · Valuation · M&A · FX · IR · Islamic · Behavioural · Treasury · Other) with counts
- Q&A accordion cards: numbered gold pill + question + chevron arrow
- Expanded answer in pre-wrapped multiline format with bullet points and gold key terms

---

## 4 · Mock Exam

**Audience:** Student doing a timed exam-realistic run.
**Primary goal:** Pick a mode and start the clock without friction.

**Key components:**
- Pre-mock card with 4 mode tiles in 2×2 grid:
  1. **Sep/Dec 2025 official paper** (gold-bordered card, FIRE icon — Drimpton/Marnhall/Passmore)
  2. Full mock — Lillywhite Plc 90-min Section A
  3. Quickfire — 5 random drills, 8 minutes
  4. Section B — pick a topic (45 min)
  5. Weak-area training (coach picks)
- Active mock view: sticky timer bar (gold border, red pulse when <5min), question body, scratchpad textarea (auto-saved per session), reveal button, self-mark scoreboard

---

## 5 · Flashcards

**Audience:** Student wanting fast spaced-repetition style drill on biases / formulas / z-scores.
**Primary goal:** Flip cards rapidly, accumulate points.

**Key components:**
- Deck switcher pills (Biases · Z-scores & VaR · Hedging steps · Killer formulas · Examiner pitfalls)
- Centre-stage 3D flip card with perspective + transform-style preserve-3d
- Front: gold "BIAS" / "CARD" label · big display title · prompt · keyboard hint
- Back: gold "ANSWER" label · same title · multi-line answer · ref tag
- Bottom row: Prev · Flip · Next · Shuffle buttons
- Deck progress bar
- Keyboard navigation (← → SPACE S)

---

## 6 · Formula Sheet

**Audience:** Student doing exam-week formula recall.
**Primary goal:** Print to A4 OR scan on screen.

**Key components:**
- Print-ready CTA with print button
- 9 formula cards in a 2-col grid (NPV/Inflation · Cost of Capital · APV · FX · IR · Options/BSOP · M&A/Valuation · Risk/VaR · Bonds/Duration · Ratios)
- Z-table (one-tail vs two-tail) in a single mono code block
- "Spot the trap" cheat-cheat list with bolded gold lead-ins
- All page chrome hidden in print mode (white-on-black inverts to ink-on-paper)

---

## 7 · Exam Skills (Coach Playbook)

**Audience:** Student learning the exam-technique meta-game.
**Primary goal:** Internalise the 12 rules and the minute-by-minute Section A timeline.

**Key components:**
- "Exam at a glance" 6-card grid (Section A · Section B · Total · Marks split · Open book? · Time per mark)
- 12 numbered rule cards in 2-col grid (each with body + tip in gold left-border block)
- Command-word decoder table
- Section A minute-by-minute vertical timeline (gold dot bullets on a vertical line)
- Professional skills 4-pillar grid (Communication · Analysis · Scepticism · Commercial Acumen)
- ESG marks grid (Issue · Action · Outcome — 3 cards)
- Common traps grid by topic (8 cards)
- 7-days-before-exam checklist

---

## Cross-cutting elements (must appear on every page)

- **Sticky nav** — same 7 links, active page highlighted in gold
- **Crest** — "TBA" gold-fill rounded square
- **Stats meters** — 4 stat tiles (Points · Tier · Streak · Drills)
- **Progress bar** — animated shine effect, ratio fills to next tier
- **Coach FAB** — bottom-right floating gold disc with graduate-cap icon, bobs every 4s
- **Toast** — top-centre slide-in with gold accent on success
- **Confetti** — full-screen canvas, gold/white/navy particles on goal
- **Name overlay** — modal asking for fan name on first visit
- **Aurora background** — fixed radial gradients (gold top-right, navy bottom-left)
- **Pitch-grid background** — fixed 80px grid with circular mask, very low opacity

---

## Design tokens summary (from `.stitch/DESIGN.md`)

| Token | Value | Role |
|---|---|---|
| `--background` | `hsl(230 60% 5%)` `#070b22` | Deep-navy canvas |
| `--card` | `hsl(226 48% 12%)` `#131938` | Elevated surface |
| `--primary` | `hsl(43 96% 56%)` `#fbbf24` | Gold — primary action |
| `--success` | `hsl(152 70% 42%)` `#10b981` | Goal / win |
| `--destructive` | `hsl(0 72% 56%)` `#ef4444` | Miss / time-up |
| `--ring` | `hsl(43 96% 56%)` | Gold focus halo |
| `--radius` | `0.875rem` | Generous rounding |
| Display font | `Bebas Neue` | Match-day signage |
| Body font | `Inter` | Readable on commute |
| Mono font | `JetBrains Mono / ui-monospace` | Worked examples & numbers |
