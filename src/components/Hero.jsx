import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import CloudHorizon from './ui/CloudHorizon';
import HeadshotSlot from './ui/HeadshotSlot';
import NetworkBackground from './ui/NetworkBackground';
import SkyDrift from './ui/SkyDrift';
import StatusBadge from './ui/StatusBadge';
import useTypingEffect from '../hooks/useTypingEffect';

const ROLES = ['Cloud Architect', 'IoT Systems', 'Backend Engineer'];

export default function Hero() {
  const typed = useTypingEffect(ROLES);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-base-border pt-24"
    >
      <CloudHorizon />
      <NetworkBackground />
      <SkyDrift />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 font-mono text-xs uppercase tracking-wider text-amber"
          >
            [ whoami ]
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
          >
            Abdulla Alasmawi
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 flex h-8 items-center font-mono text-lg text-steel-bright sm:text-xl"
          >
            <span>{typed}</span>
            <span className="ml-1 h-5 w-[2px] animate-blink bg-steel-bright" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg"
          >
            Backend engineer working in cloud, IoT, and applied AI. Mostly AWS,
            Go, and Python.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="https://github.com/Alasmawi"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="group flex items-center gap-2 rounded border border-base-border bg-base-surface px-4 py-2.5 transition-all hover:border-amber hover:shadow-glow-amber"
            >
              <GithubMark size={18} className="text-text-primary" />
              <span className="font-mono text-sm text-text-primary">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/alasmawi"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="group flex items-center gap-2 rounded border border-base-border bg-base-surface px-4 py-2.5 transition-all hover:border-steel hover:shadow-glow-steel"
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden md:col-span-4 md:flex md:flex-col md:justify-end md:gap-4"
        >
          <HeadshotSlot />

          {[
            { k: 'location', v: 'Manama, Bahrain' },
            { k: 'focus', v: 'Cloud / IoT / Backend' },
            { k: 'status', v: 'accepting new roles' },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-center justify-between border-b border-base-border/70 pb-2 font-mono text-xs"
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
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-text-dim transition-colors hover:text-amber"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">
          scroll
        </span>
        <ArrowDown size={14} className="animate-pulse-slow" />
      </motion.a>
    </section>
  );
}
