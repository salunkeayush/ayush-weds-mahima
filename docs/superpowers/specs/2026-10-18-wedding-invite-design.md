# Wedding Invite Website — Design

Date: 2026-10-18. Status: draft for approval.

## Intent
A mobile-first, scroll-driven wedding invitation website for Mahima Malani and Ayush Salunke, shared by link with guests. It should feel like a premium product page (Apple-style scroll choreography) crossed with the luxury invite sites in the inspiration reels. Guests should read the couple's story, learn the events and venue, see what to wear, and RSVP. The hosts must be able to track RSVPs.

Hashtag: **#AyushMahnbhava**. Family sign-off in source material: "Malani Family Welcomes You".

## Facts (from the hosts)
- Couple: Ayush Salunke (groom), Mahima Malani (bride).
- Wedding: 11–12 December 2026. Venue: **The Democracy Hotel, Ashoknagar, Satpur Colony, Nashik, Maharashtra 422007, India**.
- Events (from the inspiration image and wardrobe PDF):
  | Event | Date | Time | Dress code | Palette |
  |---|---|---|---|---|
  | Mayra (Mayara, "Pihar ri Pehchan") | Fri 11 Dec | 10:00 AM | Women: bandhej/ghatchola saree or lehenga. Men: Nehru jacket/kurta | — |
  | Haldi | Fri 11 Dec | 3:00 PM | Breezy & comfortable festive outfits | "Sundowner" (oranges/yellows) |
  | Sangeet | Fri 11 Dec | 7:30 PM | Glam, sparkle & shine (Indo-western & party) | — |
  | Baarat Swaagat & Reception | Sat 12 Dec | 11:00 AM onwards | Royal Indian attire (timeless saris, elegant lehengas, classic sherwanis) | "Pastel & Pearl" |
  | Phere & Saptapati | Sat 12 Dec | 4:00 PM onwards | Indian traditional (lehenga, sharara, saree, anarkali, kurta) | — |
