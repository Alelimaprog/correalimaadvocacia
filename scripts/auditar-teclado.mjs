/**
 * auditar-teclado.mjs — navegação por teclado e movimento reduzido.
 *
 * Cobre o que as outras auditorias não alcançam: se cada alvo tabulável mostra
 * onde o foco está, se o atalho de pular conteúdo é o primeiro da ordem, se o
 * mega-menu e o menu móvel abrem, fecham no Escape e devolvem o foco ao
 * gatilho, e se `prefers-reduced-motion` neutraliza a revelação ao rolar.
 *
 *   npm run build && node scripts/auditar-teclado.mjs
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
const DIST = process.argv[2] ?? 'dist';
const M={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon','.webp':'image/webp','.jpg':'image/jpeg','.json':'application/json'};
const s=createServer(async(q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';try{const b=await readFile(join(DIST,p));r.writeHead(200,{'content-type':M[extname(p)]||'application/octet-stream'});r.end(b);}catch{r.writeHead(404);r.end();}});
await new Promise(r=>s.listen(4425,r));
const b=await chromium.launch();

// ── 1. Foco visível nos 25 primeiros alvos de /, /contato/ e /areas-de-atuacao/
for (const rota of ['/', '/contato/', '/areas-de-atuacao/']) {
  const pg=await b.newPage({viewport:{width:1440,height:900}});
  await pg.goto('http://127.0.0.1:4425'+rota,{waitUntil:'networkidle'});
  await pg.evaluate(() => document.getElementById('cl-consent')?.remove());
  const semFoco = [];
  for (let i=0;i<25;i++) {
    await pg.keyboard.press('Tab');
    const r = await pg.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const anel = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
      const sombra = cs.boxShadow && cs.boxShadow !== 'none';
      const borda = cs.borderColor;
      return { tag: el.tagName, txt: (el.textContent||'').trim().slice(0,24), anel, sombra, cls: (typeof el.className==='string'?el.className.split(' ')[0]:'') };
    });
    if (r && !r.anel && !r.sombra) semFoco.push(`${r.tag}.${r.cls} "${r.txt}"`);
  }
  console.log(`${rota}  sem indicador de foco: ${semFoco.length ? semFoco.join(' | ') : 'nenhum'}`);
  await pg.close();
}

// ── 2. Primeiro Tab chega ao "Pular para o conteúdo"?
const pg=await b.newPage({viewport:{width:1440,height:900}});
await pg.goto('http://127.0.0.1:4425/',{waitUntil:'networkidle'});
await pg.keyboard.press('Tab');
console.log('primeiro Tab ->', await pg.evaluate(() => document.activeElement?.className + ' / ' + document.activeElement?.textContent?.trim()));

// ── 3. Mega-menu por teclado: abre, Escape fecha, foco volta
await pg.evaluate(() => document.querySelector("button[aria-controls='areas-menu']").focus());
await pg.keyboard.press('Enter');
console.log('mega aberto ->', await pg.evaluate(() => document.querySelector("button[aria-controls='areas-menu']").getAttribute('aria-expanded')));
await pg.keyboard.press('Escape');
console.log('após Escape ->', await pg.evaluate(() => document.querySelector("button[aria-controls='areas-menu']").getAttribute('aria-expanded') + ' / foco em ' + document.activeElement?.tagName));

// ── 4. Menu móvel: abre, trava o scroll, Escape fecha
const pm=await b.newPage({viewport:{width:390,height:844}});
await pm.goto('http://127.0.0.1:4425/',{waitUntil:'networkidle'});
await pm.click('.burger');
console.log('menu móvel ->', await pm.evaluate(() => ({ expandido: document.querySelector('.burger').getAttribute('aria-expanded'), scrollTravado: document.body.style.overflow, painelVisivel: !document.querySelector('.panel').hidden })));
await pm.keyboard.press('Escape');
console.log('após Escape ->', await pm.evaluate(() => ({ expandido: document.querySelector('.burger').getAttribute('aria-expanded'), scrollTravado: document.body.style.overflow || '(livre)' })));

// ── 5. prefers-reduced-motion
const pr=await b.newPage({viewport:{width:1440,height:900}, reducedMotion:'reduce'});
await pr.goto('http://127.0.0.1:4425/',{waitUntil:'networkidle'});
console.log('reduced-motion ->', await pr.evaluate(() => {
  const el = document.querySelector('[data-reveal]');
  const cs = getComputedStyle(el);
  return { opacidade: cs.opacity, transform: cs.transform, duracao: cs.transitionDuration };
}));
await b.close(); s.close();
