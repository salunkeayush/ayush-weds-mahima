# Wedding Invite Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first, Apple-style scroll wedding invite for Mahima & Ayush with story, venue map, tappable event schedule, wardrobe planner and Google-Form RSVP, deployed to GitHub Pages.

**Architecture:** Plain static site (HTML/CSS/vanilla ES modules), no build step. Pure logic (countdown, RSVP payload, maps URL, event data) lives in small tested modules under `js/`; visual sections are separate HTML partials-in-one-page styled by per-section CSS, animated by GSAP + ScrollTrigger. RSVP posts to a Google Form `formResponse` endpoint with an `USE_EMBED` fallback.

**Tech Stack:** HTML, CSS, ES modules, GSAP 3.12.5 + ScrollTrigger (pinned jsDelivr CDN), Node 18+ `node:test` for logic tests, Python venv (Pillow/PyMuPDF) for asset prep, `gh` CLI for deploy.

**Spec:** `docs/superpowers/specs/2026-10-18-wedding-invite-design.md`

## Global Constraints

- Hosts: Ayush Salunke (groom), Mahima Malani (bride). Hashtag `#AyushMahnbhava`. Sign-off "Malani Family Welcomes You".
- Wedding 11–12 December 2026; venue "The Democracy Hotel, Ashoknagar, Satpur Colony, Nashik, Maharashtra 422007, India".
- Events: Mayra Fri 11 Dec 10:00 AM (Ganga Ghat Hall); Haldi Fri 11 Dec 3:00 PM (Poolside Lawn); Sangeet Fri 11 Dec 7:30 PM (Congruence Convention Hall); Baarat Swaagat & Reception Sat 12 Dec 11:00 AM onwards (Baarat at hotel entrance/porch, Reception at Congruence Convention Hall); Phere & Saptapati Sat 12 Dec 4:00 PM onwards (Ganga Ghat Amphitheater).
- Palette: cream, blush, gold, deep maroon; elegant script headings. Haldi palette "Sundowner"; Baarat/Reception palette "Pastel & Pearl".
- RSVP fields exactly: Name, Email (required, for Google receipt), Attending (yes/no), Number of people. Nothing else.
- Countdown target `2026-12-11T10:00:00+05:30`.
- Mobile-first; also good on iPad/desktop. First screen under ~3 MB; images WebP, lazy-loaded below fold. Respect `prefers-reduced-motion`.
- All asset paths relative (site served from `/ayush-weds-mahima/`). Repo `salunkeayush/ayush-weds-mahima`, URL `https://salunkeayush.github.io/ayush-weds-mahima/`.
- No backend, no build step. Public repo/Pages publish only after hosts approve the finished site.

## Review Focus

- Countdown after the target passes → shows "It's today! / Happening now", never negative numbers (Task 2).
- RSVP "Number of people" of 0, negative, fractional, blank or >20 when Attending=yes → rejected; when Attending=no, count is submitted as 0 and not required (Task 3).
- RSVP email malformed or name only whitespace → blocked with inline message; double-tap submit sends once (Task 3).
- Form IDs still placeholders → stub mode never makes a network call and tells the dev, while guests see a normal thank-you in dev only (Task 3).
- `prefers-reduced-motion` → no pinned/parallax scenes, content still fully readable (Task 12).
- Very narrow (320px) and very wide (1920px) screens, landscape phone → no horizontal scroll, venue/schedule maps usable (Task 12).
- Images fail to load / JS blocked → text content of events and dress codes still visible (Task 12).

---

### Task 1: Scaffold, config and asset pipeline

**Files:**
- Create: `index.html` (empty shell with title/meta/viewport/OG tags), `js/config.js`, `scripts/prepare_assets.py`, `package.json` (`"type":"module"`, script `test`: `node --test tests/`), `.gitignore`, `README.md`
- Create dirs: `css/`, `js/`, `tests/`, `assets/img/`, `assets/wardrobe/`

