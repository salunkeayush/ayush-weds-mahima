import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { EVENTS, VENUE } from '../js/config.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const IDS = ['envelope', 'story', 'about', 'reveal', 'venue', 'schedule', 'wardrobe', 'rsvp', 'closing'];

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
test('GSAP scripts are deferred so a slow CDN cannot block the envelope', () => {
  for (const m of html.matchAll(/<script src="https:\/\/cdnjs[^>]*>/g)) assert.match(m[0], /\bdefer\b/);
});
test('[hidden] always wins over component display rules', () => {
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});
test('og:image is absolute and og:url is set', () => {
  assert.match(html, /og:image" content="https:\/\/salunkeayush\.github\.io\/ayush-weds-mahima\/[^"]+\.jpg"/);
  assert.match(html, /og:url" content="https:\/\/salunkeayush\.github\.io\/ayush-weds-mahima\/"/);
});
test('landscape-phone rule caps story frame height', () => {
  const st = readFileSync(new URL('../css/story.css', import.meta.url), 'utf8');
  assert.match(st, /orientation:\s*landscape\)\s*and\s*\(max-height:\s*500px/);
});
test('error message has its own non-success style and alert role', () => {
  const ui = readFileSync(new URL('../js/rsvp-ui.js', import.meta.url), 'utf8');
  assert.ok(ui.includes("classList.toggle('thanks--error'") || ui.includes("thanks--error"));
  assert.match(html, /id="rsvp-thanks"[^>]*role="status"/);
});
