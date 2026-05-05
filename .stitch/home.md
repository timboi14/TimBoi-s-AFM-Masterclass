# Stitch Prompt: Home Screen — TimBoi's Academy

> Use this prompt when calling `generate_screen_from_text` for the Home page.
> All design tokens MUST match `.stitch/DESIGN.md` (the source of truth).

---

A cinematic, gamified, dark-mode study dashboard for ACCA Advanced Financial Management (AFM). The atmosphere is "stadium under floodlights at night" — disciplined and exam-grade, but pulsing with the energy of a match-day. Imagine if a Premier League fan-club app, a Bloomberg terminal, and a masterclass syllabus had a child. Confident asymmetric layouts, calibrated gold accents on deep navy, perpetual micro-motion. The user lands and feels: *"I can pass this exam, and the next click is obvious."*

**DESIGN SYSTEM (REQUIRED — see `.stitch/DESIGN.md` for full tokens):**
- Platform: Web, desktop-first, mobile-perfect (44px tap targets, single-column collapse <768px)
- Palette: Deep Navy Canvas (`#070b22`) for page background · Elevated Navy Card (`#131938`) for surfaces · Spurs Gold (`#fbbf24`) for primary action and hero highlights · Stadium White (`#f8fafc`) for primary text · Steel Slate (`#94a3b8`) for muted text · Emerald Goal (`#10b981`) for win states · Match-Day Red (`#ef4444`) for time-up / destructive
- Typography: `Bebas Neue` (display, track-tight, weight 900, all-caps for headlines and big numbers) · `Inter` (body, weights 400–700) · `JetBrains Mono` for numerical workings
- Roundness: Generously rounded corners (14–18px on cards, pill-shaped badges, full-circle FAB)
- Elevation: Diffused, never harsh — gold-tinted glow ring on the hero card; soft 24px shadows on bento tiles; sticky nav uses backdrop blur 16px + 85%-opacity navy
- Motion: Spring physics (stiffness 100, damping 20). Perpetual micro-loops — animated gold shine on the progress bar, ticker scrolling continuously, gold FAB bobbing every 4s, news-strip "LIVE" dot pulsing

**ATMOSPHERE KEYWORDS:** dark mode · stadium under floodlights · gamified · masterclass · editorial · gold accents · asymmetric grids · perpetual micro-motion · sport-luxe · examiner-grade rigour · dopamine-rich

---

## PAGE STRUCTURE

### 1. Sticky Glass Navigation
- Sticky to top with 8px offset and backdrop-filter blur 16px on a navy 85% panel
- Left: square gold gradient crest with "TBA" in Bebas Neue 18px (the academy mark) — gold rim, navy text on gold fill
- Brand block: line 1 in Bebas Neue 22px "TimBoi's <gold>Academy</gold>" · line 2 in Inter 11.5px muted "ACCA AFM pass engine · masterclass-driven · gamified" with a small "COYS" gold-bordered chip (cockerel emoji + COYS)
- Right cluster (right-aligned, 7 links): Home · Topics · Theory · Cards · Mock · Formulas · Skills — each is a pill with icon + label, active page has a gold fill with navy text

### 2. Hero Profile Card (Gold-Glow Ring)
- Large rounded card with a subtle 1px gold inner ring + 30px-blur outer gold shadow at 45% opacity (the `card-glow` style)
- Top-left badge: "Match-day brief" pill with a tiny gold dot bullet
- Headline (Bebas Neue 44px, track-tight): "Welcome back, <gold>{{playerName}}</gold>"
- Body (Inter 14px, max 65ch, muted slate): "Built around the AFM Masterclass: 12 fixtures cover the full A–E syllabus. Each fixture has rich notes, worked examples, drills, examiner pitfalls and a coach. Today's mission: open ONE fixture, finish ONE drill — that's a goal."
- CTA row (3 buttons): primary gold "Random drill" with shuffle icon · outline "Sit a mock" with stopwatch · ghost "Coach's playbook" with trophy
- Right-edge: a Sound toggle — pill switch with volume icon
- 4 stat tiles below in a single row (responsive 2×2 on mobile):
  - Points · Bebas Neue gold number 32px — gradually counts up from 0
  - Squad tier · 1 + small label "Academy"
  - Streak · 0 + "days"
  - Drills won · 0/24