**Interfaces:**
- Produces (`js/config.js`): `export const COUPLE = { groom, bride, hashtag }`, `export const EVENTS: Array<{id, name, date, time, dateISO, spot, dressCode, palette: string[], blurb}>` (exactly 5 entries, ids in order: `mayra`,`haldi`,`sangeet`,`reception`,`phere`), plus `export const BAARAT_ARRIVAL = { name:'Baarat Swaagat', spot:'Hotel Entrance' }` used only by the venue map's entrance spot, `export const VENUE = { name, address, mapsUrl }`, `export const COUNTDOWN_TARGET: string`, `export const RSVP = { USE_EMBED: boolean, FORM_ACTION_URL, FIELD_NAMES: {name,email,attending,count}, EMBED_URL }` (placeholder values `REPLACE_ME`).
- Produces (`scripts/prepare_assets.py`): writes WebP files to `assets/img/` (max 1600px long edge, quality ~78, names `story-*.webp` by beat) and wardrobe PNG→WebP pages to `assets/wardrobe/p1..p7.webp`; run with the venv python.

- [ ] **Step 1:** Create `package.json`, `.gitignore` (`node_modules`, `.venv`), and `git init` in the project root (project is not yet a repo).
- [ ] **Step 2:** Write `js/config.js` with all values from Global Constraints verbatim (dress codes from the spec table; palettes as hex arrays: Sundowner `#F26B1D #F58A1F #F7A41D #F9BF3B #FBD85D`, Pastel & Pearl `#E8DDE0 #D5E3D3 #E5C7D2 #A8D1B5 #B79ACB #7FA7D9 #5F7F68`).
- [ ] **Step 3:** Write `scripts/prepare_assets.py`: resize/convert the 11 photos in `photos/*/` to `assets/img/<beat>-<n>.webp` using a mapping dict at top of the file (beats: `proposal-he`×2, `proposal-she`×2, `jerseys`, `coffee`, `lake`, `snow`, `mountain`, `beach-selfie`, `coastal`; choose from the contact sheet — jerseys=Argentina stadium shot, coffee=cafe couple, etc.); render PDF pages at 110 dpi via PyMuPDF to `assets/wardrobe/pN.webp`. Also save the inspiration image's story panels cropped to `assets/img/panel-*.webp` (crop coordinates in a dict; original is 1024×1490, two columns of ~512px).
- [ ] **Step 4:** Run `python scripts/prepare_assets.py` with the venv from scratchpad (`.../scratchpad/venv/bin/python`). Expected: files created; `du -sh assets` reported, each image < 400 KB.
- [ ] **Step 5:** Commit `chore: scaffold project, config, optimized assets`.

### Task 2: Countdown logic (TDD)

**Files:** Create `js/countdown.js`, `tests/countdown.test.mjs`

**Interfaces:**
- Produces: `export function timeLeft(now: Date, target: Date): { done: boolean, days: number, hours: number, minutes: number, seconds: number }`

- [ ] **Step 1:** Tests: `timeLeft` for exactly 1 day 2h 3m 4s before target → `{done:false,days:1,hours:2,minutes:3,seconds:4}`; at target → `done:true` and all zeros; after target → `done:true` and all zeros (never negative); target parsed from `COUNTDOWN_TARGET` equals `2026-12-11T04:30:00Z`.
- [ ] **Step 2:** Run `node --test tests/countdown.test.mjs`; expect FAIL (module missing).
- [ ] **Step 3:** Implement `timeLeft` with floor division on millisecond difference.
- [ ] **Step 4:** Run; expect PASS. Commit `feat: countdown logic`.

### Task 3: RSVP logic (TDD)

**Files:** Create `js/rsvp.js`, `tests/rsvp.test.mjs`

**Interfaces:**
- Consumes: `RSVP` from `js/config.js`.
- Produces: `export function validate(input: {name:string,email:string,attending:'yes'|'no'|'',count:string|number}): { ok: boolean, errors: Partial<Record<'name'|'email'|'attending'|'count', string>>, clean?: {name,email,attending,count:number} }`; `export function buildBody(clean, fieldNames): URLSearchParams` (keys = `fieldNames.*`, attending sent as "Yes"/"No" to match form options); `export function isConfigured(rsvp): boolean` (false while any value is `REPLACE_ME`); `export async function submit(clean, rsvp = RSVP, fetchImpl = fetch): Promise<{ ok: boolean, stub: boolean }>` posting `mode:'no-cors'` to `FORM_ACTION_URL`.

