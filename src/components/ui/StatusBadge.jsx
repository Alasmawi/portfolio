export default function StatusBadge({ label = 'available for work' }) {
  return (
    <div className="inline-flex items-center gap-2 rounded border border-base-border bg-base-surface/60 px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
      </span>
      <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}
