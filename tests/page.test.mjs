import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { EVENTS, VENUE } from '../js/config.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const IDS = ['envelope', 'story', 'about', 'reveal', 'venue', 'schedule', 'wardrobe', 'rsvp', 'closing'];
const cssFile = (f) => readFileSync(new URL(`../css/${f}`, import.meta.url), 'utf8');

test('has all section ids', () => { for (const id of IDS) assert.ok(html.includes(`id="${id}"`), id); });
test('schedule buttons match config events (name, time)', () => {
  for (const e of EVENTS) {
    const re = new RegExp(`data-event="${e.id}"[\\s\\S]*?ev__n">${e.name.replace('&', '&amp;')}<[\\s\\S]*?ev__t">${e.time}<`);
    assert.match(html, re, e.id);
  }
});
test('wardrobe cards exist for each event', () => { for (const e of EVENTS) assert.ok(html.includes(`id="wardrobe-${e.id}"`), e.id); });
test('Open Maps link points to google maps with the venue', () => {
  assert.match(html, />Open Maps</);
  assert.ok(html.includes('google.com/maps/search/?api=1&amp;query=The%20Democracy%20Hotel'));
  assert.ok(html.includes('422007'));
});
test('every img has non-empty alt', () => {
  for (const m of html.matchAll(/<img\b[^>]*>/g)) assert.match(m[0], /alt="[^"]+"/, m[0]);
});
test('no root-absolute asset paths (site lives under a subpath)', () => {
  assert.equal(/(src|href)="\/(?!\/)/.test(html), false);
});
test('every referenced local asset exists', () => {
  for (const m of html.matchAll(/(?:src|href)="((?:assets|css|js)\/[^"]+)"/g)) assert.ok(existsSync(new URL('../' + m[1], import.meta.url)), m[1]);
});
test('venue name present', () => assert.ok(html.includes('The Democracy Hotel') && VENUE.address.includes('Nashik')));

// --- final-review regressions ---
const css = readFileSync(new URL('../css/base.css', import.meta.url), 'utf8');
test('no duplicate element ids', () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual(dupes, []);
});
test('rsvp-ui reads the guest-count input by its own unique id', () => {
  const ui = readFileSync(new URL('../js/rsvp-ui.js', import.meta.url), 'utf8');
  assert.ok(html.includes('id="rsvp-count"'));
  assert.ok(ui.includes("getElementById('rsvp-count')"));
});
test('JS-off guests are not trapped behind the envelope', () => {
  assert.match(html, /<noscript>\s*<style>[^<]*#envelope\s*\{[^}]*display:\s*none/);
  assert.equal(html.includes('<body class="is-locked">'), false); // lock is applied by JS
});
test('[hidden] always wins over component display rules', () => {
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});
test('og:image is absolute and og:url is set', () => {
  assert.match(html, /og:image" content="https:\/\/salunkeayush\.github\.io\/ayush-weds-mahima\/[^"]+\.jpg"/);
  assert.match(html, /og:url" content="https:\/\/salunkeayush\.github\.io\/ayush-weds-mahima\/"/);
});
test('error message has its own non-success style and alert role', () => {
  const ui = readFileSync(new URL('../js/rsvp-ui.js', import.meta.url), 'utf8');
  assert.ok(ui.includes("classList.toggle('thanks--error'") || ui.includes("thanks--error"));
  assert.match(html, /id="rsvp-thanks"[^>]*role="status"/);
});


// --- v2: film replaces the animated story; names; fonts; venue map removed ---
import { statSync } from 'node:fs';
test('story is the film: autoplay-capable <video> with a poster and a compressed file', () => {
  assert.match(html, /<video id="story-video"[^>]*poster="assets\/video\/poster\.jpg"/);
  assert.match(html, /<source src="assets\/video\/story\.mp4" type="video\/mp4">/);
  assert.ok(existsSync(new URL('../assets/video/story.mp4', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/video/poster.jpg', import.meta.url)));
  assert.ok(statSync(new URL('../assets/video/story.mp4', import.meta.url)).size < 8 * 1024 * 1024, 'film must stay under 8 MB for mobile');
  assert.ok(html.includes('id="story-skip"') && html.includes('id="story-sound"') && html.includes('id="story-fs"'));
});
test('names read "Ayush & Mahima" everywhere, never the old order', () => {
  assert.equal(/Mahima\s*(?:<i>)?&amp;(?:<\/i>)?\s*Ayush/.test(html), false);
  assert.ok(html.includes('Ayush &amp; Mahima'));
  assert.match(html, /Ayush <i>&amp;<\/i> Mahima/);
});
test('seal monogram reads A & M in a readable serif, not the old script M&A', () => {
  const seal = html.match(/<button class="env__seal"[\s\S]*?<\/button>/)[0];
  assert.match(seal, />A<[\s\S]*>&amp;<[\s\S]*>M</);
  assert.equal(seal.includes('Great Vibes'), false);
  assert.equal(seal.includes('M&amp;A'), false);
});
test('script font has a clear capital A (Parisienne) and Great Vibes is gone', () => {
  assert.match(cssFile('base.css'), /--font-script:\s*'Parisienne'/);
  assert.ok(html.includes('family=Parisienne'));
  assert.equal(html.includes('Great+Vibes'), false);
});
test('venue: map and tap-a-spot explorer are gone, address and Open Maps stay', () => {
  for (const gone of ['id="hotel-map"', 'venue-sheet', 'Tap a spot', 'Tap a place', 'spotchip', 'class="spot"']) assert.equal(html.includes(gone), false, gone);
  assert.ok(html.includes('id="open-maps"') && html.includes('422007'));
});
test('no third-party scripts are needed any more (animation library removed)', () => {
  assert.equal(/<script[^>]+src="https?:/.test(html), false);
});
test('old story machinery is deleted', () => {
  for (const f of ['js/live.js', 'js/venue-map.js', 'js/scenes/index.js', 'assets/img/panel-met.webp']) assert.equal(existsSync(new URL('../' + f, import.meta.url)), false, f);
});

test('the "Malani Family Welcomes You" line is not on the page', () => {
  assert.equal(/malani family/i.test(html), false);
});

test('the film is trimmed to 32 seconds', () => {
  const buf = readFileSync(new URL('../assets/video/story.mp4', import.meta.url));
  const i = buf.indexOf('mvhd');
  assert.ok(i > 0, 'mvhd box found');
  const version = buf[i + 4];
  const off = i + 4 + 4 + (version === 1 ? 16 : 8);
  const timescale = buf.readUInt32BE(off);
  const duration = version === 1 ? Number(buf.readBigUInt64BE(off + 4)) : buf.readUInt32BE(off + 4);
  const seconds = duration / timescale;
  assert.ok(seconds >= 31.5 && seconds <= 32.5, `duration ${seconds}s`);
});

test('the hashtag appears in the countdown (reveal) section too', () => {
  const reveal = html.match(/<section id="reveal"[\s\S]*?<\/section>/)[0];
  assert.ok(reveal.includes('#AyushMahnbhava'));
});

test('countdown section text uses the maroon of the neighbouring text (date and hashtag, no near-black ink)', () => {
  const sec = cssFile('sections.css');
  const rule = (sel) => sec.match(new RegExp(`\\${sel}\\{[^}]*\\}`))[0];
  assert.match(rule('.date'), /color:var\(--maroon\)/);
  assert.match(rule('.hashtag'), /color:var\(--maroon\)/);
});

import { assetVersion } from '../scripts/stamp.mjs';
test('css and main.js links carry the current content hash so browsers never serve stale styles (run `npm run stamp`)', () => {
  const v = assetVersion();
  for (const f of ['css/base.css', 'css/envelope.css', 'css/story.css', 'css/sections.css', 'js/main.js']) {
    assert.ok(html.includes(`${f}?v=${v}`), `${f} should be linked as ${f}?v=${v}`);
  }
});

import { sheetInsertIndex } from '../js/schedule.js';
test('sheetInsertIndex puts the details right under the tapped event\'s row', () => {
  assert.equal(sheetInsertIndex(0, 2, 3), 1);
  assert.equal(sheetInsertIndex(1, 2, 3), 1);
  assert.equal(sheetInsertIndex(2, 2, 3), 2);
  assert.equal(sheetInsertIndex(0, 1, 3), 0);
  assert.equal(sheetInsertIndex(4, 3, 5), 4);
  assert.equal(sheetInsertIndex(0, 3, 2), 1);
  assert.equal(sheetInsertIndex(0, 0, 2), 0); // unknown column count behaves like one column
});
test('event details live inside the event list (not as a block at the bottom of the section)', () => {
  assert.match(html, /<li class="sheet evsheet" id="event-sheet"[^>]*hidden/);
  assert.equal(html.includes('Tap an event for details'), false);
  assert.ok(html.includes('aria-controls="event-sheet"'));
});