- [ ] **Step 1:** Tests: blank/whitespace name → error; `a@b` and `foo` emails → error, `a@b.co` ok; attending missing → error; yes with count `0`, `-1`, `2.5`, `''`, `21` → count error; yes with `4` → clean.count 4; no with blank count → ok, `clean.count===0`; name trimmed; `buildBody` maps to entry keys with "Yes"/"No"; `submit` with placeholder config returns `{ok:true,stub:true}` and calls fetchImpl zero times; with real config calls fetchImpl once with `method:'POST', mode:'no-cors'`.
- [ ] **Step 2:** Run; expect FAIL.
- [ ] **Step 3:** Implement the four functions to satisfy the tests.
- [ ] **Step 4:** Run; expect PASS. Commit `feat: rsvp validation and submit`.

### Task 4: Maps link + events data tests (TDD)

**Files:** Create `js/maps.js`, `tests/maps-events.test.mjs`

**Interfaces:**
- Produces: `export function mapsSearchUrl(address: string): string` → `https://www.google.com/maps/search/?api=1&query=<encoded>`.
- Consumes: `EVENTS`, `VENUE`.

- [ ] **Step 1:** Tests: `mapsSearchUrl(VENUE.address)` contains `Satpur%20Colony` or `Satpur+Colony` and `422007`; `VENUE.mapsUrl === mapsSearchUrl(VENUE.address)`; `EVENTS` has exactly the 5 spec events in order with the exact times/dates/spots from Global Constraints; each has ≥1 palette entry only where spec gives a palette.
- [ ] **Step 2:** Run; expect FAIL. **Step 3:** Implement `maps.js`; set `VENUE.mapsUrl` through it. **Step 4:** Run; PASS. Commit `feat: maps url and event data`.

### Task 5: Theme, page shell and envelope opener

**Files:** Create `css/base.css`, `css/envelope.css`, `js/main.js`, `js/envelope.js`; modify `index.html`

**Interfaces:**
- Produces: CSS custom properties on `:root` (`--cream --blush --gold --maroon --ink`, `--font-script`, `--font-serif`, `--font-sans` using Google Fonts: Great Vibes or Pinyon Script for script, Cormorant Garamond for serif, Inter for sans); `js/envelope.js` exports `initEnvelope(onOpen: () => void): void`; `main.js` imports all section initialisers and gates scroll until the envelope opens (page scroll locked via `body.is-locked`); section ids in `index.html`: `#envelope #story #about #reveal #venue #schedule #wardrobe #rsvp #closing`.

- [ ] **Step 1:** Write base.css (reset, tokens, fluid type with `clamp`, `100svh` sections, 16px gutters, max-width 1100px container on desktop, `.reveal` utility).
- [ ] **Step 2:** Build envelope: wax-seal button (SVG monogram "M&A") on blush envelope; tap/Enter opens flap (CSS 3D transform), letter slides up, then `onOpen()` unlocks scroll and scrolls to `#story`. Reduced motion: instant open.
- [ ] **Step 3:** Verify by serving (`python3 -m http.server`) and screenshotting at 390×844 and 1280×800 via the claude-in-chrome or built-in browser skill; envelope visible, tap opens, no console errors.
- [ ] **Step 4:** Commit `feat: theme and envelope opener`.

### Task 6: Love-story scroll sequence

**Files:** Create `css/story.css`, `js/story.js`; modify `index.html`

**Interfaces:**
- Consumes: GSAP/ScrollTrigger globals; `assets/img/*`.
- Produces: `export function initStory(): void`.

