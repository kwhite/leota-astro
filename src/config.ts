// Site skins: a palette plus a type pairing, selected per campaign. Each skin sets the
// light/dark base, the accent, and the text color used on accent backgrounds (the
// site does not pick a contrasting color for you). Skin-specific CSS lives in
// src/styles/skins/<id>.css, scoped to html[data-skin="<id>"].
export const SKINS = {
  leota: { label: 'Leota (dark purple)', theme: 'dark', accentColor: '#572b9e', accentTextColor: '#ffffff' },
  blades: { label: 'Blades in the Dark', theme: 'dark', accentColor: '#ff5a1f', accentTextColor: '#0e0e0e' },
  com: { label: 'City of Mist', theme: 'dark', accentColor: '#572b9e', accentTextColor: '#ffffff' },
  chosen: { label: 'The Chosen', theme: 'dark', accentColor: '#cda349', accentTextColor: '#0a2629' },
  fgc: { label: 'Freaky Gray Company', theme: 'dark', accentColor: '#d9a84a', accentTextColor: '#1c1311' },
} as const satisfies Record<string, { label: string; theme: 'light' | 'dark'; accentColor: string; accentTextColor: string }>;
export type SkinId = keyof typeof SKINS;

// Publication settings recovered from the 2026-10-03 Ghost export.
export const SITE_CONFIG = {
  title: 'Game Notes & Summaries',
  // Default skin for pages that belong to no campaign (home, About, untagged posts).
  // Campaigns choose their own skin in CAMPAIGN_NAVIGATION; palettes live in SKINS.
  skin: 'com' as SkinId,

  description: 'All the things I write down from all the games we play.',
  cover: 'assets/images/2026/05/musetta._dramatic_low_angle_looking_up_at_six_silhouetted_figur_8e265eba-592c-4a9d-8900-251bc271583a.png',
  logo: 'assets/images/2025/01/IMG_0489.png',
  logoDark: 'assets/images/2025/01/IMG_0489.png',
  favicon: 'assets/images/2024/12/IMG_0423-2.png',
  navigation: true,
  subscribers: false,
  twitter: '',
  facebook: '',
  xUsername: '',
  github: '',
  disqus: false,
  disqusShortname: '',
  googleAnalytics: '',
  wordsPerMinute: 200,
  pageSize: 25,
  homepageTag: 'CoM Season 1',
  algolia: null as { applicationId: string; indexName: string; searchOnlyApiKey: string } | null,
};

// Keep the original destinations recorded while their pages await migration.
export const PRIMARY_NAVIGATION = [
  { label: 'City of Mist', href: '/city-of-mist/', available: true },
  // Rename to the crew name once it can be shared (CAMPAIGN_NAVIGATION label too).
  { label: 'Blades in the Dark', href: '/blades-in-the-dark/', available: true },
  { label: 'Freaky Gray Company', href: '/the-freaky-gray-company/', available: true },
  { label: 'The Chosen', href: '/the-chosen/', available: true },
  { label: 'About', href: '/about/', available: true },
];
// Section links for campaign landing pages; unavailable sections render inactive until migrated.
export const CAMPAIGN_NAVIGATION = {
  'city-of-mist': {
    skin: 'com',
    tag: 'city-of-mist',
    label: 'City of Mist',
    links: [
      { id: 'overview', label: 'Overview', href: '/city-of-mist/', available: true },
      { id: 'rules', label: 'Rules', href: '/com-system-modifications/', available: true },
      { id: 'neighborhoods', label: 'Neighborhoods', href: '/neighborhoods-in-the-city/', available: true },
      { id: 'people', label: 'People', href: '/people-in-the-city/', available: true },
      { id: 'cast', label: 'Characters', href: '/city-of-mist-characters/', available: true },
      { id: 'summaries', label: 'Session Summaries', href: '/tag/city-of-mist/', available: true },
    ],
  },
  'freaky-gray-company': {
    skin: 'fgc',
    tag: 'freaky-gray-company',
    // Wildemount location guides: part of the campaign, but kept off the summary list.
    otherTags: ['feolinn', 'kamordah', 'zadash'],
    label: 'Freaky Gray Company',
    links: [
      { id: 'overview', label: 'Overview', href: '/the-freaky-gray-company/', available: true },
      { id: 'people', label: 'Characters', href: '/fgc-characters/', available: true },
      { id: 'gazette', label: 'Wildemount Gazette', href: '/the-wildemount-gazette/', available: true },
      { id: 'summaries', label: 'Session Summaries', href: '/tag/freaky-gray-company/', available: true },
    ],
  },
  'the-chosen': {
    skin: 'chosen',
    tag: 'the-chosen',
    label: 'The Chosen',
    links: [
      { id: 'overview', label: 'Overview', href: '/the-chosen/', available: true },
      { id: 'cast', label: 'Cast', href: '/the-chosen-cast/', available: true },
      { id: 'rules', label: 'The Rules', href: '/general-buffy-game-info/', available: true },
      { id: 'summaries', label: 'Season Summaries', href: '/tag/the-chosen/', available: true },
    ],
  },
  // The archive is not built until a post is tagged "Blades in the Dark" (or
  // src/content/tags/blades-in-the-dark.json exists); turn on the summaries link then.
  'blades-in-the-dark': {
    skin: 'blades',
    tag: 'blades-in-the-dark',
    label: 'Blades in the Dark',
    links: [
      { id: 'overview', label: 'Overview', href: '/blades-in-the-dark/', available: true },
      { id: 'scoundrels', label: 'Scoundrels', href: '/doskvol-scoundrels/', available: true },
      { id: 'summaries', label: 'Session Summaries', href: '/tag/blades-in-the-dark/', available: false },
    ],
  },
  // A Blades in the Dark one-shot: same system, so same skin. Linked from the site
  // footer (SECONDARY_NAVIGATION), not the header. Turn on summaries once a post is
  // tagged "Rite and Riot" (or src/content/tags/rite-and-riot.json exists). Not "Rite &
  // Riot": tag slugs keep the ampersand, so that tag would not match `rite-and-riot`.
  'rite-and-riot': {
    skin: 'blades',
    tag: 'rite-and-riot',
    label: 'Rite & Riot',
    links: [
      { id: 'overview', label: 'Overview', href: '/rite-and-riot/', available: true },
      { id: 'scoundrels', label: 'Scoundrels', href: '/rite-and-riot-scoundrels/', available: true },
      { id: 'summaries', label: 'Session Summaries', href: '/tag/rite-and-riot/', available: false },
    ],
  },
} as const satisfies Record<string, { skin: SkinId; tag: string; otherTags?: readonly string[]; label: string; links: readonly unknown[] }>;
export type CampaignId = keyof typeof CAMPAIGN_NAVIGATION;

