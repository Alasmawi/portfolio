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
// each area" rather than eleven individual rows. Cards stagger in on
// reveal rather than the whole block popping in at once.
export default function CourseworkModule() {
  const total = UOB_COURSEWORK.length;
  const byPillar = FOCUS_PILLARS.map((pillar) => ({
    ...pillar,
    courses: UOB_COURSEWORK.filter((c) => c.pillar === pillar.id),
  })).filter((p) => p.courses.length > 0);

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
        {byPillar.map((pillar) => (
          <motion.div
            key={pillar.id}
            variants={card}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-lg bg-base-raised p-3"
          >
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-2xl font-semibold"
                style={{ color: PILLAR_COLORS[pillar.id] }}
              >
                {pillar.courses.length}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-dim">
                {pillar.courses.length === 1 ? 'course' : 'courses'}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-primary">{pillar.label}</p>
            <p className="mt-1.5 text-[10px] leading-snug text-text-dim">
              {pillar.courses.map((c) => c.title).join(', ')}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </ExpandTile>
  );
}
