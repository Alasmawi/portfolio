import { useMemo, useRef } from 'react';
import { TechCloud, SoftCloud } from './CloudShapes';
import DraggableCloud from './DraggableCloud';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildClouds(count, seed) {
  const rand = seededRandom(seed);
  const clouds = [];
  for (let i = 0; i < count; i++) {
    clouds.push({
      id: i,
      tech: rand() < 0.45,
      top: rand() * 20,
      size: 30 + rand() * 46,
      duration: 22 + rand() * 26,
      delay: rand() * 44,
      opacity: 0.16 + rand() * 0.18,
    });
  }
  return clouds;
}

export default function SkyDrift({ count = 7, className = '' }) {
  const clouds = useMemo(() => buildClouds(count, 7), [count]);
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-x-0 top-0 h-[34%] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {clouds.map((c) => (
        <DraggableCloud
          key={c.id}
          Comp={c.tech ? TechCloud : SoftCloud}
          size={c.size}
          color="#8FC4F0"
          opacity={c.opacity}
          top={`${c.top}%`}
          duration={c.duration}
          delay={c.delay}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
