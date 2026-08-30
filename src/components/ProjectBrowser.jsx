import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Film, Lock, PlayCircle, Star } from 'lucide-react';
import Reveal from './ui/Reveal';
import SyntaxRain from './ui/SyntaxRain';
import RingGallery from './ui/RingGallery';
import HardwareStrip from './ui/HardwareStrip';
import K9Architecture from './ui/K9Architecture';
import ScrollCounter from './ui/ScrollCounter';
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

// One reserved box for every kind of preview media, so switching project can't
// move what is underneath it.
//
// A fixed height, not max-h. The previews are screen recordings at a dozen
// different aspect ratios, so sizing to the content moved the title and
// description below by up to 141px between projects — mid-read, on a 390px
// column, and auto-advance was doing it unasked. object-contain letterboxes
// the odd one out instead, which costs a little dead space on two of the
// fourteen and buys a panel that holds still.
const MEDIA_WELL =
  'flex h-[248px] w-full items-center justify-center rounded-lg bg-white/[0.03] ' +
  'shadow-[inset_0_0_0_1px_rgba(233,233,237,0.09)] sm:h-[320px] md:h-[400px]';

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

function PreviewVideo({ src, poster, label, playing }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return undefined;

    // Nothing is fetched until the section is actually on screen. The poster
    // holds the frame in the meantime, so the box is never empty and never
    // resizes when the video arrives — it is a still of the first frame of the
    // same recording, so the swap is invisible.
    if (!playing) {
      v.pause();
      // Dropping the source releases the buffer. Without this, walking the
      // list leaves every video visited still held in memory.
      v.removeAttribute('src');
      v.load();
      return undefined;
    }

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
    return undefined;
  }, [src, playing]);

  return (
    <video
      ref={ref}
      aria-label={label}
      poster={poster}
      className="h-full w-full object-contain"
      loop
      muted
      playsInline
      preload="none"
    />
  );
}

// Below this the 3D ring gives way to the flat card strip: turning a turntable
// with a thumb costs more than it pays, and under ~560px the flanking cards
// have nowhere to go.
//
// It is the *container's* width, not the viewport's — the same number the
// architecture diagram switches on, for the same reason. This panel is not a
// fixed fraction of the window: the repo sidebar appears at a 768px viewport
// and takes the preview pane from 570px down to 342px, so a viewport query
// hands the widest treatment to the narrowest container in the range.
const WIDE_PANEL_PX = 560;

// Drives the trailing-edge mask on the chip row: the fade means "there is more
// this way", so it has to come off once there isn't.
function useScrolledToEnd(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (end) el.setAttribute('data-end', '');
      else el.removeAttribute('data-end');
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref]);
}

function useContainerAtLeast(min) {
  const ref = useRef(null);
  // Starts narrow: the strip fits everywhere, so the first paint is never the
  // broken one while we wait for a measurement.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setWide(el.clientWidth >= min);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [min]);
  return [ref, wide];
}

function Gallery({ items, wide }) {
  return wide ? <RingGallery items={items} /> : <HardwareStrip items={items} />;
}

/* The hardware and the architecture drawing are two views of one project, not
   two stacked blocks. Stacked, the diagram sat above the gallery at 336px
   (desktop) / 620px (phone) and got read first and longest — while the photos
   of the boards, the collar and the scale, which are the part that was actually
   built by hand, were what you had to scroll past it to reach. On a phone the
   split measured 830px of diagram to 150px of photos.

   Tabs rather than a reorder or a shrink: reordering only moves the problem,
   and the diagram was already being shrunk — to 0.60 scale — which is what made
   it unreadable. Given its own panel it gets the full width at 1:1, and it
   costs the photos nothing. Hardware leads. */
