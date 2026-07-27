import { SoftCloud, TechCloud } from './CloudShapes';

const CLOUDS = [
  { Comp: SoftCloud, left: '2%', top: '10%', size: 150, opacity: 0.5, color: '#3E6FA3' },
  { Comp: TechCloud, left: '11%', top: '-6%', size: 110, opacity: 0.42, color: '#5B8FC4' },
  { Comp: SoftCloud, left: '20%', top: '0%', size: 210, opacity: 0.55, color: '#4C7EB3' },
  { Comp: SoftCloud, left: '36%', top: '14%', size: 130, opacity: 0.36, color: '#2E5680' },
  { Comp: TechCloud, left: '45%', top: '-8%', size: 130, opacity: 0.4, color: '#8FC4F0' },
  { Comp: SoftCloud, left: '55%', top: '2%', size: 220, opacity: 0.58, color: '#5B8FC4' },
  { Comp: SoftCloud, left: '70%', top: '16%', size: 140, opacity: 0.38, color: '#2E5680' },
  { Comp: TechCloud, left: '78%', top: '-4%', size: 120, opacity: 0.42, color: '#B7DCFA' },
  { Comp: SoftCloud, left: '87%', top: '4%', size: 190, opacity: 0.54, color: '#3E6FA3' },
  { Comp: SoftCloud, left: '96%', top: '18%', size: 130, opacity: 0.36, color: '#4C7EB3' },
];

export default function CloudHorizon() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-48 overflow-hidden sm:h-60"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="absolute cursor-default pointer-events-auto transition-transform duration-300 ease-out will-change-transform hover:z-10 hover:scale-125 hover:opacity-100"
          style={{ left: c.left, top: c.top, color: c.color, opacity: c.opacity }}
        >
          <c.Comp size={c.size} />
        </div>
      ))}
    </div>
  );
}
