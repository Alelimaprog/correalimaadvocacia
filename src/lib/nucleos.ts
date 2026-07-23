/**
 * nucleos.ts — Fonte única dos seis núcleos de atuação (Sprint 1).
 * Consumido por: menu (navigation), Home, página geral de áreas, rodapé e
 * páginas-pilar. Conteúdo baseado nas definições fornecidas pelo escritório
 * (abrangência de cada núcleo) — sem números, prêmios ou promessas de resultado.
 */

export interface Faq {
  q: string;
  a: string;
}
export interface RelatedLink {
  label: string;
  href: string;
}

export interface Nucleo {
  slug: string;
  href: string;
  /** Rótulo curto (menu, cards, rodapé). */
  label: string;
  icon: string;
  /** Uma linha para cards e submenu. */
  short: string;
  /** Entradas orientadas por dor (bloco "Qual problema resolver?" na Home). */
  problems: string[];

  /* Conteúdo da página-pilar */
  eyebrow: string;
  h1: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  /** O que o núcleo resolve (situações concretas). */
  situations: string[];
  /** Serviços/abrangência. */
  services: string[];
  /** Para quem é o atendimento. */
  forWhom: string[];
  faq: Faq[];
  related: RelatedLink[];
}

const BASE = '/areas-de-atuacao';