function MediaTabs({ project }) {
  const [tab, setTab] = useState('hardware');
  const [panelRef, wide] = useContainerAtLeast(WIDE_PANEL_PX);
  const tabs = [
    { id: 'hardware', label: 'Hardware' },
    { id: 'architecture', label: 'Architecture' },
  ];

  // Arrow keys move between tabs, per the ARIA tabs pattern.
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === tab);
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = tabs[(i + delta + tabs.length) % tabs.length];
    setTab(next.id);
    document.getElementById(`k9tab-${next.id}`)?.focus();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div
        role="tablist"
        aria-label={`${project.name} media`}
        onKeyDown={onKeyDown}
        className="flex gap-1.5"
      >
        {tabs.map(({ id, label }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              id={`k9tab-${id}`}
              type="button"
              role="tab"
              data-k9tab={id}
              aria-selected={on}
              aria-controls={`k9panel-${id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(id)}
              className={`min-h-11 rounded-md border px-3.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                on
                  ? 'border-accent bg-accent/[0.14] text-accent-bright'
                  : 'border-base-edge text-text-muted hover:border-accent/60 hover:text-accent-bright'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* minmax(0,1fr) above, and min-w-0 here: the hardware strip's max-content
          width (~700px) would otherwise size the track and drag the diagram out
          to 666px inside a 390px screen. */}
      <div
        ref={panelRef}
        id={`k9panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`k9tab-${tab}`}
        tabIndex={0}
        className="min-w-0"
      >
        {tab === 'architecture' ? (
          <K9Architecture />
        ) : (
          <Gallery items={project.items} wide={wide} />
        )}
      </div>
    </div>
  );
}

function GalleryOnly({ items }) {
  const [ref, wide] = useContainerAtLeast(WIDE_PANEL_PX);
  return (
    <div ref={ref} className="grid grid-cols-[minmax(0,1fr)]">
      <Gallery items={items} wide={wide} />
    </div>
  );
}

function PreviewMedia({ project, playing }) {
  if (project.architecture && project.items?.length) {
    return <MediaTabs project={project} />;
  }

  if (project.architecture || project.items?.length) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
        {project.architecture && <K9Architecture />}
        {project.items?.length ? <GalleryOnly items={project.items} /> : null}
      </div>
    );
  }

  if (project.video) {
    return (
      <div className={MEDIA_WELL}>
        {/* Same visual as a GIF loop, ~90% less data: autoplaying muted video
            with no controls reads identically but decodes far cheaper on
            mid-range phones than an animated GIF. playsInline keeps iOS
            Safari from hijacking it into fullscreen. */}
        <PreviewVideo
          src={project.video}
          poster={project.poster}
          label={`${project.name} demo`}
          playing={playing}
        />
      </div>
    );
  }

  return (
    <div className={`${MEDIA_WELL} flex-col gap-3 text-text-dim`}>
      <Film size={22} />
      <p className="font-mono text-xs uppercase tracking-wider">// preview coming soon</p>
      <p className="font-mono text-[11px] text-text-dim">clone the repo to see it run</p>
    </div>
  );
}

// Swipe-to-change-project on the preview pane, mobile's main way to browse
// once you're already looking at one — the tab strip above is still there
// for jumping straight to a specific project by name.
const SWIPE_THRESHOLD_PX = 50;

export default function ProjectBrowser() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  // Phones get the first three lines of a description with the rest behind a
  // tap. The full text is always in the DOM — this clamps, it doesn't truncate.
  const [descOpen, setDescOpen] = useState(false);
  // Whether the section is on screen. Read by the preview video, which fetches
  // nothing until it is true, and by the auto-advance clock below.
  const [inView, setInView] = useState(false);
  // Two ways to change project — the chip row and a swipe on the preview — and
  // the second announced itself not at all. Shown until the first successful
  // swipe, then never again this session. sessionStorage rather than
  // localStorage: a hint nobody ever sees again is a hint that stops helping
  // the visitor who comes back in six months having forgotten.
  const [showSwipeHint, setShowSwipeHint] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('swipe-hint-seen') !== '1';
    } catch {
      return true;
    }
  });
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
      setDescOpen(false);
      nudgeIdle();
    },
    [nudgeIdle]
  );

  const swipeRef = useRef(null);
  const chipRowRef = useRef(null);
  const selectedChipRef = useRef(null);
  useScrolledToEnd(chipRowRef);

  // A swipe on the preview changes the project, and the chip row is the thing
  // that says which project you are on — so it has to follow. Without this the
  // two controls disagree as soon as you use the one below.
  useEffect(() => {
    const chip = selectedChipRef.current;
    if (!chip || !chipRowRef.current) return;
    chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [selectedId]);

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
      setShowSwipeHint(false);
      try {
        sessionStorage.setItem('swipe-hint-seen', '1');
      } catch {
        // Private mode, or storage disabled. The hint just shows again.
      }
    },
    [step]
  );

  // Separate from the auto-advance effect below, which does not run under
  // reduced motion. The preview video reads this to decide whether to fetch
  // anything, and a reduced-motion visitor still gets to watch the video.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;
    // Same shape as the reduced-motion guard: a gallery that walks itself is
    // a desktop affordance. On a phone the reader is already driving with a
    // thumb, and a project changing under them mid-read is an interruption —
    // one that also pulled a video they never asked for, every 30 seconds.
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover)').matches
    ) {
      return undefined;
    }

    let onScreen = false;
    lastActivityRef.current = Date.now();

    const io = new IntersectionObserver(
      ([e]) => {
        // Only cycle while a decent slice of the section is actually on screen,
        // and give a full quiet period from the moment it comes into view.
        if (e.isIntersecting && !onScreen) lastActivityRef.current = Date.now();
        onScreen = e.isIntersecting;
      },
      { threshold: 0.35 }
    );
    io.observe(node);

    const tick = setInterval(() => {
      if (!onScreen || document.hidden) {
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
            // [ projects ]
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
            <span className="hidden h-3.5 w-px bg-base-hairline sm:block" aria-hidden="true" />
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
            <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-void shadow-[0_0_0_1px_rgba(233,233,237,0.12),0_18px_44px_-20px_rgba(0,0,0,0.9)] md:flex">
              {/* mobile: horizontal chip row. The rings are inset shadows
                  rather than borders so the chip's box doesn't grow by 2px when
                  it becomes selected, but they are still a component boundary —
                  hence base.edge's value (3.72:1 on this ground) rather than
                  the hairline these used to carry at 1.33:1. */}
              <div className="md:hidden">
                <div ref={chipRowRef} className="chip-row flex gap-2 overflow-x-auto px-3 pt-3">
                  {PROJECTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      ref={p.id === selectedId ? selectedChipRef : null}
                      onClick={() => select(p.id)}
                      aria-current={p.id === selectedId ? 'true' : undefined}
                      className={`flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 font-mono text-xs transition-colors ${
                        p.id === selectedId
                          ? 'bg-accent/10 text-accent-bright shadow-[inset_0_0_0_1px_rgba(145,132,217,0.7)]'
                          : 'text-text-muted shadow-[inset_0_0_0_1px_#6a6e80]'
                      }`}
                    >
                      <LanguageDot language={p.language} />
                      {p.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-baseline justify-between gap-3 px-3 pb-1 pt-1.5">
                  <ScrollCounter
                    label="repo"
                    index={PROJECTS.findIndex((p) => p.id === selectedId)}
                    total={PROJECTS.length}
                  />
                  {showSwipeHint && (
                    <p
                      className="font-mono text-[10.5px] tracking-wide text-text-dim"
                      aria-hidden="true"
                    >
                      swipe the preview to change
                    </p>
                  )}
                </div>
              </div>

              {/* desktop: fixed-width sidebar */}
              <div className="hidden max-h-[620px] w-[264px] shrink-0 overflow-y-auto border-r border-white/[0.09] md:block">
                <p className="sticky top-0 bg-void px-[18px] py-[13px] font-mono text-[11px] uppercase tracking-wider text-text-muted shadow-[inset_0_-1px_0_rgba(233,233,237,0.09)]">
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

              {/* preview pane.

                  No touch-action here. It used to carry `pan-y`, which reads as
                  "only vertical panning", and touch-action intersects down the
                  tree — so it also disabled horizontal panning inside the
                  hardware gallery and anything else scrollable in this pane. It
                  was suppressing a horizontal page pan that cannot happen
                  anyway: nothing on the page scrolls sideways. The swipe
                  handler below does its own angle check, which is what actually
                  keeps a vertical fling from being read as a project change. */}
              <div
                className="flex-1 p-[22px] sm:p-6"
                onPointerDown={onSwipeDown}
                onPointerUp={onSwipeUp}
                onPointerCancel={() => {
                  swipeRef.current = null;
                }}
              >
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <PreviewMedia project={project} playing={inView} />

                    <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {project.flagship && (
                            <span className="tag-outline text-[10.5px] uppercase tracking-wider">
                              flagship
                            </span>
                          )}
                          {project.private && (
                            <span className="flex items-center gap-1 rounded border border-base-hairline px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-text-dim">
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
                          <span className="flex items-center gap-2 rounded-md border border-base-edge px-3 py-2 font-mono text-xs text-text-dim">
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

                    <div className="mt-4 max-w-2xl">
                      <p
                        id={`desc-${project.id}`}
                        className={`text-[15px] leading-relaxed text-text-primary/80 ${
                          descOpen ? '' : 'line-clamp-3 sm:line-clamp-none'
                        }`}
                      >
                        {project.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => setDescOpen((v) => !v)}
                        aria-expanded={descOpen}
                        aria-controls={`desc-${project.id}`}
                        className="mt-1.5 min-h-6 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-bright sm:hidden"
                      >
                        {descOpen ? 'Less' : 'More'}
                      </button>
                    </div>

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
