import { Terminal } from 'lucide-react';
import pfp from '../../assets/pfp-nobg.webp';

export default function HeadshotSlot({ compact = false, className = '' }) {
  return (
    <div
      className={`group w-full self-end border border-base-border/70 bg-base-surface/20 ${compact ? '' : 'max-w-[220px]'} ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b border-base-border/70 ${compact ? 'px-1.5 py-1' : 'px-2.5 py-1.5'}`}
      >
        <div className="flex items-center gap-1.5">
          <Terminal size={compact ? 9 : 11} className="text-amber" />
          {!compact && (
            <span className="font-mono text-[10px] text-text-dim">
              operator.jpg
            </span>
          )}
        </div>
        <span className="h-1.5 w-1.5 animate-pulse-slow rounded-full bg-ok" />
      </div>

      <div className="relative aspect-[5/6] w-full overflow-hidden">
        <img
          src={pfp}
          alt="Abdulla Alasmawi"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      </div>
    </div>
  );
}
