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
      provider: fontProviders.google(), weights: [400, 600], styles: ['normal'], display: 'swap',
    },
    // Blades in the Dark skin. Kirsty is the free Larabie cut (caps + small caps); its
    // license allows redistribution only as received, so the .ttf files ship unaltered.
    {
      name: 'Kirsty', cssVariable: '--font-kirsty', provider: fontProviders.local(), display: 'swap',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { weight: 400, style: 'normal', src: ['./src/assets/fonts/kirsty/Kirsty.ttf'] },
          { weight: 700, style: 'normal', src: ['./src/assets/fonts/kirsty/KirstyBold.ttf'] },
          { weight: 400, style: 'italic', src: ['./src/assets/fonts/kirsty/KirstyItalic.ttf'] },
          { weight: 700, style: 'italic', src: ['./src/assets/fonts/kirsty/KirstyBoldItalic.ttf'] },
        ],
      },
    },
    {
      name: 'Source Serif 4', cssVariable: '--font-serif',
      provider: fontProviders.google(), weights: [400, 600, 700], styles: ['normal', 'italic'], display: 'swap',
      fallbacks: ['Georgia', 'serif'],
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
