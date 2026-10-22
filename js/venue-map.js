import { EVENTS, BAARAT_ARRIVAL, VENUE } from './config.js';

export function eventsAtSpot(spotId) {
  const list = EVENTS.filter(e => e.spotId === spotId).map(e => ({ name: e.name, when: `${e.date}, ${e.time}`, id: e.id }));
  if (spotId === BAARAT_ARRIVAL.spotId) list.push({ name: BAARAT_ARRIVAL.name, when: 'Saturday, 12th December, 11:00 AM', id: 'reception' });
  return list;
}

export function initVenueMap() {
  const sheet = document.getElementById('venue-sheet');
  const spots = document.querySelectorAll('#hotel-map .spot');
  const show = spot => {
    spots.forEach(s => s.classList.toggle('active', s === spot));
    const id = spot.dataset.spot;
    const label = spot.querySelector('.lbl').textContent;
    const items = eventsAtSpot(id);
    sheet.replaceChildren();
    const h = document.createElement('h4'); h.textContent = label; sheet.append(h);
    for (const it of items) {
      const p = document.createElement('p'); p.textContent = `${it.name} · ${it.when} `;
      const a = document.createElement('a'); a.href = `#wardrobe-${it.id}`; a.textContent = 'Dress code →';
      p.append(a); sheet.append(p);
    }
  };
  spots.forEach(s => {
    s.addEventListener('click', () => show(s));
    s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(s); } });
  });
  document.getElementById('open-maps').href = VENUE.mapsUrl;
}
