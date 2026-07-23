/**
 * Configuração central do site — fonte única de verdade para dados
 * institucionais, contato, rastreamento e SEO padrão.
 *
 * Todos os valores foram extraídos do export atual (Fase 0), sem invenção.
 * Alterações de dados do escritório devem ser feitas aqui, num único lugar (DRY).
 */

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
  themeColor: '#0b7d45',
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
};

/** Mensagem de WhatsApp adequada a um caminho (pathname com barra final). */
export function whatsappMessageForPath(pathname: string): string {
  const segments = (pathname || '').split('/').filter(Boolean);
  for (const seg of segments) {
    if (WA_MESSAGES[seg]) return WA_MESSAGES[seg];
  }
  if (pathname.startsWith('/blog/')) {
    return `${WA_INTRO}um assunto que li no blog do escritório.`;
  }
  if (pathname.startsWith('/guias/')) {
    return `${WA_INTRO}um tema de um dos guias do escritório.`;
  }
  return site.contact.whatsapp.message;
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
