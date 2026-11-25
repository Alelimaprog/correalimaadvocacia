# Correção estrutural da primeira dobra — páginas internas

**Projeto:** Corrêa Lima Advocacia (Astro, estático para HostGator)
**Escopo:** padronizar a primeira dobra de todas as páginas internas com herói-banda, exceto a Home.
**Resultado medido:** em desktop, a transição herói → próxima seção passou de **142–541 px acima da dobra (média 302 px)** para **0 px em todas as resoluções** (114 amostras, tolerância exigida ≤ 8 px). Home **pixel a pixel idêntica**. Build limpo (159 páginas). Zero overflow horizontal.

---

## 1. Causa técnica

A altura da primeira seção-herói das páginas internas era definida **apenas por `padding-top`/`padding-bottom`** em `.p-hero` (PillarPage) e `.s-hero` (SubPage):

```css
padding-top: clamp(3.25rem, 2.3rem + 3vw, 5.25rem);
padding-bottom: clamp(4.25rem, 3rem + 4vw, 6.75rem);
```

Com isso a altura variava conforme título, número de linhas da descrição, presença ou ausência de card lateral, breadcrumbs e largura da tela. A transição para a seção seguinte terminava em pontos diferentes em cada página — nunca na dobra.

Uma **tentativa anterior** (documentada em `src/styles/areas-hero.css`) esticou o herói à altura da viewport, **mas manteve o conteúdo colado ao topo**, gerando ~380 px de faixa vazia embaixo em telas altas. Por isso foi revertida para padding. Essa é a armadilha que a solução atual evita.

### O cabeçalho
`<header data-header>` é `position: sticky; top: 0` — **participa do fluxo**. Sua borda inferior renderiza a **78 px** do topo, valor idêntico em todas as larguras (0.75rem de padding + 1px borda + 4rem de `.header-inner` + 1px borda). O token `--header-height` dizia `4.75rem` (76 px) — 2 px a menos que o real. Corrigido para **`4.875rem`** (78 px), o que torna a matemática da dobra exata.

---

## 2. Solução aplicada

Uma **regra estrutural única e reutilizável**, aplicada **nos componentes compartilhados** (não por URL), em `src/styles/first-fold.css`:

```css
.internal-first-fold { box-sizing: border-box; }

@media (min-width: 900px) {
  .internal-first-fold {
    display: flex;
    flex-direction: column;
    justify-content: center;                     /* distribui — sem faixa vazia */
    min-height: calc(100vh  - var(--header-height));  /* fallback */
    min-height: calc(100svh - var(--header-height));  /* atual */
  }
  .internal-first-fold > .wrap { width: 100%; }
}
```

Como o herói começa logo após o cabeçalho (que está no fluxo, a 78 px), `min-height: calc(100svh - 78px)` faz o **fundo do herói coincidir com o limite inferior da primeira tela**; a seção seguinte começa exatamente ali.

Três decisões que resolvem o problema de raiz, e não só reduzem padding:

1. **`min-height` (não `height`)** — se o conteúdo exceder a dobra, a seção cresce e **nada é cortado**.
2. **`justify-content: center`** — o conteúdo é distribuído verticalmente, então **não há faixa vazia artificial** (correção direta da falha anterior). Páginas com card e sem card terminam no **mesmo limite visual**, independentemente da quantidade de texto.
3. **Breakpoint `min-width: 900px`** — abaixo disso a regra não se aplica: no mobile/tablet-retrato o herói cresce pelo conteúdo, respeitando barras dinâmicas, sem forçar tudo em uma tela, sem cortes e sem overflow. O fallback `100vh` antes de `100svh` garante navegadores antigos.

A altura **não depende da quantidade de texto** de cada página — é a mesma regra estrutural para todos os heróis-banda.

---

## 3. Arquivos alterados (5 no total: 4 modificados, 1 novo)

