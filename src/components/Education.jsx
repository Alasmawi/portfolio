import Reveal from './ui/Reveal';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';

export default function Education() {
  return (
    <section id="education" className="bg-base-bg px-5 py-11 sm:px-10 sm:py-14 md:px-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // [ education ]
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[26ch] text-3xl font-medium tracking-tight text-text-primary md:text-[38px]">
              Two tracks, run in parallel for the last two years.
            </h2>
            <p className="whitespace-nowrap font-mono text-[11.5px] text-text-muted">
              computer science · cloud · full-stack
            </p>
          </div>
        </Reveal>

        <div className="mt-8 md:mt-10">
          {EDUCATION.map((entry, i) => {
            const last = i === EDUCATION.length - 1;
            return (
              <Reveal key={entry.id} delay={0.1 + i * 0.05}>
                <div
                  className={`grid grid-cols-[20px_1fr] gap-4 py-5 sm:grid-cols-[22px_1fr] sm:gap-5 md:py-[22px] ${
                    !last ? 'shadow-[inset_0_-1px_0_rgba(233,233,237,0.07)]' : ''
                  }`}
                >
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
                      {entry.track && (
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

                    {entry.coursework && <CourseworkModule />}
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
