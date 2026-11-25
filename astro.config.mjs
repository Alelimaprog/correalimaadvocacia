// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import rehypeEditorial from './scripts/rehype-editorial.mjs';

const SITE = 'https://correalimaadvocacia.com.br';

// URLs excluídas do sitemap (páginas utilitárias e URL antiga aposentada com 301).
const EXCLUDE = [
  '/contato/obrigado/',
  '/404',
  '/areas-de-atuacao/direito-aduaneiro-comercio-exterior/',
  // Rascunhos internos: estrutura pronta, conteúdo pendente de confirmação do
  // escritório. São noindex, não têm link de lugar nenhum e não entram aqui.
  // Ver src/components/AreaRascunho.astro.
  '/areas-de-atuacao/maritimo-e-portuario/',
  '/areas-de-atuacao/imigracao-estados-unidos/',
];

/**
 * Integração própria de sitemap: gera UM único /sitemap.xml (<urlset>) na raiz,
 * sem arquivo de índice. Prioridades: Home 1.0, Áreas de Atuação 0.8, demais 0.7.
 */
/**
 * lastmod real a partir do frontmatter (updatedDate || pubDate) de blog e guias,
 * mais as páginas revisadas na auditoria de 11/2026. Páginas sem data conhecida
 * ficam sem <lastmod> (melhor ausente do que impreciso).
 */
const AUDIT_DATE = '2026-11-07';
const AUDIT_UPDATED = [
  '/',
  '/contato/',
  '/politica-de-privacidade/',
  '/areas-de-atuacao/homologacao-de-divorcio-estrangeiro/',
  '/areas-de-atuacao/averbacao-de-divorcio-estrangeiro/',
  '/areas-de-atuacao/homologacao-de-sentenca-dos-estados-unidos/',
  '/areas-de-atuacao/homologacao-de-sentenca-de-portugal/',
  '/areas-de-atuacao/inventario-com-herdeiro-no-exterior/',
  '/areas-de-atuacao/trabalhista-empresarial/',
  '/areas-de-atuacao/direito-aduaneiro-tributario/retencao-de-mercadorias/',
];
function contentDates() {
  /** @type {Record<string,string>} */
  const map = {};
  for (const [dirName, base] of [['blog', '/blog/'], ['guias', '/guias/']]) {
    const dirUrl = new URL(`./src/content/${dirName}/`, import.meta.url);
    for (const f of readdirSync(dirUrl)) {
      if (!/\.mdx?$/.test(f)) continue;
      const txt = readFileSync(new URL(f, dirUrl), 'utf8');
      const fm = txt.split('---')[1] || '';
      const m = fm.match(/^updatedDate:\s*([0-9-]{10})/m) || fm.match(/^pubDate:\s*([0-9-]{10})/m);
      if (m) map[base + f.replace(/\.mdx?$/, '') + '/'] = m[1];
    }
  }
  for (const pth of AUDIT_UPDATED) map[pth] = AUDIT_DATE;
  // Revisão de 25/11/2026 (conteúdo visível alterado nestas páginas).
  for (const pth of [
    '/',
    '/o-escritorio/',
    '/politica-de-privacidade/',
    '/areas-de-atuacao/direito-aduaneiro-tributario/',
    '/areas-de-atuacao/cobranca-condominial/',
    '/areas-de-atuacao/recuperacao-de-credito/',
    '/areas-de-atuacao/direito-empresarial/',
    '/areas-de-atuacao/cobranca-condominial/acordos-de-inadimplencia-condominial/',
    '/areas-de-atuacao/recuperacao-de-credito/cobranca-extrajudicial/',
  ]) map[pth] = '2026-11-25';
  return map;
}

function singleSitemap() {
  return {
    name: 'single-sitemap',
    hooks: {
      'astro:build:done': (
        /** @type {{ pages: { pathname: string }[], dir: URL, logger: { info: (m: string) => void } }} */
        { pages, dir, logger }
      ) => {
        const seen = new Set();
        const urls = [];
        const dates = contentDates();
        for (const { pathname } of pages) {
          // normaliza para "/caminho/" (trailingSlash: 'always')
          let path = '/' + pathname;
          if (!path.endsWith('/')) path += '/';
          if (EXCLUDE.some((e) => path.startsWith(e) || path === e || path === e + '/')) continue;
          if (seen.has(path)) continue;
          seen.add(path);

          const loc = SITE + path;
          let priority = '0.7';
          if (path === '/') priority = '1.0';
          else if (path.startsWith('/areas-de-atuacao/')) priority = '0.8';
          urls.push({ loc, priority, lastmod: dates[path] });
        }
        // Home sempre primeiro; depois ordem alfabética estável.
        urls.sort((a, b) => (a.loc === SITE + '/' ? -1 : b.loc === SITE + '/' ? 1 : a.loc.localeCompare(b.loc)));

        const body = urls
          .map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
          )
          .join('\n');
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
        writeFileSync(new URL('sitemap.xml', dir), xml, 'utf8');
        logger.info(`sitemap.xml gerado com ${urls.length} URLs`);
      },
    },
  };
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  // Reorganização visual do conteúdo (Sprint Final) — NÃO altera texto jurídico.
  // Aplica-se a .md e, via extendMarkdownConfig (padrão do MDX), também a .mdx.
  markdown: {
    rehypePlugins: [rehypeEditorial],
  },
  integrations: [mdx(), singleSitemap()],
});
