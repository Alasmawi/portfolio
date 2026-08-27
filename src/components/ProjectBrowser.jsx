import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Film, Lock, PlayCircle, Star } from 'lucide-react';
import Reveal from './ui/Reveal';
import SyntaxRain from './ui/SyntaxRain';
import RingGallery from './ui/RingGallery';
import HardwareStrip from './ui/HardwareStrip';
import { GithubMark } from './ui/BrandIcons';
import { LANGUAGE_COLORS, PROJECTS } from '../data/projects';

// With the section on screen and nobody touching it, walk to the next project
// so it plays as a gallery. Any interaction restarts the clock — long enough
// that it never pulls a project out from under someone still reading it.
const AUTO_ADVANCE_MS = 30000;
const IDLE_TICK_MS = 1000;

// Stack tags shared across ≥2 real repos, most-shipped first. Derived from
// projects.js rather than hand-picked, so it can't drift into inventory that
// doesn't match what's actually in the list below it.
const RECURRING_STACK = (() => {
  const counts = new Map();
  for (const p of PROJECTS) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return Array.from(counts.entries())
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t);
})();

const RAIN_FADE = [{ x1: 0.03, y1: 0.05, x2: 0.97, y2: 0.96, a: 0.3 }];

function LanguageDot({ language }) {
  if (!language) return null;
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: LANGUAGE_COLORS[language] ?? '#83848f' }}
      aria-hidden="true"
    />
  );
}

function PreviewVideo({ src, label }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React's `muted` JSX prop sets the attribute at mount, but some mobile
    // browsers only honour autoplay if `muted` is true on the element's
    // *property* at the moment play() is called — setting it here, every
    // time the source changes, is what makes autoplay reliable on first
    // load and on every subsequent project switch, not just sometimes.
    v.muted = true;
    v.src = src;
    v.load();
    const playPromise = v.play();
    // Rapid taps/swipes can call play() while a previous one is still
    // settling; the browser rejects the superseded call with a benign
    // AbortError that isn't worth surfacing.
    if (playPromise) playPromise.catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      aria-label={label}
      className="max-h-[440px] w-auto max-w-full object-contain"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );
}

// Below this width the 3D ring is replaced by a flat figure + swipe strip:
// turning a turntable with a thumb on a 390px screen costs more than it pays.
const RING_MIN_WIDTH = 768;

