import { Mail } from 'lucide-react';
import { LINKS } from '../../data/navLinks';
import { scrollToSection } from '../../lib/scrollToSection';

// Phone-only bottom navigation, now a floating dock rather than a bar welded to
// the bottom edge. On desktop the nav pill is always visible and already
// carries these links, so this would be duplicate furniture there.
//
// Contact is the fifth tab rather than a separate floating pill. The pill it
// replaces was fixed to the bottom-right corner — exactly where this dock now
// is — and two fixed layers in one corner is the obvious failure mode: they
// stack, they cover each other, and together they took ~14% of an 844px screen
// permanently. As a tab it is also *more* available than the pill was: the pill
// deliberately hid over the hero and over Contact itself, so "always one tap
// away" had two holes in it. This has none.
const TABS = [...LINKS, { id: 'contact', label: 'Contact', icon: Mail, cta: true }];

export default function MobileTabBar({ active }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(10px,env(safe-area-inset-bottom,0px))] md:hidden"
      style={{
        // Its own compositing layer. A fixed dock that shares a layer with the
        // scrolling page is the one iOS is most willing to drag along with a
        // scroll; promoting it keeps it on the viewport rather than being
        // re-rastered with the content under it.
        transform: 'translateZ(0)',
      }}
    >
      <nav
        aria-label="Sections"
        /* dock-dense: every other control sits over the page ground, but this
           one always has body copy sliding underneath it. The extra tint is
           what keeps the labels off the smear. */
        className="glass-control dock-dense pointer-events-auto w-full max-w-[420px] rounded-[26px] px-1.5 py-1.5"
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
                  className={`relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] transition-colors ${
                    on ? 'text-text-primary' : cta ? 'text-accent-bright' : 'text-text-muted'
                  }`}
                  /* The active tab is a lit facet of the dock's own glass — the
                     same white wash and top stroke the nav pill uses for its
                     selected link — instead of the accent underline the old bar
                     drew. On an object this small a coloured rule reads as a
                     defect in the glass; a highlight reads as a pressed key. */
                  style={
                    on
                      ? {
                          background: 'rgba(255,255,255,.18)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,.5)',
                        }
                      : undefined
                  }
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em]">
                    {label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
