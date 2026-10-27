# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Viliam Džubara, a computer-networks engineering student at TUKE. Built with React 19 + Vite 8 (plain JavaScript/JSX, no TypeScript, no router, no CSS framework). The site is **bilingual (Slovak + English)**: every user-facing string lives in `src/content.js` under `sk` and `en` — never hardcode copy in components, and always add/change both languages. Code comments are in Slovak.

The app lives in `site/`; the parent `CV_site/` folder only holds an empty stray `package-lock.json`. Run all commands from `site/`.

`site/` is the git repository root. Deployment is GitHub Pages via `.github/workflows/deploy.yml`: every push to `main` runs `npm ci`, `npm run lint`, `npm run build` and publishes `dist/`. The repo is the user site `viliam2586-stack/viliam2586-stack.github.io`, served at the domain root (https://viliam2586-stack.github.io), which is why absolute paths like `/prefs.js` and `/favicon.svg` work. Moving to a project repo (served under `/<repo>/`) would require setting Vite `base` and making those paths relative.

## Commands

```
npm run dev       # Vite dev server with HMR
npm run build     # production build to dist/
npm run preview   # serve the built dist/
npm run lint      # ESLint (flat config: js recommended, react-hooks, react-refresh)
```

When checking visuals with headless Edge (`msedge --headless=new --screenshot`), note that `--virtual-time-budget` freezes CSS animations, `requestAnimationFrame` and `IntersectionObserver` delivery, and same-origin iframes measure intersection against the top-level window; drive the browser in real time over the DevTools protocol (`--remote-debugging-port`) to verify motion. Headless windows also can't be narrower than ~500px, so test phone widths in an iframe.

There is no test suite. Verification routine after each larger change: run the dev server, check it in the browser, check for console errors, run lint, and build when needed.

## Working style

The owner is building this step by step as a learning project. Before each change, explain: what we're doing, why, where in the project it lives, how it will show up on the page, and how to verify it works. Add features one at a time rather than in large batches. The README (written for the repository, in Slovak) lists remaining content TODOs and ideas (light/dark toggle, project filtering, contact form); placeholder text like `[tvoje hobby]` is intentional until real content is provided. Keep the README's structure and "Ako upraviť obsah" section in sync when adding files or data arrays.

## Architecture

Design concept: the page is a computer network. Each section has a "cable" color taken from the T568B Ethernet pairs (`--orange`, `--green`, `--blue`, `--brown` in `src/index.css`); the same color marks the section in the hero topology, the nav underline, and the bar above the section heading. Font is Archivo (Google Fonts, variable `wdth` axis): headings use `font-stretch` 108–125%, body text normal width.

Single page: `index.html` (loads `public/prefs.js` synchronously in `<head>`) → `src/main.jsx` → `App.jsx`. A printable CV page (`cv.html`) existed earlier and was removed at the owner's request; the CV now lives only as PDFs outside the repo.

- **`src/content.js`**: `profile` (name and public contact data; values starting with `[` are placeholders that `isPlaceholder()` keeps from becoming links; `displayUrl()` shows URLs without protocol and with decoded diacritics), `content.sk` / `content.en` (all copy, including `projects.items`, `skills.groups`), `projectBase` (language-independent technologies + images, merged by `withBase`). `applyLanguage(lang)` sets `<html lang>`, persists `localStorage.lang`, and syncs `?lang=en` in the URL; `setDocumentMeta` updates title/description. Initial language is decided in `public/prefs.js`: `?lang=` → stored choice → `navigator.language` (sk/cs → Slovak, otherwise English). Section ids (`o-mne`, `projekty`, …) stay Slovak in both languages.

The portfolio is in `src/App.jsx`:

- **`sectionLayout`**: id, `cable` color, and `x`/`y` (percent position in the hero topology); `buildSections(t)` merges in the translated label/note. Renders both the top nav and the topology nodes. Section `<section>` elements themselves are written out in JSX and must keep matching ids.
- **Hero topology** (`Topology` component): SVG lines (viewBox 0–100, `pathLength="1"` for the draw-in animation) from the center profile photo to each node; nodes are absolutely positioned `<a href="#id">`s. Clicking sends a `.packet` that animates from center to the node via `--to-x/--to-y`; `onAnimationEnd` then scrolls to the section. With `prefers-reduced-motion` it scrolls immediately.
- **Active nav**: an `IntersectionObserver` on `main > section[id]` (rootMargin band in the middle of the viewport) sets `aria-current` on the matching nav link.
- **Projects** (`t.projects.items`): `id`, `title`, `kind`, `technologies`, `shortDescription`, `details`, optional `image`. Rendered as a "routing table". The open modal stores the project but renders `openedProject` looked up by id in the current language, so switching language while it's open re-translates it.
- **Project modal "grow from row" animation** spans JS and CSS: `openProject` measures the clicked row and stores its offset from viewport center plus a start scale in `modalOrigin`, passed as `--modal-start-x/y/scale`. A `requestAnimationFrame` in a `useEffect` sets `modalExpanded` → `.is-expanded` transitions to identity. Keep `targetWidth` in `openProject` (`min(900, innerWidth - 64)`) in sync with `.project-modal-content` width / `.project-modal` padding. The effect also locks body scroll, closes on Escape, and returns focus to the opening row.
- **Skill groups** (`t.skills.groups`): each with its own cable color; tool lists are shared via `skillTools` in `content.js`.
- **`TechTag`** renders every technology/skill label. Tags are keyed by the displayed name (same in both languages for tools). If the name is a key in `src/techLinks.js` it becomes an external link (new tab, `rel="noopener noreferrer"`) that fills with the surrounding section's `--cable` color on hover; otherwise a plain tag. In project rows the title `.route-open` button is stretched over the whole row via `::after`, and `.tag-list` sits above it (`z-index: 1`) so tag links stay clickable without nesting links in buttons.
- **`src/NetworkBackground.jsx`**: fixed full-viewport `<canvas>` behind everything (`.site-shell` uses `isolation: isolate`, canvas `z-index: -1`). Drifting nodes in cable colors (read from CSS variables at mount), links between near nodes, packets traveling along links, mouse pointer acts as a node and gently repels nearby ones, pointerdown on empty space (not on text/links/buttons) emits a ripple and a packet burst. Pauses when the tab is hidden; draws a single static frame when animations are off. Nodes are only regenerated when viewport width changes (mobile URL-bar height changes don't reset it).

- **Motion and theme settings**: `public/prefs.js` sets `<html data-motion="on|off" data-theme="light|dark">` before render from `localStorage['motion'|'theme']`, falling back to `prefers-reduced-motion` / `prefers-color-scheme`. Dark mode only redefines the tokens under `:root[data-theme='dark']` in `src/index.css` — never hardcode colors in `App.css`; use tokens (`--backdrop`, `--shadow`, `--paper-top`, `--glow-strength` exist for the non-obvious cases). `NetworkBackground` reads colors from CSS at mount and re-reads them when its `dark` prop changes; nodes store a `colorIndex`, not a color string. The toggles live in `.settings` in the header; at ≤600px it becomes a fixed bottom-right panel (the header drops `backdrop-filter` there, since that would make it the containing block for the fixed panel). All motion CSS keys off `:root[data-motion='off']` (not the media query), and JS reads React state `motionOn` (topology packet, smooth scroll, `NetworkBackground animate` prop). The "Animácie" switch in the top bar flips it and persists the choice. Note: Windows with "Animation effects" off reports `prefers-reduced-motion: reduce`, so the default there is off.

- **Scroll animations** (only when `data-motion='on'`): a second `IntersectionObserver` adds `.is-visible` to each `main > .section` once; CSS then stretches the heading cable bar, clip-reveals the `h2`, and staggers children of `.route-table`, `.skills`, `.about`, `.contact-list` via the `route-learned` keyframes (stagger index `--row` set by `:nth-child` rules). Reveals use `animation`, not `transition`, so the stagger delay doesn't leak into hover transitions. Hidden pre-reveal state is scoped to `:root[data-motion='on'] .section:not(.is-visible)`. A rAF-throttled scroll listener writes `--scroll` (0–1) on `<html>` for the `.scroll-cable` progress bar under the header, colored by the active section. `NetworkBackground` shifts nodes on scroll by a per-node `depth` (parallax) and raises a decaying `traffic` value that boosts packet spawn rate, packet speed and link opacity while scrolling. `.background-tint` is a fixed radial glow whose color is the registered `@property --tint` (set on `.site-shell` from the active section, so it can transition) and whose position follows `--scroll`. At the very bottom of the page the last section is forced active, since it's too short to reach the observer's middle band.

Breakpoints in `src/App.css`: 900px (single column) and 600px (mobile; brand hidden, topology notes hidden).
