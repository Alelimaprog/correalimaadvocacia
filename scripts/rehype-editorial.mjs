/**
 * rehype-editorial.mjs
 * -----------------------------------------------------------------------------
 * Reorganização VISUAL do conteúdo das páginas internas (Sprint Final).
 *
 * Este plugin NÃO altera o texto jurídico. Ele apenas re-estrutura, no momento
 * do build, padrões já existentes no markdown para melhorar escaneabilidade e
 * conversão:
 *
 *   • "Perguntas frequentes"  -> acordeão acessível (<details>), removendo o
 *     marcador "+" herdado do export. Perguntas sem resposta exportada recebem
 *     apenas uma afordância de contato (não se inventa resposta jurídica).
 *   • Lista ordenada de etapas -> classe .proc-steps e remoção do número
 *     duplicado ("1Levantamento" -> "Levantamento"), que era artefato de export.
 *   • Tabelas -> invólucro .table-wrap (rolagem horizontal no mobile).
 *   • "Áreas/Conteúdos relacionados" + lista -> cartões .rel-cards.
 *   • Pares de link de CTA ([Falar no WhatsApp][Enviar meu caso]) -> .cta-inline
 *     (botões).
 *   • Primeiro parágrafo antes do H1 -> .eyebrow; primeiro após o H1 -> .lead.
 *   • Bloco final de CTA/So contato DUPLICADO (boilerplate repetido em cada
 *     página, já coberto pelo ContactCTA e pelo rodapé) -> ocultado com
 *     [hidden] (nenhum dado é perdido: WhatsApp, e-mail, OAB e endereço seguem
 *     no rodapé e no bloco de contato padronizado).
 *
 * Conservador por design: só age em padrões reconhecidos; qualquer outra coisa
 * é preservada exatamente como está. Componentes MDX (mdxJsxFlowElement) são
 * ignorados.
 */

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (node.children) return node.children.map(textOf).join('');
  return '';
}
function el(tagName, properties = {}, children = []) {
  return { type: 'element', tagName, properties, children };
}
function txt(value) {
  return { type: 'text', value };
}
function isEl(n, tag) {
  return !!n && n.type === 'element' && (!tag || n.tagName === tag);
}
function isHeading(n) {
  return isEl(n) && /^h[1-6]$/.test(n.tagName);
}
function norm(s) {
  return (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
}
function hasClass(node, c) {
  const cur = (node.properties && node.properties.className) || [];
  return (Array.isArray(cur) ? cur : String(cur).split(/\s+/)).includes(c);
}
function addClass(node, ...classes) {
  node.properties = node.properties || {};
  const cur = node.properties.className || [];
  node.properties.className = Array.isArray(cur) ? [...cur, ...classes] : [cur, ...classes];
}
function firstTextNode(n) {
  if (!n) return null;
  if (n.type === 'text') return n;
  if (n.children) {
    for (const c of n.children) {
      const r = firstTextNode(c);
      if (r) return r;
    }
  }
  return null;
}
function lastTextNode(n) {
  if (!n) return null;
  if (n.type === 'text') return n;
  if (n.children && n.children.length) {
    for (let i = n.children.length - 1; i >= 0; i--) {
      const r = lastTextNode(n.children[i]);
      if (r) return r;
    }
  }
  return null;
}

const TAIL_TRIGGERS = [
  'fale com o escritório',
  'fale sobre o seu caso',
  'atendimento direto',
  'precisa de orientação jurídica',
  'responsável técnico',
  'quer ver o panorama',
];
function isTailTrigger(t) {
  const s = norm(t);
  return TAIL_TRIGGERS.some((p) => s.startsWith(p));
}
function isRelatedHeader(t) {
  return /^(áreas|conteúdos?)\s+relacionad|^leia também|^veja também/i.test((t || '').trim());
}
function isQuestion(node) {
  if (!isEl(node, 'p')) return false;
  const t = textOf(node).trim();
  if (!t) return false;
  if (/[?？]\+?\s*$/.test(t) && t.length < 200) return true;
  const kids = (node.children || []).filter((c) => !(c.type === 'text' && !c.value.trim()));
  if (kids.length === 1 && isEl(kids[0], 'strong') && /\?\+?\s*$/.test(textOf(kids[0]).trim())) return true;
  return false;
}
function stripTrailingPlus(node) {
  const lt = lastTextNode(node);
  if (lt) lt.value = lt.value.replace(/\s*\+\s*$/, '').replace(/\s+$/, '');
}
function isCtaPair(node) {
  if (!isEl(node, 'p')) return false;
  const anchors = (node.children || []).filter((c) => isEl(c, 'a'));
  if (anchors.length < 2) return false;
  const joined = anchors.map((a) => textOf(a).replace(/\s/g, '')).join('');
  return textOf(node).replace(/\s/g, '') === joined;
}

function buildFaq(items) {
  const children = items.map(({ q, a }) => {
    stripTrailingPlus(q);
    const qText = textOf(q).trim();
    const summary = el('summary', { className: ['faq-q'] }, [
      el('span', { className: ['faq-q-tx'] }, [txt(qText)]),
      el('span', { className: ['faq-ic'], 'aria-hidden': 'true' }, []),
    ]);
    let body;
    if (a && a.length) {
      body = el('div', { className: ['faq-a'] }, a);
    } else {
      body = el('div', { className: ['faq-a', 'faq-a--cta'] }, [
        el('p', {}, [
          txt('Este ponto depende das particularidades do caso. '),
          el('a', { href: '/contato/' }, [txt('Fale com o escritório')]),
          txt(' para uma orientação específica.'),
        ]),
      ]);
    }
    return el('details', { className: ['faq-item'] }, [summary, body]);
  });
  return el('div', { className: ['faq'] }, children);
}

function buildRelated(ul) {
  const cards = [];
  for (const li of ul.children || []) {
    if (!isEl(li, 'li')) continue;
    const a = (li.children || []).find((c) => isEl(c, 'a'));
    if (!a) continue;
    const href = (a.properties && a.properties.href) || '#';
    const label = textOf(a).trim();
    cards.push(
      el('a', { href, className: ['rel-card'] }, [
        el('span', { className: ['rel-card-t'] }, [txt(label)]),
        el('span', { className: ['rel-card-ar'], 'aria-hidden': 'true' }, [txt('→')]),
      ]),
    );
  }
  return el('nav', { className: ['rel-cards'], 'aria-label': 'Conteúdos relacionados' }, cards);
}

/**
 * Rodada 4 (13/11/2026) — CTA logo após o lead dos artigos, com o roteiro de
 * WhatsApp da frente do artigo (cluster do frontmatter).
 */
const WA = 'https://wa.me/5511975025611?text=';
const EARLY_CTA = {
  'direito-aduaneiro-tributario': {
    t: 'Carga retida ou auto de infração na importação?',
    d: 'Envie o número da DI ou DUIMP e a exigência recebida para uma análise inicial.',
    wa: 'Olá! Vim pelo site. Tenho uma questão aduaneira na importação.\nDI/DUIMP: \nCanal (vermelho/cinza): \nHá exigência ou auto de infração? ',
  },
  'inventario-e-patrimonio': {
    t: 'Precisa abrir ou destravar um inventário?',
    d: 'Informe a data do falecimento, onde estão os bens e se há herdeiro menor ou no exterior.',
    wa: 'Olá! Vim pelo site. Quero entender o inventário.\nData do falecimento: \nCidade/estado dos bens: \nHá herdeiro menor ou no exterior? ',
  },
  'direito-internacional': {
    t: 'Tem uma decisão ou divórcio feito no exterior?',
    d: 'Informe o país, o que a decisão trata (guarda, pensão, bens) e onde você mora hoje.',
    wa: 'Olá! Vim pelo site. Tenho uma decisão/divórcio feito no exterior.\nPaís/estado: \nTrata de guarda, pensão ou bens? \nMoro hoje em: ',
  },
};
const EARLY_DEFAULT = {
  t: 'Quer entender como isso se aplica ao seu caso?',
  d: 'Descreva a situação em poucas linhas para uma análise inicial.',
  wa: 'Olá! Vim pelo site e gostaria de orientação sobre um assunto que li no blog.',
};
function buildEarlyCta(cluster) {
  const c = EARLY_CTA[cluster] || EARLY_DEFAULT;
  return el('aside', { className: ['early-cta'], ariaLabel: 'Contato' }, [
    el('p', { className: ['early-cta-t'] }, [txt(c.t)]),
    el('p', { className: ['early-cta-d'] }, [txt(c.d)]),
    el('p', { className: ['early-cta-a'] }, [
      el('a', { className: ['btn', 'btn--primary'], href: '#ccta-title', dataCtaPosition: 'artigo-topo' }, [txt('Enviar meu caso')]),
      txt(' '),
      el('a', { className: ['btn', 'btn--secondary'], href: WA + encodeURIComponent(c.wa), target: '_blank', rel: ['noopener', 'noreferrer'], dataCtaPosition: 'artigo-topo' }, [txt('Falar no WhatsApp')]),
    ]),
  ]);
}
const ENTRY_META = /^\s*\d{2}\/\d{2}\/\d{4}\s*•/;

export default function rehypeEditorial() {
  return (tree, file) => {
    const filePath = String((file && (file.path || (file.history && file.history[0]))) || '');
    const isBlog = /[\\/]content[\\/]blog[\\/]/.test(filePath);
    const fm = (file && file.data && file.data.astro && file.data.astro.frontmatter) || {};
    if (!tree || !Array.isArray(tree.children)) return;
    const src = tree.children;
    const out = [];
    let i = 0;
    let seenH1 = false;
    let leadDone = false;
    let h2Seen = 0;
    let earlyDone = false;

    while (i < src.length) {
      const node = src[i];

      if (node.type === 'text' && !node.value.trim()) {
        out.push(node);
        i++;
        continue;
      }

      const t = isEl(node) ? textOf(node) : node.value || '';

      // ---- CTA do artigo: antes do 2º H2 (depois da primeira seção) ----
      if (isEl(node, 'h2')) {
        if (isBlog && !earlyDone && h2Seen >= 1) {
          out.push(buildEarlyCta(fm.cluster));
          earlyDone = true;
        }
        h2Seen++;
      }

      // ---- Cauda de CTA/contato duplicada: consome até o fim do documento ----
      if (isEl(node) && seenH1 && isTailTrigger(t)) {
        const tail = src.slice(i);
        const hidden = [];
        for (let j = 0; j < tail.length; j++) {
          const tn = tail[j];
          if (tn.type === 'text' && !tn.value.trim()) continue;
          // Listas de links -> cartões visíveis (preserva internos p/ SEO/UX)
          if (isEl(tn, 'ul')) {
            const cards = buildRelated(tn);
            if (cards.children.length) {
              out.push(cards);
              continue;
            }
          }
          // Qualquer nó com link interno de conteúdo (não /contato) é preservado.
          const anchors = [];
          (function collect(x) {
            if (isEl(x, 'a')) anchors.push(x);
            if (x.children) x.children.forEach(collect);
          })(tn);
          const hasContentLink = anchors.some((a) => {
            const h = (a.properties && a.properties.href) || '';
            return typeof h === 'string' && h.startsWith('/') && h !== '/' && !h.startsWith('/contato');
          });
          if (hasContentLink) {
            addClass(tn, 'rel-inline');
            out.push(tn);
            continue;
          }
          hidden.push(tn);
        }
        if (hidden.length) {
          out.push(el('div', { className: ['legacy-cta'], hidden: true, 'aria-hidden': 'true' }, hidden));
        }
        break;
      }

      // ---- Relacionados fora da cauda ----
      if (isEl(node) && isRelatedHeader(t) && isEl(src[i + 1], 'ul')) {
        out.push(buildRelated(src[i + 1]));
        i += 2;
        continue;
      }

      // ---- FAQ -> acordeão ----
      if (isHeading(node) && /perguntas frequentes|d[úu]vidas frequentes|^faq$/i.test(t.trim())) {
        addClass(node, 'faq-h');
        out.push(node);
        i++;
        const items = [];
        while (i < src.length) {
          const n = src[i];
          if (n.type === 'text' && !n.value.trim()) {
            i++;
            continue;
          }
          if (isHeading(n)) break;
          const nt = isEl(n) ? textOf(n) : n.value || '';
          if (isEl(n) && isTailTrigger(nt)) break;
          if (isRelatedHeader(nt)) break;
          if (isQuestion(n)) {
            const q = n;
            i++;
            const a = [];
            while (i < src.length) {
              const m = src[i];
              if (m.type === 'text' && !m.value.trim()) {
                i++;
                continue;
              }
              if (isHeading(m)) break;
              const mt = isEl(m) ? textOf(m) : m.value || '';
              if (isQuestion(m) || isTailTrigger(mt) || isRelatedHeader(mt)) break;
              a.push(m);
              i++;
            }
            items.push({ q, a });
          } else {
            out.push(n);
            i++;
          }
        }
        if (items.length) out.push(buildFaq(items));
        continue;
      }

      // ---- Tabela -> wrapper responsivo ----
      if (isEl(node, 'table')) {
        out.push(el('div', { className: ['table-wrap'] }, [node]));
        i++;
        continue;
      }

      // ---- Lista ordenada -> passos + remoção de ordinal duplicado ----
      if (isEl(node, 'ol')) {
        addClass(node, 'proc-steps');
        for (const li of node.children || []) {
          if (!isEl(li, 'li')) continue;
          const ftn = firstTextNode(li);
          if (ftn) ftn.value = ftn.value.replace(/^\s*\d+(?=\D)/, '').replace(/^\s+/, '');
        }
        out.push(node);
        i++;
        continue;
      }

      // ---- Eyebrow: parágrafo antes do primeiro H1 ----
      if (!seenH1 && isEl(node, 'p') && textOf(node).trim() && !isCtaPair(node)) {
        addClass(node, 'eyebrow');
        out.push(node);
        i++;
        continue;
      }

      if (isEl(node, 'h1')) {
        seenH1 = true;
        out.push(node);
        i++;
        continue;
      }

      // ---- Pares de CTA -> botões ----
      if (isCtaPair(node)) {
        addClass(node, 'cta-inline');
        out.push(node);
        i++;
        continue;
      }

      // ---- Linha de data/autor do artigo ("07/11/2026•6 min de leitura•Por …") ----
      if (seenH1 && !leadDone && isEl(node, 'p') && ENTRY_META.test(textOf(node))) {
        addClass(node, 'entry-meta');
        (function sep(x) {
          if (x.type === 'text') x.value = x.value.replace(/\s*•\s*/g, ' · ');
          if (x.children) x.children.forEach(sep);
        })(node);
        out.push(node);
        i++;
        continue;
      }

      // ---- Lead: primeiro parágrafo após o H1 ----
      if (seenH1 && !leadDone && isEl(node, 'p') && textOf(node).trim()) {
        addClass(node, 'lead');
        leadDone = true;
        out.push(node);
        i++;
        continue;
      }

      out.push(node);
      i++;
    }

    // Data visível (25/11/2026): artigos e guias sem linha de data ganham
    // "Publicado em · Atualizado em · Por" logo abaixo do H1, a partir do frontmatter.
    const isGuia = /[\\/]content[\\/]guias[\\/]/.test(filePath);
    if ((isBlog || isGuia) && !out.some((n) => isEl(n) && hasClass(n, 'entry-meta'))) {
      const h1i = out.findIndex((n) => isEl(n, 'h1'));
      const fmt = (d) => {
        if (!d) return '';
        const x = new Date(d);
        if (isNaN(x)) return '';
        const z = (n) => String(n).padStart(2, '0');
        return `${z(x.getUTCDate())}/${z(x.getUTCMonth() + 1)}/${x.getUTCFullYear()}`;
      };
      const pub = isBlog ? fmt(fm.pubDate) : '';
      const upd = fmt(fm.updatedDate);
      const parts = [];
      if (pub) parts.push(`Publicado em ${pub}`);
      if (upd && upd !== pub) parts.push(`Atualizado em ${upd}`);
      if (h1i !== -1 && parts.length) {
        const meta = el('p', { className: ['entry-meta'] }, [
          { type: 'text', value: parts.join(' · ') + ' · Por ' },
          el('a', { href: '/o-escritorio/#alexandre-correa-lima' }, [{ type: 'text', value: 'Alexandre Corrêa Lima' }]),
        ]);
        out.splice(h1i + 1, 0, { type: 'text', value: '\n' }, meta);
      }
    }
    tree.children = out;
  };
}