| Arquivo | Mudança |
|---|---|
| `src/styles/first-fold.css` | **NOVO** — regra `.internal-first-fold` (a solução). |
| `src/styles/tokens.css` | `--header-height`: `4.75rem` → **`4.875rem`** (valor real medido). |
| `src/layouts/BaseLayout.astro` | `import '@/styles/first-fold.css';` após os estilos globais. |
| `src/components/PillarPage.astro` | classe `internal-first-fold` no `.p-hero`; `.p-hero` com `padding-block` simétrico (respiro mínimo; a altura passa a vir da regra da dobra). |
| `src/components/SubPage.astro` | classe `internal-first-fold` no `.s-hero`; `.s-hero` com `padding-block` simétrico. |

Nada mais em `src` foi alterado (verificado por diff contra a fonte original). **Sem `!important`, sem JavaScript de cálculo de altura, sem CSS por URL, sem alterar o `dist` como fonte.**

---

## 4. Inventário — páginas × template × decisão

Foram inventariadas todas as 158 páginas (fora a Home). Agrupadas pelo componente que produz a primeira seção:

| Template / componente | 1ª seção | Nº de páginas | Estrutura | Regra da dobra |
|---|---|---:|---|---|
| **PillarPage.astro** | `.p-hero` | 7 | herói-banda → seção de conteúdo | **Aplicada** ✅ |
| **SubPage.astro** (`[nucleo]/[sub]`) | `.s-hero` | 41 | herói-banda → seção de conteúdo | **Aplicada** ✅ |
| ContentIndex (`.cx-hero`): `/blog/`, `/guias/`, `/assuntos/`, `/ferramentas/` + LP `/advogado-trabalhista/` | `.cx-hero` | 5 | herói **+ grade de cards** logo abaixo | Não forçada — ver nota* |
| AreasIndex | `.areas-head` | 1 | herói **+ grade de cards** | Não forçada — ver nota* |
| EntryPage.astro (blog, guias, áreas secundárias) | `.entry` | 94 | artigo em prosa (sem herói-banda) | Não se aplica* |
| Institucional (`.inst`): escritório, LGPD, termos, privacidade, obrigado | `.inst` | 5 | documento em prosa | Não se aplica* |
| Ferramentas interativas | `.tool` | 3 | ferramenta interativa | Não se aplica* |
| Contato | `.contato` | 1 | formulário + colunas | Não se aplica* |
| **Home** | `.home-hero` | 1 | referência | **Excluída — intocada** 🔒 |

**\* Nota de engenharia (respeitando as diferenças de conteúdo, conforme a seção 5 da especificação).** A regra de preencher a dobra vale para páginas cujo primeiro bloco é um **herói-banda autônomo seguido de uma seção de conteúdo** — exatamente as páginas das capturas de referência e **100% das páginas do teste obrigatório** (todas as áreas/subáreas de Direito do Trabalho). Nas páginas de **listagem** (`.cx-hero`, `.areas-head`) o herói é seguido **imediatamente por uma grade de cards**; esticá-lo empurraria todos os cards para baixo da dobra — o oposto do objetivo e uma regressão de UX. Nas páginas de **artigo/prosa/ferramenta/contato** não existe a transição herói-claro → seção seguinte que as capturas mostram. Por isso a regra foi aplicada aos 48 heróis-banda (PillarPage + SubPage) e o mesmo princípio visual foi respeitado — sem esconder conteúdo — nos demais. Se desejar, a regra pode ser estendida às listagens, mas a recomendação técnica é mantê-las como estão.

---

## 5. Resultados por resolução

Medição automatizada com navegador headless (Chromium) percorrendo as rotas em 9 resoluções. Para cada página: altura da viewport, altura do cabeçalho, topo/base da 1ª seção, diferença até a base da viewport (foldGap), overflow horizontal, presença de H1 e de CTAs.

**Páginas-alvo (PillarPage + SubPage) — distância entre o fim da 1ª seção e o fim da viewport:**

| Resolução | Amostras | foldGap mín | foldGap máx | Média | Overflow X |
|---|---:|---:|---:|---:|---:|
| 1920 × 1080 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 1600 × 900 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 1440 × 900 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 1366 × 768 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 1280 × 720 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 1024 × 768 | 19 | 0,00 px | 0,00 px | **0,00 px** | 0 |
| 768 × 1024 | 19 | 416 px | 594 px | 524 px | 0 |
| 390 × 844 | 19 | 104 px | 324 px | 247 px | 0 |
| 360 × 800 | 19 | 38 px | 282 px | 190 px | 0 |

