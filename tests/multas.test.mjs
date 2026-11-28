import test from 'node:test';
import assert from 'node:assert/strict';
import { simularMultas } from '../src/lib/calc/multas-aduaneiras.js';

test('multa de ofício 75/100/150%', () => {
  const b = { valorAduaneiro: 100000, diferencaTributo: 10000, hipoteses: ['oficio'] };
  assert.equal(simularMultas(b).total, 7500);
  assert.equal(simularMultas({ ...b, oficio: 'qualificada' }).total, 10000);
  assert.equal(simularMultas({ ...b, oficio: 'reincidencia' }).total, 15000);
});
test('substitutiva, sem licença (mín. R$ 500), cessão de nome, carga, subfaturamento', () => {
  assert.equal(simularMultas({ valorAduaneiro: 80000, hipoteses: ['substitutiva'] }).total, 80000);
  assert.equal(simularMultas({ valorAduaneiro: 100000, hipoteses: ['semLicenca'] }).total, 30000);
  assert.equal(simularMultas({ valorAduaneiro: 1000, hipoteses: ['semLicenca'] }).total, 500);
  assert.equal(simularMultas({ valorAduaneiro: 20000, hipoteses: ['cessaoNome'] }).total, 5000);
  assert.equal(simularMultas({ valorAduaneiro: 20000, hipoteses: ['infoCarga'] }).total, 5000);
  assert.equal(simularMultas({ valorAduaneiro: 20000, diferencaPreco: 7000, hipoteses: ['subfaturamento'] }).total, 7000);
});
test('informação: regime revogado', () => {
  const r = simularMultas({ valorAduaneiro: 30000, hipoteses: ['informacao'] });
  assert.equal(r.total, 500); assert.equal(r.itens[0].situacao, 'revogada'); assert.equal(r.emDiscussao, false);
  assert.equal(simularMultas({ valorAduaneiro: 300000, hipoteses: ['informacao'] }).total, 3000);
});
test('informação: LC 227 (teto, piso ambíguo)', () => {
  const a = simularMultas({ valorAduaneiro: 3000000, hipoteses: ['informacao'], regimeInformacao: 'lc227', informacoes: 1 });
  assert.equal(a.total, 20000); assert.equal(a.emDiscussao, true);
  assert.equal(simularMultas({ valorAduaneiro: 1500000, hipoteses: ['informacao'], regimeInformacao: 'lc227', informacoes: 3 }).total, 15000);
  const b = simularMultas({ valorAduaneiro: 500000, hipoteses: ['informacao'], regimeInformacao: 'lc227' });
  assert.equal(b.total, 10000); assert.equal(b.totalMinimo, 5000);
});
test('validação', () => {
  assert.equal(simularMultas({ valorAduaneiro: 0, hipoteses: [] }).ok, false);
});
