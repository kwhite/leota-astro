# Shared shell and post presentation

Implemented 2026-10-04 from the phase-one baseline and user-confirmed dark appearance, CoM Season 1 homepage filter, and temporarily inactive navigation labels.

## Changes

- Configured publication title/description, logo, icon, and cover using recovered settings. The cover's 2000px backup rendition is the fallback when the original is absent; public media retain the dated path and filename convention. No bulk import or staging was performed.
- Configured Fira Sans heading weights 400–800 and Nunito body weights 400/600/700, including body italics, through the existing Astro font provider. Corrected the inherited placement of font weight options: they belong on the font family configuration, not the provider constructor. Fonts are bundled locally by Astro.
- Added `src/styles/leota.css` after the starter styles to keep the port scoped and reviewable. Reading content uses a 900px column inside a 1200px-wide grid; dark surfaces, purple accent, and hero proportions derive from Leota.
- Adapted the existing navigation components and shared layout. A native details menu supports touch, keyboard activation, and Escape with focus restoration. The dark appearance is set in the rendered HTML and survives Astro navigation without a light-mode flash.
- Retained the original navigation labels and stored their eventual URLs in configuration. Unmigrated destinations render as inactive text, as requested. About still links to the existing starter page; real page migration is deferred.
- Added a reusable `ArticleHero.astro`, used by `PostLayout.astro`, with cover image, gradient, primary tag, title, and explicit excerpt. The byline stays hidden, while author/date metadata remain. Replaced the starter author footer, floating bar, and related/previous/next area with the reference's three recent posts using the existing PostCard component.
- Homepage shows the recovered publication cover and logo, and filters the existing post collection by CoM Season 1. Feed card structure is deferred to the next milestone.
- Disabled demo subscription, search, analytics and social configuration. Set the canonical site URL to the existing publication domain; no deployment or DNS changes.

## Verification

- Final `pnpm build` passes: 40 static pages plus feeds; seven font files bundled. Network/local-listener sandbox restrictions required the authorized build outside the sandbox.
- `git diff --check` passes.
- Generated homepage, sample post, and About page reference existing local image/font/script assets; no unavailable navigation destinations are emitted as links and no external script tags remain on those pages.
- Desktop post reading column measured 900px at a 1440px viewport. Mobile measured 350px at 390px and 280px at 320px, with document width equal to viewport width.
- Visually reviewed desktop and mobile homepage and post. Homepage has one card: the one currently imported CoM Season 1 post. Sample cover/logo images render.
- Verified menu click, keyboard Enter, Escape, and focus return. Checked menu behavior after an Astro transition to About and dark appearance after navigation.
- No warning/error entries captured in the inspected post's browser console.
- Existing warnings remain for nine missing tag metadata records. Their archive/feed routes still generate.

Review captures are in `/Users/kat/.codex/visualizations/2026/10/04/01a10893-1321-7802-bf00-5bafb3c65e10/milestone-two/`: `home-desktop.png`, `home-mobile.png`, `post-desktop.png`, `post-mobile.png`.

## Preserved and deferred

Collections, schemas, static route generation, Markdown content, client router, dependency versions and package manager are preserved. Existing package/lockfile changes predate this milestone. Media and content remain unstaged.

Still to do: feed-card and archive parity, actual About/campaign/resource pages, tag metadata, ordinary post/page fixtures, restored callout and pull-quote distinctions, gallery/lightbox behavior, and Spotify playback validation. Recent-post cards currently include starter demo posts. The 404 page still uses its separate starter layout. Exact visual parity cannot be certified without a capture of the old site; this implementation follows the supplied theme and exported settings.
