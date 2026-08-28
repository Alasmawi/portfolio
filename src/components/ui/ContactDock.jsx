import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { scrollToSection } from '../../lib/scrollToSection';

// Phone-only: "Get in touch" stays one thumb-tap away for the whole page.
// On desktop the nav is always visible and already carries the CTA, so this
// would be redundant furniture there.
//
// It hides in two places on purpose — over the hero, where the CTA is already
// on screen and the dock would just cover it, and over Contact itself, where
// the form is right there. Anywhere in between, it's up.
export default function ContactDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const contact = document.getElementById('contact');
    if (!hero || !contact) return undefined;

    const state = { hero: true, contact: false };
    const sync = () => setVisible(!state.hero && !state.contact);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target.id === 'hero') state.hero = e.isIntersecting;
          if (e.target.id === 'contact') state.contact = e.isIntersecting;
        });
        sync();
      },
      // A slice of hero still showing counts as "on the hero"; contact counts
      // as reached as soon as any of it appears.
      { threshold: 0.12 }
    );
    io.observe(hero);
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          /* A compact pill, not a full-width bar: it is fixed, so whatever it
             covers mid-scroll is unreadable, and a bar swallowed a whole line
             of body text on every screen. */
          className="fixed bottom-0 right-0 z-40 pb-[max(0.9rem,env(safe-area-inset-bottom))] pr-4 md:hidden"
        >
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="flex min-h-[48px] items-center gap-2 rounded-full border border-accent/60 bg-[#1b1d2e]/95 pl-4 pr-3.5 font-sans text-[14.5px] font-medium text-accent-bright shadow-[0_0_0_1px_rgba(15,17,28,.7),0_10px_28px_-8px_rgba(0,0,0,.9),0_0_22px_-8px_rgba(145,132,217,.75)] backdrop-blur-md"
          >
            <Mail size={15} aria-hidden="true" />
            Get in touch
            <ArrowUpRight size={14} aria-hidden="true" className="opacity-70" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
