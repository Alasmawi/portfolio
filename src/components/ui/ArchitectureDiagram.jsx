import { motion } from 'framer-motion';
import { Cpu, Cloud, Sparkles, LayoutDashboard } from 'lucide-react';

const STAGES = [
  { label: 'Sensor', sub: 'ESP32 / MQTT', Icon: Cpu },
  { label: 'AWS IoT Core', sub: 'ingestion', Icon: Cloud },
  { label: 'Lambda + Bedrock', sub: 'anomaly detection', Icon: Sparkles },
  { label: 'Dashboard', sub: 'live status', Icon: LayoutDashboard },
];

function StageIcon({ Icon }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-base-border bg-base-bg text-steel">
      <Icon size={20} />
    </div>
  );
}

export default function ArchitectureDiagram() {
  return (
    <div className="relative border border-base-border bg-base-surface/60 p-6 sm:p-8">
      <p className="mb-8 font-mono text-xs uppercase tracking-wider text-text-dim">
        // data flow
      </p>

      {/* Mobile: vertical timeline */}
      <div className="relative sm:hidden">
        <div
          className="absolute bottom-6 left-6 top-6 w-px bg-base-border"
          aria-hidden="true"
        />
        <motion.div
          className="absolute left-6 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber shadow-glow-amber"
          aria-hidden="true"
          animate={{ top: ['3%', '97%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <div className="space-y-6">
          {STAGES.map(({ label, sub, Icon }) => (
            <div key={label} className="relative z-10 flex items-center gap-4">
              <StageIcon Icon={Icon} />
              <div>
                <p className="font-mono text-xs text-text-primary">{label}</p>
                <p className="font-mono text-[10px] text-text-dim">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tablet+: horizontal flow */}
      <div className="relative hidden sm:flex sm:items-center sm:justify-between">
        <div
          className="absolute left-6 right-6 top-6 h-px bg-base-border"
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-6 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber shadow-glow-amber"
          aria-hidden="true"
          animate={{ left: ['3%', '97%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        {STAGES.map(({ label, sub, Icon }) => (
          <div
            key={label}
            className="relative z-10 flex flex-col items-center gap-3 text-center"
          >
            <StageIcon Icon={Icon} />
            <div>
              <p className="font-mono text-xs text-text-primary">{label}</p>
              <p className="font-mono text-[10px] text-text-dim">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
