import { useEffect, useState } from 'react';

// Tracks which section id is currently "active" (i.e. the one the reader is
// looking at), shared between the top nav and the mobile bottom tab bar so
// both highlight the same section at the same time. Pulled out of Nav.jsx
// rather than duplicated — two independent observers on the same sections
// would double the layout thrash for no benefit.
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
