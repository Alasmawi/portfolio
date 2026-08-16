import { LINKS } from '../../data/navLinks';
import useActiveSection from '../../hooks/useActiveSection';

const IDS = LINKS.map((l) => l.id);

// Thumb-reachable primary navigation on mobile, replacing the old
// hamburger-triggered dropdown. Fixed to the bottom, padded for the home
// indicator on notched phones, and synced to the same active-section state
// the desktop nav uses so both always agree on where you are.
export default function MobileTabBar() {
  const active = useActiveSection(IDS, IDS[0]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-base-border bg-base-bg/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-around">
        {LINKS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id} className="flex-1">
              <a
                href={`#${id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                  isActive ? 'text-amber' : 'text-text-dim'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.25 : 1.75} />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
