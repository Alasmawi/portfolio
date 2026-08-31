import { motion } from 'framer-motion';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeroCloudCanvas from './ui/HeroCloudCanvas';
import SyntaxRain from './ui/SyntaxRain';

const RAIN_FADE = [{ x1: 0.02, y1: 0.16, x2: 0.92, y2: 0.94, a: 0.26 }];
const RAIN_EXCLUDE = [{ x1: 0, y1: 0, x2: 1, y2: 0.1 }];

export default function Hero() {
  // svh, not dvh. dvh tracks the URL bar collapsing as you scroll, so the hero
  // grew ~60px under the reader's thumb on the first flick of every visit — and
  // that resize is what used to restart the rain. svh is pinned to the
  // expanded-bar state, so the height is settled before first paint and never
  // moves again.
  return (
    <section
      id="hero"
      className="relative min-h-[88svh] overflow-hidden bg-void pt-16 sm:min-h-screen sm:min-h-[100svh]"
    >
      <SyntaxRain size={14} density={0.68} dim tint="145,132,217" fade={RAIN_FADE} exclude={RAIN_EXCLUDE} />

      {/* The cloud is the hero's only image and the one thing here with any
          character, so on a phone it gets room rather than a sliver — most of
          it used to hang off the right edge at 70% opacity, which is a lot of
          machinery to render something you can barely see.

          Below the copy, not behind it. Cutting the hero's text freed the
          bottom half of the screen, and putting the cloud there gives it a
          whole area of its own instead of a fight with the headline: text
          reads top-down, then the cloud, then the status line. */}
      <div
        data-cloud
        className="pointer-events-none absolute bottom-[9%] right-[-16px] h-[38%] w-[340px] sm:inset-y-0 sm:bottom-auto sm:right-[-60px] sm:top-0 sm:h-full sm:w-[560px] md:right-[-60px] md:w-[720px]"
      >
        <HeroCloudCanvas />
      </div>

      {/* Biased left, so it carries the headline without washing out the cloud
          on the right. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 46% at 20% 30%, rgba(15,17,28,.92), rgba(15,17,28,.45) 58%, rgba(15,17,28,0) 82%)',
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(88svh-4rem)] max-w-6xl flex-col px-5 pb-7 pt-8 sm:min-h-[calc(100svh-4rem)] sm:justify-between sm:px-10 sm:pt-6 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl"
          style={{ textShadow: '0 1px 18px rgba(15,17,28,.9)' }}
        >
          {/* On a phone: name, one line about the work, two ways to act on it.
              That is the whole hero.

              It used to also carry an eyebrow ("Computer science, cloud,
              full-stack — Manama"), a deployment status and a timezone, all
              competing on a 390px column and all repeating what the sections
              below say properly — the K9 system is the first project in the
              list, and Manama and the timezone are in the footer. The eyebrow
              is gone at every width: it was three nouns in a row standing in
              for a sentence.

              The K9 line comes back from `sm` up, where there is room for the
              proof as well as the claim, and where the cloud is not sharing
              the column with it. */}
          <h1 className="text-[44px] font-medium leading-[1.02] tracking-tight text-text-primary sm:text-6xl lg:text-[64px]">
            Abdulla Alasmawi
          </h1>
          <p className="mt-5 max-w-[38ch] text-lg leading-relaxed text-text-primary/85 sm:text-xl">
            I build full-stack systems on AWS — and understand them the whole way down.
          </p>
          <p className="mt-4 hidden max-w-[42ch] border-l-2 border-accent py-0.5 pl-3.5 text-base leading-snug text-text-primary sm:block sm:text-[17px]">
            Built the AWS backend for a Ministry of Interior K9 monitoring system.
          </p>

          <div className="mt-9 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3" style={{ textShadow: 'none' }}>
            <a href="#contact" className="btn btn-primary min-h-[48px] px-6 text-[15px] shadow-glow-accent sm:min-h-[46px]">
              Get in touch
            </a>
            <div className="grid grid-cols-2 gap-2.5 sm:contents">
              <a
                href="https://github.com/Alasmawi"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost min-h-[48px] sm:min-h-[46px]"
              >
                <GithubMark size={16} />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/alasmawi"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost min-h-[48px] sm:min-h-[46px]"
              >
                <LinkedinMark size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-auto flex items-end justify-between gap-4 pt-7 sm:pt-10"
        >
          <span className="inline-flex items-center gap-2 font-mono text-xs text-accent-bright">
            <span className="h-[5px] w-[5px] animate-pulse-slow rounded-full bg-accent" />
            Available for work
          </span>
          <span className="hidden font-mono text-[11.5px] uppercase tracking-[0.14em] text-text-muted md:inline">
            scroll
          </span>
        </motion.div>
      </div>

      {/* The hero's ground is `void` and every section below it is `base.bg`, so
          the two met as a hard horizontal line with the rain sliced off
          mid-drop. This dissolves the last 120px into the next section's ground
          so the page reads as one surface rather than stacked slides. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
        style={{ background: 'linear-gradient(180deg, rgba(22,24,38,0) 0%, #161826 100%)' }}
      />
    </section>
  );
}
