# Blades in the Dark characters

One YAML file per player character. The schema is `characters` in `src/content.config.ts`.

- `name` is their full name. It's kept on record as "Full name" in their dossier.
- `alias` (optional) is the shorter name the table uses. When set, it replaces `name` on
  cards, dossier headings and links. Scoundrels pages should use it in their `of:` lines.
- `campaigns` lists every campaign they play in (`blades-in-the-dark` is the pilot,
  `rite-and-riot` is the one-shot). The Crew page for each campaign shows its characters.
- `actions` are total ratings: the playbook's printed starting dots plus the points the
  player assigned. Leave out actions at 0.
- `abilities` is a list of special abilities (`name` + `text`), starting ability first,
  then any taken with advances. Use `abilities: []` if none is chosen yet.
- `friend` / `rival` link to the dossier with the same `name` on that campaign's Scoundrels page.
- `hidden: true` keeps a character off the Crew pages (cards and Who to Call) until they're
  revealed. Remove it, or set `false`, to show them. The repo is public, so it's not a secret.
- Leave anything unknown as `null`; the page shows it as TBD.
- Only things that hold steady between sessions belong here. No stress, harm, trauma or xp.
- Nothing secret: the site is public.
