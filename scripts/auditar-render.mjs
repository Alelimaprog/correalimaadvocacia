/**
 * auditar-render.mjs — auditoria do que só existe depois de renderizar:
 * overflow horizontal, contraste de texto, área de toque e foco visível.
 *
 * Roda Chromium sobre dist/ em todos os viewports do projeto. Complementa
 * scripts/auditar.mjs, que lê o HTML estático.
 *
 *   node scripts/auditar-render.mjs                 # rotas representativas
 *   node scripts/auditar-render.mjs --todas         # todas as páginas de dist/
 *   node scripts/auditar-render.mjs /contato/ /blog/
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
const PORTA = 4410;

const VIEWPORTS = [
  { nome: 'telefone-360', largura: 360, altura: 740 },
  { nome: 'telefone-390', largura: 390, altura: 844 },
  { nome: 'tablet-768', largura: 768, altura: 1024 },
  { nome: 'laptop-1024', largura: 1024, altura: 768 },
  { nome: 'desktop-1440', largura: 1440, altura: 900 },
  { nome: 'amplo-1920', largura: 1920, altura: 1080 },
];

const PADRAO = [
  '/', '/o-escritorio/', '/areas-de-atuacao/', '/areas-de-atuacao/advocacia-empresarial/',
  '/areas-de-atuacao/recuperacao-de-credito/', '/areas-de-atuacao/direito-aduaneiro-tributario/retencao-de-mercadorias/',
  '/contato/', '/blog/', '/guias/', '/guias/cobranca-execucao-e-recuperacao-de-credito-empresarial/',
  '/assuntos/', '/ferramentas/', '/404.html', '/politica-de-privacidade/', '/trab/',
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff',
  '.ico': 'image/x-icon', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
};

async function todasAsRotas(dir = DIST, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await todasAsRotas(p, acc);
    else if (e.name.endsWith('.html')) acc.push('/' + relative(DIST, p).replace(/index\.html$/, ''));
  }
  return acc;
}

const args = process.argv.slice(2);
const rotas = args.includes('--todas')
  ? (await todasAsRotas()).sort()
  : args.filter((a) => a.startsWith('/')).length
    ? args.filter((a) => a.startsWith('/'))
    : PADRAO;

const servidor = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  try {
    const b = await readFile(join(DIST, p));
    res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
    res.end(b);
  } catch {
    res.writeHead(404);
    res.end('404');
  }
});
await new Promise((r) => servidor.listen(PORTA, r));

/**
 * Executado dentro da página: tudo que depende de layout e cor computados.
 *
 * Percorre a página em passos de uma tela, porque a resolução de fundo usa
 * `elementsFromPoint` — que só responde dentro da viewport. Avaliar tudo de uma
 * vez fazia cada elemento abaixo da dobra herdar a pilha errada e reprovar em
 * 1:1. Cada elemento é medido quando está efetivamente visível.
 */
