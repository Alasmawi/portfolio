import Reveal from './Reveal';

export default function SectionHeader({ index, id, title, region }) {
  return (
    <Reveal
      as="div"
      className="mb-12 grid grid-cols-1 gap-4 md:mb-16 md:grid-cols-12 md:items-end md:gap-8"
    >
      <div className="flex items-center gap-3 md:col-span-3">
        <span className="font-mono text-xs text-text-dim">// {index}</span>
        <span className="rounded border border-base-border px-2 py-1 font-mono text-xs uppercase tracking-wider text-amber">
          [ {id} ]
        </span>
      </div>
      <div className="md:col-span-9">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-5xl">
          {title}
        </h2>
        {region && (
          <p className="mt-2 font-mono text-xs text-text-dim">{region}</p>
        )}
      </div>
    </Reveal>
  );
}
