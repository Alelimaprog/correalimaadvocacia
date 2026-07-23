# Relatório — IndexNow + Página institucional

`npm run build` → **113 páginas, Complete!** · `npx astro check` → **0 errors, 0 warnings, 0 hints** · Links internos quebrados: **0**.

## IndexNow
- **Chave gerada:** `6b7aee62390ec770e2be35eedaae3a3e` (32 hex).
- **Arquivo criado:** `6b7aee62390ec770e2be35eedaae3a3e.txt` (contém **apenas** a chave).
  - Caminho no projeto: `public/6b7aee62390ec770e2be35eedaae3a3e.txt`
  - Vai automaticamente para `dist/` no build; **URL pública esperada:**
    `https://correalimaadvocacia.com.br/6b7aee62390ec770e2be35eedaae3a3e.txt`
- **Script criado:** `scripts/indexnow.mjs` (Node nativo, sem dependências).
  Localiza o sitemap em `dist`, identifica se é índice (`sitemap-index.xml` →
  `sitemap-0.xml`), abre todos os sitemaps, extrai `<loc>`, **valida o domínio**
  (só `correalimaadvocacia.com.br`), **elimina duplicidades**, e envia ao
  IndexNow. Mantém cache (`scripts/.indexnow-cache.json`) para **evitar
  notificações excessivas**.
- **Comandos adicionados** (sem quebrar os existentes):
  - `npm run indexnow` → envia apenas URLs novas/alteradas (usa cache).
  - `npm run indexnow:all` → reenvia **todas** as URLs do sitemap.
  - Extra: `node scripts/indexnow.mjs --dry` → simula (não envia).
- **Funcionamento / HTTP esperado:** POST em `https://api.indexnow.org/indexnow`
  com `{host, key, keyLocation, urlList}`. **200/202** = aceito; **400** =
  payload inválido; **403** = chave não encontrada/host inválido; **422** = URLs
  não conferem com host/chave; **429** = excesso de requisições.
- **Não roda no build** e não está acoplado a preview/local. Testado com `--dry`:
  111 URLs do sitemap, todas do domínio de produção.
- **Ambiente de hospedagem (HostGator) não é um CI/CD identificável** → não
  inventei integração automática. Uso é **manual, após o deploy**:
  ```bash
  npm run build            # gera dist/ (inclui a chave e o sitemap)
  # publique dist/ em produção (com o .txt da chave acessível)
  npm run indexnow         # execute DEPOIS que o site estiver no ar
  ```

## Página institucional (/o-escritorio/)
Já era robusta e sóbria (H1 único, "Como o escritório atua", "Sobre o advogado
responsável", "Áreas de atuação" e "Guias" com links internos, CTA). **Não foi
reescrita.** Refinamentos aplicados:
- **Título profissional:** incluído no texto — "advogado de negócios
  internacionais e transações transfronteiriças" (evitando "Advogado
  Internacional"/"Advogado Sênior").
- **Localização (endereço oficial):** adicionado ao bloco "Responsável técnico"
  — R. Verbo Divino, 2001 · Bloco B, Conj. 902 · Chácara Santo Antônio · São
  Paulo – SP · CEP 04719-002.
- **Schema:** o `Person` existente foi **aprimorado (sem duplicar)** com
  `jobTitle: "Advogado de Negócios Internacionais"` e `address` (PostalAddress).
  **Não** foram usados `award`/`alumniOf`/`memberOf`/`honorificSuffix`. Person
  schemas na página: **1** (validado).
- **Arquivos alterados:** `src/partials/institucional/o-escritorio.html`
  (título + endereço) e `src/pages/o-escritorio/index.astro` (schema).
- **title/meta/canonical/OG:** preservados; canonical =
  `https://correalimaadvocacia.com.br/o-escritorio/`.
- **Sitemap:** a página está incluída (confirmado em `sitemap-0.xml`).
- **Robots:** sem `noindex` (rastreável).
- **Responsivo:** sem overflow em 360/768/1440.

## Endereço oficial — padronizado em
Rodapé (todas as páginas), `/contato/`, painel de contato da Home, **página
institucional** e **dados estruturados** (LegalService na Home + Person na
institucional). Fonte única em `src/lib/site.config.ts` (`contact.address`).

## Informações PENDENTES (não inventadas)
Precisam ser confirmadas por você antes de irem ao site/schema:
- data de fundação do escritório;
- formação acadêmica do advogado (alumniOf);
- perfis oficiais (LinkedIn, etc. → sameAs);
- horário de atendimento;
- abrangência detalhada / eventual atuação internacional formal;
- números de resultados/clientes (evitados por vedação ética).
(OAB/SP 234511, áreas de atuação, endereço, e-mail e WhatsApp **estão**
confirmados no projeto e já aplicados.)

## QA
- `npm run build`: 113 páginas, sem erros.
- `astro check`: 0/0/0.
- Sitemap: `sitemap-index.xml` + `sitemap-0.xml` presentes; institucional
  incluída.
- Arquivo IndexNow: presente em `dist/`, conteúdo == chave.
- Script IndexNow: extrai 111 URLs, valida domínio, 0 duplicadas, 0 externas.
- Links internos: 0 quebrados. Responsividade: sem overflow.
- Dados estruturados: JSON-LD válido (3/3 blocos na institucional).

## Publicação (passo a passo)
1. `npm install` (na primeira vez) e `npm run build`.
2. Suba **todo o conteúdo de `dist/`** para `public_html` na HostGator —
   incluindo `_astro/`, o `.htaccess`, o `sitemap-*.xml` e o arquivo
   `6b7aee62390ec770e2be35eedaae3a3e.txt`.
3. Confirme que `https://correalimaadvocacia.com.br/6b7aee62390ec770e2be35eedaae3a3e.txt`
   abre e mostra só a chave.
4. **Comando exato após o site entrar no ar:**
   ```bash
   npm run indexnow
   ```
   (ou `npm run indexnow:all` para reenviar tudo).
