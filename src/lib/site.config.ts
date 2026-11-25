/**
 * Configuração central do site — fonte única de verdade para dados
 * institucionais, contato, rastreamento e SEO padrão.
 *
 * Todos os valores foram extraídos do export atual (Fase 0), sem invenção.
 * Alterações de dados do escritório devem ser feitas aqui, num único lugar (DRY).
 */

import waGroups from './_wa-groups.json';

export interface SiteConfig {
  /** Domínio canônico, sem www e sem barra final. */
  url: string;
  name: string;
  shortName: string;
  locale: string;
  /** Sufixo aplicado aos titles das páginas internas. */
  titleTemplate: string;
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
  themeColor: string;
  attorney: {
    name: string;
    oab: string;
  };
  contact: {
    email: string;
    whatsapp: {
      /** Número em formato internacional, somente dígitos (para wa.me). */
      number: string;
      /** Exibição amigável. */
      display: string;
      /** Mensagem pré-preenchida no WhatsApp. */
      message: string;
    };
    /** Endereço oficial do escritório. */
    address: {
      street: string;
      detail: string;
      district: string;
      city: string;
      state: string;
      cep: string;
      /** Linha única para exibição. */
      full: string;
    };
  };
  analytics: {
    /** Google Analytics 4 (preservado do site atual). */
    ga4Id: string;
    /** Microsoft Clarity (preservado do site atual). */
    clarityId: string;
    /**
     * Código do <meta name="google-site-verification">, fornecido pelo Google
     * Search Console. Deixe vazio até receber o código real — o meta só é
     * emitido quando preenchido. NÃO inventar valor.
     */
    searchConsoleVerification?: string;
  };
  /**
   * Configuração do formulário de contato.
   * A implementação PHP/PHPMailer é da Fase 8 — aqui ficam apenas os
   * parâmetros públicos (endpoint e destino). Nenhuma credencial mora no código.
   */
  form: {
    endpoint: string;
    successUrl: string;
    to: string;
    honeypotField: string;
  };
}

export const site: SiteConfig = {
  url: 'https://correalimaadvocacia.com.br',
  name: 'Corrêa Lima Advocacia',
  shortName: 'Corrêa Lima',
  locale: 'pt-BR',
  titleTemplate: '%s | Corrêa Lima Advocacia',
  defaultTitle: 'Advocacia Empresarial, Internacional e Patrimonial | Corrêa Lima Advocacia',
  defaultDescription:
    'Advocacia empresarial, contratos de importação, execuções, homologação de sentença estrangeira e questões patrimoniais conduzidas com técnica, estratégia e atendimento personalizado.',
  ogImage: '/og-image.png',
  themeColor: '#10233b',
  attorney: {
    name: 'Alexandre Corrêa Lima',
    oab: 'OAB/SP 234511',
  },
  contact: {
    email: 'contato@correalimaadvocacia.com.br',
    whatsapp: {
      number: '5511975025611',
      display: '+55 11 97502-5611',
      message:
        'Olá, gostaria de orientação jurídica e encontrei o site da Corrêa Lima Advocacia.',
    },
    address: {
      street: 'R. Verbo Divino, 2001',
      detail: 'Bloco B – Conjunto 902',
      district: 'Chácara Santo Antônio',
      city: 'São Paulo',
      state: 'SP',
      cep: '04719-002',
      full: 'R. Verbo Divino, 2001 – Bloco B, Conj. 902 · Chácara Santo Antônio, São Paulo – SP · CEP 04719-002',
    },
  },
  analytics: {
    ga4Id: 'G-X02G8F65VJ',
    clarityId: 'xjsq94igak',
    searchConsoleVerification: '', // <- preencher com o código do Search Console
  },
  form: {
    /** Endpoint real de envio (Formspree). A implementação PHP anterior foi
     *  descontinuada; toda a configuração reflete exclusivamente o Formspree. */
    endpoint: 'https://formspree.io/f/meebnnvj',
    successUrl: '/contato/obrigado/',
    to: 'contato@correalimaadvocacia.com.br',
    honeypotField: 'website',
  },
};

