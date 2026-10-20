const flowers = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2, r = 168 + (i % 2) * 8;
  const x = 200 + Math.cos(a) * r, y = 480 + Math.sin(a) * r;
  const c = ['#f2c9cc', '#e9a7b0', '#fff3e4', '#e8c27a'][i % 4];
  return `<g class="fl" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="flin">
    <ellipse cx="${(Math.cos(a + 1.5) * 12).toFixed(1)}" cy="${(Math.sin(a + 1.5) * 12).toFixed(1)}" rx="14" ry="5" fill="#8aa77a" transform="rotate(${((a + 1.5) * 180 / Math.PI).toFixed(0)})"/>
    ${[0, 72, 144, 216, 288].map(d => `<ellipse cx="0" cy="-9" rx="6.5" ry="10" fill="${c}" transform="rotate(${d})"/>`).join('')}<circle r="4.5" fill="#d9a441"/></g></g>`;
}).join('');
const bangles = [0, 1, 2, 3, 4].map(i => `<rect x="${262 + i * 4.4}" y="446" width="3.2" height="62" rx="1.6" fill="#d9a441" stroke="#b98a3c" stroke-width=".6"/>`).join('');
const henna = Array.from({ length: 12 }, (_, i) => `<circle cx="${212 + (i % 4) * 9}" cy="${464 + Math.floor(i / 4) * 10}" r="1.8" fill="#7a2e1f"/>`).join('');

export default {
  id: 'hands',
  caption: ['…and now,', "we're ready to begin a new journey… together."],
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="g-hands" cx=".5" cy=".6" r=".8"><stop offset="0" stop-color="#fff0d6"/><stop offset=".6" stop-color="#f7d2c8"/><stop offset="1" stop-color="#eaa9ad"/></radialGradient></defs>
    <rect width="400" height="800" fill="url(#g-hands)"/>
    <g class="wreath">${flowers}</g>
    <g class="sparks">${Array.from({ length: 10 }, (_, i) => `<path class="spark" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2Z" transform="translate(${60 + (i * 83) % 290} ${230 + (i * 61) % 520})" fill="#f6d27a" opacity="0"/>`).join('')}</g>
    <g transform="rotate(9 200 476)"><g class="arm arm-l">
      <rect x="-90" y="452" width="200" height="50" rx="12" fill="#2f2f45"/>
      <rect x="104" y="450" width="16" height="54" rx="3" fill="#f4efe6"/><rect x="86" y="456" width="14" height="42" rx="4" fill="#d9a441" stroke="#b98a3c" stroke-width="1"/>
      <ellipse cx="166" cy="478" rx="50" ry="23" fill="#e8bc94"/></g></g>
    <g transform="rotate(-9 200 476)"><g class="arm arm-r">
      <rect x="290" y="452" width="200" height="50" rx="12" fill="#a1243a"/>
      <rect x="280" y="450" width="16" height="54" rx="3" fill="#e6c27a"/>${bangles}
      <ellipse cx="234" cy="478" rx="50" ry="23" fill="#dca97f"/>${henna}</g></g>
    <g transform="rotate(9 200 476)"><g class="arm arm-l">${[0, 1, 2, 3].map(i => `<rect x="${186 + (i % 2) * 3}" y="${462 + i * 8.5}" width="34" height="9" rx="4.5" fill="#e8bc94" stroke="#c99468" stroke-width=".8"/>`).join('')}</g></g>
    <path class="clasp" d="M200 466 q6 12 0 24" fill="none" stroke="#c99468" stroke-width="2.4" stroke-linecap="round" opacity="0"/>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.arm-l', { x: -230 }, { x: 0, duration: 2.6, ease: 'power2.out' }, t0 + 0.8);
    tl.fromTo('.arm-r', { x: 230 }, { x: 0, duration: 2.6, ease: 'power2.out' }, t0 + 0.8);
    tl.to('.clasp', { opacity: 1, duration: 0.4 }, t0 + 3.3);
    tl.fromTo('.fl', { scale: 0, rotation: -40, transformOrigin: '0px 0px' }, { scale: 1, rotation: 0, duration: 0.9, stagger: 0.11, ease: 'back.out(2.4)' }, t0 + 3.4);
    tl.to('.wreath', { rotation: 6, transformOrigin: '200px 480px', duration: 6 }, t0 + 4);
    tl.to('.spark', { opacity: 1, scale: 1.4, duration: 0.5, stagger: 0.3, transformOrigin: '0px 0px' }, t0 + 6);
    tl.to('.arm', { y: '-=6', duration: 1.4, repeat: 2, yoyo: true, ease: 'sine.inOut' }, t0 + 4);
  },
};
