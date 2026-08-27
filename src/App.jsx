import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ProjectBrowser from './components/ProjectBrowser';
import Experience from './components/Experience';
import Education from './components/Education';
import About from './components/About';
import Contact from './components/Contact';

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

// No loading curtain. The old one held the whole page — scroll locked, clicks
// swallowed — until `document.fonts.ready` and the headshot had settled, with
// an 8s ceiling. It existed to hide a heavy hero photo decoding, and that photo
// is gone: the hero is now a canvas, and the headshot sits in About below the
// fold. Gating first paint on a third-party font host bought nothing and cost
// every visitor on a slow connection a blank screen, so the page just renders.
export default function App() {
  useTallSectionSnapPoints();

  return (
    <>
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
