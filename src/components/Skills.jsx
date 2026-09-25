import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import { SKILLS, SPOKEN } from '../data/skills';

// The toolbox as a spec sheet: one row per category, the same rows and the
// same order as the CV's Technical Skills table, so the two can be read side
// by side and agree.
export default function Skills() {
  return (
    <section id="skills" className={`relative py-12 sm:py-16 md:py-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          index="04"
          eyebrow="Skills"
          title="What I build with."
          lead="Grouped the way my CV groups them. Everything listed is used in a project or a role on this page."
        />

        <Reveal delay={0.08}>
          <dl className="glass-pane mt-9 overflow-hidden rounded-[26px]">
            {SKILLS.map((group) => (
              <div
                key={group.id}
                className="grid gap-2.5 border-b border-white/[0.07] px-5 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-baseline sm:gap-6 sm:px-7 sm:py-5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-body">{group.label}</dt>
                <dd className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.12] bg-white/[0.045] px-3 py-1 text-[13px] text-text-primary/90"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
            <div className="grid gap-2.5 px-5 py-4 sm:grid-cols-[170px_minmax(0,1fr)] sm:items-baseline sm:gap-6 sm:px-7 sm:py-5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-body">Spoken</dt>
              <dd className="flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-text-primary/90">
                {SPOKEN.map((s) => (
                  <span key={s.language}>
                    {s.language} <span className="font-mono text-[11.5px] text-text-muted">· {s.level}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
