/**
 * frentes.ts — Fonte única da arquitetura de áreas no reposicionamento
 * empresarial.
 *
 * O projeto já tinha dois níveis: seis "núcleos" (páginas-pilar, em
 * src/lib/nucleos.ts) e dezenove páginas de área (src/content/areas/). O
 * problema que este arquivo resolve é de exposição, não de conteúdo: metade
 * das páginas de área trata de matéria empresarial — advocacia empresarial,
 * contratos, contencioso estratégico, criminal empresarial, recuperação
 * judicial, trabalhista do lado do empregador — e nada disso aparecia no
 * menu, no rodapé ou na página geral de áreas, que só mostravam os seis
 * núcleos. Quem chegava ao site não tinha como saber que o escritório atua
 * nessas frentes.
 *
 * Aqui as páginas EXISTENTES são agrupadas em bandas, com as empresariais à
 * frente. Nenhuma URL muda, nenhuma página é criada e nenhuma competência é
 * afirmada: cada item abaixo aponta para uma página que já estava publicada,
 * com o rótulo que ela própria usa.
 */

export interface FrenteItem {
  label: string;
  href: string;
  /** Uma linha, para o menu e para os cartões. */
  short: string;
}

export interface Banda {
  id: string;
  /** Rótulo da banda (menu, rodapé, página geral). */
  label: string;
  /** Página que ancora a banda — a mais abrangente do grupo. */
  href: string;
  /** Uma linha descrevendo o recorte da banda. */
  short: string;
  items: FrenteItem[];
}

const A = '/areas-de-atuacao';

