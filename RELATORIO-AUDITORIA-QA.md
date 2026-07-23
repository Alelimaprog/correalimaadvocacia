# Relatório de Auditoria QA — Corrêa Lima Advocacia (versão final)

Auditoria conduzida na perspectiva de QA independente (não do implementador),
sobre o build de produção (`dist/`, 113 páginas).

## 1. Problemas encontrados
1. **Overflow horizontal de 20px na página `/contato/` em 360px** (único
   problema funcional real). Causa: itens do grid do cartão de contato e os
   campos do formulário não encolhiam abaixo do seu `min-content` intrínseco
   (comportamento padrão de grid/flex com `min-width: auto`), empurrando a
   coluna do formulário para além da viewport.
2. **Logo do rodapé sem `loading` explícito** (abaixo da dobra) — oportunidade de
   `lazy` apropriada.
3. Verificado e **descartado como não-problema**: 8 controles vs 7 `<label>` no
   formulário — o 8º é o honeypot anti-spam (`name="website"`, `aria-hidden`,
   `tabindex="-1"`), corretamente sem label; e 2 páginas sem canonical/OG são a
   `404` e a `/contato/obrigado/`, ambas `noindex` por design.

## 2. Correções realizadas
1. `src/pages/contato/index.astro`: grid do cartão passou a usar
   `minmax(0, 1fr)` (base e desktop) e `.grid > * { min-width: 0 }`.
2. `src/components/ContactForm.astro`: campos com `min-width: 0` e
   `box-sizing: border-box`. → **Overflow eliminado em 360px.**
3. `src/components/Logo.astro`: novo prop `loading` (default `eager`);
   `src/components/Footer.astro`: logo do rodapé com `loading="lazy"`.

## 3. Resultado do build
`npm run build` → **113 páginas, Complete!** (sem erros).

## 4. Resultado do astro check
`npx astro check` → **0 errors, 0 warnings, 0 hints**.

## 5. Verificações realizadas (todas aprovadas)

**Funcionalidade**
- Links internos: **0 quebrados** (varredura de todos os `href` em 113 páginas).
- Menu, CTAs, botões, links do rodapé: resolvem para páginas existentes.
- WhatsApp flutuante: presente, com `aria-label` e `target/rel` corretos.
- Formulários (home e /contato/): 7 campos com label + honeypot; botão de envio;
  estados enviando/sucesso/erro; sucesso só após envio real.
- Navegação entre páginas e breadcrumbs: presentes e válidos.
- Página **404**: existe, `noindex`.

**Responsividade** (360 / 390 / 768 / 1024 / 1280 / 1440 / 1920 px, em 8 páginas)
- **0 overflow horizontal** em todas as larguras após a correção.
- Imagens com `width`/`height` (sem CLS); retrato do Hero não deformado
  (`object-fit: cover`, proporção 4:5).

**UX**
- Hover (botões escurecem, cards elevam), focus e active presentes.
- Transições por tokens (`--dur`, `--dur-slow`) — velocidades consistentes.
- Contraste de texto/links usa verde AA (`--color-green-strong`).

**Acessibilidade**
- `alt` em imagens: **0 ausentes** (227 imagens). Retrato com alt descritivo.
- `aria-label` em controles só-ícone (WhatsApp, menu) e `aria-expanded`/
  `aria-controls` no menu móvel.
- Foco por teclado: **6/6** elementos testados com foco visível (regra global
  `:focus-visible`).
- Headings: **1 H1 por página**, sem H1 múltiplo/ausente; hierarquia preservada.
- FAQ: 7 acordeões nativos (`details/summary`), acessíveis por teclado.

**SEO**
- `title` e `description`: presentes em 100% das páginas indexáveis.
- `canonical`: presente (exceto 404, por design).
- Open Graph: presente (exceto páginas `noindex`).
- Favicon: `favicon.svg/.ico/16/32`, `apple-touch-icon`, `icon-192/512` no build.
- `sitemap-index.xml` e `robots.txt`: presentes.
- Estrutura semântica e headings: inalterados.

**Performance**
- Imagens otimizadas: logos em SVG; retrato do Hero em WebP (~80 KB), com
  dimensões e `eager` (acima da dobra); logo do rodapé `lazy`.
- Sem bibliotecas novas; `astro check` sem imports inválidos/erros de tipos.
- (Observação honesta: não há ferramenta de "CSS não utilizado" no pipeline;
  a verificação de CSS morto foi por inspeção, não exaustiva.)

## 6. Confirmações finais
- **Todos os links internos e páginas foram verificados** por varredura
  automatizada das 113 páginas do build — 0 quebrados.
- **O ZIP corresponde exatamente ao estado final aprovado**: gerado a partir do
  mesmo working tree recém-auditado e reconstruído (build 0/0/0), **após** todas
  as correções; exclui apenas `node_modules/`, `dist/` e `.astro/` (artefatos
  reprodutíveis via `npm install` + `npm run build`).

## Itens que dependem de você (fora do escopo técnico)
- **Endereço oficial** do escritório (para a coluna de contato) — segue pendente
  por não existir no projeto; não foi inventado.
- **Envio real do Formspree** e **Lighthouse/CWV** só verificáveis no domínio
  publicado.
