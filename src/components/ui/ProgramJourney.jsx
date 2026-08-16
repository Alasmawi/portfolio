import { REBOOT_JOURNEY } from '../../data/rebootJourney';

// The 01Edu program isn't semester-based like UOB, so it gets its own
// visual shape: a two-stage connected timeline rather than the credit-bar
// module built for a transcript. Status reads as a color (dim = done,
// accent = current) before it reads as text, keeping this glanceable on
// mobile rather than another block of prose. Takes the institution's own
// accent color rather than a hardcoded one, matching Education's
// per-school color coding.
export default function ProgramJourney({ color = '#1CCFC9' }) {
  return (
    <div className="mt-4 flex gap-0">
      {REBOOT_JOURNEY.map((stage, i) => (
        <div key={stage.id} className="flex flex-1 flex-col">
          <div className="flex items-center">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                stage.status === 'active' ? 'animate-pulse' : 'opacity-50'
              }`}
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            {i < REBOOT_JOURNEY.length - 1 && (
              <span
                className="h-px flex-1"
                style={{ backgroundColor: `${color}40` }}
                aria-hidden="true"
              />
            )}
          </div>
          <div className="mt-2.5 pr-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-primary">
              {stage.phase}
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-text-dim">
              {stage.duration}
              {stage.status === 'active' && (
                <span className="ml-1.5" style={{ color }}>
                  · current
                </span>
              )}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {stage.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
