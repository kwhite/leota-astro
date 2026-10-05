# Editing posts

Posts live in `src/content/posts/`. Use **Markdown (`.md`) for ordinary posts** and **MDX (`.mdx`) when a post needs rich-content components**. Both belong to the same `posts` collection, so frontmatter, URLs, tags, homepage filtering, listings and feeds work the same way. Renaming a post from `.md` to `.mdx` with the same basename keeps its URL.

The same components work in pages; see [page-authoring.md](page-authoring.md) for page-only components and general MDX syntax. [rich-content-authoring-plan.md](rich-content-authoring-plan.md) tracks the components still planned (Spotify, link previews).

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
| `rows` | yes | A list of rows, each a list of images. Even a single row needs the double brackets: `rows={[[ ... ]]}`. |
| `caption` | no | Plain-text caption under the gallery. |
| `size` | no | `"wide"` (default, like Ghost), `"full"` or `"regular"` (reading-column width). |

Image records can also set `fullSize` to open a different, larger file in the viewer than the one displayed. It defaults to `image`.

```mdx
import Gallery from '../../components/Gallery.astro';

<Gallery
  caption="Capt. Billbog Marrow and First Mate Byrne"
  rows={[
    [
      { image: "/assets/images/2025/03/billbog.png", alt: "Capt. Billbog Marrow", width: 1024, height: 1024 },
      { image: "/assets/images/2025/03/byrne.png", alt: "First Mate Byrne", width: 1024, height: 1024 },
    ],
    [
      { image: "/assets/images/2025/03/ship.png", alt: "The Quick Fortune", width: 1456, height: 816 },
    ],
  ]}
/>
```

Ghost galleries use two or three images per row; keep the original grouping when converting. A row given as a flat list (single brackets) stops the build with a message saying so.

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

## Typography and syntax notes

- Text inside components gets the same smart punctuation as the rest of the post: straight quotes become curly, `...` becomes `…`, and `--` becomes `–`. Raw HTML blocks skip this, which is why converted posts may show curlier punctuation than before.
- MDX parses HTML as JSX: self-close void tags (`<img ... />`, `<br />`) and write boolean attributes bare (`allowfullscreen`, not `allowfullscreen=""`, which MDX drops).
- Braces `{ }` start expressions and `<` starts a tag; escape them as `\{` or `&lt;` when they appear in prose. HTML comments `<!-- -->` are not allowed in MDX; use `{/* comment */}`.
- Leave ordinary posts as `.md` unless they need a component.

## Check your changes

Run `pnpm build` and review the post. The build prints a Vite `MODULE_LEVEL_DIRECTIVE` warning for each `.mdx` entry. It comes from the feeds rendering MDX bodies and does not change any page output. If the dev server shows stale content after a `.md`/`.mdx` rename, restart it.
