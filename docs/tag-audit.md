# Tag audit before bulk migration

Audited 2026-10-06. Discussion only: no tag metadata, post tags, routes, filters or content were changed. Counts refer to the backup export, not a live Ghost instance.

## Inventory and method

- Ghost export: 42 tag records (38 public, four internal), 170 published posts, 14 published pages and one draft page; 898 tag assignment rows.
- Astro: 33 tag metadata records, 12 posts (ten publication posts and two retained authoring samples).
- Counts below count distinct published posts per tag, not assignment rows. Six duplicate post/tag relationships affect six posts.
- Only selected content/tag metadata, ordered relationships, and published body HTML were inspected. Settings, subscribers and individual code-injection fields were not audited or copied. The companion JSON contains selected audit data, not source bodies or settings.
- Current routes normalize tag names by lowercasing and replacing whitespace with hyphens. Metadata lookup follows that same normalization. Source relationships retain export order for ties in `sort_order`.

## Proposed discussion groups

### Campaigns, chronology and locations

These 12 tags form a useful minimum navigation set. Campaign subnavigation uses the three campaign archives; banners use all seven chronology archives; the Gazette links to Kamordah and Zadash. CoM Season 1 also drives the homepage filter.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| City of Mist | 25 | 2 | 2 | Retain: navigation/filter/archive |
| Freaky Gray Company | 66 | 1 | 1 | Retain: navigation/filter/archive |
| The Chosen | 67 | 2 | 0 | Retain: navigation/filter/archive |
| CoM Prologue | 13 | 0 | 1 | Retain: navigation/filter/archive |
| CoM Season 1 | 12 | 0 | 1 | Retain: navigation/filter/archive |
| Arc 1 | 37 | 0 | 0 | Retain: navigation/filter/archive |
| Arc 2 | 29 | 0 | 1 | Retain: navigation/filter/archive |
| Season 1 | 22 | 0 | 0 | Retain: navigation/filter/archive |
| Season 2 | 22 | 0 | 0 | Retain: navigation/filter/archive |
| Season 3 | 23 | 0 | 0 | Retain: navigation/filter/archive |
| Kamordah | 5 | 0 | 5 | Retain: navigation/filter/archive |
| Zadash | 2 | 0 | 2 | Retain: navigation/filter/archive |

### Character tags

These 15 tags are the largest optional group. Removing all would eliminate character archives/feeds, but not the People/Cast pages. Their source counts are substantial, so usage alone does not prove they are unnecessary. Phelan, Khoraka and Ferric each cover 28 posts, Snow 29 and Erash 30; these largely follow FGC Arc 2 rather than narrow character-focused stories. Nine City of Mist character tags include attendance/session coverage and voice-over material.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| Daniel | 15 | 0 | 0 | Discuss character browsing value |
| Geoffrey | 13 | 0 | 1 | Discuss character browsing value |
| London | 18 | 0 | 1 | Discuss character browsing value |
| Maeve | 12 | 0 | 1 | Discuss character browsing value |
| Kevin | 20 | 0 | 1 | Discuss character browsing value |
| Sergei | 17 | 0 | 1 | Discuss character browsing value |
| Cody | 2 | 0 | 0 | Discuss character browsing value |
| John | 13 | 0 | 1 | Discuss character browsing value |
| Wren | 11 | 0 | 1 | Discuss character browsing value |
| Phelan | 28 | 1 | 1 | Discuss character browsing value |
| Khoraka | 28 | 1 | 1 | Discuss character browsing value |
| Snow | 29 | 1 | 1 | Discuss character browsing value |
| Ferric | 28 | 1 | 1 | Discuss character browsing value |
| Erash | 30 | 1 | 1 | Discuss character browsing value |
| Valgara | 18 | 0 | 0 | Discuss character browsing value |

### Content formats

Session Notes covers 41 posts (12 City of Mist, 29 FGC). Session Recap covers 54 (53 Chosen, one FGC). One FGC post, “2026.04.18: Burn on Your Own Terms”, carries both: a merged category would cover 94 unique posts. Fourteen Chosen posts carry neither, so merging existing tags would not consistently classify all summaries. Confirm whether notes and recaps represent intentionally different writing formats before consolidating.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| Session Notes | 41 | 0 | 2 | Discuss distinct formats vs one category |
| Session Recap | 54 | 0 | 0 | Discuss distinct formats vs one category |

### Broad/context tags

D&D covers 28 FGC posts and two pages; it does not consistently classify all FGC posts. Wildemount appears on only two Gazette posts plus its landing page. Campaign 2003 covers 52 of the 67 Chosen posts and has exactly the same membership as one import marker. That is evidence of an import batch, not proof that its historical meaning is disposable.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| D&D | 28 | 2 | 1 | Discuss broad grouping value |
| Wildemount | 2 | 1 | 2 | Discuss broad grouping value |
| Campaign 2003 | 52 | 0 | 0 | Discuss broad grouping value |

### Venue types

