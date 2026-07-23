# Relatório Técnico de Implementação — Corrêa Lima Advocacia

Projeto Astro 7 (estático, HostGator). Este documento descreve **o que foi
implementado**, arquivo por arquivo, com justificativa técnica e os checklists
de produção. Ao final, a confirmação explícita de build.

> **Escopo honesto.** Foram implementadas todas as melhorias de código
> verificáveis neste ambiente. As "notas 10/10" e "Lighthouse ~100" **não são
> medíveis offline** — o que se garante aqui é o conjunto de práticas que levam
> a esses números, além de **build limpo e `astro check` sem erros**. Itens que
> só se comprovam em produção (envio real do Formspree, dados no Search Console
> e no GA4, execução de Lighthouse no domínio) estão marcados como
> *validar em produção*. Os **textos jurídicos não foram alterados** (ver nota
> na ETAPA 10).

---

## 0. Confirmação de build (ETAPAS 1 e 24)

```
npm install            → OK (293 + 2 pacotes @fontsource)
npx astro check        → 0 errors, 0 warnings, 0 hints  (58 arquivos)
npm run build          → 112 páginas, Complete!  (sitemap-index.xml gerado)
```

**Não existem erros de build nem de Astro Check.**

---

## 1. Lista de arquivos alterados

**Criados**
- `src/components/ConsentBanner.astro` — banner de cookies + Consent Mode v2.
- `src/components/home/HomeContact.astro` — seção de formulário na Home.
- `RELATORIO-IMPLEMENTACAO.md` — este relatório.

**Modificados**
- `astro.config.mjs` — filtro do sitemap exclui a URL aposentada.
- `package.json` / `package-lock.json` — dependências `@fontsource/manrope` e `@fontsource/inter`.
- `src/layouts/BaseLayout.astro` — fontes locais, remoção do Google Fonts, `ConsentBanner`, passthrough `noCanonical`.
- `src/components/SEO.astro` — suporte a `noCanonical`; robots padrão `noindex, follow`.
- `src/components/Analytics.astro` — reescrito: Consent Mode v2 + eventos ricos.
- `src/components/Icon.astro` — ícone `map-pin`.
- `src/components/Footer.astro` — link "Preferências de cookies".
- `src/components/FloatingWhatsApp.astro` — mensagem de WhatsApp por página.
- `src/components/PillarPage.astro` / `SubPage.astro` — WhatsApp contextual.
- `src/components/ContactForm.astro` — endpoint via `site.config` (DRY).
- `src/lib/site.config.ts` — endpoint Formspree (fim do `/enviar.php`); helpers de WhatsApp contextual.
- `src/lib/nucleos.ts` — remoção do "relacionado" para a URL aposentada.
- `src/lib/_child-data.json` — `image` preenchida em 45 artigos (JSON-LD Article).
- `src/pages/index.astro` — inclusão da seção `HomeContact`.
- `src/pages/404.astro` — `noindex, follow` e sem canonical para a Home.
- `src/pages/areas-de-atuacao/[slug].astro` — não gera a rota aposentada.
- `public/.htaccess` — segurança, cache, `sitemap.xml → sitemap-index.xml`.
- `src/content/blog/multa-aduaneira-retencao-de-mercadoria-o-que-fazer.md` — link repointado.
- `src/content/areas/contratos-de-importacao-comercio-exterior.md` — link repointado.
- `src/partials/institucional/assuntos.html` — link repointado.

**Removidos (limpeza — ETAPA 23)**
- `src/partials/institucional/areas-de-atuacao.html` — órfão (0 imports).
- `src/partials/institucional/contato.html` — órfão (0 imports).

---

## 2. Relatório por etapa (o que foi feito e por quê)

### ETAPA 3 — Canonical da 404
A 404 tinha `canonical` para a Home e `robots: noindex`. Agora emite
`robots: noindex, follow` e **não emite canonical** (via nova prop `noCanonical`
em `SEO`/`BaseLayout`). *Por quê:* canonical para a Home instrui o Google a
consolidar a 404 na Home — sinal incorreto; `noindex, follow` mantém o rastreio
dos links sem indexar a página de erro.

### ETAPA 4 — Sitemap
O Astro gera `sitemap-index.xml` (referenciado no `robots.txt`). Adicionado no
`.htaccess` um **301 de `/sitemap.xml` → `/sitemap-index.xml`** para o padrão
que muitas ferramentas assumem. *Por quê:* compatibilidade sem duplicar arquivos.

