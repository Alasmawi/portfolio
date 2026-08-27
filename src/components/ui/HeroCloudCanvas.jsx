import { useEffect, useRef } from 'react';

// Mounts the three.js neon cloud (src/lib/mountCloud.js) on a canvas. Only
// one of these exists on the page (the hero), so — unlike the design
// document, which juggled a roving context across many stacked turns —
// this just mounts once and tears down on unmount.
export default function HeroCloudCanvas({ accent = '#9184d9', fill = 0.94, exposure = 0.95, className = '', style }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let destroy;
    let cancelled = false;
    // Built off the main thread's critical path: the cloud is decorative,
    // so it waits for idle time rather than competing with first paint.
    const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    const cancelSchedule = window.cancelIdleCallback || clearTimeout;
    const handle = schedule(() => {
      if (cancelled) return;
      import('../../lib/mountCloud.js').then(({ mountCloud }) => {
        if (cancelled) return;
        destroy = mountCloud(canvas, { accent, fill, exposure });
      });
    });
    return () => {
      cancelled = true;
      cancelSchedule(handle);
      if (destroy) destroy();
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