/** Tag names and slugs compare the way tag archive URLs are built. */
export const tagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

/**
 * The campaign a tag belongs to, if any: its archive tag, or one of its otherTags
 * (posts that belong to the campaign without appearing in its summary archive).
 */
export function campaignForTag(tag: string): CampaignId | undefined {
  const slug = tagSlug(tag);
  return (Object.keys(CAMPAIGN_NAVIGATION) as CampaignId[]).find(id => {
    const campaign: { tag: string; otherTags?: readonly string[] } = CAMPAIGN_NAVIGATION[id];
    return campaign.tag === slug || (campaign.otherTags ?? []).includes(slug);
  });
}

/** The campaign a post belongs to: the one matching the earliest of its tags. */
export function campaignForPost(tags: readonly string[]): CampaignId | undefined {
  return tags.map(campaignForTag).find(Boolean);
}

/**
 * The campaign a tag archive belongs to: the campaign named by the tag itself, or
 * else the one campaign all of its posts belong to, so season and arc archives such
 * as "Season 1" follow their campaign. An archive that spans campaigns (such as
 * "Session Recaps") belongs to none and uses the site default.
 */
export function campaignForArchive(tag: string, postTags: readonly (readonly string[])[]): CampaignId | undefined {
  const own = campaignForTag(tag);
  if (own) return own;
  const found = new Set(postTags.map(campaignForPost).filter(Boolean));
  return found.size === 1 ? [...found][0] : undefined;
}

/**
 * Which skin a page wears: its campaign's when it names one; otherwise the campaign
 * matching the earliest of its tags (a post's primary tag wins); otherwise the default.
 */
export function resolveSkin({ campaign, tags = [] }: { campaign?: CampaignId; tags?: readonly string[] } = {}): SkinId {
  const id = campaign ?? campaignForPost(tags);
  return id ? CAMPAIGN_NAVIGATION[id].skin : SITE_CONFIG.skin;
}

// Footer links: reference pages, plus one-shots that don't get a header slot.
export const SECONDARY_NAVIGATION = [
  { label: 'Rite & Riot', href: '/rite-and-riot/', available: true },
  { label: 'DM Resources', href: '/dm-resources/', available: true },
  { label: 'RPG Consent Checklist', href: '/rpg-consent-checklist/', available: true },
];

/**
 * Helper to resolve paths with the Astro base URL
 */
export function getAssetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
    return path;
  }
  const base = import.meta.env.BASE_URL; // e.g. "/casper/" or "/"
  const cleanPath = path.replace(/^\//, '');
  return `${base}${cleanPath}`;
}

/**
 * Strips HTML and markdown formatting to create a text excerpt.
 */
export function getExcerpt(content: string, limit = 33): string {
  const stripped = content
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // keep image alt text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // keep link text
    .replace(/^#{1,6}\s+/gm, '') // strip heading markers
    .replace(/[*`_>~]/g, '') // strip simple markdown symbols
    .replace(/^\s*[-+]\s+/gm, '') // strip unordered list markers
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim();
  const words = stripped.split(' ');
  if (words.length <= limit) return stripped;
  return words.slice(0, limit).join(' ') + '...';
}

/**
 * Calculates reading time based on word count.
 */
export function getReadingTime(content: string, wpm = SITE_CONFIG.wordsPerMinute): string {
  const stripped = content.replace(/<[^>]*>/g, '').trim();
  if (!stripped) return '1 min read';
  const words = stripped.split(/\s+/).length;
  if (words <= wpm) {
    return '1 min read';
  }
  return `${Math.ceil(words / wpm)} min read`;
}