### ETAPA 5 — URL antiga de aduaneiro
`/areas-de-atuacao/direito-aduaneiro-comercio-exterior/` **deixou de ser gerada**
(exclusão em `getStaticPaths`), saiu do **sitemap** (filtro) e todos os links
internos foram repointados para `/areas-de-atuacao/direito-aduaneiro-tributario/`
(nucleos "relacionados", 2 arquivos de conteúdo e o mapa `/assuntos/`). O **301
permanece no `.htaccess`**. *Verificado:* 0 ocorrências exatas da URL no sitemap
e no HTML; 301 presente.

### ETAPA 6 — Formulário / fim do `/enviar.php`
`site.config.form.endpoint` passou de `/enviar.php` (morto) para o **Formspree
real**. `ContactForm` e `HomeContact` leem o endpoint da config (fonte única).
*Verificado:* nenhuma referência a `enviar.php` no código.
Validação HTML5 (`required`, `type=email`), honeypot (`website`), estados de
loading, sucesso e erro, e prevenção de múltiplos envios (`disabled`) estão
ativos. *Validar em produção:* recebimento real no Formspree.

### ETAPAS 7 e 8 — Google Analytics (eventos e microconversões)
`Analytics.astro` reescrito. Eventos: `contact_click`, `phone_click`,
`email_click`, `cta_click`, `form_start`, `form_submit`, `form_success`,
`generate_lead`, `scroll_depth` (50/75/90/100), `article_read`, `time_on_page`.
Cada evento carrega `page_title`, `page_path`, `practice_area`, `cta_position`,
`cta_text`, `lead_source`, `device`, `language`, `timestamp`.

### ETAPA 9 — Clarity
Injeção única, com guarda `__clLoaded` (sem duplicidade) e apenas após
consentimento.

### ETAPA 10 — Consentimento (Consent Mode v2 + banner)
Consent Mode v2 com padrão **negado**; GA4/Clarity só carregam **após o
consentimento**. Banner `ConsentBanner.astro` com **Aceitar / Recusar /
Preferências**, persistência em `localStorage`, reabertura pelo rodapé
("Preferências de cookies"). *Nota:* a atualização da **Política de Privacidade**
citada nesta etapa conflita com a regra "não alterar textos jurídicos"; por
isso o texto legal **não foi alterado** — recomenda-se inserir a cláusula de
cookies com revisão jurídica.

### ETAPA 11 e 23 — Performance e limpeza
CSS/JS já centralizados e enxutos; removidos 2 partials órfãos; `astro build`
faz minificação e versionamento (hash) automáticos. Fontes e scripts revisados.

### ETAPA 12 — Fontes locais
Google Fonts externo **removido** (sem `fonts.googleapis`/`gstatic`). Manrope +
Inter auto-hospedados via `@fontsource`, **apenas subset latino** e pesos
**400/500/600/700**, com `font-display: swap`. *Verificado:* 8 `.woff2`
versionados no build; 0 requisições externas de fonte.

### ETAPAS 13 e 15 — Imagens e artigos
*Verificado:* as 225 `<img>` do build têm **alt**, **width** e **height** (sem
CLS) e `decoding="async"`. Todo Article JSON-LD passou a ter `image` (fallback
para a OG image real); `author`, `datePublished`, `dateModified`, `publisher` e
`BreadcrumbList` já existiam por artigo.

### ETAPA 14 — JSON-LD
Cobertura existente confirmada e ampliada: `WebSite`, `LegalService`,
`Organization`, `Person`, `Article`, `FAQPage`, `BreadcrumbList`, `ItemList`,
`ContactPage`. *Observação:* `SearchAction` **não** foi adicionado porque o site
não possui busca interna — declará-lo seria um schema inválido.

### ETAPA 18 — Conversão / WhatsApp por página
Helper `whatsappHrefForPath()` gera mensagem conforme o núcleo/página
(Recuperação, Cobrança, Ambiental, Aduaneiro, Homologação, Inventário, etc.).
Aplicado ao botão flutuante (todas as páginas) e às páginas-pilar/subpáginas.
Atributos `data-cta-position` alimentam o GA.

