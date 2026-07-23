// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { writeFileSync } from 'node:fs';

const SITE = 'https://correalimaadvocacia.com.br';

// URLs excluídas do sitemap (páginas utilitárias e URL antiga aposentada com 301).
const EXCLUDE = [
  '/contato/obrigado/',
  '/404',
  '/areas-de-atuacao/direito-aduaneiro-comercio-exterior/',
];

/**
 * Integração própria de sitemap: gera UM único /sitemap.xml (<urlset>) na raiz,
 * sem arquivo de índice. Prioridades: Home 1.0, Áreas de Atuação 0.8, demais 0.7.
 */
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
          urls.push({ loc, priority });
        }
        // Home sempre primeiro; depois ordem alfabética estável.
        urls.sort((a, b) => (a.loc === SITE + '/' ? -1 : b.loc === SITE + '/' ? 1 : a.loc.localeCompare(b.loc)));

        const body = urls
          .map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
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
  integrations: [mdx(), singleSitemap()],
});
