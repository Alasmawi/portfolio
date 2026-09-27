import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { CV_URL, LINKS } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';

// A floating pill rather than a full-width bar: an object sitting on the page,
// like the rest of the furniture.
//
// The section links appear from `lg` up. Below that the dock at the bottom of
// the screen carries them, where a thumb is — and at tablet widths five links,
// the wordmark and two buttons did not fit in one pill without crushing it.
// What stays in the pill everywhere is the wordmark and the CV, which is the one
// thing a recruiter on a phone came for.
export default function Nav({ active }) {
  const go = (id) => scrollToSection(id);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(14px,env(safe-area-inset-top,0px))] sm:pt-[22px]">
      <nav
        aria-label="Primary"
        className="glass-control pointer-events-auto flex max-w-full items-center gap-3 rounded-full py-0 pl-4 pr-1.5 sm:gap-4 sm:pl-[22px] sm:pr-[7px]"
        style={{ minHeight: 52 }}
      >
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go('hero');
          }}
          className="flex min-h-11 items-center gap-2.5 text-sm font-medium text-text-primary"
        >
          {/* The wordmark's dot is the site's one gradient bead — rose into
              amber, the two accents in the order the page uses them. */}
          <span
            aria-hidden="true"
            className="h-[9px] w-[9px] shrink-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #fbd7a4, #e2607e)',
              boxShadow: '0 0 10px rgba(226,96,126,.85), inset 0 1px 1px rgba(255,255,255,.7)',
            }}
          />
          alasmawi.dev
        </a>

        <div className="hidden h-[22px] w-px bg-white/20 lg:block" aria-hidden="true" />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map(({ id, label }) => {
            const on = active === id;
            return (
              <li key={id} className="relative">
                {/* The selected link is a lit facet of the same glass, and it
                    slides from link to link as the reader scrolls rather than
                    blinking between them. */}
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,.16)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.45)',
                    }}
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
                  className={`relative flex min-h-11 items-center rounded-full px-3.5 text-[13.5px] transition-colors ${
                    on ? 'text-text-primary' : 'text-text-primary/70 hover:text-text-primary'
                  }`}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <a
            href={CV_URL}
            download
            className="btn btn-ghost min-h-[40px] gap-1.5 px-3.5 text-[13.5px] text-text-primary/85 hover:text-text-primary sm:min-h-[42px]"
          >
            <Download size={14} aria-hidden="true" />
            CV
          </a>
          {/* Glass, not a second fill: the hero's filled "Get in touch" is on
              screen at the same time, and one filled button per screen keeps
              the primary action the loudest thing on it. Phones reach Contact
              from the dock, so the pill leaves it out there. */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go('contact');
            }}
            className="btn btn-ghost glass-control hidden min-h-[42px] px-[22px] text-sm lg:inline-flex"
          >
            Get in touch
          </a>
        </div>
      </nav>
    </header>
  );
}
