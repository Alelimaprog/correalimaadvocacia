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

  await p.goto(B + '/ferramentas/atualizacao-de-divida/');
  await p.fill('[name=valor]', '1.000,00'); await p.fill('[name=inicio]', '2026-01-01'); await p.fill('[name=fim]', '2026-04-01');
  await p.selectOption('[name=indice]', ''); await p.selectOption('[name=juros]', 'simples'); await p.fill('[name=taxa]', '1'); await p.fill('[name=multa]', '2');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} dívida: 1.000 + 3% juros + 2% multa = 1.050,00`, (await p.textContent('#total')).includes('1.050,00'), await p.textContent('#total'));
  await p.goto(B + '/ferramentas/calculadora-de-condominio-atrasado/');
  await p.fill('[name=venc]', '2026-01-10'); await p.fill('[name=val]', '500'); await p.fill('[name=fim]', '2026-04-10');
  await p.selectOption('[name=indice]', '');
  await p.$eval('#serie', (b) => b.click());
  ok(`${nome} condomínio gera 3 cotas mensais`, (await p.$$('[data-cota]')).length === 3, String((await p.$$('[data-cota]')).length));
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} condomínio soma total`, await p.isVisible('#res'), await p.textContent('#tt'));
  await p.fill('[name=multa]', '5'); await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} condomínio recusa multa acima de 2%`, await p.isVisible('#erros'));
  await p.goto(B + '/ferramentas/simulador-de-multas-aduaneiras/');
  await p.fill('[name=va]', '100.000,00'); await p.fill('[name=dif]', '10.000,00');
  await p.$eval('input[value=oficio]', (i) => { i.checked = true; }); await p.$eval('input[value=substitutiva]', (i) => { i.checked = true; });
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} multas: 7.500 + 100.000 = 107.500,00`, (await p.textContent('#total')).includes('107.500,00'), await p.textContent('#total'));
  await p.$eval('input[value=oficio]', (i) => { i.checked = false; }); await p.$eval('input[value=substitutiva]', (i) => { i.checked = false; }); await p.$eval('input[value=informacao]', (i) => { i.checked = true; });
  await p.selectOption('[name=regime]', 'lc227'); await p.fill('[name=va]', '500.000,00');
  await p.$eval('form#f', (f) => f.requestSubmit());
  const t2 = await p.textContent('#total');
  ok(`${nome} multas LC 227 mostra faixa piso/teto`, t2.includes('5.000,00') && t2.includes('10.000,00') && (await p.textContent('#linhas')).includes('em discussão'), t2);
  await p.goto(B + '/ferramentas/calculadora-de-prazos-de-prescricao/');
  await p.selectOption('[name=situacao]', 'condominio'); await p.fill('[name=data]', '2022-01-10'); await p.fill('[name=hoje]', '2026-11-28');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} prescrição condomínio 10/01/2027`, (await p.textContent('#limite')) === '10/01/2027' && (await p.textContent('#status')).includes('43 dia'), await p.textContent('#limite'));
  ok(`${nome} prescrição mostra aviso de interrupção`, (await p.textContent('#notas')).includes('Suspensão e interrupção'));
  await p.selectOption('[name=situacao]', 'cheque');
  ok(`${nome} prescrição cheque mostra campo de praça`, await p.isVisible('[name=praca]'));
  await p.selectOption('[name=praca]', 'outra'); await p.fill('[name=data]', '2026-03-01');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} prescrição cheque outra praça 30/10/2026`, (await p.textContent('#limite')) === '30/10/2026', await p.textContent('#limite'));
  await p.fill('[name=data]', ''); await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} prescrição sem data gera erro`, await p.isVisible('#erros'));

  await p.goto(B + '/ferramentas/simulador-de-partilha/');
  await p.selectOption('[name=conjuge]', 'casamento'); await p.selectOption('[name=regime]', 'parcial');
  await p.fill('[name=comuns]', '600.000,00'); await p.fill('[name=particulares]', '300.000,00'); await p.fill('[name=filhos]', '2');
  await p.$eval('form#f', (f) => f.requestSubmit());
  const rp = await p.textContent('#resumo'); const lp = await p.textContent('#linhas');
  ok(`${nome} partilha: meação 300 mil, cônjuge 100 mil, filhos 250 mil`, rp.includes('300.000,00') && rp.includes('100.000,00') && lp.includes('250.000,00'), rp + ' | ' + lp);
  ok(`${nome} partilha mostra controvérsia da comunhão parcial`, (await p.textContent('#avisos')).includes('controvertido'));
  await p.fill('[name=filhos]', '0'); await p.$eval('[name=pai]', (i) => { i.checked = true; }); await p.$eval('[name=mae]', (i) => { i.checked = true; });
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} partilha com pais: 1/3 cada (200.000,00)`, (await p.textContent('#linhas')).includes('200.000,00'), await p.textContent('#linhas'));
  await p.fill('[name=netos]', '<b>x</b>'); await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} partilha recusa lista inválida sem injetar HTML`, (await p.isVisible('#erros')) && (await p.$$('#erros b')).length === 0);
  await p.fill('[name=netos]', ''); await p.fill('[name=comuns]', ''); await p.fill('[name=particulares]', '');
  await p.$eval('form#f', (f) => f.requestSubmit());
  ok(`${nome} partilha sem bens gera erro`, await p.isVisible('#erros'));
  for (const u of ['calculadora-de-demurrage', 'simulador-de-tributos-na-importacao', 'validador-de-conteiner', 'calculadora-de-cubagem', 'atualizacao-de-divida', 'calculadora-de-condominio-atrasado', 'simulador-de-multas-aduaneiras', 'calculadora-de-prazos-de-prescricao', 'simulador-de-partilha', '']) {
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
