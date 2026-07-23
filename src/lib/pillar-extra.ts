/**
 * pillar-extra.ts — campos adicionais das páginas-pilar (Sprint 2):
 * "explicação do problema" e "riscos". Mantido separado de nucleos.ts para não
 * inflar a fonte dos núcleos. Conteúdo informativo geral, sem promessa de
 * resultado nem jurisprudência inventada.
 */
export interface PillarExtra {
  problem: string;
  risks: string[];
}

export const pillarExtra: Record<string, PillarExtra> = {
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
      'Na importação, uma retenção de mercadoria ou uma autuação paralisa a operação e gera custos que crescem a cada dia. Divergências de classificação fiscal, valoração ou documentação podem levar a multas e até à pena de perdimento. A atuação aduaneira-tributária busca responder às exigências no prazo, discutir a autuação e revisar a tributação incidente.',
    risks: [
      'Custos crescentes de armazenagem e demurrage enquanto a carga fica retida.',
      'Pena de perdimento, com perda da mercadoria, em casos não enfrentados a tempo.',
      'Pagamento de tributos a maior por classificação ou valoração equivocadas.',
      'Multas e sanções que afetam a habilitação e a continuidade das operações.',
    ],
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
  },
};
