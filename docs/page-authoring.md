# Editing standalone pages

Page content lives in `src/content/pages/`. Use **Markdown (`.md`) for simple pages** and **MDX (`.mdx`) when you want reusable components between paragraphs**. Both belong to the same validated `pages` collection. Posts remain in `src/content/posts/` and alone populate post listings/feeds.

| File | Content |
| --- | --- |
| `city-of-mist.mdx` | Intro, chapter list/table, story headings and season banners |
| `neighborhoods-in-the-city.mdx` | Intro, downloadable map, district banners and Markdown descriptions |
| `people-in-the-city.mdx` | People data in frontmatter and a movable directory component |
| `com-system-modifications.md` | Rules prose, tables and callouts |
| `about.md` | About title, cover and prose |
| `dm-resources.mdx` | Intro, Patreon card gallery and link previews grouped under headings |

## Compose a page in the body

Frontmatter between the initial `---` delimiters holds page metadata (`title`, `cover`, optional `description` and provenance `sourceId`). The MDX body starts after the closing delimiter. Import components once near the top of the body, then place them wherever you want. Moving a component call moves its output; nothing in the route template fixes the table, map, banners or People grid to a particular body location.

```mdx
---
title: Example campaign
cover: /assets/images/2026/05/example.webp
---

import ContentBanner from '../../components/ContentBanner.astro';

## Our story

Write ordinary Markdown here.

<ContentBanner
  title="Prologue"
  image="/assets/images/2026/06/coffeeshop-prologue2-1.webp"
  description="How it all began."
  href="/tag/com-prologue/"
  label="Read Summaries"
/>

More prose, another heading, or another card can follow.
```

The example metadata is illustrative; use real existing media for a new page. No React installation, client hydration, or CMS is required. Components render through Astro at build time.

## Available components

**Callout**, **PullQuote**, **Gallery**, **ContentImage**, **SpotifyEmbed** and **LinkPreview** are shared with posts; see [post-authoring.md](post-authoring.md) for their props and examples. The page components below are also available now.

- **ContentBanner**: `title`, `image`, optional heading `id`, `description`, `href`/`label`, `width` (`regular`, `wide`, `full`) and `align` (`left`, `center`). Content lives directly on the call. Preserve existing IDs when moving banners so deep links keep working.
- **ChapterTable**: `<ChapterTable chapters={frontmatter.chapters} />`. The chapter array stays in YAML to make a long list easy to maintain; the call chooses its location. Optional `chapterLabel` and `titleLabel` change column headings. Each entry has `chapter` (a quoted string), `title`, and `href` (or `null` for intentionally unlinked titles). Links activate only when corresponding posts exist.
- **PeopleGrid**: `<PeopleGrid people={frontmatter.people} label="People in The City" />`. Source order is display order. Each person has `name`, `image`, dimensions, optional/null `mythos`, `neighborhood`, `sheet`, and `mythosStruck`. The grid includes its styles/fonts and the existing portrait-lightbox hooks.
- **ContentImage**: image URL, alt text, numeric width/height; optional `caption`, `size`, `fullSize`, `download`, `downloadLabel`, and `openLabel` (full reference in [post-authoring.md](post-authoring.md)). Supplies a zoomable image and optional caption/download link. Used for the city map.

Structured datasets can stay in frontmatter without controlling placement. The collection validates the existing `chapters` and `people` arrays; small card/map values are props at their position in the body. Components' prop interfaces document those values, while visual/content checks remain necessary.

## MDX editing details

- Use ordinary Markdown for headings, paragraphs, lists and emphasis. Neighborhood descriptions are no longer HTML strings in YAML.
- Components use self-closing tags (`<ContentBanner ... />`) or matched opening/closing tags. Keep blank lines between Markdown and component blocks.
- String props can be `title="Prologue"`; numbers/expressions use braces, e.g. `width={2000}` or `chapters={frontmatter.chapters}`. Generated `title={"Prologue"}` is equivalent to the simpler quoted form.
- MDX treats braces as expressions and HTML-like tags as JSX. Escape literal braces/angle brackets in prose when needed, and close HTML tags. This is why existing ordinary posts and Rules remain `.md` unless components are needed.
- Existing page headings and the campaign subnavigation remain supplied by PageLayout/CampaignNav. `campaignSection` selects the current navigation item. Everything specific to the page's body is authored in its content file.
- Existing routes in `src/pages/*.astro` load and render entries. Adding a new content file does not automatically create its route; add a corresponding route/template as part of migrating that page. Existing URLs are unchanged.

Run `pnpm build` and review the affected page after editing. If the dev server retains stale collection entries after a `.md`/`.mdx` rename or integration change, restart that project's preview. Media paths and the separate optimization plan are unchanged.

Official integration reference: https://docs.astro.build/en/guides/integrations-guide/mdx/
