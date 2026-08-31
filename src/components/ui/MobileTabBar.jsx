import { Mail } from 'lucide-react';
import { LINKS } from '../../data/navLinks';
import { scrollToSection } from '../../lib/scrollToSection';

// Phone-only bottom navigation. On desktop the top nav is always visible and
// already carries these links, so this would be duplicate furniture there.
//
// Contact is the fifth tab rather than a separate floating pill. The pill it
// replaces was fixed to the bottom-right corner — exactly where this bar now
// is — and two fixed layers in one corner is the obvious failure mode: they
// stack, they cover each other, and together they took ~14% of an 844px screen
// permanently. As a tab it is also *more* available than the pill was: the pill
// deliberately hid over the hero and over Contact itself, so "always one tap
// away" had two holes in it. This has none.
const TABS = [...LINKS, { id: 'contact', label: 'Contact', icon: Mail, cta: true }];

export default function MobileTabBar({ active }) {

  return (
    <nav
      aria-label="Sections"
      /* Opaque, not bg-base-bg/95 with a blur behind it. Translucent, it took
         its tint from whatever was under it — over the hero, whose ground is
         the darker `void`, it read as a foreign lighter slab floating above the
         page rather than the page's own bottom edge. The hero now fades into
         base.bg before it reaches here, so a solid bar meets a matching
         ground everywhere on the page. */
      className="fixed inset-x-0 bottom-0 z-40 border-t border-base-edge bg-base-bg md:hidden"
      /* Fills the home indicator area with the bar's own ground rather than
         leaving a strip of page showing beneath it. */
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="grid grid-cols-5">
        {TABS.map(({ id, label, icon: Icon, cta }) => {
          const on = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                aria-current={on ? 'true' : undefined}
                /* min-h-[54px] against WCAG 2.2 2.5.8's 24px floor: a thumb
                   target at the bottom edge of a phone wants the room. */
                className={`relative flex min-h-[54px] flex-col items-center justify-center gap-1 overflow-hidden transition-colors ${
                  cta ? 'contact-glare' : ''
                } ${on || cta ? 'text-accent-bright' : 'text-text-muted'}`}
              >
                {/* The active marker is a top edge, matching the accent rule the
                    projects sidebar already uses for its selected row. */}
                {on && (
                  <span
                    className="absolute inset-x-3 top-0 h-[2px] rounded-b bg-accent"
                    aria-hidden="true"
                  />
                )}
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" className="relative z-10" />
                <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.06em]">
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
