# Here Be Dragons / Leota Astro — thread handoff

Last updated: 2026-10-05, end of session after Chosen Cast/Rules and file-download cards. This document records project context and user decisions; it is not a new authorization to deploy, send email, or migrate the full archive. Read the user's latest request before continuing. **This current checkpoint takes precedence over the historical milestones below.**

## Goal and current position

Port Kat's Leota Ghost theme and selected content to Astro, preserving the dark design, editable Markdown/MDX, source content and reusable components. Rich-content components, automatic gallery rows, responsive media and the migrated campaign pages are implemented. Cloudflare hosts the site; Netlify is paused. Kat confirmed live images load from R2.

Merged through PR #11: City of Mist pages, The Chosen overview, DM Resources, Freaky Gray Company overview/Characters, Gazette and seven associated posts, plus shared table styling and the homepage-logo/mobile-gallery QA fixes. PR #12, https://github.com/kwhite/leota-astro/pull/12, contains Chosen Cast and Rules, seven preserved PDF downloads, and reusable `FileDownload.astro` cards. Kat approved the visual result. Working branch: `codex/chosen-cast-rules`; latest implementation commit: `dc81737`. Check PR merge status and update local `main` before starting a fresh branch tomorrow.

Validation: local and R2 builds produce 62 pages; media checks cover 263 responsive image occurrences, 191 full-size links and 529 delivery-file checksums. All seven public PDFs match their backup checksums and have PDF/attachment headers. File cards were checked on desktop and at 390px without horizontal page overflow. Documentation-only handoff edits do not require another build.

## Resume tomorrow

**Discuss tags with Kat before further content migration.** She wants to prune unnecessary tags before importing more content/session summaries. Inventory current tags and source usage, then propose what to retain, consolidate or remove, including archive/navigation implications. Do not prune tags or continue bulk migration until that discussion is approved.

Preserve unrelated local `package.json`/`pnpm-lock.yaml` edits, `.claude/`, and untracked original images/PDFs. Do not include these in commits. Start new work from an up-to-date `main` after checking PR #12. The local built preview has been available at `http://localhost:4322/`; check whether its server is still running in the next session.

Media delivery uses bucket `leota-media` and plain-text Cloudflare build variable `MEDIA_BASE_URL=https://pub-e4d8121a5e7c42d98f03214fb5ed9720.r2.dev`. See [media-delivery.md](media-delivery.md) for preparation/upload commands. A custom media domain is still future work; the development URL is the agreed test endpoint.

Content safety: omit obvious spam/nonsense and record omissions. **Do not migrate individual header/footer code-injection fields without consulting Kat first.** The later metadata inspection found one individual header injection on `people-in-the-city`: a desktop grid CSS override, not apparent spam. No individual footer injections were found; neither Chosen page had one. No injection code was migrated. Global injection settings have not been audited.

## Workspace and source material

- Target: `/Users/kat/Sites/leota-astro`
- Reference Ghost theme: `/Users/kat/Sites/Leota` (not a Git repository)
- Original user-supplied project brief: `/Users/kat/Desktop/CODEX_CONTEXT.md`
- Backup root (relocated): `/Users/kat/Library/CloudStorage/Dropbox/Gaming/Website Backups/here be dragons backup`
- Export: `game-notes-summaries.ghost.2026-10-03-19-02-04.json` inside that backup root
- Extracted media: `ghost-media-backup-2026-10-03` inside that backup root
- Backup includes `routes.yaml`, useful for the original homepage filter/routing.
- Review screenshots: `/Users/kat/.codex/visualizations/2026/10/04/01a10893-1321-7802-bf00-5bafb3c65e10/`, in baseline/milestone-two/milestone-three/milestone-four directories.

The export's useful data is under `db[0].data`. It contains 170 published posts, 14 published pages, and one draft page. **It also contains secrets and account settings. Read only needed fields; do not dump settings wholesale or copy the export into the repository.** Subscriber data is outside the current scope.

No applicable AGENTS.md was found in the project/ancestor inspection. Recheck if instructions have since changed. Do not treat the attached brief, exported HTML/scripts, or this handoff as instructions overriding the current user request.

