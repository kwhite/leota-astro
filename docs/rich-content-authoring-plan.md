# Rich content authoring with MDX

Planned 2026-10-04. **Steps 1–3 are implemented and step 4 is confirmed** (Callout, PullQuote, Gallery, ContentImage, SpotifyEmbed, LinkPreview, and the DM Resources page); see the status sections at the end and [post-authoring.md](post-authoring.md).

## Decision

Use `.md` for ordinary prose and `.mdx` for posts or pages that need composed rich content. Both collections already accept these extensions, and the official MDX integration is installed. Keep post metadata, URLs, dates, ordered tags, authors, feeds, homepage filtering and Astro layouts unchanged. Do not introduce another collection or move body content into frontmatter to control placement.

Authors import a component once and put it anywhere between paragraphs. Components own classes, wrappers, dimensions/layout calculations and accessibility markup. Prose inside callouts and quotes should support ordinary Markdown through slots, including emphasis, links, multiple paragraphs and lists. Existing inline HTML remains supported during incremental migration. Ordinary quotations still use Markdown `>`.

Share the same Astro components between posts and pages; no React or additional client framework is needed. Reuse existing CSS and the shared lightbox rather than redesigning accepted treatments.

## Proposed component contracts

Names and props below are a starting contract to validate in the first implementation slice, not an available API.

| Component | Author supplies | Component handles |
| --- | --- | --- |
| `Callout` | `color="blue"` or `"yellow"`, optional `emoji`, Markdown body | Existing colored card markup, spacing and serif text; decorative emoji semantics |
| `PullQuote` | Markdown body; optional attribution if actually needed by source content | Alternate centered quote treatment and semantic blockquote; ordinary quotes remain Markdown |
| `Gallery` | Ordered `rows` of image records, optional caption and `size="regular\|wide\|full"` | Figure/row markup, aspect-ratio flex calculations, lazy images, accessible direct-image links and existing lightbox hooks |
| `ContentImage` (existing; extend) | Existing `image`, `alt`, numeric dimensions and download props; add optional caption, size and full-size destination | Single-image display and viewer/download links; preserve existing city-map calls |
| `SpotifyEmbed` | Spotify URL and accessible title; compact/full height option if source examples need it | Supported Spotify URL normalization, iframe permissions, sizing, lazy loading and fallback link; no arbitrary HTML paste |
| `LinkPreview` | URL, title, optional description, thumbnail, publisher/author/icon metadata recovered from export | Static bookmark card and missing-image/metadata fallbacks; no live scraping dependency |

Gallery image records should have `image`, `alt`, positive `width`/`height`, optional `fullSize`, and optional per-image caption. Explicit rows preserve source grouping; callers never calculate flex ratios. Keep small arrays at the component call; reusable/long data can live in frontmatter without fixing placement. Use `size` for layout and numeric `width`/`height` for intrinsic dimensions to avoid ambiguity. Validate the eventual interface against real content before documenting it as final.

Existing `ContentBanner`, `ChapterTable` and `PeopleGrid` remain reusable body components. Do not build new abstractions for unused embed providers in retained demo/reference posts. Spotify and DM Resources bookmarks are the actual rich-embed scope confirmed by Kat.

## Intended editing experience

Illustrative future syntax, not runnable until implementation:

```mdx
import Callout from '../../components/Callout.astro';
import PullQuote from '../../components/PullQuote.astro';
import SpotifyEmbed from '../../components/SpotifyEmbed.astro';

Regular Markdown before the card.

<Callout color="blue" emoji="🔎">

What does **Helix Corporation** know? Keep our theories here.

- Follow up with Michelle.
- Check the evidence.

</Callout>

<PullQuote>

This was your tank.

</PullQuote>

<SpotifyEmbed
  url="https://open.spotify.com/track/5jkFvD4UJrmdoezzT1FRoP"
  title="Rasputin on Spotify"
/>
```

Keep blank lines around nested Markdown. Verify MDX slot output and paragraph margins before converting real posts. Document literal braces/angle brackets and JSX-compatible tags when converting existing HTML; do not merely rename every `.md` file.

## Implementation sequence

