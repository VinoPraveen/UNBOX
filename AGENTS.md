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

- Current phase: **Phase 2.4.2** (Binary Search Playground — full interactive experiment).
  Phase 2.4.1 built the reusable registry-driven playground system (shell + input/controls/
  output/status components; PlaygroundPage; Stack/Queue coming-soon configs). Phase 2.4.2
  wired the real Binary Search playground: a pure state generator, a concept wrapper that
  renders the existing Visualization Engine, and spec-exact validation. Builds on the
  Phase 2.3 Visualization Engine.

## Routing (since 2026-08-31)

- React Router v7 (BrowserRouter) is now installed and wired in `App.jsx`.
- **`/`** — landing page (Home + FinalCTA). **`/explore`** — Explore page.
  **`/concept/:slug`** — reusable ConceptPage (Phase 2.2). **`/playground/:slug`** —
  registry-driven PlaygroundPage (Phase 2.4.1). **`/quiz/:slug`** — placeholder.
- `App.jsx` uses a `Layout` (Navbar + children + Footer); `Home`/`Explore`/
  `ConceptPage` render between Navbar and Footer. `MotionConfig
  reducedMotion="user"` wraps the router.
- Navbar: `Explore` is a `NavLink` (active state `.is-active` via lime underline);
  `How It Works`/`About` are plain anchors to `/#how-it-works`, `/#about`. Mobile
  menu links are Router links; `Get Started` CTA → `/explore`. Logo is a Router
  `Link` → `/`.
- `Brand` CTAs now navigate: Home `Start Exploring`, ExploreConcepts
  `View All Concepts`, FinalCTA `Start Exploring`, Footer `Concepts` → `/explore`;
  Hero search/chips are UI-only.

## Explore page (Phase 2.1)

- `src/data/concepts.js` — static data source (12 concepts). Exports default
  `concepts` array + `CATEGORIES` + `DIFFICULTIES`. Each concept: `id`, `title`,
  `category`, `difficulty`, `description`, `Icon` (Lucide), plus per-category
  `accent`/`tint` tokens. **Do not mutate** — filters derive a new array.
- `src/pages/Explore/Explore.jsx` (+ `.css`) — hero (`EXPLORE UNBOX` label,
  "What do you want to understand?" heading, description, search), FilterBar,
  results count, grid, empty state. State via `useState`: `searchQuery`,
  `selectedCategory`, `selectedDifficulty`; filtered via `useMemo` (case-insensitive
  search on title/description/category + category + difficulty AND logic).
- `src/components/ExploreSearch/` — controlled search input (lucide Search icon).
- `src/components/FilterBar/` — Catalog + Difficulty radiogroup button groups;
  active = `--color-accent-bright` + violet border/bg on `#{7C3AED}08` tint.
- `src/components/ExploreConceptCard/` — reusable card (`motion.article` wrapper +
  `<Link>`), icon/category badge/title/description/difficulty/`Explore →`; hover
  lift (y:-6 via Framer variant label cascade), icon scale, arrow slide, border
  brighten. Cards link to `/concept/:id` (resolves to the real ConceptPage, Phase 2.2).
- Grid: 3 cols (≥1025) → 3 cols down to 1024 hover (desktop) → 2 cols ≤1024 →
  1 col ≤768. No horizontal overflow anywhere (verified 1400…320); category
  options scroll horizontally on mobile (`overflow-x:auto`, hidden scrollbar).
- Count label pluralizes ("12 concepts" / "1 concept"); `Clear Filters` button
  shown both in meta (when filtered) and in empty state; resets all three states.


## Tech stack

