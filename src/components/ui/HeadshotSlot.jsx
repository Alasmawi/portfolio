import { useState } from 'react';
import { ImagePlus } from 'lucide-react';

const SRC = '/headshot.jpg';

export default function HeadshotSlot() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="relative flex aspect-square w-full max-w-[220px] flex-col items-center justify-center gap-2 self-end border border-dashed border-base-border/80 bg-base-surface/30 text-text-dim">
        <span className="absolute left-2 top-2 h-2 w-2 border-l border-t border-text-dim/40" />
        <span className="absolute right-2 top-2 h-2 w-2 border-r border-t border-text-dim/40" />
        <span className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-text-dim/40" />
        <span className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-text-dim/40" />
        <ImagePlus size={22} />
        <span className="font-mono text-[10px] uppercase tracking-wider">
          headshot.jpg
        </span>
      </div>
    );
  }

  return (
    <div className="aspect-square w-full max-w-[220px] self-end overflow-hidden border border-base-border bg-base-surface/30">
      <img
        src={SRC}
        alt="Abdulla Alasmawi"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