- Animated gold-shine progress bar with `LVL 1 · ACADEMY · 0%` overlaid in navy

### 3. Live News Ticker Strip
- Single dashed-gold-border row, navy 4% fill, with a red "LIVE" badge (pulsing white dot) on the left
- Continuously scrolling text right-to-left at 80s loop, paused on hover, gold-bolded key facts every ~30 chars
- Sample items: "TimBoi's Academy · 12 fixtures · 24 past-paper drills · Section A mock" · "Examiner whisper: <gold>real vs nominal mix</gold> = #1 marks-loser (Mar/Jun 24)" · "95% one-tail z = <gold>1.645</gold>" · "Mower: 1.8 minutes per mark — if stuck, MOVE"

### 4. Headline Drills (NEW FOR MAR 2026)
Section title in Bebas Neue 24px with a gold flame icon and a primary-gold "For Mar 2026 sitting" badge. Two large fixture cards in a 2-column grid:
1. **Sep/Dec 2025 OFFICIAL ACCA paper card** — gold border + extra glow. Ribbon corner says "NEW". Subtitle "Drimpton · Marnhall · Passmore". Body "The actual Sep/Dec 2025 ACCA paper, with full official model answers. Drimpton (50m, NPV+ESG), Marnhall (25m, M&A synergy), Passmore (25m, FX hedge)." Meta chips: "Real exam" (primary gold) · "100 marks" · "Timed" · "Official model answers".
2. **64 Theory Q&A goldmine card** — ribbon "64 Q&A". Subtitle "Discussion-mark goldmine". Body "30+ marks per paper come from theory. This bank covers BSOP, APV, M&A, FX, IR, Islamic, Behavioural, Treasury and more — searchable, filterable bullet-point answers from real ACCA past-paper solutions." Meta chips: "Search · Filter" · "11 categories" · "+5 pts per card".

### 5. Syllabus Map (4-card grid)
Section title "Syllabus map" with a sitemap icon and outline badge "A · B · C · D/E". Four cards each with a 4px coloured left border:
- A · Senior Adviser & Behavioural — gold border, chips for "adviser" + "behav"
- B · Investment Appraisal — sky-blue border (`#3B82F6`), chips for coc/npv/risk/apv/real/val/islam (7 chips)
- C · M&A & Reconstruction — violet border, chip "mna"
- D/E · Treasury & Risk Mgmt — emerald border, chips fx + ir
Each chip is a clickable badge that becomes gold-filled when all drills in that topic are won.

### 6. Group Stage — 12 Fixtures Bento
Section title "Group Stage" with a trophy icon, a primary-gold badge "12 Fixtures", and a right-aligned muted hint "Notes · Worked examples · Drills · Pitfalls".
A bento grid of 12 cards (responsive: 2 cols on tablet, 1 on mobile, 3 on wide desktop). Each fixture card:
- Top-right ribbon "MD 1" through "MD 12" (matchday number) in primary gold with navy text
- Pre-title small gold meta line: paper references e.g. "Sep/Dec 2024 Q3 · Mar/Jun 2023 Q3"
- Title in Bebas Neue 22px (white): topic name, e.g. "NPV — Inflation, Tax & Project CF"
- Description in Inter 13px muted slate: the Spurs angle one-liner
- Meta chip row: "X drills" (or "X/Y won" in primary gold if any solved) · "Section B" · "Notes" · "X worked"
- Innovation card inside the fixture: dashed gold border, navy 4% fill, Inter 12px with the 2025-angle blurb (gold-bolded label)
- Bottom: small gold key-icon line for the mnemonic
- Hover: card lifts 3px, border goes gold 40%, a gold radial glow appears in the top-right corner

