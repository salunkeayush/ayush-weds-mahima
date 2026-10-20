import { RSVP } from './config.js';
import { validate, submit, isConfigured } from './rsvp.js';

export function initRsvp() {
  const form = document.getElementById('rsvp-form');
  if (RSVP.USE_EMBED && RSVP.EMBED_URL !== 'REPLACE_ME') {
    const box = document.getElementById('rsvp-embed');
    const f = document.createElement('iframe'); f.src = RSVP.EMBED_URL; f.title = 'RSVP form'; f.loading = 'lazy';
    box.append(f); box.hidden = false; form.hidden = true; return;
  }
  if (!isConfigured(RSVP)) document.getElementById('rsvp-stub').hidden = false;
  const count = document.getElementById('rsvp-count');
  const wrap = document.getElementById('count-wrap');
  const send = document.getElementById('rsvp-send');
  const thanks = document.getElementById('rsvp-thanks');
  const setCount = n => { count.value = String(Math.min(20, Math.max(1, n))); };
  document.getElementById('inc').addEventListener('click', () => setCount((parseInt(count.value, 10) || 0) + 1));
  document.getElementById('dec').addEventListener('click', () => setCount((parseInt(count.value, 10) || 2) - 1));
  form.addEventListener('change', () => { wrap.hidden = form.attending.value === 'no'; });
  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (busy) return;
    const r = validate({ name: form.name.value, email: form.email.value, attending: form.attending.value, count: count.value });
    form.querySelectorAll('.err').forEach(el => { el.textContent = r.errors[el.dataset.for] || ''; });
    if (!r.ok) { form.querySelector('.err:not(:empty)')?.closest('.fld, .pills')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    busy = true; send.disabled = true; send.textContent = 'Sending…';
    try {
      await submit(r.clean);
      thanks.textContent = r.clean.attending === 'yes'
        ? `Thank you, ${r.clean.name}! We can't wait to celebrate with you. A confirmation is on its way to ${r.clean.email}.`
        : `Thank you for letting us know, ${r.clean.name}. You will be missed.`;
      thanks.classList.remove('thanks--error'); thanks.hidden = false; send.hidden = true;
      form.querySelectorAll('input,button').forEach(el => { el.disabled = true; });
    } catch {
      busy = false; send.disabled = false; send.textContent = 'Send RSVP';
      thanks.textContent = 'Something went wrong. Please check your connection and try again.'; thanks.classList.add('thanks--error'); thanks.hidden = false;
    }
  });
}
