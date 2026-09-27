import useActiveSection from './hooks/useActiveSection';
import { SECTION_IDS } from './data/navLinks';
import Nav from './components/Nav';
import Hero from './components/Hero';
import FocusPillars from './components/FocusPillars';
import ProjectBrowser from './components/ProjectBrowser';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';
import MobileTabBar from './components/ui/MobileTabBar';
import Atmosphere from './components/ui/Atmosphere';

export default function App() {
  // One observer over every section, read by both navigations.
  const active = useActiveSection(SECTION_IDS);

  return (
    <>
      {/* The page's ground light — one fixed layer for the whole document. */}
      <Atmosphere />
      <Nav active={active} />
      {/* Clears the floating dock plus the home indicator on a notched phone;
          the dock isn't rendered at lg and up, so neither is the space. 54px is
          the tab row's height, 12px the dock's padding, and 10px the gap it
          floats above the bottom edge. */}
      <main className="relative z-10 pb-[calc(76px+max(10px,env(safe-area-inset-bottom,0px)))] lg:pb-0">
        <Hero />
        <FocusPillars />
        <ProjectBrowser />
        <Experience />
        <Skills />
        <Education />
        <About />
        <Contact />
      </main>
      <MobileTabBar active={active} />
    </>
  );
}
