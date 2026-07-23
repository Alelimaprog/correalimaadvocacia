# Métricas e decisões

Documento interno. Define **o que medir**, **onde consultar** e **qual decisão
tomar** a partir de cada indicador. Substitui as notas subjetivas usadas até a
Sprint 5, que foram abandonadas por não terem base em dados reais.

> **Regra fundamental:** nenhuma meta numérica é fixada aqui. Metas só fazem
> sentido depois de 3 a 6 meses de dados históricos do próprio site.

---

## Instrumentação existente (verificada no código)

| Item | Situação | Onde |
|---|---|---|
| GA4 | **Ativo** — `G-X02G8F65VJ` | `src/lib/site.config.ts` → `analytics.ga4Id` |
| Microsoft Clarity | **Ativo** — `xjsq94igak` | `analytics.clarityId` |
| Consent Mode | **Ativo** — scripts só carregam após consentimento | `src/components/Analytics.astro` |
| Google Tag Manager | **Não usado** (GA4 direto via gtag.js) | — |
| Search Console | **Pendente** — campo preparado, código não fornecido | `analytics.searchConsoleVerification` |
| IndexNow | **Ativo** — chave `6b7aee62…`, envio manual pós-deploy | `scripts/indexnow.mjs` |
| Sitemap | **Ativo** — `/sitemap.xml` único | `astro.config.mjs` |
| robots.txt | **Ativo**, aponta o sitemap | `public/robots.txt` |
| RSS | **Ativo** — `/rss.xml` | `src/pages/rss.xml.ts` |

---

## Eventos GA4 implementados

Todos disparam apenas **após o consentimento** e são centralizados em
`src/components/Analytics.astro` (sem duplicação por página).

| Evento | Quando dispara | Parâmetros |
|---|---|---|
| `contact_click` | Clique em WhatsApp, telefone ou e-mail | `method`, `cta_position`, `cta_text` |
| `generate_lead` | Mesma ação acima + envio de formulário | `method`, `value`, `currency` |
| `phone_click` | Clique em link `tel:` | `cta_position` |
| `email_click` | Clique em link `mailto:` | `cta_position` |
| `cta_click` | Clique em qualquer botão/CTA | `cta_position`, `cta_text` |
| `form_start` | Primeiro foco em campo do formulário | `form_id` |
| `form_submit` / `form_success` | Confirmação real de envio | `form_id` |
| `form_error` | Painel de erro exibido após tentativa | `form_id` |
| `tool_start` | Primeira interação com ferramenta | `tool_id` |
| `tool_complete` | Resultado exibido / checklist completo | `tool_id`, `tool_result` |
| `checklist_print` | Impressão do checklist | `method` |
| `content_to_service` | Clique de artigo/guia/ferramenta → área de atuação | `origem`, `destino` |
| `scroll_depth` | 50 / 75 / 90 / 100% da página | `percent` |
| `article_read` | 90% de leitura em artigo ou guia | `seconds` |
| `time_on_page` | Saída da página | `seconds` |

---

## Conversões: hierarquia adotada

**Marcar como conversão principal no GA4** (Admin → Eventos → marcar como
conversão):

| Prioridade | Evento | Justificativa |
|---|---|---|
| 1 | `form_success` | Intenção máxima: o visitante descreveu o caso |
| 2 | `contact_click` com `method=whatsapp` | Contato direto, alta intenção |
| 3 | `phone_click` | Contato direto |

**Conversões secundárias** (acompanhar, mas não otimizar por elas):
`tool_complete`, `email_click`, `cta_click`, `content_to_service`.

**Não marcar como conversão:** `page_view`, `scroll_depth`, `article_read`,
`time_on_page`. São métricas de engajamento — usá-las como conversão distorce a
leitura e leva a decisões erradas.

> `generate_lead` dispara junto com as ações principais e serve como métrica
> agregada. Cuidado para **não contar em dobro**: use ou `generate_lead`, ou os
> eventos específicos — nunca ambos como conversão simultaneamente.

---

## Indicadores a acompanhar

### Search Console

