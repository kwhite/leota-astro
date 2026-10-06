// Exercise built output in local and remote modes; run after pnpm build.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const manifest = JSON.parse(await fs.readFile('docs/media-delivery-manifest.json', 'utf8'));
const remote = process.env.MEDIA_MODE === 'local' ? '' : (process.env.MEDIA_BASE_URL || manifest.publicDevelopmentUrl).replace(/\/$/, '');
const files = manifest.assets.flatMap(a => [a, ...(a.variants || [])]);
const expected = new Map(files.map(a => [remote + a.delivery, a]));
let responsive = 0;
let fullSizeLinks = 0;
async function check(folder) {
  for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await check(file);
    else if (entry.name.endsWith('.html')) {
      const html = await fs.readFile(file, 'utf8');
      for (const tag of html.match(/<img\b[^>]*>/g) || []) {
        const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1];
        if (!srcset) continue;
        responsive++;
        const widths = [];
        for (const candidate of srcset.split(', ')) {
          const [url, descriptor] = candidate.split(' ');
          const asset = expected.get(url);
          assert.ok(asset, `Unknown candidate ${url}`);
          assert.equal(descriptor, `${asset.dimensions[0]}w`);
          widths.push(asset.dimensions[0]);
        }
        assert.equal(new Set(widths).size, widths.length);
        assert.deepEqual(widths, [...widths].sort((a, b) => a - b));
        assert.match(tag, /\ssizes="/);
        if (/sizes="auto,/.test(tag)) assert.match(tag, /loading="lazy"/);
      }
      for (const href of html.matchAll(/\shref="([^"]+)"/g)) {
        if (expected.has(href[1])) {
          assert.ok(!/\.w\d+\.webp$/.test(href[1]), 'Lightbox/download links must retain full size');
          fullSizeLinks++;
        }
      }
    }
  }
}
await check('dist');
assert.ok(responsive > 100, 'Expected coverage across content, galleries and cards');
assert.ok(fullSizeLinks > 50);
for (const asset of files) {
  const bytes = await fs.readFile(path.join('.media-delivery', asset.delivery));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), asset.deliverySha256);
  if (!remote) assert.deepEqual(await fs.readFile(path.join('dist', asset.delivery)), bytes);
}
if (remote) await assert.rejects(fs.access('dist/assets/images'));
console.log(`Verified ${responsive} responsive images, ${fullSizeLinks} full-size links, ${files.length} delivery checksums (${remote ? 'R2' : 'local'} mode).`);
