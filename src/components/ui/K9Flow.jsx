import { memo, useEffect } from 'react';
import { ReactFlow, Handle, Position, MarkerType, useReactFlow } from '@xyflow/react';
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
import { CANVAS } from './k9Geometry';

// K9 Pavlov's data path.
//
// It is deliberately a *static* canvas: every interaction is off, including
// `preventScrolling`, so the diagram never swallows a scroll or a pinch. On a
// phone an interactive canvas in the middle of a page is a trap — you try to
// scroll past it and instead pan the graph.
//
// Loaded lazily by K9Architecture.jsx: React Flow is ~58kB gzipped and this is
// the only thing on the site that uses it.
//
// Both layouts flow top-to-bottom. An earlier version ran the wide one
// left-to-right, which needs five card columns — ~650–950px — against a
// container that measures 342–838px depending on where the projects sidebar
// falls. fitView duly shrank it: 0.60 at a 1024px viewport, 0.35 at 768px,
// which is the "funky and isn't clear" everyone was looking at. Flowing
// downwards and spending the spare width on rows instead of ranks lets both
// layouts sit at scale 1.0. See k9Geometry.js for the measurements.

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

// Handles are named `<side>` for the centred one and `<side>L`/`<side>R` for a
// pair set in from the corners. The offset pair is what keeps three edges
// converging on one card from stacking into a single point — which is what
// turned the device-to-gateway fan into a knot of overlapping rectangles.
const SIDES = {
  Top: { position: Position.Top },
  Right: { position: Position.Right },
  Bottom: { position: Position.Bottom },
  Left: { position: Position.Left },
  TopL: { position: Position.Top, style: { left: '24%' } },
  TopR: { position: Position.Top, style: { left: '76%' } },
  BotL: { position: Position.Bottom, style: { left: '30%' } },
  BotR: { position: Position.Bottom, style: { left: '70%' } },
};

