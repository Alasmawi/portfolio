import pfp from '../../assets/pfp-nobg.webp';

export default function HeadshotSlot() {
  return (
    <div className="group relative aspect-square w-full max-w-[220px] self-end border border-base-border/70 bg-base-surface/15">
      <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 h-3 w-3 border-l border-t border-amber/60" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 z-10 h-3 w-3 border-r border-t border-amber/60" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 z-10 h-3 w-3 border-b border-l border-amber/60" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 z-10 h-3 w-3 border-b border-r border-amber/60" />

      <div className="relative h-full w-full overflow-hidden">
        <img
          src={pfp}
          alt="Abdulla Alasmawi"
          className="h-full w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      </div>
    </div>
  );
}
