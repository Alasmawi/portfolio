import { useState } from 'react';
import { UOB_COURSEWORK } from '../../data/uobCoursework';

// The degree's IT coursework, grouped and named. This replaced a segmented bar
// with no labels on its segments — four shades of one colour that said "there
// are four groups" and nothing about what was in them.
//
// Each group shows its first few courses; one toggle opens every group at once,
// so nothing is hidden behind more than one tap.
const GROUPS = [
  { id: 'cloud', label: 'Cloud & networking' },
  { id: 'fullstack', label: 'Software & data' },
  { id: 'cs', label: 'CS foundations' },
  { id: 'ai', label: 'AI & maths' },
];
const PREVIEW = 3;

export default function CourseworkModule({ color }) {
  const [all, setAll] = useState(false);
  const groups = GROUPS.map((g) => ({
    ...g,
    courses: UOB_COURSEWORK.filter((c) => c.pillar === g.id),
  })).filter((g) => g.courses.length);

  return (
    <div className="mt-6 border-t border-white/[0.08] pt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Coursework</p>
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          aria-expanded={all}
          className="min-h-8 rounded-full px-3 font-mono text-[11px] text-text-primary/80 transition-colors hover:text-text-primary"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55` }}
        >
          {all ? 'Show fewer' : `Show all ${UOB_COURSEWORK.length}`}
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {groups.map((g) => {
          const shown = all ? g.courses : g.courses.slice(0, PREVIEW);
          const hidden = g.courses.length - shown.length;
          return (
            <div key={g.id}>
              <p className="flex items-baseline gap-2 text-[13px] font-medium text-text-primary">
                {g.label}
                <span className="font-mono text-[11px] font-normal tabular-nums" style={{ color }}>
                  {g.courses.length}
                </span>
              </p>
              <ul className="mt-1.5 space-y-1">
                {shown.map((c) => (
                  <li key={c.code} className="text-[13px] leading-snug text-text-primary/70">
                    {c.title}
                  </li>
                ))}
                {hidden > 0 && <li className="font-mono text-[11px] text-text-dim">+{hidden} more</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
