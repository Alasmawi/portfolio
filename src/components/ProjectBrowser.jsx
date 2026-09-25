import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
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
  X,
} from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import RingGallery from './ui/RingGallery';
import HardwareStrip from './ui/HardwareStrip';
import K9Architecture from './ui/K9Architecture';
import BayyanArchitecture from './ui/BayyanArchitecture';
import { GithubMark } from './ui/BrandIcons';
import { FEATURED, LANGUAGE_COLORS, MORE, PROJECTS } from '../data/projects';
import { OPEN_PROJECT_EVENT } from '../lib/openProject';

const ARCHITECTURE = { k9: K9Architecture, bayyan: BayyanArchitecture };

// One reserved box for every kind of preview media, so switching project can't
// move what is underneath it. A fixed height, not max-h: the previews are
// screen recordings at a dozen aspect ratios, and object-contain letterboxes
// the odd one out rather than moving the title and description below.
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

    // Nothing is fetched until it should play. The poster holds the frame in
    // the meantime — a still of the same recording, so the swap is invisible.
    if (!playing) {
      v.pause();
      // Dropping the source releases the buffer, so walking the list doesn't
      // leave every video visited held in memory.
      v.removeAttribute('src');
      v.load();
      return undefined;
    }

    // Some mobile browsers only honour autoplay if `muted` is true on the
    // element's *property* when play() is called, not just the attribute.
    v.muted = true;
    v.src = src;
    v.load();
    const playPromise = v.play();
    // A superseded play() rejects with a benign AbortError.
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

// Below this the 3D ring gives way to the flat card strip — measured on the
// container, not the viewport, because the dialog is narrower than the window.
const WIDE_PANEL_PX = 560;

// The fixed dock's row height. Used to work out whether something has gone
// under it.
const TAB_BAR_PX = 54;

// Grid or explorer, remembered per visitor.
const VIEW_KEY = 'projects-view';
const VIEWS = [
  { id: 'grid', label: 'Grid', Icon: LayoutGrid },
  { id: 'files', label: 'Explorer', Icon: FolderTree },
];

// The four pillars, as directories. A project can belong to more than one, so
// it is filed under the first.
const FOLDERS = [
  { id: 'fullstack', name: 'full-stack' },
  { id: 'cloud', name: 'cloud' },
  { id: 'ai', name: 'ai' },
  { id: 'cs', name: 'computer-science' },
];

const EXT = { Go: 'go', Rust: 'rs', Python: 'py', JavaScript: 'js', TypeScript: 'ts', Shell: 'sh' };
const fileName = (p) => (EXT[p.language] ? `${p.id}.${EXT[p.language]}` : p.id);

const TREE = FOLDERS.map((f) => ({
  ...f,
  children: MORE.filter((p) => p.pillars?.[0] === f.id),
})).filter((f) => f.children.length);

