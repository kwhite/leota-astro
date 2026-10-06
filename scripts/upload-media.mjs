// Upload exactly the manifest's validated delivery set. No bucket deletions.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'docs/media-delivery-manifest.json'), 'utf8'));
const endpoint = 'https://6aaee8d827f66c560264502c52a30782.r2.cloudflarestorage.com';
const types = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.ico': 'image/x-icon' };
const prepared = [];
for (const asset of manifest.assets) {
  const file = path.join(root, '.media-delivery', asset.delivery);
  const bytes = await fs.readFile(file);
  if (createHash('sha256').update(bytes).digest('hex') !== asset.deliverySha256) throw new Error(`Checksum mismatch: ${asset.delivery}`);
  prepared.push({ asset, file });
}
console.log(`Validated ${prepared.length} files, ${manifest.deliveryBytes} bytes for leota-media.`);
if (!process.argv.includes('--apply')) {
  console.log('Dry run only. Add --apply to upload.');
} else {
  let next = 0;
  let done = 0;
  let failure;
  async function worker() {
    while (next < prepared.length && !failure) {
      const { asset, file } = prepared[next++];
      const args = ['s3', 'cp', file, `s3://leota-media${asset.delivery}`, '--profile', 'leota-r2', '--endpoint-url', endpoint,
        '--content-type', types[path.extname(file)], '--cache-control', 'public,max-age=3600',
        '--metadata', `sha256=${asset.deliverySha256}`, '--only-show-errors', '--no-cli-pager'];
      try {
        await new Promise((resolve, reject) => {
          const child = spawn('aws', args, { stdio: ['ignore', 'ignore', 'pipe'] });
          let error = '';
          child.stderr.on('data', chunk => { error += chunk; });
          child.on('error', reject);
          child.on('close', code => code === 0 ? resolve() : reject(new Error(`${asset.delivery}: ${error}`)));
        });
        done++;
        if (done % 20 === 0 || done === prepared.length) console.log(`Uploaded ${done}/${prepared.length}`);
      } catch (error) { failure = error; }
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  if (failure) throw failure;
}
