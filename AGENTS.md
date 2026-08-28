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

Out of scope (later phases):
- Explore page, About page, concept pages, quiz system, admin dashboard,
  authentication, backend, database, AI.

---

## Session Log

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
