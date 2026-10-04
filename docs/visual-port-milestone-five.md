# City of Mist campaign pages and reusable banners

Implemented 2026-10-04 after documentation commit `abc8d04`. Implementation is not yet committed.

## Scope and result

Added four standalone page routes using the existing PageLayout and content grid:

- `/city-of-mist/`: original introduction/Spotify embed, 13-row chapter table, Part 2/3 placeholders and Prologue/Season One cards.
- `/neighborhoods-in-the-city/`: original intro, map with download/full-size actions, twelve wide district banners and source descriptions. Incomplete/empty source descriptions are preserved without invented text.
- `/people-in-the-city/`: all 21 people in source order, portrait/name/mythos/neighborhood, and the five original active sheet links. Commented placeholders remain absent; Rogelio's mythos strike-through remains. Wren's incorrect alt text is corrected to her name.
- `/com-system-modifications/`: Rules page included so the campaign navigation is functional. Original prose, tables, lists, callout and heading IDs are retained.

City of Mist is enabled in the main navigation. Shared `CampaignNav.astro` links Overview, Rules, Neighborhoods, People and the existing City of Mist archive with current-page indication. Other unmigrated primary/footer navigation remains inactive. The older Characters page remains separate and unimported.

## Shared cards and data

`ContentBanner.astro` accepts title, image, optional heading ID, description, destination/button label, regular/wide/full width and left/center alignment. It contains no campaign names or tag lookup assumptions. Overview uses regular-width cards with buttons; district sections use wide title-only cards. The supplied Buffy/The Chosen export also uses regular Ghost v2 header cards. Freaky Gray Company's current export instead requests tag teasers using `data-tag="c1-a1,c1-a2"`; its later static page can pass recovered tag metadata into the same component without using the old client Content API.

Data is under `src/data/campaigns/`: ordinary introduction and Rules content are Markdown; overview chapter/card data and People directory are JSON; district JSON holds heading/image and the limited source paragraph HTML to retain emphasis and exact text alongside each banner. This is page-local structured content, not a new content collection or framework. The one-off extraction was not promoted to a production archive converter. No exported scripts or injected styles are executed.

People styles are separate from post-feed/card styles and therefore do not inherit Classic feed lead-card sizing or infinite-scroll behavior. Four columns at desktop, two below 1024px, one at 480px and below. Character names use locally bundled Bebas Neue and labels IBM Plex Mono through existing Astro font configuration; these families follow the export's declared intent (historical loading was uncertain). Some muted/accent text colors were brightened for readability on navy backgrounds.

The existing lightbox now accepts an optional per-image `data-image-caption`; portraits provide name, mythos and neighborhood. Gallery grouping remains the existing behavior. Sheet links are separate from portrait controls and retain their exported external destinations. External sheet availability was not checked.

## Link and media boundaries

Only chapter 1.8 is currently imported. The overview automatically links entries whose post IDs exist; other titles remain plain text with a short availability note. Original target URLs remain in JSON so future imports activate them. The source's unlinked Kings of the Day remains unlinked. Session Summaries uses `/tag/city-of-mist/`; a legacy `/tag/cityofmist/` redirect is still deferred.

All campaign images were already present at canonical local public paths; no images were copied, converted, deleted, or staged. `campaign-media-sources.json` inventories 43 referenced images (including shared branding) with size/checksum. It describes local delivery files, not validated backup provenance. Map download now uses the canonical local map, rather than the backup's w1600 URL. The planned optimization pipeline will produce appropriate delivery variants later. These image-heavy pages currently serve full local assets, so performance/storage optimization remains important.

## Validation

- `pnpm build` passes: 56 pages, no warnings in the final build. Initial sandbox font-fetch failure was resolved by the approved build outside the sandbox.
- `git diff --check` passes.
- All local href/src references on the four generated pages resolve to files/generated routes.
- Rules rendered text matches the export after whitespace/smart-punctuation normalization; source heading IDs match.
- All district headings and nonempty source paragraphs preserved.
- People source names/order, mythos/neighborhood text, and five sheet URLs verified against generated content.
- Browser checks: four-column desktop People layout and single-column 390px mobile layout; all four pages have no horizontal overflow at 390px. Rules tables/lists, mobile district banners and season cards visually reviewed.
- Portrait viewer opens Wren as 21/21 with correct caption, wraps to 1/21 with ArrowRight, and closes with Escape. Shared behavior from the previous milestone remains in use.
- Desktop landing-page and portrait-grid captures, plus mobile portrait/banner/district captures, saved under the existing visualization directory's `milestone-five/` folder.
- Spotify playback had already been confirmed by Kat. Existing embeds are preserved; playback was not re-certified here.

## Remaining

Review the new page layouts with Kat. Next scopes include DM Resources' 16 exported bookmark/link-preview cards, other campaign pages using the shared banner, optional older Characters migration, actual chapter imports, and the image optimization pilot. No deployment or bulk migration occurred.
