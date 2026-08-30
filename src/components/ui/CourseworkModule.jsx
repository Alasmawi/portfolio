import { useState } from 'react';
import { motion } from 'framer-motion';
import ExpandTile from './ExpandTile';
import { FOCUS_PILLARS } from '../../data/focusPillars';
import { UOB_COURSEWORK, PILLAR_COLORS } from '../../data/uobCoursework';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const card = {
  hidden: { opacity: 0, y: 6, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

// University-specific, not a generic tag cloud: the default state is a
// segmented bar (glanceable, visual-first — nothing to read until you
// choose to). Expanding doesn't drop into a course-by-course list either —
// it's four per-pillar stat cards (count first, course names folded into a
// small caption underneath), so the unit you're scanning is "how much of
// each area" rather than a wall of rows. Each card's own caption is
// truncated to a few names plus "+N more" — with 27 courses now, showing
// every title inline would be exactly the text-heavy list this format was
// built to avoid — but tapping a card reveals its full list, so nothing is
// permanently hidden, just deferred behind one more tap.
export default function CourseworkModule() {
  const total = UOB_COURSEWORK.length;
  const byPillar = FOCUS_PILLARS.map((pillar) => ({
    ...pillar,
    courses: UOB_COURSEWORK.filter((c) => c.pillar === pillar.id),
  })).filter((p) => p.courses.length > 0);
  const [openPillar, setOpenPillar] = useState(null);

  return (
    <ExpandTile
      className="mt-4"
      trigger={
        <div className="w-full">
          <div className="mb-2 flex items-center justify-between">
            {/* text-muted, not text-dim: at 10px, dim measured 4.36:1. */}
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-muted">
              credit distribution
            </span>
          </div>
          <div className="flex h-2.5 overflow-hidden rounded-full">
            {byPillar.map((pillar) => (
              <div
                key={pillar.id}
                style={{
                  width: `${(pillar.courses.length / total) * 100}%`,
                  backgroundColor: PILLAR_COLORS[pillar.id],
                }}
              />
            ))}
          </div>
        </div>
      }
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2.5 pt-3"
      >
        {byPillar.map((pillar) => {
          const isOpen = openPillar === pillar.id;
          return (
            <motion.button
              key={pillar.id}
              type="button"
              variants={card}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setOpenPillar(isOpen ? null : pillar.id)}
              className="rounded-lg bg-base-surface/60 p-3 text-left"
            >
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-2xl font-semibold"
                  style={{ color: PILLAR_COLORS[pillar.id] }}
                >
                  {pillar.courses.length}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-text-dim">
                  {pillar.courses.length === 1 ? 'course' : 'courses'}
                </span>
              </div>
              <p className="mt-1 text-xs text-text-primary">{pillar.label}</p>

              {isOpen ? (
                <ul className="mt-1.5 space-y-1">
                  {pillar.courses.map((c) => (
                    <li
                      key={c.code}
                      className="flex items-baseline justify-between gap-2 text-[10.5px] leading-snug"
                    >
                      <span className="text-text-dim">{c.title}</span>
                      <span className="shrink-0 font-mono text-text-dim">{c.code}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1.5 text-[10.5px] leading-snug text-text-dim">
                  {pillar.courses
                    .slice(0, 3)
                    .map((c) => c.title)
                    .join(', ')}
                  {pillar.courses.length > 3 && ` +${pillar.courses.length - 3} more`}
                </p>
              )}
            </motion.button>
          );
        })}
      </motion.div>
    </ExpandTile>
  );
}
