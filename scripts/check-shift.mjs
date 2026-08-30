// Measures the thing "layout shift" misses here. Switching project is a click,
// and the CLS API discounts anything within 500ms of an input, so a panel that
// jumps under your thumb scores zero. This walks the projects and records where
// the title below the preview lands each time; the spread is how far the copy
// under the media moves as you browse.
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
await page.evaluate(() => document.getElementById('projects').scrollIntoView());
await page.waitForTimeout(800);

const chips = page.locator('#projects .chip-row > button');
const count = await chips.count();
const tops = [];
for (let i = 0; i < count; i++) {
  await chips.nth(i).click();
  await page.waitForTimeout(650);
  const t = await page.evaluate(() => {
    const h = document.querySelector('#projects h3');
    const panel = document.querySelector('#projects [role="tabpanel"], #projects video, #projects .aspect-video');
    return h ? Math.round(h.getBoundingClientRect().top - (panel?.getBoundingClientRect().top ?? 0)) : null;
  });
  tops.push(t);
}
const valid = tops.filter((t) => typeof t === 'number');
const spread = Math.max(...valid) - Math.min(...valid);
console.log('title offset below the media, per project:', tops.join(', '));
console.log(`spread across ${count} projects: ${spread}px`);
// Videos only — the K9 project is a different layout (tabs + gallery) and is
// legitimately taller; the shift that matters is between the video previews.
const videosOnly = valid.slice(1);
console.log(`spread across the 13 video previews: ${Math.max(...videosOnly) - Math.min(...videosOnly)}px`);
await browser.close(); server.kill('SIGKILL'); process.exit(0);
