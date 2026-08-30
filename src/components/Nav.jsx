import { LINKS } from '../data/navLinks';
import { scrollToSection } from '../lib/scrollToSection';

// On phones this is a title bar and nothing else. It used to carry a hamburger
// that opened a sheet with the same four links plus a contact button — which is
// exactly what the bottom tab bar now shows without a tap to open it. Two
// navigations for four links is one too many, so the sheet is gone.
export default function Nav({ active }) {

  const go = (id) => {
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-base-edge/80 bg-base-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go('hero');
          }}
          className="flex min-h-6 items-center gap-2.5 py-1 font-sans text-sm font-medium text-text-primary"
        >
          <span className="h-2 w-2 rounded-full border border-accent" aria-hidden="true" />
          Abdulla Alasmawi
        </a>

        {/* Desktop link row + CTA */}
        <div className="hidden items-center gap-6 md:flex">
          <ul className="flex items-center gap-6">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  className={`font-sans text-[13px] transition-colors ${
                    active === id ? 'text-accent-bright' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              go('contact');
            }}
            className="btn btn-primary"
          >
            Get in touch
          </a>
        </div>

      </nav>
    </header>
  );
}
