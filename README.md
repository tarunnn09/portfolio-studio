# Portfolio Studio

A local-first portfolio generator and copy distillation pipeline for engineers and designers.

I built this because I noticed a recurring pattern among engineers I know (and myself): having a solid resume and meaningful shipped work, but either having no personal website or an abandoned one that got stuck halfway through a Webflow or Framer template. 

Generic website builders make you make layout, typography, and spacing decisions you don't actually want to think about. Most "AI site generators", on the other hand, produce an instantly recognizable look—garish purple gradients, glassmorphism, and boilerplate copy packed with empty buzzwords ("passionate visionary leveraging agile synergy").

Portfolio Studio approaches this as a data normalization and rendering pipeline: you provide raw, unpolished notes about what you built and the metrics you touched, an LLM rewrite pass strips the filler and structures the impact, and the engine renders it into one of three opinionated, senior-designed layouts. You leave with real, standalone code—either an unbundled React/Vite project or pre-rendered static HTML.

---

## Design System & Presets

Instead of skinning a single card grid with different color palettes, each preset is an independent layout with its own typography and spatial rules:

* **Editorial:** Typeset like a personal essay. 640px centered column, Instrument Serif display typography with italic deck, pull-quote bio, and a sequential vertical timeline with hairline tick marks.
* **Minimalist:** Swiss International Style. Warm charcoal palette, pure Manrope hierarchy relying on weight contrast (300 weight meta vs 800 display), fixed two-column grid with a sticky left rail, 0px border-radius, and 1px hairline rules.
* **Terminal:** Restrained developer-tools motif. Near-black zinc palette with international orange (`#FF4F00`) accents. Monospace hero card simulating a terminal shell (`~/portfolio/<name>`), transitioning into a clean sans-serif body for long-form reading comfort.

---

## Engineering Notes

* **Flat state without Context re-renders:** Form state and generation status are split across two Zustand stores (`wizardStore` and `generationStore`). This prevents React Context re-render cascades across the preview iframe/canvas on active keystrokes.
* **Negative prompt constraints & metric preservation:** The copy generation prompt explicitly forbids filler vocabulary (*passionate, rockstar, ninja, synergy, leverage, cutting-edge, results-driven*). It enforces first-person perspective, a 12-word ceiling on taglines, and strict preservation of numbers and percentages found in raw notes.
* **Offline fallback engine:** If an Anthropic API key isn't provided or network access is unavailable, a local deterministic heuristic engine restructures messy notes and metrics into impact-first bullets immediately.
* **Defensive JSON parser:** Code blocks (```json) and loose preamble are stripped before validation. If the schema fails, a single auto-retry is triggered with an isolated JSON contract prompt before surfacing any error.
* **Clean unbundled export:** Client-side ZIP generation via JSZip isolates only the selected template. The exported React/Vite bundle has zero runtime styling libraries and zero dead code from the unselected presets.

---

## Getting Started

### Prerequisites

* Node.js 18+ (tested on Node 20 LTS)
* npm 9+

### Setup

```bash
git clone https://github.com/<your-username>/portfolio-studio.git
cd portfolio-studio
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### Verification Suite

Run the headless verification script to validate copy distillation heuristics, forbidden word filtering, and ZIP/HTML bundle generation:

```bash
npx vite-node src/test/verify.ts
```

### Production Build

```bash
npm run build
```

Bundle output target: `< 200KB` initial gzipped JS, with template layouts split into on-demand lazy chunks.

---

## Directory Layout

```
src/
├── components/
│   ├── ui/               # Base primitives (Button, Input, Tag, Panel)
│   ├── wizard/           # 4-step structured data collection
│   ├── preview/          # Split-screen preview and viewport toggle
│   ├── templates/        # Independent layout presets (editorial, minimal, terminal)
│   ├── export/           # Export modal and deployment helpers
│   └── layout/           # Header and status chrome
├── stores/               # Zustand stores
├── lib/
│   ├── llm/              # Prompt templates, Claude client, offline heuristic, anti-hype filter
│   └── export/           # JSZip React bundler and static HTML generator
├── styles/               # Design tokens (tokens.css)
└── types/                # Normalized PortfolioData contracts
```

---

## License

MIT
