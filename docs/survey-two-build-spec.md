# Blades in the Dark — Survey Two
## Implementation brief for Codex / Claude Code

### 1. Context and objective

Build a player-facing criminal dossier questionnaire for Skye's 60th birthday Blades in the Dark one-shot on December 22, 2026. Eight players will play across two roughly 2–3-hour acts separated by dinner. Most are new to the setting. Survey One already established broad adventure preferences; Survey Two should help the GM create characters, select a score, and design complementary opportunities for parallel teams without revealing the job.

The existing site uses Astro and Cloudflare hosting. The owner has an existing Formspree account. Repository structure, deployed site configuration, Formspree plan and endpoint are not supplied. Inspect the repository before making changes; reuse its layout, design tokens, components, conventions and package manager. Do not assume this is the same repository as another campaign site.

Creative context: standard seven playbooks only; Silkshore turf and a shuttered opera house lair with abandoned costumes and props. The GM has a crew name and faction relationship ideas; use existing published lore if available, otherwise leave those details out rather than invent them. The tone is a lively haunted industrial-fantasy criminal caper, not relentless misery. An airship was considered but is not a committed premise. Do not reveal or build around it. Deep Cuts may inform the eventual game but is not needed for this questionnaire.

### 2. Scope and architecture

- Add a responsive Astro page, suggested route `/survey/criminal-dossier/` (adapt to existing routing). Do not redesign the rest of the site.
- Prefer static Astro markup and lightweight client-side TypeScript/JS; reuse an existing framework island if the repository already uses one. No new framework solely for this form.
- Submit to the owner's Formspree endpoint directly over HTTPS using its supported AJAX submission format; request JSON response. Keep the endpoint configurable, e.g. `PUBLIC_SURVEY_TWO_FORMSPREE_ENDPOINT`, through existing environment configuration. A public form endpoint is not a secret; never ship API keys or account tokens. Provide `.env.example` entry without a real ID. No database, Cloudflare Worker, server runtime, or Google OAuth required for baseline scope.
- Formspree submissions are the source of truth. CSV export is the baseline reporting path; Google Sheets integration is optional only if available on the existing plan. Do not add a paid integration or claim it is configured without verification. Verify actual export behavior with a synthetic submission before launch.
- Keep the page out of navigation and set `noindex` if supported by existing SEO components. This is not access control; anyone with the URL may submit. Do not expose submissions, player lists, or GM notes on the public page. No authentication needed unless the owner requests it.
- Separate player copy and stable option definitions from form rendering. Keep GM-only documentation out of publicly served assets and client bundles.

### 3. Player experience and copy

**Title:** Your Criminal Dossier

**Subtitle:** Skye's Birthday Adventure · Blades in the Dark

**Introduction:**

Welcome to Doskvol, a city of perpetual night, where electric lights illuminate cobblestone streets, gondolas navigate winding canals, and fortunes are made and lost behind the doors of elegant townhouses.

Imagine a haunted industrial world of steam engines, clockwork, alchemy and strange electrical devices. Electroplasm, refined from the blood of monstrous leviathans, powers much of the city's remarkable technology. Ghosts are real, the invisible ghost field overlaps the physical world, and occult specialists can interact with forces most sensible people avoid. Magic is not traditional fantasy spellcasting.

You're members of an up-and-coming criminal crew operating out of Silkshore, a district of artists, entertainers and questionable establishments. Your home is a shuttered opera house, officially closed for safety violations. Its abandoned costumes, props and theatrical scenery may come in remarkably handy.

Now we need to figure out who you are. No rules knowledge or character creation homework required. Your answers are preferences, not commitments; multiple people may choose the same specialty. Allow about 5–8 minutes.

**Design:** Use the site's existing gothic/industrial editorial style, readable high-contrast text, restrained ornamentation and existing imagery if appropriate. Seven playbook cards are welcome, but illustrations are optional and must not block completion. Avoid invented character portraits that imply fixed appearances. No drag-only controls. Use semantic fieldsets, legends, labels and native inputs; provide visible focus, keyboard operation, screen-reader feedback, mobile-friendly targets, and reduced-motion support. Prefer one scrolling page with four sections and a submit button rather than a complicated wizard.

### 4. Questionnaire and field contract

All values below are stable machine identifiers; display the human wording. Required fields are explicitly marked. Optional multi-select limits are upper bounds, not minimums. Do not randomize ranked choices. Free-text fields should be trimmed, with sensible length limits and plain-text handling.

