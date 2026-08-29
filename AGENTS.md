# UNBOX — Project Memory

Cross-session context for working on UNBOX. Read this first. Update it at the
end of every session (spec + conventions changes, plus a dated **Session Log**
entry).

## What UNBOX is

UNBOX is an **interactive visual learning platform** for software and computer
science concepts.

Core idea: _"Don't just learn how it works. See it."_

Tagline: **"See what's inside."**

The platform explains concepts through interactive visualizations, animations,
examples, playgrounds, and quizzes.

- Current phase: **Phase 1** (landing page foundation only).

## Tech stack

- **React** (functional components, `react@19`)
- **Vite** (build tool)
- **JavaScript** (`jsx`), not TypeScript
- **Plain CSS** (organized per-component + global design-system files)
- **Framer Motion** — animations (`framer-motion`)
- **Lucide React** — icons (`lucide-react`)

### Do NOT add (later phases / not now)
Backend, database, authentication, AI, Redux, Tailwind, Three.js, or any
unnecessary library. Keep it simple and maintainable.

## Design system

### Brand
- Futuristic, premium, technical, interactive, modern, clean.
- Restrained developer-tool aesthetic (Dark-mode theme since 2026-08-28).
- **Avoid**: neon overload, excessive glow, heavy gradients, glassmorphism,
  3D effects, excessive shadows, overly colorful UI, cyberpunk/gaming.
- Use the violet (`#7C3AED`), cyan (`#22D3EE`) and lime (`#A3FF12`) accents
  **selectively**.

### Colors (`src/styles/variables.css`)
| Token | Value |
|---|---|
| Background (`--color-bg`) | `#080B14` |
| Secondary Bg (`--color-surface`) | `#0D111C` |
| Card / Surface (`--color-white`) | `#111827` |
| Primary Accent (`--color-accent`) | `#7C3AED` (violet) |
| Secondary Accent (`--color-cyan`) | `#22D3EE` (cyan) |
| Highlight (`--color-highlight` / `--color-gold`) | `#A3FF12` (lime) |
| Main Text (`--color-navy` / `--color-text`) | `#F8FAFC` |
| Secondary Text (`--color-muted`) | `#94A3B8` |
| Border (`--color-border`) | `#1E293B` |

Note: token names are legacy (kept from light theme). Roles now:
- `--color-navy` = light text/headings; `--color-white` = dark card surface;
  `--color-gold` = lime highlight; `--color-bg` = page bg.
- Buttons: `.btn-gold` (primary CTA) is **violet**; `.btn-navy` is a subtle
  surface button; `.btn-ghost` = border + cyan hover.

### Typography
- Font: **Inter** (loaded via Google Fonts in `index.html`).
- Strong hierarchy. Hero heading large/confident but not full-screen.

### Buttons (global.css)
- `.btn` base; variants `.btn-gold`, `.btn-navy`, `.btn-ghost`.
- `btn-gold` (primary CTA) = violet accent. Subtle `translateY(-2px)` hover. Disabled state built in.

## Architecture

```
src/
├── components/
│   ├── Navbar/          Navbar.jsx + Navbar.css
│   ├── Logo/            Logo.jsx + Logo.css  (logo image + "UNBOX" wordmark)
│   ├── InteractiveDemo/ Stack visualization (InteractiveDemo.jsx + .css)
│   ├── HowItWorks/      "How UNBOX Works" steps (HowItWorks.jsx + .css)
│   ├── InteractiveShowcase/ "Concept in Motion" Binary Search viz
│   │                       (InteractiveShowcase.jsx/.css, BinarySearchVisualizer.jsx/.css,
│   │                       binarySearchSteps.js)
│   ├── LearningMethods/   "Learn it your way." learning-method cards
│   │                      (LearningMethods.jsx/.css, LearningMethodCard.jsx/.css)
│   └── ExploreConcepts/ concept cards (ExploreConcepts.jsx + .css, ConceptCard.jsx + .css)
├── pages/
│   └── Home/            Home.jsx + Home.css (hero section)
├── styles/
│   ├── variables.css    design tokens
│   ├── global.css       reset + base + shared (.btn, focus)
│   └── responsive.css   breakpoint overrides
├── App.jsx              renders <Navbar/> + <Home/>
└── main.jsx             root + style imports
```

