// Simulador de multas na importação. Funções puras, sem dependências.
// RASCUNHO: as hipóteses marcadas com verificado:false aguardam conferência do texto
// legal vigente e revisão do advogado responsável antes de publicar.
import { r2 } from './comex.js';

export const HIPOTESES = {
  oficio: {
    titulo: 'Multa de ofício sobre a diferença de tributo',
    base: 'diferença de tributo lançada',
    fonte: 'Lei 9.430/1996, art. 44, I e § 1º, VI e VII',
    verificado: true,
  },
  substitutiva: {
    titulo: 'Multa substitutiva da pena de perdimento',
    base: 'valor aduaneiro da mercadoria não localizada, consumida ou revendida',
    fonte: 'Decreto-Lei 1.455/1976, art. 23, § 3º (redação da Lei 12.350/2010)',
    verificado: true,
  },
  cessaoNome: {
    titulo: 'Cessão de nome para acobertar o real interveniente',
    base: 'valor da operação acobertada (10%, mínimo R$ 5.000)',
    fonte: 'Lei 11.488/2007, art. 33',
    verificado: true,
  },
  semLicenca: {
    titulo: 'Importação sem licença de importação',
    base: 'valor aduaneiro (30%)',
    fonte: 'Decreto-Lei 37/1966, art. 169, I, b',
    verificado: false,
  },
  informacao: {
    titulo: 'Informação omitida, inexata ou incompleta na declaração',
    base: 'regime anterior: 1% do valor aduaneiro (mín. R$ 500); regime da LC 227/2026: 100 UPF por informação, mín. 50 UPF, limitado a 1% do valor da operação',
    fonte: 'MP 2.158-35/2001, art. 84 (revogado pela LC 227/2026); LC 227/2026',
    verificado: false,
  },
};

const pct = (v, p) => r2(v * p / 100);

/**
 * @param {object} p
 * @param {number} p.valorAduaneiro  R$
 * @param {number} [p.diferencaTributo] R$ (II, IPI, PIS, COFINS lançados de ofício)
 * @param {'normal'|'qualificada'|'reincidencia'} [p.oficio]
 * @param {number} [p.valorOperacao] R$ (cessão de nome; regime novo da multa de informação)
 * @param {number} [p.informacoes] número de informações incorretas (regime novo)
 * @param {'anterior'|'lc227'} [p.regimeInformacao]
 * @param {number} [p.upf] valor da UPF em R$
 * @param {string[]} p.hipoteses chaves de HIPOTESES
 */
export function simularMultas(p) {
  const erros = [];
  const va = Number(p.valorAduaneiro) || 0;
  if (!(va > 0)) erros.push('Informe o valor aduaneiro.');
  const hs = (p.hipoteses || []).filter((h) => HIPOTESES[h]);
  if (!hs.length) erros.push('Escolha ao menos uma situação.');
  if (erros.length) return { ok: false, erros };

  const itens = [];
  for (const h of hs) {
    let valor = 0, memoria = '';
    if (h === 'oficio') {
      const dif = Number(p.diferencaTributo) || 0;
      const taxa = p.oficio === 'reincidencia' ? 150 : p.oficio === 'qualificada' ? 100 : 75;
      valor = pct(dif, taxa); memoria = `${taxa}% × R$ ${r2(dif)}`;
      if (!(dif > 0)) memoria += ' (informe a diferença de tributo)';
    } else if (h === 'substitutiva') {
      valor = r2(va); memoria = '100% do valor aduaneiro';
    } else if (h === 'cessaoNome') {
      const op = Number(p.valorOperacao) || va;
      valor = Math.max(pct(op, 10), 5000); memoria = `10% × R$ ${r2(op)}, mínimo R$ 5.000`;
    } else if (h === 'semLicenca') {
      valor = pct(va, 30); memoria = '30% do valor aduaneiro';
    } else if (h === 'informacao') {
      if (p.regimeInformacao === 'lc227') {
        const upf = Number(p.upf) || 0; const n = Math.max(1, Math.floor(Number(p.informacoes) || 1));
        const op = Number(p.valorOperacao) || va;
        const bruto = n * 100 * upf; const teto = pct(op, 1); const piso = 50 * upf;
        // Ordem de aplicação do piso e do teto: a confirmar na revisão jurídica.
        valor = r2(Math.max(Math.min(bruto, teto), piso));
        memoria = `${n} × 100 UPF (R$ ${r2(upf)}), teto 1% da operação, piso 50 UPF`;
      } else {
        valor = Math.max(pct(va, 1), 500); memoria = '1% do valor aduaneiro, mínimo R$ 500';
      }
    }
    itens.push({ hipotese: h, ...HIPOTESES[h], valor: r2(valor), memoria });
  }
  return { ok: true, itens, total: r2(itens.reduce((a, i) => a + i.valor, 0)), pendentes: itens.filter((i) => !i.verificado).map((i) => i.hipotese) };
}
