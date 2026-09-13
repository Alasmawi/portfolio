// Renders the 1200x630 link-preview card into public/og.png.
//
// Built from the site's own palette tokens and the same cloud still the hero
// uses, so a preview in LinkedIn or WhatsApp looks like the page it points at
// rather than a separate piece of marketing art.
//
//   npm run build && node scripts/make-og.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = 'public/og.png';

// Read the tokens straight out of the stylesheet so this can never drift from
// the site's palette.
const css = await readFile('src/index.css', 'utf8');
// Space-separated, not comma: the modern rgb(r g b / a) form is what lets the
// alphas below work. rgb(r,g,b/a) is invalid and fails silently to transparent.
const token = (name) => css.match(new RegExp(`--${name}:\\s*([0-9\\s]+);`))[1].trim().replace(/\s+/g, ' ');
const VOID = token('void');
const ACCENT = token('accent');
const TEXT = token('text-primary');
const MUTED = token('text-muted');
const EDGE = token('edge');

const cloud = (await readFile('src/assets/hero/cloud.webp')).toString('base64');
const inter = (await readFile(
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
)).toString('base64');
const mono = (await readFile(
  'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'
)).toString('base64');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2-variations');font-weight:100 900}
@font-face{font-family:JB;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:400}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:rgb(${VOID});font-family:Inter,sans-serif;position:relative;overflow:hidden}
.cloud{position:absolute;right:-40px;bottom:-30px;width:620px;height:560px;
  background:url(data:image/webp;base64,${cloud}) no-repeat center/contain;opacity:.95}
.scrim{position:absolute;inset:0;background:
  radial-gradient(120% 70% at 18% 45%, rgb(${VOID}/.96), rgb(${VOID}/.5) 55%, rgb(${VOID}/0) 82%)}
.wrap{position:absolute;inset:0;padding:74px 80px;display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:76px;font-weight:500;letter-spacing:-.022em;color:rgb(${TEXT});line-height:1}
p{margin-top:26px;font-size:29px;line-height:1.42;color:rgb(${TEXT}/.86);max-width:19ch}
.rule{width:64px;height:3px;background:rgb(${ACCENT});margin-bottom:30px}
.foot{display:flex;align-items:center;gap:18px;font-family:JB,monospace;font-size:19px;
  letter-spacing:.06em;color:rgb(${MUTED})}
.dot{width:9px;height:9px;border-radius:50%;background:rgb(${ACCENT})}
.sep{width:1px;height:17px;background:rgb(${EDGE})}
.edge{position:absolute;inset-inline:0;bottom:0;height:5px;background:rgb(${ACCENT})}
</style>
<div class="cloud"></div><div class="scrim"></div>
<div class="wrap">
  <div>
    <div class="rule"></div>
    <h1>Abdulla Alasmawi</h1>
    <p>I build full-stack systems on AWS — and understand them the whole way down.</p>
  </div>
  <div class="foot">
    <span class="dot"></span><span>alasmawi.dev</span>
    <span class="sep"></span><span>MANAMA, BAHRAIN</span>
  </div>
</div>
<div class="edge"></div>`;

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await writeFile(OUT, await page.screenshot());
await browser.close();
console.log(`${OUT}  ${((await readFile(OUT)).length / 1024).toFixed(1)} kB`);
process.exit(0);
