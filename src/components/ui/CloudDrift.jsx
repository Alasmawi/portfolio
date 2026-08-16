import './CloudDrift.css';

// Actual cloud shapes, not abstract lines or vague smudges: each "cloud" is
// a small cluster of overlapping circles (the standard cloud-icon
// technique — a single blurred ellipse just reads as a light smudge, three
// overlapping ones reads as a puffy silhouette), lit warm at the edges
// (the site's gold accent) rather than flat white or blue. Pure CSS
// (radial gradients + blur + keyframe drift), no canvas/WebGL: cheap
// enough to run smoothly on any phone. Opacity and drift range raised from
// a first pass that read as barely-there smudges rather than clouds.
const CLOUDS = [
  {
    top: '4%', left: '0%', scale: 1.15, anim: 'drift-a', dur: '26s',
    puffs: [
      { x: 0, y: 20, r: 95, c: 'rgba(233,225,210,0.55)' },
      { x: 70, y: 0, r: 115, c: 'rgba(233,225,210,0.50)' },
      { x: 150, y: 25, r: 85, c: 'rgba(242,169,59,0.38)' },
    ],
  },
  {
    top: '10%', left: '56%', scale: 1.35, anim: 'drift-b', dur: '32s',
    puffs: [
      { x: 0, y: 15, r: 105, c: 'rgba(242,169,59,0.32)' },
      { x: 90, y: -5, r: 135, c: 'rgba(233,225,210,0.48)' },
      { x: 190, y: 20, r: 95, c: 'rgba(233,225,210,0.45)' },
    ],
  },
  {
    top: '42%', left: '8%', scale: 1.05, anim: 'drift-c', dur: '22s',
    puffs: [
      { x: 0, y: 10, r: 85, c: 'rgba(233,225,210,0.42)' },
      { x: 60, y: -10, r: 100, c: 'rgba(233,225,210,0.38)' },
      { x: 130, y: 15, r: 75, c: 'rgba(242,169,59,0.28)' },
    ],
  },
  {
    top: '55%', left: '64%', scale: 1.25, anim: 'drift-a', dur: '36s',
    puffs: [
      { x: 0, y: 20, r: 90, c: 'rgba(242,169,59,0.26)' },
      { x: 75, y: 0, r: 110, c: 'rgba(233,225,210,0.40)' },
      { x: 160, y: 20, r: 80, c: 'rgba(233,225,210,0.36)' },
    ],
  },
  {
    top: '2%', left: '30%', scale: 0.9, anim: 'drift-c', dur: '28s',
    puffs: [
      { x: 0, y: 15, r: 75, c: 'rgba(233,225,210,0.40)' },
      { x: 55, y: -5, r: 90, c: 'rgba(233,225,210,0.36)' },
    ],
  },
  {
    top: '68%', left: '30%', scale: 1, anim: 'drift-b', dur: '30s',
    puffs: [
      { x: 0, y: 10, r: 80, c: 'rgba(242,169,59,0.24)' },
      { x: 60, y: -5, r: 95, c: 'rgba(233,225,210,0.34)' },
      { x: 125, y: 15, r: 70, c: 'rgba(233,225,210,0.30)' },
    ],
  },
];

export default function CloudDrift() {
  return (
    <div className="cloud-drift" aria-hidden="true">
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="cloud-drift__cloud"
          style={{
            top: cloud.top,
            left: cloud.left,
            '--s': cloud.scale,
            animation: `${cloud.anim} ${cloud.dur} ease-in-out infinite`,
          }}
        >
          {cloud.puffs.map((p, j) => (
            <div
              key={j}
              className="cloud-drift__puff"
              style={{
                left: p.x,
                top: p.y,
                width: p.r,
                height: p.r,
                background: `radial-gradient(circle at 35% 35%, ${p.c}, transparent 72%)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
