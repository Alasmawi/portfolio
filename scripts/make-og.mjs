// Renders the 1200x630 link-preview card into public/og.png.
//
// Built from the site's own tokens and the same cloud still the hero shows, so
// a preview in LinkedIn, WhatsApp or a CV email looks like the page it points
// at rather than separate marketing art.
//
//   npm run build && node scripts/make-og.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = 'public/og.png';

// Read the palette out of tailwind.config.js so this cannot drift from the site.
const cfg = await readFile('tailwind.config.js', 'utf8');
const hex = (key) => cfg.match(new RegExp(`${key}:\\s*'(#[0-9a-fA-F]{6})'`))[1];
const VOID = hex('void');
const BG = hex('bg');
const ROSE = cfg.match(/accent:\s*\{[^}]*DEFAULT:\s*'(#[0-9a-fA-F]{6})'/s)[1];
const TEXT = cfg.match(/primary:\s*'(#[0-9a-fA-F]{6})'/)[1];
const MUTED = cfg.match(/muted:\s*'(#[0-9a-fA-F]{6})'/)[1];

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
body{width:1200px;height:630px;background:${VOID};font-family:Inter,sans-serif;position:relative;overflow:hidden}
/* The same two orbs and grid the page's Atmosphere layer paints. */
.orb{position:absolute;border-radius:50%}
.o1{left:-12%;top:-38%;width:820px;height:760px;filter:blur(46px);
  background:radial-gradient(circle, rgba(224,122,154,.42), rgba(224,122,154,0) 66%)}
.o2{right:-20%;top:-22%;width:760px;height:720px;filter:blur(52px);
  background:radial-gradient(circle, rgba(240,164,72,.3), rgba(240,164,72,0) 64%)}
.grid{position:absolute;inset:0;background-image:
  linear-gradient(rgba(253,243,244,.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(253,243,244,.035) 1px, transparent 1px);background-size:72px 72px}
.pane{position:absolute;right:70px;top:105px;width:470px;height:420px;border-radius:30px;
  background:rgba(253,243,244,.06);border:1px solid rgba(253,243,244,.14);overflow:hidden;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07), 0 30px 62px -32px rgba(0,0,0,.85)}
.pane img{position:absolute;inset:-9%;width:118%;height:118%;object-fit:contain}
.wrap{position:absolute;inset:0;padding:76px 80px;display:flex;flex-direction:column;justify-content:space-between;width:660px}
h1{font-size:70px;font-weight:500;letter-spacing:-.035em;color:${TEXT};line-height:.98}
p{margin-top:24px;font-size:27px;line-height:1.42;color:${TEXT};opacity:.86;max-width:20ch}
.rule{width:60px;height:3px;background:${ROSE};margin-bottom:28px;border-radius:2px}
.foot{display:flex;align-items:center;gap:16px;font-family:JB,monospace;font-size:18px;
  letter-spacing:.06em;color:${MUTED}}
.dot{width:9px;height:9px;border-radius:50%;background:${ROSE}}
.edge{position:absolute;inset-inline:0;bottom:0;height:5px;background:${ROSE}}
</style>
<div class="orb o1"></div><div class="orb o2"></div><div class="grid"></div>
<div class="pane"><img src="data:image/webp;base64,${cloud}" alt=""></div>
<div class="wrap">
  <div>
    <div class="rule"></div>
    <h1>Abdulla<br>Alasmawi</h1>
    <p>I build full-stack systems on AWS — and understand them the whole way down.</p>
  </div>
  <div class="foot"><span class="dot"></span><span>alasmawi.dev</span>
    <span>·</span><span>MANAMA, BAHRAIN</span></div>
</div>
<div class="edge"></div>`;

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await writeFile(OUT, await page.screenshot());
await browser.close();
console.log(`${OUT}  ${((await readFile(OUT)).length / 1024).toFixed(1)} kB  (bg ${BG})`);
process.exit(0);
