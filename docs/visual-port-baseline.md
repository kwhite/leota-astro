# Leota visual port: phase one baseline

Recorded 2026-10-04. Phase one establishes references and the existing runtime baseline. No application source, content, dependencies, or bulk media were changed for this phase.

## Evidence and decisions

Sources: the supplied Leota theme; the Ghost export `game-notes-summaries.ghost.2026-10-03-19-02-04.json` and `routes.yaml` in `/Users/kat/Downloads/here be dragons backup`; the extracted `ghost-media-backup-2026-10-03` directory; current Astro source and local browser rendering. The original site is offline. Exported scripts were inspected as text, not executed or carried into the application.

| Item | Reference | Implementation consequence |
| --- | --- | --- |
| Appearance | User confirms dark mode; both Leota settings groups say Dark | Use Leota dark presentation, not the starter's system-dependent initial appearance |
| Accent | Export: `#572b9e`; user remembers rich bright purple | Preserve exported value initially |
| Heading font | Export: Fira Sans | Replace starter Inter for headings using existing Astro font mechanism |
| Body font | Export: Nunito | Apply to reading content and verify against theme font rules |
| Reading width | Global injected CSS: `.gh-canvas { --content-width: 900px; }` | Override Leota's default 720px reading column |
| Byline | Global injected CSS hides `.article-byline` and `.article-byline-wrap` | Do not recreate the visible byline initially proposed from theme alone |
| Header | Leota settings: Logo on cover, Center aligned, publication cover shown | Reuse Leota header arrangement |
| Feed | Leota settings: Classic | First large card, subsequent classic feed arrangement |
| Hero | Local Leota `partials/article-hero.hbs` | Image, gradient, primary tag, overlaid title and explicit excerpt |
| Recent posts | Leota settings: enabled | Three recent posts is the reference, rather than starter related/previous/next panel |
| Homepage content | `routes.yaml` filters `tag:com-season-1`; user confirms preserving this | Keep CoM Season 1 homepage filter; no schema change required |
| Page behavior | Export contains page-only script moving first content image and first h1 into a hero | Inspect representative page before translating; avoid blindly executing DOM-rewriting code |

The export says `active_theme: casper`, with Light settings for that theme, despite separate Leota Dark settings. The user's confirmed dark appearance and supplied Leota theme resolve the appearance target. Exact live rendering remains unverified without screenshots or saved HTML.

The exported publication title is **Game Notes & Summaries**, with description **All the things I write down from all the games we play.** Here Be Dragons is the project/publication identity in the brief, and the About page title. Preserve this distinction when implementing branding rather than silently substituting text.

Primary navigation, in order:

- City of Mist — `/city-of-mist/`
- Freaky Gray Company — `/the-freaky-gray-company/`
- The Chosen — `/the-chosen/`
- About — `/about/`

Secondary navigation:

- DM Resources — `/dm-resources/`
- RPG Consent Checklist — `/rpg-consent-checklist/`

Only About currently has an Astro page route. Do not present other navigation destinations as working before their pages exist. The Astro starter's social links, Algolia index, subscription form, and analytics configuration are not verified publication integrations. Subscription submits to `/subscribe/`, for which no route exists.

## Media references

All paths below are relative to the extracted media backup.

- Logo exists: `images/2025/01/IMG_0489.png`.
- Icon exists: `images/2024/12/IMG_0423-2.png`.
- Cover original is absent: `images/2026/05/musetta._dramatic_low_angle_looking_up_at_six_silhouetted_figur_8e265eba-592c-4a9d-8900-251bc271583a.png`.
- Cover rendition exists at the same filename under `images/size/w2000/2026/05/`; 1000px, 600px and 300px renditions also exist. Record use of the rendition if copied later; preserve originals and filenames.
- The complex post cover and inline image are distinct existing local files: `raz--1-.webp` and `raz--1--1.webp`.

