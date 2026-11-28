import { test } from 'node:test';
import assert from 'node:assert/strict';
import { somaMeses, somaAnos, somaDias, dataValida, calcularPrescricao, SITUACOES } from '../src/lib/calc/prescricao.js';

test('contagem do art. 132: dia de igual número, ou o imediato', () => {
  assert.equal(somaAnos('2021-03-10', 5), '2026-03-10');
  assert.equal(somaAnos('2024-02-29', 1), '2025-03-01');
  assert.equal(somaMeses('2026-03-31', 6), '2026-10-01');
  assert.equal(somaMeses('2026-08-31', 6), '2027-03-01');
  assert.equal(somaMeses('2026-11-15', 3), '2027-02-15');
  assert.equal(somaDias('2026-12-25', 10), '2027-01-04');
});
test('datas inválidas', () => {
  assert.equal(dataValida('2026-02-30'), false);
  assert.equal(dataValida('26-02-01'), false);
  assert.equal(calcularPrescricao({ situacao: 'condominio', data: '', hoje: '2026-11-28' }).ok, false);
  assert.equal(calcularPrescricao({ situacao: 'xx', data: '2026-01-01', hoje: '2026-11-28' }).ok, false);
});
test('condomínio: 5 anos do vencimento, com véspera e dias restantes', () => {
  const r = calcularPrescricao({ situacao: 'condominio', data: '2022-01-10', hoje: '2026-11-28' });
  assert.equal(r.limite, '2027-01-10'); assert.equal(r.vespera, '2027-01-09'); assert.equal(r.vencido, false); assert.equal(r.restantes, 43);
  assert.match(r.fundamento, /206, § 5º, I/);
});
test('prazo já vencido', () => {
  const r = calcularPrescricao({ situacao: 'reparacao', data: '2020-05-04', hoje: '2026-11-28' });
  assert.equal(r.limite, '2023-05-04'); assert.equal(r.vencido, true);
});
test('cheque: 30 ou 60 dias de apresentação + 6 meses; enriquecimento + 2 anos', () => {
  const a = calcularPrescricao({ situacao: 'cheque', data: '2026-03-01', hoje: '2026-11-28', praca: 'mesma' });
  assert.equal(a.termoInicial, '2026-03-31'); assert.equal(a.limite, '2026-10-01'); assert.equal(a.extra.data, '2028-10-01');
  const b = calcularPrescricao({ situacao: 'cheque', data: '2026-03-01', hoje: '2026-11-28', praca: 'outra' });
  assert.equal(b.termoInicial, '2026-04-30'); assert.equal(b.limite, '2026-10-30');
});
test('duplicata, CTN, aduaneiro e transporte', () => {
  const h = '2026-11-28';
  assert.equal(calcularPrescricao({ situacao: 'duplicataSacado', data: '2024-06-15', hoje: h }).limite, '2027-06-15');
  assert.equal(calcularPrescricao({ situacao: 'duplicataEndossante', data: '2026-06-15', hoje: h }).limite, '2027-06-15');
  const of = calcularPrescricao({ situacao: 'lancamentoOficio', data: '2021-07-20', hoje: h });
  assert.equal(of.termoInicial, '2022-01-01'); assert.equal(of.limite, '2027-01-01'); assert.equal(of.vespera, '2026-12-31');
  assert.equal(calcularPrescricao({ situacao: 'homologacao', data: '2021-07-20', hoje: h }).limite, '2026-07-20');
  assert.equal(calcularPrescricao({ situacao: 'revisaoAduaneira', data: '2022-02-10', hoje: h }).limite, '2027-02-10');
  assert.equal(calcularPrescricao({ situacao: 'cobrancaTributo', data: '2022-02-10', hoje: h }).limite, '2027-02-10');
  assert.equal(calcularPrescricao({ situacao: 'avariaMaritima', data: '2026-02-10', hoje: h }).limite, '2027-02-10');
  assert.equal(calcularPrescricao({ situacao: 'avariaAviso', data: '2026-11-20', hoje: h }).limite, '2026-11-30');
  assert.equal(calcularPrescricao({ situacao: 'geral', data: '2020-01-31', hoje: h }).limite, '2030-01-31');
});
test('toda situação tem fundamento e calcula', () => {
  for (const k of Object.keys(SITUACOES)) {
    const r = calcularPrescricao({ situacao: k, data: '2025-01-31', hoje: '2026-11-28' });
    assert.ok(r.ok && dataValida(r.limite) && r.fundamento, k);
  }
});
test('limite em fim de semana é sinalizado', () => {
  assert.equal(calcularPrescricao({ situacao: 'aluguel', data: '2025-11-25', hoje: '2026-11-28' }).limiteFimDeSemana, true); // 25/11/2028 é sábado
  assert.equal(calcularPrescricao({ situacao: 'aluguel', data: '2025-11-29', hoje: '2026-11-28' }).limiteFimDeSemana, false); // 29/11/2028 é quarta
});
