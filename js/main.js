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

const sleep = ms => new Promise(r => setTimeout(r, ms));
const gsapReady = window.gsap ? Promise.resolve() : Promise.race([new Promise(r => addEventListener('load', r)), sleep(4000)]);
const storyReady = reduced ? initStory(true) : gsapReady.then(() => initStory(false));

initEnvelope(async () => {
  const story = await storyReady;
  const unlock = () => document.documentElement.classList.remove('is-locked');
  let deep = null;
  try { deep = location.hash.length > 1 ? document.querySelector(location.hash) : null; } catch { /* invalid hash */ }
  if (deep) { story.skip(unlock); unlock(); deep.scrollIntoView({ behavior: 'instant' }); }
  else { scrollTo(0, 0); story.play(unlock); }
  window.ScrollTrigger?.refresh();
});
initReveals();
initReveal();
initVenueMap();
initSchedule();
initWardrobe();
initRsvp();
