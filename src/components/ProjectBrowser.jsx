import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Film, Lock, PlayCircle, Star } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import RingGallery from './ui/RingGallery';
import { GithubMark } from './ui/BrandIcons';
import { LANGUAGE_COLORS, PROJECTS } from '../data/projects';

// With the section on screen and nobody touching it, walk to the next project
// so it plays as a gallery. Any interaction restarts the clock — long enough
// that it never pulls a project out from under someone still reading it.
const AUTO_ADVANCE_MS = 30000;
const IDLE_TICK_MS = 1000;

function LanguageDot({ language }) {
  if (!language) return null;
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: LANGUAGE_COLORS[language] ?? '#5E6B7A' }}
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

function PreviewMedia({ project }) {
  if (project.items?.length) {
    return <RingGallery items={project.items} />;
  }

  if (project.video) {
    return (
      <div className="flex max-h-[440px] min-h-[220px] w-full items-center justify-center border border-base-border bg-base-surface">
        {/* Same visual as a GIF loop, ~90% less data: autoplaying muted video
            with no controls reads identically but decodes far cheaper on
            mid-range phones than an animated GIF. playsInline keeps iOS
            Safari from hijacking it into fullscreen. */}
        <PreviewVideo src={project.video} label={`${project.name} demo`} />
      </div>
    );
  }

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 border border-dashed border-base-border/80 bg-base-surface/30 text-text-dim">
      <Film size={22} />
      <p className="font-mono text-xs uppercase tracking-wider">
        // preview coming soon
      </p>
      <p className="font-mono text-[11px] text-text-dim/70">
        clone the repo to see it run
      </p>
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
    <section
      id="projects"
      ref={sectionRef}
      className="border-b border-base-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="03"
          id="projects"
          title="Projects"
          region="~/projects — live from github.com/Alasmawi"
        />

        <Reveal delay={0.1}>
          <div className="grid grid-cols-1 border border-base-border bg-base-surface/40 md:grid-cols-12">
            {/* mobile: horizontal tab list */}
            <div className="flex gap-2 overflow-x-auto border-b border-base-border p-3 md:hidden">
              {PROJECTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => select(p.id)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded border px-3 py-2 font-mono text-xs transition-colors ${
                    p.id === selectedId
                      ? 'border-amber/50 bg-amber/10 text-amber'
                      : 'border-base-border text-text-muted'
                  }`}
                >
                  <LanguageDot language={p.language} />
                  {p.name}
                </button>
              ))}
            </div>

            {/* desktop: sidebar file list */}
            <div className="hidden max-h-[560px] overflow-y-auto border-r border-base-border md:col-span-4 md:block lg:col-span-3">
              <p className="border-b border-base-border px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-text-dim">
                // repositories ({PROJECTS.length})
              </p>
              <ul>
                {PROJECTS.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => select(p.id)}
                      className={`flex w-full items-center gap-2 border-l-2 px-4 py-3 text-left transition-colors ${
                        p.id === selectedId
                          ? 'border-l-amber bg-amber/[0.06] text-text-primary'
                          : 'border-l-transparent text-text-muted hover:border-l-base-border hover:bg-white/[0.02] hover:text-text-primary'
                      }`}
                    >
                      {p.flagship ? (
                        <Star
                          size={13}
                          className="shrink-0 text-amber"
                          fill="currentColor"
                        />
                      ) : (
                        <LanguageDot language={p.language} />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-mono text-xs">
                          {p.name}
                        </span>
                      </span>
                      {p.private && (
                        <Lock size={11} className="shrink-0 text-text-dim" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* preview pane */}
            <div
              className="p-5 md:col-span-8 sm:p-6 lg:col-span-9"
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
                  <PreviewMedia project={project} />

                  <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {project.flagship && (
                          <span className="rounded border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber">
                            flagship
                          </span>
                        )}
                        {project.private && (
                          <span className="flex items-center gap-1 rounded border border-base-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                            <Lock size={10} /> private repo
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold text-text-primary sm:text-3xl">
                        {project.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-steel">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.name} on GitHub`}
                          className="flex items-center gap-2 rounded border border-base-border px-3 py-2 font-mono text-xs text-text-muted transition-all hover:border-amber hover:text-amber"
                        >
                          <GithubMark size={14} />
                          <span>source</span>
                          <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="flex items-center gap-2 rounded border border-base-border px-3 py-2 font-mono text-xs text-text-dim">
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
                          className="flex items-center gap-2 rounded border border-base-border px-3 py-2 font-mono text-xs text-text-muted transition-all hover:border-steel hover:text-steel"
                        >
                          <PlayCircle size={14} />
                          <span>live</span>
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-base-border px-2 py-1 font-mono text-[11px] text-text-muted"
                      >
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
    </section>
  );
}
