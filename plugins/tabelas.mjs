/**
 * rehype-tabelas — envolve cada <table> do conteúdo num contêiner rolável.
 *
 * Tabelas de conteúdo (comparativos de custo, prazos, documentos) têm uma
 * largura mínima que não cabe num telefone de 360px: nove páginas do blog
 * passavam da largura da tela e a página inteira rolava na horizontal. Em vez
 * de reduzir a tabela a um amontoado ilegível, ela ganha rolagem própria.
 *
 * O contêiner é focável por teclado (`tabindex="0"`) porque uma região
 * rolável precisa ser alcançável sem mouse — exigência do critério 2.1.1 da
 * WCAG, e o motivo pelo qual `role="region"` + rótulo acompanham.
 */
export function rehypeTabelas() {
  return (arvore) => {
    const visitar = (no) => {
      if (!no.children) return;
      no.children = no.children.map((filho) => {
        visitar(filho);
        if (filho.type !== 'element' || filho.tagName !== 'table') return filho;
        return {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['tabela-rolavel'],
            tabIndex: 0,
            role: 'region',
            'aria-label': 'Tabela — role na horizontal para ver todas as colunas',
          },
          children: [filho],
        };
      });
    };
    visitar(arvore);
  };
}
