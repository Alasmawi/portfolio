// Renders the three.js hero cloud once, at build time, and saves it as a WebP.
//
// The cloud is 136 kB gzip of three.js for one decorative object that never
// changes shape — it only drifts and parallaxes to the pointer, and a phone has
// no pointer. Rather than drop it on mobile and leave the hero plainer, mobile
// gets this still of the same object. Same picture, ~1% of the bytes.
//
// Run after changing mountCloud.js or the hero accent:
//   npm run build && node scripts/make-cloud-poster.mjs
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { writeFile } from 'node:fs/promises';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = 'src/assets/hero/cloud.webp';

const PORT = await new Promise((resolve) => {
  const srv = createServer();
  srv.listen(0, () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
await new Promise((r) => server.stdout.on('data', (b) => String(b).includes(`localhost:${PORT}`) && r()));

const browser = await chromium.launch({ executablePath: EXECUTABLE });
// Captured at the phone viewport, because that is the only place the still is
// used: mountCloud fits the camera to its canvas aspect, so a capture taken at
// desktop width frames the cloud differently from the box it has to drop into.
// deviceScaleFactor 3 so the still is not the limiting factor on a 3x screen.
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
});
const page = await context.newPage();
await page.goto(`http://localhost:${PORT}/v2/`, { waitUntil: 'load' });

// The cloud mounts on an idle callback and then eases in, so wait for it to
// settle rather than catching it mid-fade.
await page.waitForTimeout(6000);

// Strip everything the cloud is normally composited against, so the capture is
// the object on transparency rather than the object on the hero's ground.
await page.addStyleTag({
  content: `
    #hero > *:not([data-cloud]) { visibility: hidden !important; }
    /* The top nav and the bottom tab bar are fixed, so they sit outside #hero
       and an element screenshot would otherwise capture them overlapping it. */
    header, nav[aria-label='Sections'] { display: none !important; }
    #hero, body, html { background: transparent !important; }
    [data-cloud] { opacity: 1 !important; }
  `,
});
await page.waitForTimeout(400);

const el = page.locator('[data-cloud]');
const png = await el.screenshot({ omitBackground: true });

// Chromium encodes the WebP; there is no usable ffmpeg on this machine.
const webp = await page.evaluate(async (b64) => {
  const img = new Image();
  img.src = `data:image/png;base64,${b64}`;
  await img.decode();
  const c = document.createElement('canvas');
  const scale = Math.min(1, 640 / img.width);
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/webp', 0.72).split(',')[1];
}, png.toString('base64'));

await writeFile(OUT, Buffer.from(webp, 'base64'));
console.log(`${OUT}  ${(Buffer.from(webp, 'base64').length / 1024).toFixed(1)} kB`);

await browser.close();
server.kill('SIGKILL');
process.exit(0);
