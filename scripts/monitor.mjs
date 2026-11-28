#!/usr/bin/env node
/**
 * Monitor de disponibilidade e links (AUT-001).
 *
 * 1. Baixa <BASE>/sitemap.xml e lista as URLs.
 * 2. Pede cada URL (concorrência baixa) e confere: status 200 sem redirecionamento,
 *    <title> não vazio e <link rel="canonical">.
 * 3. Junta os links internos (<a href>) de todas as páginas e testa cada destino
 *    uma única vez (destinos já vistos no sitemap reaproveitam o resultado).
 * 4. Gera um relatório em Markdown (arquivo e saída padrão). Sai com código 1 se
 *    houver falha; avisos (ex.: link interno que redireciona) não reprovam.
 *
 * Variáveis de ambiente (todas opcionais):
 *   MONITOR_BASE         origem a testar (padrão https://correalimaadvocacia.com.br).
 *                        As URLs do sitemap são reescritas para essa origem, o que
 *                        permite testar o build local (ex.: http://localhost:4331).
 *   MONITOR_CONCORRENCIA pedidos simultâneos (padrão 4)
 *   MONITOR_TIMEOUT_MS   tempo máximo por pedido (padrão 20000)
 *   MONITOR_RELATORIO    caminho do relatório (padrão monitor-relatorio.md)
 *
 * Só usa módulos nativos do Node (>= 20); não precisa de npm ci.
 */
import { writeFile } from 'node:fs/promises';

const SITE = 'https://correalimaadvocacia.com.br';
const BASE = (process.env.MONITOR_BASE || SITE).replace(/\/+$/, '');
const CONC = Math.max(1, Number(process.env.MONITOR_CONCORRENCIA) || 4);
const TIMEOUT = Number(process.env.MONITOR_TIMEOUT_MS) || 20000;
const SAIDA = process.env.MONITOR_RELATORIO || 'monitor-relatorio.md';
const UA = 'Mozilla/5.0 (compatible; SiteMonitor/1.0)';
const ORIGENS_INTERNAS = new Set([new URL(SITE).origin, new URL(BASE).origin, 'https://www.correalimaadvocacia.com.br']);

const falhas = [];
const avisos = [];

/** Troca a origem de produção pela origem testada. */
function paraBase(u) {
  const x = new URL(u);
  return BASE + x.pathname + x.search;
}
/**
 * Chave de deduplicação: só o caminho. O site é estático, então ?area=... e #ancora
 * apontam para o mesmo arquivo; testar cada variação só multiplicaria os pedidos.
 */
function chave(u) {
  return new URL(u).pathname;
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** GET sem seguir redirecionamentos automaticamente; segue até 5 saltos e registra a cadeia. */
async function pedir(url, { corpo = false } = {}) {
  const cadeia = [];
  let atual = url;
  for (let salto = 0; salto <= 5; salto++) {
    let res, ultimoErro;
    for (let tentativa = 0; tentativa < 2; tentativa++) {
      try {
        res = await fetch(atual, {
          redirect: 'manual',
          headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
          signal: AbortSignal.timeout(TIMEOUT),
        });
        if (res.status >= 500 && tentativa === 0) { await res.body?.cancel(); await espera(2000); continue; }
        break;
      } catch (e) {
        ultimoErro = e;
        res = undefined;
        if (tentativa === 0) await espera(2000);
      }
    }
    if (!res) return { status: 0, erro: String(ultimoErro?.cause?.code || ultimoErro?.name || ultimoErro), cadeia };
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      await res.body?.cancel();
      cadeia.push(res.status);
      atual = new URL(res.headers.get('location'), atual).href;
      continue;
    }
    const html = corpo ? await res.text() : (await res.body?.cancel(), '');
    return { status: res.status, final: atual, cadeia, html, tipo: res.headers.get('content-type') || '' };
  }
  return { status: 0, erro: 'redirecionamentos demais', cadeia };
}

async function emParalelo(itens, fn) {
  let i = 0;
  const trabalhadores = Array.from({ length: Math.min(CONC, itens.length) }, async () => {
    while (i < itens.length) {
      const k = i++;
      await fn(itens[k], k);
    }
  });
  await Promise.all(trabalhadores);
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodifica = (s) =>
  s.replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);

