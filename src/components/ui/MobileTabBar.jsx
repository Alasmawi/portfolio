import { DOCK_LINKS } from '../../data/navLinks';
import { scrollToSection } from '../../lib/scrollToSection';

// The section links on a phone, as a floating dock at the bottom of the screen.
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
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(10px,env(safe-area-inset-bottom,0px))] md:hidden"
      style={{
        // Its own compositing layer, so iOS keeps it on the viewport rather
        // than re-rastering it with the page scrolling under it.
        transform: 'translateZ(0)',
      }}
    >
      <nav
        aria-label="Sections"
        className="glass-control dock-dense pointer-events-auto w-full max-w-[440px] rounded-[26px] px-1.5 py-1.5"
      >
        <ul className="grid grid-cols-5 gap-0.5">
          {DOCK_LINKS.map(({ id, label, icon: Icon, cta }) => {
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
                  className={`relative flex min-h-[54px] flex-col items-center justify-center gap-1 rounded-[20px] transition-colors ${
                    on ? 'text-text-primary' : cta ? 'text-accent-bright' : 'text-text-muted'
                  }`}
                  /* The active tab is a quiet white wash, the same one the nav
                     pill uses. */
                  style={on ? { background: 'rgba(255,255,255,.1)' } : undefined}
                >
                  <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[11px] font-medium leading-none tracking-[-0.005em]">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
