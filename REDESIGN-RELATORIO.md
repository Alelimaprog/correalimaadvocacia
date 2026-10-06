# Redesign e reposicionamento — relatório de entrega

Corrêa Lima Advocacia · 135 páginas · 9 commits · 76 arquivos alterados

---

## 1. O que foi alterado no site

**Sistema visual (atinge todas as 135 páginas de uma vez).** `tokens.css` foi
reescrito preservando os **nomes** das variáveis um a um: trocar os valores
propagou a nova identidade para cada componente sem reescrever nenhum deles. O
campo passou de verde a navy de tinta (`#0f2238`), com bronze (`#8c6d43`)
apenas como detalhe; os cinzas ficaram quentes e minerais; os raios caíram para
2–6px, porque a forma institucional é o retângulo; as sombras saíram quase por
completo.

**Tipografia.** Newsreader (serifada, de notícia) carrega o discurso; Archivo
(grotesca) carrega a interface. Duas famílias variáveis substituíram oito
arquivos estáticos.

**Cabeçalho, menu e rodapé.** A "pílula" flutuante virou faixa institucional. A
navegação perdeu os fundos e passou a se marcar por um filete sob a palavra. O
mega-menu abre em colunas por banda de atuação. O logotipo virou assinatura
tipográfica — o arquivo original continua em `public/brand/` e a reversão é a
troca do corpo de um componente.

**Home.** Primeira tela em campo navy de borda a borda, com a fotografia
aprovada do advogado, declaração em serifa e régua de credenciais. Abaixo:
posicionamento, frentes de atuação, direito empresarial em campo escuro,
comércio exterior, como o escritório atua, perfis atendidos, conteúdos e
perguntas.

**Páginas internas.** Cartões que saltavam no hover, pílulas tingidas,
ladrilhos de ícone e pontos coloridos antes dos rótulos saíram do site inteiro.
No lugar: grades de filete, listas que dividem um fio, hover que muda cor e não
posição.

**O que NÃO mudou:** nenhuma URL, nenhum dado de contato, nenhum endereço,
nenhuma credencial e nenhuma afirmação factual sobre o escritório.

---

## 2. Decisões de posicionamento

**A maior lacuna não era de design, era de exposição.** Metade das 19 páginas
de área do projeto trata de matéria empresarial — advocacia empresarial,
contratos, contencioso estratégico, criminal empresarial, recuperação judicial,
trabalhista pelo lado do empregador — e **nada disso aparecia** no menu, no
rodapé ou na página de áreas, que mostravam apenas seis núcleos de perfil mais
amplo. Quem chegava ao site não tinha como saber que o escritório atua nessas
frentes.

`src/lib/frentes.ts` passou a agrupar as páginas existentes em seis bandas, com
a empresarial à frente:

1. Empresarial e societário
2. Comércio exterior e aduaneiro
3. Crédito e inadimplência
4. Internacional
5. Patrimônio e sucessões
6. Ambiental

Nenhuma página foi criada para isso e nenhuma URL mudou: cada item aponta para
uma página já publicada, com o rótulo que ela própria usa.

**Título e descrição da home** passaram a dizer o que o escritório faz
("Advocacia Empresarial e Internacional"), preservando os termos de maior
tráfego do texto anterior.

**Limites respeitados.** Nenhum serviço foi inventado. Nenhum prêmio, número,
caso, percentual, ranking, certificação, parceria ou depoimento foi criado.
Nenhuma promessa de resultado e nenhum superlativo entraram no texto. O
escritório não é apresentado como habilitado a exercer a advocacia
norte-americana.

---

## 3. Páginas criadas e páginas reparadas

**Criadas** (ambas `noindex` e fora do sitemap até confirmação — ver
`PENDENCIAS-REDESIGN.md`):

- `/areas-de-atuacao/maritimo-e-portuario/`
- `/areas-de-atuacao/imigracao-estados-unidos/`

O briefing pediu as duas frentes. Não há no projeto **uma única ocorrência** de
"marítimo", "portuário", "armador" ou "navio", e advogado inscrito na OAB não
exerce a advocacia dos Estados Unidos. Em vez de afirmar competência
inexistente, as páginas descrevem o **escopo da matéria** — no caso dos EUA,
apenas o que um escritório brasileiro pode legitimamente fazer — e exibem, na
própria página, a lista do que o escritório precisa confirmar.

