import { EVENTS } from './config.js';

export function initWardrobe() {
  document.querySelectorAll('[data-pal]').forEach(el => {
    const ev = EVENTS.find(e => e.id === el.dataset.pal);
    for (const c of ev.palette) { const i = document.createElement('i'); i.style.background = c; el.append(i); }
  });
  const highlight = () => {
    const card = document.getElementById(location.hash.slice(1));
    if (!card || !card.classList.contains('wcard')) return;
    document.querySelectorAll('.wcard.hl').forEach(c => c.classList.remove('hl'));
    card.classList.add('hl');
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setTimeout(() => card.classList.remove('hl'), 3000);
  };
  addEventListener('hashchange', highlight);
  highlight();
}
