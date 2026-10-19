import test from 'node:test';
import assert from 'node:assert/strict';
import { timeLeft } from '../js/countdown.js';
import { COUNTDOWN_TARGET } from '../js/config.js';

const target = new Date('2026-12-11T10:00:00+05:30');

test('splits remaining time into d/h/m/s', () => {
  const now = new Date(target.getTime() - ((26 * 60 + 3) * 60 + 4) * 1000);
  assert.deepEqual(timeLeft(now, target), { done: false, days: 1, hours: 2, minutes: 3, seconds: 4 });
});
test('at target is done with zeros', () => {
  assert.deepEqual(timeLeft(target, target), { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
});
test('after target is done, never negative', () => {
  const r = timeLeft(new Date(target.getTime() + 99999), target);
  assert.deepEqual(r, { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 });
});
test('COUNTDOWN_TARGET is 10:00 IST = 04:30Z', () => {
  assert.equal(new Date(COUNTDOWN_TARGET).toISOString(), '2026-12-11T04:30:00.000Z');
});