| Indicador | O que significa | Sinal de problema | Ação |
|---|---|---|---|
| Cliques orgânicos | Visitas vindas da busca | Queda sustentada > 4 semanas | Investigar posição e CTR das páginas de entrada |
| Impressões | Quantas vezes apareceu | Sobem sem cliques | Title/description pouco atrativos → reescrever |
| CTR | Cliques ÷ impressões | Muito abaixo das páginas similares do próprio site | Revisar title e meta description |
| Posição média | Colocação média | Estagnada entre 11 e 20 | Página "quase lá": aprofundar conteúdo e links internos |
| Páginas não indexadas | Cobertura | Página relevante fora do índice | Verificar canonical, sitemap, e reenviar via IndexNow |
| Consultas | Termos reais de busca | Termos sem página correspondente | Oportunidade de novo conteúdo — **baseada em dado, não em palpite** |

### GA4

| Indicador | O que significa | Sinal de problema | Ação |
|---|---|---|---|
| Sessões orgânicas | Volume de tráfego | Divergente do Search Console | Verificar consentimento e bloqueadores |
| Páginas de entrada | Onde o visitante chega | Concentração em 1–2 páginas | Diversificar conteúdo de entrada |
| Conversões por página | Onde nasce o contato | Página com tráfego e zero conversão | Revisar CTA, posição e clareza da proposta |
| Taxa de conversão | Conversões ÷ sessões | Abaixo da média do próprio site | Testar CTA e ordem das seções |
| `contact_click` (WhatsApp) | Contato direto | Muito abaixo do formulário | Avaliar destaque do botão |
| `form_error` | Falha no envio | Qualquer volume relevante | **Bug técnico** — investigar imediatamente |
| `tool_start` vs `tool_complete` | Abandono nas ferramentas | Diferença grande | Simplificar perguntas |
| `content_to_service` | Conteúdo levando a serviço | Muito baixo | Reforçar links contextuais nos artigos |

### Core Web Vitals

Consultar em Search Console → Core Web Vitals e no PageSpeed Insights.
Observar LCP, INP e CLS. **Só é possível medir em produção** — dados de campo
exigem tráfego real acumulado.

---

## Diagnósticos cruzados (os mais úteis)

1. **Muitas impressões + poucos cliques** → problema de *title/description*, não
   de conteúdo.
2. **Muito tráfego + nenhuma conversão** → problema de CTA ou de intenção
   (a página atrai público informacional, não comercial).
3. **Boa conversão + pouco tráfego** → página merece investimento em conteúdo e
   links internos: já provou que converte.
4. **`tool_start` alto + `tool_complete` baixo** → ferramenta longa ou confusa.
5. **`article_read` alto + `content_to_service` baixo** → o conteúdo prende, mas
   não conduz. Revisar links contextuais.

---

## Período mínimo antes de decidir

| Decisão | Dados mínimos recomendados |
|---|---|
| Ajustar title/description | 4 semanas de impressões |
| Reescrever ou expandir página | 8 a 12 semanas |
| Criar novo conteúdo por demanda real | 8 semanas de consultas no Search Console |
| Alterar CTA ou layout | Volume que permita comparação, não apenas tempo |
| Descontinuar página | 6 meses |

Conteúdo novo costuma levar **semanas a meses** para estabilizar na busca.
Decidir antes disso é decidir sobre ruído.

---

## Como configurar o Search Console

1. Acesse o Search Console e adicione a propriedade do domínio
   `correalimaadvocacia.com.br`.
2. Escolha a verificação por **tag HTML** (`<meta name="google-site-verification">`)
   ou por **DNS**.
3. Se optar pela tag HTML: copie o valor do atributo `content` e coloque em
   `src/lib/site.config.ts` → `analytics.searchConsoleVerification`. A meta só é
   emitida quando esse campo está preenchido.
4. Faça o build e publique.
5. Em **Sitemaps**, envie: `https://correalimaadvocacia.com.br/sitemap.xml`
6. Após cada publicação relevante, rode `npm run indexnow`.

---

## O que ainda depende de dados

Estas decisões ficam **suspensas** até haver dados reais:

- quais artigos expandir (aguardar consultas e posição média);
- quais temas novos produzir (aguardar termos com impressão sem página);
- se o `ClusterNav` deve exibir menos links (aguardar comportamento no Clarity);
- se o formulário deve ter menos campos (aguardar `form_start` vs `form_success`);
- quais páginas merecem CTA diferente (aguardar conversão por página).