**Reparadas.** O corpo das 19 páginas de área veio de um raspão do site
anterior e carregava defeitos mecânicos, corrigidos de forma verificável por
script:

| defeito | ocorrências |
| --- | --- |
| lista ordenada com o numeral repetido no texto ("1. 1Levantamento") | 76 |
| pergunta de FAQ com o marcador "?+" do acordeão antigo | 119 |
| resposta de FAQ que o JSON-LD afirmava e a página não mostrava | **94** |
| par de links de CTA colados ("Falar no WhatsAppEnviar meu caso") | 38 |
| rótulo de seção achatado em parágrafo | 53 |
| rodapé inteiro repetido no fim do corpo | 19 páginas × 22 linhas |

(Números conferidos no diff do commit `c6e7367`, não estimados.)

As 94 respostas restauradas **não foram escritas por mim**: vieram do
`FAQPage` que já estava em `src/lib/_child-data.json`. O dado estruturado
afirmava a terceiros um texto que o leitor da página não via — além de defeito
editorial, é divergência entre schema e conteúdo visível.

---

## 4. SEO técnico e semântico

`npm run auditar` lê as 135 páginas do build:

```
135 páginas · 0 erros · 109 avisos
```

Zero erros significa: toda página tem `lang="pt-BR"`, `<title>`,
`description`, canonical dentro do domínio, exatamente **um** H1, hierarquia de
headings sem salto, JSON-LD sintaticamente válido, todo `<img>` com `alt`,
todo link com nome acessível, e **nenhum link interno quebrado nem âncora
órfã** em todo o site.

Corrigido nesta rodada: páginas em modo simples (ferramentas,
`/contato/obrigado/`, 404) saíam **sem nenhuma tag Open Graph** — compartilhar
qualquer uma no WhatsApp ou no LinkedIn mostrava link cru. Agora há um piso
derivado do título e da descrição, e o que a página declara continua
prevalecendo.

`sitemap.xml` com 130 URLs; as 5 exclusões são deliberadas (`/trab/`, as duas
frentes em definição, `/contato/obrigado/`, a URL aposentada com 301).

**Os 109 avisos são todos de comprimento** — 81 títulos acima de 65 caracteres
e 28 descrições acima de 165. **Não os reescrevi.** São URLs indexadas, e o
título é o ativo de SEO mais sensível que existe: trocar 81 de uma vez, sem a
estratégia de palavra-chave do escritório, pode custar posição em buscas que
hoje trazem tráfego. A lista completa está em `RELATORIO-SEO-TITULOS.md`, para
que a decisão seja tomada com os números à vista.

---

## 5. Acessibilidade

`npm run auditar:render` (Chromium, seis viewports) e
`node scripts/auditar-teclado.mjs`:

- **Contraste.** `--color-text-subtle` dava 4.49:1 no branco e 3.98:1 na
  superfície quente — reprovado nos dois casos; foi escurecido para passar com
  folga em todas as superfícies. Os brancos do rodapé não passavam de 4.31:1.
  O aviso legal de `/trab/` ficava em **2.86:1** sobre o campo escuro — o texto
  que a publicidade advocatícia exige que seja lido era o menos legível da
  página; agora está em 4.86:1.
- **Área de toque (WCAG 2.2, 24px).** Trilhas de navegação (14px de altura),
  links de lista (17–20px), botão de preferências de cookies (23px), links de
  contato e a caixa de consentimento — que **encolhia a 4px de largura** em
  360px por falta de `flex: none` — foram todos corrigidos.
- **Teclado.** Nenhum dos 75 alvos tabuláveis testados fica sem indicador de
  foco. "Pular para o conteúdo" é o primeiro da ordem. O mega-menu abre com
  Enter, fecha no Escape e devolve o foco ao gatilho. O menu móvel trava e
  libera a rolagem corretamente.
- **Movimento reduzido.** Com `prefers-reduced-motion`, a revelação ao rolar é
  neutralizada (opacidade 1, sem transform). A revelação também é condicionada
  ao JavaScript: sem ele, o conteúdo aparece — antes ficava escondido.

---

## 6. Performance

- A fotografia do hero pesava **362 KB** em PNG. Agora é WebP de **22 KB**
  (dois tamanhos no `srcset`), com o PNG como alternativa, `fetchpriority=high`
  e `preload` casado com o `sizes` — é o LCP da home.
- Fontes auto-hospedadas, duas famílias variáveis no lugar de oito arquivos
  estáticos, com `font-display: swap` e subsets por `unicode-range`.