/** Link wa.me completo, já com a mensagem pré-preenchida. */
export const whatsappHref = `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(
  site.contact.whatsapp.message,
)}`;

/**
 * ETAPA 18 — mensagens de WhatsApp personalizadas por página.
 * Mapa por segmento de URL (núcleos e principais subáreas). A mensagem reflete
 * a origem do contato, aumentando a qualidade do lead e a taxa de resposta.
 */
const WA_INTRO = 'Olá! Encontrei o site da Corrêa Lima Advocacia e gostaria de orientação sobre ';
const WA_MESSAGES: Record<string, string> = {
  'recuperacao-de-credito': `${WA_INTRO}recuperação de crédito / cobrança e execução.`,
  'execucao-cobranca-recuperacao-de-credito': `${WA_INTRO}execução e cobrança de valores devidos.`,
  'habilitacao-e-impugnacao-de-credito': `${WA_INTRO}habilitação ou impugnação de crédito.`,
  'cobranca-condominial': `${WA_INTRO}cobrança de cotas condominiais em atraso.`,
  'cobranca-condominial-recuperacao-de-inadimplencia': `${WA_INTRO}recuperação de inadimplência condominial.`,
  'direito-ambiental': `${WA_INTRO}uma questão de direito ambiental (multa, embargo ou área protegida).`,
  'direito-aduaneiro-tributario': `${WA_INTRO}direito aduaneiro-tributário (retenção de mercadoria, multa ou autuação).`,
  'assessoria-juridica-para-importadores': `${WA_INTRO}assessoria jurídica para importação.`,
  'contratos-de-importacao-comercio-exterior': `${WA_INTRO}contratos de importação / comércio exterior.`,
  'direito-internacional': `${WA_INTRO}uma demanda de direito internacional.`,
  'homologacao-de-sentenca-estrangeira': `${WA_INTRO}homologação de sentença estrangeira no Brasil.`,
  'homologacao-de-divorcio-estrangeiro': `${WA_INTRO}homologação de divórcio realizado no exterior.`,
  'reconhecimento-de-decisoes-estrangeiras': `${WA_INTRO}reconhecimento de decisão estrangeira no Brasil.`,
  'inventario-e-patrimonio': `${WA_INTRO}inventário e questões patrimoniais.`,
  'inventario-e-partilha': `${WA_INTRO}inventário e partilha de bens.`,
  'inventario-com-herdeiro-no-exterior': `${WA_INTRO}inventário com herdeiro no exterior.`,
  'divorcio-e-questoes-patrimoniais': `${WA_INTRO}divórcio e partilha de patrimônio.`,
  'retencao-de-mercadorias': `${WA_INTRO}mercadoria retida na importação.`,
  'pena-de-perdimento': `${WA_INTRO}pena de perdimento de mercadoria importada.`,
  'defesa-administrativa-aduaneira': `${WA_INTRO}defesa em autuação aduaneira.`,
  'classificacao-fiscal-ncm': `${WA_INTRO}classificação fiscal (NCM) e tributação na importação.`,
  'inventario-extrajudicial': `${WA_INTRO}inventário em cartório.`,
  'inventario-judicial': `${WA_INTRO}inventário judicial.`,
  'planejamento-sucessorio': `${WA_INTRO}planejamento sucessório.`,
};

/**
 * Código curto de referência da página (atribuição no atendimento).
 * Ex.: /areas-de-atuacao/homologacao-de-divorcio-estrangeiro/ -> "homologacao-de-divorcio-estrangeiro".
 */
export function pageRef(pathname: string): string {
  const segs = (pathname || '').split('/').filter(Boolean);
  if (segs.length === 0) return 'home';
  return segs[segs.length - 1].slice(0, 60);
}

/**
 * Rodada 4 (13/11/2026): nas três frentes principais a mensagem já vem com o
 * roteiro do primeiro contato (o que informar), para o atendimento começar com
 * os dados certos. Mapa caminho -> roteiro em _wa-groups.json.
 *   A = aduaneiro · I = inventário · H = homologação / decisão estrangeira
 */
