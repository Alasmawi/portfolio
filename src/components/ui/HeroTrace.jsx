import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TRACES } from '../../data/traces';
import { openProject } from '../../lib/openProject';

// The hero's figure: one real flow through a project, drawn the way a tracing
// tool draws a request — a waterfall of hops on a shared time axis, lit in
// order as a playhead sweeps across. It cycles through three projects, so the
// first screen shows the whole stack (device or browser, gateway, API, data,
// the person at the other end) three times over instead of a picture of a
// cloud.
//
// It replaced a three.js scene: a 540kB chunk to draw an ornament. This is a
// few dozen divs animating transform and opacity.
const RUN_S = 4.2; // one sweep of the playhead
const HOLD_MS = 4400; // the finished trace stays up this long before the next

const BAR = {
  plain: 'linear-gradient(90deg, rgba(226,96,126,.5), rgba(240,157,176,.92))',
  gate: 'linear-gradient(90deg, rgba(240,164,72,.55), rgba(251,215,164,.95))',
  live: 'linear-gradient(90deg, rgba(226,96,126,.5), rgba(251,211,220,.95))',
};

export default function HeroTrace() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const trace = TRACES[index];

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Advances only while it is on screen and nobody is reading it: a pointer
  // over the panel or focus inside it holds the current trace.
  useEffect(() => {
    if (reduce || paused || !inView) return undefined;
    const t = window.setTimeout(
      () => setIndex((n) => (n + 1) % TRACES.length),
      RUN_S * 1000 + HOLD_MS
    );
    return () => window.clearTimeout(t);
  }, [index, reduce, paused, inView]);

  const onTabKey = useCallback((e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    setIndex((n) => {
      const next = (n + delta + TRACES.length) % TRACES.length;
      document.getElementById(`trace-tab-${TRACES[next].id}`)?.focus();
      return next;
    });
  }, []);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      className="glass-pane relative overflow-hidden rounded-[28px]"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 85% 0%, rgba(226,96,126,.14), rgba(226,96,126,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-white/[0.08] px-4 py-3 sm:px-5">
        <p className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-muted">
          <span
            className="signal-blip h-[6px] w-[6px] rounded-full bg-signal"
            style={{ boxShadow: '0 0 8px rgba(79,209,197,.9)' }}
            aria-hidden="true"
          />
          Data path
        </p>
        <div role="tablist" aria-label="Project" onKeyDown={onTabKey} className="flex gap-1">
          {TRACES.map((t, n) => {
            const on = n === index;
            return (
              <button
                key={t.id}
                id={`trace-tab-${t.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="trace-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setIndex(n)}
                className={`min-h-8 rounded-full px-3 text-[12px] transition-colors ${
                  on
                    ? 'bg-white/[0.14] text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,.35)]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {t.tab}
              </button>
            );
          })}
        </div>
      </div>

      <div
        id="trace-panel"
        role="tabpanel"
        aria-labelledby={`trace-tab-${trace.id}`}
        className="relative px-4 pb-4 pt-3.5 sm:px-5 sm:pb-5"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={trace.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <p className="font-mono text-[11px] text-text-dim">
              <span className="text-text-muted">event</span>
              <span className="mx-2 text-white/25">·</span>
              {trace.event}
            </p>

            <div className="relative mt-3.5">
              <ol className="grid gap-y-[7px]">
                {trace.spans.map((s) => {
                  const delay = s.start * RUN_S;
                  return (
                    <li
                      key={s.name}
                      className="grid grid-cols-[minmax(0,46%)_minmax(0,1fr)] items-center gap-x-3"
                    >
                      <motion.div
                        initial={reduce ? false : { opacity: 0.35 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay }}
                        className="min-w-0"
                      >
                        <p className="truncate text-[13px] leading-tight text-text-primary">{s.name}</p>
                        <p className="truncate font-mono text-[10.5px] leading-tight text-text-dim">
                          {s.detail}
                        </p>
                      </motion.div>
                      <div className="relative h-[9px] rounded-full bg-white/[0.05] shadow-[inset_0_0_0_1px_rgba(251,238,240,0.06)]">
                        <motion.span
                          className="absolute inset-y-0 origin-left rounded-full"
                          style={{
                            left: `${s.start * 100}%`,
                            width: `${s.width * 100}%`,
                            background: BAR[s.kind ?? 'plain'],
                          }}
                          initial={reduce ? false : { scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: s.width * RUN_S, delay, ease: 'linear' }}
                        />
                        {s.kind === 'live' && (
                          <motion.span
                            className="signal-blip absolute top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-signal"
                            style={{
                              left: `calc(${(s.start + s.width) * 100}% + 5px)`,
                              boxShadow: '0 0 10px rgba(79,209,197,.9)',
                            }}
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: (s.start + s.width) * RUN_S }}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* The playhead, over the lane column only. */}
              {!reduce && (
                <div
                  className="pointer-events-none absolute inset-y-[-4px] right-0"
                  style={{ left: 'calc(46% + 12px)' }}
                  aria-hidden="true"
                >
                  <motion.span
                    className="absolute inset-y-0 w-px bg-accent-bright/70"
                    style={{ boxShadow: '0 0 12px rgba(251,211,220,.7)' }}
                    initial={{ left: '0%', opacity: 1 }}
                    animate={{ left: '100%', opacity: [1, 1, 0] }}
                    transition={{ duration: RUN_S, ease: 'linear', times: [0, 0.94, 1] }}
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-white/[0.08] pt-3.5">
              <motion.p
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : RUN_S - 0.2 }}
                className="max-w-[36ch] text-[13px] leading-snug text-text-primary/80"
              >
                {trace.result}
              </motion.p>
              <button
                type="button"
                onClick={() => openProject(trace.id)}
                className="btn btn-ghost glass-control min-h-9 shrink-0 px-3.5 text-[12.5px]"
              >
                <span className="flex items-center gap-1.5">
                  Open {trace.tab}
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
