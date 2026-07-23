# Lote 2 — 5 artigos + melhorias de projeto

Build: **123 páginas** · `astro check` **0/0/0** · 0 links quebrados · 0 títulos/descriptions
duplicados · 0 slugs duplicados · 0 páginas sem H1 único · 0 marcas de revisão vazadas.

## Artigos publicados

| # | URL | KW principal | Intenção | Funil | Schemas |
|---|---|---|---|---|---|
| 6 | `/blog/dividas-do-falecido-herdeiros-precisam-pagar/` | dívidas do falecido herdeiros | informacional | topo-meio | Article+Breadcrumb+FAQ(10) |
| 7 | `/blog/inventario-com-imovel-transferencia-e-regularizacao/` | inventário de imóvel | informacional-transacional | meio | Article+Breadcrumb+FAQ(10) |
| 8 | `/blog/morte-de-socio-o-que-acontece-com-as-quotas/` | falecimento de sócio quotas | comercial | meio-fundo | Article+Breadcrumb+FAQ(10) |
| 9 | `/blog/herdeiro-menor-ou-incapaz-o-que-muda-no-inventario/` | inventário com herdeiro menor | informacional | meio | Article+Breadcrumb+FAQ(10) |
| 10 | `/blog/herdeiros-em-conflito-inventario-travado/` | herdeiros não concordam inventário | comercial | fundo | Article+Breadcrumb+FAQ(10) |

**Entidades semânticas cobertas no lote:** forças da herança, espólio,
inventariante, seguro prestamista, renúncia à herança, matrícula, averbação,
retificação de área, ITCMD, alienação fiduciária, apuração de haveres, contrato
social, acordo de sócios, Junta Comercial, curatela, curador especial,
Ministério Público, remoção de inventariante, sobrepartilha, mediação.

## Malha interna criada
- Pilar **Inventário e Patrimônio** (`nucleos.ts`): +5 links (agora lista os 8 artigos do cluster).
- Guia **Inventário: guia completo**: +3 relacionados.
- Artigos do lote 1 atualizados para apontar aos novos (3 arquivos).
- Links cruzados dentro dos textos (dívidas ↔ imóvel, menor ↔ extrajudicial, conflito ↔ prazo).
- **Resultado medido:** 5 a 8 links de entrada por artigo novo; **0 órfãos** no cluster.

## Melhorias implementadas sem solicitação

1. **Feed RSS (`/rss.xml`)** — o site não tinha canal de sindicação. Implementado
   como endpoint Astro **sem dependência externa**, reunindo artigos + guias (50
   itens, ordenados por data), com `<link rel="alternate">` no `<head>` de todas
   as páginas. *Por quê:* melhora descoberta por agregadores e dá um canal
   estável para conteúdo novo, sem custo de performance.
2. **Verificação do sitemap** após a criação do endpoint: confirmado que
   `/rss.xml` **não** poluiu o `sitemap.xml` (121 URLs, 0 entradas indevidas).

## Auditoria de autoridade temática

Rubrica usada (transparente, 0–100): cobertura de intenções (30), profundidade
média (25), malha interna (20), estrutura pilar→guia→satélite (15), dados
estruturados e SEO técnico (10).

### Cluster A — Inventário e Sucessão
| | Antes do lote 1 | Depois do lote 1 | **Depois do lote 2** |
|---|---|---|---|
| Artigos no cluster | 3 | 6 | **11** |
| Palavras totais | ~1.500 | ~5.800 | **11.921** |
| Profundidade média (artigos novos) | — | 1.436 | **1.299** |
| Links de entrada (média) | baixa | 6,0 | **6,8** |
| Órfãos | — | 0 | **0** |
| **Nota** | **28** | **52** | **71** |

**Principais melhorias:** cobertura das intenções de maior conversão (custo,
prazo, extrajudicial, conflito, sócio), profundidade 3× maior que os artigos
legados (média antiga: 390 palavras), FAQ estruturada em todos, malha sem
órfãos.

**Lacunas restantes:** testamento; sobrepartilha; inventário negativo; bens no
exterior (ponte com o cluster B); holding familiar; usufruto; e o guia central
ainda é raso (358 palavras) para um hub de cluster.

