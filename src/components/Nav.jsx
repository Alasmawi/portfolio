import { LINKS } from '../data/navLinks';
import useActiveSection from '../hooks/useActiveSection';

const IDS = LINKS.map((l) => l.id);

export default function Nav() {
  const active = useActiveSection(IDS, 'about');

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-base-border/80 bg-base-bg/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#hero"
          className="font-mono text-sm text-text-primary transition-colors hover:text-amber"
        >
          <span className="text-amber">~/</span>alasmawi
        </a>

        {/* Desktop only — on mobile, the bottom tab bar is the primary
            navigation, so the top bar stays a slim, unobtrusive header. */}
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                  active === id
                    ? 'text-amber'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {active === id ? '> ' : ''}
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
