#!/usr/bin/env node
/**
 * IndexNow — envia as URLs do sitemap de produção ao endpoint IndexNow.
 * Node nativo (sem dependências). Executar MANUALMENTE após o deploy de produção.
 *
 *   node scripts/indexnow.mjs          # envia apenas URLs novas/alteradas (usa cache)
 *   node scripts/indexnow.mjs --all    # reenvia TODAS as URLs do sitemap
 *   node scripts/indexnow.mjs --dry    # não envia; apenas lista o que seria enviado
 *
 * Pré-requisitos para o envio real:
 *   1) site de produção publicado;
 *   2) https://correalimaadvocacia.com.br/<CHAVE>.txt acessível publicamente;
 *   3) sitemap de produção atualizado.
 *
 * NÃO é executado durante o build. Não deve ser acoplado a preview/local.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import https from 'node:https';

const HOST = 'correalimaadvocacia.com.br';
const DIST = 'dist';
const CACHE = 'scripts/.indexnow-cache.json';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const args = new Set(process.argv.slice(2));
const ALL = args.has('--all');
const DRY = args.has('--dry') || process.env.INDEXNOW_DRY === '1';

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].trim());
}

async function findKey() {
  // procura em dist/ (ou public/) um arquivo <32hex>.txt cujo conteúdo == nome
  for (const dir of [DIST, 'public']) {
    if (!existsSync(dir)) continue;
    let files = [];
    try { files = await readdir(dir); } catch { continue; }
    for (const f of files) {
      if (/^[a-f0-9]{32}\.txt$/.test(f)) {
        const content = (await readFile(join(dir, f), 'utf8')).trim();
        if (content === f.replace(/\.txt$/, '')) return { key: content, file: f };
      }
    }
  }
  return null;
}

async function collectUrls() {
  const index = join(DIST, 'sitemap-index.xml');
  const single = join(DIST, 'sitemap.xml');
  let xml;
  let start;
  if (existsSync(index)) { start = index; xml = await readFile(index, 'utf8'); }
  else if (existsSync(single)) { start = single; xml = await readFile(single, 'utf8'); }
  else throw new Error('Nenhum sitemap encontrado em dist/. Rode `npm run build` antes.');

  const urls = new Set();
  if (/<sitemapindex/i.test(xml)) {
    // é um índice: abre cada sitemap referenciado
    for (const loc of locs(xml)) {
      const name = loc.split('/').pop();
      const p = join(DIST, name);
      if (existsSync(p)) {
        for (const u of locs(await readFile(p, 'utf8'))) urls.add(u);
      }
    }
  } else {
    for (const u of locs(xml)) urls.add(u);
  }

  // valida domínio e deduplica
  const valid = [];
  for (const u of urls) {
    try {
      const host = new URL(u).host;
      if (host === HOST) valid.push(u);
      else console.warn('  ignorada (domínio externo):', u);
    } catch { console.warn('  ignorada (URL inválida):', u); }
  }
  return [...new Set(valid)].sort();
}

async function loadCache() {
  try { return new Set(JSON.parse(await readFile(CACHE, 'utf8'))); } catch { return new Set(); }
}

function post(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      ENDPOINT,
      { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) } },
      (res) => { let d = ''; res.on('data', (c) => (d += c)); res.on('end', () => resolve({ status: res.statusCode, body: d })); }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const keyInfo = await findKey();
  if (!keyInfo) {
    console.error('ERRO: arquivo de chave IndexNow (<32hex>.txt) não encontrado em dist/ nem public/.');
    process.exit(1);
  }
  const keyLocation = `https://${HOST}/${keyInfo.file}`;
  const all = await collectUrls();
  const cache = await loadCache();
  const toSend = ALL ? all : all.filter((u) => !cache.has(u));

  console.log(`IndexNow · host=${HOST}`);
  console.log(`Chave: ${keyInfo.key}  (keyLocation: ${keyLocation})`);
  console.log(`URLs no sitemap: ${all.length} | a enviar: ${toSend.length}${ALL ? ' (--all)' : ' (novas/alteradas)'}`);
  toSend.forEach((u) => console.log('  →', u));

  if (toSend.length === 0) { console.log('Nada a enviar.'); return; }

  if (DRY) {
    console.log('\n[--dry] Nenhuma requisição enviada. Payload que seria enviado:');
    console.log(JSON.stringify({ host: HOST, key: keyInfo.key, keyLocation, urlList: toSend }, null, 2));
    return;
  }

  // Envio em lotes de 10.000 (limite do IndexNow)
  let ok = true;
  for (let i = 0; i < toSend.length; i += 10000) {
    const batch = toSend.slice(i, i + 10000);
    const { status, body } = await post({ host: HOST, key: keyInfo.key, keyLocation, urlList: batch });
    console.log(`Resposta IndexNow: HTTP ${status} ${body ? '· ' + body.slice(0, 120) : ''}`);
    // 200 = aceito; 202 = aceito (processamento); 400/403/422/429 = revisar chave/host/limites
    if (status !== 200 && status !== 202) ok = false;
  }

  if (ok) {
    await writeFile(CACHE, JSON.stringify(all, null, 0));
    console.log('Cache atualizado. Concluído.');
  } else {
    console.error('Envio com falha em algum lote — cache NÃO atualizado. Verifique chave/host publicados.');
    process.exit(1);
  }
})();
