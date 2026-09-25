import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeroTrace from './ui/HeroTrace';
import { CV_URL } from '../data/navLinks';

// The organisations the work was done for, as the hero's closing line. It is
// the proof under the claim above it, and on a desktop it fills the band under
// the fold that used to be empty.
const BUILT_FOR = [
  { name: 'Ministry of Interior', detail: 'Police K9 Unit' },
  { name: 'AWS Cloud Innovation Center', detail: 'Bahrain' },
  { name: 'Bahrain Shura Council', detail: 'Network & Information Security' },
];

export default function Hero() {
  // svh, not dvh: dvh tracks the URL bar collapsing as you scroll, so the hero
  // grew under the reader's thumb on the first flick of every visit.
  return (
    <section
      id="hero"
      className="relative px-5 pb-10 pt-[100px] sm:px-10 sm:pb-14 sm:pt-[124px] md:px-14 lg:pt-[140px]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(400px,480px)] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textShadow: '0 2px 34px rgba(23,18,26,.75)' }}
        >
          {/* glass-pane, not glass-control: a status readout, not a button. */}
          <p
            className="glass-pane inline-flex items-center gap-2.5 rounded-full px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-primary"
            style={{ textShadow: 'none' }}
          >
            <span
              className="signal-blip h-[7px] w-[7px] rounded-full bg-signal"
              style={{ boxShadow: '0 0 10px rgba(79,209,197,.9)' }}
              aria-hidden="true"
            />
            Available for work
            <span className="text-white/25" aria-hidden="true">
              |
            </span>
            <span className="text-text-muted">Manama, Bahrain</span>
          </p>

          <h1 className="mt-6 text-[46px] font-medium leading-[0.96] tracking-[-0.04em] text-text-primary sm:text-[64px] lg:text-[80px]">
            Abdulla
            <br />
            Alasmawi
          </h1>

          <p className="mt-6 max-w-[30ch] text-[19px] leading-[1.4] text-text-primary/90 sm:text-[22px]">
            Software engineer. I build full-stack products and run them on{' '}
            <span className="text-accent-bright">AWS</span>.
          </p>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-text-primary/70 sm:text-base">
            Most recently the Ministry of Interior K9 Unit’s monitoring platform, built at the AWS
            Cloud Innovation Center, and a bilingual obligations registry for the Shura Council.
          </p>

          <div
            className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3"
            style={{ textShadow: 'none' }}
          >
            <a href="#contact" className="btn btn-primary min-h-[50px] flex-1 px-6 text-[15px] sm:flex-none">
              Get in touch
            </a>
            <a
              href={CV_URL}
              download
              className="btn btn-ghost glass-control min-h-[50px] flex-1 px-5 sm:flex-none"
            >
              <span className="flex items-center gap-2">
                <Download size={16} aria-hidden="true" />
                Download CV
              </span>
            </a>
            <div className="flex w-full gap-2.5 sm:w-auto">
              <a
                href="https://github.com/Alasmawi"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="btn btn-ghost glass-control min-h-[50px] flex-1 px-0 sm:w-[50px] sm:flex-none"
              >
                <span className="flex items-center gap-2">
                  <GithubMark size={17} />
                  <span className="sm:hidden">GitHub</span>
                </span>
              </a>
              <a
                href="https://linkedin.com/in/alasmawi"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="btn btn-ghost glass-control min-h-[50px] flex-1 px-0 sm:w-[50px] sm:flex-none"
              >
                <span className="flex items-center gap-2">
                  <LinkedinMark size={16} />
                  <span className="sm:hidden">LinkedIn</span>
                </span>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <HeroTrace />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="mx-auto mt-12 max-w-6xl lg:mt-16"
      >
        <div className="hr-fade" />
        <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3 lg:grid-cols-[auto_repeat(3,minmax(0,1fr))] lg:items-baseline">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-text-dim sm:col-span-3 lg:col-span-1">Built for</p>
          {BUILT_FOR.map((o) => (
            <div key={o.name} className="min-w-0">
              <p className="text-[14.5px] font-medium leading-snug text-text-primary/90">{o.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-text-muted">{o.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
