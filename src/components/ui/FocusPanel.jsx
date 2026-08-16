import ExpandTile from './ExpandTile';
import { FOCUS_PILLARS } from '../../data/focusPillars';
import { PROJECTS } from '../../data/projects';

export default function FocusPanel({ className = '' }) {
  return (
    <div className={`grid grid-cols-1 gap-2 sm:grid-cols-2 ${className}`}>
      {FOCUS_PILLARS.map((pillar) => {
        const count = PROJECTS.filter((p) => p.pillars?.includes(pillar.id)).length;
        return (
          <ExpandTile
            key={pillar.id}
            trigger={
              <span className="flex items-center gap-2.5">
                {/* Status-dot motif borrowed from the dashboard language the
                    rest of the site uses for "live"/"operational" states. */}
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ok"
                  aria-hidden="true"
                />
                <span className="font-mono text-xs uppercase tracking-wider text-text-primary">
                  {pillar.label}
                </span>
              </span>
            }
          >
            <p className="text-sm leading-relaxed text-text-muted">{pillar.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pillar.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded border border-base-border bg-base-raised px-2 py-0.5 font-mono text-[10px] text-text-dim"
                >
                  {tool}
                </span>
              ))}
            </div>
            {count > 0 && (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-text-dim">
                {count} {count === 1 ? 'project' : 'projects'} below
              </p>
            )}
          </ExpandTile>
        );
      })}
    </div>
  );
}
