# Relatório de correções — Menu mobile, Google Analytics, imagens e conversão

Projeto: **correalimaadvocacia** (Astro 7, geração estática para HostGator)
Base: `correalima-VERSAO-FINAL__11_.zip`
Build final: **132 páginas**, sitemap com **130 URLs** — idêntico ao build original (**nenhuma URL alterada**).
`astro check`: **0 erros, 0 avisos, 0 hints**.

> **Nota sobre o Google Analytics (conforme solicitado):**
> A implementação técnica do Google Analytics foi corrigida e validada no código.
> A confirmação do recebimento dos dados no painel deverá ser realizada após a
> publicação, por meio do relatório em tempo real ou do DebugView da propriedade
> correspondente. Não tenho acesso à conta do GA4, portanto não afirmo que os
> dados estão aparecendo no painel.

---

## 1. Arquivos criados

| Arquivo | Motivo |
|---|---|
| `src/components/ContactCTA.astro` | Bloco de conversão reutilizável (convite + WhatsApp contextual + atalho para /contato/ + formulário Formspree global) adicionado ao final das páginas de conteúdo que não tinham chamada de contato. |
| `RELATORIO-CORRECOES-MENU-ANALYTICS.md` | Este relatório. |

## 2. Arquivos modificados

| Arquivo | Alteração |
|---|---|
| `src/components/MobileMenu.astro` | Correção definitiva do menu mobile: overlay e painel movidos para `<body>` (portal via JS) para escapar do *containing block* criado pelo `backdrop-filter` do cabeçalho; `z-index` acima do banner de consentimento e do FAB; insets seguros para notch de iPhone; `overscroll-behavior: contain`; trava de rolagem sem “pulo” de layout. |
| `src/components/Analytics.astro` | Migração para **Consent Mode v2 avançado**: o GA4 passa a carregar imediatamente com `analytics_storage: denied` (pings sem cookies para todo o tráfego), e a medição completa é habilitada após o consentimento. Microsoft Clarity permanece opt-in. IDs preservados. |
| `src/layouts/EntryPage.astro` | Passa a renderizar o `ContactCTA` ao final (áreas via `[slug]`, blog e guias). Prop opcional `showContact` (padrão: exibir). |
| `public/brand/alexandre-correa-lima.webp` | Substituída pela nova foto (referenciada no hero da Home). |
| `public/brand/alexandre-correa-lima.jpg` | Substituída pela nova foto (mesmo conteúdo JPEG; mantém qualquer referência legada válida). |

## 3. Arquivos adicionados como ativo

| Arquivo | Motivo |
|---|---|
| `public/brand/alexandre-correa-lima.jpeg` | Nova foto com o nome exato usado no servidor (HostGator, diretório `Brand`). |

## 4. Arquivos removidos

Nenhum. Nenhuma página, rota, slug ou configuração de SEO foi removida.

---

## 5. Menu mobile — causa encontrada, relação com o print e solução

**Print (evidência):** ao tocar no menu, aparecia um retângulo escuro no topo mostrando
apenas “Início”, cortado, com o hero visível e **sem escurecimento** por trás.

**Causa técnica real:** o cabeçalho `.header-shell` usa
`backdrop-filter: saturate(160%) blur(10px)` (efeito “vidro” da pílula). Pela
especificação CSS, um ancestral com `backdrop-filter` (assim como `filter`,
`transform`, `perspective`, `will-change`) torna‑se o **containing block** de
descendentes `position: fixed`. Como o `.overlay` e o `.panel` do menu ficavam
**dentro** do cabeçalho:

- `.panel { top/right/bottom }` passava a se referir à pílula do header (~64px),
  colapsando a altura do painel — só o **primeiro item (“Início”)** aparecia,
  cortado. Isto explica **exatamente** o print.
- `.overlay { inset: 0 }` cobria apenas a área do cabeçalho — por isso o hero
  aparecia sem escurecer.

Havia ainda um agravante de empilhamento: o cabeçalho é `sticky; z-index: 50`
(cria stacking context), e o banner de consentimento usa `z-index: 1000/1001`,
de modo que ele apareceria por cima do menu mesmo depois de destravar a altura.

