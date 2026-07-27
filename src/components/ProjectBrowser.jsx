import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Film, Lock, PlayCircle, Star } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import ArchitectureDiagram from './ui/ArchitectureDiagram';
import { GithubMark } from './ui/BrandIcons';
import { LANGUAGE_COLORS, PROJECTS } from '../data/projects';

function LanguageDot({ language }) {
  if (!language) return null;
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: LANGUAGE_COLORS[language] ?? '#5B6773' }}
      aria-hidden="true"
    />
  );
}

function PreviewMedia({ project }) {
  if (project.showArchitecture) {
    return <ArchitectureDiagram />;
  }

  if (project.gif) {
    return (
      <div className="flex max-h-[440px] min-h-[220px] w-full items-center justify-center border border-base-border bg-base-surface">
        <img
          src={project.gif}
          alt={`${project.name} demo`}
          loading="lazy"
          className="max-h-[440px] w-auto max-w-full object-contain"
        />
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

export default function ProjectBrowser() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];

  return (
    <section id="projects" className="border-b border-base-border py-24 md:py-32">
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
                  onClick={() => setSelectedId(p.id)}
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
                      onClick={() => setSelectedId(p.id)}
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
            <div className="p-5 md:col-span-8 sm:p-6 lg:col-span-9">
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
