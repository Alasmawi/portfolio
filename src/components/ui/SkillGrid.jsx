import AwsIcon from './AwsIcon';
import { SKILL_GROUPS, SKILLS } from '../../data/skills';

// The card view: same data as the network, laid out as grouped chips. This is
// the readable option on a phone, and it is what screen readers get either way.
export default function SkillGrid() {
  const groups = SKILL_GROUPS.map((g) => ({
    ...g,
    members: SKILLS.filter((s) => s.group === g.id),
  })).filter((g) => g.members.length > 0);

  return (
    /* Columns rather than a grid: the groups differ a lot in size, and equal
       row heights would leave large voids under the short ones. */
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-4">
      {groups.map((group) => (
        <div
          key={group.id}
          className="mb-4 break-inside-avoid border border-base-border bg-base-surface/40 p-4"
          style={{ borderTopColor: group.color, borderTopWidth: 2 }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-text-primary">
              {group.label}
            </h3>
            <span
              className="h-1.5 w-1.5 shrink-0"
              style={{ backgroundColor: group.color }}
            />
          </div>
          <ul className="flex flex-wrap gap-2">
            {group.members.map((skill) => (
              <li
                key={skill.id}
                className="flex items-center gap-2 rounded border border-base-border bg-base-surface/60 px-2.5 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-text-dim hover:text-text-primary"
              >
                {skill.glyph ? (
                  <AwsIcon glyph={skill.glyph} className="!h-4 !w-4 !text-[8px]" />
                ) : (
                  <span
                    className="h-1.5 w-1.5 shrink-0"
                    style={{ backgroundColor: skill.color ?? group.color }}
                  />
                )}
                {skill.label}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
