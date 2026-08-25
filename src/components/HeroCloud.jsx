import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import NeonCloudCanvas from './ui/NeonCloudCanvas';
import StatusBadge from './ui/StatusBadge';
import useTypingEffect from '../hooks/useTypingEffect';

const ROLES = ['Cloud Computing', 'AI Systems', 'Full-Stack Development'];

// Hero centerpiece is a procedurally generated neon cloud (see
// ui/neonCloud.js) — no mesh file, built from metaball-style ring math at
// runtime. Replaces an earlier sky-photo hero and, before that, an
// unshippable 114MB/776k-triangle OBJ export of the same creative idea.
export default function HeroCloud() {
  const typed = useTypingEffect(ROLES);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen min-h-[100dvh] items-center overflow-hidden pt-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-7">
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
            className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
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
            Computer Science graduate building cloud infrastructure, applied
            AI features, and full-stack systems end to end — mostly AWS, Go,
            and Python.
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

        {/* The neon cloud stage. Order-first on mobile (sits above the
            copy), a tall right-hand column on desktop — same shape as the
            reference implementation's grid, adapted to the site's
            existing 12-column convention instead of its own CSS grid. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="order-first h-[46vh] min-h-[280px] md:order-none md:col-span-5 md:h-[min(70vh,640px)]"
        >
          <NeonCloudCanvas />
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-text-dim transition-colors hover:text-amber md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          descend
        </span>
        <ArrowDown size={14} className="animate-pulse-slow" />
      </motion.a>
    </section>
  );
}
