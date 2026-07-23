# Plano de Migração de URLs — Sprint 1 (Reposicionamento)

Este documento levanta as rotas existentes e define o tratamento de cada uma
diante do novo posicionamento em seis núcleos. **Princípio adotado:** nenhuma
URL indexável é apagada nesta Sprint. As áreas fora do novo foco permanecem
publicadas e acessíveis; apenas saem da navegação principal e do destaque da
Home. Redirecionamentos só são implementados quando há correspondência óbvia e
sem risco de perda de conteúdo.

Legenda de recomendação: **Manter** (permanece igual) · **Correlata** (mantida e
vinculada como conteúdo relacionado a um núcleo) · **Fora da nav** (mantida, mas
retirada do menu/destaque) · **Redirecionar** (301 para destino equivalente).

## 1. Novas páginas-pilar (criadas nesta Sprint)

| URL | Situação | Recomendação | Justificativa |
|---|---|---|---|
| `/areas-de-atuacao/recuperacao-de-credito/` | Nova | Criar | Núcleo 1 |
| `/areas-de-atuacao/cobranca-condominial/` | Nova | Criar | Núcleo 2 |
| `/areas-de-atuacao/direito-ambiental/` | Nova | Criar | Núcleo 3 (conteúdo inédito) |
| `/areas-de-atuacao/direito-aduaneiro-tributario/` | Nova | Criar | Núcleo 4 (substitui posicionamento genérico de importação) |
| `/areas-de-atuacao/direito-internacional/` | Nova | Criar | Núcleo 5 |
| `/areas-de-atuacao/inventario-e-patrimonio/` | Nova | Criar | Núcleo 6 |

## 2. Áreas existentes (coleção `areas`, 19 páginas)

| URL existente | Situação atual | Correspondência | Recomendação | Destino | Justificativa |
|---|---|---|---|---|---|
| `/areas-de-atuacao/direito-aduaneiro-comercio-exterior/` | Indexada | Direito Aduaneiro-Tributário | **Redirecionar** | `/areas-de-atuacao/direito-aduaneiro-tributario/` | Correspondência óbvia; 301 já implementado no `.htaccess`. Página preservada no código-fonte. |
| `/areas-de-atuacao/execucao-cobranca-recuperacao-de-credito/` | Indexada | Recuperação de Crédito | Correlata | — | Conteúdo específico com valor de SEO; vinculada como relacionada ao núcleo. |
| `/areas-de-atuacao/habilitacao-e-impugnacao-de-credito/` | Indexada | Recuperação de Crédito | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/recuperacao-judicial-e-falencia/` | Indexada | Recuperação de Crédito | Correlata | — | Vinculada ao núcleo (medidas do credor). |
| `/areas-de-atuacao/cobranca-condominial-recuperacao-de-inadimplencia/` | Indexada | Cobrança Condominial | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/assessoria-juridica-para-importadores/` | Indexada | Direito Aduaneiro-Tributário | Correlata (secundária) | — | Mantida como página secundária ligada ao núcleo aduaneiro-tributário. |
| `/areas-de-atuacao/contratos-de-importacao-comercio-exterior/` | Indexada | Direito Aduaneiro-Tributário | Correlata | — | Mantida; vinculada ao núcleo. |
| `/areas-de-atuacao/homologacao-de-sentenca-estrangeira/` | Indexada | Direito Internacional | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/homologacao-de-divorcio-estrangeiro/` | Indexada | Direito Internacional | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/reconhecimento-de-decisoes-estrangeiras/` | Indexada | Direito Internacional | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/inventario-e-partilha/` | Indexada | Inventário e Patrimônio | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/inventario-com-herdeiro-no-exterior/` | Indexada | Inventário e Patrimônio | Correlata | — | Vinculada ao núcleo. |
| `/areas-de-atuacao/divorcio-e-questoes-patrimoniais/` | Indexada | Inventário e Patrimônio | Correlata | — | Aspecto patrimonial vinculado ao núcleo; parte de "família genérica" sai do foco. |
| `/areas-de-atuacao/familia-e-sucessoes/` | Indexada | Inventário e Patrimônio (parcial) | Fora da nav | — | Sucessões têm valor de SEO; família genérica sai do foco. Mantida, sem destaque. |
| `/areas-de-atuacao/advocacia-empresarial/` | Indexada | — | Fora da nav | — | Empresarial vago sai do foco. Mantida por SEO; avaliar consolidação futura. |
| `/areas-de-atuacao/contencioso-empresarial-estrategico/` | Indexada | — | Fora da nav | — | Empresarial vago sai do foco. Mantida por SEO. |
| `/areas-de-atuacao/contratos-empresariais/` | Indexada | — | Fora da nav | — | Contratos genéricos saem do foco. Mantida por SEO. |
| `/areas-de-atuacao/trabalhista-empresarial/` | Indexada | — | Fora da nav | — | Trabalhista sai do foco. Mantida por SEO. |
| `/areas-de-atuacao/criminal-empresarial/` | Indexada | — | Fora da nav | — | Criminal sai do foco. Mantida por SEO. |

## 3. Páginas estruturais e de conteúdo

| URL | Situação | Recomendação | Observação |
|---|---|---|---|
| `/areas-de-atuacao/` | Reorganizada | Manter | Novo conteúdo em torno dos 6 núcleos; head e breadcrumb preservados. |
| `/` (Home) | Reformulada | Manter | Novo posicionamento; canonical na raiz; title/description atualizados. |
| `/o-escritorio/`, `/contato/`, `/blog/`, `/guias/`, `/assuntos/` | Indexadas | Manter | Sem alteração de URL. |
| `/politica-de-privacidade/`, `/termos-de-uso/`, `/lgpd/` | Indexadas | Manter | Sem alteração. |
| Artigos `/blog/*` (42) e guias `/guias/*` (3) | Indexadas | Manter | Sem alteração de URL. |

## 4. Redirecionamentos implementados nesta Sprint

- **301** `/areas-de-atuacao/direito-aduaneiro-comercio-exterior/` → `/areas-de-atuacao/direito-aduaneiro-tributario/` (arquivo `public/.htaccess`).

Nenhum outro redirecionamento destrutivo foi aplicado. As demais consolidações
possíveis (ex.: `advocacia-empresarial`, `contratos-empresariais`) ficam
**documentadas para decisão futura**, preservando conteúdo e indexação por ora.

## 5. Pendência conhecida (herdada de fase anterior)

O `sitemap.xml` de produção foi **deliberadamente adiado** em fase anterior
(ver `astro.config.mjs`) para receber uma estratégia própria de prioridades e
lastmod. O `robots.txt` já referencia a URL final do sitemap. Esta Sprint não
introduz um sitemap parcial; a geração deve ocorrer na etapa de sitemap, já
contemplando as 6 novas páginas-pilar.
