import Reveal from './ui/Reveal';
import pfp from '../assets/pfp-nobg.webp';

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-base-bg px-5 py-11 sm:px-10 sm:py-14 md:px-14 md:py-20">
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
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[200px] md:w-[420px]"
        style={{
          background: 'linear-gradient(270deg, rgba(22,24,38,0), rgba(22,24,38,.7) 62%, rgba(22,24,38,.96))',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            // 04 [ about ]
          </p>
          <h2 className="max-w-[22ch] text-4xl font-medium leading-[1.08] tracking-tight text-text-primary md:text-[46px]">
            I like the problems that{' '}
            <span className="relative whitespace-nowrap">
              don&apos;t
              <span
                className="absolute -bottom-1.5 left-0 right-0 h-0.5"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(145,132,217,0), #9184d9 18%, #9184d9 82%, rgba(145,132,217,0))',
                }}
              />
            </span>{' '}
            get to fail.
          </h2>
          <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-text-primary/84 md:text-[16px]">
            A schema that has to still make sense in a year. An API that stays cheap when traffic
            triples. A screen someone uses all day without thinking about it. That&apos;s the work.
          </p>
        </Reveal>

        <div className="mt-9 grid gap-9 md:mt-11 md:max-w-[900px] md:grid-cols-[220px_1fr] md:items-start">
          <Reveal delay={0.1}>
            <div className="relative mx-auto h-[220px] w-[176px] md:mx-0 md:h-[270px] md:w-full">
              <div
                className="pointer-events-none absolute -left-6 -right-6 top-6 -bottom-3.5"
                style={{
                  background: 'radial-gradient(50% 44% at 50% 62%, rgba(145,132,217,.22), rgba(145,132,217,0) 74%)',
                }}
              />
              <img
                src={pfp}
                alt="Abdulla Alasmawi"
                className="relative block h-full w-full object-contain object-bottom"
                style={{ mixBlendMode: 'lighten' }}
              />
              <div
                className="absolute bottom-0 left-1 right-1 h-px"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(145,132,217,0), rgba(145,132,217,.55) 22%, rgba(145,132,217,.55) 78%, rgba(145,132,217,0))',
                }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="max-w-[48ch] text-[15.5px] leading-relaxed text-text-primary/80">
              Full-stack product work on AWS — schema, API, front end, deploy. The computer-science
              half isn&apos;t decoration: I&apos;ve written an HTTP server straight onto epoll, a Unix
              shell with no external binaries, and a ray tracer from first principles, which is why I
              can go a layer down when a framework stops explaining itself.
            </p>
            <p className="mt-4 max-w-[48ch] text-[15.5px] leading-relaxed text-text-primary/80">
              AI shows up where it earns its place — retrieval that cites its sources, anomaly
              detection on sensor data — rather than as the headline.
            </p>
            <div className="mt-6 grid max-w-[46ch] gap-3">
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
              <a href="#contact" className="btn btn-primary">
                Get in touch
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
