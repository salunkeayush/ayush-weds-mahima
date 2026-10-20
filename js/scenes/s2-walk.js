import { boyBack, girlBack } from './art.js';

const lamps = Array.from({ length: 6 }, (_, k) => {
  const x = 60 + k * 170;
  return `<g transform="translate(${x} 0)"><rect x="-3" y="470" width="6" height="140" fill="#5b3a40"/><rect x="-14" y="462" width="28" height="12" rx="5" fill="#5b3a40"/>
    <circle class="glow" cx="0" cy="470" r="46" fill="#ffd77a" opacity="0"/><circle cx="0" cy="468" r="6" fill="#fff3c4"/></g>`;
}).join('');
const birds = [[60, 210], [120, 180], [90, 245]].map(([x, y]) => `<path class="bird" d="M${x} ${y} q8 -9 16 0 q8 -9 16 0" fill="none" stroke="#6b3b45" stroke-width="2.4" stroke-linecap="round"/>`).join('');
const leaves = [40, 140, 250, 340].map((x, i) => `<ellipse class="leaf" cx="${x}" cy="${230 + i * 30}" rx="6" ry="3" fill="#c97a4c" transform="rotate(${30 * i} ${x} ${230 + i * 30})"/>`).join('');
const skyline = Array.from({ length: 14 }, (_, i) => `<rect x="${i * 46 - 30}" y="${470 - (i * 37 % 90 + 30)}" width="34" height="${(i * 37 % 90) + 140}" fill="#e3a58f"/>`).join('');
const trees = Array.from({ length: 9 }, (_, i) => `<circle cx="${i * 60 - 20}" cy="${505 - (i % 3) * 14}" r="${34 + (i % 2) * 8}" fill="#c4766a"/><rect x="${i * 60 - 23}" y="520" width="6" height="80" fill="#8a5148"/>`).join('');

export default {
  id: 'walk',
  caption: ['We met as teenagers…'],
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="g-walk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7d7bd"/><stop offset=".55" stop-color="#f2a98a"/><stop offset="1" stop-color="#d9796f"/></linearGradient></defs>
    <rect width="400" height="800" fill="url(#g-walk)"/>
    <circle class="sun" cx="200" cy="430" r="70" fill="#fff0c2" opacity=".95"/><circle cx="200" cy="430" r="110" fill="#fff0c2" opacity=".25"/>
    <g class="birds">${birds}</g>
    <g class="far">${skyline}</g>
    <g class="mid">${trees}</g>
    <rect y="596" width="400" height="204" fill="#7a4a4f"/><rect y="588" width="400" height="14" fill="#c78a78"/>
    <g class="dash">${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 90 - 20}" y="710" width="46" height="6" rx="3" fill="#e8c9a8"/>`).join('')}</g>
    <g class="lamps">${lamps}</g>
    <g class="leaves">${leaves}</g>
    <g transform="translate(0 650) scale(1.1)"><g class="walkers">
      ${boyBack('boy')}<g transform="translate(70 0)">${girlBack('girl')}</g>
    </g></g>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.walkers', { x: -190 }, { x: 70, duration: 3.4, ease: 'power1.out' }, t0 + 0.2);
    tl.to('.walkers', { x: 120, duration: 5.5 }, t0 + 3.6);
    tl.fromTo('.girl', { x: 8 }, { x: -6, duration: 7 }, t0 + 1.5);
    tl.to('.walkers', { y: -5, duration: 0.45, repeat: 18, yoyo: true, ease: 'sine.inOut' }, t0 + 0.2);
    tl.fromTo('.boy .leg-l, .girl .leg-r', { rotation: -16, transformOrigin: '50% 0%' }, { rotation: 16, duration: 0.45, repeat: 18, yoyo: true, ease: 'sine.inOut' }, t0 + 0.2);
    tl.fromTo('.boy .leg-r, .girl .leg-l', { rotation: 16, transformOrigin: '50% 0%' }, { rotation: -16, duration: 0.45, repeat: 18, yoyo: true, ease: 'sine.inOut' }, t0 + 0.2);
    tl.to('.lamps', { x: -510, duration: 9.5 }, t0);
    tl.to('.glow', { opacity: 0.85, duration: 1.2, stagger: 0.9 }, t0 + 1);
    tl.to('.mid', { x: -110, duration: 9.5 }, t0);
    tl.to('.far', { x: -45, duration: 9.5 }, t0);
    tl.to('.dash', { x: -270, duration: 9.5 }, t0);
    tl.to('.sun', { y: 36, duration: 9 }, t0);
    tl.to('.bird', { x: 260, duration: 9, stagger: 0.4 }, t0);
    tl.to('.leaf', { x: -160, y: 120, rotation: 200, duration: 9, stagger: 0.3 }, t0);
  },
};
