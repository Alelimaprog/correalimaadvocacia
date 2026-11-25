# Auditoria de conversão, padronização visual e UX — Corrêa Lima Advocacia

**Postura:** auditoria técnica honesta, sem churn e **sem inventar nada**. Para um escritório de advocacia, copy de conversão, provas de autoridade e promessas envolvem regras da OAB e fatos reais que só o cliente possui — por isso este documento separa com clareza **(A) o que já corrigi com segurança no código** e **(B) o que recomendo, mas depende da sua decisão/fato**, com o texto já proposto para você aprovar.

Base: projeto Astro corrigido (com a correção da primeira dobra já aplicada). Build **159 páginas, 0 erros / 0 warnings / 0 hints** (`astro check`). Sem overflow horizontal e com H1 em todas as páginas medidas (desktop e mobile).

---

## A) Implementado agora (seguro, sem alterar função, URL, SEO ou fatos)

### A1. Padronização do botão de WhatsApp
O mesmo botão aparecia em **duas redações** para a mesma ação:
- `Falar no WhatsApp` — maioria do site;
- `Falar pelo WhatsApp` — em 6 pontos (artigos do blog, Home, página "obrigado" e as 3 ferramentas).

**Unifiquei todos para `Falar no WhatsApp`** (6 arquivos-fonte). Mesma URL `wa.me`, mesmo comportamento, mesma mensagem pré-preenchida — só a consistência do rótulo mudou. Corrige diretamente o item "botões inconsistentes" do briefing.

Arquivos: `ContextualCta.astro`, `home/HomeContent.astro`, `partials/institucional/contato-obrigado.html`, e as 3 páginas em `pages/ferramentas/*`.

---

## B) Recomendações prontas para executar (aguardam seu "ok" — não fiz para não inventar/violar OAB)

### B1. Diversidade de rótulos de CTA de contato
Hoje coexistem vários rótulos para "ir ao formulário / falar com o escritório": `Solicitar análise inicial` (96×), `Solicitar atendimento` (50×), `Falar com um advogado` (48×), `Falar sobre o meu caso`, `Enviar meu caso`, `Apresentar o meu caso`, `Falar com o escritório`.

Não são "errados" — alguns são contextuais. Mas para reduzir insegurança e padronizar, sugiro **consolidar em 2 CTAs claros e orientados à ação**, usados de forma consistente:
- **Primário (formulário):** `Solicitar análise inicial` — específico, sem prometer resultado, compatível com OAB.
- **Secundário (WhatsApp):** `Falar no WhatsApp`.

Isso exige decidir caso a caso onde cada variante vira qual — por isso deixei para seu aval. Posso aplicar em uma passada.

### B2. Microcopy sob os CTAs (só o que já é verdade no site)
O site já afirma, na página de contato e no rodapé de CTA, **"Resposta em até 1 dia útil"** e **"Atendimento direto com o advogado responsável"**. Essas frases verdadeiras podem aparecer, como microcopy discreta, logo abaixo do CTA primário nas páginas-pilar e subpáginas — reduz insegurança sem inventar promessa. **Confirme que ambas continuam verdadeiras** e eu adiciono.

### B3. Formulário de contato — reduzir atrito
Campos atuais: **Nome\***, **E-mail\***, **WhatsApp\***, **Área de interesse\***, Descrição (opcional), Consentimento LGPD\* (obrigatório por lei — mantém). A descrição já é opcional. ✅

Sugestão de menor atrito (decisão de **processo de captação**, por isso não fiz sozinho):
- Tornar **E-mail opcional** (mantendo WhatsApp obrigatório como canal principal) **ou** tornar **Área de interesse opcional**. Exigir nome + 1 canal + consentimento costuma converter mais.
Diga qual opção (ou nenhuma) e eu ajusto — o `required` e a validação são triviais de mudar.

### B4. Autoridade subutilizada (fatos reais já existentes em `/o-escritorio/`)
A página do escritório contém material forte e **verdadeiro**: atuação desde **2006**; OAB/SP 234.511; pós em Direito Marítimo e Portuário (Univ. Católica de Santos) e em Processo Civil (PUC-SP); atuação internacional (Brasil–EUA); palestrante convidado da OAB/SP. Hoje isso vive só em uma página.

Recomendo **reaproveitar esses mesmos fatos** (sem inventar, sem prometer resultado) em pequenos blocos de credibilidade:
- uma linha de "assinatura de autoridade" no rodapé de CTA das páginas-pilar (ex.: *"Conduzido por Alexandre Corrêa Lima — OAB/SP 234.511, atuação desde 2006"*);
- um selo discreto de formação/atuação internacional na Home, abaixo do herói.

Como isso mexe em conteúdo institucional, quero seu aval sobre **onde** e **quanto** — e confirmar que cada dado segue atual.

### B5. Home — clareza da primeira dobra (teste dos 5 segundos)
O herói atual comunica bem "o quê" e "para quem" (proteção patrimonial e soluções jurídicas empresariais/regulatórias; atuação nacional). O que está **implícito** é o "por que confiar". Uma faixa de credibilidade curta logo abaixo do herói (item B4, com fatos reais) resolveria sem aumentar texto no herói. Recomendação, não alteração automática.

---

## O que foi verificado e **já está correto** (sem necessidade de mexer)

| Item | Resultado |
|---|---|
| Componentização / padrão visual | Todas as páginas internas usam os mesmos componentes e tokens compartilhados (`tokens.css`, `ui.css`, `.wrap`, grid e cards comuns). Sem página "de outro projeto". |
| Primeira dobra | Padronizada na entrega anterior (0 px de gap no desktop; crescimento natural no mobile). |
| Largura/grid/espaçamento | `--container-max`, `--container-pad` e escala de `--space-*` aplicados de forma consistente. |
| Links internos | Auditoria anterior: 1.896 links no cluster, 0 quebrados; sem páginas órfãs. |
| SEO técnico | canonical, robots, schema (Breadcrumb/FAQ/Article/LegalService), sitemap (157 URLs), OG/Twitter presentes. **Nada alterado.** |
| Acessibilidade | skip link, landmarks, formulário com labels/aria-live, FAQ em `details/summary`, honeypot anti-spam. |
| H1 único por página | Confirmado em todas as amostras. |
| Overflow horizontal | 0 px em 360–1920 px. |
| WhatsApp / Analytics / GTM / menus / breadcrumbs | **Intocados.** |

---

## Confirmações (o que NÃO foi alterado)

- Nenhuma URL, slug, canonical, schema, metadado, título SEO, sitemap, robots ou indexação alterados.
- Nenhuma página criada, removida ou fundida. **Direito do Trabalho permanece integralmente.**
- Sistema de WhatsApp: **URL e mensagem idênticas** — só o rótulo do botão foi padronizado.
- Analytics, GTM, eventos, formulários (função), menus, breadcrumbs e identidade visual: **sem alteração**.
- Nenhuma biblioteca nova, nenhum JavaScript adicional, nenhuma animação nova.
- Build: 159 páginas, 0 erros/0 warnings/0 hints.

---

## Por que não fiz um "sweep" completo de conversão automaticamente

O briefing proíbe inventar e exige respeito à OAB e a fatos reais. Reescrever copy de conversão, promessas e provas de autoridade **sem seus dados** produziria ou texto genérico (churn) ou afirmações não verificáveis (risco ético/legal). O caminho profissional é o desta entrega: **corrigir o que é objetivamente inconsistente** (feito) e **propor o resto com o texto pronto**, para você aprovar item a item. Me diga quais dos pontos B1–B5 libero e eu executo, testo e reempacoto na sequência.
