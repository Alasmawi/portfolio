// Writes a first-frame WebP poster for every preview video in public/video.
//
// Chromium rather than ffmpeg: the only ffmpeg on this machine is Playwright's
// own build, compiled with --disable-everything, so it has no h264 decoder and
// no webp encoder. Chromium has both, and it is already installed. Same result
// as `ffmpeg -vframes 1 -c:v libwebp`.
//
// Run once after adding or replacing a video:  node scripts/make-posters.mjs
import { chromium } from '@playwright/test';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

// The container ships Chromium build 1194; whichever @playwright/test version
// is installed may expect a different one, so point at the browser that is
// actually here rather than downloading a second copy.
const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const SRC = 'public/video';
const OUT = path.join(SRC, 'posters');
// Wide enough for the preview pane on a 2x phone, small enough that fourteen
// of them together stay under a tenth of the videos they stand in for.
const MAX_W = 760;
const QUALITY = 0.72;

const files = (await readdir(SRC)).filter((f) => f.endsWith('.mp4'));
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: EXECUTABLE });
const page = await browser.newPage();
await page.goto('about:blank');

let total = 0;
for (const file of files) {
  const buffer = await import('node:fs/promises').then((fs) => fs.readFile(path.join(SRC, file)));
  const dataUrl = `data:video/mp4;base64,${buffer.toString('base64')}`;

  const b64 = await page.evaluate(
    async ([url, maxW, quality]) => {
      const v = document.createElement('video');
      v.muted = true;
      v.src = url;
      await new Promise((res, rej) => {
        v.onloadeddata = res;
        v.onerror = () => rej(new Error('decode failed'));
      });
      // A hair past zero: the true first frame of a screen recording is often
      // still the blank window before anything has painted.
      v.currentTime = Math.min(0.1, v.duration / 2);
      await new Promise((res) => (v.onseeked = res));

      const scale = Math.min(1, maxW / v.videoWidth);
      const c = document.createElement('canvas');
      c.width = Math.round(v.videoWidth * scale);
      c.height = Math.round(v.videoHeight * scale);
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      return c.toDataURL('image/webp', quality).split(',')[1];
    },
    [dataUrl, MAX_W, QUALITY]
  );

  const out = path.join(OUT, file.replace(/\.mp4$/, '.webp'));
  const bytes = Buffer.from(b64, 'base64');
  await writeFile(out, bytes);
  total += bytes.length;
  console.log(`${out}  ${(bytes.length / 1024).toFixed(1)} kB`);
}

await browser.close();
console.log(`\n${files.length} posters, ${(total / 1024).toFixed(1)} kB total`);
