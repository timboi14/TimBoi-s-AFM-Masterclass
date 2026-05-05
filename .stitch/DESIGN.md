# Design System: TimBoi's Academy
**Project ID:** _(set this when first Stitch project is created)_
**Source Repo:** https://github.com/timboi14/TimBoi-s-AFM-Masterclass
**Source Files:** `shared.css`, `index.html`, `topic.html`, `theory.html`, `mock.html`, `cards.html`
**Generated:** 2026-05-04 from current production CSS

---

## Configuration — Stitch Style Dials

| Dial | Level | Why |
|---|---|---|
| **Creativity** | `8` | Editorial gamified vibe — bold headline typography, gold-on-navy, asymmetric hero. Not minimal, not chaotic. |
| **Density** | `5` | Balanced — meters and hot-topic grids are dense; hero and section titles are airy. |
| **Variance** | `7` | High — bento fixtures, asymmetric hero, varied card widths. Avoid the "3 equal cards" trap. |
| **Motion Intent** | `6` | Subtle perpetual loops (gold shine on progress bar, FAB bob, ticker scroll, LIVE-dot pulse). Spring physics, never linear. |

---

## 1 · Visual Theme & Atmosphere

A cinematic, gamified, dark-mode study dashboard that feels like **a stadium under floodlights at night** — disciplined and exam-grade, but pulsing with match-day energy. The mood blends three references:
- The hush of a Bloomberg terminal (data-dense, monospace numbers, calibrated colour)
- The pomp of a Premier League fan-club app (gold accents, ribbons, chant motifs)
- The rigour of a masterclass syllabus (typography hierarchy, examiner-grade content)

Every interaction should reinforce that the user is on a high-stakes journey with a coach in their corner. Gold is reserved for **earned progress** and **primary action** — never decoration. Navy is the canvas on which work happens.

---

## 2 · Color Palette & Roles

### Core surfaces
- **Deep Navy Canvas** (`#070b22` · `hsl(230 60% 5%)`) — Page background. Almost-black navy that absorbs light. Never pure black.
- **Elevated Card** (`#131938` · `hsl(226 48% 12%)`) — Card and dialog fill. Slightly bluer than canvas to lift visually.
- **Popover** (`#172048` · `hsl(226 48% 14%)`) — Modal / coach-bubble surface. One step brighter than card.
- **Accent Surface** (`#1a2249` · `hsl(222 50% 18%)`) — Tab inactive state, subtle hover background.
- **Muted** (`#1a2249` · `hsl(226 30% 18%)`) — Progress-bar track, button-ghost hover.

### Accents (Spurs spine)
- **Spurs Gold** (`#fbbf24` · `hsl(43 96% 56%)`) — **PRIMARY ACTION** + earned progress. Used for: primary buttons, active nav pill, progress-fill, ribbons, FAB, stat values, ticker key terms, hero headline highlight, coach bubble border. Never used as decoration.
- **Gold Glow** (`hsla(43 96% 56% / 0.18)`) — Focus rings (3px) and gold-tinted card glow shadows.

### State colours
- **Goal Emerald** (`#10b981` · `hsl(152 70% 42%)`) — Success / answer-revealed / "I got it" / model-answer box. Ankle-band green, never lime.
- **Match-Day Red** (`#ef4444` · `hsl(0 72% 56%)`) — Destructive / time-up / LIVE dot. Saturated red for urgency.
- **Match-Day Red glow** — used on the timer pill when running.

### Text
- **Stadium White** (`#f8fafc` · `hsl(210 40% 98%)`) — Primary text, headlines, big numbers.
- **Slate Body** (`#cbd5e1` · `hsl(215 20% 80%)`) — Body copy on cards.
- **Steel Muted** (`#94a3b8` · `hsl(215 20% 65%)`) — Subtitles, tertiary, timestamps, helper text.

### Borders
- **Whisper Border** (`hsla(226 35% 22%)` · `#1f2a55`) — Standard 1px card borders.
- **Gold Border** (`hsla(43 96% 56% / 0.4)`) — Hover state on fixtures, hot-topic cards.
- **Strong Gold** (`hsl(43 96% 56%)`) — Active card-glow, dialog border.

### Banned colours
- **Pure black** (`#000`) — always Deep Navy Canvas.
- **Purple/violet "AI gradient"** — banned anywhere.
- **Lime / neon green** — only Goal Emerald is allowed.
- **Pure white surfaces** — always navy-tinted.
- **Mixed warm/cool grey systems** — single-zinc family only.

---

## 3 · Typography Rules

