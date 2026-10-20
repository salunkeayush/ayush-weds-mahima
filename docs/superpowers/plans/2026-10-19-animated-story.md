# Animated Story Section Implementation Plan

> For agentic workers: execute inline (hosts chose Native). Steps use checkboxes.

**Goal:** Replace the photo/panel story with the scroll-scrubbed SVG stage from the spec addendum.
**Architecture:** `js/scenes/sN-*.js` each export `{ id, caption: string[], svg: string, animate(tl, t0) }`. `js/story.js` builds one sticky stage, injects each scene's markup, wraps a single GSAP timeline in a scoped helper, and scrubs it with ScrollTrigger. Static stacked fallback for reduced motion / no GSAP.
**Tech Stack:** inline SVG, GSAP 3.12.5 (already loaded), node:test.
**Spec:** docs/superpowers/specs/2026-10-18-wedding-invite-design.md (Addendum 2026-10-19)

## Global Constraints
- ViewBox 400x800 per scene; stage width `min(100vw, 50svh)`; scene duration 10 timeline units; scenes crossfade.
- Palette tokens: cream #f6ead9, blush #f2c9cc, rose #d98c95, gold #b98a3c, maroon #6e1a27, plus scene sky colours.
- Captions use the spec copy; script font Great Vibes. Everything below `#about` untouched.
- Reduced motion and no-GSAP → static stack, captions visible, no scrubbing.

## Review Focus
- GSAP missing/slow CDN → story still readable (static stack) and envelope still works.
- Every selector an `animate()` targets exists in that scene's markup (test).
- 320px, 390x844, 1440x900, landscape 844x390: stage fits, no horizontal scroll, caption not clipped.

### Task 1: Engine + scene contract + title scene
Files: `js/story.js` (rewrite), `js/scenes/s1-title.js`, `css/story.css` (rewrite), `tests/scenes.test.mjs`
- [ ] Test: every module in `js/scenes/` exports id/caption/svg/animate; animate() with a recording stub only targets selectors present in svg (`class="… name …"`), and calls tl at least once. RED (no scenes), then implement engine + s1, GREEN.
### Task 2: Scenes 2–3 (walk home, bench). Task 3: Scenes 4–6 (places, 2023 flight, call). Task 4: Scenes 7–9 (polaroids, hands+wreath, NYC).
- [ ] Each: add module, register in `js/scenes/index.js`, extend test list, run suite, screenshot at 390x844 for 3 progress points.
### Task 5: Integrate + verify + deploy
- [ ] Replace old `#story` markup in index.html with `<section id="story"><div class="story-track"><div class="stage"></div></div></section>`; update page.test; remove unused panel assets from the page (keep files).
- [ ] Checks: reduced-motion, GSAP-blocked (route abort), sizes above, weight; commit; push to `main` (Pages redeploys); verify live.