#### Section A — The Scoundrel

**Q1. Your name** — `player_name`, required text, max 100. Helper: "Use the same name you gave in our first survey, not your character's name." Do not require another email; join by name offline and resolve ambiguous matches manually.

**Q2. What kind of scoundrel would you most enjoy playing?** Display the seven cards below, then three ranked selects (`playbook_first`, `playbook_second`, `playbook_third`). First required; second and third optional, encouraged. No duplicate nonblank choices within one submission; different players may choose the same playbook. Third requires second. Never silently replace a player's selection.

| Value | Display title | Description |
|---|---|---|
| cutter | Cutter / The Muscle | An intimidating fighter, bodyguard or dangerous enforcer. |
| hound | Hound / The Hunter | A sharpshooter, tracker and specialist in watching or pursuing targets. |
| leech | Leech / The Technician | A doctor, alchemist, saboteur or witch: patches up wounds, brews remedies and poisons, and builds ingenious (or explosive) devices. |
| lurk | Lurk / The Infiltrator | A burglar, acrobat and specialist in getting into places they shouldn't be. |
| slide | Slide / The Con Artist | A charming manipulator, impersonator and master of deception. |
| spider | Spider / The Mastermind | A strategist, criminal fixer and operator with useful connections. |
| whisper | Whisper / The Occultist | A specialist in ghosts, supernatural phenomena and forbidden arts. |

Helper: "Playbooks describe your specialties, not limits on what you can do. Pick based on what sounds fun, not what you think the crew needs."

**Q3. What particular talents would you love your character to possess?** `talents`, checkboxes, required, 1–4.

- `study` — Investigating clues and deciphering secrets
- `survey` — Observing people and spotting danger
- `hunt` — Tracking targets or shooting with precision
- `tinker` — Medicine, alchemy, engineering and mechanical ingenuity
- `finesse` — Sleight of hand, lockpicking and precise movements
- `prowl` — Stealth, climbing and acrobatics
- `skirmish` — Swordplay, brawling and close combat
- `wreck` — Explosives, destruction and sabotage
- `attune` — Interacting with ghosts and supernatural forces
- `command` — Leadership, intimidation and authority
- `consort` — Making friends and cultivating useful contacts
- `sway` — Lying, persuasion and deception

**Q4. What kind of personality appeals to you?** `personality`, optional, up to 3.

- `charming` — Sophisticated and charming
- `calculating` — Quiet and calculating
- `reckless` — Reckless and adventurous
- `loyal` — Loyal and protective
- `eccentric` — Eccentric and unpredictable
- `ambitious` — Ruthless and ambitious
- `irreverent` — Sarcastic and irreverent
- `enigmatic` — Mysterious and enigmatic
- `honorable` — Reluctantly honorable
- `other` — Other (optional companion `personality_other`, max 300)

#### Section B — A Life of Crime

**Q5. What kinds of criminal jobs sound especially entertaining?** `score_preferences`, required, 1–3.

- `grand_heist` — The Grand Heist: Steal something exceptionally valuable from a supposedly secure location.
- `long_con` — The Long Con: Elaborate disguises, false identities and unsuspecting marks.
- `exchange` — The Exchange: Intercept, acquire or deliver something (or someone) before a rival does.
- `rescue` — The Impossible Rescue: Break someone out of a heavily guarded situation.
- `sabotage` — The Sabotage: Disrupt a powerful organization's operations.
- `dark_secret` — The Dark Secret: Uncover information someone powerful wants buried.
- `occult_job` — The Occult Job: Dangerous artifacts or supernatural affairs.
- `revenge_job` — The Revenge Job: Take something from someone who thoroughly deserves it.

**Q6. Which settings would you particularly enjoy exploring?** `settings`, optional, up to 3.

- `gala` — An extravagant aristocratic gala
- `collection` — A grand museum or private collection
- `cityscape` — The city's rooftops, bridges and canals
- `market` — A bustling market full of strange merchandise
- `gambling_house` — A luxurious gambling establishment
- `laboratory` — An industrial workshop or experimental laboratory
- `haunted_site` — A haunted manor or abandoned institution
- `moving_location` — A moving vehicle, vessel or other unusual location
- `criminal_hq` — The secret headquarters of a criminal organization
- `occult_underworld` — The city's occult underworld

**Q7. What complications make a heist more exciting for you?** `complications`, optional, up to 3.

