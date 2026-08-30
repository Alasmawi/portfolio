import { useEffect, useRef } from 'react';

// Matrix-style syntax rain, ported from the Nocturne design bundle's boot()
// rain engine (Portfolio Refactor.dc.html). One shared rAF loop animates
// every mounted field; each field gates itself on IntersectionObserver and
// tab visibility, and reduced-motion gets a single static frame instead of
// a loop.
//
// Props mirror the design's data-* attributes:
//   size      glyph px (default 13)
//   density   0–1, fraction of columns that carry a drop (default 0.6)
//   dim       halve the "hot" glyph alpha (default false)
//   tint      'r,g,b' string for the base glyph color (default Nocturne accent)
//   opacity   base alpha multiplier (default 0.55)
//   glyphs    'mixed' | 'symbols' | 'hex' (default 'mixed')
//   fade      [{x1,y1,x2,y2,a}] rects in 0–1 fractions — multiplies glyph alpha down
//   exclude   [{x1,y1,x2,y2}] rects in 0–1 fractions — nothing drawn inside

const GLYPH_SETS = {
  symbols: '{}[]()<>/\\=;:.,*+-|&!?$#@~^%_"\'`',
  mixed: '{}[]<>/=;:*+-|&01234567890abcdefxAWSiotconst=>awaitasync',
  hex: '0123456789ABCDEFx',
};

// --- shared animator -------------------------------------------------
// A registry of live fields plus exactly one requestAnimationFrame loop,
// matching the design's "one shared rAF loop over all fields" contract
// rather than one loop per canvas.
const fields = new Set();

if (import.meta.env.DEV) {
  // Lets the screenshot script check that a resize preserved the drops rather
  // than reseeding them: the y positions are the state that visibly restarts.
  window.__rainDrops = () =>
    Array.from(fields).map((f) => (f.drops.filter(Boolean)[0]?.y ?? 0).toFixed(2));
}
let raf = 0;
let last = 0;

function tick(now) {
  if (document.hidden) { raf = 0; return; }
  const anyOnScreen = Array.from(fields).some((f) => f.onScreen);
  if (!anyOnScreen) { raf = 0; return; }
  const dt = Math.min((now - last) / 16.7, 3);
  last = now;
  for (const f of fields) {
    if (!f.onScreen) continue;
    paint(f, dt);
  }
  raf = requestAnimationFrame(tick);
}

function startLoop() {
  if (raf) return;
  last = performance.now();
  raf = requestAnimationFrame(tick);
}

function paint(f, dt) {
  const { ctx, w, h, chars, opacity } = f;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = `rgba(0,0,0,${0.055 * dt})`;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
  f.drops.forEach((d, i) => {
    if (!d) return;
    d.y += d.v * dt;
    if (d.y > h + f.size) {
      d.y = -f.size * (1 + Math.random() * 8);
      d.v = (0.5 + Math.random() * 1.1) * f.speed * f.size * 0.55;
    }
    const x = i * f.gap + 2;
    for (const r of f.exclude) {
      if (x >= r.x1 - f.size && x <= r.x2 && d.y >= r.y1 - f.size && d.y <= r.y2) return;
    }
    let m = 1;
    for (const r of f.fade) {
      if (x >= r.x1 - f.size && x <= r.x2 && d.y >= r.y1 - f.size && d.y <= r.y2) m = Math.min(m, r.a);
    }
    const ch = chars[(Math.random() * chars.length) | 0];
    const hot = d.lead > 0.72;
    ctx.fillStyle = hot
      ? `rgba(210,206,253,${opacity * (f.dim ? 0.6 : 1) * m})`
      : `rgba(${f.tint},${opacity * (f.dim ? 0.32 : 0.62) * m})`;
    ctx.fillText(ch, x, d.y);
  });
}

function paintStatic(f) {
  f.drops.forEach((d, i) => {
    if (!d) return;
    const x = i * f.gap + 2;
    for (let y = 6; y < f.h; y += f.gap * 2.6) {
      let blocked = false;
      for (const r of f.exclude) {
        if (x >= r.x1 - f.size && x <= r.x2 && y >= r.y1 - f.size && y <= r.y2) blocked = true;
      }
      if (blocked) continue;
      let m = 1;
      for (const r of f.fade) {
        if (x >= r.x1 - f.size && x <= r.x2 && y >= r.y1 - f.size && y <= r.y2) m = Math.min(m, r.a);
      }
      f.ctx.fillStyle = `rgba(${f.tint},${f.opacity * 0.3 * m})`;
      f.ctx.fillText(f.chars[(Math.random() * f.chars.length) | 0], x, y);
    }
  });
}

// Sizing the backing store is separated from seeding the field because the two
// happen on very different schedules. A field is seeded once; it is *resized*
// every time the element's box changes, and on a phone that includes the URL
// bar collapsing under a scroll. Assigning canvas.width clears the bitmap and
// resets the 2D context, so both have to be re-applied here — but the drops
// survive, which is the whole point: rebuilding them restarted the rain
// visibly on the first flick of every visit.
function applyBacking(canvas, w, h, size) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.textBaseline = 'top';
  return ctx;
}

