import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { eventsFor } from '../js/config.js';

const code = readFileSync(new URL('../apps-script/Code.gs', import.meta.url), 'utf8');
const box = { module: { exports: {} } };
vm.runInNewContext(code, box);
const { validateRsvp, buildEmail, EVENTS: SCRIPT_EVENTS, eventsForVariant } = box.module.exports;

const good = { name: 'Asha Rao', email: 'asha@example.com', attending: 'Yes', count: 3, variant: 'full', website: '' };

test('server validation accepts a good RSVP and normalises it', () => {
  const v = validateRsvp({ ...good, name: '  Asha Rao  ', email: ' ASHA@Example.com ' });
  assert.equal(v.ok, true);
  assert.deepEqual(JSON.parse(JSON.stringify(v.data)), { name: 'Asha Rao', email: 'asha@example.com', attending: 'Yes', count: 3, variant: 'full' });
});
test('server validation refuses bad names, emails, answers and counts', () => {
  for (const bad of [{ name: '' }, { name: 'x'.repeat(81) }, { email: 'nope' }, { email: 'a@b' }, { attending: 'Maybe' }, { attending: 'Yes', count: 0 }, { attending: 'Yes', count: 21 }, { attending: 'Yes', count: 2.5 }, { count: '3; DROP' }]) {
    assert.equal(validateRsvp({ ...good, ...bad }).ok, false, JSON.stringify(bad));
  }
});
test('a decline is stored with 0 people whatever was sent', () => {
  assert.equal(validateRsvp({ ...good, attending: 'No', count: 5 }).data.count, 0);
});
test('unknown link variants fall back to full; a filled honeypot is flagged', () => {
  assert.equal(validateRsvp({ ...good, variant: 'hacked' }).data.variant, 'full');
  assert.equal(validateRsvp({ ...good, website: 'http://spam' }).honeypot, true);
});
test('confirmation email: personal, escapes HTML, lists the right events', () => {
  const full = buildEmail(validateRsvp(good).data);
  assert.match(full.subject, /Mahima & Ayush/);
  assert.match(full.text, /Asha Rao/); assert.match(full.text, /3/);
  assert.match(full.text, /Mayra/); assert.match(full.html, /Congruence Convention Hall/);
  assert.match(full.html, /google\.com\/maps\/search/);
  const core = buildEmail(validateRsvp({ ...good, variant: 'core' }).data);
  assert.match(core.subject, /Ayush & Mahima/);
  assert.equal(/mayra/i.test(core.text + core.html), false);
  const xss = buildEmail(validateRsvp({ ...good, name: '<script>alert(1)</script>' }).data);
  assert.equal(xss.html.includes('<script>'), false);
  const no = buildEmail(validateRsvp({ ...good, attending: 'No' }).data);
  assert.match(no.text, /miss/i);
  assert.equal(/Mayra|Haldi/.test(no.text), false, 'a decline does not get the event list');
});
test('the script\'s event list is the same as the website\'s (names, spots, times)', () => {
  for (const variant of ['full', 'core']) {
    const site = eventsFor(variant).map(e => [e.name, e.spot, e.date.split(', ')[0].slice(0, 3) + ' ' + e.time]);
    const script = JSON.parse(JSON.stringify(eventsForVariant(variant))).map(e => [e.name, e.where, e.when.split(',')[0].slice(0, 3) + ' ' + e.when.split(', ')[1]]);
    assert.deepEqual(script, site, variant);
  }
});

// --- confirmation email outcome is reported, not swallowed ---
function runWith(globals) {
  const sandbox = { module: { exports: {} }, console: { error() {} }, ...globals };
  vm.runInNewContext(code, sandbox);
  return sandbox.module.exports;
}
const d = { name: 'Asha', email: 'asha@example.com', attending: 'Yes', count: 2, variant: 'full' };
const mkCache = (hit) => ({ getScriptCache: () => ({ get: () => (hit ? '1' : null), put() {} }) });

test('sendConfirmation_: sends and reports sent', () => {
  const sent = [];
  const x = runWith({ MailApp: { getRemainingDailyQuota: () => 50, sendEmail: m => sent.push(m) }, CacheService: mkCache(false) });
  assert.deepEqual(JSON.parse(JSON.stringify(x.sendConfirmation_(d))), { sent: true, why: 'sent' });
  assert.equal(sent.length, 1); assert.equal(sent[0].to, 'asha@example.com');
});
test('sendConfirmation_: says why nothing was sent (quota, recent duplicate, error)', () => {
  const q = runWith({ MailApp: { getRemainingDailyQuota: () => 0, sendEmail() { throw new Error('no'); } }, CacheService: mkCache(false) });
  assert.equal(q.sendConfirmation_(d).why, 'quota');
  const r = runWith({ MailApp: { getRemainingDailyQuota: () => 5, sendEmail() { throw new Error('no'); } }, CacheService: mkCache(true) });
  assert.equal(r.sendConfirmation_(d).why, 'recent');
  const e = runWith({ MailApp: { getRemainingDailyQuota: () => 5, sendEmail() { throw new Error('Authorization is required'); } }, CacheService: mkCache(false) });
  assert.deepEqual(JSON.parse(JSON.stringify(e.sendConfirmation_(d))), { sent: false, why: 'error' });
});
