// Builds the second link (invite/index.html): the same page without the Mayra event.
// Blocks wrapped in <!--only:full-->…<!--/only:full--> exist only on the full invite.
// Run `npm run build` (stamp + variants) before committing; a test fails if it is stale.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { VARIANTS } from '../js/config.js';

export function buildVariantHtml(html, id) {
  const v = VARIANTS[id];
  if (!v || !v.dir) throw new Error(`no folder for variant "${id}"`);
  return html
    .replace(/<!--only:full-->[\s\S]*?<!--\/only:full-->\s*/g, '')
    .replace(/<!--signoff-->[\s\S]*?<!--\/signoff-->/, v.signoff ?? '$&')
    .replace('<html lang="en">', `<html lang="en" data-variant="${id}">`)
    .replace(/(src|href|poster)="(css|js|assets)\//g, '$1="../$2/')
    .replace(/(og:url" content="[^"]*ayush-weds-mahima\/)"/, `$1${v.dir}/"`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = new URL('../', import.meta.url);
  const html = readFileSync(new URL('index.html', root), 'utf8');
  for (const [id, v] of Object.entries(VARIANTS)) {
    if (!v.dir) continue;
    mkdirSync(new URL(`${v.dir}/`, root), { recursive: true });
    writeFileSync(new URL(`${v.dir}/index.html`, root), buildVariantHtml(html, id));
    console.log(`${v.dir}/index.html built (${id})`);
  }
}
