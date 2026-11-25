/**
 * structured-data.ts — dados estruturados (JSON-LD) das páginas-filhas,
 * PRESERVADOS verbatim do site atual (Fase 4). Fonte: src/lib/_child-data.json.
 *
 * O JSON-LD (LegalService, Article, FAQPage, BreadcrumbList) é emitido sem
 * alteração pelas rotas dinâmicas. O breadcrumb visível é derivado do próprio
 * BreadcrumbList, mantendo uma única fonte da verdade.
 */
import raw from '@/lib/_child-data.json';
import { site } from '@/lib/site.config';
import type { Crumb } from '@/components/Breadcrumb.astro';

type Schema = Record<string, unknown>;
interface ChildEntry {
  jsonld: Schema[];
}
const store = raw as unknown as Record<string, ChildEntry>;

function key(collection: string, slug: string): string {
  return `${collection}/${slug}`;
}

/** JSON-LD bruto (preservado) de uma página-filha. */
export function getJsonLd(collection: string, slug: string): Schema[] {
  return store[key(collection, slug)]?.jsonld ?? [];
}

/**
 * Fallback para conteúdo NOVO (não presente em _child-data.json): monta
 * Article + BreadcrumbList a partir do frontmatter da entrada.
 */
export function buildArticleJsonLd(opts: {
  collection: 'blog' | 'guias';
  slug: string;
  title: string;
  description: string;
  h1: string;
  author: string;
  pubDate?: Date;
  updatedDate?: Date;
}): Schema[] {
  const base = site.url.replace(/\/$/, '');
  const secao = opts.collection === 'blog' ? 'Conteúdos' : 'Guias';
  const secaoHref = opts.collection === 'blog' ? '/blog/' : '/guias/';
  const url = `${base}/${opts.collection}/${opts.slug}/`;
  const image = `${base}${site.ogImage}`;
  const article: Schema = {
    '@context': 'https://schema.org',
    '@type': opts.collection === 'blog' ? 'BlogPosting' : 'Article',
    headline: opts.h1,
    description: opts.description,
    image,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: opts.author, url: `${base}/o-escritorio/` },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: base + '/',
      logo: { '@type': 'ImageObject', url: `${base}/icon-512.png`, width: 512, height: 512 },
    },
    inLanguage: 'pt-BR',
  };
  if (opts.pubDate) article.datePublished = opts.pubDate.toISOString().slice(0, 10);
  // dateModified sempre presente (sinal de atualização): usa updatedDate ou cai para pubDate.
  article.dateModified = (opts.updatedDate ?? opts.pubDate)?.toISOString().slice(0, 10);

  const breadcrumb: Schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: base + '/' },
      { '@type': 'ListItem', position: 2, name: secao, item: base + secaoHref },
      { '@type': 'ListItem', position: 3, name: opts.h1 },
    ],
  };
  return [article, breadcrumb];
}

/**
 * Fallback de dados estruturados para páginas de ÁREA novas (não presentes em
 * _child-data.json): monta LegalService + BreadcrumbList a partir do frontmatter.
 * O FAQPage é adicionado à parte por buildFaqJsonLd() a partir do corpo visível.
 */
export function buildAreaJsonLd(opts: {
  slug: string;
  title: string;
  description: string;
  h1: string;
  path: string;
}): Schema[] {
  const base = site.url.replace(/\/$/, '');
  const url = `${base}${opts.path}`;
  const legalService: Schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: `${opts.h1} — ${site.name}`,
    description: opts.description,
    url,
    areaServed: 'BR',
    provider: {
      '@type': 'Attorney',
      '@id': `${base}/o-escritorio/#alexandre-correa-lima`,
      name: site.attorney.name,
      url: `${base}/o-escritorio/`,
    },
  };
  const breadcrumb: Schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: base + '/' },
      { '@type': 'ListItem', position: 2, name: 'Áreas de Atuação', item: `${base}/areas-de-atuacao/` },
      { '@type': 'ListItem', position: 3, name: opts.h1, item: url },
    ],
  };
  return [legalService, breadcrumb];
}

/** Breadcrumb visível de fallback para páginas de área novas. */
export function buildAreaCrumbs(h1: string): Crumb[] {
  return [
    { label: 'Início', href: '/' },
    { label: 'Áreas de Atuação', href: '/areas-de-atuacao/' },
    { label: h1 },
  ];
}

/**
 * FAQPage a partir do CONTEÚDO VISÍVEL: extrai os pares "**Pergunta?**" +
 * parágrafo seguinte da seção "Perguntas frequentes" do corpo em Markdown.
 * Garante que o schema espelhe exatamente o que o visitante lê.
 */
export function buildFaqJsonLd(body: string): Schema | null {
  const sec = body.split(/##\s+Perguntas frequentes/i)[1];
  if (!sec) return null;
  const bloco = sec.split(/\n##\s+/)[0];
  const pares = [...bloco.matchAll(/\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\s*\n|\n\*\*|$)/g)];
  const itens = pares
    .map((m) => ({
      pergunta: m[1].trim(),
      resposta: m[2].replace(/\s+/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim(),
    }))
    .filter((i) => i.resposta.length > 0);
  if (itens.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: itens.map((i) => ({
      '@type': 'Question',
      name: i.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: i.resposta },
    })),
  };
}

/** Breadcrumb visível de fallback, coerente com o BreadcrumbList acima. */
export function buildBreadcrumbCrumbs(collection: 'blog' | 'guias', h1: string): Crumb[] {
  return [
    { label: 'Início', href: '/' },
    collection === 'blog'
      ? { label: 'Conteúdos', href: '/blog/' }
      : { label: 'Guias', href: '/guias/' },
    { label: h1 },
  ];
}

/** Trilha de breadcrumb derivada do BreadcrumbList preservado. */
export function getBreadcrumb(collection: string, slug: string): Crumb[] {
  const bc = getJsonLd(collection, slug).find((o) => o['@type'] === 'BreadcrumbList');
  const items = (bc?.itemListElement as Array<Record<string, unknown>>) ?? [];
  return items.map((it, i) => {
    const label = String(it.name ?? '');
    let href: string | undefined;
    if (i < items.length - 1 && typeof it.item === 'string') {
      href = it.item.replace(site.url, '') || '/';
    }
    return { label, href };
  });
}
