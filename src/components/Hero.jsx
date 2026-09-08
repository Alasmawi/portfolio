import { motion } from 'framer-motion';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeroCloudCanvas from './ui/HeroCloudCanvas';

export default function Hero() {
  // svh, not dvh. dvh tracks the URL bar collapsing as you scroll, so the hero
  // grew ~60px under the reader's thumb on the first flick of every visit. svh
  // is pinned to the expanded-bar state, so the height is settled before first
  // paint and never moves again.
  //
  // No ground of its own, and no code rain. Both are gone with the repaint: the
  // hero used to be a `void` slab with a canvas of falling glyphs on it, faded
  // into the next section by a 120px gradient — a second ground, a per-frame
  // canvas, and a seam to hide. The atmosphere layer behind the whole document
  // does that job now for the whole page at once, so the hero is just content
  // on the page's own surface.
  return (
    <section
      id="hero"
      className="relative px-5 pb-12 pt-[104px] sm:px-10 sm:pb-16 sm:pt-[128px] md:min-h-[86svh] md:px-14 md:pt-[140px]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-9 md:grid-cols-[1fr_minmax(320px,470px)] md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ textShadow: '0 2px 34px rgba(23,18,26,.75)' }}
        >
          {/* On a phone: name, one line about the work, two ways to act on it.
              That is the whole hero. The K9 line comes back from `sm` up, where
              there is room for the proof as well as the claim. */}
          <h1 className="text-[46px] font-medium leading-[0.98] tracking-[-0.035em] text-text-primary sm:text-6xl lg:text-[72px]">
            Abdulla
            <br />
            Alasmawi
          </h1>
          <p className="mt-5 max-w-[34ch] text-lg leading-[1.45] text-text-primary/86 sm:text-xl">
            I build full-stack systems on AWS — and understand them the whole way down.
          </p>
          <p className="mt-4 hidden max-w-[42ch] border-l-2 border-accent py-0.5 pl-3.5 text-base leading-snug text-text-primary sm:block sm:text-[17px]">
            Built the AWS backend for a Ministry of Interior K9 monitoring system.
          </p>

          <div
            className="mt-8 grid gap-2.5 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-3"
            style={{ textShadow: 'none' }}
          >
            <a href="#contact" className="btn btn-primary min-h-[50px] px-6 text-[15px]">
              Get in touch
            </a>
            <div className="grid grid-cols-2 gap-2.5 sm:contents">
              <a
                href="https://github.com/Alasmawi"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost glass-control min-h-[50px]"
              >
                <span className="flex items-center gap-2">
                  <GithubMark size={16} />
                  GitHub
                </span>
              </a>
              <a
                href="https://linkedin.com/in/alasmawi"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost glass-control min-h-[50px]"
              >
                <span className="flex items-center gap-2">
                  <LinkedinMark size={16} />
                  LinkedIn
                </span>
              </a>
            </div>
          </div>

          <div
            className="mt-7 flex flex-wrap items-center gap-4 sm:mt-8"
            style={{ textShadow: 'none' }}
          >
            {/* Teal is the only cool colour left on the page and it is spent
                entirely on this: the dot that says the status line is live
                rather than printed. */}
            <span className="glass-control inline-flex items-center gap-2.5 rounded-full px-[18px] py-[11px]">
              <span className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-primary">
                <span
                  className="signal-blip h-[7px] w-[7px] rounded-full bg-signal"
                  style={{ boxShadow: '0 0 10px rgba(79,209,197,.9)' }}
                  aria-hidden="true"
                />
                Available for work
              </span>
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
              Manama · Bahrain
            </span>
          </div>
        </motion.div>

        {/* The cloud, in a pane of its own rather than bled across the whole
            hero. A flat pane, not a liquid one: the rule is that a heavy rim
            fights the figure it contains, and this pane contains the one figure
            the hero has. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="glass-pane relative h-[260px] overflow-hidden rounded-[28px] sm:h-[340px] md:h-[430px]"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 20%, rgba(224,122,154,.16), rgba(224,122,154,0) 70%)',
            }}
            aria-hidden="true"
          />
          {/* data-cloud is what scripts/make-cloud-poster.mjs shoots: it hides
              everything in the hero except this box, so the still is the object
              on transparency at exactly the framing the pane gives it. */}
          <div data-cloud className="absolute inset-0">
            <HeroCloudCanvas />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
