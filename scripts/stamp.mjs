// Cache-busting without a build step: every css/js file feeds one hash, and index.html links
// css + main.js as ?v=<hash>. Run `npm run stamp` before committing (a test fails if it is stale).
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);

export function assetVersion() {
  const h = createHash('sha1');
  for (const dir of ['css', 'js']) {
    for (const f of readdirSync(new URL(`${dir}/`, root)).filter(n => /\.(css|js)$/.test(n)).sort()) {
      h.update(`${dir}/${f}\n`).update(readFileSync(new URL(`${dir}/${f}`, root)));
    }
  }
  return h.digest('hex').slice(0, 8);
}

export function stamp(html, v) {
  return html.replace(/((?:css\/[\w-]+\.css|js\/main\.js))(\?v=\w+)?/g, `$1?v=${v}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = new URL('index.html', root);
  const v = assetVersion();
  writeFileSync(file, stamp(readFileSync(file, 'utf8'), v));
  console.log(`index.html stamped ?v=${v}`);
}
