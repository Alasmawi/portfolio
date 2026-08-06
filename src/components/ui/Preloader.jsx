import { useEffect, useState } from 'react';
import './Preloader.css';

// Holds the screen until the hero's assets have decoded, so the first thing a
// visitor sees is the finished sky rather than an empty frame filling in.
// Rendering stays mounted underneath the whole time — this only covers it —
// so nothing about the page's layout or measurement depends on the curtain.
export default function Preloader({ ready, progress }) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    setLeaving(true);
    // Unmount after the fade rather than on `ready`, or the curtain would
    // vanish instantly and there would be nothing to fade.
    const t = window.setTimeout(() => setGone(true), 700);
    return () => window.clearTimeout(t);
  }, [ready]);

  // Scrolling behind a full-screen overlay leaves you somewhere unexpected once
  // it lifts, and this page snaps between sections — so pin it until we're out.
  useEffect(() => {
    if (gone) return undefined;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div
      className="preloader"
      data-leaving={leaving}
      role="status"
      aria-live="polite"
      aria-busy={!ready}
    >
      <div className="preloader__mark">~/alasmawi</div>
      <div className="preloader__track">
        <div className="preloader__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="preloader__label">
        {ready ? 'ready' : `loading ${progress}%`}
      </div>
    </div>
  );
}
