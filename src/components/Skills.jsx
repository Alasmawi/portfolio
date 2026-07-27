import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import AwsIcon from './ui/AwsIcon';

const CLOUD_ITEMS = [
  { label: 'AWS Lambda', glyph: 'lambda' },
  { label: 'Amazon Bedrock', glyph: 'bedrock' },
  { label: 'API Gateway', glyph: 'gateway' },
  { label: 'DynamoDB', glyph: 'dynamodb' },
  { label: 'Cognito', glyph: 'cognito' },
  { label: 'AWS IoT Core', glyph: 'iot' },
  { label: 'CloudWatch', glyph: 'cloudwatch' },
  { label: 'SNS', glyph: 'sns' },
];

const GROUPS = [
  {
    name: 'Programming',
    accent: 'steel',
    items: ['Go', 'Python', 'Java', 'JavaScript', 'C++'],
  },
  {
    name: 'Web & Backend',
    accent: 'steel',
    items: ['React', 'HTML5', 'CSS3', 'REST APIs', 'WebSockets'],
  },
  {
    name: 'Databases & IoT',
    accent: 'amber',
    items: ['DynamoDB', 'SQLite', 'MySQL', 'ESP32', 'MQTT'],
  },
  {
    name: 'Tools',
    accent: 'steel',
    items: ['Git', 'GitHub', 'Linux', 'Docker', 'VS Code'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-b border-base-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          index="04"
          id="skills"
          title="Skills"
          region="~/stack"
        />

        <Reveal className="mb-5">
          <div className="border border-amber/25 bg-base-surface/50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-text-primary">
                Cloud &amp; AI
              </h3>
              <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CLOUD_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded border border-base-border bg-base-surface/60 px-2.5 py-2 transition-colors hover:border-amber/40"
                >
                  <AwsIcon glyph={item.glyph} />
                  <span className="font-mono text-[11px] leading-tight text-text-muted">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group, i) => (
            <Reveal key={group.name} delay={i * 0.06}>
              <div className="h-full border border-base-border bg-base-surface/40 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-mono text-xs uppercase tracking-wider text-text-primary">
                    {group.name}
                  </h3>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      group.accent === 'amber' ? 'bg-amber' : 'bg-steel'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-base-border bg-base-surface/60 px-2.5 py-1.5 font-mono text-xs text-text-muted transition-colors hover:border-text-dim hover:text-text-primary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
