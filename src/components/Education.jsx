import Reveal from './ui/Reveal';
import CourseworkModule from './ui/CourseworkModule';
import ProgramJourney from './ui/ProgramJourney';
import { EDUCATION } from '../data/education';

export default function Education() {
  return (
    <section id="education" className="bg-base-bg px-6 py-14 sm:px-10 md:px-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // 03 [ education ]
          </p>
          <h2 className="max-w-[26ch] text-3xl font-medium tracking-tight text-text-primary md:text-[38px]">
            Two tracks, run in parallel for the last two years.
          </h2>
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
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <span
                      className={
                        i === 0
                          ? 'h-[9px] w-[9px] shrink-0 rounded-full bg-accent'
                          : 'h-[9px] w-[9px] shrink-0 rounded-full shadow-[0_0_0_1px_rgba(145,132,217,0.7)]'
                      }
                    />
                    {!last && (
                      <span
                        className="w-px flex-1"
                        style={{
                          background: 'linear-gradient(180deg, rgba(145,132,217,.35), rgba(145,132,217,0))',
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
                      <p className="text-lg font-medium text-text-primary">{entry.degree}</p>
                      <p className="whitespace-nowrap font-mono text-[11.5px] text-text-muted">
                        {entry.period}
                      </p>
                    </div>
                    <p className="mt-1 font-mono text-xs text-accent-body">{entry.school}</p>
                    <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-relaxed text-text-primary/76">
                      {entry.description}
                    </p>
                    {entry.coursework && <CourseworkModule />}
                    {entry.journey && <ProgramJourney color="#9184d9" />}
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
