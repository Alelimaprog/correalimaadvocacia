/**
 * auditar-no-ar.mjs — confere o SITE PUBLICADO, não o build.
 *
 * O build pode estar perfeito e o ar, errado: foi o que aconteceu quando o FTP
 * publicava numa pasta que não servia o domínio. Este script pergunta ao
 * domínio, uma rota de cada vez, se o que está lá é o que saiu daqui.
 *
 * Verifica: toda rota do sitemap responde 200; o HTML no ar é byte-a-byte o do
 * build; as páginas com `noindex` continuam com `noindex`; os redirecionamentos
 * 301 funcionam; e nenhum arquivo que não deveria estar público responde.
 *
 *   npm run build && node scripts/auditar-no-ar.mjs
 */
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const SITE = process.env.SITE_URL ?? 'https://correalimaadvocacia.com.br';
const DIST = resolve('dist');
const PARALELO = 8;

const achados = [];
const nota = (nivel, regra, detalhe) => achados.push({ nivel, regra, detalhe });

const sha = (b) => createHash('sha1').update(b).digest('hex');

/**
 * Desfaz o que o Cloudflare injeta, para que a comparação só acuse diferença
 * real. São duas coisas, em toda página:
 *
 *   1. Ofuscação de e-mail (Scrape Shield): troca cada `mailto:` por
 *      `/cdn-cgi/l/email-protection#<hex>` e o texto por um marcador, que um
 *      script devolve ao original no carregamento. +1211 bytes.
 *   2. Detecção de bots (challenge-platform/jsd): um script embutido que cria
 *      um iframe oculto. +938 bytes.
 *
 * Sem normalizar as duas, as 135 páginas apareceriam divergentes e uma
 * diferença verdadeira passaria despercebida no meio delas.
 */