- Keep `App.jsx` thin. Reusable components. Organized CSS.
- Semantic HTML + accessibility (real `<button>`s, accessible input, `aria` attrs).
- No React Router currently (single page).

## Logo asset

- **`public/logo.png`** — the UNBOX logo used in the navbar (via `Logo` + `/logo.png`).
  - Cropped in this session from **477×347 → 477×271** (trimmed excess bottom
    footer padding). Source original preserved at repo root: **`Unbox logo.png`** (477×347).
  - **Do not redesign, regenerate, or replace the logo.**
- The logo image is opaque (navy/orange), landscape, and sits next to an
  `UNBOX` wordmark in the navbar (Logo + text).

## Verification commands

```bash
npm install
npm run dev      # local dev on :5173
npm run build    # production build
npm run lint     # oxlint
```

## Current scope (Phase 1)

Implemented:
- Navbar (sticky, logo, links, gold "Get Started", mobile hamburger menu)
- Hero (two-column: label / heading / description / search / topic chips / CTA + interactive stack demo)
- Interactive Stack Demo ("How does a Stack work?") — PUSH / POP / RESET with Framer Motion, LIFO label, TOP indicator
- Search bar (UI only — no real search yet; placeholder "What do you want to unbox?")
- Topic chips: Arrays · Recursion · HTTP · Binary Search (fill the query, no real search)
- HowItWorks section ("How UNBOX Works") — 3 steps (Discover / Unbox / Understand) with
  Lucide icons, horizontal connector line (desktop) + vertical timeline (mobile), scroll reveals
- ExploreConcepts section (below HowItWorks) — "Explore Concepts" + 4 concept cards
  (Arrays · Binary Search · HTTP · Operating Systems), surface bg, viewport reveal + stagger,
  View All Concepts outline button
- InteractiveShowcase section — "Concept in Motion" (label `Interactive Visualization`,
  heading "See a concept unfold step by step.") — interactive **4-step Binary Search** demo
  (array [10..70], target 60, START / CHECK / NARROW / FOUND steps, LOW/MID/HIGH pointers,
  Previous / Next Step / Reset controls, "STEP n / 4" progress pill + 4 dots, dynamic step
  narration), Time O(log n) / Space O(1); right column = explanation panel (step badge →
  step heading → detail, found chip on step 4)
- LearningMethods section — "The UNBOX Experience" / "Learn it your way." / "One concept.
  Multiple ways to understand it." — 3 learning-method cards (Visualize `Eye` / Experiment
  `FlaskConical` / Test `CircleCheck`), per-card accent via inline `--card-accent` (violet /
  cyan / lime), Framer hover lift (`y:-6`) + icon scale (variant-label cascade from card
  hover), subtle accent bar; connector line `.methods__line` desktop-only (hidden ≤1024)
- **No book/card-open interaction**: the earlier ConceptBook / LearningPreview / LearningJourney
  concept is fully removed (folders deleted, grep clean across `src`). All interactions are
  standard Framer button click / hover states.

Out of scope (later phases):
- Explore page, About page, concept pages, quiz system, admin dashboard,
  authentication, backend, database, AI.

---

## Session Log

### 2026-08-28 — Interactive Showcase (verified)
- **Existing section** `components/InteractiveShowcase/` confirmed complete & working
  (already wired into `Home.jsx` between HowItWorks and ExploreConcepts; no changes
  made this session — only verified).
- **Structure**:
  - `InteractiveShowcase.jsx` — centered header (label "INTERACTIVE LEARNING" via
    CSS `text-transform: uppercase`), heading "Don't just read it. Watch it
    happen.", subtitle; explanation panel + lazy-right layout (desktop two-column,
    stacked ≤1024).
  - `BinarySearchVisualizer.jsx` — array `[10..70]`, target 60, LOW/MID/HIGH
    pointers (cyan / violet / lime-found), eliminated-cell dim/fade, found-state
    check badge, Previous / Next Step / Reset controls, subtle "Step x / 3"
    progress pill, role/aria-live + labels for accessibility.
  - `binarySearchSteps.js` — algorithm data/state separate from presentation;
    builds 3 steps (compare MID 40 vs 60 → discard lower half → found 60) with
    per-index `eliminated` masks + `narrationFor()` step copy.
- **Narration/progress states**: STEP 00 initial → "We check the middle element."
  (step 01) → "We discard the half." (step 02) → "Found 60". Complexity shown
  secondarily: Time O(log n), Space O(1).
