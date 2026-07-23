# Backlog editorial — Corrêa Lima Advocacia

## ✅ Implementado nesta rodada (não mais pendente)
- **Guia de Direito Ambiental** — ampliado (397 → ~1.500 palavras reais), agora em
  MDX com Callout, Checklist e FAQ. `/guias/direito-ambiental-guia-completo/`
- **Artigo novo (P1):** "Recebi um auto de infração ambiental: o que fazer" —
  publicado. `/blog/recebi-auto-de-infracao-ambiental-o-que-fazer/`
- **Integração de componentes:** `ContextualCta` + `RelatedContent` passaram a ser
  renderizados automaticamente ao final de **todos** os artigos e guias (via
  frontmatter `cluster`/`relacionados`). `Callout` e `Checklist` em uso nas 2
  páginas MDX.
- **Malha interna:** pilar de Direito Ambiental agora aponta para o guia e o
  artigo (hub); guia ↔ artigo linkados entre si.
- **Safeguard editorial:** `npm run check:editorial` lista pendências de revisão
  e falha se alguma marca vazar para o HTML público.

## ⏳ Próximas prioridades (pendentes — ordem recomendada)
1. Ampliar guias rasos restantes: Inventário, Cobrança Condominial, Aduaneiro-Tributário.
2. Direito Ambiental: "Defesa em embargo ambiental" e "Diferença entre multa e embargo".
3. Aduaneiro: consolidar/ampliar "mercadoria retida" (avaliar sobreposição com o
   artigo de multa aduaneira existente antes de criar nova URL) + "pena de perdimento".
4. Condominial: "penhora de unidade por dívida de condomínio".
5. Inventário: "inventário extrajudicial: quando cabe e como funciona" + ampliar o
   artigo raso `/blog/inventario-e-partilha-quando-buscar-orientacao-juridica/`.

---


Roteiro de expansão de conteúdo priorizado por **impacto em contatos** e por
**lacuna de cobertura** (dados do inventário). Este backlog é o roteiro
(metadados/estrutura) — **o texto jurídico de cada página deve ser redigido e
revisado pelo advogado responsável**, nunca gerado sem verificação (ver nota de
precisão jurídica no fim).

## Diagnóstico que orienta as prioridades
- **Direito Ambiental** é a maior lacuna (apenas 2 conteúdos no cluster) → foco P1.
- **Cobrança Condominial** com cobertura baixa (8) → reforço P1/P2.
- Recuperação de Crédito (22), Internacional (18) e Aduaneiro (13) já têm boa base
  → priorizar satélites de **fundo de funil** (alta intenção) e consolidação.
- Nenhuma página existente precisa ser removida; 1 artigo raso pode ser ampliado.

## Prioridade 1 — Conversão / fundo de funil (fazer primeiro)
| Cluster | Página | Intenção | CTA |
|---|---|---|---|
| Ambiental | Recebi um auto de infração ambiental: o que fazer | fundo | Solicitar atendimento |
| Ambiental | Defesa em embargo ambiental: prazos e medidas | fundo | Falar sobre o meu caso |
| Aduaneiro | Mercadoria retida na alfândega: o que fazer | fundo | Solicitar atendimento |
| Condominial | Como cobrar cotas condominiais em atraso: passo a passo | meio-fundo | Solicitar atendimento |
| Recuperação | Como cobrar um cliente inadimplente (empresa) | meio-fundo | Falar sobre o meu caso |
| Recuperação | Execução de título extrajudicial: como funciona | meio | Solicitar atendimento |
| Inventário | Inventário extrajudicial: quando cabe e como funciona | meio | Falar sobre o meu caso |

## Prioridade 2 — Autoridade temática (sustentam os pilares)
- Ambiental: Como regularizar uma construção em APP.
- Aduaneiro: Defesa contra pena de perdimento.
- Condominial: É possível penhorar a unidade por dívida de condomínio?
- Recuperação: Quais documentos são necessários para executar uma dívida.
- Inventário: Documentos necessários para o inventário.
- Internacional: Quanto custa homologar uma sentença estrangeira (faixas/variáveis).

## Prioridade 3 — Cauda longa (atração orgânica)
- Prazo de prescrição para cobrar uma dívida.
- Prazo para impugnar auto de infração aduaneiro.
- Diferença entre multa e embargo ambiental.
- Diferença entre homologação e reconhecimento de decisão estrangeira.
- O síndico pode restringir o acesso do inadimplente às áreas comuns?

## Prioridade 4 — Expansão futura
- Pilar/subcluster **Planejamento Patrimonial** (só com conteúdo real).
- Pilar/subcluster **Patrimônio Empresarial / Holding**.
- Comparações e jurisprudência comentada (apenas precedentes verificáveis).

## Meta editorial progressiva (não gerar em massa)
~10 pilares · 180–250 artigos · 80–120 dúvidas específicas · 40–80 comparações ·
30–50 guias. **Progressiva** — cada URL só entra quando houver intenção própria e
conteúdo substancial. Preferir 20 páginas excelentes a 300 rasas.

## Nota de precisão jurídica (obrigatória)
As páginas acima estão especificadas com estrutura, intenção, palavras-chave,
schema e CTA — mas **sem texto jurídico inventado**. Leis, prazos, súmulas e
jurisprudência precisam ser confirmados antes da publicação. Nesta rodada foi
entregue a **infraestrutura** (componentes editoriais + collections + este
roteiro), e a redação jurídica de cada página fica para as próximas rodadas, com
revisão do advogado responsável. Isso é deliberado: publicar conteúdo jurídico
não verificado prejudicaria a autoridade e o cliente.
