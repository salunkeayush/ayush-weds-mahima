import { along } from './art.js';

const L = [150, 400], C = [200, 250], R = [250, 400];
const stars = Array.from({ length: 22 }, (_, i) => `<circle class="star" cx="${(i * 71) % 390 + 8}" cy="${190 + (i * 47) % 150}" r="${1 + (i % 3) * 0.5}" fill="#fff6d6" opacity=".25"/>`).join('');
const hearts = Array.from({ length: 5 }, () => `<path class="hrt" d="M0 7 c-6 -5 -12 -10 -12 -16 0 -4 3 -7 7 -7 2 0 4 1 5 3 1 -2 3 -3 5 -3 4 0 7 3 7 7 0 6 -6 11 -12 16z" fill="#ff8fa3" opacity="0"/>`).join('');

export default {
  id: 'call',
  caption: ['no distance could change', 'what we felt…'],
  capLate: { at: 0, color: '#fbe9d0' },
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="g-call" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1a3a"/><stop offset="1" stop-color="#4a3468"/></linearGradient></defs>
    <rect width="400" height="800" fill="url(#g-call)"/>${stars}
    <path d="M${L} Q${C} ${R}" fill="none" stroke="#ffb3c1" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round" opacity=".7"/>
    <g transform="translate(30 410)"><g class="phone phone-l">
      <rect x="0" y="0" width="120" height="230" rx="18" fill="#14122b" stroke="#6f5a96" stroke-width="3"/>
      <rect class="scr" x="8" y="12" width="104" height="206" rx="11" fill="#ffd9a8"/>
      <circle cx="60" cy="96" r="22" fill="#2b2230"/><path d="M22 214 Q24 140 60 134 Q96 140 98 214Z" fill="#9db4d6"/>
      <text x="60" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#6e1a27" font-weight="600">San Francisco · 9:00 AM</text>
    </g></g>
    <g transform="translate(250 410)"><g class="phone phone-r">
      <rect x="0" y="0" width="120" height="230" rx="18" fill="#14122b" stroke="#6f5a96" stroke-width="3"/>
      <rect class="scr" x="8" y="12" width="104" height="206" rx="11" fill="#c8d8f4"/>
      <path d="M36 100 Q34 60 60 58 Q86 60 84 100 L86 150 L34 150Z" fill="#3a2424"/><circle cx="60" cy="96" r="19" fill="#e8bc94"/><circle cx="78" cy="80" r="3.5" fill="#e86f93"/><path d="M22 214 Q24 150 60 142 Q96 150 98 214Z" fill="#fbf4ea"/>
      <text x="60" y="38" text-anchor="middle" font-family="Inter, sans-serif" font-size="8" fill="#2f3e66" font-weight="600">Nashik · 10:30 PM</text>
    </g></g>
    ${hearts}
    <g transform="translate(70 690)"><g class="mug mug-l"><path d="M-14 -22 h28 l-5 24 h-18z" fill="#fbf4ea" stroke="#fbe9d0" stroke-width="1.5"/><path d="M14 -18 q12 2 0 14" fill="none" stroke="#fbe9d0" stroke-width="2"/></g></g>
    <g transform="translate(330 690)"><g class="mug mug-r"><path d="M-14 -22 h28 l-5 24 h-18z" fill="#fbf4ea" stroke="#fbe9d0" stroke-width="1.5"/><path d="M-14 -18 q-12 2 0 14" fill="none" stroke="#fbe9d0" stroke-width="2"/></g></g>
    <text class="cheers" x="200" y="700" text-anchor="middle" font-family="Great Vibes, cursive" font-size="30" fill="#ffc9d3" opacity="0">Cheers, long distance</text>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.phone-l', { x: -200 }, { x: 0, duration: 2, ease: 'power2.out' }, t0 + 0.8);
    tl.fromTo('.phone-r', { x: 200 }, { x: 0, duration: 2, ease: 'power2.out' }, t0 + 0.8);
    tl.to('.phone', { y: '-=8', duration: 1.1, repeat: 6, yoyo: true, ease: 'sine.inOut' }, t0 + 3);
    tl.fromTo('.scr', { opacity: 0.6 }, { opacity: 1, duration: 0.8, repeat: 8, yoyo: true }, t0 + 2.5);
    tl.to('.star', { opacity: 1, duration: 0.8, stagger: 0.2 }, t0);
    const d = { p: 0 };
    tl.to(d, {
      p: 3, duration: 6.5,
      onUpdate() {
        tl.els('.hrt').forEach((h, i) => {
          const t = (d.p + i / 5) % 1;
          const q = along(t, L, C, R);
          const s = 0.7 + 0.6 * Math.sin(t * Math.PI);
          h.setAttribute('transform', `translate(${q.x} ${q.y - 6}) scale(${s})`);
          h.setAttribute('opacity', d.p > 0.05 ? Math.sin(t * Math.PI) : 0);
        });
      },
    }, t0 + 2.6);
    tl.fromTo('.mug-l', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, t0 + 6.2);
    tl.fromTo('.mug-r', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, t0 + 6.2);
    tl.to('.mug-l', { x: 18, rotation: 8, transformOrigin: '0px 0px', duration: 0.8 }, t0 + 7.4);
    tl.to('.mug-r', { x: -18, rotation: -8, transformOrigin: '0px 0px', duration: 0.8 }, t0 + 7.4);
    tl.to('.cheers', { opacity: 1, duration: 0.8 }, t0 + 8);
  },
};
