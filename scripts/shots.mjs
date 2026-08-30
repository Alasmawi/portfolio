// Screenshots the built site at the three widths the mobile work is judged at,
// and reads back the runtime numbers the audit's acceptance criteria are
// stated in: SyntaxRain field rebuilds, hero height stability, scroll
// snap-back, layout shift, and how many observers watch the sections.
//
//   npm run build && node scripts/shots.mjs          screenshots + shipped bytes
//   node scripts/shots.mjs --dev                     the rebuild counter only
//
// Chromium comes from the image; nothing is downloaded.
//
// Known limit: Chromium's touch-gesture synthesis (Input.synthesizeScrollGesture
// with gestureSourceType 'touch') reports success in this headless container but
// moves the page zero pixels, so the scroll probe below drives a wheel instead.
// That still exercises scroll-snap — snap applies to wheel scrolling too — but
// it is not thumb inertia, and the inertia case can't be measured here.
import { chromium, devices } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const OUT = 'shots';
const MODE = process.argv.includes('--dev') ? 'dev' : 'preview';

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];

// Chosen at run time: a previous run killed mid-flight leaves its server
// holding a fixed port, and the next run then fails for a reason that has
// nothing to do with the site.
const PORT = await new Promise((resolve) => {
  const srv = createServer();
  srv.listen(0, () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});
const BASE = `http://localhost:${PORT}/v2/`;

function startServer() {
  const args =
    MODE === 'dev'
      ? ['vite', '--port', String(PORT), '--strictPort']
      : ['vite', 'preview', '--port', String(PORT), '--strictPort'];
  const proc = spawn('npx', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('vite did not start')), 30000);
    proc.stdout.on('data', (b) => {
      if (String(b).includes(`localhost:${PORT}`)) {
        clearTimeout(timer);
        resolve(proc);
      }
    });
  });
}

// Throws the page down and samples every frame through the settle. Scroll-snap's
// signature is not a short throw — it is the page travelling forward and then
// being pulled *back* to a boundary it was thrown past, so `reversal` is the
// number that matters, not `settled`.
async function throwDown(page, distance) {
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    window.__samples = [];
    const sample = () => {
      window.__samples.push(window.scrollY);
      window.__sampleRaf = requestAnimationFrame(sample);
    };
    sample();
  });
  await page.waitForTimeout(150);
  await page.mouse.move(200, 400);
  await page.mouse.wheel(0, distance);
  await page.waitForTimeout(1800);
  return page.evaluate(() => {
    cancelAnimationFrame(window.__sampleRaf);
    const s = window.__samples;
    let peak = 0;
    let reversal = 0;
    for (const y of s) {
      if (y > peak) peak = y;
      reversal = Math.max(reversal, peak - y);
    }
    return { peak: Math.round(peak), settled: Math.round(s[s.length - 1]), reversal: Math.round(reversal) };
  });
}

const server = await startServer();
const browser = await chromium.launch({ executablePath: EXECUTABLE });
await mkdir(OUT, { recursive: true });
const report = {};

