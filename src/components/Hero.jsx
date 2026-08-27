import { motion } from 'framer-motion';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeroCloudCanvas from './ui/HeroCloudCanvas';
import SyntaxRain from './ui/SyntaxRain';

const RAIN_FADE = [{ x1: 0.02, y1: 0.16, x2: 0.92, y2: 0.94, a: 0.26 }];
const RAIN_EXCLUDE = [{ x1: 0, y1: 0, x2: 1, y2: 0.1 }];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen min-h-[100dvh] overflow-hidden bg-void pt-16"
    >
      <SyntaxRain size={14} density={0.68} dim tint="145,132,217" fade={RAIN_FADE} exclude={RAIN_EXCLUDE} />

      {/* On a phone the cloud is a band across the top of the screen and the
          copy starts underneath it. It used to sit at w-420 / right-[-120],
          which at 390px put its left edge at x=90 — straight through the
          kicker. Desktop keeps it as a full-height column on the right. */}
      <div className="pointer-events-none absolute right-[-70px] top-[-30px] h-[255px] w-[320px] sm:right-[-60px] sm:top-0 sm:h-full sm:w-[560px] md:right-[-60px] md:w-[720px]">
        <HeroCloudCanvas />
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 54% at 20% 48%, rgba(15,17,28,.9), rgba(15,17,28,.35) 62%, rgba(15,17,28,0) 78%)',
        }}
      />

      {/* Phone: copy starts below the cloud band, status pinned to the bottom
          by mt-auto. `justify-between` here used to open a ~250px hole in the
          middle of the phone hero, since the column is a full viewport tall
          and only had two children to space apart. */}
      <div className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl flex-col px-6 pb-7 pt-[182px] sm:justify-between sm:px-10 sm:pt-6 md:px-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl"
          style={{ textShadow: '0 1px 18px rgba(15,17,28,.9)' }}
        >
          {/* Wraps to two lines on a phone, where the cloud canvas comes down
              into the top-right corner and a single line would run under it. */}
          <p className="mb-5 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-text-muted">
            Computer science, cloud, full-stack
            <span className="hidden sm:inline"> — </span>
            <span className="block sm:inline">Manama</span>
          </p>
          <h1 className="text-5xl font-medium leading-[1] tracking-tight text-text-primary sm:text-6xl lg:text-[64px]">
            Abdulla Alasmawi
          </h1>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-text-primary/85 sm:text-xl">
            I build full-stack systems on AWS, and I understand them the whole way down — schema,
            API, front end, and the fundamentals underneath.
          </p>
          <p className="mt-4 max-w-[42ch] border-l-2 border-accent py-0.5 pl-3.5 text-base leading-snug text-text-primary sm:text-[17px]">
            Built the AWS backend for a Ministry of Interior K9 monitoring system.
          </p>

          {/* Phone: full-width CTA with the two socials split evenly beneath,
              rather than a flex-wrap that left LinkedIn stranded on its own
              row. Desktop keeps all three inline. */}
          <div className="mt-8 grid gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:gap-3" style={{ textShadow: 'none' }}>
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
          <div className="flex flex-col gap-1.5 font-mono text-xs text-text-muted sm:flex-row sm:items-center sm:gap-8">
            <span className="inline-flex items-center gap-2 text-accent-bright">
              <span className="h-[5px] w-[5px] animate-pulse-slow rounded-full bg-accent" />
              Available for work
            </span>
            <span>K9 Pavlov · deployed</span>
            <span className="hidden sm:inline">UTC+3</span>
          </div>
          <span className="hidden font-mono text-[11.5px] uppercase tracking-[0.14em] text-text-muted md:inline">
            scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
