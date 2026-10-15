// Loads the running dev server at a spread of widths and reports what a
// responsive pass needs to know: section heights, anything wider than the
// viewport, and a full-page screenshot of each.
//
//   CHROME=<chromium binary> node scripts/audit-layout.mjs [url] [outDir]
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'shots';
const WIDTHS = [
  [320, 640],
  [390, 844],
  [600, 900],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1536, 864],
  [1920, 1080],
];

await mkdir(out, { recursive: true });
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
for (const [width, height] of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  // Walk the page so everything that reveals on scroll has revealed.
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto';
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight / 2) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || getComputedStyle(el).position === 'fixed') return false;
        // Inside a horizontal scroller is fine.
        for (let p = el.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') return false;
        }
        return r.right > vw + 1 || r.left < -1;
      })
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} [${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)}]`);
    return {
      total: document.documentElement.scrollHeight,
      screens: +(document.documentElement.scrollHeight / innerHeight).toFixed(1),
      scrollX: document.documentElement.scrollWidth > vw,
      sections: [...document.querySelectorAll('main > *')].map((s) => `${s.id}:${Math.round(s.getBoundingClientRect().height)}`).join(' '),
      wide,
    };
  });
  console.log(width, JSON.stringify(report));
  await page.screenshot({ path: path.join(out, `page-${width}.png`), fullPage: true });
  await context.close();
}
await browser.close();
