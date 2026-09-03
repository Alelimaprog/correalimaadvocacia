# Procedência deste fork

Fork enxuto de **ui-ux-pro-max** v2.13.0 (MIT), de nextlevelbuilder.

- Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Commit de origem: `58c220f`
- Data do fork: 2026-09-03
- Licença: MIT (preservada em `LICENSE`)

## Por que um fork

O pacote completo tem 30 MB. Este projeto é um site Astro estático de um escritório
de advocacia; a maior parte do catálogo (ícones, gráficos, 20 stacks de desktop/mobile,
suíte de testes do upstream) não tem uso aqui e só custaria peso no repositório.

## O que foi mantido — 1,6 MB

| Caminho | Conteúdo |
|---|---|
| `scripts/` | engine de busca: `core.py`, `search.py`, `design_system.py`, `reasoning_contract.py` |
| `data/styles.csv` | 88 estilos visuais |
| `data/colors.csv` | 192 paletas por tipo de produto |
| `data/typography.csv` | 74 pares tipográficos |
| `data/google-fonts.csv` | 1.934 famílias com metadados (eixos variáveis, classificação, subsets) |
| `data/landing.csv` | 34 padrões de landing page |
| `data/motion.csv` | presets de movimento (domínio `gsap`) |
| `data/ux-guidelines.csv` | 119 diretrizes de UX |
| `data/ui-reasoning.csv` | regras de raciocínio de UI |
| `data/products.csv` | **obrigatório** — carregado no import de `core.py` |
| `data/stacks/astro.csv` | stack do projeto |
| `data/stacks/react.csv` | ilhas `@astrojs/react` |
| `references/` | `quick-reference.md`, `pro-rules.md` |

## O que foi removido — 28,4 MB

`phosphor-icons-upstream.json`, `google-font-licenses.json`, `icons.csv`,
`charts.csv`, `app-interface.csv`, `react-performance.csv`, `catalog-summary.json`,
`data-provenance.json`, 20 CSVs de stack, `scripts/tests/` e `scripts/validate_data.py`.

## Alterações no código

`scripts/core.py` — removidas de `CSV_CONFIG` as entradas dos domínios `chart`,
`icons`, `react` e `web`, e de `STACK_CONFIG` as 20 stacks cortadas. Sem essa poda,
`--help` ofereceria opções cujos arquivos não existem mais. Nenhuma outra lógica
foi tocada — os dicionários auxiliares (`STACK_CURRENT_VERSIONS` etc.) continuam
como superconjunto, o que é inofensivo.

Domínios ativos: `style`, `color`, `landing`, `product`, `ux`, `typography`,
`gsap`, `google-fonts`. Stacks: `astro`, `react`.

## Aviso de uso

Esta skill é **repertório, não veredito**. O primeiro resultado tende a ser o clichê
mais popular do catálogo — a linha 1 de `typography.csv` é *Playfair Display + Inter*,
e uma consulta por advocacia devolve *navy #1E3A8A + dourado #B45309*, o clichê exato
do setor. Consulte com `--variance 8-10`, leia o conjunto e escolha contra a média.
Quem aprova ou reprova é a skill `direcao-de-arte`.
