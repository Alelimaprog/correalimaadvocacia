# Relatório de Migração Visual — Corrêa Lima Advocacia

## 1. Arquivos de origem

- **Modelo visual:** `untitled-chat__2_.zip` — protótipo Next.js 16 / React 19 /
  Tailwind CSS 4 / shadcn, single-page, já usando a marca "Correa Lima
  Advocacia" (logo, cores) como referência de estilo.
- **Base de conteúdo:** `correalima-astro-production-ready__8_.zip` — site
  institucional completo em Astro 7, com Content Collections (áreas, blog,
  guias), SEO/JSON-LD por página, formulário de contato (Formspree),
  sitemap, `llms.txt`, e um sistema de design já centralizado em variáveis
  CSS (`src/styles/tokens.css` + `src/styles/ui.css`).

## 2. Framework

O projeto final **permanece em Astro**. Nenhuma página, layout, componente
ou rota foi convertida para outro framework.

- **Versão do Astro:** `^7.1.0` (inalterada em relação ao site atual).
- Nenhuma dependência do modelo (Next.js, React, Tailwind 4, shadcn,
  lucide-react etc.) foi copiada para o projeto final. O site final continua
  usando apenas `.astro` + CSS puro com variáveis (zero JS framework no
  cliente), como já era o padrão do site atual.

## 3. Estratégia de migração adotada

O site atual já era construído sobre um pequeno conjunto de arquivos CSS
compartilhados (`tokens.css`, `ui.css`, `base.css`, `prose.css`,
`institucional.css`) e classes reutilizáveis (`.btn`, `.card`, `.faq`,
`.timeline`, `.eyebrow`, `.wrap`, `.crumbs` etc.), consumidos por
praticamente todas as ~20 famílias de página (Home, Áreas, Subtópicos,
Guias, Blog, institucionais).

Por isso, a migração visual foi feita **na camada de tokens e primitivos
compartilhados**, e não reescrevendo página por página:

1. `tokens.css` — nova paleta (verde vivo como protagonista, superfícies
   "ink" navy profundas, "mint" suave para blocos de destaque), raios mais
   arredondados (pílulas), sombras mais suaves/flutuantes — replicando a
   linguagem visual do modelo.
2. `ui.css` — botões em formato pílula, cartões com elevação no hover,
   FAQ em acordeão redesenhado, timeline com "pills" numerados — todos os
   componentes que já usavam essas classes herdaram o novo visual
   automaticamente.
3. `base.css` — utilitário `.bg-dot-grid` e sistema de revelação ao rolar
   `[data-reveal]` (equivalente ao componente `Reveal` do modelo), com
   suporte a `prefers-reduced-motion`.
4. Um pequeno script global em `BaseLayout.astro` aplica a revelação ao
   rolar automaticamente a cartões repetidos (`.ncard`, `.destaque`,
   `.conteudo`, `.faq-item`, `.card`, `.rel a`, `.risk-grid li`,
   `.tl-step`) em qualquer página, sem precisar editar cada template.

Essa abordagem preserva 100% do conteúdo, das rotas e da lógica (SEO,
JSON-LD, formulário) enquanto aplica a nova identidade visual a todo o
site — não apenas à home.

## 4. Componentes criados ou alterados

- `src/components/Header.astro` — cabeçalho flutuante em formato de
  pílula (transparente no topo, translúcido com blur ao rolar), como no
  modelo. `Navigation.astro` e `MobileMenu.astro` (mega-menu e acordeão
  mobile) foram mantidos com toda a lógica original, apenas restilizados.
- `src/components/Navigation.astro` — links em pílula, painéis de
  dropdown/mega-menu arredondados com destaque "mint" no hover.
- `src/components/MobileMenu.astro` — painel lateral com cantos
  arredondados e leve espaçamento das bordas da tela.
- `src/components/Footer.astro` — nova faixa de CTA no topo do rodapé
  ("Pronto para tratar o seu caso com quem leva a sério?"), inspirada no
  rodapé do modelo; colunas de navegação/áreas/contato preservadas na
  íntegra.
- `src/components/WhatsAppButton.astro` / `FloatingWhatsApp.astro` —
  pílula verde sólida e halo pulsante (`prefers-reduced-motion` respeitado).
- `src/components/ContactForm.astro` — campos e botão de envio
  arredondados; **Formspree, honeypot antispam e fluxo de conversão
  inalterados**.
- `src/components/home/HomeHero.astro` — textura de pontos (dot-grid)
  mascarada, dois "blobs" verdes desfocados ao fundo, selo/eyebrow em
  formato de pílula — todo o conteúdo textual (H1, subtítulo, CTAs)
  preservado.
- `src/components/home/HomeContent.astro` — cartões com elevação maior no
  hover e selos de ícone alternados (verde/"ink"), replicando o padrão do
  componente `Features` do modelo. Nenhum texto, número ou dado foi
  alterado ou inventado.
- `src/pages/contato/index.astro` — formulário e canais de contato
  agrupados em um cartão único arredondado com sombra, como no painel de
  contato do modelo.
- `src/layouts/BaseLayout.astro` — adição do script global de revelação ao
  rolar.

Todos os demais componentes (`SubPage.astro`, `PillarPage.astro`,
`PageHeader.astro`, `Breadcrumb.astro`, páginas institucionais, listagens
de blog/guias/áreas) **não precisaram de alteração de código** — eles já
consumiam os tokens/primitivos compartilhados e herdaram o novo visual
automaticamente.

## 5. O que foi preservado

- Todo o conteúdo textual: títulos, descrições, áreas de atuação,
  artigos, guias, FAQ, dados de contato, avisos legais.