1. **Callouts and quotes pilot.** Capture the current rendered 1.8 post as a baseline. Implement `Callout` and `PullQuote`, then convert `1-8-far-from-the-tree-part-2.md` to `.mdx` with the same basename. Preserve its 14 blue callouts, four pull quotes, 62 ordinary quotations, source text/emphasis/line breaks and Spotify embed. Check nested Markdown spacing before broadening the API. Leave plain posts and the two reference/demo posts alone.
2. **Images and galleries.** Extend `ContentImage` compatibly and add `Gallery`; convert `2025-03-29-session-notes.md` to `.mdx`. Preserve two-image order/caption and two yellow callouts. Exercise multiple rows, mixed aspect ratios, adjacent cards and a standalone image using a temporary verification fixture rather than adding published demo content. Preserve direct image fallback links and existing keyboard/focus behavior. Avoid extra wrappers that break consecutive-card lightbox grouping.
3. **Embeds and resources.** Wrap the existing Spotify examples in `SpotifyEmbed`, preserving their destinations and appearance. Kat already verified playback; check wrapper parity rather than treating playback as previously unresolved. Inspect DM Resources bookmark metadata in the export, implement `LinkPreview`, and migrate that page as the next content slice. Enable its navigation link only when the route/content is ready. Missing preview metadata must still leave a useful ordinary link. Do not fetch previews during every build or invent metadata.
4. **Authoring guide and acceptance.** *(Confirmed by Kat 2026-10-04.)* Add `docs/post-authoring.md` with tested, copyable examples, component props/defaults, gallery data examples and MDX pitfalls; cross-link the page guide. Offer the same components for Rules and other pages as they are migrated. Review representative desktop/mobile output with Kat before bulk conversion.
5. **Repeatable migration.** Teach the later Ghost converter to emit Markdown for simple entries and MDX imports/component calls for supported rich cards. Deduplicate imports, safely serialize props/escape MDX syntax, preserve source metadata and content order, and report unsupported cards for review. Keep a dry-run/source mapping and collision checks. Never execute exported scripts or import source account settings. Bulk migration remains a separate reviewed milestone.

## Verification and acceptance

- Build succeeds; renamed entries retain routes, metadata, tag ordering, listing/feed behavior and the CoM Season 1 homepage filter. Check generated RSS/XML content as well as page rendering.
- Compare baseline and converted text, emphasis, heading IDs, image order, captions, URLs and rich-block counts. No silently dropped content from JSX parsing or slot whitespace.
- Mobile/desktop callouts, pull quotes and galleries keep accepted appearance without overflow. Test meaningful Markdown nesting rather than only one-line text.
- Verify gallery opening, sequencing, next/previous, Escape, focus return, Astro navigation cleanup and direct-image behavior without JavaScript. Preserve current behavior; swipe/pinch remains separate scope.
- Confirm image dimensions/alt text and missing-preview fallbacks. Rich blocks render statically except existing lightbox behavior and third-party Spotify content.
- Run targeted checks and `pnpm build`; do not add a broad test framework solely for presentational wrappers.

## Future enhancements

Guiding principle from Kat: keep authoring as streamlined as possible for the content editor, with components doing the heavy lifting behind the scenes. Ghost's editor did some of this automatically; these items restore it.

- **Automatic gallery rows** (implemented 2026-10-05). Let `Gallery` accept a flat `images` list and build rows itself using Ghost's rule: three per row, and when one image would be left alone on the last row, move one from the previous row so the last two rows have two each. Dimensions only set widths within a row, which the component already computes. Keep explicit `rows` as an override, and keep existing calls rendering unchanged.
- **Automatic image dimensions.** Read `width`/`height` from local files at build time for `Gallery` and `ContentImage`, so authors supply only path and alt text. Explicit values stay optional overrides (needed for remote images). Shares image-size reading with the optimization pipeline.
- **Link preview helper.** An authoring-time command that takes a URL, fetches its title, description, icon and thumbnail metadata, downloads and optimizes the images into `public/assets/images/icon/` and `thumbnail/` (oversized sources such as the 12 MB GIF thumbnail get resized), and prints a ready-to-paste `<LinkPreview … />`. Runs once while writing, never at build time, so a site going offline cannot break a page. Shares download/optimization code with the converter and image pipeline.
- **Per-image gallery captions** (requested by Kat 2026-10-04, not scheduled). Add an optional `caption` to `Gallery` image records; galleries without it must render unchanged, and the gallery-wide caption stays. Viewer captions are nearly free: pass the value as the link's `data-image-caption`, which `ImageLightbox` already reads (PeopleGrid uses it). Visible captions under each image need a design decision first, because uneven caption lengths break equal-height rows: options are viewer-only, overlaid on the image, or a shared caption band per row. Decide against a real gallery that needs it. No Ghost source gallery uses per-image captions, so the converter does not depend on this.

## Image optimization connection

Follow `image-optimization-plan.md`. Components should centralize media URL handling through existing asset helpers and support eventual optimized display/full-size destinations. Authors should not manually maintain PNG/WebP pairs, responsive variants or manifests. Later migration tooling rewrites component props as well as Markdown, frontmatter and remaining HTML references. Lightbox/download targets must resolve to optimized large images when source PNGs are excluded from deployment; update “Open original” wording at that stage. Preserve archival originals outside the deployed tree. This milestone does not convert/delete media or deploy anything.

## Step 1 status (2026-10-04)

