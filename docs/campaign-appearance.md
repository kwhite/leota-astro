# Campaign appearance

Campaign presentation is controlled in `src/config.ts`, under `SITE_CONFIG`. It applies across the publication, including posts and campaign archives; it is not a per-page setting or a visitor preference. Change the settings, rebuild, and publish through the normal pull-request workflow.

The current settings preserve the dark purple design:

```ts
theme: 'dark' as 'light' | 'dark',
accentColor: '#572b9e',
accentTextColor: '#ffffff',
```

For a light theme with a dark green accent, for example:

```ts
theme: 'light' as 'light' | 'dark',
accentColor: '#205c45',
accentTextColor: '#ffffff',
```

For a pale accent, choose dark text on that accent background:

```ts
accentColor: '#e4c98b',
accentTextColor: '#151719',
```

Use CSS color values, preferably hex colors. `accentTextColor` controls navigation and button text on accent backgrounds. The site does not automatically choose a contrasting text color. The existing logo artwork is also unchanged; check its visibility when using pale backgrounds and provide suitable artwork if necessary.

## What follows the settings

The layout sets the theme class and accent variables on the document. Shared palette variables in `src/styles/leota.css` control page backgrounds, prose, headings, secondary text, borders, code backgrounds, and focus outlines. Article/archive cards, bookmarks, downloads, disclosures, campaign navigation, and consent form controls use those colors. The People directory has a separate light palette while retaining its character-card styling.

Text over cover photographs and banners remains white, and the image viewer retains its dark overlay. Blue/yellow callouts and green/yellow/red consent choices retain their meanings. External embedded players control their own appearance. The local email renderer uses its own dark palette and does not inherit these site settings.

## Review before publishing

Run `pnpm build`, then inspect the site with `pnpm dev` or `pnpm preview`:

- Homepage and campaign archive: card titles, excerpts, and pagination.
- Articles with and without covers: headings, links, quotes, disclosures, and code.
- Resources and download cards: text, borders, and hover states.
- People directory and consent checklist: labels, inputs, selections, and buttons.
- Desktop/mobile navigation and footer, including the expanded mobile menu.
- Keyboard focus and text contrast on the chosen accent; cover and logo visibility.

The implementation was checked with light and dark production builds (219 pages), light homepage/Resources/checklist previews, a 390px checklist preview, and the restored dark Resources preview. New accent combinations still require their own contrast and visual review.