- **React** (functional components, `react@19`)
- **Vite** (build tool)
- **JavaScript** (`jsx`), not TypeScript
- **Plain CSS** (organized per-component + global design-system files)
- **Framer Motion** — animations (`framer-motion`)
- **Lucide React** — icons (`lucide-react`)
- **React Router** — routing (`react-router-dom@7`, SPA client-side routing)

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
| Accent Bright (`--color-accent-bright`) | `#A78BFA` |

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
│   ├── visualization/    Reusable visualization engine skeleton
│   │   ├── VisualizationEngine/   orchestrator (VisualizationEngine.jsx/.css, usePlayback.js)
│   │   ├── VisualizationControls/ generic timeline controls (Prev/Play/Next/Reset/Speed)
│   │   ├── VisualizationProgress/ "STEP n / m" + dot progress
│   │   └── VisualizationContainer/ consistent surface card wrapper
│   ├── visualizations/   registry.js ({ type, Component }) + per-concept visualizers
│   │   ├── BinarySearch/ BinarySearchVisualizer.jsx/.css (step-based, engine-controlled)
│   │   ├── Stack/        StackVisualizer.jsx/.css (interactive, PUSH/POP/RESET)
│   │   └── Queue/        QueueVisualizer.jsx/.css (interactive, ENQUEUE/DEQUEUE/RESET)
│   ├── concept/          ConceptPage section components (ConceptHeader/Nav/Progress,
│   │                     Overview/HowItWorks/Visualization sections)
│   ├── playground/       reusable playground shell + sections (registry-driven)
│   │   ├── PlaygroundShell/     generic outer structure: header, input, controls, output, status
│   │   ├── PlaygroundHeader/    PLAYGROUND label + title/description + "Back to Concept"
│   │   ├── PlaygroundInput/     config-driven input (number / array / text)
│   │   ├── PlaygroundControls/  config-driven operation buttons (RUN/RESET, PUSH/POP, ...)
│   │   ├── PlaygroundOutput/    labeled output area (renders viz / children)
│   │   └── PlaygroundStatus/    Idle/Running/Success/Error (aria-live, not color-only)
│   ├── Navbar/          Navbar.jsx + Navbar.css
│   ├── Logo/            Logo.jsx + Logo.css  (logo image + "UNBOX" wordmark)
│   ├── InteractiveDemo/ stack demo card — reuses <StackVisualizer> (InteractiveDemo.jsx + .css)
│   ├── HowItWorks/      "How UNBOX Works" steps (HowItWorks.jsx + .css)
│   ├── InteractiveShowcase/ "Concept in Motion" Binary Search viz (landing-only marketing)
│   │                       (InteractiveShowcase.jsx/.css, BinarySearchVisualizer.jsx/.css,
│   │                       binarySearchSteps.js)
│   ├── LearningMethods/   "Learn it your way." learning-method cards
│   │                      (LearningMethods.jsx/.css, LearningMethodCard.jsx/.css)
│   ├── ExploreConcepts/ concept cards (ExploreConcepts.jsx + .css, ConceptCard.jsx + .css)
│   ├── ExploreConceptCard/ Explore card → /concept/:id
│   ├── ExploreSearch/  FilterBar/  controlled search + filter groups (Explore page)
│   ├── FinalCTA/        "Ready to Unbox?" closing section (FinalCTA.jsx + .css)
│   └── Footer/          minimal footer (Footer.jsx + .css)
├── pages/
│   ├── Home/            Home.jsx + Home.css (hero section)
│   ├── Explore/         Explore.jsx + .css (concept library)
│   ├── Concept/         ConceptPage.jsx + .css (reusable learning page, composes sections)
│   ├── Playground/      PlaygroundPage.jsx + .css (registry-driven playground) + placeholder states
│   ├── QuizPlaceholder.jsx  (future phases) + Placeholder.css
├── components/
│   ├── playground/      reusable playground shell + sections (see below)
│   └── ...
├── playgrounds/         per-concept playground configs (BinarySearch/Stack/Queue)
├── data/
│   ├── concepts.js      Explore list (12 concepts) — do not mutate
│   ├── concepts/        per-concept data modules + registry.js (binary-search/stack/queue)
│   └── playgrounds/     playgroundRegistry.js (getPlayground(slug))
├── styles/
│   ├── variables.css    design tokens
│   ├── global.css       reset + base + shared (.btn, focus)
│   └── responsive.css   breakpoint overrides
├── App.jsx              BrowserRouter + Layout (Navbar + children + Footer) + routes
└── main.jsx             root + style imports
```

- Keep `App.jsx` thin. Reusable components. Organized CSS.
- Semantic HTML + accessibility (real `<button>`s, accessible input, `aria` attrs).
- **Visualization architecture**: ConceptPage → VisualizationSection → VisualizationEngine
  → visualizations registry → specific visualizer → reusable controls. ConceptPage must
  NOT contain algorithm-specific rendering logic. Add a concept in 4 steps: viz component,
  concept data file, `data/concepts/registry.js`, `visualizations/registry.js`.

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
- Interactive Stack Demo ("How does a Stack work?") — rendered via `StackVisualizer`
  (single source of truth shared with the concept page; PUSH / POP / RESET, LIFO label,
  TOP indicator). Landing `InteractiveDemo` keeps only the `.demo` card + badge/heading.
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
- FinalCTA section ("Ready to Unbox?") — label `Ready to Unbox?`, heading "There's more to
  every concept.", supporting text, "Start Exploring →" purple `.btn-gold` button + note;
  minimal CSS/SVG unbox visual (outlined box + glowing lime opening beam), restrained
  violet/cyan glow; Framer Motion `whileInView` staged reveal (heading → text → button →
  visual); button use variant-label cascade so the arrow slides right on hover.
- Footer (`<footer>`) — brand (small logo square + "UNBOX" + tagline "See what's inside."),
  two link columns Explore (Concepts / How It Works / About — real hash links) and Connect
  (GitHub / LinkedIn — Lucide `GitBranch`/`ExternalLink`, `href="#"` placeholders), thin top
  border, bottom bar with © 2026 UNBOX + slogan; semantic `nav`/`aria-label`, link hover → cyan.
  (Note: this lucide-react version has **no `Github`/`Linkedin` brand icons** — used `GitBranch`
  and `ExternalLink`.)

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

### 2026-08-29 — Added Final CTA (Section 6) + Footer (Section 7)
- **`components/FinalCTA/`** (`FinalCTA.jsx/.css`): full-width closing section (sibling of the
  other wrapped sections in `App.jsx`, placed after `<Home/>`, `border-top` separates from
  ExploreConcepts). Label `Ready to Unbox?` (uppercase cyan), heading "There's more to every
  concept.", supporting text, "Start Exploring →" purple `.btn-gold`, note "No complicated
  setup. Just pick a concept and start learning." Restrained CSS/SVG unbox visual: outlined
  box (`.cta__box`, violet border + inner cyan ring) with a lime glowing opening beam
  (`.cta__beam` gradient + soft glow). Subtle violet/cyan radial glow (`.cta__glow`).
  Framer `whileInView` staged reveal (`.cta__inner` container stagger → label/heading/text/
  action then box scale + beam scaleX delayed) — no continuous animation.
- **Button hover cascade** (important lesson): the `Start Exploring` anchor is a `motion.a`
  with `variants={buttonVariants}` (hidden/show reveal + `hover:{y:-2}`) + `whileHover="hover"`;
  the arrow is a child `motion.span` with `arrowVariants` (hidden/show + `hover:{x:4}`).
  A child variant only fires on hover when the **parent uses variant-labels** (`whileHover="hover"`),
  NOT a plain-object `whileHover={{...}}` — so the arrow slides right via the cascade.
  Reveal variants had to be included on BOTH the button and arrow, otherwise adding
  `variants={buttonVariants}` shadows the inherited `.cta__action` itemVariants and the
  button would not fade in on scroll.
- **`components/Footer/`** (`Footer.jsx/.css`): semantic `<footer>` with `border-top`.
  Brand block (small violet logo square + "UNBOX" wordmark + tagline), two `nav aria-label`
  columns — **Explore** (Concepts `#concepts` / How It Works `#how-it-works` / About `#about`
  real hash links) and **Connect** (GitHub / LinkedIn, `href="#"` placeholders with Lucide
  icons). Bottom bar: © 2026 UNBOX + "See what's inside." Link hover → cyan (`color`
  transition only). **No brand icons in this lucide version** — used `GitBranch` (GitHub)
  and `ExternalLink` (LinkedIn) (same as the earlier Navbar session note).
- **App.jsx**: now `<> <Navbar/> <Home/> <FinalCTA/> <Footer/> </>`. FinalCTA lives after
  `<main>` (full-width, matches other separated sections); Footer outside main. Navbar /
  Home / HowItWorks / InteractiveShowcase / LearningMethods / ExploreConcepts untouched.
- **Responsive**: CTA centered column, max-width 42rem, button full-width ≤768. Footer:
  desktop brand left / link groups right; ≤768 column-stacked (brand → Explore → Connect)
  with bottom bar stacked-left.
- **NO new deps.** `npm run lint` ✓, `npm run build` ✓ (2239 modules; `index-DH7xWIvG.js`
  346.25 kB, `index-DSYBAA4x.css` 30.51 kB).
