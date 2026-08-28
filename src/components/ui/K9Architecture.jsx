import { lazy, Suspense, useEffect, useState } from 'react';

// React Flow is ~58kB gzipped and this diagram is the only thing on the site
// that needs it, so it is split out and fetched when the panel renders rather
// than shipped in the main bundle.
const K9Flow = lazy(() => import('./K9Flow'));

const DESCRIPTION =
  'Three ESP32 devices — a smart collar, the Node-A kennel environmental sensor and a smart food scale — report to a Raspberry Pi 5 running AWS IoT Greengrass in the kennel. The gateway forwards telemetry to AWS IoT Core over MQTT. A Reolink IP camera streams video to AWS on its own path, bypassing the gateway. In the cloud, Lambda applies the detection rules and Amazon Bedrock turns anything it flags into a plain-language explanation. Readings and events are stored in DynamoDB and served to a React dashboard over REST, while live status is pushed straight from IoT Core.';

// The two layouts are different node graphs, not one graph scaled down, so the
// breakpoint has to be a real media query rather than a CSS class toggle.
function useVariant() {
  const query = '(min-width: 640px)';
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return wide ? 'wide' : 'tall';
}

export default function K9Architecture() {
  const variant = useVariant();

  return (
    <figure className="m-0 min-w-0">
      <div className="overflow-hidden rounded-lg border border-white/[0.12] bg-[#10121d]">
        <Suspense
          fallback={<div style={{ height: variant === 'tall' ? 620 : 336 }} aria-hidden="true" />}
        >
          <K9Flow variant={variant} />
        </Suspense>
        {/* The two path colours and the dashboard's two feeds, as a legend
            rather than edge labels — routed labels landed on top of the nodes
            they were routed around. */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-white/[0.08] px-3 py-2 font-mono text-[10px] text-text-muted"
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
          <span className="text-text-dim">dashboard reads over REST · live status pushed from IoT Core</span>
        </div>
      </div>
      {/* The canvas itself is aria-hidden — node order on a graph makes for
          incoherent screen-reader output — so the prose carries the content. */}
      <p className="sr-only">{DESCRIPTION}</p>
      <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
        architecture · sensor to handler
      </figcaption>
    </figure>
  );
}
