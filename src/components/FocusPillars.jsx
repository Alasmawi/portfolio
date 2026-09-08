import Reveal from './ui/Reveal';
import { FOCUS_PILLARS } from '../data/focusPillars';
import { PROJECTS } from '../data/projects';
import { PILLAR_COLORS } from '../data/uobCoursework';

// The four things the site is about, counted rather than claimed.
//
// The count is derived from projects.js — each project carries the pillars it
// belongs to — so a pillar can never advertise work that isn't in the list
// underneath it. It is also the honest ordering: Cloud is one project, and
// putting "01" on the pillar the whole hero is about is better than rounding it
// up to a paragraph about breadth.
//
// The blurb from focusPillars.js is deliberately not here. This section leads
// with a figure and captions it with the stack; the prose version of the same
// four areas is what the projects below it are.
const COUNTS = FOCUS_PILLARS.map((pillar) => ({
  ...pillar,
  count: PROJECTS.filter((p) => p.pillars?.includes(pillar.id)).length,
}));

export default function FocusPillars() {
  return (
    <section id="focus" className="relative px-5 pb-9 pt-11 sm:px-10 sm:pb-10 sm:pt-14 md:px-14 md:pb-12 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-[24ch] text-3xl font-medium tracking-tight text-text-primary md:text-[38px]">
              Four things this site is about.
            </h2>
            <p className="whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
              {PROJECTS.length} repos · {FOCUS_PILLARS.length} pillars
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-7 md:grid-cols-4">
          {COUNTS.map((pillar, i) => (
            <Reveal key={pillar.id} delay={0.05 + i * 0.05} className="h-full">
              <div className="glass-pane flex h-full flex-col rounded-[24px] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  {/* The number is the figure. Two digits, always — 01 and 08
                      are the same shape, so the four cards line up as a set
                      rather than as four differently-weighted headings. */}
                  <span
                    className="text-[52px] font-medium leading-none tracking-[-0.04em] tabular-nums"
                    style={{ color: PILLAR_COLORS[pillar.id] }}
                  >
                    {String(pillar.count).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    {pillar.count === 1 ? 'project' : 'projects'}
                  </span>
                </div>
                <p className="mt-4 text-[19px] font-medium leading-tight text-text-primary">
                  {pillar.label}
                </p>
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {pillar.tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-white/[0.09] px-2.5 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.06em] text-text-primary/80"
                      style={{ border: '1px solid rgba(255,255,255,.13)' }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
