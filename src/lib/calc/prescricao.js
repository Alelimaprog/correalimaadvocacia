// Prazos de prescrição e decadência — funções puras (28/11/2026).
// Cada prazo vem de texto oficial lido no Planalto (e, no condomínio, da tese do STJ).
// Contagem: Código Civil, art. 132 — exclui-se o dia do começo; prazos em meses e anos
// expiram no dia de igual número do de início, ou no imediato, se faltar exata correspondência.

const pad = (n) => String(n).padStart(2, '0');
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const partes = (s) => s.split('-').map(Number);
const diasNoMes = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export function dataValida(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = partes(s);
  return y >= 1900 && y <= 2200 && m >= 1 && m <= 12 && d >= 1 && d <= diasNoMes(y, m);
}

/** Soma meses; se o dia não existe no mês final, vence no dia imediato (1º do mês seguinte). */
export function somaMeses(s, n) {
  let [y, m, d] = partes(s);
  m += n; y += Math.floor((m - 1) / 12); m = ((m - 1) % 12 + 12) % 12 + 1;
  if (d > diasNoMes(y, m)) { d = 1; m++; if (m > 12) { m = 1; y++; } }
  return iso(y, m, d);
}
export const somaAnos = (s, n) => somaMeses(s, n * 12);
export function somaDias(s, n) {
  const t = Date.parse(s + 'T00:00:00Z') + n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}
export function diasEntre(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000); }
const fimDeSemana = (s) => { const w = new Date(s + 'T00:00:00Z').getUTCDay(); return w === 0 || w === 6; };

const P = 'https://www.planalto.gov.br/ccivil_03/';
export const FONTES = {
  cc: { label: 'Código Civil (Lei 10.406/2002), arts. 132, 189, 197 a 206 e 754', href: P + 'leis/2002/l10406compilada.htm' },
  stj949: { label: 'STJ, Tema Repetitivo 949 (REsp 1.483.930/DF)', href: 'https://processo.stj.jus.br/repetitivos/temas_repetitivos/pesquisa.jsp?novaConsulta=true&tipo_pesquisa=T&cod_tema_inicial=949&cod_tema_final=949' },
  cheque: { label: 'Lei 7.357/1985 (Lei do Cheque), arts. 33, 47, 59 e 61', href: P + 'leis/l7357.htm' },
  duplicata: { label: 'Lei 5.474/1968 (Lei das Duplicatas), art. 18', href: P + 'leis/l5474.htm' },
  ctn: { label: 'Código Tributário Nacional (Lei 5.172/1966), arts. 150, 173 e 174, com a LC 236/2026', href: P + 'leis/l5172compilado.htm' },
  lc236: { label: 'Lei Complementar 236/2026', href: P + 'leis/lcp/lcp236.htm' },
  dl37: { label: 'Decreto-Lei 37/1966, art. 54', href: P + 'decreto-lei/del0037.htm' },
  dl116: { label: 'Decreto-Lei 116/1967, art. 8º', href: P + 'decreto-lei/1965-1988/del0116.htm' },
};

/**
 * Situações. `inicio` descreve a data que o usuário deve informar.
 * `calc(data, opcoes)` devolve { termoInicial, limite, memoria } a partir dela.
 */