- `rival_crew` — A rival crew pursuing the same objective
- `security` — Elaborate security and clever defenses
- `supernatural` — An unexpected supernatural complication
- `countdown` — A ticking clock and an increasingly desperate escape
- `personal_adversary` — A dangerous adversary with a personal connection
- `false_premise` — Discovering that the job isn't what we were told
- `moral_choice` — A difficult moral choice
- `improvisation` — An opportunity to pull off an outrageous improvisation

**Q8. How would you most enjoy contributing to a heist?** `operating_preference`, required radio.

- `public` — Out in the open: social encounters, bold moves and distractions.
- `covert` — Out of sight: infiltration, investigation or technical problem-solving.
- `mixed` — A little of both.
- `flexible` — Wherever I'm needed.

#### Section C — Skeletons in the Closet

**Q9. What might have brought your character into a life of crime?** `motivations`, optional, up to 2.

- `wealth` — Money and the finer things in life
- `power` — Ambition, influence or power
- `revenge` — Revenge
- `debt` — A debt or obligation
- `loyalty` — Loyalty to friends or family
- `knowledge` — Curiosity and forbidden knowledge
- `excitement` — A thirst for excitement
- `escape` — A desire to escape their former life
- `justice` — A personal code of justice
- `surprise` — Surprise me (exclusive)

**Q10. Which personal story elements would you enjoy?** `story_elements`, optional, up to 3.

- `rival` — An old rival or nemesis
- `favor` — A dangerous favor owed
- `secret` — A secret identity or hidden past
- `mentor` — A questionable mentor
- `crew_bond` — A close friendship or familial bond within the crew
- `crew_rivalry` — A friendly rivalry within the crew
- `powerful_contact` — A complicated relationship with someone powerful
- `supernatural_bond` — A peculiar supernatural connection
- `former_faction` — A former affiliation with another criminal organization
- `minimal` — I'd prefer minimal personal drama (exclusive)

**Q11. Every scoundrel needs an escape. What's yours?** `vice`, optional radio. Helper: "Characters have a vice: something they turn to when the pressures of criminal life become too much. This is about the fictional character."

- `faith` — Religious or spiritual devotion
- `gambling` — Games of chance and high-stakes wagers
- `luxury` — Fine clothes, exquisite food, art or expensive possessions
- `obligation` — Supporting a family, community or cause
- `pleasure` — Entertainment, companionship or other indulgences
- `stupor` — Drink, drugs or other means of escaping reality
- `weird` — Unusual rituals, strange collections or occult pursuits
- `gm_decides` — Let the GM decide

#### Section D — Finishing Touches

**Q12. How much would you like to customize your character?** `customization`, required radio.

- `complete` — Give me a completed character and let me discover them through play.
- `personality` — Give me the mechanics, but let me develop personality and appearance.
- `collaborate` — Give me a starting point, but I'd like input into abilities and backstory.
- `build` — I'd enjoy building my own character with some guidance before game day.

**Q13. Do you have a particular character concept, fictional inspiration or aesthetic in mind?** `character_concept`, optional textarea, max 2000. Helper: "A character from a book, film or game? Preferences for gender, appearance, clothes or portraits? Or leave it blank."

**Q14. Anything else I should know about your character?** `character_notes`, optional textarea, max 2000. Helper: "Anything you particularly want or don't want in your character's story? You can also message me privately instead." Do not request sensitive personal details.

**Submit button:** Seal Dossier

**Success copy:** Your dossier has been received. Please destroy any incriminating correspondence, settle your outstanding debts, and keep a respectable change of clothes handy. Further instructions will follow.

### 5. Submission data and validation

