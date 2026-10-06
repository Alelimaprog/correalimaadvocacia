/**
 * Publicação por FTP — envia dist/ para a hospedagem, só o que mudou.
 *
 *   npm run build
 *   npm run deploy -- --dry-run     # mostra o que subiria, sem enviar nada
 *   npm run deploy                  # envia
 *   npm run deploy -- --prune       # envia e apaga do servidor o que saiu do build
 *
 * Credenciais vêm do ambiente, nunca do código nem da linha de comando:
 *   FTP_HOST        ex.: ftp.correalimaadvocacia.com.br
 *   FTP_USER
 *   FTP_PASSWORD
 *   FTP_PORT        opcional (21)
 *   FTP_SECURE      opcional ('true' para FTPS explícito)
 *   FTP_REMOTE_DIR  opcional (/public_html)
 *
 * Como sabe o que mudou: guarda no servidor um manifesto com o hash de cada
 * arquivo enviado. Na próxima execução baixa esse manifesto e compara. Se ele
 * não existir, envia tudo.
 */
import { Client } from 'basic-ftp';
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir, stat, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative, resolve, posix } from 'node:path';
import { tmpdir } from 'node:os';

/**
 * Relato que sobrevive ao GitHub Actions.
 *
 * O log do job só é servido por um host de blobs que nem toda ferramenta
 * alcança — e foi exatamente isso que escondeu, numa publicação, o fato de os
 * arquivos terem ido para a pasta errada: o job ficou verde e o site, velho.
 * As anotações, ao contrário, voltam pela API do próprio GitHub.
 */
const noActions = Boolean(process.env.GITHUB_ACTIONS);
function relatar(linha) {
  console.log(linha);
  if (noActions) console.log(`::warning title=deploy::${linha.replace(/\n/g, ' ')}`);
}

const DIST = resolve('dist');
const MANIFESTO = '.deploy-manifest.json';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
/** Só olha o servidor e relata: tamanho e data do que está publicado. */
const inspecionar = args.includes('--inspecionar');
const prune = args.includes('--prune');

const cfg = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: Number(process.env.FTP_PORT ?? 21),
  secure: process.env.FTP_SECURE === 'true',
  remoteDir: process.env.FTP_REMOTE_DIR ?? '/public_html',
};

const faltando = ['host', 'user', 'password'].filter((k) => !cfg[k]);
if (faltando.length) {
  console.error(
    `Faltam credenciais no ambiente: ${faltando.map((k) => 'FTP_' + k.toUpperCase()).join(', ')}.\n` +
      'Elas são definidas nas configurações do ambiente, não aqui nem na conversa.'
  );
  process.exit(1);
}
if (!existsSync(DIST)) {
  console.error('dist/ não existe. Rode `npm run build` antes.');
  process.exit(1);
}

/** Lista recursiva de dist/, com o sha1 de cada arquivo. */
async function manifestoLocal(dir = DIST, acc = {}) {
  for (const nome of await readdir(dir)) {
    const p = join(dir, nome);
    const s = await stat(p);
    if (s.isDirectory()) await manifestoLocal(p, acc);
    else acc[relative(DIST, p).split(/[\\/]/).join('/')] = createHash('sha1')
      .update(await readFile(p))
      .digest('hex');
  }
  return acc;
}

const local = await manifestoLocal();
const total = Object.keys(local).length;

/** Marcas de que uma pasta é a raiz do site publicado. */
const MARCAS = ['index.html', '_astro', 'blog', 'areas-de-atuacao', 'sitemap.xml'];

/**
 * Acha a pasta do site. Conforme a conta de FTP esteja presa a public_html ou
 * à raiz da conta, o destino aparece com nome diferente depois do login — por
 * isso procura em vez de exigir acerto na configuração. Relata o que encontrou
 * em cada tentativa, para que uma falha diga onde olhar.
 */
async function acharRaiz(client, pedida, explicita) {
  const inicial = await client.pwd();
  relatar(`Login deixou em: ${inicial}`);

  // Configuração explícita manda: nada de adivinhação.
  if (explicita) {
    await client.cd(pedida);
    return pedida;
  }

  const candidatas = [...new Set([inicial, '/public_html', 'public_html', '/'].filter(Boolean))];
  let comConteudo = null;
  for (const c of candidatas) {
    try {
      await client.cd(c);
      const nomes = (await client.list()).map((f) => f.name);
      const achadas = MARCAS.filter((m) => nomes.includes(m));
      relatar(`candidata ${c} -> ${nomes.length} itens${achadas.length ? ', marcas: ' + achadas.join(', ') : ''}`);
      relatar(`   em ${c}: ${nomes.slice(0, 25).join(' | ') || '(vazia)'}`);
      if (achadas.length) return c;
      if (!comConteudo) comConteudo = c;
    } catch (e) {
      relatar(`candidata ${c} -> inacessível (${e.message})`);
    }
  }

  // Sem marcas reconhecidas: a conta de FTP está presa à pasta do site, e é
  // nela que o login deixou. É o caso de uma primeira publicação, ou de uma
  // listagem que o servidor devolve em formato que não soubemos ler.
  if (comConteudo) {
    relatar(`Nenhuma marca reconhecida; usando ${comConteudo}, onde o login deixou.`);
    await client.cd(comConteudo);
    return comConteudo;
  }
  throw new Error('Não consegui listar nenhuma pasta. Defina FTP_REMOTE_DIR com o caminho correto.');
}