export const WA_ROTEIROS: Record<string, string> = {
  A: 'Olá! Vim pelo site. Tenho uma questão aduaneira na importação.\nDI/DUIMP: \nCanal (vermelho/cinza): \nPorto/aeroporto: \nHá exigência ou auto de infração? ',
  I: 'Olá! Vim pelo site. Quero entender o inventário.\nData do falecimento: \nCidade/estado dos bens: \nHá herdeiro menor ou no exterior? ',
  H: 'Olá! Vim pelo site. Tenho um divórcio/decisão feito no exterior.\nPaís/estado: \nTrata de guarda, pensão ou bens? \nMoro hoje em: ',
};
const WA_PAGE_GROUPS = waGroups as Record<string, string>;

/** Mensagem de WhatsApp adequada a um caminho (pathname com barra final), com referência da página. */
export function whatsappMessageForPath(pathname: string): string {
  const key = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const grupo = WA_PAGE_GROUPS[key];
  if (grupo && WA_ROTEIROS[grupo]) return `${WA_ROTEIROS[grupo]} (ref.: ${pageRef(pathname)})`;
  const segments = (pathname || '').split('/').filter(Boolean);
  let msg = site.contact.whatsapp.message;
  let found = false;
  for (let i = segments.length - 1; i >= 0; i--) {
    if (WA_MESSAGES[segments[i]]) { msg = WA_MESSAGES[segments[i]]; found = true; break; }
  }
  if (!found && pathname.startsWith('/blog/')) msg = `${WA_INTRO}um assunto que li no blog do escritório.`;
  else if (!found && pathname.startsWith('/guias/')) msg = `${WA_INTRO}um tema de um dos guias do escritório.`;
  return `${msg} (ref.: ${pageRef(pathname)})`;
}

/** Link wa.me contextual para um caminho. */
export function whatsappHrefForPath(pathname: string): string {
  return `https://wa.me/${site.contact.whatsapp.number}?text=${encodeURIComponent(
    whatsappMessageForPath(pathname),
  )}`;
}

/** Monta o title final a partir do padrão do site. */
export function buildTitle(title?: string): string {
  if (!title) return site.defaultTitle;
  return site.titleTemplate.replace('%s', title);
}

/** Resolve uma URL absoluta canônica a partir de um path (com barra final). */
export function canonicalUrl(pathname: string): string {
  const path = pathname.endsWith('/') || pathname.includes('.') ? pathname : `${pathname}/`;
  return new URL(path, `${site.url}/`).href;
}

/**
 * Lista ÚNICA de assuntos dos formulários (home e /contato/).
 * `slug` é usado em /contato/?area=<slug>; `keys` permite pré-selecionar a
 * partir de links antigos que passam o nome da área por extenso.
 */
export interface ContactArea { slug: string; label: string; keys: string[] }
export const contactAreas: ContactArea[] = [
  { slug: 'aduaneiro', label: 'Mercadoria retida, perdimento ou outra questão aduaneira', keys: ['aduane', 'importa', 'mercadoria', 'perdimento', 'comercio exterior', 'ncm'] },
  { slug: 'inventario', label: 'Inventário, herança e sucessões', keys: ['invent', 'sucess', 'heranca', 'herdeiro', 'patrimon', 'planejamento'] },
  { slug: 'homologacao', label: 'Homologação de sentença ou divórcio estrangeiro', keys: ['homolog', 'estrangeir', 'divorcio', 'internacional', 'reconhecimento'] },
  { slug: 'credito', label: 'Cobrança, execução, crédito e condomínio', keys: ['credito', 'cobranca', 'execu', 'condomin', 'habilita', 'falencia', 'recuperacao judicial'] },
  { slug: 'empresarial', label: 'Contratos, contencioso e trabalhista (empresas)', keys: ['empresar', 'contrato', 'societ', 'contencioso', 'criminal', 'trabalhista'] },
  { slug: 'ambiental', label: 'Direito ambiental', keys: ['ambiental'] },
  { slug: 'outro', label: 'Outro assunto', keys: [] },
];
