# Auditoria final pré-produção — Corrêa Lima Advocacia

Build: `npx astro check` → **0 errors, 0 warnings, 0 hints**; `npm run build` →
**112 páginas, Complete!**.

## Problemas encontrados (e corrigidos)

1. **Seta solta no `<select>` do formulário (bug real).** Causa técnica: no
   Astro, uma classe passada a um componente filho (`<Icon class="…">`) **não
   recebe o escopo de estilo do componente pai**, então `.hcx-select-caret`
   nunca era aplicada e o ícone de seta renderizava solto abaixo do campo.
   Correção: removido o ícone e desenhado o **chevron via CSS** (`::after`),
   perfeitamente centralizado e alinhado à direita. Verificado: 0 `<svg>` dentro
   do select.

2. **Ícones que dependiam de classe escopada e não coloriam.** Mesmo motivo do
   item 1. Corrigidos envolvendo o ícone num `<span>` estilizado (a cor passa por
   `currentColor`):
   - checks da linha de confiança do Hero → agora **verde** (`rgb(11,125,69)`);
   - setas dos cards de problema → agora **verde**, com micro-movimento no hover;
   - seta do botão de envio → micro-movimento no hover restaurado.

3. **Header × Hero.** Confirmado que o Header **não atravessa** o Hero: base do
   Header a 78px, topo do título a 157px (sem sobreposição).

4. **Responsividade.** Sem overflow horizontal em **320px, 375px e 414px**
   (`scrollWidth == innerWidth` nas três larguras).

5. **FAQ.** Acréscimo de **animação curta e discreta** na abertura do acordeão
   (fade + leve deslocamento), respeitando `prefers-reduced-motion`. Marcador
   +/− desenhado em CSS, alinhado; cartão com fundo levemente esverdeado ao
   abrir; foco visível.

## Ajustes de UX/CRO/UI aplicados
- Ícones e setas com cor e comportamento de hover consistentes em toda a Home.
- Select do formulário com indicador nativo removido e chevron próprio (aparência
  uniforme entre navegadores).
- Micro-interações contidas (hover de cards/CTAs/arrows), sem exageros — leitura
  "premium, não chamativa".

## Acessibilidade
- Ícones decorativos permanecem sem papel semântico; o chevron do select é
  `pointer-events: none` e não interfere no teclado.
- Foco visível preservado em botões, links, acordeões e campos.
- Animações respeitam `prefers-reduced-motion`.

## Itens auditados sem necessidade de alteração
- Selo do Hero: é uma pílula (borda + sombra + dot), não um campo de input.
- Sequência de fundos da Home: coerente, sem seção escura isolada.
- Tipografia/espaçamento: dentro das faixas confortáveis definidas nos tokens.
- SEO/schema/sitemap/URLs: inalterados (auditados, sem mudanças necessárias).
- Sem CSS morto relevante introduzido; sem bibliotecas novas; sem JS supérfluo.

## Arquivos alterados nesta revisão
- `src/components/home/HomeContact.astro` — chevron CSS no select; spans nos
  ícones de seta; ajustes de estilo.
- `src/components/home/HomeHero.astro` — checks da linha de confiança em `<span>`.
- `src/components/home/HomeContent.astro` — seta dos cards de problema em
  `<span>`; animação do FAQ; reduced-motion.

## Validar em produção
Envio real do Formspree e página `/contato/obrigado/`; execução de Lighthouse no
domínio publicado; confirmação de endereço público (se existir) para o bloco de
contato.
