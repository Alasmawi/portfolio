import { useEffect, useRef, useState } from 'react';

// Bayyan's deployment, drawn. No React Flow here: it is a straight line with a
// fan-out at the end, which a grid of boxes says as well as a graph library and
// costs nothing to ship.
//
// Same colour rule as the K9 diagram: amber marks the hop every request passes
// through (nginx), everything else is a plain node.
const DESCRIPTION =
  'Browsers load a React front end with English and right-to-left Arabic layouts. Requests go through nginx to a NestJS API on the same Linux host, run under systemd. The API uses Prisma to store records in PostgreSQL, where each record’s billing cycle sets its renewal date and its status escalates from ok to warning to critical as that date approaches. Document attachments are kept in MinIO, and reports are produced as PDF through WeasyPrint and as Excel through ExcelJS.';

function Node({ title, sub, gate = false }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2.5 ${
        gate ? 'border-amber/60 bg-amber/[0.08]' : 'border-white/[0.14] bg-white/[0.045]'
      }`}
    >
      <p className={`text-[13px] font-medium leading-tight ${gate ? 'text-amber-bright' : 'text-text-primary'}`}>
        {title}
      </p>
      <p className="mt-0.5 font-mono text-[10.5px] leading-snug text-text-muted">{sub}</p>
    </div>
  );
}

function Arrow({ wide }) {
  return (
    <span className="flex items-center justify-center font-mono text-sm text-accent-body" aria-hidden="true">
      {wide ? '→' : '↓'}
    </span>
  );
}

export default function BayyanArchitecture() {
  const ref = useRef(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setWide(el.clientWidth >= 640);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="m-0 min-w-0">
      <div ref={ref} className="glass-pane rounded-2xl p-4 sm:p-5" aria-hidden="true">
        <div
          className={`grid items-center gap-2.5 ${
            wide ? 'grid-cols-[150px_20px_minmax(0,1fr)]' : 'grid-cols-1'
          }`}
        >
          <Node title="Browser" sub="React · English, Arabic (RTL)" />
          <Arrow wide={wide} />

          <div className="relative rounded-2xl border border-dashed border-white/20 px-3 pb-3 pt-5">
            <span className="absolute -top-2.5 left-3 rounded-full bg-base-bg px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
              Linux host · systemd
            </span>
            <div
              className={`grid items-center gap-2.5 ${
                wide ? 'grid-cols-[112px_20px_150px_20px_minmax(0,1fr)]' : 'grid-cols-1'
              }`}
            >
              <Node gate title="nginx" sub="reverse proxy" />
              <Arrow wide={wide} />
              <Node title="NestJS API" sub="Prisma · renewal rules" />
              <Arrow wide={wide} />
              <div className="grid gap-2">
                <Node title="PostgreSQL" sub="records and renewals" />
                <Node title="MinIO" sub="document attachments" />
                <Node title="Reports" sub="WeasyPrint PDF · ExcelJS" />
              </div>
            </div>
          </div>
        </div>

        {/* The rule the registry exists for, as the diagram's legend. */}
        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 border-t border-base-hairline pt-3 font-mono text-[10.5px] text-text-muted">
          <span>billing cycle → renewal date →</span>
          {[
            ['ok', '#8fd6c9'],
            ['warning', '#f0a448'],
            ['critical', '#ea5f70'],
          ].map(([label, c], i) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-text-dim">→</span>}
              <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: c }} />
              <span style={{ color: c }}>{label}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{DESCRIPTION}</p>
      <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
        request to record
      </figcaption>
    </figure>
  );
}
