const B = [[-4, 46, 170], [44, 38, 230], [84, 54, 190], [142, 34, 270], [178, 30, 330], [212, 44, 220], [258, 52, 260], [312, 36, 200], [350, 56, 180]];
const buildings = B.map(([x, w, h], i) => `<g class="bld" data-i="${i}"><rect x="${x}" y="${690 - h}" width="${w}" height="${h}" fill="${['#232a52', '#2b3260', '#1e2447'][i % 3]}"/>${Array.from({ length: Math.floor(h / 26) }, (_, r) => `<rect class="win" x="${x + 6 + (r % 2) * 14}" y="${698 - h + r * 26}" width="6" height="9" fill="#ffd77a" opacity="0"/>`).join('')}</g>`).join('');
const empire = `<g class="bld empire"><rect x="176" y="365" width="34" height="60" fill="#2a3160"/><rect x="182" y="330" width="22" height="40" fill="#2a3160"/><rect x="187" y="300" width="12" height="34" fill="#2a3160"/><rect x="192" y="262" width="3" height="42" fill="#2a3160"/><circle class="beacon" cx="193.5" cy="260" r="3.5" fill="#ff8fa3"/></g>`;
const stars = Array.from({ length: 18 }, (_, i) => `<circle class="star" cx="${(i * 67) % 380 + 10}" cy="${180 + (i * 41) % 240}" r="${1 + (i % 3) * 0.5}" fill="#fff6d6" opacity="0"/>`).join('');

export default {
  id: 'nyc',
  caption: ['Next stop,', 'New York'],
  capLate: { at: 0, color: '#fbe9d0' },
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="g-nyc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1f45"/><stop offset=".6" stop-color="#6a4a86"/><stop offset="1" stop-color="#f1a07c"/></linearGradient></defs>
    <rect width="400" height="800" fill="url(#g-nyc)"/>${stars}
    <circle class="moon" cx="300" cy="240" r="34" fill="#fff0c8"/><circle cx="312" cy="232" r="30" fill="#6a4a86" opacity=".0"/>
    <g class="skyline">${buildings}${empire}</g>
    <g class="sign" opacity="0"><rect x="262" y="478" width="70" height="40" rx="6" fill="#14122b" stroke="#ff8fa3" stroke-width="2"/><text x="297" y="505" text-anchor="middle" font-family="Great Vibes, cursive" font-size="22" fill="#ff8fa3">M ♥ A</text></g>
    <rect y="690" width="400" height="110" fill="#1a1a30"/><rect y="690" width="400" height="6" fill="#3a3a5c"/>
    <g class="dash">${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 70 - 20}" y="745" width="38" height="5" rx="2" fill="#e8c27a"/>`).join('')}</g>
    <g transform="translate(0 720)"><g class="taxi"><rect x="-70" y="-18" width="66" height="22" rx="7" fill="#f4c430"/><path d="M-60 -18 l8 -12 h30 l8 12z" fill="#f4c430"/><rect x="-50" y="-26" width="24" height="9" fill="#9fc5e8"/><circle cx="-56" cy="4" r="6" fill="#222"/><circle cx="-18" cy="4" r="6" fill="#222"/><rect x="-40" y="-33" width="14" height="5" rx="2" fill="#fff6d6"/>
      <path d="M-4 -10 l30 -8 v26 l-30 -6z" fill="#fff6d6" opacity=".35" class="beam"/></g></g>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.skyline', { y: 320 }, { y: 0, duration: 3.4, ease: 'power2.out' }, t0 + 0.6);
    tl.fromTo('.moon', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 3 }, t0 + 0.4);
    tl.to('.win', { opacity: 0.95, duration: 0.5, stagger: 0.04 }, t0 + 2.8);
    tl.to('.star', { opacity: 1, duration: 0.6, stagger: 0.2 }, t0 + 1);
    tl.to('.sign', { opacity: 1, duration: 0.6, repeat: 5, yoyo: true }, t0 + 5);
    tl.fromTo('.taxi', { x: -120 }, { x: 560, duration: 7 }, t0 + 2);
    tl.to('.dash', { x: -140, duration: 9 }, t0);
    tl.to('.beacon', { opacity: 0.2, duration: 0.5, repeat: 12, yoyo: true }, t0 + 3);
  },
};