const toRect = (frac, w, h) => ({
  x1: frac.x1 * w,
  y1: frac.y1 * h,
  x2: frac.x2 * w,
  y2: frac.y2 * h,
  a: frac.a ?? 0.22,
});

const seedDrop = (speed, size) => ({
  y: Math.random() * 1,
  v: (0.5 + Math.random() * 1.1) * speed * size * 0.55,
  lead: Math.random(),
});

function buildField(canvas, props) {
  if (import.meta.env.DEV) {
    window.__buildFieldCalls = (window.__buildFieldCalls || 0) + 1;
  }
  const w = canvas.clientWidth || 300;
  const h = canvas.clientHeight || 300;

  const size = props.size ?? 13;
  const gap = size * 1.15;
  const cols = Math.max(1, Math.floor(w / gap));
  const density = props.density ?? 0.6;
  const speed = props.speed ?? 1;
  const chars = (GLYPH_SETS[props.glyphs] || GLYPH_SETS.mixed).split('');
  const ctx = applyBacking(canvas, w, h, size);

  const drops = [];
  for (let i = 0; i < cols; i++) {
    if (Math.random() < density) {
      const d = seedDrop(speed, size);
      d.y = Math.random() * h;
      drops.push(d);
    } else {
      drops.push(null);
    }
  }

  const excludeFrac = props.exclude || [];
  const fadeFrac = props.fade || [];

  return {
    canvas,
    ctx,
    w,
    h,
    gap,
    size,
    speed,
    density,
    drops,
    chars,
    excludeFrac,
    fadeFrac,
    exclude: excludeFrac.map((r) => toRect(r, w, h)),
    fade: fadeFrac.map((r) => toRect(r, w, h)),
    tint: props.tint || '145,132,217',
    dim: !!props.dim,
    opacity: props.opacity ?? 0.55,
    onScreen: false,
  };
}

// Re-derives everything that depends on the element's box, and nothing else.
// Returns false when the box hasn't actually moved, which is the common case:
// a ResizeObserver on a full-bleed canvas fires for any ancestor reflow.
function resizeField(f) {
  const w = f.canvas.clientWidth || 300;
  const h = f.canvas.clientHeight || 300;
  if (w === f.w && h === f.h) return false;

  f.ctx = applyBacking(f.canvas, w, h, f.size);

  // Columns are a function of width alone, so a height-only change — the URL
  // bar collapsing — keeps every drop exactly where it was. A width change
  // adds or drops columns at the right edge and leaves the rest untouched.
  const cols = Math.max(1, Math.floor(w / f.gap));
  if (cols > f.drops.length) {
    while (f.drops.length < cols) {
      const d = Math.random() < f.density ? seedDrop(f.speed, f.size) : null;
      // Spread over the full height, so a column that appears at the right
      // edge on a rotation doesn't arrive as a row of drops all at the top.
      if (d) d.y = Math.random() * h;
      f.drops.push(d);
    }
  } else if (cols < f.drops.length) {
    f.drops.length = cols;
  }

  f.w = w;
  f.h = h;
  f.exclude = f.excludeFrac.map((r) => toRect(r, w, h));
  f.fade = f.fadeFrac.map((r) => toRect(r, w, h));
  return true;
}

export default function SyntaxRain({
  size = 13,
  density = 0.6,
  dim = false,
  tint,
  opacity = 0.55,
  glyphs = 'mixed',
  fade,
  exclude,
  className = '',
  style,
}) {
  const canvasRef = useRef(null);
  // Freeze the config on mount — this is decorative background, not
  // something that needs to re-diff every render.
  const propsRef = useRef({ size, density, dim, tint, opacity, glyphs, fade, exclude });
  propsRef.current = { size, density, dim, tint, opacity, glyphs, fade, exclude };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let field = null;
    let staticPainted = false;

    const ensureField = () => {
      if (!field) field = buildField(canvas, propsRef.current);
      return field;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (field) field.onScreen = false;
          return;
        }
        const f = ensureField();
        if (reduced) {
          if (!staticPainted) { paintStatic(f); staticPainted = true; }
          return;
        }
        f.onScreen = true;
        fields.add(f);
        startLoop();
      },
      // 50px, not 200. Two of these are mounted — the hero and the projects
      // band — and at 200px both stayed "on screen" well past their own
      // sections, so both kept painting into the shared rAF loop while you read
      // something else entirely. 50px is still enough lead to have the field
      // running before it is visible.
      { rootMargin: '50px' }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      if (!field) return;
      if (!resizeField(field)) return;
      // Assigning canvas.width above cleared the bitmap. Under reduced motion
      // nothing repaints it — there is no loop — so the static frame has to be
      // drawn again here or the canvas is simply blank after a resize.
      if (reduced) paintStatic(field);
    });
    ro.observe(canvas);

    const onVis = () => {
      if (!document.hidden) startLoop();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      if (field) fields.delete(field);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
    />
  );
}