The Gazette currently offers location navigation. Venue archives would contain only one to three posts. Keep them if browsing by venue type is desired; otherwise removing them would simplify the taxonomy without changing the Gazette’s location links. The unused singular shop tag can be omitted independently of shops.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| tavern | 1 | 0 | 1 | Discuss venue browsing value |
| inns | 1 | 0 | 1 | Discuss venue browsing value |
| shop | 0 | 0 | 0 | Omit unused singular variant; keep shops if needed |
| shops | 3 | 0 | 3 | Discuss venue browsing value |
| spa | 2 | 0 | 2 | Discuss venue browsing value |

### Import bookkeeping and unused source tags

All four import markers are internal in Ghost and should not become public Astro categories. News is unused. Do not discard the source-to-tag audit provenance when omitting bookkeeping tags.

| Tag | Source posts | Source pages | Astro posts | Recommendation |
| --- | ---: | ---: | ---: | --- |
| #Import 2026-01-12 15:50 | 38 | 0 | 0 | Omit import bookkeeping after classification |
| #Import 2026-02-02 16:14 | 0 | 0 | 0 | Omit import bookkeeping after classification |
| #Import 2026-02-02 16:43 | 0 | 0 | 0 | Omit import bookkeeping after classification |
| #Import 2026-02-02 16:54 | 52 | 0 | 0 | Omit import bookkeeping after classification |
| News | 0 | 0 | 0 | Omit unused tag |

## Existing Astro template tags

- `fiction`: zero current posts; metadata-only archive, no Ghost counterpart. Candidate to remove.
- `getting-started`: metadata used by the `Getting started` tag on the retained Advanced Markdown sample. These names normalize to the same route; they are not two separate archives. Decide whether this sample should retain a public category, become untagged, or be excluded from publication listings as a later sample-content task. Do not delete the sample indiscriminately.

## Migration issues to resolve with the tag mapping

1. Four posts have only an internal import marker and would become untagged if it is dropped: Feolinn Shops, Eateries & Entertainment (`feolinn-shops-eateries-entertainment`), Quicksliver Cabaret (`quicksliver-cabaret`), Steamed Buns (`steamed-buns`), and The Invulnerable Vagrant (`the-invulnerable-vagrant-2`). The last two resemble already migrated entries; classify/reconcile them rather than importing blindly. No duplicate-content conclusion has been made from titles alone.
2. `1.5 When the Cat's Away (Original)` (`1-5-when-the-cats-away`) has eight character tags but no campaign/season tag. Removing character tags would leave it untagged. It also needs reconciliation with the similarly titled chapter entry before migration.
3. Six duplicated relationships should be deduplicated while preserving the first occurrence and tag order: CoM Prologue on 2025.02.15 Session Notes; Arc 2 on 2025.04.05 Session Notes; Freaky Gray Company on The Hag's Observations, C1E21: Traces, C1E10: With Great Haste, and C1E9: Building a Mystery.
4. Source post bodies contain links to character tag archives: Daniel, Kevin, London, Sergei, Geoffrey, Cody, John and Maeve. If these tags are pruned, rewrite those links deliberately (for example, plain character names or approved character-page anchors). A blanket redirect to a whole campaign archive changes their meaning.
5. Card labels, article tag links and social metadata use the first tag. Import markers must be filtered before applying that convention; keep campaign tags first for session posts and location tags first for Gazette posts unless Kat chooses otherwise. Seven exported posts have an internal marker in the first raw assignment; four lack any public tag.
6. Removing only a tag metadata JSON does not remove its archive if posts still reference the tag. Removing only post references can leave a metadata-only empty archive. Apply the approved decision to both references and metadata, and handle links/redirects together.
7. Page-only tag assignments do not create post archive membership. Current page schema has no tag field; do not infer migration requirements from source page tag counts alone.

## Legacy URLs

Five public tags already differ between source slugs and the current name-derived routes. Preserve them through an explicit mapping/redirect decision, including feeds and pagination where relevant:

| Tag | Ghost route | Current Astro route |
| --- | --- | --- |
| City of Mist | `/tag/cityofmist/` | `/tag/city-of-mist/` |
| D&D | `/tag/dnd/` | `/tag/d&d/` |
| Freaky Gray Company | `/tag/fgc/` | `/tag/freaky-gray-company/` |
| Arc 1 | `/tag/c1-a1/` | `/tag/arc-1/` |
| Arc 2 | `/tag/c1-a2/` | `/tag/arc-2/` |

Do not generate routes for internal names containing `#`. No redirect audit of external inbound traffic was possible from this export. The audit identifies source/internal links and known legacy slugs; it does not measure whether readers use particular archives.

## Suggested order of decisions

1. Retain the 12 navigation tags; omit four import markers plus unused News/shop and the empty fiction template tag.
2. Decide whether character archives are valuable. This is the largest reduction available: 15 source tags.
3. Decide whether Session Notes and Session Recap are distinct; otherwise consolidate to an agreed label and explicitly classify missing posts.
4. Decide whether venue types, D&D, Wildemount and Campaign 2003 serve useful browsing needs.
5. Record the approved source-name/slug → target-name/slug/omit mapping, primary-tag policy and legacy link handling before bulk migration.

This inventory is the pre-cleanup snapshot. Kat subsequently approved the core cleanup and specific source-post decisions; see [tag-migration-decisions.md](tag-migration-decisions.md) and `tag-migration-plan.json`. Remaining optional categories are still pending.
