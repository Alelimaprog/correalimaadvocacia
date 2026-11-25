/**
 * Conteúdo complementar das subpáginas (Rodada 4, 13/11/2026): tabela de visão
 * rápida e passo a passo, exibidos logo depois de "Entenda o problema".
 * Só aparece nas subpáginas que têm dados aqui.
 */
export interface SubExtras {
  table?: { title: string; cols: string[]; rows: string[][] };
  steps?: { title: string; items: { t: string; d: string }[]; note?: string };
}

export const subtopicExtras: Record<string, SubExtras> = {
  'direito-aduaneiro-tributario/retencao-de-mercadorias': {
    table: {
      title: 'Canais de conferência: o que acontece em cada um',
      cols: ['Canal', 'O que acontece', 'Prazo de referência', 'Medida típica'],
      rows: [
        ['Verde', 'Desembaraço automático, sem exame documental nem físico', 'Não se aplica', 'Nenhuma; acompanhar a entrega da carga'],
        ['Amarelo', 'Exame documental', 'Sem prazo geral fixado na norma', 'Responder à exigência'],
        ['Vermelho', 'Exame documental e verificação física da mercadoria', 'Sem prazo geral; depende de laudo e das exigências feitas', 'Responder ou contestar a exigência; entrega mediante garantia, quando cabível'],
        ['Cinza', 'Procedimento especial de controle aduaneiro (IN RFB 1.986/2020)', 'Até 60 dias, prorrogáveis por mais 60', 'Prova da origem dos recursos, garantia ou mandado de segurança'],
      ],
    },
    steps: {
      title: 'Prazos que não podem ser perdidos',
      items: [
        { t: 'Abandono da carga', d: 'Caracteriza-se após 90 dias da descarga sem início do despacho, ou após 60 dias de despacho interrompido por omissão do importador (Decreto-Lei 1.455/1976, art. 23, II).' },
        { t: 'Impugnação do perdimento', d: '20 dias a contar da ciência do auto de infração com proposta de perdimento (Lei 14.651/2023).' },
        { t: 'Mandado de segurança', d: '120 dias a contar da ciência do ato que reteve a mercadoria (Lei 12.016/2009, art. 23).' },
        { t: 'Auto de infração de tributo ou multa', d: 'Impugnação em 20 dias úteis da ciência (Decreto 70.235/1972, com a redação da LC 227/2026).' },
      ],
    },
  },
  'inventario-e-patrimonio/inventario-extrajudicial': {
    steps: {
      title: 'Passo a passo do inventário em cartório',
      items: [
        { t: 'Certidões', d: 'Reunir as certidões do falecido, dos herdeiros e dos bens (imóveis, veículos, contas e participações societárias).' },
        { t: 'ITCMD', d: 'Declarar o ITCMD no sistema da Sefaz-SP e pagar o imposto antes da escritura.' },
        { t: 'Minuta de partilha', d: 'Elaborar a minuta da partilha e conferi-la com o tabelião escolhido.' },
        { t: 'Assinatura da escritura', d: 'Assinar a escritura presencialmente, por procuração ou por videoconferência pelo e-Notariado.' },
        { t: 'Registro', d: 'Levar a escritura ao Cartório de Imóveis, ao Detran, aos bancos e à Junta Comercial para transferir os bens.' },
      ],
      note: 'O prazo varia conforme os documentos; não há prazo garantido.',
    },
  },
};
