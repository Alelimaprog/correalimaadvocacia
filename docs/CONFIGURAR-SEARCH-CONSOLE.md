# Configurar o Google Search Console

Passo a passo objetivo. Nenhum código de verificação foi inventado — o campo do
projeto está preparado e vazio, aguardando o valor real.

## 1. Criar a propriedade
Acesse o Google Search Console e clique em **Adicionar propriedade**.

## 2. Domínio ou prefixo de URL?
| Tipo | Cobre | Verificação |
|---|---|---|
| **Domínio** (recomendado) | Todos os subdomínios e ambos os protocolos (http/https, com e sem `www`) | Somente DNS |
| Prefixo de URL | Apenas a URL exata informada | DNS, meta tag, arquivo HTML, GA, GTM |

**Recomendação:** use **Domínio** (`correalimaadvocacia.com.br`). É mais
abrangente e evita propriedades duplicadas. Se você não tiver acesso ao painel
de DNS, use *prefixo de URL* com meta tag.

## 3. Verificação por DNS (para propriedade de Domínio)
1. O Search Console exibirá um registro **TXT**.
2. Acesse o painel onde o domínio está hospedado (HostGator → Zona de DNS).
3. Crie um registro **TXT** no host raiz (`@`), colando o valor fornecido.
4. Salve e aguarde a propagação (de minutos a algumas horas).
5. Volte ao Search Console e clique em **Verificar**.

## 4. Verificação por meta tag (para prefixo de URL)
1. O Search Console exibirá algo como
   `<meta name="google-site-verification" content="VALOR" />`.
2. Copie **apenas o VALOR** (o conteúdo do atributo `content`).

## 5. Onde inserir no projeto
Arquivo: `src/lib/site.config.ts`

```ts
analytics: {
  ga4Id: 'G-X02G8F65VJ',
  clarityId: 'xjsq94igak',
  searchConsoleVerification: '', // <- cole o VALOR aqui
}
```

A meta tag **só é emitida quando esse campo está preenchido** — se ficar vazio,
nada é renderizado. Nenhuma outra alteração de código é necessária.

## 6. Publicar
```bash
npm run build
```
Suba **todo o conteúdo de `dist/`** para `public_html` na HostGator.

## 7. Enviar o sitemap
No Search Console → **Sitemaps**, informe:
```
https://correalimaadvocacia.com.br/sitemap.xml
```

## 8. Validar a propriedade
Clique em **Verificar**. Se falhar por DNS, aguarde a propagação e tente
novamente. Se falhar por meta tag, confira o passo 9.

## 9. Testar se a meta tag apareceu
Abra a home publicada, veja o código-fonte (Ctrl+U) e procure por
`google-site-verification`. Se não aparecer, o campo não foi preenchido ou o
build/upload não foi refeito.

## 10. Relatórios para acompanhar no início
| Relatório | Por quê |
|---|---|
| **Cobertura / Indexação de páginas** | Confirmar que as 130 URLs estão sendo indexadas |
| **Sitemaps** | Confirmar leitura sem erros |
| **Desempenho** | Consultas, cliques, impressões, CTR e posição média |
| **Experiência na página / Core Web Vitals** | Só produz dados após tráfego real |
| **Ações manuais** | Deve permanecer vazio |

Nas primeiras semanas os dados serão escassos — isso é normal. Consulte
`METRICAS-E-DECISOES.md` para o período mínimo antes de tomar decisões.

## Depois de publicar
```bash
npm run indexnow
```
Acelera a descoberta no Bing e mecanismos compatíveis. Não substitui o Search
Console nem o Bing Webmaster Tools.
