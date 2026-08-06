import { useEffect, useRef, useState } from 'react';

// Waits for the assets that make the first screen look finished — the hero sky
// photo above all, which is by far the heaviest thing the site loads — and
// reports progress while they arrive.
//
// Three rules keep this from ever stranding a visitor behind the loader:
//   - a failed asset counts as settled, so one 404 cannot hang the page;
//   - a hard timeout resolves everything regardless of network state;
//   - cached loads still hold the screen for a moment, so the loader reads as
//     a deliberate opening rather than a flash of something broken.
const MIN_VISIBLE_MS = 550;
const TIMEOUT_MS = 8000;

// The browser — not us — decides which srcset candidate to fetch, based on
// viewport and DPR. Preloading a fixed URL would download a second file the
// page never displays, so mirror the real <img> attributes and read back the
// candidate it chose.
function resolveFromSrcSet({ src, srcSet, sizes }) {
  if (!srcSet) return src;
  const probe = new Image();
  probe.sizes = sizes ?? '100vw';
  probe.srcset = srcSet;
  probe.src = src;
  // currentSrc is only populated once the candidate is picked; on the rare
  // browser that leaves it empty, the plain src is a correct fallback.
  return probe.currentSrc || src;
}

function loadImage(descriptor) {
  const url = typeof descriptor === 'string' ? descriptor : resolveFromSrcSet(descriptor);
  return new Promise((resolve) => {
    if (!url) {
      resolve();
      return;
    }
    const img = new Image();
    const done = () => resolve();
    img.onload = done;
    // Resolve rather than reject: a missing image is a visual bug to fix, not
    // a reason to trap the reader on the loading screen.
    img.onerror = done;
    img.src = url;
    if (img.decode) {
      // decode() resolves once the bitmap is ready to paint, which is what we
      // actually care about; onload alone can still yield a blank first frame.
      img.decode().then(done).catch(done);
    }
  });
}

export default function useAssetsReady(assets) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  // Freeze the list on first render: callers build it inline, so a new array
  // identity every render would otherwise restart the effect forever.
  const frozen = useRef(assets);

  useEffect(() => {
    const list = frozen.current ?? [];
    let cancelled = false;
    const startedAt = performance.now();

    // Fonts count too — text reflowing from a fallback face right after the
    // curtain lifts looks like the page broke.
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const jobs = [...list.map(loadImage), fontsReady.catch(() => {})];

    let settled = 0;
    const total = jobs.length;
    const tick = () => {
      if (cancelled) return;
      settled += 1;
      setProgress(Math.round((settled / total) * 100));
    };
    jobs.forEach((job) => job.then(tick, tick));

    const finish = () => {
      if (cancelled) return;
      setProgress(100);
      const elapsed = performance.now() - startedAt;
      const hold = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, hold);
    };

    const timeout = window.setTimeout(finish, TIMEOUT_MS);
    Promise.all(jobs).then(finish, finish);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  return { ready, progress };
}
