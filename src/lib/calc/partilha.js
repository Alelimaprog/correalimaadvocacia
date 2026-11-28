// Simulador de meação e herança (sucessão legítima, sem testamento) — funções puras (28/11/2026).
// Regras do Código Civil lidas no Planalto: arts. 1.640, 1.641, 1.658 a 1.660, 1.667, 1.668,
// 1.687, 1.725, 1.829 a 1.844 e 1.845/1.846. Tese do STF no Tema 809 (RE 878.694) lida no portal do STF.
import { r2 } from './comex.js';

export const REGIMES = {
  parcial: 'Comunhão parcial de bens',
  universal: 'Comunhão universal de bens',
  convencional: 'Separação convencional (pacto antenupcial)',
  obrigatoria: 'Separação obrigatória (art. 1.641)',
};

const int = (v) => (v === '' || v == null ? 0 : Number(v));
const okInt = (v, max) => Number.isInteger(v) && v >= 0 && v <= max;

/**
 * @param p.conjuge 'nenhum' | 'casamento' | 'uniao'
 * @param p.regime chave de REGIMES
 * @param p.bensComuns valor dos bens que se comunicam pelo regime (metade é do sobrevivente)
 * @param p.bensParticulares valor dos bens só do falecido
 * @param p.base 'particulares' | 'toda' — base da concorrência do cônjuge na comunhão parcial (tema controvertido)
 * @param p.desc { filhos, netosDePremortos: number[], filiacao: 'comum'|'exclusiva'|'hibrida' }
 * @param p.asc { pai, mae, avosPaternos, avosMaternos }
 * @param p.col { irmaosBil, irmaosUni, sobrinhosBil: number[], sobrinhosUni: number[], tios, outros }
 */