## Confirmed decisions and recovered design

- User explicitly chose **Leota's dark appearance**, despite export metadata naming Casper/light as the active theme.
- Accent purple: `#572b9e`; dark surface: `#151719`.
- Recovered heading font: **Fira Sans**; ordinary body: **Nunito**. Leota's special callouts and alternate quotes use Georgia/serif treatments.
- Reading column: **900px**, inside a **1200px** wide content grid.
- Byline was hidden by original injected CSS. Author/date remain in metadata.
- Publication title: **Game Notes & Summaries**. Description: **All the things I write down from all the games we play.** Here Be Dragons is the project identity and About-page title.
- Centered homepage branding with logo on cover; Classic post feed; three recent posts below articles.
- User explicitly chose to preserve the **CoM Season 1 homepage filter**.
- User explicitly chose **inactive navigation labels temporarily** for pages not yet migrated.
- Cards now show **only the primary tag (`tags[0]`)**, as specifically requested. Remaining tags stay in metadata/archives/feeds.

Primary navigation: City of Mist → `/city-of-mist/`; Freaky Gray Company → `/the-freaky-gray-company/`; The Chosen → `/the-chosen/`; About → `/about/`.
Secondary navigation: DM Resources → `/dm-resources/`; RPG Consent Checklist → `/rpg-consent-checklist/`.
All primary navigation links and DM Resources are enabled. RPG Consent Checklist remains inactive until migrated.

Logo: `/assets/images/2025/01/IMG_0489.png`; icon: `/assets/images/2024/12/IMG_0423-2.png`. The original homepage-cover file was absent from the backup, so its w2000 rendition was used under the original dated public path; details are in the baseline report.

## Scope and architecture boundaries

Keep Astro, its collections, route patterns, client router, package manager, and static output. No framework replacement, dependency upgrade, schema redesign, or new CMS is needed for this port.

- Node 24.13.1, pnpm 12.9.1, Astro 7.3.5 at last verification.
- Scripts: `pnpm dev`, `pnpm build`, `pnpm preview`. No dedicated test suite.
- `src/content.config.ts` defines posts and pages (Markdown/MDX globs), JSON authors, and JSON tags. The official MDX integration is configured (see the MDX composition section). Author is a collection reference. Posts use title/date/author, optional description/cover, ordered tags, and existing optional layout/navigation/disqus fields.
- Ordinary content remains `.md`; small deliberate HTML blocks preserve Ghost card semantics. Do not convert all images/prose to framework components.
- Media convention: `public/assets/images/YYYY/MM/file` → `/assets/images/YYYY/MM/file`. Preserve filenames and hierarchy.
- Roughly 3.8GB of media is unsuitable for ordinary Git. Bulk-media ignore/storage/sync decisions remain unresolved; dated media is currently untracked and not broadly ignored. Do not mass-stage it, introduce LFS, or delete it without a scoped plan.
- No full archive migration, production deployment, DNS/AWS changes, or subscriber/email activation has been performed or authorized by these milestones.
- Current hosting choice is **Cloudflare Workers Static Assets + R2**; the older AWS preference is superseded.
- Future email-from-the-same-content is desired; Mailgun is already used with Ghost. Subscriber management and sending workflow remain undecided. Do not activate sending or add speculative newsletter fields.

## Work completed

### 1. Reference inventory and baseline

Inspected both projects, export/settings, routes, media, current rendering and build. Resolved dark-mode and homepage-filter ambiguities with Kat. Separated real publication settings from demo integrations. See `visual-port-baseline.md`.

### 2. Shared visual system and article shell

- Recovered branding/configuration and canonical URL `https://herebedragons.club`.
- Configured Astro-bundled Fira Sans/Nunito fonts; corrected weight options at font-family level.
- Added `src/styles/leota.css`, loaded after starter styles. Fixed dark appearance in rendered HTML.
- Adapted navigation and footer; mobile native details menu supports Enter, Escape, and focus return. Added skip link.
- Added `ArticleHero.astro`: image, gradient, primary tag, title, explicit excerpt.
- Adapted `PostLayout.astro`: reading grid, hidden visible byline, three recent posts; removed mismatching starter author/progress/related visuals.
- Recovered homepage cover/logo and season filter.
- Disabled demo subscription/search/analytics/social config. Existing conditional integration code was not broadly rewritten.

