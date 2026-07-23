# Corrêa Lima Advocacia — Site (Astro)

Reconstrução do site **correalimaadvocacia.com.br** em [Astro](https://astro.build),
com **geração 100% estática** para publicação em hospedagem compartilhada
(HostGator) — **sem Node no servidor**. A publicação usa apenas a pasta `dist/`.

> **Status:** Fase 1 — Fundação técnica. As 76 páginas ainda **não** foram
> migradas; o formulário PHP ainda **não** foi implementado; nada de produção
> foi alterado. O site atual permanece no ar.

---

## Requisitos

- **Node.js 20+** (recomendado 22) e **npm 10+** — usados apenas em
  desenvolvimento/build. O servidor de produção (HostGator) não executa Node.

## Instalação

```bash
npm install
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:4321` |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve localmente o conteúdo já buildado de `dist/` |
| `npm run check` | Verificação de tipos (Astro + TypeScript) |

## Build e publicação

```bash
npm run build
```

O resultado fica em **`dist/`**. Para publicar na HostGator, envie o **conteúdo
de `dist/`** (incluindo o `.htaccess`) para dentro de `public_html`. Não se
envia `node_modules`, `src` nem arquivos de configuração privados.

> Publicação **não** faz parte da Fase 1. O passo acima está documentado para as
> fases seguintes.

---

## Estrutura de diretórios

```
correalimaadvocacia/
├── astro.config.mjs        # static, site canônico (sem www), trailingSlash:'always'
├── package.json
├── tsconfig.json           # strict + alias @/* -> src/*
├── .gitignore              # ignora node_modules, dist, credenciais, .env, SMTP, logs
├── README.md
├── config/
│   └── smtp.example.php     # EXEMPLO sem segredos (o real fica fora do public_html) — Fase 8
├── src/
│   ├── env.d.ts
│   ├── lib/
│   │   └── site.config.ts   # configuração central (marca, contato, GA4/Clarity, form)
│   ├── styles/
│   │   ├── tokens.css        # tokens da identidade (cores/fontes reais do site atual)
│   │   └── base.css          # reset + base + acessibilidade
│   ├── components/
│   │   ├── SEO.astro         # title, description, canonical, robots, OG, Twitter
│   │   ├── JsonLd.astro      # emissão de dados estruturados (JSON-LD)
│   │   └── Analytics.astro   # GA4 + Clarity + eventos (só em produção)
│   ├── layouts/
│   │   └── BaseLayout.astro  # casca HTML (head, fontes, favicons, SEO, analytics)
│   ├── content/             # Content Collections entram na Fase 4
│   └── pages/
│       ├── index.astro       # home PROVISÓRIA de validação (noindex)
│       └── 404.astro         # 404 (noindex) -> gera /404.html
└── public/
    ├── .htaccess             # headers, cache, 404, 301 http->https e www->sem-www
    ├── robots.txt
    ├── site.webmanifest
    ├── brand/ (logos svg + README), favicons, apple-touch, icon-192/512, og-image.png
    └── llms.txt, llms-full.txt
```

## Decisões técnicas já aplicadas (Fase 0/1)

- **Domínio canônico sem `www`**, com **barra final** preservada (`trailingSlash: 'always'`).
- **`.htaccess`** acrescenta 301 `http→https` e `www→sem-www` (sem loops), mantém
  headers de segurança/cache do site atual e aponta `ErrorDocument 404 /404.html`.
- **GA4** (`G-X02G8F65VJ`) e **Clarity** (`xjsq94igak`) preservados; eventos
  `click_whatsapp`, `click_phone`, `click_email`, `form_submit` portados. Ativos
  **apenas em produção** (não poluem analytics durante `dev`/`preview`).
- **Sem Google Tag Manager** (decisão da Fase 1).
- **Segurança:** nenhum segredo no repositório. O arquivo real de SMTP deve ficar
  **fora de `public_html`**, em diretório privado; o `.gitignore` bloqueia credenciais.

---

## Colocar o projeto no GitHub (repo `Alelimaprog/correalimaadvocacia`)

Na raiz do projeto:

```bash
git init
git add .
git commit -m "Fase 1: fundação Astro (estático, SEO, tokens, 404, .htaccess)"
git branch -M main
git remote add origin https://github.com/Alelimaprog/correalimaadvocacia.git
git push -u origin main
```

O `.gitignore` já impede o versionamento de `node_modules/`, `dist/`, `.env`,
credenciais e configs SMTP.

## Abrir no GitHub Codespaces

1. No GitHub, acesse o repositório **`Alelimaprog/correalimaadvocacia`**.
2. Botão verde **`< > Code`** → aba **`Codespaces`** → **`Create codespace on main`**.
3. Quando o ambiente abrir (VS Code no navegador), no terminal:
   ```bash
   npm install
   npm run dev
   ```
4. O Codespaces detecta a porta **4321** e oferece **`Open in Browser`** para
   visualizar o site.
5. Para gerar o estático: `npm run build` (saída em `dist/`).

---

## Pendências (registradas para as próximas fases)

- **Fase 2+:** migração fiel das 76 páginas, design system (Atomic Design),
  Content Collections, JSON-LD por template, formulário PHP/PHPMailer, sitemap.
- **Antes do deploy definitivo:** analisar o CSV das 28 páginas não indexadas do
  Search Console (a ser fornecido) e o diff automatizado de URLs/metadados.
- **SMTP:** credenciais a fornecer; arquivo real fora do `public_html`.
- **Astro:** fundação fixada em Astro 5.x (estável). Há versão mais nova
  disponível; upgrade pode ser avaliado numa etapa própria.