- **Verified via headless Edge CDP (`verify-cta-footer.mjs` in temp) — 46/46 PASS**: CTA copy
  + visual + glow, bg #080B14, button purple, box/heading/beam reveal after in-view scroll,
  button lift `matrix(…,0,-2)` + arrow `matrix(…,4,0)` on hover; footer semantic `footer` +
  2 `nav`, brand/tagline, Explore & Connect columns + correct links + icons, copyright +
  slogan, link color transition; section order showcase→methods→explore→cta→footer with
  footer outside main; no horizontal overflow at 1440/1024/768/390/320; footer desktop
  side-by-side + mobile stacked; all prior-section regressions intact (navbar 3 links, hero,
  hiw, 4 concept cards, 3 method cards, 3 stack controls); no console errors.

### 2026-08-31 — Final polish / QA pass (landing page)
- **No redesigns, no new sections, no content changes** — polish + correctness only. All 13 spec
  areas: responsiveness, animation polish, reduced-motion, spacing, typography, navbar a11y,
  accessibility, performance, unused-code removal, visual consistency, cross-section flow, build.
- **Section order (now spec flow)** in `Home.jsx`: Hero → HowItWorks (`#how-it-works`) →
  ExploreConcepts (`#concepts`, moved up from below InteractiveShowcase) → InteractiveShowcase
  (`#explore` on hero) → LearningMethods → FinalCTA → Footer. `<main>` keeps hero + wrapped sections.
- **Reduced motion**: `App.jsx` wraps the tree in `<MotionConfig reducedMotion="user">` (Framer
  honors the OS setting); `global.css` adds `@media (prefers-reduced-motion: reduce)` forcing
  `animation/transition-duration: 0.01ms` + `scroll-behavior: auto`.