### Font families
- **Display** — `Bebas Neue` (Google Fonts). Used for: page titles, big numbers in stat tiles, fixture titles, hero greeting, section titles, hot-topic headlines. Weight 400 (single weight). Letter-spacing `0.04em–0.08em` (slightly wide for sport-signage feel). Line-height `1.05`.
- **Body** — `Inter` (Google Fonts). Weights 400 / 500 / 600 / 700 / 800 / 900. Default size 15px, line-height 1.6. Used for: paragraphs, subtitles, button labels, badges, navigation.
- **Mono** — `ui-monospace`, `JetBrains Mono`, `Consolas` fallback stack. Used for: formulas, worked-example pre blocks, scratchpad textarea, formula sheet print code blocks, mono numbers in worked answers.

### Scale
- Hero greeting: Bebas Neue `clamp(2.25rem, 5vw, 2.75rem)` — `40–44px`
- Section title: Bebas Neue `24px`, letter-spacing `0.06em`
- Card title: Bebas Neue `22px` (fixture), `20px` (formula card), `18px` (rule card)
- Body: Inter `15px / 1.6`, max 65ch
- Muted hint / footer: Inter `12.5px`, color steel-muted
- Stat value: Bebas Neue `32px`, color gold
- Stat label: Inter `10.5px`, uppercase, letter-spacing `0.12em`, color steel-muted
- Code/formula block: Mono `12.5px / 1.65`, gold-tinted text on near-black background

### Banned fonts
- `Times New Roman`, `Georgia`, `Garamond`, `Palatino` — banned. If serif ever needed, use `Fraunces` or `Instrument Serif` only.
- Generic browser stacks — every page must explicitly load Bebas Neue + Inter from Google Fonts.

### Special rule
When a number is part of a calculation or worked example, it switches to mono — never Inter. Big stat values stay Bebas Neue.

---

## 4 · Component Stylings

### Buttons (`.btn`)
- Min height 44px (touch-target compliant). Border radius `calc(var(--radius) − 4px)` = `~10px`.
- Variants: `.btn-primary` (gold fill + navy text + 8px gold-25% drop shadow), `.btn-outline` (transparent with whisper border, gold border on hover), `.btn-ghost` (transparent muted text with accent-surface hover), `.btn-destructive` (red fill).
- Hover: `translateY(-1px)`, no glow.
- Active: `translateY(0)` for tactile push.
- Disabled: 50% opacity, no transform.
- Sizes: `.btn-sm` 36px height, `.btn-lg` 48px height, `.btn-icon` 44×44px square.

### Cards (`.card`)
- Generously rounded `var(--radius)` = `0.875rem` (~14px). Padding `20px` via `.card-padding`.
- Default: navy-card fill, 1px whisper border, top 1px white-4% inset highlight, 24px-blur 60% navy outer shadow.
- Variant `.card-glow` adds a 1px gold-18% inner ring + 30px-blur gold-45% outer glow — used on the hero card and headline-drills cards.
- Hover (on `.fixture` cards): translateY(-3px), border gold 40%, a 400×200px radial gold glow appears top-right.

### Badges
- Pill-shaped. Padding `4px 10px`. Inter weight 700, letter-spacing `0.04em`, font 11px.
- Variants: `.badge-primary` (gold fill navy text), `.badge-outline` (transparent muted text whisper border), `.badge-success` (emerald fill white text), `.badge-destructive` (red fill white text).

### Tabs (`.tabs-list` + `.tab`)
- Outer pill list with 4px inner padding, muted background, 1px whisper border.
- Each tab: 36px height, 8/14 padding, font 13px weight 600, muted text color.
- Active state: card-coloured fill (lifts visually), gold text, faint inner shadow.
- Hover: text → stadium-white.

### Dialog / Modal
- Backdrop: navy 85% opacity + 8px backdrop-blur. Animation fade-in 150ms.
- Dialog body: max-width 720px, max-height 92vh, scrollable, gold border, large 40px-blur 70% navy shadow + 1px gold-12% ring.
- Header & footer sticky inside dialog with internal whisper border separators.
- Animation on open: `dialog-in` 220ms — `scale(0.96) translateY(8px)` → 1 / 0 with cubic-bezier(.2,.8,.2,1).
- Close button: 32px ghost icon top-right of header.

### Progress bar
- 14px height, 999px radius, muted track with 1px whisper border.
- Fill: linear-gradient gold → soft-gold-70% → gold, animated `shine` keyframe (3s linear infinite, 200% background-size shifting).
- Centred 10px navy-bold label "LVL 3 · FIRST TEAM · 47%".

