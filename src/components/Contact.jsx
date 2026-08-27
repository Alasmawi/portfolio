import { Mail, Phone } from 'lucide-react';
import { GithubMark, LinkedinMark } from './ui/BrandIcons';
import Reveal from './ui/Reveal';

const EMAIL = 'asmawiabdulla0@gmail.com';

const LINKS = [
  { label: EMAIL, href: `mailto:${EMAIL}`, Icon: Mail },
  { label: '+973 3671 1325', href: 'tel:+97336711325', Icon: Phone },
  { label: 'github.com/Alasmawi', href: 'https://github.com/Alasmawi', Icon: GithubMark },
  { label: 'linkedin.com/in/alasmawi', href: 'https://linkedin.com/in/alasmawi', Icon: LinkedinMark },
];

// No backend exists for this static site — Send composes a mailto: draft
// with the form's contents instead of pretending to submit somewhere.
function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`Portfolio contact${name ? ` from ${name}` : ''}`);
  const body = encodeURIComponent(
    [message, '', email && `Reply to: ${email}`].filter(Boolean).join('\n')
  );
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
}

export default function Contact() {
  return (
    <section id="contact" className="bg-base-bg px-6 pb-10 pt-14 sm:px-10 md:px-14 md:pb-14 md:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-16">
          <Reveal>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dim">
              Contact
            </p>
            <h2 className="max-w-[20ch] text-3xl font-medium leading-[1.1] tracking-tight text-text-primary md:text-[38px]">
              Tell me what you are trying to measure.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[14.5px] leading-relaxed text-text-primary/66">
              I reply to most things within a day. If it involves sensors, a gateway, or AWS, send
              the constraint you are stuck on rather than the job title.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="grid gap-3.5 md:min-w-[340px]">
              <div className="field">
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" className="input" placeholder="Your name" />
              </div>
              <div className="field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="you@company.com"
                />
              </div>
              <div className="field">
                <label htmlFor="contact-message">What you are building</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input"
                  placeholder="A sentence is enough."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send
              </button>
            </form>
          </Reveal>
        </div>

        <div className="hr-fade my-8 md:my-10" />

        {/* A real landmark, so "jump to footer" works in a screen reader. */}
        <footer className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11.5px] text-text-dim">alasmawi.dev · Manama, Bahrain · UTC+3</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noreferrer' : undefined}
                // py-1.5 clears the 24px WCAG 2.2 target minimum; these sit in
                // a flex row, so they don't get the inline-text exemption.
                className="inline-flex min-h-6 items-center gap-2 py-1.5 font-mono text-[11.5px] text-text-muted transition-colors hover:text-accent-bright"
              >
                <Icon size={13} className="shrink-0" />
                {label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
