import { useState } from 'react';
import { UOB_COURSEWORK } from '../../data/uobCoursework';

// A selection of the degree's coursework, grouped and named. It is a
// selection, not the transcript: the degree is 132 credit hours and this lists
// the courses that bear on the work, so nothing here counts courses or says how
// many are left out.
//
// Each group shows its first few; one toggle opens the rest of the selection.
const GROUPS = [
  { id: 'cloud', label: 'Cloud & networking' },
  { id: 'fullstack', label: 'Software & data' },
  { id: 'cs', label: 'CS foundations' },
  { id: 'ai', label: 'AI & maths' },
];
const PREVIEW = 3;

export default function CourseworkModule({ color }) {
  const [more, setMore] = useState(false);
  const groups = GROUPS.map((g) => ({
    ...g,
    courses: UOB_COURSEWORK.filter((c) => c.pillar === g.id),
  })).filter((g) => g.courses.length);

  return (
    <div className="mt-6 border-t border-white/[0.08] pt-5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">Selected coursework</p>
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          className="min-h-8 rounded-full px-3 font-mono text-[11px] text-text-primary/80 transition-colors hover:text-text-primary"
          style={{ boxShadow: `inset 0 0 0 1px ${color}55` }}
        >
          {more ? 'Show fewer' : 'Show more'}
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id}>
            <p className="flex items-center gap-2 text-[13px] font-medium text-text-primary">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
              {g.label}
            </p>
            <ul className="mt-1.5 space-y-1">
              {(more ? g.courses : g.courses.slice(0, PREVIEW)).map((c) => (
                <li key={c.code} className="text-[13px] leading-snug text-text-primary/70">
                  {c.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
