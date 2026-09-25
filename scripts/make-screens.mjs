// Converts a folder of full-size PNG screenshots into what the project dialog
// loads: a WebP at display size and a small thumbnail for the strip under it.
//
//   node scripts/make-screens.mjs <source-dir> <project-id> [file.png ...]
//
// Writes src/assets/<project-id>/<name>.webp and <name>-thumb.webp. With no
// files named, every PNG in the folder is converted. ffmpeg comes from the
// ffmpeg-static package — see make-posters.mjs for why not the system one.
import ffmpeg from 'ffmpeg-static';
import { execFile } from 'node:child_process';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import path from 'node:path';

const run = promisify(execFile);
const [src, id, ...only] = process.argv.slice(2);
if (!src || !id) {
  console.error('usage: node scripts/make-screens.mjs <source-dir> <project-id> [file.png ...]');
  process.exit(1);
}

// The dialog is at most ~710px wide, so 1440 covers it at 2x. Thumbnails sit
// in a strip at ~112px wide, so 240 covers those at 2x.
const SIZES = [
  { suffix: '', width: 1440, quality: 78 },
  { suffix: '-thumb', width: 240, quality: 70 },
];

const out = path.join('src/assets', id);
await mkdir(out, { recursive: true });
const files = only.length ? only : (await readdir(src)).filter((f) => f.endsWith('.png')).sort();

for (const file of files) {
  // "02-dashboard.png" -> "dashboard"
  const name = file.replace(/\.png$/, '').replace(/^\d+-/, '');
  for (const { suffix, width, quality } of SIZES) {
    const dest = path.join(out, `${name}${suffix}.webp`);
    await run(ffmpeg, [
      '-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(src, file),
      '-vf', `scale='min(${width},iw)':-2:flags=lanczos`,
      '-c:v', 'libwebp', '-quality', String(quality), '-compression_level', '6', dest,
    ]);
    console.log(`${dest}  ${((await stat(dest)).size / 1024).toFixed(1)} kB`);
  }
}
