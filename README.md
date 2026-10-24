# Wedding Invite

Static site. Serve: `python3 -m http.server`. Tests: `npm test`. RSVP setup: docs/RSVP-SETUP.md.
Assets: `python scripts/prepare_assets.py` (needs pillow+pymupdf and original photos/PDF, which are not in the repo).

## Two links
- Full invite: `/` (all five events).
- Without Mayra: `/invite/` (built from `index.html`; Mayra's schedule, wardrobe card and the countdown to Mayra are left out, the countdown aims at Haldi).
After editing `index.html`, `css/` or `js/`, run `npm run build` (updates the cache-busting hash and regenerates `invite/index.html`), then `npm test`.
Anything only for the full invite goes between `<!--only:full-->` and `<!--/only:full-->`.
