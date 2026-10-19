import { EVENTS } from './config.js';

export function initSchedule() {
  const sheet = document.getElementById('event-sheet');
  const btns = document.querySelectorAll('.ev');
  btns.forEach(b => b.addEventListener('click', () => {
    const ev = EVENTS.find(e => e.id === b.dataset.event);
    btns.forEach(x => x.setAttribute('aria-expanded', String(x === b)));
    sheet.replaceChildren();
    const h = document.createElement('h4'); h.textContent = ev.name;
    const p1 = document.createElement('p'); p1.textContent = `${ev.date} · ${ev.time}`;
    const p2 = document.createElement('p'); p2.textContent = `📍 ${ev.spot}`;
    const p3 = document.createElement('p'); p3.textContent = ev.blurb;
    const a = document.createElement('a'); a.href = `#wardrobe-${ev.id}`; a.textContent = 'See dress code →';
    sheet.append(h, p1, p2, p3, a);
  }));
}
