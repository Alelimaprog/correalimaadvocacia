# Relatório — Reformulação da Home para conversão

Build: `npx astro check` → **0 errors, 0 warnings, 0 hints**; `npm run build` →
**112 páginas, Complete!**.

## 1. Problemas atacados
Header/Hero misturados e título longo com quebras ruins; textos pequenos;
repetição entre "problemas" e "áreas"; diferenciais genéricos; CTAs
inconsistentes; ausência de prova de confiança no topo; "Como funciona"
comprimido; FAQ estreito com área vazia; formulário com campos demais e dados
provisórios; excesso de branco. Todos endereçados abaixo.

## 2/3/4. Estrutura, conteúdo, seções criadas
Nova sequência (reconhecimento → compreensão → confiança → redução de incerteza
→ conversão):
1. **Hero** reformulado — título curto com quebra planejada e um destaque verde
   ("Proteção patrimonial…"), apoio + complemento, CTAs maiores padronizados
   ("Falar sobre o meu caso" / "Conhecer as áreas de atuação") e **linha de
   confiança** com 3 itens.
2. **Faixa de confiança** (nova) — OAB/SP 234511, atendimento nacional e online,
   atuação para pessoas e empresas, demandas no Brasil e no exterior (4 itens
   com ícone). Sem números inventados.
3. **Entrada por problema** — selo "Como podemos ajudar", título "Qual situação
   levou você a procurar um advogado?", 7 cards com título+descrição+seta em 2
   colunas (área clicável completa).
4. **Áreas de atuação** — novo título, 6 núcleos com ícones maiores, descrição
   legível e CTA "Conhecer esta área".
5. **Perfis atendidos** (nova) — 5 grupos, seção ornamentada.
6. **Como funciona** — 4 etapas em cards, números grandes, texto legível.
7. **Forma de atuação** — 6 diferenciais reescritos como benefícios ao cliente.
8. **Conteúdos** — 3 guias com descrição e CTA "Ler o guia".
9. **FAQ** — layout 2 colunas (35% institucional + CTA "Falar com o escritório"
   / 65% acordeões), fundo esverdeado (#f5faf7), acordeões em card com marcador
   +/−, `<details>` acessível por teclado, altura compacta.
10. **CTA verde** (gradiente) antes do formulário — "Apresente a situação…".

## 5. Seções removidas/unificadas
A antiga seção "Situações em que o escritório costuma atuar" (que duplicava os
problemas) já havia sido removida; a nova Home não a recria.

## 6/7/8/9/10. Conversão, Hero, FAQ, formulário, CTAs
- **Formulário** simplificado: obrigatórios = Nome, Área e Mensagem + **ao menos
  um canal** (e-mail OU telefone, validado por script; não ambos). Empresa
  opcional. Novo título "Conte brevemente o que aconteceu.", placeholder e botão
  "Enviar solicitação de atendimento"; estados enviando/sucesso/erro com textos
  novos; microcopy de confiança (não é contratação, LGPD, não enviar documentos
  sigilosos). Sucesso só após resposta real (`res.ok`); quando oculto não ocupa
  espaço.
- **CTAs padronizados**: principal "Falar sobre o meu caso"/"Solicitar
  atendimento"; WhatsApp "Falar pelo WhatsApp"; conteúdo "Ler o guia"; área
  "Conhecer esta área".

## 11. Dados provisórios corrigidos
Removidos telefone `+55 11 3000-0000`, e-mail `contato@correalima.adv.br` e
endereço fictício. Agora usa os dados reais do `site.config`: e-mail
`contato@correalimaadvocacia.com.br`, WhatsApp `+55 11 97502-5611`, `OAB/SP
234511`. Não há endereço no projeto — **não foi inventado** (item para confirmar
em produção, se houver endereço público).

## Cookies (a pedido)
Preferências de cookies **restauradas** com banner compacto e **gatilho discreto**
(link sutil no rodapé). GA4/Clarity voltam a carregar apenas após consentimento.

## 12/13. Arquivos e componentes
Modificados: `HomeHero.astro`, `HomeContent.astro` (reescrito), `HomeContact.astro`,
`Analytics.astro`, `BaseLayout.astro`, `Footer.astro`, `styles/ui.css`
(`btn--lg`, `btn--on-green`, corpo do botão maior). Criado: `ConsentBanner.astro`
(restaurado). Sem alteração de URLs, schema, sitemap, robots ou integrações.

## 14/15. Testes
`astro check` 0/0/0; `build` 112 páginas. Verificado no HTML: todas as seções,
CTAs, dados reais (0 ocorrências de placeholders), banner + link discreto,
sequência de fundos coerente.

## 16. Validar em produção
Envio real do Formspree e página `/contato/obrigado/`; execução de Lighthouse no
domínio; confirmação de endereço público (se existir) para exibir no contato.
