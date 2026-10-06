# Arc and season cards: export audit

Source: Ghost export `game-notes-summaries.ghost.2026-10-03-19-02-04.json`, page and post HTML only. Audited 2026-10-05.

Arc and season cards are Ghost v2 header cards. They use the existing `ContentBanner` component (the same one as the Neighborhoods district banners), not a separate component.

| Page | Cards | Width | Alignment | Button | Heading/text |
| --- | --- | --- | --- | --- | --- |
| The Chosen | Season One, Two, Three | regular | center | white, black text | white |
| City of Mist | Prologue, Season One | regular | center | accent, white text | white |
| Neighborhoods | 12 districts | wide | center | none | white (heading only) |

All 17 cards have a `#000` background and a white heading. No card uses `full` width, left alignment, or a second button. The only variant `ContentBanner` lacked was the white button, now `buttonStyle="light"`.

Freaky Gray Company now uses two explicit `ContentBanner` calls in its overview MDX. The exported teaser requested `c1-a1,c1-a2`; their tag metadata supplies the titles, descriptions and artwork. Buttons link to the current name-based archives `/tag/arc-1/` and `/tag/arc-2/`. No Ghost client script is retained.

## Follow-ups

- Card images are decorative (`alt=""`, as in the export). Set `alt` on a card if it ever needs a description.
- Overlay: the export carries no per-card setting, so the default stays at the old fixed `#0007` (`overlay` 0.467). `overlay` and `overlayColor` now adjust it per card.
- Season tag archives exist but have no posts until the summaries are migrated; they show a short "on their way" note.
- Chosen Cast and The Rules pages are not migrated; their campaign-nav links are inactive.
- Cast gallery alt text is the first name from the image filename (the export had none).