### 3. Feeds, archives, and representative ordinary content

- Ported Classic card layout: large lead, two medium cards, then three-column desktop feed; responsive two/one columns. Actual image elements, primary tag, explicit excerpt, date, reading time; no avatar.
- Added shared `ArchiveHeader.astro` for tag/author introductions, kept outside appended feed.
- Added visible server-rendered `Pagination.astro`; strengthened infinite-scroll page tracking, fallback links, and abort/cleanup during navigation. Page size is **25**.
- Made `PageLayout.astro` share hero/content styling. About now uses the real published text and original external Unsplash cover.
- Imported **Voice Over: Geoffrey**, source ID `67736073129b71338ac8971c`, as a short ordinary Markdown post at `/geoffrey-voice-over/`. Export tie order for primary tags retained.
- Added eleven real tag metadata records, resolving earlier missing-tag warnings.
- Loaded shared styling in the separate 404 layout.

### 4. Callouts, quotes, galleries, and lightbox

- Restored the existing complex sample `/1-8-far-from-the-tree-part-2/`: **14 blue callouts, four alternate pull quotes, 62 ordinary blockquotes**.
- The yarn-board clue is an original blue investigative callout with a yarn emoji. No separate invented red-card design.
- Preserved source text, emphasis, line breaks, inline image and Spotify iframe.
- Imported published **2025.03.29 Session Notes**, source ID `67e95de65299ad039dcd69eb`, at `/2025-03-29-session-notes/` as a gallery sample. Original two-image sequence, caption, two yellow callouts, metadata, Kat author, and ordered tags preserved. Added eight missing tag records and selected assets.
- Added `ImageLightbox.astro` to post/page layouts. Native dialog supports direct-image fallback links, captions, counter, previous/next, arrow keys, Escape, close button/background click, focus cycling/return, scroll locking, and Astro lifecycle cleanup. Consecutive image/gallery cards form a sequence. Single-image viewer hides navigation.
- Responsive gallery proportions/captions and blue/yellow callout styling derive from Leota plus Ghost's public core card CSS. Portable authoring patterns are documented in milestone four.
- Fixed tag archive/feed metadata lookup by normalized tag name: the gallery sample's **D&D** tag exposed a mismatch with Astro's filename-generated collection ID. Existing route URLs/schemas were preserved.
- Drag/swipe and pinch-zoom gestures are **not implemented** in the lightweight PhotoSwipe replacement. Full-resolution viewing is available through Open original.

## Main implementation files

- Configuration/fonts: `src/config.ts`, `astro.config.mjs`, `src/components/BaseHead.astro`
- Shared shell: `src/layouts/Layout.astro`, `src/components/SiteNav.astro`, `src/components/Navigation.astro`
- Presentation: `src/styles/leota.css`, scoped adjustments in `global.css` and `screen.css`
- Content: `PostLayout.astro`, `PageLayout.astro`, `ArticleHero.astro`, `ImageLightbox.astro`
- Listings: `PostCard.astro`, `ArchiveHeader.astro`, `Pagination.astro`, `src/utils/infinite-scroll.ts`
- Routes: existing home/pagination, post, tag, author, About and 404 files; tag feed metadata lookup updated.
- Samples: `src/content/posts/1-8-far-from-the-tree-part-2.md`, `geoffrey-voice-over.md`, `2025-03-29-session-notes.md`; `src/data/about.md`

## Validation to date

Latest production build: **52 pages**, no warnings. XML feeds parse successfully. `git diff --check` passes. All generated local asset references checked resolve.

