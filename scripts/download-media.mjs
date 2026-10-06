// Optional offline cache: optimized public delivery files only; no credentials.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'docs/media-delivery-manifest.json'), 'utf8'));
const base = (process.env.MEDIA_BASE_URL || manifest.publicDevelopmentUrl).replace(/\/$/, '');
if (new URL(base).protocol !== 'https:') throw new Error('Media URL must use HTTPS');
const files = manifest.assets.flatMap(a => [a, ...(a.variants || [])]);
const hash = b => createHash('sha256').update(b).digest('hex');
let downloaded = 0, reused = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (files.length) {
    const asset = files.shift();
    const dest = path.join(root, '.media-delivery', asset.delivery);
    try {
      if (hash(await fs.readFile(dest)) === asset.deliverySha256) { reused++; continue; }
    } catch {}
    const response = await fetch(base + asset.delivery, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`Download failed (${response.status}): ${asset.delivery}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (hash(bytes) !== asset.deliverySha256) throw new Error(`Checksum mismatch: ${asset.delivery}`);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, bytes);
    downloaded++;
  }
}));
console.log(`Offline media ready: ${downloaded} downloaded, ${reused} already cached.`);