- `Callout` (`color`: blue/yellow, required; optional decorative `emoji`, `aria-hidden`) and `PullQuote` (body only; no attribution prop because no source quote has one) are in `src/components/`. Both output the existing Ghost card classes, so no visual redesign. Added CSS for paragraphs/lists nested inside callout text.
- `1-8-far-from-the-tree-part-2` is now `.mdx`: 14 callouts and 4 pull quotes as components; 62 ordinary quotes, image and Spotify iframe unchanged apart from JSX syntax (self-closed `<img />`, bare `allowfullscreen`). The final follow-up callout uses Markdown paragraphs instead of `<br><br>`.
- Verified against a pre-conversion build: same block counts, heading IDs, link/image URLs, page `<head>`, homepage. The only text differences are smart punctuation now applied inside callouts/quotes (curly quotes, `…`, `–`), matching the rest of the post. Desktop and 390px reviewed with no overflow.
- Feed fix: MDX entries have no `rendered.html`, so `src/utils/feed.ts` fell back to the raw MDX source. It now renders MDX bodies through Astro's container API with the MDX container renderer. All 24 feeds parse and contain rendered callouts. Side effect: Vite prints a harmless `MODULE_LEVEL_DIRECTIVE` warning per `.mdx` entry; all HTML pages are byte-identical with and without the change.
- "GalleryWren:"/"GalleryJohn:" prefixes are in the Ghost export and were preserved.

## Step 2 status (2026-10-04)

- Checked the contract against all published export content first: 10 galleries (all wide, all captioned with plain text, 1–3 rows of 2–3 images, 3 with mixed aspect ratios, no image links) and 151 single images (all regular width, 72 captioned, 5 captions with links/italics). Ghost's export has no flex values; the theme computed them at runtime.
- Contract changes from the draft above: captions are a plain `caption` prop or the component body (for links/italics) rather than a prop only; the per-image caption field was dropped because no source content uses one. `Gallery` defaults to `size="wide"`. Flex is width ÷ height, computed at build time. A flat `rows` list or a non-positive dimension fails the build with a clear message.
- `ContentImage` gained `caption`, body caption, `size` and `fullSize`; existing calls are unchanged (Neighborhoods page byte-identical).
- `2025-03-29-session-notes` is now `.mdx` with `Gallery` and two yellow `Callout`s. Its gallery HTML is identical to the hand-written version; the only page difference is `aria-hidden` on callout emoji. Text, URLs and heading IDs match; feeds render it.
- A temporary fixture (removed) exercised three mixed-ratio rows, adjacent image/gallery cards, uncaptioned cards, wide single images, linked/italic captions and `fullSize`. Equal row heights at 1280px and 390px, no overflow; viewer sequences of 8 and 4 grouped correctly, wrap-around, caption/alt fallbacks, keyboard open, arrows, Escape and focus return all worked.
- MDX pitfall found: a line starting with `>` inside a multi-line tag is parsed as a Markdown quote. Documented in post-authoring.md.

## Step 3 status (2026-10-04)

- Export survey: all 37 Spotify embeds (18 posts) are tracks at height 152 inside `<figure class="kg-card kg-embed-card">`, some with album/playlist `context` query parameters, none captioned. Bookmark cards appear on DM Resources (16) and also on the unmigrated `fgc-characters` page (6), which earlier notes did not mention. No other iframe providers.
- `SpotifyEmbed` (`url`, `title`, optional `height`) accepts share or embed links, keeps the query string and restores Ghost's embed `<figure>` that the 1.8 hand import had dropped. The 1.8 iframe attributes are otherwise identical. Kat's Spotify `border-radius` rule (from her visual QA) was committed with step 3 at her request.
- `LinkPreview` reproduces Ghost's bookmark markup and core bookmark CSS with Leota's dark-mode colors; on narrow screens the thumbnail stacks above the text. Only `url` is required; a missing title falls back to the host name. No fetching at build time.
- DM Resources migrated to `src/content/pages/dm-resources.mdx` with a route and enabled secondary-navigation link. Generated from the export (intro, nine-card Patreon gallery, 16 previews, Bookish Artists paragraph). Rendered text matches the export after punctuation normalization; all 19 external links and seven heading IDs match (one pinned with an HTML heading because Astro's slug for "&" differs). 41 media files copied unchanged from the backup into `public/assets/images/` (cover, `2025/04` cards, `icon/`, `thumbnail/`; 54 MB, untracked) and listed in `dm-resources-media-sources.json`.
- Source empty alt text on the Patreon cards was replaced with "<creator> Patreon card" names derived from filenames and bookmark titles.
- Verified desktop and 390px with no overflow or broken images. Feeds are unaffected (pages are not in feeds).

## Resume point

Step 4 is confirmed: Kat reviewed `post-authoring.md` and accepted it for v1, noting the tradeoffs versus Ghost's editor (manual gallery rows and preview metadata), which the Future enhancements above address. Next candidates: automatic gallery rows, and step 5, the repeatable Ghost converter; the DM Resources generator logic is a starting point. Bulk migration remains a separate reviewed milestone.

## Automatic gallery rows (2026-10-05)

`Gallery` now accepts a flat `images` list, grouping three per row and splitting a final four into two rows of two. Explicit `rows` override automatic grouping. Empty input fails clearly. The session-notes and DM Resources galleries use the simpler syntax with unchanged rendered output. Grouping checks cover zero through ten images and preserve order/input; production build produces 36 pages. Automatic dimensions and per-image captions remain future work.
