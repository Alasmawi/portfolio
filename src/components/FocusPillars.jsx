import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD, SECTION_Y } from './ui/SectionHeader';
import { FOCUS_PILLARS } from '../data/focusPillars';
import { openProject } from '../lib/openProject';
import { scrollToSection } from '../lib/scrollToSection';

// What the work is, each area with its evidence attached. The evidence is
// named and clickable — a project opens its dialog, a role jumps to Experience
// — rather than counted: a count made Cloud, whose proof is two internships
// rather than a pile of repos, look like the weakest area on the page.
function Proof({ item }) {
  const onClick = (e) => {
    e.preventDefault();
    if (item.project) openProject(item.project);
    else scrollToSection(item.href.slice(1));
  };
  return (
    <a
      href={item.href ?? '#projects'}
      onClick={onClick}
      className="group inline-flex min-h-8 items-center gap-1 text-[13.5px] text-text-primary/85 underline decoration-bone/30 underline-offset-4 transition-colors hover:text-accent-bright hover:decoration-accent-bright"
    >
      {item.label}
      <ArrowUpRight size={12} className="text-text-dim transition-colors group-hover:text-accent-bright" aria-hidden="true" />
    </a>
  );
}

// Four columns under one rule from `lg`, two from `sm`. On a phone they are
// rows that open one at a time: four blocks stacked was a screen and a half of
// reading before the first project.
export default function FocusPillars() {
  const [open, setOpen] = useState(null);

  return (
    <section id="focus" className={`relative ${SECTION_Y} ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader title="What I do" />

        <div className="mt-6 border-t border-bone/15 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
          {FOCUS_PILLARS.map((pillar, i) => {
            const on = open === pillar.id;
            return (
              <Reveal key={pillar.id} delay={0.04 + i * 0.05} className="border-b border-bone/15 sm:border-b-0 sm:pt-6 lg:pb-2">
                <button
                  type="button"
                  onClick={() => setOpen(on ? null : pillar.id)}
                  aria-expanded={on}
                  className="flex w-full items-center justify-between gap-3 py-4 text-left sm:pointer-events-none sm:py-0"
                >
                  <h3 className="display-sm text-[26px] sm:text-[30px] lg:text-[34px]">{pillar.label}</h3>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className={`shrink-0 text-text-muted transition-transform sm:hidden ${on ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`${on ? 'block' : 'hidden'} pb-5 sm:block sm:pb-0`}>
                  <p className="text-[15px] leading-relaxed text-text-primary/72 sm:mt-3">{pillar.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5">
                    {pillar.proof.map((item) => (
                      <Proof key={item.label} item={item} />
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
