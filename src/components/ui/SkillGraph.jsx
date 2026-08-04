import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ReactFlow, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './SkillGraph.css';
import { buildAdjacency, buildSkillGraph, NODE_SIZE } from './skillGraphLayout';

// Hover state travels by context, never through the `nodes` / `edges` props.
// Handing React Flow rebuilt node objects drops the dimensions it measured for
// them, so it re-measures the whole graph on every hover — which is what made
// the canvas flicker. Keeping both arrays referentially frozen avoids that
// entirely; only the components that care re-render.
const HoverContext = createContext({
  hovered: null,
  adjacency: new Map(),
  color: null,
  hoveredGroup: null,
});

const stateFor = (id, hovered, adjacency) => {
  if (!hovered) return undefined;
  if (id === hovered) return 'on';
  return adjacency.get(hovered)?.has(id) ? 'near' : 'off';
};

// Edges attach at node centres, so the network radiates cleanly instead of
// hanging off the corners of each box.
const HANDLE_STYLE = {
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  pointerEvents: 'none',
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: 0,
};

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Top} style={HANDLE_STYLE} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={HANDLE_STYLE} isConnectable={false} />
    </>
  );
}

// The tinted field behind a group. Purely decorative and never hit-tested, so
// it can sit under the labels without stealing their hover.
function SkillCloud({ data }) {
  const { hoveredGroup } = useContext(HoverContext);
  return (
    <div
      className="sg-cloud"
      data-state={hoveredGroup ? (hoveredGroup === data.groupId ? 'on' : 'off') : undefined}
      style={{ width: data.w, height: data.h, '--c': data.color }}
    />
  );
}

function SkillCore({ id, data }) {
  const { hovered, adjacency } = useContext(HoverContext);
  return (
    <div
      className="sg-core"
      data-state={stateFor(id, hovered, adjacency)}
      style={{ width: NODE_SIZE.core.w, height: NODE_SIZE.core.h }}
    >
      <Handles />
      <span className="sg-core__ring" />
      <span className="sg-core__ring sg-core__ring--in" />
      <span className="sg-core__text">
        {data.label}
        <span className="sg-core__caret" />
      </span>
    </div>
  );
}

function SkillHub({ id, data }) {
  const { hovered, adjacency } = useContext(HoverContext);
  return (
    <div
      className="sg-hub"
      data-state={stateFor(id, hovered, adjacency)}
      style={{ width: NODE_SIZE.hub.w, height: NODE_SIZE.hub.h, '--c': data.color }}
    >
      <Handles />
      <span className="sg-hub__mark" />
      <span className="sg-hub__label">{data.label}</span>
    </div>
  );
}

function SkillNode({ id, data }) {
  const { hovered, adjacency } = useContext(HoverContext);
  const f = data.float;
  return (
    <div
      className="sg-node"
      data-state={stateFor(id, hovered, adjacency)}
      style={{
        width: NODE_SIZE.skill.w,
        height: NODE_SIZE.skill.h,
        '--c': data.color,
        '--g': data.groupColor,
        '--fx': `${f.dx}px`,
        '--fy': `${f.dy}px`,
        '--fdur': `${f.dur}s`,
        '--fdelay': `${f.delay}s`,
      }}
      title={`${data.label} — ${data.groupLabel}`}
    >
      <Handles />
      <span className="sg-node__dot" />
      <span className="sg-node__label">{data.label}</span>
    </div>
  );
}

// A gentle arc rather than a straight chord. Thirty straight lines converging
// on one point reads as a spiderweb; bowing them apart lets the eye follow one.
function arc(sx, sy, tx, ty, bow) {
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  return `M${sx},${sy} Q${mx - dy * bow},${my + dx * bow} ${tx},${ty}`;
}

function SkillEdge({ source, target, sourceX, sourceY, targetX, targetY, data }) {
  const { hovered, color } = useContext(HoverContext);
  const kind = data?.kind;
  const touching = hovered && (source === hovered || target === hovered);

  // Cross-links are the relationships, not the structure. Drawing all 31 at
  // rest was most of the clutter, so they only appear for the node you're on.
  if (kind === 'cross' && !touching) return null;
  if (kind !== 'cross' && hovered && !touching) {
    return (
      <path
        className="react-flow__edge-path"
        d={arc(sourceX, sourceY, targetX, targetY, 0.08)}
        fill="none"
        stroke={data?.color ?? '#2b3949'}
        strokeWidth={1}
        opacity={0.07}
      />
    );
  }

  return (
    <path
      className="react-flow__edge-path"
      d={arc(sourceX, sourceY, targetX, targetY, kind === 'cross' ? 0.16 : 0.08)}
      fill="none"
      stroke={touching ? color : (data?.color ?? '#2b3949')}
      strokeWidth={touching ? 1.5 : kind === 'spine' ? 1 : 0.9}
      strokeDasharray={kind === 'cross' ? '2 3' : undefined}
      opacity={touching ? 0.95 : kind === 'spine' ? 0.3 : 0.22}
    />
  );
}

const NODE_TYPES = {
  skillCore: SkillCore,
  skillHub: SkillHub,
  skillNode: SkillNode,
  skillCloud: SkillCloud,
};
const EDGE_TYPES = { skill: SkillEdge };

export default function SkillGraph() {
  // Built once. Never replaced — see the note on HoverContext.
  const { nodes, edges, allEdges } = useMemo(() => {
    const g = buildSkillGraph();
    const typed = g.edges.map((e) => ({ ...e, type: 'skill' }));
    return {
      nodes: g.nodes,
      // Only the group heads are wired to the centre. A skill sits under its
      // head by colour and position, with no line of its own — thirty spokes
      // radiating out of seven hubs was the last of the visual noise.
      edges: typed.filter((e) => e.data?.kind !== 'branch'),
      // Adjacency still knows about head↔skill, so hovering either one still
      // lights the other. It just isn't drawn.
      allEdges: typed,
    };
  }, []);
  const adjacency = useMemo(() => buildAdjacency(allEdges), [allEdges]);

  // Fit to the labels only. The clouds are padded well past the outermost
  // node, and letting them into the calculation just zooms everything out;
  // their edges are transparent anyway, so clipping them costs nothing.
  const fitOptions = useMemo(() => ({
    padding: 0.06,
    nodes: nodes.filter((n) => n.type !== 'skillCloud').map((n) => ({ id: n.id })),
  }), [nodes]);
  const [hovered, setHovered] = useState(null);

  const ctx = useMemo(() => {
    const node = hovered ? nodes.find((n) => n.id === hovered) : null;
    return {
      hovered,
      adjacency,
      color: node?.data?.color ?? (hovered ? '#e6edf3' : null),
      hoveredGroup: node?.data?.groupId ?? null,
    };
  }, [hovered, adjacency, nodes]);

  const onNodeMouseEnter = useCallback((_, node) => setHovered(node.id), []);
  const onNodeMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <div className="sg-frame">
      <HoverContext.Provider value={ctx}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          fitView
          fitViewOptions={fitOptions}
          minZoom={0.15}
          maxZoom={2}
          /* The page uses mandatory scroll-snap — the canvas must never swallow
             a wheel gesture. Zooming is via the on-canvas controls or pinch. */
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          panOnScroll={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: false }}
        >
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </HoverContext.Provider>
    </div>
  );
}
