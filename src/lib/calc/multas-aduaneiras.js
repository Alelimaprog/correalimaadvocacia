// Simulador de multas na importação. Funções puras, sem dependências.
// Regras conferidas no texto oficial (Planalto/Câmara/Senado) em 28/11/2026.
// A multa da LC 227/2026 (LC 214/2025, art. 341-G, XIX) tem alcance e regra de
// piso/teto em discussão: o resultado sai marcado como "em discussão".
import { r2 } from './comex.js';

export const UPF_PADRAO = 200; // LC 214/2025, art. 341-C (atualização anual pelo IPCA)

export const HIPOTESES = {
  oficio: {
    titulo: 'Multa de ofício sobre a diferença de tributo',
    fonte: 'Lei 9.430/1996, art. 44, I e § 1º, VI e VII',
    situacao: 'vigente',
  },
  substitutiva: {
    titulo: 'Multa substitutiva da pena de perdimento',
    fonte: 'Decreto-Lei 1.455/1976, art. 23, § 3º',
    situacao: 'vigente',
  },
  semLicenca: {
    titulo: 'Importação sem guia/licença de importação ou documento equivalente',
    fonte: 'Decreto-Lei 37/1966, art. 169, I, b, e § 2º, I',
    situacao: 'vigente',
  },
  subfaturamento: {
    titulo: 'Diferença entre preço declarado e preço praticado ou arbitrado',
    fonte: 'MP 2.158-35/2001, art. 88, parágrafo único',
    situacao: 'vigente',
  },
  cessaoNome: {
    titulo: 'Cessão de nome para acobertar o real interveniente',
    fonte: 'Lei 11.488/2007, art. 33',
    situacao: 'vigente',
  },
  infoCarga: {
    titulo: 'Deixar de prestar informação sobre veículo ou carga no prazo',
    fonte: 'Decreto-Lei 37/1966, art. 107, IV, e',
    situacao: 'vigente',
  },
  informacao: {
    titulo: 'Erro de classificação ou informação omitida/inexata na declaração',
    fonte: '',
    situacao: '',
  },
};

const pct = (v, p) => r2(v * p / 100);

/**
 * @param {object} p
 * @param {number} p.valorAduaneiro R$
 * @param {string[]} p.hipoteses chaves de HIPOTESES
 * @param {number} [p.diferencaTributo] R$
 * @param {'normal'|'qualificada'|'reincidencia'} [p.oficio]
 * @param {number} [p.diferencaPreco] R$
 * @param {number} [p.valorOperacao] R$ (operação acobertada; total da declaração; valor do documento fiscal)
 * @param {'anterior'|'lc227'} [p.regimeInformacao]
 * @param {number} [p.informacoes]
 * @param {number} [p.upf]
 */
export function simularMultas(p) {
  const erros = [];
  const va = Number(p.valorAduaneiro) || 0;
  if (!(va > 0)) erros.push('Informe o valor aduaneiro.');
  const hs = (p.hipoteses || []).filter((h) => HIPOTESES[h]);
  if (!hs.length) erros.push('Escolha ao menos uma situação.');
  if (erros.length) return { ok: false, erros };

  const op = Number(p.valorOperacao) || va;
  const itens = [];
  for (const h of hs) {
    const base = { hipotese: h, ...HIPOTESES[h] };
    let valor = 0, memoria = '', valorMinimo, nota = '';
    if (h === 'oficio') {
      const dif = Number(p.diferencaTributo) || 0;
      const taxa = p.oficio === 'reincidencia' ? 150 : p.oficio === 'qualificada' ? 100 : 75;
      valor = pct(dif, taxa); memoria = `${taxa}% × R$ ${fmt(dif)}`;
      if (!(dif > 0)) nota = 'Informe a diferença de tributo lançada.';
    } else if (h === 'substitutiva') {
      valor = r2(va); memoria = '100% do valor aduaneiro';
    } else if (h === 'semLicenca') {
      valor = Math.max(pct(va, 30), 500); memoria = '30% do valor da mercadoria, mínimo R$ 500';
      nota = 'Havendo mais de uma infração do art. 169 ao mesmo tempo, aplica-se só a mais grave (§ 4º).';
    } else if (h === 'subfaturamento') {
      const d = Number(p.diferencaPreco) || 0;
      valor = r2(d); memoria = `100% × diferença de preço R$ ${fmt(d)}`;
      if (!(d > 0)) nota = 'Informe a diferença entre o preço declarado e o praticado.';
    } else if (h === 'cessaoNome') {
      valor = Math.max(pct(op, 10), 5000); memoria = `10% × R$ ${fmt(op)}, mínimo R$ 5.000`;
    } else if (h === 'infoCarga') {
      valor = 5000; memoria = 'valor fixo de R$ 5.000';
    } else if (h === 'informacao') {
      if (p.regimeInformacao === 'lc227') {
        const upf = Number(p.upf) || UPF_PADRAO;
        const n = Math.max(1, Math.floor(Number(p.informacoes) || 1));
        const bruto = n * 100 * upf, teto = pct(op, 1), piso = 50 * upf;
        base.fonte = 'LC 214/2025, art. 341-G, XIX e § 7º (incluído pela LC 227/2026)';
        base.situacao = 'em discussão';
        if (teto < piso) {
          valor = r2(piso); valorMinimo = r2(teto);
          memoria = `1% da operação (R$ ${fmt(teto)}) fica abaixo do piso de 50 UPF (R$ ${fmt(piso)})`;
          nota = 'O texto não diz se prevalece o piso ou o teto nesse caso: o valor pode ficar entre os dois.';
        } else {
          valor = r2(Math.min(bruto, teto));
          memoria = `${n} × 100 UPF (R$ ${fmt(upf)}), limitado a 1% da operação`;
        }
        nota = [nota, 'A multa está no capítulo das obrigações acessórias do IBS e da CBS; se ela alcança a declaração de importação ainda é discutido. Um mesmo bem só leva uma multa (§ 7º, II).'].filter(Boolean).join(' ');
      } else {
        valor = Math.min(Math.max(pct(va, 1), 500), Math.max(pct(op, 10), 500));
        base.fonte = 'MP 2.158-35/2001, art. 84, e Lei 10.833/2003, art. 69 (revogados pela LC 227/2026, art. 181, II e III)';
        base.situacao = 'revogada';
        memoria = '1% do valor aduaneiro, mínimo R$ 500';
        nota = 'Revogada desde 14/01/2026. Serve para conferir autos de fatos anteriores, que podem ser discutidos à luz da lei nova (CTN, art. 106, II).';
      }
    }
    itens.push({ ...base, valor: r2(valor), valorMinimo, memoria, nota });
  }
  const total = r2(itens.reduce((a, i) => a + i.valor, 0));
  const totalMinimo = r2(itens.reduce((a, i) => a + (i.valorMinimo ?? i.valor), 0));
  return { ok: true, itens, total, totalMinimo, emDiscussao: itens.some((i) => i.situacao === 'em discussão') };
}

function fmt(n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
