import Reveal from './ui/Reveal';
import { FOCUS_PILLARS } from '../data/focusPillars';
import { PROJECTS } from '../data/projects';

// The four things the site is about, counted rather than claimed.
//
// The count is derived from projects.js — each project carries the pillars it
// belongs to — so a pillar can never advertise work that isn't in the list
// underneath it.
//
// The count is a caption, not the figure. It used to be a 52px numeral, which
// made the largest number on the card the most important thing on it — so
// Full-Stack read as the headline at 08 and Cloud Computing, which is what the
// hero and the flagship project are both about, read as the runner-up at 01.
// The hierarchy argued against the positioning. The name is the figure now and
// the count sits under it, which is also what the number actually is: a
// footnote saying "and here is the evidence, in the list below".
//
// Zero-padding is gone with it. 01 / 03 / 08 down a column reads as an ordered
// list with items missing, not as three counts.
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
              <div className="glass-pane flex h-full flex-col rounded-[24px] p-[18px] sm:p-5">
                <p className="text-[21px] font-medium leading-tight tracking-[-0.015em] text-text-primary">
                  {pillar.label}
                </p>
                <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-text-muted">
                  <span className="tabular-nums text-accent">{pillar.count}</span>{' '}
                  {pillar.count === 1 ? 'project' : 'projects'}
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
