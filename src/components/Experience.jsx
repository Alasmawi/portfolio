import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';

const EXPERIENCE = [
  {
    role: 'Network & Information Security Intern',
    org: 'Bahrain Shura Council',
    period: 'Jul 2026 — Sep 2026',
    status: 'active',
    accentColor: '#CE1126',
    points: [
      'Administered Active Directory and Microsoft Intune device policy.',
      'Implemented Privileged Access Management (PAM) and BitLocker encryption policy.',
      'Managed OS/software patching across the fleet with ManageEngine.',
    ],
    tags: ['Active Directory', 'Intune', 'PAM', 'BitLocker', 'ManageEngine'],
  },
  {
    role: 'Cloud & IoT Intern',
    org: 'AWS Cloud Innovation Center (CIC)',
    period: 'Feb 2026 — Jun 2026',
    status: 'completed',
    accentColor: '#F2A93B',
    points: [
      'Built a smart IoT/cloud monitoring solution for the Bahrain Ministry of Interior’s Police K9 Unit.',
      'Implemented anomaly detection on sensor data using Amazon Bedrock.',
      'Shipped a centralized dashboard for real-time health and environment tracking.',
    ],
    tags: ['AWS IoT Core', 'Amazon Bedrock', 'Lambda', 'DynamoDB'],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="border-b border-base-border py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="02"
          id="experience"
          title="Experience"
          region="~/experience"
        />

        <div className="space-y-6">
          {EXPERIENCE.map((job, i) => (
            <Reveal key={job.org} delay={i * 0.1}>
              <div
                style={{ '--accent': job.accentColor }}
                className="group relative border border-l-2 border-base-border border-l-transparent bg-base-surface/40 p-6 transition-all duration-300 hover:border-l-[var(--accent)] hover:bg-base-surface/70 hover:shadow-[0_0_0_1px_var(--accent),0_0_24px_-6px_var(--accent)] sm:p-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <p className="font-mono text-xs text-text-dim">
                      {job.period}
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          job.status === 'active'
                            ? 'animate-pulse-slow bg-ok'
                            : 'bg-text-dim'
                        }`}
                      />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-dim">
                        {job.status}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-9">
                    <h3 className="text-xl font-semibold text-text-primary">
                      {job.role}
                    </h3>
                    <p
                      style={{ color: job.accentColor }}
                      className="mt-1 font-mono text-sm"
                    >
                      {job.org}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {job.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2 text-sm leading-relaxed text-text-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-dim" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-base-border px-2 py-1 font-mono text-[11px] text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
