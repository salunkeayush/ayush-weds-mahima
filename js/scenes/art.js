// Shared paper-cut people. Origin (0,0) = feet centre; figures stand ~170 units tall.
export const boyBack = (cls = '') => `<g class="${cls}">
  <g class="leg-l"><rect x="-16" y="-64" width="14" height="62" rx="5" fill="#3d4260"/><ellipse cx="-9" cy="0" rx="10" ry="4" fill="#26263a"/></g>
  <g class="leg-r"><rect x="2" y="-64" width="14" height="62" rx="5" fill="#3d4260"/><ellipse cx="9" cy="0" rx="10" ry="4" fill="#26263a"/></g>
  <path d="M-23 -62 L-21 -128 Q0 -138 21 -128 L23 -62Z" fill="#9db4d6"/>
  <rect x="-27" y="-126" width="7" height="46" rx="3" fill="#9db4d6"/><rect x="20" y="-126" width="7" height="46" rx="3" fill="#9db4d6"/>
  <ellipse cx="-24" cy="-77" rx="4" ry="5" fill="#e8bc94"/><ellipse cx="24" cy="-77" rx="4" ry="5" fill="#e8bc94"/>
  <rect x="-18" y="-126" width="36" height="54" rx="10" fill="#3b3f58"/><rect x="-18" y="-100" width="36" height="3" fill="#2b2e44"/>
  <circle cx="0" cy="-148" r="15" fill="#2b2230"/><ellipse cx="-15" cy="-146" rx="3" ry="5" fill="#e8bc94"/><ellipse cx="15" cy="-146" rx="3" ry="5" fill="#e8bc94"/>
</g>`;

export const girlBack = (cls = '') => `<g class="${cls}">
  <g class="leg-l"><rect x="-13" y="-62" width="12" height="60" rx="5" fill="#7f9cc4"/><ellipse cx="-7" cy="0" rx="9" ry="4" fill="#f4efe6"/></g>
  <g class="leg-r"><rect x="1" y="-62" width="12" height="60" rx="5" fill="#7f9cc4"/><ellipse cx="7" cy="0" rx="9" ry="4" fill="#f4efe6"/></g>
  <path d="M-20 -60 L-18 -124 Q0 -132 18 -124 L20 -60Z" fill="#fbf4ea"/>
  <rect x="-24" y="-122" width="6" height="42" rx="3" fill="#fbf4ea"/><rect x="18" y="-122" width="6" height="42" rx="3" fill="#fbf4ea"/>
  <ellipse cx="-21" cy="-77" rx="4" ry="5" fill="#e8bc94"/><ellipse cx="21" cy="-77" rx="4" ry="5" fill="#e8bc94"/>
  <rect x="-14" y="-120" width="28" height="40" rx="9" fill="#e9a58f"/>
  <path d="M-16 -150 Q-20 -104 -13 -76 L13 -76 Q20 -104 16 -150 Q0 -168 -16 -150Z" fill="#3a2424"/>
  <circle cx="11" cy="-153" r="4" fill="#e86f93"/>
</g>`;

export const heart = (x, y, s = 1, fill = '#d98c95', cls = '') =>
  `<path class="${cls}" transform="translate(${x} ${y}) scale(${s})" d="M0 12 c-10 -9 -20 -17 -20 -27 0 -7 5 -12 11 -12 4 0 8 3 9 6 1 -3 5 -6 9 -6 6 0 11 5 11 12 0 10 -10 18 -20 27z" fill="${fill}"/>`;

// Point + heading (degrees) at t along a quadratic bezier p0 -> c -> p2.
export function along(t, p0, c, p2) {
  const u = 1 - t;
  const x = u * u * p0[0] + 2 * u * t * c[0] + t * t * p2[0];
  const y = u * u * p0[1] + 2 * u * t * c[1] + t * t * p2[1];
  const dx = 2 * u * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]);
  const dy = 2 * u * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}
