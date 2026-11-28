import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mesesEntre, atualizarDivida, fatorAcumulado } from '../src/lib/calc/divida.js';

const ipca = { '2026-01': 1, '2026-02': 1, '2026-03': 1 };
test('meses de competência', () => {
  assert.deepEqual(mesesEntre('2026-01-15', '2026-04-10'), ['2026-01', '2026-02', '2026-03']);
  assert.deepEqual(mesesEntre('2026-01-15', '2026-01-30'), []);
  assert.deepEqual(mesesEntre('2025-12-01', '2026-02-01'), ['2025-12', '2026-01']);
});
test('fator acumulado composto', () => {
  const r = fatorAcumulado(ipca, ['2026-01', '2026-02', '2026-03']);
  assert.equal(Math.round(r.fator * 1e6), 1030301);
  assert.deepEqual(fatorAcumulado(ipca, ['2026-04']).faltando, ['2026-04']);
});
test('correção + juros simples 1% + multa 2% + honorários 10%', () => {
  const r = atualizarDivida({ valor: 1000, inicio: '2026-01-01', fim: '2026-04-01', indice: ipca, juros: { tipo: 'simples', taxaMes: 1 }, multaPct: 2, honorariosPct: 10 });
  // corrigido 1030,30; dias 90 → juros 3% = 30,91; multa 20,61; subtotal 1081,82; honorários 108,18
  assert.equal(r.corrigido, 1030.3); assert.equal(r.juros, 30.91); assert.equal(r.multa, 20.61); assert.equal(r.honorarios, 108.18); assert.equal(r.total, 1190.0);
});
test('taxa legal = Selic − IPCA, nunca negativa', () => {
  const selic = { '2026-01': 1.2, '2026-02': 0.5 }; const ip = { '2026-01': 0.4, '2026-02': 0.9 };
  const r = atualizarDivida({ valor: 1000, inicio: '2026-01-10', fim: '2026-03-10', indice: null, juros: { tipo: 'taxaLegal', selic, ipca: ip } });
  assert.equal(r.jurosPct, 0.8); assert.equal(r.juros, 8);
});
test('aponta meses sem índice publicado', () => {
  const r = atualizarDivida({ valor: 100, inicio: '2026-02-01', fim: '2026-06-01', indice: ipca, juros: { tipo: 'nenhum' } });
  assert.deepEqual(r.faltando, ['2026-04', '2026-05']);
});
test('entradas inválidas', () => {
  assert.equal(atualizarDivida({ valor: 0, inicio: '2026-01-01', fim: '2026-02-01' }).ok, false);
  assert.equal(atualizarDivida({ valor: 10, inicio: '2026-03-01', fim: '2026-02-01' }).ok, false);
  assert.equal(atualizarDivida({ valor: 10, inicio: '', fim: '2026-02-01' }).ok, false);
  assert.equal(atualizarDivida({ valor: 10, inicio: '2026-01-01', fim: '2026-02-01', multaPct: 150 }).ok, false);
  assert.equal(atualizarDivida({ valor: 10, inicio: '2026-01-01', fim: '2026-02-01', juros: { tipo: 'simples', taxaMes: 50 } }).ok, false);
});
test('valor extremo', () => {
  const r = atualizarDivida({ valor: 1e12, inicio: '2000-01-01', fim: '2026-01-01', indice: null, juros: { tipo: 'simples', taxaMes: 1 } });
  assert.ok(Number.isFinite(r.total));
});
