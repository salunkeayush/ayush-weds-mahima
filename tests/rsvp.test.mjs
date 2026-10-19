import test from 'node:test';
import assert from 'node:assert/strict';
import { validate, buildBody, isConfigured, submit } from '../js/rsvp.js';

const ok = { name: ' Asha ', email: 'a@b.co', attending: 'yes', count: '4' };
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
test('isConfigured false for placeholders', async () => {
  const { RSVP } = await import('../js/config.js');
  assert.equal(isConfigured(RSVP), false);
  assert.equal(isConfigured(real), true);
});
test('submit stub makes no network call', async () => {
  const { RSVP } = await import('../js/config.js');
  let calls = 0;
  const r = await submit(validate(ok).clean, RSVP, async () => { calls++; });
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
