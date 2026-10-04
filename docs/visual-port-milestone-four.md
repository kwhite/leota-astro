# Callouts, quotes, and galleries

Completed 2026-10-04. Astro collections, Markdown authoring, homepage season filter, and route patterns are preserved.

## Restored content

- The 1.8 session post now contains its original 14 blue callouts and four alternate pull quotes. Its 62 ordinary blockquotes retain their separate purple-rule treatment. The yarn-board clue remains the original blue investigative callout, with its yarn emoji; no invented red-card design.
- Special blocks use deliberate portable HTML inside `.md`; ordinary prose remains Markdown. Redundant Ghost editor attributes and nested bold/italic wrappers were removed while preserving emphasis and line breaks.
- Imported published post `2025-03-29-session-notes`, source ID `67e95de65299ad039dcd69eb`, as the gallery sample. Original title, date, excerpt, author Kat, tag order, two-image order, caption, and two yellow callouts are retained. Image alternative text uses the names in the original caption. The sample is outside CoM Season 1 and therefore outside the homepage.
- Added the sample's eight missing tag records and selected missing media from the supplied backup. No bulk import, staging, or deployment.
- D&D exposed a difference between Astro's generated collection ID and the existing name-derived route. Tag archive/feed metadata now matches the tag name using the existing route normalization. URLs and schemas are unchanged. Legacy Ghost tag slug mapping remains migration work.

## Presentation and interaction

`src/styles/leota.css` combines supplied Leota typography with Ghost's core card treatments: blue/yellow translucent backgrounds, serif callout text, centered serif pull quotes, proportional gallery rows, and captions. Reference core CSS: https://github.com/TryGhost/Ghost/tree/main/ghost/core/core/frontend/src/cards/css (callout.css, blockquote.css, gallery.css; Ghost Foundation, MIT). These are source-derived approximations, not a live-site pixel comparison.

`ImageLightbox.astro` is shared by post/page layouts. A native dialog provides image sequence/caption/counter, previous/next buttons, left/right keys, Escape and close button, background-click closing, focus cycling, focus return, and scroll locking. Consecutive image/gallery cards form one sequence, matching the theme's grouping. Isolated images omit previous/next controls. Lifecycle listeners clean up on Astro page changes. Original-image links preserve access without JavaScript and offer full-resolution viewing. This is a lightweight replacement for PhotoSwipe; drag/swipe and pinch-zoom gestures are not implemented.

## Authoring conventions

- Ordinary quotation: Markdown `> quotation`.
- Pull quote: `<blockquote class="kg-blockquote-alt">Quotation</blockquote>`.
- Callout: `<aside class="kg-card kg-callout-card kg-callout-card-blue"><div class="kg-callout-emoji">🔎</div><div class="kg-callout-text">Text with <strong>emphasis</strong>.</div></aside>`. Blue and yellow are the currently exercised variants. Use HTML emphasis inside HTML blocks, not Markdown markers.
- Gallery: copy the sample's figure/container/row/image structure. Each image is wrapped in a direct image link with an accessible name. Preserve width/height and assign each `.kg-gallery-image` a `flex` value equal to width divided by height, keeping proportions available without JavaScript. A new row uses another `.kg-gallery-row`. Add `kg-card-hascaption` when there is a caption; `kg-width-wide` and `kg-width-full` use the existing content grid.
- Standalone zoomable image: figure with `kg-card kg-image-card`, direct image link, and dimensioned image. Ordinary Markdown images remain supported and do not automatically become lightbox items.

## Verification

- Production build: 52 pages; final run without warnings. `git diff --check` passes.
- Compared rendered special-block text with export: every callout and pull quote matches, in order. Compared the complete long-post body after normalizing existing smart punctuation: no text differences. Gallery sample body matches the source text, including caption and emphasis.
- All generated local `/assets/` image references resolve.
- Browser: desktop gallery, mobile gallery viewer, mobile callout and quote layouts reviewed; 390px layouts have no horizontal overflow.
- Verified keyboard Enter opens images, arrow-right changes image, next wraps from two to one, Escape closes and returns focus, explicit close works, Tab/Shift+Tab cycle inside the dialog. Single-image viewer shows `1 / 1` with navigation hidden. Repeated navigation/reload still initializes correctly.
- Direct image links and static gallery layout are present in generated HTML as the no-JavaScript fallback; a separate JavaScript-disabled browser run was not performed.
- Existing Spotify iframe is preserved; playback was not retested in this milestone.

Screenshots: `/Users/kat/.codex/visualizations/2026/10/04/01a10893-1321-7802-bf00-5bafb3c65e10/milestone-four/`.