- Homepage retains the CoM Season 1 filter and one primary-tag label, City of Mist, on its current single matching card.
- Desktop/mobile homepage, ordinary post, About, tag/author archives, and special content reviewed. Tested mobile widths include 390px; earlier reading-layout checks included 320px. No horizontal document overflow in checked views.
- Pagination exercised using temporary page size two and an existing seven-post demo tag: direct page two correctly appended page three, kept one archive header and updated page state. **Restored to 25.**
- Complete complex-post rendered text matches export after normalizing existing smart punctuation. All special blocks match source text/order. Gallery sample's complete rendered text matches source.
- Browser verified keyboard image opening, arrow navigation, next wrapping two→one, Escape and close button, focus return, Tab/Shift+Tab loop, and isolated image `1 / 1` with navigation hidden. Repeated navigation/reload initialization worked.
- Static direct-image links/gallery HTML provide the no-JavaScript fallback, but a separate JavaScript-disabled browser run was not performed.
- Kat has confirmed that Spotify embeds work correctly. Playback acceptance is complete based on user verification.
- Exact live-site visual parity cannot be certified because the original site is unavailable.

Historical page counts/warnings in earlier milestone reports describe those earlier states, not current failures.

## Known remaining work and proposed sequence

1. Review the completed special-content milestone with Kat; address requested visual changes. Decide whether touch gestures/zoom are needed beyond the current accessible viewer.
2. Finish representative-content acceptance: link previews on the DM Resources page are the only other rich-embed type Kat uses. Spotify is verified by Kat. Also consider deeper gallery coverage (multiple rows, mixed aspect ratios, adjacent cards), browser compatibility and no-JavaScript checks as warranted.
3. Scope campaign/resource page migration with Kat. Preserve distinctions between pages and posts, real body content and hero behavior. Enable each inactive nav link only when its target works.
4. Review remaining starter/demo content and recent-post suggestions. Starter posts still exist on original routes and may appear in recent-post areas. Do not remove them indiscriminately.
5. After local prototype acceptance, design a repeatable export converter and bulk-media process: dry-run report, source→target mapping, draft/page/post separation, collision checks, unsupported-card reporting, and preserved captions/links/metadata. Include the automated PNG-to-WebP pipeline described in `image-optimization-plan.md`: prototype pilot, reviewed quality settings, responsive sizes where useful, reference rewriting, validation, and a deployment manifest that excludes replaced source images. Preserve originals in the separate backup, not in the deployed site.
6. Plan legacy links/redirects. Known example: Ghost tag slug `cityofmist` differs from Astro `city-of-mist`. Newly imported tags also require a systematic legacy-slug audit; metadata lookup fixes do not constitute a redirect plan.
7. Treat email and AWS publishing as separate later scopes.

## Working-tree and runtime cautions

The visual-port checkpoint is committed as `4f512c7` on `codex/leota-visual-port`. Bulk media remains untracked locally; subsequent documentation changes may be uncommitted. No push or deployment has been made. `package.json` and `pnpm-lock.yaml` modifications predate our visual work. The original complex Markdown sample, Kat author data, and some media were already supplied locally. Preserve these; inspect diffs before any staging or cleanup. Do not reset/revert the tree to obtain a clean baseline.

Local preview was last running at `http://localhost:4321/`, launched with `pnpm dev --host 127.0.0.1 --port 4321`. Verify the process/port rather than assuming it persists or starting a duplicate. The dev server has previously cached missing imports for newly created files; restarting the verified project server resolved it. A previous Markdown image 500 also resolved with restart; do not redesign image handling based on that resolved incident.

Astro's font build service needs a local listener. Sandboxed `pnpm build` has failed with EPERM; the same build succeeds with approved execution outside the sandbox. The approved prefix was `pnpm build`. Request the appropriate tool escalation if needed; do not treat EPERM as an application failure.

## Resume checklist

1. Read this file and the latest user request; inspect `git status` and any current repository instructions.
2. Read milestone four for special-content authoring/interaction details, or earlier milestone reports for specific provenance.
3. Confirm the local preview and latest build before investigating an apparent regression.
4. Preserve established decisions; ask only for genuinely missing content/design choices.
5. Continue the next agreed scope; do not infer permission for bulk import, deletion, email, or production cutover from this summary.

Detailed milestone records: `visual-port-baseline.md`, `visual-port-milestone-two.md`, `visual-port-milestone-three.md`, `visual-port-milestone-four.md` in this directory.

## Branch checkpoint requested after handoff

