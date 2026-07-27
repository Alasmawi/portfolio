import { useMemo } from 'react';
import { TechCloud, SoftCloud } from './CloudShapes';

const SYMBOLS = [
  '{ }',
  '</>',
  '01',
  '=>',
  '$_',
  '::',
  '[ ]',
  'λ',
  'AWS::Lambda',
  'GET /health',
  '200 OK',
  'curl -s',
  'func main()',
  'SELECT *',
  '#!/bin/sh',
  '01001',
  'const',
  'ssh',
];

const COLORS = ['#8B98A5', '#4FA3C4', '#F2A93B', '#5B6773'];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildItems(count) {
  const rand = seededRandom(42);
  const items = [];
  for (let i = 0; i < count; i++) {
    const roll = rand();
    const type = roll < 0.28 ? 'tech' : roll < 0.5 ? 'soft' : 'code';
    items.push({
      id: i,
      type,
      content: SYMBOLS[Math.floor(rand() * SYMBOLS.length)],
      left: rand() * 100,
      size: type === 'code' ? 11 + rand() * 6 : 22 + rand() * 34,
      duration: 22 + rand() * 26,
      delay: -(rand() * 40),
      opacity: type === 'code' ? 0.14 + rand() * 0.14 : 0.05 + rand() * 0.09,
      color: COLORS[Math.floor(rand() * COLORS.length)],
    });
  }
  return items;
}

export default function CloudCodeRain({ count = 34 }) {
  const items = useMemo(() => buildItems(count), [count]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="rain-item"
          style={{
            left: `${item.left}%`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            opacity: item.opacity,
            color: item.color,
          }}
        >
          {item.type === 'tech' && <TechCloud size={item.size} />}
          {item.type === 'soft' && <SoftCloud size={item.size} />}
          {item.type === 'code' && (
            <span
              className="whitespace-nowrap font-mono"
              style={{ fontSize: `${item.size}px` }}
            >
              {item.content}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
