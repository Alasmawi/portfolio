// Renders the Bayyan card cover into src/assets/bayyan/cover.webp.
//
// Bayyan is an internal Shura Council system, so there are no screenshots to
// show until they are cleared for sharing. This is a drawing, not a capture:
// the registry's shape — rows of obligations, each with a renewal and a status
// that escalates — in abstract bars, with no invented text standing in for
// real records. Replace it with a real screenshot by pointing `poster` in
// projects.js at one.
//
//   node scripts/make-bayyan-cover.mjs
import { chromium } from '@playwright/test';
import ffmpeg from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { mkdir, readFile, rm, stat } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PNG = 'src/assets/bayyan/cover.png';
const OUT = 'src/assets/bayyan/cover.webp';

const inter = (await readFile(
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
)).toString('base64');
const mono = (await readFile(
  'node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2'
)).toString('base64');

// status: 0 ok, 1 warning, 2 critical — the three states a record moves through.
const ROWS = [
  [0.62, 0.3, 0],
  [0.48, 0.36, 1],
  [0.7, 0.24, 0],
  [0.55, 0.32, 2],
  [0.44, 0.28, 0],
  [0.66, 0.34, 1],
];
const STATUS = [
  { c: '#8fd6c9', label: 'ok' },
  { c: '#f0a448', label: 'warning' },
  { c: '#ea5f70', label: 'critical' },
];

const rows = ROWS.map(
  ([a, b, s]) => `
  <div class="row">
    <span class="bar" style="width:${a * 100}%"></span>
    <span class="bar dim" style="width:${b * 100}%"></span>
    <span class="pill" style="--c:${STATUS[s].c}"><i></i>${STATUS[s].label}</span>
  </div>`
).join('');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Inter;src:url(data:font/woff2;base64,${inter}) format('woff2-variations');font-weight:100 900}
@font-face{font-family:JB;src:url(data:font/woff2;base64,${mono}) format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1280px;height:720px;background:#1c0810;font-family:Inter,sans-serif;position:relative;overflow:hidden}
.orb{position:absolute;border-radius:50%;filter:blur(60px)}
.o1{left:-10%;top:-40%;width:900px;height:800px;background:radial-gradient(circle,rgba(226,96,126,.4),rgba(226,96,126,0) 66%)}
.o2{right:-14%;bottom:-40%;width:800px;height:760px;background:radial-gradient(circle,rgba(240,164,72,.22),rgba(240,164,72,0) 64%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(251,238,240,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(251,238,240,.04) 1px,transparent 1px);background-size:72px 72px}
.win{position:absolute;left:470px;top:88px;width:720px;height:544px;border-radius:26px;background:rgba(253,243,244,.07);
  border:1px solid rgba(253,243,244,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 40px 80px -30px rgba(0,0,0,.9);padding:26px 30px}
.top{display:flex;align-items:center;justify-content:space-between;margin-bottom:26px}
.dots{display:flex;gap:8px}.dots i{width:11px;height:11px;border-radius:50%;background:rgba(255,255,255,.18)}
.lang{display:flex;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);padding:4px;font:500 17px Inter;color:#c0a6ad}
.lang span{padding:5px 14px;border-radius:999px}.lang .on{background:rgba(255,255,255,.16);color:#fbeef0}
.head{display:grid;grid-template-columns:1fr 1fr 140px;gap:18px;margin-bottom:14px}
.head span{height:9px;border-radius:9px;background:rgba(255,255,255,.14)}
.row{display:grid;grid-template-columns:1fr 1fr 140px;gap:18px;align-items:center;padding:17px 0;border-top:1px solid rgba(255,255,255,.07)}
.bar{height:12px;border-radius:12px;background:rgba(251,238,240,.5)}.bar.dim{background:rgba(251,238,240,.2)}
.pill{justify-self:start;display:inline-flex;align-items:center;gap:9px;padding:6px 13px;border-radius:999px;font:15px JB;color:var(--c);
  border:1px solid color-mix(in srgb,var(--c) 55%,transparent);background:color-mix(in srgb,var(--c) 12%,transparent)}
.pill i{width:8px;height:8px;border-radius:50%;background:var(--c)}
.title{position:absolute;left:80px;bottom:96px}
.title h1{font-size:88px;font-weight:500;letter-spacing:-.04em;color:#fbeef0;line-height:1}
.title p{margin-top:18px;font:19px JB;letter-spacing:.08em;text-transform:uppercase;color:#c0a6ad;line-height:1.6}
.rule{width:56px;height:3px;background:#e2607e;border-radius:3px;margin-bottom:26px}
</style>
<div class="orb o1"></div><div class="orb o2"></div><div class="grid"></div>
<div class="win">
  <div class="top"><div class="dots"><i></i><i></i><i></i></div>
    <div class="lang"><span class="on">EN</span><span>عربي</span></div></div>
  <div class="head"><span style="width:40%"></span><span style="width:52%"></span><span style="width:60%"></span></div>
  ${rows}
</div>
<div class="title"><div class="rule"></div><h1>Bayyan</h1><p>obligations<br>registry</p></div>`;

await mkdir('src/assets/bayyan', { recursive: true });
const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(200);
await page.screenshot({ path: PNG });
await browser.close();

await run(ffmpeg, [
  '-hide_banner', '-loglevel', 'error', '-y', '-i', PNG,
  '-vf', "scale=960:-2:flags=lanczos",
  '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6', OUT,
]);
await rm(PNG);
console.log(`${OUT}  ${((await stat(OUT)).size / 1024).toFixed(1)} kB`);
