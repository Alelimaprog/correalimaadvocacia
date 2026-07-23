# Relatório — Primeira dobra, espaçamento e footer

`npm run build` → **113 páginas, Complete!**; `npx astro check` → **0 errors, 0 warnings, 0 hints**.
Sem overflow horizontal em 375 / 768 / 1440 / 1920 px.

## Arquivos alterados
- `src/components/home/HomeHero.astro`
- `src/components/Footer.astro`
- `src/styles/tokens.css`

## Elementos removidos
- **Logotipo ampliado da primeira dobra** — o elemento `.hero-visual` (halo
  `.hv-ring` + imagem `/brand/hero-simbolo.webp`) foi **completamente removido**
  do markup e do CSS. Verificado no HTML final: **0 ocorrências** de
  `hero-simbolo` / `hero-visual` / `hv-ring`. Não foi reduzido, reposicionado,
  reutilizado, transformado em marca d'água nem substituído por outro logo,
  foto, ilustração, mockup, gráfico, animação ou forma geométrica.
- **Três itens de confiança abaixo dos botões** — o bloco `.hero-trust` foi
  removido dessa posição. Verificado: **0 ocorrências** de `hero-trust`.
- **Bloco institucional do footer** — o parágrafo comercial (`.tagline`:
  "Soluções jurídicas patrimoniais, empresariais…") foi removido. Verificado:
  **0 ocorrências** no HTML.

## Elementos adicionados
- **Painel editorial (coluna direita do Hero)** — `.hero-panel` / `.hero-editorial`
  contendo exatamente os três itens já existentes (Atendimento nacional e online;
  Análise individual da situação; Comunicação direta com o escritório),
  apresentados de forma tipográfica (título display, divisores hairline),
  **centralizados verticalmente** em relação à coluna de texto. Sem ícones,
  imagens ou elementos decorativos. Nenhum texto novo foi criado.

## Sem duplicação
- Cada item exclusivo do painel aparece **1 vez** na Home ("Análise individual da
  situação" ×1, "Comunicação direta com o escritório" ×1). A frase "Atendimento
  nacional e online" também consta, sem alteração, em seções que o escopo mandou
  preservar (faixa de confiança, microcopy do formulário e contato do footer) —
  não é duplicação do painel do Hero.

## Ajustes de espaçamento (Home)
- Tokens de ritmo vertical reduzidos (só espaçamento; fontes, cards, imagens e
  conteúdo intactos):
  - `--section-y-lg`: 2.75→2.25rem (máx.)
  - `--section-y`: 2.25→1.85rem (máx.)
  - `--section-y-sm`: 1.6→1.35rem (máx.)
- Aplica-se a todas as seções principais, melhorando o aproveitamento vertical.

## Ajustes de layout / footer
- Footer **simplificado**: removido o bloco institucional; mantidas navegação,
  áreas de atuação, contatos e todos os links (inalterados).
- Paddings do footer compactados (`.f-cta`, `.f-links`) — sem aumentar a altura.
- **Logo do footer exibido integralmente** e mais destacado: 48px de altura,
  proporção preservada (178×48), sem corte. Vertical-center mantido na banda de
  marca.

## Confirmações (checklist de aceitação)
- [x] Logotipo ampliado da primeira dobra deixou completamente de existir.
- [x] Painel editorial implementado (3 itens, coluna direita, sem decoração).
- [x] Sem duplicação dos três itens.
- [x] Primeira dobra mais limpa e equilibrada.
- [x] Footer simplificado; bloco institucional removido.
- [x] Logo do footer totalmente visível.
- [x] Espaçamentos verticais da Home otimizados, preservando legibilidade.
- [x] Hero e Footer responsivos (checado em 375/768/1440/1920, sem overflow).

## Fora de escopo (não alterado)
Navegação, áreas de atuação, contatos, links, demais seções da Home, H1
(mantido), e nenhuma outra "melhoria" foi implementada.