### Toggle switch (`.toggle`)
- Pill container with min-height 44px, 32×18px inner switch.
- Off: muted track, white thumb at left.
- On: gold track, navy thumb shifted +14px.
- 180ms ease transition.

### Timer pill
- Bebas Neue 18px gold border. Two animated states: `.run` (red pulsing fill, 1s pulse keyframe), `.warn` (gold fill at <20s).

### Coach FAB
- 60px circle, gold fill, 3px navy ring, 30px-blur 55% gold glow + 8px-blur navy drop shadow + 1px gold-40% ring.
- Bobs `translateY(-6px)` every 4s ease-in-out infinite.
- Hover: scale(1.05).
- Coach bubble (popover): navy popover background, gold border, 9px gold left-pointing triangle pointer, max 320px width, slide-in via `dialog-in` keyframe.

### Toast
- Top-centre, 18px below viewport top, navy popover bg, gold border (when success), 20px-blur navy shadow.
- Slides in from -8px translateY 200ms.

### Stat tile (`.stat`)
- Card-coloured fill, 1px whisper border, 14/16 padding.
- Label: 10.5px uppercase letter-spacing 0.12em muted with optional fa icon.
- Value: Bebas Neue 32px gold, line-height 1, with optional Inter 12px steel-muted small "days" / "/24" suffix.

### Fixture card (topic tile)
- Navy card, 1px whisper border, 18px padding, position relative, overflow hidden.
- Top-right ribbon: 5/14 padding, gold fill navy text, 10px Inter 800 letter-spacing 0.12em, bottom-left-radius 12px only.
- Innovation panel inside: 9/12 padding, dashed gold-35% border, gold-6% fill, Inter 12px gold-86% text.
- Hover: translateY(-3px), border gold-40%, internal radial gold glow top-right, 24px shadow.

### News strip ticker
- 1px dashed gold-35% border, gold-4% fill, 10/14 padding.
- "LIVE" badge: red fill white text, Inter 800 11px letter-spacing 0.12em, with a 6px white pulsing dot.
- Inner ticker: flex with 56px gap, 80s linear infinite tick animation, paused on hover.

### Flashcard (cards page)
- 3D perspective 1400px on stage, transform-style preserve-3d on card.
- Flipped state via 700ms cubic-bezier(.2,.8,.2,1) `rotateY(180deg)`.
- Each face: card fill, gold 1px border, 28px padding, 30px-blur 50% navy shadow, backface-hidden.

---

## 5 · Layout Principles

