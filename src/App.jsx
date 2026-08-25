import { useEffect } from 'react';
import Nav from './components/Nav';
import HeroCloud from './components/HeroCloud';
import About from './components/About';
import Experience from './components/Experience';
import ProjectBrowser from './components/ProjectBrowser';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import CloudCodeRain from './components/ui/CloudCodeRain';
import MobileTabBar from './components/ui/MobileTabBar';
import Preloader from './components/ui/Preloader';
import useAssetsReady from './hooks/useAssetsReady';

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

// No first-screen image assets to gate on anymore — the hero is a
// procedural WebGL canvas (see ui/neonCloud.js), not a photo, so there's
// nothing to preload. Kept as an (empty) array rather than removing the
// preloader wiring entirely, since Preloader/useAssetsReady still cover
// the rest of the page's images.
const CRITICAL_ASSETS = [];

export default function App() {
  useTallSectionSnapPoints();
  const { ready, progress } = useAssetsReady(CRITICAL_ASSETS);

  return (
    <>
      <Preloader ready={ready} progress={progress} />
      <CloudCodeRain />
      <Nav />
      <main className="relative z-10 pb-14 md:pb-0">
        <HeroCloud />
        <About />
        <Experience />
        <ProjectBrowser />
        <Skills />
        <Education />
        <Contact />
      </main>
      <MobileTabBar />
    </>
  );
}
