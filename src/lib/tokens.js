// Reads a palette channel triplet out of the CSS custom properties in
// index.css, for the things that cannot use a CSS variable directly: canvas
// fillStyle strings and THREE.Color both need a resolved value, not
// `rgb(var(--accent))`.
//
// One source of truth either way — change the token and the rain, the helix and
// the hero cloud all follow, the same as everything drawn in CSS.
const cache = new Map();

function channels(name, fallback) {
  if (cache.has(name)) return cache.get(name);
  let out = fallback;
  if (typeof window !== 'undefined') {
    const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    // "224 163 64" -> "224,163,64"
    if (raw) out = raw.split(/[\s,]+/).slice(0, 3).join(',');
  }
  cache.set(name, out);
  return out;
}

/** "224,163,64" — for building rgba() strings by hand. */
export const tokenChannels = channels;

/** "rgb(224,163,64)" — for anything that parses a CSS colour, THREE included. */
export function tokenColor(name, fallback) {
  return `rgb(${channels(name, fallback)})`;
}
