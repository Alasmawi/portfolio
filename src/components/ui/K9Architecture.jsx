// K9 Pavlov's real data path, drawn rather than photographed.
//
// Replaces a flat raster diagram that showed one generic "Sensor" going
// straight to IoT Core. The actual system has three things that picture left
// out: an edge tier (a Pi 5 running Greengrass, which three ESP32 devices
// report to), a second ingest path for camera video that bypasses the gateway
// entirely, and detection and explanation as two separate steps — Lambda
// flags the anomaly, Bedrock turns it into something a handler can read.
//
// Inline SVG rather than an image: sharp at any size, the labels are real text
// for screen readers and selection, it reflows to a stacked layout on phones,
// and it can carry the flow animation that shows direction of travel.

const TELEMETRY = '#9184d9'; // sensor path — the site's accent
const VIDEO = '#2FC2E8'; // camera path — distinct, so the two ingests read apart
const INK = '#e9e9ed';
const MUTED = '#a4a5b2';
const BAND = 'rgba(233,233,237,.14)';
const SANS = 'Inter, system-ui, sans-serif';
const MONO = "'JetBrains Mono', ui-monospace, monospace";

/* A box with an icon glyph, a name and an optional caption. The icons are
   drawn as paths rather than pulled from lucide: inside an SVG a component
   icon needs a foreignObject wrapper, which does not scale with the viewBox
   and clipped at small sizes. */
const ICONS = {
  collar: 'M8 1.6v6.2a2.6 2.6 0 1 0 2 0V1.6a1 1 0 0 0-2 0Z',
  chip: 'M4 4h8v8H4zM6.4 1.4v2M9.6 1.4v2M6.4 12.6v2M9.6 12.6v2M1.4 6.4h2M1.4 9.6h2M12.6 6.4h2M12.6 9.6h2',
  scale: 'M8 2v11M4 13h8M3 6h10M3 6 1.4 9.4h3.2ZM13 6l1.6 3.4h-3.2Z',
  camera: 'M2 4.6h3l1-1.6h4l1 1.6h3v8H2zM8 10.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z',
  server: 'M2.4 2.6h11.2v4H2.4zM2.4 9.4h11.2v4H2.4zM4.8 4.6h.02M4.8 11.4h.02',
  radio: 'M8 9.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM4.8 4.8a4.6 4.6 0 0 0 0 6.4M11.2 4.8a4.6 4.6 0 0 1 0 6.4M2.6 2.6a7.6 7.6 0 0 0 0 10.8M13.4 2.6a7.6 7.6 0 0 1 0 10.8',
  scan: 'M2 5.4V3.4a1.4 1.4 0 0 1 1.4-1.4h2M10.6 2h2A1.4 1.4 0 0 1 14 3.4v2M14 10.6v2a1.4 1.4 0 0 1-1.4 1.4h-2M5.4 14h-2A1.4 1.4 0 0 1 2 12.6v-2M4.8 8h6.4',
  lambda: 'M4 12.6 8.4 3.4l3.6 9.2M6.2 8.6h4',
  spark: 'M8 2.2 9.4 6.2 13.4 7.6 9.4 9 8 13 6.6 9 2.6 7.6 6.6 6.2ZM12.8 2.2l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3L11 4l1.3-.5Z',
  db: 'M8 2.2c3.1 0 5.4.9 5.4 2s-2.3 2-5.4 2-5.4-.9-5.4-2 2.3-2 5.4-2ZM2.6 4.2v7.6c0 1.1 2.3 2 5.4 2s5.4-.9 5.4-2V4.2M2.6 8c0 1.1 2.3 2 5.4 2s5.4-.9 5.4-2',
  monitor: 'M2 2.8h12v8H2zM6 13.2h4M8 10.8v2.4',
};

