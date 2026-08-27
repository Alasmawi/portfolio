import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LINKS } from '../data/navLinks';
import useActiveSection from '../hooks/useActiveSection';
import { scrollToSection } from '../lib/scrollToSection';

const IDS = LINKS.map((l) => l.id);

export default function Nav() {
  const active = useActiveSection(IDS, 'projects');
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-base-border/80 bg-base-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            go('hero');
          }}
          className="flex items-center gap-2.5 font-sans text-sm font-medium text-text-primary"
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

        {/* Mobile: sheet trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav-sheet"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-11 w-11 place-items-end gap-1.5 border-0 bg-transparent p-0 md:hidden"
        >
          <span
            className={`block h-[1.5px] w-5 bg-text-primary/80 transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`}
          />
          <span
            className={`block h-[1.5px] w-3.5 bg-text-primary/80 transition-all ${open ? 'w-5 -translate-y-[3px] -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-sheet"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-base-border/80 bg-base-bg/95 backdrop-blur md:hidden"
          >
            <ul className="flex flex-col px-6 py-2">
              {LINKS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(id);
                    }}
                    className={`flex min-h-[48px] items-center gap-3 font-sans text-sm transition-colors ${
                      active === id ? 'text-accent-bright' : 'text-text-muted'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              ))}
              <li className="py-3">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    go('contact');
                  }}
                  className="btn btn-primary btn-block"
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
