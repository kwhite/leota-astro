# Campaign appearance

Appearance is set per campaign with **skins**. A skin is a palette (light/dark base, accent, text color on the accent) plus optional CSS and fonts. Everything is configured in `src/config.ts`; change the settings, rebuild, and publish through the normal pull-request workflow. It is not a visitor preference.

## Skins

`SKINS` in `src/config.ts` lists the available skins:

```ts
export const SKINS = {
  leota: { label: 'Leota (dark purple)', theme: 'dark', accentColor: '#572b9e', accentTextColor: '#ffffff' },
  blades: { label: 'Blades in the Dark', theme: 'dark', accentColor: '#ff5a1f', accentTextColor: '#0e0e0e' },
  com: { label: 'City of Mist', theme: 'dark', accentColor: '#572b9e', accentTextColor: '#ffffff' },
  chosen: { label: 'The Chosen', theme: 'dark', accentColor: '#cda349', accentTextColor: '#0a2629' },
};
```

`accentTextColor` controls navigation, button and skip-link text on accent backgrounds. The site does not choose a contrasting color automatically: a pale or bright accent needs dark text. The Blades orange is one of these (white on `#ff5a1f` is about 3.1:1; ink is about 6.2:1).

## Which skin a page uses

The layout resolves one skin per page (`resolveSkin` in `src/config.ts`) and sets it as `data-skin` on `<html>`:

1. **Campaign pages** pass their `campaign` frontmatter (`src/content/pages/*.md`) to the layout, and get that campaign's skin.
2. **Posts** are matched by tag: the first tag that equals a campaign's `tag` picks the campaign. Tags compare as archive slugs, so `Rite and Riot` and `rite-and-riot` are the same.
3. **Tag archives** use the campaign whose `tag` they are. Other archives (seasons, arcs) use the campaign their posts belong to, when every post agrees; archives spanning campaigns, such as Session Recaps, use the default.
4. **Everything else** (home, About, Resources, untagged posts) uses `SITE_CONFIG.skin`, currently `com` because City of Mist is the current campaign.

Each campaign in `CAMPAIGN_NAVIGATION` names its skin and archive tag:

```ts
'rite-and-riot': {
  skin: 'blades',
  tag: 'rite-and-riot',
  label: 'Rite and Riot',
  links: [ ... ],
},
```

