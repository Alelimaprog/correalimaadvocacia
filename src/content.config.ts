import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Content Collections (Fase 4) — áreas, blog e guias.
 * Schemas Zod refletem os campos que REALMENTE existem em cada template
 * (regra 6/7): apenas o blog tem datas; áreas e guias não têm.
 * O corpo de cada página é Markdown com frontmatter tipado.
 */

const base = z.object({
  title: z.string(), // <title> exato do site atual
  description: z.string(), // meta description
  h1: z.string(), // H1 exato (pode diferir do title)
  author: z.string().default('Alexandre Corrêa Lima'),
  // Campos editoriais (Fase 6) — opcionais, para integrar CTA/relacionados e revisão.
  cluster: z
    .enum([
      'recuperacao-de-credito',
      'cobranca-condominial',
      'direito-ambiental',
      'direito-aduaneiro-tributario',
      'direito-internacional',
      'inventario-e-patrimonio',
    ])
    .optional(),
  relacionados: z
    .array(z.object({ titulo: z.string(), href: z.string(), tipo: z.string().optional() }))
    .optional(),
  revisor: z.string().optional(),
  readingMinutes: z.number().optional(),
});

// Áreas de atuação — template LegalService (sem datas)
const areas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/areas' }),
  schema: base,
});

// Blog — template Article (com datas de publicação/atualização)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: base.extend({
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

// Guias — template Article (com data de atualização opcional)
const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: base.extend({
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { areas, blog, guias };
