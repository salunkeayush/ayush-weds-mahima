import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, buildPayload, rsvpMode, submitToScript } from '../js/rsvp.js';

const ok = { name: ' Asha ', email: 'a@b.co', attending: 'yes', count: '4' };
const SCRIPT = 'https://script.google.com/macros/s/AKfycbxExample123/exec';
const cfg = (over = {}) => ({ SCRIPT_URL: SCRIPT, EMBED_URL: 'https://docs.google.com/forms/d/e/X/viewform?embedded=true', FORM_URL: 'https://docs.google.com/forms/d/e/X/viewform', ...over });

test('blank name rejected', () => assert.ok(validate({ ...ok, name: '   ' }).errors.name));
test('bad emails rejected, good accepted', () => {
  assert.ok(validate({ ...ok, email: 'foo' }).errors.email);
  assert.ok(validate({ ...ok, email: 'a@b' }).errors.email);
  assert.equal(validate(ok).errors.email, undefined);
});
test('attending required', () => assert.ok(validate({ ...ok, attending: '' }).errors.attending));
test('yes with bad count rejected', () => {
  for (const c of ['0', '-1', '2.5', '', '21']) assert.ok(validate({ ...ok, count: c }).errors.count, c);
});
test('yes with 4 -> clean, name trimmed', () => {
  const r = validate(ok);
  assert.equal(r.ok, true);
  assert.deepEqual(r.clean, { name: 'Asha', email: 'a@b.co', attending: 'yes', count: 4 });
});
test('no with blank count ok, count 0', () => {
  const r = validate({ ...ok, attending: 'no', count: '' });
  assert.equal(r.ok, true);
  assert.equal(r.clean.count, 0);
});

test('rsvpMode: a real Apps Script URL means the themed form; anything else falls back to the Google Form embed', () => {
  assert.equal(rsvpMode(cfg()), 'script');
  assert.equal(rsvpMode(cfg({ SCRIPT_URL: 'REPLACE_ME' })), 'embed');
  assert.equal(rsvpMode(cfg({ SCRIPT_URL: '' })), 'embed');
  assert.equal(rsvpMode(cfg({ SCRIPT_URL: 'https://evil.example/exec' })), 'embed');
});

test('buildPayload: Yes/No wording, numeric count, which link the guest used, empty honeypot', () => {
  const yes = buildPayload(validate(ok).clean, 'core');
  assert.deepEqual(yes, { name: 'Asha', email: 'a@b.co', attending: 'Yes', count: 4, variant: 'core', website: '' });
  const no = buildPayload(validate({ ...ok, attending: 'no', count: '' }).clean, undefined);
  assert.equal(no.attending, 'No'); assert.equal(no.count, 0); assert.equal(no.variant, 'full');
});

test('submitToScript posts one text/plain JSON request (no CORS preflight) and reads the verdict', async () => {
  const seen = [];
  const fake = async (url, opts) => { seen.push([url, opts]); return { ok: true, json: async () => ({ ok: true, emailed: true }) }; };
  const r = await submitToScript(buildPayload(validate(ok).clean, 'full'), cfg(), fake);
  assert.deepEqual(r, { ok: true, emailed: true });
  assert.equal(seen.length, 1);
  assert.equal(seen[0][0], SCRIPT);
  assert.equal(seen[0][1].method, 'POST');
  assert.match(seen[0][1].headers['Content-Type'], /^text\/plain/);
  assert.equal(JSON.parse(seen[0][1].body).attending, 'Yes');
});
test('submitToScript: the server refusing the RSVP is a failure, never a thank-you', async () => {
  const fake = async () => ({ ok: true, json: async () => ({ ok: false, error: 'email' }) });
  assert.deepEqual(await submitToScript(buildPayload(validate(ok).clean), cfg(), fake), { ok: false, error: 'email' });
});
test('submitToScript: network error or non-JSON reply is a failure', async () => {
  const boom = async () => { throw new Error('offline'); };
  assert.equal((await submitToScript(buildPayload(validate(ok).clean), cfg(), boom)).ok, false);
  const html = async () => ({ ok: true, json: async () => { throw new Error('not json'); } });
  assert.equal((await submitToScript(buildPayload(validate(ok).clean), cfg(), html)).ok, false);
  const http = async () => ({ ok: false, status: 500, json: async () => ({}) });
  assert.equal((await submitToScript(buildPayload(validate(ok).clean), cfg(), http)).ok, false);
});
test('submitToScript: a filled honeypot (bot) is dropped without any network call', async () => {
  let calls = 0;
  const r = await submitToScript({ ...buildPayload(validate(ok).clean), website: 'http://spam' }, cfg(), async () => { calls++; });
  assert.equal(calls, 0);
  assert.equal(r.ok, true);
});

test('shipped config keeps the Google Form as the fallback', async () => {
  const { RSVP } = await import('../js/config.js');
  assert.match(RSVP.EMBED_URL, /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform\?embedded=true$/);
  assert.match(RSVP.FORM_URL, /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform$/);
});

test('the shipped site uses the themed form (Apps Script URL is set)', async () => {
  const { RSVP } = await import('../js/config.js');
  assert.equal(rsvpMode(RSVP), 'script');
});
