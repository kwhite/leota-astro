# City of Mist page layout review

Reviewed the supplied content export and Leota sources on 2026-10-04. Inspection only; no page implementation, conversion, or navigation activation performed. Original site remains unavailable, so layout intent is distinguished from verified historical rendering.

## Source pages

All four are published, public Ghost pages with no custom template selected.

| Export slug | Title | Special layout |
| --- | --- | --- |
| city-of-mist | City of Mist | Campaign subnavigation, Spotify, chapter table, two image-backed header cards |
| neighborhoods-in-the-city | Navigating The City | Campaign subnavigation, downloadable map, twelve wide image-backed district banners |
| people-in-the-city | People in The City | Campaign subnavigation and custom 21-person portrait grid |
| city-of-mist-characters | City of Mist Characters | Older character gallery page, eight individual portraits, doodle gallery; not linked by active campaign subnavigation |

The user's Districts/Locations page corresponds to `neighborhoods-in-the-city` in this export. People links to `people-in-the-city`; the older Characters page is distinct and should not silently replace it.

## Shared campaign navigation and heroes

Overview, Rules, Neighborhoods, People, Session Summaries are active links in the exported HTML. Characters is inside an HTML comment on the three current campaign pages. These are content-level links, not evidence of a dropdown under the main navigation item.

Global injected `.section-nav` CSS provides a wrapping horizontal row, top/bottom borders, uppercase small semibold links, muted text and purple hover. Build this once as a scoped shared campaign navigation component; preserve destination order and add current-page indication. Rules targets `/com-system-modifications/`; Session Summaries targets legacy `/tag/cityofmist/`, requiring the existing `city-of-mist` route/redirect decision. Do not activate missing destinations without addressing their availability.

The three current pages enable `show_title_and_feature_image`; the older Characters page disables it. Leota `page.hbs` conditionally renders `article-hero` using that flag. Astro's existing PageLayout always renders a hero, so older Characters needs a deliberate page-level exception if migrated. The exported generic page-hero DOM-rewriting script requires a body h1; none of these four bodies has one, so it is not a reason to move their first content image into a second hero.

## City of Mist overview

- Spotify “Human” embed, 152px high, followed by introductory prose.
- Our Story: Part 1 “Manifest Destiny” has a two-column Chapter/Title table with 13 rows. Twelve chapter titles are linked; Kings of the Day is unlinked. Part 2 “The Harvest” and Part 3 “Jus in Bello” deliberately say the chapter list is coming soon.
- Two Ghost v2 header cards, regular content width: Prologue and Season One. Both have background imagery, centered white heading/subheading and accent “Read Summaries” buttons pointing to their tag archives.
- Preserve table readability and horizontal overflow handling on narrow screens. Implement header cards as a reusable site-wide presentation; the current Astro port does not yet style these Ghost v2 cards. Kat confirms the same treatment is used for arc/season tag destinations across Buffy/The Chosen, Freaky Gray Company, and City of Mist. Scope its CSS to the card component, not to one campaign.
- Most chapter targets have not yet been imported. Preserve the source mapping and report unavailable destinations instead of declaring this hub fully functional after copying its HTML.

## Neighborhoods / locations

- Introductory paragraph and a captioned city map. The caption's Download here link targets a w1600 JPEG rendition, distinct from the body image's original path. Preserve the download action when optimizing assets; cartographic text requires a legibility check.
- Twelve wide, centered-title Ghost v2 header cards: La Colonia de Sombras, Lakeside Drive, Fritzberg, Happyville, Fortune Row, Chinatown, Campus, Old Quarter, Independence, Miller's Square, Tourist Trap, Downtown.
- Prose follows the banners, including bold labels such as Best place to eat, Neighborhood pride, and Neighborhood shame. Preserve the wide-image/normal-reading-width alternation and heading IDs.
- Chinatown, Campus, Old Quarter and Downtown lack descriptive prose in the export; Independence is visibly unfinished. These are source-content gaps, not conversion failures. Do not invent missing descriptions.

## People directory

The body is custom HTML: `.post-feed.kg-width-wide.kg-card.kg-gallery-card` containing 21 `.post-card` blocks. Each contains a dimensioned portrait and `.com-card__info` footer with name, optional Rift/mythos, neighborhood and optional sheet link. Portrait dimensions are declared as 1792×2688 (2:3). Preserve source order and optional fields.

Styling is primarily in global Ghost code injection, not the Leota template files:

