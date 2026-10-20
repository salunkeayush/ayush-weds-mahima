const petals = [30, 80, 125, 170, 215, 260, 305, 350, 55, 150, 240, 330]
  .map((x, i) => `<ellipse class="petal" cx="${x}" cy="${-20 - (i % 4) * 40}" rx="7" ry="4" fill="${['#f2c9cc', '#e9a7b0', '#f8dede'][i % 3]}" transform="rotate(${i * 35} ${x} ${-20 - (i % 4) * 40})"/>`).join('');

const corner = (tx, ty, sx, sy) => `<g transform="translate(${tx} ${ty}) scale(${sx} ${sy})">
  <circle cx="0" cy="0" r="46" fill="#f2c9cc" opacity=".85"/><circle cx="38" cy="10" r="30" fill="#e9a7b0" opacity=".8"/>
  <circle cx="8" cy="42" r="26" fill="#f8dede" opacity=".9"/><circle cx="52" cy="48" r="14" fill="#b98a3c" opacity=".55"/>
  <path d="M10 10 C50 0 70 40 40 80" fill="none" stroke="#8aa77a" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="58" cy="30" rx="9" ry="5" fill="#8aa77a" transform="rotate(35 58 30)"/><ellipse cx="46" cy="64" rx="9" ry="5" fill="#8aa77a" transform="rotate(-20 46 64)"/></g>`;

export default {
  id: 'title',
  capPos: 'center',
  dur: 5,
  caption: ['Our Love Story', 'Two hearts. One journey.'],
  svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="g-title" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9eadb"/><stop offset="1" stop-color="#f4cfcb"/></linearGradient></defs>
    <rect width="400" height="800" fill="url(#g-title)"/>
    <g class="florals">${corner(0, 0, 1, 1)}${corner(400, 0, -1, 1)}${corner(0, 800, 1, -1)}${corner(400, 800, -1, -1)}</g>
    <g class="petals">${petals}</g>
    <path class="heart-orn" d="M200 590 c-16 -14 -34 -28 -34 -44 0 -12 9 -20 19 -20 8 0 14 4 15 10 1 -6 7 -10 15 -10 10 0 19 8 19 20 0 16 -18 30 -34 44z" fill="#d98c95"/>
    
  </svg>`,
  animate(tl, t0) {
    tl.fromTo('.petal', { y: 0 }, { y: 900, duration: 5.5, stagger: 0.12 }, t0);
    tl.fromTo('.heart-orn', { scale: 0.6, opacity: 0, transformOrigin: '200px 560px' }, { scale: 1, opacity: 1, duration: 1.4 }, t0 + 0.3);
    
    tl.to('.florals', { scale: 1.08, svgOrigin: '200 400', duration: 5 }, t0);
  },
};