- Wardrobe note: "The wardrobe guide is only to inspire. Wear what you feel your best in and bring your energy to celebrate with us."
- About them: coffee lovers, goofy, love travelling; Mahima recently became a Messi / FC Barcelona fan (Ayush's favourite player and team).

## Goals
1. Wow on a phone first; also good on iPad and desktop (responsive, not a phone frame).
2. Tell the couple's story in the illustrated-comic scroll sequence from the inspiration image, using the real photos in `photos/`.
3. Interactive illustrated venue map with "Open Maps" and a tappable event schedule.
4. Wardrobe planner with per-event dress code and palette, from the PDF.
5. RSVP via Google Form (name, email, yes/no, number of people), with Google's own emailed receipt, and responses visible to the hosts in Google Sheets.
6. Free hosting on GitHub Pages at `salunkeayush.github.io/ayush-weds-mahima` (repo `ayush-weds-mahima`, account `salunkeayush`).

## Non-goals
- No backend/server, no accounts, no admin UI (Google Sheet is the admin view).
- No per-event RSVP, meal preferences, or guest messages.
- No CMS; content edits are code edits.

## Anti-goals (failure even if it "works")
- Janky or heavy scroll animation on a mid-range phone; slow load on mobile data.
- Heavy-handed, cheesy, or cluttered; must stay elegant and romantic with only light humour.
- RSVP that guests can't find or that fails silently.

## Decided
- **Stack (my call):** plain static site: HTML, CSS, vanilla JS, with a lightweight scroll-animation library (GSAP + ScrollTrigger from a pinned CDN version, or vendored). No build step required, so deploying to GitHub Pages is just pushing the files.
- **Scroll feel:** Apple-style: pinned scenes, parallax, fade/scale-in text, section transitions. Respect `prefers-reduced-motion`.
- **Opening:** wax-sealed envelope that opens on tap (like Reel 2), then page begins.
- **Look:** warm cream, blush, gold, deep maroon; elegant script headings (like the inspiration image); floral/arch motifs echoing the wardrobe PDF.
- **Sections, in order:**
  1. Envelope open.
  2. Love story scroll: "Our Love Story. Two hearts. One journey." → "We met as teenagers…" → "…grew together… dreamed together…" → "…even when life took us to different places," (plane, two windows) → "no distance could change what we felt…" → proposals → "…and now, we're ready to begin a new journey… together."
  3. "Little things about us": coffee, goofy, travel, Messi/Barça (the Argentina-jersey stadium photo, coffee-date photo). Light humour.
  4. Reveal: "Mahima & Ayush are getting married", 11th & 12th December 2026, countdown.
  5. Venue: tappable illustrated venue map of The Democracy (Nashik) + **Open Maps** button.
  6. Schedule: tappable illustrated map-style section for the five events; tapping an event shows date, time, and a link to its wardrobe card.
  7. Wardrobe planner: one card per event (dress code, palette swatches, illustration), closing note.
  8. RSVP.
  9. Closing: "We can't wait to celebrate with you!", Mahima & Ayush, #AyushMahnbhava.
- **Photos:** use the 11 supplied photos; small ones (≈480px) only as small accents.
- **RSVP:** Google Form with fields: Name, Email (required so Google sends the native response-copy receipt), Attending (yes/no), Number of people. The site shows an on-brand form that submits to the Google Form; responses land in a linked Google Sheet. If the on-site submit doesn't trigger the receipt email, fall back to embedding the Google Form. Hosts create the form; the builder supplies exact setup steps and the form IDs/entry names go in one config file.
- **Open Maps:** link to Google Maps search for the full address above (works on iOS/Android/desktop).

## Left to the builder
- Exact fonts, animation timing, component structure, file layout, image optimisation (resize/compress photos), accessibility details, favicon/OG share image, countdown target time.
- Illustration approach for scenes, venue map, schedule map, and wardrobe cards, within the constraints below.

## Calls made from the builder check (my calls, flag if wrong)
- RSVP: build the styled on-site form with a config flag `USE_EMBED` to switch to the plain embedded Google Form. Show a visible "thanks" state after submit (response is opaque, so it can't confirm). Before launch, hosts submit a test RSVP and confirm the receipt email arrives and the row lands in the Sheet; if no receipt, flip to embed.
- Until the hosts create the form, the site runs in a stub mode (config placeholders, no network submit) so it can be built and previewed.
- Countdown target: 11 Dec 2026 10:00 AM IST (UTC+5:30), computed with an explicit offset so guests abroad see the right time.
- Mobile weight budget: under ~3 MB for the first screen; lazy-load images below the fold, convert to WebP/AVIF.
- Wardrobe PDF art may be reused (the hosts' own material); text from the PDF is the source of truth for dress codes.
- Site lives under the `/ayush-weds-mahima/` subpath, so all asset paths are relative.

## Hosts' answers after the check
- **Deploy:** the builder handles GitHub too: verify `gh` access first, create repo `ayush-weds-mahima` under `salunkeayush`, push, enable Pages. Creating a public repo and publishing are outward-facing; deploy only after the hosts approve the finished site.
- **Venue map:** generic illustrated hotel map (no real floor plan). Event spots:
  - Mayra: Ganga Ghat Hall
  - Haldi: Poolside Lawn
  - Sangeet: Congruence Convention Hall
  - Baarat Swaagat & Reception: Congruence Convention Hall (hosts listed "Reception" there; Baarat Swaagat spot not given. My call: show the Baarat arriving at the hotel entrance/porch, then Reception at Congruence Convention Hall. Confirm.)
  - Phere & Saptapati: Ganga Ghat Amphitheater
- **Copy/photos:** builder writes the "little things" jokes and matches the 11 photos to story beats; hosts review before launch.

## Constraints and open points (builder's calls unless noted)
- Illustrations: no source illustration files exist except the single composite inspiration image (panels could be cropped from it). Builder may reuse cropped panels, draw SVG, or both. Wardrobe PDF pages can be reused as wardrobe card art (extract images with PyMuPDF).
- Reel 3 (Instagram link) could not be viewed (login wall).
- Source images/PDF are large (PDF 54 MB); the built site must stay light.

## Addendum 2026-10-19: scroll-scrubbed animated story (replaces section 2 "Love story scroll")
Hosts approved this in conversation. Inspiration: a different couple's video invite (layered cut-out pieces that move as you scroll). Must NOT copy it (no classroom/chalkboard).
- One pinned (sticky) portrait stage (viewBox 400x800, centered; max ~450px wide on desktop) scrubbed by scroll with GSAP. Pieces are SVG drawn by the builder in the cream/blush/gold/maroon paper-cut style. Captions write themselves (left-to-right wipe).
- Scenes: (1) title with petals; (2) evening walk home with backpacks, lamp posts light up; (3) bench at sunset, thought bubbles (his `{ }` code, her tooth), shared coffee; (4) different places: San Francisco (red bridge in fog, cable car, laptop; Ayush doing his Master's in Software Engineering) over Nashik (ghat temple, grape vines, tooth + dental mirror; Mahima a dentist); (5) 2023: plane arcs from India to the US over a globe, "2023" tag; (6) video-call glow between two phones, hearts travel the line; (7) proposal photos pinned like polaroids on a string ("He asked. She asked. We both said yes."); (8) hands meet, flower wreath blooms ("…and now, we're ready to begin a new journey… together."); (9) small New York skyline, "Next stop: New York" (they move to NYC after the wedding), then the reveal section.
- Reduced motion / GSAP unavailable: scenes render as a normal stacked list with captions visible.
- Everything from "Little things about us" downward is unchanged.
