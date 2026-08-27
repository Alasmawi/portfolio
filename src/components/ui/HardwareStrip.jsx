// Phone-width stand-in for the 3D ring gallery: a static architecture figure
// with the hardware shots below it as a swipe strip. Turning a 3D turntable
// with a thumb on a 390px screen is all cost and no payoff, so the same six
// items are laid out flat instead — nothing is cut.
export default function HardwareStrip({ items = [] }) {
  if (!items.length) return null;
  const diagram = items.find((i) => i.type === 'diagram');
  const photos = items.filter((i) => i !== diagram);

  return (
    <div>
      {diagram && (
        <figure className="mb-4 rounded-lg border border-white/[0.14] bg-[#151d28] p-2">
          <img
            src={diagram.src}
            alt={diagram.alt ?? ''}
            loading="lazy"
            className="block w-full object-contain"
          />
        </figure>
      )}
      {photos.length > 0 && (
        <ul
          className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {photos.map((item) => (
            <li key={item.tag ?? item.src} className="shrink-0">
              <figure className="w-[132px]">
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  loading="lazy"
                  className="h-[100px] w-full rounded-md bg-[#dbe2e9] object-contain"
                />
                {item.tag && (
                  <figcaption className="mt-1 font-mono text-[10px] text-text-dim">
                    {item.tag}
                  </figcaption>
                )}
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