function useIsWide(px) {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function PreviewMedia({ project, wide }) {
  if (project.items?.length) {
    return wide ? (
      <RingGallery items={project.items} />
    ) : (
      <HardwareStrip items={project.items} />
    );
  }

  if (project.video) {
    return (
      <div className="flex max-h-[440px] min-h-[220px] w-full items-center justify-center rounded-lg bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(233,233,237,0.09)]">
        {/* Same visual as a GIF loop, ~90% less data: autoplaying muted video
            with no controls reads identically but decodes far cheaper on
            mid-range phones than an animated GIF. playsInline keeps iOS
            Safari from hijacking it into fullscreen. */}
        <PreviewVideo src={project.video} label={`${project.name} demo`} />
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-lg bg-white/[0.03] text-text-dim shadow-[inset_0_0_0_1px_rgba(233,233,237,0.09)]">
      <Film size={22} />
      <p className="font-mono text-xs uppercase tracking-wider">// preview coming soon</p>
      <p className="font-mono text-[11px] text-text-dim/70">clone the repo to see it run</p>
    </div>
  );
}

// Swipe-to-change-project on the preview pane, mobile's main way to browse
// once you're already looking at one — the tab strip above is still there
// for jumping straight to a specific project by name.
const SWIPE_THRESHOLD_PX = 50;

export default function ProjectBrowser() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];
  const wide = useIsWide(RING_MIN_WIDTH);

  const sectionRef = useRef(null);
  // Activity is tracked in a ref rather than state: pointermove fires
  // constantly, and restarting a timer must not cost a re-render.
  const lastActivityRef = useRef(0);
  const nudgeIdle = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const select = useCallback(
    (id) => {
      setSelectedId(id);
      nudgeIdle();
    },
    [nudgeIdle]
  );

  const swipeRef = useRef(null);

  const step = useCallback(
    (delta) => {
      const i = PROJECTS.findIndex((p) => p.id === selectedId);
      const next = PROJECTS[(i + delta + PROJECTS.length) % PROJECTS.length];
      if (next) select(next.id);
    },
    [selectedId, select]
  );

  const onSwipeDown = useCallback((e) => {
    swipeRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onSwipeUp = useCallback(
    (e) => {
      const start = swipeRef.current;
      swipeRef.current = null;
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      // Require a clearly horizontal gesture so a vertical scroll/fling
      // through the preview pane is never mistaken for a project change.
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy) * 1.5) {
        return;
      }
      step(dx < 0 ? 1 : -1);
    },
    [step]
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    let inView = false;
    lastActivityRef.current = Date.now();

    const io = new IntersectionObserver(
      ([e]) => {
        // Only cycle while a decent slice of the section is actually on screen,
        // and give a full quiet period from the moment it comes into view.
        if (e.isIntersecting && !inView) lastActivityRef.current = Date.now();
        inView = e.isIntersecting;
      },
      { threshold: 0.35 }
    );
    io.observe(node);

    const tick = setInterval(() => {
      if (!inView || document.hidden) {
        // Time spent off-screen or on another tab shouldn't count as idling.
        lastActivityRef.current = Date.now();
        return;
      }
      if (Date.now() - lastActivityRef.current < AUTO_ADVANCE_MS) return;
      lastActivityRef.current = Date.now();
      setSelectedId((current) => {
        const i = PROJECTS.findIndex((p) => p.id === current);
        return PROJECTS[(i + 1) % PROJECTS.length].id;
      });
    }, IDLE_TICK_MS);

    // Anything that suggests someone is still there resets the clock.
    const opts = { passive: true, capture: true };
    const events = ['pointerdown', 'pointermove', 'wheel', 'touchstart', 'keydown'];
    events.forEach((ev) => node.addEventListener(ev, nudgeIdle, opts));

    return () => {
      clearInterval(tick);
      io.disconnect();
      events.forEach((ev) => node.removeEventListener(ev, nudgeIdle, opts));
    };
  }, [nudgeIdle]);

  return (
    <section id="projects" ref={sectionRef} className="bg-base-bg">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-11 sm:px-10 sm:pb-8 sm:pt-14 md:px-14 md:pb-10 md:pt-20">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // 01 [ projects ]
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl font-medium tracking-tight text-text-primary md:text-[38px]">
              Projects
            </h2>
            <p className="whitespace-nowrap font-mono text-[11.5px] text-text-muted">
              ~/projects — live from github.com/Alasmawi
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Full-strength muted, not /70: at 10.5px the faded variant
                measured 4.19:1, under the 4.5:1 AA floor. */}
            <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-muted">
              Recurring stack
            </span>
            <span className="hidden h-3.5 w-px bg-base-border sm:block" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5">
              {RECURRING_STACK.map((tag) => (
                <span key={tag} className="tag-outline text-[11.5px]">
                  {tag}
                </span>
              ))}
            </div>
            <p className="hidden font-mono text-[11px] text-text-dim md:block">
              per-repo stack sits on the repo itself →
            </p>
          </div>
        </Reveal>
      </div>

      {/* Rain band — the repo browser floats on it, gradient-faded top and
          bottom so the band reads as one section rather than a panel on
          flat ground. */}
      {/* Deliberately not wrapped in <Reveal>: this band is a full-bleed
          background taller than a phone screen, and animating its opacity left
          a screen-sized blank while it waited to be 80px inside the viewport.
          The panel sitting on it does the revealing instead. */}
      <div>
        <div className="relative bg-void">
          <SyntaxRain size={13} density={0.55} dim tint="145,132,217" fade={RAIN_FADE} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg,#161826,rgba(15,17,28,.34) 14%,rgba(15,17,28,.34) 86%,#161826)',
            }}
          />

          <Reveal delay={0.05} className="relative block px-5 py-6 sm:px-10 sm:py-9 md:px-14">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-void/85 shadow-[0_0_0_1px_rgba(233,233,237,0.12),0_18px_44px_-20px_rgba(0,0,0,0.9)] backdrop-blur-[2px] md:flex">
              {/* mobile: horizontal chip row */}
              <div className="flex gap-2 overflow-x-auto p-3 md:hidden">
                {PROJECTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => select(p.id)}
                    className={`flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-mono text-xs transition-colors ${
                      p.id === selectedId
                        ? 'bg-accent/10 text-accent-bright shadow-[inset_0_0_0_1px_rgba(145,132,217,0.5)]'
                        : 'text-text-muted shadow-[inset_0_0_0_1px_rgba(233,233,237,0.12)]'
                    }`}
                  >
                    <LanguageDot language={p.language} />
                    {p.name}
                  </button>
                ))}
              </div>

              {/* desktop: fixed-width sidebar */}
              <div className="hidden max-h-[620px] w-[264px] shrink-0 overflow-y-auto border-r border-white/[0.09] md:block">
                <p className="sticky top-0 bg-void/85 px-[18px] py-[13px] font-mono text-[11px] uppercase tracking-wider text-text-muted shadow-[inset_0_-1px_0_rgba(233,233,237,0.09)]">
                  // repositories ({PROJECTS.length})
                </p>
                <ul>
                  {PROJECTS.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => select(p.id)}
                        className={`flex w-full items-center gap-2 border-l-2 px-[18px] py-[11px] text-left transition-colors ${
                          p.id === selectedId
                            ? 'border-l-accent text-text-primary'
                            : 'border-l-transparent text-text-muted hover:bg-white/[0.03] hover:text-text-primary'
                        }`}
                      >
                        {p.flagship ? (
                          <Star size={12} className="shrink-0 text-accent" fill="currentColor" />
                        ) : (
                          <LanguageDot language={p.language} />
                        )}
                        <span className="min-w-0 flex-1 truncate font-mono text-xs">{p.name}</span>
                        {p.private && <Lock size={11} className="shrink-0 text-text-dim" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* preview pane */}
              <div
                className="flex-1 p-[22px] sm:p-6"
                onPointerDown={onSwipeDown}
                onPointerUp={onSwipeUp}
                onPointerCancel={() => {
                  swipeRef.current = null;
                }}
                style={{ touchAction: 'pan-y' }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PreviewMedia project={project} wide={wide} />

                    <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {project.flagship && (
                            <span className="tag-outline text-[10px] uppercase tracking-wider">
                              flagship
                            </span>
                          )}
                          {project.private && (
                            <span className="flex items-center gap-1 rounded border border-base-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                              <Lock size={10} /> private repo
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2 text-[27px] font-medium leading-tight tracking-tight text-text-primary">
                          {project.name}
                        </h3>
                        <p className="mt-0.5 font-mono text-xs text-accent-body">{project.tagline}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.name} on GitHub`}
                            className="btn btn-ghost min-h-9 text-xs"
                          >
                            <GithubMark size={14} />
                            <span>source</span>
                            <ExternalLink size={11} />
                          </a>
                        ) : (
                          <span className="flex items-center gap-2 rounded-md border border-base-border px-3 py-2 font-mono text-xs text-text-dim">
                            <PlayCircle size={14} />
                            internship project
                          </span>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${project.name} live site`}
                            className="btn btn-ghost min-h-9 text-xs"
                          >
                            <PlayCircle size={14} />
                            <span>live</span>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-primary/80">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-outline text-[11.5px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
