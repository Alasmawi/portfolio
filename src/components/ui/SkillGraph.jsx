import { useCallback, useMemo, useState } from 'react';
import { ReactFlow, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './SkillGraph.css';
import { buildAdjacency, buildSkillGraph, NODE_SIZE } from './skillGraphLayout';

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

function SkillCore({ data }) {
  return (
    <div
      className="sg-core"
      data-state={data.state}
      style={{ width: NODE_SIZE.core.w, height: NODE_SIZE.core.h }}
    >
      <Handles />
      <span className="sg-core__label">{data.label}</span>
      <span className="sg-core__sub">stack</span>
    </div>
  );
}

function SkillHub({ data }) {
  return (
    <div
      className="sg-hub"
      data-state={data.state}
      style={{ width: NODE_SIZE.hub.w, height: NODE_SIZE.hub.h, '--c': data.color }}
    >
      <Handles />
      <span className="sg-hub__dot" />
      {data.label}
    </div>
  );
}

function SkillNode({ data }) {
  return (
    <div
      className="sg-node"
      data-state={data.state}
      style={{
        width: NODE_SIZE.skill.w,
        height: NODE_SIZE.skill.h,
        '--c': data.color,
        '--g': data.groupColor,
      }}
      title={`${data.label} — ${data.groupLabel}`}
    >
      <Handles />
      <span className="sg-node__dot" />
      <span className="sg-node__label">{data.label}</span>
    </div>
  );
}

const NODE_TYPES = { skillCore: SkillCore, skillHub: SkillHub, skillNode: SkillNode };

export default function SkillGraph() {
  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => buildSkillGraph(), []);
  const adjacency = useMemo(() => buildAdjacency(baseEdges), [baseEdges]);
  const [hovered, setHovered] = useState(null);

  const onNodeMouseEnter = useCallback((_, node) => setHovered(node.id), []);
  const onNodeMouseLeave = useCallback(() => setHovered(null), []);

  const nodes = useMemo(() => {
    if (!hovered) return baseNodes;
    const near = adjacency.get(hovered) ?? new Set();
    return baseNodes.map((n) => {
      const state = n.id === hovered ? 'on' : near.has(n.id) ? 'near' : 'off';
      return { ...n, data: { ...n.data, state } };
    });
  }, [baseNodes, adjacency, hovered]);

  // Highlight in the hovered node's own colour. A fixed accent would be
  // ambiguous — the Cloud group is already amber.
  const hoverColor = useMemo(() => {
    if (!hovered) return null;
    const n = baseNodes.find((x) => x.id === hovered);
    return n?.data?.color ?? '#e6edf3';
  }, [baseNodes, hovered]);

  const edges = useMemo(() => baseEdges.map((e) => {
    const kind = e.data?.kind;
    const touching = hovered && (e.source === hovered || e.target === hovered);
    const dim = hovered && !touching;
    const base = kind === 'cross' ? '#3a4a5c' : (e.data?.color ?? '#2b3949');

    return {
      ...e,
      // Lift a hovered node's own edges above the rest of the mesh.
      zIndex: touching ? 10 : 0,
      style: {
        stroke: touching ? hoverColor : base,
        strokeWidth: touching ? 1.7 : kind === 'spine' ? 1.1 : 1,
        strokeDasharray: kind === 'cross' && !touching ? '3 4' : undefined,
        opacity: dim ? 0.1 : touching ? 1 : kind === 'cross' ? 0.3 : 0.45,
      },
    };
  }), [baseEdges, hovered, hoverColor]);

  return (
    <div className="sg-frame">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.06 }}
        minZoom={0.3}
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
    </div>
  );
}