- **Design**: existing dark tokens — violet=active interaction, cyan=info,
  lime=found state. Framer Motion on cell reveal, mid highlight, dim/elim,
  narratio text swap (`AnimatePresence mode="wait"`).
- **Verified**: `npm run lint` ✓, `npm run build` ✓, dev boots (Vite ready ~312ms,
  no errors), algorithm traced (3 steps, correct elim/found), all strings present
  in production bundle. Navbar/Hero/HowItWorks/ExploreConcepts untouched.

### 2026-08-28 — Added "Explore Concepts" + design refinement pass
- **New section** `components/ExploreConcepts/` below HowItWorks:
  - `ExploreConcepts.jsx` — array-driven 4 concept cards (Arrays · Binary Search ·
    HTTP · Operating Systems), heading + subtitle reveal (`whileInView`), card
    stagger, centered "View All Concepts →" outline button (purple border/text, no
    real page yet).
  - `ConceptCard.jsx` — reusable card (icon, title, category badge, description,
    arrow) driven by `concept` objects. Accent per category: Data Structures &
    Algorithms → violet, Networking → cyan, OS → lime. Tint/`--card-accent` passed
    as inline CSS custom properties (`tint: rgba(...)`).
  - Interactions via Framer Motion variant labels: card `whileHover="hover"` lifts
    `y:-6`, icon scales/tints, arrow slides `x:5`. Border brightens on hover (CSS).
  - Section uses `--color-surface` bg + subtle violet/cyan radial at top
    (`::before`, contained with `overflow:hidden`); border-top separates from hero.
  - Responsive: 4 cols desktop → 2 cols ≤1024 → 1 col ≤768; no horizontal scroll.
- **Hero spacing**: `.hero` padding `--space-12 0` → `--space-10 0 var(--space-12)`;
  responsive tops tightened (1024 → `space-8`, 768 → `space-6`). Content brought up,
  glow kept (low opacity, unchanged).
- **Logo**: icon 44px → 40px (32px mobile); wordmark now explicit `.logo__name`
  at `--text-2xl` (mobile `--text-xl`) with `0.06em` tracking — more prominent.
  Logo image asset untouched.
- **Stack demo**: card padding/gaps tightened (`space-6`→`space-5`, `space-5`→`space-4`);
  board padding `space-5`→`space-3`, min-height 320→300, pointer-zone 32→28px;
  blocks 48px→56px (`--text-xl`), gap 12→10px; floor margin tightened. Card stays
  compact, visualization larger. PUSH/POP/RESET logic & Framer animations unchanged.
- **Purple/lime discipline**: unchanged tokens; purple stays on CTAs/focus/active
  states + small accents, lime only on TOP pill + hero label underline + navbar underline.
- Verified: `npm run lint` ✓, `npm run build` ✓, dev server boots (Vite ready ~530ms,
  no transform errors), all section strings present in production bundle, no new deps.

### 2026-08-28 — Phase 1 refinement pass
- **Logo**: cropped `public/logo.png` from 477×347 → 477×271 (trimmed solid
  bottom padding after verifying no artwork cut; source `Unbox logo.png` kept
  intact). Enlarged navbar logo height 36px → 44px (38px on mobile) with
  `object-fit: contain` + `flex-shrink: 0` so it stays proportional/sharp.
- **Hero spacing**: removed `min-height: calc(100vh - navbar)` and reduced top
  padding `--space-16` → `--space-12` to bring content up; kept comfortable
  whitespace. Removed `min-height` to avoid pushing content down.
- **Subtitle**: added `line-height: 1.7` for readability (wording unchanged).
- **Chips**: added explicit `:focus-visible` gold ring (accessibility).
- **Start Exploring**: kept as-is (gold, arrow, subtle hover) — no change needed.
- **Stack demo**: rewrote to communicate the operation better:
  - Added explicit **TOP** gold pill indicator above the stack.
  - Switched block keys to stable monotonic `id`s so POP removes only the top
    block cleanly (no sibling re-key jumps).
  - PUSH enters from above (`y:-70`), POP exits upward (`y:-70`), RESET restores.
  - Added a `aria-live` status line ("Pushed 42", "Popped 30", "Reset").
- **Responsive**: removed stale `.btn-primary` rule; `.hero__cta` + buttons no
  longer overflow on mobile; logo scales on mobile.
