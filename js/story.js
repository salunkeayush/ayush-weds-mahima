import baseScenes from './scenes/index.js';
import { fullScene } from './scenes/frame.js';

const FADE = 0.7;

const canLoad = src => new Promise(res => {
  const i = new Image();
  i.onload = () => res(true);
  i.onerror = () => res(false);
  i.src = src;
  setTimeout(() => res(false), 2500);
});

// Painted full-bleed art dropped into assets/story/ replaces a card scene;
// optional scenes only appear when their art exists.
async function readManifest() {
  try { const r = await fetch('assets/story/manifest.json'); return r.ok ? await r.json() : []; } catch { return []; }
}

export async function resolveScenes(list = baseScenes, probe = canLoad, manifest = readManifest) {
  const listed = new Set(await manifest());
  const has = await Promise.all(list.map(s => (s.art && listed.has(s.art.split('/').pop()) ? probe(s.art) : false)));
  const out = [];
  list.forEach((s, i) => {
    if (s.optional) { if (has[i]) out.push(s); return; }
    out.push(has[i] && s.kind === 'card'
      ? fullScene({ id: s.id, art: s.art, alt: s.alt, caption: s.caption, dur: s.dur, chips: s.chips })
      : s);
  });
  return out;
}

function build(scenes, stage) {
  stage.replaceChildren();
  return scenes.map(s => {
    const el = document.createElement('div');
    el.className = `scene scene--${s.id}`;
    el.innerHTML = s.svg;
    const cap = document.createElement('div');
    cap.className = `cap cap--${s.capPos || 'top'} ${s.capClass || ''}`.trim();
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

const noop = { static: true, play: done => done?.(), skip: done => done?.(), replay() {} };

export async function initStory(reduced) {
  const section = document.getElementById('story');
  const stageBox = section.querySelector('.stage-box');
  const stage = section.querySelector('.stage');
  const scenes = await resolveScenes();
  const els = build(scenes, stageBox);
  const { gsap } = window;
  if (reduced || !gsap) { section.classList.add('story--static'); return noop; }

  const ui = document.createElement('div');
  ui.className = 'story-ui';
  ui.innerHTML = `<button type="button" class="story-skip">Skip story ›</button>
    <div class="story-bar" aria-hidden="true"><i></i></div>
    <div class="story-end" hidden><span class="story-cue" aria-hidden="true">Scroll ↓</span><button type="button" class="story-replay">↺ Replay</button></div>`;
  stage.append(ui);
  const skipBtn = ui.querySelector('.story-skip'), bar = ui.querySelector('.story-bar'),
    barFill = bar.firstElementChild, end = ui.querySelector('.story-end');

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  const starts = [];
  let t = 0;
  scenes.forEach((s, i) => {
    const el = els[i], t0 = t;
    starts.push(t0);
    tl.addLabel(`s${i}`, t0);
    if (i > 0) {
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE }, t0 - FADE / 2);
      tl.to(els[i - 1], { autoAlpha: 0, duration: FADE }, t0 - FADE / 2);
    }
    el.querySelectorAll('.cap p').forEach((p, k) => {
      tl.fromTo(p, { clipPath: 'inset(-10% 100% -10% 0)' }, { clipPath: 'inset(-10% 0% -10% 0)', duration: 1.4 }, t0 + 0.5 + k * 1.5);
    });
    s.animate(scoped(tl, el), t0);
    t += s.dur;
  });
  tl.set({}, {}, t);

  let onDone = null, finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    skipBtn.hidden = true; bar.hidden = true; end.hidden = false;
    onDone?.();
  };
  tl.eventCallback('onUpdate', () => { barFill.style.width = `${tl.progress() * 100}%`; });
  tl.eventCallback('onComplete', finish);

  const jumpToEnd = () => { tl.progress(1, false); finish(); };
  const next = () => {
    const now = tl.time();
    const k = starts.findIndex(s => s > now + 0.4);
    if (k === -1) jumpToEnd(); else tl.seek(starts[k] + 0.05, false);
  };
  skipBtn.addEventListener('click', e => { e.stopPropagation(); jumpToEnd(); });
  stageBox.addEventListener('click', () => { if (!finished && !tl.paused()) next(); });
  ui.querySelector('.story-replay').addEventListener('click', () => {
    finished = false; end.hidden = true; skipBtn.hidden = false; bar.hidden = false;
    document.documentElement.classList.add('is-locked');
    section.scrollIntoView({ behavior: 'instant' });
    tl.restart();
  });

  return {
    static: false,
    play(done) { onDone = done; tl.play(0); },
    skip(done) { onDone = done; jumpToEnd(); },
  };
}
