import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeadshotCloud from './ui/HeadshotCloud';
import SharpHorizon from './ui/SharpHorizon';
import StatusBadge from './ui/StatusBadge';
import useTypingEffect from '../hooks/useTypingEffect';
import useScrollDim from '../hooks/useScrollDim';
import hero2000 from '../assets/hero/hero-2000.webp';
import hero1200 from '../assets/hero/hero-1200.webp';
import hero700 from '../assets/hero/hero-700.webp';
import './HeroCloud.css';

const ROLES = ['Cloud Architect', 'IoT Systems', 'Backend Engineer'];

// Alternate hero: opens above the cloud deck and descends into the dark stack.
// The photo is masked out toward the bottom rather than covered, so the page's
// own gradient takes over and the seam into #about disappears. The angular
// ridge that used to sit at the top of the hero is flipped to the bottom, where
// it reads as the line where the sky ends and the machine begins.
// `start` gates the sky's entrance on the loading curtain lifting. Without it
// the 2.2s settle would run while the overlay still covers the page, and the
// photo would simply be *there* when the curtain went up. Defaults to true so
// the component still animates on its own if rendered without a loader.
export default function HeroCloud({ start = true }) {
  const typed = useTypingEffect(ROLES);
  useScrollDim();

  // No bottom border here, unlike the original hero: the descent should read as
  // continuous, and a 1px rule across it is exactly the seam we're hiding.
  return (
    <section
      id="hero"
      data-snap-firm
      className="relative flex min-h-screen min-h-[100dvh] items-center overflow-hidden pt-24"
    >
      <div className="hero-sky" aria-hidden="true">
        <motion.img
          src={hero2000}
          srcSet={`${hero700} 700w, ${hero1200} 1200w, ${hero2000} 2000w`}
          sizes="100vw"
          alt=""
          className="hero-sky__img"
          initial={{ scale: 1.07, opacity: 0 }}
          animate={start ? { scale: 1, opacity: 1 } : { scale: 1.07, opacity: 0 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          fetchPriority="high"
        />
        <div className="hero-sky__scrim" />
        <div className="hero-sky__side" />
        {/* Driven by --scroll-dim: the sky darkens as you descend out of it. */}
        <div className="hero-sky__dim" />
      </div>

      {/* Sky above, circuit below. Two elements on purpose: the inner one is
          rotated so the ridge points up, the outer one carries the fade —
          a mask on the rotated element would be upside down too, which is
          what put a hard dark band on the hero's bottom edge. */}
      <div className="hero-ridge" aria-hidden="true">
        <div className="hero-ridge__flip">
          <SharpHorizon />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 md:hidden"
          >
            <HeadshotCloud />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 font-mono text-xs uppercase tracking-wider text-amber"
          >
            [ whoami ]
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hero-title text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Abdulla Alasmawi
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-4 flex h-8 items-center font-mono text-lg text-steel-bright sm:text-xl"
          >
            <span>{typed}</span>
            <span className="ml-1 h-5 w-[2px] animate-blink bg-steel-bright" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg"
          >
            Backend engineer working in cloud, IoT, and applied AI. Mostly AWS,
            Go, and Python.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://github.com/Alasmawi"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="group flex items-center gap-2 rounded border border-base-border bg-base-surface/80 px-4 py-2.5 backdrop-blur transition-all hover:border-amber hover:shadow-glow-amber"
            >
              <GithubMark size={18} className="text-text-primary" />
              <span className="font-mono text-sm text-text-primary">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/alasmawi"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="group flex items-center gap-2 rounded border border-base-border bg-base-surface/80 px-4 py-2.5 backdrop-blur transition-all hover:border-steel hover:shadow-glow-steel"
            >
              <LinkedinMark size={18} className="text-text-primary" />
              <span className="font-mono text-sm text-text-primary">LinkedIn</span>
            </a>

            <div className="ml-0 sm:ml-2">
              <StatusBadge />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="hidden md:col-span-4 md:flex md:flex-col md:justify-end md:gap-4"
        >
          <HeadshotCloud />

          {[
            { k: 'location', v: 'Manama, Bahrain' },
            { k: 'focus', v: 'Cloud / IoT / Backend' },
            { k: 'status', v: 'accepting new roles' },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-center justify-between pb-2 font-mono text-xs backdrop-blur-[2px]"
            >
              <span className="text-text-dim">{row.k}</span>
              <span className="text-text-muted">{row.v}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-dim transition-colors hover:text-amber"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          descend
        </span>
        <ArrowDown size={14} className="animate-pulse-slow" />
      </motion.a>
    </section>
  );
}
