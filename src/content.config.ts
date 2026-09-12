import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { existsSync } from 'node:fs';
import { resolve, sep } from 'node:path';

const publicRoot = resolve('public');
const localImage = z.string().refine((value) => {
  const file = resolve(publicRoot, value.replace(/^\//, ''));
  return value.startsWith('/images/') && file.startsWith(publicRoot + sep) && existsSync(file);
}, 'Image missing: use /images/your-file.jpg and put the file in public/images/.');

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    group: z.enum(['left', 'right']),
    year: z.coerce.string(),
    medium: z.string(),
    summary: z.string(),
    cover: localImage,
    coverAlt: z.string().min(1),
    order: z.number().default(0),
    gallery: z.array(z.object({
      src: localImage,
      alt: z.string().min(1),
      caption: z.string().optional(),
    })).default([]),
  }),
});

export const collections = { projects };
