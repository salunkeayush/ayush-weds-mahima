// Scene builders for illustrated stills. Both return the scene contract:
// { id, caption, dur, capClass?, art?, svg, animate(tl, t0) }.
const CREAM = '#f6ead9';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const motes = Array.from({ length: 14 }, (_, i) =>
  `<circle class="mote" cx="${(i * 53 + 20) % 380 + 10}" cy="${700 - (i % 5) * 60}" r="${1.4 + (i % 3) * 0.9}" fill="${i % 2 ? '#f6d27a' : '#fff3d6'}" opacity="0"/>`).join('');

function chipSvg(c, i) {
  const w = Math.round(c.text.length * 9.2 + 34);
  return `<g transform="translate(${c.x} ${c.y})"><g class="chip chip-${i}" opacity="0">
    <rect x="${-w / 2}" y="-17" width="${w}" height="34" rx="17" fill="#fffaf0" stroke="#b98a3c" stroke-width="1.6"/>
    <text x="0" y="6" text-anchor="middle" font-family="Cormorant Garamond, serif" font-style="italic" font-weight="600" font-size="18" fill="#6e1a27">${esc(c.text)}</text></g></g>`;
}

function common(chips = []) {
  const chipTweens = (tl, t0) => chips.forEach((c, i) =>
    tl.fromTo(`.chip-${i}`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, t0 + c.at));
  const moteTween = (tl, t0, dur) =>
    tl.fromTo('.mote', { y: 0, opacity: 0 }, { y: -300, opacity: 0.85, duration: Math.max(2, dur - 2.5), stagger: 0.18 }, t0 + 0.5);
  return { svg: chips.map(chipSvg).join('') + `<g class="motes">${motes}</g>`, chipTweens, moteTween };
}

// A painted still shown as a framed card over a soft blurred copy of itself.
export function cardScene({ id, img, w, h, alt, caption, dur, chips = [], art }) {
  const cw = 336, ch = +(cw * h / w).toFixed(1), top = +(400 - ch / 2).toFixed(1);
  const c = common(chips);
  const src = `assets/img/${img}.webp`;
  return {
    id, caption, dur, art, alt, chips, kind: 'card',
    svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(alt)}">
      <defs><filter id="bl-${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="sh-${id}" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#6e1a27" flood-opacity=".32"/></filter>
        <clipPath id="cl-${id}"><rect x="32" y="${top + 8}" width="${cw}" height="${ch}"/></clipPath></defs>
      <rect width="400" height="800" fill="${CREAM}"/>
      <image class="bgimg" href="${src}" x="-260" y="0" width="920" height="800" preserveAspectRatio="xMidYMid slice" filter="url(#bl-${id})"/>
      <rect width="400" height="800" fill="${CREAM}" opacity=".5"/>
      <g class="card" filter="url(#sh-${id})"><rect x="24" y="${top}" width="${cw + 16}" height="${ch + 16}" rx="6" fill="#fffaf0"/>
        <g clip-path="url(#cl-${id})"><image class="cimg" href="${src}" x="32" y="${top + 8}" width="${cw}" height="${ch}"/></g></g>
      ${c.svg}
    </svg>`,
    animate(tl, t0) {
      tl.fromTo('.card', { opacity: 0, y: 40, scale: 0.94, rotation: -1.5, svgOrigin: '200 400' },
        { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 1.2, ease: 'power2.out' }, t0 + 0.1);
      tl.fromTo('.cimg', { scale: 1, svgOrigin: '200 400' }, { scale: 1.1, duration: dur, ease: 'none' }, t0);
      tl.fromTo('.bgimg', { scale: 1.05, svgOrigin: '200 400' }, { scale: 1.18, duration: dur, ease: 'none' }, t0);
      c.chipTweens(tl, t0); c.moteTween(tl, t0, dur);
    },
  };
}

// A full-bleed portrait painting (drop-in art from assets/story/<id>.webp).
export function fullScene({ id, art, alt, caption, dur, chips = [] }) {
  const c = common(chips);
  return {
    id, caption, dur, art, alt, chips, kind: 'full', capClass: 'cap--onart',
    svg: `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${esc(alt)}">
      <rect width="400" height="800" fill="${CREAM}"/>
      <image class="fimg" href="${art}" x="0" y="0" width="400" height="800" preserveAspectRatio="xMidYMid slice"/>
      ${c.svg}
    </svg>`,
    animate(tl, t0) {
      tl.fromTo('.fimg', { scale: 1.02, svgOrigin: '200 400' }, { scale: 1.14, duration: dur, ease: 'none' }, t0);
      tl.fromTo('.fimg', { opacity: 0 }, { opacity: 1, duration: 0.8 }, t0);
      c.chipTweens(tl, t0); c.moteTween(tl, t0, dur);
    },
  };
}