const client = new Client(30_000);
client.ftp.verbose = false;
let tmp;

try {
  await client.access({ ...cfg, secureOptions: { rejectUnauthorized: false } });

  /* Conforme a conta de FTP esteja presa a public_html ou à raiz da conta, o
     destino muda de nome. Em vez de exigir acerto na configuração, procura:
     usa o que foi pedido se existir, senão a primeira pasta que pareça a raiz
     do site (tem index.html). */
  cfg.remoteDir = await acharRaiz(client, cfg.remoteDir, Boolean(process.env.FTP_REMOTE_DIR));
  await client.cd(cfg.remoteDir);
  relatar(`Publicando em ${cfg.host}:${cfg.remoteDir}`);

  if (inspecionar) {
    const alvos = ['index.html', 'brand/alexandre-correa-lima-trabalhista.webp', '_astro', 'brand'];
    for (const alvo of alvos) {
      try {
        const lista = await client.list(posix.join(cfg.remoteDir, alvo));
        if (lista.length === 1 && lista[0].isFile) {
          const f = lista[0];
          relatar(`${alvo}: ${f.size} bytes, modificado ${f.rawModifiedAt ?? f.modifiedAt}`);
        } else {
          relatar(`${alvo}/: ${lista.length} itens — ${lista.slice(0, 8).map((f) => f.name).join(' | ')}`);
        }
      } catch (e) {
        relatar(`${alvo}: NÃO ENCONTRADO (${e.message})`);
      }
    }
    // E onde o servidor realmente coloca o que subimos.
    try {
      const raiz = await client.list(cfg.remoteDir);
      const html = raiz.filter((f) => f.name.endsWith('.html') || f.name === '_astro' || f.name === 'brand');
      relatar(`na raiz: ${html.map((f) => `${f.name} (${f.size}b, ${f.rawModifiedAt ?? f.modifiedAt})`).join(' | ')}`);
    } catch (e) {
      relatar(`listagem da raiz falhou: ${e.message}`);
    }
    process.exit(0);
  }

  // Manifesto da última publicação, se houver.
  let remoto = {};
  tmp = await mkdtemp(join(tmpdir(), 'deploy-'));
  const manifestoTmp = join(tmp, MANIFESTO);
  try {
    await client.downloadTo(manifestoTmp, MANIFESTO);
    remoto = JSON.parse(await readFile(manifestoTmp, 'utf8'));
  } catch {
    relatar('Sem manifesto no servidor — tratando como primeira publicação.');
  }

  const novos = Object.keys(local).filter((k) => !(k in remoto)).sort();
  const alterados = Object.keys(local).filter((k) => k in remoto && remoto[k] !== local[k]).sort();
  const sumidos = Object.keys(remoto).filter((k) => !(k in local)).sort();
  const enviar = [...novos, ...alterados];

  relatar(
    `${total} arquivos em dist/ — novos ${novos.length}, alterados ${alterados.length}, ` +
      `iguais ${total - enviar.length}, no servidor e fora do build ${sumidos.length}` +
      `${prune ? ' (serão apagados)' : ''}`
  );
  if (enviar.length) relatar(`primeiros a enviar: ${enviar.slice(0, 10).join(' | ')}`);

  if (dryRun) {
    console.log('\n--dry-run: nada foi enviado.');
    for (const f of enviar.slice(0, 40)) console.log('   →', f);
    if (enviar.length > 40) console.log(`   ... e mais ${enviar.length - 40}`);
    process.exit(0);
  }

  if (!enviar.length && !(prune && sumidos.length)) {
    relatar('Nada a fazer: o servidor já está igual ao build.');
    process.exit(0);
  }

  let n = 0;
  for (const rel of enviar) {
    const destino = posix.join(cfg.remoteDir, rel);
    const pasta = posix.dirname(destino);
    await client.ensureDir(pasta);
    await client.cd(pasta);
    await client.uploadFrom(join(DIST, rel), posix.basename(destino));
    n += 1;
    if (n === enviar.length) relatar(`${n} de ${enviar.length} arquivos enviados`);
    else if (n % 20 === 0) console.log(`  ${n}/${enviar.length} enviados`);
  }

  if (prune) {
    for (const rel of sumidos) {
      if (rel === MANIFESTO) continue;
      try {
        await client.remove(posix.join(cfg.remoteDir, rel));
        console.log('  apagado', rel);
      } catch (e) {
        console.log('  não consegui apagar', rel, '—', e.message);
      }
    }
  }

  // Grava o manifesto por último: se o envio falhar no meio, a próxima
  // execução reenvia o que ficou pendente em vez de considerar tudo publicado.
  const manifestoNovo = join(tmp, 'novo.json');
  await writeFile(manifestoNovo, JSON.stringify(local, null, 0));
  await client.cd(cfg.remoteDir);
  await client.uploadFrom(manifestoNovo, MANIFESTO);

  console.log(`\nPublicado: ${enviar.length} arquivos enviados para ${cfg.host}${cfg.remoteDir}`);
} catch (e) {
  console.error('\nFalhou:', e.message);
  process.exitCode = 1;
} finally {
  client.close();
  if (tmp) await rm(tmp, { recursive: true, force: true });
}
