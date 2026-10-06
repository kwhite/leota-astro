# Here Be Dragons / Leota Astro — thread handoff

Last updated: 2026-10-06, after migrating The Chosen Season 2. This document records project context and user decisions; it is not authorization to deploy, send email, or migrate the full archive. **This current checkpoint takes precedence over the historical milestones below.**

## Goal and current position

Port Kat's Leota Ghost theme and selected content to Astro, preserving the dark design, editable Markdown/MDX, source content and reusable components. Cloudflare hosts the site; Netlify is paused. Kat confirmed live images load from R2.

Main includes PRs #12–#23: Chosen Cast/Rules and PDF download cards, portable R2 media, automatic Markdown image lightboxes, dependency updates, approved tag cleanup, the finished Gazette, City of Mist through Season One, both Freaky Gray Company arcs, and The Chosen Season 1. Current branch `codex/the-chosen-season-two` migrates all 22 Season 2 posts, prepared for PR review. Check its merge status before starting another branch from updated `main`.

Kat approved retaining campaigns, chronology and Gazette locations, removing character, venue and broad/context tags, and consolidating Session Notes/Session Recap into **Session Recaps**. Current post metadata and tag archives reflect this choice; the homepage remains filtered by CoM Season 1. Static 301 rules for former format archives are bundled in `public/_redirects`; Cloudflare runtime behavior remains to be checked after deployment.

Validation: the current R2 production build passes with 191 pages. Media checks cover 1,390 responsive-image occurrences, 610 full-size links and 1,604 delivery-file checksums. Retained navigation archives and the Session Recaps archive/feed were verified, along with the migration plan and bundled redirects. Documentation-only edits do not require another build.

## Next session

Review/merge The Chosen Season 2 PR. City of Mist and Freaky Gray Company are migrated through all currently published posts. Next and final source-post batch: The Chosen Season 3 (23 posts). Use a fresh branch from updated main after merge. Kat approved separate branches/PRs per reviewable season or arc. Read [tag-migration-decisions.md](tag-migration-decisions.md) and [tag-migration-plan.json](tag-migration-plan.json): of 170 source posts, 145 already exist, 23 remain to migrate, and two imported duplicates are approved omissions. Feolinn is a Gazette location; Quicksliver Cabaret is under Zadash and its Return to Summary destination exists. Preserve the untagged 1.5 Original and its direct link from the revised post.

Kat plans to clean up Arc 1 headings/callouts another time; defer that editorial work. Arc 1's two covers were removed at her request for consistency. Arc 2 uses covers throughout, so its source covers are retained.

D&D, Wildemount, Campaign 2003 and venue-type categories are approved removals. Wildemount can be added back later if needed. The Getting started sample remains preserved. The audit documents describe the pre-cleanup inventory; the decisions and migration plan describe the approved outcome.

Gallery prefixes are intentional OOC commentary shorthand and must remain (Kat confirmed).

Authoring decisions: retain the succinct `Callout` component; alternate blockquotes use HTML, ordinary quotes use Markdown. Standalone Markdown images now open the lightbox without affecting explicit wide/full layout options. This does not authorize bulk conversion of component usages.

Dependency changes are committed in merged PR #15. Preserve unrelated `.claude/` and untracked original images/PDFs; do not mass-stage them. The current Astro dev daemon reports `http://localhost:4335/`; check its status before starting another server.

Media delivery uses bucket `leota-media` and `MEDIA_BASE_URL=https://pub-e4d8121a5e7c42d98f03214fb5ed9720.r2.dev`. R2 is the default; an optional optimized offline cache is supported. See [media-delivery.md](media-delivery.md). A custom media domain remains future work.

Content safety: omit obvious spam/nonsense and record omissions. **Do not migrate individual header/footer code-injection fields without consulting Kat first.** Earlier inspection found a desktop-grid header override on `people-in-the-city`; it was not migrated. Global injection settings have not been audited. The source backup remains untouched.

## Workspace and source material

- Target: `/Users/kat/Sites/leota-astro`
- Reference Ghost theme: `/Users/kat/Sites/Leota` (not a Git repository)
- Original user-supplied project brief: `/Users/kat/Desktop/CODEX_CONTEXT.md`
- Backup root (relocated): `/Users/kat/Library/CloudStorage/Dropbox/Gaming/Website Backups/here be dragons backup`
- Export: `game-notes-summaries.ghost.2026-10-03-19-02-04.json` inside that backup root
- Media archive: `ghost-media-backup-2026-10-03.tar.gz` inside that backup root (a plain tar despite the filename). Extract only files referenced by the current batch; the earlier extracted directory is no longer present.
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

