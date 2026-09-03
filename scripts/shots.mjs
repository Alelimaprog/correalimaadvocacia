/**
 * Captura de screenshots para o ciclo de crítica visual.
 *
 * Pipeline: CRIAR → SERVIR → SCREENSHOT → VER → CRITICAR → CORRIGIR → REPETIR.
 * Os PNGs gerados são lidos com visão e submetidos à skill `direcao-de-arte`.
 *
 *   npm run build && npm run shots -- /trab/
 *   npm run shots -- /trab/ --full                    # página inteira
 *   npm run shots -- / --tag rodada-3                 # nomeia a rodada
 *
 * Viewports obrigatórios do projeto: 1440 / 1024 / 768 / 390.
 * Saída em .shots/ (fora do versionamento).
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900, scale: 1 },
  { name: 'laptop-1024', width: 1024, height: 768, scale: 1 },
  { name: 'tablet-768', width: 768, height: 1024, scale: 2 },
  { name: 'mobile-390', width: 390, height: 844, scale: 2, isMobile: true },
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const tagIdx = args.indexOf('--tag');
const tag = tagIdx !== -1 ? args[tagIdx + 1] : null;
const route = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--tag' && args[i - 1] !== '--click') || '/';
const fullPage = flags.has('--full');
const clickIdx = args.indexOf('--click');
const clickSel = clickIdx !== -1 ? args[clickIdx + 1] : null;

const DIST = resolve('dist');
if (!existsSync(DIST)) {
  console.error('dist/ não existe. Rode `npm run build` antes.');
  process.exit(1);
}

/** Serve dist/ estaticamente, resolvendo /rota/ → dist/rota/index.html. */
function serveDist() {
  const server = createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = join(DIST, path);
      if (!file.startsWith(DIST)) return res.writeHead(403).end();
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const server = await serveDist();
const base = `http://127.0.0.1:${server.address().port}`;
const outDir = join('.shots', tag ?? new Date().toISOString().slice(11, 19).replace(/:/g, ''));
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const written = [];

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    isMobile: vp.isMobile ?? false,
    hasTouch: vp.isMobile ?? false,
  });
  const res = await page.goto(base + route, { waitUntil: 'networkidle' });
  if (!res?.ok()) {
    console.error(`  ! ${vp.name}: HTTP ${res?.status()} em ${route}`);
    await page.close();
    continue;
  }
  // Fontes carregadas e animações de entrada estabilizadas antes do frame.
  await page.evaluate(() => document.fonts.ready);
  // Estado interativo: dispara o seletor antes do frame, para capturar a resposta aberta.
  if (clickSel) {
    const target = page.locator(clickSel).first();
    if (await target.count()) await target.click();
  }
  await page.waitForTimeout(400);

  const file = join(outDir, `${vp.name}${fullPage ? '-full' : ''}.png`);
  await page.screenshot({ path: file, fullPage });
  written.push(file);
  console.log(`  ✓ ${vp.name.padEnd(13)} ${file}`);
  await page.close();
}

await browser.close();
server.close();

console.log(`\n${written.length}/${VIEWPORTS.length} capturas em ${outDir}`);
console.log('Próximo passo obrigatório: ler cada PNG e submeter à skill `direcao-de-arte`.');
