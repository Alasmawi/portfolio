import Reveal from './ui/Reveal';
import SectionHeading from './ui/SectionHeading';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="section-inner">
        <SectionHeading
          label="education"
          title="Two tracks, run in parallel for the last two years."
        />

        {/* A pane per track rather than rows split by an inset rule. The two
            run in parallel and are read as a pair, which two panes say and a
            divided list does not. */}
        <div className="section-body grid gap-4">
          {EDUCATION.map((entry, i) => {
            return (
              <Reveal key={entry.id} delay={0.1 + i * 0.05}>
                <div className="glass-pane grid grid-cols-[20px_1fr] gap-4 rounded-[26px] p-5 sm:grid-cols-[22px_1fr] sm:gap-5 sm:p-6">
                  {/* Status rail: filled dot for the completed track, a live
                      pulsing ring for the one still running. */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    {entry.current ? (
                      <span className="relative flex h-[10px] w-[10px] shrink-0">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span
                          className="relative inline-flex h-[10px] w-[10px] rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                      </span>
                    ) : (
                      <span
                        className="h-[10px] w-[10px] shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                    )}
                    <span
                      className="w-px flex-1"
                      style={{ background: `linear-gradient(180deg, ${entry.color}66, transparent)` }}
                    />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                      <p className="text-lg font-medium text-text-primary">{entry.degree}</p>
                      <p className="whitespace-nowrap font-mono text-[11.5px] text-text-muted">
                        {entry.period}
                      </p>
                    </div>

                    {/* Accent meta row: institution, specialisation, and live state */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <p className="font-mono text-xs" style={{ color: entry.color }}>
                        {entry.school}
                      </p>
                      {/* Only when it adds something. UoB's track is "Cloud
                          Computing track" under a degree titled "B.Sc. Computer
                          Science — Cloud Computing", which made three mentions
                          in four lines; Reboot's "Cloud DevOps & Cybersecurity"
                          under "Full Stack Development" is genuinely new. */}
                      {entry.track && !entry.degree.toLowerCase().includes(entry.track.toLowerCase().replace(/ track$/, '')) && (
                        <span
                          className="inline-flex items-center rounded border px-2.5 py-1 font-mono text-[10.5px] tracking-wide"
                          style={{
                            color: entry.color,
                            borderColor: `${entry.color}66`,
                            backgroundColor: `${entry.color}14`,
                          }}
                        >
                          {entry.track}
                        </span>
                      )}
                      {entry.current && (
                        <span
                          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em]"
                          style={{ color: entry.color }}
                        >
                          <span
                            className="h-[5px] w-[5px] animate-pulse-slow rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          in progress
                        </span>
                      )}
                    </div>

                    <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-text-primary/70">
                      {entry.description}
                    </p>

                    {/* Real figures, not ornament — course and credit counts come
                        from the coursework data, phase counts from the 01Edu plan. */}
                    {entry.stats && (
                      <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                        {entry.stats.map((s) => (
                          <div key={s.label} className="flex items-baseline gap-1.5">
                            <span
                              className="font-mono text-2xl font-medium tabular-nums"
                              style={{ color: entry.color }}
                            >
                              {s.value}
                            </span>
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                              {s.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Desktop only. On a phone this was a glass panel with a
                      disclosure chevron wrapped around a four-segment bar — a
                      lot of chrome for a breakdown nobody came for. The two
                      figures above it, 30 courses and 88 credit hours, are the
                      part that carries. */}
                  <div className="hidden md:block">
                      {entry.coursework && <CourseworkModule />}
                  </div>
                    {entry.journey && <ProgramJourney color={entry.color} />}
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
