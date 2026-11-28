# CLAUDE.md — site correalimaadvocacia.com.br

- Branch-fonte: `fonte-2026-11` (Astro 7, saída estática). O `main` está desatualizado; não use.
- Publicar: `git push origin fonte-2026-11:publicar`. O workflow `.github/workflows/publicar.yml` roda `npm test`, `npm run build`, envia por FTP de forma incremental (sem apagar arquivos) e avisa o IndexNow das URLs listadas em `scripts/indexnow-urls.txt`.
- Antes de publicar, guarde a versão: `git push origin HEAD:refs/heads/versoes/AAAA-MM-DD-N`.
- Testes: `npm test` (cálculos) e `node tests/e2e-ferramentas.mjs` com `npx astro preview` rodando (navegador).
- O controle do projeto de expansão orgânica (tarefas, decisões, lotes de revisão jurídica) fica fora deste repositório público, na pasta privada do projeto. Leia lá o `CLAUDE.md` antes de continuar o trabalho.
- Regras: nada de promessa de resultado, depoimentos ou captação (Provimento OAB 205/2021); não inventar lei, julgado ou estatística; não atribuir revisão ao advogado sem revisão real; nenhum segredo neste repositório.