- Todas as 113 rotas geradas pelo build (comparação automática — ver
  seção 7).
- SEO: `<title>`, meta description, canonical, robots, Open Graph, Twitter
  Cards, JSON-LD (`LegalService`, `Organization`, `Article`, `BreadcrumbList`,
  `FAQPage`, `WebSite`, `Service`) — nenhum arquivo em `src/lib`,
  `src/components/SEO.astro` ou `src/components/JsonLd.astro` foi alterado.
- `sitemap-index.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`,
  `site.webmanifest`, favicons, `og-image.png`.
- O formulário de contato (Formspree, honeypot, mensagens de erro/sucesso,
  redirecionamento para `/contato/obrigado/`).
- Logos e assets de marca reais do escritório (`public/brand/*`) — nenhum
  asset do projeto-modelo (logo, ícones de terceiros) foi copiado.
- Acessibilidade: skip-link, foco visível, `aria-expanded`/`aria-current`,
  fechamento do menu mobile por Escape/overlay, `prefers-reduced-motion`.

## 6. Como o design foi transportado

Ver seção 3. Em resumo: reforma da camada de tokens/CSS compartilhado
(paleta, raios, sombras, tipografia) + restilização pontual de um pequeno
conjunto de componentes de "chrome" (header, navegação, rodapé, hero da
home, formulário de contato), preservando toda a estrutura HTML/Astro,
lógica de dados e conteúdo das páginas internas.

## 7. Rotas — antes e depois

- **Antes da migração:** 113 rotas HTML geradas pelo build do projeto
  original (site atual, sem alterações).
- **Depois da migração:** 113 rotas HTML geradas pelo build do projeto
  final.
- **Comparação automática** (`diff` entre as duas listas de rotas,
  ordenadas): **nenhuma diferença** — lista idêntica.

## 8. Páginas geradas no build

**113 páginas** (`[build] 113 page(s) built`), incluindo:
Home; 19 páginas de Áreas de Atuação + subtópicos de alta intenção (núcleos
com `[nucleo]/[sub]`); índice de Áreas de Atuação; 42 artigos de Blog +
índice; 7 Guias + índice; Assuntos; Contato + Contato/Obrigado;
O Escritório; LGPD; Política de Privacidade; Termos de Uso; 404;
`sitemap-index.xml` / `sitemap-0.xml`.

## 9. Comandos executados

```bash
npm install
npm run build
npm run check
```

## 10. Resultado do build

```
[build] 113 page(s) built in ~2-3s
[build] Complete!
[@astrojs/sitemap] sitemap-index.xml created at dist
```

Build **sem erros**.

## 11. Resultado do check (typecheck)

```
astro check
Result (56 files):
- 0 errors
- 0 warnings
- 0 hints
```

(Durante a migração, um erro de tipagem foi encontrado e corrigido no
script global de revelação em `BaseLayout.astro` — `el.style` exigia cast
para `HTMLElement`. Corrigido antes da entrega.)

Não há scripts `lint` ou `test` configurados no `package.json` original —
nenhum script foi inventado; apenas `check` (typecheck do Astro) estava
disponível e foi executado.

## 12. Variáveis de ambiente necessárias

**Nenhuma.** Ver `.env.example` na raiz do projeto para detalhes: o
formulário de contato usa um endpoint público do Formspree (sem chave
secreta no cliente) e não há integrações de analytics/API com credenciais
no código-fonte. O arquivo `config/smtp.example.php` documenta como as
credenciais SMTP reais devem ser configuradas *caso* o formulário seja
futuramente migrado para um back-end PHP — isso não faz parte deste
projeto e nenhuma credencial real foi exposta.

## 13. Como executar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:4321`.

## 14. Como gerar o build

```bash
npm run build
```

Saída em `dist/`.

## 15. Como publicar

O projeto gera um site 100% estático (`astro build` com `output: 'static'`
implícito — ver `astro.config.mjs`). Basta enviar o conteúdo de `dist/`
para qualquer hospedagem estática (ex.: HostGator, conforme já indicado na
descrição original do `package.json`, Vercel, Netlify, Cloudflare Pages
etc.).

```bash
npm run preview   # pré-visualiza o build de produção localmente
```

## 16. Limitações e pendências reais

- A verificação foi feita por build estático, `astro check` e inspeção
  manual do HTML/CSS gerado (grep por classes, rotas e assets). **Não foi
  possível realizar uma verificação visual por captura de tela** neste
  ambiente (sem navegador gráfico disponível); recomenda-se rodar
  `npm run dev` e revisar visualmente em 320/360/390/768/1024/1280/1440/1920px
  antes da publicação, especialmente o mega-menu de "Áreas" no header e o
  formulário de contato em telas pequenas.
- O componente `Reveal` do modelo foi reproduzido como um utilitário CSS +
  script global (`[data-reveal]`), em vez de um componente React por item —
  abordagem equivalente em resultado visual, adequada à arquitetura Astro
  (sem framework de UI no cliente).
- Não foram alteradas as imagens/ícones de conteúdo (blog, guias, áreas) —
  o site atual já não usava imagens remotas nessas páginas.
- Fontes seguem Manrope + Inter (Google Fonts), como no site atual; o
  modelo usa Geist. A decisão foi manter a tipografia já validada/carregada
  do site atual, aplicando ao invés disso o mesmo tom "moderno e limpo"
  via pesos, tracking e hierarquia — evita uma dependência nova de fonte
  sem necessidade e preserva a performance já otimizada (`display: swap`,
  preconnect).
