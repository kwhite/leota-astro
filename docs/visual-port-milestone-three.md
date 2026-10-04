# Feed, archive, and representative page milestone

Completed 2026-10-04. Existing schemas, route patterns, homepage CoM Season 1 filter, and Markdown authoring remain in place.

## Changes

- Cards display only `tags[0]`, preserving its original spelling. All tags remain in frontmatter and continue to generate their archives/feeds.
- Ported Leota's Classic feed arrangement: large first card, two medium cards, then three columns on desktop; two columns on tablet and one on mobile. Replaced background-image cards with image elements and restored date/reading-time metadata, primary tag, explicit excerpt, and the flat dark card treatment.
- Added a shared archive introduction modeled on Leota's large introductory card. Tag/author archive content loading and pagination routes are preserved. The introduction stays outside the scrolling post feed so it cannot be appended twice.
- `PageLayout.astro` now shares the article hero and reading grid, without post dates or tags. `/about/` uses the real published About title, text, and original Unsplash cover URL. The remote cover was verified in the browser; it remains an external dependency.
- Imported **Voice Over: Geoffrey** as the ordinary Markdown post. Its three prose paragraphs, explicit excerpt, original timestamp, cover, author reference, and ordered tags are preserved. Source author relationship resolves to Kat. It does not appear on the homepage because it belongs to CoM Prologue, not CoM Season 1.
- Added eleven tag metadata entries from the backup, resolving the missing-tag build warnings. Existing local media were reused; missing selected assets were copied from the backup only as needed. No bulk migration or staging.
- Added accessible, server-rendered pagination links to homepage, tag, and author listings. Infinite scrolling starts from the actual current page, updates the fallback navigation after loading, aborts on page transitions, and leaves manual links usable after failure.
- Loaded shared feed styles in the existing separate 404 layout so its recommended cards remain styled.

## Source mapping

Export: `/Users/kat/Downloads/here be dragons backup/game-notes-summaries.ghost.2026-10-03-19-02-04.json`.

| Source | Source ID | Destination | Status checked |
| --- | --- | --- | --- |
| Here be Dragons (page) | `67682d3d8ca61b05ca1132bf` | `src/data/about.md` → `/about/` | Published page |
| Voice Over: Geoffrey | `67736073129b71338ac8971c` | `src/content/posts/geoffrey-voice-over.md` → `/geoffrey-voice-over/` | Published post |

Geoffrey's City of Mist and CoM Prologue tag relations both have sort order zero in the export. Their stable export order was retained, leaving City of Mist first, followed by CoM Prologue and Geoffrey.

Tag metadata added: City of Mist, CoM Season 1, CoM Prologue, Geoffrey, John, Kevin, London, Maeve, Sergei, Wren, Session Notes.

**Legacy URL exception:** Ghost's City of Mist tag slug is `cityofmist`; Astro currently derives `city-of-mist` from the name. Metadata is stored under Astro's current ID. Preserve `/tag/cityofmist/` in the later redirect/legacy-link plan; no route redesign or redirect has been introduced here. The other ten imported tag slugs match their current derived routes.

## Verification

- `pnpm build` passes: 43 pages and 24 well-formed XML feeds, with no warnings.
- `git diff --check` passes.
- All local image/font/script/stylesheet asset references found in generated HTML resolve in `dist`.
- Homepage has one card and exactly one tag label, **City of Mist**. The simple imported post correctly stays outside its season filter.
- Reviewed homepage, About, City of Mist archive, Kat author archive, and ordinary post. Mobile checks at 390px found no horizontal document overflow for homepage, tag archive, About, or ordinary post. Ordinary post renders three body paragraphs with no broken loaded images.
- Temporarily set page size to two to exercise real generated pagination with the starter's seven Getting Started posts. Opening `/tag/getting-started/page2/` rendered the correct two posts and next/previous links. Scrolling appended page three's two distinct posts, retained one archive heading, and advanced the pagination indicator to page three. **Page size restored to 25.**
- Restarted the existing local dev server on port 4321 after Vite cached an import failure for newly created components; the preview now renders normally.

Review images are saved outside the repository at `/Users/kat/.codex/visualizations/2026/10/04/01a10893-1321-7802-bf00-5bafb3c65e10/milestone-three/`.

## Remaining work

Restore the complex post's callouts and alternate pull quotes from original HTML; exercise gallery/lightbox and embed behavior with suitable samples. Campaign/resource navigation labels remain inactive until those pages are migrated. Starter posts remain available on their original routes and can still appear in recent-post suggestions. Full-archive import, redirects, bulk media storage, email, and deployment remain separate work.
