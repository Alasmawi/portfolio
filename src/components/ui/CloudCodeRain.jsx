import { useMemo } from 'react';
import {
  Binary,
  Boxes,
  Cpu,
  Database,
  GitBranch,
  Radio,
  Server,
  Wifi,
} from 'lucide-react';
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

const TECH_GLYPHS = ['Go', 'Py', 'JS', 'AWS', 'ESP32', 'MQTT', 'SQL', 'C++'];

const TECH_ICONS = [Cpu, Database, GitBranch, Server, Boxes, Radio, Wifi, Binary];

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
    const type =
      roll < 0.22 ? 'tech' : roll < 0.4 ? 'soft' : roll < 0.56 ? 'icon' : roll < 0.72 ? 'glyph' : 'code';
    items.push({
      id: i,
      type,
      content: SYMBOLS[Math.floor(rand() * SYMBOLS.length)],
      glyph: TECH_GLYPHS[Math.floor(rand() * TECH_GLYPHS.length)],
      Icon: TECH_ICONS[Math.floor(rand() * TECH_ICONS.length)],
      left: rand() * 100,
      size:
        type === 'code' || type === 'glyph'
          ? 11 + rand() * 6
          : type === 'icon'
            ? 16 + rand() * 10
            : 22 + rand() * 34,
      duration: 22 + rand() * 26,
      delay: -(rand() * 40),
      opacity:
        type === 'code' || type === 'glyph'
          ? 0.14 + rand() * 0.14
          : type === 'icon'
            ? 0.12 + rand() * 0.14
            : 0.05 + rand() * 0.09,
      color: COLORS[Math.floor(rand() * COLORS.length)],
    });
  }
  return items;
}

export default function CloudCodeRain({ count = 40 }) {
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
          {item.type === 'icon' && <item.Icon size={item.size} strokeWidth={1.6} />}
          {item.type === 'glyph' && (
            <span
              className="whitespace-nowrap rounded border px-1.5 py-0.5 font-mono font-semibold"
              style={{ fontSize: `${item.size}px`, borderColor: item.color }}
            >
              {item.glyph}
            </span>
          )}
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
