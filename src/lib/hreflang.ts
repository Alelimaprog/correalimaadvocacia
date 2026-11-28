/**
 * hreflang (28/11/2026) — pares de páginas equivalentes por idioma.
 * Fonte única: o BaseLayout emite os <link rel="alternate"> nas DUAS pontas
 * (recíprocos, exigência do Google) + x-default apontando a versão em português.
 */
export const pares: { pt: string; en?: string; es?: string }[] = [
  { pt: '/', en: '/en/' },
  { pt: '/areas-de-atuacao/direito-aduaneiro-tributario/retencao-de-mercadorias/', en: '/en/customs-seizure-brazil/' },
  { pt: '/areas-de-atuacao/direito-maritimo-portuario/demurrage-e-detention-de-conteiner/', en: '/en/container-demurrage-brazil/' },
  { pt: '/areas-de-atuacao/homologacao-de-sentenca-estrangeira/', en: '/en/recognition-of-foreign-judgments-brazil/' },
  { pt: '/areas-de-atuacao/inventario-com-herdeiro-no-exterior/', en: '/en/probate-in-brazil-heirs-abroad/' },
  { pt: '/areas-de-atuacao/direito-maritimo-portuario/', en: '/en/brazilian-maritime-and-port-law/' },
];

export function alternatesFor(pathname: string): { hreflang: string; path: string }[] {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  const par = pares.find((x) => x.pt === p || x.en === p || x.es === p);
  if (!par) return [];
  const out = [{ hreflang: 'pt-BR', path: par.pt }];
  if (par.en) out.push({ hreflang: 'en', path: par.en });
  if (par.es) out.push({ hreflang: 'es', path: par.es });
  out.push({ hreflang: 'x-default', path: par.pt });
  return out;
}