No bulk media was copied or staged. The repository currently does not ignore dated media; resolve that boundary before bulk import. Do not copy the raw export or subscriber data into source control.

## Build and browser baseline

- Node v24.13.1; pnpm 12.9.1; Astro 7.3.5.
- Existing dev server: `http://localhost:4321/`.
- `pnpm build`: successful; static output; 40 pages plus feeds.
- Initial sandbox build could not resolve Google font metadata. The authorized network-enabled rerun succeeded and copied two font files. This is an environment restriction, not an application failure.
- Remaining warnings: nine missing tag records, each referenced by archive and feed generation: city-of-mist, com-season-1, john, kevin, london, maeve, sergei, wren, session-notes. Populate from export in the content milestone rather than inventing descriptions or normalizing names.
- Kat author reference resolves. The homepage visibly uses the explicit excerpt “Who's your Daddy?”.
- Sample post images render; no broken loaded images detected. No captured warning/error console entries on the inspected post. Spotify playback, full-page links, pagination and lightbox interactions have not been validated.
- Desktop viewport: 1440 × 1000. Mobile viewport: 390 × 844.
- Mobile post metadata is visibly clipped, even though document width equals viewport width (390px). Mobile navigation is also truncated. This needs responsive layout work, not just a document overflow check.
- Existing uncommitted work preserved: package and lockfile edits; untracked sample post, Kat author/avatar, and dated sample media.

Screenshots live outside the repository at:

`/Users/kat/.codex/visualizations/2026/10/04/01a10893-1321-7802-bf00-5bafb3c65e10/baseline/`

Files: `home-desktop.png`, `home-mobile.png`, `post-desktop.png`, `post-mobile.png`. These are captures of the unchanged starter, not the target appearance. The Leota files named screenshots contain artwork, not live page captures.

## Complex-content fidelity findings

The original HTML for **1.8 Far from the Tree, Part 2** contains:

- 66 blockquotes, including four `kg-blockquote-alt` pull quotes.
- 14 blue Ghost callout cards with separate emoji and text.
- One inline image card and one Spotify iframe/embed card.
- 14 h2 headings and 17 h3 headings.
- No script elements in this post's HTML.

The built Markdown body has none of the original alternate-quote or callout classes. Restore these distinctions through targeted portable markup in the content milestone. “GalleryWren” and “GalleryJohn” are present in the original HTML; they are not proven conversion errors and must not be automatically rewritten.

The yarn emoji appears inside a blue investigative callout in this post. This supports a semantic clue/callout treatment, not an invented red-colored widget. Additional yarn examples exist in `2024-01-18-session-notes`, `1-5-when-the-cats-away`, and `1-5-when-the-cats-away-summary`.

The export includes 170 published posts, 14 published pages, and one draft page. Do not bulk-import without explicit publication-status handling. Candidate simple posts include `geoffrey-voice-over` and `voice-over-sergei`; About is an available page candidate, pending inspection of its own structure.

## Next implementation milestone

Port the shared shell and complex post's basic reading presentation, preserving the current collections, schemas, route generation, static output, Markdown convention, and client router.

1. Configure recovered fonts, accent, dark appearance, and reviewed branding assets in the existing configuration/styles.
2. Adapt `Layout.astro`, `SiteNav.astro`, and `Navigation.astro` for the Leota shell and responsive navigation. Resolve missing navigation destinations explicitly.
3. Add a small reusable article hero and adapt `PostLayout.astro`; preserve the hidden byline and use the recovered 900px reading column.
4. Remove starter-specific visible integrations from the prototype through existing configuration where appropriate; do not implement newsletter or search services in this milestone.
5. Compare the same desktop/mobile views, verify no clipped navigation or metadata, and run the build.

Feed/page/archive parity and faithful special-card conversion follow as separate milestones. Ghost-provided card styling is not entirely bundled in the theme; inspect available card assets before claiming exact callout or gallery parity. No full-archive conversion, deployment, email sending, or architecture replacement is part of this phase.
