import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { COUNTDOWN_TARGET, EVENTS, VARIANTS, eventsFor, countdownTargetFor } from '../js/config.js';
import { buildVariantHtml } from '../scripts/build-variants.mjs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const full = read('index.html');

test('every event has an absolute IST start time', () => {
  for (const e of EVENTS) assert.match(e.startISO, /^2026-12-1[12]T\d\d:\d\d:00\+05:30$/, e.id);
});
test('full link: all five events, countdown to the first one (Mayra 10:00 AM IST)', () => {
  assert.equal(eventsFor('full').length, 5);
  assert.equal(countdownTargetFor('full'), COUNTDOWN_TARGET);
  assert.equal(COUNTDOWN_TARGET, '2026-12-11T10:00:00+05:30');
});
test('second link (core): four events, countdown to Haldi 3:00 PM IST', () => {
  assert.deepEqual(eventsFor('core').map(e => e.id), ['haldi', 'sangeet', 'reception', 'phere']);
  assert.equal(countdownTargetFor('core'), '2026-12-11T15:00:00+05:30');
});
test('an unknown variant falls back to the full invite', () => {
  assert.equal(eventsFor('whatever').length, 5);
  assert.equal(countdownTargetFor(undefined), COUNTDOWN_TARGET);
});
test('VARIANTS lists the folder each link lives in', () => {
  assert.equal(VARIANTS.full.dir, '');
  assert.equal(VARIANTS['core'].dir, 'invite');
});

test('variant page: no trace of Mayra, everything else intact', () => {
  const html = buildVariantHtml(full, 'core');
  assert.equal(/mayra/i.test(html), false);
  for (const keep of ['Haldi', 'Sangeet', 'Baarat Swaagat', 'Phere', 'id="rsvp"', 'id="open-maps"', 'story-video']) assert.ok(html.includes(keep), keep);
  assert.match(html, /<html[^>]*data-variant="core"/);
});
test('variant page: asset links climb one level, in-page anchors stay put', () => {
  const html = buildVariantHtml(full, 'core');
  assert.ok(html.includes('href="../css/base.css'));
  assert.ok(html.includes('src="../js/main.js'));
  assert.ok(html.includes('src="../assets/video/story.mp4"'));
  assert.ok(html.includes('poster="../assets/video/poster.jpg"'));
  assert.equal(/(?:src|href|poster)="(?:css|js|assets)\//.test(html), false);
  assert.equal(html.includes('<base'), false, 'no <base>: it would break in-page #anchors');
  assert.match(html, /og:url" content="https:\/\/salunkeayush\.github\.io\/ayush-weds-mahima\/invite\/"/);
});
test('the full page is untouched by the variant markers', () => {
  assert.ok(/mayra/i.test(full));
  assert.equal(full.includes('data-variant'), false);
});
test('invite/index.html on disk is up to date (run `npm run build`)', () => {
  assert.ok(existsSync(new URL('../invite/index.html', import.meta.url)));
  assert.equal(read('invite/index.html'), buildVariantHtml(read('index.html'), 'core'));
});
test('every local asset the variant page links exists', () => {
  const html = read('invite/index.html');
  for (const m of html.matchAll(/(?:src|href|poster)="(\.\.\/(?:css|js|assets)\/[^"?]+)/g)) {
    assert.ok(existsSync(new URL('../invite/' + m[1], import.meta.url)), m[1]);
  }
});

test('the schedule tells guests they can tap an event icon for details (both links)', () => {
  for (const f of ['index.html', 'invite/index.html']) {
    const h = read(f);
    const sched = h.match(/<section id="schedule"[\s\S]*?<\/section>/)[0];
    assert.match(sched, /<p class="sched-hint">Tap an event icon to explore more details about it\.<\/p>/, f);
    assert.ok(sched.indexOf('sched-hint') < sched.indexOf('class="days"'), 'hint sits above the events');
  }
});
