// Measures the movement the CLS API misses here.
//
// CLS discounts anything within 500ms of an input, so the two ways this page can
// jump under a thumb both score zero: a grid of lazy covers settling as the
// images arrive, and opening or closing the project dialog.
//
// It used to walk an inline preview panel and record where the title under the
// media landed — that panel is gone. The browser is a grid of covers and a
// dialog now, so these are the two places left where something can move.
//
//   npm run build && node scripts/check-shift.mjs
import { chromium, devices } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const PORT = await new Promise((r) => {
  const s = createServer();
  s.listen(0, () => { const { port } = s.address(); s.close(() => r(port)); });
});
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
await new Promise((r) => server.stdout.on('data', (b) => String(b).includes(`localhost:${PORT}`) && r()));

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true, hasTouch: true, userAgent: devices['iPhone 13'].userAgent,
});
const page = await context.newPage();
await page.goto(`http://localhost:${PORT}/v2/`, { waitUntil: 'load' });
await page.waitForTimeout(1200);

let failed = 0;
// `rect.top + scrollY` is the obvious way to get a document offset and it lies
// here: `html` has `scroll-behavior: smooth`, so a sample taken while a
// programmatic scroll is still easing reads a rect from one frame against a
// scrollY from another. That disagreement measured as a 16px layout shift that
// was not happening. Walking `offsetTop` needs no scroll position at all.
const geometry = () =>
  page.evaluate(() => {
    const offset = (el) => {
      let y = 0;
      for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
      return Math.round(y);
    };
    const cards = [...document.querySelectorAll('#projects ul li button')];
    return {
      cards: cards.length,
      docHeight: Math.round(document.documentElement.scrollHeight),
      lastCardTop: cards.length ? offset(cards.at(-1)) : null,
      scrollY: Math.round(window.scrollY),
    };
  });

// 1. The covers are lazy. Every card reserves a 16/9 box, so the grid's height
//    must not change as the images land — scroll the whole section past the
//    viewport to force every one of them to fetch, then come back.
await page.evaluate(() => document.getElementById('projects').scrollIntoView());
await page.waitForTimeout(600);
const beforeLoad = await geometry();
await page.evaluate(async () => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
});
await page.evaluate(() => document.getElementById('projects').scrollIntoView());
await page.waitForTimeout(1200);
const afterLoad = await geometry();

const gridDrift = Math.abs(afterLoad.lastCardTop - beforeLoad.lastCardTop);
console.log(`covers: ${afterLoad.cards} cards, last card moved ${gridDrift}px as the images loaded`);
if (gridDrift > 2) { console.error('  FAIL — a lazy cover is not reserving its box'); failed++; }

// 2. The dialog is portalled to document.body and the page behind it must not
//    move. Open every project in turn and check the page is where it was.
// Clicked through evaluate rather than through a locator: Playwright scrolls an
// element into view before clicking it, and that scroll is the harness moving
// the page, not the page moving itself.
const count = await page.evaluate(() => document.querySelectorAll('#projects ul li button').length);
const before = await geometry();
let worst = 0;
for (let i = 0; i < count; i++) {
  await page.evaluate((n) => document.querySelectorAll('#projects ul li button')[n].click(), i);
  await page.waitForSelector('[role="dialog"]', { timeout: 4000 });
  await page.waitForTimeout(220);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(320);
  const now = await geometry();
  worst = Math.max(
    worst,
    Math.abs(now.scrollY - before.scrollY),
    Math.abs(now.docHeight - before.docHeight),
  );
}
console.log(`dialog: opened and closed ${count} projects, page moved at most ${worst}px`);
if (worst > 2) { console.error('  FAIL — opening the dialog moves the page behind it'); failed++; }

await browser.close();
server.kill('SIGKILL');
if (failed) { console.error(`\n${failed} problem${failed === 1 ? '' : 's'}.`); process.exit(1); }
console.log('\nNothing moves.');
process.exit(0);
