import { useEffect, useState } from 'react';

// Tracks which section id is currently "active" (the one crossing a band just
// above the middle of the viewport), shared between the top nav and the phone
// dock so both highlight the same section at the same time.
//
// Call this once, in App, and pass the result down: calling it from each
// navigation would build two observers over the same sections.
//
// Starts as null — nothing is current until the observer has said so — rather
// than guessing a section, which is how the nav used to announce "Projects" as
// current while the reader was still looking at the hero.
export default function useActiveSection(ids) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}
