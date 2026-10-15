import { DOCK_LINKS } from '../../data/navLinks';
import { scrollToSection } from '../../lib/scrollToSection';

// The section links on a phone, as a bar along the bottom of the screen.
// From `md` up the top bar carries them, so this would be duplicate furniture.
//
// Contact is the fifth tab rather than a separate floating button: two fixed
// layers in one corner stack and cover each other.
//
// Labels are sentence case at 11px. They used to be mono uppercase with
// tracking, which made "EXPERIENCE" 72px wide in a 76px cell — it ran into
// "EDUCATION" beside it and read as one word.
export default function MobileTabBar({ active }) {
  return (
    <nav
      aria-label="Sections"
      className="dock-dense fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom,0px)] md:hidden"
      /* Its own compositing layer: a fixed bar sharing a layer with the page is
         the one iOS is most willing to drag along with a scroll. */
      style={{ transform: 'translateZ(0)' }}
    >
      <ul className="grid grid-cols-5">
        {DOCK_LINKS.map(({ id, label, icon: Icon }) => {
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
                /* The current tab carries a carmine rule along its top edge and
                   full-strength ink; the rest sit back. */
                className={`flex min-h-[56px] flex-col items-center justify-center gap-1 border-t-2 ${
                  on ? 'border-accent-body text-bone' : 'border-transparent text-text-dim'
                }`}
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                <span className="text-[10.5px] font-medium leading-none">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