- Verified: `npm run build` ✓, `npm run lint` ✓, dev server boots ✓, logo loads
  at `/logo.png` ✓, no horizontal scroll.

### 2026-08-28 — Added "How UNBOX Works" section
- **New component** `components/HowItWorks/` added below the Hero (sibling of the
  `.home` hero container inside `<main>`; both use `max-width: 1160px` +
  `padding: 0 24px`, so they align).
- **Steps**: array-driven (map) — 01 Discover (`Search` icon) / 02 Unbox
  (`PackageOpen`) / 03 Understand (`Lightbulb`). Gold numbers + icons, navy titles,
  muted descriptions, generous whitespace, minimal.
- **Desktop/tablet**: 3-column grid, subtle horizontal connector line
  (`hiw__line`, absolutely positioned at the icon row, animated `scaleX` reveal).
- **Mobile (≤768)**: vertical stack; horizontal line hidden; per-step
  `::before` vertical connectors form a left timeline (hidden on last step).
- **Animation**: `whileInView` scroll reveals — heading slide/fade, steps stagger
  (`staggerChildren 0.15`), line scales in. Hover: step `translateY(-6px)` + icon
  fills gold. Subtle, not continuous.
- **Home.jsx**: split `<main>` into `<main><div class="home">…hero…</div><HowItWorks/></main>`.
- Verified: `npm run build` ✓, `npm run lint` ✓, dev boots ✓, module transforms
  ✓, no new deps.

### 2026-08-28 — Futuristic dark theme (visual only)
- Switched the whole system to a **dark futuristic developer-tool theme**. No
  content, layout, components, or functionality changed — only the visual color
  system. JSX untouched; all interactions (stack PUSH/POP/RESET, search, chips,
  navbar/mobile menu) preserved.