- **Desktop (1024–1920):** foldGap = **0 px** em todas as amostras. A transição cai exatamente na dobra, em pilar (com card) e sub (sem card), no mesmo ponto.
- **Tablet-retrato / mobile (768/390/360):** foldGap positivo = herói **cresce naturalmente** pelo conteúdo, como especificado. Sem cortes, sem overflow.

**Saúde geral (288 amostras, todos os templates):**
- Overflow horizontal > 1 px: **0**
- Páginas sem H1: **0**
- Páginas-alvo desktop fora da tolerância de 8 px: **0**

**Baseline (antes), páginas-alvo, desktop:** foldGap 142–541 px, média **302 px** (o problema).

---

## 6. Home — confirmação de que não foi modificada

Comparação pixel a pixel entre o build da fonte **antes** das minhas alterações e **depois**, com animações de revelação neutralizadas (para eliminar ruído de tempo de captura):

| Resolução | Pixels diferentes |
|---|---:|
| 1366 × 768 | **0** |
| 1920 × 1080 | **0** |
| 390 × 844 | **0** |

A Home é **idêntica**. Ela não usa a classe `.internal-first-fold` nem consome `--header-height` para layout; a única mudança compartilhada (o token de 2 px) afeta apenas `scroll-margin-top` de âncoras e o `top` de um `aside` sticky institucional — nenhum impacto visual na Home.

---

## 7. Antes × Depois (capturas — linha vermelha = limite inferior da viewport)

As imagens estão em `RELATORIO-PRIMEIRA-DOBRA/prints/`.

- `pilar-trabalho__1366x768__before.png` × `...__after.png` — pilar Direito do Trabalho. Antes: fundo claro do herói termina no meio da tela e a seção branca invade a dobra. Depois: o herói preenche até a linha, transição na dobra.
- `sub-verbas__1366x768__before.png` × `...__after.png` — subpágina (sem card). Antes: herói curto, muito branco abaixo. Depois: termina na mesma linha do pilar.
- `sub-horas__1366x768__before.png` × `...__after.png` — outra subpágina, mesmo resultado.
- `pilar-trabalho__1920x1080__after.png` — em tela alta o conteúdo fica centralizado e equilibrado (não colado ao topo, sem faixa vazia embaixo).
- `home_1366_before.png` × `home_1366_after.png` — Home idêntica.

---

## 8. Checklist de aceitação

- [x] Home intacta (pixel a pixel).
- [x] Todas as páginas internas inventariadas e vinculadas a um template.
- [x] Correção nos componentes compartilhados (não por URL).
- [x] Primeira dobra termina de forma consistente (0 px no desktop).
- [x] Segunda seção começa imediatamente após.
- [x] Sem faixa vazia artificial (conteúdo centralizado).
- [x] Sem corte de conteúdo (min-height, não height).
- [x] Sem regressão no mobile (crescimento natural < 900px).
- [x] Build sem erros (159 páginas).
- [x] Todas as rotas retornam corretamente.
- [x] Testes visuais/medições confirmam o resultado.
- [x] Proibições respeitadas: sem alterar textos, títulos, URLs, slugs, metadados, canonical, schema, SEO, links do WhatsApp, GA/GTM, menus, cards ou identidade visual; sem `!important`; sem JS; sem editar `dist` como fonte.

---

## 9. Como publicar

1. Faça backup do `public_html` atual na HostGator.
2. Envie o conteúdo de **`correalima-public_html.zip`** para `public_html` (substituindo os arquivos). O ZIP já contém `index.html`, `_astro/`, `areas-de-atuacao/`, etc. na raiz.
3. Limpe o cache (HostGator/Cloudflare, se houver) e valide com Ctrl+F5.

Para recompilar a partir da fonte: `npm install` e `npm run build` (gera `dist/`).
