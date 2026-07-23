/**
 * navigation.ts — Fonte única de navegação (DRY), consumida por Navigation,
 * MobileMenu e Footer. Reflete o novo posicionamento (Sprint 1): menu enxuto
 * com o dropdown "Áreas de Atuação" apresentando os seis núcleos e "Conteúdos"
 * agrupando Artigos, Guias e Assuntos.
 */
import { nucleos } from './nucleos';

export interface NavLink {
  label: string;
  href: string;
}

/** Links simples do topo, antes dos dropdowns. */
export const mainNav: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'O Escritório', href: '/o-escritorio/' },
];

/** Dropdown "Áreas de Atuação" — os seis núcleos. */
export const areasMenu = {
  label: 'Áreas de Atuação',
  href: '/areas-de-atuacao/',
  items: nucleos.map((n) => ({ label: n.label, href: n.href, short: n.short, icon: n.icon })),
  viewAll: { label: 'Ver todas as áreas', href: '/areas-de-atuacao/' } as NavLink,
};

/** Dropdown "Conteúdos". */
export const conteudosMenu = {
  label: 'Conteúdos',
  href: '/blog/',
  items: [
    { label: 'Artigos', href: '/blog/' },
    { label: 'Guias', href: '/guias/' },
    { label: 'Assuntos', href: '/assuntos/' },
  ] as NavLink[],
};

/** Link de contato (fim do menu). */
export const contatoLink: NavLink = { label: 'Contato', href: '/contato/' };

/** Rodapé — coluna dos seis núcleos. */
export const footerNucleos: NavLink[] = nucleos.map((n) => ({ label: n.label, href: n.href }));

/** Rodapé — coluna institucional. */
export const footerInstitucional: NavLink[] = [
  { label: 'Início', href: '/' },
  { label: 'O Escritório', href: '/o-escritorio/' },
  { label: 'Áreas de Atuação', href: '/areas-de-atuacao/' },
  { label: 'Conteúdos', href: '/blog/' },
  { label: 'Guias', href: '/guias/' },
  { label: 'Ferramentas', href: '/ferramentas/' },
  { label: 'Contato', href: '/contato/' },
];

/** Links legais do rodapé. */
export const legalNav: NavLink[] = [
  { label: 'Política de Privacidade', href: '/politica-de-privacidade/' },
  { label: 'Termos de Uso', href: '/termos-de-uso/' },
  { label: 'LGPD / Tratamento de Dados', href: '/lgpd/' },
];

/** Marca uma URL como ativa comparando com o pathname atual (com barra final). */
export function isActive(current: string, href: string): boolean {
  if (href === '/') return current === '/';
  return current === href || current.startsWith(href);
}
