import { lazy, Suspense, useEffect, useState } from 'react';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import { SKILL_GROUPS, SKILLS } from '../data/skills';

// React Flow is ~60kB gzipped and this graph is below the fold on a large
// screen only, so it is split out rather than shipped in the initial bundle.
const SkillGraph = lazy(() => import('./ui/SkillGraph'));

// Matches .sg-frame so swapping the real graph in causes no layout shift.
const FRAME_HEIGHT = 'clamp(440px, calc(100vh - 385px), 720px)';

// Gating the graph in JS rather than with `hidden lg:block` alone: a CSS-hidden
// component still mounts, so phones would download the React Flow chunk to
// render something they never see.
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

// Grouped chips. This is the small-screen view — a 35-node network is not
// legible at 375px — and it doubles as the accessible reading order for the
// graph, which is a canvas of absolutely positioned boxes.
function SkillList({ className = '' }) {
  return (
    <div className={className}>
      <div className="border border-base-border bg-base-surface/40">
        {SKILL_GROUPS.map((group, i) => {
          const members = SKILLS.filter((s) => s.group === group.id);
          if (members.length === 0) return null;
          return (
            <div
              key={group.id}
              className={`p-4 ${i !== 0 ? 'border-t border-base-border/70' : ''}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0"
                  style={{ backgroundColor: group.color }}
                />
                <h3 className="font-mono text-xs uppercase tracking-wider text-text-primary">
                  {group.label}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {members.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded border border-base-border bg-base-surface/60 px-2.5 py-1.5 font-mono text-xs text-text-muted"
                  >
                    {skill.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Skills() {
  const showGraph = useMinWidth(1024);

  // Shallower vertical padding than its neighbouring sections on purpose: the
  // graph needs the height more than the section needs the breathing room.
  return (
    <section id="skills" className="border-b border-base-border py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader index="04" id="skills" title="Skills" region="~/stack" />

        <Reveal>
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">
            One connected stack, grouped by domain. Hover a node for its own
            colour and what it links to.
          </p>
        </Reveal>
      </div>

      {/* The graph gets a wider container than the prose: 35 nodes at a
          readable size need more room than a text column allows. */}
      <div className="mx-auto mt-5 max-w-[1400px] px-6">
        {/* Network: needs width to be readable, so it starts at lg. */}
        <Reveal delay={0.06} className="hidden lg:block">
          {/* Absolutely-positioned boxes on a canvas: the sr-only list below is
              the screen-reader path, so keep the graph itself out of the tree. */}
          <div aria-hidden="true">
            <Suspense
              fallback={
                <div
                  className="border border-base-border bg-base-surface/40"
                  style={{ height: FRAME_HEIGHT }}
                />
              }
            >
              {showGraph && <SkillGraph />}
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

        <Reveal delay={0.06} className="lg:hidden">
          <SkillList />
        </Reveal>

        {/* Same content, reachable by screen readers when the graph is shown.
            display:none below md so it doesn't duplicate the visible list. */}
        <SkillList className="hidden lg:sr-only" />
      </div>
    </section>
  );
}
