import { EVENTS } from './config.js';

// Index (in the list, which has `cols` grid columns) of the last item in the row holding `idx`;
// the details panel goes right after it, i.e. directly under the tapped event.
export function sheetInsertIndex(idx, cols, total) {
  const c = Math.max(1, cols || 1);
  return Math.min(total - 1, (Math.floor(idx / c) + 1) * c - 1);
}

export function initSchedule() {
  const sheet = document.getElementById('event-sheet');
  const btns = [...document.querySelectorAll('.ev')];
  let open = null;

  const fill = ev => {
    sheet.replaceChildren();
    const h = document.createElement('h4'); h.textContent = ev.name;
    const p1 = document.createElement('p'); p1.textContent = `${ev.date} · ${ev.time}`;
    const p2 = document.createElement('p'); p2.textContent = `📍 ${ev.spot}`;
    const p3 = document.createElement('p'); p3.textContent = ev.blurb;
    const a = document.createElement('a'); a.href = `#wardrobe-${ev.id}`; a.textContent = 'See dress code →';
    sheet.append(h, p1, p2, p3, a);
  };

  const close = () => {
    open = null; sheet.hidden = true;
    btns.forEach(x => x.setAttribute('aria-expanded', 'false'));
  };

  btns.forEach(b => b.addEventListener('click', () => {
    if (open === b) { close(); return; }
    open = b;
    btns.forEach(x => x.setAttribute('aria-expanded', String(x === b)));
    const li = b.closest('li'), list = li.parentElement;
    const items = [...list.children].filter(el => el !== sheet);
    const cols = getComputedStyle(list).gridTemplateColumns.split(' ').filter(Boolean).length;
    const at = items[sheetInsertIndex(items.indexOf(li), cols, items.length)];
    fill(EVENTS.find(e => e.id === b.dataset.event));
    at.after(sheet);
    sheet.hidden = false;
    sheet.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }));
}
