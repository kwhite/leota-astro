# Editing posts

Posts live in `src/content/posts/`. Use **Markdown (`.md`) for ordinary posts** and **MDX (`.mdx`) when a post needs rich-content components**. Both belong to the same `posts` collection, so frontmatter, URLs, tags, homepage filtering, listings and feeds work the same way. Renaming a post from `.md` to `.mdx` with the same basename keeps its URL.

The same components work in pages; see [page-authoring.md](page-authoring.md) for page-only components and general MDX syntax. [rich-content-authoring-plan.md](rich-content-authoring-plan.md) records the component plan and future enhancements.

## Import components once

Put imports after the closing frontmatter `---`, separated by a blank line. Paths are relative to the post file.

```mdx
---
title: "1.8 Far from the Tree, Part 2"
date: "2026-09-11T23:28:20.000Z"
author: "kat"
tags:
  - City of Mist
---

import Callout from '../../components/Callout.astro';
import PullQuote from '../../components/PullQuote.astro';

Ordinary Markdown continues here.
```

## Callout

Colored aside card with an optional emoji.

| Prop | Required | Values |
| --- | --- | --- |
| `color` | yes | `"blue"` or `"yellow"` |
| `emoji` | no | Any emoji. It is decorative and hidden from screen readers; put meaningful emoji in the text instead. |

**Short callouts** fit on one line. The text renders as-is, with no paragraph wrapper; Markdown emphasis and links work.

```mdx
<Callout color="blue" emoji="🔎">Do they know about **him**? And what about Dr. Leyland?</Callout>
```

**Longer callouts** put the opening and closing tags on their own lines with **blank lines inside**. The body can then hold several paragraphs, lists and hard line breaks (`<br />` at the end of a line).

```mdx
<Callout color="blue" emoji="💡">

**FOLLOW UP ITEMS - CENTRAL DOME**<br />
We need a crystal sample to tune the ray gun.

We need to decide if we are staying tonight.

- Ask about the map.
- Find the gift shop.

</Callout>
```

Without the inner blank lines, MDX treats the body as a single line of text and Markdown paragraphs or lists will not form.

## PullQuote

Large centered serif quote, for the alternate quote style. Ordinary quotations stay as Markdown `>` blockquotes.

```mdx
<PullQuote>This was your tank.</PullQuote>
```

Multi-paragraph pull quotes use the same blank-line block form as callouts.

## Gallery

