// Cálculos de comércio exterior — funções puras, sem dependências, testadas em tests/calc.test.mjs.
// Rodam no navegador: nenhum dado digitado sai do computador do usuário.

/** Arredonda para centavos evitando erro de ponto flutuante. */
export const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Número > = 0 a partir de texto pt-BR ("1.234,56") ou número. Retorna NaN se inválido. */
export function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : NaN;
  if (v == null) return NaN;
  let s = String(v).trim().replace(/\s/g, '');
  if (s === '') return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  if (!/^-?\d*\.?\d+$/.test(s)) return NaN;
  return Number(s);
}

const DIA = 86400000;
/** Diferença em dias corridos entre duas datas ISO (AAAA-MM-DD), contando o dia inicial e o final. */
export function diasCorridosInclusivos(inicioISO, fimISO) {
  const a = Date.parse(inicioISO + 'T00:00:00Z');
  const b = Date.parse(fimISO + 'T00:00:00Z');
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (b < a) return NaN;
  return Math.round((b - a) / DIA) + 1;
}

/**
 * Demurrage/detention com free time e faixas progressivas.
 * @param {object} p
 * @param {number} p.dias      Dias totais de uso do contêiner (já contados conforme o contrato).
 * @param {number} p.freeTime  Dias livres.
 * @param {{ate: number|null, valor: number}[]} p.faixas  Faixas por dia de COBRANÇA (1º dia após o free time = dia 1).
 *        `ate` = último dia cobrável da faixa (null = sem limite). Ex.: [{ate:7,valor:100},{ate:14,valor:150},{ate:null,valor:200}]
 * @param {number} [p.conteineres=1]
 * @param {number} [p.cambio]  Taxa de câmbio para converter o total (opcional).
 */
export function demurrage({ dias, freeTime, faixas, conteineres = 1, cambio }) {
  const erros = [];
  if (!Number.isInteger(dias) || dias < 0) erros.push('Informe um número de dias válido.');
  if (!Number.isInteger(freeTime) || freeTime < 0) erros.push('Free time deve ser um número inteiro de dias, zero ou mais.');
  if (!Number.isInteger(conteineres) || conteineres < 1 || conteineres > 10000) erros.push('Quantidade de contêineres deve estar entre 1 e 10.000.');
  if (!Array.isArray(faixas) || faixas.length === 0) erros.push('Informe ao menos uma faixa de valor diário.');
  else {
    let anterior = 0;
    faixas.forEach((f, i) => {
      if (!(f.valor >= 0)) erros.push(`Faixa ${i + 1}: valor diário inválido.`);
      if (f.ate != null) {
        if (!Number.isInteger(f.ate) || f.ate <= anterior) erros.push(`Faixa ${i + 1}: o limite deve ser maior que o da faixa anterior.`);
        anterior = f.ate;
      } else if (i !== faixas.length - 1) erros.push('Só a última faixa pode ficar sem limite.');
    });
  }
  if (cambio != null && !(cambio > 0)) erros.push('Câmbio deve ser maior que zero.');
  if (erros.length) return { ok: false, erros };

  const cobraveis = Math.max(0, dias - freeTime);
  const detalhe = [];
  let restante = cobraveis, inicio = 1, totalPorCont = 0;
  for (const f of faixas) {
    if (restante <= 0) break;
    const tamanho = f.ate == null ? restante : Math.min(restante, f.ate - inicio + 1);
    if (tamanho <= 0) continue;
    const subtotal = tamanho * f.valor;
    detalhe.push({ de: inicio, ate: inicio + tamanho - 1, dias: tamanho, valorDia: f.valor, subtotal: r2(subtotal) });
    totalPorCont += subtotal; restante -= tamanho; inicio += tamanho;
  }
  // Se as faixas acabaram (última com limite) e ainda há dias, aplica o valor da última faixa.
  if (restante > 0) {
    const ult = faixas[faixas.length - 1];
    detalhe.push({ de: inicio, ate: inicio + restante - 1, dias: restante, valorDia: ult.valor, subtotal: r2(restante * ult.valor), extrapolado: true });
    totalPorCont += restante * ult.valor;
  }
  const total = totalPorCont * conteineres;
  return {
    ok: true, dias, freeTime, diasCobraveis: cobraveis, detalhe,
    totalPorConteiner: r2(totalPorCont), total: r2(total),
    totalConvertido: cambio ? r2(total * cambio) : null,
  };
}

