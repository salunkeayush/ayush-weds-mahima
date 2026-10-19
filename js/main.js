import { initEnvelope } from './envelope.js';
import { initStory } from './story.js';
import { initReveal } from './reveal.js';
import { initVenueMap } from './venue-map.js';
import { initSchedule } from './schedule.js';
import { initWardrobe } from './wardrobe.js';
import { initRsvp } from './rsvp-ui.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) document.documentElement.classList.add('reduced');

function initReveals() {
  const els = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  els.forEach(e => io.observe(e));
}

initEnvelope(() => {
  document.body.classList.remove('is-locked');
  document.getElementById('story').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  window.ScrollTrigger?.refresh();
});
initStory(reduced);
initReveals();
initReveal();
initVenueMap();
initSchedule();
initWardrobe();
initRsvp();
