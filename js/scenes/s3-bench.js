const stars = Array.from({ length: 16 }, (_, i) => `<circle class="star" cx="${(i * 97) % 380 + 10}" cy="${190 + (i * 53) % 240}" r="${1 + (i % 3) * 0.6}" fill="#fff6d6" opacity="0"/>`).join('');
const skyline = [[0, 70, 150], [40, 60, 210], [90, 80, 120], [150, 50, 240], [195, 70, 160], [250, 60, 200], [305, 90, 140], [370, 40, 180]]
  .map(([x, w, h]) => `<rect x="${x}" y="${640 - h}" width="${w}" height="${h}" fill="#53416a"/>`).join('');
const wins = [[10, 3], [50, 3], [98, 2], [162, 3], [205, 2], [262, 3], [318, 3], [378, 2]].flatMap(([x, cols], i) =>
  Array.from({ length: 4 }, (_, r) => `<rect class="win" x="${x + 6}" y="${480 + r * 26 + (i % 3) * 10}" width="6" height="8" fill="#ffd77a" opacity="0"/>`)).join('');

export default {
  id: 'bench',
  caption: ['…grew together…', '…dreamed together…'],
  capLate: { at: 4, color: '#fbe9d0' },
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g-bench" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8c7a2"/><stop offset=".5" stop-color="#d9a0b5"/><stop offset="1" stop-color="#7d5f9a"/></linearGradient>
      <linearGradient id="g-bench-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2450"/><stop offset="1" stop-color="#6a4a86"/></linearGradient>
    </defs>
    <rect width="400" height="800" fill="url(#g-bench)"/>
    <rect class="night" width="400" height="800" fill="url(#g-bench-night)" opacity="0"/>
    ${stars}
    <circle class="sun" cx="200" cy="470" r="62" fill="#ffe3a6"/>
    <g class="city">${skyline}${wins}</g>
    <rect y="640" width="400" height="160" fill="#3d3151"/>
    <g class="bench">
      <rect x="110" y="590" width="180" height="12" rx="4" fill="#8a5a3c"/><rect x="110" y="540" width="180" height="8" rx="3" fill="#8a5a3c"/><rect x="110" y="556" width="180" height="8" rx="3" fill="#8a5a3c"/>
      <rect x="120" y="602" width="8" height="40" fill="#5c3a28"/><rect x="272" y="602" width="8" height="40" fill="#5c3a28"/>
    </g>
    <g class="him" transform="translate(172 592)">
      <path d="M-24 0 L-22 -66 Q0 -76 22 -66 L24 0Z" fill="#2f3e66"/><circle cx="0" cy="-86" r="15" fill="#2b2230"/>
      <ellipse cx="-15" cy="-84" rx="3" ry="5" fill="#e8bc94"/></g>
    <g class="her" transform="translate(228 592)">
      <path d="M-21 0 L-19 -62 Q0 -70 19 -62 L21 0Z" fill="#e8d5b8"/>
      <path d="M-16 -88 Q-21 -42 -14 -10 L14 -10 Q21 -42 16 -88 Q0 -106 -16 -88Z" fill="#3a2424"/><circle cx="-10" cy="-92" r="4" fill="#e86f93"/></g>
    <g class="cup" transform="translate(200 588)"><path d="M-8 -14 h16 l-3 14 h-10z" fill="#fbf4ea" stroke="#6e1a27" stroke-width="1.6"/><path d="M8 -11 q7 1 0 8" fill="none" stroke="#6e1a27" stroke-width="1.6"/>
      <path class="steam" d="M-3 -18 q-4 -6 0 -11 q4 -5 0 -10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>
    <g class="bub bub-code" transform="translate(112 395)">
      <circle cx="26" cy="64" r="4" fill="#fff"/><circle cx="34" cy="50" r="6" fill="#fff"/>
      <ellipse cx="40" cy="0" rx="62" ry="40" fill="#fff" stroke="#b98a3c" stroke-width="2"/>
      <text x="40" y="9" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="30" font-weight="700" fill="#2f3e66">{ }</text></g>
    <g class="bub bub-tooth" transform="translate(292 360)">
      <circle cx="-26" cy="64" r="4" fill="#fff"/><circle cx="-34" cy="50" r="6" fill="#fff"/>
      <ellipse cx="-30" cy="0" rx="58" ry="44" fill="#fff" stroke="#b98a3c" stroke-width="2"/>
      <path d="M-46 -18 q6 -9 16 -3 q10 -6 16 3 q4 14 -3 28 q-3 8 -6 -1 q-3 -9 -7 -9 q-4 0 -7 9 q-3 9 -6 1 q-7 -14 -3 -28z" fill="#fff" stroke="#6e1a27" stroke-width="2.4" stroke-linejoin="round"/>
      <path class="sparkle" d="M-6 -26 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#d9a441"/></g>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.sun', { y: 0 }, { y: 130, duration: 8.5 }, t0);
    tl.to('.night', { opacity: 1, duration: 6 }, t0 + 3);
    tl.to('.win', { opacity: 0.95, duration: 0.6, stagger: 0.12 }, t0 + 1.2);
    tl.to('.star', { opacity: 1, duration: 0.8, stagger: 0.25 }, t0 + 4);
    tl.fromTo('.him', { rotation: 0, transformOrigin: '0px 0px' }, { rotation: 4, duration: 5 }, t0 + 1.5);
    tl.fromTo('.her', { rotation: 0, transformOrigin: '0px 0px' }, { rotation: -4, duration: 5 }, t0 + 1.5);
    tl.fromTo('.steam', { y: 0, opacity: 0.9 }, { y: -14, opacity: 0, duration: 1.2, repeat: 6, ease: 'power1.out' }, t0 + 0.5);
    tl.fromTo('.bub-code', { scale: 0, transformOrigin: '40px 60px' }, { scale: 1, duration: 1.2, ease: 'back.out(2)' }, t0 + 3.2);
    tl.fromTo('.bub-tooth', { scale: 0, transformOrigin: '-30px 60px' }, { scale: 1, duration: 1.2, ease: 'back.out(2)' }, t0 + 4.6);
    tl.fromTo('.sparkle', { scale: 0.6, transformOrigin: '-6px -20px', opacity: 0.5 }, { scale: 1.3, opacity: 1, duration: 0.6, repeat: 5, yoyo: true }, t0 + 5.6);
    tl.to('.bub-code', { y: '-=10', duration: 1.4, repeat: 4, yoyo: true, ease: 'sine.inOut' }, t0 + 4.6);
  },
};