async function sonda() {
  const resultado = { overflow: null, contraste: [], toque: [], consoleErros: [] };
  const raiz = document.documentElement;

  if (raiz.scrollWidth > raiz.clientWidth + 1) {
    const culpados = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right > raiz.clientWidth + 1 || r.left < -1) {
        const pai = el.parentElement;
        const rp = pai?.getBoundingClientRect();
        // Só interessa o elemento que estoura sem que o pai já estoure.
        if (!rp || (rp.right <= raiz.clientWidth + 1 && rp.left >= -1)) {
          culpados.push(
            el.tagName.toLowerCase() +
              (typeof el.className === 'string' && el.className.trim()
                ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
                : '') +
              ` [${Math.round(r.left)}..${Math.round(r.right)}]`,
          );
        }
      }
    }
    resultado.overflow = { scrollW: raiz.scrollWidth, clientW: raiz.clientWidth, culpados: [...new Set(culpados)].slice(0, 6) };
  }

  // ── Contraste ────────────────────────────────────────────────────────
  const canal = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);

  /**
   * Converte o que getComputedStyle devolve para [r,g,b,a] em 0–255.
   * `color-mix()` faz o Chromium responder `color(srgb 1 1 1 / 0.86)`, com os
   * canais em 0–1: lido como rgb() isso virava quase-preto, e todo texto do
   * cabeçalho aparecia reprovado em 1.07:1.
   */
  function cor(valor) {
    if (!valor) return [0, 0, 0, 0];
    const srgb = valor.match(/^color\(\s*srgb\s+([^)]+)\)/i);
    if (srgb) {
      const partes = srgb[1].split('/');
      const canais = (partes[0].trim().match(/[-\d.eE]+/g) || []).slice(0, 3).map(Number);
      const a = partes[1] !== undefined ? Number((partes[1].match(/[-\d.eE]+/) || [1])[0]) : 1;
      while (canais.length < 3) canais.push(0);
      return [...canais.map((c) => Math.max(0, Math.min(1, c)) * 255), a];
    }
    const n = (valor.match(/[-\d.eE]+/g) || []).map(Number);
    if (n.length < 3) return [0, 0, 0, 0];
    return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  }
  const rgb = (s) => cor(s).slice(0, 3);
  const alfa = (s) => cor(s)[3];

  function mistura(frente, a, fundo) {
    return frente.map((c, i) => c * a + fundo[i] * (1 - a));
  }
  /**
   * Compõe as camadas de fundo efetivamente pintadas sob o elemento.
   *
   * Usa `elementsFromPoint` em vez da cadeia de ancestrais porque o que está
   * atrás de um elemento nem sempre é seu pai: o cabeçalho é `sticky` e flutua
   * por cima do hero sem ser filho dele. Pela cadeia do DOM o fundo apurado era
   * o branco da raiz, e o logotipo claro sobre o hero navy aparecia reprovado
   * em 1.09:1 — quando no ar o contraste é de 14:1.
   */
  function fundoDe(el) {
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(r.left + r.width / 2, 1), window.innerWidth - 1);
    const y = Math.min(Math.max(r.top + r.height / 2, 1), window.innerHeight - 1);
    const pilha = document.elementsFromPoint(x, y);
    // O próprio elemento entra na pilha: o fundo de um botão é pintado por ele
    // mesmo, e ignorá-lo fazia texto branco sobre navy aparecer como 1:1.
    const base = pilha.length ? pilha : [el];
    const camadas = [];
    for (const n of base) {
      const cs = getComputedStyle(n);
      const a = alfa(cs.backgroundColor) * (Number(cs.opacity) || 1);
      if (a > 0.004) {
        camadas.push([rgb(cs.backgroundColor), a]);
        if (a > 0.995) break;
      }
    }
    let fundo = [255, 255, 255];
    for (let i = camadas.length - 1; i >= 0; i--) {
      fundo = mistura(camadas[i][0], camadas[i][1], fundo);
    }
    return fundo;
  }
  /** Fora da tela, recortado ou dentro de um bloco recolhido. */
  function escondido(el, r) {
    if (r.right < -500 || r.bottom < -500) return true;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return true;
    if (cs.clipPath && cs.clipPath !== 'none' && r.width <= 2) return true;
    if (el.closest('[aria-hidden="true"]')) return true;
    // Conteúdo de um <details> recolhido continua com caixa medida pelo
    // Chromium, mas não é pintado: o ponto de teste caía na seção escura
    // atrás e a resposta da FAQ aparecia reprovada em 2.13:1.
    const det = el.closest('details');
    if (det && !det.open && !el.closest('summary')) return true;
    return false;
  }

  /** O elemento está realmente pintado nesta posição (não coberto, não oculto)? */
  function pintado(el, r) {
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) return false;
    const pilha = document.elementsFromPoint(x, y);
    return pilha.some((n) => n === el || el.contains(n));
  }

  const classeDe = (el) =>
    el.tagName.toLowerCase() +
    (typeof el.className === 'string' && el.className.trim()
      ? '.' + el.className.trim().split(/\s+/)[0]
      : '');

  /** Está dentro da tela o bastante para `elementsFromPoint` responder? */
  const naTela = (r) =>
    r.bottom > 4 && r.top < window.innerHeight - 4 && r.right > 0 && r.left < window.innerWidth;

  const vistos = new Set();
  const alvosVistos = new Set();
  const avaliados = new WeakSet();

  const textos = document.querySelectorAll(
    'p,li,a,span,h1,h2,h3,h4,h5,h6,button,label,summary,td,th,figcaption',
  );
  const alvos = document.querySelectorAll('a,button,input,select,textarea,summary,[role="button"]');

  function medirTextos() {
    for (const el of textos) {
      if (avaliados.has(el)) continue;
      const texto = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join('');
      if (texto.length < 3) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (escondido(el, r)) continue;
      if (!naTela(r)) continue;
      if (!pintado(el, r)) continue;
      avaliados.add(el);

      const cs = getComputedStyle(el);
      const fundo = fundoDe(el);
      const frente = mistura(rgb(cs.color), alfa(cs.color), fundo);
      const l1 = lum(frente), l2 = lum(fundo);
      const razao = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

      const px = parseFloat(cs.fontSize);
      const peso = Number(cs.fontWeight) || 400;
      const grande = px >= 24 || (px >= 18.66 && peso >= 700);
      const minimo = grande ? 3 : 4.5;
      if (razao < minimo) {
        const chave = `${cs.color}|${cs.fontSize}|${el.className}`;
        if (vistos.has(chave)) continue;
        vistos.add(chave);
        resultado.contraste.push({
          seletor: classeDe(el),
          texto: texto.slice(0, 40),
          razao: Number(razao.toFixed(2)),
          minimo,
        });
      }
    }
  }

  function medirAlvos() {
    for (const el of alvos) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (escondido(el, r)) continue;
      const cs = getComputedStyle(el);
      // A WCAG 2.2 (2.5.8) isenta o alvo "em linha": o link embutido numa
      // frase, cujo tamanho é o da própria tipografia. O teste é esse mesmo —
      // o link é inline E o texto ao redor é maior que o dele. Checar só o
      // ancestral `p`/`li` deixava de fora links dentro de `label`, que são
      // igualmente texto corrido.
      if (el.tagName === 'A' && cs.display.startsWith('inline')) {
        const pai = el.parentElement;
        const meu = (el.textContent || '').trim().length;
        const dele = (pai?.textContent || '').trim().length;
        if (pai && dele > meu * 1.25) continue;
      }
      let alt = r.height, larg = r.width;
      for (const pseudo of ['::before', '::after']) {
        const ps = getComputedStyle(el, pseudo);
        if (ps.content && ps.content !== 'none' && ps.position === 'absolute') {
          const h = parseFloat(ps.height), w = parseFloat(ps.width);
          if (!Number.isNaN(h)) alt = Math.max(alt, h);
          if (!Number.isNaN(w)) larg = Math.max(larg, w);
        }
      }
      if (alt < 24 || larg < 24) {
        const chave = el.tagName + '|' + (typeof el.className === 'string' ? el.className : '');
        if (alvosVistos.has(chave)) continue;
        alvosVistos.add(chave);
        resultado.toque.push({
          seletor: classeDe(el),
          texto: (el.textContent || '').trim().slice(0, 30),
          tamanho: `${Math.round(larg)}x${Math.round(alt)}`,
        });
      }
    }
  }

  const quadro = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const passo = Math.max(200, Math.round(window.innerHeight * 0.8));
  const fim = document.documentElement.scrollHeight;
  for (let y = 0; y < fim; y += passo) {
    window.scrollTo(0, y);
    await quadro();
    medirTextos();
    medirAlvos();
    if (window.scrollY + window.innerHeight >= fim - 2) break;
  }
  window.scrollTo(0, 0);
  await quadro();
  medirTextos();
  medirAlvos();

  return resultado;
}

