import { along } from './art.js';

const NASHIK = [278, 524], SF = [84, 456], CTRL = [180, 170];
const arc = `M${NASHIK} Q${CTRL} ${SF}`;
const clouds = [[70, 150, 54], [310, 230, 46], [150, 640, 40], [330, 700, 50]].map(([x, y, r]) => `<g class="cloud"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.38}" fill="#fff" opacity=".8"/><ellipse cx="${x + r * 0.5}" cy="${y - 8}" rx="${r * 0.55}" ry="${r * 0.32}" fill="#fff" opacity=".85"/></g>`).join('');

export default {
  id: 'flight',
  caption: ['…and in 2023,', 'she flew across the world.'],
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g-fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd9ee"/><stop offset=".6" stop-color="#f7dcc8"/><stop offset="1" stop-color="#f4c9bd"/></linearGradient>
      <radialGradient id="g-globe" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#8fc4e8"/><stop offset=".7" stop-color="#3f7fb8"/><stop offset="1" stop-color="#2a5d92"/></radialGradient>
      <clipPath id="c-globe"><circle cx="190" cy="560" r="200"/></clipPath>
    </defs>
    <rect width="400" height="800" fill="url(#g-fl)"/>
    ${clouds}
    <g class="globe">
      <circle cx="190" cy="560" r="200" fill="url(#g-globe)"/>
      <g clip-path="url(#c-globe)">
        <path d="M30 450 Q70 395 150 410 Q185 430 160 470 Q140 500 100 492 Q60 500 38 480Z" fill="#9bbf72"/><path d="M60 430 Q100 415 140 428" fill="none" stroke="#d6e6a8" stroke-width="3"/>
        <path d="M252 482 Q300 462 336 490 Q322 536 304 578 Q294 606 286 580 Q262 532 252 482Z" fill="#a9c56e"/><path d="M270 492 Q300 480 322 496" fill="none" stroke="#e8e0a0" stroke-width="3"/>
        <path d="M0 600 q60 -20 120 0 t120 0 t120 0" fill="none" stroke="#fff" stroke-width="2" opacity=".25"/><path d="M0 640 q60 -20 120 0 t120 0 t120 0" fill="none" stroke="#fff" stroke-width="2" opacity=".2"/>
      </g>
      <circle cx="190" cy="560" r="200" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/>
    </g>
    <path class="route" d="${arc}" pathLength="1" stroke-dasharray="0.02 0.03" fill="none" stroke="#6e1a27" stroke-width="3" stroke-linecap="round" opacity="0"/>
    <g class="pin pin-nk"><circle cx="${NASHIK[0]}" cy="${NASHIK[1]}" r="7" fill="#e0443c"/><circle cx="${NASHIK[0]}" cy="${NASHIK[1]}" r="3" fill="#fff"/></g>
    <text class="lbl lbl-nk" x="${NASHIK[0] + 12}" y="${NASHIK[1] + 28}" font-family="Great Vibes, cursive" font-size="24" fill="#fff" opacity="0">Nashik</text>
    <g class="pin pin-sf"><circle class="ring" cx="${SF[0]}" cy="${SF[1]}" r="9" fill="none" stroke="#f3c969" stroke-width="3" opacity="0"/><circle cx="${SF[0]}" cy="${SF[1]}" r="7" fill="#f3c969"/><circle cx="${SF[0]}" cy="${SF[1]}" r="3" fill="#fff"/></g>
    <text class="lbl lbl-sf" x="${SF[0] - 6}" y="${SF[1] + 30}" font-family="Great Vibes, cursive" font-size="22" fill="#fff" opacity="0">San Francisco</text>
    <g class="plane" opacity="0"><path d="M-22 0 L18 -4 Q30 0 18 4 Z" fill="#fff" stroke="#6e1a27" stroke-width="1.6" stroke-linejoin="round"/><path d="M-4 -2 L-16 -22 L-9 -22 L8 -3Z M-4 2 L-16 22 L-9 22 L8 3Z" fill="#f6ecdc" stroke="#6e1a27" stroke-width="1.4" stroke-linejoin="round"/><path d="M-22 0 L-30 -10 L-25 -10 L-17 -1Z" fill="#e86f93"/></g>
    <g class="tag" opacity="0"><rect x="-26" y="-13" width="52" height="24" rx="12" fill="#fff6e6" stroke="#b98a3c" stroke-width="2"/><text x="0" y="4" text-anchor="middle" font-family="Cormorant Garamond, serif" font-weight="700" font-size="16" fill="#6e1a27">2023</text></g>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.globe', { y: 120, scale: 0.85, transformOrigin: '190px 560px' }, { y: 0, scale: 1, duration: 2.4, ease: 'power2.out' }, t0 + 0.4);
    tl.to('.cloud', { x: 60, duration: 9, stagger: 0.4 }, t0);
    tl.fromTo('.pin-nk', { scale: 0, transformOrigin: '278px 524px' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, t0 + 2.6);
    tl.to('.lbl-nk', { opacity: 1, duration: 0.6 }, t0 + 3);
    tl.to('.route', { opacity: 0.9, duration: 0.3 }, t0 + 3.4);
    const st = { t: 0 };
    tl.to(st, {
      t: 1, duration: 4.6, ease: 'power1.inOut',
      onUpdate() {
        const root = tl.els('.plane')[0]; const tag = tl.els('.tag')[0];
        if (!root || !tag) return;
        const p = along(st.t, NASHIK, CTRL, SF);
        const flip = Math.abs(p.angle) > 90 ? -1 : 1;
        root.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.angle}) scale(1 ${flip})`);
        tag.setAttribute('transform', `translate(${p.x + 6} ${p.y - 34})`);
        root.setAttribute('opacity', st.t > 0.01 && st.t < 0.99 ? 1 : 0);
        tag.setAttribute('opacity', st.t > 0.01 ? 1 : 0);
      },
    }, t0 + 3.6);
    tl.fromTo('.ring', { scale: 0.6, opacity: 0.9, transformOrigin: '84px 456px' }, { scale: 2.6, opacity: 0, duration: 1, repeat: 2 }, t0 + 8.1);
    tl.to('.lbl-sf', { opacity: 1, duration: 0.6 }, t0 + 8.2);
    tl.to('.tag', { opacity: 0, duration: 0.6 }, t0 + 9.2);
  },
};
