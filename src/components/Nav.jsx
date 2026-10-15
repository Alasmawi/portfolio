import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { CV_URL, LINKS } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';
import { FRAME, SECTION_PAD } from './ui/SectionHeader';

// A bar across the top, from tablet width up; phones use the dock at the
// bottom, where a thumb is.
//
// Over the cover it has no ground of its own, so the carmine block runs to the
// top edge of the window behind it. Once the page has scrolled it takes the ink
// ground, because from then on it is sitting over body copy.
export default function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => scrollToSection(id);
  const link = (id) => ({
    href: `#${id}`,
    onClick: (e) => {
      e.preventDefault();
      go(id);
    },
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 hidden transition-colors duration-200 md:block ${SECTION_PAD} ${
        scrolled ? 'border-b border-bone/15 bg-ink' : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Primary" className={`${FRAME} label flex h-[60px] items-center gap-6 text-bone`}>
        <a {...link('hero')} className="flex min-h-11 items-center">
          alasmawi.dev
        </a>

        <ul className="ml-auto flex items-center gap-1 lg:gap-3">
          {LINKS.map(({ id, label }) => {
            const on = active === id;
            return (
              <li key={id}>
                <a
                  {...link(id)}
                  aria-current={on ? 'true' : undefined}
                  /* The current section is underlined: the one mark on the bar
                     that changes as the reader scrolls. */
                  className={`flex min-h-11 items-center px-2 underline-offset-[7px] transition-opacity hover:opacity-100 ${
                    on ? 'underline decoration-2 opacity-100' : 'opacity-75'
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
          <li>
            <a {...link('contact')} className={`flex min-h-11 items-center px-2 underline-offset-[7px] hover:opacity-100 ${active === 'contact' ? 'underline decoration-2' : 'opacity-75'}`}>
              Contact
            </a>
          </li>
        </ul>

        <a href={CV_URL} className="flex min-h-9 items-center gap-1.5 border-[1.5px] border-bone/70 px-3 hover:border-bone">
          <Download size={13} aria-hidden="true" />
          CV
        </a>
      </nav>
    </header>
  );
}
