import Reveal from './ui/Reveal';
import pfp from '../assets/pfp-nobg.webp';

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden px-5 py-11 sm:px-10 sm:py-14 md:px-14 md:py-20">
      {/* The custom element positions *itself* — its script writes inline
          `position:absolute; inset:0` whenever its parent is positioned, which
          beats any utility class we'd put on the element. So the rail geometry
          lives on this wrapper and the helix just fills it. */}
      <div className="pointer-events-none absolute -top-5 -bottom-5 -right-4 w-[110px] opacity-40 md:-top-8 md:-bottom-8 md:right-2 md:w-[230px] md:opacity-100">
        {/* eslint-disable-next-line react/no-unknown-property */}
        <dna-helix
          axis="vertical"
          amplitude="86"
          spacing="24"
          font-size="12"
          speed="0.34"
          twist="0.0095"
          opacity="0.4"
          rungs="4"
          glyphs="symbols"
          aria-hidden="true"
        />
      </div>
      {/* Desktop only. The helix is 110px wide at 40% opacity on a phone and
          the copy never reaches it, so there was nothing to fade — and the
          overlay's own left edge was a straight vertical seam across the
          atmosphere behind it, which is more visible than the thing it was
          hiding. */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[420px] md:block"
        style={{
          // A fade, not a slab. At .96 this painted an opaque band down the
          // right of the section, and against the atmosphere layer behind it
          // that band had a visible vertical edge — the grid and the orb light
          // simply stopped. It only has to take the helix down far enough for
          // the copy to win, which .62 does.
          background: 'linear-gradient(270deg, rgb(18 5 9 / 0), rgb(18 5 9 / .38) 62%, rgb(18 5 9 / .62))',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // [ about ]
          </p>
          <h2 className="max-w-[22ch] text-4xl font-medium leading-[1.08] tracking-tight text-text-primary md:text-[46px]">
            I like the problems that{' '}
            <span className="relative whitespace-nowrap">
              don&apos;t
              <span
                className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(226,96,126,0), #e2607e 18%, #e2607e 82%, rgba(226,96,126,0))',
                }}
              />
            </span>{' '}
            get to fail.
          </h2>
          <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-text-primary/84 md:text-[16px]">
            A schema that still makes sense in a year. An API that stays cheap when traffic triples.
            That&apos;s the work.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-9 md:mt-11 md:max-w-[900px] md:grid-cols-[220px_1fr] md:items-start">
          <Reveal delay={0.1}>
            <div className="relative mx-auto h-[300px] w-[240px] sm:h-[260px] sm:w-[200px] md:mx-0 md:h-[270px] md:w-full">
              <div
                className="pointer-events-none absolute -left-6 -right-6 top-6 -bottom-3.5"
                style={{
                  background: 'radial-gradient(50% 44% at 50% 62%, rgba(226,96,126,.22), rgba(226,96,126,0) 74%)',
                }}
              />
              <img
                src={pfp}
                alt="Abdulla Alasmawi"
                className="relative block h-full w-full object-contain object-bottom"
                /* No mixBlendMode. It was `lighten`, which takes the lighter
                   of subject and ground per channel, so everything darker than
                   the page — the agal, the hair, the glasses frames — was
                   replaced by the page. The file has a real alpha channel, so
                   the blend was buying nothing.

                   The mask handles the other half: the subject is already
                   cropped at the shoulder in the source photo, so the cutout
                   ends in two hard straight edges. */
                style={{
                  maskImage:
                    'linear-gradient(to right, #000 82%, transparent 99%), linear-gradient(to bottom, #000 88%, transparent 100%)',
                  maskComposite: 'intersect',
                  WebkitMaskImage:
                    'linear-gradient(to right, #000 82%, transparent 99%), linear-gradient(to bottom, #000 88%, transparent 100%)',
                  WebkitMaskComposite: 'source-in',
                }}
              />
              <div
                className="absolute bottom-0 left-1 right-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(226,96,126,0), rgba(226,96,126,.55) 22%, rgba(226,96,126,.55) 78%, rgba(226,96,126,0))',
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-text-primary/80">
              Full-stack product work on AWS — schema, API, front end, deploy. Underneath it: an HTTP
              server on epoll, a Unix shell, a ray tracer, all written from scratch.
            </p>
            <div className="glass-pane mt-6 grid max-w-[46ch] gap-3 rounded-[22px] p-4 sm:p-5">
              <div className="grid gap-1 sm:grid-cols-[88px_1fr] sm:items-baseline sm:gap-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                  Good at
                </p>
                <p className="text-[14.5px] leading-snug text-text-primary">
                  Owning a feature from schema to screen without a handoff.
                </p>
              </div>
              <div className="grid gap-1 sm:grid-cols-[88px_1fr] sm:items-baseline sm:gap-4">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text-muted">
                  Bad at
                </p>
                <p className="text-[14.5px] leading-snug text-text-primary">
                  Leaving a dashboard alone once it works.
                </p>
              </div>
            </div>
            <div className="mt-7">
              {/* Glass, not a third rose fill. The hero opens with the filled
                  version of this exact action and Contact closes with it; this one
                  sits between them and only has to be reachable. Two filled
                  buttons were visible together at the About/Contact boundary. */}
              <a href="#contact" className="btn btn-ghost glass-control px-6">
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