**Solução aplicada:**
1. Overlay e painel são **movidos para o final do `<body>`** ao carregar a
   página (portal via JavaScript), fora do `backdrop-filter` e do stacking
   context do cabeçalho — o `position: fixed` volta a se referir à **viewport**.
2. `z-index` do painel/overlay elevados para **1100/1090** (acima do banner de
   consentimento e do FAB do WhatsApp).
3. Insets com `env(safe-area-inset-*)` (áreas seguras do iPhone), `max-width`
   para nunca ultrapassar a tela e `overscroll-behavior: contain` (sem “scroll
   chaining” para a página).
4. Comportamentos mantidos: abre/fecha pelo botão, fecha ao tocar fora
   (overlay), fecha no **Escape**, fecha ao seguir qualquer link (inclui os
   submenus `<details>`), trava a rolagem do body sem deslocar o layout,
   `aria-expanded`/`aria-label` atualizados, foco movido para o primeiro item.

**Validação (navegador headless, iPhone 390×844):** painel com **825px** de
altura (antes ~40px), overlay cobrindo **390×844**, **14 links acessíveis** com
rolagem interna do painel; submenus “Áreas de Atuação” (6 núcleos + “Ver todas”)
e “Conteúdos” (Artigos/Guias/Assuntos) totalmente alcançáveis. Desktop
inalterado (o menu de desktop e os dropdowns continuam funcionando).

---

## 6. Google Analytics — diagnóstico e solução

**Onde estava implementado:** `src/components/Analytics.astro`, incluído no
`<head>` de **todas** as páginas via `BaseLayout.astro`. Sem Google Tag Manager.

**Código de medição encontrado (preservado, não inventado):**
- GA4: **`G-X02G8F65VJ`** (hardcoded em `src/lib/site.config.ts`).
- Microsoft Clarity: **`xjsq94igak`**.
- É **GA4 direto** (gtag.js), **não** Google Tag Manager.

**Causa do “não funciona”:** o `gtag.js` **só era injetado após o clique em
“Aceitar”** no banner de cookies (o evento `cl:consent` disparava `loadGA()`).
Como a maioria dos visitantes não interage com o banner, o GA4 praticamente
**não recebia dados** — inclusive cliques vindos do Google Ads. Não havia bug de
ID, de ambiente (`import.meta.env.PROD` funciona no build estático) nem CSP; o
bloqueio era o **gating por consentimento**.

**Solução aplicada — Consent Mode v2 (modo avançado):**
- `gtag('consent','default', ...)` mantém `analytics_storage` e `ad_storage`
  **negados** por padrão.
- O **GA4 carrega imediatamente** (`loadGA()` no topo). Nesse estado ele envia
  **pings sem cookies** (modelagem de consentimento) para **todo o tráfego**,
  o que restabelece a medição e a atribuição do Google Ads.
- Ao consentir (`cl:consent` com `analytics: true`), faz-se
  `gtag('consent','update',{ analytics_storage:'granted' })` e só então é
  carregado o **Microsoft Clarity** (gravação de sessão permanece opt-in).
- **Nenhum cookie de análise é gravado antes do consentimento** — LGPD
  preservada. Anúncios permanecem **sempre negados** (sem personalização).

**Confirmações técnicas:**
- Tag presente no HTML final de **todas as 132 páginas** (não só na Home).
- `gtag('config', ga4Id)` é chamado **uma única vez** por carregamento →
  **um page_view por página**, sem duplicidade.
- **Sem tags duplicadas** e **sem** segunda configuração concorrente (não há GTM).
- Este projeto é estático e **não usa View Transitions/Client Router**, portanto
  cada navegação é um carregamento real — **sem contagem dupla** de SPA.
- Parâmetros de campanha preservados: o GA4 lê `utm_*` e `gclid` da URL
  automaticamente; nenhuma configuração remove ou filtra esses parâmetros; não
  há exclusão de tráfego nem `debug_mode`/`localhost` forçado no código.

