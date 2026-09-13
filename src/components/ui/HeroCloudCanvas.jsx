import { useEffect, useRef } from 'react';

// The hero cloud, live everywhere.
//
// It used to be a build-time still below 768px, on the argument that three.js
// is 136 kB gzip and a phone has no pointer to parallax against. That argument
// traded the wrong thing away: the cloud is the only object on the site with
// any depth to it, and a flat recolouring of a render is visibly not the render
// — it reads as a picture of the thing rather than the thing.
//
// So the phone gets the real scene, turned down to suit it:
//   · pixel ratio 1 rather than 2 — a quarter of the fragments
//   · no antialiasing, which on a soft contour object is nearly invisible
//   · the context is created when the hero scrolls into view and destroyed when
//     it leaves, so it costs nothing for the rest of a 7000px page
//
// The module is still a dynamic import behind requestIdleCallback, so it never
// competes with first paint.
const COARSE = '(hover: none), (max-width: 767px)';

export default function HeroCloudCanvas({ accent = '#e2607e', fill = 0.94, exposure = 0.95, className = '', style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const lean = window.matchMedia(COARSE).matches;
    let destroy;
    let cancelled = false;
    let handle = 0;
    // The timeout is not optional. requestIdleCallback with no deadline can be
    // deferred for as long as the main thread stays busy, and on a page with
    // this much going on it sometimes never fires at all — which leaves the
    // hero holding an empty canvas. 1500ms keeps it off the critical path
    // while guaranteeing it runs.
    const schedule = window.requestIdleCallback
      ? (fn) => window.requestIdleCallback(fn, { timeout: 1500 })
      : (fn) => setTimeout(fn, 200);
    const cancelSchedule = window.cancelIdleCallback || clearTimeout;

    const mount = () => {
      if (cancelled || destroy) return;
      handle = schedule(() => {
        if (cancelled || destroy) return;
        import('../../lib/mountCloud.js').then(({ mountCloud }) => {
          if (cancelled || destroy) return;
          destroy = mountCloud(canvas, {
            accent,
            fill,
            exposure,
            // A phone renders the same scene with the expensive knobs down.
            maxPixelRatio: lean ? 1 : 2,
            antialias: !lean,
          });
        });
      });
    };

    const unmount = () => {
      cancelSchedule(handle);
      if (destroy) {
        destroy();
        destroy = undefined;
      }
    };

    // Only alive while the hero is on screen. A WebGL context held open behind
    // six other sections is pure cost.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? mount() : unmount()),
      { rootMargin: '200px' }
    );
    io.observe(canvas);

    return () => {
      cancelled = true;
      io.disconnect();
      unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