- [ ] **Step 1:** Markup for `#story`: pinned container with scenes in order — title card ("Our Love Story" / "Two hearts. One journey."), "We met as teenagers…" (panel crop), "…grew together… dreamed together…", "…even when life took us to different places," (plane + two-window split panel), "no distance could change what we felt…", proposal scene (he proposed beach + she proposed autumn photos side by side/stacked on mobile, caption "…and then we said yes — twice."), "…and now, we're ready to begin a new journey… together." (hands panel).
- [ ] **Step 2:** `initStory`: one ScrollTrigger timeline per scene (pin, fade/scale text, subtle parallax on image layers); when `matchMedia('(prefers-reduced-motion: reduce)')` matches, skip pins and show scenes as stacked static blocks.
- [ ] **Step 3:** Verify by scrolling in a browser at 390×844: each scene's text readable, no overlap, smooth (no layout jumps). Commit `feat: love story scroll`.

### Task 7: "Little things about us"

**Files:** Create `css/about.css`, `js/about.js`; modify `index.html`

- [ ] **Step 1:** Section `#about` titled "Little things about us" with 4 swipeable/stacked cards: Coffee ("Fuelled by coffee. Two cups, zero regrets." using coffee-date photo), Goofy (beach selfie photo), Travel (lake/snow/mountain photos; "Passport stamps > everything else."), Messi & Barça (jerseys photo; "Mahima recently joined Team Messi and Culers everywhere. Ayush has never been prouder.", small blaugrana colour accent). Copy written by builder, light humour, hosts review.
- [ ] **Step 2:** `initAbout` adds staggered card reveal (reduced-motion safe). Verify visually; commit `feat: about section`.

### Task 8: Reveal and countdown UI

**Files:** Create `css/reveal.css`, `js/reveal.js`; modify `index.html`

**Interfaces:** Consumes `timeLeft` (Task 2), `COUNTDOWN_TARGET`, `COUPLE`.

- [ ] **Step 1:** `#reveal`: floral-arch frame, "Mahima & Ayush are getting married", "11th & 12th December 2026", "Nashik" and four countdown tiles (Days/Hours/Mins/Secs); when `done` show "Today we celebrate".
- [ ] **Step 2:** `initReveal` updates tiles each second via `timeLeft(new Date(), new Date(COUNTDOWN_TARGET))`; pauses when tab hidden. Verify, commit `feat: reveal and countdown`.

### Task 9: Venue map and tappable schedule map

**Files:** Create `css/venue.css`, `css/schedule.css`, `js/venue-map.js`, `js/schedule.js`, `assets/svg/hotel-map.svg`; modify `index.html`

**Interfaces:**
- Consumes: `EVENTS`, `VENUE`, `mapsSearchUrl`.
- Produces: `assets/svg/hotel-map.svg` is inlined SVG with hit-areas `<g data-spot="ganga-ghat-hall|poolside-lawn|congruence-hall|ganga-ghat-amphitheater|entrance">`; `export function initVenueMap(): void`, `export function initSchedule(): void`.

- [ ] **Step 1:** Draw a stylised, generic illustrated hotel-grounds map in SVG (cream paper, watercolour-ish shapes, lawn, pool, hall buildings, amphitheater arc, entrance gate, small Nashik/Godavari hint). Each spot has an icon from the inspiration (kalash, haldi bowl, dhol, horse, mandap).
- [ ] **Step 2:** `#venue`: shows the hotel name/address, the map, and an **Open Maps** button linking to `VENUE.mapsUrl` (`target=_blank rel=noopener`). Tapping a spot highlights it and shows a bottom-sheet card with the event(s) there.
- [ ] **Step 3:** `#schedule`: the same map style as an event timeline: five tappable event medallions (icon + name, grouped by Fri 11 Dec / Sat 12 Dec). Tap → card with date, time, spot, "Dress code →" link to `#wardrobe` card. Keyboard-operable (buttons, `aria-expanded`); content also present as plain text list for no-JS.
- [ ] **Step 4:** Verify at 390px and 1280px by clicking each spot; Open Maps href checked with `curl`/DOM. Commit `feat: venue map and schedule`.

### Task 10: Wardrobe planner

