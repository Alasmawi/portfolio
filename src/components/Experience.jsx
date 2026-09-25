import { ArrowUpRight } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import { EXPERIENCE } from '../data/experience';
import { PROJECTS } from '../data/projects';
import { openProject } from '../lib/openProject';

const YEAR = 2026;
const YEAR_START = new Date(Date.UTC(YEAR, 0, 1));
const YEAR_END = new Date(Date.UTC(YEAR + 1, 0, 1));
const MS_IN_YEAR = YEAR_END - YEAR_START;

const now = new Date();
const nowPct = now >= YEAR_START && now < YEAR_END ? (now - YEAR_START) / MS_IN_YEAR : null;

// An ongoing role's bar runs to today — or to the end of the axis once today
// is past it.
function frac(iso) {
  if (!iso) return nowPct ?? 1;
  return (new Date(`${iso}T00:00:00Z`) - YEAR_START) / MS_IN_YEAR;
}

const TICKS = ['Jan', 'Apr', 'Jul', 'Oct'].map((label, i) => ({ label, pct: (i * 3) / 12 }));

const fmt = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatRange = (job) => `${fmt(job.start)} — ${job.end ? fmt(job.end) : 'Present'}`;

// The timeline reads left to right in time; the cards below read newest first,
// the way the CV does.
const CHRONO = [...EXPERIENCE].sort((a, b) => a.start.localeCompare(b.start));
const projectName = (id) => PROJECTS.find((p) => p.id === id)?.name;

function Bar({ start, end, color, muted = false, indent = false, live = false }) {
  const left = frac(start) * 100;
  const width = Math.max((frac(end) - frac(start)) * 100, 1.5);
  return (
    <div className={`relative h-2.5 rounded ${indent ? 'ml-4' : ''}`}>
      <div className="absolute inset-0 rounded shadow-[inset_0_0_0_1px_rgba(251,238,240,0.09)]" />
      <div
        className="absolute bottom-0 top-0 rounded"
        style={{
          left: `${left}%`,
          width: `${width}%`,
          backgroundColor: muted ? 'transparent' : `${color}33`,
          boxShadow: `inset 0 0 0 1px ${color}${muted ? '55' : 'aa'}`,
          // An ongoing bar fades out at its leading edge rather than stopping
          // square, which is the difference between "ends here" and "so far".
          maskImage: live ? 'linear-gradient(90deg, #000 70%, rgba(0,0,0,.35))' : undefined,
        }}
      />
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className={`relative py-12 sm:py-16 md:py-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        <SectionHeader index="03" eyebrow="Experience" title={`Two internships, back to back, in ${YEAR}.`} />

        {/* The year as a figure: two roles and the project each produced, on
            one axis. Desktop only — on a phone the dates on each card say the
            same thing in a fraction of the height. */}
        <Reveal delay={0.1}>
          <div className="glass-pane mt-10 hidden rounded-[26px] p-7 md:block">
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
                  className="pointer-events-none absolute -top-1 bottom-0 w-px bg-accent/50"
                  style={{ left: `${nowPct * 100}%` }}
                  aria-hidden="true"
                />
              )}

              {CHRONO.map((job) => (
                <div key={job.id} className="grid gap-3.5">
                  <div className="grid gap-1.5">
                    <div className="flex items-baseline gap-2 font-mono text-[11px] text-text-muted">
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: job.color }}
                        aria-hidden="true"
                      />
                      <span className="text-text-primary">{job.role}</span>
                      <span>· {job.org}</span>
                    </div>
                    <Bar start={job.start} end={job.end} color={job.color} live={!job.end} />
                  </div>
                  {job.projectId && (
                    <div className="grid gap-1.5">
                      <div className="flex items-baseline gap-2 font-mono text-[11px] text-text-dim">
                        <span className="text-accent-body">└</span>
                        <span>{projectName(job.projectId)}</span>
                      </div>
                      <Bar start={job.start} end={job.end} color={job.color} muted indent live={!job.end} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {nowPct !== null && (
              <div className="mt-4 flex items-center gap-2 font-mono text-[10.5px] text-text-dim">
                <span className="h-2.5 w-px bg-accent/50" />
                today
              </div>
            )}
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:mt-6 lg:grid-cols-2">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.id} delay={0.1 + i * 0.05} className="h-full">
              <article className="glass-pane flex h-full flex-col rounded-[26px] p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <p className="font-mono text-[11.5px] text-text-muted">{formatRange(job)}</p>
                  {job.end ? (
                    <p className="font-mono text-[10.5px] uppercase tracking-wider text-text-dim">completed</p>
                  ) : (
                    <p
                      className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider"
                      style={{ color: job.colorText }}
                    >
                      <span
                        className="h-[6px] w-[6px] animate-pulse-slow rounded-full"
                        style={{ backgroundColor: job.color }}
                      />
                      current
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <span
                    className="mt-[9px] h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: job.color, boxShadow: `0 0 12px ${job.color}88` }}
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-[21px] font-medium leading-snug tracking-tight text-text-primary">{job.role}</h3>
                    <p className="mt-0.5 text-[15px] text-text-primary/85">{job.org}</p>
                    <p className="mt-0.5 font-mono text-[11.5px]" style={{ color: job.colorText }}>
                      {job.context}
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 sm:pl-[22px]">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[14.5px] leading-relaxed text-text-primary/82">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent-body" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-1 flex-col sm:pl-[22px]">
                  <div className="flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <span key={tag} className="tag-outline text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Tags sit under the bullets; the project link sits at the
                      foot of the card, so the two cards' links line up. */}
                  {job.projectId && (
                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        onClick={() => openProject(job.projectId)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-left transition-colors hover:border-accent/50 hover:bg-white/[0.06]"
                      >
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim">
                            Built here
                          </span>
                          <span className="text-[15px] font-medium text-text-primary">
                            {projectName(job.projectId)}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[13px] text-text-primary/80">
                          Open project <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
