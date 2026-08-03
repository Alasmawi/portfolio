// Replaces the drifting cloud band at the top of the hero. Nothing here slides
// sideways: it's a faceted angular horizon with hard edges, square nodes and
// vertical signal traces, so the header reads sharp rather than soft.

// viewBox aspect is kept close to the container's so `slice` barely crops and
// the ridge renders at its true, shallow proportions.
const VB_W = 1200;
const VB_H = 180;

// Two ridges; the back one shallower, for depth without any motion.
const BACK = [
  [0, 96], [138, 74], [246, 92], [372, 66], [498, 88], [624, 60],
  [742, 84], [880, 68], [1006, 90], [1120, 70], [1200, 86],
];
const FRONT = [
  [0, 128], [96, 104], [188, 122], [286, 88], [380, 116], [486, 82],
  [578, 118], [682, 96], [788, 124], [890, 92], [998, 118], [1104, 88], [1200, 112],
];

// Peaks of the front ridge — the local minima, where the nodes sit.
const NODES = [FRONT[3], FRONT[5], FRONT[7], FRONT[9], FRONT[11]];

const pts = (a) => a.map(([x, y]) => `${x},${y}`).join(' ');
// The band between the top edge and a ridge line.
const band = (a) => `0,0 ${VB_W},0 ${pts([...a].reverse())}`;

export default function SharpHorizon() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 overflow-hidden sm:h-60"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full"
      >
        <polygon points={band(BACK)} fill="#16324f" fillOpacity="0.32" />
        <polyline
          points={pts(BACK)}
          fill="none"
          stroke="#4FA3C4"
          strokeOpacity="0.28"
          strokeWidth="1"
        />

        <polygon points={band(FRONT)} fill="#0B1E3B" fillOpacity="0.4" />
        <polyline
          points={pts(FRONT)}
          fill="none"
          stroke="#6FC3E4"
          strokeOpacity="0.5"
          strokeWidth="1.25"
        />

        {/* vertical signal traces dropping from each peak */}
        {NODES.map(([x, y]) => (
          <line
            key={`t${x}`}
            x1={x}
            y1={y}
            x2={x}
            y2={VB_H}
            stroke="#4FA3C4"
            strokeOpacity="0.13"
            strokeWidth="1"
          />
        ))}

        {/* square nodes — squares read sharper than dots at this scale */}
        {NODES.map(([x, y], i) => (
          <rect
            key={`n${x}`}
            x={x - 2.5}
            y={y - 2.5}
            width="5"
            height="5"
            fill={i === 1 || i === 3 ? '#F2A93B' : '#6FC3E4'}
            fillOpacity="0.85"
            className="sharp-node"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
