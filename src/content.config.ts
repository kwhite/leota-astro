import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { CAMPAIGN_NAVIGATION, type CampaignId } from './config';

// Every campaign in CAMPAIGN_NAVIGATION, so adding one there is enough.
const campaignIds = Object.keys(CAMPAIGN_NAVIGATION) as [CampaignId, ...CampaignId[]];

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional().nullable(),
    date: z.union([z.date(), z.string()]),
    tags: z.preprocess(
      (val) => {
        if (!val) return [];
        if (typeof val === 'string') return [val];
        if (Array.isArray(val)) return val;
        return [];
      },
      z.array(z.string())
    ).default([]),
    class: z.string().optional(),
    subclass: z.string().optional(),
    author: reference('authors'), // Type-safe reference to an author document
    current: z.string().optional(),
    navigation: z.union([z.boolean(), z.string()]).optional(),
    layout: z.string().optional(),
    disqus: z.boolean().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: z.object({
    username: z.string(),
    name: z.string(),
    bio: z.string().optional(),
    picture: z.string().optional().nullable(),
    location: z.string().optional(),
    url: z.union([z.string(), z.boolean()]).optional(),
    url_full: z.union([z.string(), z.boolean()]).optional(),
    facebook: z.union([z.string(), z.boolean()]).optional(),
    twitter: z.union([z.string(), z.boolean()]).optional(),
    cover: z.union([z.string(), z.boolean()]).optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/tags' }),
  schema: z.object({
    name: z.string(),
    description: z.union([z.string(), z.boolean()]).optional(),
    cover: z.union([z.string(), z.boolean()]).optional(),
  }),
});

// Shared fields for a Blades NPC: who they are, where, and a 2:3 portrait.
const portrait = {
  name: z.string(), description: z.string(), district: z.string(),
  image: z.string(), width: z.number(), height: z.number(),
};

// Standalone pages: prose in Markdown, optional structured sections in frontmatter.
const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(), cover: z.string().nullable().optional(),
    // Link-preview (Open Graph) image, when it should differ from the cover or there is none.
    image: z.string().nullable().optional(),
    description: z.string().optional(), sourceId: z.string().optional(),
    // Pages with a template need no .astro file: src/pages/[slug].astro builds them at /<file name>/.
    // Pages without one are built by their own hand-written file in src/pages/.
    template: z.enum(['scoundrels']).optional(),
    campaign: z.enum(campaignIds).default('city-of-mist'),
    campaignSection: z.enum(['overview', 'rules', 'neighborhoods', 'people', 'gazette', 'cast', 'scoundrels']).optional(),
    chapters: z.array(z.object({ chapter: z.string(), title: z.string(), href: z.string().nullable() })).default([]),
    people: z.array(z.object({
      name: z.string(), mythos: z.string().nullable(), mythosStruck: z.boolean(),
      neighborhood: z.string().nullable(), image: z.string(), width: z.number(), height: z.number(),
      sheet: z.string().nullable(),
    })).default([]),
    // Blades in the Dark NPC gallery (/doskvol-scoundrels/). Faction status runs -3 (war) to +3 (allies).
    scoundrels: z.array(z.discriminatedUnion('kind', [
      // A faction, represented by one person. `via` names the contact who brought the crew to it.
      z.object({
        kind: z.literal('faction'), faction: z.string(), teaser: z.string(), status: z.number().int().min(-3).max(3),
        via: z.string().nullable().default(null), ...portrait,
      }),
      // The crew's favorite contact, with the faction relationships that came with them.
      z.object({
        kind: z.literal('contact'), title: z.string(), ...portrait,
        associations: z.array(z.object({ faction: z.string(), note: z.string(), status: z.number().int().min(-3).max(3) })).default([]),
      }),
      // A friend or rival of one scoundrel (player character), named in `of`.
      z.object({ kind: z.enum(['friend', 'rival']), title: z.string(), of: z.string(), ...portrait }),
    ])).default([]),
  }),
});

export const collections = {
  pages,
  posts,
  authors,
  tags,
};
