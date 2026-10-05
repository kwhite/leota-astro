// Publication settings recovered from the 2026-10-03 Ghost export.
export const SITE_CONFIG = {
  title: 'Game Notes & Summaries',
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
  { label: 'Freaky Gray Company', href: '/the-freaky-gray-company/', available: false },
  { label: 'The Chosen', href: '/the-chosen/', available: false },
  { label: 'About', href: '/about/', available: true },
];
export const SECONDARY_NAVIGATION = [
  { label: 'DM Resources', href: '/dm-resources/', available: true },
  { label: 'RPG Consent Checklist', href: '/rpg-consent-checklist/', available: false },
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
