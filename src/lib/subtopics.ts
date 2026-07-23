/**
 * subtopics.ts — Subpáginas de alta intenção sob cada núcleo (Sprint 2).
 * Fonte única, renderizada por SubPage.astro na rota
 * /areas-de-atuacao/<nucleo>/<slug>/. Conteúdo informativo geral e específico
 * por tema (sem duplicar as áreas legadas), sem promessa de resultado nem
 * jurisprudência inventada. Estrutura pensada para expansão contínua.
 */
export interface Faq { q: string; a: string; }
export interface SubTopic {
  nucleo: string;
  slug: string;
  label: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  heroDescription: string;
  problem: string;
  situations: string[];
  atuacao: string[];
  risks: string[];
  faq: Faq[];
}

export const subtopics: SubTopic[] = [
  // ───────────────────────── Recuperação de Crédito ─────────────────────────
  {
    nucleo: 'recuperacao-de-credito',
    slug: 'execucao-de-titulo-extrajudicial',
    label: 'Execução de título extrajudicial',
    h1: 'Execução de Título Extrajudicial',
    seoTitle: 'Execução de Título Extrajudicial',
    seoDescription: 'Quando cabe a execução de título extrajudicial (cheque, duplicata, nota promissória, contrato) e como funciona a cobrança forçada da dívida.',
    heroDescription: 'Quando a dívida está documentada em um título executivo, a execução é a via mais direta para exigir o pagamento e alcançar o patrimônio do devedor.',
    problem: 'Títulos como cheque, duplicata, nota promissória e certos contratos permitem executar a dívida sem antes discutir sua existência. Ainda assim, é preciso observar requisitos de liquidez, certeza e exigibilidade e agir antes que o prazo se esgote.',
    situations: [
      'Cheque devolvido ou prescrito que se pretende cobrar',
      'Duplicata não paga com aceite ou comprovação de entrega',
      'Nota promissória vencida',
      'Contrato assinado por duas testemunhas com valor determinado',
    ],
    atuacao: [
      'Análise do título e verificação dos requisitos de exigibilidade',
      'Ajuizamento da execução e citação do devedor para pagar',
      'Pedido de penhora de bens, valores e veículos',
      'Acompanhamento até a satisfação do crédito ou eventual acordo',
    ],
    risks: [
      'Prescrição do título, que pode exigir mudança da via de cobrança',
      'Devedor sem bens penhoráveis localizados de imediato',
      'Falhas formais no título que geram impugnação',
    ],
    faq: [
      { q: 'Quais documentos são considerados título executivo extrajudicial?', a: 'Entre os mais comuns estão cheque, nota promissória, duplicata, letra de câmbio e contratos assinados pelo devedor e por duas testemunhas, além de outros previstos em lei. Cada um tem requisitos próprios de forma e prazo.' },
      { q: 'O que acontece se o devedor não pagar na execução?', a: 'Não havendo pagamento nem garantia, o processo segue para atos de constrição, como penhora de valores, veículos e bens, até a satisfação do crédito.' },
    ],
  },
  {
    nucleo: 'recuperacao-de-credito',
    slug: 'cobranca-judicial',
    label: 'Cobrança judicial',
    h1: 'Cobrança Judicial de Dívidas',
    seoTitle: 'Cobrança Judicial de Dívidas',
    seoDescription: 'Ação de cobrança e ação monitória: quando a via judicial é indicada para recuperar dívidas sem título executivo e como o processo se desenvolve.',
    heroDescription: 'Sem um título executivo, a cobrança pode seguir pela ação de cobrança ou pela ação monitória, conforme a documentação que comprova a dívida.',
    problem: 'Nem toda dívida está representada por um título pronto para execução. Havendo prova escrita sem eficácia de título, a ação monitória é uma via mais célere; sem prova documental suficiente, recorre-se à ação de cobrança, na qual a existência da dívida é demonstrada ao longo do processo.',
    situations: [
      'Dívida comprovada por e-mails, contratos informais ou documentos sem força de título',
      'Prestação de serviço não paga sem instrumento executivo',
      'Confissão de dívida que se deseja transformar em cobrança',
      'Título prescrito que ainda pode ser cobrado por outra via',
    ],
    atuacao: [
      'Avaliação da prova disponível para escolher a ação adequada',
      'Ajuizamento da ação monitória ou de cobrança',
      'Condução da instrução e resposta a eventuais defesas',
      'Conversão em execução após o reconhecimento da dívida',
    ],
    risks: [
      'Prazos prescricionais distintos conforme a natureza da dívida',
      'Prova frágil que dificulta o reconhecimento do crédito',
      'Custo e tempo maiores do que na execução direta',
    ],
    faq: [
      { q: 'Qual a diferença entre ação de cobrança e ação monitória?', a: 'A monitória pressupõe prova escrita da dívida sem eficácia de título e costuma ser mais rápida. A ação de cobrança é usada quando a prova é indireta e a existência da dívida precisa ser demonstrada no curso do processo.' },
      { q: 'Dívida sem contrato assinado pode ser cobrada?', a: 'Pode, desde que existam outros elementos que comprovem a relação e o valor devido, como mensagens, notas, comprovantes e testemunhas. A via e a chance de êxito dependem da prova reunida.' },
    ],
  },
  {
    nucleo: 'recuperacao-de-credito',
    slug: 'cobranca-extrajudicial',
    label: 'Cobrança extrajudicial',
    h1: 'Cobrança Extrajudicial',
    seoTitle: 'Cobrança Extrajudicial',
    seoDescription: 'Notificação, negociação e acordo para recuperar dívidas antes da via judicial, com formalização segura e preservação da relação comercial.',
    heroDescription: 'Antes de judicializar, a cobrança extrajudicial busca o pagamento por notificação e negociação, muitas vezes de forma mais rápida e econômica.',
    problem: 'Boa parte das dívidas pode ser resolvida sem processo, por meio de notificação formal e negociação. A cobrança extrajudicial bem conduzida preserva a relação comercial, documenta as tratativas e prepara o terreno para a via judicial, caso necessário.',
    situations: [
      'Cliente inadimplente com quem se deseja manter relação comercial',
      'Dívida recente, em que a negociação tende a ser mais eficaz',
      'Necessidade de formalizar acordo e parcelamento com segurança',
      'Preparação de provas antes de eventual ação judicial',
    ],
    atuacao: [
      'Notificação extrajudicial do devedor',
      'Negociação de pagamento à vista ou parcelado',
      'Formalização de acordo com garantias e cláusulas de segurança',
      'Encaminhamento à via judicial se a negociação não avançar',
    ],
    risks: [
      'Agravamento da inadimplência se a cobrança demora a começar',
      'Acordos mal formalizados que não garantem o cumprimento',
      'Prescrição correndo enquanto se negocia sem formalização',
    ],
    faq: [
      { q: 'A cobrança extrajudicial suspende o prazo de prescrição?', a: 'A notificação e as tratativas podem ter efeitos sobre o prazo em certas situações, mas isso depende do caso e da forma como são feitas. Por isso, é importante formalizar as etapas e não deixar o prazo se esgotar.' },
      { q: 'Vale a pena negociar antes de processar?', a: 'Em muitos casos sim, pois a via extrajudicial costuma ser mais rápida e barata e preserva a relação. A decisão considera o perfil do devedor, o valor e a documentação disponível.' },
    ],
  },
  {
    nucleo: 'recuperacao-de-credito',
    slug: 'pesquisa-de-patrimonio-e-penhora',
    label: 'Pesquisa de patrimônio e penhora',
    h1: 'Pesquisa de Patrimônio e Penhora',
    seoTitle: 'Pesquisa de Patrimônio e Penhora (SISBAJUD, RENAJUD)',
    seoDescription: 'Localização de bens do devedor e penhora por meio de SISBAJUD, RENAJUD e pesquisa patrimonial para tornar a execução efetiva.',
    heroDescription: 'De nada adianta um título se o devedor parece não ter bens. A pesquisa patrimonial e as ferramentas de constrição buscam localizar valores e bens penhoráveis.',
    problem: 'Muitas execuções travam na fase de localização de patrimônio. Sistemas como SISBAJUD (valores) e RENAJUD (veículos), somados à pesquisa patrimonial e à investigação de fraude à execução, aumentam a chance de encontrar bens e efetivar a cobrança.',
    situations: [
      'Devedor que alega não ter bens ou renda',
      'Suspeita de ocultação ou transferência de patrimônio',
      'Execução parada por falta de bens penhoráveis',
      'Necessidade de bloquear valores e veículos do devedor',
    ],
    atuacao: [
      'Pesquisa patrimonial e de vínculos do devedor',
      'Pedidos de bloqueio via SISBAJUD e restrição via RENAJUD',
      'Identificação e discussão de fraude à execução',
      'Penhora e avaliação dos bens localizados',
    ],
    risks: [
      'Dissipação de bens quando a execução demora a avançar',
      'Impenhorabilidade de determinados valores e bens',
      'Necessidade de reforço de provas para reconhecer fraude',
    ],
    faq: [
      { q: 'O que é SISBAJUD?', a: 'É o sistema que permite ao juízo determinar o bloqueio de valores em contas do devedor junto a instituições financeiras, agilizando a constrição na execução.' },
      { q: 'É possível penhorar veículo do devedor?', a: 'Sim. Por meio do RENAJUD, é possível inserir restrição sobre veículos registrados em nome do devedor, viabilizando a penhora conforme o caso.' },
    ],
  },
  {
    nucleo: 'recuperacao-de-credito',
    slug: 'protesto-e-negativacao',
    label: 'Protesto e negativação',
    h1: 'Protesto e Negativação do Devedor',
    seoTitle: 'Protesto de Título e Negativação',
    seoDescription: 'Uso do protesto e da negativação como medidas de cobrança, seus limites legais e como combiná-los com a estratégia de recuperação.',
    heroDescription: 'Protesto e negativação são medidas legítimas de pressão para o pagamento, desde que usadas nos limites da lei e com base em dívida efetivamente existente.',
    problem: 'O protesto e a inscrição em cadastros de inadimplentes podem estimular o pagamento sem necessidade imediata de processo. Usados de forma indevida, porém, geram risco de responsabilização, o que exige critério e documentação da dívida.',
    situations: [
      'Título vencido e não pago passível de protesto',
      'Devedor sensível à restrição de crédito',
      'Necessidade de reforçar a cobrança antes da via judicial',
      'Dúvida sobre a regularidade de uma negativação',
    ],
    atuacao: [
      'Análise da regularidade da dívida e do cabimento do protesto',
      'Encaminhamento do protesto e da negativação quando pertinentes',
      'Orientação sobre limites e riscos de cobrança indevida',
      'Combinação dessas medidas com a estratégia de recuperação',
    ],
    risks: [
      'Responsabilização por protesto ou negativação indevidos',
      'Cancelamento e custos em caso de dívida quitada ou inexistente',
      'Uso isolado que nem sempre resulta em pagamento',
    ],
    faq: [
      { q: 'Posso negativar um cliente que não pagou?', a: 'A negativação é possível quando a dívida é certa e exigível e são observadas as regras aplicáveis, inclusive a comunicação prévia. Registro indevido pode gerar responsabilização.' },
      { q: 'O protesto substitui a execução?', a: 'Não. O protesto é uma medida de cobrança e de constituição em mora; a execução continua sendo a via para exigir o pagamento de forma forçada quando o devedor não paga.' },
    ],
  },

  // ───────────────────────── Cobrança Condominial ─────────────────────────
  {
    nucleo: 'cobranca-condominial',
    slug: 'cobranca-de-cotas-condominiais',
    label: 'Cobrança de cotas condominiais',
    h1: 'Cobrança de Cotas Condominiais',
    seoTitle: 'Cobrança de Cotas Condominiais',
    seoDescription: 'Como cobrar cotas e despesas condominiais em atraso, da notificação ao ajuizamento, preservando o caixa do condomínio.',
    heroDescription: 'A cota condominial é essencial para a manutenção do condomínio. Sua cobrança organizada evita que o atraso de poucos comprometa o conjunto.',
    problem: 'Despesas condominiais são contínuas e não podem esperar. Quando um condômino atrasa, a cobrança precisa começar cedo e de forma documentada, com base na convenção, nas atas e nos rateios aprovados.',
    situations: [
      'Condômino com cotas em atraso',
      'Débitos que se acumulam mês a mês',
      'Necessidade de organizar a cobrança de várias unidades',
      'Dúvida sobre encargos, multa e juros aplicáveis',
    ],
    atuacao: [
      'Organização da documentação (convenção, atas, rateios)',
      'Notificação e tentativa de acordo com o condômino',
      'Ajuizamento da cobrança das cotas em atraso',
      'Acompanhamento até a quitação ou a execução',
    ],
    risks: [
      'Comprometimento do caixa e de serviços do condomínio',
      'Acúmulo de débitos de difícil recuperação',
      'Documentação incompleta que fragiliza a cobrança',
    ],
    faq: [
      { q: 'Quais valores podem ser cobrados além da cota?', a: 'Além da cota em atraso, costumam incidir multa, juros e correção conforme a convenção e a lei, além de despesas do processo. Os percentuais devem observar os limites aplicáveis.' },
      { q: 'A partir de quando cobrar o condômino inadimplente?', a: 'Quanto antes a cobrança começa, maior a chance de recuperação. Uma rotina de cobrança preventiva e escalonada tende a reduzir a inadimplência.' },
    ],
  },
  {
    nucleo: 'cobranca-condominial',
    slug: 'execucao-de-cotas-condominiais',
    label: 'Execução de cotas condominiais',
    h1: 'Execução de Cotas Condominiais',
    seoTitle: 'Execução de Cotas Condominiais',
    seoDescription: 'A cobrança de despesas condominiais admite rito mais célere. Entenda a execução das cotas e a busca de patrimônio da unidade devedora.',
    heroDescription: 'As despesas condominiais têm tratamento que favorece uma cobrança mais rápida, permitindo constrição do patrimônio da unidade devedora.',
    problem: 'A legislação confere às despesas condominiais um regime que permite cobrança por via mais direta. Com documentação adequada, é possível avançar rapidamente para a fase de constrição, inclusive sobre a própria unidade.',
    situations: [
      'Inadimplência persistente após tentativas de acordo',
      'Débito consolidado com documentação completa',
      'Necessidade de penhora de valores ou da unidade',
      'Reincidência do mesmo condômino',
    ],
    atuacao: [
      'Instrução com convenção, atas e demonstrativos do débito',
      'Ajuizamento pela via de cobrança mais célere aplicável',
      'Pedidos de penhora de valores e, se necessário, da unidade',
      'Acompanhamento até a satisfação do crédito',
    ],
    risks: [
      'Aumento do débito enquanto a cobrança não avança',
      'Necessidade de documentação rigorosa para a execução',
      'Discussões sobre impenhorabilidade em situações específicas',
    ],
    faq: [
      { q: 'A unidade devedora pode ser penhorada?', a: 'Em cobrança de dívida condominial, a penhora da própria unidade é admitida em determinadas situações, ainda que se trate do único imóvel, conforme entendimento aplicável ao caso.' },
      { q: 'Precisa de acordo antes de executar?', a: 'Não é obrigatório, mas a tentativa de acordo costuma ser recomendável. Persistindo a inadimplência, a execução é a via para tornar a cobrança efetiva.' },
    ],
  },
  {
    nucleo: 'cobranca-condominial',
    slug: 'acordos-de-inadimplencia-condominial',
    label: 'Acordos de inadimplência',
    h1: 'Acordos de Inadimplência Condominial',
    seoTitle: 'Acordos de Inadimplência Condominial',
    seoDescription: 'Negociação e formalização de acordos com condôminos inadimplentes, com parcelamento seguro e cláusulas que garantem o cumprimento.',
    heroDescription: 'Um bom acordo recupera o valor mais rápido e preserva a convivência. A formalização adequada garante que o compromisso seja efetivamente cumprido.',
    problem: 'Nem sempre a execução é o melhor caminho imediato. Acordos bem estruturados — com parcelamento realista e garantias — costumam recuperar valores com menor custo e tempo, desde que formalizados com segurança.',
    situations: [
      'Condômino disposto a negociar o débito',
      'Necessidade de parcelar valores acumulados',
      'Acordo anterior descumprido que precisa ser retomado',
      'Interesse do condomínio em evitar a judicialização',
    ],
    atuacao: [
      'Levantamento do débito e das possibilidades de parcelamento',
      'Negociação com o condômino inadimplente',
      'Formalização do acordo com garantias e cláusula de vencimento antecipado',
      'Acompanhamento do cumprimento e retomada da cobrança em caso de descumprimento',
    ],
    risks: [
      'Acordos informais que não asseguram o pagamento',
      'Parcelamentos irrealistas que voltam à inadimplência',
      'Ausência de cláusula que permita retomar a cobrança do total',
    ],
    faq: [
      { q: 'O acordo precisa ser aprovado em assembleia?', a: 'Depende da convenção e da política do condomínio. Em muitos casos, a administração pode transigir dentro de parâmetros definidos; em outros, convém respaldo da assembleia.' },
      { q: 'O que acontece se o acordo for descumprido?', a: 'Um acordo bem redigido prevê o vencimento antecipado do saldo e permite retomar a cobrança, muitas vezes já pela via executiva, conforme sua natureza.' },
    ],
  },
  {
    nucleo: 'cobranca-condominial',
    slug: 'assessoria-a-sindicos-e-administradoras',
    label: 'Assessoria a síndicos e administradoras',
    h1: 'Assessoria Jurídica a Síndicos e Administradoras',
    seoTitle: 'Assessoria a Síndicos e Administradoras',
    seoDescription: 'Apoio jurídico recorrente a síndicos e administradoras na cobrança, na inadimplência e nas rotinas do condomínio.',
    heroDescription: 'Síndicos e administradoras lidam com cobrança e conflitos no dia a dia. A assessoria recorrente traz método, segurança e previsibilidade.',
    problem: 'A gestão condominial envolve decisões com efeitos jurídicos constantes, sobretudo na inadimplência. Um apoio jurídico recorrente estrutura rotinas de cobrança, reduz riscos e dá suporte às decisões da administração.',
    situations: [
      'Condomínio sem rotina estruturada de cobrança',
      'Síndico com dúvidas recorrentes sobre inadimplência',
      'Administradora que gere carteira de condomínios',
      'Necessidade de padronizar notificações e acordos',
    ],
    atuacao: [
      'Estruturação de rotina de cobrança preventiva e escalonada',
      'Padronização de notificações, acordos e documentos',
      'Orientação sobre decisões da administração e assembleias',
      'Condução da cobrança e da execução quando necessárias',
    ],
    risks: [
      'Perda de recebíveis por cobrança desorganizada',
      'Decisões da administração sem respaldo adequado',
      'Acúmulo de inadimplência por falta de método',
    ],
    faq: [
      { q: 'A assessoria substitui a administradora?', a: 'Não. A assessoria jurídica atua ao lado do síndico e da administradora, cuidando dos aspectos jurídicos da cobrança e das rotinas, sem substituir a gestão administrativa.' },
      { q: 'Vale a pena ter apoio jurídico recorrente?', a: 'Para condomínios com inadimplência relevante ou muitas unidades, a rotina recorrente costuma reduzir perdas e trazer previsibilidade à cobrança.' },
    ],
  },

  // ───────────────────────── Direito Ambiental ─────────────────────────
  {
    nucleo: 'direito-ambiental',
    slug: 'imovel-em-app',
    label: 'Imóvel em APP',
    h1: 'Imóvel em Área de Preservação Permanente (APP)',
    seoTitle: 'Imóvel em Área de Preservação Permanente (APP)',
    seoDescription: 'Construção ou ocupação em área de preservação permanente: quando há possibilidade de regularização e como conduzir a defesa.',
    heroDescription: 'Descobrir que um imóvel está em APP levanta dúvidas sobre construção, uso e regularização. Cada caso depende da área, da data e da legislação aplicável.',
    problem: 'Áreas de preservação permanente têm proteção específica, o que limita construções e intervenções. Ainda assim, há hipóteses de regularização e de uso consolidado, que precisam ser avaliadas tecnicamente antes de qualquer medida.',
    situations: [
      'Construção existente em faixa de APP',
      'Notificação para desfazer ou regularizar intervenção',
      'Compra de imóvel com restrição ambiental',
      'Dúvida sobre uso consolidado e possibilidade de regularização',
    ],
    atuacao: [
      'Análise da área, da legislação e da situação do imóvel',
      'Avaliação de hipóteses de regularização e de uso consolidado',
      'Defesa administrativa diante de autuações e ordens',
      'Orientação preventiva antes da compra ou da obra',
    ],
    risks: [
      'Ordem de demolição ou de recuperação da área',
      'Multas e embargos enquanto a situação não é enfrentada',
      'Responsabilização do proprietário atual por intervenção anterior',
    ],
    faq: [
      { q: 'Toda construção em APP é irregular?', a: 'Não necessariamente. Existem hipóteses legais de intervenção e de regularização, além de situações de uso consolidado. A avaliação depende da área, da data e da legislação incidente.' },
      { q: 'Comprei um imóvel em APP sem saber. E agora?', a: 'É importante levantar a situação ambiental do imóvel e as eventuais autuações. A responsabilidade ambiental pode alcançar o atual proprietário, o que torna a análise urgente.' },
    ],
  },
  {
    nucleo: 'direito-ambiental',
    slug: 'auto-de-infracao-e-multa-ambiental',
    label: 'Auto de infração e multa ambiental',
    h1: 'Auto de Infração e Multa Ambiental',
    seoTitle: 'Auto de Infração e Multa Ambiental',
    seoDescription: 'Recebeu auto de infração ou multa ambiental? Entenda os prazos de defesa e como discutir a autuação nas esferas administrativa e judicial.',
    heroDescription: 'O auto de infração inicia um processo com prazos curtos. A defesa tempestiva pode discutir a autuação, o valor da multa e as medidas impostas.',
    problem: 'Autuações ambientais costumam vir acompanhadas de multa e de outras medidas. A defesa administrativa, apresentada no prazo, é a oportunidade de questionar os fundamentos, a competência e a proporcionalidade da penalidade.',
    situations: [
      'Auto de infração lavrado por órgão ambiental',
      'Multa ambiental de valor elevado',
      'Divergência sobre os fatos ou a competência do órgão',
      'Necessidade de recurso na esfera administrativa',
    ],
    atuacao: [
      'Análise do auto, dos prazos e dos fundamentos',
      'Defesa administrativa e recursos cabíveis',
      'Discussão do valor e da proporcionalidade da multa',
      'Atuação judicial quando necessária',
    ],
    risks: [
      'Perda do prazo e consolidação da multa',
      'Inscrição em dívida ativa e cobrança do valor',
      'Cumulação com embargo ou outras medidas',
    ],
    faq: [
      { q: 'Qual o prazo para apresentar defesa?', a: 'O prazo varia conforme o órgão e a legislação aplicável, mas costuma ser curto e contado da ciência do auto. Perder o prazo dificulta a discussão posterior.' },
      { q: 'É possível reduzir o valor da multa?', a: 'Em certos casos, discute-se a base de cálculo, a dosimetria e a proporcionalidade, além de eventuais benefícios por adequação de conduta. O resultado depende dos fatos e da legislação.' },
    ],
  },
  {
    nucleo: 'direito-ambiental',
    slug: 'embargo-e-demolicao',
    label: 'Embargo e demolição',
    h1: 'Embargo Ambiental e Ordem de Demolição',
    seoTitle: 'Embargo Ambiental e Ordem de Demolição',
    seoDescription: 'Embargo de obra ou atividade e ordens de demolição: como reagir, discutir os fundamentos e buscar alternativas de regularização.',
    heroDescription: 'Embargos e ordens de demolição têm impacto imediato. A reação precisa avaliar os fundamentos da medida e as alternativas de regularização.',
    problem: 'O embargo paralisa a obra ou a atividade e a ordem de demolição ameaça o que foi construído. Antes de cumprir ou ignorar a medida, é essencial analisar sua base legal, o contraditório e as hipóteses de regularização.',
    situations: [
      'Obra ou atividade embargada por órgão ambiental',
      'Ordem de demolição de construção',
      'Necessidade de suspender medida enquanto se discute o mérito',
      'Dúvida sobre a regularização como alternativa à demolição',
    ],
    atuacao: [
      'Análise da legalidade e dos fundamentos do embargo ou da ordem',
      'Defesa administrativa e, se cabível, medidas judiciais',
      'Avaliação de regularização como alternativa à demolição',
      'Acompanhamento até a solução da medida',
    ],
    risks: [
      'Multas diárias pelo descumprimento do embargo',
      'Demolição e custos de recomposição da área',
      'Agravamento da situação se a medida não é enfrentada a tempo',
    ],
    faq: [
      { q: 'Posso continuar a obra embargada?', a: 'Descumprir o embargo tende a agravar a situação, com multas e outras sanções. O caminho é discutir a medida pelas vias adequadas, buscando sua suspensão quando cabível.' },
      { q: 'Toda ordem de demolição é cumprida?', a: 'Nem sempre. A depender dos fundamentos e das hipóteses de regularização, é possível discutir a medida e buscar alternativas, conforme o caso concreto.' },
    ],
  },
  {
    nucleo: 'direito-ambiental',
    slug: 'regularizacao-ambiental',
    label: 'Regularização ambiental',
    h1: 'Regularização Ambiental de Imóvel',
    seoTitle: 'Regularização Ambiental de Imóvel',
    seoDescription: 'Caminhos para regularizar imóveis e atividades sob o ponto de vista ambiental, incluindo TAC e adequação junto aos órgãos competentes.',
    heroDescription: 'Regularizar é, muitas vezes, o melhor caminho para dar segurança ao imóvel ou à atividade e encerrar pendências ambientais.',
    problem: 'A regularização ambiental transforma uma situação de risco em conformidade, seja pela adequação da atividade, pela recomposição de área ou por instrumentos como o Termo de Ajustamento de Conduta (TAC). O caminho depende do diagnóstico técnico e jurídico.',
    situations: [
      'Imóvel ou atividade com pendência ambiental',
      'Interesse em firmar TAC para regularizar conduta',
      'Necessidade de adequação junto ao órgão ambiental',
      'Regularização antes de venda ou financiamento do imóvel',
    ],
    atuacao: [
      'Diagnóstico da situação ambiental do imóvel ou da atividade',
      'Definição do caminho de regularização aplicável',
      'Negociação e formalização de TAC quando cabível',
      'Acompanhamento perante os órgãos competentes',
    ],
    risks: [
      'Persistência de autuações e multas sem a regularização',
      'Dificuldade de vender ou financiar o imóvel irregular',
      'Compromissos de TAC assumidos sem análise adequada',
    ],
    faq: [
      { q: 'O que é um TAC ambiental?', a: 'O Termo de Ajustamento de Conduta é um acordo pelo qual o responsável se compromete a adequar sua conduta e a reparar danos, em prazos e condições definidos, evitando ou encerrando litígios.' },
      { q: 'Regularizar encerra as multas já aplicadas?', a: 'Não automaticamente. A regularização trata da situação para frente; multas já lavradas seguem sua própria discussão, embora a adequação possa influenciar acordos.' },
    ],
  },
  {
    nucleo: 'direito-ambiental',
    slug: 'licenciamento-ambiental',
    label: 'Licenciamento ambiental',
    h1: 'Licenciamento Ambiental',
    seoTitle: 'Licenciamento Ambiental',
    seoDescription: 'Orientação sobre licenciamento ambiental de atividades e empreendimentos, exigências dos órgãos e regularização de licenças.',
    heroDescription: 'Atividades e empreendimentos com potencial de impacto exigem licenciamento. A condução adequada evita paralisações e autuações.',
    problem: 'O licenciamento ambiental é condição para muitas atividades e obras. Falhas ou ausência de licença geram autuações, embargos e insegurança jurídica; por isso, a regularidade das licenças precisa ser acompanhada de perto.',
    situations: [
      'Empreendimento que precisa obter ou renovar licença',
      'Exigências técnicas do órgão ambiental',
      'Atividade em funcionamento sem a licença adequada',
      'Divergências no processo de licenciamento',
    ],
    atuacao: [
      'Análise da exigência de licenciamento aplicável',
      'Acompanhamento do processo junto ao órgão competente',
      'Resposta a exigências e condicionantes',
      'Regularização de atividades sem licença',
    ],
    risks: [
      'Embargo e autuação por operar sem licença',
      'Atrasos e custos por exigências não atendidas',
      'Condicionantes assumidas sem avaliação adequada',
    ],
    faq: [
      { q: 'Toda atividade precisa de licença ambiental?', a: 'Não. O licenciamento incide sobre atividades e empreendimentos com potencial de impacto, conforme a legislação e o órgão competente. A verificação depende do tipo de atividade e da localização.' },
      { q: 'O que acontece ao operar sem licença?', a: 'A operação sem a devida licença pode gerar embargo, multa e outras sanções, além de insegurança jurídica. A regularização costuma ser o caminho para reduzir esses riscos.' },
    ],
  },

  // ───────────────────── Direito Aduaneiro-Tributário ─────────────────────
  {
    nucleo: 'direito-aduaneiro-tributario',
    slug: 'retencao-de-mercadorias',
    label: 'Retenção de mercadorias',
    h1: 'Retenção de Mercadorias na Importação',
    seoTitle: 'Retenção de Mercadorias na Importação',
    seoDescription: 'Mercadoria retida pela Receita Federal: motivos comuns, prazos e como responder às exigências para liberar a carga o quanto antes.',
    heroDescription: 'A retenção de mercadoria paralisa a operação e gera custos diários. Identificar o motivo e responder às exigências no prazo é o caminho para a liberação.',
    problem: 'A carga pode ser retida por questões documentais, de classificação, de valoração ou por suspeita de irregularidade. Cada motivo exige uma resposta específica, e a demora aumenta os custos de armazenagem e o risco de perdimento.',
    situations: [
      'Mercadoria parada no canal de conferência',
      'Exigência fiscal para liberação da carga',
      'Divergência de classificação ou de valor declarado',
      'Custos de armazenagem crescendo a cada dia',
    ],
    atuacao: [
      'Identificação do motivo da retenção',
      'Resposta às exigências e apresentação de documentos',
      'Discussão de classificação e valoração quando for o caso',
      'Medidas para liberação, inclusive mediante garantia',
    ],
    risks: [
      'Custos crescentes de armazenagem e demurrage',
      'Evolução para pena de perdimento em casos não resolvidos',
      'Perda de prazos que dificultam a liberação',
    ],
    faq: [
      { q: 'Por que minha mercadoria foi retida?', a: 'As causas mais comuns são divergências documentais, de classificação fiscal ou de valoração, além de suspeita de irregularidade. O primeiro passo é identificar o motivo para responder adequadamente.' },
      { q: 'É possível liberar a carga mediante garantia?', a: 'Em determinadas situações, discute-se a liberação com prestação de garantia enquanto o mérito é analisado, o que reduz os custos de permanência da carga.' },
    ],
  },
  {
    nucleo: 'direito-aduaneiro-tributario',
    slug: 'pena-de-perdimento',
    label: 'Pena de perdimento',
    h1: 'Pena de Perdimento de Mercadorias',
    seoTitle: 'Pena de Perdimento de Mercadorias',
    seoDescription: 'Defesa contra a pena de perdimento na importação: fundamentos, prazos e alternativas como a conversão em multa.',
    heroDescription: 'A pena de perdimento ameaça a própria mercadoria. A defesa tempestiva pode discutir seus fundamentos e buscar alternativas.',
    problem: 'O perdimento é uma das sanções mais severas na importação, pois pode resultar na perda da mercadoria. Sua aplicação exige fundamentos específicos, que podem ser discutidos na defesa, inclusive com pedido de conversão em multa em certas hipóteses.',
    situations: [
      'Auto de infração com proposta de perdimento',
      'Suspeita de subfaturamento ou interposição fraudulenta',
      'Divergências que motivaram a sanção',
      'Necessidade de defesa administrativa urgente',
    ],
    atuacao: [
      'Análise dos fundamentos do perdimento',
      'Defesa administrativa e recursos cabíveis',
      'Discussão de conversão em multa quando aplicável',
      'Medidas judiciais quando necessárias',
    ],
    risks: [
      'Perda definitiva da mercadoria em casos não enfrentados',
      'Prazos exíguos de defesa',
      'Repercussões sobre a habilitação e operações futuras',
    ],
    faq: [
      { q: 'É possível reverter a pena de perdimento?', a: 'Depende dos fundamentos e das provas. A defesa pode questionar a autuação e, em certas hipóteses, discutir a conversão do perdimento em multa. O resultado é próprio de cada caso.' },
      { q: 'Qual a diferença entre perdimento e multa?', a: 'O perdimento atinge a mercadoria, enquanto a multa é uma penalidade pecuniária. Em algumas situações, discute-se a substituição de uma pela outra.' },
    ],
  },
  {
    nucleo: 'direito-aduaneiro-tributario',
    slug: 'classificacao-fiscal-ncm',
    label: 'Classificação fiscal (NCM)',
    h1: 'Classificação Fiscal de Mercadorias (NCM)',
    seoTitle: 'Classificação Fiscal de Mercadorias (NCM)',
    seoDescription: 'Divergências de classificação fiscal (NCM) na importação: impactos tributários, autuações e como discutir o enquadramento correto.',
    heroDescription: 'A classificação fiscal (NCM) define tributos e exigências. Um enquadramento equivocado gera autuações e pagamento a maior ou a menor.',
    problem: 'A NCM determina alíquotas, tratamentos administrativos e exigências. Divergências entre o importador e a fiscalização levam a autuações e a recolhimentos indevidos, o que exige análise técnica para sustentar o enquadramento correto.',
    situations: [
      'Autuação por reclassificação de mercadoria',
      'Dúvida sobre o código NCM aplicável',
      'Pagamento de tributos a maior por classificação equivocada',
      'Necessidade de segurança na classificação de novos produtos',
    ],
    atuacao: [
      'Análise técnica do produto e do enquadramento na NCM',
      'Defesa em autuações por reclassificação',
      'Pedido de restituição de tributos pagos a maior',
      'Orientação preventiva na classificação de produtos',
    ],
    risks: [
      'Multas e diferenças de tributo por classificação incorreta',
      'Retenção de cargas por divergência de NCM',
      'Recolhimento a maior sem pedido de restituição',
    ],
    faq: [
      { q: 'Errei a NCM. Posso ser autuado?', a: 'A classificação incorreta pode gerar autuação e cobrança de diferenças, além de multa. A defesa avalia o enquadramento correto e a boa-fé do importador.' },
      { q: 'Dá para recuperar tributo pago a maior por NCM errada?', a: 'Sim, quando comprovado o pagamento indevido decorrente de classificação equivocada, é possível pleitear restituição ou compensação, conforme o caso.' },
    ],
  },
  {
    nucleo: 'direito-aduaneiro-tributario',
    slug: 'revisao-da-tributacao-na-importacao',
    label: 'Revisão da tributação na importação',
    h1: 'Revisão da Tributação na Importação',
    seoTitle: 'Revisão da Tributação na Importação',
    seoDescription: 'Revisão de II, IPI, PIS/COFINS-Importação e ICMS na importação para identificar recolhimentos indevidos e recuperar valores.',
    heroDescription: 'A importação concentra vários tributos. Uma revisão criteriosa identifica recolhimentos indevidos e oportunidades de recuperação.',
    problem: 'Sobre a importação incidem Imposto de Importação, IPI, PIS/COFINS-Importação e ICMS, com regras próprias de base de cálculo e de benefícios. Erros de cálculo ou o não aproveitamento de tratamentos aplicáveis levam a pagamentos a maior, passíveis de revisão.',
    situations: [
      'Suspeita de recolhimento a maior na importação',
      'Benefício ou regime não aproveitado',
      'Base de cálculo questionável em operações passadas',
      'Necessidade de revisar a carga tributária das importações',
    ],
    atuacao: [
      'Revisão dos tributos incidentes nas operações',
      'Identificação de recolhimentos indevidos',
      'Pedidos de restituição ou compensação',
      'Orientação para operações futuras',
    ],
    risks: [
      'Prescrição do direito de reaver valores pagos a maior',
      'Manutenção de carga tributária superior à devida',
      'Autuações por aproveitamento indevido, se sem análise',
    ],
    faq: [
      { q: 'Quais tributos incidem na importação?', a: 'De forma geral, incidem o Imposto de Importação, o IPI, o PIS/COFINS-Importação e o ICMS, cada um com regras próprias de base de cálculo, alíquota e benefícios.' },
      { q: 'Como recuperar tributos pagos indevidamente?', a: 'Após a revisão que aponte o pagamento indevido, pleiteia-se restituição ou compensação pelas vias adequadas, observados os prazos aplicáveis.' },
    ],
  },
  {
    nucleo: 'direito-aduaneiro-tributario',
    slug: 'defesa-administrativa-aduaneira',
    label: 'Defesa administrativa aduaneira',
    h1: 'Defesa Administrativa Aduaneira',
    seoTitle: 'Defesa Administrativa Aduaneira',
    seoDescription: 'Impugnações e recursos contra autos de infração e exigências da Receita Federal na esfera administrativa aduaneira.',
    heroDescription: 'A esfera administrativa é a primeira oportunidade de discutir autuações aduaneiras, muitas vezes com bom custo-benefício.',
    problem: 'Autos de infração e exigências da Receita Federal podem ser questionados administrativamente, antes de qualquer discussão judicial. Uma impugnação bem fundamentada, no prazo, pode afastar ou reduzir a autuação com menor custo.',
    situations: [
      'Auto de infração aduaneiro a impugnar',
      'Exigência fiscal em despacho de importação',
      'Necessidade de recurso na esfera administrativa',
      'Discussão de multas e penalidades',
    ],
    atuacao: [
      'Análise da autuação e dos prazos',
      'Impugnação e recursos administrativos',
      'Sustentação técnica e documental da defesa',
      'Encaminhamento à via judicial quando necessário',
    ],
    risks: [
      'Perda de prazo e definitividade da autuação',
      'Inscrição em dívida ativa do valor exigido',
      'Repercussão sobre a regularidade fiscal da empresa',
    ],
    faq: [
      { q: 'Vale a pena discutir na esfera administrativa?', a: 'Frequentemente sim, pois a via administrativa não tem custas judiciais e pode resolver a questão antes do Judiciário. A estratégia depende dos fundamentos da autuação.' },
      { q: 'Se perder na esfera administrativa, acabou?', a: 'Não. A discussão pode prosseguir no Judiciário, observados os requisitos e prazos, inclusive para suspender a exigência quando cabível.' },
    ],
  },

  // ───────────────────────── Direito Internacional ─────────────────────────
  {
    nucleo: 'direito-internacional',
    slug: 'carta-rogatoria',
    label: 'Carta rogatória',
    h1: 'Carta Rogatória',
    seoTitle: 'Carta Rogatória',
    seoDescription: 'O que é a carta rogatória, quando é utilizada para atos processuais entre países e como se dá o seu cumprimento no Brasil.',
    heroDescription: 'A carta rogatória é o instrumento de cooperação para a prática de atos processuais entre diferentes países.',
    problem: 'Quando um ato de um processo precisa ser cumprido em outro país — uma citação, uma intimação, a produção de uma prova — utiliza-se a carta rogatória. Seu cumprimento no Brasil segue rito próprio e passa pelo controle do Superior Tribunal de Justiça.',
    situations: [
      'Necessidade de citar ou intimar parte no exterior',
      'Produção de prova em outro país',
      'Cumprimento no Brasil de ato solicitado por autoridade estrangeira',
      'Dúvida sobre a via adequada de cooperação',
    ],
    atuacao: [
      'Orientação sobre a via de cooperação adequada',
      'Acompanhamento do trâmite da carta rogatória',
      'Atuação no procedimento de exequatur perante o STJ',
      'Coordenação com o ato principal do processo',
    ],
    risks: [
      'Nulidades por ato praticado sem a via correta',
      'Atrasos decorrentes do trâmite entre países',
      'Recusa de cumprimento por ausência de requisitos',
    ],
    faq: [
      { q: 'Carta rogatória é o mesmo que homologação de sentença?', a: 'Não. A carta rogatória cuida do cumprimento de atos processuais entre países; a homologação dá eficácia a uma decisão estrangeira. São procedimentos distintos, embora ambos envolvam cooperação internacional.' },
      { q: 'Quem autoriza o cumprimento no Brasil?', a: 'O cumprimento de carta rogatória estrangeira no Brasil passa pelo controle do Superior Tribunal de Justiça, por meio do exequatur, observados os requisitos legais.' },
    ],
  },
  {
    nucleo: 'direito-internacional',
    slug: 'alimentos-internacionais',
    label: 'Alimentos internacionais',
    h1: 'Alimentos Internacionais',
    seoTitle: 'Alimentos Internacionais',
    seoDescription: 'Cobrança e reconhecimento de pensão alimentícia quando credor ou devedor reside em outro país, com apoio da cooperação internacional.',
    heroDescription: 'Quando credor e devedor de alimentos vivem em países diferentes, a cobrança envolve cooperação internacional e, muitas vezes, o reconhecimento de decisões.',
    problem: 'Pensões alimentícias com elementos internacionais exigem coordenação entre jurisdições. Há mecanismos de cooperação para cobrança no exterior e situações em que a decisão estrangeira precisa ser reconhecida para produzir efeitos no Brasil.',
    situations: [
      'Devedor de alimentos residente no exterior',
      'Credor no Brasil buscando cobrar no exterior',
      'Decisão estrangeira de alimentos a ter efeitos no Brasil',
      'Necessidade de coordenar a cobrança entre países',
    ],
    atuacao: [
      'Análise da via de cooperação e reconhecimento aplicável',
      'Encaminhamento da cobrança internacional',
      'Atuação na homologação da decisão quando necessária',
      'Coordenação entre as jurisdições envolvidas',
    ],
    risks: [
      'Demora na cobrança por trâmites entre países',
      'Necessidade de reconhecer a decisão para executá-la aqui',
      'Documentação estrangeira sem tradução ou legalização',
    ],
    faq: [
      { q: 'Como cobrar pensão de quem mora fora do país?', a: 'Existem mecanismos de cooperação internacional que permitem encaminhar a cobrança ao país onde reside o devedor. A via adequada depende dos países envolvidos e da existência de decisão.' },
      { q: 'A decisão estrangeira de alimentos vale no Brasil?', a: 'Em regra, para produzir efeitos aqui, a decisão estrangeira precisa ser reconhecida/homologada, salvo hipóteses específicas de cooperação direta.' },
    ],
  },
  {
    nucleo: 'direito-internacional',
    slug: 'guarda-internacional',
    label: 'Guarda internacional',
    h1: 'Guarda Internacional',
    seoTitle: 'Guarda Internacional',
    seoDescription: 'Questões de guarda quando há elementos em mais de um país e o reconhecimento de decisões estrangeiras sobre a criança.',
    heroDescription: 'A guarda ganha complexidade quando envolve mais de um país, exigindo coordenação entre jurisdições e, por vezes, o reconhecimento de decisões.',
    problem: 'Decisões sobre guarda com elementos internacionais precisam considerar as regras de cada país e, quando tomadas no exterior, o seu reconhecimento no Brasil. O tema exige atenção especial ao interesse da criança e às vias de cooperação.',
    situations: [
      'Decisão estrangeira de guarda a ter efeitos no Brasil',
      'Genitores residentes em países diferentes',
      'Necessidade de reconhecer decisão para regularizar a situação',
      'Coordenação entre jurisdições sobre a criança',
    ],
    atuacao: [
      'Análise da decisão e da via de reconhecimento',
      'Atuação na homologação quando necessária',
      'Orientação sobre a coordenação entre países',
      'Encaminhamento das medidas cabíveis',
    ],
    risks: [
      'Insegurança sem o reconhecimento da decisão estrangeira',
      'Conflitos entre decisões de países diferentes',
      'Documentação estrangeira sem os requisitos formais',
    ],
    faq: [
      { q: 'Uma decisão de guarda do exterior vale no Brasil?', a: 'Para produzir efeitos aqui, a decisão estrangeira de guarda em regra precisa ser reconhecida/homologada, sempre observado o interesse da criança e a legislação aplicável.' },
      { q: 'Como proceder quando os pais moram em países diferentes?', a: 'É preciso avaliar as regras de cada país e as vias de cooperação, buscando a solução que assegure estabilidade e o interesse da criança.' },
    ],
  },
  {
    nucleo: 'direito-internacional',
    slug: 'documentos-estrangeiros',
    label: 'Documentos estrangeiros',
    h1: 'Validade de Documentos Estrangeiros no Brasil',
    seoTitle: 'Documentos Estrangeiros no Brasil',
    seoDescription: 'Tradução, legalização e apostilamento de documentos estrangeiros para que produzam efeitos no Brasil.',
    heroDescription: 'Documentos emitidos no exterior costumam exigir tradução e legalização ou apostilamento para valerem no Brasil.',
    problem: 'Certidões, procurações e decisões produzidas em outro país nem sempre são aceitas diretamente no Brasil. Em regra, precisam de tradução por profissional habilitado e de legalização consular ou de apostila, conforme o país de origem.',
    situations: [
      'Certidão estrangeira a ser registrada no Brasil',
      'Procuração emitida no exterior',
      'Documento que instrui processo ou registro no país',
      'Dúvida sobre apostilamento e legalização',
    ],
    atuacao: [
      'Orientação sobre tradução e legalização/apostilamento',
      'Verificação dos requisitos conforme o país de origem',
      'Encaminhamento para registro e uso do documento',
      'Coordenação com o ato ou processo principal',
    ],
    risks: [
      'Rejeição do documento por falta de tradução ou legalização',
      'Atrasos em processos e registros',
      'Uso de documento sem os requisitos formais',
    ],
    faq: [
      { q: 'O que é apostilamento?', a: 'A apostila é uma forma simplificada de legalização de documentos entre países signatários da convenção aplicável, dispensando a legalização consular tradicional.' },
      { q: 'Todo documento estrangeiro precisa de tradução?', a: 'Em regra, documentos em língua estrangeira devem ser traduzidos por profissional habilitado para produzir efeitos no Brasil, salvo exceções previstas.' },
    ],
  },

  // ───────────────────────── Inventário e Patrimônio ─────────────────────────
  {
    nucleo: 'inventario-e-patrimonio',
    slug: 'inventario-judicial',
    label: 'Inventário judicial',
    h1: 'Inventário Judicial',
    seoTitle: 'Inventário Judicial',
    seoDescription: 'Quando o inventário deve ser judicial, como funciona o processo e o papel do inventariante na administração do espólio.',
    heroDescription: 'O inventário judicial é o caminho quando há divergência entre herdeiros, testamento ou herdeiro incapaz.',
    problem: 'Nem todo inventário pode ser feito em cartório. Havendo conflito entre herdeiros, testamento com exigência de via judicial ou herdeiro menor ou incapaz, o inventário tramita perante o Judiciário, com nomeação de inventariante e supervisão do juízo.',
    situations: [
      'Divergência entre os herdeiros',
      'Existência de testamento',
      'Herdeiro menor de idade ou incapaz',
      'Necessidade de decisão judicial sobre a partilha',
    ],
    atuacao: [
      'Abertura do inventário e nomeação do inventariante',
      'Levantamento de bens, dívidas e herdeiros',
      'Condução do processo e das discussões da partilha',
      'Acompanhamento até a homologação e a expedição dos formais',
    ],
    risks: [
      'Multas e acréscimos no imposto pela demora na abertura',
      'Conflitos que prolongam o processo',
      'Bens que permanecem irregulares até o fim do inventário',
    ],
    faq: [
      { q: 'Quando o inventário precisa ser judicial?', a: 'Quando há conflito entre herdeiros, testamento que exija a via judicial ou herdeiro menor ou incapaz. Nessas hipóteses, o inventário não pode ser feito por escritura em cartório.' },
      { q: 'Qual o prazo para abrir o inventário?', a: 'Há prazo legal para a abertura, e o atraso pode gerar acréscimos no imposto de transmissão. Por isso, recomenda-se iniciar o quanto antes.' },
    ],
  },
  {
    nucleo: 'inventario-e-patrimonio',
    slug: 'inventario-extrajudicial',
    label: 'Inventário extrajudicial',
    h1: 'Inventário Extrajudicial (em Cartório)',
    seoTitle: 'Inventário Extrajudicial em Cartório',
    seoDescription: 'Requisitos do inventário extrajudicial por escritura pública: consenso, herdeiros capazes e ausência de testamento que exija a via judicial.',
    heroDescription: 'Havendo consenso e herdeiros capazes, o inventário pode ser feito por escritura pública, de forma mais rápida do que a via judicial.',
    problem: 'O inventário extrajudicial é uma alternativa mais célere, feita em cartório por escritura pública. Ele depende de consenso entre os herdeiros, de todos serem maiores e capazes e da inexistência de testamento que imponha a via judicial.',
    situations: [
      'Herdeiros maiores, capazes e em consenso',
      'Ausência de testamento que exija via judicial',
      'Interesse em concluir a partilha mais rapidamente',
      'Regularização de bens para transferência',
    ],
    atuacao: [
      'Verificação dos requisitos para a via extrajudicial',
      'Organização da documentação e do plano de partilha',
      'Elaboração e acompanhamento da escritura em cartório',
      'Orientação sobre o recolhimento do imposto de transmissão',
    ],
    risks: [
      'Impossibilidade da via extrajudicial se faltar consenso',
      'Acréscimos no imposto pela demora',
      'Documentação incompleta que atrasa a escritura',
    ],
    faq: [
      { q: 'Todo inventário pode ser feito em cartório?', a: 'Não. É preciso consenso entre herdeiros maiores e capazes e ausência de testamento que exija a via judicial. Faltando um desses requisitos, o inventário deve ser judicial.' },
      { q: 'O inventário em cartório é mais rápido?', a: 'Em regra sim, por dispensar o trâmite judicial. Ainda assim, depende da documentação e do consenso entre os herdeiros.' },
    ],
  },
  {
    nucleo: 'inventario-e-patrimonio',
    slug: 'planejamento-sucessorio',
    label: 'Planejamento sucessório',
    h1: 'Planejamento Sucessório',
    seoTitle: 'Planejamento Sucessório',
    seoDescription: 'Organização da sucessão em vida para reduzir conflitos e custos, com instrumentos como doação, testamento e estruturação patrimonial.',
    heroDescription: 'Planejar a sucessão em vida ajuda a reduzir conflitos, custos e a insegurança na transmissão do patrimônio.',
    problem: 'O planejamento sucessório organiza, ainda em vida, como o patrimônio será transmitido, buscando reduzir litígios e encargos. Ele utiliza instrumentos como doação com reserva, testamento e estruturação patrimonial, sempre respeitando os limites legais da legítima.',
    situations: [
      'Interesse em organizar a sucessão em vida',
      'Patrimônio familiar ou empresarial relevante',
      'Preocupação com conflitos entre herdeiros',
      'Necessidade de estruturar a transmissão de bens',
    ],
    atuacao: [
      'Diagnóstico do patrimônio e dos objetivos da família',
      'Definição dos instrumentos adequados (doação, testamento e outros)',
      'Estruturação respeitando os limites legais',
      'Acompanhamento da formalização',
    ],
    risks: [
      'Conflitos e custos maiores na ausência de planejamento',
      'Instrumentos mal estruturados que geram litígio',
      'Desrespeito à parte legítima dos herdeiros necessários',
    ],
    faq: [
      { q: 'Planejamento sucessório serve só para grandes fortunas?', a: 'Não. Ele é útil sempre que se deseja organizar a transmissão do patrimônio e reduzir conflitos e custos, independentemente do porte, respeitados os limites legais.' },
      { q: 'É possível deixar tudo para uma só pessoa?', a: 'Há limites. Existindo herdeiros necessários, parte do patrimônio (a legítima) é reservada a eles; o planejamento atua sobre a parcela disponível e na organização da transmissão.' },
    ],
  },
  {
    nucleo: 'inventario-e-patrimonio',
    slug: 'regularizacao-patrimonial',
    label: 'Regularização patrimonial',
    h1: 'Regularização Patrimonial de Bens',
    seoTitle: 'Regularização Patrimonial de Bens',
    seoDescription: 'Regularização de bens e da titularidade para viabilizar venda, financiamento e transmissão, inclusive após inventário.',
    heroDescription: 'Bens irregulares ou com titularidade pendente não podem ser vendidos ou transferidos com segurança. A regularização resolve essas pendências.',
    problem: 'Imóveis sem registro atualizado, partilhas não levadas a registro e bens em nome de falecidos travam vendas, financiamentos e transmissões. A regularização patrimonial organiza a documentação e a titularidade para dar segurança às operações.',
    situations: [
      'Imóvel com registro desatualizado ou em nome de falecido',
      'Partilha não levada a registro',
      'Bem que se pretende vender ou financiar',
      'Necessidade de organizar a titularidade do patrimônio',
    ],
    atuacao: [
      'Diagnóstico da situação registral e documental dos bens',
      'Providências para atualização de registros e titularidade',
      'Coordenação com inventário e partilha quando necessário',
      'Orientação para viabilizar venda ou financiamento',
    ],
    risks: [
      'Impossibilidade de vender ou financiar bem irregular',
      'Acúmulo de pendências que encarecem a regularização',
      'Insegurança jurídica na titularidade',
    ],
    faq: [
      { q: 'Posso vender um imóvel ainda em nome do falecido?', a: 'Em regra, é preciso concluir o inventário e a partilha e regularizar a titularidade antes da venda. A regularização é o passo que viabiliza a transferência segura.' },
      { q: 'A partilha precisa ser registrada?', a: 'Sim. Para produzir efeitos sobre os bens, especialmente imóveis, a partilha precisa ser levada a registro, atualizando a titularidade.' },
    ],
  },
];

export function getSubtopicsByNucleo(nucleo: string): SubTopic[] {
  return subtopics.filter((s) => s.nucleo === nucleo);
}
export function getSubtopic(nucleo: string, slug: string): SubTopic | undefined {
  return subtopics.find((s) => s.nucleo === nucleo && s.slug === slug);
}
