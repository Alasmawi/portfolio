import Reveal from './ui/Reveal';
import { EXPERIENCE, K9_CROSS_REF } from '../data/experience';

const YEAR = 2026;
const YEAR_START = new Date(Date.UTC(YEAR, 0, 1));
const YEAR_END = new Date(Date.UTC(YEAR + 1, 0, 1));
const MS_IN_YEAR = YEAR_END - YEAR_START;

function frac(iso) {
  return (new Date(`${iso}T00:00:00Z`) - YEAR_START) / MS_IN_YEAR;
}

const TICKS = ['Jan', 'Apr', 'Jul', 'Oct'].map((label, i) => ({
  label,
  pct: (i * 3) / 12,
}));

const now = new Date();
const nowPct = now >= YEAR_START && now < YEAR_END ? (now - YEAR_START) / MS_IN_YEAR : null;

function formatRange(entry) {
  const fmt = (iso) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${fmt(entry.start)} — ${entry.status === 'active' ? fmt(entry.end).split(' ')[0] + ' (ongoing)' : fmt(entry.end)}`;
}

function Bar({ start, end, color, muted = false, indent = false }) {
  const left = frac(start) * 100;
  const width = Math.max((frac(end) - frac(start)) * 100, 1.5);
  return (
    <div className={`relative h-2.5 rounded ${indent ? 'ml-4' : ''}`}>
      <div className="absolute inset-0 rounded shadow-[inset_0_0_0_1px_rgba(233,233,237,0.09)]" />
      <div
        className="absolute top-0 bottom-0 rounded"
        style={{
          left: `${left}%`,
          width: `${width}%`,
          backgroundColor: muted ? 'transparent' : `${color}33`,
          boxShadow: `inset 0 0 0 1px ${color}${muted ? '55' : 'aa'}`,
        }}
      />
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="bg-base-bg px-5 py-11 sm:px-10 sm:py-14 md:px-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // [ experience ]
          </p>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-[26ch] text-3xl font-medium tracking-tight text-text-primary md:text-[38px]">
              Two internships, back to back, through {YEAR}.
            </h2>
            <p className="whitespace-nowrap font-mono text-[11.5px] text-text-muted">
              {YEAR} · cloud, then security
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <div className="relative mb-2.5 h-4 font-mono text-[10.5px] uppercase tracking-wider text-text-dim">
              {TICKS.map((t, i) => (
                <span
                  key={t.label}
                  className={`absolute ${i === 0 ? '' : '-translate-x-1/2'}`}
                  style={{ left: `${t.pct * 100}%` }}
                >
                  {t.label}
                </span>
              ))}
            </div>

            <div className="relative grid gap-3.5 pb-1 pt-1.5">
              {nowPct !== null && (
                <div
                  className="pointer-events-none absolute -top-1 bottom-0 w-px bg-accent/40"
                  style={{ left: `${nowPct * 100}%` }}
                  aria-hidden="true"
                />
              )}

              <div className="grid gap-1.5">
                <div className="flex items-baseline gap-2 font-mono text-[11px] text-text-muted">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: EXPERIENCE[0].color }}
                    aria-hidden="true"
                  />
                  <span className="text-text-primary">{EXPERIENCE[0].role}</span>
                  <span className="hidden sm:inline">· {EXPERIENCE[0].org}</span>
                </div>
                <Bar start={EXPERIENCE[0].start} end={EXPERIENCE[0].end} color={EXPERIENCE[0].color} />
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-baseline gap-2 font-mono text-[11px] text-text-dim">
                  <span className="text-accent-body">└</span>
                  <span>{K9_CROSS_REF.label}</span>
                </div>
                <Bar start={EXPERIENCE[0].start} end={EXPERIENCE[0].end} color={EXPERIENCE[0].color} muted indent />
              </div>

              <div className="grid gap-1.5">
                <div className="flex items-baseline gap-2 font-mono text-[11px] text-text-muted">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: EXPERIENCE[1].color }}
                    aria-hidden="true"
                  />
                  <span className="text-text-primary">{EXPERIENCE[1].role}</span>
                  <span className="hidden sm:inline">· {EXPERIENCE[1].org}</span>
                </div>
                <Bar start={EXPERIENCE[1].start} end={EXPERIENCE[1].end} color={EXPERIENCE[1].color} />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 font-mono text-[10.5px] text-text-dim">
              {EXPERIENCE.map((j) => (
                <span key={j.id} className="inline-flex items-center gap-2">
                  <span
                    className="h-2 w-4 rounded-sm"
                    style={{ backgroundColor: `${j.color}33`, boxShadow: `inset 0 0 0 1px ${j.color}aa` }}
                  />
                  {j.org.replace(' (CIC)', '')}
                </span>
              ))}
              {nowPct !== null && (
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-px bg-accent/40" />
                  today
                </span>
              )}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 divide-y divide-base-hairline md:mt-14">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.id} delay={0.1 + i * 0.05}>
              <div className="grid gap-3 py-6 md:grid-cols-[190px_1fr_210px] md:gap-9 md:py-7">
                <div>
                  <p className="font-mono text-[11.5px] text-text-muted">{formatRange(job)}</p>
                  {job.status === 'active' ? (
                    <p
                      className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider"
                      style={{ color: job.colorText }}
                    >
                      <span
                        className="h-[5px] w-[5px] animate-pulse-slow rounded-full"
                        style={{ backgroundColor: job.color }}
                      />
                      current
                    </p>
                  ) : (
                    <p className="mt-2 font-mono text-[10.5px] uppercase tracking-wider text-text-dim">
                      completed
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: job.color }}
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-medium tracking-tight text-text-primary">{job.role}</h3>
                  </div>
                  <p className="mt-1 pl-5 font-mono text-xs" style={{ color: job.colorText }}>
                    {job.context}
                  </p>
                  <ul className="mt-3.5 space-y-1.5 pl-5">
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2 text-[14.5px] leading-relaxed text-text-primary/85">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap content-start gap-1.5 pl-5 md:pl-0">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag-outline text-[11px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="grid items-baseline gap-2 py-6 md:grid-cols-[190px_1fr_210px] md:gap-9">
              <p className="font-mono text-[10.5px] uppercase tracking-wider text-text-dim">
                from the internship
              </p>
              <div>
                <h3 className="text-lg font-medium tracking-tight text-text-primary">{K9_CROSS_REF.label}</h3>
                <a
                  href="#projects"
                  className="mt-1.5 inline-flex min-h-6 items-center gap-1.5 py-1 font-mono text-[12px] text-accent-bright"
                >
                  See the hardware and architecture in Projects
                  <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {K9_CROSS_REF.tags.map((tag) => (
                  <span key={tag} className="tag-outline text-[11px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
