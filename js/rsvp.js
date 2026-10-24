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

// Themed form -> the host's Apps Script web app (writes a row to the Google Sheet and emails the guest).
const SCRIPT_URL_OK = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;

export function rsvpMode(rsvp = RSVP) {
  return SCRIPT_URL_OK.test(rsvp.SCRIPT_URL || '') ? 'script' : 'embed';
}

export function buildPayload(clean, variant) {
  return {
    name: clean.name, email: clean.email,
    attending: clean.attending === 'yes' ? 'Yes' : 'No',
    count: clean.count, variant: variant === 'core' ? 'core' : 'full', website: '',
  };
}

export async function submitToScript(payload, rsvp = RSVP, fetchImpl = (...a) => fetch(...a)) {
  if (payload.website) return { ok: true, emailed: false }; // honeypot: bots get a fake success, nothing is sent
  try {
    const res = await fetchImpl(rsvp.SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // a "simple" request: no CORS preflight
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `http ${res.status}` };
    const out = await res.json();
    return out.ok ? { ok: true, emailed: !!out.emailed } : { ok: false, error: out.error || 'server' };
  } catch {
    return { ok: false, error: 'network' };
  }
}
