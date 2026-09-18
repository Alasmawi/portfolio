import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  ExternalLink,
  FileCode2,
  Film,
  Folder,
  FolderOpen,
  FolderTree,
  LayoutGrid,
  Lock,
  PlayCircle,
  Star,
  X,
} from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import RingGallery from './ui/RingGallery';
import HardwareStrip from './ui/HardwareStrip';
import K9Architecture from './ui/K9Architecture';
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
// The count in the section heading, spelled. A sentence opening with a numeral
// reads as a list item, and this one is a sentence. Falls back to digits past
// twenty, which is the point at which spelling it out reads worse than not.
const NUMBERS = [
  'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen',
  'Nineteen', 'Twenty',
];
const spellCount = (n) => NUMBERS[n] ?? String(n);

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
  'shadow-[inset_0_0_0_1px_rgba(251,238,240,0.09)] sm:h-[320px] md:h-[400px]';

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

// The fixed bottom tab bar's row height, matching App's bottom padding. Used to
// work out whether something has actually gone under it.
const TAB_BAR_PX = 54;

// Grid or rows, remembered per visitor.
//
// Grid is the default: fourteen repositories shown as a wall of cards is the
// shape of the thing — you can take in the whole body of work at once — where a
// list makes you read fourteen names to find out what is there. Rows stay on
// offer as a terminal listing, which is faster to aim at once you know the
// names, fits far more of them on a phone at once, and is the same metaphor the
// section has carried since it called itself ~/projects.
//
// localStorage, not sessionStorage: a layout preference is the kind of thing a
// returning visitor expects to still be set.
const VIEW_KEY = 'projects-view';

const VIEWS = [
  { id: 'grid', label: 'Grid', Icon: LayoutGrid },
  { id: 'files', label: 'Explorer', Icon: FolderTree },
];

// The four pillars, as directories. A project can belong to more than one, so
// it is filed under the first — a tree where the same repo appears three times
// is a worse map than one where it appears once.
const FOLDERS = [
  { id: 'cloud', name: 'cloud' },
  { id: 'ai', name: 'ai' },
  { id: 'fullstack', name: 'full-stack' },
  { id: 'cs', name: 'computer-science' },
];

const EXT = { Go: 'go', Rust: 'rs', Python: 'py', JavaScript: 'js', TypeScript: 'ts', Shell: 'sh' };

// The id, not the display name: ids are already kebab-case, so they read as
// filenames where "K9 Pavlov System" and "Brain-Book" do not. The display name
// is what the card and the dialog show.
//
// k9-pavlov carries no language — it is a system rather than a repo in one
// tongue — so it stays extensionless, the way a file without one looks in a
// real tree.
const fileName = (p) => (EXT[p.language] ? `${p.id}.${EXT[p.language]}` : p.id);

const TREE = FOLDERS.map((f) => ({
  ...f,
  children: PROJECTS.filter((p) => p.pillars?.[0] === f.id),
})).filter((f) => f.children.length);

function useProjectView() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'grid';
    try {
      // 'terminal' is the previous name for this view; anyone carrying it in
      // storage gets the explorer rather than being bounced back to the grid.
      const saved = localStorage.getItem(VIEW_KEY);
      return saved === 'files' || saved === 'terminal' ? 'files' : 'grid';
    } catch {
      return 'grid';
    }
  });
  const choose = useCallback((next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // Private mode. The choice still holds for this page view.
    }
  }, []);
  return [view, choose];
}