> Observação para o DPO/escritório: caso se prefira o modelo estritamente
> opt-in (sem qualquer ping antes do consentimento), basta voltar a condicionar
> `loadGA()` ao evento de consentimento — a mudança é reversível em uma linha.

---

## 7. Google Ads e conversões — estado atual (sem invenção de IDs)

Eventos de conversão **já implementados** no `Analytics.astro` e **preservados**:
`contact_click` e `generate_lead` (WhatsApp/telefone/e‑mail), `phone_click`,
`email_click`, `cta_click`, `form_start`, `form_submit`/`form_success`,
`form_error`, `scroll_depth`, `article_read`, `time_on_page`, além de eventos das
ferramentas. Cada clique dispara **uma vez** (há guardas contra duplicidade).

**Google Ads (gtag de conversão):** **não há** `AW-` / `send_to` de conversão do
Google Ads configurado no projeto. Não inventei IDs de conversão. Para
contabilizar conversões de Ads (ex.: envio de formulário, clique no WhatsApp),
será necessário informar o **ID de conversão** e o **rótulo** do Google Ads —
posso então ligá-los aos eventos já existentes, sem duplicar disparos.

---

## 8. Padronização visual / componentes globais

- As páginas internas deste projeto **já compartilham** cabeçalho, rodapé,
  breadcrumb, container de leitura, tipografia e FAB do WhatsApp (via
  `BaseLayout` + `EntryPage`/`PillarPage`/`SubPage`). O aspecto de “texto solto”
  relatado corresponde, muito provavelmente, à **versão publicada anterior**.
- **Componentes globais ajustados:** `MobileMenu`, `Analytics`, `EntryPage`.
- **Componente global criado:** `ContactCTA` (formulário + WhatsApp) — agora
  presente em **áreas (`[slug]`), artigos do blog e guias**. As páginas de
  núcleo (`PillarPage`) e subáreas (`SubPage`) já possuíam CTA próprio; não
  houve duplicação.

## 9. Páginas prioritárias do Google Ads — revisadas

Todas presentes no build, com **URL idêntica**, cabeçalho, menu (desktop e
mobile), breadcrumb, título, conteúdo em container, WhatsApp/FAB, rodapé,
Analytics e agora chamada de contato:

- `/areas-de-atuacao/inventario-e-partilha/`
- `/areas-de-atuacao/inventario-e-patrimonio/inventario-extrajudicial/`
- `/areas-de-atuacao/inventario-e-patrimonio/inventario-judicial/`
- `/areas-de-atuacao/inventario-e-patrimonio/planejamento-sucessorio/`
- `/blog/quanto-custa-um-inventario/`
- `/blog/testamento-feito-no-exterior-vale-no-brasil/`
- `/guias/inventario-guia-completo/`

## 10. Responsividade e não regressão

- **Sem rolagem horizontal** em 320/360/375/390/768/1280px (todas as páginas
  testadas).
- **Sem formulários duplicados** por página.
- Home **não** foi alterada visualmente (troca de foto é 1:1 na proporção do
  slot, via `object-fit: cover`).
- Conteúdo jurídico, títulos, meta, canonical, JSON‑LD, datas, autores e slugs
  **inalterados**. `sitemap.xml` com as mesmas 130 URLs.

## 11. Imagens do advogado

- `public/brand/alexandre-correa-lima.webp` e `.jpg` **substituídas** pela nova
  foto; `.jpeg` **adicionada** (nome usado no servidor). md5 confere com os
  arquivos enviados, inclusive no `dist/brand/`. Atributos `alt`, dimensões
  reservadas (`width/height`) e carregamento responsivo preservados.

## 12. Build e limitações

- `npm ci`/`npm install` → `astro check` (0/0/0) → `astro build` **OK**
  (132 páginas). Preview local usado para os testes de menu, responsividade e
  formulário.
- **Limitação declarada:** a confirmação de recebimento de dados no painel do
  GA4 e a configuração de **IDs de conversão do Google Ads** dependem de acesso
  às contas correspondentes, que não possuo. Tudo o que depende apenas de código
  foi corrigido e validado.
