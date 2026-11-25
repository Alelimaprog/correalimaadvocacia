/**
 * Atribuição de origem dos contatos (sem cookies): registra a página de entrada
 * da sessão (sessionStorage), a página onde o formulário foi enviado e os UTMs.
 * Também pré-seleciona o assunto a partir de /contato/?area=<slug ou nome>.
 */
const KEY = 'cl_landing';

function safeGet(k: string): string | null { try { return sessionStorage.getItem(k); } catch { return null; } }
function safeSet(k: string, v: string) { try { sessionStorage.setItem(k, v); } catch { /* sem storage */ } }

/** Chamado em todas as páginas: memoriza a primeira página da sessão e os UTMs. */
export function rememberLanding() {
  const q = new URLSearchParams(location.search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].map((k) => q.get(k)).filter(Boolean).join('/');
  // Identificadores de clique de anúncio (Google e Meta).
  const click = ['gclid', 'gbraid', 'wbraid', 'fbclid'].map((k) => (q.get(k) ? `${k}=${q.get(k)}` : '')).filter(Boolean).join('&');
  // Uma nova visita vinda de campanha substitui a origem já gravada na sessão.
  if (safeGet(KEY) && !utm && !click) return;
  let ref = 'direto';
  try { if (document.referrer) ref = new URL(document.referrer).hostname; } catch { /* noop */ }
  safeSet(KEY, JSON.stringify({ page: location.pathname, utm, ref, click }));
}

export function fillOriginFields(form: HTMLFormElement) {
  rememberLanding();
  let landing: { page?: string; utm?: string; ref?: string; click?: string } = {};
  try { landing = JSON.parse(safeGet(KEY) || '{}'); } catch { landing = {}; }
  let from = location.pathname;
  try {
    if (document.referrer && new URL(document.referrer).origin === location.origin) from = new URL(document.referrer).pathname;
  } catch { /* noop */ }
  const set = (sel: string, v: string) => { const el = form.querySelector(sel) as HTMLInputElement | null; if (el) el.value = v; };
  set('[data-origin="page"]', from);
  set('[data-origin="landing"]', `${landing.page || ''} (de: ${landing.ref || 'direto'})`);
  set('[data-origin="utm"]', [landing.utm, landing.click].filter(Boolean).join(' | '));
}

const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function preselectArea(select: HTMLSelectElement | null) {
  if (!select) return;
  // Sem ?area=, o caminho da página (fora de /contato/) indica o assunto.
  const raw = new URLSearchParams(location.search).get('area') || (location.pathname.startsWith('/contato') ? '' : location.pathname);
  if (!raw) return;
  const v = norm(raw);
  const opts = Array.from(select.options);
  let hit = opts.find((o) => o.dataset.slug === v);
  if (!hit) {
    // links antigos com o nome por extenso: casa pelas palavras-chave de cada assunto
    const keys: Record<string, string[]> = JSON.parse(select.dataset.keys || '{}');
    hit = opts.find((o) => (keys[o.dataset.slug || ''] || []).some((k) => v.includes(k)));
  }
  if (hit) select.value = hit.value;
}
