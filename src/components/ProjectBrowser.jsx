import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
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
import SectionHeader, { FRAME, SECTION_PAD, SECTION_Y } from './ui/SectionHeader';
import RingGallery from './ui/RingGallery';
import ScreenGallery from './ui/ScreenGallery';
import HardwareStrip from './ui/HardwareStrip';
import K9Architecture from './ui/K9Architecture';
import BayyanArchitecture from './ui/BayyanArchitecture';
import { GithubMark } from './ui/BrandIcons';
import TechTag from './ui/TechTag';
import Fold from './ui/Fold';
import { FEATURED, LANGUAGE_COLORS, MORE, PROJECTS } from '../data/projects';
import { OPEN_PROJECT_EVENT } from '../lib/openProject';

const ARCHITECTURE = { k9: K9Architecture, bayyan: BayyanArchitecture };

// One reserved box for every kind of preview media, so switching project can't
// move what is underneath it. A fixed height, not max-h: the previews are
// screen recordings at a dozen aspect ratios, and object-contain letterboxes
// the odd one out rather than moving the title and description below.
const MEDIA_WELL =
  'flex h-[248px] w-full items-center justify-center rounded-lg bg-white/[0.03] ' +
  'shadow-[inset_0_0_0_1px_rgba(239,233,221,0.09)] sm:h-[320px] md:h-[400px]';

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
// its dashboard.
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

// Hardware photos turn on the ring (or lie flat in the strip on a narrow
// panel); app screenshots get the flat screen viewer at every width.
function Gallery({ items, wide }) {
  if (items[0]?.type === 'screen') return <ScreenGallery items={items} />;
  return wide ? <RingGallery items={items} /> : <HardwareStrip items={items} />;
}

/* A project's media, as tabs: the recorded demo, the stills, and the
   architecture drawing, whichever of them it has. They are views of one
   project, not stacked blocks: stacked, whatever came first got read longest
   and the rest was scrolled past. Tabs give each the full width. The demo
   leads where there is one, then the stills. */
