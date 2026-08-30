// Writes a first-frame WebP poster for every preview video in public/video.
//
// ffmpeg comes from the ffmpeg-static npm package rather than the system. Two
// other candidates were tried and neither can read these files: the only
// ffmpeg otherwise on this machine is Playwright's own, compiled
// --disable-everything with no h264 decoder and no webp encoder, and the
// bundled Chromium is built without proprietary codecs, so canPlayType returns
// empty for avc1 — which is what all thirteen videos are.
//
// Run once after adding or replacing a video:  node scripts/make-posters.mjs
import ffmpeg from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const SRC = 'public/video';
const OUT = path.join(SRC, 'posters');
// Wide enough for the preview pane on a 2x phone. The pane caps media at
// 440px tall and the panel is never wider than ~700px, so 760 covers it.
const MAX_W = 760;
const QUALITY = 72;
// A hair past zero: the true first frame of a screen recording is often still
// the blank window before anything has painted.
const AT = 0.1;

const files = (await readdir(SRC)).filter((f) => f.endsWith('.mp4')).sort();
await mkdir(OUT, { recursive: true });

let total = 0;
for (const file of files) {
  const out = path.join(OUT, file.replace(/\.mp4$/, '.webp'));
  await run(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', String(AT),
    '-i', path.join(SRC, file),
    '-frames:v', '1',
    // Only ever scales down: -1 keeps the aspect and 2 keeps the height even.
    '-vf', `scale='min(${MAX_W},iw)':-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', String(QUALITY), '-compression_level', '6',
    out,
  ]);
  const { size } = await stat(out);
  total += size;
  console.log(`${out}  ${(size / 1024).toFixed(1)} kB`);
}

console.log(`\n${files.length} posters, ${(total / 1024).toFixed(1)} kB total`);
