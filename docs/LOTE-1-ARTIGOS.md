# Lote 1 — 5 artigos publicados

Build: 118 páginas · `astro check` 0/0/0 · 0 links quebrados · 0 títulos/descriptions duplicados ·
0 marcas de revisão vazadas ao HTML.

## 1. Inventário extrajudicial: quando cabe e como funciona
- **URL:** `/blog/inventario-extrajudicial-quando-cabe-e-como-funciona/`
- **KW principal:** inventário extrajudicial
- **KW secundárias:** inventário em cartório, escritura pública de inventário, requisitos inventário extrajudicial, inventário sem processo
- **Entidades:** CPC art. 610, Lei 11.441/2007, ITCMD, cartório de notas, Registro de Imóveis, sobrepartilha
- **Intenção:** informacional-transacional · **Funil:** meio · **Objetivo comercial:** captar famílias prontas para contratar a via rápida
- **Pilar:** `/areas-de-atuacao/inventario-e-partilha/` · **Cluster:** Inventário e Patrimônio
- **Schemas:** Article + BreadcrumbList + FAQPage (11 perguntas)

## 2. Quanto custa um inventário: ITCMD, custas e honorários
- **URL:** `/blog/quanto-custa-um-inventario/`
- **KW principal:** quanto custa um inventário
- **KW secundárias:** custo de inventário, ITCMD inventário, custas de inventário, valor de inventário em cartório
- **Entidades:** ITCMD, Secretaria da Fazenda estadual, emolumentos, Registro de Imóveis, isenção
- **Intenção:** comercial · **Funil:** meio-fundo · **Objetivo:** responder a objeção nº 1 (preço) e gerar contato
- **Pilar:** `/areas-de-atuacao/inventario-e-partilha/` · **Cluster:** Inventário e Patrimônio
- **Schemas:** Article + BreadcrumbList + FAQPage (10 perguntas)

## 3. Prazo para abrir inventário e o custo do atraso
- **URL:** `/blog/prazo-para-abrir-inventario-e-consequencias-do-atraso/`
- **KW principal:** prazo para abrir inventário
- **KW secundárias:** multa por atraso no inventário, prazo de 60 dias inventário, inventário atrasado o que fazer
- **Entidades:** CPC art. 611, Súmula 542 STF, ITCMD, abertura da sucessão
- **Intenção:** informacional · **Funil:** topo-meio · **Objetivo:** criar urgência legítima e capturar quem já está atrasado
- **Pilar:** `/areas-de-atuacao/inventario-e-partilha/` · **Cluster:** Inventário e Patrimônio
- **Schemas:** Article + BreadcrumbList + FAQPage (11 perguntas)

## 4. Quanto custa homologar uma sentença estrangeira no STJ
- **URL:** `/blog/quanto-custa-homologar-sentenca-estrangeira-no-stj/`
- **KW principal:** quanto custa homologar sentença estrangeira
- **KW secundárias:** custo homologação STJ, tradução juramentada preço, apostilamento custo, honorários homologação
- **Entidades:** STJ, EC 45/2004, Convenção da Apostila (Haia), tradutor público, Justiça Federal
- **Intenção:** comercial · **Funil:** fundo · **Objetivo:** qualificar cliente internacional antes do contato
- **Pilar:** `/areas-de-atuacao/homologacao-de-sentenca-estrangeira/` · **Cluster:** Direito Internacional
- **Schemas:** Article + BreadcrumbList + FAQPage (10 perguntas)

## 5. Como executar no Brasil a sentença estrangeira homologada
- **URL:** `/blog/como-executar-sentenca-estrangeira-homologada-no-brasil/`
- **KW principal:** executar sentença estrangeira no Brasil
- **KW secundárias:** cumprimento de sentença estrangeira, sentença homologada Justiça Federal, título executivo judicial estrangeiro
- **Entidades:** STJ, Justiça Federal, CF art. 109, CPC art. 515, penhora, impugnação
- **Intenção:** comercial · **Funil:** fundo · **Objetivo:** capturar credor estrangeiro de alto ticket
- **Pilar:** `/areas-de-atuacao/homologacao-de-sentenca-estrangeira/` · **Cluster:** Direito Internacional
- **Schemas:** Article + BreadcrumbList + FAQPage (10 perguntas)

## Malha interna implementada

**Links de saída** (já dentro dos artigos, via texto e bloco de relacionados):
todos apontam para o guia central do seu cluster, para a página pilar/área e
para 1–2 artigos irmãos.

**Links de entrada implementados nesta rodada:**
- `src/lib/nucleos.ts` → pilar **Inventário e Patrimônio** passou a listar os artigos 1, 2 e 3.
- `src/lib/nucleos.ts` → pilar **Direito Internacional** passou a listar os artigos 4 e 5.
- `/guias/inventario-guia-completo/` → relacionados com os artigos 1, 2 e 3.
- `/guias/homologacao-de-sentenca-estrangeira-no-brasil/` → relacionados com 4 e 5.
- Resultado medido: cada artigo novo recebe entre **6 e 8 links internos**.

**Posição no cluster:**
```
Área (pilar)  →  Guia central  →  Artigo  →  Artigos irmãos  →  Contato (CTA)
```

## Correção técnica relevante feita nesta rodada
Os artigos novos estavam sendo gerados **sem nenhum JSON-LD**, porque o
`structured-data.ts` só lia de `_child-data.json` (dados preservados do site
antigo). Foi criado fallback em `src/lib/structured-data.ts` +
`src/pages/blog/[slug].astro`, que gera **Article + BreadcrumbList** a partir do
frontmatter e **FAQPage extraído do conteúdo visível** (o schema espelha
exatamente as perguntas que o visitante lê). O mesmo FAQPage foi acrescentado ao
fallback já existente dos guias. Isso vale para todo conteúdo futuro.

## Sugestões de imagem (não implementadas — não há banco de imagens no projeto)
| Artigo | Arquivo sugerido | ALT | Legenda |
|---|---|---|---|
| 1 | `inventario-extrajudicial-cartorio.webp` | Escritura pública de inventário sobre mesa de cartório | O inventário extrajudicial é formalizado por escritura pública |
| 2 | `custo-inventario-itcmd.webp` | Documentos e calculadora para apuração de custos do inventário | O ITCMD costuma ser o maior componente do custo |
| 3 | `prazo-inventario-calendario.webp` | Calendário indicando prazo de dois meses | O prazo conta da data do falecimento |
| 4 | `custo-homologacao-stj.webp` | Documentos estrangeiros com tradução juramentada | Tradução e apostilamento concentram boa parte do custo |
| 5 | `execucao-sentenca-estrangeira.webp` | Documentos de execução sobre mesa de escritório | A execução tramita na Justiça Federal |

O site hoje não usa imagem de capa em artigos; incluir exigiria alterar o
template e produzir as imagens. Fica como decisão sua.
