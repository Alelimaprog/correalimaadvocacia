/**
 * FAQ da Home — fonte única (exibição + JSON-LD FAQPage).
 *
 * A ordem importa: é a mesma na tela e no rich result do Google. Antes a lista
 * abria por cobrança judicial e condomínio e só chegava a comércio exterior na
 * quinta pergunta — leitura coerente com o posicionamento anterior. Reordenada
 * para empresa primeiro, com duas perguntas novas (trabalhista do empregador e
 * revisão contratual) escritas a partir do acervo que já existe em
 * src/content/areas (trabalhista-empresarial, contratos-empresariais,
 * advocacia-empresarial). Nenhuma resposta promete resultado.
 */
export interface Faq { q: string; a: string; }
export const homeFaq: Faq[] = [
  { q: "O que fazer quando a mercadoria é retida pela Receita Federal?", a: "Ler a exigência ou o termo de retenção no Portal Único (DI ou DUIMP), anotar o prazo e o fundamento e responder no prazo. Conforme o caso, é possível pedir a liberação mediante garantia ou discutir a retenção por mandado de segurança. Enquanto isso, a armazenagem corre, por isso vale agir cedo." },
  { q: "Qual o prazo para se defender de uma pena de perdimento?", a: "20 dias contados da ciência do auto de infração (Decreto-Lei 1.455/1976, art. 27-A, incluído pela Lei 14.651/2023). Para autos de tributo e multa, o prazo é de 20 dias úteis (Decreto 70.235/1972, com a redação da Lei Complementar 227/2026)." },
  { q: "Meu inventário pode ser feito em cartório?", a: "Pode, quando os herdeiros estão de acordo e assistidos por advogado. Desde a Resolução CNJ 571/2024, o cartório também é possível, sob condições, com herdeiro menor ou com testamento já processado na Justiça. Sem acordo, o inventário é judicial." },
  { q: "Quanto é o ITCMD no inventário em São Paulo?", a: "A alíquota é de 4% sobre o valor dos bens transmitidos (Lei estadual 10.705/2000), com isenções previstas em lei. Se o inventário não for aberto em 60 dias do falecimento, há multa de 10% do imposto, e de 20% após 180 dias." },
  { q: "Inventário pode ser feito com herdeiro no exterior?", a: "Sim. O herdeiro participa por procuração pública feita no consulado brasileiro ou em notário local com apostila e tradução juramentada. O processo pode correr em cartório ou na Justiça, conforme o caso." },
  { q: "Divórcio feito no exterior precisa ser homologado no STJ?", a: "Nem sempre. O divórcio consensual simples (sem guarda, pensão ou partilha de bens) pode ser averbado direto no cartório de registro civil. Se a decisão trata desses pontos, ou se não houve consenso, a homologação no STJ é necessária." },
  { q: "Uma sentença estrangeira vale automaticamente no Brasil?", a: "Não. Em regra, a decisão estrangeira precisa ser homologada pelo Superior Tribunal de Justiça para produzir efeitos no Brasil, especialmente quando envolve cobrança, registro público ou bens." },
  { q: "O escritório também atende empresas em outras áreas?", a: "Sim: contratos, recuperação de crédito e execução, medidas do credor em recuperação judicial e falência, defesa trabalhista do empregador, cobrança condominial e direito ambiental." },
];
