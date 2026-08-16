import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Threads from './ui/Threads/Threads';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import HeadshotCloud from './ui/HeadshotCloud';
import StatusBadge from './ui/StatusBadge';

const HEADLINE = 'Abdulla Alasmawi';

// Per-character stagger reveal. Framer Motion rather than GSAP SplitText —
// the site already depends on framer-motion everywhere else, so this gets
// the same "grab attention on load" effect without a second animation
// library to load and keep in sync.
function RevealHeadline() {
  return (
    <h1 className="text-5xl font-extrabold tracking-tight text-text-primary sm:text-6xl md:text-7xl">
      {HEADLINE.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.025,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h1>
  );
}

export default function HeroBits() {
  const sceneRef = useRef(null);
  const contentRef = useRef(null);

  // Real 3D tilt via perspective + rotateX/rotateY, tracking pointer
  // position — not a shadow trick. Works from both mouse and touch since
  // pointer events unify the two; a static device just never fires it,
  // which is the correct fallback rather than forcing a gyroscope
  // permission prompt for a decorative effect.
  function handlePointerMove(e) {
    const rect = sceneRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    contentRef.current.style.transform = `rotateX(${py * -6}deg) rotateY(${px * 6}deg)`;
  }
  function handlePointerLeave() {
    if (contentRef.current) {
      contentRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen min-h-[100dvh] items-center overflow-hidden bg-base-bg pt-24"
    >
      {/* Warm gold threads, not blue — the site's own accent color driving
          the WebGL shader instead of an off-the-shelf demo color. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Threads color={[0.95, 0.66, 0.23]} amplitude={1.4} distance={0.25} enableMouseInteraction />
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-base-bg" aria-hidden="true" />

      <div
        ref={sceneRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{ perspective: '1200px' }}
        className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8"
      >
        <div
          ref={contentRef}
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
          className="md:col-span-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 flex justify-end md:hidden"
          >
            <HeadshotCloud className="w-[170px] sm:w-[200px]" />
          </motion.div>

          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-amber">
            [ whoami ]
          </p>

          <RevealHeadline />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-text-muted sm:text-lg"
          >
            I build the cloud infrastructure underneath a product and the
            full-stack systems on top of it — the same person shipping the
            AWS backend and the interface that talks to it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="https://github.com/Alasmawi"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded border border-base-border bg-base-surface px-4 py-2.5 font-mono text-sm text-text-primary transition-colors hover:border-amber/50 hover:text-amber"
            >
              <GithubMark size={16} /> GitHub
            </a>
            <a
              href="https://linkedin.com/in/alasmawi"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded border border-base-border bg-base-surface px-4 py-2.5 font-mono text-sm text-text-primary transition-colors hover:border-amber/50 hover:text-amber"
            >
              <LinkedinMark size={16} /> LinkedIn
            </a>
            <StatusBadge />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden items-center justify-center md:col-span-4 md:flex"
        >
          <HeadshotCloud className="w-full max-w-[280px]" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-center md:block"
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">
          descend
        </p>
        <ArrowDown size={16} className="mx-auto mt-1 animate-bounce text-text-dim" />
      </motion.div>
    </section>
  );
}
