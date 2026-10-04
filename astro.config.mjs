import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://herebedragons.club',
  base: process.env.BASE_PATH || '/',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  fonts: [
    {
      name: 'Fira Sans',
      cssVariable: '--font-heading',
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      display: 'swap',
    },
    {
      name: 'Nunito',
      cssVariable: '--font-body',
      provider: fontProviders.google(),
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      display: 'swap',
    },
  ],
});
