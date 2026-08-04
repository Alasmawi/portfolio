import { useEffect } from 'react';

// Publishes 0→1 scroll progress across the first viewport as a CSS variable on
// <html>. Everything that reacts to it — the hero dimming, the nav going from
// clear to solid — does so in CSS, so scrolling never re-renders React.
//
// The page uses mandatory scroll-snap, so this doesn't tick continuously under
// a finger; it animates during the snap glide between hero and about, which is
// exactly where the change wants to happen.
export default function useScrollDim() {
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const write = () => {
      raf = 0;
      // Complete a little before a full viewport so the nav is fully settled
      // by the time the next section is in place.
      const span = Math.max(1, window.innerHeight * 0.8);
      const p = Math.min(1, Math.max(0, window.scrollY / span));
      root.style.setProperty('--scroll-dim', p.toFixed(3));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      root.style.removeProperty('--scroll-dim');
    };
  }, []);
}