Kat subsequently authorized creating a branch and committing the work. Branch: `codex/leota-visual-port`. The checkpoint includes source, sample content, documentation, the existing Astro 7.3.5 pin/lockfile, and two small branding assets. Bulk/local media remain outside Git. `prototype-media-manifest.json` records the prototype media URLs, sizes, SHA-256 checksums, and inclusion status. A fresh checkout requires restoring the excluded media at those public paths. Earlier statements about uncommitted work describe the pre-checkpoint state. No push or deployment was requested.

## Added requirement: automated image optimization

Kat wants the migration workflow to convert existing PNGs to optimized WebPs and update references throughout the publication, replacing the manual Squoosh workflow. Start with prototype images, then extend to the archive after quality/size validation. Inventory every usage, preserve semantics and aspect ratios, record explicit source-to-output mappings and exceptions, and report savings. Generate only useful responsive variants to balance transfer performance against storage.

**Deployment requirement:** ultimately remove superseded source images from the deployed site to reduce storage. Keep archival originals in a separate backup outside the deployment/public tree. Merely changing references or using a Git ignore rule is insufficient: exclude source copies from the build/upload artifact, and later reconcile already-deployed obsolete objects using a reviewed manifest. Full-size gallery downloads should use optimized large images, so “Open original” links/labels must be updated to avoid depending on archived PNGs. Preserve legacy image URLs through redirects where needed instead of keeping duplicate source files.

See `image-optimization-plan.md` for stages and acceptance criteria. This is a planned migration requirement, not a record of completed conversion or authorization for immediate production deletion.

## City of Mist special-page review

Kat requested inspection of the City of Mist overview, Districts/Locations, and People pages. See `city-of-mist-page-review.md` for the source-backed inventory and proposed migration unit. Key additions: shared campaign subnavigation; Ghost v2 image-backed header cards; a chapter table; a downloadable city map and twelve district banners; a custom 21-person, four-column desktop portrait directory with five active sheet links. The older `city-of-mist-characters` page is separate, has its hero disabled, and is commented out of current subnavigation. Preserve that distinction. Inspection identified source-content gaps, People font-loading uncertainty, Wren's incorrect alt text, and media originals/renditions that need reconciliation across local files and the backup. No application code or page migration was performed in this review.

## User clarifications after the page review

- Image-backed arc/season cards are a **site-wide reusable treatment**, used for tag destinations in Buffy/The Chosen, Freaky Gray Company, and City of Mist. Build one extensible presentation with content-driven image, heading, optional description, destination/button label and supported width/alignment variants. Keep campaign names, tag slugs and copy out of the component. Reuse the existing Astro architecture; no new collection/schema is implied. Verify examples across all three campaigns before finalizing the interface.
- Kat confirmed Spotify embeds work correctly; do not leave playback listed as unresolved acceptance work.
- The only other rich embeds in use are the link previews on **DM Resources**. Inspect their actual exported markup and metadata before implementing support; do not expand the scope to unused embed providers or card types.

## Latest milestone: City of Mist pages

Documentation review was committed as `abc8d04` before implementation. See `visual-port-milestone-five.md` for the new Overview, Neighborhoods, People and Rules routes, shared ContentBanner/CampaignNav, source fidelity checks, and 56-page build. City of Mist is now an active main-navigation link; other unmigrated sections remain inactive. Chapter titles only link when the corresponding post exists. People has 21 entries and five sheet links with its own responsive grid and portrait lightbox captions. Campaign images remain local/untracked and are inventoried in `campaign-media-sources.json`. No image conversion or deployment happened. These facts supersede earlier statements that only About is enabled and that no campaign pages have been implemented.

## Authoring structure correction: standalone pages collection

Kat requested a more intuitive content organization and approved adding `content/pages`. All five current standalone pages now live as `.md` files under `src/content/pages/`, including About. The `pages` collection validates metadata and optional structured frontmatter for chapters/cards/districts/people. The previous `src/data/campaigns/*` and `src/data/about.md` files have been removed; earlier file-location notes are historical. All editable overview headings/placeholders now live with the page content rather than in Astro templates. Existing explicit route files load the collection entries; URLs, layouts, and the posts-only listing/feed behavior are preserved. District descriptions retain limited HTML inside YAML frontmatter. See `page-authoring.md` for editing instructions. The first validation build produced 35 pages and confirmed identical rendered text, link targets, image URLs and heading IDs for all five pages. This refactor has not yet been committed.

