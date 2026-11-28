#!/usr/bin/env node
/**
 * Baixa séries mensais do Banco Central (SGS, dados abertos, gratuito) para as
 * calculadoras de atualização de dívida: IPCA (433), INPC (188), IGP-M (189) e
 * Selic acumulada no mês (4390). Grava src/data/indices.json.
 * Roda no GitHub Actions antes do build. Se a consulta falhar, mantém o arquivo
 * anterior e sai com código 0 (o site continua publicável com os dados antigos).
 */
import { readFile, writeFile } from 'node:fs/promises';
const ARQ = new URL('../src/data/indices.json', import.meta.url);
const SERIES = { ipca: 433, inpc: 188, igpm: 189, selic: 4390 };
const fmt = (d) => `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;

async function baixar(codigo) {
  const out = {}; const hoje = new Date();
  // A API limita a janela de consulta a 10 anos: busca em blocos.
  for (let ano = 1995; ano <= hoje.getUTCFullYear(); ano += 9) {
    const ini = new Date(Date.UTC(ano, 0, 1)); const fim = new Date(Date.UTC(Math.min(ano + 8, hoje.getUTCFullYear()), 11, 31));
    const url = `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${codigo}/dados?formato=json&dataInicial=${fmt(ini)}&dataFinal=${fmt(fim)}`;
    let tentativas = 0;
    for (;;) {
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (r.status === 404) break; // bloco sem dados
        if (!r.ok) throw new Error('HTTP ' + r.status);
        for (const { data, valor } of await r.json()) { const [, m, y] = data.split('/'); out[`${y}-${m}`] = Number(valor); }
        break;
      } catch (e) { if (++tentativas >= 3) throw new Error(`série ${codigo}: ${e.message}`); await new Promise((s) => setTimeout(s, 2000 * tentativas)); }
    }
  }
  return out;
}

let anterior = null;
try { anterior = JSON.parse(await readFile(ARQ, 'utf8')); } catch {}
try {
  const series = {};
  for (const [nome, cod] of Object.entries(SERIES)) {
    series[nome] = await baixar(cod);
    if (Object.keys(series[nome]).length < 12) throw new Error(`série ${nome} veio com poucos dados`);
  }
  const ultimo = Object.fromEntries(Object.entries(series).map(([k, v]) => [k, Object.keys(v).sort().pop()]));
  await writeFile(ARQ, JSON.stringify({ fonte: 'Banco Central do Brasil — SGS', atualizadoEm: new Date().toISOString().slice(0, 10), ultimo, series }) + '\n');
  console.log('Índices atualizados:', ultimo);
} catch (e) {
  console.warn('Não foi possível atualizar os índices; mantendo o arquivo anterior.', e.message, anterior ? `(${anterior.atualizadoEm})` : '(sem dados)');
}
