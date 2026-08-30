import { useEffect, useState } from 'react';

// Tracks which section id is currently "active" (i.e. the one the reader is
// looking at), shared between the top nav and the mobile bottom tab bar so
// both highlight the same section at the same time.
//
// Call this once, in App, and pass the result down. Extracting the hook was
// never enough on its own: calling it from Nav and again from MobileTabBar
// built two IntersectionObservers over the same sections, which is the exact
// duplication it exists to avoid.
export default function useActiveSection(ids, initial = ids[0]) {
  const [active, setActive] = useState(initial);

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
