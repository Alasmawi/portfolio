import Reveal from './Reveal';

// One header for every section, so they share an edge, a rhythm and a type
// scale. Each section used to build its own, and they drifted: Projects put
// its padding inside the max-width box instead of outside it, which set its
// heading 56px right of every other heading on the page.
//
// The index is the section's place in the page, in the accent, followed by a
// hairline and the section's name — the eyebrow reads as a label on a drawing,
// not as decoration.
export default function SectionHeader({ index, eyebrow, title, lead, children, className = '' }) {
  return (
    <Reveal className={className}>
      <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        <span className="tabular-nums text-accent-body">{index}</span>
        <span className="h-px w-8 bg-white/20" aria-hidden="true" />
        {eyebrow}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
        <div>
          <h2 className="max-w-[24ch] text-balance text-[32px] font-medium leading-[1.08] tracking-[-0.025em] text-text-primary md:text-[42px]">
            {title}
          </h2>
          {lead && (
            <p className="mt-4 max-w-[58ch] text-pretty text-[15.5px] leading-relaxed text-text-primary/72 md:text-base">
              {lead}
            </p>
          )}
        </div>
        {children}
      </div>
    </Reveal>
  );
}

// The horizontal frame every section sits in. Padding outside, max-width
// inside, so every section's content starts on the same x.
export const FRAME = 'mx-auto w-full max-w-6xl';
export const SECTION_PAD = 'px-5 sm:px-10 md:px-14';
