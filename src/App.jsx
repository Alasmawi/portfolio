import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import ProjectBrowser from './components/ProjectBrowser';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import CloudCodeRain from './components/ui/CloudCodeRain';


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

export default function App() {
  useTallSectionSnapPoints();

  return (
    <>
      <CloudCodeRain />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <ProjectBrowser />
        <Skills />
        <Education />
        <Contact />
      </main>
    </>
  );
}
