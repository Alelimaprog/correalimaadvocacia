/**
 * related.ts — malha de conteúdos relacionados (SEO interno).
 * Monta, a partir das fontes de verdade já existentes (nucleos, subtopics e as
 * coleções blog/guias) e de um mapa cluster→ferramenta, o conjunto completo de
 * links relacionados de uma página: área principal, subáreas, guia, ferramenta,
 * 6–8 artigos do mesmo cluster e "ver todos". Nenhum link é inventado; tudo
 * deriva de páginas que já existem no site.
 */
import { getCollection } from 'astro:content';
import { getNucleo } from './nucleos';
import { subtopics } from './subtopics';
import relatedArticles from './_related-articles.json';

export interface RelLink {
  label: string;
  href: string;
  tipo?: string;
  desc?: string;
}
export interface RelatedData {
  clusterLabel?: string;
  area?: RelLink;
  subareas: RelLink[];
  guia?: RelLink;
  tool?: RelLink;
  articles: RelLink[];
  curated: RelLink[];
  allHref?: string;
  allLabel?: string;
}

/** Ferramenta gratuita mais pertinente por cluster (páginas já existentes). */
const toolByCluster: Record<string, RelLink> = {
  'inventario-e-patrimonio': {
    label: 'Meu inventário pode ser feito em cartório?',
    href: '/ferramentas/inventario-em-cartorio/',
    tipo: 'Ferramenta',
    desc: 'Verificador rápido da via extrajudicial.',
  },
  'direito-internacional': {
    label: 'Preciso homologar minha decisão estrangeira?',
    href: '/ferramentas/preciso-homologar-sentenca-estrangeira/',
    tipo: 'Ferramenta',
    desc: 'Verificador de homologação no STJ.',
  },
};

const strip = (h: string) => (h || '').replace(/\/+$/, '');

/**
 * Página de serviço principal de cada frente (a que deve receber o clique de
 * quem leu um conteúdo do tema), com o rótulo de busca. Rodada 4 (13/11/2026).
 * Sem entrada aqui, o link vai para a área do núcleo ("Ver a área de …").
 */
export const moneyPage: Record<string, { href: string; label: string }> = {
  'direito-aduaneiro-tributario': {
    href: '/areas-de-atuacao/direito-aduaneiro-tributario/',
    label: 'Advogado aduaneiro: mercadoria retida e perdimento',
  },
  'inventario-e-patrimonio': {
    href: '/areas-de-atuacao/inventario-e-patrimonio/',
    label: 'Advogado de inventário em São Paulo',
  },
  'direito-internacional': {
    href: '/areas-de-atuacao/homologacao-de-sentenca-estrangeira/',
    label: 'Advogado para homologação de sentença estrangeira',
  },
};

/**
 * Seleção de artigos do bloco "Artigos sobre …" por página, distribuída para
 * que todos os artigos de um tema recebam links (Rodada 4, "links
 * contextuais"). Páginas fora do mapa usam a regra padrão (mais recentes).
 */
const ARTICLE_MAP = relatedArticles as Record<string, string[]>;

/**
 * Páginas de serviço "soltas" (coleção areas) que pertencem a um cluster mas
 * não são subtópicos: entram na malha de subáreas para receberem links
 * internos (auditoria 11/2026 — várias tinham 2 a 5 links de entrada).
 */
const extrasByCluster: Record<string, { label: string; slug: string; desc?: string }[]> = {
  'direito-internacional': [
    { label: 'Homologação de sentença estrangeira', slug: 'homologacao-de-sentenca-estrangeira' },
    { label: 'Divórcio feito no exterior', slug: 'homologacao-de-divorcio-estrangeiro' },
    { label: 'Averbação de divórcio estrangeiro em cartório', slug: 'averbacao-de-divorcio-estrangeiro' },
    { label: 'Sentença e divórcio dos Estados Unidos', slug: 'homologacao-de-sentenca-dos-estados-unidos' },
    { label: 'Sentença de Portugal', slug: 'homologacao-de-sentenca-de-portugal' },
    { label: 'Sentença da Itália', slug: 'homologacao-de-sentenca-da-italia' },
    { label: 'Adoção estrangeira', slug: 'homologacao-de-adocao-internacional' },
    { label: 'Casamento realizado no exterior', slug: 'homologacao-de-casamento-realizado-no-exterior' },
    { label: 'Execução de sentença estrangeira', slug: 'execucao-de-sentenca-estrangeira' },
  ],
  'inventario-e-patrimonio': [
    { label: 'Inventário com herdeiro no exterior', slug: 'inventario-com-herdeiro-no-exterior' },
    { label: 'Família e sucessões', slug: 'familia-e-sucessoes' },
    { label: 'Divórcio e questões patrimoniais', slug: 'divorcio-e-questoes-patrimoniais' },
  ],
  'direito-aduaneiro-tributario': [
    { label: 'Assessoria jurídica para importadores', slug: 'assessoria-juridica-para-importadores' },
    { label: 'Contratos de importação', slug: 'contratos-de-importacao-comercio-exterior' },
  ],
};

