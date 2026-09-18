// Puts a highlight under the pointer on every `.glass-control` on the page.
//
// Liquid glass is lit glass, and until now the only thing lighting it was a
// specular band on an 18s timer — the same sweep whether you were touching the
// object or three sections away from it. An object that never responds to the
// pointer is a picture of an object.
//
// One listener on the document rather than one per control. There are a dozen
// controls on the page and they come and go (the modal's, the dock's, the
// browser's); a delegated pointermove costs one listener and needs no wiring
// when a control mounts. The handler's whole job is writing two custom
// properties, which repaints that element's background and nothing else — no
// layout, no React render.
//
// Gated to a hovering pointer at md and up, which is where the ::before
// refraction ring is already gated to, so the material has the same number of
// effects everywhere it appears. Reduced motion switches it off: it is the one
// effect here that tracks the reader's own movement, which is exactly what
// motion sensitivity is about.
const QUERY = '(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)';

export function startGlassPointer() {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mq = window.matchMedia(QUERY);
  let attached = false;
  let frame = 0;
  let lit = null;
  let pending = null;

  const paint = () => {
    frame = 0;
    if (!pending) return;
    const { el, x, y } = pending;
    pending = null;
    if (lit && lit !== el) douse(lit);
    lit = el;
    el.style.setProperty('--gx', `${x}%`);
    el.style.setProperty('--gy', `${y}%`);
    el.style.setProperty('--glint', '1');
  };

  const douse = (el) => {
    el.style.setProperty('--glint', '0');
  };

  const onMove = (e) => {
    const el = e.target instanceof Element ? e.target.closest('.glass-control') : null;
    if (!el) {
      if (lit) {
        douse(lit);
        lit = null;
      }
      pending = null;
      return;
    }
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    pending = {
      el,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
    // Coalesced to one write per frame. pointermove fires per input sample,
    // which on a 120Hz trackpad is well over one per paint.
    if (!frame) frame = requestAnimationFrame(paint);
  };

  const onLeave = () => {
    if (lit) douse(lit);
    lit = null;
    pending = null;
  };

  const sync = () => {
    if (mq.matches === attached) return;
    attached = mq.matches;
    if (attached) {
      document.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave, { passive: true });
    } else {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      onLeave();
    }
  };

  sync();
  mq.addEventListener('change', sync);

  return () => {
    mq.removeEventListener('change', sync);
    if (frame) cancelAnimationFrame(frame);
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerleave', onLeave);
  };
}