// ISO 6346 — valores das letras (pulam múltiplos de 11).
const LETRAS = (() => {
  const m = {}; let v = 10;
  for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') { if (v % 11 === 0) v++; m[c] = v++; }
  return m;
})();

/** Valida número de contêiner ISO 6346 (ex.: CSQU3054383). */
export function validarConteiner(entrada) {
  const s = String(entrada || '').toUpperCase().replace(/[\s\-./]/g, '');
  if (!/^[A-Z]{3}[UJZ][0-9]{6}[0-9]?$/.test(s)) {
    return { ok: false, formato: false, motivo: 'Formato esperado: 3 letras do proprietário + U, J ou Z + 6 algarismos + dígito verificador (ex.: CSQU3054383).' };
  }
  let soma = 0;
  for (let i = 0; i < 10; i++) {
    const c = s[i];
    const val = i < 4 ? LETRAS[c] : Number(c);
    soma += val * 2 ** i;
  }
  const digito = (soma % 11) % 10;
  const informado = s.length === 11 ? Number(s[10]) : null;
  const categorias = { U: 'contêiner de carga', J: 'equipamento destacável', Z: 'trailer ou chassi' };
  return {
    ok: informado === null ? null : informado === digito, formato: true, normalizado: s.slice(0, 10) + digito,
    proprietario: s.slice(0, 3), categoria: categorias[s[3]], serie: s.slice(4, 10), digitoCalculado: digito, digitoInformado: informado,
  };
}

/**
 * Tributos na importação (regime comum). Base: valor aduaneiro (VA) em reais.
 * II = VA×aII; IPI = (VA+II)×aIPI; PIS = VA×aPIS; COFINS = VA×aCOFINS (Lei 10.865/2004, art. 7º, I, e art. 8º);
 * AFRMM = frete aquaviário × aAFRMM (Lei 10.893/2004, art. 6º); ICMS "por dentro" (LC 87/1996, art. 13, V e §1º).
 */
