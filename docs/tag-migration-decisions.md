# Approved tag migration decisions

Confirmed by Kat on 2026-10-06. The inventory in `tag-audit.md` describes the pre-cleanup state; `tag-migration-plan.json` records the per-post mapping and exclusions for the migration.

## Approved taxonomy

- Retain campaign, chronology and Gazette location tags. CoM Season 1 remains the homepage filter.
- Remove all 15 source character tags. Current character metadata and references are removed; People/Cast pages and prose are unchanged.
- Combine Session Notes and Session Recap into Session Recaps, preserving order and deduplicating mapped tags. This combines existing assignments rather than inventing missing classifications. The homepage is not changed back to the format tag.
- Omit internal import markers, unused News and singular shop, and the empty fiction template tag. Import provenance stays in the audit/migration records.
- D&D, Wildemount, Campaign 2003 and the used venue-type tags remain unchanged pending Kat's decision. The Getting started sample tag also remains unchanged.

## Specific source-post decisions

- Feolinn Shops, Eateries & Entertainment: migrate under a new Feolinn Gazette location tag. Add its Gazette archive link when the content is migrated.
- Quicksliver Cabaret (source spelling; slug `quicksliver-cabaret`): migrate under Zadash. Preserve the exported title and slug until an editorial correction is requested.
- `steamed-buns`: omit the import-marker version in favor of existing `/the-steamed-buns/`.
- `the-invulnerable-vagrant-2`: omit the import-marker version in favor of existing `/the-invulnerable-vagrant/`.
- `1-5-when-the-cats-away`: retain the original article and direct-link destination from `/1-5-when-the-cats-away-summary/`. It intentionally has no campaign or chronology tag; do not infer them. After character-tag removal it has no tags. Preserve the source body/link relationship. Its untagged status alone would not hide it from global feeds or recent-post suggestions; review those listing implications when the original is migrated.

These exclusions remove the obsolete entries from the planned migration, not from the untouched archival backup. The plan covers 170 source posts: ten already migrated, 158 remaining, and two approved omissions.

## Links and validation

Source character-tag links must preserve their visible names when their archive destinations are removed. Record legacy mappings for retained/renamed tags and omitted duplicate slugs during migration; prepared static rules redirect old Session Notes/Session Recap archive paths to Session Recaps (runtime verification awaits deployment). Other legacy redirects remain migration work; no bulk post imports have been applied.

Current homepage/card primary tags and campaign/Gazette links remain unchanged. Production build passes with 49 pages (previously 62): 13 tag archive pages and 12 tag feeds were removed. Media checks pass for 232 responsive image occurrences, 165 full-size links and 529 delivery checksums. Retained archives, the homepage filter and XML feeds were checked. No new publication posts have been imported.
