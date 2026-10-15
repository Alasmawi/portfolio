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

export default function App() {
  // One observer over every section, read by both navigations.
  const active = useActiveSection(SECTION_IDS);

  return (
    <>
      <Nav active={active} />
      {/* Clears the bottom bar plus the home indicator on a notched phone; the
          bar isn't rendered at md and up, so neither is the space. */}
      <main className="relative pb-[calc(58px+env(safe-area-inset-bottom,0px))] md:pb-0">
        <Hero />
        <FocusPillars />
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