export const nucleos: Nucleo[] = [
  {
    slug: 'recuperacao-de-credito',
    href: `${BASE}/recuperacao-de-credito/`,
    label: 'Recuperação de Crédito',
    icon: 'coins',
    short:
      'Cobrança e execução de dívidas, com localização de patrimônio e medidas para tornar o crédito efetivo.',
    problems: ['Preciso cobrar uma dívida', 'Um cliente ou empresa não paga'],
    eyebrow: 'Recuperação de crédito',
    h1: 'Recuperação de Crédito',
    heroDescription:
      'Cobrança extrajudicial e judicial, execução de títulos e localização de patrimônio para transformar dívidas em crédito efetivamente recuperado.',
    seoTitle: 'Recuperação de Crédito e Execução de Dívidas',
    seoDescription:
      'Cobrança extrajudicial e judicial, execução de título extrajudicial, localização de patrimônio, penhora e recuperação de crédito empresarial. Atuação técnica e estratégica.',
    situations: [
      'Cliente ou empresa que não paga e acumula inadimplência',
      'Título executivo (duplicata, cheque, nota promissória) que precisa ser executado',
      'Devedor sem bens aparentes, exigindo localização de patrimônio',
      'Crédito a habilitar em recuperação judicial ou falência',
    ],
    services: [
      'Cobrança extrajudicial e judicial',
      'Execução de título extrajudicial',
      'Confissão de dívida',
      'Duplicatas, cheques e notas promissórias',
      'Localização de patrimônio e penhora de bens',
      'SISBAJUD, RENAJUD e fraude à execução',
      'Recuperação de crédito empresarial',
      'Habilitação de crédito em recuperação judicial',
    ],
    forWhom: [
      'Empresas com carteira de inadimplentes',
      'Prestadores de serviço e fornecedores',
      'Credores com títulos a executar',
    ],
    faq: [
      {
        q: 'Quando vale a pena iniciar uma cobrança judicial?',
        a: 'Em regra, quando a via extrajudicial se esgota ou quando há título executivo e indícios de patrimônio. A decisão considera o valor, a documentação disponível e a chance real de localizar bens do devedor.',
      },
      {
        q: 'Preciso ter um título para executar a dívida?',
        a: 'Havendo título executivo, a execução é a via mais direta. Na ausência dele, avalia-se ação de cobrança ou monitória, conforme os documentos que comprovem a dívida.',
      },
      {
        q: 'É possível localizar bens de um devedor que parece não ter patrimônio?',
        a: 'Sim. Ferramentas como SISBAJUD e RENAJUD, além de pesquisa patrimonial, permitem identificar valores, veículos e bens, inclusive em casos de fraude à execução.',
      },
    ],
    related: [
      { label: 'Execução, Cobrança e Recuperação de Crédito', href: `${BASE}/execucao-cobranca-recuperacao-de-credito/` },
      { label: 'Habilitação e Impugnação de Crédito', href: `${BASE}/habilitacao-e-impugnacao-de-credito/` },
      { label: 'Guia: Cobrança, Execução e Recuperação de Crédito Empresarial', href: '/guias/cobranca-execucao-e-recuperacao-de-credito-empresarial/' },
    ],
  },
  {
    slug: 'cobranca-condominial',
    href: `${BASE}/cobranca-condominial/`,
    label: 'Cobrança Condominial',
    icon: 'building',
    short:
      'Recuperação de cotas e despesas condominiais em atraso, com acordos e assessoria recorrente a condomínios.',
    problems: ['O condomínio possui inadimplentes'],
    eyebrow: 'Cobrança condominial',
    h1: 'Cobrança Condominial',
    heroDescription:
      'Recuperação de cotas e despesas condominiais em atraso, formalização de acordos e assessoria recorrente a condomínios, síndicos e administradoras.',
    seoTitle: 'Cobrança Condominial e Recuperação de Inadimplência',
    seoDescription:
      'Cobrança e execução de cotas condominiais, recuperação de inadimplência, acordos e assessoria recorrente a condomínios, síndicos e administradoras.',
    situations: [
      'Condomínio com elevado índice de inadimplência',
      'Cotas e despesas condominiais em atraso a executar',
      'Necessidade de negociar e formalizar acordos com condôminos',
      'Síndico ou administradora sem apoio jurídico recorrente',
    ],
    services: [
      'Cobrança de cotas condominiais',
      'Execução de despesas condominiais',
      'Recuperação de inadimplência',
      'Negociação e formalização de acordos',
      'Assessoria recorrente para condomínios',
      'Orientação jurídica para síndicos e administradoras',
    ],
    forWhom: ['Condomínios residenciais e comerciais', 'Síndicos', 'Administradoras de condomínios'],
    faq: [
      {
        q: 'O condomínio pode executar diretamente a dívida de cotas?',
        a: 'As cotas condominiais têm natureza que, em regra, permite cobrança por rito mais célere. A via adequada depende da documentação (convenção, atas e demonstrativos) e da situação de cada condômino.',
      },
      {
        q: 'É possível fazer acordo com o condômino inadimplente?',
        a: 'Sim. A negociação e a formalização de acordos costumam ser o caminho mais rápido para recuperar valores, preservando a relação e evitando a judicialização quando viável.',
      },
    ],
    related: [
      { label: 'Cobrança Condominial e Recuperação de Inadimplência', href: `${BASE}/cobranca-condominial-recuperacao-de-inadimplencia/` },
      { label: 'Execução, Cobrança e Recuperação de Crédito', href: `${BASE}/execucao-cobranca-recuperacao-de-credito/` },
    ],
  },
  {
    slug: 'direito-ambiental',
    href: `${BASE}/direito-ambiental/`,
    label: 'Direito Ambiental',
    icon: 'leaf',
    short:
      'Defesa e regularização diante de autos de infração, embargos e imóveis em área protegida — para pessoas físicas e empresas.',
    problems: ['Meu imóvel está em área protegida', 'Recebi uma multa ou embargo ambiental'],
    eyebrow: 'Direito ambiental',
    h1: 'Direito Ambiental',
    heroDescription:
      'Defesa administrativa e judicial e regularização diante de autos de infração, embargos e imóveis em área de preservação — para proprietários, condomínios, empreendimentos e empresas.',
    seoTitle: 'Direito Ambiental: Defesa e Regularização',
    seoDescription:
      'Imóvel em APP, autos de infração, multas, embargos, licenciamento e passivo ambiental. Defesa administrativa e judicial para pessoas físicas e empresas.',
    situations: [
      'Imóvel localizado em área de preservação permanente (APP)',
      'Auto de infração, multa, embargo ou ordem de demolição',
      'Necessidade de regularização ambiental de imóvel ou empreendimento',
      'Passivo ambiental na compra, venda ou herança de imóvel',
    ],
    services: [
      'Imóvel e construção em área de preservação permanente (APP)',
      'Regularização ambiental de imóvel',
      'Auto de infração, multa, embargo e ordem de demolição',
      'Supressão de vegetação e intervenção em área protegida',
      'TAC, defesa administrativa e defesa judicial',
      'Atuação junto a CETESB, IBAMA e órgãos ambientais municipais',
      'Licenciamento ambiental e passivo ambiental',
      'Responsabilidade ambiental do proprietário ou comprador',
    ],
    forWhom: [
      'Proprietários de imóveis (pessoas físicas)',
      'Condomínios e empreendimentos',
      'Empresas com licenciamento ou passivo ambiental',
      'Compradores e herdeiros de imóveis',
    ],
    faq: [
      {
        q: 'Uma construção em APP pode ser regularizada?',
        a: 'Em algumas hipóteses sim, conforme a legislação aplicável, a data da ocupação e as características da área. Cada caso exige análise documental e técnica para verificar a viabilidade da regularização.',
      },
      {
        q: 'O que fazer ao receber um auto de infração ambiental?',
        a: 'É importante observar o prazo de defesa e reunir a documentação do imóvel e da atividade. A defesa administrativa pode discutir a autuação, a multa e as medidas impostas, como embargo ou demolição.',
      },
      {
        q: 'A responsabilidade ambiental atinge quem comprou o imóvel depois?',
        a: 'A responsabilidade ambiental pode ter natureza que acompanha o imóvel, alcançando o atual proprietário. Por isso, a análise de passivo é relevante antes da compra e na regularização.',
      },
    ],
    related: [
      { label: 'Recebi um auto de infração ambiental: o que fazer', href: '/blog/recebi-auto-de-infracao-ambiental-o-que-fazer/' },
      { label: 'Direito Ambiental: guia completo', href: '/guias/direito-ambiental-guia-completo/' },
      { label: 'Fale com o escritório', href: '/contato/' },
    ],
  },
  {
    slug: 'direito-aduaneiro-tributario',
    href: `${BASE}/direito-aduaneiro-tributario/`,
    label: 'Direito Aduaneiro-Tributário',
    icon: 'package',
    short:
      'Defesa em retenção de mercadorias, perdimento e autuações, e revisão da tributação incidente na importação.',
    problems: ['Minha mercadoria foi retida'],
    eyebrow: 'Direito aduaneiro-tributário',
    h1: 'Direito Aduaneiro-Tributário',
    heroDescription:
      'Defesa diante de retenção de mercadorias, pena de perdimento e autos de infração, e revisão da tributação incidente na importação.',
    seoTitle: 'Direito Aduaneiro-Tributário e Defesa na Importação',
    seoDescription:
      'Retenção de mercadorias, pena de perdimento, multas e autos de infração aduaneiros, classificação fiscal (NCM), valoração aduaneira e revisão de tributos na importação.',
    situations: [
      'Mercadoria retida pela Receita Federal',
      'Pena de perdimento, multa aduaneira ou auto de infração',
      'Divergência de classificação fiscal (NCM) ou valoração aduaneira',
      'Tributos pagos indevidamente na importação a recuperar',
    ],
    services: [
      'Retenção de mercadorias e pena de perdimento',
      'Multas aduaneiras e autos de infração',
      'Classificação fiscal (NCM) e valoração aduaneira',
      'Exigências da Receita Federal e defesa administrativa aduaneira',
      'Tributação na importação: II, IPI, PIS/COFINS-Importação e ICMS',
      'Revisão de tributos e recuperação de valores pagos indevidamente',
      'Regimes aduaneiros especiais, Siscomex e habilitação Radar',
      'Benefícios e incentivos relacionados à importação',
    ],
    forWhom: ['Importadores', 'Empresas de comércio exterior', 'Operadores logísticos e tradings'],
    faq: [
      {
        q: 'O que fazer quando a mercadoria é retida pela Receita Federal?',
        a: 'É preciso identificar o motivo da retenção (documental, classificação, valoração ou suspeita de irregularidade) e responder às exigências no prazo. A atuação tempestiva reduz custos de armazenagem e o risco de perdimento.',
      },
      {
        q: 'É possível reverter uma pena de perdimento?',
        a: 'Depende da causa e das provas. A defesa administrativa pode questionar os fundamentos do perdimento; em certas situações, discute-se a conversão em multa ou a liberação mediante garantia.',
      },
      {
        q: 'Dá para recuperar tributos pagos a mais na importação?',
        a: 'Quando há pagamento indevido — por classificação incorreta, base de cálculo equivocada ou benefício não aplicado — é possível pleitear a restituição ou compensação, conforme o caso.',
      },
    ],
    related: [
      { label: 'Assessoria Jurídica para Importadores', href: `${BASE}/assessoria-juridica-para-importadores/` },
      { label: 'Contratos de Importação / Comércio Exterior', href: `${BASE}/contratos-de-importacao-comercio-exterior/` },
    ],
  },
  {
    slug: 'direito-internacional',
    href: `${BASE}/direito-internacional/`,
    label: 'Direito Internacional',
    icon: 'globe',
    short:
      'Homologação de decisões estrangeiras e demandas jurídicas com conexão entre o Brasil e o exterior.',
    problems: ['Preciso validar no Brasil uma decisão estrangeira'],
    eyebrow: 'Direito internacional',
    h1: 'Direito Internacional',
    heroDescription:
      'Homologação e reconhecimento de decisões estrangeiras e condução de demandas jurídicas com conexão entre o Brasil e outros países.',
    seoTitle: 'Direito Internacional e Homologação de Sentença Estrangeira',
    seoDescription:
      'Homologação de sentença e de divórcio estrangeiro, reconhecimento de decisões, cartas rogatórias e demandas com patrimônio ou herdeiros no exterior.',
    situations: [
      'Sentença ou divórcio estrangeiro que precisa produzir efeitos no Brasil',
      'Decisão estrangeira a ser reconhecida ou executada no país',
      'Patrimônio localizado no exterior ou herdeiros residentes fora do Brasil',
      'Documentos e atos estrangeiros que exigem validação',
    ],
    services: [
      'Homologação de sentença estrangeira',
      'Homologação de divórcio estrangeiro',
      'Reconhecimento de decisões estrangeiras',
      'Carta rogatória',
      'Acordos, atos e documentos estrangeiros',
      'Patrimônio localizado no exterior',
      'Herdeiros residentes no exterior',
      'Demandas com conexão entre Brasil e outros países',
    ],
    forWhom: [
      'Brasileiros com relações jurídicas no exterior',
      'Estrangeiros com demandas no Brasil',
      'Famílias e empresas com elementos internacionais',
    ],
    faq: [
      {
        q: 'Uma sentença estrangeira vale automaticamente no Brasil?',
        a: 'Não. Em regra, a decisão estrangeira precisa ser homologada pelo Superior Tribunal de Justiça para produzir efeitos no Brasil, especialmente quando envolve execução, registro público ou efeitos patrimoniais.',
      },
      {
        q: 'Todo divórcio realizado no exterior precisa ser homologado?',
        a: 'Nem sempre. Divórcios consensuais e sem partilha de bens no Brasil podem, em certas hipóteses, ser averbados diretamente em cartório. Havendo bens ou controvérsia, a homologação costuma ser necessária.',
      },
    ],
    related: [
      { label: 'Homologação de Sentença Estrangeira', href: `${BASE}/homologacao-de-sentenca-estrangeira/` },
      { label: 'Homologação de Divórcio Estrangeiro', href: `${BASE}/homologacao-de-divorcio-estrangeiro/` },
      { label: 'Reconhecimento de Decisões Estrangeiras', href: `${BASE}/reconhecimento-de-decisoes-estrangeiras/` },
      { label: 'Guia: Homologação de Sentença Estrangeira no Brasil', href: '/guias/homologacao-de-sentenca-estrangeira-no-brasil/' },
      { label: 'Quanto custa homologar uma sentença estrangeira no STJ', href: '/blog/quanto-custa-homologar-sentenca-estrangeira-no-stj/' },
      { label: 'Como executar no Brasil a sentença estrangeira homologada', href: '/blog/como-executar-sentenca-estrangeira-homologada-no-brasil/' },
      { label: 'Por que o STJ pode negar a homologação de uma sentença estrangeira', href: '/blog/por-que-o-stj-pode-negar-homologacao-sentenca-estrangeira/' },
      { label: 'Como contestar um pedido de homologação de sentença estrangeira', href: '/blog/como-contestar-pedido-de-homologacao-sentenca-estrangeira/' },
      { label: 'Sentença comercial estrangeira: como cobrar uma dívida no Brasil', href: '/blog/sentenca-comercial-estrangeira-cobrar-divida-no-brasil/' },
      { label: 'Testamento feito no exterior vale no Brasil?', href: '/blog/testamento-feito-no-exterior-vale-no-brasil/' },
      { label: 'Bens no exterior de brasileiro falecido: sucessão internacional', href: '/blog/bens-no-exterior-de-brasileiro-falecido-sucessao-internacional/' },
    ],
  },
  {
    slug: 'inventario-e-patrimonio',
    href: `${BASE}/inventario-e-patrimonio/`,
    label: 'Inventário e Patrimônio',
    icon: 'home',
    short:
      'Inventário, partilha e organização patrimonial, inclusive com bens ou herdeiros no exterior.',
    problems: ['Preciso realizar um inventário'],
    eyebrow: 'Inventário e patrimônio',
    h1: 'Inventário e Patrimônio',
    heroDescription:
      'Condução de inventário e partilha, regularização de bens e organização patrimonial, inclusive em casos com patrimônio ou herdeiros no exterior.',
    seoTitle: 'Inventário, Partilha e Organização Patrimonial',
    seoDescription:
      'Inventário judicial e extrajudicial, partilha, regularização de bens, inventário com herdeiro ou patrimônio no exterior e planejamento sucessório.',
    situations: [
      'Necessidade de abrir inventário após um falecimento',
      'Partilha de bens entre herdeiros',
      'Inventário com herdeiro ou patrimônio localizado no exterior',
      'Organização e regularização de patrimônio familiar',
    ],
    services: [
      'Inventário judicial e extrajudicial',
      'Partilha e regularização de bens',
      'Inventário com herdeiro no exterior',
      'Inventário com patrimônio no exterior',
      'Planejamento sucessório',
      'Organização patrimonial',
    ],
    forWhom: ['Famílias e herdeiros', 'Detentores de patrimônio a organizar', 'Casos com elementos no exterior'],
    faq: [
      {
        q: 'Inventário pode ser feito com herdeiro no exterior?',
        a: 'Sim. É possível conduzir o inventário com herdeiros residentes fora do Brasil, observadas as formalidades de representação e, quando houver bens no exterior, a coordenação entre as jurisdições envolvidas.',
      },
      {
        q: 'Quando o inventário pode ser feito em cartório?',
        a: 'Quando há consenso entre os herdeiros, todos são maiores e capazes e não há testamento que exija a via judicial. Caso contrário, o inventário deve ser judicial.',
      },
    ],
    related: [
      { label: 'Inventário e Partilha', href: `${BASE}/inventario-e-partilha/` },
      { label: 'Inventário com Herdeiro no Exterior', href: `${BASE}/inventario-com-herdeiro-no-exterior/` },
      { label: 'Divórcio e Questões Patrimoniais', href: `${BASE}/divorcio-e-questoes-patrimoniais/` },
      { label: 'Inventário extrajudicial: quando cabe e como funciona', href: '/blog/inventario-extrajudicial-quando-cabe-e-como-funciona/' },
      { label: 'Quanto custa um inventário: ITCMD, custas e honorários', href: '/blog/quanto-custa-um-inventario/' },
      { label: 'Prazo para abrir inventário e o custo do atraso', href: '/blog/prazo-para-abrir-inventario-e-consequencias-do-atraso/' },
      { label: 'Dívidas do falecido: os herdeiros precisam pagar?', href: '/blog/dividas-do-falecido-herdeiros-precisam-pagar/' },
      { label: 'Inventário com imóvel: transferência e regularização', href: '/blog/inventario-com-imovel-transferencia-e-regularizacao/' },
      { label: 'Morte de sócio: o que acontece com as quotas da empresa', href: '/blog/morte-de-socio-o-que-acontece-com-as-quotas/' },
      { label: 'Herdeiro menor ou incapaz: o que muda no inventário', href: '/blog/herdeiro-menor-ou-incapaz-o-que-muda-no-inventario/' },
      { label: 'Herdeiros em conflito: o que fazer quando o inventário trava', href: '/blog/herdeiros-em-conflito-inventario-travado/' },
    ],
  },
];

export function getNucleo(slug: string): Nucleo | undefined {
  return nucleos.find((n) => n.slug === slug);
}