try {
  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      userAgent: vp.mobile ? devices['iPhone 13'].userAgent : undefined,
    });
    const page = await context.newPage();

    const requests = [];
    page.on('request', (r) => requests.push(r.url()));
    // Transferred bytes, not content-length: this is what the phone pays.
    const media = { bytes: 0, mp4: 0, posters: 0 };
    page.on('response', async (r) => {
      const u = r.url();
      if (!/\.(mp4|webp)$/.test(u)) return;
      if (!u.includes('/video/')) return;
      const len = Number(r.headers()['content-length'] || 0);
      media.bytes += len;
      if (u.endsWith('.mp4')) media.mp4 += len;
      else media.posters += len;
    });

    await page.addInitScript(() => {
      // Counts observers watching top-level sections, for the "one instance,
      // not two" criterion. React's StrictMode double-mounts in dev, so read
      // this from a preview run.
      window.__ioCount = 0;
      const Native = window.IntersectionObserver;
      window.IntersectionObserver = class extends Native {
        observe(el) {
          if (el?.tagName === 'SECTION' && el.parentElement?.tagName === 'MAIN') window.__ioCount++;
          return super.observe(el);
        }
      };
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1800);
    if (MODE === 'preview') await page.screenshot({ path: path.join(OUT, `${vp.name}-hero.png`) });

    const heroBefore = await page.evaluate(() => document.getElementById('hero').getBoundingClientRect().height);
    const buildsBefore = await page.evaluate(() => window.__buildFieldCalls ?? null);

    // The URL bar collapsing is a height-only change to the viewport, and
    // headless has no URL bar — so drive the same change directly. This is what
    // dvh exposes the hero to on every scroll; svh does not, but that
    // difference is invisible here, so what this actually measures is whether
    // SyntaxRain survives the resize rather than rebuilding through it.
    const wobbleBefore = await page.evaluate(() => window.__buildFieldCalls ?? null);
    const dropsBefore = await page.evaluate(() => window.__rainDrops?.() ?? null);
    for (const dh of [-60, 0, -60, 0]) {
      await page.setViewportSize({ width: vp.width, height: vp.height + dh });
      await page.waitForTimeout(250);
    }
    const wobble = {
      buildFieldBefore: wobbleBefore,
      buildFieldAfter: await page.evaluate(() => window.__buildFieldCalls ?? null),
      dropsBefore,
      dropsAfter: await page.evaluate(() => window.__rainDrops?.() ?? null),
    };

    const scroll = await throwDown(page, 2600);

    const heroAfter = await page.evaluate(() => document.getElementById('hero').getBoundingClientRect().height);
    const buildsAfter = await page.evaluate(() => window.__buildFieldCalls ?? null);

    await page.evaluate(() => document.getElementById('projects').scrollIntoView());
    await page.waitForTimeout(900);
    if (MODE === 'preview') await page.screenshot({ path: path.join(OUT, `${vp.name}-projects.png`) });

    // Walk every project once, the way auto-advance or a run of swipes does,
    // and see what that costs in media. Mobile only — it is the case that matters
    // and the chip row only exists below md.
    let walk = null;
    if (vp.name === 'mobile') {
      const clsBefore = await page.evaluate(() => window.__cls);
      const chips = page.locator('#projects .chip-row > button');
      const count = await chips.count();
      for (let i = 0; i < count; i++) {
        await chips.nth(i).click();
        await page.waitForTimeout(700);
      }
      walk = {
        projects: count,
        mediaKB: Number((media.bytes / 1024).toFixed(1)),
        mp4KB: Number((media.mp4 / 1024).toFixed(1)),
        posterKB: Number((media.posters / 1024).toFixed(1)),
        clsDuringWalk: Number(((await page.evaluate(() => window.__cls)) - clsBefore).toFixed(4)),
      };
    }

    report[vp.name] = {
      heroHeight: { before: heroBefore, after: heroAfter, changed: Math.abs(heroBefore - heroAfter) > 1 },
      buildField: { before: buildsBefore, after: buildsAfter },
      sectionObservers: await page.evaluate(() => window.__ioCount),
      cls: Number((await page.evaluate(() => window.__cls)).toFixed(4)),
      walk,
      wobble,
      scroll,
      docHeight: await page.evaluate(() => document.documentElement.scrollHeight),
      mountCloudRequested: requests.some((u) => u.includes('mountCloud')),
      k9FlowRequested: requests.some((u) => u.includes('K9Flow')),
      googleFontRequests: requests.filter((u) => u.includes('fonts.g')).length,
      mp4Requests: requests.filter((u) => u.endsWith('.mp4')).length,
    };

    await context.close();
  }
} finally {
  await browser.close().catch(() => {});
  server.kill('SIGKILL');
}

await writeFile(path.join(OUT, `report-${MODE}.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
// vite's child process keeps the event loop alive even after SIGKILL on the
// wrapper, so exit explicitly rather than hanging the run at teardown.
process.exit(0);
