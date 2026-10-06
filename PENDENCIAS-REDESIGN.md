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

## 3. Áreas do briefing sem lastro no conteúdo atual

O briefing menciona "outras áreas B2B". O projeto hoje tem conteúdo consolidado
para: advocacia empresarial, contratos empresariais, contencioso empresarial
estratégico, criminal empresarial, recuperação judicial e falência, trabalhista
empresarial, aduaneiro e comércio exterior, assessoria a importadores,
contratos de importação, direito internacional, ambiental, recuperação de
crédito, cobrança condominial, inventário e patrimônio, família e sucessões.
Nada além disso foi criado.

## 4. Dados factuais que o site não possui e que não foram inventados

Nenhum destes aparece em nenhuma página, e nenhum deve ser acrescentado sem o
dado real:

- número de clientes, de casos ou de anos de atuação;
- percentuais de êxito, valores recuperados, "casos de sucesso";
- prêmios, rankings, selos, certificações;
- depoimentos e avaliações;
- parcerias e redes internacionais;
- endereços além do único endereço confirmado pelo escritório;
- equipe além do advogado responsável já identificado no site.

## 5. Itens técnicos pendentes de decisão do escritório

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
