// Teste de navegador das calculadoras (desktop e celular). Uso:
//   npm run build && npx astro preview --port 4321 &  node tests/e2e-ferramentas.mjs
// CHROME_PATH aponta o executável do Chrome se o Playwright não tiver o próprio navegador.
import { chromium, devices } from 'playwright';

const B = process.env.BASE_URL || 'http://localhost:4321';
const out = [];
const ok = (n, c, d = '') => out.push({ teste: n, ok: !!c, d });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

for (const [nome, ctxOpt] of [['desktop', { viewport: { width: 1366, height: 900 } }], ['mobile', devices['Pixel 7']]]) {
  const ctx = await browser.newContext(ctxOpt);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  p.on('console', (m) => { if (m.type() === 'error' && !/googletagmanager|clarity|ERR_TUNNEL_CONNECTION_FAILED|ERR_NAME_NOT_RESOLVED/.test(m.text())) errs.push(m.text()); });

  await p.goto(B + '/ferramentas/calculadora-de-demurrage/');
  await p.fill('[name=dias]', '30'); await p.fill('[name=free]', '7'); await p.fill('[name=qtd]', '2'); await p.fill('[name=cambio]', '5');
  await p.$eval('form#f', (f) => f.requestSubmit());
  const tot = await p.textContent('#total');
  ok(`${nome} demurrage total`, tot.includes('7.100,00') && tot.includes('35.500,00'), tot);
  await p.fill('[name=dias]', ''); await p.fill('[name=inicio]', '2026-03-10'); await p.fill('[name=fim]', '2026-03-01');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} demurrage datas invertidas gera erro`, await p.isVisible('#erros'));
  await p.fill('[name=inicio]', '2026-03-01'); await p.fill('[name=fim]', '2026-03-30');
  await p.$eval('form#f', (f) => f.requestSubmit());
  const resumo = await p.textContent('#resumo');
  ok(`${nome} demurrage por datas (30 dias)`, resumo.startsWith('30 dias'), resumo);
  await p.fill('[name=free]', 'abc'); await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} demurrage free time inválido gera erro`, await p.isVisible('#erros'));

  await p.goto(B + '/ferramentas/simulador-de-tributos-na-importacao/');
  await p.fill('[name=fob]', '10.000,00'); await p.fill('[name=frete]', '1000'); await p.fill('[name=seguro]', '100');
  await p.fill('[name=cambio]', '5'); await p.fill('[name=aII]', '14'); await p.fill('[name=aIPI]', '10'); await p.fill('[name=qtd]', '100');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} tributos ICMS 16.796,69`, (await p.textContent('#linhas')).includes('16.796,69'));
  await p.fill('[name=fob]', ''); await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} tributos FOB vazio gera erro`, await p.isVisible('#erros'));

  await p.goto(B + '/ferramentas/validador-de-conteiner/');
  await p.fill('[name=lista]', 'CSQU3054383\nCSQU3054384\n<img src=x onerror=alert(1)>\nCSQU305438');
  await p.$eval('form#f', (f) => f.requestSubmit());
  const t = await p.textContent('#linhas');
  ok(`${nome} contêiner válido, incorreto, inválido e cálculo do dígito`, t.includes('Válido') && t.includes('correto 3') && t.includes('Formato inválido') && t.includes('Dígito calculado: 3'), t.slice(0, 200));
  ok(`${nome} contêiner não injeta HTML`, (await p.$$('#linhas img')).length === 0);

  await p.goto(B + '/ferramentas/calculadora-de-cubagem/');
  await p.fill('[name=c]', '100'); await p.fill('[name=l]', '100'); await p.fill('[name=a]', '100'); await p.fill('[name=v]', '2'); await p.fill('[name=p]', '150');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} cubagem 2 m³`, (await p.textContent('#m3')).includes('2,000'));

  for (const u of ['calculadora-de-demurrage', 'simulador-de-tributos-na-importacao', 'validador-de-conteiner', 'calculadora-de-cubagem', '']) {
    await p.goto(B + '/ferramentas/' + (u ? u + '/' : ''));
    const w = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(`${nome} sem rolagem horizontal ${u || 'índice'}`, w <= 1, String(w));
    const semRotulo = await p.evaluate(() => [...document.querySelectorAll('.calc-form input, .calc-form select, .calc-form textarea')].filter((i) => !i.closest('label')).length);
    ok(`${nome} todos os campos com rótulo ${u || 'índice'}`, semRotulo === 0, String(semRotulo));
  }
  ok(`${nome} sem erros de JavaScript`, errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await browser.close();
const falhas = out.filter((x) => !x.ok);
console.log(JSON.stringify({ total: out.length, aprovados: out.length - falhas.length, falhas }, null, 1));
process.exit(falhas.length ? 1 : 0);