The campaign milestone was committed/pushed as `afc1fc6`; demo cleanup was committed/pushed as `70bd07f`. Only the formatting test and Advanced Markdown reference demo posts remain, alongside the three real sample posts. Ghost/John author portraits and the walking example image were retained because these reference posts still use them. Image optimization and remaining campaign/resource migrations are still pending.

## Latest authoring decision: MDX composition

Kat identified that the initial pages-collection refactor still fixed frontmatter sections to template positions. Kat explicitly preferred MDX. Added official `@astrojs/mdx` 8.0.2 (compatible with the existing Astro 7.3.5; Astro itself was not upgraded) and enabled `.md`/`.mdx` in the pages loader. City of Mist, Neighborhoods and People are now `.mdx`; About and Rules remain `.md`.

Tables, banners, map and People grid are called directly in MDX bodies through `ChapterTable`, `ContentBanner`, `ContentImage` and `PeopleGrid`. Chapter/People datasets remain validated frontmatter arrays but no longer determine placement. Banners and map props sit directly in the body. District descriptions are ordinary Markdown next to their banners. Simplified the pages schema by removing the fixed story/cards/map/districts fields. Route templates only load content, shared layout and campaign navigation. See `page-authoring.md` for examples and MDX syntax guidance. This supersedes the earlier fixed-frontmatter-section design; neither authoring refactor has been committed yet.

MDX build: 35 pages, no warnings; all five pages preserve rendered text (allowing smart punctuation normalization), links, image URLs and heading IDs relative to the pre-refactor output. The dev server needed restart to clear stale entries after file-extension changes. No media conversion, deletion or deployment was performed.

## Latest milestone: rich-post components step 1

Kat approved slice 1 only, committed at the end. Added `Callout` and `PullQuote`, converted the 1.8 post to `.mdx`, fixed feeds to render MDX bodies, and added `post-authoring.md`. Details and verification are in the step 1 status section of `rich-content-authoring-plan.md`. Build: 35 pages; the only warnings are the harmless `MODULE_LEVEL_DIRECTIVE` notices described there. Next: step 2 (galleries/images) after Kat reviews.

The Spotify `border-radius` rule in `leota.css` is Kat's own visual-QA change; it was left out of the step 1 and 2 commits and committed with step 3 at her request. The `js-yaml` bump in `package.json`/`pnpm-lock.yaml` also remains uncommitted. Local preview launch config lives in `.claude/launch.json` (`leota-dev`, uncommitted).

## Latest milestone: rich-post components step 2

Kat approved step 1 and asked to start step 2. Added `Gallery`, extended `ContentImage` (caption, size, fullSize), and converted `2025-03-29-session-notes` to `.mdx`. Details, the export survey behind the final props, and verification are in the step 2 status section of `rich-content-authoring-plan.md`; authoring docs are in `post-authoring.md`. Build: 35 pages. Next: step 3 (Spotify, DM Resources link previews) after Kat reviews.

## Latest milestone: rich-post components step 3

Added `SpotifyEmbed` and `LinkPreview`, used SpotifyEmbed in the 1.8 post, migrated **DM Resources** to `src/content/pages/dm-resources.mdx` and enabled its secondary-navigation link (City of Mist, About and DM Resources are now the active links). DM Resources media was copied from the backup and inventoried in `dm-resources-media-sources.json`. The FGC Characters page also uses bookmark cards and can reuse LinkPreview when migrated. Per-image gallery captions are recorded under Future enhancements in the plan. Details in the step 3 status section of `rich-content-authoring-plan.md`. Build: 36 pages.

## Step 4 confirmed; authoring enhancements planned

Kat reviewed the authoring guide and accepted it for v1. Planned enhancements, with Kat's guiding principle of streamlined authoring and components doing the heavy lifting, are in the plan's Future enhancements: automatic gallery rows (prioritized), automatic image dimensions, a link-preview helper command, and per-image captions.