export const SITUACOES = {
  condominio: {
    grupo: 'Cobrança civil', titulo: 'Cobrança de cotas de condomínio',
    inicio: 'Data de vencimento da cota', prazo: '5 anos',
    fundamento: 'Código Civil, art. 206, § 5º, I; STJ, Tema 949',
    nota: 'O STJ fixou (Tema 949) que o prazo é de cinco anos, contado do dia seguinte ao vencimento de cada cota. Cada cota tem o seu prazo.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 5), memoria: 'vencimento + 5 anos' }),
  },
  divida: {
    grupo: 'Cobrança civil', titulo: 'Dívida líquida em contrato ou confissão de dívida (instrumento público ou particular)',
    inicio: 'Data de vencimento da dívida', prazo: '5 anos',
    fundamento: 'Código Civil, art. 206, § 5º, I',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 5), memoria: 'vencimento + 5 anos' }),
  },
  aluguel: {
    grupo: 'Cobrança civil', titulo: 'Aluguéis de imóvel urbano ou rural',
    inicio: 'Data de vencimento do aluguel', prazo: '3 anos',
    fundamento: 'Código Civil, art. 206, § 3º, I',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 3), memoria: 'vencimento + 3 anos' }),
  },
  reparacao: {
    grupo: 'Cobrança civil', titulo: 'Reparação civil (indenização por dano)',
    inicio: 'Data em que o direito foi violado (o dano)', prazo: '3 anos',
    fundamento: 'Código Civil, arts. 189 e 206, § 3º, V',
    nota: 'O início do prazo pode ser discutido (por exemplo, quando o dano só é conhecido depois). Relações de consumo, de trabalho e contratos com regra própria podem ter outro prazo.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 3), memoria: 'data do dano + 3 anos' }),
  },
  geral: {
    grupo: 'Cobrança civil', titulo: 'Prazo geral, quando a lei não fixa prazo menor',
    inicio: 'Data em que o direito foi violado', prazo: '10 anos',
    fundamento: 'Código Civil, arts. 189 e 205',
    nota: 'Só vale quando nenhuma regra específica se aplica. Confira antes se o caso não tem prazo menor.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 10), memoria: 'violação + 10 anos' }),
  },
  cheque: {
    grupo: 'Títulos de crédito', titulo: 'Execução de cheque',
    inicio: 'Data de emissão do cheque', prazo: '6 meses após o prazo de apresentação',
    fundamento: 'Lei 7.357/1985, arts. 33, 47 e 59', opcao: 'praca',
    nota: 'Depois de prescrita a execução, a lei prevê ação de enriquecimento contra quem se locupletou, em 2 anos contados da consumação dessa prescrição (art. 61). Além disso, pode haver ação de cobrança comum com prazo próprio.',
    calc: (d, o = {}) => {
      const dias = o.praca === 'outra' ? 60 : 30;
      const apres = somaDias(d, dias);
      const lim = somaMeses(apres, 6);
      return { termoInicial: apres, limite: lim, extra: { rotulo: 'Ação de enriquecimento (art. 61), estimativa', data: somaAnos(lim, 2) }, memoria: `emissão + ${dias} dias de apresentação (${dias === 30 ? 'mesma praça' : 'outra praça ou exterior'}) + 6 meses` };
    },
  },
  duplicataSacado: {
    grupo: 'Títulos de crédito', titulo: 'Execução de duplicata contra o sacado (devedor) e avalistas',
    inicio: 'Data de vencimento da duplicata', prazo: '3 anos',
    fundamento: 'Lei 5.474/1968, art. 18, I',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 3), memoria: 'vencimento + 3 anos' }),
  },
  duplicataEndossante: {
    grupo: 'Títulos de crédito', titulo: 'Execução de duplicata contra endossante e avalistas',
    inicio: 'Data do protesto', prazo: '1 ano',
    fundamento: 'Lei 5.474/1968, art. 18, II',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 1), memoria: 'protesto + 1 ano' }),
  },
  lancamentoOficio: {
    grupo: 'Tributário e aduaneiro', titulo: 'Fisco: prazo para lançar (constituir) o tributo — regra geral',
    inicio: 'Data do fato gerador (o ano em que o lançamento já poderia ser feito)', prazo: '5 anos a partir de 1º de janeiro do ano seguinte',
    fundamento: 'CTN, art. 173, I',
    nota: 'É prazo de decadência. A ferramenta supõe que o lançamento já podia ser feito no mesmo ano do fato gerador. Em caso de dolo, fraude ou simulação, o CTN manda contar assim também os tributos sujeitos a homologação (art. 150, § 5º, incluído pela LC 236/2026).',
    calc: (d) => { const y = partes(d)[0]; const t = iso(y + 1, 1, 1); return { termoInicial: t, limite: somaAnos(t, 5), memoria: `1º/01/${y + 1} + 5 anos` }; },
  },
  homologacao: {
    grupo: 'Tributário e aduaneiro', titulo: 'Fisco: tributo declarado e pago pelo contribuinte (lançamento por homologação), mesmo com pagamento parcial',
    inicio: 'Data do fato gerador', prazo: '5 anos',
    fundamento: 'CTN, art. 150, §§ 4º e 6º',
    nota: 'É prazo de decadência. Sem dolo, fraude ou simulação; se houver, use a regra geral (art. 150, § 5º). Se não houve pagamento algum, a contagem costuma seguir a regra geral do art. 173, I: confira com um advogado.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 5), memoria: 'fato gerador + 5 anos' }),
  },
  revisaoAduaneira: {
    grupo: 'Tributário e aduaneiro', titulo: 'Revisão aduaneira da declaração de importação',
    inicio: 'Data de registro da declaração de importação', prazo: '5 anos',
    fundamento: 'Decreto-Lei 37/1966, art. 54',
    nota: 'O art. 54 fixa 5 anos, contados do registro da declaração, para apurar o pagamento e a exatidão das informações. A cobrança do tributo também se sujeita aos prazos do CTN (arts. 150 e 173), e a combinação dessas regras pode ser discutida no caso concreto.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 5), memoria: 'registro da declaração + 5 anos' }),
  },
  cobrancaTributo: {
    grupo: 'Tributário e aduaneiro', titulo: 'Fisco: prazo para cobrar o tributo já constituído',
    inicio: 'Data da constituição definitiva do crédito', prazo: '5 anos',
    fundamento: 'CTN, art. 174',
    nota: 'A LC 236/2026 ampliou as causas de interrupção (protesto da certidão de dívida ativa, mediação, arbitragem tributária, entre outras: art. 174, § 1º). Parcelamento e recursos administrativos suspendem a exigibilidade (art. 151).',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 5), memoria: 'constituição definitiva + 5 anos' }),
  },
  avariaMaritima: {
    grupo: 'Transporte de carga', titulo: 'Ação por extravio, falta ou avaria de carga no transporte por água',
    inicio: 'Data do término da descarga do navio', prazo: '1 ano',
    fundamento: 'Decreto-Lei 116/1967, art. 8º',
    nota: 'O parágrafo único do art. 8º restringe a forma de interromper esse prazo. O seguro de carga e o contrato de transporte podem ter prazos de aviso próprios.',
    calc: (d) => ({ termoInicial: d, limite: somaAnos(d, 1), memoria: 'fim da descarga + 1 ano' }),
  },
  avariaAviso: {
    grupo: 'Transporte de carga', titulo: 'Avisar o transportador de perda parcial ou avaria não perceptível à primeira vista',
    inicio: 'Data da entrega da mercadoria', prazo: '10 dias',
    fundamento: 'Código Civil, art. 754, parágrafo único',
    nota: 'Não é prescrição: é o prazo para denunciar o dano e conservar a ação contra o transportador (a lei fala em decadência). Avaria aparente deve ser reclamada no ato do recebimento (art. 754, caput). Transporte aéreo internacional e leis especiais podem ter regras próprias.',
    calc: (d) => ({ termoInicial: d, limite: somaDias(d, 10), memoria: 'entrega + 10 dias' }),
  },
};

/**
 * @param p.situacao chave de SITUACOES; p.data AAAA-MM-DD; p.hoje AAAA-MM-DD; p.praca 'mesma'|'outra' (cheque)
 */
export function calcularPrescricao(p) {
  const erros = [];
  const s = SITUACOES[p.situacao];
  if (!s) erros.push('Escolha a situação.');
  if (!dataValida(p.data)) erros.push('Informe uma data válida.');
  if (!dataValida(p.hoje)) erros.push('Data de referência inválida.');
  if (erros.length) return { ok: false, erros };
  const r = s.calc(p.data, { praca: p.praca });
  const vespera = somaDias(r.limite, -1);
  const restantes = diasEntre(p.hoje, r.limite);
  return {
    ok: true, situacao: p.situacao, titulo: s.titulo, prazo: s.prazo, fundamento: s.fundamento, nota: s.nota || '',
    termoInicial: r.termoInicial, limite: r.limite, vespera, memoria: r.memoria, extra: r.extra || null,
    restantes, vencido: restantes < 0, limiteFimDeSemana: fimDeSemana(r.limite),
  };
}
