# Painted art for the story and venue map

The story currently uses the painted panels from your inspiration image, shown as framed cards. Full-height paintings would look much better on a phone. Generate the images below in the same tool and style as your inspiration image, then drop the files in `assets/story/` (any name is fine; tell Claude which is which and it will convert them to WebP, register them in `assets/story/manifest.json`, and they replace the cards automatically).

## Settings for every image
- **Portrait, 2:3** (for example 1024×1536 or larger). Phones show it full-screen.
- **No text, no logos, no watermarks.** Captions are added by the website.
- Leave the **top 20% calm** (sky, soft background) because captions sit there.
- Attach your inspiration image as the style reference, plus 1–2 real photos of you both for faces and clothes.
- Consistent characters: **Ayush**, short black hair, slim build, casual (hoodie or light shirt). **Mahima**, long dark wavy hair, small pink hair clip.

## Style anchor (paste at the start of every prompt)
> Soft anime-inspired digital painting with gentle watercolour texture, warm golden-hour light, cream, blush, peach and gold palette, romantic and cinematic, painterly background, subtle film grain, vertical 2:3 composition, no text.

## Scene prompts (file name → prompt)
1. **met.webp**: two teenagers in school uniform with backpacks walking home side by side on a tree-lined city street at sunset, seen from behind and slightly from the side, lamp posts just turning on, he glances at her, shy and sweet.
2. **grew.webp**: the same two, now young adults, sitting close on a rooftop edge or campus steps at dusk, city lights coming on behind them, looking at each other and smiling, a paper cup of coffee between them.
3. **apart.webp**: an airport window at golden hour with a plane taxiing outside; her reflection and silhouette on the left, a second window on the right showing him looking out at a different skyline; a dotted flight path arcing between the two windows.
4. **sfnashik.webp** (optional extra scene): top half San Francisco, a foggy bay with a red suspension bridge, Ayush at a laptop in a cosy window; bottom half Nashik, the Godavari ghat with a stone temple and grape vines, Mahima in a white dental coat smiling. A soft painted dividing cloud between the halves.
5. **flight.webp** (optional): a watercolour globe seen from above the clouds, a plane crossing from India to North America along a dotted line, warm sunrise colours.
6. **distance.webp**: the couple from behind on a hilltop at sunset, her head resting on his shoulder, soft hills and a glowing sun.
7. **together.webp**: close-up of their hands held together, her hand with henna and red-and-gold bangles, his wrist in a dark suit sleeve, warm bokeh of marigold lights behind.
8. **newyork.webp** (optional): the New York skyline at dusk from a rooftop, a yellow taxi on the street far below, the couple small in the foreground holding coffee, hopeful and cosy.

## Venue map
Generate one painterly illustrated map of **The Democracy Hotel, Nashik** (no real floor plan, so invent a pleasing layout). **Portrait 3:4, no text.**
> Illustrated top-down 3/4 view map of a luxury hotel and gardens in Nashik, India, soft watercolour anime-inspired painting, cream paper background, warm golden light. Include: a grand gate and entrance driveway at the bottom; a stone hall called "Ganga Ghat Hall" with a small dome; a green lawn with a turquoise swimming pool ("Poolside Lawn"); a large modern convention building ("Congruence Convention Hall") with fairy lights; a semicircular stone amphitheatre with a flower mandap in the centre ("Ganga Ghat Amphitheater"); winding garden paths, trees, marigold garlands, the Godavari river along the top edge. No text or labels.

Send the picture back and the five spots become tappable areas on it.

## After you generate
Tell Claude the file names. It will resize them, register them in the manifest, check each scene on a phone, and publish.