- **New convention — `--color-accent-bright: #A78BFA`** (violet-bright, contrast ~6:1 as text vs
  ~2.4:1 for `#7C3AED`). Use `#A78BFA` for violet-accented TEXT/labels/pointers on dark
  (`--color-accent` #7C3AED stays for fills/borders/CTAs). Applied to: `.demo__badge`,
  `.showcase__badge`, `.bsearch__pointer--mid`, `.explore__view`, `#A78BFA` accents
  (Arrays/Binary Search cards, Visualize method card).
- **Accessibility**: Navbar mobile menu now closes on `Escape` and on click/tap outside
  (native `document` listeners via `useEffect`/`useRef`, cleaned up). Stack-demo status no longer
  shows literal "initial" — `DEFAULT_STATUS = 'PUSH adds to the top · POP removes the top'`.
- **Anchors**: Footer "About" now resolves — `<footer id="about">`. Added
  `section[id] { scroll-margin-top: calc(69px + 27px) }` so `#concepts`/`#how-it-works`/`#explore`
  jumps clear the 69px sticky navbar (footer excluded so "About" still reaches the very bottom).
- **Housekeeping**: removed unused `import React` from 11 components (React 19 auto-JSX),
  removed unused `--color-navy-dark`, deleted unused `public/favicon.svg` (favicon is `/logo.png`).
  `index.html`: added `<meta name="color-scheme" content="dark">` + `<meta name="theme-color"
  content="#080B14">` (mobile/SW theme colors). `.showcase__heading` got `margin-top: var(--space-3)`
  (label→heading gap). Sticky navbar renders `position: sticky` height 69px (desktop + mobile).
- **NO new deps.** `npm run lint` ✓, `npm run build` ✓ (2239 modules; `index-BZ3AowT7.js`
  347.21 kB gzip 108.95, `index-CNTMFw3z.css` 30.80 kB gzip 5.36).
- **Verified via self-hosted headless Edge CDP** (raw WebSocket, no deps — `verify2.mjs`/`extra.mjs`
  in temp, Vite on :5187 self-hosted inside the script; port filters avoid stale `edge://` targets).
  **81/81** (bsearch STEP 1→4 + elim 4 at STEP 3 + found/disabled + Reset, stack 3→8→7 with full/disabled
  + TOP pointer + status copy, Arrays chip fills input, mobile menu open→Escape→outside-close,
  reduced-motion rule present, no overflow at 1440…320, no console errors) **+ 10/10 extras**
  (anchor ids exist, footer Explore→real hashes, scroll-margin 96px, jump clears navbar, Inter loaded,
  smooth/`document.fonts` ready, no horizontal scrollbar).
- **Test-harness lesson**: after `.click()`, React 19 batches the re-render as a microtask — reading
  state synchronously in the same `Runtime.evaluate` returns stale DOM. Use click → `await sleep(~300ms)`
  → read, across separate evals. Harness `connect()` must resolve the unwrapped CDP `msg.result`,
  and the script must `process.exit()` (open WebSockets keep Node alive) — a silent `process.exit(0)`
  in `finally` also eats real exceptions; report errors first.

### 2026-08-31 — Phase 2.1: Explore Concepts page + React Router

- **Routing added**: installed `react-router-dom@7` (only new dep). `App.jsx` now
  uses `BrowserRouter` + `Routes` with a shared `Layout` (Navbar + children + Footer)
  wrapped in `MotionConfig reducedMotion="user"`. Routes: `/` (Home + FinalCTA),
  `/explore` (Explore), `/explore/:conceptId` (ConceptPlaceholder). Landing page
  sections/design untouched.
- **Navbar wiring**: `Explore` is now a `NavLink` (`.is-active` = lime underline, same
  gold underline util); `How It Works`/`About` are plain anchors to `/#...`. Mobile
  menu links + `Get Started` CTA + Logo are Router links (`Link`/`NavLink`) so SPA
  nav works. Mobile link `.is-active` styling added. Removed the old route-change
  `useEffect` (menu already closes via click handlers) to keep oxlint clean.
- **New `src/data/concepts.js`**: 12 concepts (Arrays/Stack/Queue/Linked List Data
  Structures; Binary Search/Recursion/Sorting Algorithms; HTTP/REST API Web; DNS
  Networking; Operating Systems OS; JavaScript Event Loop Programming) each with
  `id/title/category/difficulty/description/Icon/accent/tint` + exported
  `CATEGORIES` (All, …) + `DIFFICULTIES` (All/Beginner/Intermediate/Advanced).
  Per-category accent tokens (violet-bright, cyan, lime). Do not mutate.
- **`pages/Explore/`**: hero (`EXPLORE UNBOX` label, "What do you want to
  understand?" heading, description, working search), FilterBar (Category +
  Difficulty), results meta (count + Clear Filters), 3→2→1 col grid (animated
  keyed re-layout), empty state ("No concepts found." / "Try a different search or
  filter." + Clear Filters). State: `searchQuery`/`selectedCategory`/
  `selectedDifficulty` via `useState`; filtered with `useMemo` (case-insensitive
  search on title/description/category + category + difficulty AND logic).
- **New components**: `ExploreSearch/` (controlled lucide Search input),
  `FilterBar/` (radiogroup button groups, violet active state, mobile horizontal
  scroll), `ExploreConceptCard/` (motion.article + `<Link>`, icon/category
  badge/title/desc/difficulty + `Explore →` arrow; Framer hover lift y:-6/icon
  scale/arrow slide/border brighten — variant-label cascade, no continuous anim).
- **`pages/ConceptPlaceholder/`**: temp route for `/explore/:id`; shows concept
  icon/category/title/desc/difficulty + "Coming in Phase 2.2", back to `/explore`
  link, and a "Concept not found" state for unknown ids. Real learning pages = Phase 2.2.
- **Accessibility**: semantic `<main>`, h1 hierarchy, labelled search input,
  real buttons, `radiogroup`/`aria-checked` on filters, focus-visible rings,
  keyboard-accessible card links.
- **NO new deps beyond react-router-dom.** `npm run lint` ✓, `npm run build` ✓
  (2258 modules; `index-DuPK68nP.js` 397.99 kB gzip 125.20, `index-DqmrBUHL.css`
  39.79 kB gzip 6.29).
- **Verified via headless Edge CDP (`verify-explore.mjs` in temp, Vite :5191) — 52/52
  PASS**: note the test expectation at exactly 1024 (grid is 2 cols there — correct
  for tablet, 3 cols at 1025+). Search case-insensitive (binary/STACK/http),
  singular/plural count, category Algos → 3, Algorithms+Beginner → 2, empty state +
  Clear Filters (both empty-state and meta) restore all 3 states, card →
  /explore/binary-search placeholder + Back, Navbar Explore active + nav, View All
  Concepts + Start Exploring + Logo nav, Footer Concepts → /explore, horizontal
  overflow none at 1400/1200/1025/1024/1000/768/390/320, grid 3/3/3/2/2/1/1/1,
  mobile menu Explore active + nav, no console errors. Landing section strings all
  present in built bundle (landing not redesigned).
- **Note**: BrowserRouter means direct deep-links to `/explore`/`/explore/:id`
  need SPA fallback on the host server (works fine with Vite dev; deployment must
  route unknown paths to `index.html`).

### 2026-08-31 — Phase 2.2: Reusable Concept Learning Experience

- **Reusable concept page** at `/concept/:slug`, driven entirely by data + a
  visualization registry. Landing page, Explore, Navbar, Footer untouched.
  Delete `ConceptPlaceholder` (replaced by the real page). `ExploreConceptCard`
  now links to `/concept/:id`.
- **Routes added** in `App.jsx`: `/concept/:slug` (ConceptPage),
  `/playground/:slug` (PlaygroundPage in Phase 2.4.1), `/quiz/:slug` (QuizPlaceholder).
  Removed `/explore/:conceptId`. Shared `Layout` keeps Navbar+Footer.
- **Data layer**:
  - `src/data/concepts/` now holds per-concept modules + a registry.
  - `binarySearch.js` — self-contained concept config: `slug/title/category/
    difficulty/estimatedTime/description/Icon/accent/tint/visualization/
    complexity/visualizationBlurb/overview/howItWorks/visualizationSteps/
    visualizationConfig`.
  - `registry.js` — `getConceptData(slug)` + map. **Add a future concept in 3
    steps: (1) new `x.js` data file, (2) new viz component, (3) one registry
    line** — `registry.js` (data) + `visualizations/registry.js` (component).
- **`pages/Concept/ConceptPage.jsx`**: reads slug, looks up registry, handles
  "Concept not found" + Back to Explore (no crash). Scrolls to top on slug
  change. Tracks active section via `IntersectionObserver` (rootMargin band).
  Renders: ConceptHeader → ConceptNav → ConceptProgress → OverviewSection →
  HowItWorksSection → VisualizationSection → Practice preview → Challenge
  preview. Semantic `<main>`, single h1, h2 section headings.
- **Reusable concept components** (`components/concept/`, all data-driven):
  - `ConceptHeader` — Back to Explore, category (uppercase, accent), h1 title,
    description, Difficulty + Estimated time badges, subtle glow bg.
  - `ConceptNav` — sticky (`top:69px`, blur surface bg), 5 items
    (Overview/How It Works/Visualize/Practice/Challenge), smooth `scrollIntoView`,
    lime underline active state, horizontal-scroll on mobile (hidden scrollbar).
  - `ConceptProgress` — "YOUR PROGRESS" (uppercase via CSS), ●━●━○━○ dots,
    labels 1..4 Understand/Visualize/Practice/Challenge, current = lime dot,
    done = violet, wraps on mobile.
  - `OverviewSection` — "What is X?" heading + body + static array visual
    (7 cells, target cell highlighted via accent) + `Target: 60` pill.
  - `HowItWorksSection` — numbered 01..04 steps (gold numbers, titles, muted
    descriptions, left timeline connector), staggered scroll reveal.
  - `VisualizationSection` — owns `step` state (`useState`, clamps 1..total);
    resolves visualizer from `visualizations/registry.js` by `concept.visualization`
    **(imported map, not a call, so oxlint stays clean — a function-call return
    triggers `react(static-components)`)**.
- **`visualizations/BinarySearch/BinarySearchVisualizer.jsx`**: self-contained
  concept version (adapted from InteractiveShowcase): header + STEP pill + dots,
  LOW/MID/HIGH pointers (Framer layout spring), array cells (eliminate dim/mid
  violet/found lime + check badge), aria-live status, Previous/Next Step/Reset
  (correct disabled states), inline explanation panel (AnimatePresence), found
  chip, complexity (Time O(log n)/Space O(1)). State stays in parent; purely
  presentational. Config/total/snapshot via props.
- **Preview teasers**: data-driven `PreviewSection` in ConceptPage — Practice
  ("Ready to try it yourself?" → `/playground/:slug` "Open Playground") +
  Challenge ("Think you've got it?" → `/quiz/:slug` "Take the Challenge").
- **Placeholders**: `QuizPlaceholder.jsx` uses `pages/Placeholder.css`; reads slug,
  shows concept title, Back to Concept → `/concept/:slug`. No Quiz logic (later phases).
  (The old `PlaygroundPlaceholder.jsx` was replaced by the real PlaygroundPage in Phase 2.4.1.)
- **Styling**: per-component BEM CSS with existing tokens, sticky nav clearance
  via global `section[id] scroll-margin-top`. Two-column viz grid (1.4fr/1fr)
  → single ≤1024. `MotionConfig reducedMotion="user"` + global reduced-motion
  media query honored.
- **NO new deps.** `npm run lint` ✓ (clean — removed an unused `Promise`-free
  import and kept registry imports static), `npm run build` ✓ (2278 modules;
  `index-CkgMBawq.js` 414.98 kB gzip 128.19, `index-BizMOwNh.css` 54.81 kB).
- **Verified via headless Edge CDP — 72/72 main + 20/20 keyboard/a11y + 8/8
  flow**: header/meta/back, nav 5 items (buttons, aria-label, tabIndex 0),
  progress stages/labels/current, overview heading/body/7 cells/target
  highlight, how-it-works 4 numbered steps, 4-step engine (START→CHECK 40→
  NARROW 50·60·70/dim 0.3→FOUND 60 lime + check; Previous/Next disabled at ends;
  Reset restores; panel badge/heading/found chip; complexity), keyboard Enter on
  Prev/Next/Reset, aria-live on status+progress, single h1 + 5 h2, no overflow
  at 1440/768/390/320, array not clipped on mobile, nav click smooth-scrolls +
  active="Visualize", Explore still 12 cards + card links to /concept/, invalid
  slug → "Concept not found" + Back to Explore, placeholder headings + back
  links, landing `/` still renders + Start Exploring → /explore, unimplemented
  concept (e.g. /concept/arrays) 404s gracefully, no console errors.
- **Test-harness lesson**: an unrealistically tall viewport (e.g. 2600px) can
  exceed the document height so `scrollIntoView` can't reach lower sections —
  use a realistic viewport (1000px) for nav-scroll verification. `NodeList.every`
  may be flaky through CDP `returnByValue`; wrap node lists in `Array.from(...)`.

### 2026-09-01 — Phase 2.3: Reusable Visualization Engine

- **Architecture decoupled**: ConceptPage/VisualizationSection no longer know how
  individual visualizations work. Flow is now **ConceptData → ConceptPage →
  VisualizationEngine → visualization registry → specific visualizer →
  reusable controls**. ConceptPage just composes sections; the engine resolves and
  renders the right visualizer + control scheme from `concept.visualization`.
- **Target structure created** under `src/components/visualization/`:
  - `VisualizationEngine/VisualizationEngine.jsx` — orchestrator. Reads
    `getVisualization(slug)`; if null → `ComingSoon` ("Visualization coming soon."
    + "Back to Explore", no crash). Branch on `type`: `'interactive'` renders the
    visualizer self-contained (its own concept controls); `'step-based'` runs
    `StepBasedEngine` (timeline: step state, snapshot, header + `VisualizationProgress`,
    generic `VisualizationControls`, the shared `usePlayback` hook).
  - `VisualizationControls/VisualizationControls.jsx` — generic timeline controls:
    Previous / Play·Pause / Next / Reset + Speed (0.5x 1x 1.5x 2x). Previous disabled
    at step 1, Next disabled at final. Real buttons + aria-labels, wraps on mobile.
  - `VisualizationProgress/VisualizationProgress.jsx` — `STEP n / m` pill (cyan,
    aria-live) + dot progress (violet done / violet current), reusable.
  - `VisualizationContainer/VisualizationContainer.jsx` — consistent surface card
    (border, radius, padding, `--color-white`), no logic.
  - `VisualizationEngine/usePlayback.js` — centralized automatic playback. Uses a
    single `setInterval` via functional `setStep` updater (no stale closures), a ref
    guards play state, speed changes restart the timer in place (no concurrent
    timers), auto-stops at the final step, and unmount cleanup via
    `useEffect(() => clearTimer)`. No per-visualizer timers.
- **Visualizations registry** (`src/components/visualizations/registry.js`): each
  entry is `{ type: 'step-based'|'interactive', Component }`. `getVisualization(slug)`
  returns entry or null. **Add a future concept in 4 steps**: (1) viz component,
  (2) concept data file, (3) map it in `data/concepts/registry.js`, (4) map it in
  `visualizations/registry.js`. Nothing else to change.
- **`visualizations/BinarySearch/`** — migrated into the engine: now presentational
  (receives `config`/`complexity`/`snapshot`), its own prev/next/progress/controls
  removed (handled by the engine). Board + explanation panel + complexity + found
  state preserved, same educational behavior (START → CHECK 40 → NARROW 50·60·70 →
  FOUND 60 @ idx 5).
- **`visualizations/Stack/StackVisualizer.jsx`** (NEW, interactive type): initial
  `[10,20,30]`, TOP lime pointer, PUSH/POP/RESET concept controls (Push disabled full,
  Pop disabled empty), LIFO caption, size pill, block enter/exit animations. Reads
  `concept?.initialValues`.
- **`visualizations/Queue/QueueVisualizer.jsx`** (NEW, interactive type): initial
  `[10,20,30]`, FRONT/REAR labels, ENQUEUE/DEQUEUE/RESET, FIFO caption, ENQUEUE →
  enter from rear (x:+40), DEQUEUE → leave from front (x:-40), `mode="popLayout"`.
  Self-contained CSS (`qviz__block` base + `--front`/`--rear` ring) — does not rely on
  Stack's CSS.
- **Stack single source of truth**: landing `InteractiveDemo` no longer has any stack
  logic — it now renders `<StackVisualizer concept={{initialValues:[10,20,30]}} />`
  inside its `.demo` card (kept `Demo` badge / heading). One Stack implementation
  shared by landing + concept page. (`InteractiveShowcase` keeps its own Binary Search
  on the landing page — that's a separate marketing section per "don't redesign the
  landing page"; Stack reuse was the required unification.)
- **Concept data**: new `src/data/concepts/{stack,queue}.js` (slug/title/category/
  difficulty/estimatedTime/description/Icon/accent/tint/visualization/blurb/overview/
  howItWorks). `data/concepts/registry.js` now maps `binary-search`/`stack`/`queue`.
- **OverviewSection bugfix**: it was binary-search-specific (assumed `overview.array`)
  and crashed Stack/Queue with `TypeError: array.join`. Now `array`/target visual is
  rendered only when `overview.array` exists → Stack/Queue render body + heading only.
  Binary Search keeps its array+target visual unchanged.
- **NO new deps.** `npm run lint` ✓ (clean), `npm run build` ✓ (2293 modules;
  `index-BG7fNOSb.js` 424.15 kB gzip 130.65, `index-C7t08uHe.css` 59.00 kB gzip 8.29).
- **Verified via headless Edge CDP + self-hosted Vite — 41/41 main + 4/4 coming-soon +
  11/11 a11y/reduced-motion**: landing stack demo (3 blocks, LIFO, Push/Pop),
  binary-search engine (STEP 1/4 → Next → STEP 4 found cell, Next disabled at final,
  Reset → STEP 1, Playback auto-stops at end, 2x speed advances, explanation
  updates), stack (3 blocks, TOP, LIFO, Push/Pop, no generic controls/progress),
  queue (3 blocks, FRONT/REAR, FIFO, Enqueue/Dequeue, self-contained block styling),
  `/concept/arrays` → "Concept not found" (no crash), coming-soon path manually
  exercised by temporarily removing queue from the registry → "Visualization coming
  soon." + "Back to Explore" + header intact + no console errors, Explore still 12
  cards, no horizontal overflow at 1400/1024/768/390/320, keyboard Enter/Space
  activate Next/Reset, all controls are real buttons with aria-labels, Previous
  disabled at step 1, speed 1x default, aria-live on status + progress, reduced
  motion forces `0.01ms` transitions, no browser console errors.
- **Test-harness lesson**: getComputedStyle returns reduced-motion duration as
  `1e-05s` (0.01ms in seconds) — don't compare it to a `ms`-literal string; compare
  numerically. Also, exiting Framer items stay in the DOM during their exit
  animation, so a count read must `sleep(~700ms)` after Pop/Dequeue before
  asserting the final count.

### 2026-09-01 — Phase 2.4.1: Playground Architecture

- **Reusable playground system** at `/playground/:slug`, driven entirely by a
  playground registry. NOT the complete Binary Search/Stack/Queue playgrounds —
  this phase builds the pluggable foundation Phase 2.4.2 fills in. Landing,
  Explore, Concept page, Visualization Engine, and design system untouched.
- **Architecture**: URL → PlaygroundPage → playground registry →
  playground config → generic PlaygroundShell → concept playground →
  (future) existing Visualization Engine. PlaygroundPage has **no
  algorithm-specific logic**.
- **Registry** `src/data/playgrounds/playgroundRegistry.js` — `getPlayground(slug)`
  returning config or null (no if/else chains, no algorithm logic). Delete old
  `pages/PlaygroundPlaceholder.jsx`.
- **Playground configs** (`src/playgrounds/{BinarySearch,Stack,Queue}/*.js`):
  each defines `slug/title/description/experience/conceptSlug/inputs/operations/
  validate`. `experience`: `'standby'` (binary-search — shell renders + validates,
  but no RUN execution yet) vs `'coming-soon'` (stack/queue — page shows
  "Playground coming soon." + Back to Concept). Binary Search config pre-declares
  its array + target inputs, RUN/RESET operations, and `validate()` (non-empty,
  all numbers, sorted ascending, target finite).
- **Reusable components** (`components/playground/`, all presentational,
  config-driven):
  - `PlaygroundShell` — generic outer structure; owns generic state (values,
    errors, status), builds defaults from `config.inputs`, delegates `run`/
    `validate` to config; composes Header → Input → Controls → Output → Status.
    Two-column desktop grid (input+controls | viz+status) → single column ≤1024
    (INPUT → CONTROLS → OUTPUT → STATUS via `order:3` on the right panel).
  - `PlaygroundHeader` — `PLAYGROUND` label + title/description (from config) +
    "Back to Concept → `/concept/:slug`".
  - `PlaygroundInput` — type-agnostic foundation: `number` / `array` (comma
    textarea → parse) / `text`; labelled (htmlFor), help text, inline error, clear
    focus-visible ring. Future types (select/toggle/slider) plug in as cases.
  - `PlaygroundControls` — maps `operations` to real buttons (variant gold/navy/
    ghost via existing `.btn`), per-op `disabled`, aria-labels. No hardcoded
    buttons.
  - `PlaygroundOutput` — labelled frame (**VISUALIZATION**) around children;
    capable of rendering the existing Visualization Engine (future), no duplicated
    viz logic.
  - `PlaygroundStatus` — `idle`/`running`/`success`/`error` with distinct
    icons + colored-but-not-color-only states, `role="status" aria-live="polite"`.
- **PlaygroundPage** (`pages/Playground/`) — reads slug → registry; null config
  → "Playground not found." + Back to Explore (no crash); `coming-soon` → message
  + Back to Concept; else PlaygroundShell. Concept data resolved from concept
  registry for future viz wiring.
- **Routing**: `App.jsx` now points `/playground/:slug` at PlaygroundPage.
  Concept "Open Playground" buttons already navigate to `/playground/:slug`
  (unchanged, now resolves to the real page).
- **NO new deps.** `npm run lint` ✓ (clean), `npm run build` ✓ (2310 modules;
  `index-6HZIrZ01.js` 432.18 kB gzip 133.04, `index-2gTt5NTI.css` 65.14 kB gzip 9.06).
- **Verified via headless Edge CDP + self-hosted Vite (`verify-playground.mjs`,
  `verify-landing.mjs` in temp) — 32/32 + 5/5 PASS**: explore (12 cards),
  concept → "Open Playground" → `/playground/binary-search`, binary-search shell
  (h1/PLAYGROUND label/Back to Concept/array+target inputs/Run+Reset/Idle status),
  RUN(valid) → "Configuration ready.", unsorted array → "Please enter a valid
  input." + "Array must be sorted in ascending order.", Reset restores array +
  Idle, stack+queue → "Playground coming soon.", invalid slug → "Playground not
  found." + Back to Explore, no horizontal overflow at 1440/1024/768/390/320,
  mobile single column, Visualization Engine still works on /concept/binary-search,
  landing `/` + `/quiz/:slug` + `/concept/stack` all render, no browser console
  errors on any route.
- **Test-harness lesson**: Node ≥22 native `WebSocket` client (use `ws.onmessage`,
  NOT `ws.on('message')`); import `vite` from a `file://` URL path on Windows
  (`C:` scheme throws `ERR_UNSUPPORTED_ESM_URL_SCHEME`). `click()` → React batches;
  dispatch `input` via the `HTMLTextAreaElement.prototype` value setter then wait
  before re-reading.

### 2026-09-01 — Phase 2.4.2: Binary Search Playground (full interactive experiment)

- **`src/playgrounds/BinarySearch/binarySearchAlgorithm.js`** (NEW) — pure state
  generator `generateBinarySearchStates(array, target)`. Builds pedagogical states:
  a "Start wide." initial snapshot + one push per comparison (move left/right with a
  `gather(range)` status + heading/detail), then a terminal `found` OR `notFound`
  snapshot. Every state carries the Phase 2.3 snapshot interface (`key/low/high/mid/
  eliminated/found/notFound/status/badge/heading/detail`) plus `comparisonCount`.
  Guards: `midValue < target` → discard the left half (eliminate left..mid, left=mid+1),
  else discard right; on an emptied range emits a terminal not-found with `low:-1,
  high:-1`, all cells eliminated, and a `✕ ... is not present` status. Empty/zero-length
  array returns `[]` (never crashes).
- **`BinarySearchPlayground.jsx`** (NEW) — the concept wrapper. `experiment === null`
  → idle "Ready to experiment." empty state (Search icon + copy). Otherwise builds a
  dynamic `concept` object (`visualization:'binary-search'`, `title`, `complexity`
  `{time:'O(log n)',space:'O(1)'}`, `visualizationConfig:{array,target}`,
  `visualizationSteps: experiment.states`) and renders
  `<VisualizationEngine key={experiment.runId} concept={concept} />`. The `key`
  (`runId`, set by the config's `run()` via `Date.now()`) forces a fresh engine
  instance per run so step state never leaks across runs. **100% reuses the Phase 2.3
  engine** — controls, progress, playback, speed all come from the engine; the wrapper
  holds no algorithm logic. + `BinarySearchPlayground.css` for the idle state.
- **`binarySearchPlayground.js`** (UPDATED) — `experience:'full'`; `Component:
  BinarySearchPlayground`; `run(values,{setErrors,setStatus,setExperiment})` runs
  `validate`, on failure sets field errors + error status ("Please fix the input before
  running." + first message); on success generates states and returns a `{runId,array,
  target,states}` experiment with success ("Target found." / `${target} matches the
  array after N comparisons.`) or notice ("Target not found." / `${target} is not
  present...`) status. `onReset` keeps current input values (nukes experiment, restores
  idle "Ready to experiment."). Spec-exact validation messages: empty → "Please enter
  at least one number."; invalid → "Please enter only valid numbers."; unsorted →
  "Binary Search requires a sorted array."; target non-finite → "Please enter a valid
  target."
- **`PlaygroundShell.jsx`** (UPDATED) — owns an opaque `experiment` state object;
  delegates `run`/`onReset` to `config`; `handleInputChange` clears the experiment and
  sets an INVALIDATED idle status ("Input changed. Run the experiment again.") whenever
  an experiment exists (else back to READY); renders `config.Component` in the output
  frame with `experiment`+`values`. Default fallback (no `config.run`) still validates +
  shows the standby copy. Empty experiment (before/after reset) now renders
  `config.Component`'s idle state instead of a raw div.
- **`BinarySearchVisualizer.jsx` + `.css`** (EXTENDED, non-breaking) — dynamic
  `gridTemplateColumns` via inline style (5 cells → 8 cols, 7 → 6, 10+ → 4) so arbitrary
  array lengths render cleanly; `.cviz__array--dense` modifier for >12 elements (smaller
  cells + ellipsis overflow safety); `.cviz__facts` row (Comparisons + Range) rendered
  only when `snapshot.comparisonCount !== undefined`; `.cviz__not-found` / `cviz__found`
  chips; terminal not-found uses `low:-1/high:-1` so no LOW/MID/HIGH pointers render
  (guarded). Concept page snapshots (no comparisonCount/notFound) render exactly as
  before — unchanged behavior.
- **`PlaygroundStatus.jsx` + `.css`** (UPDATED) — added `notice` kind (SearchX icon,
  neutral muted dashed styling) for NOT FOUND results; idle/running/success/error
  unchanged.
- **`PlaygroundControls`** visibility detail: the generic shell Run/Reset buttons and
  the engine's VisualizationControls coexist; both carry distinct aria-labels —
  the engine's reset is "Reset to the first step", the shell's is "Reset the experiment".
- **NO new deps.** `npm run lint` ✓ (clean), `npm run build` ✓ (2313 modules;
  `index-JHRby4XL.js` 437.10 kB gzip 134.37, `index-gD6IbpZN.css` 66.73 kB gzip 9.26).
- **Verified via headless Edge CDP + self-hosted Vite (`verify-phase242.mjs` in temp,
  Vite on :5201) — 45/45 PASS** covering all 48 spec scenarios: shell (h1 / PLAYGROUND
  label / Back to Concept / array textarea / target input / Run+Reset / idle status+viz),
  T1 found (STEP 1, goEnd→Found 60 chip, Comparisons, O(log n)/O(1), "Target found."),
  prev/next advance + return to STEP 1, T16 input-invalidated status, T2 not-found chip
  "Not found 25" + "Target not found.", T10 reset preserves target 25 + restores idle +
  hides chip, T3 unsorted error "Binary Search requires a sorted array." + "Please fix
  the input", T4 invalid numbers, T5 empty array, T6 invalid target, T7 negatives
  (Found -20), T8 duplicates (Found 20), T9 decimals (Found 3.5), T13 play auto-advances +
  **auto-stops at final** (play button returns to "Play"), T15 speed 2x active, no
  horizontal overflow at 1440/1024/768/390/320, mobile single-column grid, landing /
  explore / concept render, concept Visualization Engine still works, stack+queue still
  coming-soon, no browser console errors.
- **Test-harness lessons (important)**: ① React 19 controlled **number inputs** do NOT
  reliably commit a change driven by the `HTMLInputElement.prototype.value` setter +
  dispatched Event/InputEvent — React's value tracker re-renders the DOM value back to
  the previous controlled value, so the injected value is silently lost (read back "60"
  after setting "25"). The **reliable method is CDP `Input.insertText`**: `el.focus()` +
  `el.select()` then send `Input.insertText` — that fires a real user-edit `beforeinput/
  input` that React handles, and it works consistently for both textarea and number. ②
  The found/not-found chips only render on the **terminal** snapshot (step 1 is the
  "Start wide." initial state), so tests must advance to the last step (click Next until
  `disabled`) before asserting the chip text. ③ The engine Play button is **never
  disabled** — auto-stop means `isPlaying` flips false at the end, so assert "auto-stops
  at final" by checking the play button text returns to "Play" (no "Pause"). ④ When there
  are two Reset buttons (shell vs engine), disambiguate by exact aria-label (engine:
  "Reset to the first step"). ⑤ A transient CDP `Page.navigate`/target connect drop can
  flake the whole run (all shell checks fail) — re-running is sufficient to recover.

### 2026-09-05 — Binary Search Playground UX/visualization overhaul (Phase 2.4.2 refinement)
- **Goal**: fix the weak custom-array experience + animation readability: array is now the
  star of the animation with explicit LOW/MID/HIGH pointer pills that move step by step;
  auto-play runs when the experiment starts; auto-scroll brings the visualization into view;
  the nested "card in card" look is flattened to a single output card; validation/layout/
  responsive/accessibility tightened. No color-palette, architecture, or other-page changes.
- **Input handling (root cause of lost keystrokes)**: React 19 controlled `type="number"`
  inputs silently drop edits driven by value-setter/insertText (React re-renders the DOM back).
  Fix: the Target field is now `type="text"` + `inputMode="decimal"` and the array textarea
  keeps the **raw typed string** in shell state (never formatted while typing). Parsing
  (`parseArray`/`parseTarget`) happens only in `validate`/`run`. `PlaygroundInput`
  stores everything as text → `onChange(raw)`; `defaultValues` converts array/`number`
  defaults to their text form (`[10,...].join(', ')`).
- **Live validation**: `PlaygroundShell` now calls `config.validate` on **every keystroke**
  (cheap: ≤30 elements) → inline `role=alert` errors update as you type, and the generic
  **Run button is disabled exactly when the input is genuinely invalid** (`disabled={{run}}`
  passed to `PlaygroundControls`; `reset` never disabled). Shell fallback path (no
  `config.run`) untouched. `MAX_ARRAY_LENGTH = 30` lives only in `binarySearchPlayground.js`
  (error "Please enter at most 30 numbers for the best view."); duplicates stay allowed
  (algorithm finds an occurrence).
- **`binarySearchAlgorithm.js`**: preserved the pedagogical walk (wide → mid comparisons →
  eliminated array + terminal found/notFound). Every state now also carries an
  `eliminated` array (per-index) so the range narrowing is visible as cell de-emphasis.
- **`BinarySearchVisualizer.jsx/.css`** (main rewrite): board flattened — one transparent
  `.cviz__stage` (no nested card) + `.cviz__explain` with only a `border-top` divider =
  single card generated by the outer container (`PlaygroundOutput` on the playground,
  `VisualizationContainer` on the concept page). New glyphs: LOW/MID/HIGH **pointer pills**
  rendered in their own row above the cells (chevron, violet/cyan/lime), positioned per
  snapshot index, with `layoutId` shared-element springs so MID (and LOW/HIGH) glide between
  slots on step change. Cells: `--range` subtle active tint, `--elim` dimmed to 0.22 opacity,
  `--mid` highlight, `--found` lime + check badge; found/not-found chips; facts row
  (Comparisons + Range — from `comparisonCount`); terminal not-found uses `low:-1/high:-1`
  so no pointers render. `min-width` inline (`n*44px`) inside `.cviz__scroll` for arrays
  >16 cells (page never overflows), `--dense` modifier for >24. Responsive scales ≥640/≤640.
- **`VisualizationEngine`**: new props `embedded` (skip `VisualizationContainer`, so the
  playground's `PlaygroundOutput` is the only card) and `autoPlay` (calls `usePlayback.play`
  on mount → auto-play begins when Run starts, engine keyed by a unique `runId` so repeated
  Run clicks remount cleanly and never stack timers). `usePlayback` now also returns `play`.
  `.viz-engine__stage` + `.viz-engine__controls` (divider border-top). Concept page keeps
  non-embedded, manual mode.
- **`BinarySearchPlayground.jsx`**: renders `<VisualizationEngine key={experiment.runId}
  concept={...} embedded autoPlay />`; idle state sans dashed box. `binarySearchPlayground.js`:
  `runId = Date.now().toString(36) + Math.random().toString(36).slice(2,7)`; `run()` validates
  (field errors + "Please fix the input before running.") or generates the experiment with
  success/notice status; `onReset` preserves typed values and restores idle.
- **Layout/responsive**: playground grid changed to `minmax(0,4fr) minmax(0,8fr)` (viz ~2x
  width of the input/controls side); stack at ≤1024 with Input → Controls → Output → Status
  ordering. `PlaygroundStatus` restyled as a quiet **borderless inline strip** (thin left
  accent, no card) so the right side reads as one cohesive output surface. Auto-scroll:
  `handleAction('run')` → `outputRef.scrollIntoView({block:'start'})` once per Run (inside
  `requestAnimationFrame`), never repeated by auto-play steps, no pointer/hover scroll.
- **NO new deps.** `npm run lint` ✓ (clean; removed an unused `MAX_ARRAY_LENGTH` export from
  `PlaygroundInput`), `npm run build` ✓ (2313 modules; `index-D-lDF3I0.css` 67.26 kB gzip
  9.55, `index-DkIvHUau.js` 437.82 kB gzip 134.76).
- **Verified via headless Edge CDP + self-hosted Vite (`verify-unbox-fix.mjs` in temp,
  port 5221) — 61/61 PASS**: custom arrays preserve exact typed text ("10, 20, 30, 40" etc.),
  auto-play starts on Run + advances, auto-stops without a jump to final, double Run →
  single engine instance, LOW/MID/HIGH pills render (Step 2 has all three), auto-scroll after
  Run, not-found chip + notice status, Reset restores idle while **keeping** typed values,
  live validation (Run disabled on empty → inline error → re-enabled after fix), invalid cases
  (empty/letters/multi-comma tolerated/unsorted/extra-spaces tolerated/>30 blocked) all produce
  the spec messages, negatives + duplicates run, no page overflow at 1440/1024/768/390/320
  incl. a 20-element array, mobile single-column input-first, landing°/explore°/concept
  binary-search°/stack°/queue°-coming-soon all intact, single output card (no nested boxes,
  confirmed via DOM dump too), labels + aria-live status + no console errors.
- **Test-harness additions**: default Edge headless viewport is 800px so grid-col checks need
  explicit emulation (1440); the STEP pill text includes a trailing "· STEP n / m" so compare
  with `startsWith('STEP 1')`; a disabled Run button swallows clicks — invalid-input assertions
  rely on the live inline error text now.

