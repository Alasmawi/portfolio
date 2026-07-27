import { useRef } from 'react';
import { SoftCloud, TechCloud } from './CloudShapes';
import DraggableCloud from './DraggableCloud';

const CLOUDS = [
  { Comp: SoftCloud, left: '2%', top: '10%', size: 150, opacity: 0.5, color: '#3E6FA3', duration: 26, delay: -4 },
  { Comp: TechCloud, left: '11%', top: '-6%', size: 110, opacity: 0.42, color: '#5B8FC4', duration: 34, delay: -18 },
  { Comp: SoftCloud, left: '20%', top: '0%', size: 210, opacity: 0.55, color: '#4C7EB3', duration: 22, delay: -30 },
  { Comp: SoftCloud, left: '36%', top: '14%', size: 130, opacity: 0.36, color: '#2E5680', duration: 41, delay: -9 },
  { Comp: TechCloud, left: '45%', top: '-8%', size: 130, opacity: 0.4, color: '#8FC4F0', duration: 29, delay: -22 },
  { Comp: SoftCloud, left: '55%', top: '2%', size: 220, opacity: 0.58, color: '#5B8FC4', duration: 37, delay: -35 },
  { Comp: SoftCloud, left: '70%', top: '16%', size: 140, opacity: 0.38, color: '#2E5680', duration: 24, delay: -12 },
  { Comp: TechCloud, left: '78%', top: '-4%', size: 120, opacity: 0.42, color: '#B7DCFA', duration: 45, delay: -26 },
  { Comp: SoftCloud, left: '87%', top: '4%', size: 190, opacity: 0.54, color: '#3E6FA3', duration: 31, delay: -6 },
  { Comp: SoftCloud, left: '96%', top: '18%', size: 130, opacity: 0.36, color: '#4C7EB3', duration: 39, delay: -16 },
];

export default function CloudHorizon() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 overflow-hidden sm:h-60"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {CLOUDS.map((c, i) => (
        <DraggableCloud
          key={i}
          Comp={c.Comp}
          size={c.size}
          color={c.color}
          opacity={c.opacity}
          left={c.left}
          top={c.top}
          duration={c.duration}
          delay={c.delay}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}
