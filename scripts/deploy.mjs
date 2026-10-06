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

/** Endereço público do site, para conferir se a publicação chegou ao ar. */
const SITE = process.env.SITE_URL ?? 'https://correalimaadvocacia.com.br';

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
/**
 * Confere se o que acabou de subir está no ar.
 *
 * Sem isto, uma publicação pode terminar verde sem ter efeito nenhum: foi o
 * que aconteceu quando a conta de FTP apontava para uma pasta que não era a
 * raiz do domínio. O envio funcionava, o manifesto batia, o job ficava verde —
 * e o site continuava no desenho antigo. Um arquivo com nome versionado é a
 * prova mais barata: se ele não responde 200, a publicação não chegou.
 */
async function conferirNoAr(manifesto) {
  const marcas = Object.keys(manifesto)
    .filter((k) => k.startsWith('_astro/') && (k.endsWith('.css') || k.endsWith('.js')))
    .sort()
    .slice(0, 2);
  if (!marcas.length) {
    relatar('Sem arquivo versionado para conferir — pulando a verificação no ar.');
    return;
  }

  const falhas = [];
  for (const marca of marcas) {
    const url = `${SITE}/${marca}`;
    try {
      const r = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      relatar(`no ar: ${marca} -> ${r.status}`);
      if (!r.ok) falhas.push(`${marca} (${r.status})`);
    } catch (e) {
      falhas.push(`${marca} (${e.message})`);
    }
  }

  if (falhas.length) {
    relatar(
      'A PUBLICAÇÃO NÃO CHEGOU AO AR. Os arquivos subiram e o servidor os aceitou, ' +
        `mas ${SITE} não os serve: ${falhas.join(', ')}. ` +
        'Quase sempre isto quer dizer que a conta de FTP aponta para uma pasta que ' +
        'não é a raiz do domínio — veja a seção de publicação em PENDENCIAS-REDESIGN.md.'
    );
    process.exitCode = 1;
  } else {
    relatar('Publicação confirmada no ar.');
  }
}

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
    // Procura a pasta que o dominio REALMENTE serve. O sinal e o CSS que o
    // site no ar referencia: se ele estiver numa pasta, e aquela a raiz.
    const MARCA_VIVA = 'BaseLayout.B81pT4pJ.css';
    relatar(`procurando ${MARCA_VIVA} — o CSS que o site no ar referencia`);
    for (const base of ['/', '/..', '/../..', '..', '../..']) {
      try {
        const lista = await client.list(base);
        relatar(`${base} -> ${lista.length} itens: ${lista.filter((f) => f.isDirectory).slice(0, 20).map((f) => f.name).join(' | ')}`);
      } catch (e) {
        relatar(`${base} -> inacessível (${e.message})`);
      }
    }
    // Varre as subpastas da raiz atrás de um _astro com a marca viva.
    try {
      const raiz = await client.list('/');
      for (const d of raiz.filter((f) => f.isDirectory)) {
        try {
          const dentro = await client.list(posix.join('/', d.name, '_astro'));
          const achou = dentro.some((f) => f.name === MARCA_VIVA);
          relatar(`/${d.name}/_astro -> ${dentro.length} itens${achou ? '  <<< MARCA VIVA AQUI' : ''}`);
        } catch { /* sem _astro: não é raiz de site */ }
      }
    } catch (e) {
      relatar(`varredura falhou: ${e.message}`);
    }

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
    // A conferência roda MESMO assim. "Nada a enviar" é exatamente o estado em
    // que uma publicação que nunca chegou ao ar se esconde: o manifesto bate
    // com a pasta errada, e sem este passo o job termina verde.
    await conferirNoAr(local);
    await client.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
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

  await conferirNoAr(local);

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