Rows of images that share a height within each row, with the shared image viewer. Every image record needs `image`, `alt`, and numeric `width` and `height` (the file's pixel size). The component works out the proportions; never add `flex` values yourself.

| Prop | Required | Notes |
| --- | --- | --- |
| `images` | unless using `rows` | A flat list of images, grouped automatically in source order. |
| `rows` | no | Overrides `images` with explicit grouping. Each row is a list: `rows={[[ ... ]]}`. |
| `caption` | no | Plain-text caption under the gallery. |
| `size` | no | `"wide"` (default, like Ghost), `"full"` or `"regular"` (reading-column width). |

Image records can also set `fullSize` to open a different, larger file in the viewer than the one displayed. It defaults to `image`.

```mdx
import Gallery from '../../components/Gallery.astro';

<Gallery
  caption="Capt. Billbog Marrow and First Mate Byrne"
  images={[
      { image: "/assets/images/2025/03/billbog.png", alt: "Capt. Billbog Marrow", width: 1024, height: 1024 },
      { image: "/assets/images/2025/03/byrne.png", alt: "First Mate Byrne", width: 1024, height: 1024 },
      { image: "/assets/images/2025/03/ship.png", alt: "The Quick Fortune", width: 1456, height: 816 },
  ]}
/>
```

Automatic rows use up to three images. If that would leave one image on the last row, the last four become two rows of two: four images → 2 + 2; seven → 3 + 2 + 2. One or two images form a single row. Use `rows` to preserve a deliberate source grouping; existing explicit rows keep their layout. Empty galleries or a row given as a flat list stop the build with a clear message.

## ContentImage

A single image that opens in the viewer.

| Prop | Required | Notes |
| --- | --- | --- |
| `image`, `alt`, `width`, `height` | yes | As for gallery images. |
| `caption` | no | Plain-text caption. |
| `size` | no | `"regular"` (default), `"wide"` or `"full"`. |
| `fullSize` | no | Larger file to open in the viewer; defaults to `image`. |
| `download`, `downloadLabel` | no | Adds a download link to the caption (used by the City of Mist map). |
| `openLabel` | no | Screen-reader label for the link; defaults to "Open <alt> in full size". |

```mdx
import ContentImage from '../../components/ContentImage.astro';

<ContentImage image="/assets/images/2025/03/ship.png" alt="The Quick Fortune" width={1456} height={816} caption="Leaving port" />
```

**Formatted captions.** For a caption with links or italics, put it in the component body instead of `caption`. This also works for `Gallery`.

```mdx
<ContentImage image="/assets/images/2025/03/ship.png" alt="The Quick Fortune" width={1456} height={816}>The *Quick Fortune* leaves port</ContentImage>
```

If the props span several lines, end the last prop line with `>` rather than starting a new line with it. MDX reads a line beginning with `>` as a Markdown quote and fails with "Unexpected character after `<`".

```mdx
<Gallery
  rows={[[ ... ]]}>
  Caption with a [link](https://example.com)
</Gallery>
```

**Viewer grouping.** Images and galleries placed directly after one another, with nothing between them, open as one sequence in the viewer. Any paragraph or heading between them starts a new sequence. Each image shows its card's caption in the viewer, or its alt text when there is no caption.

## SpotifyEmbed

A Spotify player. Paste the link from Spotify's **Share → Copy link** (or an existing embed link); the component converts it and keeps its query string.

| Prop | Required | Notes |
| --- | --- | --- |
| `url` | yes | An `open.spotify.com` link to a track, album, playlist, episode, show or artist. Anything else stops the build with a message. |
| `title` | yes | Track or album name; the player's accessible title becomes "Spotify Embed: <title>". |
| `height` | no | Defaults to `152`, the compact track player every existing embed uses. Albums and playlists look better at `352`. |

```mdx
import SpotifyEmbed from '../../components/SpotifyEmbed.astro';

<SpotifyEmbed url="https://open.spotify.com/track/5jkFvD4UJrmdoezzT1FRoP?si=2900092d66884167" title="Rasputin" />
```

## LinkPreview

A static bookmark card for an external link: title, description, small icon, author/publisher and thumbnail. Nothing is fetched at build time; supply whatever you have. Only `url` is required: without a `title`, the card shows the site's host name.

| Prop | Notes |
| --- | --- |
| `url` | Destination (required). |
| `title`, `description` | Card text. Long descriptions are clipped to two lines. |
| `icon`, `thumbnail` | Image paths, usually under `/assets/images/icon/` and `/assets/images/thumbnail/` for imported Ghost bookmarks. |
| `author`, `publisher` | Shown after the icon, separated by a bullet when both exist. |
| `caption` | Plain-text caption; use the component body for links or italics, as with images. |

```mdx
import LinkPreview from '../../components/LinkPreview.astro';

<LinkPreview
  url="https://www.tomcartos.com"
  title="Tom Cartos"
  description="TTRPG Battlemaps, Assets, Tokens & Adventure."
  author="Tom Cartos"
  icon="/assets/images/icon/favicon-8.ico"
  thumbnail="/assets/images/thumbnail/TC_Banner-Wide.jpg"
  caption="Another map maker who does good generic things."
/>
```

If a prop value contains a double quote, `&` or braces, write it as an expression instead: `description={"Tokens & Adventure"}`.

## Keeping a heading's link ID

Markdown headings get IDs automatically, used for links like `/dm-resources/#maps`. Ghost made some IDs differently (for example it dropped `&`). To keep an old ID, write that heading as HTML:

```mdx
<h2 id="magic-items-monsters">Magic Items &amp; Monsters</h2>
```

## Typography and syntax notes

- Text inside components gets the same smart punctuation as the rest of the post: straight quotes become curly, `...` becomes `…`, and `--` becomes `–`. Raw HTML blocks skip this, which is why converted posts may show curlier punctuation than before.
- MDX parses HTML as JSX: self-close void tags (`<img ... />`, `<br />`) and write boolean attributes bare (`allowfullscreen`, not `allowfullscreen=""`, which MDX drops).
- Braces `{ }` start expressions and `<` starts a tag; escape them as `\{` or `&lt;` when they appear in prose. HTML comments `<!-- -->` are not allowed in MDX; use `{/* comment */}`.
- Leave ordinary posts as `.md` unless they need a component.

## Check your changes

Run `pnpm build` and review the post. The build prints a Vite `MODULE_LEVEL_DIRECTIVE` warning for each `.mdx` entry. It comes from the feeds rendering MDX bodies and does not change any page output. If the dev server shows stale content after a `.md`/`.mdx` rename, restart it.
