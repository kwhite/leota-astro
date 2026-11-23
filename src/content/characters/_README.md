# Blades in the Dark characters

One YAML file per player character. The schema is `characters` in `src/content.config.ts`.

- `name` is what the table calls them: their alias if the player gave one, otherwise their name.
- `campaigns` lists every campaign they play in (`blades-in-the-dark` is the pilot,
  `rite-and-riot` is the one-shot). The Crew page for each campaign shows its characters.
- `actions` are total ratings: the playbook's printed starting dots plus the points the
  player assigned. Leave out actions at 0.
- `friend` / `rival` link to the dossier with the same `name` on that campaign's Scoundrels page.
- Leave anything unknown as `null`; the page shows it as TBD.
- Only things that hold steady between sessions belong here. No stress, harm, trauma or xp.
- Nothing secret: the site is public.