export async function getRelated(
  cluster: string | undefined,
  currentPath: string,
  curatedInput: { titulo: string; href: string; tipo?: string }[] = [],
): Promise<RelatedData | null> {
  if (!cluster) return null;
  const nucleo = getNucleo(cluster);
  const [posts, guias] = await Promise.all([getCollection('blog'), getCollection('guias')]);
  const cur = strip(currentPath);

  const area: RelLink | undefined =
    nucleo && strip(nucleo.href) !== cur
      ? { label: nucleo.label, href: nucleo.href, tipo: 'Área', desc: nucleo.short }
      : undefined;

  const subareas = subtopics
    .filter((s) => s.nucleo === cluster)
    .map((s) => ({
      label: s.label,
      href: `/areas-de-atuacao/${s.nucleo}/${s.slug}/`,
      tipo: 'Subárea',
      desc: s.seoDescription,
    }))
    .filter((x) => strip(x.href) !== cur);
  for (const e of extrasByCluster[cluster] ?? []) {
    const href = `/areas-de-atuacao/${e.slug}/`;
    if (strip(href) !== cur && !subareas.some((x) => strip(x.href) === strip(href))) {
      subareas.push({ label: e.label, href, tipo: 'Página', desc: e.desc ?? '' });
    }
  }

  const guiaEntry = guias
    .filter((g) => g.data.cluster === cluster)
    .sort((a, b) => Number(/guia-completo/.test(b.id)) - Number(/guia-completo/.test(a.id)))[0];
  const guia: RelLink | undefined =
    guiaEntry && strip(`/guias/${guiaEntry.id}/`) !== cur
      ? {
          label: guiaEntry.data.h1 ?? guiaEntry.data.title,
          href: `/guias/${guiaEntry.id}/`,
          tipo: 'Guia',
          desc: guiaEntry.data.description,
        }
      : undefined;

  const tool = toolByCluster[cluster];

  const mapped = ARTICLE_MAP[`${cur}/`];
  const byHref = new Map(posts.map((p) => [`/blog/${p.id}/`, p]));
  const articles = mapped
    ? mapped
        .map((h) => byHref.get(h))
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map((p) => ({ label: p.data.h1 ?? p.data.title, href: `/blog/${p.id}/`, tipo: 'Artigo' }))
    : posts
    .filter((p) => p.data.cluster === cluster && strip(`/blog/${p.id}/`) !== cur)
    .sort(
      (a, b) =>
        ((b.data as { pubDate?: Date }).pubDate?.getTime() ?? 0) -
        ((a.data as { pubDate?: Date }).pubDate?.getTime() ?? 0),
    )
    .slice(0, 8)
    .map((p) => ({ label: p.data.h1 ?? p.data.title, href: `/blog/${p.id}/`, tipo: 'Artigo' }));

  // Curados (frontmatter) que NÃO estejam já cobertos acima → cross-links.
  const known = new Set([
    ...(area ? [strip(area.href)] : []),
    ...(guia ? [strip(guia.href)] : []),
    ...subareas.map((s) => strip(s.href)),
    ...articles.map((a) => strip(a.href)),
    cur,
  ]);
  const curated = curatedInput
    .map((c) => ({ label: c.titulo, href: c.href, tipo: c.tipo }))
    .filter((c) => !known.has(strip(c.href)));

  return {
    clusterLabel: nucleo?.label,
    area,
    subareas,
    guia,
    tool,
    articles,
    curated,
    allHref: moneyPage[cluster]?.href ?? nucleo?.href,
    allLabel: moneyPage[cluster]?.label ?? (nucleo ? `Ver a área de ${nucleo.label}` : undefined),
  };
}
