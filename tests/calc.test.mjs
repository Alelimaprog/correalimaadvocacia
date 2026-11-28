import { test } from 'node:test';
import assert from 'node:assert/strict';
import { demurrage, validarConteiner, tributosImportacao, cubagem, num, diasCorridosInclusivos } from '../src/lib/calc/comex.js';

test('num aceita formato brasileiro e rejeita lixo', () => {
  assert.equal(num('1.234,56'), 1234.56); assert.equal(num('10'), 10); assert.equal(num('0,5'), 0.5);
  assert.ok(Number.isNaN(num('abc'))); assert.ok(Number.isNaN(num(''))); assert.ok(Number.isNaN(num('1,2,3')));
});
test('dias corridos inclusivos', () => {
  assert.equal(diasCorridosInclusivos('2026-01-01', '2026-01-01'), 1);
  assert.equal(diasCorridosInclusivos('2026-01-01', '2026-01-31'), 31);
  assert.equal(diasCorridosInclusivos('2024-02-28', '2024-03-01'), 3); // ano bissexto
  assert.ok(Number.isNaN(diasCorridosInclusivos('2026-02-01', '2026-01-01')));
});
test('demurrage com faixas progressivas', () => {
  const r = demurrage({ dias: 30, freeTime: 7, faixas: [{ ate: 7, valor: 100 }, { ate: 14, valor: 150 }, { ate: null, valor: 200 }], conteineres: 2, cambio: 5 });
  // 23 dias cobráveis: 7×100 + 7×150 + 9×200 = 700+1050+1800 = 3550 por contêiner
  assert.equal(r.diasCobraveis, 23); assert.equal(r.totalPorConteiner, 3550); assert.equal(r.total, 7100); assert.equal(r.totalConvertido, 35500);
  assert.deepEqual(r.detalhe.map((d) => d.dias), [7, 7, 9]);
});
test('demurrage dentro do free time é zero', () => {
  const r = demurrage({ dias: 5, freeTime: 7, faixas: [{ ate: null, valor: 100 }] });
  assert.equal(r.total, 0); assert.equal(r.diasCobraveis, 0);
});
test('demurrage estende a última faixa limitada', () => {
  const r = demurrage({ dias: 20, freeTime: 0, faixas: [{ ate: 10, valor: 50 }] });
  assert.equal(r.total, 1000); assert.equal(r.detalhe[1].extrapolado, true);
});
test('demurrage rejeita entradas inválidas', () => {
  assert.equal(demurrage({ dias: -1, freeTime: 7, faixas: [{ ate: null, valor: 1 }] }).ok, false);
  assert.equal(demurrage({ dias: 10, freeTime: 7, faixas: [] }).ok, false);
  assert.equal(demurrage({ dias: 10, freeTime: 7, faixas: [{ ate: 5, valor: 1 }, { ate: 3, valor: 1 }] }).ok, false);
  assert.equal(demurrage({ dias: 10, freeTime: 7, faixas: [{ ate: null, valor: 1 }, { ate: 9, valor: 2 }] }).ok, false);
  assert.equal(demurrage({ dias: 10, freeTime: 1.5, faixas: [{ ate: null, valor: 1 }] }).ok, false);
});
test('demurrage valores extremos', () => {
  const r = demurrage({ dias: 3650, freeTime: 0, faixas: [{ ate: null, valor: 1000 }], conteineres: 10000 });
  assert.equal(r.total, 36500000000);
});
test('ISO 6346: exemplos conhecidos', () => {
  assert.equal(validarConteiner('CSQU3054383').ok, true);   // exemplo da norma
  assert.equal(validarConteiner('CSQU 305438-3').ok, true); // aceita espaços e hífen
  assert.equal(validarConteiner('CSQU3054384').ok, false);
  assert.equal(validarConteiner('CSQU305438').digitoCalculado, 3);
  assert.equal(validarConteiner('MSKU1234567').formato, true);
  assert.equal(validarConteiner('ABC1234567').formato, false);
  assert.equal(validarConteiner('ABCX1234567').formato, false); // categoria inválida
  assert.equal(validarConteiner('').formato, false);
});
test('ISO 6346: letra com valor após pular múltiplo de 11', () => {
  // TGHU: T=31, G=17, H=18, U=32 — verificado manualmente: 31+34+72+256=393; 393+... (cálculo completo abaixo)
  const r = validarConteiner('TGHU000000');
  assert.equal(r.digitoCalculado, (31 * 1 + 17 * 2 + 18 * 4 + 32 * 8) % 11 % 10);
});
test('tributos na importação — cálculo de referência', () => {
  const r = tributosImportacao({ fob: 10000, frete: 1000, seguro: 100, cambio: 5, aII: 14, aIPI: 10, aPIS: 2.1, aCOFINS: 9.65, aICMS: 18, aAFRMM: 8, taxaSiscomex: 0, quantidade: 100 });
  // VA = 11100×5 = 55500; II = 7770; IPI = 6327; PIS = 1165,50; COFINS = 5355,75; AFRMM = 5000×8% = 400
  assert.equal(r.valorAduaneiro, 55500); assert.equal(r.ii, 7770); assert.equal(r.ipi, 6327);
  assert.equal(r.pis, 1165.5); assert.equal(r.cofins, 5355.75); assert.equal(r.afrmm, 400);
  // base ICMS = (55500+7770+6327+1165,5+5355,75+400)/0,82 = 76518,25/0,82 = 93314,939...
  assert.equal(r.baseIcms, 93314.94); assert.equal(r.icms, 16796.69);
  assert.equal(r.totalTributos, r2(7770 + 6327 + 1165.5 + 5355.75 + 400 + 16796.689)); 
  assert.equal(r.custoUnitario, r2((55500 + r.totalTributos) / 100));
});
function r2(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
test('tributos: AFRMM fora quando não é aquaviário e fora da base do ICMS se desmarcado', () => {
  const a = tributosImportacao({ fob: 1000, frete: 100, cambio: 1, aII: 0, aICMS: 0, freteAquaviario: false });
  assert.equal(a.afrmm, 0);
  const b = tributosImportacao({ fob: 1000, frete: 100, cambio: 1, aII: 0, aPIS: 0, aCOFINS: 0, aICMS: 10, afrmmNaBaseIcms: false });
  assert.equal(b.baseIcms, r2(1100 / 0.9));
});
test('tributos rejeita entradas inválidas', () => {
  assert.equal(tributosImportacao({ fob: 0, cambio: 5, aII: 10 }).ok, false);
  assert.equal(tributosImportacao({ fob: 100, cambio: 0, aII: 10 }).ok, false);
  assert.equal(tributosImportacao({ fob: 100, cambio: 5, aII: 120 }).ok, false);
  assert.equal(tributosImportacao({ fob: 100, cambio: 5, aII: 10, aICMS: 100 }).ok, false);
  assert.equal(tributosImportacao({ fob: 100, cambio: 5, aII: NaN }).ok, false);
});
test('cubagem e peso cubado', () => {
  const r = cubagem({ comprimento: 100, largura: 100, altura: 100, volumes: 2, pesoBrutoKg: 150 });
  assert.equal(r.m3, 2); assert.equal(r.pesoCubadoAereo, 333.33); assert.equal(r.pesoCubadoRodoviario, 600);
  assert.equal(r.pesoTaxavelAereo, 333.33); assert.equal(r.unidadesFreteMaritimo, 2);
  const pesado = cubagem({ comprimento: 50, largura: 50, altura: 50, volumes: 1, pesoBrutoKg: 2000 });
  assert.equal(pesado.unidadesFreteMaritimo, 2); // 2 t > 0,125 m³
  assert.equal(cubagem({ comprimento: 0, largura: 1, altura: 1 }).ok, false);
  assert.equal(cubagem({ comprimento: 1, largura: 1, altura: 1, volumes: 0.5 }).ok, false);
});
