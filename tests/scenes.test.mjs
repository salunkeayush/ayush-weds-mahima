import test from 'node:test';
import assert from 'node:assert/strict';
import scenes from '../js/scenes/index.js';
import { cardScene, fullScene } from '../js/scenes/frame.js';

function recorder() {
  const targets = []; let calls = 0;
  const rec = (sel) => { calls++; if (typeof sel === 'string') targets.push(sel); };
  return {
    targets, get calls() { return calls; },
    to: rec, from: rec, set: rec, fromTo: rec,
    call() { calls++; }, addLabel() {},
    els(sel) { rec(sel); calls--; return []; },
  };
}

function checkScene(m, label) {
  test(`${label}: honours the scene contract`, () => {
    assert.match(m.id, /^[a-z0-9-]+$/);
    assert.ok(Array.isArray(m.caption) && m.caption.length >= 1);
    assert.ok(typeof m.dur === 'number' && m.dur >= 3 && m.dur <= 10, 'dur is seconds, 3..10');
    assert.ok(typeof m.svg === 'string' && m.svg.includes('<svg') && m.svg.includes('viewBox="0 0 400 800"'));
    assert.equal(typeof m.animate, 'function');
  });
  test(`${label}: animate() only targets elements present in its svg`, () => {
    const r = recorder();
    m.animate(r, 0);
    assert.ok(r.calls > 0, 'animate must add tweens');
    for (const sel of r.targets) {
      for (const part of sel.split(/[,\s]+/).filter(Boolean)) {
        assert.match(part, /^\.[\w-]+$/, `class names only: ${part}`);
        const cls = part.slice(1);
        assert.ok(new RegExp(`class="[^"]*\\b${cls}\\b`).test(m.svg), `${label}: missing .${cls} in svg`);
      }
    }
  });
}

test('story plays in under a minute (autoplay, no scrolling)', () => {
  const base = scenes.filter(s => !s.optional);
  const total = base.reduce((a, s) => a + s.dur, 0);
  assert.ok(total <= 50, `total ${total}s`);
  assert.ok(base.length >= 6);
  assert.ok(scenes.filter(s => s.optional).every(s => s.art), 'optional scenes need art');
});
test('every scene id is unique', () => assert.equal(new Set(scenes.map(s => s.id)).size, scenes.length));
for (const s of scenes) checkScene(s, s.id);

const card = cardScene({ id: 'x-card', img: 'panel-met', w: 510, h: 278, alt: 'alt', caption: ['hi'], dur: 5,
  chips: [{ text: 'Nashik', x: 100, y: 600, at: 2 }] });
checkScene(card, 'cardScene helper');
const full = fullScene({ id: 'x-full', art: 'assets/story/x.webp', alt: 'alt', caption: ['hi'], dur: 5, chips: [{ text: 'NYC', x: 200, y: 700, at: 2 }] });
checkScene(full, 'fullScene helper');
test('cardScene card height follows the image aspect ratio', () => {
  const tall = cardScene({ id: 't', img: 'panel-met', w: 100, h: 200, alt: 'a', caption: ['x'], dur: 5 });
  const wide = cardScene({ id: 'w', img: 'panel-met', w: 200, h: 100, alt: 'a', caption: ['x'], dur: 5 });
  const hOf = (s) => +s.svg.match(/class="cimg"[^>]*height="([\d.]+)"/)[1];
  assert.ok(hOf(tall) > hOf(wide));
});
