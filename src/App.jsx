import useActiveSection from './hooks/useActiveSection';
import { SECTION_IDS } from './data/navLinks';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ProjectBrowser from './components/ProjectBrowser';
import Experience from './components/Experience';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';
import MobileTabBar from './components/ui/MobileTabBar';

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

  return (
    <>
      <Nav active={active} />
      {/* Clears the fixed bottom tab bar plus the home indicator on a notched
          phone; the bar isn't rendered at md and up, so neither is the space. */}
      <main className="relative z-10 pb-[calc(3.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <Hero />
        <ProjectBrowser />
        <Experience />
        <Education />
        <About />
        <Contact />
      </main>
      <MobileTabBar active={active} />
    </>
  );
}
