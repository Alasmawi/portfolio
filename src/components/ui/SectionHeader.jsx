import Reveal from './Reveal';

// One header for every section: its name, set as large as a headline, and
// where it helps one line beside it. The name is the section's whole
// introduction, so it carries the weight a slogan used to.
export default function SectionHeader({ title, lead, children, className = '' }) {
  return (
    <Reveal className={className}>
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <h2 className="display text-[clamp(52px,10.5vw,148px)]">{title}</h2>
        {lead && (
          <p className="max-w-[40ch] text-pretty text-[15px] leading-relaxed opacity-70 md:pb-2 md:text-base">{lead}</p>
        )}
        {children}
      </div>
    </Reveal>
  );
}

// The horizontal frame every section sits in. Padding outside, max-width
// inside, so every section's content starts on the same x. The frame grows on
// large monitors rather than leaving a third of a wide screen empty.
export const FRAME = 'mx-auto w-full max-w-[1600px]';
export const SECTION_PAD = 'px-5 sm:px-8 lg:px-12';
// Vertical rhythm shared by the sections on the ink ground.
export const SECTION_Y = 'py-12 sm:py-16 lg:py-24';
