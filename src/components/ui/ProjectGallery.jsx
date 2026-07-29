import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram';

export default function ProjectGallery({ showArchitecture = false, images = [] }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const slideCount = (showArchitecture ? 1 : 0) + images.length;

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(slideCount - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {showArchitecture && (
          <div className="w-full shrink-0 snap-center">
            <ArchitectureDiagram />
          </div>
        )}
        {images.map((img) => (
          <div key={img.tag} className="w-full shrink-0 snap-center">
            <div className="relative flex h-full min-h-[300px] w-full items-center justify-center overflow-hidden border border-base-border bg-base-surface p-6 sm:min-h-[360px] sm:p-8">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="max-h-[260px] w-auto max-w-full object-contain sm:max-h-[300px]"
              />
              <span className="absolute bottom-3 left-3 rounded border border-base-border/80 bg-base-bg/80 px-2 py-1 font-mono text-[10px] text-text-dim backdrop-blur-sm">
                {img.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {slideCount > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollToIndex(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-base-border bg-base-bg/80 p-1.5 text-text-muted backdrop-blur-sm transition-colors hover:border-amber hover:text-amber disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(index + 1)}
            disabled={index === slideCount - 1}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-base-border bg-base-bg/80 p-1.5 text-text-muted backdrop-blur-sm transition-colors hover:border-amber hover:text-amber disabled:pointer-events-none disabled:opacity-0 sm:flex"
          >
            <ChevronRight size={16} />
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {Array.from({ length: slideCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to slide ${i + 1} of ${slideCount}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-4 bg-amber' : 'w-1.5 bg-base-border'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
