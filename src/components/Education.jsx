import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';
import { REBOOT_JOURNEY } from '../data/rebootJourney';

const AXIS_FROM = Math.min(...EDUCATION.map((e) => e.from));
const AXIS_TO = Math.max(...EDUCATION.map((e) => e.to));
const YEARS = Array.from({ length: AXIS_TO - AXIS_FROM + 1 }, (_, i) => AXIS_FROM + i);
const pct = (year) => ((year - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100;
const OVERLAP_FROM = Math.max(...EDUCATION.map((e) => e.from));

// The headline's claim — two tracks, in parallel — drawn. Two lanes on one
// axis of years, with the stretch where both ran shaded, and Reboot's lane
// split into its two phases so the current one can carry the live marker.
function ParallelTracks() {
  const totalMonths = REBOOT_JOURNEY.reduce((n, s) => n + s.months, 0);
  return (
    <div className="glass-pane mt-9 rounded-[26px] p-5 sm:p-7" aria-hidden="true">
      <div className="relative">
        <div
          className="absolute inset-y-0 rounded-xl bg-white/[0.035]"
          style={{ left: `${pct(OVERLAP_FROM)}%`, right: 0 }}
        >
          <span className="absolute -top-0.5 right-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
            both at once
          </span>
        </div>

        <div className="relative grid gap-5 pb-2 pt-6">
          {EDUCATION.map((e) => (
            <div key={e.id}>
              <p className="mb-2 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px]">
                <span style={{ color: e.color }}>{e.short}</span>
                <span className="text-text-muted">{e.degree}</span>
              </p>
              <div className="relative h-3">
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(251,238,240,0.08)]" />
                {e.journey ? (
                  <div
                    className="absolute inset-y-0 flex gap-[3px]"
                    style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%` }}
                  >
                    {REBOOT_JOURNEY.map((s) => (
                      <div
                        key={s.id}
                        className="relative h-full rounded-full"
                        style={{
                          width: `${(s.months / totalMonths) * 100}%`,
                          backgroundColor: s.status === 'active' ? `${e.color}cc` : `${e.color}55`,
                        }}
                      >
                        {s.status === 'active' && (
                          <span
                            className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 animate-pulse-slow rounded-full"
                            style={{ backgroundColor: e.color, boxShadow: `0 0 12px ${e.color}` }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: `${pct(e.from)}%`,
                      width: `${pct(e.to) - pct(e.from)}%`,
                      backgroundColor: `${e.color}99`,
                    }}
                  />
                )}
              </div>
              {e.journey && (
                <div
                  className="relative mt-1.5 flex gap-[3px] font-mono text-[10px] text-text-dim"
                  style={{ marginLeft: `${pct(e.from)}%` }}
                >
                  {REBOOT_JOURNEY.map((s) => (
                    <span key={s.id} style={{ width: `${(s.months / totalMonths) * 100}%` }} className="truncate">
                      {s.phase}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-3 h-4 font-mono text-[10.5px] text-text-dim">
        {YEARS.map((y, i) => (
          <span
            key={y}
            className={`absolute ${i === 0 ? '' : i === YEARS.length - 1 ? '-translate-x-full' : '-translate-x-1/2'}`}
            style={{ left: `${pct(y)}%` }}
          >
            {y}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Education() {
  return (
    <section id="education" className={`relative py-12 sm:py-16 md:py-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          index="05"
          eyebrow="Education"
          title="Two tracks, run in parallel."
          lead="A Computer Science degree on the cloud computing track, and for its last two years a project-based full-stack program alongside it."
        />

        <Reveal delay={0.08}>
          <ParallelTracks />
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {EDUCATION.map((entry, i) => (
            <Reveal key={entry.id} delay={0.1 + i * 0.05} className="h-full">
              <article className="glass-pane flex h-full flex-col rounded-[26px] p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="font-mono text-[12px]" style={{ color: entry.color }}>
                    {entry.school}
                  </p>
                  <p className="font-mono text-[11.5px] text-text-muted">{entry.period}</p>
                </div>
                <h3 className="mt-3 text-[22px] font-medium leading-snug tracking-tight text-text-primary">
                  {entry.degree}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px]"
                    style={{ color: entry.color, borderColor: `${entry.color}66`, backgroundColor: `${entry.color}14` }}
                  >
                    {entry.track}
                  </span>
                  {entry.current && (
                    <span
                      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em]"
                      style={{ color: entry.color }}
                    >
                      <span className="h-[5px] w-[5px] animate-pulse-slow rounded-full" style={{ backgroundColor: entry.color }} />
                      in progress
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2">
                  {entry.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-[14.5px] leading-relaxed text-text-primary/80">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {entry.stats.map((s) => (
                    <div key={s.label} className="flex items-baseline gap-1.5">
                      <span className="font-mono text-2xl font-medium tabular-nums" style={{ color: entry.color }}>
                        {s.value}
                      </span>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {entry.coursework && <CourseworkModule color={entry.color} />}
                {entry.journey && (
                  <div className="mt-6 border-t border-white/[0.08] pt-5">
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Phases</p>
                    <ProgramJourney color={entry.color} />
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
