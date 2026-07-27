import { useMemo } from 'react';
import { TechCloud, SoftCloud } from './CloudShapes';

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
      duration: 38 + rand() * 30,
      delay: -(rand() * 60),
      opacity: 0.16 + rand() * 0.18,
    });
  }
  return clouds;
}

export default function SkyDrift({ count = 7, className = '' }) {
  const clouds = useMemo(() => buildClouds(count, 7), [count]);

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 h-[34%] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {clouds.map((c) => (
        <div
          key={c.id}
          className="drift-item"
          style={{
            top: `${c.top}%`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <div
            className="pointer-events-auto cursor-default transition-transform duration-300 ease-out will-change-transform hover:scale-125"
            style={{ color: '#8FC4F0', opacity: c.opacity }}
          >
            {c.tech ? <TechCloud size={c.size} /> : <SoftCloud size={c.size} />}
          </div>
        </div>
      ))}
    </div>
  );
}