**Files:** Create `css/wardrobe.css`, `js/wardrobe.js`; modify `index.html`

**Interfaces:** Consumes `EVENTS` dress codes/palettes, `assets/wardrobe/p2..p6.webp`.

- [ ] **Step 1:** `#wardrobe` "Wardrobe Planner": horizontal snap-scroll cards (one per event, order per schedule) built from `EVENTS` data: illustration crop from the PDF page, dress code text, palette swatches (only Haldi and Baarat/Reception), then the closing note "The wardrobe guide is only to inspire. Wear what you feel your best in and bring your energy to celebrate with us."
- [ ] **Step 2:** Cards linkable (`#wardrobe-haldi`) from the schedule cards; opening from link scrolls and highlights the card. Verify; commit `feat: wardrobe planner`.

### Task 11: RSVP section and closing

**Files:** Create `css/rsvp.css`, `js/rsvp-ui.js`; modify `index.html`

**Interfaces:** Consumes `validate`, `submit`, `RSVP` (Task 3). Produces `export function initRsvp(): void`.

- [ ] **Step 1:** Form with Name, Email, Attending (two large pill radios: "Joyfully accept" → yes, "Regretfully decline" → no), Number of people (stepper 1–20, hidden when decline). Inline error messages from `validate`; submit button disabled while sending (prevents double send); success state "Thank you! A confirmation is on its way to <email>"; on `RSVP.USE_EMBED` render `<iframe src=EMBED_URL>` instead; in stub mode show a dev-only banner "RSVP not configured".
- [ ] **Step 2:** Closing: "We can't wait to celebrate with you!", "Mahima & Ayush", `#AyushMahnbhava`, "Malani Family Welcomes You". Verify form states in a browser; commit `feat: rsvp ui and closing`.

### Task 12: Responsive, motion, accessibility, weight verification

**Files:** Modify CSS/JS as needed; create `tests/page.test.mjs`

- [ ] **Step 1:** `tests/page.test.mjs` (reads `index.html` text): has all nine section ids; contains the five event names and times; contains `Open Maps` linking to a maps URL; every `<img>` has `alt`; no absolute `/`-rooted asset paths. Run `node --test tests/` → all PASS.
- [ ] **Step 2:** Browser checks with screenshots at 320×568, 390×844, 820×1180, 1440×900, 1920×1080 and landscape 844×390: no horizontal scroll, maps tappable. Emulate reduced motion and JS-off: events and dress codes still readable.
- [ ] **Step 3:** Weight: total transfer for first screen < ~3 MB (check file sizes of eagerly loaded assets; lazy-load the rest). Fix anything over. Commit `chore: responsive, a11y and perf pass`.

### Task 13: RSVP setup guide, hosts' review, GitHub deploy

**Files:** Create `docs/RSVP-SETUP.md`; update `README.md`

- [ ] **Step 1:** `docs/RSVP-SETUP.md`: step-by-step to create the Google Form (Name short answer, Email collected via "Responder input", Attending multiple-choice Yes/No, Number of people short answer/number), turn on "Send responders a copy of their response: Always", link to Google Sheets, get form action URL and `entry.NNN` names via "Get pre-filled link", paste into `js/config.js`, test RSVP checklist (receipt email arrives, row in Sheet; if not, set `USE_EMBED: true` and `EMBED_URL`).
- [ ] **Step 2:** Show the hosts the finished site locally; collect changes. **Stop here until hosts approve.**
- [ ] **Step 3 (after approval):** `gh repo create salunkeayush/ayush-weds-mahima --public --source=. --push`; enable Pages (`gh api -X POST repos/salunkeayush/ayush-weds-mahima/pages -f 'source[branch]=main' -f 'source[path]=/'`); poll until live; curl `https://salunkeayush.github.io/ayush-weds-mahima/` for 200 and open in browser to verify assets load under the subpath. Exclude big originals (`photos/`, `*.MP4`, the 54 MB PDF) from the repo via `.gitignore`.
- [ ] **Step 4:** Commit `docs: rsvp setup and deploy notes`.
