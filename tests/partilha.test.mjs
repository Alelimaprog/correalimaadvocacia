import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simularPartilha } from '../src/lib/calc/partilha.js';

const v = (r, re) => r.linhas.find((l) => re.test(l.rotulo));
const soma = (r) => Math.round(r.linhas.reduce((s, l) => s + l.valorTotal, 0) * 100) / 100;
const base = { conjuge: 'casamento', regime: 'parcial', base: 'particulares', desc: { filhos: 0, filiacao: 'comum' }, asc: {}, col: {} };

test('comunhão parcial com bens particulares: concorrência só sobre os particulares (e alternativa)', () => {
  const r = simularPartilha({ ...base, bensComuns: 600000, bensParticulares: 300000, desc: { filhos: 2, filiacao: 'comum' } });
  assert.equal(r.meacao, 300000); assert.equal(r.heranca, 600000);
  assert.equal(r.conjugeHeranca, 100000); assert.equal(v(r, /Cada filho/).valorCada, 250000);
  assert.deepEqual(r.alternativa, { base: 'toda', valor: 200000 });
  assert.ok(r.avisos.some((a) => /controvertido/.test(a)));
  assert.equal(soma(r), r.heranca);
});
test('comunhão parcial, leitura sobre toda a herança', () => {
  const r = simularPartilha({ ...base, base: 'toda', bensComuns: 600000, bensParticulares: 300000, desc: { filhos: 2, filiacao: 'comum' } });
  assert.equal(r.conjugeHeranca, 200000); assert.equal(v(r, /Cada filho/).valorCada, 200000); assert.equal(r.alternativa.valor, 100000);
});
test('comunhão parcial sem bens particulares: só meação', () => {
  const r = simularPartilha({ ...base, bensComuns: 1000000, bensParticulares: 0, desc: { filhos: 2, filiacao: 'comum' } });
  assert.equal(r.conjugeHeranca, 0); assert.equal(r.conjugeTotal, 500000); assert.equal(v(r, /Cada filho/).valorCada, 250000);
});
test('comunhão universal: meação, sem concorrência', () => {
  const r = simularPartilha({ ...base, regime: 'universal', bensComuns: 1000000, desc: { filhos: 3, filiacao: 'comum' } });
  assert.equal(r.meacao, 500000); assert.equal(r.conjugeHeranca, 0); assert.equal(v(r, /Cada filho/).valorCada, 166666.67);
});
test('reserva de 1/4 só com filhos todos comuns', () => {
  const c = simularPartilha({ ...base, bensParticulares: 400000, desc: { filhos: 5, filiacao: 'comum' } });
  assert.equal(c.conjugeHeranca, 100000); assert.equal(v(c, /Cada filho/).valorCada, 60000);
  const h = simularPartilha({ ...base, bensParticulares: 400000, desc: { filhos: 5, filiacao: 'hibrida' } });
  assert.equal(h.conjugeHeranca, 66666.67); assert.ok(h.avisos.some((a) => /híbrida/.test(a)));
});
test('separação convencional concorre; obrigatória não', () => {
  const c = simularPartilha({ ...base, regime: 'convencional', bensParticulares: 900000, desc: { filhos: 2, filiacao: 'comum' } });
  assert.equal(c.meacao, 0); assert.equal(c.conjugeHeranca, 300000);
  const o = simularPartilha({ ...base, regime: 'obrigatoria', bensParticulares: 900000, desc: { filhos: 2, filiacao: 'comum' } });
  assert.equal(o.conjugeHeranca, 0); assert.equal(v(o, /Cada filho/).valorCada, 450000);
  assert.ok(o.avisos.some((a) => /Súmula 377/.test(a)));
});
test('ascendentes com cônjuge: 1/3 com pai e mãe, 1/2 com um só', () => {
  const a = simularPartilha({ ...base, bensParticulares: 900000, asc: { pai: true, mae: true } });
  assert.equal(a.classe, 'ascendentes'); assert.equal(a.conjugeHeranca, 300000); assert.equal(v(a, /^Pai/).valorCada, 300000);
  const b = simularPartilha({ ...base, regime: 'universal', bensComuns: 900000, asc: { mae: true } });
  assert.equal(b.meacao, 450000); assert.equal(b.conjugeHeranca, 225000); assert.equal(v(b, /^Mãe/).valorCada, 225000);
});
test('avós sem cônjuge: metade por linha', () => {
  const r = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 1200000, asc: { avosPaternos: 2, avosMaternos: 1 } });
  assert.equal(v(r, /paterno/).valorCada, 300000); assert.equal(v(r, /materno/).valorCada, 600000);
});
test('cônjuge sozinho e união estável', () => {
  const r = simularPartilha({ ...base, conjuge: 'uniao', bensComuns: 200000, bensParticulares: 100000 });
  assert.equal(r.classe, 'conjuge'); assert.equal(r.conjugeTotal, 300000); assert.ok(r.avisos.some((a) => /Tema 809/.test(a)));
});
test('colaterais: bilateral recebe o dobro; sobrinhos por representação', () => {
  const r = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 700000, col: { irmaosBil: 2, irmaosUni: 1, sobrinhosBil: [2] } });
  assert.equal(v(r, /bilateral \(mesmo/).valorCada, 200000); assert.equal(v(r, /Cada irmão unilateral/).valorCada, 100000); assert.equal(v(r, /sobrinho/).valorCada, 100000);
  assert.equal(soma(r), 700000);
  const s = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 400000, col: { sobrinhosBil: [1], sobrinhosUni: [2] } });
  assert.equal(v(s, /irmão bilateral$/).valorCada, 200000); assert.equal(v(s, /irmão unilateral$/).valorCada, 100000);
});
test('netos: por cabeça quando todos os filhos faltam; por estirpe com filho vivo', () => {
  const a = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 300000, desc: { filhos: 0, netosDePremortos: [2, 1] } });
  assert.equal(v(a, /neto/).valorCada, 100000);
  const b = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 1000000, desc: { filhos: 1, netosDePremortos: [2] } });
  assert.equal(v(b, /Cada filho/).valorCada, 500000); assert.equal(v(b, /neto/).valorCada, 250000);
});
test('sem herdeiros: poder público', () => {
  const r = simularPartilha({ ...base, conjuge: 'nenhum', bensParticulares: 1000 });
  assert.equal(r.classe, 'poderPublico'); assert.equal(r.linhas.length, 0);
});
test('entradas inválidas', () => {
  assert.equal(simularPartilha({ ...base, bensComuns: 0, bensParticulares: 0 }).ok, false);
  assert.equal(simularPartilha({ ...base, bensComuns: -5 }).ok, false);
  assert.equal(simularPartilha({ ...base, bensComuns: 10, desc: { filhos: 1.5 } }).ok, false);
  assert.equal(simularPartilha({ ...base, bensComuns: 10, desc: { filhos: 1, netosDePremortos: [NaN] } }).ok, false);
  assert.equal(simularPartilha({ ...base, regime: 'x', bensComuns: 10 }).ok, false);
});
