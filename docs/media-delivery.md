# Current-site media delivery

The approved rollout covers the 117 images referenced by current site content, not the full Ghost archive. PNG artwork uses quality-90 WebP; transparent PNGs use exact lossless WebP. Existing JPEG/WebP, animation and favicon assets are retained, and conversions larger than their source are discarded. Original files remain untouched.

The delivery set is 52.19 MiB instead of 202.47 MiB, a 74.2% reduction. The animated `jrpgart-logo.gif` accounts for 11.74 MiB and remains unchanged. Responsive WebP candidates are generated at 320, 640, 960, 1280 and 1920 pixels wide, only below each original width and only when smaller than its full-size delivery file. Animated assets remain unchanged.

## Cloudflare setup before deployment

Set the **build environment variable** `MEDIA_BASE_URL` to:

```
https://pub-e4d8121a5e7c42d98f03214fb5ed9720.r2.dev
```

This is a public address and does not need encryption. The existing build/deploy commands remain `pnpm build` and `npx wrangler deploy`. The build uses the tracked manifest to rewrite image references, including feeds and lightbox links, and excludes image copies from the site artifact. A fresh checkout can build with this variable without restoring local source images.

Use the R2 development URL for this test. Before public launch, connect a custom media domain and change the same build variable; the development endpoint has rate limits and is not intended for production. No R2 credentials belong in the site build.

## Updating media

1. Restore/add the original images under their existing `public/assets/images/` paths locally, preserving the separate backup.
2. With Python and Pillow supporting WebP, run `python3 scripts/prepare-media.py`. This generates ignored `.media-delivery/` files and updates `docs/media-delivery-manifest.json`. The manifest records source/delivery paths, checksums, dimensions, settings and usages.
3. Run `node scripts/upload-media.mjs` to inspect the upload plan, then `node scripts/upload-media.mjs --apply` to upload. The uploader uses the local AWS CLI profile `leota-r2`, validates each checksum, uploads only manifest objects, and never deletes bucket objects.
4. Commit content, code and manifest changes after validating the build. Keep bulk originals and `.media-delivery/` outside Git. Upload before deploying references to newly added files.

Objects use a one-hour cache policy because their names are stable rather than content-addressed. Updated objects may take that long to refresh in clients. Preparation checks source integrity and verifies output decoding, dimensions, and exact transparent-image pixels. The build rejects newly referenced media absent from the manifest.

## Local previews and validation

`pnpm dev` serves original local images. For optimized local delivery, prepare media, leave `MEDIA_BASE_URL` unset, run `pnpm build`, then `pnpm preview`. The local build validates checksums and includes only manifest delivery files. For an R2 preview, set `MEDIA_BASE_URL` during the build instead.

Both local and R2 builds passed with 42 pages. Generated references and XML feeds were checked; all uploaded object names and sizes matched the manifest, and six representative public downloads matched SHA-256 checksums. The quality decision is documented in [media-optimization-pilot.md](media-optimization-pilot.md).


## Responsive images

The preparation manifest includes each smaller candidate's path, checksum, byte count and dimensions. The build adds native `srcset` to matching HTML images while preserving `src`, full-size anchors, downloads, captions and existing dimensions. Lazy images use `sizes="auto"` with a viewport fallback; the browser selects for the rendered layout and display density. Eager hero images use the viewport width. Existing hand-authored `srcset`/`sizes` are preserved. Feeds and social image metadata retain full-size URLs. CSS background images remain full-size.

For a rollout that only adds responsive files, `node scripts/upload-media.mjs --variants-only --apply` uploads candidates without replacing the existing full-size objects. Normal uploads include both. After either local or R2 builds, run `node scripts/tests/responsive-media.mjs` with the same `MEDIA_BASE_URL` setting as the build to validate candidates and full-size links.

Native sizing reference: [MDN image sizes](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/sizes). The new files add storage; they reduce bytes downloaded per image rather than shrinking the entire bucket.

For subsequent content migrations, `--changed-since /path/to/previous-manifest.json` uploads only delivery paths whose checksums differ from that previous manifest. Save the baseline before preparing media; this option assumes that baseline was already uploaded. All local files are still validated.

## PDF downloads

Referenced PDF files under `public/assets/files/` are preserved byte-for-byte, inventoried and uploaded alongside images. They receive `application/pdf` and attachment headers on R2. The build rewrites their links with `MEDIA_BASE_URL`; remote builds exclude bundled document copies, while local builds copy validated delivery files. Images retain their existing responsive behavior. Originals remain outside Git.
