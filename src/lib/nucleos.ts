/**
 * nucleos.ts — Fonte única dos núcleos de atuação (Sprint 1).
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
    slug: 'direito-aduaneiro-tributario',
    href: `${BASE}/direito-aduaneiro-tributario/`,
    label: 'Direito Aduaneiro-Tributário',
    icon: 'package',
    short:
      'Defesa em retenção de mercadorias, perdimento e autuações, e revisão da tributação incidente na importação.',
    problems: ['Minha mercadoria foi retida'],
    eyebrow: 'Direito aduaneiro-tributário',
    h1: 'Advogado aduaneiro em São Paulo: mercadoria retida e perdimento',
    heroDescription:
      'Quando a Receita retém uma importação (canal vermelho, cinza ou exigência fiscal), é preciso ler o termo no Portal Único e responder no prazo. No auto de perdimento, a impugnação é de 20 dias (DL 1.455/1976, art. 27-A). Conforme o caso, cabe liberação mediante garantia ou mandado de segurança.',
    seoTitle: 'Advogado Aduaneiro em São Paulo: Importação e Perdimento',
    seoDescription:
      'Mercadoria retida, canal vermelho ou cinza, pena de perdimento e auto de infração aduaneiro: defesa administrativa e judicial do importador.',
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
        a: 'Depende da causa e das provas. A defesa discute a própria caracterização da infração. Quando a mercadoria não é localizada ou já foi consumida ou revendida, a lei substitui o perdimento por multa igual ao valor aduaneiro (Decreto-Lei 1.455/1976, art. 23, §3º), que não é necessariamente mais leve.',
      },
      {
        q: 'Qual o prazo para se defender de um auto de infração aduaneiro?',
        a: 'Em regra, 20 dias úteis da ciência para autos de tributo e multa (Decreto 70.235/1972, com a redação da Lei Complementar 227/2026) e 20 dias para autos de perdimento (Decreto-Lei 1.455/1976, art. 27-A, incluído pela Lei 14.651/2023). O prazo conta da ciência, que pode ser eletrônica (e-CAC/DTE).',
      },
      {
        q: 'Qual o prazo do canal vermelho?',
        a: 'A norma não fixa um prazo geral para a conferência no canal vermelho: depende da unidade, da necessidade de laudo e das exigências feitas. Se o caso for para procedimento especial de controle aduaneiro (canal cinza), a retenção tem prazo de até 60 dias, prorrogáveis por mais 60 (IN RFB 1.986/2020). Enquanto isso a armazenagem corre, por isso convém responder a cada exigência no prazo e avaliar a liberação mediante garantia.',
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
    slug: 'inventario-e-patrimonio',
    href: `${BASE}/inventario-e-patrimonio/`,
    label: 'Inventário e Patrimônio',
    icon: 'file',
    short:
      'Inventário, partilha e organização patrimonial, inclusive com bens ou herdeiros no exterior.',
    problems: ['Preciso realizar um inventário'],
    eyebrow: 'Inventário e patrimônio',
    h1: 'Advogado de inventário em São Paulo: cartório ou judicial',
    heroDescription:
      'Em São Paulo, o inventário pode ser feito em cartório quando os herdeiros estão de acordo e têm advogado; desde a Res. CNJ 571/2024, também com herdeiro menor ou testamento, sob condições. Sem acordo, é judicial. Deve ser aberto em até 60 dias do óbito: depois disso, o ITCMD de 4% tem multa de 10% a 20%.',
    seoTitle: 'Advogado de Inventário em São Paulo: Judicial e Cartório',
    seoDescription:
      'Inventário em São Paulo, judicial ou em cartório: ITCMD, partilha, herdeiro ou bens no exterior e regularização de imóveis do espólio.',
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
        a: 'Quando os herdeiros estão de acordo e assistidos por advogado. Desde a Resolução CNJ nº 571/2024, a via em cartório também é admitida com herdeiro menor ou incapaz (partilha em partes ideais e manifestação favorável do Ministério Público) e com testamento já processado judicialmente, se o juiz autorizar. Sem acordo, o inventário é judicial.',
      },
      {
        q: 'Qual é o ITCMD no inventário em São Paulo?',
        a: 'Em São Paulo, a alíquota é de 4% sobre o valor dos bens transmitidos (Lei estadual 10.705/2000, art. 16), com isenções previstas no art. 6º. A Lei Complementar 227/2026 obriga os estados a adotar alíquotas progressivas, mas isso depende de lei estadual: até novembro de 2026, São Paulo não aprovou a sua, e uma lei aprovada em 2026 só valeria a partir de 2027. No inventário, vale a lei em vigor na data do óbito.',
      },
      {
        q: 'O que fazer logo após o falecimento?',
        a: 'Reunir a certidão de óbito, a certidão de casamento ou de união estável, os documentos dos herdeiros e a lista de bens com documentos (matrículas, extratos, CRLV). Verificar se há testamento (certidão da CENSEC). Observar o prazo: em São Paulo, se o inventário não for aberto em 60 dias do óbito, há multa de 10% do ITCMD, e de 20% após 180 dias.',
      },
    ],
    related: [
      { label: 'Inventário em cartório', href: `${BASE}/inventario-e-patrimonio/inventario-extrajudicial/` },
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
    seoTitle: 'Direito Internacional de Família e Decisões Estrangeiras',
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
      'Averbação de divórcio estrangeiro em cartório',
      'Homologação de sentença dos Estados Unidos',
      'Homologação de sentença de Portugal',
      'Homologação de sentença da Itália',
      'Homologação de adoção internacional',
      'Execução de sentença estrangeira',
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
        a: 'Nem sempre. Se o divórcio foi consensual e a decisão estrangeira não dispõe sobre guarda, alimentos ou partilha de bens, ele pode ser averbado diretamente em cartório, sem homologação. Se dispõe sobre algum desses pontos, ou se não houve consenso, a homologação pelo STJ é necessária.',
      },
    ],
    related: [
      { label: 'Homologação de Sentença Estrangeira', href: `${BASE}/homologacao-de-sentenca-estrangeira/` },
      { label: 'Homologação de Divórcio Estrangeiro', href: `${BASE}/homologacao-de-divorcio-estrangeiro/` },
      { label: 'Averbação de Divórcio Estrangeiro em Cartório', href: `${BASE}/averbacao-de-divorcio-estrangeiro/` },
      { label: 'Homologação de Sentença dos Estados Unidos', href: `${BASE}/homologacao-de-sentenca-dos-estados-unidos/` },
      { label: 'Homologação de Sentença de Portugal', href: `${BASE}/homologacao-de-sentenca-de-portugal/` },
      { label: 'Homologação de Sentença da Itália', href: `${BASE}/homologacao-de-sentenca-da-italia/` },
      { label: 'Homologação de Adoção Estrangeira', href: `${BASE}/homologacao-de-adocao-internacional/` },
      { label: 'Casamento Realizado no Exterior: registro no Brasil', href: `${BASE}/homologacao-de-casamento-realizado-no-exterior/` },
      { label: 'Execução de Sentença Estrangeira', href: `${BASE}/execucao-de-sentenca-estrangeira/` },
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
    slug: 'direito-empresarial',
    href: `${BASE}/direito-empresarial/`,
    label: 'Direito Empresarial',
    icon: 'building',
    short:
      'Assessoria contratual, societária e contenciosa para empresas, com acompanhamento recorrente da operação.',
    problems: [
      'Preciso de assessoria jurídica recorrente para a empresa',
      'Tenho um conflito contratual ou societário',
    ],
    eyebrow: 'Direito empresarial',
    h1: 'Direito Empresarial',
    heroDescription:
      'Assessoria jurídica para empresas em suas relações contratuais, societárias e contenciosas — com foco na prevenção de riscos e na condução técnica de disputas.',
    seoTitle: 'Advocacia Empresarial e Assessoria Jurídica para Empresas',
    seoDescription:
      'Assessoria jurídica empresarial: contratos, relações societárias, consultoria preventiva, contencioso estratégico e suporte recorrente à operação da empresa.',
    situations: [
      'Contratos recorrentes sem padronização ou revisão jurídica',
      'Conflito com sócio, fornecedor, cliente ou parceiro comercial',
      'Operação que exige avaliação de risco antes de ser fechada',
      'Necessidade de acompanhamento jurídico contínuo, e não pontual',
    ],
    services: [
      'Contratos empresariais: elaboração, revisão e negociação',
      'Consultoria preventiva e avaliação de riscos da operação',
      'Relações societárias e conflitos entre sócios',
      'Contencioso empresarial estratégico',
      'Responsabilidade empresarial e discussões correlatas',
      'Assessoria jurídica recorrente para a operação',
    ],
    forWhom: [
      'Empresas de médio e grande porte',
      'Sócios e administradores',
      'Áreas jurídicas internas que precisam de apoio especializado',
    ],
    faq: [
      {
        q: 'O escritório atende empresas de forma recorrente ou apenas por demanda?',
        a: 'As duas formas. Há empresas que acionam o escritório por demanda específica e empresas que mantêm acompanhamento contínuo, com análise prévia de contratos e das decisões que geram risco jurídico.',
      },
      {
        q: 'O que diferencia a consultoria preventiva do contencioso?',
        a: 'A consultoria preventiva atua antes do conflito — na redação do contrato, na estruturação da operação e na avaliação do risco. O contencioso atua depois que a disputa existe. A prevenção costuma exigir menos tempo e despesa do que um litígio, mas isso depende de cada caso.',
      },
      {
        q: 'Como começa o atendimento a uma empresa?',
        a: 'Com a leitura dos documentos e o entendimento da operação. Antes de propor qualquer medida, o escritório precisa compreender o contrato, o histórico da relação e o resultado que a empresa busca.',
      },
    ],
    related: [
      { label: 'Contratos Empresariais', href: `${BASE}/contratos-empresariais/` },
      { label: 'Contencioso Empresarial Estratégico', href: `${BASE}/contencioso-empresarial-estrategico/` },
      { label: 'Recuperação de Crédito', href: `${BASE}/recuperacao-de-credito/` },
    ],
  },
  {
    slug: 'trabalhista-empresarial',
    href: `${BASE}/trabalhista-empresarial/`,
    label: 'Trabalhista Empresarial',
    icon: 'shield',
    short:
      'Defesa e consultoria preventiva para o empregador: passivo, auditoria, políticas internas e contencioso.',
    problems: [
      'A empresa recebeu uma reclamação trabalhista',
      'Preciso reduzir o passivo trabalhista da operação',
    ],
    eyebrow: 'Trabalhista empresarial',
    h1: 'Trabalhista Empresarial',
    heroDescription:
      'Atuação do lado do empregador: defesa em reclamações trabalhistas, consultoria preventiva, revisão de contratos e políticas internas e redução de passivo.',
    seoTitle: 'Advocacia Trabalhista Empresarial | Defesa do Empregador',
    seoDescription:
      'Consultoria trabalhista preventiva e defesa de empresas: reclamações trabalhistas, auditoria, passivo, políticas internas, contratos de trabalho e apoio ao RH.',
    situations: [
      'Reclamação trabalhista ajuizada contra a empresa',
      'Passivo trabalhista acumulado que precisa ser dimensionado',
      'Dúvida sobre enquadramento, jornada ou forma de contratação',
      'Necessidade de revisar políticas internas e documentos do RH',
    ],
    services: [
      'Defesa da empresa em reclamações trabalhistas',
      'Consultoria trabalhista preventiva e apoio ao RH',
      'Auditoria e dimensionamento de passivo trabalhista',
      'Contratos de trabalho, jornada e enquadramento',
      'Políticas internas e documentação de compliance trabalhista',
      'Negociações, acordos e contencioso estratégico',
    ],
    forWhom: [
      'Empresas empregadoras',
      'Departamentos de RH e gestores de pessoas',
      'Sócios e administradores responsáveis pela operação',
    ],
    faq: [
      {
        q: 'O escritório atende o empregador ou o empregado?',
        a: 'Esta área é dedicada ao empregador — defesa da empresa, consultoria preventiva e redução de passivo. Antes de aceitar qualquer caso, o escritório verifica conflito de interesses: nunca atua para as duas partes de um mesmo conflito.',
      },
      {
        q: 'Vale a pena fazer auditoria trabalhista sem ter processo?',
        a: 'Em geral sim. A auditoria mede o risco antes de ele virar reclamação e permite corrigir práticas enquanto a correção ainda é barata. Depois da ação ajuizada, o espaço de manobra é menor.',
      },
      {
        q: 'O que a empresa deve reunir ao receber uma reclamação trabalhista?',
        a: 'Contrato de trabalho, registros de jornada, holerites, comprovantes de pagamento, documentos de admissão e desligamento e as comunicações com o empregado. Quanto mais completa a documentação, mais sólida é a defesa.',
      },
    ],
    related: [
      { label: 'Direito Empresarial', href: `${BASE}/direito-empresarial/` },
      { label: 'Contencioso Empresarial Estratégico', href: `${BASE}/contencioso-empresarial-estrategico/` },
    ],
  },
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
      'Cobrança extrajudicial e judicial, execução de títulos e localização de patrimônio, conforme as medidas cabíveis em cada caso.',
    seoTitle: 'Advogado de Cobrança e Execução de Dívidas em SP',
    seoDescription:
      'Cobrança judicial e extrajudicial de créditos empresariais: execução de título, monitória, busca de bens e habilitação em recuperação judicial.',
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
    icon: 'home',
    short:
      'Recuperação de cotas e despesas condominiais em atraso, com acordos e assessoria recorrente a condomínios.',
    problems: ['O condomínio possui inadimplentes'],
    eyebrow: 'Cobrança condominial',
    h1: 'Cobrança Condominial',
    heroDescription:
      'Recuperação de cotas e despesas condominiais em atraso, formalização de acordos e assessoria recorrente a condomínios, síndicos e administradoras.',
    seoTitle: 'Advogado de Cobrança Condominial em São Paulo',
    seoDescription:
      'Cobrança de cotas condominiais em atraso: notificação, acordo e execução da cota condominial. Orientação para síndicos e administradoras.',
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
        a: 'Sim. A negociação e a formalização de acordo podem ser uma alternativa à via judicial, quando o devedor se dispõe a pagar e o acordo é bem documentado.',
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
];

export function getNucleo(slug: string): Nucleo | undefined {
  return nucleos.find((n) => n.slug === slug);
}
