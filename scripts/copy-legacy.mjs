// Adds the frozen original site (legacy-v1/) to the build at /v1.
//
// Node rather than shell, on purpose. This step used to compare files with
// `cmp`, which is not installed in Vercel's build image: the check failed on
// the first shared file and took every deploy down with it. Node is the one
// tool a Vite build is guaranteed to have, so the whole step lives here.
//
//   node scripts/copy-legacy.mjs      (run by scripts/build-site.sh, after vite build)
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'legacy-v1';
const DIST = 'dist';

// The original was built with base '/', so its bundle asks for /assets/<hash>
// by absolute path. Its files go into the same dist/assets/ as the new build's.
// Names are content hashes, so a shared name is normally the same file (the K9
// photos are in both) and is skipped; a shared name with different bytes stops
// the build rather than silently serving one site's file to the other.
const assets = await readdir(path.join(SRC, 'assets'));
await mkdir(path.join(DIST, 'assets'), { recursive: true });
let copied = 0;
let shared = 0;
for (const name of assets) {
  const from = path.join(SRC, 'assets', name);
  const to = path.join(DIST, 'assets', name);
  const existing = await readFile(to).catch(() => null);
  if (existing) {
    if (existing.equals(await readFile(from))) {
      shared++;
      continue;
    }
    console.error(`error: ${to} differs between the two builds`);
    process.exit(1);
  }
  await copyFile(from, to);
  copied++;
}

// The archive stays reachable but out of search results, pointing at / as the
// page of record so the two don't compete as duplicates.
const html = await readFile(path.join(SRC, 'index.html'), 'utf8');
if (!html.includes('<head>')) {
  console.error(`error: ${SRC}/index.html has no <head> to add noindex to`);
  process.exit(1);
}
await mkdir(path.join(DIST, 'v1'), { recursive: true });
await writeFile(
  path.join(DIST, 'v1', 'index.html'),
  html.replace(
    '<head>',
    '<head>\n    <meta name="robots" content="noindex" />\n    <link rel="canonical" href="https://alasmawi.dev/" />'
  )
);

console.log(`    /v1   ${copied} assets copied, ${shared} shared with the new build`);
