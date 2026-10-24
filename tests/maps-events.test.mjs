import test from 'node:test';
import assert from 'node:assert/strict';
import { mapsSearchUrl } from '../js/maps.js';
import { VENUE, EVENTS } from '../js/config.js';

test('maps url contains address parts', () => {
  const u = mapsSearchUrl(VENUE.address);
  assert.ok(u.startsWith('https://www.google.com/maps/search/?api=1&query='));
  assert.ok(/Satpur(%20|\+)Colony/.test(u)); assert.ok(u.includes('422007'));
});
test('VENUE.mapsUrl derived from address', () => assert.equal(VENUE.mapsUrl, mapsSearchUrl(VENUE.address)));
test('five events in spec order with exact times and spots', () => {
  assert.deepEqual(EVENTS.map(e => [e.id, e.time, e.spot, e.dateISO]), [
    ['mayra', '10:00 AM', 'Ganga Ghat Hall', '2026-12-11'],
    ['haldi', '3:00 PM', 'Poolside Lawn', '2026-12-11'],
    ['sangeet', '7:30 PM', 'Congruence Convention Hall', '2026-12-11'],
    ['reception', '11:00 AM', 'Congruence Convention Hall', '2026-12-12'],
    ['phere', '4:00 PM', 'Ganga Ghat Amphitheater', '2026-12-12'],
  ]);
});
test('palettes only for haldi and reception', () =>
  assert.deepEqual(EVENTS.filter(e => e.palette.length).map(e => e.id), ['haldi', 'reception']));
