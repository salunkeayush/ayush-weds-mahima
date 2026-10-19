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
