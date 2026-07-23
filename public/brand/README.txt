Arquivos de logo do escritório.

ATUALMENTE EM USO (revisão final, recebida em 07/2026 como arquivo vetorial):
  - logo-dark-bg.svg   -> versão para fundo escuro (navy), usada no header e no footer
  - logo-light-bg.svg  -> versão para fundo claro (texto navy), para contextos
                           claros (e-mails, materiais impressos, páginas com fundo branco)

Favicon: /public/favicon.svg (ícone do martelo isolado, fundo navy),
referenciado em src/app/layout.tsx via metadata.icons.

SOBRE ESTA REVISÃO:
  Pela primeira vez o arquivo recebido é vetor puro (paths editáveis), não
  mais um PNG embutido em SVG — melhora real de nitidez e escalabilidade.

  Dois problemas foram identificados e corrigidos antes de entrar no projeto:

  1. O path "logo-dark-bg.svg" recebido incluía um retângulo navy cobrindo
     100% do canvas (o mesmo problema de fundo "assado" das revisões
     anteriores, desta vez dentro do próprio path vetorial em vez de um PNG).
     Usado assim, criaria um retângulo navy visivelmente diferente do navy
     do header/footer do site por trás do logo. O path de fundo foi
     removido, mantendo apenas os paths do ícone (verde) e do texto
     (branco/navy) — sem alterar traço, cor de primeiro plano ou tipografia.

  2. O arquivo "logo-light-bg.svg" recebido era uma cópia idêntica, byte a
     byte, do "logo-dark-bg.svg" — ou seja, a troca de cor do texto branco
     para navy (necessária para uso em fundo claro) nunca foi aplicada no
     arquivo original. Foi gerada uma variante light-bg correta a partir dos
     mesmos paths, com o texto em navy institucional (rgb(7,24,42)) e fundo
     removido, igual à dark-bg.

  O viewBox de ambas foi recortado para a caixa real de conteúdo do
  desenho (~1571x423, a mesma proporção 3,71:1 já usada em Logo.tsx),
  removendo a margem interna que o arquivo original trazia.

  O favicon.svg recebido também era, na prática, uma cópia do logo completo
  (1701x616, bem retangular) — inadequado para o formato quase quadrado que
  um favicon exige. Foi recortado, a partir do mesmo path do ícone (o
  martelo), para um quadrado 480x480 com fundo navy, sem desenhar nada novo.

CASO CHEGUE UMA NOVA REVISÃO NO FUTURO:
  1. Confirme que a variante "light-bg" realmente difere da "dark-bg" (cor
     do texto trocada) antes de substituir os arquivos.
  2. Confirme que nenhum path de fundo de canvas inteiro está presente
     (abra o arquivo e verifique se algum <path> ou <rect> cobre toda a
     área do viewBox com uma cor sólida).
  3. Sobrescreva logo-dark-bg.svg e logo-light-bg.svg em public/brand/, e
     favicon.svg em public/.
  4. Se a proporção largura/altura do novo arquivo for diferente de ~3,71:1,
     atualize width/height em src/components/Logo.tsx de acordo.
