import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { CANVAS, WIDE_MIN_CONTAINER } from './k9Geometry';

// React Flow is ~58kB gzipped and this diagram is the only thing on the site
// that needs it, so it is split out and fetched when the panel renders rather
// than shipped in the main bundle.
const K9Flow = lazy(() => import('./K9Flow'));

// Kept in step with the drawing: same devices, same two ingest paths, same
// diamond at the end where only flagged events detour through Bedrock.
const DESCRIPTION =
  'Three ESP32 devices — a smart collar, the Node-A kennel environmental sensor and a smart food scale — report to a Raspberry Pi 5 running AWS IoT Greengrass in the kennel. The gateway forwards their telemetry to AWS IoT Core over MQTT. A Reolink IP camera streams video to AWS on its own path, bypassing the gateway. In the cloud both paths reach Lambda, which applies the detection rules and writes every reading and event to DynamoDB; anything it flags also goes to Amazon Bedrock, which turns the flag into a plain-language explanation and stores that alongside. A React dashboard reads from DynamoDB over REST, and IoT Core pushes live status to it directly.';

// The layout is chosen from the *container's* width, not the viewport's. Those
// are not the same thing here: the projects panel drops a 264px sidebar in at
// 768px, which narrows this container from 570px to 342px even though the
// window just got wider. A media query picked the wide graph for exactly the
// narrowest containers in the range and fitView shrank it to 0.35.
function useVariant() {
  const ref = useRef(null);
  // Starts compact: it fits everywhere, so the first paint is never the broken
  // one while we wait for a measurement.
  const [variant, setVariant] = useState('compact');

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      setVariant(el.clientWidth >= WIDE_MIN_CONTAINER ? 'wide' : 'compact');
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, variant];
}

export default function K9Architecture() {
  const [ref, variant] = useVariant();

  return (
    <figure className="m-0 min-w-0">
      {/* Same ground as the panel it sits in, not #10121d. A third dark tone
          nested inside the panel inside the rain band read as a box in a box in
          a box; on the panel's own ground with one hairline it reads as part of
          it. */}
      <div ref={ref} className="overflow-hidden rounded-lg border border-base-hairline bg-void">
        <Suspense fallback={<div style={{ height: CANVAS[variant].h }} aria-hidden="true" />}>
          <K9Flow variant={variant} />
        </Suspense>
        {/* The two path colours and the dashboard's two feeds, as a legend
            rather than edge labels — routed labels landed on top of the nodes
            they were routed around. */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-base-hairline px-3 py-2 font-mono text-[10.5px] text-text-muted"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t border-dashed" style={{ borderColor: '#9184d9' }} />
            telemetry
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t border-dashed" style={{ borderColor: '#2FC2E8' }} />
            video
          </span>
          <span className="text-text-dim">
            dashboard reads over REST · live status pushed from IoT Core
          </span>
        </div>
      </div>
      {/* The canvas itself is aria-hidden — node order on a graph makes for
          incoherent screen-reader output — so the prose carries the content. */}
      <p className="sr-only">{DESCRIPTION}</p>
      <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
        sensor to handler
      </figcaption>
    </figure>
  );
}
