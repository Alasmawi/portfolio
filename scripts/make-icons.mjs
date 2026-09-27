// Renders the site's tab icon from the site's own palette.
//
//   node scripts/make-icons.mjs              writes public/icon.svg, icon-32.png,
//                                            icon-64.png and icon-180.png
//   node scripts/make-icons.mjs --preview <out.png>
//                                            renders every candidate at tab sizes
//                                            on light and dark tab strips
//
// The mark is the hero's data path in miniature: three hops on a trace, the
// middle one amber (the gateway, as in the K9 diagram), ending in the teal dot
// that means live everywhere else on the site. At 16px the bars still read as
// a stepped waterfall; the lane tracks behind them only show from 32px up.
//
// The frozen v1 site keeps its own favicon-32.png, favicon-64.png and
// apple-touch-icon.png, so these use new names.
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const C = {
  ground: '#1c0810',
  surface: '#2c0f1a',
  rose: '#e2607e',
  roseBody: '#f09db0',
  roseBright: '#fbd3dc',
  amber: '#f0a448',
  amberBright: '#fbd7a4',
  signal: '#4fd1c5',
  cream: '#fbeef0',
};

// `full` fills the whole square (for the Apple touch icon, which iOS masks
// itself); otherwise the ground is a rounded tile with transparent corners.
function ground(full) {
  return `
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.surface}"/><stop offset="1" stop-color="${C.ground}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.2" cy="0.1" r="0.9">
      <stop offset="0" stop-color="${C.rose}" stop-opacity=".32"/><stop offset="1" stop-color="${C.rose}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="${full ? 0 : 14}" fill="url(#g)"/>
  <rect width="64" height="64" rx="${full ? 0 : 14}" fill="url(#glow)"/>
  ${full ? '' : `<rect x=".5" y=".5" width="63" height="63" rx="13.5" fill="none" stroke="${C.cream}" stroke-opacity=".14"/>`}`;
}

const MARKS = {
  // A: the data path. No lane tracks behind the bars: at 16px they turned
  // three clean steps into a grey smear.
  trace: `
  <defs>
    <linearGradient id="b1" x1="0" x2="1"><stop offset="0" stop-color="${C.rose}"/><stop offset="1" stop-color="${C.roseBody}"/></linearGradient>
    <linearGradient id="b2" x1="0" x2="1"><stop offset="0" stop-color="${C.amber}"/><stop offset="1" stop-color="${C.amberBright}"/></linearGradient>
    <linearGradient id="b3" x1="0" x2="1"><stop offset="0" stop-color="${C.roseBody}"/><stop offset="1" stop-color="${C.roseBright}"/></linearGradient>
  </defs>
  <rect x="9" y="11" width="24" height="11" rx="5.5" fill="url(#b1)"/>
  <rect x="19" y="26.5" width="22" height="11" rx="5.5" fill="url(#b2)"/>
  <rect x="29" y="42" width="18" height="11" rx="5.5" fill="url(#b3)"/>
  <circle cx="53" cy="47.5" r="5.5" fill="${C.signal}"/>`,

  // B: the wordmark's bead.
  bead: `
  <defs>
    <radialGradient id="bead" cx=".35" cy=".3" r=".75">
      <stop offset="0" stop-color="${C.amberBright}"/><stop offset=".55" stop-color="${C.roseBody}"/><stop offset="1" stop-color="${C.rose}"/>
    </radialGradient>
    <radialGradient id="halo" cx=".5" cy=".5" r=".5">
      <stop offset=".45" stop-color="${C.rose}" stop-opacity=".55"/><stop offset="1" stop-color="${C.rose}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="32" cy="32" r="26" fill="url(#halo)"/>
  <circle cx="32" cy="32" r="14" fill="url(#bead)"/>
  <ellipse cx="27.5" cy="26" rx="5" ry="3" fill="#fff" fill-opacity=".55"/>`,

  // C: an A whose crossbar is a trace bar.
  monogram: `
  <path d="M17 51 L32 13 L47 51" fill="none" stroke="${C.cream}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="19" y="35" width="26" height="7" rx="3.5" fill="${C.amber}"/>
  <circle cx="51" cy="38.5" r="3.5" fill="${C.signal}"/>`,
};

const svg = (mark, full = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${ground(full)}${MARKS[mark]}</svg>`;

async function renderPng(page, svgText, size) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}img{display:block;width:${size}px;height:${size}px}</style><img src="data:image/svg+xml;base64,${Buffer.from(svgText).toString('base64')}">`
  );
  await page.waitForTimeout(50);
  return page.screenshot({ omitBackground: true });
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage();

if (process.argv[2] === '--preview') {
  const out = process.argv[3];
  // Each candidate as it would sit in a tab: 16px beside a title, on Chrome's
  // light and dark tab strips, plus a 32px and a 180px view.
  const row = (name, key) => {
    const src = `data:image/svg+xml;base64,${Buffer.from(svg(key)).toString('base64')}`;
    const full = `data:image/svg+xml;base64,${Buffer.from(svg(key, true)).toString('base64')}`;
    const tab = (bg, fg) =>
      `<div class="tab" style="background:${bg};color:${fg}"><img src="${src}" width="16" height="16"><span>Abdulla Alasmawi · Software…</span></div>`;
    return `<div class="row"><p class="name">${name}</p>${tab('#ffffff', '#1f1f1f')}${tab('#35363a', '#e8eaed')}
      <img src="${src}" width="32" height="32"><img src="${full}" width="96" height="96" style="border-radius:22px"></div>`;
  };
  await page.setViewportSize({ width: 980, height: 430 });
  await page.setContent(`<style>
    body{margin:0;padding:24px;background:#dee1e6;font:13px system-ui,sans-serif}
    .row{display:flex;align-items:center;gap:22px;margin-bottom:18px}
    .name{width:150px;margin:0;font-weight:600;color:#202124}
    .tab{display:flex;align-items:center;gap:8px;width:220px;height:34px;padding:0 12px;border-radius:10px 10px 0 0}
    .tab img{image-rendering:auto}
  </style>
  ${row('A · Data path', 'trace')}${row('B · Bead', 'bead')}${row('C · Monogram', 'monogram')}`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: out });
  console.log(`preview -> ${out}`);
} else {
  const mark = 'trace';
  await writeFile('public/icon.svg', svg(mark));
  for (const size of [32, 64]) {
    await writeFile(`public/icon-${size}.png`, await renderPng(page, svg(mark), size));
  }
  // iOS rounds the corners itself and shows transparency as black, so the
  // touch icon is the full square.
  await writeFile('public/icon-180.png', await renderPng(page, svg(mark, true), 180));
  console.log('public/icon.svg, icon-32.png, icon-64.png, icon-180.png');
}

await browser.close();
process.exit(0);
