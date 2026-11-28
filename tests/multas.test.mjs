import test from 'node:test';
import assert from 'node:assert/strict';
import { simularMultas } from '../src/lib/calc/multas-aduaneiras.js';

test('multa de ofício 75/100/150%', () => {
  const b = { valorAduaneiro: 100000, diferencaTributo: 10000, hipoteses: ['oficio'] };
  assert.equal(simularMultas(b).total, 7500);
  assert.equal(simularMultas({ ...b, oficio: 'qualificada' }).total, 10000);
  assert.equal(simularMultas({ ...b, oficio: 'reincidencia' }).total, 15000);
});
test('substitutiva = valor aduaneiro; cessão de nome com mínimo', () => {
  assert.equal(simularMultas({ valorAduaneiro: 80000, hipoteses: ['substitutiva'] }).total, 80000);
  assert.equal(simularMultas({ valorAduaneiro: 20000, hipoteses: ['cessaoNome'] }).total, 5000);
  assert.equal(simularMultas({ valorAduaneiro: 200000, hipoteses: ['cessaoNome'] }).total, 20000);
});
test('informação: regime anterior e LC 227 (piso/teto)', () => {
  assert.equal(simularMultas({ valorAduaneiro: 30000, hipoteses: ['informacao'] }).total, 500);
  assert.equal(simularMultas({ valorAduaneiro: 3000000, hipoteses: ['informacao'], regimeInformacao: 'lc227', upf: 200, informacoes: 1 }).total, 20000);
  assert.equal(simularMultas({ valorAduaneiro: 500000, hipoteses: ['informacao'], regimeInformacao: 'lc227', upf: 200, informacoes: 3 }).total, 10000);
  const r = simularMultas({ valorAduaneiro: 500000, hipoteses: ['informacao', 'semLicenca'] });
  assert.deepEqual(r.pendentes, ['informacao', 'semLicenca']);
});
test('validação', () => {
  assert.equal(simularMultas({ valorAduaneiro: 0, hipoteses: [] }).ok, false);
});
