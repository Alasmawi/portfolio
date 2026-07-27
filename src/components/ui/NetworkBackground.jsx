const NODES = [
  { x: 60, y: 80 },
  { x: 220, y: 40 },
  { x: 400, y: 120 },
  { x: 620, y: 60 },
  { x: 780, y: 160 },
  { x: 940, y: 90 },
  { x: 180, y: 260 },
  { x: 480, y: 300 },
  { x: 720, y: 320 },
  { x: 900, y: 260 },
];

const LINKS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [1, 6],
  [2, 7],
  [7, 8],
  [8, 9],
  [3, 8],
  [6, 7],
];

export default function NetworkBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-dot-grid [background-size:22px_22px] opacity-[0.35]" />
      <svg
        viewBox="0 0 1000 380"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full opacity-[0.28]"
        aria-hidden="true"
      >
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#4FA3C4"
            strokeWidth="1"
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i % 3 === 0 ? 4 : 3}
            fill={i % 4 === 0 ? '#F2A93B' : '#4FA3C4'}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-bg/40 to-base-bg" />
    </div>
  );
}