const navegador = await chromium.launch();
const achados = [];
const nota = (rota, vp, regra, detalhe) => achados.push({ rota, vp, regra, detalhe });

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: vp.largura, height: vp.altura } });
  for (const rota of rotas) {
    const pagina = await ctx.newPage();
    const erros = [];
    pagina.on('console', (m) => { if (m.type() === 'error') erros.push(m.text().slice(0, 120)); });
    pagina.on('pageerror', (e) => erros.push(String(e).slice(0, 120)));
    try {
      await pagina.goto(`http://127.0.0.1:${PORTA}${rota}`, { waitUntil: 'networkidle', timeout: 20000 });
      await pagina.evaluate(() => document.getElementById('cl-consent')?.remove());
      const r = await pagina.evaluate(sonda);
      if (r.overflow) nota(rota, vp.nome, 'overflow', `${r.overflow.scrollW} > ${r.overflow.clientW} · ${r.overflow.culpados.join(' · ')}`);
      for (const c of r.contraste) nota(rota, vp.nome, 'contraste', `${c.seletor} ${c.razao}:1 (mín. ${c.minimo}) "${c.texto}"`);
      for (const t of r.toque) nota(rota, vp.nome, 'area-de-toque', `${t.seletor} ${t.tamanho} "${t.texto}"`);
      for (const e of erros) nota(rota, vp.nome, 'console', e);
    } catch (e) {
      nota(rota, vp.nome, 'falha', String(e).slice(0, 120));
    }
    await pagina.close();
  }
  await ctx.close();
}
await navegador.close();
servidor.close();

console.log(`${rotas.length} rotas × ${VIEWPORTS.length} viewports · ${achados.length} achados\n`);
const porRegra = new Map();
for (const a of achados) {
  if (!porRegra.has(a.regra)) porRegra.set(a.regra, []);
  porRegra.get(a.regra).push(a);
}
for (const [regra, itens] of [...porRegra].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`── ${regra} (${itens.length})`);
  // Agrupa por detalhe para não repetir o mesmo problema em seis viewports.
  const porDetalhe = new Map();
  for (const i of itens) {
    const k = i.detalhe;
    if (!porDetalhe.has(k)) porDetalhe.set(k, []);
    porDetalhe.get(k).push(`${i.rota}@${i.vp}`);
  }
  for (const [detalhe, ondes] of [...porDetalhe].slice(0, 14)) {
    console.log(`   ${detalhe}`);
    console.log(`     ${ondes.length > 3 ? ondes.slice(0, 3).join(', ') + ` … (${ondes.length} ocorrências)` : ondes.join(', ')}`);
  }
  if (porDetalhe.size > 14) console.log(`   … e mais ${porDetalhe.size - 14} variantes`);
  console.log();
}
process.exit(achados.length ? 1 : 0);
