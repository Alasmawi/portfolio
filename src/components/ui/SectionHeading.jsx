import Reveal from './Reveal';

// Every section opens the same way, and this is the only place that shape is
// written down.
//
// It wasn't, until now. Four of the six sections carried a `// [ name ]`
// eyebrow and two didn't; the eyebrow was 11px in three of them and 11.5px in
// the fourth; the margin under it was mb-4 twice and mb-5 twice. None of that
// is visible as a bug on any single screen — it shows up as the page feeling
// assembled rather than laid out, which is exactly the kind of drift a shared
// component stops.
//
// `lead` is for the one section that opens at a larger size (About, which is
// the page's only first-person statement and reads as the turn in the
// argument). Everything else takes the default.
export default function SectionHeading({ label, title, lede, size = 'default' }) {
  return (
    <Reveal>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
        {`// [ ${label} ]`}
      </p>
      <h2
        className={
          size === 'lead'
            ? 'max-w-[22ch] text-4xl font-medium leading-[1.08] tracking-tight text-text-primary md:text-[46px]'
            : 'max-w-[26ch] text-3xl font-medium leading-[1.12] tracking-tight text-text-primary md:text-[38px]'
        }
      >
        {title}
      </h2>
      {lede && (
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-text-primary/70">{lede}</p>
      )}
    </Reveal>
  );
}
