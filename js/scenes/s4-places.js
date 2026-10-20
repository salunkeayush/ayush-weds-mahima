const ARCH = (y) => `M40 ${y + 280} V${y + 60} Q40 ${y} 100 ${y} H300 Q360 ${y} 360 ${y + 60} V${y + 280} Z`;
const waves = (y, col) => [0, 1, 2].map(i => `<path d="M40 ${y + i * 16} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="${col}" stroke-width="2" opacity=".7"/>`).join('');
const susp = Array.from({ length: 14 }, (_, i) => `<line class="susp" x1="${150 + i * 9}" y1="${300 + Math.abs(i - 6.5) * -2 + 12}" x2="${150 + i * 9}" y2="385" stroke="#d8665a" stroke-width="1"/>`).join('');
const grapes = [[0, 0], [14, 0], [-14, 0], [7, 13], [-7, 13], [0, 26], [21, 13], [-21, 13]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#6e4a8c"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#a58bc4"/>`).join('');
const steps = Array.from({ length: 5 }, (_, i) => `<path d="M${40} ${700 + i * 14} H360 V${714 + i * 14} H40Z" fill="${['#e6c8a6', '#dcbc98', '#d2b08c', '#c8a480', '#bd9876'][i]}"/>`).join('');

export default {
  id: 'places',
  caption: ['…even when life took us', 'to different places,'],
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="g-places" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeedd"/><stop offset="1" stop-color="#f3d3c7"/></linearGradient>
      <linearGradient id="g-sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9c9db"/><stop offset="1" stop-color="#eef0f3"/></linearGradient>
      <linearGradient id="g-nk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fde4b8"/><stop offset="1" stop-color="#f5ad84"/></linearGradient>
      <clipPath id="c-sf"><path d="${ARCH(180)}"/></clipPath><clipPath id="c-nk"><path d="${ARCH(500)}"/></clipPath>
    </defs>
    <rect width="400" height="800" fill="url(#g-places)"/>
    <g transform="translate(0 -15)"><g class="winA"><g clip-path="url(#c-sf)">
      <rect x="40" y="180" width="320" height="280" fill="url(#g-sf)"/>
      <rect x="40" y="395" width="320" height="65" fill="#6f8fa8"/>${waves(405, '#d6e4ee')}
      <g class="bridge">
        <rect x="124" y="255" width="12" height="140" fill="#c0392b"/><rect x="264" y="255" width="12" height="140" fill="#c0392b"/>
        <rect x="120" y="290" width="20" height="5" fill="#a52f23"/><rect x="260" y="290" width="20" height="5" fill="#a52f23"/><rect x="120" y="330" width="20" height="5" fill="#a52f23"/><rect x="260" y="330" width="20" height="5" fill="#a52f23"/>
        <path d="M40 388 Q85 305 130 258 Q200 352 270 258 Q315 305 360 388" fill="none" stroke="#d8665a" stroke-width="3"/>
        <rect x="40" y="384" width="320" height="9" fill="#c0392b"/>${susp}
      </g>
      <g class="boat" transform="translate(70 0)"><path d="M0 418 h34 l-6 11 h-22z" fill="#f4efe6"/><rect x="14" y="404" width="3" height="14" fill="#f4efe6"/><path d="M17 404 l12 10 h-12z" fill="#e86f93"/></g>
      <ellipse class="fog" cx="120" cy="300" rx="120" ry="26" fill="#fff" opacity=".6"/><ellipse class="fog" cx="290" cy="350" rx="130" ry="24" fill="#fff" opacity=".55"/><ellipse class="fog" cx="200" cy="240" rx="150" ry="20" fill="#fff" opacity=".45"/>
      <g class="laptop" transform="translate(72 432)"><rect x="-22" y="-26" width="44" height="28" rx="3" fill="#2f3e66"/><text x="0" y="-8" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="14" font-weight="700" fill="#9fe0b0">&lt;/&gt;</text><rect x="-28" y="2" width="56" height="4" rx="2" fill="#aab4c6"/></g>
    </g>
    <path d="${ARCH(180)}" fill="none" stroke="#b98a3c" stroke-width="4"/>
    <text x="200" y="452" text-anchor="middle" font-family="Great Vibes, cursive" font-size="28" fill="#fff" stroke="#6e1a27" stroke-width="5" paint-order="stroke">San Francisco</text></g></g>
    <g transform="translate(0 -14)"><g class="winB"><g clip-path="url(#c-nk)">
      <rect x="40" y="500" width="320" height="280" fill="url(#g-nk)"/><circle cx="300" cy="560" r="30" fill="#fff0c2" opacity=".9"/>
      <rect x="40" y="690" width="320" height="90" fill="#7fb4c4"/>${waves(742, '#d7eef2')}${steps}
      <g class="temple"><rect x="170" y="620" width="70" height="72" fill="#e9cfae"/><path d="M162 620 h86 l-14 -22 h-58z" fill="#d9b88f"/><path d="M178 598 h54 l-10 -22 h-34z" fill="#e3c39b"/><path d="M188 576 h34 l-8 -20 h-18z" fill="#d9b88f"/><path d="M196 556 h18 l-9 -22z" fill="#e9cfae"/>
        <path d="M205 534 v-14" stroke="#b98a3c" stroke-width="2"/><path class="flag" d="M205 520 l16 5 -16 5z" fill="#e86f93"/><path d="M188 692 v-34 a17 17 0 0 1 34 0 v34z" fill="#7a3b2e"/></g>
      <g class="vine" transform="translate(318 560)"><path d="M-20 -60 Q0 -20 10 -10" stroke="#6f8f55" stroke-width="3" fill="none"/><g transform="translate(0 0)">${grapes}</g><ellipse cx="-12" cy="-24" rx="14" ry="7" fill="#7ea55f" transform="rotate(-25 -12 -24)"/></g>
      <g class="tooth-wrap" transform="translate(98 585)"><path d="M-22 -22 q8 -12 22 -4 q14 -8 22 4 q6 20 -4 40 q-4 12 -9 -2 q-4 -12 -9 -12 q-5 0 -9 12 q-5 14 -9 2 q-10 -20 -4 -40z" fill="#fff" stroke="#6e1a27" stroke-width="2.6" stroke-linejoin="round"/>
        <path class="sparkle" d="M22 -28 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#d9a441"/>
        <g transform="translate(34 26) rotate(-35)"><rect x="0" y="-2" width="42" height="4" rx="2" fill="#aab4c6"/><circle cx="46" cy="0" r="9" fill="#e9f3f8" stroke="#aab4c6" stroke-width="3"/></g></g>
    </g>
    <path d="${ARCH(500)}" fill="none" stroke="#b98a3c" stroke-width="4"/>
    <text x="200" y="770" text-anchor="middle" font-family="Great Vibes, cursive" font-size="28" fill="#fff" stroke="#6e1a27" stroke-width="5" paint-order="stroke">Nashik</text></g></g>
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.winA', { x: -440 }, { x: 0, duration: 2.6, ease: 'power2.out' }, t0 + 0.8);
    tl.fromTo('.winB', { x: 440 }, { x: 0, duration: 2.6, ease: 'power2.out' }, t0 + 1.4);
    tl.to('.fog', { x: 70, duration: 8, stagger: 0.5 }, t0 + 1);
    tl.to('.boat', { x: 190, duration: 8 }, t0 + 1);
    tl.to('.laptop', { y: '-=4', duration: 0.6, repeat: 10, yoyo: true, ease: 'sine.inOut' }, t0 + 2);
    tl.to('.flag', { scaleX: 0.7, transformOrigin: '205px 525px', duration: 0.5, repeat: 12, yoyo: true }, t0 + 2);
    tl.fromTo('.sparkle', { scale: 0.5, opacity: 0.4, transformOrigin: '22px -28px' }, { scale: 1.4, opacity: 1, duration: 0.7, repeat: 8, yoyo: true }, t0 + 3);
    tl.fromTo('.vine', { rotation: -3, transformOrigin: '0px -60px' }, { rotation: 3, duration: 1.2, repeat: 6, yoyo: true, ease: 'sine.inOut' }, t0 + 2);
    tl.to('.winA', { y: -10, duration: 4 }, t0 + 5);
    tl.to('.winB', { y: 10, duration: 4 }, t0 + 5);
  },
};