function Icon({ name, color, x, y }) {
  return (
    <path
      d={ICONS[name]}
      transform={`translate(${Number(x)} ${Number(y)})`}
      fill="none"
      stroke={color}
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Box({ x, y, w, h, icon, label, sub, color = TELEMETRY, size = 13 }) {
  // Coerced: JSX passes bare attributes as strings, and `"20" + 36` is "2036",
  // which flings every label thousands of units off-canvas.
  const X = Number(x);
  const Y = Number(y);
  const W = Number(w);
  const H = Number(h);
  const iy = Y + (H - 16) / 2;
  return (
    <g>
      <rect x={X} y={Y} width={W} height={H} rx="9" fill="rgba(15,17,28,.94)" stroke={`${color}66`} />
      <Icon name={icon} color={color} x={X + 11} y={iy} />
      <text x={X + 36} y={sub ? Y + H / 2 - 2 : Y + H / 2 + 4.5} fill={INK} fontSize={size} fontWeight="500" fontFamily={SANS}>
        {label}
      </text>
      {sub && (
        <text x={X + 36} y={Y + H / 2 + 13} fill={MUTED} fontSize={size - 2.5} fontFamily={MONO}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d, color = TELEMETRY, dashed = false }) {
  return (
    <>
      <path d={d} fill="none" stroke={`${color}38`} strokeWidth="1.5" strokeLinecap="round" />
      <path
        className="k9-flow"
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={dashed ? '2 7' : '5 11'}
      />
    </>
  );
}

const DESCRIPTION =
  'Three ESP32 devices — a smart collar, the Node-A kennel environmental sensor and a smart food scale — report to a Raspberry Pi 5 running AWS IoT Greengrass in the kennel. The gateway forwards telemetry to AWS IoT Core over MQTT. A Reolink IP camera streams video to AWS on its own path, bypassing the gateway. In the cloud, Lambda applies the detection rules and Amazon Bedrock turns anything it flags into a plain-language explanation. Readings and events are stored in DynamoDB and served to a React dashboard over REST, while live status is pushed straight from IoT Core.';

/* ---------------------------- wide ---------------------------- */
function Wide() {
  return (
    <svg viewBox="0 0 1000 400" className="block w-full" role="img" aria-label={DESCRIPTION}>
      <rect x="1" y="34" width="342" height="352" rx="12" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <rect x="355" y="34" width="418" height="352" rx="12" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <rect x="785" y="34" width="214" height="352" rx="12" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <text x="14" y="24" fill={MUTED} fontSize="10.5" letterSpacing="1.7" fontFamily={MONO}>KENNEL · EDGE</text>
      <text x="368" y="24" fill={MUTED} fontSize="10.5" letterSpacing="1.7" fontFamily={MONO}>AWS</text>
      <text x="798" y="24" fill={MUTED} fontSize="10.5" letterSpacing="1.7" fontFamily={MONO}>HANDLER</text>

      {/* three devices fan into the gateway */}
      <Flow d="M 196 80 C 232 80 216 150 240 154" />
      <Flow d="M 196 148 C 220 148 222 156 240 158" />
      <Flow d="M 196 216 C 232 216 216 168 240 164" />
      {/* gateway → IoT Core */}
      <Flow d="M 328 158 C 352 158 356 150 380 150" />
      {/* camera bypasses the gateway entirely */}
      <Flow d="M 196 310 C 280 310 300 306 380 306" color={VIDEO} dashed />
      {/* both ingests converge on the detection step */}
      <Flow d="M 528 150 C 548 150 552 130 572 126" />
      <Flow d="M 528 300 C 552 300 556 150 572 138" color={VIDEO} dashed />
      {/* detect → explain → store */}
      <Flow d="M 650 158 C 650 176 650 180 650 196" />
      <Flow d="M 650 244 C 650 262 650 266 650 282" />
      {/* store → dashboard, over REST */}
      <Flow d="M 728 306 C 776 306 782 240 800 216" />
      {/* live status skips the store and pushes from IoT Core along the top */}
      <Flow d="M 456 122 C 456 88 470 74 506 74 L 812 74 C 856 74 862 96 862 176" />

      <Box x={20} y={56} w={176} h={48} icon="collar" label="Smart collar" sub="ESP32-S3 · vitals" />
      <Box x={20} y={124} w={176} h={48} icon="chip" label="Node-A" sub="ESP32-S3 · kennel" />
      <Box x={20} y={192} w={176} h={48} icon="scale" label="Food scale" sub="ESP32 · load cell" />
      <Box x={20} y={286} w={176} h={48} icon="camera" label="Reolink cam" sub="video stream" color={VIDEO} />
      <Box x={240} y={134} w={88} h={48} icon="server" label="Pi 5" sub="Greengrass" size={12} />

      <Box x={380} y={126} w={148} h={48} icon="radio" label="IoT Core" sub="MQTT ingest" />
      <Box x={380} y={282} w={148} h={48} icon="scan" label="Video ingest" sub="cloud-side" color={VIDEO} />
      <Box x={572} y={110} w={156} h={48} icon="lambda" label="Lambda" sub="rules · detect" />
      <Box x={572} y={196} w={156} h={48} icon="spark" label="Bedrock" sub="explains it" />
      <Box x={572} y={282} w={156} h={48} icon="db" label="DynamoDB" sub="readings · events" />
      <Box x={800} y={176} w={168} h={48} icon="monitor" label="Dashboard" sub="React" />

      <text x="770" y="66" fill={MUTED} fontSize="10" textAnchor="end" fontFamily={MONO}>live status · pushed</text>
      <text x="744" y="286" fill={MUTED} fontSize="10" fontFamily={MONO}>API Gateway · REST</text>

      <g transform="translate(368 372)">
        <line x1="0" y1="0" x2="22" y2="0" stroke={TELEMETRY} strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="30" y="3.5" fill={MUTED} fontSize="10" fontFamily={MONO}>telemetry</text>
        <line x1="110" y1="0" x2="132" y2="0" stroke={VIDEO} strokeWidth="1.5" strokeDasharray="2 5" />
        <text x="140" y="3.5" fill={MUTED} fontSize="10" fontFamily={MONO}>video</text>
      </g>
    </svg>
  );
}

/* ---------------------------- narrow ---------------------------- */
function Tall() {
  return (
    <svg viewBox="0 0 320 600" className="block w-full" role="img" aria-label={DESCRIPTION}>
      <rect x="1" y="24" width="318" height="200" rx="11" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <rect x="1" y="242" width="318" height="258" rx="11" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <rect x="1" y="518" width="318" height="78" rx="11" fill="rgba(233,233,237,.02)" stroke={BAND} />
      <text x="12" y="17" fill={MUTED} fontSize="10" letterSpacing="1.6" fontFamily={MONO}>KENNEL · EDGE</text>
      <text x="12" y="235" fill={MUTED} fontSize="10" letterSpacing="1.6" fontFamily={MONO}>AWS</text>
      <text x="12" y="511" fill={MUTED} fontSize="10" letterSpacing="1.6" fontFamily={MONO}>HANDLER</text>

      {/* three chips fan down into the gateway */}
      <Flow d="M 58 80 C 58 98 116 96 138 110" />
      <Flow d="M 160 80 C 160 92 160 96 160 108" />
      <Flow d="M 262 80 C 262 98 204 96 182 110" />
      {/* gateway → IoT Core */}
      <Flow d="M 138 132 C 104 132 80 146 76 262" />
      {/* camera → video ingest */}
      <Flow d="M 262 200 C 262 226 244 232 244 262" color={VIDEO} dashed />
      {/* both ingests converge on the detection step */}
      <Flow d="M 76 304 C 76 322 130 318 146 332" />
      <Flow d="M 244 304 C 244 322 190 318 174 332" color={VIDEO} dashed />
      {/* detect → explain → store → dashboard */}
      <Flow d="M 160 370 C 160 380 160 384 160 394" />
      <Flow d="M 160 432 C 160 442 160 446 160 456" />
      <Flow d="M 160 494 C 160 510 160 518 160 532" />

      <Box x={16} y={38} w={84} h={42} icon="collar" label="Collar" sub="vitals" size={11.5} />
      <Box x={118} y={38} w={84} h={42} icon="chip" label="Node-A" sub="kennel" size={11.5} />
      <Box x={220} y={38} w={84} h={42} icon="scale" label="Scale" sub="food" size={11.5} />
      <Box x={106} y={108} w={108} h={42} icon="server" label="Pi 5" sub="Greengrass" size={11.5} />
      <Box x={204} y={158} w={100} h={42} icon="camera" label="Camera" sub="video" color={VIDEO} size={11.5} />

      <Box x={20} y={262} w={112} h={42} icon="radio" label="IoT Core" sub="MQTT" size={11.5} />
      <Box x={188} y={262} w={112} h={42} icon="scan" label="Video" sub="cloud" color={VIDEO} size={11.5} />
      <Box x={90} y={332} w={140} h={38} icon="lambda" label="Lambda" sub="detect" size={11.5} />
      <Box x={90} y={394} w={140} h={38} icon="spark" label="Bedrock" sub="explains" size={11.5} />
      <Box x={90} y={456} w={140} h={38} icon="db" label="DynamoDB" sub="store" size={11.5} />
      <Box x={86} y={532} w={148} h={42} icon="monitor" label="Dashboard" sub="React · live" size={11.5} />
    </svg>
  );
}

export default function K9Architecture() {
  return (
    <figure className="m-0 min-w-0">
      <div className="rounded-lg border border-white/[0.12] bg-[#10121d] p-2.5 sm:p-4">
        <div className="hidden sm:block">
          <Wide />
        </div>
        <div className="sm:hidden">
          <Tall />
        </div>
      </div>
      <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
        architecture · sensor to handler
      </figcaption>
    </figure>
  );
}
