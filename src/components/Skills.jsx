import { lazy, Suspense, useEffect, useState } from 'react';
import { Network, LayoutGrid } from 'lucide-react';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import SkillGrid from './ui/SkillGrid';
import { SKILL_GROUPS } from '../data/skills';

// React Flow is ~58kB gzipped, so the network view is split out and only
// fetched once someone actually looks at it.
const SkillGraph = lazy(() => import('./ui/SkillGraph'));

const VIEWS = [
  { id: 'network', label: 'Network', Icon: Network },
  { id: 'grid', label: 'Grid', Icon: LayoutGrid },
];

function useMinWidth(px) {
  const query = `(min-width: ${px}px)`;
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return matches;
}

function ViewToggle({ view, onChange }) {
  return (
    <div
      className="inline-flex border border-base-border bg-base-surface/60"
      role="group"
      aria-label="Skills view"
    >
      {VIEWS.map(({ id, label, Icon }) => {
        const active = view === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`flex items-center gap-2 px-3 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              active
                ? 'bg-amber/15 text-amber'
                : 'text-text-dim hover:text-text-primary'
            }`}
          >
            <Icon size={13} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function Skills() {
  const isWide = useMinWidth(1024);
  // The network needs width to be legible, so a phone opens on the grid — but
  // the toggle still works there, it just starts zoomed out.
  const [view, setView] = useState(null);
  const active = view ?? (isWide ? 'network' : 'grid');

  return (
    // Shallower vertical padding than its neighbouring sections on purpose: the
    // graph needs the height more than the section needs the breathing room.
    <section id="skills" className="border-b border-base-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader index="04" id="skills" title="Skills" region="~/stack" />

        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-md text-sm leading-relaxed text-text-muted">
              {active === 'network'
                ? 'One connected stack, grouped by domain. Hover a node to see what it connects to.'
                : 'The same stack as the network view, grouped by domain.'}
            </p>
            <ViewToggle view={active} onChange={setView} />
          </div>
        </Reveal>
      </div>

      {/* The network gets a wider container than the prose; the grid stays in
          the text column so its cards line up with the rest of the page. */}
      <div
        className={`mx-auto mt-5 px-6 ${
          active === 'network' ? 'max-w-[1400px]' : 'max-w-6xl'
        }`}
      >
        {active === 'network' ? (
          <Reveal key="network">
            {/* Absolutely-positioned boxes on a canvas: the sr-only list below
                is the screen-reader path, so keep the graph out of the tree. */}
            <div aria-hidden="true">
              <Suspense
                fallback={
                  <div
                    className="border border-base-border bg-base-surface/40"
                    style={{ height: 'clamp(380px, calc(100vh - 300px), 720px)' }}
                  />
                }
              >
                <SkillGraph />
              </Suspense>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {SKILL_GROUPS.map((group) => (
                <span
                  key={group.id}
                  className="flex items-center gap-2 font-mono text-[11px] text-text-dim"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: group.color }}
                  />
                  {group.label}
                </span>
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal key="grid">
            <SkillGrid />
          </Reveal>
        )}

        {/* The network is aria-hidden, so screen readers always get the cards. */}
        {active === 'network' && (
          <div className="sr-only">
            <SkillGrid />
          </div>
        )}
      </div>
    </section>
  );
}
