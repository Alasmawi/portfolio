import { useEffect, useRef, useState } from 'react';
import cloudPoster from '../../assets/hero/cloud.webp';

// The live cloud is three.js: 136 kB gzip, a WebGL context with antialiasing at
// up to 2x pixel ratio, and a PMREM environment bake — 42% of all the
// JavaScript on the site, for one decorative object.
//
// What that spend buys is drift and pointer parallax. A phone has no pointer,
// and the drift is slow enough that most visitors never see a full cycle, so on
// a phone it is 136 kB for a picture. It gets the picture instead: a still of
// the same object, rendered by the same code at build time
// (scripts/make-cloud-poster.mjs) and captured at the phone's own framing.
//
// Deliberately not "hide it on mobile". The cloud is the hero's one piece of
// imagery and it reads clearly at 390px; dropping it would make the hero
// plainer, which is a different thing from making it lighter.
const LIVE_CLOUD = '(min-width: 768px) and (hover: hover)';

export default function HeroCloudCanvas({ accent = '#9184d9', fill = 0.94, exposure = 0.95, className = '', style }) {
  const canvasRef = useRef(null);
  const stillRef = useRef(null);
  // Read once, at mount. A phone does not cross this boundary mid-visit, and
  // re-deciding on resize would mean tearing a WebGL context up and down while
  // someone drags a desktop window.
  const [live] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(LIVE_CLOUD).matches
  );

  // Parallax on the still. The live cloud answers the pointer; a phone has no
  // pointer, so it answers the scroll instead — it drifts up more slowly than
  // the copy beside it, which is what stops it reading as a sticker on a
  // background. Written to a custom property and applied inside the same
  // transform as the drift keyframes, so the two don't fight over `transform`.
  useEffect(() => {
    if (live) return undefined;
    const el = stillRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        // Only while the hero is still on screen; past that it is not visible
        // and the offset would grow without bound.
        const y = Math.min(window.scrollY, window.innerHeight);
        el.style.setProperty('--cloud-parallax', `${(y * 0.18).toFixed(1)}px`);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [live]);

  useEffect(() => {
    if (!live) return undefined;
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
  }, [live]);

  if (!live) {
    return (
      <img
        ref={stillRef}
        src={cloudPoster}
        alt=""
        aria-hidden="true"
        // Matches how the canvas fills the same box, so the still drops into
        // the wrapper Hero already positions without moving anything.
        className={`cloud-still ${className}`}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', ...style }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
    />
  );
}