## Portable development media (2026-10-06)

Kat approved R2 by default with an optional optimized offline cache. `pnpm dev` serves valid cached delivery files and redirects missing/stale assets to R2. `pnpm build` defaults to the manifest public URL; `MEDIA_BASE_URL` overrides it. `node scripts/download-media.mjs` downloads/checksums the 529 current delivery files (about 114 MiB), skipping valid cached files. `MEDIA_MODE=local pnpm build` explicitly bundles the cache. No original backups or credentials are required on a second machine. This covers offline media, not guaranteed first-run offline Google fonts. See media-delivery.md. Tag discussion remains next; no content/tag migration performed.

## Component authoring audit (2026-10-06)

Kat reviewed a Markdown/HTML conversion of the 1.8 post and chose to retain `Callout` for its succinct syntax and Markdown body formatting. The post therefore remains `.mdx` with its Callout import. Alternate blockquotes use HTML `<blockquote class="kg-blockquote-alt">` rather than `PullQuote`; ordinary quotes remain Markdown. Its Spotify embed is HTML. This is a one-post authoring trial, not approval to convert all other component usages or begin bulk migration. Other component choices remain under discussion; tag review is still required before further migration.

## Automatic Markdown image lightbox (2026-10-06)

Kat approved lightbox links for standalone Markdown images while preserving explicit wide/full layouts. `scripts/markdown-image-lightbox.mjs` runs through the existing Sätteri Markdown/MDX processor, registered in `astro.config.mjs`. The matching `@astrojs/markdown-satteri` 0.4.2 is now a direct dependency; Astro/MDX versions remain unchanged. Top-level paragraphs containing one public-root or HTTP(S) Markdown image become regular-width image cards with full-size links, lazy loading and alt-based viewer captions. Inline/linked/nested images, relative file imports, existing HTML and components are untouched. Documentation explains opt-out and special layouts. `node scripts/tests/markdown-image-lightbox.mjs` checks both rendering pipelines and exceptions. Temporary built posts verified feeds, browser opening, adjacent navigation, Escape/focus return and 900/1200/full-width layouts; fixtures were removed afterward.

## Tag audit for discussion (2026-10-06)

Kat requested a tag inventory before pruning as part of migration. `tag-audit.md` and `tag-audit-data.json` record all 42 Ghost tags (38 public/four internal), 33 current metadata records, source/current usage, navigation dependencies, legacy-slug differences, duplicate assignments and classification exceptions. The proposed navigation minimum is 12 tags; the biggest optional group is 15 character tags. Session Notes/Session Recap, venue types and broader context tags remain discussion items. No tags, content metadata, archive routes or filters have been changed, and no pruning/consolidation decision is approved yet.

## Approved tag cleanup (2026-10-06)

Kat approved retaining campaigns/chronology/locations, removing character tags, and combining Session Notes and Session Recap into Session Recaps. Existing character references/metadata and unused fiction metadata are removed; homepage remains CoM Season 1. `tag-migration-decisions.md` and `tag-migration-plan.json` record 170 source-post outcomes: ten already migrated, 158 remaining and two approved duplicate omissions. Feolinn gets its own Gazette location during migration; Quicksliver Cabaret goes under Zadash. Import-marker Steamed Buns and Invulnerable Vagrant are omitted in favor of recreated routes. Keep 1.5 Original at its existing direct-link destination without campaign/season inference; after character removal it is untagged. Backup is untouched. Broad/context and venue categories are also approved removals; the Getting started sample remains preserved. This approves the taxonomy/exclusions, not bulk import of all 158 remaining posts.

### Canonical format name

Kat chose Recaps rather than Notes: use `Session Recaps` (`/tag/session-recaps/`) as the canonical format tag. Both source Session Notes and Session Recap map to it. Current post titles/slugs and the CoM Season 1 homepage filter are unchanged. Prepared static redirect rules preserve both former format archive paths and their feed/pagination suffixes; runtime verification awaits deployment.

## Gazette completion (2026-10-06)

Migrated `feolinn-shops-eateries-entertainment` and `quicksliver-cabaret` as standard Markdown, preserving source titles, slugs, dates and cleaned prose. Added Feolinn metadata and Gazette navigation. Restored headings/paragraphs and the Feolinn vineyard list from flattened import text. Omitted two unrelated jersey-shopping paragraphs from Feolinn and one cosplay-shopping paragraph from Cabaret; hashes and reasons are recorded in `gazette-migration-manifest.json`. No injection fields were read or migrated. Neither export includes images/cover; the Cabaret map credit has no map URL. Its preserved Return to Summary destination `/c1e17-connections/` remains pending migration. Source comparisons, archive/feed checks and browser rendering checks pass. No new media uploads are needed.

