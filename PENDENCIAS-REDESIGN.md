# Pendências do redesign — informações que dependem do escritório

Este arquivo registra, de forma aberta, tudo o que o redesign **não inventou**.
A diretriz do briefing é explícita: não criar serviços que o escritório não
possa efetivamente prestar, não afirmar habilitação que não exista, não
fabricar números, prêmios, casos, rankings, certificações, parcerias ou
depoimentos. Onde faltou insumo factual, a estrutura visual foi construída e o
conteúdo ficou marcado aqui — nunca preenchido por suposição.

Enquanto um item estiver em aberto, a página correspondente sai com
`robots: noindex, nofollow` e fora do `sitemap.xml` (lista `EXCLUDE` em
`astro.config.mjs`). Resolver a pendência é um trabalho de duas linhas:
retirar o `robots` da página e retirar a rota do `EXCLUDE`.

---

## 1. Direito marítimo e portuário

- **Página:** `src/pages/areas-de-atuacao/maritimo-e-portuario.astro`
- **Rota:** `/areas-de-atuacao/maritimo-e-portuario/` — `noindex`, fora do sitemap
- **Situação:** a busca por "marítimo", "portuário", "armador" e "navio" em todo
  o conteúdo do projeto não retorna uma única ocorrência. Não há no material
  existente qualquer indício de que o escritório atue na matéria.
- **O que a página faz hoje:** descreve o **escopo da matéria** (contratos de
  transporte, responsabilidade por avaria e falta, sobre-estadia, operação
  portuária, contencioso), sem afirmar competência do escritório.
- **Precisa de confirmação:**
  1. O escritório atua nesta matéria?
  2. Se atua, quais serviços efetivamente presta?
  3. Há casos, experiência ou formação que sustentem a apresentação como área
     autônoma? Não havendo, o caminho correto é apresentá-la como desdobramento
     do comércio exterior.
  4. Existe parceria com escritório ou profissional especializado? Havendo, a
     página deve dizê-lo de forma transparente.

## 2. Imigração para os Estados Unidos

- **Página:** `src/pages/areas-de-atuacao/imigracao-estados-unidos.astro`
- **Rota:** `/areas-de-atuacao/imigracao-estados-unidos/` — `noindex`, fora do sitemap
- **Situação:** advogado inscrito na OAB não exerce a advocacia norte-americana.
  Apresentar o escritório como atuante em imigração para os EUA sem o devido
  recorte seria, a um só tempo, inexato e um problema ético.
- **O que a página faz hoje:** descreve **apenas** o que um escritório
  brasileiro pode legitimamente fazer — documentação brasileira e sua validade
  no exterior, estruturação societária e patrimonial no Brasil, reorganização
  antes da mudança de residência, coordenação com profissional habilitado nos
  EUA. Nenhuma categoria de visto é citada, deliberadamente.
- **Precisa de confirmação:**
  1. Existe profissional ou escritório habilitado nos EUA com quem o escritório
     trabalhe? Nome e forma da parceria.
  2. O recorte descrito corresponde ao que o escritório faz hoje?
  3. Há experiência concreta em estruturação patrimonial de clientes que se
     mudaram para os EUA?
  4. O escritório quer manter esta frente no site ou tratá-la dentro de direito
     internacional?

## 3. Contradições entre o briefing e o texto do próprio escritório

Estas não são lacunas: são lugares onde o que o briefing pede diverge do que o
site já afirma. Nenhum dos dois foi reescrito — a decisão é do escritório.

### 3.1. Trabalhista: lado do empregador ou dos dois lados?

- O briefing lista "trabalhista empresarial (lado do empregador)" entre as
  frentes comerciais.
- A página `/areas-de-atuacao/trabalhista-empresarial/` diz, no corpo, que a
  atuação é "do ponto de vista da empresa" — coerente com o briefing. Mas a sua
  própria FAQ responde: *"O escritório atua para empregados ou apenas para
  empresas? Para ambos, em frentes distintas."*
- E a FAQ de `/areas-de-atuacao/advocacia-empresarial/` afirma: *"A atuação em
  matéria trabalhista ocorre de forma secundária, no contexto de assessoria
  empresarial, e não como frente principal de atuação."*
- Há ainda a landing `/trab/`, aprovada nesta sessão, que atende **o
  trabalhador**.

Três afirmações do escritório sobre a mesma matéria, em três graus diferentes.
O site pode sustentar as duas pontas, mas precisa dizê-lo de uma vez só.
**O que falta:** a redação única que o escritório quer para a frente
trabalhista, e se a landing `/trab/` permanece como operação separada.

### 3.2. "Quatro eixos centrais" em /o-escritorio/

O texto institucional descreve a atuação "em torno de quatro eixos centrais".
O menu e a página de áreas agora apresentam **seis bandas**. O texto continua
verdadeiro no conteúdo, mas a contagem não casa com a navegação.
**O que falta:** atualizar a frase, ou confirmar que os quatro eixos são a
leitura institucional e as seis bandas apenas a organização de navegação.

## 4. Áreas do briefing sem lastro no conteúdo atual

O briefing menciona "outras áreas B2B". O projeto hoje tem conteúdo consolidado
para: advocacia empresarial, contratos empresariais, contencioso empresarial
estratégico, criminal empresarial, recuperação judicial e falência, trabalhista
empresarial, aduaneiro e comércio exterior, assessoria a importadores,
contratos de importação, direito internacional, ambiental, recuperação de
crédito, cobrança condominial, inventário e patrimônio, família e sucessões.
Nada além disso foi criado.

## 5. Dados factuais que o site não possui e que não foram inventados

Nenhum destes aparece em nenhuma página, e nenhum deve ser acrescentado sem o
dado real:

