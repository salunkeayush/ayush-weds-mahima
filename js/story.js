import scenes from './scenes/index.js';

const SCENE_LEN = 10; // timeline units per scene
const SVG_NS = 'http://www.w3.org/2000/svg';

export function buildStory() {
  const section = document.getElementById('story');
  const stage = section.querySelector('.stage-box');
  const track = section.querySelector('.story-track');
  track.style.setProperty('--n', String(scenes.length));
  stage.replaceChildren();
  return scenes.map(s => {
    const el = document.createElement('div');
    el.className = `scene scene--${s.id}`;
    el.dataset.scene = s.id;
    el.innerHTML = s.svg;
    const cap = document.createElement('div');
    cap.className = `cap cap--${s.capPos || 'top'}`;
    s.caption.forEach((line, i) => {
      const p = document.createElement('p');
      p.className = i === 0 ? 'cap__l1' : 'cap__l2';
      p.textContent = line;
      cap.append(p);
    });
    el.append(cap);
    stage.append(el);
    return el;
  });
}

// Lets a scene target its own elements by class without knowing about the DOM.
function scoped(tl, root) {
  const R = sel => (typeof sel === 'string' ? root.querySelectorAll(sel) : sel);
  return {
    to: (s, v, p) => tl.to(R(s), v, p),
    from: (s, v, p) => tl.from(R(s), v, p),
    set: (s, v, p) => tl.set(R(s), v, p),
    fromTo: (s, a, b, p) => tl.fromTo(R(s), a, b, p),
    call: (fn, args, p) => tl.call(fn, args, p),
    els: sel => root.querySelectorAll(sel),
    addLabel: (n, p) => tl.addLabel(n, p),
  };
}

export function initStory(reduced) {
  const section = document.getElementById('story');
  const els = buildStory();
  const { gsap, ScrollTrigger } = window;
  if (reduced || !gsap || !ScrollTrigger) { section.classList.add('story--static'); return; }
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  scenes.forEach((s, i) => {
    const el = els[i], t0 = i * SCENE_LEN;
    if (i > 0) {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, t0 - 0.4);
      tl.to(els[i - 1], { autoAlpha: 0, duration: 1 }, t0 - 0.2);
    }
    el.querySelectorAll('.cap p').forEach((p, k) => {
      const a = t0 + 0.8 + k * 1.8;
      tl.fromTo(p, { clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)', duration: 1.8 }, a);
    });
    if (s.capLate) tl.to(el.querySelectorAll('.cap p'), { color: s.capLate.color, duration: 1.5 }, t0 + s.capLate.at);
    s.animate(scoped(tl, el), t0);
  });
  tl.set({}, {}, scenes.length * SCENE_LEN); // fix total length

  ScrollTrigger.create({
    trigger: section.querySelector('.story-track'),
    start: 'top top', end: 'bottom bottom', scrub: 0.6,
    animation: tl,
  });
}
