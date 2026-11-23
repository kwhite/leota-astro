# Crew pages (Blades in the Dark)

Added 2026-11-22. One Crew page per Blades campaign, next to its Scoundrels page.

| Campaign | Page | Content |
| --- | --- | --- |
| Pilot (`blades-in-the-dark`) | `/doskvol-crew/` | `src/content/pages/doskvol-crew.md` |
| Rite & Riot (`rite-and-riot`) | `/rite-and-riot-crew/` | `src/content/pages/rite-and-riot-crew.md` |

## How it fits together

- **Characters** live in `src/content/characters/*.yaml`, one file per PC (schema: `characters`
  in `src/content.config.ts`; authoring notes in `src/content/characters/_README.md`).
  `campaigns` lists every campaign a character plays in, so one file can feed both pages.
- **Crew pages** are `pages` entries with `template: crew`. Their `crew:` frontmatter holds the
  crew sheet (type, lair, tier · hold, hunting grounds, reputation); `null` shows as TBD.
  `src/pages/[slug].astro` builds them, loads the campaign's characters, and finds the same
  campaign's Scoundrels page so friend/rival names link to `#scoundrel-<name>` dossiers.
- **`src/components/CrewGallery.astro`** renders the crew sheet, a "Who to Call" table (best
  rating per action across the crew), the cards, and the dossier `<dialog>`. Interaction
  matches `ScoundrelGallery.astro`: Escape / click outside closes, ← → page through, focus stays
  in the dialog and returns to the card, and `/<page>/#crew-<name>` opens a dossier directly.
  Styles are global and prefixed `.cr` because the dossier is cloned from `<template>`.
- **Navigation:** a Crew link sits between Overview and Scoundrels in both campaigns
  (`CAMPAIGN_NAVIGATION` in `src/config.ts`); `crew` was added to `campaignSection`.

## Rules the content follows

- Names are aliases where the player gave one (Nora), otherwise the character's name.
- `actions` are totals: playbook starting dots + the four assigned points. The starting dots were
  filled in from the printed playbooks — check them against the real sheets.
- It's a dossier, not a character sheet: no stress, harm, trauma or xp.
- The site is public: no GM secrets in character files.
- `draft: true` marks GM-drafted characters (Tansy Brine, Wren Ashcombe) until the player signs off.

## Also changed

- `rite-and-riot-scoundrels.md`: "Leech TBD" → "Tansy Brine", "Whisper TBD" → "Wren Ashcombe".

## Open items

- Portraits: none yet. Add `image`, `width`, `height` to a character file (2:3), put the file in
  `public/assets/images/…`, then `pnpm media:prepare` / `pnpm media:upload` as usual.
- Sparks: playbook starting dots only; heritage, ability, friend/rival TBD.
- Tide: played by Helmcamp.
- Pilot crew type, lair and tier: not decided.
- Hop-To and Luna Matahari play in both campaigns (pilot is the warm-up for the one-shot). Jackie and Scott will too, once their sheets exist.
- Look and portraits for everyone.
