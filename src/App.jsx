import { useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import HeroCloud from './components/HeroCloud';
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

  // Cloud-photo hero is the default. The original is still one URL away with
  // ?hero=v1 while both are kept around for comparison.
  const cloudHero =
    typeof window === 'undefined' ||
    new URLSearchParams(window.location.search).get('hero') !== 'v1';

  // Lets CSS scope the nav's clear-over-clouds treatment to this hero only.
  useEffect(() => {
    if (!cloudHero) return undefined;
    document.documentElement.dataset.hero = 'v2';
    return () => { delete document.documentElement.dataset.hero; };
  }, [cloudHero]);

  return (
    <>
      <CloudCodeRain />
      <Nav />
      <main className="relative z-10">
        {cloudHero ? <HeroCloud /> : <Hero />}
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
