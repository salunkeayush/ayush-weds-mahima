import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, buildBody, isConfigured, submit } from '../js/rsvp.js';

const ok = { name: ' Asha ', email: 'a@b.co', attending: 'yes', count: '4' };
const placeholder = { USE_EMBED: false, FORM_ACTION_URL: 'REPLACE_ME', FIELD_NAMES: { name: 'REPLACE_ME', email: 'REPLACE_ME', attending: 'REPLACE_ME', count: 'REPLACE_ME' }, EMBED_URL: 'REPLACE_ME' };
const real = { USE_EMBED: false, FORM_ACTION_URL: 'https://docs.google.com/forms/d/e/X/formResponse',
  FIELD_NAMES: { name: 'entry.1', email: 'entry.2', attending: 'entry.3', count: 'entry.4' }, EMBED_URL: 'x' };

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
test('buildBody maps entry keys and Yes/No', () => {
  const b = buildBody({ name: 'A', email: 'a@b.co', attending: 'yes', count: 2 }, real.FIELD_NAMES);
  assert.equal(b.get('entry.1'), 'A');
  assert.equal(b.get('entry.3'), 'Yes');
  assert.equal(b.get('entry.4'), '2');
});
test('buildBody asks Google to email the guest a copy', () => {
  const b = buildBody({ name: 'A', email: 'a@b.co', attending: 'no', count: 0 }, real.FIELD_NAMES);
  assert.equal(b.get('emailReceipt'), 'true');
});
test('isConfigured false for placeholders', async () => {
  assert.equal(isConfigured(placeholder), false);
  assert.equal(isConfigured(real), true);
});
test('submit stub makes no network call', async () => {
  let calls = 0;
  const r = await submit(validate(ok).clean, placeholder, async () => { calls++; });
  assert.deepEqual(r, { ok: true, stub: true });
  assert.equal(calls, 0);
});
test('submit real posts once with no-cors', async () => {
  const seen = [];
  const r = await submit(validate(ok).clean, real, async (u, o) => { seen.push([u, o]); return {}; });
  assert.equal(r.ok, true); assert.equal(r.stub, false);
  assert.equal(seen.length, 1);
  assert.equal(seen[0][1].method, 'POST'); assert.equal(seen[0][1].mode, 'no-cors');
});
test('shipped config is fully filled in (no placeholders left)', async () => {
  const { RSVP } = await import('../js/config.js');
  assert.equal(isConfigured(RSVP), true);
  assert.equal(RSVP.FIELD_NAMES.email, 'emailAddress');
  assert.match(RSVP.FORM_ACTION_URL, /\/formResponse$/);
});

test('RSVP uses Google\'s own embedded form (direct posts are refused with 401 by Google\'s reCAPTCHA)', async () => {
  const { RSVP } = await import('../js/config.js');
  assert.equal(RSVP.USE_EMBED, true);
  assert.match(RSVP.EMBED_URL, /^https:\/\/docs\.google\.com\/forms\/d\/e\/[\w-]+\/viewform\?embedded=true$/);
  const id = u => u.match(/\/e\/([\w-]+)\//)[1];
  assert.equal(id(RSVP.EMBED_URL), id(RSVP.FORM_ACTION_URL), 'embed and action point at the same form');
});
