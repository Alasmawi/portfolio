// Shared plumbing for the demo recordings in this folder. Each project has a
// script beside this one that drives its app through a short scripted session;
// this file owns the browser, the capture settings and the encode.
//
//   REPOS=<dir of cloned repos> node scripts/record/<project>.mjs
//
// Writes, under OUT (default ./.recordings):
//   <id>/<id>.mp4          the demo, ready for public/video/
//   <id>/NN-<name>.png     stills, ready for scripts/make-screens.mjs
//
// The recordings are sized for the smallest place they are shown. The project
// dialog on a phone gives a video about 335 CSS px of width, so the app is
// driven in a small viewport: everything in the frame stays large enough to
// read there. Playwright captures video in CSS pixels whatever the device
// scale, so the frame is recorded 1:1 and never upscaled.
import { chromium } from '@playwright/test';
import { execFile, spawn } from 'node:child_process';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);

export const REPOS = process.env.REPOS;
export const OUT = path.resolve(process.env.OUT ?? '.recordings');
if (!REPOS) {
  console.error('Set REPOS to the directory holding the cloned project repos.');
  process.exit(1);
}

export const VIDEO = { width: 800, height: 500 };
export const DESKTOP = { width: 1280, height: 800 };
export const PHONE = { width: 390, height: 844 };

// CHROME points at a Chromium to use when the one Playwright expects is not
// installed — any recent build records the same.
const LAUNCH = process.env.CHROME ? { executablePath: process.env.CHROME } : {};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Starts a project's own server and resolves once it answers. The caller gets
// a stop() that takes the whole process group down with it.
export async function serve(cmd, args, { cwd, env = {}, url, timeout = 60000 }) {
  const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env }, detached: true, stdio: 'ignore' });
  const stop = () => {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      // Already gone.
    }
  };
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      await fetch(url);
      return stop;
    } catch {
      await sleep(250);
    }
  }
  stop();
  throw new Error(`${cmd} did not answer at ${url} within ${timeout}ms`);
}

// A pointer the recording can see. Headless Chromium draws no cursor, and a
// demo where buttons press themselves reads as a slideshow.
const CURSOR = `
  (() => {
    if (window.__cursor) return;
    const install = () => {
      const c = document.createElement('div');
      c.style.cssText = 'position:fixed;left:0;top:0;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;' +
        'background:rgba(226,96,126,.55);box-shadow:0 0 0 1.5px rgba(255,255,255,.9);pointer-events:none;' +
        'z-index:2147483647;transform:translate(-100px,-100px);transition:transform .05s linear, scale .12s';
      document.documentElement.appendChild(c);
      window.__cursor = c;
      addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, true);
      addEventListener('mousedown', () => { c.style.scale = '0.7'; }, true);
      addEventListener('mouseup', () => { c.style.scale = '1'; }, true);
    };
    document.documentElement ? install() : addEventListener('DOMContentLoaded', install);
  })();
`;

// Moves the pointer to an element at a human pace, then clicks it.
export async function click(page, target, { pause = 350 } = {}) {
  const loc = typeof target === 'string' ? page.locator(target).first() : target;
  const box = await loc.boundingBox();
  if (!box) throw new Error(`nothing to click for ${target}`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
  await sleep(140);
  await page.mouse.down();
  await sleep(70);
  await page.mouse.up();
  await sleep(pause);
}

export async function type(page, text, { delay = 55, pause = 300 } = {}) {
  await page.keyboard.type(text, { delay });
  await sleep(pause);
}

// One recorded session. `scenario` receives the page and a `take` object:
//   take.from()      start the published video here, dropping everything before
//   take.crop(rect)  publish only this region of the frame ({x, y, width, height})
// Both are for apps whose interesting part is one region of one phase — a game
// board after a lobby countdown, say — where the full frame would spend most of
// a phone's width on chrome.
export async function record(id, scenario, { viewport = VIDEO, contextOptions = {}, trim = 0.6, cursor = true } = {}) {
  const dir = path.join(OUT, id);
  const raw = path.join(dir, 'raw');
  await rm(raw, { recursive: true, force: true });
  await mkdir(raw, { recursive: true });

  const browser = await chromium.launch(LAUNCH);
  const context = await browser.newContext({
    viewport,
    colorScheme: 'dark',
    recordVideo: { dir: raw, size: viewport },
    ...contextOptions,
  });
  // `cursor: false` for apps driven from the keyboard, where a parked pointer
  // is a dot sitting on the picture.
  if (cursor) await context.addInitScript(CURSOR);
  const page = await context.newPage();
  const started = Date.now();
  let from = trim;
  let crop = null;
  const take = {
    from: () => {
      from = (Date.now() - started) / 1000;
    },
    crop: (rect) => {
      // Even dimensions: yuv420p cannot encode an odd width or height.
      const even = (n) => Math.floor(n / 2) * 2;
      crop = `crop=${even(rect.width)}:${even(rect.height)}:${Math.round(rect.x)}:${Math.round(rect.y)}`;
    },
  };
  try {
    await scenario(page, { browser, context, take });
  } finally {
    await context.close();
    await browser.close();
  }

  const webm = (await readdir(raw)).find((f) => f.endsWith('.webm'));
  const mp4 = path.join(dir, `${id}.mp4`);
  // 15fps: these are UI recordings, where a higher frame rate buys nothing
  // the eye can use and doubles the file.
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-ss', String(from), '-i', path.join(raw, webm),
    '-vf', ['fps=15', crop].filter(Boolean).join(','), '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4,
  ]);
  await rm(raw, { recursive: true, force: true });
  console.log(`video  ${mp4}`);
}

// Stills, taken in their own contexts so they are not tied to the recording's
// small viewport: a desktop frame and a phone frame of the same app.
export async function stills(id, scenario) {
  const dir = path.join(OUT, id);
  await mkdir(dir, { recursive: true });
  const browser = await chromium.launch(LAUNCH);
  let n = 0;
  const open = async (kind) => {
    const context = await browser.newContext(
      kind === 'phone'
        ? { viewport: PHONE, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'dark' }
        : { viewport: DESKTOP, deviceScaleFactor: 2, colorScheme: 'dark' }
    );
    const page = await context.newPage();
    const shot = async (name) => {
      n += 1;
      const file = path.join(dir, `${String(n).padStart(2, '0')}-${name}.png`);
      await page.screenshot({ path: file });
      console.log(`still  ${file}`);
    };
    return { page, shot, context };
  };
  try {
    await scenario(open);
  } finally {
    await browser.close();
  }
}