- **Container max-width 1240px**, centred. Horizontal padding 16px (mobile), 32px (desktop).
- **CSS Grid first.** Bento grids: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` for fixtures and news, `minmax(220px, 1fr)` for daily plan / hot topics / stat tiles.
- **No overlapping content.** Every element has its own grid cell or flow position.
- **Section title rhythm:** every section opens with a `.section-title` (Bebas Neue 24px) + an icon + a contextual badge (primary or outline).
- **Background layers (fixed, pointer-events-none):**
  - `.aurora` — radial gradients: gold 12% top-right, blue-navy 18% bottom-left, navy-card 60% centre.
  - `.pitch-grid` — 80px CSS grid lines at white 6% opacity, masked with a centre radial fade so it disappears at the edges.
- **Sticky nav** at `top: 8px` (not 0) so the aurora bleeds in around it.
- **Generous vertical rhythm:** 28px between section title and content, 14–16px between cards.
- **Scrollbar:** custom 10px width, navy track, muted thumb with navy border ring.

### Banned layouts
- "3 equal cards in a row" repeated for whole page — variance must be present.
- Centred-only hero (use the asymmetric hero with stat tiles to the right).
- Flexbox percentage math (`calc(33% - 1rem)`) — use Grid.

---

## 6 · Hero Pattern (Home & Topic)

The Home and Topic pages use the same hero pattern:
1. **Glass nav** sticky at top.
2. **Single oversized card** with `.card-glow` (gold inner ring + outer halo).
3. **Asymmetric flex inside the card**: left column (60–70%) holds the badge → headline → body → CTA row; right column (30–40%) holds the sound toggle and (on Home) a side-pinned chip.
4. Below the flex: 4-column stat grid, then progress bar.
5. Hero never overlaps an image. Hero never has bouncing chevrons or "Scroll to explore" — banned.

---

## 7 · Responsive Rules

| Breakpoint | Behaviour |
|---|---|
| `< 640px` | Hero h1 → 24px Bebas, stat grid 2×2, nav links wrap full-width below brand, fixtures single column, FAB 56px |
| `640–768px` | Bento collapses to 2 cols, daily plan 2 cols |
| `768–1024px` | Bento auto-fill at 280px min |
| `> 1024px` | Full bento (3 cols on desktop), nav links right-aligned, hero asymmetric |

- Min 44×44px tap targets enforced on `.btn` and `.tab`.
- `prefers-reduced-motion: reduce` disables `tick`, `bob`, `shine`, `pulse` to 0.01ms.
- Body text never below 14px on any viewport. Body default is 15px.

---

## 8 · Print Rules (Formula Sheet only)

- `@media print`: aurora, pitch-grid, nav, FAB, toast, confetti, coach bubble all hidden.
- Body bg → white, text → black.
- Cards, formulas, scenarios, callouts, stat tiles → white fill, black 1px border, black text.
- Container max-width 100%, padding 8mm.
- `.no-print` class hides print-only chrome.

---

## 9 · Motion & Interaction (Code-Phase Intent)

> Stitch generates static screens. This section documents the **intended motion** so the coding agent (Antigravity / Cursor / Claude Code) implements it correctly when building the live product.

- **Physics engine:** Spring-based exclusively. Default `stiffness: 100, damping: 20`. No linear easing.
- **Perpetual micro-loops:**
  - `shine` on progress fill (3s linear infinite, gold shifting gradient)
  - `bob` on coach FAB (4s ease-in-out infinite, ±6px translateY)
  - `tick` on news ticker (80s linear infinite, ‑50% translateX)
  - `pulse` on LIVE dot + running timer (1s ease-in-out infinite)
- **Mount staggers:** lists and grids cascade with 100ms delay per index (`animation-delay: calc(var(--index) * 100ms)`).
- **Dialog open:** `dialog-in` 220ms cubic-bezier(.2,.8,.2,1) — scale(0.96) translateY(8px) → 1/0.
- **Tab switch:** content fades in 200ms ease.
- **Confetti on goal:** full-viewport canvas, 160 gold/white/navy particles with gravity 0.25, 1800ms duration.
- **Sound effects (optional, toggleable):** Web Audio API only — no audio files. beep (660Hz triangle 80ms) on tab switch, cheer (5-tone arpeggio) on reveal, chant (7-note motif) on personal best, whistle (square wave triplet) on time-up.
- **Hardware rules:** animate `transform` and `opacity` only. Never `top/left/width/height`. Grain/noise on fixed pointer-events-none layers only.

---

## 10 · Iconography

- Font Awesome 6 free (CDN). Solid style by default. Sizes 10–22px.
- Always paired with a text label on buttons (icon-only buttons must have `aria-label`).
- Gold icons in section titles and meta chips. Muted-slate icons in nav (until active state where they go gold). White icons on primary buttons.
- Custom emoji used sparingly: 🐓 (Spurs cockerel) only inside the COYS chip; trophy/fire emojis in coach bubbles (not in main UI).

---

## 11 · Accessibility

- Visible focus ring on every interactive element — `outline: 2px solid var(--ring)` (gold), 2px offset, 4px radius.
- All text meets 4.5:1 contrast on its surface. Body text against `--card`: ratio ≈ 11:1 (Stadium White on Elevated Card).
- All button hover states include a non-colour cue (transform shift).
- Tab order matches visual order. Keyboard nav on `cards.html` is documented (← / → / SPACE / S).
- All form inputs use a `<label for>` association.
- Reduced motion respected.

---

## 12 · Tone of Voice in Microcopy

- Direct and energising: "Today's mission: open ONE fixture, finish ONE drill — that's a goal."
- Examiner-grade: cite paper references explicitly ("Mar/Jun 2024 examiner: ...").
- Coach-led: tips signed "— TimBoi" or "— Coach TimBoi".
- Sport-luxe references: "match-day brief", "fixture", "matchday 1", "group stage", "club tier".
- Never: corporate-speak, hype words, AI-speak ("unleash", "supercharge", "10×"), exclamation marks in body copy.

---

💡 **Tip:** When calling `generate_screen_from_text`, paste the relevant prompt from `home.md` (or the matching page-prompt file) and append:

> *"All design tokens MUST match the Design System above (Deep Navy Canvas `#070b22` · Spurs Gold `#fbbf24` · Bebas Neue display · Inter body · 14px card radius · perpetual gold-shine progress bar · gold-glow hero card)."*

This guarantees every new screen joins the same visual language.
