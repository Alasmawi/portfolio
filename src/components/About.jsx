import { Download } from 'lucide-react';
import Reveal from './ui/Reveal';
import { FRAME, SECTION_PAD, SECTION_Y } from './ui/SectionHeader';
import { CV_URL } from '../data/navLinks';

// The facts a recruiter scans for, as a short list under the prose. Everything
// here is a fact stated elsewhere on the page.
const FACTS = [
  { label: 'Based in', value: 'Manama, Bahrain (UTC+3)' },
  { label: 'Degree', value: 'B.Sc. Computer Science, University of Bahrain' },
  { label: 'Program', value: 'Full Stack Development, Reboot Coding Institute' },
  { label: 'Recent roles', value: 'Bahrain Shura Council, AWS Cloud Innovation Center' },
  { label: 'Works with', value: 'React, Go, Rust, Python, NestJS, PostgreSQL, AWS' },
];

export default function About() {
  return (
    // The page's one inverted section: bone ground, ink type. Coming after
    // four sections on ink it is a change of light, and it is where the page
    // stops listing work and says who did it.
    <section id="about" className={`on-bone relative bg-bone text-ink ${SECTION_Y} ${SECTION_PAD}`}>
      <div className={`${FRAME} grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]`}>
        <Reveal>
          <h2 className="display text-[clamp(46px,8.2vw,124px)]">
            Full-stack
            <br />
            engineer,
            <br />
            <span className="text-carmine">cloud</span>
            <br />
            underneath.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="max-w-[62ch] space-y-4 text-[16px] leading-relaxed lg:text-[17px]">
            <p>
              I’m a software engineer based in Manama, Bahrain. I studied Computer Science at the University
              of Bahrain on the cloud computing track, and spent the last two years of the degree in Reboot
              Coding Institute’s full-stack program, where every project is peer-reviewed and defended in a
              live audit.
            </p>
            <p>
              At the AWS Cloud Innovation Center I built a serverless monitoring platform for the Ministry of
              Interior Police K9 Unit. At the Bahrain Shura Council I built Bayyan, a bilingual obligations
              register piloted across four teams, and migrated a production database from Amazon RDS to
              on-premises servers with no data loss.
            </p>
            <p>
              I work across the stack, from the data model and API to the interface and deployment, and I’m
              looking for a role on a product team.
            </p>
          </div>

          <dl className="mt-8 border-t-[1.5px] border-ink">
            {FACTS.map((f) => (
              <div key={f.label} className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-ink/20 py-3 sm:grid-cols-[140px_minmax(0,1fr)]">
                <dt className="label pt-0.5">{f.label}</dt>
                <dd className="text-[15px] leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href="#contact" className="btn btn-primary">
              Get in touch
            </a>
            <a href={CV_URL} download className="btn btn-ghost glass-control">
              <Download size={15} aria-hidden="true" />
              Download CV
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
