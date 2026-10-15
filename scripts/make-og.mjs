// Renders the 1200x630 link-preview card into public/og.png.
//
// The card is the site's cover at a smaller size: the name in the condensed
// headline face, the black and white portrait on the carmine block, on ink. A
// preview in LinkedIn, WhatsApp or an email then looks like the page it opens.
//
//   CHROME=<chromium binary> node scripts/make-og.mjs
//
// CHROME is optional; without it Playwright's own Chromium is used.
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const OUT = 'public/og.png';

// Read the palette out of tailwind.config.js so this cannot drift from the site.
const cfg = await readFile('tailwind.config.js', 'utf8');
const color = (key) => cfg.match(new RegExp(`\\b${key}:\\s*'(#[0-9a-fA-F]{6})'`))[1];
const INK = cfg.match(/ink:\s*\{\s*DEFAULT:\s*'(#[0-9a-fA-F]{6})'/)[1];
const BONE = color('bone');
const CARMINE = color('carmine');

const b64 = async (file) => (await readFile(file)).toString('base64');
const archivo = await b64('node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2');
const portrait = await b64('src/assets/pfp-nobg.webp');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url(data:font/woff2;base64,${archivo}) format('woff2-variations');font-weight:100 900;font-stretch:62% 125%}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:${INK};color:${BONE};font-family:Archivo,sans-serif;position:relative;overflow:hidden}
.block{position:absolute;top:0;right:0;bottom:0;width:36%;background:${CARMINE}}
h1{position:absolute;left:56px;top:60px;font-stretch:62%;font-weight:900;text-transform:uppercase;
  font-size:224px;line-height:.8;letter-spacing:-.01em;white-space:nowrap}
h1 span{display:block}
img{position:absolute;right:10px;bottom:0;height:372px;filter:grayscale(1) contrast(1.08)}
.foot{position:absolute;left:56px;bottom:52px;width:600px}
.foot p{font-size:27px;line-height:1.3}
.foot .url{margin-top:16px;font-stretch:118%;font-weight:500;font-size:16px;letter-spacing:.16em;text-transform:uppercase}
</style>
<div class="block"></div>
<h1><span>Abdulla</span><span>Alasmawi</span></h1>
<img src="data:image/webp;base64,${portrait}" alt="">
<div class="foot">
  <p>Software engineer working across full-stack development and AWS.</p>
  <p class="url">alasmawi.dev</p>
</div>`;

const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await writeFile(OUT, await page.screenshot());
await browser.close();
console.log(`${OUT}  ${((await readFile(OUT)).length / 1024).toFixed(1)} kB`);
