import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export default function mediaDelivery() {
  return {
    name: 'leota-media-delivery',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const manifest = JSON.parse(await fs.readFile(path.join(root, 'docs/media-delivery-manifest.json'), 'utf8'));
        const output = fileURLToPath(dir);
        const remote = process.env.MEDIA_BASE_URL?.replace(/\/$/, '');
        if (remote && new URL(remote).protocol !== 'https:') throw new Error('MEDIA_BASE_URL must use HTTPS.');
        const knownSources = new Set(manifest.assets.map(asset => asset.source));
        async function checkSources(folder) {
          for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
            const file = path.join(folder, entry.name);
            if (entry.isDirectory()) await checkSources(file);
            else if (/\.(md|mdx|json|ts|astro|css)$/.test(entry.name)) {
              const source = await fs.readFile(file, 'utf8');
              const refs = source.match(/\/?assets\/images\/[^\s"'<>\)\}\]]+\.(?:png|jpe?g|webp|gif|ico|svg)/g) || [];
              for (const ref of refs) {
                if (!knownSources.has(`/${ref.replace(/^\//, '')}`)) throw new Error(`Media manifest missing ${ref}; run scripts/prepare-media.py and upload the delivery files before publishing.`);
              }
            }
          }
        }
        await checkSources(path.join(root, 'src'));
        // Validate the complete local delivery set before changing build output.
        const files = new Map();
        if (!remote) {
          for (const asset of manifest.assets.flatMap(asset => [asset, ...(asset.variants || [])])) {
            const bytes = await fs.readFile(path.join(root, '.media-delivery', asset.delivery));
            if (hash(bytes) !== asset.deliverySha256) throw new Error(`Delivery checksum mismatch: ${asset.delivery}; rerun prepare-media.py.`);
            files.set(asset.delivery, bytes);
          }
        }
        const site = process.env.SITE_URL || 'https://herebedragons.club';
        const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const mappings = manifest.assets.map(asset => ({
          pattern: new RegExp(`(?:${escape(site)})?${escape(asset.source)}(?=[\\s"'<>?#&)\\]\\},;\\\\]|$)`, 'g'),
          target: remote ? `${remote}${asset.delivery}` : asset.delivery,
        }));
        const images = new Map(manifest.assets.filter(asset => asset.variants?.length).map(asset => [asset.delivery, asset]));
        function responsiveImages(html) {
          return html.replace(/<img\b[^>]*>/gi, tag => {
            const src = tag.match(/\ssrc="([^"]+)"/i)?.[1];
            const prefix = remote || site;
            const source = src?.startsWith(prefix) ? src.slice(prefix.length) : src;
            const asset = images.get(source);
            if (!asset || /\ssrcset=/i.test(tag)) return tag;
            const url = delivery => `${remote || (src.startsWith(site) ? site : '')}${delivery}`;
            const candidates = [...asset.variants.map(v => `${url(v.delivery)} ${v.dimensions[0]}w`), `${url(asset.delivery)} ${asset.dimensions[0]}w`];
            const lazy = /\sloading="lazy"/i.test(tag);
            const fixedWidth = tag.match(/\swidth="(\d+)"/i)?.[1];
            const smallFixedImage = fixedWidth && Number(fixedWidth) <= 160;
            const sizes = lazy ? 'auto, (max-width: 700px) 100vw, 1200px'
              : smallFixedImage ? `${fixedWidth}px` : '100vw';
            let attributes = ` srcset="${candidates.join(', ')}"`;
            if (!/\ssizes=/i.test(tag)) attributes += ` sizes="${sizes}"`;
            if (!/\swidth=/i.test(tag) && !/\sheight=/i.test(tag)) attributes += ` width="${asset.dimensions[0]}" height="${asset.dimensions[1]}"`;
            return tag.replace(/\s*\/?>$/, '') + attributes + '>';
          });
        }
        async function rewrite(folder) {
          for (const entry of await fs.readdir(folder, { withFileTypes: true })) {
            const file = path.join(folder, entry.name);
            if (entry.isDirectory()) await rewrite(file);
            else if (/\.(html|xml|css|js|json)$/.test(entry.name)) {
              const original = await fs.readFile(file, 'utf8');
              let updated = original;
              for (const mapping of mappings) updated = updated.replace(mapping.pattern, match => !remote && match.startsWith(site) ? `${site}${mapping.target}` : mapping.target);
              if (entry.name.endsWith('.html')) updated = responsiveImages(updated);
              if (updated !== original) await fs.writeFile(file, updated);
            }
          }
        }
        await rewrite(output);
        // Astro copies all public images: exclude sources and unused archive files.
        await fs.rm(path.join(output, 'assets/images'), { recursive: true, force: true });
        for (const [url, bytes] of files) {
          const dest = path.join(output, url);
          await fs.mkdir(path.dirname(dest), { recursive: true });
          await fs.writeFile(dest, bytes);
        }
        console.log(`Media delivery: ${manifest.assets.length} assets; ${remote ? 'R2 URLs, no image copies in site artifact' : 'validated optimized local assets'}.`);
      },
    },
  };
}
