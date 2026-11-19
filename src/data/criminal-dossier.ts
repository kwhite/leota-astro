// Survey Two ("Your Criminal Dossier") for the Blades in the Dark one-shot.
// Player-facing copy and the stable field contract live here, apart from the form markup
// (src/components/CriminalDossier.astro) and the validation that turns answers into the
// Formspree payload (src/scripts/criminal-dossier.ts). Field names and option values are
// machine identifiers that reach the CSV export: change display wording freely, but do
// not rename a `name` or `value` once responses exist. Spec: docs/survey-two-build-spec.md.
// Everything here ships to the browser: keep GM-only notes out of this file.

export const SURVEY_VERSION = '2.0';

export interface Option {
  value: string;
  label: string;
  /** Selecting this option excludes every other option in the field. */
  exclusive?: boolean;
}

export interface Playbook {
  value: string;
  title: string;
  description: string;
}

interface BaseField {
  name: string;
  number: number;
  question: string;
  helper?: string;
  required: boolean;
}

export interface TextField extends BaseField {
  kind: 'text' | 'textarea';
  maxLength: number;
}

export interface RadioField extends BaseField {
  kind: 'radio';
  options: readonly Option[];
}

export interface CheckboxField extends BaseField {
  kind: 'checkbox';
  options: readonly Option[];
  max: number;
  /** A free-text companion shown with one option, e.g. "Other". */
  companion?: { option: string; name: string; label: string; maxLength: number };
}

export interface RankField extends Omit<BaseField, 'name'> {
  kind: 'rank';
  /** First is required; later ranks are optional and need the rank before them. */
  names: readonly string[];
  rankLabels: readonly string[];
  options: readonly Playbook[];
}

export type Field = TextField | RadioField | CheckboxField | RankField;

export interface Section {
  id: string;
  letter: string;
  title: string;
  fields: readonly Field[];
}

export const COPY = {
  title: 'Your Criminal Dossier',
  subtitle: "Skye's Birthday Adventure · Blades in the Dark",
  intro: [
    'Welcome to Doskvol, a city of perpetual night, where electric lights illuminate cobblestone streets, gondolas navigate winding canals, and fortunes are made and lost behind the doors of elegant townhouses.',
    'Imagine a haunted industrial world of steam engines, clockwork, alchemy and strange electrical devices. Electroplasm, refined from the blood of monstrous leviathans, powers much of the city’s remarkable technology. Ghosts are real, the invisible ghost field overlaps the physical world, and occult specialists can interact with forces most sensible people avoid. Magic is not traditional fantasy spellcasting.',
    'You’re members of an up-and-coming criminal crew operating out of Silkshore, a district of artists, entertainers and questionable establishments. Your home is a shuttered opera house, officially closed for safety violations. Its abandoned costumes, props and theatrical scenery may come in remarkably handy.',
    'Now we need to figure out who you are. No rules knowledge or character creation homework required. Your answers are preferences, not commitments; multiple people may choose the same specialty. Allow about 5–8 minutes.',
  ],
  submit: 'Seal Dossier',
  pending: 'Sealing…',
  success:
    'Your dossier has been received. Please destroy any incriminating correspondence, settle your outstanding debts, and keep a respectable change of clothes handy. Further instructions will follow.',
} as const;

export const PLAYBOOKS: readonly Playbook[] = [
  { value: 'cutter', title: 'Cutter / The Muscle', description: 'An intimidating fighter, bodyguard or dangerous enforcer.' },
  { value: 'hound', title: 'Hound / The Hunter', description: 'A sharpshooter, tracker and specialist in watching or pursuing targets.' },
  { value: 'leech', title: 'Leech / The Technician', description: 'A doctor, alchemist, saboteur or witch: patches up wounds, brews remedies and poisons, and builds ingenious (or explosive) devices.' },
  { value: 'lurk', title: 'Lurk / The Infiltrator', description: 'A burglar, acrobat and specialist in getting into places they shouldn’t be.' },
  { value: 'slide', title: 'Slide / The Con Artist', description: 'A charming manipulator, impersonator and master of deception.' },
  { value: 'spider', title: 'Spider / The Mastermind', description: 'A strategist, criminal fixer and operator with useful connections.' },
  { value: 'whisper', title: 'Whisper / The Occultist', description: 'A specialist in ghosts, supernatural phenomena and forbidden arts.' },
];

