/**
 * child-head.ts — monta o objeto `head` (SEO) de cada página-filha a partir do
 * frontmatter tipado + constantes, reproduzindo fielmente os padrões do site:
 * - title/description por-página;
 * - canonical derivado da rota (sem www, com barra final);
 * - robots "index, follow";
 * - Open Graph por-página (og:type = "article" só no blog; áreas/guias sem type);
 * - Twitter Card estático (padrão único do site);
 * - author + rel=author -> /o-escritorio/.
 */
import { site } from '@/lib/site.config';
import type { PageHead } from '@/lib/institucional';

type Collection = 'areas' | 'blog' | 'guias';
interface ChildFrontmatter {
  title: string;
  description: string;
  author?: string;
}

export function buildChildHead(
  collection: Collection,
  data: ChildFrontmatter,
  path: string
): PageHead {
  const canonical = `${site.url}${path}`;
  const image = `${site.url}${site.ogImage}`;
  return {
    title: data.title,
    description: data.description,
    canonical,
    robots: 'index, follow',
    author: data.author ?? site.attorney.name,
    authorLink: `${site.url}/o-escritorio/`,
    og: {
      title: data.title,
      description: data.description,
      url: canonical,
      image,
      ...(collection === 'blog' ? { type: 'article' } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description: site.defaultDescription,
      image,
    },
  };
}