### Cluster B — Homologação de Sentença Estrangeira
| | Antes do lote 1 | **Depois do lote 2** |
|---|---|---|
| Artigos no cluster | 11 | **13** |
| Palavras totais | ~6.500 | **8.134** |
| Links de entrada (média) | baixa | **5,8** |
| Órfãos | — | **0** |
| **Nota** | **46** | **58** |

**Principais melhorias:** cobertura de custo e da etapa pós-homologação
(execução), que eram lacunas críticas; schema completo agora também nesse
cluster.

**Lacunas restantes:** requisitos e hipóteses de indeferimento; defesa da parte
requerida; citação no exterior; partilha/herança estrangeira; testamento feito
no exterior; decisão comercial para cobrança; homologar x nova ação. O cluster
tem **volume**, mas os artigos legados têm profundidade baixa (média 551
palavras) — é o principal fator que segura a nota.

## Próximos 5 artigos recomendados
Priorizo agora o **cluster B**, que ficou para trás em profundidade:
1. Por que o STJ pode negar a homologação (requisitos e ordem pública)
2. Como contestar um pedido de homologação (parte requerida)
3. Decisão comercial estrangeira: usar no Brasil para cobrar dívida
4. Testamento feito no exterior: validade e efeitos no Brasil
5. Bens no exterior de falecido brasileiro (ponte entre os dois clusters)

---

# Lote 3 — Consolidação do cluster Homologação

Build: **128 páginas** · `astro check` **0/0/0** · 0 links quebrados · 0 duplicados
(title/description/slug) · 0 páginas sem H1 único · 0 sem canonical · **0 órfãos**.

## Artigos publicados
| # | URL | KW principal | Intenção | Funil |
|---|---|---|---|---|
| 11 | `/blog/por-que-o-stj-pode-negar-homologacao-sentenca-estrangeira/` | requisitos homologação STJ | informacional | meio |
| 12 | `/blog/como-contestar-pedido-de-homologacao-sentenca-estrangeira/` | contestar homologação | comercial | fundo |
| 13 | `/blog/sentenca-comercial-estrangeira-cobrar-divida-no-brasil/` | cobrar dívida sentença estrangeira | comercial | fundo |
| 14 | `/blog/testamento-feito-no-exterior-vale-no-brasil/` | testamento feito no exterior | informacional-comercial | meio |
| 15 | `/blog/bens-no-exterior-de-brasileiro-falecido-sucessao-internacional/` | bens no exterior inventário | comercial | meio-fundo |

Todos com Article + BreadcrumbList + FAQPage (10 perguntas cada).
Os artigos 14 e 15 funcionam como **ponte entre os dois clusters**.

## Melhoria estrutural do lote: ClusterNav
`src/components/editorial/ClusterNav.astro` — navegação automática do cluster,
alimentada pelas content collections, renderizada ao final de todo artigo e guia.

**Impacto medido:** links de entrada por artigo saltaram de média **6,8 → 13,0**
(Inventário) e **5,8 → 12,8** (Homologação), com **0 órfãos** garantidos
estruturalmente — qualquer conteúdo futuro entra na malha sozinho.

## Evolução das notas (mesma metodologia)
| Cluster | Lote 1 | Lote 2 | **Lote 3** |
|---|---|---|---|
| Inventário e Sucessão | 52 | 71 | **74** |
| Homologação / Internacional | 46 | 58 | **72** |

**Inventário (71→74):** ganho apenas na malha interna (ClusterNav) e nas duas
pontes temáticas; nenhum artigo novo no cluster neste lote.

**Homologação (58→72):** 13→18 artigos, 8.134→14.287 palavras, profundidade
média 551→740, malha 5,8→12,8. Cobertura agora inclui requisitos/negativa,
defesa, cobrança comercial, testamento e sucessão internacional.

## Lacunas restantes
- **Homologação:** 11 dos 18 artigos ainda têm menos de 600 palavras (legados).
  O guia central (967 palavras) é raso para um hub de 18 satélites.
- **Inventário:** guia central com 358 palavras — o hub mais fraco do site.
  Faltam testamento (nacional), sobrepartilha, inventário negativo, holding.
