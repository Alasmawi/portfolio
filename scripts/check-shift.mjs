// Measures the thing "layout shift" misses here. Opening a project is a click,
// and the CLS API discounts anything within 500ms of an input, so a dialog whose
// copy jumps as its media loads scores zero. This opens every project with a
// video preview and records where the title lands below the media well; the
// spread is how far the copy moves from one project to the next.
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
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });
await page.waitForTimeout(1200);
await page.evaluate(() => document.getElementById('projects').scrollIntoView());
await page.waitForTimeout(800);

// Every project card, featured and compact.
const cards = page.locator('#projects button[aria-label^="Open "], #projects ul li button');
const count = await cards.count();
const rows = [];
for (let i = 0; i < count; i++) {
  await cards.nth(i).scrollIntoViewIfNeeded();
  await cards.nth(i).click();
  await page.waitForTimeout(700);
  const r = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const h = d?.querySelector('h3');
    const media = d?.querySelector('video')?.parentElement;
    return {
      name: h?.textContent,
      offset: h && media ? Math.round(h.getBoundingClientRect().top - media.getBoundingClientRect().top) : null,
    };
  });
  rows.push(r);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(350);
}
// Only the video previews share the fixed media well. K9 and Bayyan open on a
// gallery or a diagram, a different and legitimately taller layout.
const videos = rows.filter((r) => typeof r.offset === 'number');
console.log('title offset below the media well:', videos.map((r) => `${r.name} ${r.offset}`).join(', '));
const offsets = videos.map((r) => r.offset);
console.log(`spread across ${videos.length} video previews: ${Math.max(...offsets) - Math.min(...offsets)}px`);
await browser.close(); server.kill('SIGKILL'); process.exit(0);
