/**
 * auditar.mjs — auditoria estática de SEO, semântica e acessibilidade sobre
 * TODAS as páginas de dist/, sem navegador.
 *
 * Verifica o que dá para verificar lendo o HTML: title, description, canonical,
 * robots, Open Graph, hierarquia de headings, H1 único, alt de imagem, idioma,
 * JSON-LD válido, links internos quebrados e âncoras órfãs. O que depende de
 * renderização (contraste, área de toque, overflow) fica para auditar-render.mjs.
 *
 *   node scripts/auditar.mjs            # relatório
 *   node scripts/auditar.mjs --json     # saída legível por máquina
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
const SITE = 'https://correalimaadvocacia.com.br';
const json = process.argv.includes('--json');

const LIMITES = { titleMax: 65, titleMin: 15, descMax: 165, descMin: 70 };

async function paginas(dir = DIST, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await paginas(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const tag = (html, re) => (html.match(re) || [])[1];
const todas = (html, re) => [...html.matchAll(re)];

const achados = [];
const nota = (rota, nivel, regra, detalhe) => achados.push({ rota, nivel, regra, detalhe });

const arquivos = (await paginas()).sort();
const rotaDe = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '');
const existentes = new Set(arquivos.map(rotaDe));
const ancorasPorRota = new Map();

const docs = [];
for (const f of arquivos) {
  const html = await readFile(f, 'utf8');
  const rota = rotaDe(f);
  docs.push({ rota, html });
  ancorasPorRota.set(rota, new Set(todas(html, /\sid="([^"]+)"/g).map((m) => m[1])));
}

for (const { rota, html } of docs) {
  // ── Idioma ───────────────────────────────────────────────────────────
  if (!/<html[^>]+lang="pt-BR"/i.test(html)) nota(rota, 'erro', 'lang', 'html sem lang="pt-BR"');

  // ── Title ────────────────────────────────────────────────────────────
  const title = tag(html, /<title>([\s\S]*?)<\/title>/i);
  if (!title) nota(rota, 'erro', 'title', 'ausente');
  else if (title.length > LIMITES.titleMax) nota(rota, 'aviso', 'title', `${title.length} caracteres (> ${LIMITES.titleMax})`);
  else if (title.length < LIMITES.titleMin) nota(rota, 'aviso', 'title', `${title.length} caracteres (< ${LIMITES.titleMin})`);

  // ── Description ──────────────────────────────────────────────────────
  const desc = tag(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  if (!desc) nota(rota, 'erro', 'description', 'ausente');
  else if (desc.length > LIMITES.descMax) nota(rota, 'aviso', 'description', `${desc.length} caracteres (> ${LIMITES.descMax})`);
  else if (desc.length < LIMITES.descMin) nota(rota, 'aviso', 'description', `${desc.length} caracteres (< ${LIMITES.descMin})`);

  // ── Canonical e robots ───────────────────────────────────────────────
  const canon = tag(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robots = tag(html, /<meta\s+name="robots"\s+content="([^"]*)"/i) || '';
  const noindex = /noindex/i.test(robots);
  if (!canon && !noindex) nota(rota, 'erro', 'canonical', 'ausente');
  if (canon && !canon.startsWith(SITE)) nota(rota, 'erro', 'canonical', `fora do domínio: ${canon}`);
  if (canon && canon !== `${SITE}${rota}`) nota(rota, 'aviso', 'canonical', `aponta para ${canon}`);

  // ── Open Graph ───────────────────────────────────────────────────────
  for (const prop of ['og:title', 'og:description', 'og:url']) {
    if (!new RegExp(`property="${prop}"`).test(html)) nota(rota, 'aviso', 'open-graph', `${prop} ausente`);
  }

  // ── Headings ─────────────────────────────────────────────────────────
  const h1s = todas(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi);
  if (h1s.length === 0) nota(rota, 'erro', 'h1', 'nenhum H1');
  else if (h1s.length > 1) nota(rota, 'erro', 'h1', `${h1s.length} H1 na mesma página`);

  const niveis = todas(html, /<h([1-6])[^>]*>/gi).map((m) => Number(m[1]));
  for (let i = 1; i < niveis.length; i++) {
    if (niveis[i] - niveis[i - 1] > 1) {
      nota(rota, 'aviso', 'hierarquia', `salto de H${niveis[i - 1]} para H${niveis[i]}`);
      break;
    }
  }

  // ── Imagens ──────────────────────────────────────────────────────────
  for (const [img] of todas(html, /<img\b[^>]*>/gi)) {
    if (!/\salt=/.test(img)) nota(rota, 'erro', 'alt', img.slice(0, 90));
    if (!/\s(width|height)=/.test(img) && !/\sstyle="[^"]*aspect-ratio/.test(img)) {
      nota(rota, 'aviso', 'dimensao', `img sem width/height: ${(img.match(/src="([^"]*)"/) || [])[1]}`);
    }
  }

  // ── JSON-LD ──────────────────────────────────────────────────────────
  for (const [, corpo] of todas(html, /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(corpo); } catch (e) { nota(rota, 'erro', 'json-ld', e.message.slice(0, 80)); }
  }

  // ── Links ────────────────────────────────────────────────────────────
  for (const [, href] of todas(html, /<a\b[^>]*\shref="([^"]+)"/gi)) {
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) {
      if (href.startsWith('#') && href.length > 1) {
        const id = decodeURIComponent(href.slice(1));
        if (!ancorasPorRota.get(rota)?.has(id)) nota(rota, 'aviso', 'ancora', `#${id} não existe na página`);
      }
      continue;
    }
    // A query string não faz parte da rota: /contato/?area=... é /contato/.
    const [semFrag, frag] = href.split('#');
    const caminho = semFrag.split('?')[0];
    const alvo = caminho.endsWith('/') || caminho === '' ? caminho || rota : caminho;
    if (!alvo.startsWith('/')) continue;
    if (/\.(xml|txt|ico|png|jpg|webp|svg|pdf|webmanifest|json)$/i.test(alvo)) continue;
    if (!existentes.has(alvo)) { nota(rota, 'erro', 'link', `destino inexistente: ${alvo}`); continue; }
    if (frag && !ancorasPorRota.get(alvo)?.has(decodeURIComponent(frag))) {
      nota(rota, 'aviso', 'ancora', `${alvo}#${frag} não existe no destino`);
    }
  }

  // ── Alvos de link sem texto acessível ────────────────────────────────
  for (const [a, interno] of todas(html, /<a\b[^>]*>([\s\S]*?)<\/a>/gi)) {
    const texto = interno.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
    if (!texto && !/aria-label=|aria-labelledby=|title=/.test(a)) {
      nota(rota, 'erro', 'link-sem-nome', a.slice(0, 90));
    }
  }
}

if (json) {
  console.log(JSON.stringify({ paginas: docs.length, achados }, null, 2));
  process.exit(0);
}

const erros = achados.filter((a) => a.nivel === 'erro');
const avisos = achados.filter((a) => a.nivel === 'aviso');
console.log(`${docs.length} páginas · ${erros.length} erros · ${avisos.length} avisos\n`);

for (const nivel of ['erro', 'aviso']) {
  const grupo = achados.filter((a) => a.nivel === nivel);
  if (!grupo.length) continue;
  console.log(nivel === 'erro' ? '── ERROS ──' : '── AVISOS ──');
  const porRegra = new Map();
  for (const a of grupo) {
    if (!porRegra.has(a.regra)) porRegra.set(a.regra, []);
    porRegra.get(a.regra).push(a);
  }
  for (const [regra, itens] of [...porRegra].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  ${regra} (${itens.length})`);
    for (const i of itens.slice(0, 6)) console.log(`    ${i.rota}  ${i.detalhe}`);
    if (itens.length > 6) console.log(`    … e mais ${itens.length - 6}`);
  }
  console.log();
}
process.exit(erros.length ? 1 : 0);
