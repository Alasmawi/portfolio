// Computes WCAG 2.1 contrast for every token pairing the site actually uses,
// reading the tokens out of tailwind.config.js so the numbers can't drift from
// what ships. Card fills are composited first: `bg-base-surface/60` over the
// page ground is #1e202d, not #232532, and that is the ground a border inside
// a card is actually seen against.
//
//   node scripts/check-contrast.mjs
import config from '../tailwind.config.js';

const c = config.theme.extend.colors;
const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const to = (v) => '#' + v.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
const over = (fg, a, bg) => to(hx(fg).map((x, i) => x * a + hx(bg)[i] * (1 - a)));
const lin = (x) => { x /= 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const L = (h) => { const [r, g, b] = hx(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const CR = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const grounds = {
  'base.bg': c.base.bg,
  'card fill (surface/60 on bg)': over(c.base.surface, 0.6, c.base.bg),
  'base.surface': c.base.surface,
  void: c.void,
};

// [name, value, required ratio, why]
const checks = [
  ['base.edge', c.base.edge, 3, 'bounds inputs, ghost buttons, tabs — SC 1.4.11'],
  ['base.hairline', c.base.hairline, 0, 'decorative separation only, no SC floor'],
  ['text.dim', c.text.dim, 4.5, 'body-size text — SC 1.4.3 AA'],
  ['text.muted', c.text.muted, 4.5, 'body-size text — SC 1.4.3 AA'],
  ['text.primary', c.text.primary, 4.5, 'body-size text — SC 1.4.3 AA'],
  ['accent.body', c.accent.body, 4.5, 'accent-tinted body text'],
  ['accent.bright', c.accent.bright, 4.5, 'accent-tinted body text'],
  ['accent (tag border /70)', null, 3, 'tag outline, non-interactive'],
];

let failed = 0;
const pad = (s, n) => String(s).padEnd(n);
console.log(pad('token', 26) + Object.keys(grounds).map((g) => pad(g, 30)).join('') + 'floor');
console.log('-'.repeat(26 + 30 * Object.keys(grounds).length + 6));
for (const [name, value, floor, why] of checks) {
  const cells = Object.entries(grounds).map(([, gv]) => {
    const v = value ?? over(c.accent.DEFAULT, 0.7, gv);
    const r = CR(v, gv);
    const ok = floor === 0 || r >= floor;
    if (!ok) failed++;
    return pad(`${r.toFixed(2)}${ok ? '' : '  FAIL'}`, 30);
  });
  console.log(pad(name, 26) + cells.join('') + (floor || '—'));
  console.log(pad('', 26) + `  ${why}`);
}
console.log(failed === 0 ? '\nAll floors met.' : `\n${failed} pairing(s) below floor.`);
process.exit(failed === 0 ? 0 : 1);
