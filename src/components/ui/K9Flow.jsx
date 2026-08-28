import { memo } from 'react';
import { ReactFlow, Handle, Position, MarkerType } from '@xyflow/react';
import {
  Camera,
  Cpu,
  Database,
  HeartPulse,
  MonitorSmartphone,
  Radio,
  ScanEye,
  Server,
  Sparkles,
  Weight,
  Zap,
} from 'lucide-react';
import '@xyflow/react/dist/style.css';

// K9 Pavlov's data path, laid out with React Flow so the edges are routed by
// the library rather than by hand-tuned bezier control points.
//
// It is deliberately a *static* canvas: every interaction is off, including
// `preventScrolling`, so the diagram never swallows a scroll or a pinch. On a
// phone an interactive canvas in the middle of a page is a trap — you try to
// scroll past it and instead pan the graph.
//
// Loaded lazily by K9Architecture.jsx: React Flow is ~58kB gzipped and this is
// the only thing on the site that uses it.

const TELEMETRY = '#9184d9'; // sensor path — the site's accent
const VIDEO = '#2FC2E8'; // camera path — distinct, so the two ingests read apart

const ICONS = {
  collar: HeartPulse,
  node: Cpu,
  scale: Weight,
  camera: Camera,
  gateway: Server,
  iot: Radio,
  video: ScanEye,
  lambda: Zap,
  bedrock: Sparkles,
  db: Database,
  dashboard: MonitorSmartphone,
};

const HANDLES = [Position.Left, Position.Right, Position.Top, Position.Bottom];

/* One card. Handles on all four sides so the same node definitions serve both
   the horizontal and the stacked layout — each edge just names the side it
   wants. */
const ServiceNode = memo(({ data }) => {
  const Icon = ICONS[data.icon];
  const color = data.color ?? TELEMETRY;
  return (
    <div
      className={`flex items-center rounded-lg ${
        data.sub ? 'gap-2.5 px-3 py-2.5' : 'gap-2 px-2.5 py-2'
      }`}
      style={{
        background: 'rgba(15,17,28,.94)',
        border: `1px solid ${color}66`,
        width: data.w ?? 172,
      }}
    >
      {HANDLES.map((p) => (
        <Handle
          key={p}
          type="source"
          position={p}
          id={p}
          isConnectable={false}
          style={{ opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 0 }}
        />
      ))}
      {HANDLES.map((p) => (
        <Handle
          key={`t-${p}`}
          type="target"
          position={p}
          id={`t-${p}`}
          isConnectable={false}
          style={{ opacity: 0, width: 1, height: 1, minWidth: 1, minHeight: 1, border: 0 }}
        />
      ))}
      <Icon size={16} strokeWidth={1.8} style={{ color, flexShrink: 0 }} aria-hidden="true" />
      <div className="min-w-0 leading-tight">
        <div className="truncate text-[12.5px] font-medium text-text-primary">{data.label}</div>
        {data.sub && (
          <div className="truncate font-mono text-[10px] text-text-muted">{data.sub}</div>
        )}
      </div>
    </div>
  );
});
ServiceNode.displayName = 'ServiceNode';

/* A tier band. React Flow's own group styling is a blue dashed box, so this
   replaces it entirely. */
const TierNode = memo(({ data }) => (
  <div
    className="rounded-xl"
    style={{
      width: data.w,
      height: data.h,
      background: 'rgba(233,233,237,.02)',
      border: '1px solid rgba(233,233,237,.14)',
    }}
  >
    <div className="px-3 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
      {data.label}
    </div>
  </div>
));
TierNode.displayName = 'TierNode';

const nodeTypes = { service: ServiceNode, tier: TierNode };