// Every project has a still: the thirteen with a demo recording carry the
// poster frame extracted from it, and K9 — which has no video — leads with the
// first photo of the hardware.
const thumbOf = (p) => p.poster ?? p.items?.[0]?.src ?? null;

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
  const tablistRef = useRef(null);

  // The architecture drawing is ~590px tall with its legend. On a 390x844 phone
  // that fits between the nav and the tab bar — but only if it starts near the
  // top, and tapping the tab from halfway down the panel left it starting near
  // the bottom, so the diagram opened mostly below the fold and clipped by the
  // tab bar. Anchoring the tab strip under the nav gives the drawing the room
  // it already fits in.
  //
  // Only when it would actually overflow: a tab change that is already fully
  // visible should not move the page under the reader.
  const anchor = useCallback(() => {
    const list = tablistRef.current;
    if (!list) return;
    requestAnimationFrame(() => {
      const panel = list.parentElement;
      if (!panel) return;
      const bottom = panel.getBoundingClientRect().bottom;
      const floor = window.innerHeight - TAB_BAR_PX;
      if (bottom <= floor) return;
      list.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }, []);
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
    anchor();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={`${project.name} media`}
        onKeyDown={onKeyDown}
        /* One liquid object holding two chips, rather than two outlined
           buttons. w-fit so the pill is the width of its chips and not the
           width of the panel. */
        className="glass-control flex w-fit scroll-mt-[68px] gap-1 rounded-full p-1.5"
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
              onClick={() => {
                setTab(id);
                anchor();
              }}
              /* Selected reads as a lit facet of the same glass, the way the
                 nav marks its current link. It used to copy the primary
                 button's rose fill, which made rose mean both "the one action
                 on the page" and "this tab is selected". */
              className={`min-h-11 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                on ? 'glass-control text-text-primary' : 'text-text-primary/70 hover:text-text-primary'
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

// The project, opened.
//
// A modal rather than a pane under the selector: the grid is the thing worth
// looking at, and a permanent detail block below it pushed the grid off screen
// and made every card tap a scroll hunt for what had changed. A dialog puts the
// project in front of the reader and gives it back when they are done.
function ProjectModal({ project, playing, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!project) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus stays inside the dialog while it is open, which is what makes it
      // a dialog rather than a panel that happens to float.
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const opener = document.activeElement;
    document.addEventListener('keydown', onKey);
    // The page behind must not scroll under the dialog.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      // Back to the card that opened it, so a keyboard reader does not lose
      // their place in the grid.
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [project, onClose]);

  // Portalled to <body>. `main` carries `relative z-10`, which makes it a
  // stacking context — a dialog rendered inside it is capped at main's level no
  // matter how high its own z-index goes, so the fixed nav pill and the dock
  // (siblings of main, at z-40 and z-50) painted straight over the top of it.
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close project"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-void/70 backdrop-blur-[3px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            tabIndex={-1}
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="glass-pane relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-[26px] outline-none sm:rounded-[26px]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-base-bg/80 px-5 py-3 backdrop-blur-md sm:px-7">
              <p className="min-w-0 truncate font-mono text-[12px] text-text-muted">
                ~/projects/{project.id}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="glass-control flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-primary"
              >
                <X size={15} />
              </button>
            </div>
      <div className="px-5 pb-6 pt-1 sm:px-7 sm:pb-7">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <PreviewMedia project={project} playing={playing} />

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
                    className="btn btn-ghost glass-control min-h-9 text-xs"
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
                    className="btn btn-ghost glass-control min-h-9 text-xs"
                  >
                    <PlayCircle size={14} />
                    <span>live</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            <div className="mt-4 max-w-2xl">
              <p className="text-[15px] leading-relaxed text-text-primary/85">
                {project.description}
              </p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// The explorer, the way an editor draws one.
//
// The repo-browser metaphor the section already carries, made literal: the four
// pillars are directories, the projects are the files in them, and the row
// treatment is the one every developer looking at this page reads without being
// taught — a twisty, a folder that opens, a file icon tinted by language, and
// an indent guide running down each level.
//
// Folders are open on arrival. A tree that starts collapsed hides the whole
// point of showing a tree.
function FileTree({ selectedId, onSelect }) {
  const [closed, setClosed] = useState(() => new Set());
  const toggle = (id) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="px-2 pb-3 pt-1 font-mono text-[12.5px]">
      <p className="flex items-center gap-1.5 px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-text-dim">
        <FolderTree size={12} />
        ~/projects
      </p>

      <ul role="tree" aria-label="Projects by area">
        {TREE.map((folder) => {
          const open = !closed.has(folder.id);
          return (
            <li key={folder.id} role="none">
              <button
                type="button"
                role="treeitem"
                aria-expanded={open}
                onClick={() => toggle(folder.id)}
                className="flex w-full items-center gap-1.5 rounded px-2 py-[5px] text-left text-text-muted transition-colors hover:bg-white/[0.05] hover:text-text-primary"
              >
                <ChevronRight
                  size={13}
                  className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`}
                />
                {open ? (
                  <FolderOpen size={13} className="shrink-0 text-accent/80" />
                ) : (
                  <Folder size={13} className="shrink-0 text-accent/80" />
                )}
                <span className="truncate">{folder.name}</span>
                <span className="ml-auto shrink-0 tabular-nums text-[11px] text-text-dim">
                  {folder.children.length}
                </span>
              </button>

              {open && (
                /* The indent guide. One hairline per level, offset to sit under
                   the twisty above it, exactly where an editor puts it. */
                <ul role="group" className="ml-[13px] border-l border-white/[0.1] pl-1.5">
                  {folder.children.map((p) => {
                    const on = p.id === selectedId;
                    return (
                      <li key={p.id} role="none">
                        <button
                          type="button"
                          role="treeitem"
                          aria-selected={on}
                          onClick={() => onSelect(p.id)}
                          className={`flex w-full items-center gap-1.5 rounded-r px-2 py-[5px] text-left transition-colors ${
                            on
                              ? 'bg-accent/[0.16] text-accent-bright'
                              : 'text-text-muted hover:bg-white/[0.05] hover:text-text-primary'
                          }`}
                        >
                          <FileCode2
                            size={13}
                            className="shrink-0"
                            style={{ color: LANGUAGE_COLORS[p.language] ?? undefined }}
                          />
                          <span className="truncate">{fileName(p)}</span>
                          {p.flagship && (
                            <Star size={10} className="shrink-0 text-accent" fill="currentColor" />
                          )}
                          {p.private && <Lock size={10} className="shrink-0 text-text-dim" />}
                          {/* The tagline is what makes a tree of fourteen
                              filenames worth reading. It takes whatever room is
                              left and is dropped on the narrowest screens,
                              where the filename already fills the row. */}
                          <span className="ml-2 hidden min-w-0 flex-1 truncate text-[11.5px] text-text-dim sm:block">
                            {p.tagline}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// The repository selector, in the two shapes it can take.
//
// This replaced a horizontal chip row on a phone and a 264px sidebar of rows on
// a desktop — two different controls doing one job, neither of which could show
// you the work. Both shapes now span the panel and both are available at every
// width.
function ProjectSelector({ view, selectedId, onSelect }) {
  if (view === 'files') {
    return <FileTree selectedId={selectedId} onSelect={onSelect} />;
  }

  return (
    <ul className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 lg:grid-cols-4">
      {PROJECTS.map((p) => {
        const on = p.id === selectedId;
        const thumb = thumbOf(p);
        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              aria-current={on ? 'true' : undefined}
              className={`group flex w-full flex-col overflow-hidden rounded-2xl text-left transition-colors ${
                on
                  ? 'bg-accent/[0.14] shadow-[inset_0_0_0_1px_rgb(226_96_126_/_0.7)]'
                  : 'bg-white/[0.045] shadow-[inset_0_0_0_1px_rgb(251_238_240_/_0.12)] hover:bg-white/[0.08]'
              }`}
            >
              <span className="relative isolate block aspect-[16/9] w-full overflow-hidden bg-black/25">
                {/* Behind every thumbnail, not only the one project without a
                    still. The images are lazy, so a card that has not fetched
                    yet would otherwise be an empty black rectangle — half a
                    grid of those reads as broken rather than as loading. */}
                <span className="absolute inset-0 flex items-center justify-center text-text-dim/45">
                  <Film size={18} />
                </span>
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    /* object-top, not centre. These are screenshots of running apps and
                       the part worth seeing — the header, the first rows of real
                       content — is at the top of the frame; a centre crop lands on
                       empty canvas for about half of them. */
                    className="relative h-full w-full object-cover object-top saturate-[.78] transition duration-300 group-hover:saturate-100"
                  />
                )}
                {/* The grade.

                    These covers are frames from the projects themselves, so
                    they arrive in whatever colour the project happened to be:
                    guidely is a white documentation UI, rt is a grey render,
                    smart-road is flat green. Fourteen of those in a grid on a
                    burgundy ground read as fourteen unrelated windows rather
                    than as one body of work, and the bright ones glare hard
                    enough to pull the eye off whatever you were reading.

                    A multiply of the page's own two grounds puts them all in
                    the same key without touching the files. It lifts on hover
                    and on keyboard focus, so the true colours are one pointer
                    away and the modal shows them ungraded. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-40 group-focus-visible:opacity-40"
                  style={{
                    background:
                      'linear-gradient(180deg, rgb(44 15 26 / .42), rgb(18 5 9 / .72))',
                  }}
                />
                {/* Over the multiply, not under it: a little of the ground's
                    own rose put back as light, so a graded cover reads as lit
                    rather than merely darkened. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-0"
                  style={{
                    background:
                      'radial-gradient(120% 80% at 50% 0%, rgb(226 96 126 / .16), rgb(226 96 126 / 0) 68%)',
                  }}
                />
                {p.flagship && (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 p-1 text-accent backdrop-blur-sm">
                    <Star size={10} fill="currentColor" />
                  </span>
                )}
                {p.private && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1 text-text-muted backdrop-blur-sm">
                    <Lock size={10} />
                  </span>
                )}
              </span>
              <span className="flex min-w-0 items-center gap-2 px-2.5 pb-2.5 pt-2">
                <LanguageDot language={p.language} />
                <span
                  className={`min-w-0 flex-1 truncate font-mono text-[12px] ${
                    on ? 'text-accent-bright' : 'text-text-primary'
                  }`}
                >
                  {p.name}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProjectBrowser() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  // Phones get the first three lines of a description with the rest behind a
  // tap. The full text is always in the DOM — this clamps, it doesn't truncate.
  // Whether the section is on screen. Read by the preview video, which fetches
  // nothing until it is true, and by the auto-advance clock below.
  const [inView, setInView] = useState(false);
  const [view, setView] = useProjectView();
  // null when the dialog is shut. Separate from selectedId so the grid keeps
  // showing which project you last looked at after you close it.
  const [openId, setOpenId] = useState(null);
  const openProject = openId ? PROJECTS.find((p) => p.id === openId) : null;

  const sectionRef = useRef(null);
  // Activity is tracked in a ref rather than state: pointermove fires
  // constantly, and restarting a timer must not cost a re-render.
  const lastActivityRef = useRef(0);
  const nudgeIdle = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Selecting a project opens it. The selector's job is to choose; the dialog's
  // job is to show.
  const select = useCallback(
    (id) => {
      setSelectedId(id);
      setOpenId(id);
      nudgeIdle();
    },
    [nudgeIdle]
  );
  const closeModal = useCallback(() => setOpenId(null), []);

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
    <section id="projects" ref={sectionRef} className="section">
      <div className="section-inner">
        {/* The heading was the single word "Projects" under an eyebrow reading
            "// [ projects ]" — the same word twice, in a column where every
            other section opens with a sentence. It names the thing directly
            under it instead: the stack row, and then the browser. */}
        <SectionHeading
          label="projects"
          title={`${spellCount(PROJECTS.length)} projects, and the stack that keeps showing up.`}
        />

        {/* Wide screens only. On a phone this was a label plus eight
            outlined pills sitting between the headline and the browser, and
            the browser underneath shows every one of those tags again, per
            project, where they mean something specific. */}
        <Reveal delay={0.05}>
          <div className="mt-6 hidden flex-wrap items-center gap-3 sm:flex">
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
          </div>
        </Reveal>

        {/* The browser is a pane on the page's own surface. It used to float on a
            full-bleed band of `void` with a canvas of falling glyphs behind it,
            faded top and bottom to hide where the band started — a second ground,
            a per-frame canvas and two gradients, all to stop one panel looking
            pasted on. The atmosphere layer behind the document does that for
            every section at once, so the band and the rain are gone and what is
            left is the panel.

            It also used to sit in a centred container of its own inside a
            full-width gutter, which put its left edge 56px outside the heading
            above it — the one horizontal misalignment on the page. Both hang
            off `.section-inner` now. */}
        <Reveal delay={0.1}>
          <div className="section-body glass-pane overflow-hidden rounded-[26px]">
              {/* One selector, full width, in whichever shape the reader
                  picked. This was two different controls doing one job — a
                  horizontal chip row on a phone and a 264px sidebar of rows on
                  a desktop — and neither could show you the work itself, only
                  a list of names. */}
              <div className="border-b border-white/[0.08]">
                <div className="flex items-center justify-between gap-3 px-3.5 pt-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
                    // repositories ({PROJECTS.length})
                  </p>
                  <div
                    role="group"
                    aria-label="Repository layout"
                    className="flex items-center gap-0.5 rounded-full bg-white/[0.06] p-0.5 shadow-[inset_0_0_0_1px_rgb(251_238_240_/_0.12)]"
                  >
                    {VIEWS.map(({ id, label, Icon }) => {
                      const on = view === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setView(id)}
                          aria-pressed={on}
                          /* An icon pair needs a name a screen reader can read
                             and a tooltip a mouse can find; the label is not
                             visible because the two shapes are legible as
                             icons and a word each would double the control. */
                          title={label}
                          className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
                            on
                              ? 'bg-white/[0.14] text-text-primary'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                        >
                          <Icon size={14} />
                          <span className="sr-only">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ProjectSelector view={view} selectedId={selectedId} onSelect={select} />
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
          </div>
        </Reveal>
      </div>

      <ProjectModal project={openProject} playing={inView && !!openProject} onClose={closeModal} />
    </section>
  );
}
