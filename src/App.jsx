import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ProjectBrowser from './components/ProjectBrowser';
import Experience from './components/Experience';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';
import Preloader from './components/ui/Preloader';
import useAssetsReady from './hooks/useAssetsReady';
import headshot from './assets/pfp-nobg.webp';

// Marks sections that don't fit the viewport so they get a second, bottom-edge
// snap point (see index.css). Re-evaluated on resize and whenever a section's
// own height changes — the projects panel resizes as it cycles.
function useTallSectionSnapPoints() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main > section'));
    if (sections.length === 0) return undefined;

    const apply = () => {
      sections.forEach((s) => {
        const tall = s.getBoundingClientRect().height > window.innerHeight + 4;
        if (tall) s.setAttribute('data-snap-tall', '');
        else s.removeAttribute('data-snap-tall');
      });
    };

    apply();
    const ro = new ResizeObserver(apply);
    sections.forEach((s) => ro.observe(s));
    window.addEventListener('resize', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
    };
  }, []);
}

const CRITICAL_ASSETS = [headshot];

export default function App() {
  useTallSectionSnapPoints();
  const { ready, progress } = useAssetsReady(CRITICAL_ASSETS);

  return (
    <>
      <Preloader ready={ready} progress={progress} />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <ProjectBrowser />
        <Experience />
        <Education />
        <About />
        <Contact />
      </main>
    </>
  );
}
