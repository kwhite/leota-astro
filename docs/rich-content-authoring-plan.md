# Rich content authoring with MDX

Planned 2026-10-04. Kat requested planning/documentation only for this session; implementation is the next proposed milestone. These components do not exist yet unless explicitly identified below as existing.

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
4. **Authoring guide and acceptance.** Add `docs/post-authoring.md` with tested, copyable examples, component props/defaults, gallery data examples and MDX pitfalls; cross-link the page guide. Offer the same components for Rules and other pages as they are migrated. Review representative desktop/mobile output with Kat before bulk conversion.
5. **Repeatable migration.** Teach the later Ghost converter to emit Markdown for simple entries and MDX imports/component calls for supported rich cards. Deduplicate imports, safely serialize props/escape MDX syntax, preserve source metadata and content order, and report unsupported cards for review. Keep a dry-run/source mapping and collision checks. Never execute exported scripts or import source account settings. Bulk migration remains a separate reviewed milestone.

## Verification and acceptance

- Build succeeds; renamed entries retain routes, metadata, tag ordering, listing/feed behavior and the CoM Season 1 homepage filter. Check generated RSS/XML content as well as page rendering.
- Compare baseline and converted text, emphasis, heading IDs, image order, captions, URLs and rich-block counts. No silently dropped content from JSX parsing or slot whitespace.
- Mobile/desktop callouts, pull quotes and galleries keep accepted appearance without overflow. Test meaningful Markdown nesting rather than only one-line text.
- Verify gallery opening, sequencing, next/previous, Escape, focus return, Astro navigation cleanup and direct-image behavior without JavaScript. Preserve current behavior; swipe/pinch remains separate scope.
- Confirm image dimensions/alt text and missing-preview fallbacks. Rich blocks render statically except existing lightbox behavior and third-party Spotify content.
- Run targeted checks and `pnpm build`; do not add a broad test framework solely for presentational wrappers.

## Image optimization connection

Follow `image-optimization-plan.md`. Components should centralize media URL handling through existing asset helpers and support eventual optimized display/full-size destinations. Authors should not manually maintain PNG/WebP pairs, responsive variants or manifests. Later migration tooling rewrites component props as well as Markdown, frontmatter and remaining HTML references. Lightbox/download targets must resolve to optimized large images when source PNGs are excluded from deployment; update “Open original” wording at that stage. Preserve archival originals outside the deployed tree. This milestone does not convert/delete media or deploy anything.

## Resume point

Start with step 1 after Kat resumes implementation. No new dependencies appear necessary: the MDX integration and both loaders are already configured. The current request ends with this plan and docs; no application code, content conversion, commit, push or deployment is included in this planning session.
