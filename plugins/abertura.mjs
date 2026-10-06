/**
 * remark-abertura — retira do corpo do Markdown o H1 e o parágrafo de abertura
 * e os devolve pelo frontmatter, em `abertura.titulo` e `abertura.lead`.
 *
 * Por que: nas páginas-filhas (áreas, guias, artigos) o Markdown começava com
 * o H1 e o lead dentro do bloco de prosa. A página então "começava" no meio da
 * coluna de leitura, sem abertura, sem trilha visível e sem hierarquia — e o
 * layout não tinha como compor a faixa de topo porque não sabia qual era o
 * título nem qual era o lead. Extraindo-os aqui, EntryPage monta a abertura e o
 * corpo fica só com o que é leitura corrida. O texto é o mesmo; muda o lugar.
 *
 * Também remove o par de links de CTA que o conteúdo importado repetia logo
 * abaixo do lead: o layout já oferece as mesmas ações, e repeti-las três vezes
 * na mesma página era herança do raspão, não decisão editorial.
 */

/** Reconstrói o texto puro de um nó (títulos e parágrafos curtos). */
function texto(no) {
  if (no.value) return no.value;
  if (!no.children) return '';
  return no.children.map(texto).join('');
}

/** Um parágrafo que só contém links é uma linha de CTA, não prosa. */
function soLinks(no) {
  if (no.type !== 'paragraph' || !no.children?.length) return false;
  return no.children.every((f) => f.type === 'link' || (f.type === 'text' && !f.value.trim()));
}

export function remarkAbertura() {
  return (arvore, arquivo) => {
    const frontmatter = arquivo.data.astro?.frontmatter;
    if (!frontmatter) return;

    const filhos = arvore.children;
    const i = filhos.findIndex((n) => n.type === 'heading' && n.depth === 1);
    if (i === -1) return;

    const titulo = texto(filhos[i]).trim();
    let lead = '';
    const remover = [i];

    // O lead é o primeiro parágrafo de prosa após o H1.
    for (let j = i + 1; j < filhos.length; j++) {
      const no = filhos[j];
      if (soLinks(no)) {
        remover.push(j);
        continue;
      }
      if (no.type === 'paragraph') {
        lead = texto(no).trim();
        remover.push(j);
      }
      break;
    }

    // Os links de CTA que seguem imediatamente o lead saem junto.
    for (let j = Math.max(...remover) + 1; j < filhos.length; j++) {
      if (!soLinks(filhos[j])) break;
      remover.push(j);
    }

    const descartar = new Set(remover);
    arvore.children = filhos.filter((_, j) => !descartar.has(j));

    frontmatter.abertura = { titulo, lead };
  };
}
