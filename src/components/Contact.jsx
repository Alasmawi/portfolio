import { Mail, Phone } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import Reveal from './ui/Reveal';
import StatusBadge from './ui/StatusBadge';
import CodeSnippet from './ui/CodeSnippet';

const REACH_CODE = `# reach out
curl -X POST \\
  alasmawi.dev/contact \\
  -d '{"msg":"lets talk"}'`;

const LINKS = [
  {
    label: 'asmawiabdulla0@gmail.com',
    href: 'mailto:asmawiabdulla0@gmail.com',
    Icon: Mail,
  },
  {
    label: '+973 3671 1325',
    href: 'tel:+97336711325',
    Icon: Phone,
  },
  {
    label: 'github.com/Alasmawi',
    href: 'https://github.com/Alasmawi',
    Icon: GithubMark,
  },
  {
    label: 'linkedin.com/in/alasmawi',
    href: 'https://linkedin.com/in/alasmawi',
    Icon: LinkedinMark,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-7">
            <p className="mb-4 flex items-center gap-3">
              <span className="font-mono text-xs text-text-dim">// 06</span>
              <span className="rounded border border-base-border px-2 py-1 font-mono text-xs uppercase tracking-wider text-amber">
                [ CONTACT ]
              </span>
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary md:text-5xl">
              Let's build something.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text-muted">
              Looking for cloud, IoT, or backend roles, based in Manama or
              remote. Email or LinkedIn both work — I read everything myself.
            </p>
            <div className="mt-6">
              <StatusBadge />
            </div>
            <div className="mt-6 max-w-md">
              <CodeSnippet filename="contact.sh" code={REACH_CODE} />
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="border border-base-border bg-base-surface/40 p-5 md:col-span-5"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-wider text-text-dim">
              // reach me
            </p>
            <ul className="space-y-1">
              {LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="group flex items-center gap-3 rounded px-2 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <Icon
                      size={16}
                      className="shrink-0 text-steel transition-colors group-hover:text-amber"
                    />
                    <span className="font-mono text-sm text-text-muted transition-colors group-hover:text-text-primary">
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-base-border pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-text-dim">
            Abdulla Alasmawi — Manama, Bahrain
          </p>
          <p className="font-mono text-xs text-text-dim">
            built with react · vite · tailwind
          </p>
        </div>
      </div>
    </section>
  );
}