- One submission per response, one logical row in CSV. Use stable snake_case keys above. Add `survey_version` = `2.0`. Use provider receipt timestamp for ordering; optionally include client ISO timestamp for diagnostics, not authoritative identity.
- For multi-select fields serialize selected IDs in defined option order as a single pipe-delimited string (e.g. `tinker|attune`, or `gala|laboratory`). No pipes within individual IDs. This avoids ambiguous repeated form fields and comma parsing. Submit explicit empty strings for unanswered optional fields where supported; blanks mean unanswered, not negative preference. Verify actual provider exports preserve values; document any omitted empty columns and normalization needed.
- Do not send duplicate native checkbox fields alongside serialized values. Build the outgoing payload from the validated state. No arbitrary free text in enum values; companion text fields are separate. Clear stale `personality_other` when Other is deselected.
- Enforce required fields, valid enums, unique rankings, maximum selections, exclusive options and text limits before network submission. Show a selection count and accessible inline error. Keep controls editable so a player can change their mind. Client validation is UX, not a security boundary; validate/normalize exported rows before analysis. Use Formspree's supported spam controls if available; do not invent server-side enforcement.
- Disable submit while pending, prevent double clicks, and announce sending/success/errors via accessible status region. Treat success only as confirmed successful provider response. On network error or non-success, preserve entries, display actionable retry guidance, and re-enable submit. No automatic retry that could create duplicate submissions. For missing endpoint, block submission with clear configuration state (not fake success). Avoid personal response data in analytics, URLs, logs or persistent browser storage.
- Example payload (illustrative, partial): `{"survey_version":"2.0","player_name":"Test Player","playbook_first":"leech","playbook_second":"whisper","playbook_third":"","talents":"tinker|attune","score_preferences":"grand_heist|occult_job","operating_preference":"mixed","customization":"collaborate"}`. Actual request includes every defined field.

### 6. GM analysis goals (not public copy)

Survey One workbook headers were inspected: it already asks D&D experience, general vibe, story and world genre, tone, play style, combat vs roleplay, broad character concept, dark-theme comfort, desired content, boundaries and media references. Do not repeat those questions wholesale. This survey adds concrete setting-specific specialties, job types, locations, complications, personal hooks and character ownership. Personality/concept questions refine the earlier broad archetype question and are optional.

Join the two survey exports offline using trimmed, case-insensitive player names; flag duplicates and unmatched names for manual resolution. Retain raw data and choose latest confirmed response only after reviewing duplicates. Expected roster is eight, not a requirement for form submission. For recommendations, prioritize playbook preference and actual talents over forced class coverage. Count overlap in score, settings and complication selections, and use operating preferences for provisional team composition, not fixed assignments. Both teams should have meaningful spotlight and interdependent objectives. Do not infer boundaries from blank fields or treat the survey as a vote that locks the plot.

### 7. Acceptance criteria and handoff

1. Inspect repository and summarize integration approach before implementation. Preserve existing unrelated changes. Implement scoped page, option data and submission logic; do not publish or deploy without owner approval.
2. Page works on mobile and desktop, with keyboard and screen-reader-friendly labels/errors. Check small viewport and 200% zoom. All seven playbooks are readable without images. No horizontal overflow.
3. Test blank required fields, duplicate rankings, skipped second rank, all checkbox limits, exclusive choices, optional blanks, Other field, and valid submissions. Verify selection state survives failed requests.
4. Mock success, 4xx/429/5xx and network failure; verify pending/double-submit handling. No real personal data in tests. Use existing test tools; don't introduce a large new test stack if lightweight checks suffice.
5. Run existing lint/typecheck/test/build commands as applicable. Confirm static build works for current Cloudflare deployment target. Document commands, results and anything not tested.
6. With owner-supplied test endpoint/permission, send a synthetic response and inspect Formspree receipt plus CSV export. Confirm field column names, pipe-delimited choices, optional values and Unicode/free-text handling. Remove or clearly identify synthetic records. Google Sheets integration, if desired, must preserve equivalent data.
7. Return changed file paths, route, required configuration, local preview command, deployment instructions and outstanding blockers. Do not claim end-to-end completion without a verified live submission.

### 8. Decisions and open questions

- Proposed route, environment key, plain scrolling layout, delimiter and optional lower rankings are implementation defaults, not prior owner commitments.
- Q8 (operating preference) is restored from earlier discussion because team design matters. Q10 is capped at three to reduce conflicting hooks. Q4, Q13 and Q14 remain optional. Confirm questionnaire copy with owner before launch.
- Confirm exact crew name, whether the Silkshore/opera house copy is final, and any published campaign styling. Do not expose faction secrets or score premises.
- Owner must supply Formspree endpoint and confirm plan/export capabilities; no credentials or repo access are included here.
- Optional enhancements after baseline: playbook illustrations, Sheets integration, private GM analysis script. No need for these to ship survey.

### Suggested instruction to coding agent

Read this document, inspect the existing Astro repository, then implement the questionnaire in the site's established style. Use the field contract exactly, keep the backend minimal, and report assumptions and test results. Ask only about decisions that materially block implementation. Leave live endpoint configuration and deployment to the owner unless explicitly authorized.
