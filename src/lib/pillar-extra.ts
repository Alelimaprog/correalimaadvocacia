/**
 * pillar-extra.ts — campos adicionais das páginas-pilar (Sprint 2):
 * "explicação do problema" e "riscos". Mantido separado de nucleos.ts para não
 * inflar a fonte dos núcleos. Conteúdo informativo geral, sem promessa de
 * resultado nem jurisprudência inventada.
 */
export interface PillarExtra {
  problem: string;
  risks: string[];
  /** Rodada 4 (13/11/2026): tabela "Visão rápida" e bloco "Atuação local". */
  table?: { title: string; cols: string[]; rows: string[][] };
  local?: { title: string; text: string; links?: { label: string; href: string }[] };
}

export const pillarExtra: Record<string, PillarExtra> = {
  'direito-maritimo-portuario': {
    problem:
      'Na importação, boa parte do custo que foge do previsto não vem dos tributos, e sim da logística: diárias de contêiner que correm enquanto a carga espera, tarifas de terminal, avarias descobertas só na desova e cargas retidas por cobranças em discussão. Esses conflitos envolvem várias partes (armador, NVOCC, agente de carga, terminal, transportadora e seguradora), contratos em inglês com foro no exterior e prazos curtos para reclamar. A atuação começa pela leitura do contrato e dos registros de datas e segue para a negociação, a reclamação regulatória ou a ação judicial.',
    risks: [
      'Diárias de demurrage que continuam correndo enquanto a cobrança é discutida.',
      'Perda do direito de reclamar a avaria por falta de ressalva na entrega ou de aviso no prazo.',
      'Cláusulas de foro estrangeiro e limitação de responsabilidade no conhecimento de embarque.',
      'Carga ou documentos retidos, travando a nacionalização e gerando novos custos.',
    ],
    table: {
      title: 'Visão rápida dos conflitos mais comuns',
      cols: ['Problema', 'Com quem', 'Primeira providência'],
      rows: [
        ['Demurrage e detention', 'Armador ou NVOCC', 'Conferir free time, tabela, datas e câmbio contra o contrato'],
        ['Avaria, falta ou extravio', 'Transportador, terminal ou seguradora', 'Ressalva na entrega, vistoria e aviso por escrito'],
        ['Armazenagem e tarifas do terminal', 'Terminal ou recinto alfandegado', 'Tabela pública do terminal e regras da ANTAQ'],
        ['Transporte rodoviário', 'Transportadora ou embarcador', 'CT-e, contrato, piso mínimo e regras da ANTT'],
      ],
    },
  },
  'direito-empresarial': {
    problem:
      'A maior parte dos problemas jurídicos de uma empresa nasce de decisões tomadas antes de existir conflito: um contrato assinado sem revisão, uma cláusula de rescisão genérica, uma relação societária sem regra de saída, uma operação fechada sem avaliação de risco. Quando a disputa aparece, a discussão passa a ser sobre o que os documentos já dizem. A assessoria empresarial atua nos dois tempos — na redação e na negociação, enquanto há margem, e na condução técnica da disputa, quando ela se torna inevitável.',
    risks: [
      'Contratos padronizados sem revisão, que repetem a mesma falha em toda a carteira.',
      'Cláusulas de rescisão, garantia ou foro que só são lidas depois do conflito instalado.',
      'Relação societária sem regra de saída, apuração de haveres ou solução de impasse.',
      'Decisões de administradores tomadas sem avaliação prévia de responsabilidade pessoal.',
    ],
  },
  'trabalhista-empresarial': {
    problem:
      'O passivo trabalhista raramente aparece de uma vez: ele se acumula em práticas de jornada, enquadramento, pagamento de verbas e documentação de rotina que seguem iguais por anos. A primeira reclamação costuma ser apenas a parte visível. Atuar do lado do empregador significa medir esse passivo antes que ele se converta em ações, corrigir o que ainda dá para corrigir e conduzir tecnicamente as defesas das ações já ajuizadas.',
    risks: [
      'Prazo de contestação em curso desde a notificação, mais curto do que a empresa costuma supor.',
      'Documentação de jornada, admissão e desligamento incompleta na hora de produzir prova.',
      'Prática irregular repetida em toda a operação, multiplicando o risco por número de empregados.',
      'Acordos firmados sem quitação adequada, que não encerram a discussão.',
    ],
  },
  'recuperacao-de-credito': {
    problem:
      'Inadimplência não resolvida corrói o caixa e, com o tempo, reduz a chance de recuperar o valor. Quanto mais uma dívida envelhece, maior o risco de o devedor se desfazer de bens ou de o crédito prescrever. A recuperação de crédito reúne as medidas — extrajudiciais e judiciais — para transformar um valor em aberto em recebimento efetivo, escolhendo a via adequada a cada documento e a cada devedor.',
    risks: [
      'Prescrição do título ou da pretensão, que pode extinguir o direito de cobrar.',
      'Dissipação ou ocultação de patrimônio pelo devedor ao longo do tempo.',
      'Perda de garantias e enfraquecimento das provas da dívida.',
      'Custos de armazenagem e oportunidade enquanto o valor permanece em aberto.',
    ],
  },
  'cobranca-condominial': {
    problem:
      'A inadimplência condominial afeta diretamente o fluxo de caixa do condomínio e sobrecarrega os demais condôminos, que acabam custeando quem não paga. Como as despesas são contínuas, atrasos que não são tratados com método tendem a se acumular. A cobrança condominial organiza a recuperação dessas cotas, combinando acordos e execução conforme a situação de cada unidade.',
    risks: [
      'Comprometimento do caixa e de obras e serviços essenciais do condomínio.',
      'Acúmulo de débitos que se tornam mais difíceis de recuperar com o tempo.',
      'Rateio da inadimplência entre os condôminos adimplentes.',
      'Falhas de documentação (convenção, atas, rateios) que fragilizam a cobrança.',
    ],
  },
  'direito-ambiental': {
    problem:
      'Questões ambientais costumam chegar de forma abrupta — um auto de infração, um embargo, uma ordem de demolição ou a descoberta de que um imóvel está em área protegida. Os prazos de defesa são curtos e as decisões tomadas no início influenciam todo o desfecho. O acompanhamento técnico permite responder às exigências no prazo e avaliar a regularização quando ela é viável.',
    risks: [
      'Perda do prazo de defesa administrativa, com consolidação da multa ou do embargo.',
      'Ordem de demolição ou de reparação sem discussão prévia dos seus fundamentos.',
      'Responsabilização do atual proprietário por passivo anterior do imóvel.',
      'Multas diárias e restrições que aumentam enquanto a situação não é enfrentada.',
    ],
  },
  'direito-aduaneiro-tributario': {
    problem:
      'Na importação, uma retenção de mercadoria ou uma autuação paralisa a operação e gera custos que crescem a cada dia. Divergências de classificação fiscal, valoração ou documentação podem levar a multas e até à pena de perdimento. A atuação aduaneira-tributária busca responder às exigências no prazo, discutir a autuação e revisar a tributação incidente. No perdimento, o prazo de impugnação é de 20 dias (Lei 14.651/2023).',
    risks: [
      'Custos crescentes de armazenagem e demurrage enquanto a carga fica retida.',
      'Pena de perdimento, se a exigência ou o auto não forem respondidos no prazo.',
      'Pagamento de tributos a maior por classificação ou valoração equivocadas.',
      'Multas e sanções que afetam a habilitação e a continuidade das operações.',
    ],
    local: {
      title: 'Onde atuamos em São Paulo',
      text: 'Retenções e autuações nas alfândegas do Porto de Santos, do Aeroporto de Guarulhos, de Viracopos (Campinas) e de São Paulo, além dos portos secos do estado. O mandado de segurança é impetrado na Justiça Federal competente em relação à autoridade que reteve a carga, com recursos ao TRF da 3ª Região. Escritório na R. Verbo Divino, 2001, Chácara Santo Antônio, São Paulo/SP, com atendimento online para importadores de todo o país.',
    },
  },
  'direito-internacional': {
    problem:
      'Uma decisão tomada no exterior — uma sentença, um divórcio, uma decisão sobre bens ou alimentos — não produz efeitos automáticos no Brasil. Em regra, é preciso homologá-la ou reconhecê-la para que valha aqui, sobretudo quando há execução, registro público ou efeitos patrimoniais. O tema exige coordenação entre as regras brasileiras e as do país de origem.',
    risks: [
      'Decisão estrangeira sem eficácia no Brasil até a homologação ou o reconhecimento.',
      'Impossibilidade de registrar ou executar atos sem o procedimento adequado.',
      'Documentos estrangeiros sem tradução ou legalização/apostilamento exigidos.',
      'Conflitos entre jurisdições quando há bens ou herdeiros em mais de um país.',
    ],
    local: {
      title: 'Para quem mora fora do Brasil',
      text: 'Divórcio feito no exterior, herança com bens no Brasil, venda de imóvel por procuração e homologação de decisões estrangeiras podem ser conduzidos à distância, com procuração feita no consulado ou com apostila. A atuação é sempre sob o direito brasileiro.',
      links: [
        { label: 'Advogado para brasileiros no exterior', href: '/areas-de-atuacao/brasileiros-no-exterior/' },
        { label: 'Homologação de divórcio estrangeiro', href: '/areas-de-atuacao/homologacao-de-divorcio-estrangeiro/' },
      ],
    },
  },
  'inventario-e-patrimonio': {
    problem:
      'Após um falecimento, o patrimônio precisa ser inventariado e partilhado para que os bens possam ser regularizados e transferidos. A demora tende a elevar custos e a gerar conflitos entre herdeiros, além de expor o espólio a encargos. A condução técnica organiza o inventário — judicial ou extrajudicial — e a partilha, inclusive quando há elementos no exterior.',
    risks: [
      'Multas e acréscimos sobre o imposto de transmissão pela demora na abertura.',
      'Bens que permanecem irregulares e não podem ser vendidos ou transferidos.',
      'Conflitos entre herdeiros que dificultam acordos e encarecem o processo.',
      'Complexidade adicional quando há herdeiros ou patrimônio em outro país.',
    ],
    table: {
      title: 'Quanto custa um inventário em São Paulo: os itens',
      cols: ['Custo', 'Regra em SP', 'Quem cobra'],
      rows: [
        ['ITCMD', '4% sobre os bens transmitidos (Lei 10.705/2000)', 'Sefaz-SP'],
        ['Multa por atraso', '10% do imposto se o inventário não for aberto em 60 dias do óbito; 20% após 180 dias', 'Sefaz-SP'],
        ['Escritura (inventário em cartório)', 'Tabela oficial anual de emolumentos, por faixa de valor', 'Tabelionato de Notas'],
        ['Registro da partilha', 'Tabela do Registro de Imóveis', 'Cartório de Imóveis'],
        ['Certidões', 'Valor por documento', 'Cartórios e órgãos emissores'],
        ['Honorários', 'Definidos em contrato após análise do caso', 'Advogado'],
      ],
    },
    local: {
      title: 'Inventário em São Paulo',
      text: 'O inventário judicial corre na Vara da Família e Sucessões do foro do último domicílio do falecido (Foro Central ou foros regionais). O extrajudicial pode ser feito em qualquer tabelionato de notas, e a escritura pode ser assinada por videoconferência pelo e-Notariado, o que ajuda herdeiros no exterior. Veja também quanto custa um inventário e o checklist de documentos.',
      links: [
        { label: 'Quanto custa um inventário', href: '/blog/quanto-custa-um-inventario/' },
        { label: 'Checklist de documentos do inventário', href: '/ferramentas/checklist-documentos-inventario/' },
        { label: 'Herdeiro que mora no exterior', href: '/areas-de-atuacao/brasileiros-no-exterior/' },
      ],
    },
  },
};