export function tributosImportacao(p) {
  const n = (k, padrao) => (p[k] == null || p[k] === '' ? padrao : p[k]);
  const campos = {
    fob: n('fob', NaN), frete: n('frete', 0), seguro: n('seguro', 0), acrescimos: n('acrescimos', 0), cambio: n('cambio', NaN),
    aII: n('aII', NaN), aIPI: n('aIPI', 0), aPIS: n('aPIS', 2.1), aCOFINS: n('aCOFINS', 9.65), aICMS: n('aICMS', 18),
    aAFRMM: n('aAFRMM', 8), freteAquaviario: p.freteAquaviario !== false, taxaSiscomex: n('taxaSiscomex', 0),
    despesasLocais: n('despesasLocais', 0), quantidade: n('quantidade', 1), afrmmNaBaseIcms: p.afrmmNaBaseIcms !== false,
  };
  const erros = [];
  const neg = (k, rot) => { if (!(campos[k] >= 0)) erros.push(`${rot}: informe um valor numérico igual ou maior que zero.`); };
  if (!(campos.fob > 0)) erros.push('Valor da mercadoria (FOB): informe um valor maior que zero.');
  if (!(campos.cambio > 0)) erros.push('Câmbio: informe uma taxa maior que zero.');
  neg('frete', 'Frete'); neg('seguro', 'Seguro'); neg('acrescimos', 'Outros acréscimos'); neg('taxaSiscomex', 'Taxa Siscomex'); neg('despesasLocais', 'Despesas locais');
  for (const [k, rot] of [['aII', 'Alíquota do II'], ['aIPI', 'Alíquota do IPI'], ['aPIS', 'Alíquota do PIS'], ['aCOFINS', 'Alíquota da COFINS'], ['aAFRMM', 'Alíquota do AFRMM']]) {
    if (!(campos[k] >= 0 && campos[k] <= 100)) erros.push(`${rot}: informe um percentual entre 0 e 100.`);
  }
  if (!(campos.aICMS >= 0 && campos.aICMS < 100)) erros.push('Alíquota do ICMS: informe um percentual entre 0 e 99,99.');
  if (!(campos.quantidade > 0)) erros.push('Quantidade: informe um número maior que zero.');
  if (erros.length) return { ok: false, erros };

  const c = campos, pct = (x) => x / 100;
  const va = (c.fob + c.frete + c.seguro + c.acrescimos) * c.cambio;
  const ii = va * pct(c.aII);
  const ipi = (va + ii) * pct(c.aIPI);
  const pis = va * pct(c.aPIS);
  const cofins = va * pct(c.aCOFINS);
  const afrmm = c.freteAquaviario ? c.frete * c.cambio * pct(c.aAFRMM) : 0;
  const somaBase = va + ii + ipi + pis + cofins + c.taxaSiscomex + (c.afrmmNaBaseIcms ? afrmm : 0);
  const baseIcms = somaBase / (1 - pct(c.aICMS));
  const icms = baseIcms * pct(c.aICMS);
  const tributos = ii + ipi + pis + cofins + icms + afrmm + c.taxaSiscomex;
  const custoTotal = va + tributos + c.despesasLocais;
  return {
    ok: true,
    valorAduaneiro: r2(va), ii: r2(ii), ipi: r2(ipi), pis: r2(pis), cofins: r2(cofins), afrmm: r2(afrmm),
    taxaSiscomex: r2(c.taxaSiscomex), baseIcms: r2(baseIcms), icms: r2(icms), totalTributos: r2(tributos),
    despesasLocais: r2(c.despesasLocais), custoTotal: r2(custoTotal), custoUnitario: r2(custoTotal / c.quantidade),
    cargaSobreVA: r2((tributos / va) * 100),
  };
}

/** Cubagem e peso cubado. Medidas em cm, peso em kg. */
export function cubagem({ comprimento, largura, altura, volumes = 1, pesoBrutoKg = 0 }) {
  const erros = [];
  for (const [v, rot] of [[comprimento, 'Comprimento'], [largura, 'Largura'], [altura, 'Altura']]) if (!(v > 0 && v <= 10000)) erros.push(`${rot}: informe um valor em centímetros entre 0 e 10.000.`);
  if (!(Number.isInteger(volumes) && volumes >= 1 && volumes <= 1000000)) erros.push('Volumes: informe um número inteiro de 1 a 1.000.000.');
  if (!(pesoBrutoKg >= 0)) erros.push('Peso bruto: informe um valor igual ou maior que zero.');
  if (erros.length) return { ok: false, erros };
  const m3 = (comprimento * largura * altura * volumes) / 1e6;
  const aereo = m3 * 1e6 / 6000;       // fator IATA usual 1:6000 (167 kg/m³)
  const rodoviario = m3 * 300;          // referência usual 300 kg/m³
  const maritimoWM = Math.max(m3, pesoBrutoKg / 1000); // LCL: 1 t ou 1 m³, o que for maior (W/M)
  return {
    ok: true, m3: Math.round(m3 * 1000) / 1000, pesoCubadoAereo: r2(aereo), pesoCubadoRodoviario: r2(rodoviario),
    pesoTaxavelAereo: r2(Math.max(aereo, pesoBrutoKg)), pesoTaxavelRodoviario: r2(Math.max(rodoviario, pesoBrutoKg)),
    unidadesFreteMaritimo: Math.round(maritimoWM * 1000) / 1000,
    ocupacao: { c20: r2((m3 / 33.2) * 100), c40: r2((m3 / 67.7) * 100), c40hc: r2((m3 / 76.3) * 100) },
  };
}