const HIDDEN_HANDLE = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: 0,
};

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
        width: data.w,
      }}
    >
      {Object.entries(SIDES).map(([name, { position, style }]) => (
        <Handle
          key={`s-${name}`}
          type="source"
          id={`s-${name}`}
          position={position}
          isConnectable={false}
          style={{ ...HIDDEN_HANDLE, ...style }}
        />
      ))}
      {Object.entries(SIDES).map(([name, { position, style }]) => (
        <Handle
          key={`t-${name}`}
          type="target"
          id={`t-${name}`}
          position={position}
          isConnectable={false}
          style={{ ...HIDDEN_HANDLE, ...style }}
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
    {/* Indented past the live-status lane, which runs down the left margin
        and otherwise clips the first letter of "Handler". */}
    <div className="pl-8 pr-3 pt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
      {data.label}
    </div>
  </div>
));
TierNode.displayName = 'TierNode';

/* One edge is not a neighbour hop: IoT Core pushes live status straight to the
   dashboard, past every processing step in between. Routed by smoothstep it
   took the shortest path, which ran it *underneath* Lambda and DynamoDB and
   read as those services feeding the dashboard.

   So it gets an explicit lane down the left margin instead — a margin the
   layouts keep clear on purpose. `data.lane` is the x of that lane. */
const LaneEdge = memo(({ sourceX, sourceY, targetX, targetY, data, style, markerEnd }) => {
  const x = data.lane;
  const r = 9;
  const d = [
    `M ${sourceX},${sourceY}`,
    `L ${x + r},${sourceY}`,
    `Q ${x},${sourceY} ${x},${sourceY + r}`,
    `L ${x},${targetY - r}`,
    `Q ${x},${targetY} ${x + r},${targetY}`,
    `L ${targetX},${targetY}`,
  ].join(' ');
  return <path d={d} fill="none" className="react-flow__edge-path" style={style} markerEnd={markerEnd} />;
});
LaneEdge.displayName = 'LaneEdge';

const nodeTypes = { service: ServiceNode, tier: TierNode };
const edgeTypes = { lane: LaneEdge };

const SERVICES = {
  collar: { icon: 'collar', label: 'Smart collar', sub: 'ESP32-S3 · vitals' },
  node: { icon: 'node', label: 'Node-A', sub: 'ESP32-S3 · kennel' },
  scale: { icon: 'scale', label: 'Food scale', sub: 'ESP32 · load cell' },
  camera: { icon: 'camera', label: 'Reolink cam', sub: 'IP video', color: VIDEO },
  gateway: { icon: 'gateway', label: 'Pi 5', sub: 'IoT Greengrass' },
  iot: { icon: 'iot', label: 'IoT Core', sub: 'MQTT ingest' },
  video: { icon: 'video', label: 'Video ingest', sub: 'cloud-side', color: VIDEO },
  lambda: { icon: 'lambda', label: 'Lambda', sub: 'detection rules' },
  bedrock: { icon: 'bedrock', label: 'Bedrock', sub: 'explains a flag' },
  db: { icon: 'db', label: 'DynamoDB', sub: 'readings · events' },
  dashboard: { icon: 'dashboard', label: 'Dashboard', sub: 'React · REST' },
};

/* The topology, shared by both layouts — the two used to disagree, and the
   stacked one was missing the live-status push altogether.

   The shape that matters here is the diamond at the end. Lambda writes every
   reading and event to DynamoDB; only what it *flags* detours through Bedrock
   for a plain-language explanation, which lands in the same store. Drawing
   Bedrock inline — collar → … → Lambda → Bedrock → DynamoDB, as this did —
   says every reading is rewritten by a model before it is stored, which is not
   the system that was built. */
const TOPOLOGY = [
  { from: 'collar', to: 'gateway', out: 'Bottom', in: 'TopL' },
  { from: 'node', to: 'gateway', out: 'Bottom', in: 'Top' },
  { from: 'scale', to: 'gateway', out: 'Bottom', in: 'TopR' },
  { from: 'gateway', to: 'iot', out: 'Bottom', in: 'Top' },
  // The camera bypasses the gateway entirely and streams to AWS on its own.
  { from: 'camera', to: 'video', out: 'Bottom', in: 'Top', color: VIDEO },
  { from: 'iot', to: 'lambda', out: 'BotR', in: 'TopL' },
  { from: 'video', to: 'lambda', out: 'BotL', in: 'TopR', color: VIDEO },
  { from: 'lambda', to: 'db', out: 'BotL', in: 'TopR' },
  { from: 'lambda', to: 'bedrock', out: 'BotR', in: 'TopL' },
  { from: 'bedrock', to: 'db', out: 'Left', in: 'Right' },
  { from: 'db', to: 'dashboard', out: 'BotR', in: 'TopL' },
  // Live status skips the pipeline, so it gets the margin lane rather than a
  // route through the middle of the cloud tier.
  { from: 'iot', to: 'dashboard', out: 'Left', in: 'Left', type: 'lane' },
];

/* Geometry. Cards are placed by their horizontal *centre* rather than their
   left edge, and rows by their top — so a width change can't silently shove a
   card into its neighbour or off the canvas, which is how the hand-placed
   coordinates drifted in the first place. Both layouts keep a clear left
   margin for the live-status lane. */
// Rows are shared: a card sits at the same y in both layouts, so the two
// drawings are the same picture at two widths rather than two different
// pictures. The gaps between them are sized for the widest horizontal jog any
// edge has to make in that gap — squeezing a 130px jog into 17px of channel is
// what turned the device fan into a knot of overlapping rectangles.
const ROW = { device: 32, gateway: 118, ingest: 216, detect: 300, store: 384, client: 484 };

const TIERS = [
  { id: 'edge', label: 'Kennel · edge', y: 6, h: 172 },
  { id: 'cloud', label: 'AWS', y: 190, h: 256 },
  { id: 'client', label: 'Handler', y: 458, h: 88 },
];

const WIDE = {
  canvas: CANVAS.wide,
  lane: 16,
  // 124px holds "Reolink cam" but not "ESP32-S3 · vitals", so the wide device
  // row keeps the chip and drops the role — the icon already carries it.
  labels: {
    collar: ['Collar', 'ESP32-S3'],
    node: ['Node-A', 'ESP32-S3'],
    scale: ['Food scale', 'ESP32'],
    camera: ['Reolink', 'IP camera'],
  },
  // [centreX, topY, width]. Cards are placed by centre, not by left edge: a
  // width change then can't silently shove a card into its neighbour or off
  // the canvas, which is how the old hand-placed coordinates drifted.
  place: {
    collar: [70, ROW.device, 124],
    node: [210, ROW.device, 124],
    scale: [350, ROW.device, 124],
    camera: [490, ROW.device, 124],
    gateway: [210, ROW.gateway, 170],
    iot: [165, ROW.ingest, 170],
    video: [405, ROW.ingest, 150],
    lambda: [285, ROW.detect, 180],
    db: [165, ROW.store, 180],
    bedrock: [405, ROW.store, 170],
    dashboard: [285, ROW.client, 190],
  },
};

const COMPACT = {
  canvas: CANVAS.compact,
  lane: 8,
  labels: {
    collar: ['Collar', null],
    node: ['Node-A', null],
    scale: ['Scale', null],
    camera: ['Camera', 'video'],
    gateway: ['Pi 5', 'Greengrass'],
    iot: ['IoT Core', 'MQTT'],
    video: ['Video', 'cloud'],
    lambda: ['Lambda', 'detect'],
    bedrock: ['Bedrock', 'explains'],
    db: ['DynamoDB', 'store'],
    dashboard: ['Dashboard', 'React · live'],
  },
  // 300px has no room for a fourth card on the device row, so the camera drops
  // to the gateway's row — still outside the gateway's path, which is the only
  // thing that row has to say.
  place: {
    collar: [53, ROW.device, 94],
    node: [150, ROW.device, 94],
    scale: [247, ROW.device, 94],
    gateway: [79, ROW.gateway, 122],
    camera: [221, ROW.gateway, 122],
    iot: [87, ROW.ingest, 122],
    video: [218, ROW.ingest, 112],
    lambda: [150, ROW.detect, 150],
    // 126, not 118: "DynamoDB" needs 71px of text box and 118 leaves 66.
    db: [83, ROW.store, 126],
    bedrock: [225, ROW.store, 118],
    dashboard: [150, ROW.client, 168],
  },
};

function build(layout) {
  const nodes = [
    ...TIERS.map((t) => ({
      id: `tier-${t.id}`,
      type: 'tier',
      position: { x: 0, y: t.y },
      data: { label: t.label, w: layout.canvas.w, h: t.h },
      draggable: false,
      selectable: false,
      zIndex: 0,
    })),
    ...Object.entries(layout.place).map(([id, [cx, y, w]]) => {
      const s = SERVICES[id];
      const [label, sub] = layout.labels?.[id] ?? [s.label, s.sub];
      return {
        id,
        type: 'service',
        position: { x: Math.round(cx - w / 2), y },
        data: { ...s, label, sub, w },
        draggable: false,
        selectable: false,
        zIndex: 1,
      };
    }),
  ];

  const edges = TOPOLOGY.map(({ from, to, out, in: into, color, type }) => {
    const stroke = color ?? TELEMETRY;
    return {
      id: `${from}-${to}`,
      source: from,
      target: to,
      sourceHandle: `s-${out}`,
      targetHandle: `t-${into}`,
      type: type ?? 'smoothstep',
      animated: true,
      // smoothstep's default 20px offset is the stub it pushes out of a handle
      // before turning. Rows here are 33–52px apart, so at 20 the two stubs
      // plus the corner radii overrun the gap and the edge doubles back on
      // itself — the little hooks that made the old drawing look broken.
      pathOptions: { offset: 10, borderRadius: 8 },
      data: { lane: layout.lane },
      style: { stroke, strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke, width: 14, height: 14 },
    };
  });

  return { nodes, edges };
}

/* React Flow runs `fitView` once, on init. The projects panel changes width
   whenever the window does — and jumps 228px the moment the sidebar appears at
   768px — which left the graph at whatever zoom it happened to mount with.
   Refitting on container resize is what keeps it at 1:1. */
function RefitOnResize() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const pane = document.querySelector('.react-flow');
    if (!pane) return undefined;
    const ro = new ResizeObserver(() => fitView({ padding: 0.02 }));
    ro.observe(pane);
    return () => ro.disconnect();
  }, [fitView]);
  return null;
}

export default function K9Flow({ variant = 'wide' }) {
  const layout = variant === 'compact' ? COMPACT : WIDE;
  const { nodes, edges } = build(layout);

  return (
    <div style={{ height: layout.canvas.h }} aria-hidden="true">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.02 }}
        // Never enlarge past 1:1. The layouts are drawn at the size they are
        // meant to be read at; upscaling would just blur the card borders.
        minZoom={0.2}
        maxZoom={1}
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
      >
        <RefitOnResize />
      </ReactFlow>
    </div>
  );
}
