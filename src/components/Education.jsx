import { ArrowUpRight } from 'lucide-react';
import Reveal from './ui/Reveal';
import Fold from './ui/Fold';
import { GithubMark } from './ui/BrandIcons';
import SectionHeader, { FRAME, SECTION_PAD, SECTION_Y } from './ui/SectionHeader';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';
import { REBOOT_JOURNEY } from '../data/rebootJourney';

const AXIS_FROM = Math.min(...EDUCATION.map((e) => e.from));
const AXIS_TO = Math.max(...EDUCATION.map((e) => e.to));
const YEARS = Array.from({ length: AXIS_TO - AXIS_FROM + 1 }, (_, i) => AXIS_FROM + i);
const pct = (year) => ((year - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * 100;
const OVERLAP_FROM = Math.max(...EDUCATION.map((e) => e.from));

// The degree and the program on one axis of years. Two lanes on one
// axis of years, with the stretch where both ran shaded, and Reboot's lane
// split into its two phases so the current one can carry the live marker.
function ParallelTracks() {
  const totalMonths = REBOOT_JOURNEY.reduce((n, s) => n + s.months, 0);
  return (
    <div className="glass-pane mt-10 hidden p-8 md:block" aria-hidden="true">
      <div className="relative">
        <div
          className="absolute inset-y-0 bg-white/[0.04]"
          style={{ left: `${pct(OVERLAP_FROM)}%`, right: 0 }}
        >
          {/* Inside the band, clear of its rounded corner. It used to sit half
              a pixel above the band's top edge, so the edge ran through the
              lettering. */}
          <span className="absolute right-3 top-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
            overlap
          </span>
        </div>

        <div className="relative grid gap-5 pb-3 pt-8">
          {EDUCATION.map((e) => (
            <div key={e.id}>
              <p className="mb-2 flex flex-wrap items-baseline gap-x-2 font-mono text-[11px]">
                <span style={{ color: e.color }}>{e.short}</span>
                <span className="text-text-muted">{e.degree}</span>
              </p>
              <div className="relative h-3">
                <div className="absolute inset-0 rounded-none shadow-[inset_0_0_0_1px_rgba(239,233,221,0.08)]" />
                {e.journey ? (
                  <div
                    className="absolute inset-y-0 flex gap-[3px]"
                    style={{ left: `${pct(e.from)}%`, width: `${pct(e.to) - pct(e.from)}%` }}
                  >
                    {REBOOT_JOURNEY.map((s) => (
                      <div
                        key={s.id}
                        className="relative h-full rounded-none"
                        style={{
                          width: `${(s.months / totalMonths) * 100}%`,
                          backgroundColor: s.status === 'active' ? `${e.color}cc` : `${e.color}55`,
                        }}
                      >
                        {/* Inside the segment's end, not centred on it: centred,
                            half the dot hung past the bar and the pane edge
                            on a phone. Centred with auto margins rather than
                            a translate: the pulse animates `transform`, which
                            replaced the translate and dropped the dot below
                            the bar. */}
                        {s.status === 'active' && (
                          <span className="absolute inset-y-0 right-[3px] my-auto h-1.5 w-1.5 animate-pulse-slow rounded-full bg-white" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="absolute inset-y-0 rounded-none"
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
    <section id="education" className={`relative ${SECTION_Y} ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader
          title="Education"
          lead="A Computer Science degree on the cloud computing track, with a project-based full-stack program taken alongside its final two years."
        />

        <Reveal delay={0.08}>
          <ParallelTracks />
        </Reveal>

        <div className="mt-6 grid gap-3 md:mt-4 md:gap-4 lg:grid-cols-2">
          {EDUCATION.map((entry, i) => (
            <Reveal key={entry.id} delay={0.1 + i * 0.05} className="h-full">
              <article className="glass-pane flex h-full flex-col p-5 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="label" style={{ color: entry.color }}>
                    {entry.school}
                  </p>
                  <p className="font-mono text-[11.5px] text-text-muted">{entry.period}</p>
                </div>
                <h3 className="display-sm mt-4 text-[30px] sm:text-[36px]">
                  {entry.degree}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <span
                    className="label inline-flex items-center border px-2 py-1"
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

                <p className="mt-4 text-[14.5px] leading-relaxed text-text-primary/80">{entry.points[0]}</p>

                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {entry.stats.map((s) => (
                    <div key={s.label} className="flex items-baseline gap-1.5">
                      <span className="display-sm text-[40px] tabular-nums" style={{ color: entry.color }}>
                        {s.value}
                      </span>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                <Fold
                  more={entry.coursework ? 'Show coursework' : 'Show phases'}
                  color={entry.color}
                  className="mt-2"
                >
                  <ul className="space-y-2 pt-3">
                    {entry.points.slice(1).map((p) => (
                      <li key={p} className="flex gap-2.5 text-[14.5px] leading-relaxed text-text-primary/80">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  {entry.coursework && <CourseworkModule color={entry.color} />}
                  {entry.journey && (
                    <div className="mt-6 border-t border-white/[0.08] pt-5">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Phases</p>
                      <ProgramJourney color={entry.color} />
                    </div>
                  )}
                </Fold>

                {entry.github && (
                  <a
                    href={entry.github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-4 flex items-center gap-4 border-t border-bone/15 pt-4"
                  >
                    <GithubMark size={22} className="shrink-0 text-text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-medium text-text-primary">github.com/Alasmawi</span>
                      <span className="block text-[13px] leading-snug text-text-primary/65">{entry.github.note}</span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-text-muted transition-colors group-hover:text-text-primary"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
