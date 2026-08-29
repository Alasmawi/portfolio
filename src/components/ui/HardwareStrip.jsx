import { useEffect, useRef, useState } from 'react';

// The gallery for containers too narrow to turn a 3D ring in — phones, and the
// 768-1023px band where the projects sidebar squeezes the panel to 342px.
//
// Same cards as RingGallery, laid flat: the mat, the hairline around the image
// well, the tag and the corner brackets on the focused card are all the shared
// styles from RingGallery.css. Only the rotation is desktop-only. It replaced a
// row of bare 132px thumbnails, which showed the same photos but none of the
// gallery's card treatment.
export default function HardwareStrip({ items = [] }) {
  const scrollerRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;
    const slides = [...scroller.querySelectorAll('[data-index]')];
    if (!slides.length) return undefined;

    // Cards are 74% wide, so two can never both clear 75% — whichever does is
    // unambiguously the one being looked at.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.index));
        });
      },
      { root: scroller, threshold: 0.75 }
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <div>
      {/* tabIndex so the scrollable region is reachable and scrollable by
          keyboard, which WCAG 2.1.1 asks of any scroll container. */}
      <ul
        ref={scrollerRef}
        className="hw-strip"
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Hardware gallery — scroll or swipe to browse"
      >
        {items.map((item, i) => (
          <li
            key={item.tag ?? item.src}
            className="hw-slide"
            data-index={i}
            data-active={i === active}
          >
            <figure className="ring-card m-0" data-slide-type={item.type ?? 'image'}>
              <img
                src={item.src}
                alt={item.alt ?? ''}
                loading="lazy"
                draggable={false}
                className="ring-card__img"
              />
              {item.tag && <figcaption className="ring-card__tag">{item.tag}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-1.5 font-mono text-[10px] tracking-wide text-text-dim" aria-hidden="true">
        {active + 1} / {items.length}
      </p>
    </div>
  );
}