function MediaTabs({ project, tabs, playing }) {
  const [tab, setTab] = useState(tabs[0].id);
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
        className="glass-control flex w-fit scroll-mt-[68px] gap-1 rounded-none p-1.5"
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
              className={`min-h-11 rounded-none px-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                on ? 'bg-white/10 text-text-primary' : 'text-text-primary/70 hover:text-text-primary'
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
        {tab === 'architecture' && <Diagram />}
        {tab === 'media' && <Gallery items={project.items} wide={wide} />}
        {tab === 'demo' && <DemoVideo project={project} playing={playing} />}
      </div>
    </div>
  );
}

function DemoVideo({ project, playing }) {
  return (
    <div className={MEDIA_WELL}>
      {/* Autoplaying muted video instead of a GIF: it reads the same and
          decodes far cheaper. playsInline keeps iOS from going fullscreen. */}
      <PreviewVideo src={project.video} poster={project.poster} label={`${project.name} demo`} playing={playing} />
    </div>
  );
}

function PreviewMedia({ project, playing }) {
  const Diagram = ARCHITECTURE[project.architecture];
  const tabs = [
    project.video && { id: 'demo', label: 'Demo' },
    project.items?.length && {
      id: 'media',
      label: project.mediaLabel ?? (project.id === 'k9-pavlov' ? 'Hardware' : 'Screens'),
    },
    Diagram && { id: 'architecture', label: 'Architecture' },
  ].filter(Boolean);

  if (tabs.length > 1) return <MediaTabs project={project} tabs={tabs} playing={playing} />;
  if (Diagram) return <Diagram />;
  if (project.items?.length) return <Gallery items={project.items} wide />;
  if (project.video) return <DemoVideo project={project} playing={playing} />;

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
            className="absolute inset-0 h-full w-full cursor-default bg-void/85"
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
            className="glass-pane relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-none outline-none sm:rounded-none lg:max-w-6xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-bone/15 bg-ink-raised px-5 py-3 sm:px-7">
              <p className="label min-w-0 truncate text-text-muted">Project</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="glass-control flex h-9 w-9 shrink-0 items-center justify-center rounded-none text-text-primary"
              >
                <X size={15} />
              </button>
            </div>
            {/* Two columns from `lg`: the words on the left, the thing itself
                beside them. Stacked in one narrow column the dialog was a
                picture and then a wall of copy under it, and reading about
                the project meant scrolling the picture away. On a phone the
                media still leads and the copy follows. */}
            <div className="px-5 pb-6 pt-1 sm:px-7 sm:pb-7 lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.25fr)] lg:items-start lg:gap-9 lg:pt-3">
              <div className="min-w-0 lg:order-2">
                <PreviewMedia project={project} playing />
              </div>

              <div className="mt-5 min-w-0 lg:order-1 lg:mt-0">
                {/* Every project has at least one badge here, so the title
                    below sits at the same height from dialog to dialog. */}
                <div className="flex flex-wrap items-center gap-2">
                  {project.language && (
                    <span className="flex items-center gap-1.5 rounded-none border border-base-hairline px-2.5 py-1 font-mono text-[10.5px] text-text-muted">
                      <LanguageDot language={project.language} />
                      {project.language}
                    </span>
                  )}
                  {project.private && (
                    <span className="flex items-center gap-1 rounded-none border border-base-hairline px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
                      <Lock size={10} /> private code
                    </span>
                  )}
                </div>
                <h3 className="display-sm mt-3 text-[38px] lg:text-[52px]">
                  {project.name}
                </h3>
                <p className="label mt-2 text-accent-body">{project.context ?? project.tagline}</p>

                <p className="mt-4 text-[15px] leading-relaxed text-text-primary/85">
                  {project.summary ?? project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <TechTag key={tag} name={tag} />
                  ))}
                </div>

                {/* The long account, for whoever wants it. The summary above
                    is what the dialog opens on. */}
                {project.summary && project.description && (
                  <Fold more="Read the full story" less="Show less">
                    <p className="pt-3 text-[14.5px] leading-relaxed text-text-primary/78">{project.description}</p>
                  </Fold>
                )}

                {(project.githubUrl || project.liveUrl) && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.name} on GitHub`}
                        className="btn btn-ghost glass-control min-h-10 text-[13px]"
                      >
                        <GithubMark size={14} />
                        <span>Source</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.name} live site`}
                        className="btn btn-ghost glass-control min-h-10 text-[13px]"
                      >
                        <PlayCircle size={14} />
                        <span>Live</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                )}
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
    </span>
  );
}

// A featured project, as a row of the index: who it was for, its name set
// large, one sentence, the stack, and a picture. The whole row opens the
// dialog. On a pointer device the recording plays in the picture while the row
// is hovered.
//
// A phone gets the name and the picture only; the sentence is in the dialog,
// and five rows of full copy was three screens of scrolling.
function FeaturedRow({ project, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const canHover = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );

  return (
    <button
      type="button"
      onClick={() => onOpen(project.id)}
      onPointerEnter={() => canHover.current && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-label={`Open ${project.name}`}
      className="group grid w-full grid-cols-[minmax(0,1fr)_116px] items-center gap-x-4 border-t border-bone/15 py-4 text-left sm:grid-cols-[minmax(0,1fr)_200px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(200px,300px)] md:gap-x-10 md:py-7"
    >
      <span className="block min-w-0">
        <span className="label block text-accent-body">{project.context}</span>
        <span className="display-sm mt-2 block text-[30px] transition-colors group-hover:text-accent-bright sm:text-[40px] lg:text-[clamp(44px,4.6vw,72px)]">
          {project.name}
        </span>
      </span>
      <span className="hidden min-w-0 md:block">
        <span className="block text-[15.5px] leading-relaxed text-text-primary/75">{project.summary}</span>
        <span className="mt-3 block font-mono text-[12px] text-text-dim">{project.tags.slice(0, 4).join(' · ')}</span>
      </span>
      <CardMedia project={project} hovered={hovered} className="aspect-[16/10] w-full" />
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

// Four on a phone until the reader asks for the rest; every one from `sm`.
const PHONE_PREVIEW = 4;

function RepoGrid({ onSelect }) {
  const [all, setAll] = useState(false);
  return (
    <>
    <ul className="grid grid-cols-2 gap-2.5 p-3 sm:grid-cols-3 lg:grid-cols-5">
      {MORE.map((p, i) => {
        const thumb = thumbOf(p);
        return (
          <li key={p.id} className={!all && i >= PHONE_PREVIEW ? 'hidden sm:block' : ''}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className="group flex w-full flex-col overflow-hidden rounded-2xl bg-white/[0.045] text-left shadow-[inset_0_0_0_1px_rgb(239_233_221_/_0.12)] transition-colors hover:bg-white/[0.08] hover:shadow-[inset_0_0_0_1px_rgb(240_80_106_/_0.55)]"
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
    {MORE.length > PHONE_PREVIEW && (
      <button
        type="button"
        onClick={() => setAll((v) => !v)}
        aria-expanded={all}
        className="flex min-h-11 w-full items-center justify-center gap-1.5 border-t border-white/[0.08] text-[13px] text-accent-body sm:hidden"
      >
        {all ? 'Show fewer' : `Show all ${MORE.length}`}
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${all ? 'rotate-180' : ''}`} />
      </button>
    )}
    </>
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

  return (
    <section id="projects" className={`relative ${SECTION_Y} ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          title="Projects"
          lead="Two systems built for government organizations in Bahrain, followed by personal and program projects. Each one opens with a demo, screenshots or its architecture."
        />

        <div className="mt-6 border-b border-bone/15 md:mt-10">
          {FEATURED.map((p, i) => (
            <Reveal key={p.id} delay={0.03 * i}>
              <FeaturedRow project={p} onOpen={select} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.05} className="mt-12 block md:mt-20">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="display-sm text-[34px] sm:text-[44px]">More projects</h3>
              <p className="mt-2 max-w-[60ch] text-[15px] text-text-primary/65">
                A web server, a shell, a ray tracer, games and a front-end framework, each written without the
                library that usually does the work.
              </p>
            </div>
          </div>
          <div className="glass-pane overflow-hidden rounded-none">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-3.5 py-2.5">
              <p className="text-[13px] text-text-muted">{MORE.length} repositories</p>
              <div
                role="group"
                aria-label="Repository layout"
                className="flex items-center gap-0.5 rounded-none bg-white/[0.06] p-0.5 shadow-[inset_0_0_0_1px_rgb(239_233_221_/_0.12)]"
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
                      className={`flex h-8 w-9 items-center justify-center rounded-none transition-colors ${
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
