# Image optimization in the migration workflow

Status: current-site rollout implemented locally on 2026-10-05; see `media-delivery.md` and `media-delivery-manifest.json`. Archive migration and responsive variants remain planned. Originally added after checkpoint `4f512c7` on 2026-10-04.

## Outcome

Replace manual one-at-a-time Squoosh processing with a repeatable migration step that converts existing PNGs to optimized WebPs, updates references across the publication, and reports performance/storage savings. Ultimately, the deployed site should contain only required delivery assets, not both converted images and their superseded source PNGs. Archival originals remain preserved separately.

## Workflow

1. **Inventory and dry run.** Enumerate PNGs and their use in post/page bodies, summaries/excerpts where they contain media, covers, tag/author metadata, branding, CSS, HTML, `srcset`, gallery/lightbox links, and social metadata. Separate local and remote references. Detect missing files, existing WebP name collisions, duplicate content, transparency, animation, and orientation requirements. Use the prototype media manifest as a starting point, not a complete archive inventory.
2. **Prototype pilot.** Process representative photography, illustrations, transparent graphics, and text-heavy images. Compare visual quality and byte savings before choosing lossy/lossless settings. Default target is WebP; report cases where conversion increases size, degrades required detail, or cannot preserve behavior. Resolve exceptions deliberately rather than silently skipping files or replacing a better existing WebP.
3. **Repeatable conversion.** Preserve dated directories and use an explicit source-to-output mapping. Record source checksum, converter/settings, output checksums, dimensions and byte sizes. Cache/skip unchanged work. Write into a separate output area without overwriting backup originals. Choose tooling during implementation; no package or new image service has been selected.
4. **Responsive delivery.** Generate a small set of justified widths for cards, mobile views, and large gallery viewing. Avoid multiplying every image into unnecessary variants. Preserve aspect ratios, transparency, orientation, captions, alternative text, and gallery sequence. Include dimensions and appropriate responsive references in rendered markup where useful while keeping content portable.
5. **Reference updates.** Use the mapping to update structured metadata and parsed content references, including Markdown images, HTML images, `srcset`, CSS and direct gallery links. Do not perform a blind global `.png` string replacement. Holistic coverage means updating actual media references, not rewriting prose summaries. Change the viewer's “Open original” label to reflect a large optimized image when it no longer points at the source file.
6. **Validation and report.** Check all rewritten references resolve, transformed assets decode, expected dimensions/semantics are preserved, and no accidental collisions or broken links occur. Build and inspect representative desktop/mobile pages, cards, galleries and social images. Report source bytes, deployed output bytes including variants, transfer-size examples, conversion savings, retained exceptions, missing files, and unsupported cases.
7. **Roll out with migration.** Apply the reviewed settings/mapping to the archive with a dry-run report and resumable processing. Keep original source data intact so the conversion can be rerun. Bulk media remains outside ordinary Git; source/configuration/manifests can be committed.

## Deployment and storage lifecycle

- Keep source originals in the existing independent backup or a separately chosen archive location. Do not deploy that archive or place archival duplicates under Astro's public directory.
- Build/upload from a manifest of required optimized assets and approved exceptions. A Git ignore rule alone does not stop Astro from copying public files or stop an uploader from transferring them.
- After reference validation, exclude replaced PNGs and unused variants from the deployment artifact. Any intentionally retained PNG exception must be documented; it is not an extra source copy alongside an equivalent WebP.
- For an existing deployment, compare the new delivery manifest with deployed objects. Produce a specific removal list for superseded images; carry out cleanup as part of the separately scoped deployment stage after backup and link checks. Do not delete local backup originals.
- Audit legacy external image URLs. Where compatibility matters, plan redirects to optimized replacements rather than retaining duplicate source objects. Redirect implementation belongs to the later S3/CloudFront deployment design.
- Reconcile build artifacts, previously uploaded objects, and any storage retained through object versioning when measuring actual storage savings. CDN invalidation/expiry is a deployment concern, not an image-conversion step.

## Acceptance criteria

- All in-scope PNGs have a conversion result or an explicit exception.
- Publication references point to validated delivery assets; large gallery links remain functional.
- Visual quality is reviewed on the pilot before full-archive processing.
- Deployment artifacts exclude superseded source PNGs and unnecessary variants; any already-deployed cleanup is accounted for separately.
- Original backup remains intact, and the conversion is reproducible from its manifest/settings.
- Report measures total delivery storage as well as individual image savings.

No images, content references, dependencies, or deployed objects were changed when this plan was added.