## City of Mist Prologue migration (2026-10-06)

Migrated eight recaps and four voice-over posts; Geoffrey’s existing voice-over completes the archive. Preserved titles, slugs, dates, descriptions, prose, 29 body images, seven Spotify embeds, alternate quotes and three callouts. Two posts use MDX for Callout; the rest use Markdown. Removed character-tag/broken `/404/` links while preserving names. Repaired malformed source list nesting. No spam found after reviewing all bodies/external links; no individual injection fields read or migrated. `com-prologue-migration.json` records provenance and validation. Kat approved correcting the title to 2025.01.18 and the route to `/2025-01-18-session-notes/`; the former 2024 route has prepared 301 rules. Source provenance remains in the migration records.

Prepared 40 newly referenced source images: about 117 MiB original → 20 MiB full-size delivery, plus 144 responsive variants. All 184 new objects uploaded to R2; originals stay untracked and backup untouched. Preparation drops six no-longer-referenced source assets from the manifest after tag pruning; bucket objects are not deleted. Current manifest has 683 delivery files. Build, source text/image/embed/callout comparisons, internal links, feeds and browser rendering checks pass. Homepage remains CoM Season 1.

## City of Mist Season One migration (2026-10-06)

Migrated 11 remaining tagged recaps plus 1.5 Original; 1.8 already existed. Original stays untagged and linked from revised 1.5, with existing global/author-feed behavior. The optional question about further listing exclusion has not been answered; do not invent a hidden/unlisted field. All published chapter-table links now work through 1.10; 1.11 remains unpublished. Removed the obsolete migration notice. Gallery prefixes are intentional OOC shorthand (Kat confirmed) and are preserved.

All 12 posts retain Callout in MDX (68 callouts total); prose/ordinary quotes and 36 body images use Markdown. Preserved ten Spotify embeds, alternate HTML quotes, scene-break rules, underlines and the family-tree code block. Two exported toggles use native HTML details/summary with scoped styling. No unrelated spam found in the body scan; no injection fields read or migrated. `com-season-one-migration.json` records provenance and verification.

47 new image sources: 23.13 MiB original → 4.86 MiB full-size delivery, plus 140 responsive variants. All 187 new files uploaded to R2, three representative public checksums verified; originals/backup unchanged. Build passes with 71 pages. All 12 source bodies and image/embed/callout/disclosure counts checked; internal links, chapter links, homepage, archives and XML feeds verified. Disclosure mouse/keyboard, Markdown lightbox/Escape focus-return and 390px overflow checks pass. Current manifest contains 245 source assets and 870 delivery files.


## Freaky Gray Company Arc 1 batch (2026-10-06)

All 37 Arc 1 posts use plain Markdown; the one alternate blockquote retains HTML. Source titles, dates, ordered tags and legitimate external links are preserved. The `2022-01-14-things-get-weird` source slug has a 2023 title; this mismatch is retained pending an explicit editorial correction. Literal numbering in a flattened source paragraph is escaped to preserve presentation.

Four unrelated shopping-spam paragraphs were omitted: two each from Connections and Erash's First Dream. Paragraph hashes/reasons and original body hashes are recorded in [fgc-arc-one-migration.json](fgc-arc-one-migration.json); the backup is unchanged. Source injection fields were not read or migrated. Elinore's legacy `/elinores-plea/` link now targets `/c1e8-elinore-s-plea/`, with exact 301 aliases prepared. Connections restores the Cabaret's Return to Summary destination.

Kat requested removal of the only two Arc 1 covers for consistency. Both covers are omitted; their two optimized full-size images and seven variants were deleted from R2 (nine confirmed deletions). Original backup/public images remain intact. The current manifest covers 245 source assets and 870 delivery files. Production build: 111 pages. Media validation: 657 responsive occurrences, 354 full-size links and 870 checksums. All 37 built article bodies match source text after the documented spam omissions; internal article links, XML feeds and Arc 1/campaign pagination were verified.


Arc 1 review follow-up: listing pagination is hidden while infinite scroll is active, including after the final page has been appended. Manual links reappear on a loading failure and remain available for direct visits to a final paginated route or without JavaScript. This shared behavior applies to homepage, tag and author listings. Regression checks: `node scripts/tests/infinite-scroll.mjs` covers completed loading, failure fallback after a successful append, and direct final-page navigation. Production build remains 111 pages.


