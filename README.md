# Here Be Dragons — Leota Astro

The source for [Game Notes & Summaries](https://herebedragons.club), Kat’s tabletop campaign notes and resources. This project ports the Leota Ghost theme and published content to Astro, preserving the dark design, article URLs, campaign archives, galleries, and rich content.

The site builds to static HTML. Cloudflare Workers serves the site, and Cloudflare R2 serves optimized images and PDF downloads through `https://media.herebedragons.club`.

## Project status

The published-content migration is complete: 168 retained posts and all 14 published source pages have destination routes. The two obsolete duplicate imports were intentionally omitted. The Quote Napkin remains a draft. The current production build generates 219 pages, plus the 404 page.

Ongoing work is primarily maintenance, documentation, and editorial cleanup. Remaining handoff items include confirming automatic Cloudflare branch previews, deciding how to archive/sync bulk original media, and any deferred external-link or Ghost code-injection review. Arc 1 heading/callout cleanup is deferred editorial work. See [PROJECT_HANDOFF.md](docs/PROJECT_HANDOFF.md) for decisions and historical validation; older milestone sections describe earlier states.

## Local setup

Use Node.js 24 or newer and pnpm. Install the versions recorded in the lockfile:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Astro normally serves the site at `http://localhost:4321/`; use the address printed by the server if that port is occupied. Before starting another server, check whether one is already running.

A fresh checkout can use the public R2 media without restoring original images or configuring R2 credentials. An initial connected run may also be needed for Astro’s Google font cache.

```sh
pnpm build
pnpm preview
```

The production output is `dist/`. The build validates referenced media against the tracked manifest, rewrites URLs to R2, adds responsive image candidates, and excludes original image/PDF copies from the deployment artifact. Existing MDX `use astro:head-inject` bundler warnings are documented in the authoring guide.

## Editing and publishing

- Posts: `src/content/posts/`; use Markdown for ordinary prose and MDX for rich-content components.
- Pages: `src/content/pages/`; shared layouts and components provide galleries, disclosures, bookmark cards, Spotify embeds, and the consent checklist.
- Tags and authors: `src/content/tags/` and `src/content/authors/`.
- Publication settings and navigation: `src/config.ts`.
- Theme styles: `src/styles/`; page routes and feeds: `src/pages/`.

Read [post-authoring.md](docs/post-authoring.md) and [page-authoring.md](docs/page-authoring.md) for frontmatter, component syntax, image handling, and stable heading links. Keep established slugs and intentional gallery commentary prefixes. The homepage currently filters posts by **CoM Season 1**.

For a change, edit the content, prepare/upload any new media, build, and inspect the affected pages. Commit the intended source and manifest files on a branch, then open a pull request into `main`. Keep drafts unpublished unless explicitly approved.

## Campaign appearance

Set `theme` to `'light'` or `'dark'` and `accentColor` to a CSS color in `src/config.ts`. `accentTextColor` controls text on accent backgrounds: use white for a dark accent and dark text for a pale accent. These are publication-wide settings, applied after rebuilding; there is no visitor theme toggle. The default remains dark with the current purple accent.

Shared page, article, archive, bookmark, download, and checklist colors follow the theme. Cover-photo text and the image viewer keep their overlay colors; blue/yellow callouts and consent status colors keep their meaning. Email previews have their own dark layout.

Check navigation, buttons, and keyboard focus contrast when choosing a new accent, then review representative pages at desktop and mobile sizes. See [campaign-appearance.md](docs/campaign-appearance.md) for examples and the review checklist.

## Media and backups

The media manifest is `docs/media-delivery-manifest.json`. Content keeps its familiar `/assets/images/…` and `/assets/files/…` paths; the build maps them to optimized public delivery URLs.

New media must be prepared, recorded in the manifest, and uploaded to R2 before deploying content that references it. Follow [media-delivery.md](docs/media-delivery.md) for preparation, checksum validation, upload planning, and credentials setup. Uploads are separate from the site build.

Bulk original images/PDFs remain outside Git, alongside preserved source backups. Some originals are still visible as untracked files: **do not mass-stage or delete them to make Git status clean**. The storage/sync policy remains a cleanup decision. `.media-delivery/` is an ignored optimized cache; `.claude/` is local tooling configuration and is excluded from project commits.

To cache optimized media for local use:

```sh
node scripts/download-media.mjs
```

For a build that bundles the complete checksum-validated cache:

```sh
MEDIA_MODE=local pnpm build
pnpm preview
```

## Cloudflare deployment

The project uses **Workers Static Assets**, configured in `wrangler.jsonc`, with Worker name `leota-astro` and asset directory `dist`. Netlify is paused.

The documented Cloudflare build command is `pnpm build`; the production deploy command is `npx wrangler deploy`. Production should track `main`. `MEDIA_BASE_URL=https://media.herebedragons.club` is the public build setting; the manifest also supplies that default. R2 upload credentials are not required by the site build.

`SITE_URL` overrides the canonical site origin, and `BASE_PATH` overrides the root path, when a separate deployment needs them. Defaults are `https://herebedragons.club` and `/`.

Preview URLs are enabled in `wrangler.jsonc`, while the production `workers.dev` URL is disabled. Automatic branch builds also require the Cloudflare dashboard’s preview/non-production branch build setting. That dashboard setting remains unverified; do not assume a pushed branch has a test URL until its build and preview URL are visible. See [Cloudflare’s branch-build documentation](https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/).

## Optional table emails

Email is a local convenience for the gaming table, with a private fixed recipient list. Publishing or rebuilding the site does not send email.

```sh
pnpm email:preview <post-slug>
pnpm email:check
```

After private Mailgun setup, `pnpm email:test <post-slug>` sends a fresh test, and `pnpm email:send <post-slug>` sends separately to table recipients. Sending rebuilds and checks that the live article matches. Table-send history prevents automatic duplicate sends; ambiguous failures require review before retrying.

Follow [email-workflow.md](docs/email-workflow.md) for setup, inbox checks, and recovery. Credentials, addresses, previews, and send history live in ignored `.email/` storage. Preserve its history when moving computers.

## Validation and reference docs

Run `pnpm build` for content/schema and media-reference validation. Run `pnpm email:check` when changing the email helper. The `scripts/tests/` directory also contains checks for internal links, responsive media, Markdown image lightboxes, and archive scrolling; consult each script’s inputs before running it. Review desktop/mobile output for layout or interaction changes.

- [Project handoff and decisions](docs/PROJECT_HANDOFF.md)
- [Post authoring](docs/post-authoring.md) and [page authoring](docs/page-authoring.md)
- [Media delivery and uploads](docs/media-delivery.md)
- [Optional email workflow](docs/email-workflow.md)
- [Tag migration decisions](docs/tag-migration-decisions.md)
- [Recorded internal-link audit](docs/link-audit.json)

## Theme origins and license

The implementation began from [Casper Astro](https://github.com/AntonyLeons/casper), with design and content adapted from Kat’s Leota Ghost site. See [LICENSE](LICENSE) for the repository’s MIT license. Theme licensing does not imply permission to reuse campaign content or third-party artwork.
