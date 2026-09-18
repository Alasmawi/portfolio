import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import { FOCUS_PILLARS } from '../data/focusPillars';

// The four areas the work falls into, named and stacked.
//
// No counts. Each card used to carry "n projects", derived from the pillars
// each entry in projects.js declares, on the theory that a claim should come
// with its evidence attached. In practice it ranked the four by volume, and
// volume is the wrong measure here: Cloud Computing read "1 project" directly
// under a hero that says "I build full-stack systems on AWS", while Computer
// Science read "7" on the strength of seven coursework exercises. The number
// argued against the positioning every time.
//
// The evidence is still attached — it is the projects section immediately
// below, where each entry carries its own tags — and `pillars` in projects.js
// still drives nothing else, so the taxonomy stays honest without being
// scored.
//
// The blurb from focusPillars.js is deliberately not rendered. This section is
// the index; the prose version of the same four areas is what the projects are.
export default function FocusPillars() {
  return (
    <section id="focus" className="section">
      <div className="section-inner">
        <SectionHeading label="focus" title="Four things I actually work on." />

        <div className="section-body grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {FOCUS_PILLARS.map((pillar, i) => (
            <Reveal key={pillar.id} delay={0.05 + i * 0.05} className="h-full">
              <div className="glass-pane flex h-full flex-col rounded-[24px] p-[18px] sm:p-5">
                <p className="text-[21px] font-medium leading-tight tracking-[-0.015em] text-text-primary">
                  {pillar.label}
                </p>
                {/* One line, not a pill each. Four cards carrying sixteen
                    individually-outlined boxes was the densest thing on the
                    phone — twenty of the page's forty-seven visible uppercase
                    labels lived in this section alone. The stack is supporting
                    detail here; the projects below are where it is load-bearing
                    and where each one is a real tag. */}
                {/* Joined with a no-break space before each separator, so a
                    wrap never starts a line with a stray "· ". */}
                <p className="mt-2.5 font-mono text-[11px] leading-relaxed text-text-dim">
                  {pillar.tools.join('\u00a0· ')}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
