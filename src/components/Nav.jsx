import { LINKS } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';

// A floating pill rather than a full-width bar. The bar was a band of page
// ground with a blur behind it, which on a page whose whole surface is now
// glass read as a seam across the top; a pill is an object sitting on the page,
// which is what the rest of the furniture is.
//
// On phones it carries the wordmark and the status only. The four section links
// are in the dock at the bottom, where a thumb is — a second copy of them here
// would be the same four links twice on a 390px screen.
export default function Nav({ active }) {
  const go = (id) => {
    scrollToSection(id);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(14px,env(safe-area-inset-top,0px))] sm:pt-[22px]">
      <nav
        className="glass-control pointer-events-auto flex max-w-full items-center gap-3 rounded-full py-0 pl-4 pr-1.5 sm:gap-5 sm:pl-[22px] sm:pr-[9px]"
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

        <div className="hidden h-[22px] w-px bg-white/20 md:block" aria-hidden="true" />

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                go(id);
              }}
              aria-current={active === id ? 'true' : undefined}
              className={`flex min-h-11 items-center rounded-full px-3.5 text-[13.5px] transition-colors ${
                active === id
                  ? 'text-text-primary'
                  : 'text-text-primary/70 hover:text-text-primary'
              }`}
              // The selected link is a lit facet of the same glass rather than
              // a differently coloured chip: a white wash plus the same top
              // stroke the pill itself carries.
              style={
                active === id
                  ? {
                      background: 'rgba(255,255,255,.18)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)',
                    }
                  : undefined
              }
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            go('contact');
          }}
          /* Glass, not a second fill. The hero's "Get in touch" is on screen
             at the same time as this, and two saturated fills in two different
             colours, both meaning the same thing in different words, is the
             loudest thing on a first view. One filled button per screen; this
             is the secondary instance of the same action, so it takes the
             secondary treatment and the same label. */
          className="btn btn-ghost glass-control min-h-[40px] px-4 text-[13.5px] sm:min-h-[42px] sm:px-[22px] sm:text-sm"
        >
          Get in touch
        </a>
      </nav>
    </header>
  );
}
