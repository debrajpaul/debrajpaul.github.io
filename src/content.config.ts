import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const systemDesign = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/system-design' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    patterns: z.array(z.string()),
    role: z.string().optional(),
    order: z.number(),
    status: z.enum(['live', 'wip']),
    diagramType: z.enum(['svg', 'mermaid', 'prose']),
    diagramFile: z.string().optional(),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.coerce.date().nullable(),
    location: z.string(),
    domain: z.string(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    status: z.enum(['active', 'wip', 'archived']),
    repoUrl: z.string().optional(),
    license: z.string(),
    summary: z.string(),
    techStack: z.array(z.string()),
  }),
});

export const collections = { systemDesign, experience, projects };