- **`variables.css`**: repurposed legacy tokens to the new palette and added
  `--color-surface` (#0D111C), `--color-accent` (violet #7C3AED),
  `--color-cyan` (#22D3EE), `--color-highlight` (lime #A3FF12). New shadows:
  `--shadow-accent`, `--shadow-highlight`.
- **global.css**: `body` bg `#080B14`; focus ring → violet; `.btn-gold` (primary
  CTA) now **violet** with light text; `.btn-navy` → subtle surface button with
  border; `.btn-ghost` → border + cyan hover (no more light backgrounds).
- **Navbar**: hardcoded light `rgba(247,248,250,.85)` → dark `rgba(8,11,20,.8)`
  + blur(12px); link underline stays lime.
- **Home/Hero**: search focus glow → violet; chips use cyan hover + violet
  focus; added a **restrained violet/cyan radial glow** behind the hero
  (contained with `overflow: hidden` — no horizontal scroll; content
  `z-index: 1`).
- **InteractiveDemo**: blocks → dark surfaces with light text + subtle border;
  **TOP** block gets violet ring + soft accent glow; board → `--color-surface`;
  `Demo` badge → surface pill with violet text; TOP pointer → **lime** with dark
  text (high contrast); floor → subtle cyan line.
- **HowItWorks**: icon hover → cyan tint/border (subtle emphasis); lime step
  numbers stay; headings/text light.
- Readability kept: all text light (`#F8FAFC`) or muted (`#94A3B8`) on dark
  surfaces. Accents applied selectively.
- Verified: `npm run lint` ✓, `npm run build` ✓, dev boots ✓, all CSS + modules
  served 200, old light-theme colors absent from bundle, no new deps.

### 2026-08-29 — Section 4 book card + Section 5 Learning Preview
- **New reusable `components/ConceptBook/`** (ConceptBook.jsx + .css): futuristic
  "concept container" card/book whose *cover only* opens from the left edge. CSS 3D:
  wrapper `perspective:1400px`, stage `transform-style:preserve-3d`, cover
  `transform-origin:left center` + `rotateY(-13deg)` over 0.6s cubic-bezier. Cover is a
  real `<button>` (aria-expanded/aria-controls/aria-label) → opens on hover (desktop),
  toggles on click/tap + keyboard (Enter/Space). `variant="compact"` / `"large"` via
  `cover` + `content` props (label/title/hint; eyebrow/title/description/meta/cta/children).
  `prefers-reduced-motion` fades instead of rotating. Plain per-component CSS, existing
  tokens only (no styled-components).
- **Section 4**: added compact ConceptBook to `InteractiveShowcase` right column
  (`.showcase__side` flex column below the existing explanation panel) — cover
  `UNBOX / Binary Search / Hover to reveal`, reveal Algorithm eyebrow + title +
  "Search smarter by repeatedly dividing the search space." + `Complexity · O(log n)`
  meta + `Explore` CTA pill. The Binary Search viz stays primary.
- **Section 5 (new) `components/LearningPreview/`**: `LearningPreview.jsx/.css` +
  `LearningJourney.jsx/.css`. Label `THE UNBOX EXPERIENCE`, heading "Open a concept.
  Understand what's inside.", two-column: left large ConceptBook (cover
  `DATA STRUCTURES / BINARY SEARCH / Open to understand`; reveal eyebrow `Binary Search`
  + `What is it?` title + description + mini array `[10..70]` w/ lime 60 + `Target: 60`
  + `Start Learning` CTA), right 5-step LearningJourney (01..05, gold numbers, cyan
  label, Framer Motion `whileInView` stagger + hover lift). Responsive 2-col → 1-col ≤1024.
- **Home.jsx**: added `<LearningPreview />` between `<InteractiveShowcase />` and
  `<ExploreConcepts />`. Navbar/Hero/HowItWorks untouched.
- **Verified** via puppeteer-core (headless Chrome): no horizontal overflow at 1440…320;
  compact + large books render; keyboard Enter opens/closes ConceptBook; click/tap
  toggles both variants (mobile viewport too); aria-expanded reflects state; Binary
  Search Prev/Next/Reset traced (40 compare → narrow 50·60·70 → Found 60@5, over-run
  clamps, Reset restores); no console errors. `npm run lint` (Oxlint) ✓, `npm run build` ✓,
  dev serves all new modules 200. No new deps in project.

### 2026-08-29 (2nd) — Section 4 & 5 verification + ConceptBook interaction refinement
- **ConceptBook interaction fix** (`ConceptBook.css` only): hover-open is now gated behind
  `@media (hover: hover) and (pointer: fine)`; `.book.is-open .book__cover` opens on every device,
  so click/tap/keyboard toggling is consistent on touch (no more iOS-style sticky `:hover`
  keeping the cover open after tapping close). Desktop keeps hover-open per spec; the
  `prefers-reduced-motion` block mirrors the same gating (fade instead of rotate).
- **Full verification pass** via headless Edge (CDP, `verify2.mjs` in temp) — **74/74 checks**:
  - Binary Search engine: Step 0 → 01 (MID 40, "We check the middle element." panel) → 02 (eliminates
    0–3, narrows to 50·60·70, MID→60) → 03 (Found 60, lime, check badge, Next disabled); Previous
    restores, Reset restores all cells + controls re-disabled; Time O(log n) / Space O(1) shown.
  - ConceptBook: closed initially; opens on desktop hover (matrix3d rotateY), closes on mouse-leave;
    click toggles `aria-expanded` + transform and persists after pointer leaves; hover+click keeps
    open; keyboard Enter opens/closes; reduced-motion fades (cover opacity ≈ 0, content readable);
    CSS gate rule present; compact + large reveal copy verified (Section 4 Explore · O(log n);
    Section 5 What is it? + mini array + Target 60 + Start Learning).
  - Touch emulation (390px): tap opens/closes both books; no horizontal overflow at
    1440 / 1024 / 768 / 390 / 320 (scrollWidth ≤ innerWidth).
  - Regressions: Navbar 3 links, Hero heading, HowItWorks, ExploreConcepts 4 cards, Stack demo
    3 controls, section order showcase → preview → explore — all intact.
  - Dev server boots clean (Vite ~300-470ms, main.jsx transforms, no dev-log errors); **no console
    errors** during the whole session; `npm run lint` ✓, `npm run build` ✓.
- **Test-harness note**: CDP Enter must be `Input.dispatchKeyEvent type:'keyDown'` with `text:'\r'`
  + `keyUp` to synthesize a button click (`rawKeyDown` alone doesn't).

### 2026-08-29 (3rd) — Removed book/open interaction; Section 4 "Concept in Motion" + Section 5 "Learn it your way."
- **Decision reversal**: the CSS 3D cover-open ConceptBook / LearningPreview / LearningJourney
  concept (previous two sessions) is **fully removed** — `src/components/ConceptBook/` and
  `src/components/LearningPreview/` folders deleted; grep confirms no
  `ConceptBook|LearningPreview|LearningJourney|book__` references remain in `src`. The earlier
  2026-08-29 log entries about the book are superseded by this one.
- **Section 4 rewired** (`InteractiveShowcase/`): header now label `Interactive Visualization`,
  heading "See a concept unfold step by step." + sub "Interact with the process and understand
  what's happening underneath." `binarySearchSteps.js` rebuilt as 4 snapshot STEPS
  (KEY/START/CHECK/NARROW/FOUND) over ARRAY [10,20,30,40,50,60,70], TARGET 60
  (page `.bsearch__step` state, not array index). Per snapshot: low/high/mid/eliminated/found/
  status/badge/heading/detail + `narrationFor(step)`. STEP 1 START (no MID, LOW/HIGH at bounds),
  STEP 2 CHECK (MID = 40 @ idx 3, "We check the middle element."), STEP 3 NARROW (idx 0–3
  eliminated/dimmed, range 50·60·70, MID → 60 @ idx 5), STEP 4 FOUND (60 lime @ idx 5, check
  badge, "60 found." + found chip). Controls: Previous disabled on STEP 1, Next disabled on
  STEP 4, Reset always restores; progress pill `STEP n / 4`; `role/aria-live` narration.
  Right column = pure explanation panel (Current `Step n / 4` badge → heading → detail,
  Time O(log n) / Space O(1)) — ConceptBook and `.showcase__side` gone.
- **Section 5 (new) `components/LearningMethods/`**: `LearningMethods.jsx/.css` +
  `LearningMethodCard.jsx/.css`. Label `THE UNBOX EXPERIENCE`, heading "Learn it your way.",
  sub "One concept. Multiple ways to understand it." Data-driven 3 cards — Visualize
  (`Eye`, violet `#7C3AED`), Experiment (`FlaskConical`, cyan `#22D3EE`), Test
  (`CircleCheck`, lime `#A3FF12`) — accent injected inline as `--card-accent`
  (`color-mix` tints + hover border/glow). `LearningMethodCard` uses Framer **variant-label
  cascade** (matches ConceptCard pattern): `motion.li whileHover="hover"` lifts `y:-6`
  (spring 400/30), the nested `motion.div.icon` defines `hidden/show/hover` variants and
  scales to `1.08` via the *card's* hover label (not its own `whileHover` — a bare child
  `whileHover` does not fire unless the pointer is exactly on the 52px circle). Accent
  bar `.methods-card__bar` scales in. Connector `.methods__line` desktop-only (grid 3 col
  → 2 col ≤1100 → 1 col ≤800; line hidden <1100).
- **Home.jsx**: section order now `InteractiveShowcase → LearningMethods → ExploreConcepts`.
  Navbar / Hero / HowItWorks / ExploreConcepts / InteractiveDemo untouched.
- **NO new deps.** `npm run lint` ✓ (dropped an unused `mask` helper in binarySearchSteps.js
  and an unused `step` param in `InteractiveShowcase`'s panel — kept `gather`), `npm run build` ✓
  (2235 modules; `dist/assets/index-DTTPcpFu.js` 342.57 kB, `index-BtpEiRnN.css` 26.81 kB).
- **Verified via headless Edge CDP (`verify3.mjs` in temp) — 86/86 PASS**: dev boots clean,
  all new copy present, 4-step engine traced (START → CHECK 40 → NARROW 50·60·70/dim 0.3 →
  FOUND 60@5 lime + check badge; Previous/Next disabled states at START & FOUND + restored by
  Reset; progress pill + 4 dots; complexity O(log n)/O(1)), no `.book`/`.preview` remnants,
  3 method cards with correct titles/copy/accents/icons, hover lift `matrix(1,0,0,1,0,-6)` +
  icon `matrix(1.08,0,0,1.08,0,0)`, no horizontal overflow at 1440/1024/768/390/320, grid
  cols 3/2/1 + connector hidden <1100, section order + all prior-section regressions intact,
  no console errors.
- **Test-harness lessons**: evaluating a DOM node with `returnByValue` throws CDP
  "Object reference chain is too long" → evaluate a boolean expression instead (e.g.
  `(...?.disabled) === true`). Don't spread a helper that returns a node and compare to
  strings (`=== 'yes'`) after changing it to return booleans. PowerShell `Get-Content`/`Set-Content`
  UTF-8 round-trips mangle `—` / `Δ` in temp scripts (use the edit tool).