// `short` variants are used by the stacked layout, where a 130px card cannot
// hold "ESP32-S3 · kennel" without ellipsing it into uselessness.
const SERVICES = [
  { id: 'collar', icon: 'collar', label: 'Smart collar', sub: 'ESP32-S3 · vitals', shortLabel: 'Collar', shortSub: null },
  { id: 'node', icon: 'node', label: 'Node-A', sub: 'ESP32-S3 · kennel', shortLabel: 'Node-A', shortSub: null },
  { id: 'scale', icon: 'scale', label: 'Food scale', sub: 'ESP32 · load cell', shortLabel: 'Scale', shortSub: null },
  { id: 'camera', icon: 'camera', label: 'Reolink cam', sub: 'video stream', shortLabel: 'Camera', shortSub: 'video', color: VIDEO },
  { id: 'gateway', icon: 'gateway', label: 'Pi 5', sub: 'Greengrass', shortLabel: 'Pi 5', shortSub: 'Greengrass' },
  { id: 'iot', icon: 'iot', label: 'IoT Core', sub: 'MQTT ingest', shortLabel: 'IoT Core', shortSub: 'MQTT' },
  { id: 'video', icon: 'video', label: 'Video ingest', sub: 'cloud-side', shortLabel: 'Video', shortSub: 'cloud', color: VIDEO },
  { id: 'lambda', icon: 'lambda', label: 'Lambda', sub: 'rules · detect', shortLabel: 'Lambda', shortSub: 'detect' },
  { id: 'bedrock', icon: 'bedrock', label: 'Bedrock', sub: 'explains it', shortLabel: 'Bedrock', shortSub: 'explains' },
  { id: 'db', icon: 'db', label: 'DynamoDB', sub: 'readings · events', shortLabel: 'DynamoDB', shortSub: 'store' },
  { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', sub: 'React', shortLabel: 'Dashboard', shortSub: 'React · live' },
];

/* Per-layout geometry. Positions are absolute canvas coordinates; the tier
   bands are plain background nodes sized to enclose their members. */
const WIDE = {
  height: 336,
  tiers: [
    { id: 'edge', label: 'Kennel · edge', x: 0, y: 24, w: 300, h: 348 },
    { id: 'cloud', label: 'AWS', x: 324, y: 24, w: 404, h: 348 },
    { id: 'client', label: 'Handler', x: 752, y: 24, w: 216, h: 348 },
  ],
  pos: {
    collar: [18, 62],
    node: [18, 130],
    scale: [18, 198],
    camera: [18, 288],
    gateway: [196, 130],
    iot: [346, 122],
    video: [346, 288],
    lambda: [538, 96],
    bedrock: [538, 182],
    db: [538, 274],
    dashboard: [772, 180],
  },
  widths: { gateway: 132, dashboard: 176 },
  edges: [
    ['collar', 'gateway', Position.Right, Position.Left],
    ['node', 'gateway', Position.Right, Position.Left],
    ['scale', 'gateway', Position.Right, Position.Left],
    ['gateway', 'iot', Position.Right, Position.Left],
    ['camera', 'video', Position.Right, Position.Left, VIDEO],
    ['iot', 'lambda', Position.Right, Position.Left],
    // Left, not Bottom: routing into Lambda's underside sent this edge behind
    // DynamoDB, which read as "video feeds the database".
    ['video', 'lambda', Position.Right, Position.Left, VIDEO],
    ['lambda', 'bedrock', Position.Bottom, Position.Top],
    ['bedrock', 'db', Position.Bottom, Position.Top],
    ['db', 'dashboard', Position.Right, Position.Bottom],
    ['iot', 'dashboard', Position.Top, Position.Top],
  ],
};

const TALL = {
  height: 620,
  short: true,
  tiers: [
    { id: 'edge', label: 'Kennel · edge', x: 0, y: 8, w: 300, h: 186 },
    { id: 'cloud', label: 'AWS', x: 0, y: 210, w: 300, h: 316 },
    { id: 'client', label: 'Handler', x: 0, y: 542, w: 300, h: 78 },
  ],
  pos: {
    collar: [2, 40],
    node: [102, 40],
    scale: [202, 40],
    gateway: [14, 112],
    camera: [162, 112],
    iot: [14, 240],
    video: [162, 240],
    lambda: [70, 318],
    bedrock: [70, 390],
    db: [70, 462],
    dashboard: [66, 566],
  },
  widths: {
    collar: 96, node: 96, scale: 96,
    gateway: 124, camera: 124, iot: 124, video: 124,
    lambda: 160, bedrock: 160, db: 160, dashboard: 168,
  },
  edges: [
    // the three devices drop into the gateway
    ['collar', 'gateway', Position.Bottom, Position.Top],
    ['node', 'gateway', Position.Bottom, Position.Top],
    ['scale', 'gateway', Position.Bottom, Position.Top],
    // gateway and camera each drop straight into their own ingest
    ['gateway', 'iot', Position.Bottom, Position.Top],
    ['camera', 'video', Position.Bottom, Position.Top, VIDEO],
    // both ingests converge on the detection step
    ['iot', 'lambda', Position.Bottom, Position.Top],
    ['video', 'lambda', Position.Bottom, Position.Top, VIDEO],
    ['lambda', 'bedrock', Position.Bottom, Position.Top],
    ['bedrock', 'db', Position.Bottom, Position.Top],
    ['db', 'dashboard', Position.Bottom, Position.Top],
  ],
};

function build(layout) {
  const nodes = [
    ...layout.tiers.map((t) => ({
      id: `tier-${t.id}`,
      type: 'tier',
      position: { x: t.x, y: t.y },
      data: { label: t.label, w: t.w, h: t.h },
      draggable: false,
      selectable: false,
      zIndex: 0,
    })),
    ...SERVICES.map((s) => {
      const [x, y] = layout.pos[s.id];
      return {
        id: s.id,
        type: 'service',
        position: { x, y },
        data: {
          ...s,
          label: layout.short ? s.shortLabel : s.label,
          sub: layout.short ? s.shortSub : s.sub,
          w: layout.widths?.[s.id],
        },
        draggable: false,
        selectable: false,
        zIndex: 1,
      };
    }),
  ];

  const edges = layout.edges.map(([source, target, sh, th, color]) => ({
    id: `${source}-${target}`,
    source,
    target,
    sourceHandle: sh,
    targetHandle: `t-${th}`,
    type: 'smoothstep',
    animated: true,
    style: { stroke: color ?? TELEMETRY, strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: color ?? TELEMETRY, width: 14, height: 14 },
  }));

  return { nodes, edges };
}

export default function K9Flow({ variant = 'wide' }) {
  const layout = variant === 'tall' ? TALL : WIDE;
  const { nodes, edges } = build(layout);

  return (
    <div style={{ height: layout.height }} aria-hidden="true">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.03 }}
        // Every interaction off: this is a drawing, not a canvas. Without
        // preventScrolling={false} the graph eats wheel and touch events and
        // the page stops scrolling wherever the diagram is.
        preventScrolling={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: false }}
      />
    </div>
  );
}
