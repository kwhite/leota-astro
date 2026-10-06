import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import mediaDelivery from './scripts/media-build.mjs';
import { satteri } from '@astrojs/markdown-satteri';
import markdownImageLightbox from './scripts/markdown-image-lightbox.mjs';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), mediaDelivery()],
  site: process.env.SITE_URL || 'https://herebedragons.club',
  base: process.env.BASE_PATH || '/',
  markdown: {
    processor: satteri({ hastPlugins: [markdownImageLightbox] }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  fonts: [
    {
      name: 'Bebas Neue', cssVariable: '--font-character-name',
      provider: fontProviders.google(), weights: [400], styles: ['normal'], display: 'swap',
    },
    {
      name: 'IBM Plex Mono', cssVariable: '--font-character-meta',
      provider: fontProviders.google(), weights: [600], styles: ['normal'], display: 'swap',
    },
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