Posts that belong to a campaign but should stay out of its summary archive (for example Freaky Gray Company's Wildemount location guides, tagged only Feolinn, Kamordah or Zadash) are listed by tag in the campaign's `otherTags`:

```ts
'freaky-gray-company': {
  skin: 'leota',
  tag: 'freaky-gray-company',
  otherTags: ['feolinn', 'kamordah', 'zadash'],
  ...
},
```

To move a campaign to another skin, change its `skin`. To change the site default, change `SITE_CONFIG.skin`.

## Adding a skin

1. Add an entry to `SKINS`.
2. If it needs more than a new accent, add `src/styles/skins/<id>.css`, scope every rule to `html[data-skin="<id>"]`, and import it in `src/layouts/Layout.astro`. Override the shared palette variables from `src/styles/leota.css` (`--color-darkmode`, `--color-text`, `--color-heading`, `--color-border`, and so on) and `--font-heading` / `--font-body`.
3. For new fonts, add them to `fonts` in `astro.config.mjs` and render them for that skin in `src/components/BaseHead.astro`. Google-provided fonts are downloaded at build time and served from this site.
4. Check contrast: body text needs 4.5:1, large headings 3:1.

## The Blades skin

- Palette: Ink `#0e0e0e`, Soot `#171717`, Iron `#242424`, Ash `#3a3a3a` (borders only), Fog `#a3a3a3`, Bone `#edebe6`, Hot Orange `#ff5a1f`. On Ink: Bone 16:1, Fog 7.6:1, Orange 6.2:1.
- Type: Kirsty for headings, Source Serif 4 for prose, IBM Plex Mono for labels (tags, meta, navigation, footer).
- Kirsty is the free Larabie cut, which has capitals and small capitals but no lowercase. Its license (`src/assets/fonts/kirsty/Larabie Fonts License.txt`, also published at `/fonts/kirsty-license.txt`) allows redistribution only unaltered: keep the `.ttf` files as they are. Do not convert them to WOFF2 or subset them. Astro's local font provider copies them byte-for-byte.

## The City of Mist skin

- Palette: Night `#0f1020`, Smog `#1a1b33`, Haze `#34365a` (borders only), Fog `#a9aecb`, Streetlight `#e8f0ff`, Mythos Purple `#572b9e` (the header bar and other fills, with white text, 9.4:1), Neon Pink `#ff568f` (kickers, tags, active navigation, quote rules) and Neon Cyan `#56b8ff` (links). On Night: Streetlight 16.4:1, Fog 8.6:1, Cyan 8.7:1, Pink 6.3:1. Purple is 2.0:1 on Night, so it is never used for text there.
- Type: Bebas Neue for titles (capitals only, one weight), Bangers for short comic labels, Barlow for prose. Inline quotes (pink rule) are Barlow italic, a step larger and brighter than the prose; large centered quotes (`kg-blockquote-alt`) are upright Barlow Condensed with tight leading, so long ones such as verse hold together.
- Bangers is for labels only: navigation, kickers, tags. Not paragraphs or quotes, and never below 18px; it is slanted 5 degrees.

## The Chosen skin

- Palette, enriched from the original 2003 site's web-safe `#003333`: Crypt `#0a2629`, Tomb `#123538` (header and panels), Moss `#34595a` (borders only), Lichen `#a9bdb6`, Candle `#f3ead3`, Verdigris `#6fb8a8` (kickers and tags), Old Gold `#cda349` (links, active navigation; Crypt text on it), Glow `#ebdf9e` (title halo, hover) and Oxblood `#8e2f2c` (rules under the header, above the footer and beside quotes only). On Crypt: Candle 13.3:1, Lichen 8.0:1, Verdigris 6.9:1, Old Gold 6.8:1.
- Type: Pirata One for titles, with a candle-glow halo on page and section titles; Almendra SC for navigation, kickers, tags and large centered quotes (verse); Alegreya for prose and inline quotes. Inline quotes are set apart by color, Sea Glass `#b9ddd2` (10.8:1 on Crypt), rather than a panel, so the prose stays dominant.
- Blackletter is for titles only.

## Skin CSS and component styles

Astro component styles are scoped with an attribute, which makes them more specific than a plain `html[data-skin] .class` rule. When a skin restyles a component (for example the campaign navigation), include `.leota` in the selector, as in `html[data-skin="com"] .leota .campaign-nav a`.

## What follows the skin

Shared palette variables control page backgrounds, prose, headings, secondary text, borders, code backgrounds and focus outlines. Article/archive cards, bookmarks, downloads, disclosures, campaign navigation and consent controls use those colors.

Text over cover photographs and banners remains white, and the image viewer keeps its dark overlay. Blue/yellow callouts and green/yellow/red consent choices keep their meanings. The People directory keeps its own palette. External embedded players control their own appearance. The local email renderer uses its own palette and does not follow skins. Recent-post cards under an article show posts from every campaign in the article's skin.

## Review before publishing

Run `pnpm build`, then inspect with `pnpm preview`, for each skin in use:

- Homepage and campaign archive: card titles, excerpts and pagination.
- Articles with and without covers: headings, links, quotes, disclosures and code.
- Resources and download cards: text, borders and hover states.
- People directory and consent checklist: labels, inputs, selections and buttons.
- Desktop/mobile navigation and footer, including the expanded mobile menu.
- Navigating between campaigns with different skins (the site uses client-side transitions).
- Keyboard focus and text contrast on the chosen accent; cover and logo visibility.
