import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '@/lib/site.config';

/**
 * /rss.xml — feed de conteúdos (artigos e guias), gerado sem dependências
 * externas. Melhora a descoberta por leitores de feed e agregadores e dá um
 * canal estável para indexação de conteúdo novo.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const base = site.url.replace(/\/$/, '');
  const posts = await getCollection('blog');
  const guias = await getCollection('guias');

  const itens = [
    ...posts.map((p) => ({
      titulo: p.data.h1 ?? p.data.title,
      descricao: p.data.description,
      url: `${base}/blog/${p.id}/`,
      data: p.data.updatedDate ?? p.data.pubDate,
      categoria: 'Artigo',
    })),
    ...guias.map((g) => ({
      titulo: g.data.h1 ?? g.data.title,
      descricao: g.data.description,
      url: `${base}/guias/${g.id}/`,
      data: g.data.updatedDate,
      categoria: 'Guia',
    })),
  ]
    .sort((a, b) => (b.data ? b.data.getTime() : 0) - (a.data ? a.data.getTime() : 0))
    .slice(0, 50);

  const body = itens
    .map(
      (i) => `    <item>
      <title>${esc(i.titulo)}</title>
      <link>${i.url}</link>
      <guid isPermaLink="true">${i.url}</guid>
      <description>${esc(i.descricao)}</description>
      <category>${i.categoria}</category>${
        i.data ? `\n      <pubDate>${i.data.toUTCString()}</pubDate>` : ''
      }
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} — Conteúdos</title>
    <link>${base}/</link>
    <description>Artigos e guias jurídicos sobre recuperação de crédito, cobrança condominial, direito ambiental, aduaneiro, internacional e sucessões.</description>
    <language>pt-BR</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
${body}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