function useProjectView() {
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'grid';
    try {
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

// Every project has a still: the recorded ones carry the poster frame from
// their video, K9 leads with the first photo of the hardware, and Bayyan with
// its drawn cover.
const thumbOf = (p) => p.poster ?? p.items?.[0]?.src ?? null;

function useContainerAtLeast(min) {
  const ref = useRef(null);
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

/* The photos and the architecture drawing are two views of one project, not
   two stacked blocks: stacked, the diagram got read first and longest and was
   shrunk until it was unreadable. Tabs give each the full width at 1:1.
   Photos lead. */
function MediaTabs({ project }) {
  const [tab, setTab] = useState('media');
  const [panelRef, wide] = useContainerAtLeast(WIDE_PANEL_PX);
  const tablistRef = useRef(null);
  const Diagram = ARCHITECTURE[project.architecture];

  // Anchors the tab strip under the nav when the newly shown panel would run
  // past the bottom of the screen — and only then, so a tab change that is
  // already fully visible doesn't move the page.
  const anchor = useCallback(() => {
    const list = tablistRef.current;
    if (!list) return;
    requestAnimationFrame(() => {
      const panel = list.parentElement;
      if (!panel) return;
      const bottom = panel.getBoundingClientRect().bottom;
      if (bottom <= window.innerHeight - TAB_BAR_PX) return;
      list.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }, []);
  const tabs = [
    { id: 'media', label: project.mediaLabel ?? (project.id === 'k9-pavlov' ? 'Hardware' : 'Screens') },
    { id: 'architecture', label: 'Architecture' },
  ];

  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === tab);
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = tabs[(i + delta + tabs.length) % tabs.length];
    setTab(next.id);
    document.getElementById(`mtab-${next.id}`)?.focus();
    anchor();
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-3">
      <div
        ref={tablistRef}
        role="tablist"
        aria-label={`${project.name} media`}
        onKeyDown={onKeyDown}
        className="glass-control flex w-fit scroll-mt-[68px] gap-1 rounded-full p-1.5"
      >
        {tabs.map(({ id, label }) => {
          const on = tab === id;
          return (
            <button
              key={id}
              id={`mtab-${id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`mpanel-${id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => {
                setTab(id);
                anchor();
              }}
              className={`min-h-11 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                on ? 'glass-control text-text-primary' : 'text-text-primary/70 hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* minmax(0,1fr) above and min-w-0 here: the strip's max-content width
          would otherwise size the track and drag the diagram past the screen. */}
      <div
        ref={panelRef}
        id={`mpanel-${tab}`}
        role="tabpanel"
        aria-labelledby={`mtab-${tab}`}
        tabIndex={0}
        className="min-w-0"
      >
        {tab === 'architecture' ? <Diagram /> : <Gallery items={project.items} wide={wide} />}
      </div>
    </div>
  );
}

function PreviewMedia({ project, playing }) {
  const Diagram = ARCHITECTURE[project.architecture];
  if (Diagram && project.items?.length) return <MediaTabs project={project} />;
  if (Diagram) return <Diagram />;

  if (project.video) {
    return (
      <div className={MEDIA_WELL}>
        {/* Autoplaying muted video instead of a GIF: it reads the same and
            decodes far cheaper. playsInline keeps iOS from going fullscreen. */}
        <PreviewVideo src={project.video} poster={project.poster} label={`${project.name} demo`} playing={playing} />
      </div>
    );
  }

  return (
    <div className={`${MEDIA_WELL} flex-col gap-3 text-text-dim`}>
      <Film size={22} />
      <p className="font-mono text-xs uppercase tracking-wider">// preview coming soon</p>
    </div>
  );
}

// The project, opened. A dialog rather than a pane under the grid: the grid is
// the thing worth looking at, and a detail block below it pushed the grid off
// screen and made every tap a scroll hunt.
function ProjectModal({ project, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!project) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      // Focus stays inside the dialog while it is open.
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      // Back to whatever opened it, so a keyboard reader keeps their place.
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [project, onClose]);

  // Portalled to <body>: `main` is a stacking context, and a dialog inside it
  // is capped at main's level, under the fixed nav and dock.
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
              <p className="min-w-0 truncate font-mono text-[12px] text-text-muted">~/projects/{project.id}</p>
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
              <PreviewMedia project={project} playing />

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  {/* Every project has at least one badge here, so the title
                      below sits at the same height from dialog to dialog. */}
                  <div className="flex flex-wrap items-center gap-2">
                    {project.language && (
                      <span className="flex items-center gap-1.5 rounded-full border border-base-hairline px-2.5 py-1 font-mono text-[10.5px] text-text-muted">
                        <LanguageDot language={project.language} />
                        {project.language}
                      </span>
                    )}
                    {project.featured && (
                      <span className="tag-outline text-[10.5px] uppercase tracking-wider">featured</span>
                    )}
                    {project.private && (
                      <span className="flex items-center gap-1 rounded-full border border-base-hairline px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
                        <Lock size={10} /> private code
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-[27px] font-medium leading-tight tracking-tight text-text-primary">
                    {project.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-xs text-accent-body">{project.context ?? project.tagline}</p>
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
                    <span className="flex items-center gap-2 rounded-full border border-base-edge px-3 py-2 font-mono text-xs text-text-muted">
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

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-primary/85">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag-outline text-[11.5px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// A featured project's picture. On a pointer device the recording plays while
// the card is hovered — the reader sees the thing running without opening it —
// and nothing is fetched until they do.
function CardMedia({ project, hovered, className = '' }) {
  const thumb = thumbOf(project);
  return (
    <span className={`relative block overflow-hidden bg-black/30 ${className}`}>
      <span className="absolute inset-0 flex items-center justify-center text-text-dim/45">
        <Film size={20} />
      </span>
      {thumb && (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          decoding="async"
          /* object-top: these are screenshots of running apps, and the part
             worth seeing is the header and first rows, at the top. */
          className="relative h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]"
        />
      )}
      {project.video && hovered && (
        <video
          src={project.video}
          className="absolute inset-0 h-full w-full object-cover object-top"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      )}
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: 'linear-gradient(to top, rgba(18,5,9,.55), rgba(18,5,9,0))' }}
        aria-hidden="true"
      />
    </span>
  );
}

function FeaturedCard({ project, onOpen, wide = false }) {
  const [hovered, setHovered] = useState(false);
  const canHover = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const others = wide ? project.items?.slice(1, 5) ?? [] : [];

  return (
    <button
      type="button"
      onClick={() => onOpen(project.id)}
      onPointerEnter={() => canHover.current && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={`Open ${project.name}`}
      className={`group glass-pane flex h-full w-full flex-col overflow-hidden rounded-[26px] text-left transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/50 ${
        wide ? 'lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]' : ''
      }`}
    >
      <span className={`relative block ${wide ? 'lg:min-h-[400px]' : ''}`}>
        <CardMedia
          project={project}
          hovered={hovered}
          className={wide ? 'aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto' : 'aspect-[16/9]'}
        />
        {others.length > 0 && (
          /* The rest of the hardware, as a contact strip over the lead photo:
             K9 is the project where the parts were built by hand. */
          <span className="absolute bottom-3 left-3 flex gap-1.5">
            {others.map((it) => (
              <img
                key={it.tag}
                src={it.src}
                alt=""
                loading="lazy"
                className="h-12 w-12 rounded-lg border border-white/20 bg-black/40 object-cover sm:h-14 sm:w-14"
              />
            ))}
          </span>
        )}
        <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {project.language && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10.5px] text-text-primary backdrop-blur-sm">
              <LanguageDot language={project.language} />
              {project.language}
            </span>
          )}
          {project.private && (
            <span className="flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10.5px] text-text-muted backdrop-blur-sm">
              <Lock size={10} /> private
            </span>
          )}
        </span>
      </span>

      <span className={`flex flex-1 flex-col p-5 sm:p-6 ${wide ? 'lg:p-8' : ''}`}>
        <span className="font-mono text-[11px] text-accent-body">{project.context}</span>
        <span
          className={`mt-1.5 block font-medium leading-tight tracking-[-0.02em] text-text-primary ${
            wide ? 'text-[26px] lg:text-[32px]' : 'text-[23px]'
          }`}
        >
          {project.name}
        </span>
        <span className="mt-2.5 block max-w-[52ch] text-[14.5px] leading-relaxed text-text-primary/75">
          {project.summary}
        </span>
        <span className={`mt-4 grid gap-1.5 ${wide ? '' : 'sm:grid-cols-1'}`}>
          {project.proof.map((line) => (
            <span key={line} className="flex items-center gap-2 font-mono text-[11.5px] text-text-muted">
              <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {line}
            </span>
          ))}
        </span>
        <span className="mt-auto flex items-end justify-between gap-3 pt-5">
          <span className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, wide ? 5 : 3).map((t) => (
              <span key={t} className="tag-outline text-[11px]">
                {t}
              </span>
            ))}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] text-text-primary/80 transition-colors group-hover:text-accent-bright">
            Open
            <ArrowUpRight size={14} aria-hidden="true" />
          </span>
        </span>
      </span>
    </button>
  );
}

// The explorer, the way an editor draws one: the pillars as directories, the
// projects as files, a twisty and an indent guide per level. Open on arrival —
// a tree that starts collapsed hides the point of showing a tree.
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
                <ChevronRight size={13} className={`shrink-0 transition-transform duration-150 ${open ? 'rotate-90' : ''}`} />
                {open ? (
                  <FolderOpen size={13} className="shrink-0 text-accent/80" />
                ) : (
                  <Folder size={13} className="shrink-0 text-accent/80" />
                )}
                <span className="truncate">{folder.name}</span>
                <span className="ml-auto shrink-0 tabular-nums text-[11px] text-text-dim">{folder.children.length}</span>
              </button>

              {open && (
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

function RepoGrid({ onSelect }) {
  return (
    <ul className="grid grid-cols-2 gap-2.5 p-3 lg:grid-cols-5">
      {MORE.map((p) => {
        const thumb = thumbOf(p);
        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white/[0.045] text-left shadow-[inset_0_0_0_1px_rgb(253_243_244_/_0.12)] transition-colors hover:bg-white/[0.08] hover:shadow-[inset_0_0_0_1px_rgb(224_122_154_/_0.55)]"
            >
              <span className="relative block aspect-[16/9] w-full overflow-hidden bg-black/25">
                <span className="absolute inset-0 flex items-center justify-center text-text-dim/45">
                  <Film size={18} />
                </span>
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="relative h-full w-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5 px-3 pb-3 pt-2.5">
                <span className="flex min-w-0 items-center gap-2">
                  <LanguageDot language={p.language} />
                  <span className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-text-primary">{p.name}</span>
                </span>
                <span className="hidden truncate text-[12px] text-text-muted sm:block">{p.tagline}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function ProjectBrowser() {
  const [view, setView] = useProjectView();
  // The last project opened, which the explorer keeps lit after the dialog
  // closes; `openId` is null whenever the dialog is shut.
  const [selectedId, setSelectedId] = useState(null);
  const [openId, setOpenId] = useState(null);
  const openProjectData = openId ? PROJECTS.find((p) => p.id === openId) : null;

  const select = useCallback((id) => {
    setSelectedId(id);
    setOpenId(id);
  }, []);
  const closeModal = useCallback(() => setOpenId(null), []);

  // Other sections open projects by name — the hero's trace, the focus cards,
  // the experience entries.
  useEffect(() => {
    const onOpen = (e) => {
      const id = e.detail?.id;
      if (PROJECTS.some((p) => p.id === id)) select(id);
    };
    window.addEventListener(OPEN_PROJECT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PROJECT_EVENT, onOpen);
  }, [select]);

  const [lead, ...rest] = FEATURED;

  return (
    <section id="projects" className={`relative pb-10 pt-12 sm:pt-16 md:pb-14 md:pt-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          index="02"
          eyebrow="Work"
          title="Selected work"
          lead="Two systems built for government organizations in Bahrain, and the projects behind them. Open any card for the demo, the architecture or the code."
        />

        <div className="mt-9 grid gap-4 md:grid-cols-2">
          <Reveal className="md:col-span-2">
            <FeaturedCard project={lead} onOpen={select} wide />
          </Reveal>
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={0.04 + (i % 2) * 0.05} className="h-full">
              <FeaturedCard project={p} onOpen={select} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05} className="mt-12 block">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-[22px] font-medium tracking-[-0.015em] text-text-primary">Built from scratch</h3>
              <p className="mt-1 max-w-[60ch] text-[14px] text-text-primary/65">
                Servers, shells, a ray tracer, games and frameworks, written without the library that would
                normally do the hard part.
              </p>
            </div>
          </div>
          <div className="glass-pane overflow-hidden rounded-[26px]">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-3.5 py-2.5">
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
                // repositories ({MORE.length})
              </p>
              <div
                role="group"
                aria-label="Repository layout"
                className="flex items-center gap-0.5 rounded-full bg-white/[0.06] p-0.5 shadow-[inset_0_0_0_1px_rgb(253_243_244_/_0.12)]"
              >
                {VIEWS.map(({ id, label, Icon }) => {
                  const on = view === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setView(id)}
                      aria-pressed={on}
                      title={label}
                      className={`flex h-8 w-9 items-center justify-center rounded-full transition-colors ${
                        on ? 'bg-white/[0.14] text-text-primary' : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      <Icon size={14} />
                      <span className="sr-only">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {view === 'files' ? (
              <FileTree selectedId={selectedId} onSelect={select} />
            ) : (
              <RepoGrid onSelect={select} />
            )}
          </div>
        </Reveal>
      </div>

      <ProjectModal project={openProjectData} onClose={closeModal} />
    </section>
  );
}
