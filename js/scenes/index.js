import title from './s1-title.js';
import polaroids from './s7-polaroids.js';
import { cardScene, fullScene } from './frame.js';

// Order = story order. `art` is an optional full-bleed painting (portrait ~2:3);
// when assets/story/<file> exists it replaces the card version. `optional` scenes
// only appear when their art exists. See docs/ART-PROMPTS.md.
export default [
  title,
  cardScene({ id: 'met', img: 'panel-met', w: 510, h: 278, art: 'assets/story/met.webp', dur: 5.5,
    alt: 'Two teenagers with backpacks walking home at sunset', caption: ['We met as teenagers…'] }),
  cardScene({ id: 'grew', img: 'panel-grew', w: 512, h: 226, art: 'assets/story/grew.webp', dur: 6,
    alt: 'The two of them sitting together at dusk, looking at each other', caption: ['…grew together…', '…dreamed together…'] }),
  cardScene({ id: 'apart', img: 'panel-apart', w: 510, h: 226, art: 'assets/story/apart.webp', dur: 7.5,
    alt: 'Two airplane windows: she looks out in one, he in the other',
    caption: ['…even when life took us', 'to different places,'],
    chips: [{ text: 'Mahima · Nashik', x: 112, y: 560, at: 2 }, { text: 'Ayush · San Francisco', x: 270, y: 600, at: 3 },
      { text: '2023 · she crossed the world', x: 200, y: 660, at: 4.6 }] }),
  { ...fullScene({ id: 'sfnashik', art: 'assets/story/sfnashik.webp', dur: 6, alt: 'Ayush in San Francisco and Mahima in Nashik, a world apart',
    caption: ['Ayush in San Francisco.', 'Mahima in Nashik.'] }), optional: true },
  { ...fullScene({ id: 'flight', art: 'assets/story/flight.webp', dur: 6, alt: 'A plane carrying Mahima from India to the US',
    caption: ['…and in 2023,', 'she crossed the world.'] }), optional: true },
  cardScene({ id: 'distance', img: 'panel-distance', w: 512, h: 227, art: 'assets/story/distance.webp', dur: 5.5,
    alt: 'Her head resting on his shoulder as they watch the sunset', caption: ['no distance could change', 'what we felt…'] }),
  polaroids,
  cardScene({ id: 'together', img: 'panel-hands', w: 510, h: 227, art: 'assets/story/together.webp', dur: 7,
    alt: 'Hands held together, henna and bangles',
    caption: ['…and now,', "we're ready to begin a new journey… together."],
    chips: [{ text: 'Next stop: New York', x: 200, y: 620, at: 4.4 }] }),
  { ...fullScene({ id: 'newyork', art: 'assets/story/newyork.webp', dur: 6, alt: 'The New York skyline at dusk, their next home',
    caption: ['Next stop,', 'New York'] }), optional: true },
];
