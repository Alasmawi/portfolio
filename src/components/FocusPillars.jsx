import { ArrowUpRight, Cloud, Cpu, Layers, ScanSearch } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import { FOCUS_PILLARS } from '../data/focusPillars';
import { openProject } from '../lib/openProject';
import { scrollToSection } from '../lib/scrollToSection';

const ICONS = { fullstack: Layers, cloud: Cloud, ai: ScanSearch, cs: Cpu };

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
      className="group inline-flex min-h-8 items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.04] px-3 text-[12px] text-text-primary/85 transition-colors hover:border-accent/60 hover:text-text-primary"
    >
      {item.label}
      <ArrowUpRight
        size={12}
        className="text-text-dim transition-colors group-hover:text-accent-bright"
        aria-hidden="true"
      />
    </a>
  );
}

export default function FocusPillars() {
  return (
    <section id="focus" className={`relative pb-10 pt-12 sm:pt-16 md:pb-14 md:pt-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          index="01"
          eyebrow="What I do"
          title="Full-stack products, with the cloud underneath them."
        />

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_PILLARS.map((pillar, i) => {
            const Icon = ICONS[pillar.id];
            return (
              <Reveal key={pillar.id} delay={0.05 + i * 0.05} className="h-full">
                <div className="glass-pane flex h-full flex-col rounded-[24px] p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.05] text-accent-bright">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[19px] font-medium leading-tight tracking-[-0.015em] text-text-primary">
                    {pillar.label}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-text-primary/68">{pillar.blurb}</p>
                  <div className="mt-auto pt-5">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                      See it in
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.proof.map((item) => (
                        <Proof key={item.label} item={item} />
                      ))}
                    </div>
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
