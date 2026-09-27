import { ArrowUpRight, Download } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader, { FRAME, SECTION_PAD } from './ui/SectionHeader';
import pfp from '../assets/pfp-nobg.webp';
import { CV_URL } from '../data/navLinks';
import { openProject } from '../lib/openProject';
import { scrollToSection } from '../lib/scrollToSection';

// How the work gets done, each with the thing on this page that shows it. It
// replaced a Good at / Bad at pair, which is a format every portfolio has and
// which proved nothing; each of these points at a project or a role.
const PRACTICES = [
  {
    title: 'Schema to screen',
    body: 'I design the tables, write the API, build the interface and deploy it. Bayyan went from its first table to a Linux server behind nginx without a handoff.',
    proof: { label: 'Bayyan', project: 'bayyan' },
  },
  {
    title: 'Answers that show their source',
    body: 'When software tells someone something, it should show where that came from. Guidely cites the passages behind every answer, and Bayyan links each billed amount to its line on the bill.',
    proof: { label: 'Guidely', project: 'guidely' },
  },
  {
    title: 'Reviewed before it ships',
    body: 'Guidely runs 264 automated tests. At Reboot01 nothing passed until peers had read the code and I had defended it in a live audit.',
    proof: { label: 'Brain-Book', project: 'brain-book' },
  },
  {
    title: 'Written down for whoever is next',
    body: 'At the Shura Council I write the procedures the team works from after I hand a system over, alongside the system itself.',
    proof: { label: 'Experience', section: 'experience' },
  },
];

function Title() {
  return (
    <>
      I like the problems that{' '}
      <span className="relative whitespace-nowrap">
        don&apos;t
        <span
          className="absolute -bottom-1.5 left-0 right-0 h-0.5"
          style={{
            background: 'linear-gradient(90deg, rgba(226,96,126,0), #e2607e 18%, #e2607e 82%, rgba(226,96,126,0))',
          }}
        />
      </span>{' '}
      get to fail.
    </>
  );
}

export default function About() {
  return (
    <section id="about" className={`relative py-12 sm:py-16 md:py-20 ${SECTION_PAD}`}>
      <div className={FRAME}>
        {/* Header, photo, body, in that order on a phone, where the photo is a
            compact card under the heading. From lg the photo takes a column of
            its own beside both. */}
        <div className="grid gap-y-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-x-14 lg:gap-y-0">
          <div className="lg:col-start-2 lg:row-start-1">
            <SectionHeader index="06" eyebrow="About" title={<Title />} />
          </div>

          <Reveal delay={0.05} className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <figure className="glass-pane flex overflow-hidden rounded-[24px] lg:sticky lg:top-28 lg:block lg:rounded-[28px]">
              <div className="relative h-[168px] w-[150px] shrink-0 lg:h-[330px] lg:w-auto">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'radial-gradient(60% 50% at 50% 65%, rgba(226,96,126,.28), rgba(226,96,126,0) 74%)',
                  }}
                />
                {/* The file has a real alpha channel; the masks only soften the
                    two hard straight edges the source photo is cropped with, at
                    the shoulder and the bottom. */}
                <img
                  src={pfp}
                  alt="Abdulla Alasmawi"
                  className="relative block h-full w-full object-contain object-bottom"
                  style={{
                    maskImage:
                      'linear-gradient(to right, #000 80%, transparent 98%), linear-gradient(to bottom, #000 80%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage:
                      'linear-gradient(to right, #000 80%, transparent 98%), linear-gradient(to bottom, #000 80%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                  }}
                />
              </div>
              <figcaption className="grid content-end gap-1 px-5 py-4 lg:border-t lg:border-white/[0.08]">
                <span className="text-[15px] font-medium text-text-primary">Abdulla Alasmawi</span>
                <span className="font-mono text-[11px] text-text-muted">Manama, Bahrain · UTC+3</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-start-2 lg:row-start-2">
            <Reveal delay={0.1}>
              <div className="max-w-[62ch] space-y-4 text-[16px] lg:mt-6 leading-relaxed text-text-primary/80">
                <p>
                  I’m a software engineer from Bahrain. I studied Computer Science on the University of
                  Bahrain’s cloud computing track, and for the last two years of it I also went through
                  Reboot01, where nothing passes until you defend it in front of your peers.
                </p>
                <p>
                  At the AWS Cloud Innovation Center I built a serverless platform for the Ministry of
                  Interior’s K9 unit. At the Shura Council I built Bayyan, a bilingual registry piloted
                  across four teams, and moved a production database off AWS without losing a row.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-9 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">How I work</p>
              {/* One pane divided into cells, like the Skills sheet, rather than
                  four cards: they are four parts of one answer. */}
              <div className="glass-pane mt-3 grid overflow-hidden rounded-[22px] sm:grid-cols-2">
                {PRACTICES.map((p, i) => (
                  <div
                    key={p.title}
                    className={`flex flex-col gap-2 p-5 ${i ? 'border-t border-white/[0.07]' : ''} ${
                      i === 1 ? 'sm:border-t-0' : ''
                    } ${i % 2 === 1 ? 'sm:border-l sm:border-white/[0.07]' : ''}`}
                  >
                    <h3 className="text-[15.5px] font-medium leading-snug text-text-primary">{p.title}</h3>
                    <p className="text-[14px] leading-relaxed text-text-primary/70">{p.body}</p>
                    <button
                      type="button"
                      onClick={() => (p.proof.project ? openProject(p.proof.project) : scrollToSection(p.proof.section))}
                      className="mt-auto inline-flex min-h-8 w-fit items-center gap-1 pt-1 font-mono text-[11.5px] text-accent-body transition-colors hover:text-accent-bright"
                    >
                      {p.proof.label}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2.5">
                {/* Glass, not a fill: the hero opens with the filled version of
                    this action and Contact closes with it. */}
                <a href="#contact" className="btn btn-ghost glass-control px-6">
                  Get in touch
                </a>
                <a href={CV_URL} download className="btn btn-ghost glass-control px-5">
                  <span className="flex items-center gap-2">
                    <Download size={15} aria-hidden="true" />
                    Download CV
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