export const bandas: Banda[] = [
  {
    id: 'empresarial',
    label: 'Empresarial e societário',
    href: `${A}/advocacia-empresarial/`,
    short:
      'Assessoria contratual, societária e contenciosa para a operação da empresa, com a mesma equipe acompanhando prevenção e litígio.',
    items: [
      {
        label: 'Advocacia Empresarial',
        href: `${A}/advocacia-empresarial/`,
        short: 'Assessoria consultiva nas relações contratuais, societárias e contenciosas da empresa.',
      },
      {
        label: 'Contratos Empresariais',
        href: `${A}/contratos-empresariais/`,
        short: 'Elaboração, revisão e negociação com foco na clareza das obrigações e na prevenção de litígio.',
      },
      {
        label: 'Contencioso Empresarial Estratégico',
        href: `${A}/contencioso-empresarial-estrategico/`,
        short: 'Litígios de maior complexidade e gestão de carteiras de processos repetitivos.',
      },
      {
        label: 'Trabalhista Empresarial',
        href: `${A}/trabalhista-empresarial/`,
        short: 'Defesa do empregador: reclamatórias, passivo, fiscalização e revisão de rotinas.',
      },
      {
        label: 'Recuperação Judicial e Falência',
        href: `${A}/recuperacao-judicial-e-falencia/`,
        short: 'Empresas em crise e credores envolvidos em recuperação judicial ou falência.',
      },
      {
        label: 'Criminal Empresarial',
        href: `${A}/criminal-empresarial/`,
        short: 'Defesa de empresas, sócios e administradores em apurações ligadas à atividade empresarial.',
      },
    ],
  },
  {
    id: 'comercio-exterior',
    label: 'Comércio exterior e aduaneiro',
    href: `${A}/direito-aduaneiro-tributario/`,
    short:
      'A operação de importação lida por inteiro: contrato com o fornecedor estrangeiro, passagem pela aduana e tributação incidente.',
    items: [
      {
        label: 'Direito Aduaneiro-Tributário',
        href: `${A}/direito-aduaneiro-tributario/`,
        short: 'Retenção de mercadoria, perdimento, classificação fiscal e revisão de tributos na importação.',
      },
      {
        label: 'Direito Aduaneiro e Comércio Exterior',
        href: `${A}/direito-aduaneiro-comercio-exterior/`,
        short: 'Multas aduaneiras, exigências alfandegárias e liberação de carga.',
      },
      {
        label: 'Contratos de Importação',
        href: `${A}/contratos-de-importacao-comercio-exterior/`,
        short: 'Compra, venda e distribuição internacional: cláusulas, foro aplicável e risco cambial.',
      },
      {
        label: 'Assessoria a Importadores',
        href: `${A}/assessoria-juridica-para-importadores/`,
        short: 'Acompanhamento jurídico contínuo da operação, e não de um contrato isolado.',
      },
    ],
  },
  {
    id: 'credito',
    label: 'Crédito e inadimplência',
    href: `${A}/recuperacao-de-credito/`,
    short:
      'Transformar crédito registrado em crédito recebido: cobrança, execução, localização de patrimônio e habilitação em concurso de credores.',
    items: [
      {
        label: 'Recuperação de Crédito',
        href: `${A}/recuperacao-de-credito/`,
        short: 'Cobrança e execução com localização de patrimônio e medidas para tornar o crédito efetivo.',
      },
      {
        label: 'Execução e Cobrança Empresarial',
        href: `${A}/execucao-cobranca-recuperacao-de-credito/`,
        short: 'Execução de título extrajudicial, ação de cobrança e localização de bens do devedor.',
      },
      {
        label: 'Habilitação e Impugnação de Crédito',
        href: `${A}/habilitacao-e-impugnacao-de-credito/`,
        short: 'Posição do credor na recuperação judicial e na falência do devedor.',
      },
      {
        label: 'Cobrança Condominial',
        href: `${A}/cobranca-condominial/`,
        short: 'Cotas em atraso, acordos e assessoria recorrente a condomínios e administradoras.',
      },
    ],
  },
  {
    id: 'internacional',
    label: 'Internacional',
    href: `${A}/direito-internacional/`,
    short:
      'Demandas que atravessam fronteiras: decisão estrangeira que precisa valer no Brasil, patrimônio e partes no exterior.',
    items: [
      {
        label: 'Direito Internacional',
        href: `${A}/direito-internacional/`,
        short: 'Demandas com conexão entre o Brasil e outros países.',
      },
      {
        label: 'Homologação de Sentença Estrangeira',
        href: `${A}/homologacao-de-sentenca-estrangeira/`,
        short: 'Reconhecimento no STJ para que a decisão estrangeira produza efeitos no Brasil.',
      },
      {
        label: 'Reconhecimento de Decisões Estrangeiras',
        href: `${A}/reconhecimento-de-decisoes-estrangeiras/`,
        short: 'Decisões, acordos e atos estrangeiros a validar no país.',
      },
      {
        label: 'Homologação de Divórcio Estrangeiro',
        href: `${A}/homologacao-de-divorcio-estrangeiro/`,
        short: 'Divórcio realizado fora do Brasil e seus efeitos patrimoniais e registrais.',
      },
    ],
  },
  {
    id: 'patrimonio',
    label: 'Patrimônio e sucessões',
    href: `${A}/inventario-e-patrimonio/`,
    short:
      'Organização e transmissão de patrimônio — inclusive quando há quotas de empresa, bens ou herdeiros fora do país.',
    items: [
      {
        label: 'Inventário e Patrimônio',
        href: `${A}/inventario-e-patrimonio/`,
        short: 'Inventário, partilha e organização patrimonial.',
      },
      {
        label: 'Inventário e Partilha',
        href: `${A}/inventario-e-partilha/`,
        short: 'Condução do inventário judicial e extrajudicial e da partilha entre herdeiros.',
      },
      {
        label: 'Inventário com Herdeiro no Exterior',
        href: `${A}/inventario-com-herdeiro-no-exterior/`,
        short: 'Representação, formalidades e coordenação entre jurisdições.',
      },
      {
        label: 'Divórcio e Questões Patrimoniais',
        href: `${A}/divorcio-e-questoes-patrimoniais/`,
        short: 'Regime de bens, levantamento de ativos e partilha.',
      },
      {
        label: 'Família e Sucessões',
        href: `${A}/familia-e-sucessoes/`,
        short: 'Relações familiares com reflexo patrimonial e planejamento sucessório.',
      },
    ],
  },
  {
    id: 'ambiental',
    label: 'Ambiental',
    href: `${A}/direito-ambiental/`,
    short:
      'Autuação, embargo e licenciamento: defesa e regularização para empreendimentos, condomínios e proprietários.',
    items: [
      {
        label: 'Direito Ambiental',
        href: `${A}/direito-ambiental/`,
        short: 'Auto de infração, embargo, licenciamento, APP e passivo ambiental.',
      },
    ],
  },
];

/** Banda que ancora uma rota, para marcar o estado ativo no menu. */
export function bandaDe(pathname: string): Banda | undefined {
  return bandas.find((b) => b.items.some((i) => pathname.startsWith(i.href)));
}
