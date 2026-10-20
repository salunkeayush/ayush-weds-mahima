const POL = [
  { x: 108, y: 262, rot: -4, img: 'proposal-he', w: 1600, h: 1067, label: 'He asked', cx: 0.5 },
  { x: 292, y: 292, rot: 3, img: 'proposal-she', w: 1600, h: 1200, label: 'She asked', cx: 0.5 },
  { x: 200, y: 548, rot: -2, img: 'proposal-he-sunset', w: 360, h: 480, label: 'We said yes', cx: 0.5 },
];
const polaroid = (p, i) => `<g transform="translate(${p.x} ${p.y})"><g class="pol pol-${i}">
  <rect x="-72" y="-2" width="144" height="188" rx="3" fill="#fffaf0" stroke="#e6d6bb" stroke-width="1.5"/>
  <clipPath id="c-pol-${i}"><rect x="-62" y="12" width="124" height="130"/></clipPath>
  <image href="assets/img/${p.img}.webp" x="-62" y="12" width="124" height="130" preserveAspectRatio="xMidYMid slice" clip-path="url(#c-pol-${i})"/>
  <text x="0" y="170" text-anchor="middle" font-family="Great Vibes, cursive" font-size="24" fill="#6e1a27">${p.label}</text>
  <rect x="-7" y="-14" width="14" height="30" rx="3" fill="#b98457" stroke="#8a5e3a" stroke-width="1.2"/><circle cx="0" cy="-8" r="1.6" fill="#8a5e3a"/>
</g></g>`;

export default {
  id: 'polaroids',
  caption: ['He asked. She asked.', 'We both said yes.'],
  dur: 8,
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g-pol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8e8d4"/><stop offset="1" stop-color="#f1cdc4"/></linearGradient>
      <pattern id="p-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.6" fill="#e2c3a8" opacity=".7"/><circle cx="21" cy="21" r="1.6" fill="#e2c3a8" opacity=".7"/></pattern>
    </defs>
    <rect width="400" height="800" fill="url(#g-pol)"/><rect width="400" height="800" fill="url(#p-dots)"/>
    <path class="string" d="M-10 232 Q200 330 410 232" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" fill="none" stroke="#8a5e3a" stroke-width="2.4"/>
    <path class="string" d="M60 520 Q200 580 340 520" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" fill="none" stroke="#8a5e3a" stroke-width="2.4"/>
    ${POL.map(polaroid).join('')}
    <g class="confetti">${Array.from({ length: 14 }, (_, i) => `<path class="cf" d="M0 6 c-4 -3 -8 -6 -8 -10 0 -3 2 -5 4.5 -5 1.5 0 3 1 3.5 2.2 .5 -1.2 2 -2.2 3.5 -2.2 2.5 0 4.5 2 4.5 5 0 4 -4 7 -8 10z" transform="translate(${(i * 61) % 380 + 10} ${760 + (i % 3) * 20})" fill="${['#e86f93', '#f3c969', '#f2a7b3'][i % 3]}" opacity="0"/>`).join('')}</g>
  </svg>`,
  animate(tl, t0) {
    tl.to('.string', { strokeDashoffset: 0, duration: 1.2 }, t0 + 0.4);
    POL.forEach((p, i) => {
      const at = t0 + 1 + i * 1.5;
      const origin = `${p.x} ${p.y}`;
      tl.fromTo(`.pol-${i}`, { y: -520, rotation: p.rot * 4, svgOrigin: origin }, { y: 0, rotation: p.rot, duration: 1.3, ease: 'bounce.out' }, at);
      tl.to(`.pol-${i}`, { rotation: p.rot * -1.2, duration: 0.9, repeat: 2, yoyo: true, ease: 'sine.inOut', svgOrigin: origin }, at + 1.4);
    });
    tl.to('.cf', { opacity: 1, y: -700, duration: 3, stagger: 0.1, ease: 'power1.out' }, t0 + 5);
  },
};