function atributo(tag, nome) {
  const m = tag.match(new RegExp(`\\b${nome}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decodifica(m[1] ?? m[2] ?? m[3] ?? '') : null;
}

function analisaPagina(html) {
  const semScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
  const t = semScripts.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titulo = t ? decodifica(t[1]).replace(/\s+/g, ' ').trim() : '';
  let canonical = null;
  for (const m of semScripts.matchAll(/<link\b[^>]*>/gi)) {
    const rel = (atributo(m[0], 'rel') || '').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) { canonical = atributo(m[0], 'href'); break; }
  }
  const links = [];
  for (const m of semScripts.matchAll(/<a\b[^>]*>/gi)) {
    const href = atributo(m[0], 'href');
    if (href) links.push(href);
  }
  return { titulo, canonical, links };
}

/** Resolve um href e devolve a chave do destino interno, ou null se for externo/ignorável. */
function destinoInterno(href, paginaProd) {
  const h = href.trim();
  if (!h || h.startsWith('#') || /^(mailto|tel|javascript|data|sms|whatsapp):/i.test(h)) return null;
  let u;
  try { u = new URL(h, paginaProd); } catch { return null; }
  if (!/^https?:$/.test(u.protocol) || !ORIGENS_INTERNAS.has(u.origin)) return null;
  return u.pathname;
}

const inicio = Date.now();

// 1. Sitemap
const sm = await pedir(`${BASE}/sitemap.xml`, { corpo: true });
if (sm.status !== 200) {
  falhas.push({ url: `${BASE}/sitemap.xml`, motivo: `sitemap.xml respondeu ${sm.status || sm.erro}` });
}
const urls = [...new Set([...(sm.html || '').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => decodifica(m[1])))];
if (sm.status === 200 && !urls.length) falhas.push({ url: `${BASE}/sitemap.xml`, motivo: 'sitemap sem nenhuma <loc>' });
if (urls.some((u) => /sitemap[^/]*\.xml$/i.test(u))) avisos.push({ url: `${BASE}/sitemap.xml`, motivo: 'o sitemap parece ser um índice; este monitor não segue sitemaps filhos' });

// 2. Páginas do sitemap
const resultado = new Map(); // chave -> { status, motivo? }
const origemDoLink = new Map(); // chave do destino -> primeira página onde apareceu
let semTitulo = 0, semCanonical = 0;

await emParalelo(urls, async (uProd) => {
  const url = paraBase(uProd);
  const r = await pedir(url, { corpo: true });
  const k = chave(uProd);
  if (r.status !== 200) {
    const motivo = r.status ? `HTTP ${r.status}` : `sem resposta (${r.erro})`;
    falhas.push({ url: uProd, motivo: r.cadeia.length ? `${motivo} após redirecionamento ${r.cadeia.join('→')}` : motivo });
    resultado.set(k, { status: r.status });
    return;
  }
  if (r.cadeia.length) {
    falhas.push({ url: uProd, motivo: `URL do sitemap redireciona (${r.cadeia.join('→')}) para ${chave(r.final)}` });
  }
  resultado.set(k, { status: 200 });
  const { titulo, canonical, links } = analisaPagina(r.html);
  if (!titulo) { semTitulo++; falhas.push({ url: uProd, motivo: 'página sem <title>' }); }
  if (!canonical) { semCanonical++; falhas.push({ url: uProd, motivo: 'página sem <link rel="canonical">' }); }
  else {
    try {
      const c = new URL(canonical, uProd);
      if (c.href !== new URL(uProd).href) avisos.push({ url: uProd, motivo: `canonical aponta para outra URL: ${c.href}` });
    } catch { falhas.push({ url: uProd, motivo: `canonical inválido: ${canonical}` }); }
  }
  for (const href of links) {
    const d = destinoInterno(href, uProd);
    if (d && !origemDoLink.has(d)) origemDoLink.set(d, uProd);
  }
});

// 3. Links internos (cada destino uma única vez)
const pendentes = [...origemDoLink.keys()].filter((k) => !resultado.has(k));
await emParalelo(pendentes, async (k) => {
  const r = await pedir(BASE + k);
  resultado.set(k, { status: r.status });
  const pagina = origemDoLink.get(k);
  if (r.status === 200 && r.cadeia.length) {
    avisos.push({ url: SITE + k, motivo: `link interno redireciona (${r.cadeia.join('→')}) para ${chave(r.final)}; visto em ${pagina}` });
  } else if (r.status !== 200) {
    const motivo = r.status ? `HTTP ${r.status}` : `sem resposta (${r.erro})`;
    falhas.push({ url: SITE + k, motivo: `link interno quebrado: ${motivo}; visto em ${pagina}` });
  }
});
// Destinos que são URLs do sitemap com falha também aparecem como link quebrado.
for (const [k, pagina] of origemDoLink) {
  const r = resultado.get(k);
  if (r && r.status !== 200 && urls.some((u) => chave(u) === k)) {
    falhas.push({ url: SITE + k, motivo: `link interno aponta para página com falha; visto em ${pagina}` });
  }
}

// 4. Relatório
const seg = ((Date.now() - inicio) / 1000).toFixed(1);
const agora = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
const linhas = [
  `# Monitor do site — ${falhas.length ? `${falhas.length} falha(s)` : 'sem falhas'}`,
  '',
  `- Data: ${agora}`,
  `- Origem testada: ${BASE}`,
  `- URLs no sitemap: ${urls.length}`,
  `- Destinos de links internos testados além do sitemap: ${pendentes.length} (total de destinos internos distintos: ${origemDoLink.size})`,
  `- Páginas sem <title>: ${semTitulo}; sem canonical: ${semCanonical}`,
  `- Falhas: ${falhas.length}; avisos: ${avisos.length}`,
  `- Duração: ${seg} s (concorrência ${CONC})`,
  '',
];
const tabela = (titulo, itens) => {
  if (!itens.length) return;
  linhas.push(`## ${titulo}`, '', '| URL | Problema |', '|---|---|');
  for (const f of itens.slice(0, 300)) linhas.push(`| ${f.url} | ${f.motivo.replace(/\|/g, '\\|')} |`);
  if (itens.length > 300) linhas.push('', `(mais ${itens.length - 300} omitidos)`);
  linhas.push('');
};
tabela('Falhas', falhas);
tabela('Avisos', avisos);
const md = linhas.join('\n');
await writeFile(SAIDA, md);
console.log(md);
process.exit(falhas.length ? 1 : 0);
