import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';

const EDUCATION = [
  {
    school: 'University of Bahrain',
    degree: 'B.Sc. Computer Science (Cloud Computing)',
    period: '2022 — 2026',
    accentColor: '#7A3324',
    dotColor: '#C9A227',
  },
  {
    school: 'Reboot Coding Institute',
    degree: 'Full Stack Development',
    period: '2024 — 2026',
    accentColor: '#1CCFC9',
    dotColor: '#1CCFC9',
  },
];

export default function Education() {
  return (
    <section
      id="education"
      className="border-b border-base-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="05"
          id="education"
          title="Education"
          region="~/education"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {EDUCATION.map((edu, i) => (
            <Reveal key={edu.school} delay={i * 0.1}>
              <div
                style={{ '--accent': edu.accentColor }}
                className="border border-l-2 border-base-border border-l-transparent bg-base-surface/40 p-6 transition-all hover:border-l-[var(--accent)] hover:bg-base-surface/70 hover:shadow-[0_0_0_1px_var(--accent),0_0_24px_-6px_var(--accent)]"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-text-dim">{edu.period}</p>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: edu.dotColor }}
                  />
                </div>
                <h3
                  className="mt-2 text-lg font-semibold"
                  style={{ color: edu.dotColor }}
                >
                  {edu.school}
                </h3>
                <p className="mt-1 text-sm text-text-muted">{edu.degree}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