- Navy `#080d1a` footer, pale name text, pink `#ff2d78` mythos labels, blue `#1a9fff` sheet buttons, muted neighborhood text and thin blue border.
- Names specify Bebas Neue; mythos/sheet labels specify IBM Plex Mono. The injection also imports IBM Plex Sans, but the inspected footer rules do not explicitly apply it. The `@import` occurs after other CSS rules, so actual historical font loading is uncertain. Do not claim those fonts definitely rendered on the old site; use the declared design intent for a reviewable port.
- Per-page head injection says “force 4-up grid” at 1024px+, using eight CSS grid tracks with the theme's card spans. Its `<style>` tag is not closed in the exported string. Recreate valid scoped CSS rather than carrying this injection forward verbatim.
- Three portraits have empty shine/overlay elements; no corresponding effect rules were found in the inspected global CSS or Leota source. Do not invent animation solely from class names.
- Five active external character-sheet links: John, Kevin, London, Maeve, Sergei. Six more sheet links are commented placeholders; never activate them. External sheet availability was not checked during this local export review.
- Preserve Rogelio's struck-through mythos. Wren's portrait incorrectly has alt="Sergei Petrov" in the source; correct to Wren when migrating. The older Characters page also contains different historical mythos information (for example London); do not merge versions as if they were interchangeable.

Use a dedicated People grid/card treatment rather than inheriting generic post-feed behavior. Otherwise the current Classic feed's large lead card, metadata, or infinite-scroll assumptions could leak into this directory. Store people as simple portable page data/markup; a new CMS or collection architecture is not required.

Legacy `.kg-gallery-image > img` hooks make portraits candidates for the theme lightbox. The current Astro viewer instead requires image anchors, and derives captions from figure captions/alt text. Migration must deliberately add accessible image links and meaningful per-person viewer captions while keeping character-sheet links separate. Test portrait grouping/order and keyboard/touch access; do not assume the gallery milestone already covers this custom markup.

## Older Characters page

Two wide galleries each contain eight images in 3/3/2 rows: the original heroes and coffee-cup doodles. Eight individually captioned image cards sit between them. Total: 24 body images, with mixed portrait/landscape ratios. Preserve captions and the external mythology link in London's caption. This is a useful multirow/mixed-ratio gallery test, but the current subnavigation explicitly comments out its Characters link. Keep it distinct unless Kat requests consolidation/removal.

## Media findings and optimization implications

Checked image `src` references plus feature images against the extracted backup and local public media. Every referenced image in the three current pages has a same-filename candidate across those two sources. Many exact original paths are absent from the backup but have resized alternatives; some People portraits exist locally without a same-filename backup copy. This is an inventory result, not checksum/provenance validation. Preserve/reconcile these local files before cleanup.

Counts (body plus feature where applicable): Overview has two body images and a cover; Neighborhoods has thirteen body images and a cover; People has 21 portraits and a cover. PNG reference counts across those sets are 2, 13 and 14 respectively. The older Characters page has eight PNG doodles among its 24 body images, plus an external Unsplash cover that is disabled by its page setting.

The image pipeline must understand existing `images/size/w1600/...` inputs, not just originals. Record which source/rendition was actually used, avoid upscaling smaller substitutes, check map legibility, and update banner backgrounds, portrait links and download references along with ordinary images. Do not remove source copies until retained originals are safely accounted for and optimized delivery references validated.

## Proposed migration unit

1. Resolve the page/media inventory and relevant missing-link targets.
2. Add scoped campaign subnavigation and a reusable, extensible Ghost v2 banner/header-card presentation using the existing PageLayout/content grid. Inspect arc/season examples across all three campaigns; support content-driven image, title, optional description, destination/button label and the width/alignment variants actually used. Do not hardcode campaign or tag names.
3. Port Overview and Neighborhoods with original slugs, headings, table, map/download and prose.
4. Port the People directory with explicit grid/card styling and accessible lightbox/sheet-link behavior. Keep older Characters separate.
5. Exercise the optimization pilot on banners, portraits and the map; validate mobile/desktop layout and content/link fidelity before enabling the campaign navigation.

This review adds requirements to the plan; it does not begin migration or approve consolidation of historical pages.

## Subsequent user verification and embed scope

Kat confirms Spotify embeds work correctly. The only other rich-embed type in use is the link-preview treatment on DM Resources; inspect those exported cards as the remaining embed requirement. Historical milestone notes about unverified Spotify playback describe the earlier state.
