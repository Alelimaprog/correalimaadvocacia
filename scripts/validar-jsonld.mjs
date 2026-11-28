#!/usr/bin/env node
/**
 * Validador local de dados estruturados (JSON-LD) do build estático.
 *
 * Para cada HTML em dist/ (ou no diretório passado como 1º argumento):
 *   - extrai os blocos <script type="application/ld+json">;
 *   - confere que são JSON válido e que @context é schema.org;
 *   - confere campos obrigatórios do Google nos tipos comuns:
 *       Article/BlogPosting/NewsArticle: headline, datePublished, author (com name);
 *       BreadcrumbList: itemListElement com position (1..n), name e item
 *         (o item do último elemento é opcional, como o Google aceita);
 *       Organization/LegalService/LocalBusiness/Attorney: name e url
 *         (referências puras, só com @id, são aceitas);
 *       FAQPage: cada pergunta (name) e resposta (acceptedAnswer.text) precisa
 *         aparecer no texto visível da página.
 *
 * Uso: node scripts/validar-jsonld.mjs [dist]
 * Sai com código 1 se houver erro. Avisos não reprovam.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const RAIZ = process.argv[2] || 'dist';

const ARTIGO = new Set(['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'ScholarlyArticle']);
const ORG = new Set(['Organization', 'LegalService', 'LocalBusiness', 'Attorney', 'ProfessionalService']);

async function* htmls(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmls(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decodifica(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
function normaliza(s) {
  return decodifica(String(s))
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}
function textoVisivel(html) {
  const corpo = html
    .replace(/<head[\s\S]*?<\/head>/i, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  return normaliza(corpo.replace(/<[^>]+>/g, ' '));
}
function semTags(s) {
  return String(s).replace(/<[^>]+>/g, ' ');
}

const tipos = (n) => (Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : []);
const ehRef = (n) => Object.keys(n).every((k) => k === '@id' || k === '@type');
const temTexto = (v) => typeof v === 'string' && v.trim() !== '';
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

function validaNo(n, ctx, principal) {
  const ts = tipos(n);
  const { aviso } = ctx;
  // Entidade principal (nível superior ou @graph): falta de campo obrigatório é erro.
  // Entidade aninhada (ex.: Article resumido em hasPart, órgão em recognizedBy): só aviso,
  // porque o Google não a trata como item de resultado rico próprio.
  const erroOuAviso = principal ? ctx.erro : (msg) => aviso(`(aninhado) ${msg}`);
  const erro = ctx.erro;
  if (ts.some((t) => ARTIGO.has(t)) && !ehRef(n)) {
    const erro = erroOuAviso;
    if (!temTexto(n.headline)) erro(`${ts.join('/')}: falta headline`);
    if (!temTexto(n.datePublished)) erro(`${ts.join('/')}: falta datePublished`);
    else if (Number.isNaN(Date.parse(n.datePublished))) erro(`${ts.join('/')}: datePublished inválida (${n.datePublished})`);
    if (n.dateModified && Number.isNaN(Date.parse(n.dateModified))) erro(`${ts.join('/')}: dateModified inválida (${n.dateModified})`);
    const autores = Array.isArray(n.author) ? n.author : n.author ? [n.author] : [];
    if (!autores.length) erro(`${ts.join('/')}: falta author`);
    for (const a of autores) if (!isObj(a) || !temTexto(a.name)) erro(`${ts.join('/')}: author sem name`);
  }
  if (ts.includes('BreadcrumbList')) {
    const it = n.itemListElement;
    if (!Array.isArray(it) || !it.length) erro('BreadcrumbList: itemListElement vazio ou ausente');
    else
      it.forEach((li, i) => {
        if (!isObj(li)) return erro(`BreadcrumbList[${i}]: não é objeto`);
        if (li.position !== i + 1) erro(`BreadcrumbList[${i}]: position ${li.position}, esperado ${i + 1}`);
        const nome = li.name ?? (isObj(li.item) ? li.item.name : undefined);
        if (!temTexto(nome)) erro(`BreadcrumbList[${i}]: falta name`);
        const url = isObj(li.item) ? li.item['@id'] : li.item;
        const ultimo = i === it.length - 1;
        if (!temTexto(url)) {
          if (!ultimo) erro(`BreadcrumbList[${i}]: falta item`);
        } else if (!/^https?:\/\//.test(url)) erro(`BreadcrumbList[${i}]: item não é URL absoluta (${url})`);
      });
  }
  if (ts.some((t) => ORG.has(t)) && !ehRef(n)) {
    const erro = erroOuAviso;
    if (!temTexto(n.name)) erro(`${ts.join('/')}: falta name`);
    if (!temTexto(n.url)) erro(`${ts.join('/')}: falta url`);
  }
  if (ts.includes('FAQPage')) {
    const qs = Array.isArray(n.mainEntity) ? n.mainEntity : n.mainEntity ? [n.mainEntity] : [];
    if (!qs.length) erro('FAQPage: sem perguntas (mainEntity)');
    qs.forEach((q, i) => {
      if (!isObj(q) || !tipos(q).includes('Question')) return erro(`FAQPage[${i}]: não é Question`);
      if (!temTexto(q.name)) return erro(`FAQPage[${i}]: pergunta sem name`);
      const r = isObj(q.acceptedAnswer) ? q.acceptedAnswer.text : undefined;
      if (!temTexto(r)) erro(`FAQPage[${i}]: sem acceptedAnswer.text`);
      if (!ctx.visivel.includes(normaliza(semTags(q.name))))
        erro(`FAQPage[${i}]: pergunta não aparece na página: "${q.name.slice(0, 80)}"`);
      else if (temTexto(r)) {
        // Compara um trecho do início da resposta (o HTML pode quebrar a frase em elementos).
        const trecho = normaliza(semTags(r)).slice(0, 60);
        if (!ctx.visivel.includes(trecho)) aviso(`FAQPage[${i}]: início da resposta não encontrado no texto da página: "${trecho}"`);
      }
    });
  }
}

function percorre(v, ctx, principal = true) {
  if (Array.isArray(v)) return v.forEach((x) => percorre(x, ctx, principal));
  if (!isObj(v)) return;
  validaNo(v, ctx, principal);
  for (const [k, x] of Object.entries(v)) if (k !== '@context') percorre(x, ctx, k === '@graph' && principal);
}

const CONTEXTO = /^https?:\/\/schema\.org\/?$/;
let paginas = 0, comJsonLd = 0, blocos = 0, erros = 0, avisos = 0;
const contagem = {};

for await (const arq of htmls(RAIZ)) {
  paginas++;
  const html = await readFile(arq, 'utf8');
  const rel = relative(RAIZ, arq);
  const re = /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m, achou = false, visivel = null;
  while ((m = re.exec(html))) {
    achou = true;
    blocos++;
    const erro = (msg) => { erros++; console.log(`ERRO  ${rel}: ${msg}`); };
    const aviso = (msg) => { avisos++; console.log(`aviso ${rel}: ${msg}`); };
    let dado;
    try {
      dado = JSON.parse(m[1]);
    } catch (e) {
      erro(`JSON inválido (${e.message})`);
      continue;
    }
    visivel ??= textoVisivel(html);
    const topo = Array.isArray(dado) ? dado : [dado];
    for (const n of topo) {
      if (!isObj(n)) { erro('bloco de nível superior não é objeto'); continue; }
      if (!CONTEXTO.test(String(n['@context'] ?? ''))) erro(`@context não é schema.org (${n['@context']})`);
      for (const t of tipos(n)) contagem[t] = (contagem[t] || 0) + 1;
      if (Array.isArray(n['@graph'])) n['@graph'].forEach((g) => isObj(g) && tipos(g).forEach((t) => (contagem[t] = (contagem[t] || 0) + 1)));
    }
    percorre(dado, { erro, aviso, visivel });
  }
  if (achou) comJsonLd++;
}

console.log(`\n${paginas} páginas HTML, ${comJsonLd} com JSON-LD, ${blocos} blocos.`);
console.log('Tipos de nível superior:', Object.entries(contagem).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(', '));
console.log(`${erros} erro(s), ${avisos} aviso(s).`);
process.exit(erros ? 1 : 0);
