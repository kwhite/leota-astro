# Editing posts

Posts live in `src/content/posts/`. Use **Markdown (`.md`) for ordinary posts** and **MDX (`.mdx`) when a post needs rich-content components**. Both belong to the same `posts` collection, so frontmatter, URLs, tags, homepage filtering, listings and feeds work the same way. Renaming a post from `.md` to `.mdx` with the same basename keeps its URL.

The same components work in pages; see [page-authoring.md](page-authoring.md) for page-only components and general MDX syntax. [rich-content-authoring-plan.md](rich-content-authoring-plan.md) tracks the components still planned (galleries, Spotify, link previews).

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

## Typography and syntax notes

- Text inside components gets the same smart punctuation as the rest of the post: straight quotes become curly, `...` becomes `…`, and `--` becomes `–`. Raw HTML blocks skip this, which is why converted posts may show curlier punctuation than before.
- MDX parses HTML as JSX: self-close void tags (`<img ... />`, `<br />`) and write boolean attributes bare (`allowfullscreen`, not `allowfullscreen=""`, which MDX drops).
- Braces `{ }` start expressions and `<` starts a tag; escape them as `\{` or `&lt;` when they appear in prose. HTML comments `<!-- -->` are not allowed in MDX; use `{/* comment */}`.
- Leave ordinary posts as `.md` unless they need a component.

## Check your changes

Run `pnpm build` and review the post. The build prints a Vite `MODULE_LEVEL_DIRECTIVE` warning for each `.mdx` entry. It comes from the feeds rendering MDX bodies and does not change any page output. If the dev server shows stale content after a `.md`/`.mdx` rename, restart it.
