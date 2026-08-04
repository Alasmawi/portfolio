import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ReactFlow,
  Controls,
  ControlButton,
  Handle,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import './SkillGraph.css';
import chipCore from '../../assets/icons/chip-core.gif';
import { buildAdjacency, buildSkillGraph, NODE_SIZE } from './skillGraphLayout';

// Hover state travels by context, never through the `nodes` / `edges` props.
// Handing React Flow rebuilt node objects drops the dimensions it measured for
// them, so it re-measures the whole graph on every hover — which is what made
// the canvas flicker. Keeping both arrays referentially frozen avoids that.
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

const floatStyle = (f) => (f ? {
  '--fx': `${f.dx}px`,
  '--fy': `${f.dy}px`,
  '--fdur': `${f.dur}s`,
  '--fdelay': `${f.delay}s`,
} : null);

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

function SkillCore({ id }) {
  const { hovered, adjacency } = useContext(HoverContext);
  return (
    <div
      className="sg-core"
      data-state={stateFor(id, hovered, adjacency)}
      style={{ width: NODE_SIZE.core.w, height: NODE_SIZE.core.h }}
    >
      <Handles />
      <img className="sg-core__chip" src={chipCore} alt="" draggable={false} />
    </div>
  );
}

function SkillHead({ id, data }) {
  const { hovered, adjacency } = useContext(HoverContext);
  return (
    <div
      className="sg-head"
      data-state={stateFor(id, hovered, adjacency)}
      style={{ width: data.w, '--c': data.color, ...floatStyle(data.float) }}
    >
      <Handles />
      <span className="sg-head__mark" />
      <span className="sg-head__label">{data.label}</span>
    </div>
  );
}

// The tie between a head and its skills: one rail down the left of the column,
// instead of a line to every skill.
function SkillRail({ data }) {
  const { hoveredGroup } = useContext(HoverContext);
  return (
    <div
      className="sg-rail"
      data-state={hoveredGroup ? (hoveredGroup === data.groupId ? 'on' : 'off') : undefined}
      style={{ height: data.h, '--c': data.color, ...floatStyle(data.float) }}
    />
  );
}

function SkillNode({ id, data }) {
  const { hovered, adjacency } = useContext(HoverContext);
  return (
    <div
      className="sg-node"
      data-state={stateFor(id, hovered, adjacency)}
      style={{
        width: NODE_SIZE.skill.w,
        height: NODE_SIZE.skill.h,
        '--c': data.color,
        '--g': data.groupColor,
        ...floatStyle(data.float),
      }}
      title={`${data.label} — ${data.groupLabel}`}
    >
      <Handles />
      <span className="sg-node__dot" />
      <span className="sg-node__label">{data.label}</span>
    </div>
  );
}

// A gentle arc rather than a straight chord, so seven lines converging on one
// point stay readable.
function arc(sx, sy, tx, ty, bow) {
  const mx = (sx + tx) / 2;
  const my = (sy + ty) / 2;
  const dx = tx - sx;
  const dy = ty - sy;
  return `M${sx},${sy} Q${mx - dy * bow},${my + dx * bow} ${tx},${ty}`;
}

// The core art is transparent, so a line drawn to the node's centre would show
// straight through the chip. Pull both ends back: the source stops at the tips
// of the chip's own pins, the target just short of the group head's label.
const CORE_INSET = 62;
const HEAD_INSET = 16;

function trim(sx, sy, tx, ty, from, to) {
  const dx = tx - sx;
  const dy = ty - sy;
  const len = Math.hypot(dx, dy) || 1;
  return [
    sx + (dx / len) * from, sy + (dy / len) * from,
    tx - (dx / len) * to, ty - (dy / len) * to,
  ];
}

function SkillEdge({ source, target, sourceX, sourceY, targetX, targetY, data }) {
  const { hovered, color } = useContext(HoverContext);
  const kind = data?.kind;
  const touching = hovered && (source === hovered || target === hovered);

  // Head↔skill exists only for hover highlighting; the rail draws that
  // relationship instead. Cross-links are relationships rather than structure,
  // so they only appear for the node you're on.
  if (kind === 'branch') return null;
  if (kind === 'cross' && !touching) return null;

  const [sx, sy, tx, ty] = kind === 'spine'
    ? trim(sourceX, sourceY, targetX, targetY, CORE_INSET, HEAD_INSET)
    : [sourceX, sourceY, targetX, targetY];

  const dimmed = hovered && !touching;
  return (
    <path
      className={`react-flow__edge-path ${kind === 'spine' ? 'sg-flow' : 'sg-cross'}`}
      d={arc(sx, sy, tx, ty, kind === 'cross' ? 0.16 : 0.08)}
      fill="none"
      stroke={touching ? color : (data?.color ?? '#2b3949')}
      strokeWidth={touching ? 1.5 : 1.1}
      opacity={dimmed ? 0.12 : touching ? 0.95 : 0.5}
    />
  );
}

const NODE_TYPES = {
  skillCore: SkillCore,
  skillHead: SkillHead,
  skillNode: SkillNode,
  skillRail: SkillRail,
};
const EDGE_TYPES = { skill: SkillEdge };

// Re-fits after the frame changes size (entering or leaving full screen).
function Refit({ trigger, options }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => fitView(options), 60);
    return () => clearTimeout(t);
  }, [trigger, fitView, options]);
  return null;
}

export default function SkillGraph() {
  // Built once. Never replaced — see the note on HoverContext.
  const { nodes, edges, allEdges } = useMemo(() => {
    const g = buildSkillGraph();
    const typed = g.edges.map((e) => ({ ...e, type: 'skill' }));
    return {
      nodes: g.nodes,
      edges: typed.filter((e) => e.data?.kind !== 'branch'),
      allEdges: typed,
    };
  }, []);
  const adjacency = useMemo(() => buildAdjacency(allEdges), [allEdges]);
  const [hovered, setHovered] = useState(null);
  const [full, setFull] = useState(false);

  const fitOptions = useMemo(() => ({ padding: full ? 0.1 : 0.06 }), [full]);

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

  // Full screen locks the page behind it; Escape gets you out.
  useEffect(() => {
    if (!full) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setFull(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // <main> is a z-10 stacking context, so no z-index on a node inside it can
    // beat the z-50 nav that sits outside. Dropping the nav for the duration
    // is what actually lets the overlay cover the page.
    document.body.classList.add('sg-has-fullscreen');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.body.classList.remove('sg-has-fullscreen');
      window.removeEventListener('keydown', onKey);
    };
  }, [full]);

  return (
    <div className={`sg-frame${full ? ' sg-frame--full' : ''}`}>
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
          <Refit trigger={full} options={fitOptions} />
          <Controls showInteractive={false} position="bottom-right">
            <ControlButton
              onClick={() => setFull((v) => !v)}
              title={full ? 'Exit full screen' : 'Expand to full screen'}
              aria-label={full ? 'Exit full screen' : 'Expand to full screen'}
            >
              {full ? <Minimize2 /> : <Maximize2 />}
            </ControlButton>
          </Controls>
        </ReactFlow>
      </HoverContext.Provider>
    </div>
  );
}
