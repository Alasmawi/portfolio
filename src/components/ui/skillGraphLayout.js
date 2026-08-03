import { SKILL_GROUPS, SKILLS, SKILL_LINKS } from '../../data/skills';

// Radial layout, computed rather than hand-placed, so the data file stays the
// only thing anyone edits. The ellipse is wider than it is tall to match the
// canvas: a circular layout would waste horizontal room and overflow vertically.

const TAU = Math.PI * 2;

export const NODE_SIZE = {
  core: { w: 108, h: 108 },
  hub: { w: 206, h: 32 },
  // Wide enough for the longest label ("Prompt Engineering") without clipping.
  // Type and box are deliberately oversized: fitView scales the whole graph
  // down to ~0.75, so 13px here lands near 10px on screen.
  skill: { w: 168, h: 28 },
};

const HUB_R = { rx: 322, ry: 135 };
// Skills alternate between two rings so a busy group doesn't crowd one arc.
// The inner ring's rx is what actually gates spacing: with a uniform angular
// step of TAU/totalWeight, horizontal clearance at the top of the ellipse is
// rx * step, which has to exceed a node's width.
const RINGS = 2;
// Flattened to roughly the canvas's own aspect, so fitView isn't forced to
// zoom out to accommodate height the container doesn't have.
const SKILL_R = [
  { rx: 600, ry: 251 },
  { rx: 780, ry: 326 },
];

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
          branded: Boolean(skill.color),
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
