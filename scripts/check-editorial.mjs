// Safeguard editorial (Fase 6):
// 1) Varre o CONTEÚDO-FONTE em busca de marcas de revisão jurídica e gera
//    docs/REVISAO-JURIDICA-PENDENTE.md.
// 2) Varre o BUILD (dist/) e FALHA se alguma marca vazou para o HTML público.
// Uso: node scripts/check-editorial.mjs   (rodar após `npm run build`)
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const FLAG = /REVIS[ÃA]O JUR[ÍI]DICA NECESS[ÁA]RIA:([^*\]\n]*)/g;

async function walk(dir, exts) {
  const out = [];
  let items = [];
  try { items = await readdir(dir); } catch { return out; }
  for (const it of items) {
    const p = join(dir, it);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p, exts)));
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

// 1) Fonte -> relatório
const srcFiles = await walk('src/content', ['.md', '.mdx']);
const pend = [];
for (const f of srcFiles) {
  const txt = await readFile(f, 'utf8');
  let m;
  const re = new RegExp(FLAG.source, 'g');
  while ((m = re.exec(txt))) pend.push({ file: f, nota: m[1].trim() });
}
const lines = [
  '# Revisão jurídica pendente',
  '',
  'Marcas internas encontradas no conteúdo-fonte (não visíveis ao visitante).',
  `Total: **${pend.length}**.`,
  '',
  '| Arquivo | Ponto a confirmar |',
  '|---|---|',
  ...pend.map((p) => `| ${p.file} | ${p.nota} |`),
  '',
];
await writeFile('docs/REVISAO-JURIDICA-PENDENTE.md', lines.join('\n'));
console.log(`[editorial] ${pend.length} marca(s) de revisão no fonte -> docs/REVISAO-JURIDICA-PENDENTE.md`);

// 2) Build -> impedir vazamento
const distFiles = await walk('dist', ['.html']);
const leaked = [];
for (const f of distFiles) {
  const txt = await readFile(f, 'utf8');
  if (/REVIS[ÃA]O JUR[ÍI]DICA NECESS[ÁA]RIA/.test(txt)) leaked.push(f);
}
if (leaked.length) {
  console.error('[editorial] ERRO: marcas de revisão vazaram para o HTML público:');
  leaked.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log('[editorial] OK: nenhuma marca de revisão no HTML público.');
