import { motion } from 'framer-motion';
import { Cpu, Cloud, Sparkles, LayoutDashboard } from 'lucide-react';

const STAGES = [
  { label: 'Sensor', sub: 'ESP32 / MQTT', Icon: Cpu },
  { label: 'AWS IoT Core', sub: 'ingestion', Icon: Cloud },
  { label: 'Lambda + Bedrock', sub: 'anomaly detection', Icon: Sparkles },
  { label: 'Dashboard', sub: 'live status', Icon: LayoutDashboard },
];

export default function ArchitectureDiagram() {
  return (
    <div className="relative border border-base-border bg-base-surface/60 p-6 sm:p-8">
      <p className="mb-8 font-mono text-xs uppercase tracking-wider text-text-dim">
        // data flow
      </p>

      <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div
          className="absolute left-6 top-[52px] hidden h-px bg-base-border sm:right-6 sm:block"
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-[52px] hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber shadow-glow-amber sm:block"
          aria-hidden="true"
          animate={{ left: ['3%', '97%'] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {STAGES.map(({ label, sub, Icon }, i) => (
          <div
            key={label}
            className="relative z-10 flex flex-1 flex-col items-start gap-3 sm:items-center sm:text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded border border-base-border bg-base-bg text-steel">
              <Icon size={20} />
            </div>
            <div>
              <p className="font-mono text-xs text-text-primary">{label}</p>
              <p className="font-mono text-[10px] text-text-dim">{sub}</p>
            </div>
            {i < STAGES.length - 1 && (
              <span className="font-mono text-xs text-text-dim sm:hidden">
                ↓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