## Freaky Gray Company Arc 2 batch (2026-10-06)

Migrates all 28 remaining campaign posts: 17 Markdown files and 11 MDX files for existing Callout usages. All four tables use Markdown; three galleries retain HTML, wide layout, image ratios, captions and linked lightboxes. Twenty yellow callouts, five alternate quotes, the Spotify embed and Gallery/OOC headings are preserved. Source title/slug/date spelling remains intact. No obvious unrelated spam found in the body/link scan; no source injection fields were read or migrated. Arc 1 editorial cleanup remains deferred to Kat.

All 28 built article bodies match source text; all 82 body images and the formatted structures were verified. Production build: 144 pages. Media checks: 999 responsive occurrences, 502 full-size links and 1,366 delivery checksums. XML feeds, homepage filter, Arc 2 and campaign pagination pass. The December 27 mixed-size gallery and its five-image lightbox were checked in the local browser. See [fgc-arc-two-migration.json](fgc-arc-two-migration.json) for source/media provenance and validation.

This batch prepares 110 referenced source images (171,012,811 bytes), 32,225,388 bytes of full-size delivery files and 386 responsive variants. Original source images and archive remain unchanged. The manifest now covers 355 source assets and 1,366 delivery files. No bucket objects are deleted.

All 496 new Arc 2 delivery files are uploaded to R2; three representative public downloads (optimized PNG artwork, retained JPEG and responsive variant) match their delivery checksums. June 8 table/callout presentation also checked in the local browser.


## The Chosen Season 1 batch (2026-10-06)

All 22 Season 1 posts migrated: 21 plain Markdown files and one MDX file for the existing blue Callout. Source titles, slugs, dates, approved tag order, 274 scene separators and all source headings are preserved. The alternate quote and Spotify embed retain HTML; no new editorial headings or callouts were introduced. OOC/Gallery commentary remains intact.

Omitted 21 unrelated shopping-spam paragraphs across 18 posts. Original HTML hashes, paragraph indices, omission hashes and reasons are recorded in [chosen-season-one-migration.json](chosen-season-one-migration.json). The legitimate Wendigo reference in The Campout remains. Source injection fields were not read or migrated. Original backup and public images remain unchanged.

Validation: production build passes with 167 pages. All 22 built article bodies match the source after recorded spam omissions. Scene separator, heading, callout, alternate quote and embed counts match; all season archive links, 17 XML files and the homepage filter were verified. Media checks pass for 1,188 responsive occurrences, 548 full-size links and 1,476 delivery checksums.

This batch prepares 22 source covers (35,084,934 bytes), 2,942,624 bytes of full-size delivery files and 88 responsive variants. Manifest: 377 source assets and 1,476 delivery files. No bucket objects are deleted.

All 110 new Season 1 delivery files are uploaded to R2; three representative public downloads match SHA-256 checksums.


## The Chosen Season 2 batch (2026-10-06)

All 22 Season 2 posts migrated: 17 plain Markdown files and five MDX files for existing blue callouts and PDF download cards. Source titles, slugs, dates, ordered tags, 259 scene separators, all headings and OOC/Gallery commentary remain intact. All 16 Spotify embeds, three blue callouts, ten alternate quotes, 13 download cards and one body image are preserved. FileDownload now supports optional captions and display filenames to preserve original visible card metadata; existing callers keep their defaults.

Omitted 16 unrelated shopping-spam paragraphs across 15 posts. Original HTML hashes, paragraph indices, omission hashes and reasons are in [chosen-season-two-migration.json](chosen-season-two-migration.json). All 13 PDF attachments were text-scanned without spam matches and are retained byte-for-byte. Source code-injection fields were not read or migrated; the original backup remains unchanged.

Validation: 191-page production build passes. All 22 built article bodies match source text after recorded spam omissions, excluding only non-visible download-icon SVG/style text. Structural counts, 22 season archive links, campaign pagination, 18 XML files and the homepage campaign filter pass. Media checks cover 1,390 responsive occurrences, 610 full-size links and 1,604 delivery checksums. Play It Again download-card captions/display filenames and loaded Spotify players were reviewed in the local browser.

This batch adds 23 images (40,225,134 source bytes; 3,594,116 full-size delivery bytes), 13 unchanged PDFs (675,497 bytes) and 92 responsive variants. All 128 new delivery objects are uploaded to R2. All 13 public PDF downloads and three representative image downloads match checksums; PDF attachment headers are verified. Manifest: 413 source assets and 1,604 delivery files. No bucket objects deleted.