export function simularPartilha(p) {
  const erros = [];
  const temConj = p.conjuge === 'casamento' || p.conjuge === 'uniao';
  if (temConj && !REGIMES[p.regime]) erros.push('Escolha o regime de bens.');
  const A = p.bensComuns ? Number(p.bensComuns) : 0;
  const B = p.bensParticulares ? Number(p.bensParticulares) : 0;
  if (!(A >= 0) || !(B >= 0) || !Number.isFinite(A) || !Number.isFinite(B)) erros.push('Valores dos bens: informe números positivos.');
  else if (A + B <= 0) erros.push('Informe o valor de pelo menos um grupo de bens.');
  const d = p.desc || {}; const a = p.asc || {}; const c = p.col || {};
  const filhos = int(d.filhos), netos = (d.netosDePremortos || []).map(int).filter((n) => n !== 0);
  const avP = int(a.avosPaternos), avM = int(a.avosMaternos);
  const ib = int(c.irmaosBil), iu = int(c.irmaosUni), tios = int(c.tios), outros = int(c.outros);
  const sb = (c.sobrinhosBil || []).map(int).filter((n) => n !== 0), su = (c.sobrinhosUni || []).map(int).filter((n) => n !== 0);
  for (const [n, v, m] of [['Filhos', filhos, 50], ['Avós paternos', avP, 2], ['Avós maternos', avM, 2], ['Irmãos bilaterais', ib, 50], ['Irmãos unilaterais', iu, 50], ['Tios', tios, 50], ['Outros colaterais', outros, 100]]) if (!okInt(v, m)) erros.push(`${n}: informe um número inteiro entre 0 e ${m}.`);
  for (const [n, arr] of [['Netos de filho falecido', netos], ['Sobrinhos', sb.concat(su)]]) if (arr.some((v) => !okInt(v, 30) || v < 1) || arr.length > 30) erros.push(`${n}: use números inteiros separados por vírgula (ex.: 2, 1).`);
  if (erros.length) return { ok: false, erros };

  const meacao = temConj ? A / 2 : 0;
  const heranca = temConj ? A / 2 + B : A + B;
  const linhas = [];
  const add = (rotulo, qtd, valorCada, grupo) => { if (qtd > 0 && valorCada > 0) linhas.push({ rotulo, qtd, valorCada, grupo }); };
  const avisos = [];
  let classe = '';
  let conjugeHeranca = 0; let alternativa = null;
  const conjNome = p.conjuge === 'uniao' ? 'Companheiro(a)' : 'Cônjuge';

  // ---------- 1ª classe: descendentes (arts. 1.829, I, 1.832 a 1.835) ----------
  const soNetos = filhos === 0 && netos.length > 0;
  const cabecas = soNetos ? netos.reduce((s, n) => s + n, 0) : filhos + netos.length;
  if (cabecas > 0) {
    classe = 'descendentes';
    const concorre = temConj && (p.regime === 'convencional' || (p.regime === 'parcial' && B > 0));
    const fConj = (n) => (d.filiacao === 'comum' && n >= 4 ? 1 / 4 : 1 / (n + 1));
    let paraDesc = heranca;
    if (concorre) {
      const f = fConj(cabecas);
      if (p.regime === 'parcial') {
        const soPart = B * f, toda = heranca * f;
        conjugeHeranca = p.base === 'toda' ? toda : soPart;
        alternativa = { base: p.base === 'toda' ? 'particulares' : 'toda', valor: r2(p.base === 'toda' ? soPart : toda) };
      } else conjugeHeranca = heranca * f;
      paraDesc = heranca - conjugeHeranca;
      if (d.filiacao === 'comum' && cabecas >= 4) avisos.push(`Reserva de 1/4: como o(a) ${conjNome.toLowerCase()} é ascendente de todos os herdeiros com quem concorre, a quota dele(a) não pode ser inferior a 1/4 da herança (art. 1.832).`);
      if (d.filiacao === 'hibrida') avisos.push('Filiação híbrida (filhos comuns e filhos só do falecido): a lei não diz se a reserva de 1/4 do art. 1.832 se aplica. A ferramenta não aplica a reserva e divide em partes iguais. Esse ponto é controvertido.');
    }
    if (soNetos) add('Cada neto (herda por cabeça, art. 1.835)', cabecas, paraDesc / cabecas, 'desc');
    else {
      add('Cada filho', filhos, paraDesc / cabecas, 'desc');
      netos.forEach((n, i) => add(`Cada neto do ${i + 1}º filho falecido (por estirpe, art. 1.835)`, n, paraDesc / cabecas / n, 'desc'));
    }
    if (netos.length) avisos.push('Netos de filho já falecido herdam por representação, dividindo entre si a parte que caberia ao pai ou à mãe (art. 1.835). Renúncia, indignidade e deserdação não entram no cálculo.');
    if (temConj && !concorre) {
      if (p.regime === 'universal') avisos.push(`Comunhão universal: o(a) ${conjNome.toLowerCase()} recebe a meação e não concorre com os descendentes na herança (art. 1.829, I).`);
      if (p.regime === 'obrigatoria') avisos.push(`Separação obrigatória: pelo art. 1.829, I, o(a) ${conjNome.toLowerCase()} não concorre com os descendentes.`);
      if (p.regime === 'parcial') avisos.push(`Comunhão parcial sem bens particulares: pelo art. 1.829, I, o(a) ${conjNome.toLowerCase()} fica com a meação e não concorre com os descendentes.`);
    }
    if (concorre && p.regime === 'parcial') avisos.push(`Tema controvertido: na comunhão parcial, o(a) ${conjNome.toLowerCase()} concorre com os descendentes porque o falecido deixou bens particulares. Há leituras diferentes sobre a base dessa concorrência: só os bens particulares ou toda a herança. Na outra leitura, a parte dele(a) na herança seria de R$ ${alternativa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
    if (concorre && p.regime === 'convencional') avisos.push(`Separação convencional: o art. 1.829, I, não exclui o(a) ${conjNome.toLowerCase()} da concorrência com os descendentes, e a ferramenta o(a) inclui. O tema já foi decidido de formas diferentes nos tribunais; confira com um advogado.`);
  // ---------- 2ª classe: ascendentes (arts. 1.829, II, 1.836 e 1.837) ----------
  } else if (a.pai || a.mae || avP + avM > 0) {
    classe = 'ascendentes';
    const pais = (a.pai ? 1 : 0) + (a.mae ? 1 : 0);
    if (pais > 0) {
      const f = temConj ? (pais === 2 ? 1 / 3 : 1 / 2) : 0;
      conjugeHeranca = heranca * f;
      const resto = heranca - conjugeHeranca;
      if (a.pai) add('Pai', 1, resto / pais, 'asc');
      if (a.mae) add('Mãe', 1, resto / pais, 'asc');
    } else {
      conjugeHeranca = temConj ? heranca / 2 : 0;
      const resto = heranca - conjugeHeranca;
      if (avP && avM) { add('Cada avô/avó paterno(a)', avP, resto / 2 / avP, 'asc'); add('Cada avô/avó materno(a)', avM, resto / 2 / avM, 'asc'); }
      else if (avP) add('Cada avô/avó paterno(a)', avP, resto / avP, 'asc');
      else add('Cada avô/avó materno(a)', avM, resto / avM, 'asc');
      avisos.push('Na classe dos ascendentes o grau mais próximo exclui o mais remoto, e com avós das duas linhas cada linha recebe metade (art. 1.836). Bisavós não entram na ferramenta.');
    }
    if (temConj) avisos.push(`Com ascendentes, o(a) ${conjNome.toLowerCase()} concorre qualquer que seja o regime de bens (art. 1.829, II): 1/3 com pai e mãe; metade com um só deles ou com avós (art. 1.837).`);
  // ---------- 3ª classe: cônjuge (art. 1.838) ----------
  } else if (temConj) {
    classe = 'conjuge';
    conjugeHeranca = heranca;
    avisos.push(`Sem descendentes nem ascendentes, a herança vai inteira ao(à) ${conjNome.toLowerCase()} (art. 1.838), qualquer que seja o regime.`);
  // ---------- 4ª classe: colaterais até o 4º grau (arts. 1.839 a 1.843) ----------
  } else if (ib + iu + sb.length + su.length > 0) {
    classe = 'colaterais';
    if (ib + iu > 0) {
      const u = ib * 2 + iu + sb.length * 2 + su.length;
      add('Cada irmão bilateral (mesmo pai e mesma mãe)', ib, heranca * 2 / u, 'col');
      add('Cada irmão unilateral', iu, heranca / u, 'col');
      sb.forEach((n, i) => add(`Cada sobrinho, filho do ${i + 1}º irmão bilateral falecido (representação, art. 1.840)`, n, heranca * 2 / u / n, 'col'));
      su.forEach((n, i) => add(`Cada sobrinho, filho do ${i + 1}º irmão unilateral falecido (representação, art. 1.840)`, n, heranca / u / n, 'col'));
      avisos.push('O irmão unilateral recebe metade do que recebe o bilateral (art. 1.841).');
    } else {
      const nb = sb.reduce((s, n) => s + n, 0), nu = su.reduce((s, n) => s + n, 0); const u = nb * 2 + nu;
      add('Cada sobrinho, filho de irmão bilateral', nb, heranca * 2 / u, 'col');
      add('Cada sobrinho, filho de irmão unilateral', nu, heranca / u, 'col');
      avisos.push('Sem irmãos vivos, os sobrinhos herdam por cabeça; o filho de irmão unilateral recebe metade do que recebe o filho de irmão bilateral (art. 1.843).');
    }
  } else if (tios > 0) { classe = 'colaterais'; add('Cada tio ou tia', tios, heranca / tios, 'col'); avisos.push('Na falta de irmãos e sobrinhos, herdam os tios (art. 1.843).'); }
  else if (outros > 0) { classe = 'colaterais'; add('Cada parente colateral de 4º grau', outros, heranca / outros, 'col'); avisos.push('Parentes de 4º grau (primos, tios-avós, sobrinhos-netos) foram divididos por igual, o que é uma simplificação: confira o grau e a ordem de cada um (arts. 1.839 e 1.840).'); }
  else { classe = 'poderPublico'; avisos.push('Sem cônjuge, companheiro ou parente sucessível, a herança vai ao Município ou ao Distrito Federal onde estão os bens, ou à União se em território federal (art. 1.844).'); }

  if (conjugeHeranca > 0) linhas.unshift({ rotulo: `${conjNome}: parte na herança`, qtd: 1, valorCada: conjugeHeranca, grupo: 'conj' });

  // Avisos gerais
  if (temConj) {
    avisos.push(`Direito real de habitação: o(a) ${conjNome.toLowerCase()} pode continuar morando no imóvel da família, se for o único dessa natureza a inventariar, qualquer que seja o regime (art. 1.831). A ferramenta não atribui valor a esse direito.`);
    avisos.push('Separação: só há direito sucessório do cônjuge se, na data da morte, o casal não estava separado judicialmente nem separado de fato há mais de dois anos, salvo exceção (art. 1.830).');
    if (p.regime === 'obrigatoria') avisos.push('Separação obrigatória: pela Súmula 377 do STF, no regime de separação legal comunicam-se os bens adquiridos na constância do casamento. Se e como ela se aplica no caso (inclusive à união estável) é discutido; lance esses bens em "bens que se comunicam" só se for considerá-la. O STF também decidiu (Tema 1.236) que, para maiores de 70 anos, a separação obrigatória pode ser afastada por escritura pública.');
    if (p.regime === 'convencional') avisos.push('Separação convencional: em regra não há meação (art. 1.687). Lance em "bens que se comunicam" só bens que o casal tinha em condomínio.');
    if (p.conjuge === 'uniao') avisos.push('União estável: o STF fixou que é inconstitucional a distinção de regimes sucessórios do art. 1.790 do Código Civil e que se aplica ao companheiro o regime do art. 1.829 (Tema 809, RE 878.694). Sem contrato escrito, vale a comunhão parcial (art. 1.725). A aplicação da tese a partilhas antigas tem regras próprias: confira com um advogado.');
  }
  const total = (l) => l.valorCada * l.qtd;
  const out = linhas.map((l) => ({ rotulo: l.rotulo, qtd: l.qtd, grupo: l.grupo, valorCada: r2(l.valorCada), valorTotal: r2(total(l)), pct: heranca ? Math.round(l.valorCada / heranca * 10000) / 100 : 0 }));
  return {
    ok: true, classe, meacao: r2(meacao), heranca: r2(heranca), conjugeHeranca: r2(conjugeHeranca),
    conjugeTotal: r2(meacao + conjugeHeranca), alternativa, linhas: out, avisos,
  };
}
