import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// App screenshots, one at a time at full width with a caption, and a strip of
// thumbnails to jump between them. The ring gallery is built for hardware —
// objects you turn to look at — and would shrink and skew a screen full of
// text until it couldn't be read. A screen wants to be flat and large.
//
// The frame's aspect ratio matches the captures (1440x900), so nothing is
// letterboxed or cropped.
export default function ScreenGallery({ items = [] }) {
  const [index, setIndex] = useState(0);
  const stripRef = useRef(null);
  const count = items.length;
  const item = items[index];

  const go = useCallback((delta) => setIndex((i) => (i + delta + count) % count), [count]);

  // Warm the neighbours so stepping through doesn't wait on the network.
  useEffect(() => {
    [index - 1, index + 1].forEach((i) => {
      const next = items[(i + count) % count];
      if (next) new Image().src = next.src;
    });
  }, [index, items, count]);

  // Keep the current thumbnail in view in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.querySelector(`[data-index="${index}"]`);
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }, [index]);

  // Arrow keys step from anywhere in the gallery. From the thumbnail strip,
  // focus follows the selection, per the tabs pattern.
  const onKeyDown = (e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + count) % count;
    setIndex(next);
    if (stripRef.current?.contains(e.target)) {
      requestAnimationFrame(() => stripRef.current?.querySelector(`[data-index="${next}"]`)?.focus());
    }
  };

  if (!count) return null;

  return (
    <div className="grid gap-3" onKeyDown={onKeyDown}>
      <figure className="m-0">
        <div
          className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(251,238,240,0.1)]"
          tabIndex={0}
          aria-roledescription="carousel"
          aria-label={`Screenshots, ${index + 1} of ${count}. Use the arrow keys to move between them.`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={item.src}
              src={item.src}
              alt={item.alt}
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
          </AnimatePresence>

          <span className="absolute right-2.5 top-2.5 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10.5px] tabular-nums text-text-primary backdrop-blur-sm">
            {index + 1} / {count}
          </span>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous screenshot"
                className="glass-control absolute left-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-text-primary opacity-90 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next screenshot"
                className="glass-control absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-text-primary opacity-90 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
        <figcaption className="mt-2.5 flex items-start justify-between gap-4">
          <span className="text-[13.5px] leading-snug text-text-primary/85">{item.caption}</span>
          {/* The full capture, for anyone who wants to read the small print. */}
          <a
            href={item.src}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 font-mono text-[11px] text-text-muted transition-colors hover:text-accent-bright"
          >
            <Maximize2 size={12} aria-hidden="true" />
            Full size
          </a>
        </figcaption>
      </figure>

      <div
        ref={stripRef}
        role="tablist"
        aria-label="Screenshots"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]"
      >
        {items.map((it, i) => {
          const on = i === index;
          return (
            <button
              key={it.src}
              type="button"
              role="tab"
              data-index={i}
              aria-selected={on}
              aria-label={it.caption}
              tabIndex={on ? 0 : -1}
              onClick={() => setIndex(i)}
              className={`relative aspect-[16/10] w-[104px] shrink-0 overflow-hidden rounded-lg transition-[opacity,box-shadow] sm:w-[112px] ${
                on
                  ? 'opacity-100 shadow-[0_0_0_2px_rgb(240_157_176)]'
                  : 'opacity-60 shadow-[inset_0_0_0_1px_rgba(251,238,240,0.14)] hover:opacity-90'
              }`}
            >
              <img src={it.thumb ?? it.src} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
