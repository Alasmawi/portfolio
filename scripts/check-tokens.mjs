// Fails if the palette has drifted.
//
// The site carries its colours in two places by necessity: tailwind.config.js,
// which has to be plain hex because scripts/check-contrast.mjs does WCAG maths
// on the values, and the `:root` block in src/index.css, which hand-written CSS
// and inline styles in JSX read through var(). This checks the two agree, and
// that no file has gone back to a hex from a retired palette.
//
//   node scripts/check-tokens.mjs
import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import config from '../tailwind.config.js';

const run = promisify(execFile);
const c = config.theme.extend.colors;

// var name in :root  →  the token in tailwind.config.js it must equal
const PAIRS = {
  '--bg': c.base.bg,
  '--surface': c.base.surface,
  '--void': c.void,
  '--edge': c.base.edge,
  '--hairline': c.base.hairline,
  '--text-primary': c.text.primary,
  '--text-muted': c.text.muted,
  '--text-dim': c.text.dim,
  '--accent': c.accent.DEFAULT,
  '--accent-bright': c.accent.bright,
  '--accent-body': c.accent.body,
  '--amber': c.amber.DEFAULT,
  '--amber-bright': c.amber.bright,
  '--signal': c.signal,
};

// Hexes and rgb() triples from palettes this site no longer uses. Each one of
// these shipped for weeks after the ground moved, painting the old purple over
// burgundy content, because nothing was watching for them.
const RETIRED = [
  ['#17121a', 'old purple ground'],
  ['23,18,26', 'old purple ground, rgb()'],
  ['23, 18, 26', 'old purple ground, rgb()'],
  ['#0d0a0f', 'old deep ground'],
  ['13,10,15', 'old deep ground, rgb()'],
  ['13, 10, 15', 'old deep ground, rgb()'],
  ['#e07a9a', 'old rose accent'],
  ['224_122_154', 'old rose accent, Tailwind arbitrary value'],
  ['224,122,154', 'old rose accent, rgb()'],
  ['224, 122, 154', 'old rose accent, rgb()'],
  ['#fdf3f4', 'old cream'],
  ['253_243_244', 'old cream, Tailwind arbitrary value'],
  ['253,243,244', 'old cream, rgb()'],
  ['253, 243, 244', 'old cream, rgb()'],
];

const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
const root = css.match(/:root\s*\{([\s\S]*?)\}/);
if (!root) {
  console.error('no :root block in src/index.css');
  process.exit(1);
}

let failed = 0;
for (const [name, expected] of Object.entries(PAIRS)) {
  const m = root[1].match(new RegExp(`${name}:\\s*([^;]+);`));
  if (!m) {
    console.error(`MISSING  ${name} — not defined in :root`);
    failed++;
    continue;
  }
  const got = m[1].trim().toLowerCase();
  if (got !== expected.toLowerCase()) {
    console.error(`DRIFT    ${name}: index.css has ${got}, tailwind.config.js has ${expected}`);
    failed++;
  }
}

for (const [needle, why] of RETIRED) {
  let out = '';
  try {
    ({ stdout: out } = await run('grep', ['-rn', '-F', needle, 'src', 'index.html'], {
      cwd: new URL('..', import.meta.url).pathname,
    }));
  } catch {
    continue; // grep exits 1 on no match, which is the pass
  }
  for (const line of out.trim().split('\n')) {
    console.error(`RETIRED  ${needle} (${why})\n         ${line}`);
    failed++;
  }
}

if (failed) {
  console.error(`\n${failed} problem${failed === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`${Object.keys(PAIRS).length} tokens match tailwind.config.js, no retired colours in src.`);