export const SECTIONS: readonly Section[] = [
  {
    id: 'scoundrel',
    letter: 'A',
    title: 'The Scoundrel',
    fields: [
      {
        kind: 'text', name: 'player_name', number: 1, required: true, maxLength: 100,
        question: 'Your name',
        helper: 'Use the same name you gave in our first survey, not your character’s name.',
      },
      {
        kind: 'rank', number: 2, required: true,
        names: ['playbook_first', 'playbook_second', 'playbook_third'],
        rankLabels: ['First choice', 'Second choice', 'Third choice'],
        question: 'What kind of scoundrel would you most enjoy playing?',
        helper: 'Playbooks describe your specialties, not limits on what you can do. Pick based on what sounds fun, not what you think the crew needs.',
        options: PLAYBOOKS,
      },
      {
        kind: 'checkbox', name: 'talents', number: 3, required: true, max: 4,
        question: 'What particular talents would you love your character to possess?',
        options: [
          { value: 'study', label: 'Investigating clues and deciphering secrets' },
          { value: 'survey', label: 'Observing people and spotting danger' },
          { value: 'hunt', label: 'Tracking targets or shooting with precision' },
          { value: 'tinker', label: 'Medicine, alchemy, engineering and mechanical ingenuity' },
          { value: 'finesse', label: 'Sleight of hand, lockpicking and precise movements' },
          { value: 'prowl', label: 'Stealth, climbing and acrobatics' },
          { value: 'skirmish', label: 'Swordplay, brawling and close combat' },
          { value: 'wreck', label: 'Explosives, destruction and sabotage' },
          { value: 'attune', label: 'Interacting with ghosts and supernatural forces' },
          { value: 'command', label: 'Leadership, intimidation and authority' },
          { value: 'consort', label: 'Making friends and cultivating useful contacts' },
          { value: 'sway', label: 'Lying, persuasion and deception' },
        ],
      },
      {
        kind: 'checkbox', name: 'personality', number: 4, required: false, max: 3,
        question: 'What kind of personality appeals to you?',
        options: [
          { value: 'charming', label: 'Sophisticated and charming' },
          { value: 'calculating', label: 'Quiet and calculating' },
          { value: 'reckless', label: 'Reckless and adventurous' },
          { value: 'loyal', label: 'Loyal and protective' },
          { value: 'eccentric', label: 'Eccentric and unpredictable' },
          { value: 'ambitious', label: 'Ruthless and ambitious' },
          { value: 'irreverent', label: 'Sarcastic and irreverent' },
          { value: 'enigmatic', label: 'Mysterious and enigmatic' },
          { value: 'honorable', label: 'Reluctantly honorable' },
          { value: 'other', label: 'Other' },
        ],
        companion: { option: 'other', name: 'personality_other', label: 'Describe it (optional)', maxLength: 300 },
      },
    ],
  },
  {
    id: 'life-of-crime',
    letter: 'B',
    title: 'A Life of Crime',
    fields: [
      {
        kind: 'checkbox', name: 'score_preferences', number: 5, required: true, max: 3,
        question: 'What kinds of criminal jobs sound especially entertaining?',
        options: [
          { value: 'grand_heist', label: 'The Grand Heist: Steal something exceptionally valuable from a supposedly secure location.' },
          { value: 'long_con', label: 'The Long Con: Elaborate disguises, false identities and unsuspecting marks.' },
          { value: 'exchange', label: 'The Exchange: Intercept, acquire or deliver something (or someone) before a rival does.' },
          { value: 'rescue', label: 'The Impossible Rescue: Break someone out of a heavily guarded situation.' },
          { value: 'sabotage', label: 'The Sabotage: Disrupt a powerful organization’s operations.' },
          { value: 'dark_secret', label: 'The Dark Secret: Uncover information someone powerful wants buried.' },
          { value: 'occult_job', label: 'The Occult Job: Dangerous artifacts or supernatural affairs.' },
          { value: 'revenge_job', label: 'The Revenge Job: Take something from someone who thoroughly deserves it.' },
        ],
      },
      {
        kind: 'checkbox', name: 'settings', number: 6, required: false, max: 3,
        question: 'Which settings would you particularly enjoy exploring?',
        options: [
          { value: 'gala', label: 'An extravagant aristocratic gala' },
          { value: 'collection', label: 'A grand museum or private collection' },
          { value: 'cityscape', label: 'The city’s rooftops, bridges and canals' },
          { value: 'market', label: 'A bustling market full of strange merchandise' },
          { value: 'gambling_house', label: 'A luxurious gambling establishment' },
          { value: 'laboratory', label: 'An industrial workshop or experimental laboratory' },
          { value: 'haunted_site', label: 'A haunted manor or abandoned institution' },
          { value: 'moving_location', label: 'A moving vehicle, vessel or other unusual location' },
          { value: 'criminal_hq', label: 'The secret headquarters of a criminal organization' },
          { value: 'occult_underworld', label: 'The city’s occult underworld' },
        ],
      },
      {
        kind: 'checkbox', name: 'complications', number: 7, required: false, max: 3,
        question: 'What complications make a heist more exciting for you?',
        options: [
          { value: 'rival_crew', label: 'A rival crew pursuing the same objective' },
          { value: 'security', label: 'Elaborate security and clever defenses' },
          { value: 'supernatural', label: 'An unexpected supernatural complication' },
          { value: 'countdown', label: 'A ticking clock and an increasingly desperate escape' },
          { value: 'personal_adversary', label: 'A dangerous adversary with a personal connection' },
          { value: 'false_premise', label: 'Discovering that the job isn’t what we were told' },
          { value: 'moral_choice', label: 'A difficult moral choice' },
          { value: 'improvisation', label: 'An opportunity to pull off an outrageous improvisation' },
        ],
      },
      {
        kind: 'radio', name: 'operating_preference', number: 8, required: true,
        question: 'How would you most enjoy contributing to a heist?',
        options: [
          { value: 'public', label: 'Out in the open: social encounters, bold moves and distractions.' },
          { value: 'covert', label: 'Out of sight: infiltration, investigation or technical problem-solving.' },
          { value: 'mixed', label: 'A little of both.' },
          { value: 'flexible', label: 'Wherever I’m needed.' },
        ],
      },
    ],
  },
  {
    id: 'skeletons',
    letter: 'C',
    title: 'Skeletons in the Closet',
    fields: [
      {
        kind: 'checkbox', name: 'motivations', number: 9, required: false, max: 2,
        question: 'What might have brought your character into a life of crime?',
        options: [
          { value: 'wealth', label: 'Money and the finer things in life' },
          { value: 'power', label: 'Ambition, influence or power' },
          { value: 'revenge', label: 'Revenge' },
          { value: 'debt', label: 'A debt or obligation' },
          { value: 'loyalty', label: 'Loyalty to friends or family' },
          { value: 'knowledge', label: 'Curiosity and forbidden knowledge' },
          { value: 'excitement', label: 'A thirst for excitement' },
          { value: 'escape', label: 'A desire to escape their former life' },
          { value: 'justice', label: 'A personal code of justice' },
          { value: 'surprise', label: 'Surprise me', exclusive: true },
        ],
      },
      {
        kind: 'checkbox', name: 'story_elements', number: 10, required: false, max: 3,
        question: 'Which personal story elements would you enjoy?',
        options: [
          { value: 'rival', label: 'An old rival or nemesis' },
          { value: 'favor', label: 'A dangerous favor owed' },
          { value: 'secret', label: 'A secret identity or hidden past' },
          { value: 'mentor', label: 'A questionable mentor' },
          { value: 'crew_bond', label: 'A close friendship or familial bond within the crew' },
          { value: 'crew_rivalry', label: 'A friendly rivalry within the crew' },
          { value: 'powerful_contact', label: 'A complicated relationship with someone powerful' },
          { value: 'supernatural_bond', label: 'A peculiar supernatural connection' },
          { value: 'former_faction', label: 'A former affiliation with another criminal organization' },
          { value: 'minimal', label: 'I’d prefer minimal personal drama', exclusive: true },
        ],
      },
      {
        kind: 'radio', name: 'vice', number: 11, required: false,
        question: 'Every scoundrel needs an escape. What’s yours?',
        helper: 'Characters have a vice: something they turn to when the pressures of criminal life become too much. This is about the fictional character.',
        options: [
          { value: 'faith', label: 'Religious or spiritual devotion' },
          { value: 'gambling', label: 'Games of chance and high-stakes wagers' },
          { value: 'luxury', label: 'Fine clothes, exquisite food, art or expensive possessions' },
          { value: 'obligation', label: 'Supporting a family, community or cause' },
          { value: 'pleasure', label: 'Entertainment, companionship or other indulgences' },
          { value: 'stupor', label: 'Drink, drugs or other means of escaping reality' },
          { value: 'weird', label: 'Unusual rituals, strange collections or occult pursuits' },
          { value: 'gm_decides', label: 'Let the GM decide' },
        ],
      },
    ],
  },
  {
    id: 'finishing-touches',
    letter: 'D',
    title: 'Finishing Touches',
    fields: [
      {
        kind: 'radio', name: 'customization', number: 12, required: true,
        question: 'How much would you like to customize your character?',
        options: [
          { value: 'complete', label: 'Give me a completed character and let me discover them through play.' },
          { value: 'personality', label: 'Give me the mechanics, but let me develop personality and appearance.' },
          { value: 'collaborate', label: 'Give me a starting point, but I’d like input into abilities and backstory.' },
          { value: 'build', label: 'I’d enjoy building my own character with some guidance before game day.' },
        ],
      },
      {
        kind: 'textarea', name: 'character_concept', number: 13, required: false, maxLength: 2000,
        question: 'Do you have a particular character concept, fictional inspiration or aesthetic in mind?',
        helper: 'A character from a book, film or game? Preferences for gender, appearance, clothes or portraits? Or leave it blank.',
      },
      {
        kind: 'textarea', name: 'character_notes', number: 14, required: false, maxLength: 2000,
        question: 'Anything else I should know about your character?',
        helper: 'Anything you particularly want or don’t want in your character’s story? You can also message me privately instead.',
      },
    ],
  },
];

export const FIELDS: readonly Field[] = SECTIONS.flatMap(section => section.fields);
