import { useCallback, useEffect, useRef } from 'react';
import './RingGallery.css';

// A true 360° ring: cards sit on the surface of a cylinder, each rotated to
// face outward, so the ones at the sides are genuinely edge-on rather than
// faked with a flat skew. The ring turns slowly on its own and can be dragged.
const SPIN_DEG_PER_SEC = 7;
const DRAG_DEG_PER_PX = 0.28;
const SNAP_MS = 1100;
const RESUME_AFTER_MS = 2600;
const TAP_SLOP_PX = 6;

// Gap between neighbouring cards on the ring, as a multiple of the radius the
// cards would need just to touch edge-to-edge. Kept close to 1: every extra
// bit of radius throws the flanking cards further out towards the frame edge.
const RING_GAP = 1.05;
const PERSPECTIVE = 1100;
// A slight look-down on the ring, so the cards read as sitting on a turntable
// rather than sliding along a flat line.
const RING_TILT_DEG = 6;

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const mod360 = (a) => ((a % 360) + 360) % 360;

// Shortest signed rotation from a to b, so the ring never takes the long way.
function shortestDelta(a, b) {
  const d = mod360(b - a);
  return d > 180 ? d - 360 : d;
}

export default function RingGallery({ items = [] }) {
  const maskRef = useRef(null);
  const ringRef = useRef(null);
  const slotsRef = useRef([]);

  // All animation state lives in refs — the ring is written straight to the
  // DOM each frame, so spinning never re-renders React.
  const state = useRef({
    angle: 0,
    radius: 0,
    spinning: true,
    resumeAt: 0,
    snap: null, // { from, to, start }
    drag: null, // { pointerId, lastX, startX, moved }
  });

  const count = items.length;
  const step = count > 0 ? 360 / count : 0;

  // Writes the ring and every card to the DOM for the current angle. Called
  // from the animation loop and synchronously on layout, so the ring is never
  // left untransformed (rAF does not run while the tab is hidden).
  const paint = useCallback(() => {
    const { angle, radius } = state.current;
    if (ringRef.current) {
      // Tilting the ring about X lifts the front card by R·sin(tilt); the
      // leading translateY puts it back on the centre line.
      const lift = radius * Math.sin((RING_TILT_DEG * Math.PI) / 180);
      ringRef.current.style.transform =
        `translateY(${lift}px) translateZ(${-radius}px) ` +
        `rotateX(${RING_TILT_DEG}deg) rotateY(${angle}deg)`;
    }
    const frontCos = Math.cos((step / 2) * (Math.PI / 180));
    slotsRef.current.forEach((el, i) => {
      if (!el) return;
      const facing = Math.cos((mod360(i * step + angle) * Math.PI) / 180);
      // Fade to nothing exactly as the card turns edge-on, which is where
      // backface-visibility takes over — otherwise it would pop out.
      const front = Math.max(0, facing);
      el.style.opacity = String(Math.pow(front, 0.8));
      el.style.filter = `blur(${(1 - front) * 2.2}px) saturate(${0.55 + 0.45 * front})`;
      el.style.zIndex = String(Math.round(front * 100));
      el.classList.toggle('is-front', facing > frontCos);
    });
  }, [step]);

  // Radius is derived from the card's CSS width so the breakpoints stay the
  // single source of truth. getComputedStyle, not getBoundingClientRect: the
  // slots are already 3D-transformed, so their client rects are projected.
  const measure = useCallback(() => {
    if (!ringRef.current) return;
    const w = parseFloat(getComputedStyle(ringRef.current).width);
    if (!w) return;
    const r = count > 1 ? (w / 2 / Math.tan(Math.PI / count)) * RING_GAP : 0;
    state.current.radius = r;
    slotsRef.current.forEach((el, i) => {
      if (el) el.style.transform = `rotateY(${i * step}deg) translateZ(${r}px)`;
    });
    paint();
  }, [count, paint, step]);

  useEffect(() => {
    if (count === 0) return undefined;

    measure();
    const ro = new ResizeObserver(measure);
    if (maskRef.current) ro.observe(maskRef.current);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const s = state.current;

    let raf = 0;
    let last = performance.now();
    let inView = true;

    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (maskRef.current) io.observe(maskRef.current);

    const frame = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (s.snap) {
        const p = Math.min(1, (now - s.snap.start) / SNAP_MS);
        s.angle = s.snap.from + (s.snap.to - s.snap.from) * easeInOutCubic(p);
        if (p >= 1) {
          s.snap = null;
          s.resumeAt = now + RESUME_AFTER_MS;
        }
      } else if (
        s.spinning &&
        !s.drag &&
        inView &&
        !document.hidden &&
        !reduced.matches &&
        now >= s.resumeAt
      ) {
        s.angle -= (SPIN_DEG_PER_SEC * dt) / 1000;
      }

      s.angle = mod360(s.angle);
      paint();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, measure, paint, step]);

  // Ease the ring until `index` is centred at the front, then let it drift on.
  const snapTo = useCallback(
    (index) => {
      const s = state.current;
      const target = s.angle + shortestDelta(s.angle, mod360(-index * step));
      s.snap = { from: s.angle, to: target, start: performance.now() };
    },
    [step]
  );

  const onPointerDown = useCallback((e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const s = state.current;
    s.snap = null;
    // Which card was under the finger has to be recorded now: setPointerCapture
    // retargets every later pointer event to the mask, so by pointerup the
    // original card is no longer e.target.
    const slot = e.target.closest?.('[data-ring-index]');
    s.drag = {
      pointerId: e.pointerId,
      lastX: e.clientX,
      moved: 0,
      tapIndex: slot ? Number(slot.getAttribute('data-ring-index')) : null,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    const s = state.current;
    if (!s.drag || s.drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - s.drag.lastX;
    s.drag.lastX = e.clientX;
    s.drag.moved += Math.abs(dx);
    s.angle = mod360(s.angle + dx * DRAG_DEG_PER_PX);
  }, []);

  const endDrag = useCallback(
    (e) => {
      const s = state.current;
      if (!s.drag || s.drag.pointerId !== e.pointerId) return;
      const wasTap = s.drag.moved < TAP_SLOP_PX;
      const { tapIndex } = s.drag;
      s.drag = null;

      if (wasTap && tapIndex !== null) {
        snapTo(tapIndex);
        return;
      }
      // Settle on whichever card ended up nearest the front.
      snapTo(Math.round(mod360(-s.angle) / step) % count);
    },
    [count, snapTo, step]
  );

  const onKeyDown = useCallback(
    (e) => {
      const s = state.current;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = Math.round(mod360(-s.angle) / step);
      const next = current + (e.key === 'ArrowRight' ? 1 : -1);
      snapTo(((next % count) + count) % count);
    },
    [count, snapTo, step]
  );

  if (count === 0) return null;

  return (
    <div
      ref={maskRef}
      className="ring-mask"
      role="group"
      aria-roledescription="carousel"
      aria-label="Project gallery — drag or use arrow keys to turn"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{ perspective: `${PERSPECTIVE}px` }}
    >
      <div ref={ringRef} className="ring">
        {items.map((item, i) => (
          <div
            key={`${item.type}-${item.tag ?? i}`}
            ref={(el) => {
              slotsRef.current[i] = el;
            }}
            className="ring-slot"
            data-ring-index={i}
          >
            <div className="ring-card" data-slide-type={item.type}>
              {/* Sources run from a 3.7:1 dark diagram to 0.75:1 product shots,
                  so images are contained, never cropped. The card background is
                  keyed to the item type: the photos are shot on white, the
                  diagram on the site's own dark surface. */}
              <img
                src={item.src}
                alt={item.alt ?? ''}
                loading="lazy"
                draggable={false}
                className="ring-card__img"
              />
              {item.tag && <span className="ring-card__tag">{item.tag}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
