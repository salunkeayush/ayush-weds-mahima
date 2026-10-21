import title from './s1-title.js';
import polaroids from './s7-polaroids.js';
import { cardScene, fullScene } from './frame.js';

// Order = story order. `art` is an optional full-bleed painting (portrait ~2:3);
// when assets/story/<file> exists it replaces the card version. `optional` scenes
// only appear when their art exists. See docs/ART-PROMPTS.md.
export default [
  title,
  cardScene({ id: 'met', img: 'panel-met', mask: 'mask-met', plate: 'plate-met',
    layers: [{ id: 'boy', file: 'layer-met-boy', pivot: [0.15, 1], depth: 1 }, { id: 'girl', file: 'layer-met-girl', pivot: [0.77, 1], depth: 0.9 }],
    choreo(tl, t0, L) {
      tl.fromTo(L.plate, { s: 1.22 }, { s: 1, duration: 2.4, ease: 'power2.out' }, t0);
      tl.fromTo(L.boy, { x: -0.55, a: 0, r: -3 }, { x: 0, a: 1, r: 0, duration: 1.5, ease: 'power3.out' }, t0 + 0.3);
      tl.fromTo(L.girl, { x: 0.55, a: 0, r: 3 }, { x: 0, a: 1, r: 0, duration: 1.5, ease: 'power3.out' }, t0 + 0.8);
      tl.to(L.boy, { y: 0.006, r: 0.5, duration: 1.1, repeat: 3, yoyo: true, ease: 'sine.inOut' }, t0 + 2.2);
      tl.to(L.girl, { y: 0.005, r: -0.6, duration: 1.3, repeat: 3, yoyo: true, ease: 'sine.inOut' }, t0 + 2.4);
    }, w: 510, h: 278, art: 'assets/story/met.webp', dur: 5.5,
    alt: 'Two teenagers with backpacks walking home at sunset', caption: ['We met as teenagers…'] }),
  cardScene({ id: 'grew', img: 'panel-grew', mask: 'mask-grew', plate: 'plate-grew',
    layers: [{ id: 'couple', file: 'layer-grew-couple', pivot: [0.62, 1], depth: 0.9 }],
    choreo(tl, t0, L) {
      tl.fromTo(L.plate, { s: 1.2 }, { s: 1, duration: 2.6, ease: 'power2.out' }, t0);
      tl.fromTo(L.couple, { y: 0.55, a: 0, s: 0.88 }, { y: 0, a: 1, s: 1, duration: 1.7, ease: 'back.out(1.3)' }, t0 + 0.4);
      tl.fromTo(L.couple, { r: -0.8 }, { r: 0.8, duration: 2.2, repeat: 2, yoyo: true, ease: 'sine.inOut' }, t0 + 2.3);
    }, w: 512, h: 226, art: 'assets/story/grew.webp', dur: 6,
    alt: 'The two of them sitting together at dusk, looking at each other', caption: ['…grew together…', '…dreamed together…'] }),
  cardScene({ id: 'apart', img: 'panel-apart', mask: 'mask-apart', plate: 'plate-apart',
    layers: [{ id: 'left', file: 'layer-apart-left', pivot: [0.15, 0.5], depth: 0.7 }, { id: 'right', file: 'layer-apart-right', pivot: [0.82, 0.5], depth: 0.7 }],
    choreo(tl, t0, L) {
      tl.fromTo(L.left, { x: -0.6, a: 0, r: -4 }, { x: 0, a: 1, r: 0, duration: 1.5, ease: 'power3.out' }, t0 + 0.3);
      tl.fromTo(L.right, { x: 0.6, a: 0, r: 4 }, { x: 0, a: 1, r: 0, duration: 1.5, ease: 'power3.out' }, t0 + 0.6);
      tl.to(L.left, { y: 0.006, duration: 1.3, repeat: 3, yoyo: true, ease: 'sine.inOut' }, t0 + 2.2);
      tl.to(L.right, { y: -0.006, duration: 1.3, repeat: 3, yoyo: true, ease: 'sine.inOut' }, t0 + 2.2);
    }, w: 510, h: 226, art: 'assets/story/apart.webp', dur: 7.5,
    alt: 'Two airplane windows: she looks out in one, he in the other',
    caption: ['…even when life took us', 'to different places,'],
    chips: [{ text: 'Mahima · Nashik', x: 112, y: 560, at: 2 }, { text: 'Ayush · San Francisco', x: 270, y: 600, at: 3 },
      { text: '2023 · she crossed the world', x: 200, y: 660, at: 4.6 }] }),
  { ...fullScene({ id: 'sfnashik', art: 'assets/story/sfnashik.webp', dur: 6, alt: 'Ayush in San Francisco and Mahima in Nashik, a world apart',
    caption: ['Ayush in San Francisco.', 'Mahima in Nashik.'] }), optional: true },
  { ...fullScene({ id: 'flight', art: 'assets/story/flight.webp', dur: 6, alt: 'A plane carrying Mahima from India to the US',
    caption: ['…and in 2023,', 'she crossed the world.'] }), optional: true },
  cardScene({ id: 'distance', img: 'panel-distance', mask: 'mask-distance', plate: 'plate-distance',
    layers: [{ id: 'couple', file: 'layer-distance-couple', pivot: [0.63, 1], depth: 1 }],
    choreo(tl, t0, L) {
      tl.fromTo(L.plate, { s: 1.18 }, { s: 1, duration: 2.6, ease: 'power2.out' }, t0);
      tl.fromTo(L.couple, { y: 0.5, a: 0, s: 0.9 }, { y: 0, a: 1, s: 1, duration: 1.7, ease: 'power3.out' }, t0 + 0.4);
      tl.to(L.couple, { s: 1.04, duration: 3, ease: 'none' }, t0 + 2.2);
    }, w: 512, h: 227, art: 'assets/story/distance.webp', dur: 5.5,
    alt: 'Her head resting on his shoulder as they watch the sunset', caption: ['no distance could change', 'what we felt…'] }),
  polaroids,
  cardScene({ id: 'together', img: 'panel-hands', mask: 'mask-hands', w: 510, h: 227, art: 'assets/story/together.webp', dur: 7,
    alt: 'Hands held together, henna and bangles',
    caption: ['…and now,', "we're ready to begin a new journey… together."],
    chips: [{ text: 'Next stop: New York', x: 200, y: 620, at: 4.4 }] }),
  { ...fullScene({ id: 'newyork', art: 'assets/story/newyork.webp', dur: 6, alt: 'The New York skyline at dusk, their next home',
    caption: ['Next stop,', 'New York'] }), optional: true },
];
