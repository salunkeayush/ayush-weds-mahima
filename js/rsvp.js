import { RSVP } from './config.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_GUESTS = 20;

export function validate(input) {
  const errors = {};
  const name = String(input.name ?? '').trim();
  const email = String(input.email ?? '').trim();
  const attending = input.attending;
  if (!name) errors.name = 'Please tell us your name.';
  if (!EMAIL.test(email)) errors.email = 'Please enter a valid email so we can send your confirmation.';
  if (attending !== 'yes' && attending !== 'no') errors.attending = 'Please let us know if you can make it.';
  let count = 0;
  if (attending === 'yes') {
    const raw = String(input.count ?? '').trim();
    count = Number(raw);
    if (raw === '' || !Number.isInteger(count) || count < 1 || count > MAX_GUESTS) {
      errors.count = `Please enter a whole number from 1 to ${MAX_GUESTS}.`;
    }
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, errors, clean: { name, email, attending, count } };
}

export function buildBody(clean, fieldNames) {
  const b = new URLSearchParams();
  b.set(fieldNames.name, clean.name);
  b.set(fieldNames.email, clean.email);
  b.set(fieldNames.attending, clean.attending === 'yes' ? 'Yes' : 'No');
  b.set(fieldNames.count, String(clean.count));
  b.set('emailReceipt', 'true'); // Google's "send me a copy of my responses" checkbox
  return b;
}

export function isConfigured(rsvp) {
  const vals = [rsvp.FORM_ACTION_URL, ...Object.values(rsvp.FIELD_NAMES)];
  return vals.every(v => v && v !== 'REPLACE_ME');
}

export async function submit(clean, rsvp = RSVP, fetchImpl = (...a) => fetch(...a)) {
  if (!isConfigured(rsvp)) return { ok: true, stub: true };
  await fetchImpl(rsvp.FORM_ACTION_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: buildBody(clean, rsvp.FIELD_NAMES),
  });
  return { ok: true, stub: false };
}