function semCloudflare(html) {
  return html
    .replace(/<a\b([^>]*?)href="\/cdn-cgi\/l\/email-protection#[0-9a-f]+"/gi, '<a$1href="mailto:CF"')
    .replace(/href="\/cdn-cgi\/l\/email-protection[^"]*"/gi, 'href="mailto:CF"')
    // O Cloudflare usa <span class="__cf_email__"> no texto solto e
    // <a class="__cf_email__"> quando o e-mail já era um link: as duas formas
    // aparecem no mesmo site, então a regra cobre qualquer elemento.
    .replace(/<(span|a)\b[^>]*class="[^"]*__cf_email__[^"]*"[^>]*>[\s\S]*?<\/\1>/gi, 'CF')
    .replace(/<script[^>]*\/cdn-cgi\/scripts\/[^<]*<\/script>/gi, '')
    // Ancorado na assinatura exata do script do Cloudflare. Com um `[\s\S]*?`
    // solto antes do marcador, o casamento começava no primeiro <script> da
    // página e engolia 40 KB de conteúdo real — mascarando justamente as
    // diferenças que esta auditoria existe para encontrar.
    .replace(
      /<script\b[^>]*>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>/gi,
      '',
    )
    .replace(/mailto:[^"]*correalimaadvocacia\.com\.br/gi, 'mailto:CF')
    .replace(/contato@correalimaadvocacia\.com\.br/gi, 'CF');
}

async function paginas(dir = DIST, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await paginas(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/** Roda `tarefa` sobre `itens` com concorrência limitada. */
async function emLotes(itens, tarefa, n = PARALELO) {
  const fila = [...itens];
  const correndo = Array.from({ length: Math.min(n, fila.length) }, async () => {
    while (fila.length) await tarefa(fila.shift());
  });
  await Promise.all(correndo);
}

const arquivos = (await paginas()).sort();
const rotaDe = (f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');

console.log(`Conferindo ${arquivos.length} páginas em ${SITE}\n`);

// ── 1. Cada página do build responde e é idêntica à do ar ────────────────
let iguais = 0;
await emLotes(arquivos, async (f) => {
  const rota = rotaDe(f);
  const local = await readFile(f);
  try {
    const r = await fetch(SITE + rota, { redirect: 'manual' });
    if (r.status !== 200) {
      nota('erro', 'rota', `${rota} respondeu ${r.status}`);
      return;
    }
    const remoto = Buffer.from(await r.arrayBuffer());
    const a = semCloudflare(local.toString('utf8'));
    const b = semCloudflare(remoto.toString('utf8'));
    if (sha(Buffer.from(a)) !== sha(Buffer.from(b))) {
      nota('aviso', 'divergente', `${rota} — no ar ${remoto.length}b, no build ${local.length}b`);
    } else {
      iguais += 1;
    }
    // `noindex` do build tem de valer no ar.
    const querNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(local.toString());
    const temNoindex = /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(remoto.toString());
    if (querNoindex && !temNoindex) nota('erro', 'noindex', `${rota} perdeu o noindex no ar`);
  } catch (e) {
    nota('erro', 'rota', `${rota} — ${e.message}`);
  }
});

// ── 2. Arquivos de apoio ─────────────────────────────────────────────────
for (const p of ['/sitemap.xml', '/robots.txt', '/rss.xml', '/favicon.ico', '/site.webmanifest']) {
  const r = await fetch(SITE + p).catch(() => null);
  if (!r || !r.ok) nota('erro', 'apoio', `${p} respondeu ${r?.status ?? 'erro de rede'}`);
}

// ── 3. O sitemap no ar aponta só para rotas que existem ──────────────────
try {
  const xml = await (await fetch(SITE + '/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const existentes = new Set(arquivos.map(rotaDe));
  for (const loc of locs) {
    const rota = loc.replace(SITE, '');
    if (!existentes.has(rota)) nota('erro', 'sitemap', `aponta para ${rota}, que não existe no build`);
  }
  // E nenhuma página noindex pode estar no sitemap.
  for (const f of arquivos) {
    const corpo = await readFile(f, 'utf8');
    if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(corpo) && locs.includes(SITE + rotaDe(f))) {
      nota('erro', 'sitemap', `${rotaDe(f)} é noindex e está no sitemap`);
    }
  }
  console.log(`sitemap: ${locs.length} URLs`);
} catch (e) {
  nota('erro', 'sitemap', e.message);
}

// ── 4. Redirecionamentos que o .htaccess promete ─────────────────────────
const REDIRECIONAMENTOS = [
  ['/areas-de-atuacao/direito-aduaneiro-comercio-exterior/', '/areas-de-atuacao/direito-aduaneiro-tributario/'],
];
for (const [de, para] of REDIRECIONAMENTOS) {
  const r = await fetch(SITE + de, { redirect: 'manual' }).catch(() => null);
  const destino = r?.headers.get('location') ?? '';
  if (!r || ![301, 308].includes(r.status) || !destino.endsWith(para)) {
    nota('erro', 'redirect', `${de} -> ${r?.status ?? 'erro'} ${destino || '(sem Location)'}; esperado 301 para ${para}`);
  }
}

// ── 5. Nada que não deveria estar público ────────────────────────────────
const NAO_DEVERIA = [
  '/.deploy-manifest.json', '/.git/config', '/.env', '/package.json',
  '/error_log', '/install/', '/update/', '/wp-admin/', '/wp-config.php',
  '/sitemap-index.xml', '/LEIA-ME.txt', '/RELATORIO.md', '/agora.txt',
  '/gerar_hash.php', '/alexandre.php', '/teste-atribuicao.php', '/teste-precisao.php',
];
await emLotes(NAO_DEVERIA, async (p) => {
  const r = await fetch(SITE + p, { redirect: 'manual' }).catch(() => null);
  if (r && r.status === 200) nota('aviso', 'exposto', `${p} responde 200`);
});

// ── Relatório ────────────────────────────────────────────────────────────
const erros = achados.filter((a) => a.nivel === 'erro');
const avisos = achados.filter((a) => a.nivel === 'aviso');
console.log(`\n${iguais}/${arquivos.length} páginas idênticas ao build · ${erros.length} erros · ${avisos.length} avisos\n`);

for (const nivel of ['erro', 'aviso']) {
  const grupo = achados.filter((a) => a.nivel === nivel);
  if (!grupo.length) continue;
  console.log(nivel === 'erro' ? '── ERROS ──' : '── AVISOS ──');
  const porRegra = new Map();
  for (const a of grupo) {
    if (!porRegra.has(a.regra)) porRegra.set(a.regra, []);
    porRegra.get(a.regra).push(a.detalhe);
  }
  for (const [regra, itens] of [...porRegra].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n  ${regra} (${itens.length})`);
    for (const d of itens.slice(0, 10)) console.log(`    ${d}`);
    if (itens.length > 10) console.log(`    … e mais ${itens.length - 10}`);
  }
  console.log();
}
process.exit(erros.length ? 1 : 0);
