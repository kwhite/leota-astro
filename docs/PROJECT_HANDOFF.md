# Here Be Dragons / Leota Astro — thread handoff

Last updated: 2026-10-04, after the MDX pages checkpoint and rich-post authoring plan. This document records project context and user decisions; it is not a new authorization to deploy, send email, or migrate the full archive. Read the user's latest request before continuing.

## Goal and current position

Port the visual appearance and used behavior of Kat's existing **Leota Ghost theme** into the existing **leota-astro Casper port**, preserving the Astro architecture and portable content. The original website is unavailable, so the reference is the supplied theme, Ghost export/media, and Kat's feedback. Kat approved the plan, then successive local implementation milestones, and said the visual result was looking great before requesting the special-content milestone.

Current checkpoint: `bffa197` on `codex/leota-visual-port`, committed and pushed to origin. This includes the City of Mist pages, demo cleanup, standalone pages collection and MDX page composition. Latest build: 35 pages, no warnings. Bulk media remains local/untracked. Image optimization and deployment cleanup remain planned, not started. Historical sections below describe earlier checkpoints; this paragraph and the latest decision take precedence for current status.

**Next proposed milestone: rich-post MDX components.** Kat wants reusable callouts, pull quotes, galleries, images, Spotify embeds and link previews instead of manually repeating HTML classes/layouts. See [rich-content-authoring-plan.md](rich-content-authoring-plan.md) for component contracts, staged sample conversion, acceptance checks and the later migration/media pipeline. Both posts and pages already load `.md`/`.mdx`; no new content architecture is needed. Start with Callout/PullQuote and the 1.8 post, then galleries/images, then Spotify and DM Resources bookmarks. Share components with pages and keep simple prose in Markdown.

Kat requested **planning and documentation only before stopping for the night**. Rich-post components/conversions are not implemented. These latest planning docs are uncommitted; no build is needed for this documentation-only change. Resume implementation when requested, without interpreting the plan itself as bulk-migration or deployment authorization.

## Workspace and source material

- Target: `/Users/kat/Sites/leota-astro`
- Reference Ghost theme: `/Users/kat/Sites/Leota` (not a Git repository)
- Original user-supplied project brief: `/Users/kat/Desktop/CODEX_CONTEXT.md`
- Backup root: `/Users/kat/Downloads/here be dragons backup`
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
Only About is currently enabled. Preserve the other labels until their pages are ready.

Logo: `/assets/images/2025/01/IMG_0489.png`; icon: `/assets/images/2024/12/IMG_0423-2.png`. The original homepage-cover file was absent from the backup, so its w2000 rendition was used under the original dated public path; details are in the baseline report.

## Scope and architecture boundaries

Keep Astro, its collections, route patterns, client router, package manager, and static output. No framework replacement, dependency upgrade, schema redesign, or new CMS is needed for this port.

- Node 24.13.1, pnpm 12.9.1, Astro 7.3.5 at last verification.
- Scripts: `pnpm dev`, `pnpm build`, `pnpm preview`. No dedicated test suite.
- `src/content.config.ts` defines posts (Markdown/mdx glob), JSON authors, and JSON tags. MDX integration is not configured. Author is a collection reference. Posts use title/date/author, optional description/cover, ordered tags, and existing optional layout/navigation/disqus fields.
- Ordinary content remains `.md`; small deliberate HTML blocks preserve Ghost card semantics. Do not convert all images/prose to framework components.
- Media convention: `public/assets/images/YYYY/MM/file` → `/assets/images/YYYY/MM/file`. Preserve filenames and hierarchy.
- Roughly 3.8GB of media is unsuitable for ordinary Git. Bulk-media ignore/storage/sync decisions remain unresolved; dated media is currently untracked and not broadly ignored. Do not mass-stage it, introduce LFS, or delete it without a scoped plan.
- No full archive migration, production deployment, DNS/AWS changes, or subscriber/email activation has been performed or authorized by these milestones.
- Eventual hosting preference is **AWS S3 + CloudFront**, not Cloudflare Pages.
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
