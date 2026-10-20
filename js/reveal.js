import { timeLeft } from './countdown.js';
import { COUNTDOWN_TARGET } from './config.js';

export function initReveal() {
  const target = new Date(COUNTDOWN_TARGET);
  const ids = { days: 'cd-d', hours: 'cd-h', minutes: 'cd-m', seconds: 'cd-s' };
  const done = document.getElementById('cd-done');
  const count = document.getElementById('count');
  let timer;
  const tick = () => {
    const t = timeLeft(new Date(), target);
    for (const k in ids) document.getElementById(ids[k]).textContent = String(t[k]).padStart(2, '0');
    if (t.done) { count.hidden = true; done.hidden = false; clearInterval(timer); }
  };
  const start = () => { clearInterval(timer); tick(); timer = setInterval(tick, 1000); };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer); else if (done.hidden) start();
  });
  start();
}
