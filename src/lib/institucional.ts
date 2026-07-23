/**
 * institucional.ts — acesso tipado aos metadados (head + JSON-LD) capturados
 * fielmente do export atual na Fase 3. Fonte: src/lib/_pages-data.json.
 *
 * Estes dados são a "fonte da verdade" de SEO por página. O conteúdo (corpo)
 * fica em src/partials/institucional/<key>.html e é injetado nas páginas.
 */
import data from '@/lib/_pages-data.json';

export interface OpenGraph {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  type?: string | null;
  site_name?: string | null;
  locale?: string | null;
  image?: string | null;
}

export interface TwitterCard {
  card?: string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
}

export interface PageHead {
  title: string;
  description?: string | null;
  canonical?: string | null;
  robots?: string | null;
  author?: string | null;
  authorLink?: string | null;
  og?: OpenGraph;
  twitter?: TwitterCard;
}

export interface PageData {
  key: string;
  head: PageHead;
  jsonld: Record<string, unknown>[];
  main_len: number;
}

const pages = data as unknown as Record<string, PageData>;

/** Retorna os metadados de uma página institucional pela URL (com barra final). */
export function getPage(url: string): PageData {
  const page = pages[url];
  if (!page) {
    throw new Error(`institucional: página não encontrada para "${url}"`);
  }
  return page;
}
