import { SKILL_GROUPS, SKILLS, SKILL_LINKS } from '../../data/skills';

// Radial layout, computed rather than hand-placed, so the data file stays the
// only thing anyone edits. The ellipse is wider than it is tall to match the
// canvas: a circular layout would waste horizontal room and overflow vertically.

const TAU = Math.PI * 2;

export const NODE_SIZE = {
  core: { w: 96, h: 96 },
  hub: { w: 150, h: 26 },
  // No box around a skill any more — this is the text's footprint, used for
  // spacing only. Sized with real slack over the longest label ("Anomaly
  // Detection"), which is ~122px: at the exact boundary, sub-pixel rounding
  // under the canvas transform makes it ellipsise.
  skill: { w: 152, h: 22 },
};

const HUB_R = { rx: 244, ry: 102 };
// Skills alternate between two rings so a busy group doesn't crowd one arc.
// The inner ring's rx is what actually gates spacing: with a uniform angular
// step of TAU/totalWeight, horizontal clearance at the top of the ellipse is
// rx * step, which has to exceed a node's width.
const RINGS = 2;
// Flattened to roughly the canvas's own aspect, so fitView isn't forced to
// zoom out to accommodate height the container doesn't have.
// When a group's two rings hold the same number of members, its first inner
// and first outer node sit at the *same* angle — so the gap between the rings
// has to clear a whole node width (plus drift) on its own, not just look tidy.
const SKILL_R = [
  { rx: 480, ry: 201 },
  { rx: 675, ry: 282 },
];

// Deterministic per-node jitter for the drift animation, so the float looks
// organic without any of it being random at runtime.
const noise = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const onEllipse = (angle, { rx, ry }) => ({
  x: Math.cos(angle) * rx,
  y: Math.sin(angle) * ry,
});

// React Flow positions from the top-left corner; the maths above is centre-based.
const topLeft = ({ x, y }, size) => ({ x: x - size.w / 2, y: y - size.h / 2 });

export function buildSkillGraph() {
  const groups = SKILL_GROUPS;

  // Each group's slice is proportional to how many nodes its busiest ring
  // holds, and members sit on half-step centres inside it. That makes the
  // angular step uniform across the whole ring — including across group
  // boundaries, which is exactly where a fixed gutter lets neighbours collide.
  const membersOf = (id) => SKILLS.filter((s) => s.group === id);
  const weights = groups.map((g) => Math.max(1, Math.ceil(membersOf(g.id).length / RINGS)));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const nodes = [
    {
      id: 'core',
      type: 'skillCore',
      position: topLeft({ x: 0, y: 0 }, NODE_SIZE.core),
      data: { label: 'Abdulla' },
      draggable: false,
      selectable: false,
    },
  ];
  const edges = [];

  let acc = 0;
  groups.forEach((group, gi) => {
    // start at the top and go clockwise
    const sliceStart = -TAU / 4 + (acc / totalWeight) * TAU;
    const slice = (weights[gi] / totalWeight) * TAU;
    acc += weights[gi];
    const centre = sliceStart + slice / 2;
    const hubId = `g:${group.id}`;

    nodes.push({
      id: hubId,
      type: 'skillHub',
      position: topLeft(onEllipse(centre, HUB_R), NODE_SIZE.hub),
      data: { label: group.label, color: group.color, groupId: group.id },
      draggable: false,
      selectable: false,
    });

    edges.push({
      id: `e:core-${hubId}`,
      source: 'core',
      target: hubId,
      type: 'straight',
      data: { kind: 'spine', color: group.color },
    });

    const members = membersOf(group.id);

    members.forEach((skill, k) => {
      const ring = k % RINGS;
      const idxInRing = Math.floor(k / RINGS);
      const countInRing = Math.ceil((members.length - ring) / RINGS);
      // half-step inset keeps the first/last member clear of the boundary
      const angle = sliceStart + ((idxInRing + 0.5) / countInRing) * slice;

      nodes.push({
        id: skill.id,
        type: 'skillNode',
        position: topLeft(onEllipse(angle, SKILL_R[ring]), NODE_SIZE.skill),
        data: {
          label: skill.label,
          // Its own brand colour if it has one, otherwise the group's.
          color: skill.color ?? group.color,
          groupColor: group.color,
          groupLabel: group.label,
          // Drift is applied to the inner box, not the React Flow position, so
          // it costs nothing and never invalidates the graph's layout.
          float: {
            dx: +(2 + noise(nodes.length, 1) * 3).toFixed(1),
            dy: +(2 + noise(nodes.length, 2) * 3).toFixed(1),
            dur: +(8 + noise(nodes.length, 3) * 7).toFixed(1),
            delay: +(-noise(nodes.length, 4) * 12).toFixed(1),
          },
        },
        draggable: false,
      });

      edges.push({
        id: `e:${hubId}-${skill.id}`,
        source: hubId,
        target: skill.id,
        type: 'straight',
        data: { kind: 'branch', color: group.color },
      });
    });
  });

  const known = new Set(nodes.map((n) => n.id));
  SKILL_LINKS.forEach(([a, b]) => {
    // A typo in the data shouldn't render a dangling edge.
    if (!known.has(a) || !known.has(b)) return;
    edges.push({
      id: `e:x:${a}-${b}`,
      source: a,
      target: b,
      type: 'straight',
      data: { kind: 'cross' },
    });
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