- Quatro pacotes de fonte sem nenhum uso saíram do `package.json`.
- CSS total do build: 128 KB para 135 páginas, dividido por rota.
- Nenhum script de terceiros bloqueia a renderização; a medição só é liberada
  pelo consentimento.
- Todo `<img>` tem `width` e `height` — não há deslocamento de layout por
  imagem.

---

## 7. Responsividade

Medido em 360×740, 390×844, 414×896, 768×1024, 820×1180, 1024×768, 1280×800,
1440×900 e 1920×1080.

**Sem rolagem horizontal em nenhuma das 135 páginas** — e, na varredura das
135 em 360px e 1440px, zero falha de contraste, zero alvo de toque abaixo do
mínimo e zero erro de console. Nove páginas do blog
rolavam na horizontal em 360px por causa de tabelas de conteúdo: elas passaram
a ter rolagem própria, num contêiner alcançável por teclado, e `.entry-grid`
ganhou `minmax(0, 1fr)` — sem isso o item de grade herda `min-width: auto` e
empurra a coluna inteira para fora da tela.

A primeira tela da home **fecha na dobra nos nove viewports**. Antes fechava em
três: o ritmo interno, a escala do título e a altura do retrato passaram a
acompanhar a **altura** da janela, com um degrau extra para telefone curto.

---

## 8. Integrações preservadas

Formspree (formulário), GA4, Microsoft Clarity, Consent Mode v2 e o banner de
consentimento, verificação do Search Console, IndexNow, RSS, sitemap próprio,
`.htaccess` com os 301 das URLs aposentadas, o workflow de publicação por FTP e
os *secrets* do repositório — todos intactos. Nenhuma variável de ambiente e
nenhuma credencial foi tocada, lida ou gravada em arquivo.

---

## 9. Testes executados

| verificação | resultado |
| --- | --- |
| `npm run build` | 135 páginas, sem erro |
| `npx astro check` (tipos) | 0 erros · 0 avisos · 0 dicas em 73 arquivos |
| `npm run auditar` (SEO/semântica, 135 páginas) | 0 erros · 109 avisos de comprimento |
| `npm run auditar:render` (6 viewports, 15 rotas) | 0 achados |
| `auditar:render --todas` (135 páginas, 360 e 1440) | 0 achados |
| `scripts/auditar-teclado.mjs` | tudo passa |
| links internos e âncoras | nenhum quebrado |
| console do navegador | sem erro |

Três ferramentas novas ficam no repositório (`auditar`, `auditar:render`,
`auditar:teclado`): a próxima alteração no site pode ser verificada do mesmo
jeito, sem depender de inspeção manual.

---

## 10. Informações factuais que ainda dependem do escritório

Registradas em `PENDENCIAS-REDESIGN.md`, com o caminho de duas linhas para
publicar cada uma. Em resumo:

1. **Direito marítimo e portuário** — o escritório atua nesta matéria? Não há
   um indício sequer no conteúdo existente.
2. **Imigração para os EUA** — existe profissional habilitado nos Estados
   Unidos com quem o escritório trabalhe? O recorte descrito corresponde ao que
   se faz hoje?
3. **Frente trabalhista** — o briefing pede o lado do empregador; a página diz
   "do ponto de vista da empresa"; a FAQ dela diz "para ambos"; a FAQ de
   advocacia empresarial diz que é atuação secundária; e a landing `/trab/`
   atende o trabalhador. São quatro afirmações do escritório sobre a mesma
   matéria, e o site precisa de uma.
4. **"Quatro eixos centrais"** em `/o-escritorio/` — a navegação agora
   apresenta seis bandas.
5. **Logotipo** — manter a assinatura tipográfica ou voltar ao arquivo
   original, que continua no projeto.
6. **81 títulos e 28 descrições** acima do limite de exibição — decisão de SEO
   que é do escritório (`RELATORIO-SEO-TITULOS.md`).
7. **Cinco imagens de marca** sem uso em nenhuma página — descartar ou
   destinar.
8. **Senha de FTP** enviada por conversa numa rodada anterior: nunca foi
   gravada em arquivo deste projeto, mas **convém trocá-la**.

---

## Publicação

O gatilho automático do workflow continua **desligado** — só o disparo manual
permanece. Nada deste redesign foi para o ar. Reativar o `push:` em
`.github/workflows/publicar.yml` quando houver aprovação.
