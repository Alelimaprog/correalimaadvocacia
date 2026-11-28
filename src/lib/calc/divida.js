// Atualização de dívidas — funções puras. Séries mensais em % ({"2026-01": 0.33, ...}).
import { r2 } from './comex.js';

const ym = (d) => d.slice(0, 7);
function nextYm(s) { let [y, m] = s.split('-').map(Number); m++; if (m > 12) { m = 1; y++; } return `${y}-${String(m).padStart(2, '0')}`; }
/** Meses de competência entre a data inicial (inclusive) e a final (exclusive), ex.: 2026-01-15 → 2026-04-10 = jan, fev, mar. */
export function mesesEntre(iniISO, fimISO) {
  const out = []; let c = ym(iniISO); const f = ym(fimISO);
  while (c < f) { out.push(c); c = nextYm(c); }
  return out;
}
export function diasEntre(iniISO, fimISO) { return Math.round((Date.parse(fimISO + 'T00:00:00Z') - Date.parse(iniISO + 'T00:00:00Z')) / 86400000); }

/** Fator acumulado de uma série mensal (% ao mês) nos meses dados. Retorna {fator, faltando[]} */
export function fatorAcumulado(serie, meses) {
  let fator = 1; const faltando = [];
  for (const m of meses) { if (serie[m] == null) faltando.push(m); else fator *= 1 + serie[m] / 100; }
  return { fator, faltando };
}

/**
 * Atualiza um valor.
 * @param p.valor, p.inicio (AAAA-MM-DD), p.fim, p.indice: série mensal de correção ou null,
 *        p.juros: { tipo: 'simples', taxaMes } | { tipo: 'taxaLegal', selic, ipca } | { tipo: 'nenhum' },
 *        p.multaPct (sobre o valor corrigido), p.honorariosPct (sobre o total)
 */
export function atualizarDivida(p) {
  const erros = [];
  if (!(p.valor > 0)) erros.push('Valor: informe um número maior que zero.');
  const di = Date.parse(p.inicio + 'T00:00:00Z'), df = Date.parse(p.fim + 'T00:00:00Z');
  if (!Number.isFinite(di) || !Number.isFinite(df)) erros.push('Informe as duas datas.');
  else if (df < di) erros.push('A data final não pode ser anterior à data do vencimento.');
  if (p.multaPct != null && !(p.multaPct >= 0 && p.multaPct <= 100)) erros.push('Multa: informe um percentual entre 0 e 100.');
  if (p.honorariosPct != null && !(p.honorariosPct >= 0 && p.honorariosPct <= 100)) erros.push('Honorários: informe um percentual entre 0 e 100.');
  if (p.juros?.tipo === 'simples' && !(p.juros.taxaMes >= 0 && p.juros.taxaMes <= 20)) erros.push('Juros: informe uma taxa mensal entre 0 e 20%.');
  if (erros.length) return { ok: false, erros };

  const meses = mesesEntre(p.inicio, p.fim);
  const dias = diasEntre(p.inicio, p.fim);
  let faltando = [];
  let fatorCorrecao = 1;
  if (p.indice) { const a = fatorAcumulado(p.indice, meses); fatorCorrecao = a.fator; faltando = faltando.concat(a.faltando); }
  const corrigido = p.valor * fatorCorrecao;
  let jurosPct = 0;
  if (p.juros?.tipo === 'simples') jurosPct = p.juros.taxaMes * (dias / 30);
  else if (p.juros?.tipo === 'taxaLegal') {
    // Taxa legal (CC, art. 406, red. Lei 14.905/2024): Selic menos IPCA, sem resultado negativo, somada mês a mês (juros simples).
    for (const m of meses) {
      if (p.juros.selic[m] == null || p.juros.ipca[m] == null) { faltando.push(m); continue; }
      jurosPct += Math.max(0, p.juros.selic[m] - p.juros.ipca[m]);
    }
  }
  const juros = corrigido * jurosPct / 100;
  const multa = corrigido * (p.multaPct || 0) / 100;
  const subtotal = corrigido + juros + multa;
  const honorarios = subtotal * (p.honorariosPct || 0) / 100;
  return {
    ok: true, meses: meses.length, dias, fatorCorrecao: Math.round(fatorCorrecao * 1e6) / 1e6,
    correcao: r2(corrigido - p.valor), corrigido: r2(corrigido), jurosPct: Math.round(jurosPct * 10000) / 10000,
    juros: r2(juros), multa: r2(multa), honorarios: r2(honorarios), total: r2(subtotal + honorarios),
    faltando: [...new Set(faltando)].sort(),
  };
}
