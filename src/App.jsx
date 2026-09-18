import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import useActiveSection from './hooks/useActiveSection';
import { SECTION_IDS } from './data/navLinks';
import Nav from './components/Nav';
import Hero from './components/Hero';
import FocusPillars from './components/FocusPillars';
import ProjectBrowser from './components/ProjectBrowser';
import Experience from './components/Experience';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';
import MobileTabBar from './components/ui/MobileTabBar';
import Atmosphere from './components/ui/Atmosphere';
import { startGlassPointer } from './lib/glassPointer';

// No loading curtain. The old one held the whole page — scroll locked, clicks
// swallowed — until `document.fonts.ready` and the headshot had settled, with
// an 8s ceiling. It existed to hide a heavy hero photo decoding, and that photo
// is gone: the hero is now a canvas, and the headshot sits in About below the
// fold. Gating first paint on a third-party font host bought nothing and cost
// every visitor on a slow connection a blank screen, so the page just renders.
export default function App() {
  // One observer over the sections, read by both navigations. The hook's own
  // comment said it was pulled out of Nav so the top bar and the bottom tab bar
  // wouldn't run two of them — but calling it in each component is exactly two
  // of them, over the same six sections, on every scroll. The union of both id
  // lists is observed once here and the answer handed down.
  const active = useActiveSection(SECTION_IDS, 'projects');

  // The pointer's reflection on the glass. One delegated listener for every
  // control on the page — see lib/glassPointer.js for why it lives here rather
  // than in each control.
  useEffect(startGlassPointer, []);

  return (
    /* reducedMotion="user" is the global switch for everything Framer animates:
       the section reveals, the two navigations' sliding highlight, the modal.
       Each of those used to be responsible for reading the preference itself,
       which meant the ones that didn't simply ignored it — the nav highlight
       and the modal both animated regardless. Framer drops transform and layout
       animations under it and keeps opacity, which is the right split: a fade
       is not what motion sensitivity is about. The CSS-driven effects — the
       orbs, the specular sweep, the status blips — carry their own
       prefers-reduced-motion blocks in index.css. */
    <MotionConfig reducedMotion="user">
      {/* The page's ground light — one fixed layer for the whole document
          rather than a set of blurred orbs per section. */}
      <Atmosphere />
      <Nav active={active} />
      {/* Clears the floating dock plus the home indicator on a notched phone;
          the dock isn't rendered at md and up, so neither is the space. 54px is
          the tab row's own height (MobileTabBar's min-h-[54px]), 12px the
          dock's internal padding, and 10px the gap it floats above the bottom
          edge — the same max(10px, safe-area) the dock itself sits on. */}
      <main className="relative z-10 pb-[calc(76px+max(10px,env(safe-area-inset-bottom,0px)))] md:pb-0">
        <Hero />
        <FocusPillars />
        <ProjectBrowser />
        <Experience />
        <Education />
        <About />
        <Contact />
      </main>
      <MobileTabBar active={active} />
    </MotionConfig>
  );
}
