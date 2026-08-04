import { SKILL_GROUPS, SKILLS, SKILL_LINKS } from '../../data/skills';

// Each group is laid out as a block: its head on top, its skills in an aligned
// column beneath, tied together by a rail down the left edge. Alignment and the
// rail are what say "these are under this section" — no tinted field, and no
// line per skill. Only the seven heads are wired to the centre.
//
// Blocks are placed on an ellipse around the core; the ellipse is wider than it
// is tall to match the canvas.

const TAU = Math.PI * 2;

const ROW_H = 24;
const HEAD_H = 26;
const COL_W = 158;
const RAIL_GAP = 13;
// A group wider than this many skills wraps into a second column rather than
// growing a tall block that collides with its neighbours on the ellipse.
const MAX_ROWS = 5;

export const NODE_SIZE = {
  core: { w: 112, h: 112 },
  skill: { w: COL_W - 8, h: ROW_H - 2 },
};

const BLOCK_R = { rx: 466, ry: 196 };

const onEllipse = (angle, { rx, ry }) => ({
  x: Math.cos(angle) * rx,
  y: Math.sin(angle) * ry,
});

// Deterministic per-group jitter for the drift, so it looks organic without
// being random at runtime.
const noise = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function blockShape(count) {
  const cols = count > MAX_ROWS ? 2 : 1;
  const rows = Math.ceil(count / cols);
  return { cols, rows, w: RAIL_GAP + cols * COL_W, h: HEAD_H + rows * ROW_H };
}

export function buildSkillGraph() {
  const groups = SKILL_GROUPS;
  const membersOf = (id) => SKILLS.filter((s) => s.group === id);
  const slice = TAU / groups.length;

  const nodes = [
    {
      id: 'core',
      type: 'skillCore',
      zIndex: 4,
      position: { x: -NODE_SIZE.core.w / 2, y: -NODE_SIZE.core.h / 2 },
      data: { label: '~/stack' },
      draggable: false,
      selectable: false,
    },
  ];
  const edges = [];

  groups.forEach((group, gi) => {
    const members = membersOf(group.id);
    if (members.length === 0) return;

    const { cols, rows, w, h } = blockShape(members.length);
    // start at the top and go clockwise
    const anchor = onEllipse(gi * slice - TAU / 4, BLOCK_R);
    const left = anchor.x - w / 2;
    const top = anchor.y - h / 2;

    // Whole blocks drift as a unit, so the columns never fall out of alignment.
    const float = {
      dx: +(2 + noise(gi, 1) * 3).toFixed(1),
      dy: +(2 + noise(gi, 2) * 3).toFixed(1),
      dur: +(9 + noise(gi, 3) * 7).toFixed(1),
      delay: +(-noise(gi, 4) * 12).toFixed(1),
    };

    const headId = `g:${group.id}`;
    nodes.push({
      id: headId,
      type: 'skillHead',
      zIndex: 3,
      position: { x: left, y: top },
      data: { label: group.label, color: group.color, groupId: group.id, w, float },
      draggable: false,
      selectable: false,
    });

    // One rail per column, so every skill has a tie on its left — a single
    // rail would orphan the second column of a wrapped group.
    for (let c = 0; c < cols; c += 1) {
      const inColumn = Math.min(rows, members.length - c * rows);
      nodes.push({
        id: `rail:${group.id}:${c}`,
        type: 'skillRail',
        zIndex: 1,
        position: { x: left + 3 + c * COL_W, y: top + HEAD_H - 4 },
        data: { color: group.color, groupId: group.id, h: inColumn * ROW_H - 4, float },
        draggable: false,
        selectable: false,
        focusable: false,
      });
    }

    edges.push({
      id: `e:core-${headId}`,
      source: 'core',
      target: headId,
      data: { kind: 'spine', color: group.color },
    });

    members.forEach((skill, k) => {
      const col = Math.floor(k / rows);
      const row = k % rows;
      nodes.push({
        id: skill.id,
        type: 'skillNode',
        zIndex: 2,
        position: {
          x: left + RAIL_GAP + col * COL_W,
          y: top + HEAD_H + row * ROW_H,
        },
        data: {
          label: skill.label,
          // Its own brand colour if it has one, otherwise the group's.
          color: skill.color ?? group.color,
          groupColor: group.color,
          groupLabel: group.label,
          groupId: group.id,
          float,
        },
        draggable: false,
      });

      // Kept for hover highlighting only — never rendered. See SkillGraph.jsx.
      edges.push({
        id: `e:${headId}-${skill.id}`,
        source: headId,
        target: skill.id,
        data: { kind: 'branch', color: group.color },
      });
    });
  });

  const known = new Set(nodes.map((n) => n.id));
  SKILL_LINKS.forEach(([a, b]) => {
    // A typo in the data shouldn't render a dangling edge.
    if (!known.has(a) || !known.has(b)) return;
    edges.push({ id: `e:x:${a}-${b}`, source: a, target: b, data: { kind: 'cross' } });
  });

  return { nodes, edges };
}

// id -> set of directly connected ids, for hover highlighting.
export function buildAdjacency(edges) {
  const adj = new Map();
  const add = (a, b) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a).add(b);
  };
  edges.forEach((e) => {
    add(e.source, e.target);
    add(e.target, e.source);
  });
  return adj;
}