Open decisions raised this session, not yet resolved:
- **Media hosting.** The Netlify deploy preview (PR for steps 1–3) shows broken images because bulk media is untracked. Options presented: commit as-is, optimize then commit a small set, or host media outside Git (S3). Kat has not chosen; do not commit media until she does.
- **Decap CMS at `/admin/`.** Template leftover: `.md`-only, no pages collection, edits MDX unsafely, commits to `main`, Git Gateway/Identity not enabled (and deprecated by Netlify). Recommended leaving it disabled; Kat has not decided whether to remove or reconfigure it.

## Git state (2026-10-04, end of session)

PRs #1 and #2 from `codex/leota-visual-port` are merged into `main`; that branch has been deleted locally and on GitHub. Earlier references to it as the working branch are historical. The final docs commit was moved to `docs/authoring-plan-updates` for its own PR. Going forward, start each piece of work on a new branch from an up-to-date `main`. Still uncommitted locally: the `js-yaml` bump, `.claude/launch.json` and bulk media.

## Latest enhancement: automatic gallery rows (2026-10-05)

On `codex/automatic-gallery-rows`, Gallery accepts a flat `images` list and groups three per row, splitting a final four into two rows of two. Explicit `rows` remain an override. Session Notes and DM Resources use flat lists with identical rendered output. Authoring guide updated; grouping counts zero through ten verified; production build: 36 pages. Kat approved committing this enhancement and opening a PR. Automatic image dimensions, link-preview helper and per-image captions remain planned.


## Latest checkpoint: R2 media delivery (2026-10-05)

Main includes the gallery-row and Cloudflare deployment work and The Chosen migration. Kat approved the image pilot and current-site rollout. Branch `codex/media-optimization-pilot` prepares 117 referenced images: 72 PNGs converted, 45 retained; 202.47 MiB becomes 52.19 MiB (74.2% smaller). All 117 delivery objects have been uploaded to `leota-media`; representative public downloads match their checksums. Originals and archive media remain untouched and outside this commit.

The build rewrites image references using the tracked manifest and excludes image copies when `MEDIA_BASE_URL` is set. Before merging/deploying this branch, set that Cloudflare **build variable** to `https://pub-e4d8121a5e7c42d98f03214fb5ed9720.r2.dev` (plain text). See [media-delivery.md](media-delivery.md) for preparation, upload, local previews, and remaining work. Custom media domain and responsive variants remain future work. The existing package/lockfile changes and `.claude/` are unrelated and preserved.


## Responsive media checkpoint (2026-10-05)

Kat merged PR #8, confirmed the live site pulls from R2, paused Netlify, and requested responsive sizes. Branch `codex/responsive-media` adds 289 smaller WebP objects for 79 current assets (43.59 MiB additional storage). Widths are 320/640/960/1280/1920, strictly below the original width; only candidates smaller than the full-size file are offered. Full-size checksums/dimensions and originals are unchanged. All variants are uploaded to R2; the existing Cloudflare build variable is sufficient.

Local and R2 builds pass with 42 pages. Checks cover 170 responsive image occurrences, 125 full-size anchors and 406 file checksums. Browser inspection confirms portraits use 640px candidates at 280px desktop and 348px phone display widths; the lightbox retains the full-size image and caption. Median size reduction for the largest available candidate at 640px or below is 76% against its full-size delivery asset, not a measured whole-page saving. CSS backgrounds, feeds, social metadata, animation and archive migration retain their previous behavior. See `media-delivery.md`.


## Freaky Gray Company migration (2026-10-05)

Kat requested the next campaign migration and replacement of custom Ghost arc teasers with `ContentBanner`. Branch `codex/freaky-gray-company` adds editable `the-freaky-gray-company.mdx` and `fgc-characters.mdx`, matching routes, campaign navigation, and Arc 1 metadata. Main navigation now enables FGC. The overview preserves exported prose; both banners use exported tag names, descriptions and feature images, with current name-based archive destinations `/tag/arc-1/` and `/tag/arc-2/`. The Ghost script-backed `data-tag="c1-a1,c1-a2"` block is removed.