- número de clientes, de casos ou de anos de atuação;
- percentuais de êxito, valores recuperados, "casos de sucesso";
- prêmios, rankings, selos, certificações;
- depoimentos e avaliações;
- parcerias e redes internacionais;
- endereços além do único endereço confirmado pelo escritório;
- equipe além do advogado responsável já identificado no site.

## 6. Títulos e descrições fora do limite de exibição

81 títulos passam de 65 caracteres e 28 descrições passam de 165 — os limites
em que o Google trunca. **Nenhum foi reescrito**: são URLs indexadas, e o
título é o ativo de SEO mais sensível que existe. A lista completa, com a
contagem de cada um, está em `RELATORIO-SEO-TITULOS.md`. Só o título e a
descrição da home foram atualizados, porque diziam respeito ao posicionamento
que esta rodada mudou.

## 7. BLOQUEIO: a conta de FTP não aponta para a raiz do domínio

**Este é o único motivo pelo qual o redesign não está no ar.** Ele não depende
de mais nenhum trabalho de código.

### O que está acontecendo

A conta `claude@correalimaadvocacia.com.br` publica normalmente: os 179
arquivos do build chegam ao servidor, o manifesto confere, e o GitHub Actions
termina verde. Só que a pasta que essa conta alcança **não é a pasta que serve
o site**.

Como foi comprovado:

- Consultando a origem na HostGator **sem passar pelo Cloudflare**
  (`216.172.161.24`), o domínio devolve a versão antiga e **404** para os
  arquivos novos.
- Nenhum arquivo que só existe na pasta do FTP é servido pelo domínio:
  `testador-goaffpro.html`, `formulario-importacao.html`, `index_old2.html` e
  `readme.html` dão **404** todos.
- A conta está presa à própria pasta (`/`, `/..` e `/../..` devolvem a mesma
  listagem), então ela não consegue alcançar a raiz certa por configuração.
- A última alteração real do site é de **06/10 às 09:45**, que é quando o ZIP
  foi extraído à mão. O último `push` publicado com sucesso foi às **10:33** e
  não mudou nada.

A pasta alcançada pelo FTP parece ser a raiz do **domínio principal** da conta
(tem `cgi-bin`, `.well-known` e uma instalação antiga de WordPress), enquanto
`correalimaadvocacia.com.br` é servido de outra pasta.

### Os caminhos, já confirmados pelo cPanel

A raiz do documento do domínio é **`/home1/flushi99/correalimaadvocacia.com.br`**
(cPanel → Domínios → correalimaadvocacia.com.br → Raiz do documento). A conta de
FTP cai em `public_html`, que é a raiz do domínio principal — a pasta com o
WordPress antigo.

Também já se verificou que **a conta não alcança a raiz certa por nenhum
caminho**: `/home1/flushi99/correalimaadvocacia.com.br`,
`/correalimaadvocacia.com.br`, `correalimaadvocacia.com.br` e
`../correalimaadvocacia.com.br` respondem todos `550 Can't check for file
existence`. Ela está presa à própria pasta. Por isso configurar
`FTP_REMOTE_DIR` não resolve: a conta precisa ser reapontada no painel.

### O que fazer

1. cPanel → **Arquivos → Contas de FTP**.
2. Em `claude@correalimaadvocacia.com.br`, clique em **Alterar diretório**.
3. Substitua o conteúdo do campo por `correalimaadvocacia.com.br` (o campo é
   relativo a `/home1/flushi99`; se for recusado, use o caminho completo
   `/home1/flushi99/correalimaadvocacia.com.br`).
4. Salvar. Senhas e *secrets* continuam valendo — nada mais muda.

Feito isso, a publicação funciona pelo disparo manual em
Actions → Publicar site → Run workflow.

### O que já foi feito para isto não se repetir

O `scripts/deploy.mjs` passa a **conferir no ar** depois de enviar: pede ao
site um arquivo de nome versionado que acabou de subir e, se ele não responder
200, o job **falha** e diz por quê. Uma publicação sem efeito não termina mais
em verde.

## 8. Itens técnicos pendentes de decisão do escritório

- **Logotipo.** O redesign passou a usar uma assinatura tipográfica
  (`src/components/Logo.astro`). O arquivo original permanece em
  `public/brand/logo-dark-bg.svg` e a reversão é imediata — basta trocar o
  corpo do componente.
- **Fotografia.** O site usa a fotografia aprovada do advogado responsável.
  Novas imagens de ambiente, se houver, substituem com vantagem os campos
  cromáticos usados hoje como fundo.
- **Publicação automática.** O gatilho `push` do workflow
  `.github/workflows/publicar.yml` está desligado durante o redesign; só o
  disparo manual (`workflow_dispatch`) permanece. Reativar quando o redesign
  estiver aprovado para o ar.
- **Imagens de marca sem uso.** `alexandre-retrato-mono.jpg` (130 KB),
  `alexandre-correa-lima.jpg` (106 KB), `alexandre-correa-lima.webp` (63 KB),
  `hero-simbolo.png` (62 KB) e `hero-simbolo.webp` (10 KB) continuam em
  `public/brand/` sem nenhuma página as referenciando. Não foram apagadas por
  serem material do escritório; se não houver uso previsto, saem do repositório
  e do pacote de publicação.
- **Credencial de FTP.** A senha da conta `claude@correalimaadvocacia.com.br`
  foi enviada por conversa numa rodada anterior. Ela nunca foi gravada em
  arquivo nenhum deste projeto — está apenas nos *secrets* do GitHub, onde
  deve ficar. Ainda assim, **convém trocá-la**: uma senha que trafegou por
  chat deve ser considerada exposta.