### 7. 12-Week Pre-Season Plan
Section title "12-week pre-season plan" with calendar icon + outline badge "Compress to 6 if you commute". A 3-column grid of 12 small cards. Each card:
- Bebas Neue 18px gold title "Week 1" through "Week 12"
- Inter 13px body explaining that week's focus
- Bottom: row of small outline buttons linking to the relevant topic / mock / skills page

### 8. Hot Topics for the Next Sitting
Section title "Hot topics for the next sitting" with a bolt icon + outline badge "Tutor-curated revision priorities". A 3-column grid of 12 hot-topic cards. Each card:
- Top: gold-fill primary badge with the tag (e.g. "STAR", "BLOCKBUSTER", "ESG (NEW)", "TREASURY")
- Bebas Neue 18px gold title (e.g. "Project VaR & multi-period scaling")
- Inter 13px body with the punch-line — never generic, always specific
- Bottom: muted footer line "🔥 Tested 8 of last 10 sittings" — gold flame icon, muted text
- Whole card is a link to the relevant `topic.html?t=...` or `mock.html`
- Hover: lifts 2px, gold 50% border

### 9. News Flash (Real-World AFM)
Section title with newspaper icon + outline badge "Real-world AFM". 2-col grid of 10 news cards. Each card:
- 4px gold left border, navy elevated fill
- Top: primary-gold pill tag (e.g. "IR SWAPS · 2024", "FX RISK · 2024", "ESG · 2025")
- Bebas Neue 15px headline
- Inter 12.5px body — the news story in 2 sentences
- Bottom outline button: "AFM angle: Mar/Jun 2024 Q1 — currency options vs MMH" with arrow icon, links to the relevant fixture

### 10. Stadium Leaderboard
Section title with ranking-star icon + outline badge "Local · no servers". A card with a 5-row table:
- Columns: Rank (Bebas Neue 22px, gold for #1, silver #2, bronze #3) · Fan name · Points · Streak (with 🔥) · Drills
- Current user row highlighted in gold + small star icon
- Footer row: shield icon + "Saved on this device only" muted text · right-aligned destructive small button "Reset progress"

### 11. Footer
- Dashed gold horizontal rule
- Centred muted text: "Built for the commute. Past papers > generic theory."
- Centred gold quote: "Practise calculations until they're muscle memory. — TimBoi"

### 12. Floating Coach FAB (always visible)
- Bottom-right, 60px circle, primary gold fill, 3px navy border, a 30px gold blur shadow + 1px gold ring
- Centred white graduate-cap icon
- Bobs vertically -6px every 4s ease-in-out
- On click → opens a speech-bubble (top-left of FAB) with personalised tip from Coach (gold border, gold left-pointing arrow, max 320px wide)

---

## SUGGESTED SCREEN VARIANTS TO ALSO GENERATE
1. Logged-out / first-visit overlay — name capture modal centred on a 92%-opacity navy backdrop with backdrop-blur 12px
2. Mobile portrait at 375px — same content stacked vertically, nav becomes overflow row, bento becomes single column
3. Coach speech bubble open — show the FAB with a sample tip "Mower says: When hedging an FX receipt, BORROW the foreign currency now and DEPOSIT in £..."

---

## OUTPUT EXPECTATIONS
- HTML must be self-contained and render with Tailwind Play CDN + Google Fonts (Bebas Neue + Inter + JetBrains Mono) + Font Awesome 6
- All interactive elements must have visible focus rings (2px gold, 2px offset)
- Must respect `prefers-reduced-motion` — disable continuous loops if set
- Mobile-first collapse at <768px to single-column with full-width cards
- Min 44px tap targets on every link/button
