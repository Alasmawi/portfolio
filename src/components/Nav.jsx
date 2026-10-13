import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { CV_URL, LINKS } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';
import { FRAME, SECTION_PAD } from './ui/SectionHeader';

// A bar across the top, from tablet width up. It was a floating pill: an
// object hovering over the content, which on a phone carried only the wordmark
// and a CV link, both of which the hero and the dock already offer. So phones
// get no top bar at all — the dock at the bottom, where a thumb is, is the
// navigation — and wider screens get a plain bar on the content's own edges.
export default function Nav({ active }) {
  const go = (id) => scrollToSection(id);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 hidden border-b border-white/[0.08] bg-base-bg/80 backdrop-blur-md md:block ${SECTION_PAD}`}
    >
      <nav aria-label="Primary" className={`${FRAME} flex h-[60px] items-center gap-4 lg:gap-6`}>
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go('hero');
          }}
          className="flex min-h-11 shrink-0 items-center gap-2.5 text-sm font-medium text-text-primary"
        >
          {/* The wordmark's dot is the site's one gradient bead — rose into
              amber, the two accents in the order the page uses them. */}
          <span
            aria-hidden="true"
            className="h-[9px] w-[9px] shrink-0 rounded-full"
            style={{ background: 'linear-gradient(135deg, #fbd7a4, #e2607e)' }}
          />
          alasmawi.dev
        </a>

        <ul className="ml-auto flex items-center gap-0.5">
          {LINKS.map(({ id, label }) => {
            const on = active === id;
            return (
              <li key={id} className="relative">
                {/* The selected link is a quiet white wash, and it slides from
                    link to link as the reader scrolls rather than blinking
                    between them. */}
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-0 inset-y-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,.1)' }}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    aria-hidden="true"
                  />
                )}
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  aria-current={on ? 'true' : undefined}
                  className={`relative flex min-h-11 items-center rounded-full px-3 text-[13.5px] transition-colors lg:px-3.5 ${
                    on ? 'text-text-primary' : 'text-text-primary/70 hover:text-text-primary'
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={CV_URL}
            download
            className="btn btn-ghost min-h-10 gap-1.5 px-3 text-[13.5px] text-text-primary/85 hover:text-text-primary"
          >
            <Download size={14} aria-hidden="true" />
            CV
          </a>
          {/* Not a second fill: the hero's filled "Get in touch" is on screen
              at the same time, and one filled button per screen keeps the
              primary action the loudest thing on it. */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go('contact');
            }}
            className="btn btn-ghost glass-control min-h-10 px-[18px] text-[13.5px]"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