### ETAPAS 20 e 21 — Segurança e cache
`.htaccess` com `Content-Security-Policy` (liberando apenas GA/Clarity/Formspree),
`Strict-Transport-Security`, `Permissions-Policy`, `X-Content-Type-Options`,
`X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`,
`Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy` e
`Cross-Origin-Embedder-Policy: unsafe-none` (para não quebrar GA/Clarity).
Cache **imutável de 1 ano** para assets versionados; HTML/XML sempre revalidados;
Brotli/Deflate quando disponíveis. *Validar em produção:* testar os módulos
`mod_headers`/`mod_expires` no plano da HostGator.

### ETAPA 22 — Acessibilidade (WCAG AA)
Skip-link e foco visível já existiam. Banner com `role="dialog"`, `aria-*`,
fechamento por Esc e switch acessível (`aria-label`). Formulários com `label`
para todos os campos. *Verificado:* 0 controles sem rótulo no HTML final.

### ETAPA 19 — SEO local
`LegalService` com `areaServed: BR`, `founder` e `knowsAbout` já presentes;
atendimento nacional/online reforçado nas mensagens de contato. Sem criação de
páginas artificiais (conforme instruído).

---

## 3. Redirecionamentos implementados (.htaccess)
1. `http://` e `www.` → `https://correalimaadvocacia.com.br` (301).
2. `/areas-de-atuacao/direito-aduaneiro-comercio-exterior/` → `/areas-de-atuacao/direito-aduaneiro-tributario/` (301).
3. `/sitemap.xml` → `/sitemap-index.xml` (301).

---

## 4. Checklist de produção
- [x] `astro check` sem erros; `build` sem erros (112 páginas).
- [x] Fontes auto-hospedadas (sem dependência externa).
- [x] `.htaccess` com segurança + cache + redirects.
- [x] 404 `noindex, follow` sem canonical para a Home.
- [x] Sitemap gerado; `robots.txt` aponta para `sitemap-index.xml`.
- [x] Formulário no Formspree (sem `/enviar.php`).
- [x] Consent Mode v2 + banner de cookies.
- [ ] *(produção)* Confirmar módulos Apache (`mod_headers`, `mod_expires`, `mod_deflate`).
- [ ] *(produção)* Testar CSP no domínio (console sem bloqueios de GA/Clarity/Formspree).

## 5. Checklist pós-publicação
- [ ] Testar envio real do formulário (Home e `/contato/`) e a página `/contato/obrigado/`.
- [ ] Validar 301s (aduaneiro, www→apex, sitemap.xml) com `curl -I`.
- [ ] Conferir cabeçalhos com securityheaders.com.
- [ ] Aceitar/recusar cookies e verificar que GA/Clarity só carregam após aceite.

## 6. Checklist Google Search Console
- [ ] Enviar `sitemap-index.xml`.
- [ ] Verificar cobertura (0 páginas indexáveis com `noindex`).
- [ ] Inspecionar a 404 (deve constar `noindex`).
- [ ] Confirmar que a URL antiga de aduaneiro retorna 301.

## 7. Checklist Google Analytics
- [ ] Ver eventos `generate_lead`, `contact_click`, `form_*`, `scroll_depth` no DebugView.
- [ ] Marcar `generate_lead` e `form_success` como conversões.
- [ ] Conferir Consent Mode (pings com `gcs` conforme o consentimento).

## 8. Checklist de testes
- [ ] Navegação por teclado + foco visível em toda a UI.
- [ ] Banner de cookies: Aceitar / Recusar / Preferências / reabrir pelo rodapé.
- [ ] WhatsApp: mensagem muda conforme a página.
- [ ] Responsivo (mobile/desktop) da nova seção de contato.

## 9. Listas resumidas
**SEO:** 404 corrigida; sitemap.xml compat; URL antiga fora de indexação/links;
Article com imagem; JSON-LD auditado; canonicais coerentes.
**Performance:** fontes locais (subset/pesos mínimos, swap); cache imutável;
compressão; assets versionados; imagens com dimensões (sem CLS).
**Segurança:** CSP, HSTS, Permissions-Policy, COOP/CORP/COEP, X-*, proteção de
arquivos sensíveis.
**Conversão:** seção de contato na Home; WhatsApp contextual por página;
rastreamento de leads/microconversões.
**Acessibilidade:** rótulos, `aria-*`, foco, Esc, switch acessível, skip-link.
