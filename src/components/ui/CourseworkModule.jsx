import ExpandTile from './ExpandTile';
import { FOCUS_PILLARS } from '../../data/focusPillars';
import { UOB_COURSEWORK, PILLAR_COLORS } from '../../data/uobCoursework';

// University-specific, not a generic tag cloud: the default state is a
// segmented bar (glanceable, visual-first — nothing to read until you
// choose to), and clicking it reveals an actual transcript-style list
// with course codes and credit hours instead of a flat cloud of skill
// pills. Proportions are computed from the courses actually listed below,
// not the full ~40-course degree — the bar and the list describe the same
// data, not a summary of something wider that never gets shown.
export default function CourseworkModule() {
  const total = UOB_COURSEWORK.length;
  const counts = UOB_COURSEWORK.reduce((acc, c) => {
    acc[c.pillar] = (acc[c.pillar] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <ExpandTile
      className="mt-4"
      trigger={
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
              credit distribution
            </span>
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {Object.entries(counts).map(([pillar, count]) => (
              <div
                key={pillar}
                style={{
                  width: `${(count / total) * 100}%`,
                  backgroundColor: PILLAR_COLORS[pillar],
                }}
              />
            ))}
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
            {FOCUS_PILLARS.map((pillar) =>
              counts[pillar.id] ? (
                <span
                  key={pillar.id}
                  className="flex items-center gap-1.5 font-mono text-[10px] text-text-dim"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-sm"
                    style={{ backgroundColor: PILLAR_COLORS[pillar.id] }}
                    aria-hidden="true"
                  />
                  {pillar.label.toLowerCase()}
                </span>
              ) : null
            )}
          </div>
        </div>
      }
    >
      <div className="-mx-4 border-t border-base-border">
        {UOB_COURSEWORK.map((course) => (
          <div
            key={course.title}
            className="flex items-center justify-between gap-3 border-b border-base-border/60 px-4 py-2 last:border-b-0"
          >
            <span
              className="font-mono text-[10px] shrink-0"
              style={{ color: PILLAR_COLORS[course.pillar] }}
            >
              {course.code}
            </span>
            <span className="flex-1 truncate text-xs text-text-primary">
              {course.title}
            </span>
            <span className="shrink-0 font-mono text-[10px] text-text-dim">
              {course.ch} cr
            </span>
          </div>
        ))}
      </div>
    </ExpandTile>
  );
}