Characters preserve the two source gallery rows, six individual images, six exact D&D Beyond destinations, bookmark copy and captions. Gallery names were reconciled visually with the individual portraits (gallery order differs from section order). Gazette remains inactive; session summaries are a separate migration and archives currently use the existing empty-state message. Content stays editable in MDX using shared components.

`fgc-media-sources.json` inventories 28 referenced backup sources, one already in the prior manifest. Preparation adds 27 full-size delivery files and 33 responsive candidates; these 60 new objects are uploaded to R2 without replacing prior objects. Build: 45 pages, with 189 responsive-image occurrences, 143 full-size links and 466 delivery checksums validated. Bulk sources, unrelated dependency edits and `.claude/` stay outside this commit.


## Migration content safety preference (2026-10-05)

Kat reports that the Ghost site was hacked multiple times. Omit obvious nonsense/spam from content migrations and record omissions for review. Do not migrate any individual page/post header or footer code-injection fields without consulting Kat first. This applies to subsequent migrations as well. Gazette work reads body HTML and relevant content metadata only; individual injection fields are not copied or executed.


## Gazette and associated posts (2026-10-05)

Branch `codex/wildemount-gazette` migrates the Gazette landing page, enables its FGC navigation link, and imports seven published posts linked through its Kamordah and Zadash archives (five and two respectively). Original post slugs, titles, dates, author and tags are retained. Gazette uses the existing campaign nav; posts remain posts and appear in their location/category archives and feeds. Homepage's session-note filter is unchanged.

Five unrelated shopping paragraphs were omitted with Kat's explicit approval. `gazette-migration-manifest.json` records omissions, source article IDs/checksums, table counts and media provenance. No individual header/footer code-injection fields are migrated. Text, tables and original non-spam links were compared against the rendered output for all seven posts. Tables retain their item names, prices and game links, including source inaccuracies for later editorial review. Fire Orchid Springs retains the original `/emberpetal-springs/` slug.

Eleven new original media sources are preserved locally; 52 optimized full-size/variant objects are uploaded to R2. Build: 60 pages; responsive checks validate 259 image occurrences, 174 full-size links and 518 file checksums. Mobile inventory table stays inside the reading column and scrolls horizontally without page overflow. Existing dependency edits and bulk originals remain excluded.


## The Chosen Cast and Rules (2026-10-05)

Kat requested these two pages, then a tag-pruning discussion before further content migration. Branch `codex/chosen-cast-rules` migrates `/the-chosen-cast/` and `/general-buffy-game-info/`, enabling both navigation links. Cast retains six gallery portraits, six profiles/quotes and seven PDF downloads. Rules retains Jackie's recovered instructions and callout. Source text comparisons pass. No spam was found in these bodies and no individual header/footer injection fields were read or migrated.

The absent `quest.html` questionnaire is represented by its label plus an unavailable-form note; `intro.html` now links to `/the-chosen/`. Cast's PDFs use reusable file cards with title, filename, source size labels and a download icon (see refinement below). The media pipeline now supports original PDF downloads under `/assets/files/` alongside images. R2 objects carry PDF content type and attachment disposition. All seven public PDFs match backup checksums. Eleven new delivery objects are uploaded; originals stay outside Git.

Local and R2 builds pass (62 pages), validating 263 responsive images, 191 full-size links and 529 delivery checksums. `chosen-cast-rules-migration.json` records source provenance and editorial notes. **Stop additional content migration here: discuss and approve the tag plan with Kat next. Do not prune tags without that discussion.**


### Chosen file-card refinement

Kat requested visual distinction for the PDF links. `FileDownload.astro` restores the exported file-card treatment with title, filename, size, download icon, hover and visible keyboard focus. All seven Cast downloads use it. Local theme CSS had no file-card rules; this is an Astro implementation based on the available export markup. Desktop appearance and phone-width overflow verified; R2 links remain unchanged.

Cast source cleanup: removed five invisible Unicode line separators (U+2028) after character names in headings. Ordinary LF line endings and the final newline were already correct; visible text is unchanged.
