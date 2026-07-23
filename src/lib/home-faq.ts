/** FAQ da Home — fonte única (exibição + JSON-LD FAQPage). */
export interface Faq { q: string; a: string; }
export const homeFaq: Faq[] = [
  { q: 'Quando vale a pena iniciar uma cobrança judicial?', a: 'Em regra, quando a via extrajudicial se esgota ou quando há título executivo e indícios de patrimônio. A decisão considera o valor, a documentação e a chance real de localizar bens do devedor.' },
  { q: 'O condomínio pode executar diretamente a dívida?', a: 'As cotas condominiais têm natureza que, em regra, permite cobrança por rito mais célere. A via adequada depende da documentação (convenção, atas e demonstrativos) e da situação de cada condômino.' },
  { q: 'Uma construção em APP pode ser regularizada?', a: 'Em algumas hipóteses sim, conforme a legislação aplicável, a data da ocupação e as características da área. Cada caso exige análise documental e técnica para verificar a viabilidade.' },
  { q: 'O que fazer ao receber um auto de infração ambiental?', a: 'Observar o prazo de defesa e reunir a documentação do imóvel e da atividade. A defesa administrativa pode discutir a autuação, a multa e medidas como embargo ou demolição.' },
  { q: 'O que fazer quando a mercadoria é retida pela Receita Federal?', a: 'Identificar o motivo da retenção e responder às exigências no prazo. A atuação tempestiva reduz custos de armazenagem e o risco de pena de perdimento.' },
  { q: 'Uma sentença estrangeira vale automaticamente no Brasil?', a: 'Não. Em regra, a decisão estrangeira precisa ser homologada pelo Superior Tribunal de Justiça para produzir efeitos no Brasil, sobretudo quando há execução, registro ou efeitos patrimoniais.' },
  { q: 'Inventário pode ser feito com herdeiro no exterior?', a: 'Sim. É possível conduzir o inventário com herdeiros residentes fora do Brasil, observadas as formalidades de representação e a coordenação entre jurisdições quando houver bens no exterior.' },
];
