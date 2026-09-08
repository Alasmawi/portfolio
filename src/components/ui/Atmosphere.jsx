// The page's ground light: rose and amber orbs behind a faint grid, painted
// once for the whole document rather than per section.
//
// Fixed, not absolute. A fixed layer is composited once and never repaints
// while the page scrolls over it, which is also where the parallax comes from
// — the light stays put and the content moves through it. Absolute orbs would
// repaint on every section that carried them, and the mock-ups carry a set per
// section.
//
// `contain: strict` walls the layer off from the rest of the page's layout,
// style and paint work: nothing inside it can affect anything outside, so the
// browser never has to consider it when the content above reflows.
//
// The blur radii are large (46–60px) and the elements are large with them. Two
// of the four are desktop-only — on a 390px screen the third and fourth orbs
// overlap the first two almost entirely, so they cost a full-screen blurred
// layer each to change nothing you can see.
export default function Atmosphere() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ contain: 'strict' }}
    >
      {/* Rose, top left — behind the headline. */}
      <div
        className="atmosphere-orb absolute -left-[14%] -top-[34%] h-[760px] w-[820px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(224,122,154,.42), rgba(224,122,154,0) 66%)',
          filter: 'blur(46px)',
          animation: 'orb-drift 30s ease-in-out infinite',
        }}
      />
      {/* Amber, top right — the warm counterweight, and the reason the nav
          pill's right half refracts gold. */}
      <div
        className="atmosphere-orb absolute -right-[18%] -top-[18%] h-[720px] w-[760px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(240,164,72,.3), rgba(240,164,72,0) 64%)',
          filter: 'blur(52px)',
          animation: 'orb-drift 36s ease-in-out infinite reverse',
        }}
      />
      {/* Teal, low and faint. The signal colour appears once in the ground so
          the status dots elsewhere don't read as foreign. Desktop only. */}
      <div
        className="atmosphere-orb absolute -bottom-[36%] left-[26%] hidden h-[700px] w-[900px] rounded-full md:block"
        style={{
          background:
            'radial-gradient(circle, rgba(79,209,197,.14), rgba(79,209,197,0) 68%)',
          filter: 'blur(60px)',
          animation: 'orb-drift 42s ease-in-out infinite',
        }}
      />
      {/* Rose again, bottom left, to keep the lower half of a tall page from
          going flat. Desktop only. */}
      <div
        className="atmosphere-orb absolute -bottom-[24%] -left-[16%] hidden h-[720px] w-[780px] rounded-full md:block"
        style={{
          background:
            'radial-gradient(circle, rgba(224,122,154,.24), rgba(224,122,154,0) 68%)',
          filter: 'blur(54px)',
          animation: 'orb-drift 34s ease-in-out infinite reverse',
        }}
      />
      {/* The grid. Two 1px gradients at 72px — a drafting sheet under the
          diagrams, not a texture. It sits over the orbs so the light reads as
          coming from behind the paper. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(253,243,244,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(253,243,244,.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  );
}
