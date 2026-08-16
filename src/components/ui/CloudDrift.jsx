import './CloudDrift.css';

// Actual cloud shapes, not abstract lines or vague smudges: each "cloud" is
// a small cluster of overlapping circles (the standard cloud-icon
// technique — a single blurred ellipse just reads as a light smudge, three
// overlapping ones reads as a puffy silhouette), lit warm at the edges
// (the site's gold accent) rather than flat white or blue. Pure CSS
// (radial gradients + blur + keyframe drift), no canvas/WebGL: cheap
// enough to run smoothly on any phone.
const CLOUDS = [
  {
    top: '6%', left: '2%', scale: 1.1, anim: 'drift-a', dur: '42s',
    puffs: [
      { x: 0, y: 20, r: 90, c: 'rgba(233,225,210,0.34)' },
      { x: 70, y: 0, r: 110, c: 'rgba(233,225,210,0.30)' },
      { x: 150, y: 25, r: 80, c: 'rgba(242,169,59,0.22)' },
    ],
  },
  {
    top: '14%', left: '58%', scale: 1.3, anim: 'drift-b', dur: '50s',
    puffs: [
      { x: 0, y: 15, r: 100, c: 'rgba(242,169,59,0.18)' },
      { x: 90, y: -5, r: 130, c: 'rgba(233,225,210,0.28)' },
      { x: 190, y: 20, r: 90, c: 'rgba(233,225,210,0.26)' },
    ],
  },
  {
    top: '48%', left: '10%', scale: 1, anim: 'drift-c', dur: '36s',
    puffs: [
      { x: 0, y: 10, r: 80, c: 'rgba(233,225,210,0.24)' },
      { x: 60, y: -10, r: 95, c: 'rgba(233,225,210,0.22)' },
      { x: 130, y: 15, r: 70, c: 'rgba(242,169,59,0.16)' },
    ],
  },
  {
    top: '58%', left: '62%', scale: 1.2, anim: 'drift-a', dur: '58s',
    puffs: [
      { x: 0, y: 20, r: 85, c: 'rgba(242,169,59,0.15)' },
      { x: 75, y: 0, r: 105, c: 'rgba(233,225,210,0.22)' },
      { x: 160, y: 20, r: 75, c: 'rgba(233,225,210,0.20)' },
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
