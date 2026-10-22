import { EVENTS, BAARAT_ARRIVAL, VENUE } from './config.js';
import { createLive } from './live.js';

export function eventsAtSpot(spotId) {
  const list = EVENTS.filter(e => e.spotId === spotId).map(e => ({ name: e.name, when: `${e.date}, ${e.time}`, id: e.id }));
  if (spotId === BAARAT_ARRIVAL.spotId) list.push({ name: BAARAT_ARRIVAL.name, when: 'Saturday, 12th December, 11:00 AM', id: 'reception' });
  return list;
}

function livePainting() {
  const host = document.querySelector('.vwin');
  const live = createLive();
  if (!host || !live) return;
  live.load('venue', { img: 'assets/img/panel-venue.webp', mask: 'assets/img/mask-venue.png' }).then(() => {
    live.attach('venue', host, {});
    live.setProgress(0.4);
    new IntersectionObserver(([e]) => (e.isIntersecting ? live.start() : live.stop())).observe(host);
  }).catch(() => {});
}

export function initVenueMap() {
  const sheet = document.getElementById('venue-sheet');
  const chips = document.querySelectorAll('.spotchip');
  const show = chip => {
    chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
    const items = eventsAtSpot(chip.dataset.spot);
    sheet.replaceChildren();
    const h = document.createElement('h4'); h.textContent = chip.querySelector('b').textContent; sheet.append(h);
    for (const it of items) {
      const p = document.createElement('p'); p.textContent = `${it.name} · ${it.when} `;
      const a = document.createElement('a'); a.href = `#wardrobe-${it.id}`; a.textContent = 'Dress code →';
      p.append(a); sheet.append(p);
    }
  };
  chips.forEach(c => c.addEventListener('click', () => show(c)));
  document.getElementById('open-maps').href = VENUE.mapsUrl;
  livePainting();
}
