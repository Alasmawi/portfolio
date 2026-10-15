import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import pfp from '../assets/pfp-nobg.webp';
import { CV_URL } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';
import { FRAME, SECTION_PAD } from './ui/SectionHeader';

// The cover. A name set as large as the window allows, and a portrait on a
// block of carmine that the name runs across: the portrait sits in front of
// the last letters, the way a magazine puts its subject in front of its
// masthead. That overlap is the one loud thing on the site; everything after
// it is type on a flat ground.
//
// The name is sized in vw so it always spans the frame. Both lines are behind
// the portrait, and the portrait is sized so only the feet of the last two
// letters go behind it — the name stays readable.
export default function Hero() {
  const toContact = (e) => {
    e.preventDefault();
    scrollToSection('contact');
  };

  return (
    <section id="hero" className={`relative flex flex-col overflow-clip md:min-h-[620px] lg:min-h-[100svh] ${SECTION_PAD}`}>
      {/* The carmine block on a wide screen: the right third, full height. On a
          phone the block is the band the introduction sits on, below. */}
      <div className="absolute inset-y-0 right-0 hidden w-[34%] bg-carmine md:block" aria-hidden="true" />

      <div className={`${FRAME} relative flex flex-1 flex-col pt-7 md:pt-[76px]`}>
        <p className="label text-bone md:hidden">alasmawi.dev</p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="display relative z-[1] mt-5 whitespace-nowrap text-[22.4vw] leading-[0.8] md:mt-2 md:text-[min(21vw,340px)]"
        >
          <span className="block">Abdulla</span>
          <span className="block">Alasmawi</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          /* A full-bleed carmine band on a phone, holding the portrait and
             the introduction. From `md` it is unpositioned, so the portrait
             inside it anchors to the cover's bottom-right corner instead and
             sits in front of the name. */
          className="relative -mx-5 mt-7 bg-carmine px-5 pb-8 pt-6 sm:-mx-8 sm:px-8 md:static md:mx-0 md:mt-auto md:bg-transparent md:px-0 md:pb-10 md:pt-0"
        >
          <img
            src={pfp}
            alt="Abdulla Alasmawi"
            /* Black and white on the carmine block, and the photograph's own
               colour while the pointer is over it. A filter transition, so
               it composites and never lays out. */
            className="absolute -right-[13%] bottom-0 z-0 h-[84%] w-auto max-w-none grayscale contrast-[1.08] transition-[filter] duration-500 ease-out hover:grayscale-0 hover:contrast-100 motion-reduce:transition-none sm:right-0 sm:h-[104%] md:z-[2] md:h-[42vw] lg:h-[min(50svh,31vw)]"
          />
          <div className="relative z-[1] max-w-[50%] sm:max-w-[46%] md:max-w-[440px]">
          <p className="text-[16px] leading-[1.35] md:text-[clamp(18px,1.5vw,22px)]">
            Software engineer working across full-stack development and AWS.
          </p>

          {/* On a phone these sit on the carmine block, so the filled button is
              ink there and bone on the ink ground from `md`. */}
          <div className="mt-6 flex flex-col items-start gap-2.5 md:flex-row md:flex-wrap md:items-center">
            <a href="#contact" onClick={toContact} className="btn border-[1.5px] border-ink bg-ink text-bone md:border-bone md:bg-bone md:text-ink">
              Get in touch
            </a>
            <a href={CV_URL} className="btn border-[1.5px] border-bone/80 text-bone hover:border-bone">
              <Download size={16} aria-hidden="true" />
              Download CV
            </a>
            <span className="flex gap-2.5">
              <a
                href="https://github.com/Alasmawi"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="btn w-12 border-[1.5px] border-bone/80 px-0 text-bone hover:border-bone"
              >
                <GithubMark size={17} />
              </a>
              <a
                href="https://linkedin.com/in/alasmawi"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="btn w-12 border-[1.5px] border-bone/80 px-0 text-bone hover:border-bone"
              >
                <LinkedinMark size={16} />
              </a>
            </span>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
