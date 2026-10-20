import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';

const files = readdirSync(new URL('../js/scenes/', import.meta.url)).filter(f => /^s\d.*\.js$/.test(f)).sort();

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

test('there is at least the title scene', () => assert.ok(files.length >= 1));

for (const f of files) {
  test(`${f}: honours the scene contract`, async () => {
    const m = (await import(`../js/scenes/${f}`)).default;
    assert.match(m.id, /^[a-z0-9-]+$/);
    assert.ok(Array.isArray(m.caption) && m.caption.length >= 1);
    assert.ok(typeof m.svg === 'string' && m.svg.includes('<svg') && m.svg.includes('viewBox="0 0 400 800"'));
    assert.equal(typeof m.animate, 'function');
  });
  test(`${f}: animate() only targets elements present in its svg`, async () => {
    const m = (await import(`../js/scenes/${f}`)).default;
    const r = recorder();
    m.animate(r, 0);
    assert.ok(r.calls > 0, 'animate must add tweens');
    for (const sel of r.targets) {
      for (const part of sel.split(/[,\s]+/).filter(Boolean)) {
        const cls = part.replace(/^\./, '');
        assert.match(part, /^\.[\w-]+$/, `selector must be class names only: ${part}`);
        assert.ok(new RegExp(`class="[^"]*\\b${cls}\\b`).test(m.svg), `${f}: missing .${cls} in svg`);
      }
    }
  });
}
