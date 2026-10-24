import { RSVP } from './config.js';
import { validate, buildPayload, rsvpMode, submitToScript } from './rsvp.js';

export function initRsvp() {
  const form = document.getElementById('rsvp-form');
  if (rsvpMode(RSVP) === 'embed') {
    // No backend configured yet: show Google's own form (it records replies and emails guests itself).
    const box = document.getElementById('rsvp-embed');
    const f = document.createElement('iframe'); f.src = RSVP.EMBED_URL; f.title = 'RSVP form'; f.loading = 'lazy';
    box.append(f); box.hidden = false; form.hidden = true; return;
  }
  const count = document.getElementById('rsvp-count');
  const wrap = document.getElementById('count-wrap');
  const send = document.getElementById('rsvp-send');
  const thanks = document.getElementById('rsvp-thanks');
  const variant = document.documentElement.dataset.variant;
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
    busy = true; send.disabled = true; send.textContent = 'Sending…'; thanks.hidden = true;
    const out = await submitToScript({ ...buildPayload(r.clean, variant), website: form.website.value }, RSVP);
    if (out.ok) {
      const { name, email, attending } = r.clean;
      thanks.textContent = attending === 'yes'
        ? `Thank you, ${name}! We can't wait to celebrate with you.${out.emailed ? ` A confirmation is on its way to ${email}.` : ' Your RSVP is saved.'}`
        : `Thank you for letting us know, ${name}. You will be missed.`;
      thanks.classList.remove('thanks--error'); thanks.hidden = false; send.hidden = true;
      form.querySelectorAll('input,button').forEach(el => { el.disabled = true; });
    } else {
      busy = false; send.disabled = false; send.textContent = 'Send RSVP';
      thanks.textContent = "We couldn't save your RSVP. Please check your connection and try again, or use the Google Form link below.";
      thanks.classList.add('thanks--error'); thanks.hidden = false;
    }
  });
}
