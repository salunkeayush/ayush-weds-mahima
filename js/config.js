import { mapsSearchUrl } from './maps.js';

export const COUPLE = { groom: 'Ayush Salunke', bride: 'Mahima Malani', hashtag: '#AyushMahnbhava' };


const ADDRESS = 'The Democracy Hotel, Ashoknagar, Satpur Colony, Nashik, Maharashtra 422007, India';
export const VENUE = {
  name: 'The Democracy Hotel',
  address: ADDRESS,
  mapsUrl: mapsSearchUrl(ADDRESS),
};

export const EVENTS = [
  { id: 'mayra', startISO: '2026-12-11T10:00:00+05:30', name: 'Mayra', date: 'Friday, 11th December', dateISO: '2026-12-11', time: '10:00 AM',
    spot: 'Ganga Ghat Hall', spotId: 'ganga-ghat-hall',
    dressCode: 'Women in bandhej / ghatchola saree or lehenga. Men in Nehru jacket / kurta.', palette: [],
    blurb: 'Pihar ri Pehchan' },
  { id: 'haldi', startISO: '2026-12-11T15:00:00+05:30', name: 'Haldi', date: 'Friday, 11th December', dateISO: '2026-12-11', time: '3:00 PM',
    spot: 'Poolside Lawn', spotId: 'poolside-lawn',
    dressCode: 'Breezy & comfortable festive outfits.',
    palette: ['#F26B1D', '#F58A1F', '#F7A41D', '#F9BF3B', '#FBD85D'], paletteName: 'Sundowner',
    blurb: 'Turmeric, laughter and marigolds' },
  { id: 'sangeet', startISO: '2026-12-11T19:30:00+05:30', name: 'Sangeet', date: 'Friday, 11th December', dateISO: '2026-12-11', time: '7:30 PM',
    spot: 'Congruence Convention Hall', spotId: 'congruence-hall',
    dressCode: 'Glam, sparkle & shine (Indo-western & party outfits).', palette: [],
    blurb: 'A night of music and dance' },
  { id: 'reception', startISO: '2026-12-12T11:00:00+05:30', name: 'Baarat Swaagat & Reception', date: 'Saturday, 12th December', dateISO: '2026-12-12',
    time: '11:00 AM', spot: 'Congruence Convention Hall', spotId: 'congruence-hall',
    dressCode: 'Royal Indian attire (timeless saris, elegant lehengas, classic sherwanis).',
    palette: ['#E8DDE0', '#D5E3D3', '#E5C7D2', '#A8D1B5', '#B79ACB', '#7FA7D9', '#5F7F68'], paletteName: 'Pastel & Pearl',
    blurb: 'The baarat arrives, the celebration begins' },
  { id: 'phere', startISO: '2026-12-12T16:00:00+05:30', name: 'Phere & Saptapati', date: 'Saturday, 12th December', dateISO: '2026-12-12',
    time: '4:00 PM', spot: 'Ganga Ghat Amphitheater', spotId: 'ganga-ghat-amphitheater',
    dressCode: 'Indian traditional (lehenga, sharara, saree, anarkali, kurta).', palette: [],
    blurb: 'Seven steps, seven promises' },
];

// Links: the full invite (site root) and an invite without Mayra (its own folder, built by `npm run build`).
export const VARIANTS = {
  full: { dir: '', exclude: [] },
  'core': { dir: 'invite', exclude: ['mayra'], signoff: 'Salunke <i>&amp;</i> Malani Family' },
};
const variantOf = id => VARIANTS[id] || VARIANTS.full;
export const eventsFor = id => EVENTS.filter(e => !variantOf(id).exclude.includes(e.id));
export const countdownTargetFor = id => eventsFor(id)[0].startISO;
export const COUNTDOWN_TARGET = countdownTargetFor('full');

export const BAARAT_ARRIVAL = { name: 'Baarat Swaagat', spot: 'Hotel Entrance', spotId: 'entrance' };

export const RSVP = {
  // Paste the Apps Script web-app URL here (see docs/RSVP-SETUP.md) to switch on the themed form.
  // Until then the real Google Form is embedded.
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzu5O3wcFh3W9VvxJ7s8mSpP-Q50frvvm1jdQOXOzih-Zazgr-084OdXnUHc917x4qObw/exec',
  EMBED_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfdQ35mvheMZq7Uo9OSvlXBrfrx41Fied0GejkiC5ro1qRNiw/viewform?embedded=true',
  FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfdQ35mvheMZq7Uo9OSvlXBrfrx41Fied0GejkiC5ro1qRNiw/viewform',
};
